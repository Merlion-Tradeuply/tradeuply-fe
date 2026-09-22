from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "brand" / "tradeuply-source.png"
OUTPUT_DIR = ROOT / "public" / "brand"


def trim_alpha(image: Image.Image, padding: int = 12) -> Image.Image:
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds is None:
        raise ValueError("The source image has no visible pixels.")

    left, top, right, bottom = bounds
    return image.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(image.width, right + padding),
            min(image.height, bottom + padding),
        )
    )


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    lockup = trim_alpha(source)
    lockup.save(OUTPUT_DIR / "tradeuply-logo.png", optimize=True)

    # The supplied lockup dedicates its left quarter to the T+U growth mark.
    icon_region = lockup.crop((0, 0, round(lockup.width * 0.27), lockup.height))
    icon = trim_alpha(icon_region, padding=8)
    icon.save(OUTPUT_DIR / "tradeuply-mark.png", optimize=True)

    for image, filename in (
        (lockup, "tradeuply-logo-light.png"),
        (icon, "tradeuply-mark-light.png"),
    ):
        pixels = image.load()
        for y in range(image.height):
            for x in range(image.width):
                red, green, blue, alpha = pixels[x, y]
                if alpha and green < 150:
                    pixels[x, y] = (242, 247, 252, alpha)
        image.save(OUTPUT_DIR / filename, optimize=True)


if __name__ == "__main__":
    main()
