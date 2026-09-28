"""Dataset loaders for Kaggle-sourced data, plus synthetic demo-data generation.

The synthetic generators here let the Streamlit dashboard and training scripts run
end-to-end before any real Kaggle dataset (e.g. MIMII sound, NASA bearing, or building
sensor datasets) has been downloaded into ``data/``.
"""

from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

from wallsense.preprocessing.sensor_features import clean_sensor_data
from wallsense.utils.config import (
    ALERTS_PATH,
    BUILDING_METADATA_PATH,
    COST_PROJECTIONS,
    DEMO_BUILDING_FLOORS,
    DEMO_DAYS_OF_HISTORY,
    DEMO_SENSOR_READINGS_PER_DAY,
    DEMO_UNITS_PER_FLOOR,
    RANDOM_SEED,
    SENSOR_DATA_DIR,
    SENSOR_FEATURE_COLUMNS,
)

# --- Kaggle-style dataset loaders ------------------------------------------


def load_audio_dataset_manifest(root: str | Path, extensions: tuple[str, ...] = (".wav", ".flac")) -> pd.DataFrame:
    """Scan a directory of class-labeled audio subfolders into a manifest DataFrame.

    Expects a layout like ``root/<class_name>/*.wav``, matching how most Kaggle
    equipment-sound datasets are organized after extraction.

    Args:
        root: Root directory containing one subfolder per class.
        extensions: Audio file extensions to include.

    Returns:
        DataFrame with columns ``path`` and ``label`` for every matching file.
    """
    root = Path(root)
    rows = []
    if not root.exists():
        return pd.DataFrame(columns=["path", "label"])

    for class_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        for ext in extensions:
            for file_path in class_dir.glob(f"*{ext}"):
                rows.append({"path": str(file_path), "label": class_dir.name})
    return pd.DataFrame(rows)


def load_sensor_csv_dataset(root: str | Path, pattern: str = "*.csv") -> dict[str, pd.DataFrame]:
    """Load every sensor CSV in a directory into a dict keyed by unit/file id.

    Args:
        root: Directory containing per-unit sensor CSV files.
        pattern: Glob pattern used to find files.

    Returns:
        Dict mapping file stem (e.g. unit id) to its cleaned sensor DataFrame.
    """
    root = Path(root)
    datasets: dict[str, pd.DataFrame] = {}
    if not root.exists():
        return datasets

    for file_path in sorted(root.glob(pattern)):
        df = pd.read_csv(file_path)
        datasets[file_path.stem] = clean_sensor_data(df)
    return datasets


# --- Synthetic demo data generation ----------------------------------------

# Fault types injected into the synthetic sensor time-series (independent of the sound classes).
ISSUE_TYPES = ["bearing_fault", "unbalanced_rotor", "misalignment", "pipe_leak", "arc_fault", "sensor_anomaly"]


def _unit_ids() -> list[str]:
    units = []
    for floor in range(1, DEMO_BUILDING_FLOORS + 1):
        for unit_num in range(1, DEMO_UNITS_PER_FLOOR + 1):
            units.append(f"{floor}{unit_num:02d}")
    return units


