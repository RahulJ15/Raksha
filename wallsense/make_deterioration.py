"""Build the "how fast a bearing wears out" curve from NASA's real IMS run-to-failure data.

Data: IMS Bearing Data Set, Center for Intelligent Maintenance Systems, University of Cincinnati, via the
NASA Prognostics Data Repository (https://phm-datasets.s3.amazonaws.com/NASA/4.+Bearings.zip).
Test 2 ran four bearings continuously until bearing 1 failed (outer race); a 1-second vibration
snapshot was recorded every 10 minutes.

Output: web/src/infrasensor/deterioration.json, the vibration level (RMS, in g) of the failing bearing over
the test, plus when it first rose clearly above its own normal level (a stated rule, not a source figure).

Usage:
    python make_deterioration.py            # expects data/external/ims/IMS_bearings.zip (downloaded)
"""

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.utils.config import DATA_DIR  # noqa: E402

IMS = DATA_DIR / "external" / "ims"
OUT = Path(__file__).resolve().parent.parent / "web" / "src" / "infrasensor" / "deterioration.json"
RISE_FACTOR = 2.0  # "clearly above normal" = vibration at least 2x its own median over the first half of the test


def extract() -> Path:
    """Unpack the NASA zip -> IMS.7z -> test archives, returning the folder holding test 2's snapshot files."""
    if not (IMS / "IMS.7z").exists():
        subprocess.run(["bsdtar", "-xf", str(IMS / "IMS_bearings.zip"), "-C", str(IMS), "--strip-components", "1"], check=True)
    if not any(IMS.glob("*test*")):
        subprocess.run(["bsdtar", "-xf", str(IMS / "IMS.7z"), "-C", str(IMS)], check=True)
    for inner in list(IMS.glob("2nd_test*.rar")) + list(IMS.glob("2nd_test*.zip")) + list(IMS.glob("2nd_test*.7z")):
        subprocess.run(["bsdtar", "-xf", str(inner), "-C", str(IMS)], check=True)
    candidates = [p for p in IMS.rglob("*") if p.is_dir() and "2nd" in p.name.lower()]
    folder = max(candidates, key=lambda p: sum(1 for _ in p.iterdir()))
    return folder


def main() -> None:
    folder = extract()
    files = sorted(p for p in folder.iterdir() if p.is_file() and p.name[:4].isdigit())
    print(f"Test 2: {len(files)} snapshots in {folder}")
    times, rms, all_rms = [], [], []
    for f in files:
        data = np.loadtxt(f)  # columns = bearings 1..4
        times.append(datetime.strptime(f.name, "%Y.%m.%d.%H.%M.%S"))
        ch = np.sqrt(np.mean(data ** 2, axis=0))
        rms.append(float(ch[0]))
        all_rms.append(ch)
    # The last snapshots read ~0 on ALL four bearings: the rig had been shut down after the failure.
    # Keep only snapshots taken while the machine was running.
    running = [i for i, ch in enumerate(all_rms) if ch.max() > 0.02]
    last = running[-1]
    print(f"Dropping {len(rms) - 1 - last} snapshot(s) after the rig stopped (all bearings ~0 g)")
    times, rms = times[: last + 1], np.array(rms[: last + 1])
    hours = np.array([(t - times[0]).total_seconds() / 3600 for t in times])

    normal = float(np.median(rms[: len(rms) // 2]))
    above = np.where(rms >= RISE_FACTOR * normal)[0]
    # first point from which the level stays high (ignore single spikes): 5 consecutive snapshots above
    first_rise = next((int(i) for i in above if np.all(rms[i:i + 5] >= RISE_FACTOR * normal)), int(above[0]) if len(above) else None)

    step = max(1, len(rms) // 240)  # ~240 points is plenty for a small chart; keep the peak of each bin
    idx = [min(i + int(np.argmax(rms[i:i + step])), len(rms) - 1) for i in range(0, len(rms), step)]
    out = {
        "source": "IMS Bearing Data Set, University of Cincinnati, NASA Prognostics Data Repository: test 2, bearing 1",
        "start": times[0].isoformat(), "end": times[-1].isoformat(), "snapshots": len(rms),
        "unit": "vibration RMS (g)", "normal_rms": round(normal, 4), "rise_factor": RISE_FACTOR,
        "first_rise_hours": round(float(hours[first_rise]), 1) if first_rise is not None else None,
        "end_hours": round(float(hours[-1]), 1),
        "final_rms": round(float(rms[-1]), 4), "peak_rms": round(float(rms.max()), 4),
        "points": [[round(float(hours[i]), 2), round(float(rms[i]), 4)] for i in idx],
    }
    OUT.write_text(json.dumps(out))
    print(json.dumps({k: v for k, v in out.items() if k != "points"}, indent=2))
    print(f"{len(out['points'])} points -> {OUT}")


if __name__ == "__main__":
    main()
