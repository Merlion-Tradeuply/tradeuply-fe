from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DIR = ROOT / "design-reference"
TARGET_SIZE = (1440, 1024)


def main() -> None:
    source = Image.open(REFERENCE_DIR / "option-1-light.png").convert("RGB")
    implementation = Image.open(
        REFERENCE_DIR / "implementation-light-desktop-final.png"
    ).convert("RGB")

    source = source.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    implementation = implementation.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

    label_height = 54
    comparison = Image.new(
        "RGB", (TARGET_SIZE[0] * 2, TARGET_SIZE[1] + label_height), "#031a3b"
    )
    comparison.paste(source, (0, label_height))
    comparison.paste(implementation, (TARGET_SIZE[0], label_height))

    draw = ImageDraw.Draw(comparison)
    draw.text((24, 18), "SOURCE — OPTION 1 LIGHT", fill="#f5f8fb")
    draw.text((TARGET_SIZE[0] + 24, 18), "IMPLEMENTATION — FINAL", fill="#f5f8fb")

    comparison.save(REFERENCE_DIR / "comparison-light-final.png", optimize=True)


if __name__ == "__main__":
    main()
