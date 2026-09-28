"""Snapshot real model results into web/public/demo/ for the static (Vercel) demo build.

Runs every sample in test_scans/ through the running API (the real trained models), saves the site
snapshot, model reliability cards, linkable machines, per-file scan results and the Gemini verdict for
each file. The static build replays these; the combining logic runs in the browser (src/demo/engine.js).

Usage (API running on :8000, Gemini key in .env):
    python web/scripts/build_demo_data.py
"""

import json
import shutil
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tests"))
from run_scan_checks import post  # noqa: E402  (multipart helper)

API = "http://localhost:8000"
SAMPLES = ROOT / "test_scans"
OUT = ROOT / "web" / "public" / "demo"
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".bmp"}


def get(path: str):
    with urllib.request.urlopen(API + path, timeout=120) as r:
        return json.loads(r.read())


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "files").mkdir(parents=True)
    for name in ("site", "models", "assets"):
        (OUT / f"{name}.json").write_text(json.dumps(get(f"/api/{name}")))

    samples = []
    for path in sorted(p for p in SAMPLES.glob("*/*") if not p.name.startswith(".")):
        raw = path.read_bytes()
        item = post("/api/scan", [("files", path.name, raw)])["items"][0]
        verdict = None
        if item.get("type"):
            try:
                verdict = post(f"/api/verdict/{item['type']}", [("file", path.name, raw)])
            except Exception as e:  # keep going without a verdict for this file
                verdict = {"error": f"Gemini unavailable when this demo was built ({e})"}
        thumb = None
        if path.suffix.lower() in IMAGE_EXT:
            thumb = f"files/{path.parent.name}__{path.name}"
            if path.suffix.lower() == ".bmp":
                from PIL import Image
                thumb = thumb.rsplit(".", 1)[0] + ".png"
                Image.open(path).save(OUT / thumb)
            else:
                shutil.copyfile(path, OUT / thumb)
        samples.append({"name": path.name, "folder": path.parent.name, "file": thumb, "item": item, "verdict": verdict})
        result = (item.get("result") or {}).get("name", item.get("error"))
        print(f"  {path.parent.name}/{path.name:44} -> {item.get('type')}: {result}  verdict={'yes' if verdict and 'headline' in verdict else 'no'}")
    (OUT / "samples.json").write_text(json.dumps(samples))
    size = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file()) / 1e6
    print(f"Wrote {len(samples)} samples to {OUT} ({size:.1f} MB)")


if __name__ == "__main__":
    main()
