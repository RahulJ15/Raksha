"""Fine-tune a ResNet-18 on thermal (IR) images of an induction motor.

Data: "Thermal image of equipment (Induction Motor)", Najafi et al., Mendeley Data m4sbt8hbvk (CC BY 4.0),
DOI 10.1109/ICSPIS51611.2020.9349599. 369 images from a Dali-tech T4/T8 IR camera, 11 lab conditions,
extracted to data/external/thermal/<condition>/*.bmp.

Frames within a condition are consecutive shots of the same motor, so a random split would put
near-identical frames on both sides. The held-out set is instead the LAST 20% of frames of every
condition (--holdout block). --holdout severity additionally holds out every 30%-stator condition.

Usage:
    python train_thermal.py [--holdout block|severity] [--epochs 15]
"""

import argparse
import json
import random
import re
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.utils.config import CHECKPOINT_DIR, DATA_DIR, RANDOM_SEED  # noqa: E402

THERMAL_DIR = DATA_DIR / "external" / "thermal"
THERMAL_CLASSES = ["healthy", "stator_short_circuit", "cooling_fan_failure", "stuck_rotor"]
FOLDER_CLASS = {"Noload": "healthy", "Fan": "cooling_fan_failure", "Rotor-0": "stuck_rotor"}  # A* folders -> stator
THERMAL_MODEL_PATH = CHECKPOINT_DIR / "thermal_classifier.pt"
HOLDOUT_FRACTION = 0.2

NORMALIZE = transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
INFERENCE_TRANSFORM = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor(), NORMALIZE])
# Geometric augmentation only: the colour palette encodes temperature, so colours are left untouched.
TRAIN_TRANSFORM = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.75, 1.0), ratio=(1.2, 1.45)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(8),
    transforms.ToTensor(),
    NORMALIZE,
])


def folder_class(folder: str) -> str:
    return FOLDER_CLASS.get(folder, "stator_short_circuit")


def build_model(pretrained: bool = True) -> nn.Module:
    net = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None)
    net.fc = nn.Sequential(nn.Dropout(0.3), nn.Linear(net.fc.in_features, len(THERMAL_CLASSES)))
    return net


def load_thermal(path: Path = THERMAL_MODEL_PATH, device: str = "cpu") -> nn.Module:
    net = build_model(pretrained=False)
    net.load_state_dict(torch.load(path, map_location=device))
    return net.to(device).eval()


def split(holdout: str) -> tuple[list, list]:
    train, val = [], []
    for folder in sorted(p for p in THERMAL_DIR.iterdir() if p.is_dir()):
        label = THERMAL_CLASSES.index(folder_class(folder.name))
        frames = sorted(folder.glob("*.bmp"), key=lambda p: int(re.sub(r"\D", "", p.stem) or 0))
        if holdout == "severity" and folder.name.endswith("30"):
            val.extend((p, label) for p in frames)
            continue
        cut = int(round(len(frames) * (1 - HOLDOUT_FRACTION)))
        train.extend((p, label) for p in frames[:cut])
        val.extend((p, label) for p in frames[cut:])
    return train, val


class ThermalDataset(Dataset):
    def __init__(self, samples, transform):
        self.samples, self.transform = samples, transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, i):
        path, label = self.samples[i]
        return self.transform(Image.open(path).convert("RGB")), label


def evaluate(model, loader, device) -> dict:
    model.eval()
    n = len(THERMAL_CLASSES)
    conf = np.zeros((n, n), int)
    with torch.no_grad():
        for x, y in loader:
            pred = model(x.to(device)).argmax(1).cpu().numpy()
            for t, p in zip(y.numpy(), pred):
                conf[t, p] += 1
    fault = np.arange(n) != 0
    return {"accuracy": float(np.trace(conf) / conf.sum()),
            "per_class": {c: float(conf[i, i] / max(conf[i].sum(), 1)) for i, c in enumerate(THERMAL_CLASSES)},
            "fault_recall": float(conf[fault][:, fault].sum() / max(conf[fault].sum(), 1)),
            "false_alarm_rate": float(conf[0, 1:].sum() / max(conf[0].sum(), 1)),
            "confusion": conf.tolist()}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--holdout", choices=["block", "severity"], default="block")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--lr", type=float, default=2e-4)
    args = parser.parse_args()
    torch.manual_seed(RANDOM_SEED)
    random.seed(RANDOM_SEED)
    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"

    train, val = split(args.holdout)
    counts = np.bincount([l for _, l in train], minlength=len(THERMAL_CLASSES))
    print(f"train {len(train)}  val {len(val)}  " + " ".join(f"{c}={n}" for c, n in zip(THERMAL_CLASSES, counts)))
    train_loader = DataLoader(ThermalDataset(train, TRAIN_TRANSFORM), batch_size=16, shuffle=True)
    val_loader = DataLoader(ThermalDataset(val, INFERENCE_TRANSFORM), batch_size=32)

    model = build_model().to(device)
    weights = torch.tensor(counts.sum() / (len(counts) * np.maximum(counts, 1)), dtype=torch.float32, device=device)
    criterion = nn.CrossEntropyLoss(weight=weights)
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    suffix = "" if args.holdout == "block" else f"_{args.holdout}"
    path = THERMAL_MODEL_PATH.with_name(f"thermal_classifier{suffix}.pt")
    best = -1.0
    for epoch in range(1, args.epochs + 1):
        model.train()
        for x, y in train_loader:
            opt.zero_grad()
            loss = criterion(model(x.to(device)), y.to(device))
            loss.backward()
            opt.step()
        ev = evaluate(model, val_loader, device)
        # Small val set: select on balanced accuracy (mean per-class), not raw accuracy.
        score = float(np.mean(list(ev["per_class"].values())))
        print(f"epoch {epoch:02d}  loss={loss.item():.4f}  val_acc={ev['accuracy']:.3f}  balanced={score:.3f}", flush=True)
        if score > best:
            best = score
            path.parent.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), path)

    final = evaluate(load_thermal(path, device), val_loader, device)
    print(f"\nHeld-out ({args.holdout}): accuracy {final['accuracy']:.1%}, fault recall {final['fault_recall']:.1%}, "
          f"false alarms {final['false_alarm_rate']:.1%}")
    for c, a in final["per_class"].items():
        print(f"  {c:22} {a:.1%}")
    print("Confusion (rows = true):", final["confusion"])
    path.with_name(f"thermal_eval{suffix}.json").write_text(json.dumps(final, indent=2))


if __name__ == "__main__":
    main()
