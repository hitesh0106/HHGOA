#!/usr/bin/env python3
"""
Generate HH Goa 2026 brand assets:
- favicon.ico (multi-size)
- apple-icon.png (180x180)
- icon-192.png, icon-512.png
- og-image.png (1200x630)
- A small SVG -> PNG preview

Uses Pillow only — no external font files needed beyond what's installed.
"""
from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUTPUT_DIR = Path("/home/z/my-project/public")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.otf" if bold else "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.otf",
        "/usr/share/fonts/truetype/english/Tinos-Bold.ttf" if bold else "/usr/share/fonts/truetype/english/Tinos-Regular.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                continue
    return ImageFont.load_default()


def _emerald_palette():
    """Return palette hexes."""
    return {
        "emerald": (26, 107, 71),       # #1A6B47
        "emerald_deep": (6, 48, 30),    # #06301E
        "emerald_soft": (46, 139, 87),  # #2E8B57
        "forest": (15, 81, 50),         # #0F5132
        "gold": (245, 192, 74),         # #F5C04A
        "gold_deep": (201, 136, 28),    # #C9881C
        "gold_soft": (255, 231, 160),   # #FFE7A0
        "rose": (255, 107, 107),        # #FF6B6B
        "rose_deep": (220, 60, 60),     # #DC3C3C
        "rose_soft": (255, 200, 200),   # #FFC8C8
        "ivory": (250, 244, 229),       # #FAF4E5
        "cream": (245, 230, 211),       # #F5E6D3
        "sand": (230, 215, 195),        # #E6D7C3
    }


def draw_palm_frond(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float, palette: dict, flip: bool = False):
    """Draw a simple stylised palm frond at (cx, cy) with given scale."""
    import math as m
    rib_angle = -math.radians(28) if not flip else -math.radians(28) + math.pi
    rib_len = 80 * scale
    leaflets = 6
    leaf_color = palette["emerald_soft"]
    rib_color = palette["gold_deep"]
    # rib
    ex = cx + rib_len * math.cos(rib_angle)
    ey = cy + rib_len * math.sin(rib_angle)
    draw.line([(cx, cy), (ex, ey)], fill=rib_color, width=max(2, int(3 * scale)))
    # leaflets
    for i in range(leaflets):
        t = (i + 1) / (leaflets + 1)
        bx = cx + rib_len * t * math.cos(rib_angle)
        by = cy + rib_len * t * math.sin(rib_angle)
        leaf_len = (50 - i * 4) * scale
        for side in (-1, 1):
            angle = rib_angle + side * math.radians(60 - i * 4)
            tx = bx + leaf_len * math.cos(angle)
            ty = by + leaf_len * math.sin(angle)
            # leaflet as a thick tapered line + ellipse tip
            draw.line([(bx, by), (tx, ty)], fill=leaf_color, width=max(3, int(5 * scale)))
            r = max(2, int(3 * scale))
            draw.ellipse([tx - r, ty - r, tx + r, ty + r], fill=leaf_color)


def draw_icon(size: int) -> Image.Image:
    palette = _emerald_palette()
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rect background — emerald gradient (simulated with overlay)
    radius = max(8, int(size * 0.22))
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=palette["emerald_deep"] + (255,))
    # Subtle emerald soft overlay top-left
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([-size * 0.3, -size * 0.3, size * 0.7, size * 0.7], fill=palette["emerald"] + (90,))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Palm frond
    frond_scale = size / 64
    draw_palm_frond(draw, int(size * 0.28), int(size * 0.34), frond_scale * 0.9, palette)

    # Sun / sparkle gold orb top-right
    sun_r = int(size * 0.18)
    sx, sy = int(size * 0.72), int(size * 0.30)
    # Glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([sx - sun_r * 2, sy - sun_r * 2, sx + sun_r * 2, sy + sun_r * 2], fill=palette["gold"] + (60,))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=size * 0.04))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)
    draw.ellipse([sx - sun_r, sy - sun_r, sx + sun_r, sy + sun_r], fill=palette["gold"])
    # Inner sparkle
    sr = max(2, int(sun_r * 0.18))
    draw.line([(sx, sy - sun_r * 0.6), (sx, sy + sun_r * 0.6)], fill=palette["gold_soft"], width=max(2, int(size * 0.03)))
    draw.line([(sx - sun_r * 0.6, sy), (sx + sun_r * 0.6, sy)], fill=palette["gold_soft"], width=max(2, int(size * 0.03)))

    return img


