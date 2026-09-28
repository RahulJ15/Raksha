# WallSense

AI-powered internal apartment inspection system that detects infrastructure failures
inside walls using embedded sensors, combining a sound/vibration classifier and a
tabular sensor anomaly detector behind a Streamlit dashboard.

## Architecture

**Layer 1 — Sound/Vibration Classifier** (`models/sound_classifier.py`)
Raw audio/vibration is converted to Mel spectrograms (`preprocessing/audio_features.py`,
librosa, `n_mels=128`, `hop_length=512`) rendered as 224x224 images, then classified by
a ResNet-18 backbone pretrained on ImageNet with a new 6-class FC head:
`healthy_motor`, `bearing_fault`, `unbalanced_rotor`, `misalignment`, `pipe_leak`,
`arc_fault`. Fine-tuning unfreezes the last two residual blocks plus the new FC layer.
Output: predicted class, confidence, and a derived 0-100 equipment health score.

**Layer 2 — Anomaly Detector** (`models/anomaly_detector.py`)
Tabular sensor time-series (`timestamp, pressure, flow_rate, temperature, current,
vibration_rms, moisture`) are cleaned and windowed (`preprocessing/sensor_features.py`),
then scored by an Isolation Forest (primary, `contamination=0.05`, `n_estimators=200`)
and optionally an LSTM Autoencoder (encoder 64→32, decoder 32→64) trained on normal
data, using reconstruction error as an anomaly score. Scores map to green/amber/red
alerts via threshold bands in `utils/config.py`.

**Dashboard** (`dashboard/app.py`)
Streamlit app with four views: Building Overview (unit health grid), Unit Detail
(sensor trends + health gauge), Alert Feed (severity-sorted with cost projections),
and Analytics (trend analysis + 30-day failure predictions). Dark theme, Plotly charts.

## Quickstart

```bash
cd wallsense
pip install -r requirements.txt

# Launch the dashboard (auto-generates synthetic demo data on first run)
streamlit run dashboard/app.py
```

## Training on real data

```bash
# Sound classifier: expects data/spectrograms/<class_name>/*.png
# (or drop raw WAVs and convert them first with preprocessing/audio_features.py)
python train_sound.py --data-dir data/spectrograms

# Anomaly detector: expects data/sensor_timeseries/<unit_id>.csv
python train_anomaly.py --with-lstm
```

Both scripts fall back to synthetic data if the expected input directory is empty,
so they run end-to-end without any dataset present.

## Project layout

```
wallsense/
  data/                    # datasets (synthetic demo data auto-generated here)
  models/
    sound_classifier.py    # ResNet-18 transfer learning
    anomaly_detector.py    # Isolation Forest + LSTM Autoencoder
  preprocessing/
    audio_features.py      # audio/vibration -> Mel spectrogram images
    sensor_features.py     # sensor cleaning, windowing, feature extraction
  dashboard/
    app.py                 # Streamlit app (4 pages)
    components.py          # reusable widgets (cards, gauges, charts)
  utils/
    config.py              # paths, hyperparameters, thresholds
    data_loader.py         # Kaggle dataset loaders + synthetic demo data
  train_sound.py
  train_anomaly.py
  requirements.txt
```

## Suggested Kaggle datasets

- MIMII / ToyADMOS-style industrial sound datasets for Layer 1 fine-tuning.
- NASA bearing / pump sensor datasets for Layer 2 (map columns to
  `pressure, flow_rate, temperature, current, vibration_rms, moisture`).

Drop them under `data/` and point `--data-dir` at the right subfolder; no code
changes are needed as long as the class/column names line up with
`utils/config.py`.
