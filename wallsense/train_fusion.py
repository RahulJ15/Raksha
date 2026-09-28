"""Train the audio+vibration fusion model, plus audio-only and vibration-only baselines on the same split.

Usage:
    python fetch_real_audio.py        # downloads data/raw_multichannel/<class>/*.npz
    python train_fusion.py [--modes fusion audio vibration] [--epochs 12]

Writes checkpoints/fusion_<mode>.pt and checkpoints/fusion_eval.json (per-class accuracy, window-level
and recording-level, for each mode) so the value of combining sensors can be compared directly.
"""

import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.models.fusion_classifier import FusionClassifier, save_fusion  # noqa: E402
from wallsense.preprocessing.fusion_features import MACHINE_CLASSES, features  # noqa: E402
from wallsense.utils.config import CHECKPOINT_DIR, DATA_DIR, RANDOM_SEED, SOUND_TRAIN_VAL_SPLIT  # noqa: E402

MULTI_DIR = DATA_DIR / "raw_multichannel"
CACHE_DIR = DATA_DIR / "features_fusion"
EVAL_PATH = CHECKPOINT_DIR / "fusion_eval.json"


def is_val(recording: str) -> bool:
    """Same hash split as train_sound.py, so a recording is held out for both models."""
    return int(hashlib.md5(recording.encode()).hexdigest(), 16) % 100 >= SOUND_TRAIN_VAL_SPLIT * 100


# Stress-test splits: hold out whole operating conditions instead of random recordings.
# Recording ids look like mafaulda__imbalance-20g-31.744 (last number = rotation speed in Hz).
HELD_OUT_SEVERITIES = ("imbalance-20g-", "horizontal-misalignment-1.0mm-", "vertical-misalignment-1.40mm-", "-20g-")


def _speed(recording: str) -> float:
    return float(re.search(r"-([0-9.]+)$", recording).group(1))


def make_split(holdout: str, recordings_by_class: dict[str, list[str]]):
    """Returns a predicate recording -> is_val for the chosen hold-out strategy."""
    if holdout == "random":
        return is_val
    if holdout == "speed":  # fastest 20% of each class never seen in training
        cut = {c: np.percentile([_speed(r) for r in rs], 80) for c, rs in recordings_by_class.items()}
        owner = {r: c for c, rs in recordings_by_class.items() for r in rs}
        return lambda r: _speed(r) >= cut[owner[r]]
    if holdout == "severity":  # one whole fault level per family; healthy uses the random split
        def pred(r):
            if "normal" in r:
                return is_val(r)
            bearing = "overhang" in r or "underhang" in r
            return (bearing and "-20g-" in r) or (not bearing and any(k in r for k in HELD_OUT_SEVERITIES[:3]))
        return pred
    if holdout == "setup":  # a different physical setup: bearing faults at the other bearing, misalignment in the
        # other direction, heavier imbalance weights than trained on; healthy uses the random split
        def pred(r):
            if "normal" in r:
                return is_val(r)
            if "imbalance" in r:
                return int(re.search(r"imbalance-(\d+)g", r).group(1)) >= 30
            return "underhang" in r or "vertical-misalignment" in r
        return pred
    raise ValueError(holdout)


def load_dataset(holdout: str = "random") -> tuple[dict, dict]:
    """Returns {'train'|'val': (X float16 [n,7,mels,frames], y, recording_idx)} and recording names."""
    parts = {"train": ([], [], []), "val": ([], [], [])}
    names: list[str] = []
    split = make_split(holdout, {c: [f.stem for f in (MULTI_DIR / c).glob("*.npz")] for c in MACHINE_CLASSES})
    for label, cls in enumerate(MACHINE_CLASSES):
        files = sorted((MULTI_DIR / cls).glob("*.npz"))
        for f in files:
            cache = CACHE_DIR / cls / (f.stem + ".npy")
            if cache.exists():
                feats = np.load(cache)
            else:
                signals = np.load(f)["signals"].astype(np.float32)
                feats = features(signals).astype(np.float16)
                cache.parent.mkdir(parents=True, exist_ok=True)
                np.save(cache, feats)
            X, y, r = parts["val" if split(f.stem) else "train"]
            X.append(feats)
            y.extend([label] * len(feats))
            r.extend([len(names)] * len(feats))
            names.append(f.stem)
        print(f"  {cls:18} {len(files)} recordings", flush=True)
    out = {k: (np.concatenate(X), np.array(y), np.array(r)) for k, (X, y, r) in parts.items()}
    return out, {"names": names}


def batches(X, y, idx, mean, std, device, batch_size, augment=False):
    for s in range(0, len(idx), batch_size):
        b = idx[s:s + batch_size]
        x = (torch.from_numpy(X[b].astype(np.float32)) - mean) / std
        if augment:
            x = torch.roll(x, shifts=int(np.random.randint(0, x.shape[-1])), dims=-1)  # time shift
            t0 = np.random.randint(0, x.shape[-1] - 16)
            x[..., t0:t0 + np.random.randint(0, 16)] = 0  # time mask
            f0 = np.random.randint(0, x.shape[-2] - 16)
            x[..., f0:f0 + np.random.randint(0, 16), :] = 0  # frequency mask
        yield x.to(device), torch.from_numpy(y[b]).to(device)