def draw_og_image() -> Image.Image:
    """1200x630 OG image."""
    palette = _emerald_palette()
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), palette["ivory"] + (255,))
    draw = ImageDraw.Draw(img)

    # Mesh gradient (simulated with overlapping radial circles)
    for cx, cy, r, color, alpha in [
        (120, 80, 700, palette["emerald_soft"], 60),
        (1080, 60, 600, palette["gold"], 45),
        (960, 580, 700, palette["rose"], 40),
        (180, 540, 600, palette["emerald"], 35),
    ]:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
        layer = layer.filter(ImageFilter.GaussianBlur(radius=180))
        img = Image.alpha_composite(img, layer)
    draw = ImageDraw.Draw(img)

    # Dot pattern
    dot_color = palette["emerald_deep"] + (12,)
    for y in range(0, H, 28):
        for x in range(0, W, 28):
            draw.ellipse([x, y, x + 2, y + 2], fill=dot_color)

    # Big palm frond bottom-left
    draw_palm_frond(draw, 80, 470, 5.5, palette)
    # Palm frond top-right (flipped)
    frond = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frond)
    draw_palm_frond(fd, 1080, 70, 4.0, palette, flip=True)
    img = Image.alpha_composite(img, frond)
    draw = ImageDraw.Draw(img)

    # Wordmark
    title_font = _font(96, bold=True)
    sub_font = _font(28, bold=False)
    chip_font = _font(20, bold=True)

    # Edition chip
    chip_text = "BUILDERS · GOA · 2026"
    chip_pad_x, chip_pad_y = 20, 10
    chip_box = chip_font.getbbox(chip_text)
    chip_w = chip_box[2] - chip_box[0] + chip_pad_x * 2
    chip_h = chip_box[3] - chip_box[1] + chip_pad_y * 2
    chip_x, chip_y = 90, 110
    draw.rounded_rectangle(
        [chip_x, chip_y, chip_x + chip_w, chip_y + chip_h],
        radius=chip_h // 2,
        fill=palette["emerald_deep"] + (200,),
    )
    draw.text(
        (chip_x + chip_pad_x, chip_y + chip_pad_y - 4),
        chip_text,
        font=chip_font,
        fill=palette["gold"],
    )

    # Title
    draw.text((90, 180), "HH Goa 2026", font=title_font, fill=palette["emerald_deep"])
    # Subtitle line
    sub_font_lg = _font(54, bold=True)
    draw.text((92, 300), "Builder ID Generator", font=sub_font_lg, fill=palette["emerald"])
    # Description
    desc_font = _font(24, bold=False)
    desc_lines = [
        "Upload a photo. Get a random Builder Title + Fun Badge.",
        "QR code + unique ID on every card. 1080×1080 retina PNG.",
        "No login. No upload. Local only. Share to X with #FrameInGoa.",
    ]
    for i, line in enumerate(desc_lines):
        draw.text((92, 390 + i * 36), line, font=desc_font, fill=palette["emerald_deep"] + (200,))

    # Brand mark right side: palm + sun composition
    # Already drawn above.

    # Bottom hashtag
    tag_font = _font(22, bold=True)
    draw.text((92, H - 60), "#FrameInGoa", font=tag_font, fill=palette["gold_deep"])

    return img


def main():
    # Icons
    for size in (180, 192, 512):
        img = draw_icon(size)
        name = "apple-icon.png" if size == 180 else f"icon-{size}.png"
        img.save(OUTPUT_DIR / name, format="PNG", optimize=True)
        print(f"Wrote {name} ({size}x{size})")

    # favicon.ico (multi-size)
    icon16 = draw_icon(16)
    icon32 = draw_icon(32)
    icon48 = draw_icon(48)
    icon16.save(
        OUTPUT_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    # PIL quirk: write each size into the ico
    icon16.save(OUTPUT_DIR / "favicon.ico", format="ICO")
    print("Wrote favicon.ico")

    # OG image
    og = draw_og_image()
    og.save(OUTPUT_DIR / "og-image.png", format="PNG", optimize=True)
    print("Wrote og-image.png (1200x630)")


if __name__ == "__main__":
    main()
