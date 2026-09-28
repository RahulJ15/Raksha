"""Gemini verdict: a plain-language explanation of a classifier result, grounded in the spectrogram itself."""

import io
import json
import os
from pathlib import Path

from PIL import Image
from pydantic import BaseModel, Field

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
DEFAULT_MODEL = "gemini-flash-latest"

CONTEXT = {
    "sound": "a microphone or hydrophone on building equipment or a water pipe. The classifier is a ResNet-18 "
             "fine-tuned on 1-second log-mel spectrograms (8 kHz audio, 0-4 kHz) from real recordings: a motor/rotor "
             "test rig (MaFaulDa) and a water-network leak test base. Classes: healthy, bearing_fault, "
             "unbalanced_rotor, misalignment, pipe_leak.",
    "machine": "a rotating machine (motor driving a rotor on two bearings) watched by a microphone and two 3-axis "
               "accelerometers at once. The image shows two log-mel spectrograms side by side: microphone on the left, "
               "overhang radial accelerometer on the right (low frequencies at the bottom). A combined audio+vibration "
               "ResNet-18 model classifies: healthy, bearing_fault, unbalanced_rotor, misalignment.",
    "thermal": "a thermal (infrared) camera pointed at an induction motor; brighter/yellower = hotter. A ResNet-18 "
               "trained on lab IR images of one 1.1 kW motor classifies: healthy, stator_short_circuit (winding fault), "
               "cooling_fan_failure, stuck_rotor.",
    "crack": "an ordinary phone photo of a concrete surface (wall, pier, slab). A ResNet-18 trained on close-up "
             "concrete photos checks it tile by tile; red boxes mark tiles it thinks are cracked. Classes: crack, no_crack.",
    "bearing": "a vibration sensor on a rotating machine's bearing housing (fans, pumps, HVAC units). The classifier is a "
               "ResNet-18 trained on vibration spectrograms (0-21 kHz) with classes: Healthy, Inner race fault, "
               "Outer race fault, Ball fault, Cage fault. Its test accuracy is about 79%, so it can be wrong.",
}


class Verdict(BaseModel):
    agrees: str = Field(description="'agree', 'disagree' or 'unsure': whether the spectrogram supports the classifier's label")
    headline: str = Field(description="One short sentence a building manager understands, e.g. 'Likely pipe leak behind the wall'")
    explanation: str = Field(description="2-3 plain sentences: what the spectrogram shows and why it points to this issue")
    likely_cause: str = Field(description="The most likely physical cause, one sentence")
    risk: str = Field(description="What happens if it is ignored, one sentence")
    urgency: str = Field(description="One of: 'Fix now', 'Within 48 hours', 'This week', 'This month', 'No action'")
    who: str = Field(description="Which trade should handle it, e.g. 'Plumber', 'HVAC technician', 'Licensed electrician'")
    next_steps: list[str] = Field(description="2-4 short, concrete actions in order")


def _api_key() -> str | None:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI") or os.environ.get("GOOGLE_API_KEY")
    if key:
        return key
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            name, _, value = line.partition("=")
            if name.strip() in ("GEMINI_API_KEY", "GEMINI", "GOOGLE_API_KEY") and value.strip():
                return value.strip().strip("'\"")
    return None


class VerdictUnavailable(RuntimeError):
    pass


def gemini_verdict(model: str, image: Image.Image, result: dict) -> dict:
    """Ask Gemini to explain (and sanity-check) a classifier result for one spectrogram."""
    key = _api_key()
    if not key:
        raise VerdictUnavailable("AI explanations are not set up: add GEMINI_API_KEY=... to the .env file in the repo root.")

    from google import genai
    from google.genai import types

    buf = io.BytesIO()
    image.convert("RGB").save(buf, format="PNG")
    probs = ", ".join(f"{k}: {v:.1%}" for k, v in sorted(result["probs"].items(), key=lambda kv: -kv[1]))
    prompt = (
        f"You are the diagnostics assistant in Infrasensor, a building-maintenance app. This spectrogram came from "
        f"{CONTEXT[model]}\n\nThe classifier predicted '{result['name']}' with {result['confidence']:.1%} confidence. "
        f"Full distribution: {probs}."
        + (" This is an early warning: the model leaned healthy but not confidently, so the most likely fault is "
           "flagged for a check rather than confirmed." if result.get("early_warning") else "")
        + ("" if not result.get("sensors") else " Each sensor on its own: " + "; ".join(
            f"{v['sensor']} says {v['name']} ({v['confidence']:.0%})" for v in result["sensors"].values()) + ".")
        + "\n\n"
        f"Look at the spectrogram yourself. Say whether it supports that label, then explain "
        f"the issue for a facilities manager with no engineering background. Be concrete and brief. If the confidence is "
        f"low or the image does not look like a {model} spectrogram, say so and set agrees to 'unsure'."
    )
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=os.environ.get("GEMINI_MODEL", DEFAULT_MODEL),
        contents=[types.Part.from_bytes(data=buf.getvalue(), mime_type="image/png"), prompt],
        config=types.GenerateContentConfig(response_mime_type="application/json", response_schema=Verdict, temperature=0.3),
    )
    verdict = response.parsed if isinstance(response.parsed, Verdict) else Verdict(**json.loads(response.text))
    return {**verdict.model_dump(), "model": os.environ.get("GEMINI_MODEL", DEFAULT_MODEL)}
