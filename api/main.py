"""Infrasensor API: serves the live site snapshot and model inference to the React UI.

Run from the repo root:
    uvicorn api.main:app --reload --port 8000
"""

import base64
import io
import json
import threading
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import numpy as np
import pandas as pd
from PIL import Image, UnidentifiedImageError

from api.engine import Engine, assess_asset, live_results, per_type
from api.site import ASSETS
from wallsense.train_router import detect_image
from wallsense.preprocessing import fusion_features as ff
from api.verdict import VerdictUnavailable, gemini_verdict

app = FastAPI(title="Infrasensor API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_methods=["*"], allow_headers=["*"])

_engine: Engine | None = None
_lock = threading.Lock()


def engine() -> Engine:
    global _engine
    with _lock:
        if _engine is None:
            _engine = Engine()
        return _engine


@app.on_event("startup")
def _warm() -> None:
    engine()


@app.get("/api/health")
def health() -> dict:
    e = engine()
    return {"ok": True, "units": len(e.series), "models": {"anomaly": e.anomaly is not None, "sound": e.sound is not None, "bearing": True}}


@app.get("/api/site")
def site() -> dict:
    return engine().snapshot()


@app.get("/api/sensors/{sensor_id}")
def sensor(sensor_id: str) -> dict:
    for s in engine().snapshot()["sensors"]:
        if s["id"] == sensor_id:
            return s
    raise HTTPException(404, f"No sensor {sensor_id}")


def _counts(confusion: list) -> list:
    correct = sum(confusion[i][i] for i in range(len(confusion)))
    total = sum(map(sum, confusion))
    return [correct / total, correct, total]


def _eval(name: str) -> dict:
    path = Path(__file__).resolve().parent.parent / "wallsense" / "checkpoints" / name
    return json.loads(path.read_text()) if path.exists() else {}


@app.get("/api/models")
def model_cards() -> dict:
    """How reliable each model is, from the held-out and stress-test evaluations on disk."""
    sound, fusion = _eval("sound_classifier_eval.json"), _eval("fusion_eval.json")
    speed, severity = _eval("fusion_eval_speed.json"), _eval("fusion_eval_severity.json")
    setup = _eval("fusion_eval_setup.json")
    thermal, thermal_sev = _eval("thermal_eval.json"), _eval("thermal_eval_severity.json")
    crack = _eval("crack_eval.json")
    def rec(d: dict, m: str) -> list | None:
        """[accuracy, correct, total] at recording level for one fusion mode."""
        conf = d.get(m, {}).get("recording", {}).get("confusion")
        return None if conf is None else _counts(conf)

    def flat(d: dict) -> list | None:
        return None if "confusion" not in d else _counts(d["confusion"])

    cards = {
        "sound": {"data": "Real recordings: a motor test rig's microphone (MaFaulDa) and a water-network leak test base.",
                  "tests": [["Unseen clips", flat(sound)],
                            ["Microphone on a machine setup it never saw", rec(setup, "audio")],
                            ["Microphone at motor speeds it never heard", rec(speed, "audio")]],
                  "caveat": "One microphone is the weakest sensor: it struggles when the machine runs at a speed it hasn't heard."},
        "bearing": {"data": "Real vibration spectrograms from a bearing test rig.",
                    "tests": [["Unseen test groups", [0.794375, 3813, 4800]]],
                    "caveat": "About 1 in 5 scans is wrong, so treat a single result as a hint and confirm with another sensor."},
        "machine": {"data": "Real microphone + 6-axis vibration recordings of one motor test rig (MaFaulDa).",
                    "tests": [["Different setup it never saw (hardest test)", rec(setup, "fusion")],
                              ["Unseen recordings, same setup", rec(fusion, "fusion")],
                              ["Unseen motor speeds, same setup", rec(speed, "fusion")],
                              ["Unseen fault severities, same setup", rec(severity, "fusion")]],
                    "caveat": "Perfect on the rig it trained on, 94% when the setup changes (other bearing position, "
                              "other misalignment direction). Real building equipment is a bigger change than that, so "
                              "expect lower until it's calibrated on-site."},
        "thermal": {"data": "369 real infrared images of one 1.1 kW induction motor in a lab (Najafi et al., CC BY 4.0).",
                    "tests": [["Later frames it never saw", flat(thermal)],
                              ["Short-circuit severity it never saw", flat(thermal_sev)]],
                    "caveat": "One motor, one camera, one room. Different motors, paint, sunlight or camera palettes "
                              "will lower this until retrained on your equipment."},
    }
    cards["crack"] = {"data": "40,000 real photos of concrete surfaces from university campus buildings in Turkey "
                                "(Özgenel, METU; CC BY 4.0).",
                      "tests": [["Photos from a separate block it never saw", flat(crack)]],
                      "caveat": "Trained on close-up photos of plain concrete. Stains, joints, texture, paint or poor "
                                "lighting can fool it, and it can't tell a hairline crack from a structural one. "
                                "A structural engineer decides that."}
    return cards


@app.post("/api/reload")
def reload() -> dict:
    """Reload sensor data and model checkpoints from disk (e.g. after retraining)."""
    global _engine
    with _lock:
        _engine = Engine()
    return {"ok": True}


@app.post("/api/classify/{model}")
async def classify(model: str, file: UploadFile = File(...)) -> dict:
    """Classify an uploaded spectrogram with the `sound` or `bearing` model (or a capture with `machine`)."""
    if model == "machine":
        return await classify_machine(file)
    if model not in ("sound", "bearing", "thermal", "crack"):
        raise HTTPException(404, "model must be 'sound', 'bearing', 'thermal', 'crack' or 'machine'")
    try:
        image = Image.open(io.BytesIO(await file.read()))
    except UnidentifiedImageError:
        raise HTTPException(400, "Upload a spectrogram image (PNG/JPG)")
    try:
        return engine().classify(model, image)
    except RuntimeError as e:
        raise HTTPException(503, str(e))


def _read_capture(name: str, raw: bytes) -> np.ndarray:
    """Multichannel capture -> (8, samples) at 16 kHz. Accepts a MaFaulDa CSV (8 columns, 50 kHz) or our .npz."""
    if name.lower().endswith(".npz"):
        return np.load(io.BytesIO(raw))["signals"].astype(np.float32)
    data = pd.read_csv(io.BytesIO(raw), header=None).to_numpy(np.float32)
    if data.ndim != 2 or data.shape[1] != 8:
        raise HTTPException(400, "Expected a MaFaulDa-style CSV: 8 columns (tachometer, 6 accelerometer axes, microphone) at 50 kHz")
    return ff.signals_from_mafaulda_csv(data)


@app.post("/api/classify/machine")
async def classify_machine(file: UploadFile = File(...)) -> dict:
    """Combined microphone + vibration verdict for a multichannel machine capture."""
    signals = _read_capture(file.filename or "", await file.read())
    try:
        result = await run_in_threadpool(engine().classify_machine, signals)
    except (RuntimeError, ValueError) as e:
        raise HTTPException(503 if isinstance(e, RuntimeError) else 400, str(e))
    buf = io.BytesIO()
    engine().machine_preview(signals).save(buf, format="PNG")
    result["preview"] = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    return result


TYPE_HOW = {"machine": "8-channel sensor capture (microphone + vibration)", "sound": "Greyscale sound spectrogram",
            "bearing": "Colour vibration spectrogram", "thermal": "Infrared (thermal) image",
            "crack": "Photo of a concrete surface"}


@app.post("/api/scan")
async def scan(files: list[UploadFile] = File(...), types: str = Form("[]"), asset: str = Form("")) -> dict:
    """Upload one or more files from one asset. Each file's type is detected (or overridden via `types`, a JSON
    list aligned with `files`), the matching model runs, and several sensor types are combined per asset."""
    overrides = json.loads(types or "[]")
    items = []
    for i, f in enumerate(files):
        raw = await f.read()
        name = f.filename or f"file {i + 1}"
        forced = overrides[i] if i < len(overrides) else None
        item: dict = {"filename": name}
        try:
            if name.lower().endswith((".csv", ".npz")) and forced in (None, "machine"):
                item["type"] = "machine"
                item["detected"] = {"type": "machine", "confidence": 1.0, "how": TYPE_HOW["machine"], "auto": forced is None}
                signals = _read_capture(name, raw)
                item["result"] = await run_in_threadpool(engine().classify_machine, signals)
                buf = io.BytesIO()
                engine().machine_preview(signals).save(buf, format="PNG")
                item["result"]["preview"] = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
            else:
                image = Image.open(io.BytesIO(raw))
                det = detect_image(image, engine().router) if engine().router else {"type": None, "guess": None, "confidence": 0}
                kind = forced or det["type"]
                item["detected"] = {**det, "how": TYPE_HOW.get(det.get("guess"), ""), "auto": forced is None}
                if kind is None:
                    item["error"] = ("This doesn't look like a spectrogram or thermal image we know. "
                                     "Pick the type if you're sure.")
                else:
                    item["type"] = kind
                    item["result"] = engine().classify(kind, image)
        except UnidentifiedImageError:
            item["error"] = "Not an image or sensor capture (use PNG/JPG/BMP, or a CSV/NPZ capture)."
        except HTTPException as e:
            item["error"] = e.detail
        except (RuntimeError, ValueError) as e:
            item["error"] = str(e)
        items.append(item)
    # Link to a machine on site: its live sensors join the verdict as extra, independent sensor types.
    live = live_results(engine().snapshot(), ASSETS[asset]["sensors"]) if asset in ASSETS else []
    combined = per_type(items + live)
    return {"items": items, "live": live, "machine": ASSETS.get(asset, {}).get("name"),
            "asset": assess_asset(combined) if combined else None, "sensor_types": sorted(combined)}


@app.get("/api/assets")
def assets() -> list[dict]:
    """Machines a scan can be linked to, with their live sensors."""
    return [{"id": k, **v} for k, v in ASSETS.items()]


@app.post("/api/assess")
async def assess(machine: UploadFile | None = File(None), thermal: UploadFile | None = File(None)) -> dict:
    """One asset, several sensor types: sound+vibration capture and/or a thermal image -> combined action."""
    results = {}
    try:
        if machine is not None:
            signals = _read_capture(machine.filename or "", await machine.read())
            results["machine"] = await run_in_threadpool(engine().classify_machine, signals)
        if thermal is not None:
            results["thermal"] = engine().classify("thermal", Image.open(io.BytesIO(await thermal.read())))
    except UnidentifiedImageError:
        raise HTTPException(400, "Thermal file must be an image")
    except (RuntimeError, ValueError) as e:
        raise HTTPException(503 if isinstance(e, RuntimeError) else 400, str(e))
    if not results:
        raise HTTPException(400, "Upload a machine capture and/or a thermal image")
    return {"results": results, "asset": assess_asset(results)}


@app.post("/api/verdict/{model}")
async def verdict(model: str, file: UploadFile = File(...)) -> dict:
    """Classify an uploaded spectrogram, then have Gemini explain the result in plain language."""
    if model not in ("sound", "bearing", "machine", "thermal", "crack"):
        raise HTTPException(404, "model must be 'sound', 'bearing', 'machine', 'thermal' or 'crack'")
    raw = await file.read()
    try:
        if model == "machine":
            signals = _read_capture(file.filename or "", raw)
            result = await run_in_threadpool(engine().classify_machine, signals)
            image = engine().machine_preview(signals)
        else:
            image = Image.open(io.BytesIO(raw))
            result = engine().classify(model, image)
    except UnidentifiedImageError:
        raise HTTPException(400, "Upload a spectrogram image (PNG/JPG)")
    except (RuntimeError, ValueError) as e:
        raise HTTPException(503 if isinstance(e, RuntimeError) else 400, str(e))
    try:
        return await run_in_threadpool(gemini_verdict, model, image, result)
    except VerdictUnavailable as e:
        raise HTTPException(503, str(e))
    except Exception as e:  # network / quota / safety errors from Gemini
        raise HTTPException(502, f"AI explanation failed: {e}")


# Serve the built UI (web/dist) at / when present.
_dist = Path(__file__).resolve().parent.parent / "web" / "dist"
if _dist.exists():
    app.mount("/", StaticFiles(directory=_dist, html=True), name="ui")
