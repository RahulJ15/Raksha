"""Fine-tune a ResNet-18 to spot cracks in photos of concrete.

Data: "Concrete Crack Images for Classification", Ç.F. Özgenel, METU (Mendeley Data 5y9wdsg2zt v2, CC BY 4.0).
40,000 227x227 tiles (20k cracked, 20k not) cut from 458 photos of METU campus buildings, extracted to
data/external/crack/{Positive,Negative}/.

Consecutive tiles come from the same photo, so a random split would leak near-identical tiles into the
test set. The held-out set is the LAST 20% of tiles of each class (one untouched block).

Whole-wall photos are checked tile by tile (``predict_photo``), and cracked tiles are marked on the photo.

Usage:
    python train_crack.py [--epochs 3] [--per-class 8000]
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
from PIL import Image, ImageDraw
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.utils.config import CHECKPOINT_DIR, DATA_DIR, RANDOM_SEED  # noqa: E402

CRACK_DIR = DATA_DIR / "external" / "crack"
CRACK_CLASSES = ["no_crack", "crack"]
CRACK_MODEL_PATH = CHECKPOINT_DIR / "crack_classifier.pt"
HOLDOUT_FRACTION = 0.2
TILE_THRESHOLD = 0.8  # a tile counts as cracked above this probability

NORMALIZE = transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
INFERENCE_TRANSFORM = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor(), NORMALIZE])
TRAIN_TRANSFORM = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.15),  # lighting varies on site
    transforms.ToTensor(),
    NORMALIZE,
])


def _key(p: Path):
    return int(re.match(r"\d+", p.stem).group()), p.stem


def build_model(pretrained: bool = True) -> nn.Module:
    net = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None)
    net.fc = nn.Sequential(nn.Dropout(0.3), nn.Linear(net.fc.in_features, len(CRACK_CLASSES)))
    return net


def load_crack(path: Path = CRACK_MODEL_PATH, device: str = "cpu") -> nn.Module:
    net = build_model(pretrained=False)
    net.load_state_dict(torch.load(path, map_location=device))
    return net.to(device).eval()


def split(per_class: int) -> tuple[list, list]:
    rng = random.Random(RANDOM_SEED)
    train, val = [], []
    for label, folder in enumerate(["Negative", "Positive"]):
        files = sorted((CRACK_DIR / folder).glob("*.jpg"), key=_key)
        cut = int(len(files) * (1 - HOLDOUT_FRACTION))
        pool = files[:cut]
        rng.shuffle(pool)
        train.extend((p, label) for p in pool[:per_class])
        val.extend((p, label) for p in files[cut:])
    rng.shuffle(train)
    return train, val


class CrackDataset(Dataset):
    def __init__(self, samples, transform):
        self.samples, self.transform = samples, transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, i):
        path, label = self.samples[i]
        return self.transform(Image.open(path).convert("RGB")), label


@torch.no_grad()
def predict_photo(model: nn.Module, image: Image.Image, device: str) -> dict:
    """Close-ups are classified whole; larger photos are cut into a grid of tiles (like the training data)."""
    image = image.convert("RGB")
    w, h = image.size
    if max(w, h) <= 400:
        tiles = [((0, 0, w, h), image)]
    else:
        size = max(227, min(w, h) // 4)
        tiles = [((x, y, x + size, y + size), image.crop((x, y, x + size, y + size)))
                 for y in range(0, h - size + 1, size) for x in range(0, w - size + 1, size)]
    batch = torch.stack([INFERENCE_TRANSFORM(t) for _, t in tiles]).to(device)
    p_crack = torch.softmax(model(batch), 1)[:, 1].cpu().numpy()
    cracked = [box for (box, _), p in zip(tiles, p_crack) if p >= TILE_THRESHOLD]
    top = float(p_crack.max())
    overlay = image.copy()
    draw = ImageDraw.Draw(overlay)
    for box in cracked:
        draw.rectangle(box, outline=(220, 40, 40), width=max(3, w // 150))
    return {"crack": bool(cracked), "confidence": top if cracked else 1 - top, "p_crack": top,
            "tiles": len(tiles), "cracked_tiles": len(cracked), "overlay": overlay}


def evaluate(model, loader, device) -> dict:
    model.eval()
    conf = np.zeros((2, 2), int)
    with torch.no_grad():
        for x, y in loader:
            pred = model(x.to(device)).argmax(1).cpu().numpy()
            for t, p in zip(y.numpy(), pred):
                conf[t, p] += 1
    return {"accuracy": float(np.trace(conf) / conf.sum()),
            "per_class": {c: float(conf[i, i] / conf[i].sum()) for i, c in enumerate(CRACK_CLASSES)},
            "fault_recall": float(conf[1, 1] / conf[1].sum()), "false_alarm_rate": float(conf[0, 1] / conf[0].sum()),
            "confusion": conf.tolist()}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--per-class", type=int, default=8000, help="training tiles per class (of 16,000 available)")
    parser.add_argument("--lr", type=float, default=2e-4)
    args = parser.parse_args()
    torch.manual_seed(RANDOM_SEED)
    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"

    train, val = split(args.per_class)
    print(f"train {len(train)} tiles, held-out {len(val)} tiles", flush=True)
    train_loader = DataLoader(CrackDataset(train, TRAIN_TRANSFORM), batch_size=64, shuffle=True, num_workers=4)
    val_loader = DataLoader(CrackDataset(val, INFERENCE_TRANSFORM), batch_size=128, num_workers=4)

    model = build_model().to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    criterion = nn.CrossEntropyLoss()
    best = -1.0
    for epoch in range(1, args.epochs + 1):
        model.train()
        for i, (x, y) in enumerate(train_loader):
            opt.zero_grad()
            loss = criterion(model(x.to(device)), y.to(device))
            loss.backward()
            opt.step()
        ev = evaluate(model, val_loader, device)
        print(f"epoch {epoch}  loss={loss.item():.4f}  held-out acc={ev['accuracy']:.4f}  "
              f"missed cracks={1 - ev['fault_recall']:.2%}  false alarms={ev['false_alarm_rate']:.2%}", flush=True)
        if ev["accuracy"] > best:
            best = ev["accuracy"]
            CRACK_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), CRACK_MODEL_PATH)

    final = evaluate(load_crack(CRACK_MODEL_PATH, device), val_loader, device)
    print(f"\nHeld-out block: {final['confusion'][0][0] + final['confusion'][1][1]} of {len(val)} right "
          f"({final['accuracy']:.2%}); cracks caught {final['fault_recall']:.2%}; false alarms {final['false_alarm_rate']:.2%}")
    CRACK_MODEL_PATH.with_name("crack_eval.json").write_text(json.dumps(final, indent=2))


if __name__ == "__main__":
    main()
