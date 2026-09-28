"""Multichannel (microphone + 6-axis vibration) features for the audio+vibration fusion model."""

import librosa
import numpy as np

RATE = 16_000
WINDOW_SEC = 1.0
HOP_SEC = 0.5  # overlapping windows; predictions over a recording are averaged
N_MELS = 128
N_FFT = 1024
HOP_LENGTH = 128

# Column order in MaFaulDa CSVs / our .npz files.
ACCEL_IDX = [1, 2, 3, 4, 5, 6]  # underhang + overhang accelerometers, 3 axes each
MIC_IDX = 7
MACHINE_CLASSES = ["healthy", "bearing_fault", "unbalanced_rotor", "misalignment"]


def log_mel(x: np.ndarray) -> np.ndarray:
    """(channels, samples) -> (channels, N_MELS, frames) log-mel power in dB (absolute, not per-clip normalised)."""
    mel = librosa.feature.melspectrogram(y=x.astype(np.float32), sr=RATE, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=N_MELS)
    return librosa.power_to_db(mel + 1e-12, ref=1.0, top_db=None).astype(np.float32)


def windows(signals: np.ndarray) -> list[np.ndarray]:
    """Cut (8, samples) signals at RATE into overlapping 1 s windows."""
    win, hop = int(RATE * WINDOW_SEC), int(RATE * HOP_SEC)
    return [signals[:, s:s + win] for s in range(0, signals.shape[1] - win + 1, hop)]


def features(signals: np.ndarray) -> np.ndarray:
    """(8, samples) at RATE -> (n_windows, 7, N_MELS, frames): channel 0 = microphone, 1-6 = accelerometers."""
    out = []
    for w in windows(signals):
        out.append(log_mel(w[[MIC_IDX] + ACCEL_IDX]))
    return np.stack(out) if out else np.zeros((0, 7, N_MELS, int(RATE * WINDOW_SEC) // HOP_LENGTH + 1), np.float32)


def signals_from_mafaulda_csv(data: np.ndarray, rate: int = 50_000) -> np.ndarray:
    """(samples, 8) raw MaFaulDa CSV array -> (8, samples) at RATE, mean-removed."""
    data = data - data.mean(axis=0)
    return librosa.resample(data.T.astype(np.float32), orig_sr=rate, target_sr=RATE)
