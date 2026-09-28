"""Audio + vibration fusion classifier: one ResNet-18 branch hears the microphone, one feels 6 accelerometer axes."""

from pathlib import Path

import torch
import torch.nn as nn
from torchvision import models


def _branch(in_channels: int, pretrained: bool) -> nn.Module:
    """ResNet-18 trunk (fc removed) whose first conv takes `in_channels` spectrogram channels."""
    net = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None)
    old = net.conv1
    net.conv1 = nn.Conv2d(in_channels, 64, kernel_size=7, stride=2, padding=3, bias=False)
    with torch.no_grad():  # start from the ImageNet filters averaged over RGB
        net.conv1.weight.copy_(old.weight.mean(dim=1, keepdim=True).repeat(1, in_channels, 1, 1))
    net.fc = nn.Identity()
    return net


class FusionClassifier(nn.Module):
    """mode: 'fusion' (mic + vibration), 'audio' (mic only) or 'vibration' (accelerometers only)."""

    def __init__(self, num_classes: int, mode: str = "fusion", pretrained: bool = True) -> None:
        super().__init__()
        assert mode in ("fusion", "audio", "vibration")
        self.mode = mode
        self.audio = _branch(1, pretrained) if mode in ("fusion", "audio") else None
        self.vibration = _branch(6, pretrained) if mode in ("fusion", "vibration") else None
        width = 512 * (2 if mode == "fusion" else 1)
        self.head = nn.Sequential(nn.Dropout(0.3), nn.Linear(width, num_classes))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """x: (batch, 7, mels, frames) normalised features; channel 0 = mic, 1-6 = accelerometers."""
        feats = []
        if self.audio is not None:
            feats.append(self.audio(x[:, :1]))
        if self.vibration is not None:
            feats.append(self.vibration(x[:, 1:]))
        return self.head(torch.cat(feats, dim=1))


def save_fusion(model: FusionClassifier, mean, std, classes: list[str], path: str | Path) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save({"state_dict": model.state_dict(), "mode": model.mode, "mean": mean, "std": std, "classes": classes}, path)


def load_fusion(path: str | Path, device: str = "cpu") -> tuple[FusionClassifier, dict]:
    ckpt = torch.load(path, map_location=device, weights_only=False)
    model = FusionClassifier(len(ckpt["classes"]), ckpt["mode"], pretrained=False)
    model.load_state_dict(ckpt["state_dict"])
    return model.to(device).eval(), ckpt
