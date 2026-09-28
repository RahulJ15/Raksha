"""Cleaning, windowing, and feature extraction for tabular sensor time-series."""

import numpy as np
import pandas as pd

from wallsense.utils.config import SENSOR_FEATURE_COLUMNS, WINDOW_SIZE, WINDOW_STRIDE


def clean_sensor_data(df: pd.DataFrame) -> pd.DataFrame:
    """Sort by time, interpolate missing values, and clip obvious sensor glitches.

    Args:
        df: Raw sensor DataFrame with a ``timestamp`` column and numeric sensor columns.

    Returns:
        A cleaned copy of ``df`` sorted by timestamp with NaNs interpolated.
    """
    clean = df.copy()
    clean["timestamp"] = pd.to_datetime(clean["timestamp"])
    clean = clean.sort_values("timestamp").reset_index(drop=True)

    for col in SENSOR_FEATURE_COLUMNS:
        if col not in clean.columns:
            continue
        clean[col] = pd.to_numeric(clean[col], errors="coerce")
        clean[col] = clean[col].interpolate(method="linear", limit_direction="both")
        lower, upper = clean[col].quantile(0.001), clean[col].quantile(0.999)
        clean[col] = clean[col].clip(lower, upper)

    return clean


def make_windows(df: pd.DataFrame, window_size: int = WINDOW_SIZE, stride: int = WINDOW_STRIDE) -> list[np.ndarray]:
    """Slice a cleaned sensor DataFrame into overlapping fixed-length windows.

    Args:
        df: Cleaned sensor DataFrame (see ``clean_sensor_data``).
        window_size: Number of timesteps per window.
        stride: Step size between consecutive window start indices.

    Returns:
        List of arrays, each of shape (window_size, n_features).
    """
    values = df[SENSOR_FEATURE_COLUMNS].to_numpy(dtype=np.float32)
    windows = []
    for start in range(0, len(values) - window_size + 1, stride):
        windows.append(values[start : start + window_size])
    return windows


def extract_window_features(window: np.ndarray) -> dict[str, float]:
    """Compute summary statistics for one window, used by the Isolation Forest.

    Args:
        window: Array of shape (window_size, n_features) matching
            ``SENSOR_FEATURE_COLUMNS`` column order.

    Returns:
        Dict mapping ``"<column>_<stat>"`` to a scalar value, for mean, std,
        min, max, and range across each sensor column in the window.
    """
    features: dict[str, float] = {}
    for i, col in enumerate(SENSOR_FEATURE_COLUMNS):
        series = window[:, i]
        features[f"{col}_mean"] = float(np.mean(series))
        features[f"{col}_std"] = float(np.std(series))
        features[f"{col}_min"] = float(np.min(series))
        features[f"{col}_max"] = float(np.max(series))
        features[f"{col}_range"] = float(np.max(series) - np.min(series))
    return features


def windows_to_feature_matrix(windows: list[np.ndarray]) -> pd.DataFrame:
    """Convert a list of raw windows into a tabular feature matrix for Isolation Forest.

    Args:
        windows: List of (window_size, n_features) arrays from ``make_windows``.

    Returns:
        DataFrame with one row per window and one column per summary statistic.
    """
    rows = [extract_window_features(w) for w in windows]
    return pd.DataFrame(rows)


def normalize_windows(windows: list[np.ndarray], mean: np.ndarray, std: np.ndarray) -> list[np.ndarray]:
    """Z-score normalize raw windows using precomputed per-feature mean/std, for the LSTM AE.

    Args:
        windows: List of (window_size, n_features) arrays.
        mean: Per-feature mean, shape (n_features,).
        std: Per-feature std, shape (n_features,), zeros replaced with 1 to avoid div-by-zero.

    Returns:
        List of normalized windows with the same shapes as the input.
    """
    safe_std = np.where(std == 0, 1.0, std)
    return [(w - mean) / safe_std for w in windows]


def compute_normalization_stats(windows: list[np.ndarray]) -> tuple[np.ndarray, np.ndarray]:
    """Compute per-feature mean/std across a set of windows (fit on 'normal' training data).

    Args:
        windows: List of (window_size, n_features) arrays.

    Returns:
        Tuple of (mean, std), each shape (n_features,).
    """
    stacked = np.concatenate(windows, axis=0)
    return stacked.mean(axis=0), stacked.std(axis=0)
