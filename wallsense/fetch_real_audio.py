"""Download real machine and pipe audio into data/raw_audio/<class>/*.wav.

Sources:
  - MaFaulDa (Machinery Fault Database, UFRJ): a motor/rotor rig recorded under normal, imbalance,
    misalignment and bearing-fault conditions. All 8 synchronized channels (tachometer, 2x 3-axis
    accelerometers, microphone) are kept in data/raw_multichannel/<class>/*.npz at 16 kHz for the
    audio+vibration fusion model; the microphone also goes to data/raw_audio/ at 8 kHz for the sound model. Only the needed recordings are pulled
    from the remote zips via HTTP range requests (~1.3 GB instead of ~13 GB).
    https://www02.smt.ufrj.br/~offshore/mfs/page_01.html
  - Zenodo 18631450 (CC-BY-4.0): 1 s hydrophone/noise-logger clips from a water-network leak test base
    (leak, no leak, environmental noise). Expected already extracted in data/external/leak/.

Usage:
    python fetch_real_audio.py [--per-class 49] [--workers 6]
"""

import argparse
import io
import re
import shutil
import sys
import threading
import zipfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import librosa
import numpy as np
import pandas as pd
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.utils.config import DATA_DIR, RAW_AUDIO_DIR, SAMPLE_RATE  # noqa: E402
from wallsense.utils.remote_zip import HttpRangeFile  # noqa: E402

MAFAULDA = "https://www02.smt.ufrj.br/~offshore/mfs/database/mafaulda/"
MAFAULDA_RATE = 50_000
MIC_COLUMN = 7  # tachometer, 3x underhang accel, 3x overhang accel, microphone
CHANNELS = ["tachometer", "underhang_axial", "underhang_radial", "underhang_tangential",
            "overhang_axial", "overhang_radial", "overhang_tangential", "microphone"]
MULTI_RATE = 16_000
MULTI_DIR = DATA_DIR / "raw_multichannel"

# wallsense class -> MaFaulDa zips whose sub-folders are sampled evenly.
MAFAULDA_CLASSES = {
    "healthy": ["normal"],
    "unbalanced_rotor": ["imbalance"],
    "misalignment": ["horizontal-misalignment", "vertical-misalignment"],
    "bearing_fault": ["overhang", "underhang"],
}
LEAK_DIR = DATA_DIR / "external" / "leak"
LEAK_FOLDERS = {"leak acoustic data": ("pipe_leak", "leak"), "no leak acoustic data": ("healthy", "noleak"),
                "environmental noise": ("healthy", "envnoise")}

_local = threading.local()


def _zip(name: str) -> zipfile.ZipFile:
    zips = getattr(_local, "zips", None)
    if zips is None:
        zips = _local.zips = {}
    if name not in zips:
        zips[name] = zipfile.ZipFile(HttpRangeFile(MAFAULDA + name + ".zip"))
    return zips[name]


def _pick(members: list[zipfile.ZipInfo], n: int) -> list[zipfile.ZipInfo]:
    """Evenly sample n recordings, spread across sub-folders (severity/load levels)."""
    by_dir: dict[str, list[zipfile.ZipInfo]] = {}
    for m in sorted(members, key=lambda m: m.filename):
        by_dir.setdefault(m.filename.rsplit("/", 1)[0], []).append(m)
    picked, dirs, i = [], list(by_dir.values()), 0
    while len(picked) < n and any(dirs):
        d = dirs[i % len(dirs)]
        if d:
            picked.append(d.pop(len(d) // 2))  # take from the middle, avoiding sequential neighbours
        i += 1
    return picked


def _safe(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9.]+", "-", name).strip("-")


def _fetch_one(zip_name: str, member: str, out: Path) -> str:
    raw = _zip(zip_name).read(member)
    data = pd.read_csv(io.BytesIO(raw), header=None).to_numpy(np.float32)  # (samples, 8)
    data = data - data.mean(axis=0)
    multi = librosa.resample(data.T, orig_sr=MAFAULDA_RATE, target_sr=MULTI_RATE)  # (8, samples)
    npz = MULTI_DIR / out.parent.name / (out.stem + ".npz")
    npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(npz, signals=multi.astype(np.float16), channels=np.array(CHANNELS), rate=MULTI_RATE)
    audio = librosa.resample(data[:, MIC_COLUMN], orig_sr=MAFAULDA_RATE, target_sr=SAMPLE_RATE)
    sf.write(out, audio, SAMPLE_RATE, subtype="FLOAT")
    return out.name


def fetch_mafaulda(per_class: int, workers: int) -> None:
    jobs = []
    for cls, zips in MAFAULDA_CLASSES.items():
        out_dir = RAW_AUDIO_DIR / cls
        out_dir.mkdir(parents=True, exist_ok=True)
        share = [per_class // len(zips) + (1 if i < per_class % len(zips) else 0) for i in range(len(zips))]
        for zip_name, n in zip(zips, share):
            members = [m for m in _zip(zip_name).infolist() if m.filename.endswith(".csv")]
            for m in _pick(members, n):
                out = out_dir / f"mafaulda__{_safe(m.filename.removesuffix('.csv'))}.wav"
                if not (out.exists() and (MULTI_DIR / cls / (out.stem + ".npz")).exists()):
                    jobs.append((zip_name, m.filename, out))
    print(f"MaFaulDa: {len(jobs)} recordings to download ({len(jobs) * 6.6 / 1000:.1f} GB compressed)", flush=True)
    with ThreadPoolExecutor(workers) as pool:
        futures = [pool.submit(_fetch_one, *j) for j in jobs]
        for i, f in enumerate(as_completed(futures), 1):
            try:
                name = f.result()
                print(f"  [{i}/{len(jobs)}] {name}", flush=True)
            except Exception as e:  # keep going; rerunning the script retries missing files
                print(f"  [{i}/{len(jobs)}] FAILED: {e}", flush=True)


def copy_leak_clips() -> None:
    if not LEAK_DIR.exists():
        sys.exit(f"Leak dataset not found at {LEAK_DIR}. Download Zenodo record 18631450 and extract it there.")
    for folder, (cls, prefix) in LEAK_FOLDERS.items():
        out_dir = RAW_AUDIO_DIR / cls
        out_dir.mkdir(parents=True, exist_ok=True)
        files = sorted((LEAK_DIR / folder).glob("*.wav"))
        for f in files:
            shutil.copyfile(f, out_dir / f"{prefix}__{_safe(f.stem)}.wav")
        print(f"Leak dataset: {len(files)} clips from '{folder}' -> {cls}/")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--per-class", type=int, default=49, help="MaFaulDa recordings per class (5 s each)")
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()
    copy_leak_clips()
    fetch_mafaulda(args.per_class, args.workers)
    for d in sorted(RAW_AUDIO_DIR.iterdir()):
        print(f"{d.name:18} {len(list(d.glob('*.wav')))} files")


if __name__ == "__main__":
    main()
