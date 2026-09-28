"""Convert data/raw_audio/<class>/*.wav into 1 s Mel spectrogram PNGs under data/spectrograms/<class>/.

Each output is named ``<recording>__s<k>.png`` so training can keep every segment of a recording on the
same side of the train/val split.

Usage:
    python make_spectrograms.py
"""

import sys
from pathlib import Path

import librosa

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wallsense.preprocessing.audio_features import compute_mel_spectrogram, save_spectrogram_image  # noqa: E402
from wallsense.utils.config import AUDIO_DURATION_SEC, RAW_AUDIO_DIR, SAMPLE_RATE, SOUND_CLASSES, SPECTROGRAM_DIR  # noqa: E402


def main() -> None:
    seg_len = int(SAMPLE_RATE * AUDIO_DURATION_SEC)
    for cls in SOUND_CLASSES:
        wavs = sorted((RAW_AUDIO_DIR / cls).glob("*.wav"))
        out_dir = SPECTROGRAM_DIR / cls
        count = 0
        for wav in wavs:
            y, _ = librosa.load(wav, sr=SAMPLE_RATE, mono=True)
            for k in range(len(y) // seg_len):
                out = out_dir / f"{wav.stem}__s{k}.png"
                if not out.exists():
                    save_spectrogram_image(compute_mel_spectrogram(y[k * seg_len:(k + 1) * seg_len]), out)
                count += 1
        print(f"{cls:18} {len(wavs):4} recordings -> {count:5} spectrograms")


if __name__ == "__main__":
    main()
