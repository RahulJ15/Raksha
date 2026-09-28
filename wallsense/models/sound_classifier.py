"""ResNet-18 transfer-learning classifier for equipment sound/vibration spectrograms."""

from dataclasses import dataclass
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset
from torchvision import models, transforms
from PIL import Image

from wallsense.utils.config import NUM_SOUND_CLASSES, SOUND_CLASSES, SOUND_FROZEN_LAYERS

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

INFERENCE_TRANSFORM = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ]
)

TRAIN_TRANSFORM = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ]
)


class SoundClassifier(nn.Module):
    """ResNet-18 pretrained on ImageNet with a new FC head for equipment fault classes."""

    def __init__(self, num_classes: int = NUM_SOUND_CLASSES, pretrained: bool = True) -> None:
        super().__init__()
        weights = models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
        self.backbone = models.resnet18(weights=weights)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Run a forward pass.

        Args:
            x: Batch of images, shape (B, 3, 224, 224).

        Returns:
            Raw class logits, shape (B, num_classes).
        """
        return self.backbone(x)

    def freeze_for_finetuning(self, frozen_prefixes: tuple[str, ...] = SOUND_FROZEN_LAYERS) -> None:
        """Freeze early layers, leaving the last residual blocks + FC head trainable.

        Args:
            frozen_prefixes: Parameter name prefixes to freeze (e.g. conv1/bn1/layer1),
                mirroring "fine-tune the last 2 residual blocks + new FC".
        """
        for name, param in self.backbone.named_parameters():
            param.requires_grad = not name.startswith(frozen_prefixes)

    def trainable_parameters(self):
        """Yield parameters with ``requires_grad=True``, for constructing the optimizer."""
        return (p for p in self.parameters() if p.requires_grad)


class SpectrogramImageDataset(Dataset):
    """Dataset of pre-rendered Mel spectrogram PNGs labeled by equipment fault class."""

    def __init__(self, samples: list[tuple[Path, int]], train: bool = False) -> None:
        """
        Args:
            samples: List of (image_path, class_index) pairs.
            train: If True, apply light training-time augmentation.
        """
        self.samples = samples
        self.transform = TRAIN_TRANSFORM if train else INFERENCE_TRANSFORM

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> tuple[torch.Tensor, int]:
        path, label = self.samples[idx]
        image = Image.open(path).convert("RGB")
        return self.transform(image), label


@dataclass
class Prediction:
    """A single sound-classifier prediction with derived health score."""

    predicted_class: str
    confidence: float
    class_probabilities: dict[str, float]
    health_score: float


def health_score_from_prediction(predicted_class: str, confidence: float) -> float:
    """Derive a 0-100 equipment health score from the predicted class and confidence.

    ``healthy`` maps to a high score scaled by confidence; any fault class maps
    to a low score, penalized further by how confident the model is in that fault.

    Args:
        predicted_class: One of ``SOUND_CLASSES``.
        confidence: Softmax probability of the predicted class, in [0, 1].

    Returns:
        Health score in [0, 100], higher is healthier.
    """
    if predicted_class == "healthy":
        return round(60.0 + 40.0 * confidence, 1)
    return round(max(0.0, 50.0 - 50.0 * confidence), 1)


@torch.no_grad()
def predict(model: SoundClassifier, image: Image.Image, device: str = "cpu") -> Prediction:
    """Run inference on a single spectrogram image.

    Args:
        model: A trained (or randomly initialized, for demo) ``SoundClassifier``.
        image: Spectrogram PIL image.
        device: Torch device string.

    Returns:
        A ``Prediction`` with class label, confidence, full probability distribution,
        and a derived equipment health score.
    """
    model.eval()
    tensor = INFERENCE_TRANSFORM(image.convert("RGB")).unsqueeze(0).to(device)
    logits = model(tensor)
    probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    class_probabilities = {cls: float(p) for cls, p in zip(SOUND_CLASSES, probs)}
    top_idx = int(probs.argmax())
    predicted_class = SOUND_CLASSES[top_idx]
    confidence = float(probs[top_idx])

    return Prediction(
        predicted_class=predicted_class,
        confidence=confidence,
        class_probabilities=class_probabilities,
        health_score=health_score_from_prediction(predicted_class, confidence),
    )


def save_checkpoint(model: SoundClassifier, path: str | Path) -> None:
    """Save model weights to disk.

    Args:
        model: The model to save.
        path: Destination file path (parent directories are created).
    """
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), path)


def load_checkpoint(path: str | Path, device: str = "cpu") -> SoundClassifier:
    """Load a ``SoundClassifier`` from a saved checkpoint.

    Args:
        path: Path to a state-dict file saved by ``save_checkpoint``.
        device: Torch device to map the weights onto.

    Returns:
        A ``SoundClassifier`` with loaded weights, in eval mode.
    """
    model = SoundClassifier(pretrained=False)
    state_dict = torch.load(path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model
