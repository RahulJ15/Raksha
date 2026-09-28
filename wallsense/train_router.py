"""Train the image-type detector that routes an uploaded image to the right model.

Types: `sound` (greyscale mel spectrogram), `bearing` (colour-mapped vibration spectrogram from the
bearing rig), `thermal` (infrared photo of a motor) and `crack` (ordinary photo of a concrete surface). Uses simple colour/texture features and a
logistic regression, so it is fast and its mistakes are easy to reason about. Evaluation holds out
whole folders (recording conditions), not random images.

Usage:
    python train_router.py
"""

import hashlib
import json
import random
import re
import sys
from pathlib import Path

import joblib
import numpy as np
from PIL import Image
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.utils.config import CHECKPOINT_DIR, DATA_DIR, RANDOM_SEED, SPECTROGRAM_DIR  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BEARING_DIR = ROOT / "vibro-acoustic-bearing-fault-diagnosis" / "data" / "4_Spectrogram__accelerometer_datasets_21kHz_range"
THERMAL_DIR = DATA_DIR / "external" / "thermal"
CRACK_DIR = DATA_DIR / "external" / "crack"
ROUTER_PATH = CHECKPOINT_DIR / "image_router.joblib"
TYPES = ["sound", "bearing", "thermal", "crack"]
PER_TYPE = 450


def image_features(image: Image.Image) -> np.ndarray:
    """Colour + texture summary of an image (independent of its resolution)."""
    rgb = np.asarray(image.convert("RGB").resize((64, 64), Image.BILINEAR), dtype=np.float32) / 255.0
    hsv = np.asarray(image.convert("RGB").convert("HSV").resize((64, 64), Image.BILINEAR), dtype=np.float32) / 255.0
    grey = rgb.mean(axis=2)
    chroma = np.abs(rgb[..., 0] - rgb[..., 1]).mean() + np.abs(rgb[..., 1] - rgb[..., 2]).mean()
    sat_w = hsv[..., 1].ravel()
    hue_hist = np.histogram(hsv[..., 0].ravel(), bins=12, range=(0, 1), weights=sat_w)[0] / (sat_w.sum() + 1e-6)
    sat_hist = np.histogram(hsv[..., 1], bins=6, range=(0, 1))[0] / grey.size
    val_hist = np.histogram(hsv[..., 2], bins=6, range=(0, 1))[0] / grey.size
    gx, gy = np.abs(np.diff(grey, axis=1)).mean(), np.abs(np.diff(grey, axis=0)).mean()
    rows, cols = grey.std(axis=1).mean(), grey.std(axis=0).mean()  # spectrograms are banded along one axis
    # No image size/shape features: a different camera or crop must not change the detected type.
    return np.concatenate([[chroma, gx, gy, gx / (gy + 1e-6), rows, cols], hue_hist, sat_hist, val_hist])


def _group(path: Path) -> str:
    if path.suffix == ".jpg":  # crack tiles: blocks of 500 consecutive tiles ~ one source photo region
        number = int(re.match(r"\d+", path.stem).group())
        return f"{path.parent.name}-{number // 500}"
    return path.parent.name if not path.name.startswith(("mafaulda", "leak", "noleak", "envnoise")) else path.name.split("__s")[0]


def collect() -> list[tuple[Path, int]]:
    rng = random.Random(RANDOM_SEED)
    sound = sorted(SPECTROGRAM_DIR.glob("*/*.png"))
    bearing = sorted(BEARING_DIR.rglob("*.png"))
    thermal = sorted(THERMAL_DIR.glob("*/*.bmp"))
    crack = sorted(CRACK_DIR.glob("*/*.jpg"))
    out = []
    for label, files in enumerate([sound, bearing, thermal, crack]):
        rng.shuffle(files)
        out.extend((p, label) for p in files[:PER_TYPE])
    return out


def main() -> None:
    samples = collect()
    is_test = lambda p: int(hashlib.md5(_group(p).encode()).hexdigest(), 16) % 100 >= 75  # noqa: E731
    X = np.stack([image_features(Image.open(p)) for p, _ in samples])
    y = np.array([l for _, l in samples])
    test = np.array([is_test(p) for p, _ in samples])
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000, C=1.0))
    model.fit(X[~test], y[~test])
    probs = model.predict_proba(X[test])
    pred = probs.argmax(1)
    conf = np.zeros((len(TYPES), len(TYPES)), int)
    for t, p in zip(y[test], pred):
        conf[t, p] += 1
    acc = float((pred == y[test]).mean())
    print(f"Held-out folders: {test.sum()} images, accuracy {acc:.1%}, lowest confidence {probs.max(1).min():.3f}")
    for i, t in enumerate(TYPES):
        print(f"  {t:8} {conf[i].tolist()}")
    model.fit(X, y)  # final model on everything
    # Out-of-distribution guard: how far (mean |z| of features) an image is from its predicted type's examples.
    # Floor each feature's spread at 10% of its overall spread so near-constant features can't dominate.
    floor = 0.1 * X.std(0) + 1e-6
    stats = {i: (X[y == i].mean(0), np.maximum(X[y == i].std(0), floor)) for i in range(len(TYPES))}
    dist = [float(np.abs((x - stats[l][0]) / stats[l][1]).mean()) for x, l in zip(X, y)]
    limit = float(np.percentile(dist, 99.5) * 1.5)
    print(f"Unknown-image limit: mean |z| > {limit:.2f} (99.5th pct of real examples x1.5)")
    ROUTER_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "types": TYPES, "stats": stats, "limit": limit}, ROUTER_PATH)
    ROUTER_PATH.with_name("image_router_eval.json").write_text(json.dumps(
        {"accuracy": acc, "confusion": conf.tolist(), "types": TYPES, "test_images": int(test.sum())}, indent=2))
    print(f"Saved to {ROUTER_PATH}")


if __name__ == "__main__":
    main()


def detect_image(image: Image.Image, router: dict) -> dict:
    """{'type': sound|bearing|thermal|None, 'confidence', 'distance'}; type None means 'not a recognised image'."""
    x = image_features(image)
    probs = router["model"].predict_proba(x[None])[0]
    i = int(probs.argmax())
    mean, std = router["stats"][i]
    distance = float(np.abs((x - mean) / std).mean())
    known = distance <= router["limit"] and probs[i] >= 0.8
    return {"type": router["types"][i] if known else None, "guess": router["types"][i],
            "confidence": round(float(probs[i]), 3), "distance": round(distance, 2)}
