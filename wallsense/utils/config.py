"""Central configuration: paths, hyperparameters, and alert thresholds for WallSense."""

from pathlib import Path

# --- Paths -------------------------------------------------------------

PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent
DATA_DIR: Path = PROJECT_ROOT / "data"
RAW_AUDIO_DIR: Path = DATA_DIR / "raw_audio"
SPECTROGRAM_DIR: Path = DATA_DIR / "spectrograms"  # real-audio spectrograms (make_spectrograms.py)
SENSOR_DATA_DIR: Path = DATA_DIR / "sensor_timeseries"
CHECKPOINT_DIR: Path = PROJECT_ROOT / "checkpoints"
SOUND_MODEL_PATH: Path = CHECKPOINT_DIR / "sound_classifier.pt"
ANOMALY_MODEL_PATH: Path = CHECKPOINT_DIR / "isolation_forest.joblib"
LSTM_AE_MODEL_PATH: Path = CHECKPOINT_DIR / "lstm_autoencoder.pt"
BUILDING_METADATA_PATH: Path = DATA_DIR / "building_metadata.csv"
ALERTS_PATH: Path = DATA_DIR / "alerts.csv"

# --- Sound classifier (Layer 1) -----------------------------------------

# Trained on real audio: MaFaulDa rig microphone (healthy/bearing/imbalance/misalignment) and
# water-network leak recordings (pipe_leak; no-leak and ambient noise count as healthy).
# arc_fault was dropped: no public arc-fault audio dataset was available.
SOUND_CLASSES: list[str] = [
    "healthy",
    "bearing_fault",
    "unbalanced_rotor",
    "misalignment",
    "pipe_leak",
]
NUM_SOUND_CLASSES: int = len(SOUND_CLASSES)

# Audio / spectrogram settings
SAMPLE_RATE: int = 8000  # leak recordings are 8 kHz; everything is resampled to match
N_MELS: int = 128
HOP_LENGTH: int = 64
N_FFT: int = 1024
AUDIO_DURATION_SEC: float = 1.0  # clips are cut into 1 s segments
SPECTROGRAM_IMAGE_SIZE: tuple[int, int] = (224, 224)

# Training hyperparameters
SOUND_LEARNING_RATE: float = 1e-4
SOUND_BATCH_SIZE: int = 32
SOUND_EPOCHS: int = 20
SOUND_EARLY_STOPPING_PATIENCE: int = 4
SOUND_TRAIN_VAL_SPLIT: float = 0.8
SOUND_FROZEN_LAYERS: tuple[str, ...] = ("conv1", "bn1", "layer1")  # fine-tune layer2+layer3+layer4+fc

# --- Anomaly detector (Layer 2) -----------------------------------------

SENSOR_COLUMNS: list[str] = [
    "timestamp",
    "pressure",
    "flow_rate",
    "temperature",
    "current",
    "vibration_rms",
    "moisture",
]
SENSOR_FEATURE_COLUMNS: list[str] = [c for c in SENSOR_COLUMNS if c != "timestamp"]

ISOLATION_FOREST_CONTAMINATION: float = 0.05
ISOLATION_FOREST_N_ESTIMATORS: int = 200
ISOLATION_FOREST_RANDOM_STATE: int = 42

WINDOW_SIZE: int = 30  # timesteps per window fed to the models
WINDOW_STRIDE: int = 10

LSTM_AE_ENCODER_DIMS: tuple[int, int] = (64, 32)
LSTM_AE_DECODER_DIMS: tuple[int, int] = (32, 64)
LSTM_AE_LEARNING_RATE: float = 1e-3
LSTM_AE_BATCH_SIZE: int = 64
LSTM_AE_EPOCHS: int = 30

# --- Alert thresholds & health scoring -----------------------------------

# Anomaly score thresholds (0-1 normalized). Below AMBER -> green, etc.
ANOMALY_THRESHOLD_AMBER: float = 0.4
ANOMALY_THRESHOLD_RED: float = 0.7

# Equipment health score thresholds (0-100)
HEALTH_SCORE_AMBER: float = 70.0
HEALTH_SCORE_RED: float = 40.0

# --- Cost projections ------------------------------------------------------

# Rough per-issue-type cost estimates used for the alert feed's cost projection column.
COST_PROJECTIONS: dict[str, dict[str, float]] = {
    "healthy": {"fix_now": 0.0, "emergency": 0.0},
    "healthy_motor": {"fix_now": 0.0, "emergency": 0.0},
    "bearing_fault": {"fix_now": 350.0, "emergency": 1100.0},
    "unbalanced_rotor": {"fix_now": 275.0, "emergency": 900.0},
    "misalignment": {"fix_now": 220.0, "emergency": 750.0},
    "pipe_leak": {"fix_now": 400.0, "emergency": 2200.0},
    "arc_fault": {"fix_now": 500.0, "emergency": 3500.0},
    "sensor_anomaly": {"fix_now": 150.0, "emergency": 600.0},
}

# --- Synthetic demo data ---------------------------------------------------

NUM_DEMO_UNITS: int = 24
DEMO_BUILDING_FLOORS: int = 6
DEMO_UNITS_PER_FLOOR: int = 4
DEMO_DAYS_OF_HISTORY: int = 30
DEMO_SENSOR_READINGS_PER_DAY: int = 24  # hourly

RANDOM_SEED: int = 42
