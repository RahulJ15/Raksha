"""Convert raw vibration/audio signals into Mel spectrogram images for the sound classifier."""

from pathlib import Path

import librosa
import numpy as np
from PIL import Image

from wallsense.utils.config import (
    AUDIO_DURATION_SEC,
    HOP_LENGTH,
    N_FFT,
    N_MELS,
    SAMPLE_RATE,
    SPECTROGRAM_IMAGE_SIZE,
)


def load_audio(path: str | Path, sample_rate: int = SAMPLE_RATE, duration: float = AUDIO_DURATION_SEC) -> np.ndarray:
    """Load a WAV/audio file, resample, and pad/truncate to a fixed duration.

    Args:
        path: Path to an audio file readable by librosa/soundfile.
        sample_rate: Target sample rate in Hz.
        duration: Fixed clip duration in seconds; shorter clips are zero-padded.

    Returns:
        1D float32 waveform array of length ``int(sample_rate * duration)``.
    """
    waveform, _ = librosa.load(str(path), sr=sample_rate, mono=True)
    target_len = int(sample_rate * duration)
    if len(waveform) < target_len:
        waveform = np.pad(waveform, (0, target_len - len(waveform)))
    else:
        waveform = waveform[:target_len]
    return waveform.astype(np.float32)


def waveform_from_csv(path: str | Path, column: str = "amplitude") -> np.ndarray:
    """Load a vibration time-series stored as CSV and treat it as a raw waveform.

    Sensors that emit vibration as a CSV column (rather than WAV audio) can be
    processed with the same Mel spectrogram pipeline as audio.

    Args:
        path: Path to a CSV file with a numeric column of vibration amplitude samples.
        column: Name of the column holding the signal.

    Returns:
        1D float32 waveform array.
    """
    import pandas as pd

    df = pd.read_csv(path)
    return df[column].to_numpy(dtype=np.float32)


def compute_mel_spectrogram(
    waveform: np.ndarray,
    sample_rate: int = SAMPLE_RATE,
    n_mels: int = N_MELS,
    hop_length: int = HOP_LENGTH,
    n_fft: int = N_FFT,
) -> np.ndarray:
    """Compute a log-scaled Mel spectrogram from a waveform.

    Args:
        waveform: 1D float waveform array.
        sample_rate: Sample rate of ``waveform`` in Hz.
        n_mels: Number of Mel frequency bins.
        hop_length: Hop length (in samples) between STFT frames.
        n_fft: FFT window size.

    Returns:
        2D float32 array of shape (n_mels, n_frames) in decibel scale.
    """
    mel = librosa.feature.melspectrogram(
        y=waveform,
        sr=sample_rate,
        n_mels=n_mels,
        hop_length=hop_length,
        n_fft=n_fft,
    )
    mel_db = librosa.power_to_db(mel, ref=np.max)
    return mel_db.astype(np.float32)


def spectrogram_to_image(mel_db: np.ndarray, image_size: tuple[int, int] = SPECTROGRAM_IMAGE_SIZE) -> Image.Image:
    """Normalize a dB-scale Mel spectrogram to an 8-bit RGB image resized for ResNet-18.

    Args:
        mel_db: 2D log-Mel spectrogram in decibels.
        image_size: Target (width, height) for the output image.

    Returns:
        A PIL RGB image of ``image_size`` suitable as ResNet-18 input.
    """
    mel_db = np.flipud(mel_db)  # low frequencies at the bottom, the conventional orientation
    normalized = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-8)
    pixels = (normalized * 255).astype(np.uint8)
    image = Image.fromarray(pixels).convert("RGB")
    return image.resize(image_size, Image.BILINEAR)


def audio_to_spectrogram_image(path: str | Path) -> Image.Image:
    """End-to-end helper: load an audio/vibration file and produce a spectrogram image.

    Args:
        path: Path to a WAV file (or CSV if it ends in .csv).

    Returns:
        A 224x224 RGB PIL image ready for the sound classifier.
    """
    path = Path(path)
    waveform = waveform_from_csv(path) if path.suffix.lower() == ".csv" else load_audio(path)
    mel_db = compute_mel_spectrogram(waveform)
    return spectrogram_to_image(mel_db)


def save_spectrogram_image(mel_db: np.ndarray, out_path: str | Path) -> None:
    """Render a Mel spectrogram to disk as a PNG image.

    Args:
        mel_db: 2D log-Mel spectrogram in decibels.
        out_path: Destination file path (parent directories are created).
    """
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    image = spectrogram_to_image(mel_db)
    image.save(out_path)
