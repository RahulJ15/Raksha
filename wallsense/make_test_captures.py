"""Write raw multichannel test captures (original MaFaulDa CSV, 8 columns at 50 kHz) for held-out recordings.

One recording per machine class that the fusion model never trained on is re-fetched from MaFaulDa and
its first --seconds are written to test_scans/machine/<class>__heldout.csv, ready for the Machine tab.

Usage:
    python make_test_captures.py [--seconds 2]
"""

import argparse
import io
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.fetch_real_audio import MAFAULDA_CLASSES, MULTI_DIR, _safe, _zip  # noqa: E402
from wallsense.preprocessing.fusion_features import MACHINE_CLASSES  # noqa: E402
from wallsense.train_fusion import is_val  # noqa: E402

OUT_DIR = Path(__file__).resolve().parent.parent / "test_scans" / "machine"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--seconds", type=float, default=2.0)
    args = parser.parse_args()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for cls in MACHINE_CLASSES:
        held_out = sorted(f.stem for f in (MULTI_DIR / cls).glob("*.npz") if is_val(f.stem))
        if not held_out:
            print(f"{cls}: no held-out recording found")
            continue
        stem = held_out[len(held_out) // 2]
        for zip_name in MAFAULDA_CLASSES[cls]:
            member = next((m.filename for m in _zip(zip_name).infolist()
                           if m.filename.endswith(".csv") and f"mafaulda__{_safe(m.filename.removesuffix('.csv'))}" == stem), None)
            if member:
                break
        rows = int(50_000 * args.seconds)
        df = pd.read_csv(io.BytesIO(_zip(zip_name).read(member)), header=None, nrows=rows)
        out = OUT_DIR / f"{cls}__heldout.csv"
        df.to_csv(out, header=False, index=False)
        print(f"{out.name:34} <- {member} ({len(df)} rows, {out.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
