"""Builds the live site snapshot from wallsense sensor data and the trained models."""

import base64
import importlib.util
import io
import joblib
import json
import sys
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
import torch
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from api.site import ISSUES, KIND_BINDING, KINDS, LEVELS, SENSORS, SITE  # noqa: E402
from wallsense.models.anomaly_detector import IsolationForestDetector  # noqa: E402
from wallsense.models.fusion_classifier import load_fusion  # noqa: E402
from wallsense.models.sound_classifier import load_checkpoint, predict as sound_predict  # noqa: E402
from wallsense.preprocessing import fusion_features as ff  # noqa: E402
from wallsense.train_crack import CRACK_MODEL_PATH, load_crack, predict_photo  # noqa: E402
from wallsense.train_router import ROUTER_PATH, detect_image  # noqa: E402
from wallsense.train_thermal import INFERENCE_TRANSFORM as THERMAL_TRANSFORM, THERMAL_CLASSES, THERMAL_MODEL_PATH, load_thermal  # noqa: E402
from wallsense.preprocessing.sensor_features import clean_sensor_data, make_windows, windows_to_feature_matrix  # noqa: E402
from wallsense.utils.config import ANOMALY_MODEL_PATH, CHECKPOINT_DIR, SOUND_MODEL_PATH  # noqa: E402
from wallsense.utils.data_loader import load_demo_data  # noqa: E402

TREND_POINTS = 12
TREND_HOURS = 12
SMOOTH_HOURS = 6  # readings are averaged over this many hourly samples to damp noise

DEVICE = torch.device("mps" if torch.backends.mps.is_available() else "cpu")


