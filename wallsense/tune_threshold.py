"""Pick a fault-sensitive decision threshold for the sound classifier on held-out recordings.

The classifier's argmax treats a 51%-healthy clip as healthy. For early warning we would rather flag it:
a clip is flagged as a fault whenever P(healthy) < threshold. This script sweeps the threshold on the
validation recordings (same split as train_sound.py) and picks the lowest false-alarm rate that still
catches at least --target-recall of faulty clips.

Usage:
    python tune_threshold.py [--target-recall 0.95]
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch
from torch.utils.data import DataLoader

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.models.sound_classifier import SpectrogramImageDataset, load_checkpoint  # noqa: E402
from wallsense.train_sound import _collect_samples, _group_split  # noqa: E402
from wallsense.utils.config import SOUND_CLASSES, SOUND_MODEL_PATH, SPECTROGRAM_DIR  # noqa: E402

THRESHOLD_PATH = SOUND_MODEL_PATH.with_name("sound_threshold.json")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--target-recall", type=float, default=0.95)
    args = parser.parse_args()

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = load_checkpoint(SOUND_MODEL_PATH, device=device)
    _, val = _group_split(_collect_samples(SPECTROGRAM_DIR))
    loader = DataLoader(SpectrogramImageDataset(val, train=False), batch_size=64)

    probs, labels = [], []
    with torch.no_grad():
        for images, y in loader:
            probs.append(torch.softmax(model(images.to(device)), dim=1).cpu().numpy())
            labels.append(y.numpy())
    probs, labels = np.concatenate(probs), np.concatenate(labels)
    healthy = SOUND_CLASSES.index("healthy")
    p_healthy = probs[:, healthy]
    is_fault = labels != healthy

    print(f"Held-out clips: {is_fault.sum()} faulty, {(~is_fault).sum()} healthy\n")
    print(" threshold  fault recall  false alarms  per-class recall")
    rows = []
    for t in np.round(np.arange(0.50, 1.0, 0.025), 3):
        flagged = p_healthy < t
        recall = flagged[is_fault].mean()
        false_alarm = flagged[~is_fault].mean()
        per = {c: float(flagged[labels == i].mean()) for i, c in enumerate(SOUND_CLASSES) if i != healthy}
        rows.append((float(t), float(recall), float(false_alarm), per))
        print(f"   {t:5.3f}      {recall:6.1%}       {false_alarm:6.1%}     "
              + "  ".join(f"{c.split('_')[0][:7]} {r:.0%}" for c, r in per.items()))

    meeting = [r for r in rows if r[1] >= args.target_recall]
    t, recall, far, per = min(meeting, key=lambda r: (r[2], r[0])) if meeting else max(rows, key=lambda r: r[1])
    argmax_recall = float((probs.argmax(1) != healthy)[is_fault].mean())
    argmax_far = float((probs.argmax(1) != healthy)[~is_fault].mean())
    print(f"\nDefault (argmax):   fault recall {argmax_recall:.1%}, false alarms {argmax_far:.1%}")
    print(f"Chosen threshold {t}: fault recall {recall:.1%}, false alarms {far:.1%}")
    THRESHOLD_PATH.write_text(json.dumps({
        "healthy_threshold": t, "target_recall": args.target_recall, "fault_recall": recall, "false_alarm_rate": far,
        "per_class_recall": per, "argmax": {"fault_recall": argmax_recall, "false_alarm_rate": argmax_far},
    }, indent=2))
    print(f"Saved to {THRESHOLD_PATH}")


if __name__ == "__main__":
    main()
