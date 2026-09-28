"""End-to-end checks against the running API: every file in test_scans/, file-type detection, combined
per-machine verdicts, machine-linked scans and rejection of non-sensor images.

The expected answer comes from each file name. Known model misses are listed in KNOWN_MISSES and
reported separately instead of hidden.

Usage (API running on :8000):
    python tests/run_scan_checks.py
"""

import io
import json
import sys
import urllib.request
import uuid
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

API = "http://localhost:8000"
ROOT = Path(__file__).resolve().parent.parent / "test_scans"
BEARING_NAMES = {"ball": "ball fault", "cage": "cage fault", "healthy": "healthy",
                 "inner_race": "inner race fault", "outer_race": "outer race fault"}
KNOWN_MISSES = {"bearing/healthy_1.png": "bearing model calls it a ball fault (documented, ~79% model)"}


def post(path: str, files: list[tuple[str, str, bytes]], fields: dict | None = None) -> dict:
    boundary = uuid.uuid4().hex
    body = io.BytesIO()
    for name, value in (fields or {}).items():
        body.write(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
    for field, filename, data in files:
        body.write(f'--{boundary}\r\nContent-Disposition: form-data; name="{field}"; filename="{filename}"\r\n'
                   f"Content-Type: application/octet-stream\r\n\r\n".encode())
        body.write(data + b"\r\n")
    body.write(f"--{boundary}--\r\n".encode())
    req = urllib.request.Request(API + path, data=body.getvalue(), method="POST",
                                 headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read())


def scan(paths: list[str], asset: str = "") -> dict:
    return post("/api/scan", [("files", Path(p).name, (ROOT / p).read_bytes()) for p in paths], {"asset": asset})


def expected(rel: str) -> tuple[str, str]:
    folder, name = rel.split("/")
    stem = Path(name).stem
    if folder == "bearing":
        return "bearing", BEARING_NAMES[stem.rsplit("_", 1)[0]]
    return folder, stem.split("__")[0].replace("_", " ")


results = {"pass": 0, "fail": 0, "known": 0}


def check(ok: bool, label: str, detail: str, known: str | None = None) -> None:
    if ok:
        results["pass"] += 1
        print(f"  PASS  {label:48} {detail}")
    elif known:
        results["known"] += 1
        print(f"  KNOWN {label:48} {detail}  [{known}]")
    else:
        results["fail"] += 1
        print(f"  FAIL  {label:48} {detail}")


def main() -> None:
    try:
        urllib.request.urlopen(API + "/api/health", timeout=10)
    except OSError:
        sys.exit(f"API not reachable at {API}. Start it with: uvicorn api.main:app --port 8000")

    print("1) Every test file on its own (auto-detected)")
    for p in sorted(ROOT.glob("*/*")):
        if p.name.startswith("."):
            continue
        rel = f"{p.parent.name}/{p.name}"
        want_type, want = expected(rel)
        item = scan([rel])["items"][0]
        got_type = item.get("type")
        got = (item.get("result") or {}).get("name", item.get("error", "?"))
        conf = (item.get("result") or {}).get("confidence", 0)
        ok = got_type == want_type and got == want
        check(ok, rel, f"type={got_type} -> {got} ({conf:.0%})" + ("" if ok else f", expected {want_type} -> {want}"),
              KNOWN_MISSES.get(rel))

    print("\n2) Several files from one machine -> combined verdict")
    combos = [
        (["machine/bearing_fault__heldout.csv", "thermal/stator_short_circuit__heldout.png"], "", "confirmed"),
        (["machine/bearing_fault__heldout.csv", "thermal/healthy__heldout.png"], "", "inspect"),
        (["machine/healthy__heldout.csv", "thermal/healthy__heldout.png"], "", "healthy"),
        (["sound/healthy__motor.png", "bearing/healthy_3.png", "thermal/healthy__heldout.png"], "", "healthy"),
        (["sound/pipe_leak__heldout.png", "sound/healthy__pipe-no-leak.png"], "", "inspect"),  # same type = one sensor
    ]
    for paths, asset, want in combos:
        got = scan(paths, asset)["asset"]["decision"]
        check(got == want, " + ".join(Path(p).stem for p in paths)[:48], f"{got}" + ("" if got == want else f", expected {want}"))

    print("\n3) Uploads linked to a machine's or structure's live sensors")
    linked = [
        ("thermal/stator_short_circuit__heldout.png", "RTU-2", "confirmed"),
        ("thermal/healthy__heldout.png", "RTU-2", "inspect"),
        ("thermal/healthy__heldout.png", "Elevator 1", "monitor"),
        ("thermal/healthy__heldout.png", "Pump P-2", "healthy"),
        ("thermal/stator_short_circuit__heldout.png", "RTU-1", "inspect"),
        # structural: crack photos against the strain / crack gauges on piers and the parapet
        ("crack/crack__heldout.jpg", "Pier P2", "confirmed"),
        ("crack/no_crack__heldout.jpg", "Pier P2", "monitor"),
        ("crack/crack__heldout.jpg", "Parapet S", "confirmed"),
        ("crack/no_crack__heldout.jpg", "Pier P1", "healthy"),
    ]
    for path, asset, want in linked:
        d = scan([path], asset)
        live = ", ".join(f"{l['sensor']} {l['result']['name']}" for l in d["live"])
        got = d["asset"]["decision"]
        check(got == want, f"{Path(path).stem} @ {asset}", f"{got} (live: {live})" + ("" if got == want else f", expected {want}"))

    print("\n4) Non-sensor images must be rejected, not diagnosed")
    rng = np.random.default_rng(0)
    photo = Image.new("RGB", (640, 480), (235, 225, 205))
    draw = ImageDraw.Draw(photo)
    for _ in range(25):
        x, y = rng.integers(0, 600, 2)
        draw.rectangle([int(x), int(y), int(x) + int(rng.integers(20, 160)), int(y) + int(rng.integers(20, 120))],
                       fill=tuple(int(c) for c in rng.integers(0, 255, 3)))
    draw.text((20, 20), "Building inspection checklist", fill=(20, 20, 20))
    buf = io.BytesIO()
    photo.save(buf, format="PNG")
    item = post("/api/scan", [("files", "random_photo.png", buf.getvalue())])["items"][0]
    check(item.get("result") is None and "error" in item, "made-up photo with shapes and text",
          item.get("error", f"diagnosed as {item.get('type')} -> {(item.get('result') or {}).get('name')}"))

    print(f"\n{results['pass']} passed, {results['fail']} failed, {results['known']} known model misses")
    sys.exit(1 if results["fail"] else 0)


if __name__ == "__main__":
    main()