def _load_bearing_module():
    path = ROOT / "vibro-acoustic-bearing-fault-diagnosis" / "predict.py"
    spec = importlib.util.spec_from_file_location("bearing_predict", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _status(value: float, kind: dict) -> str:
    if kind["up"]:
        return "crit" if value >= kind["c"] else "watch" if value >= kind["w"] else "ok"
    return "crit" if value <= kind["c"] else "watch" if value <= kind["w"] else "ok"


def _fmt_age(minutes: int) -> str:
    if minutes < 60:
        return f"{max(1, minutes)} min"
    if minutes < 1440:
        return f"{minutes // 60} h"
    return f"{minutes // 1440} d"


class Engine:
    """Loads data and models once; ``snapshot()`` returns the payload served at /api/site."""

    def __init__(self) -> None:
        _, self.series, _ = load_demo_data()
        self.series = {uid: clean_sensor_data(df) for uid, df in self.series.items()}

        self.anomaly = IsolationForestDetector.load(ANOMALY_MODEL_PATH) if ANOMALY_MODEL_PATH.exists() else None
        self.sound = load_checkpoint(SOUND_MODEL_PATH, device=str(DEVICE)) if SOUND_MODEL_PATH.exists() else None
        # Fault-sensitive threshold from wallsense/tune_threshold.py: flag a fault whenever P(healthy) is below it.
        threshold_path = SOUND_MODEL_PATH.with_name("sound_threshold.json")
        self.healthy_threshold = json.loads(threshold_path.read_text())["healthy_threshold"] if threshold_path.exists() else 0.5
        self.bearing_mod = _load_bearing_module()
        self.bearing, self.bearing_classes = self.bearing_mod.load_model(DEVICE)
        self.router = joblib.load(ROUTER_PATH) if ROUTER_PATH.exists() else None
        self.crack = load_crack(CRACK_MODEL_PATH, str(DEVICE)) if CRACK_MODEL_PATH.exists() else None
        self.thermal = load_thermal(THERMAL_MODEL_PATH, str(DEVICE)) if THERMAL_MODEL_PATH.exists() else None
        # Audio+vibration machine models (wallsense/train_fusion.py): combined, mic-only, vibration-only.
        self.machine = {m: load_fusion(CHECKPOINT_DIR / f"fusion_{m}.pt", str(DEVICE))
                        for m in ("fusion", "audio", "vibration") if (CHECKPOINT_DIR / f"fusion_{m}.pt").exists()}

        self.unit_anomaly = self._score_units()
        self._model_cache: dict[str, dict] = {}

    # --- models ---------------------------------------------------------------

    def _score_units(self) -> dict[str, dict]:
        """Isolation Forest score of each unit's most recent window."""
        if self.anomaly is None:
            return {}
        out = {}
        for uid, df in self.series.items():
            windows = make_windows(df)
            if not windows:
                continue
            result = self.anomaly.score(windows_to_feature_matrix(windows[-1:]))[0]
            out[uid] = {"score": round(result.normalized_score, 3), "severity": result.severity, "anomaly": result.is_anomaly}
        return out

    @torch.no_grad()
    def classify(self, model: str, image: Image.Image) -> dict:
        """Run the sound or bearing classifier on a spectrogram image."""
        if model == "sound":
            if self.sound is None:
                raise RuntimeError("Sound classifier not trained. Run wallsense/train_sound.py.")
            p = sound_predict(self.sound, image, device=str(DEVICE))
            probs = p.class_probabilities
            label, early = p.predicted_class, False
            if label == "healthy" and probs["healthy"] < self.healthy_threshold:
                # Leaning healthy but not confidently: report the most likely fault as an early warning.
                label = max((c for c in probs if c != "healthy"), key=probs.get)
                early = True
            return {"model": "sound", "label": label, "name": label.replace("_", " "),
                    "confidence": round(probs[label], 3), "fault": label != "healthy", "early_warning": early,
                    "threshold": self.healthy_threshold, "probs": {k: round(v, 3) for k, v in probs.items()}}
        if model == "bearing":
            x = self.bearing_mod.TRANSFORM(image.convert("RGB")).unsqueeze(0).to(DEVICE)
            probs = torch.softmax(self.bearing(x), dim=1).squeeze(0).cpu()
            idx = int(probs.argmax())
            label = self.bearing_classes[idx]
            return {"model": "bearing", "label": label, "name": self.bearing_mod.FULL_NAMES[label].lower(),
                    "confidence": round(float(probs[idx]), 3), "fault": label != "H",
                    "probs": {self.bearing_mod.FULL_NAMES[c]: round(float(p), 3) for c, p in zip(self.bearing_classes, probs)}}
        if model == "thermal":
            if self.thermal is None:
                raise RuntimeError("Thermal model not trained. Run wallsense/train_thermal.py.")
            x = THERMAL_TRANSFORM(image.convert("RGB")).unsqueeze(0).to(DEVICE)
            probs = torch.softmax(self.thermal(x), dim=1).squeeze(0).cpu().numpy()
            idx = int(probs.argmax())
            label = THERMAL_CLASSES[idx]
            return {"model": "thermal", "label": label, "name": label.replace("_", " "), "confidence": round(float(probs[idx]), 3),
                    "fault": label != "healthy", "probs": {c: round(float(p), 3) for c, p in zip(THERMAL_CLASSES, probs)}}
        if model == "crack":
            if self.crack is None:
                raise RuntimeError("Crack model not trained. Run wallsense/train_crack.py.")
            r = predict_photo(self.crack, image, str(DEVICE))
            buf = io.BytesIO()
            overlay = r["overlay"]
            overlay.thumbnail((640, 640))
            overlay.save(buf, format="JPEG", quality=85)
            label = "crack" if r["crack"] else "no_crack"
            return {"model": "crack", "label": label, "name": label.replace("_", " "), "confidence": round(r["confidence"], 3),
                    "fault": r["crack"], "probs": {"crack": round(r["p_crack"], 3), "no_crack": round(1 - r["p_crack"], 3)},
                    "tiles": r["tiles"], "cracked_tiles": r["cracked_tiles"],
                    "preview": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()}
        raise ValueError(f"Unknown model: {model}")

    @torch.no_grad()
    def classify_machine(self, signals: np.ndarray) -> dict:
        """Classify a multichannel capture ((8, samples) at 16 kHz: tach, 6 accel axes, mic).

        Averages over overlapping 1 s windows, and reports what the microphone and the vibration
        sensors conclude on their own next to the combined verdict.
        """
        if "fusion" not in self.machine:
            raise RuntimeError("Machine model not trained. Run wallsense/train_fusion.py.")
        feats = ff.features(signals)
        if not len(feats):
            raise ValueError("Capture is shorter than 1 second.")
        x = torch.from_numpy(feats)

        def run(mode: str) -> dict:
            model, ckpt = self.machine[mode]
            xn = (x.to(DEVICE) - ckpt["mean"].to(DEVICE)) / ckpt["std"].to(DEVICE)
            probs = torch.softmax(model(xn), 1).mean(0).cpu().numpy()
            idx = int(probs.argmax())
            label = ckpt["classes"][idx]
            return {"label": label, "name": label.replace("_", " "), "confidence": round(float(probs[idx]), 3),
                    "fault": label != "healthy", "probs": {c: round(float(p), 3) for c, p in zip(ckpt["classes"], probs)}}

        out = {"model": "machine", **run("fusion"), "windows": len(feats), "sensors": {}}
        for mode, name in (("audio", "Microphone"), ("vibration", "Vibration (6 axes)")):
            if mode in self.machine:
                out["sensors"][mode] = {"sensor": name, **run(mode)}
        return out

    @staticmethod
    def machine_preview(signals: np.ndarray) -> Image.Image:
        """Side-by-side spectrograms of the first second: microphone (left) and overhang radial accelerometer (right)."""
        from wallsense.preprocessing.audio_features import spectrogram_to_image
        w = ff.windows(signals)[0]
        mels = ff.log_mel(w[[ff.MIC_IDX, 5]])
        left, right = spectrogram_to_image(mels[0], (224, 224)), spectrogram_to_image(mels[1], (224, 224))
        img = Image.new("RGB", (452, 224), "white")
        img.paste(left, (0, 0))
        img.paste(right, (228, 0))
        return img

    def _sensor_model(self, spec: tuple[str, str]) -> dict | None:
        model, rel = spec
        key = f"{model}:{rel}"
        if key not in self._model_cache:
            try:
                res = self.classify(model, Image.open(ROOT / rel))
                res["sample"] = Path(rel).name
                self._model_cache[key] = res
            except (RuntimeError, FileNotFoundError) as e:
                self._model_cache[key] = {"model": model, "error": str(e)}
        return self._model_cache[key]

    # --- readings -------------------------------------------------------------

    def _reading(self, s: dict, kind: dict) -> dict:
        channel, gain = KIND_BINDING[s["kind"]]
        channel = s.get("channel", channel)
        gain = s.get("gain", gain)
        df = self.series[s["unit"]]
        raw = df[channel].to_numpy()
        healthy = raw[: int(len(raw) * 0.4)].mean()
        values = s["base"] + gain * (pd.Series(raw).rolling(SMOOTH_HOURS, min_periods=1).mean().to_numpy() - healthy)
        values = np.clip(values, kind["lo"] - (kind["hi"] - kind["lo"]), None)

        idx = np.linspace(len(values) - 1 - TREND_HOURS, len(values) - 1, TREND_POINTS).round().astype(int)
        v = float(values[-1])
        st = _status(v, kind)

        # How long the sensor has been out of its ok band.
        age = 0
        if st != "ok":
            ok_mask = np.array([_status(x, kind) == "ok" for x in values])
            last_ok = np.flatnonzero(ok_mask)
            start = last_ok[-1] + 1 if len(last_ok) else 0
            ts = df["timestamp"]
            age = int((ts.iloc[-1] - ts.iloc[start]).total_seconds() // 60)

        return {"v": round(v, 3), "st": st, "age": age, "trend": [round(float(values[i]), 3) for i in idx],
                "source": {"unit": s["unit"], "channel": channel, "gain": gain, "latest": round(float(raw[-1]), 3),
                           "at": df["timestamp"].iloc[-1].isoformat()}}

    def _sensor(self, s: dict) -> dict:
        kind = KINDS[s["kind"]]
        out = {k: s[k] for k in ("id", "kind", "zone", "short", "level", "box", "base", "batt", "mount", "cat")}
        if s.get("pending"):
            out["pending"] = True
        if s.get("off"):
            out.update(v=0, st="off", off=True, since=s.get("since", ""), age=0, trend=[s["base"]] * TREND_POINTS)
        else:
            out.update(self._reading(s, kind))
            out["since"] = _fmt_age(out["age"]) if out["st"] != "ok" else ""

        evidence = []
        unit_score = self.unit_anomaly.get(s["unit"]) if s.get("unit") else None
        if unit_score:
            out["anomaly"] = unit_score
            if out["st"] == "ok" and unit_score["severity"] == "red":
                out["st"] = "watch"
                out["since"] = out["since"] or "now"
            if unit_score["severity"] == "red":
                evidence.append(f"Anomaly model flags this node ({unit_score['score']:.2f}).")
        if s.get("model"):
            m = self._sensor_model(s["model"])
            out["model"] = m
            # Classifier output is corroborating evidence only; it never raises an alarm by itself.
            if "error" not in m and out["st"] != "ok":
                src = "Vibration" if m["model"] == "bearing" else "Sound"
                evidence.append(f"{src} signature: {m['name']} ({m['confidence']:.0%}).")

        issue = ISSUES.get(s["id"])
        problem = out["st"] in ("crit", "watch", "off")
        if issue and problem:
            out["plain"] = {k: issue[k] for k in ("h", "urg", "who", "what", "why", "todo")}
            out["note"] = issue.get("note") or issue["what"].split(". ")[0] + "."
        else:
            out["note"] = "Reading is inside its baseline range. No action needed."
        if evidence:
            out["note"] += " " + " ".join(evidence)
        out["fresh"] = False
        return out

    def snapshot(self) -> dict:
        sensors = [self._sensor(s) for s in SENSORS]
        crit = [s for s in sensors if s["st"] == "crit"]
        if crit:
            min(crit, key=lambda s: s["age"])["fresh"] = True  # newest critical alarm gets the intro pulse
        return {
            "site": SITE,
            "generatedAt": datetime.now().isoformat(timespec="seconds"),
            "models": {"anomaly": self.anomaly is not None, "sound": self.sound is not None, "bearing": True},
            "kinds": KINDS,
            "levels": LEVELS,
            "sensors": sensors,
        }


# --- per-asset agreement ------------------------------------------------------------------------

AREA = {"bearing_fault": "mechanical", "unbalanced_rotor": "mechanical", "misalignment": "mechanical",
        "stuck_rotor": "mechanical", "stator_short_circuit": "electrical", "cooling_fan_failure": "cooling",
        "pipe_leak": "water", "I": "mechanical", "O": "mechanical", "B": "mechanical", "C": "mechanical"}
SENSOR_NAME = {"machine": "Sound + vibration", "thermal": "Thermal camera", "sound": "Microphone",
               "bearing": "Vibration spectrogram", "crack": "Crack photo", "strain_live": "Strain gauge (live)",
               "crack_live": "Crack gauge (live)", "vibration_live": "Vibration sensor (live)",
               "thermal_live": "Thermal sensor (live)", "pressure_live": "Pressure sensor (live)",
               "acoustic_live": "Acoustic sensor (live)"}
AREA.update({"vibration": "mechanical", "thermal": "electrical", "pressure": "water", "acoustic": "water",
             "crack": "structural", "strain": "structural"})
VERY_SURE = 0.95


def assess_asset(results: dict[str, dict]) -> dict:
    """Combine verdicts from independent sensor types (one result per type) for one asset into a single action.

    A ticket is only raised when two independent sensor types both see a problem. A single sensor type,
    however confident, only schedules an inspection; a single unsure sensor just asks for another reading.
    """
    faults = {k: r for k, r in results.items() if r["fault"]}
    names = SENSOR_NAME
    if not faults:
        return {"decision": "healthy", "title": "No problem found", "action": "No action. Keep monitoring as usual.",
                "reason": "Every sensor type reads healthy."}
    if len(faults) >= 2:
        areas = sorted({AREA.get(r["label"], "other") for r in faults.values()})
        same = len(areas) == 1
        return {"decision": "confirmed", "title": "Confirmed problem: raise a ticket",
                "action": "Send a technician. Two independent sensor types agree something is wrong.",
                "reason": ("Both point to the same kind of problem (" + areas[0] + ")." if same else
                           "They see different sides of it (" + " and ".join(areas) + "), so there may be two problems. "
                           "Check both.")}
    (key, r), = faults.items()
    others = [names[k] for k in results if k != key]
    if r["confidence"] >= VERY_SURE:
        return {"decision": "inspect", "title": "Check on the next visit",
                "action": "Schedule an inspection. Don't send anyone out urgently yet.",
                "reason": f"Only the {names[key].lower()} sees a problem ({r['name']}, very confident); "
                          + (f"the {' and '.join(o.lower() for o in others)} reads healthy." if others else
                             "add a second sensor type ("
                             + ("e.g. a sound + vibration capture" if key == "thermal" else "e.g. a thermal image") + ") to confirm.")}
    return {"decision": "monitor", "title": "Keep an eye on it",
            "action": "No visit needed. Take another reading later to see if it persists.",
            "reason": f"Only the {names[key].lower()} flags {r['name']}, and it isn't sure."}


def per_type(items: list[dict]) -> dict[str, dict]:
    """Several files of the same type are one sensor type: keep its most concerning result."""
    best: dict[str, dict] = {}
    for it in items:
        r = it.get("result")
        if not r:
            continue
        cur = best.get(it["type"])
        rank = (r["fault"], r["confidence"] if r["fault"] else -r["confidence"])
        if cur is None or rank > (cur["fault"], cur["confidence"] if cur["fault"] else -cur["confidence"]):
            best[it["type"]] = r
    return best


def live_results(snapshot: dict, sensor_ids: list[str]) -> list[dict]:
    """Current state of a machine's fixed sensors, in the same shape as a model result.

    A sensor counts as seeing a problem when its reading is in the watch/critical band. Its classifier
    (if any) names the fault; a critical reading is treated as very sure, a watch reading as fairly sure.
    """
    out = []
    by_id = {s["id"]: s for s in snapshot["sensors"]}
    for sid in sensor_ids:
        s = by_id.get(sid)
        if not s or s["st"] == "off":
            continue
        kind = snapshot["kinds"][s["kind"]]
        m = s.get("model") or {}
        fault = s["st"] in ("crit", "watch")
        conf = {"crit": 0.99, "watch": 0.8, "ok": 0.9}[s["st"]]
        if fault and m.get("fault"):
            label, name, conf = m["label"], m["name"], max(conf, m["confidence"]) if s["st"] == "crit" else conf
        elif fault:
            label, name = s["kind"], (s.get("plain") or {}).get("h", f"{kind['name']} out of range")
        else:
            label, name = "healthy", "healthy"
        family = s["kind"] if s["kind"] in ("thermal", "pressure", "acoustic", "strain", "crack") else "vibration"
        out.append({"type": f"{family}_live", "sensor": sid, "zone": s["zone"],
                    "reading": f"{s['v']:.{kind['dp']}f} {kind['unit']}" + {"crit": " (critical)", "watch": " (watch)", "ok": ""}[s["st"]],
                    "result": {"label": label, "name": name, "confidence": round(conf, 3), "fault": fault}})
    return out
