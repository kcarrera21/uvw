"""Full-bleed photo images for Google Discover and article structured data.

For every photo in src/data/photo-credits.json, writes three 1200px-wide JPEGs to
src/assets/discover/:  <key>-16x9.jpg (1200x675), <key>-4x3.jpg (1200x900), <key>-1x1.jpg (1200x1200).

Why: Discover favors large (1200px+), photo-led images and tells sites not to use a
logo. Our share cards are half text + logo, so articles point Google at these instead.
CC BY / BY-SA photos get a small on-image credit, because the image travels without the page.

Run after adding a photo:  python3 scripts/discover-images.py   (add --force to redo all)
Requires: Pillow.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "assets", "photos")
OUT = os.path.join(ROOT, "src", "assets", "discover")
SIZES = {"16x9": (1200, 675), "4x3": (1200, 900), "1x1": (1200, 1200)}
FORCE = "--force" in sys.argv

FONT_PATHS = ["/usr/share/fonts/opentype/inter/Inter-Medium.otf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
def font(size):
    for p in FONT_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def crop_to(im, w, h):
    # Landscape sources crop from the center; portrait sources keep a little more of the top,
    # where the subject usually sits.
    return ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, 0.5 if im.width >= im.height else 0.4))

def credit(im, p):
    text = f"Photo: {p.get('creator') or 'unknown'} · {p['license']}"
    d = ImageDraw.Draw(im, "RGBA")
    f = font(20)
    x0, y0, x1, y1 = d.textbbox((0, 0), text, font=f)
    tw, th = x1 - x0, y1 - y0
    x, y = im.width - tw - 18, im.height - th - 16
    d.rounded_rectangle((x - 10, y - 7, x + tw + 10, y + th + 9), radius=8, fill=(0, 0, 0, 110))
    d.text((x - x0, y - y0), text, font=f, fill=(255, 255, 255, 235))

photos = json.load(open(os.path.join(ROOT, "src", "data", "photo-credits.json")))
os.makedirs(OUT, exist_ok=True)
made, small = 0, []
for key, p in photos.items():
    src = os.path.join(SRC, key + ".webp")
    if not os.path.exists(src):
        print("missing source photo:", key); continue
    im = None
    for tag, (w, h) in SIZES.items():
        dst = os.path.join(OUT, f"{key}-{tag}.jpg")
        if os.path.exists(dst) and not FORCE:
            continue
        if im is None:
            im = Image.open(src).convert("RGB")
            if im.width < 1200:
                small.append(f"{key} ({im.width}x{im.height})")
        out = crop_to(im, w, h)
        if p["license"].startswith("CC BY"):
            credit(out, p)
        out.save(dst, "JPEG", quality=80, optimize=True, progressive=True)
        made += 1
print(f"wrote {made} images to src/assets/discover/")
if small:
    print("upscaled to 1200px (source under 1200px wide; replace with a larger original when you can):", ", ".join(small))