def generate_building_metadata(seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Generate synthetic building/unit metadata with pre-assigned health outcomes.

    A fixed fraction of units are marked as having an active issue (amber/red) so the
    dashboard's building overview, alert feed, and analytics pages have non-trivial
    data to render immediately.

    Args:
        seed: RNG seed for reproducibility.

    Returns:
        DataFrame with one row per unit: unit_id, floor, health_score, status,
        equipment_type, and (if unhealthy) issue_type.
    """
    rng = np.random.default_rng(seed)
    units = _unit_ids()

    rows = []
    for unit_id in units:
        floor = int(unit_id[:-2]) if len(unit_id) > 2 else int(unit_id[0])
        roll = rng.random()
        if roll < 0.72:
            status, issue_type = "green", None
            health_score = float(rng.uniform(80, 100))
        elif roll < 0.90:
            status, issue_type = "amber", rng.choice(ISSUE_TYPES)
            health_score = float(rng.uniform(45, 75))
        else:
            status, issue_type = "red", rng.choice(ISSUE_TYPES)
            health_score = float(rng.uniform(10, 40))

        rows.append(
            {
                "unit_id": unit_id,
                "floor": floor,
                "equipment_type": rng.choice(["HVAC blower", "water pump", "electrical panel", "exhaust fan"]),
                "health_score": round(health_score, 1),
                "status": status,
                "issue_type": issue_type,
            }
        )

    return pd.DataFrame(rows)


def _simulate_sensor_series(
    rng: np.random.Generator,
    n_points: int,
    status: str,
    issue_type: str | None,
) -> pd.DataFrame:
    """Simulate one unit's hourly sensor time-series, injecting a drift/anomaly for unhealthy units."""
    timestamps = [datetime.now() - timedelta(hours=n_points - i) for i in range(n_points)]

    baseline = {
        "pressure": 45.0,
        "flow_rate": 12.0,
        "temperature": 68.0,
        "current": 8.0,
        "vibration_rms": 0.15,
        "moisture": 20.0,
    }
    noise_scale = {
        "pressure": 1.5,
        "flow_rate": 0.6,
        "temperature": 1.2,
        "current": 0.4,
        "vibration_rms": 0.02,
        "moisture": 1.5,
    }

    series = {
        col: baseline[col] + rng.normal(0, noise_scale[col], n_points) for col in SENSOR_FEATURE_COLUMNS
    }

    if status in ("amber", "red"):
        onset = int(n_points * rng.uniform(0.5, 0.75))
        severity = 0.6 if status == "amber" else 1.4
        ramp = np.clip((np.arange(n_points) - onset) / max(n_points - onset, 1), 0, 1)

        if issue_type in ("bearing_fault", "unbalanced_rotor", "misalignment"):
            series["vibration_rms"] += ramp * severity * 0.35
            series["current"] += ramp * severity * 1.5
            series["temperature"] += ramp * severity * 8
        elif issue_type == "pipe_leak":
            series["pressure"] -= ramp * severity * 15
            series["flow_rate"] += ramp * severity * 4
            series["moisture"] += ramp * severity * 30
        elif issue_type == "arc_fault":
            series["current"] += ramp * severity * 6
            series["temperature"] += ramp * severity * 12
        else:  # sensor_anomaly / generic drift
            series["vibration_rms"] += ramp * severity * 0.2
            series["moisture"] += ramp * severity * 10

    df = pd.DataFrame(series)
    df.insert(0, "timestamp", timestamps)
    df["pressure"] = df["pressure"].clip(lower=0)
    df["flow_rate"] = df["flow_rate"].clip(lower=0)
    df["moisture"] = df["moisture"].clip(lower=0, upper=100)
    df["vibration_rms"] = df["vibration_rms"].clip(lower=0)
    return df


def generate_sensor_timeseries(
    building_metadata: pd.DataFrame,
    days: int = DEMO_DAYS_OF_HISTORY,
    readings_per_day: int = DEMO_SENSOR_READINGS_PER_DAY,
    seed: int = RANDOM_SEED,
) -> dict[str, pd.DataFrame]:
    """Generate synthetic hourly sensor time-series for every unit in the building.

    Args:
        building_metadata: Output of ``generate_building_metadata``.
        days: Number of days of history to simulate.
        readings_per_day: Sensor readings per day (24 = hourly).
        seed: RNG seed for reproducibility.

    Returns:
        Dict mapping unit_id -> sensor time-series DataFrame
        (columns: ``SENSOR_COLUMNS``).
    """
    rng = np.random.default_rng(seed)
    n_points = days * readings_per_day

    series_by_unit = {}
    for _, row in building_metadata.iterrows():
        unit_rng = np.random.default_rng(rng.integers(0, 2**31 - 1))
        series_by_unit[row["unit_id"]] = _simulate_sensor_series(
            unit_rng, n_points, row["status"], row["issue_type"]
        )
    return series_by_unit


def generate_alerts(
    building_metadata: pd.DataFrame,
    sensor_series: dict[str, pd.DataFrame],
    seed: int = RANDOM_SEED,
) -> pd.DataFrame:
    """Generate an alert feed from unhealthy units, with cost projections and predicted windows.

    Args:
        building_metadata: Output of ``generate_building_metadata``.
        sensor_series: Output of ``generate_sensor_timeseries``.
        seed: RNG seed for reproducibility.

    Returns:
        DataFrame sorted by severity (red first) with columns: unit_id, sensor,
        issue_type, severity, predicted_failure_days, fix_now_cost, emergency_cost,
        detected_at.
    """
    rng = np.random.default_rng(seed)
    issue_sensor_map = {
        "bearing_fault": "vibration_rms",
        "unbalanced_rotor": "vibration_rms",
        "misalignment": "vibration_rms",
        "pipe_leak": "pressure",
        "arc_fault": "current",
        "sensor_anomaly": "moisture",
    }

    rows = []
    for _, unit in building_metadata.iterrows():
        if unit["status"] == "green" or unit["issue_type"] is None:
            continue

        issue_type = unit["issue_type"]
        severity = unit["status"]
        predicted_days = int(rng.uniform(2, 10)) if severity == "red" else int(rng.uniform(10, 30))
        costs = COST_PROJECTIONS.get(issue_type, COST_PROJECTIONS["sensor_anomaly"])
        last_timestamp = sensor_series[unit["unit_id"]]["timestamp"].iloc[-1]

        rows.append(
            {
                "unit_id": unit["unit_id"],
                "sensor": issue_sensor_map.get(issue_type, "vibration_rms"),
                "issue_type": issue_type,
                "severity": severity,
                "predicted_failure_days": predicted_days,
                "fix_now_cost": costs["fix_now"],
                "emergency_cost": costs["emergency"],
                "detected_at": last_timestamp,
            }
        )

    alerts = pd.DataFrame(rows)
    if alerts.empty:
        return alerts
    severity_order = {"red": 0, "amber": 1, "green": 2}
    alerts["_sort"] = alerts["severity"].map(severity_order)
    alerts = alerts.sort_values(["_sort", "predicted_failure_days"]).drop(columns="_sort").reset_index(drop=True)
    return alerts


def generate_and_save_demo_data(seed: int = RANDOM_SEED) -> tuple[pd.DataFrame, dict[str, pd.DataFrame], pd.DataFrame]:
    """Generate the full synthetic demo dataset and write it to ``data/``.

    Writes ``building_metadata.csv``, ``alerts.csv``, and one CSV per unit under
    ``sensor_timeseries/`` so the Streamlit dashboard has real files to load.

    Args:
        seed: RNG seed for reproducibility.

    Returns:
        Tuple of (building_metadata, sensor_series_by_unit, alerts).
    """
    building_metadata = generate_building_metadata(seed=seed)
    sensor_series = generate_sensor_timeseries(building_metadata, seed=seed)
    alerts = generate_alerts(building_metadata, sensor_series, seed=seed)

    BUILDING_METADATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    building_metadata.to_csv(BUILDING_METADATA_PATH, index=False)
    alerts.to_csv(ALERTS_PATH, index=False)

    SENSOR_DATA_DIR.mkdir(parents=True, exist_ok=True)
    for unit_id, df in sensor_series.items():
        df.to_csv(SENSOR_DATA_DIR / f"{unit_id}.csv", index=False)

    return building_metadata, sensor_series, alerts


def load_demo_data() -> tuple[pd.DataFrame, dict[str, pd.DataFrame], pd.DataFrame]:
    """Load previously generated demo data from ``data/``, generating it if missing.

    Returns:
        Tuple of (building_metadata, sensor_series_by_unit, alerts) DataFrames.
    """
    if not BUILDING_METADATA_PATH.exists():
        return generate_and_save_demo_data()

    building_metadata = pd.read_csv(BUILDING_METADATA_PATH, dtype={"unit_id": str})
    alerts = pd.read_csv(ALERTS_PATH, dtype={"unit_id": str}) if ALERTS_PATH.exists() else pd.DataFrame()

    sensor_series = {}
    for unit_id in building_metadata["unit_id"]:
        path = SENSOR_DATA_DIR / f"{unit_id}.csv"
        if path.exists():
            sensor_series[str(unit_id)] = pd.read_csv(path, parse_dates=["timestamp"])

    return building_metadata, sensor_series, alerts