def evaluate(model, X, y, r, mean, std, device) -> dict:
    model.eval()
    probs = []
    with torch.no_grad():
        for x, _ in batches(X, y, np.arange(len(y)), mean, std, device, 128):
            probs.append(torch.softmax(model(x), 1).cpu().numpy())
    probs = np.concatenate(probs)
    n = len(MACHINE_CLASSES)

    def report(pred, true):
        conf = np.zeros((n, n), int)
        for t, p in zip(true, pred):
            conf[t, p] += 1
        fault = true != 0
        return {"accuracy": float((pred == true).mean()),
                "per_class": {c: float(conf[i, i] / max(conf[i].sum(), 1)) for i, c in enumerate(MACHINE_CLASSES)},
                "fault_recall": float((pred[fault] != 0).mean()), "false_alarm_rate": float((pred[~fault] != 0).mean()),
                "confusion": conf.tolist()}

    rec_ids = np.unique(r)
    rec_probs = np.stack([probs[r == i].mean(0) for i in rec_ids])
    rec_true = np.array([y[r == i][0] for i in rec_ids])
    return {"window": report(probs.argmax(1), y), "recording": report(rec_probs.argmax(1), rec_true),
            "val_loss": float(nn.functional.nll_loss(torch.log(torch.from_numpy(probs) + 1e-9), torch.from_numpy(y)).item())}


def train_mode(mode, data, mean, std, device, epochs, batch_size, lr, patience, suffix="") -> dict:
    Xtr, ytr, _ = data["train"]
    Xva, yva, rva = data["val"]
    torch.manual_seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)
    model = FusionClassifier(len(MACHINE_CLASSES), mode).to(device)
    counts = np.bincount(ytr, minlength=len(MACHINE_CLASSES))
    weights = torch.tensor(counts.sum() / (len(counts) * counts), dtype=torch.float32, device=device)
    criterion = nn.CrossEntropyLoss(weight=weights)
    opt = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    path = CHECKPOINT_DIR / f"fusion_{mode}{suffix}.pt"
    best, stale = float("inf"), 0
    for epoch in range(1, epochs + 1):
        t = time.time()
        model.train()
        idx = np.random.permutation(len(ytr))
        total = 0.0
        for x, yb in batches(Xtr, ytr, idx, mean, std, device, batch_size, augment=True):
            opt.zero_grad()
            loss = criterion(model(x), yb)
            loss.backward()
            opt.step()
            total += loss.item() * len(yb)
        ev = evaluate(model, Xva, yva, rva, mean, std, device)
        print(f"[{mode}] epoch {epoch:02d}  train_loss={total / len(ytr):.4f}  val_loss={ev['val_loss']:.4f}  "
              f"val_acc={ev['window']['accuracy']:.3f}  rec_acc={ev['recording']['accuracy']:.3f}  ({time.time() - t:.0f}s)", flush=True)
        if ev["val_loss"] < best:
            best, stale = ev["val_loss"], 0
            save_fusion(model, mean, std, MACHINE_CLASSES, path)
        else:
            stale += 1
            if stale >= patience:
                print(f"[{mode}] early stop", flush=True)
                break
    from wallsense.models.fusion_classifier import load_fusion
    best_model, _ = load_fusion(path, device)
    return evaluate(best_model, Xva, yva, rva, mean, std, device)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--modes", nargs="+", default=["audio", "vibration", "fusion"])
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=3e-4)
    parser.add_argument("--patience", type=int, default=3)
    parser.add_argument("--holdout", choices=["random", "speed", "severity", "setup"], default="random",
                        help="random = deployed models; speed/severity = stress tests (separate checkpoints)")
    args = parser.parse_args()
    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"

    print("Building features...", flush=True)
    data, meta = load_dataset(args.holdout)
    suffix = "" if args.holdout == "random" else f"_{args.holdout}"
    eval_path = EVAL_PATH.with_name(f"fusion_eval{suffix}.json")
    Xtr = data["train"][0]
    # Per-channel normalisation from training windows only.
    sample = Xtr[:: max(1, len(Xtr) // 800)].astype(np.float32)
    mean = torch.tensor(sample.mean(axis=(0, 2, 3)), dtype=torch.float32).view(1, -1, 1, 1)
    std = torch.tensor(sample.std(axis=(0, 2, 3)) + 1e-6, dtype=torch.float32).view(1, -1, 1, 1)
    for split in ("train", "val"):
        y, r = data[split][1], data[split][2]
        print(f"{split}: {len(y)} windows from {len(np.unique(r))} recordings "
              + " ".join(f"{c}={int((y == i).sum())}" for i, c in enumerate(MACHINE_CLASSES)), flush=True)

    results = json.loads(eval_path.read_text()) if eval_path.exists() else {}
    for mode in args.modes:
        results[mode] = train_mode(mode, data, mean, std, device, args.epochs, args.batch_size, args.lr, args.patience, suffix)
        eval_path.write_text(json.dumps(results, indent=2))

    print("\nHeld-out results (recordings never seen in training)")
    print(f"{'':12}" + "".join(f"{m:>22}" for m in results))
    for level in ("window", "recording"):
        print(f"{level} level")
        for key in ["accuracy", "fault_recall", "false_alarm_rate"]:
            print(f"  {key:18}" + "".join(f"{results[m][level][key]:>22.1%}" for m in results))
        for c in MACHINE_CLASSES:
            print(f"  {c:18}" + "".join(f"{results[m][level]['per_class'][c]:>22.1%}" for m in results))
    print(f"Saved to {eval_path}")


if __name__ == "__main__":
    main()
