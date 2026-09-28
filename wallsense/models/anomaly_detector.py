"""Isolation Forest (primary) and LSTM Autoencoder (secondary) anomaly detectors for sensor data."""

from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np
import torch
import torch.nn as nn
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from wallsense.utils.config import (
    ANOMALY_THRESHOLD_AMBER,
    ANOMALY_THRESHOLD_RED,
    ISOLATION_FOREST_CONTAMINATION,
    ISOLATION_FOREST_N_ESTIMATORS,
    ISOLATION_FOREST_RANDOM_STATE,
    LSTM_AE_DECODER_DIMS,
    LSTM_AE_ENCODER_DIMS,
    SENSOR_FEATURE_COLUMNS,
)


@dataclass
class AnomalyResult:
    """Anomaly score for one sensor window, with the derived alert severity."""

    raw_score: float
    normalized_score: float
    is_anomaly: bool
    severity: str  # "green" | "amber" | "red"


def severity_from_score(normalized_score: float) -> str:
    """Map a normalized anomaly score in [0, 1] to a green/amber/red severity band.

    Args:
        normalized_score: Anomaly score normalized to [0, 1], higher = more anomalous.

    Returns:
        One of "green", "amber", "red".
    """
    if normalized_score >= ANOMALY_THRESHOLD_RED:
        return "red"
    if normalized_score >= ANOMALY_THRESHOLD_AMBER:
        return "amber"
    return "green"


class IsolationForestDetector:
    """Wraps sklearn's IsolationForest with feature scaling and score normalization."""

    def __init__(
        self,
        contamination: float = ISOLATION_FOREST_CONTAMINATION,
        n_estimators: int = ISOLATION_FOREST_N_ESTIMATORS,
        random_state: int = ISOLATION_FOREST_RANDOM_STATE,
    ) -> None:
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=n_estimators,
            random_state=random_state,
        )
        self._score_min: float = 0.0
        self._score_max: float = 1.0
        self._is_fitted = False

    def fit(self, feature_matrix: "np.ndarray | object") -> "IsolationForestDetector":
        """Fit the scaler and Isolation Forest on a feature matrix (rows = windows).

        Args:
            feature_matrix: Array-like or DataFrame of shape (n_windows, n_features)
                from ``sensor_features.windows_to_feature_matrix``.

        Returns:
            self, for chaining.
        """
        X = np.asarray(feature_matrix, dtype=np.float64)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)

        raw_scores = -self.model.score_samples(X_scaled)  # higher = more anomalous
        self._score_min, self._score_max = float(raw_scores.min()), float(raw_scores.max())
        self._is_fitted = True
        return self

    def score(self, feature_matrix: "np.ndarray | object") -> list[AnomalyResult]:
        """Score windows for anomalousness.

        Args:
            feature_matrix: Array-like or DataFrame of shape (n_windows, n_features).

        Returns:
            List of ``AnomalyResult``, one per row of ``feature_matrix``.
        """
        if not self._is_fitted:
            raise RuntimeError("IsolationForestDetector must be fit before scoring.")

        X = np.asarray(feature_matrix, dtype=np.float64)
        X_scaled = self.scaler.transform(X)
        raw_scores = -self.model.score_samples(X_scaled)
        predictions = self.model.predict(X_scaled)  # -1 = anomaly, 1 = normal

        span = max(self._score_max - self._score_min, 1e-8)
        results = []
        for raw, pred in zip(raw_scores, predictions):
            normalized = float(np.clip((raw - self._score_min) / span, 0.0, 1.0))
            results.append(
                AnomalyResult(
                    raw_score=float(raw),
                    normalized_score=normalized,
                    is_anomaly=bool(pred == -1),
                    severity=severity_from_score(normalized),
                )
            )
        return results

    def save(self, path: str | Path) -> None:
        """Persist the fitted scaler, model, and score range to disk.

        Args:
            path: Destination .joblib file path.
        """
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(
            {
                "scaler": self.scaler,
                "model": self.model,
                "score_min": self._score_min,
                "score_max": self._score_max,
            },
            path,
        )

    @classmethod
    def load(cls, path: str | Path) -> "IsolationForestDetector":
        """Load a previously saved detector.

        Args:
            path: Path to a .joblib file written by ``save``.

        Returns:
            A fitted ``IsolationForestDetector``.
        """
        payload = joblib.load(path)
        detector = cls()
        detector.scaler = payload["scaler"]
        detector.model = payload["model"]
        detector._score_min = payload["score_min"]
        detector._score_max = payload["score_max"]
        detector._is_fitted = True
        return detector


class LSTMAutoencoder(nn.Module):
    """LSTM Autoencoder: encoder (LSTM 64->32) -> decoder (LSTM 32->64) -> linear reconstruction.

    Trained on "normal" sensor windows only; reconstruction error at inference time
    serves as an anomaly score for windows the model has not seen the shape of.
    """

    def __init__(
        self,
        n_features: int = len(SENSOR_FEATURE_COLUMNS),
        encoder_dims: tuple[int, int] = LSTM_AE_ENCODER_DIMS,
        decoder_dims: tuple[int, int] = LSTM_AE_DECODER_DIMS,
    ) -> None:
        super().__init__()
        enc_hidden1, enc_hidden2 = encoder_dims
        dec_hidden1, dec_hidden2 = decoder_dims

        self.encoder_lstm1 = nn.LSTM(n_features, enc_hidden1, batch_first=True)
        self.encoder_lstm2 = nn.LSTM(enc_hidden1, enc_hidden2, batch_first=True)

        self.decoder_lstm1 = nn.LSTM(enc_hidden2, dec_hidden1, batch_first=True)
        self.decoder_lstm2 = nn.LSTM(dec_hidden1, dec_hidden2, batch_first=True)

        self.output_layer = nn.Linear(dec_hidden2, n_features)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Encode then reconstruct a batch of sensor windows.

        Args:
            x: Input windows, shape (B, seq_len, n_features).

        Returns:
            Reconstructed windows, shape (B, seq_len, n_features).
        """
        batch_size, seq_len, _ = x.shape

        enc1_out, _ = self.encoder_lstm1(x)
        enc2_out, (h2, _) = self.encoder_lstm2(enc1_out)

        latent = h2[-1]  # (B, enc_hidden2), the compressed representation
        repeated = latent.unsqueeze(1).repeat(1, seq_len, 1)

        dec1_out, _ = self.decoder_lstm1(repeated)
        dec2_out, _ = self.decoder_lstm2(dec1_out)

        return self.output_layer(dec2_out)

    def reconstruction_error(self, x: torch.Tensor) -> torch.Tensor:
        """Compute per-sample mean squared reconstruction error.

        Args:
            x: Input windows, shape (B, seq_len, n_features).

        Returns:
            Per-sample MSE, shape (B,).
        """
        reconstructed = self.forward(x)
        return ((reconstructed - x) ** 2).mean(dim=(1, 2))


def save_lstm_checkpoint(model: LSTMAutoencoder, path: str | Path) -> None:
    """Save LSTM autoencoder weights to disk.

    Args:
        model: The model to save.
        path: Destination file path (parent directories are created).
    """
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), path)


def load_lstm_checkpoint(path: str | Path, device: str = "cpu") -> LSTMAutoencoder:
    """Load an ``LSTMAutoencoder`` from a saved checkpoint.

    Args:
        path: Path to a state-dict file saved by ``save_lstm_checkpoint``.
        device: Torch device to map the weights onto.

    Returns:
        An ``LSTMAutoencoder`` with loaded weights, in eval mode.
    """
    model = LSTMAutoencoder()
    state_dict = torch.load(path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model
