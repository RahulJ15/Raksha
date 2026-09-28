"""Fine-tune the ResNet-18 sound classifier on Mel spectrogram images.

Usage:
    python fetch_real_audio.py      # real audio -> data/raw_audio/
    python make_spectrograms.py     # -> data/spectrograms/
    python train_sound.py

Expects ``data-dir`` laid out as ``<data-dir>/<class_name>/*.png`` where class
names match ``wallsense.utils.config.SOUND_CLASSES``.
"""

import argparse
import hashlib
import json
import random
import re
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.models.sound_classifier import (
    SoundClassifier,
    SpectrogramImageDataset,
    load_checkpoint,
    save_checkpoint,
)
from wallsense.utils.config import (
    RANDOM_SEED,
    SOUND_BATCH_SIZE,
    SOUND_CLASSES,
    SOUND_EARLY_STOPPING_PATIENCE,
    SOUND_EPOCHS,
    SOUND_LEARNING_RATE,
    SOUND_MODEL_PATH,
    SOUND_TRAIN_VAL_SPLIT,
    SPECTROGRAM_DIR,
)


def _recording_of(path: Path) -> str:
    """Segments are named <recording>__s<k>.png; leak clips of the same test condition share a recording id."""
    stem = path.stem.split("__s")[0] if "__s" in path.stem else path.stem
    return re.sub(r"(-\d+)+$", "", stem) if stem.startswith(("leak__", "noleak__", "envnoise__")) else stem


def _group_split(samples: list[tuple[Path, int]]) -> tuple[list, list]:
    """Split by recording, so segments of one recording never land in both train and val.

    A recording's side is fixed by a hash of its id, so adding more recordings later never moves
    an existing one between train and val (held-out test files stay held out).
    """
    train_samples, val_samples = [], []
    for sample in samples:
        bucket = int(hashlib.md5(_recording_of(sample[0]).encode()).hexdigest(), 16) % 100
        (val_samples if bucket >= SOUND_TRAIN_VAL_SPLIT * 100 else train_samples).append(sample)
    random.Random(RANDOM_SEED).shuffle(train_samples)
    return train_samples, val_samples


def _collect_samples(data_dir: Path) -> list[tuple[Path, int]]:
    class_to_idx = {name: idx for idx, name in enumerate(SOUND_CLASSES)}
    samples = []
    for class_name, idx in class_to_idx.items():
        class_dir = data_dir / class_name
        if not class_dir.exists():
            continue
        for path in class_dir.glob("*.png"):
            samples.append((path, idx))
    return samples


def train(data_dir: Path, epochs: int, batch_size: int, lr: float, device: str) -> None:
    """Run the fine-tuning loop with an 80/20 train/val split and early stopping.

    Args:
        data_dir: Directory of class-labeled spectrogram PNGs.
        epochs: Maximum number of epochs.
        batch_size: Training batch size.
        lr: Learning rate for the Adam optimizer.
        device: Torch device string ("cpu" or "cuda").
    """
    samples = _collect_samples(data_dir)
    if not samples:
        sys.exit(f"No spectrograms in {data_dir}. Run fetch_real_audio.py and make_spectrograms.py first.")

    train_samples, val_samples = _group_split(samples)
    print(f"Train samples: {len(train_samples)}  Val samples: {len(val_samples)}")
    counts = np.bincount([label for _, label in train_samples], minlength=len(SOUND_CLASSES))
    for name, n in zip(SOUND_CLASSES, counts):
        print(f"  {name:18} {n} train")
    # Inverse-frequency class weights so the large healthy class doesn't dominate.
    class_weights = torch.tensor(counts.sum() / (len(counts) * np.maximum(counts, 1)), dtype=torch.float32)

    train_loader = DataLoader(
        SpectrogramImageDataset(train_samples, train=True), batch_size=batch_size, shuffle=True
    )
    val_loader = DataLoader(SpectrogramImageDataset(val_samples, train=False), batch_size=batch_size)

    model = SoundClassifier().to(device)
    model.freeze_for_finetuning()

    optimizer = torch.optim.Adam(model.trainable_parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss(weight=class_weights.to(device))

    best_val_loss = float("inf")
    epochs_without_improvement = 0

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            logits = model(images)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * images.size(0)
        train_loss /= max(len(train_loader.dataset), 1)

        model.eval()
        val_loss, correct = 0.0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                logits = model(images)
                loss = criterion(logits, labels)
                val_loss += loss.item() * images.size(0)
                correct += (logits.argmax(dim=1) == labels).sum().item()
        val_loss /= max(len(val_loader.dataset), 1)
        val_acc = correct / max(len(val_loader.dataset), 1)

        print(f"Epoch {epoch:02d}/{epochs}  train_loss={train_loss:.4f}  val_loss={val_loss:.4f}  val_acc={val_acc:.3f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            epochs_without_improvement = 0
            save_checkpoint(model, SOUND_MODEL_PATH)
            print(f"  -> saved new best checkpoint to {SOUND_MODEL_PATH}")
        else:
            epochs_without_improvement += 1
            if epochs_without_improvement >= SOUND_EARLY_STOPPING_PATIENCE:
                print(f"Early stopping at epoch {epoch} (no improvement for {SOUND_EARLY_STOPPING_PATIENCE} epochs).")
                break

    _report(val_loader, device)


def _report(val_loader: DataLoader, device: str) -> None:
    """Per-class accuracy and confusion matrix of the best checkpoint on the held-out recordings."""
    model = load_checkpoint(SOUND_MODEL_PATH, device=device)
    n = len(SOUND_CLASSES)
    confusion = np.zeros((n, n), dtype=int)
    with torch.no_grad():
        for images, labels in val_loader:
            preds = model(images.to(device)).argmax(dim=1).cpu().numpy()
            for t, p in zip(labels.numpy(), preds):
                confusion[t, p] += 1
    per_class = {c: float(confusion[i, i] / max(confusion[i].sum(), 1)) for i, c in enumerate(SOUND_CLASSES)}
    accuracy = float(np.trace(confusion) / max(confusion.sum(), 1))
    print(f"\nHeld-out accuracy (unseen recordings): {accuracy:.3f}")
    for c, a in per_class.items():
        print(f"  {c:18} {a:.3f}")
    print("Confusion matrix (rows = true, cols = predicted):")
    print("  " + " ".join(f"{c[:8]:>8}" for c in SOUND_CLASSES))
    for c, row in zip(SOUND_CLASSES, confusion):
        print(f"  {' '.join(f'{v:8d}' for v in row)}   {c}")
    report = {"accuracy": accuracy, "per_class": per_class, "classes": SOUND_CLASSES, "confusion": confusion.tolist()}
    report_path = SOUND_MODEL_PATH.with_name("sound_classifier_eval.json")
    report_path.write_text(json.dumps(report, indent=2))
    print(f"Saved evaluation to {report_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the WallSense sound classifier.")
    parser.add_argument("--data-dir", type=Path, default=SPECTROGRAM_DIR)
    parser.add_argument("--epochs", type=int, default=SOUND_EPOCHS)
    parser.add_argument("--batch-size", type=int, default=SOUND_BATCH_SIZE)
    parser.add_argument("--lr", type=float, default=SOUND_LEARNING_RATE)
    parser.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    args = parser.parse_args()

    torch.manual_seed(RANDOM_SEED)
    train(args.data_dir, args.epochs, args.batch_size, args.lr, args.device)


if __name__ == "__main__":
    main()
