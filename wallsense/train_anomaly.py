"""Fit the Isolation Forest (and optionally the LSTM Autoencoder) anomaly detectors.

Usage:
    python train_anomaly.py                 # Isolation Forest only
    python train_anomaly.py --with-lstm      # also train the LSTM Autoencoder

Trains on the synthetic demo sensor data (generated on first run if missing) or
on real sensor CSVs placed under ``data/sensor_timeseries/``.
"""

import argparse
import sys
from pathlib import Path

import numpy as np
import torch
from torch.utils.data import DataLoader, TensorDataset

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.models.anomaly_detector import (
    IsolationForestDetector,
    LSTMAutoencoder,
    save_lstm_checkpoint,
)
from wallsense.preprocessing.sensor_features import (
    clean_sensor_data,
    compute_normalization_stats,
    make_windows,
    normalize_windows,
    windows_to_feature_matrix,
)
from wallsense.utils.config import (
    ANOMALY_MODEL_PATH,
    LSTM_AE_BATCH_SIZE,
    LSTM_AE_EPOCHS,
    LSTM_AE_LEARNING_RATE,
    LSTM_AE_MODEL_PATH,
    RANDOM_SEED,
)
from wallsense.utils.data_loader import load_demo_data


def build_training_windows(sensor_series: dict) -> tuple[list[np.ndarray], list[np.ndarray]]:
    """Clean and window every unit's sensor series, splitting healthy vs. faulty windows.

    Faulty units still contribute their early ("pre-onset") windows to the normal set,
    since the synthetic fault only ramps in partway through each series.

    Args:
        sensor_series: Dict mapping unit_id -> raw sensor DataFrame.

    Returns:
        Tuple of (normal_windows, all_windows), each a list of (window_size, n_features) arrays.
    """
    normal_windows: list[np.ndarray] = []
    all_windows: list[np.ndarray] = []

    for df in sensor_series.values():
        cleaned = clean_sensor_data(df)
        windows = make_windows(cleaned)
        all_windows.extend(windows)
        # Use the first half of each series as "normal" training signal, mirroring
        # how the synthetic fault ramps in only partway through the history.
        cutoff = max(len(windows) // 2, 1)
        normal_windows.extend(windows[:cutoff])

    return normal_windows, all_windows


def train_isolation_forest(normal_windows: list[np.ndarray]) -> IsolationForestDetector:
    """Fit and save the Isolation Forest on summary-statistic features of normal windows.

    Args:
        normal_windows: List of windows considered representative of normal operation.

    Returns:
        The fitted ``IsolationForestDetector``.
    """
    feature_matrix = windows_to_feature_matrix(normal_windows)
    detector = IsolationForestDetector().fit(feature_matrix)
    detector.save(ANOMALY_MODEL_PATH)
    print(f"Isolation Forest fit on {len(normal_windows)} windows -> saved to {ANOMALY_MODEL_PATH}")
    return detector


def train_lstm_autoencoder(normal_windows: list[np.ndarray], epochs: int, batch_size: int, lr: float, device: str) -> None:
    """Train the LSTM Autoencoder to reconstruct normal sensor windows.

    Args:
        normal_windows: List of windows considered representative of normal operation.
        epochs: Number of training epochs.
        batch_size: Training batch size.
        lr: Learning rate for the Adam optimizer.
        device: Torch device string.
    """
    mean, std = compute_normalization_stats(normal_windows)
    normalized = normalize_windows(normal_windows, mean, std)
    tensor_data = torch.tensor(np.stack(normalized), dtype=torch.float32)

    dataset = TensorDataset(tensor_data)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    model = LSTMAutoencoder(n_features=tensor_data.shape[-1]).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    for epoch in range(1, epochs + 1):
        model.train()
        epoch_loss = 0.0
        for (batch,) in loader:
            batch = batch.to(device)
            optimizer.zero_grad()
            error = model.reconstruction_error(batch).mean()
            error.backward()
            optimizer.step()
            epoch_loss += error.item() * batch.size(0)
        epoch_loss /= max(len(dataset), 1)
        print(f"Epoch {epoch:02d}/{epochs}  reconstruction_mse={epoch_loss:.5f}")

    save_lstm_checkpoint(model, LSTM_AE_MODEL_PATH)
    print(f"LSTM Autoencoder saved to {LSTM_AE_MODEL_PATH}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the WallSense anomaly detectors.")
    parser.add_argument("--with-lstm", action="store_true", help="Also train the LSTM Autoencoder.")
    parser.add_argument("--epochs", type=int, default=LSTM_AE_EPOCHS)
    parser.add_argument("--batch-size", type=int, default=LSTM_AE_BATCH_SIZE)
    parser.add_argument("--lr", type=float, default=LSTM_AE_LEARNING_RATE)
    parser.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "cpu")
    args = parser.parse_args()

    torch.manual_seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)

    print("Loading sensor data (generating synthetic demo data if missing)...")
    _, sensor_series, _ = load_demo_data()

    normal_windows, all_windows = build_training_windows(sensor_series)
    print(f"Built {len(all_windows)} total windows, {len(normal_windows)} treated as normal training data.")

    train_isolation_forest(normal_windows)

    if args.with_lstm:
        train_lstm_autoencoder(normal_windows, args.epochs, args.batch_size, args.lr, args.device)


if __name__ == "__main__":
    main()
