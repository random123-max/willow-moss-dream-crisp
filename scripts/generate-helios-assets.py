#!/usr/bin/env python3
"""Helios Crew — original Minecraft-style pixel art + Education add-on."""
from __future__ import annotations

import json
import random
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path("/workspace")
ADDON = ROOT / "addon_build" / "HeliosCrew"
RP = ADDON / "HeliosCrew_RP"
BP = ADDON / "HeliosCrew_BP"
GAME = ROOT / "public" / "game"

RP_HEADER = "9367231e-5b07-4bed-824a-efcf6dfdbfaa"
RP_MODULE = "18102146-174c-466f-9d99-97c6406433cd"
BP_HEADER = "ae0aa3af-edae-4a78-8629-9a088269613e"
BP_MODULE = "c854bde7-7047-401c-b055-62935fc6fa99"

ATLAS_ORDER = [
    "grass_top",
    "grass_side",
    "dirt",
    "stone",
    "cobblestone",
    "sand",
    "log_oak",
    "log_top",
    "planks",
    "leaves_oak",
    "glass",
    "glowstone",
    "diamond_ore",
    "ice",
    "metal",
    "roof",
    "wool_colored_white",
    "bedrock",
    "gravel",
    "crystal",
    "bricks",
    "gold_ore",
    "crafting",
    "lamp_side",
]


def clamp(v: int) -> int:
    return max(0, min(255, v))


def px(im: Image.Image, x: int, y: int, c) -> None:
    if 0 <= x < im.width and 0 <= y < im.height:
        if len(c) == 3:
            im.putpixel((x, y), (*c, 255))
        else:
            im.putpixel((x, y), c)


def fill(im: Image.Image, x: int, y: int, w: int, h: int, c) -> None:
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            px(im, xx, yy, c)


def shade(c, d: int):
    return tuple(clamp(v + d) for v in c[:3]) + ((c[3],) if len(c) == 4 else (255,))


def save(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG")


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")


def noise_tex(base, shades, seed: int, holes=False) -> Image.Image:
    rng = random.Random(seed)
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0 if holes else 255))
    palette = [base] + shades
    for y in range(16):
        for x in range(16):
            if holes and rng.random() < 0.18:
                continue
            c = palette[rng.randrange(len(palette))]
            # slight baked highlight top-left / shadow bottom-right
            d = (7 - x) // 4 + (7 - y) // 5
            px(im, x, y, shade(c, d))
    return im


def cobble_tex() -> Image.Image:
    mortar = (52, 54, 60)
    im = Image.new("RGBA", (16, 16), (*mortar, 255))
    stones = [
        (0, 0, 7, 5, (118, 120, 128)),
        (8, 0, 8, 6, (96, 100, 108)),
        (0, 6, 5, 5, (108, 110, 118)),
        (6, 6, 10, 4, (88, 90, 98)),
        (0, 12, 8, 4, (102, 104, 112)),
        (9, 11, 7, 5, (120, 122, 128)),
        (5, 4, 4, 3, (84, 86, 94)),
    ]
    rng = random.Random(11)
    for x, y, w, h, c in stones:
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                d = rng.randint(-8, 8) + (4 if yy == y or xx == x else 0)
                if yy == y + h - 1 or xx == x + w - 1:
                    d -= 14
                px(im, xx, yy, shade(c, d))
    return im


def grass_top() -> Image.Image:
    rng = random.Random(3)
    shades = [(46, 130, 118), (38, 108, 98), (62, 158, 142), (28, 86, 78), (72, 170, 150)]
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 255))
    for y in range(16):
        for x in range(16):
            c = shades[(x * 3 + y * 5 + rng.randint(0, 2)) % len(shades)]
            px(im, x, y, c)
    # a few pale seed-heads
    for _ in range(7):
        px(im, rng.randint(0, 15), rng.randint(0, 15), (190, 220, 160))
    return im


def grass_side(dirt: Image.Image) -> Image.Image:
    im = dirt.copy()
    overlay = [(46, 130, 118), (38, 108, 98), (62, 158, 142)]
    rng = random.Random(4)
    for x in range(16):
        h = 3 + (x * 3 + 2) % 3
        for y in range(h):
            px(im, x, y, overlay[(x + y) % 3])
        px(im, x, h, shade((90, 70, 50), -10))
        if rng.random() > 0.6:
            px(im, x, h + 1, overlay[0])
    return im


def dirt_tex() -> Image.Image:
    return noise_tex((118, 86, 58), [(102, 74, 48), (136, 102, 70), (90, 64, 42), (124, 94, 64)], 1)


def stone_tex() -> Image.Image:
    return noise_tex((125, 125, 125), [(110, 110, 110), (140, 140, 140), (118, 118, 122), (132, 132, 128)], 5)


def sand_tex() -> Image.Image:
    return noise_tex((196, 178, 128), [(184, 166, 114), (210, 192, 142), (172, 156, 108)], 6)


def gravel_tex() -> Image.Image:
    return noise_tex((127, 127, 127), [(96, 96, 96), (150, 148, 146), (110, 108, 106), (88, 86, 84)], 7)


def log_side() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 255))
    cols = [(54, 42, 30), (70, 54, 38), (42, 32, 22), (62, 48, 34)]
    for x in range(16):
        c = cols[x % len(cols)]
        for y in range(16):
            d = -8 if y % 5 == 0 else (4 if x in (0, 15) else 0)
            px(im, x, y, shade(c, d))
    # cyan sap streaks
    for y in (3, 9, 14):
        px(im, 5, y, (62, 200, 180))
        px(im, 11, y + 1, (62, 200, 180))
    return im


def log_top() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (70, 54, 38, 255))
    rings = [(90, 72, 50), (54, 42, 30), (120, 96, 64), (42, 32, 22)]
    cx, cy = 7.5, 7.5
    for y in range(16):
        for x in range(16):
            r = int(((x - cx) ** 2 + (y - cy) ** 2) ** 0.5)
            if r < 2:
                px(im, x, y, (62, 180, 160))
            elif r < 8:
                px(im, x, y, rings[r % len(rings)])
            else:
                px(im, x, y, (54, 42, 30))
    return im


def planks_tex() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 255))
    board = [(166, 134, 84), (150, 118, 72), (180, 146, 94)]
    for y in range(16):
        row = board[0] if y < 4 or 8 <= y < 12 else board[1]
        for x in range(16):
            c = row if x % 8 != 7 else (90, 70, 44)
            if y in (3, 7, 11, 15):
                c = (90, 70, 44)
            d = 8 if x % 8 == 0 else 0
            px(im, x, y, shade(c, d))
    return im


def leaves_tex() -> Image.Image:
    return noise_tex(
        (32, 120, 108),
        [(24, 96, 88), (48, 150, 132), (20, 80, 72), (70, 190, 160)],
        14,
        holes=True,
    )


def glass_tex() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (80, 200, 210, 170))
    frame = (180, 240, 245, 220)
    for i in range(16):
        px(im, i, 0, frame)
        px(im, i, 15, frame)
        px(im, 0, i, frame)
        px(im, 15, i, frame)
    fill(im, 7, 2, 1, 12, (200, 255, 255, 90))
    return im


def glow_tex() -> Image.Image:
    im = noise_tex((220, 170, 60), [(255, 210, 90), (180, 120, 30), (255, 240, 160)], 17)
    fill(im, 5, 5, 6, 6, (255, 250, 200))
    return im


def ore_tex(speck) -> Image.Image:
    im = stone_tex()
    rng = random.Random(hash(speck) & 0xFFFF)
    for _ in range(14):
        x, y = rng.randint(1, 14), rng.randint(1, 14)
        px(im, x, y, speck)
        px(im, x + 1, y, shade(speck, -20))
        px(im, x, y + 1, shade(speck, -30))
    return im


def ice_tex() -> Image.Image:
    im = noise_tex((140, 198, 220), [(170, 220, 235), (110, 170, 200), (200, 240, 250)], 20)
    for i in range(16):
        px(im, i, i % 16, (230, 250, 255))
        px(im, (i + 6) % 16, i, (180, 230, 240, 200))
    return im


def metal_tex() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (72, 84, 96, 255))
    for y in range(16):
        for x in range(16):
            panel = 10 if (x // 8 + y // 8) % 2 == 0 else 0
            if x in (0, 7, 8, 15) or y in (0, 7, 8, 15):
                panel = -24
            px(im, x, y, shade((78, 92, 108), panel))
    fill(im, 3, 3, 2, 2, (62, 224, 208))
    fill(im, 11, 11, 2, 2, (62, 224, 208))
    return im


def roof_tex() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (92, 48, 42, 255))
    for y in range(16):
        for x in range(16):
            c = (108, 56, 48) if (x + y // 2) % 4 < 2 else (84, 40, 36)
            if y % 4 == 0:
                c = (70, 32, 30)
            px(im, x, y, c)
    return im


def wool_tex() -> Image.Image:
    return noise_tex((214, 220, 226), [(198, 206, 214), (230, 234, 238), (186, 192, 200)], 15)


def bedrock_tex() -> Image.Image:
    return noise_tex((28, 28, 32), [(18, 18, 22), (48, 50, 56), (10, 10, 12), (70, 72, 78)], 22)


def crystal_tex() -> Image.Image:
    im = noise_tex((24, 48, 62), [(18, 36, 48), (40, 80, 96)], 30)
    d = ImageDraw.Draw(im)
    d.polygon([(8, 1), (12, 8), (8, 15), (4, 8)], fill=(80, 255, 230, 255))
    fill(im, 7, 6, 2, 4, (255, 255, 255))
    return im


def bricks_tex() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (40, 28, 28, 255))
    brick = (148, 72, 58)
    for y in range(16):
        offset = 4 if (y // 4) % 2 else 0
        for x in range(16):
            if y % 4 == 3:
                px(im, x, y, (48, 32, 30))
            elif (x + offset) % 8 == 7:
                px(im, x, y, (48, 32, 30))
            else:
                px(im, x, y, shade(brick, (x % 3) * 4))
    return im


def crafting_tex() -> Image.Image:
    im = planks_tex()
    fill(im, 2, 2, 12, 12, (90, 70, 44))
    fill(im, 3, 3, 10, 10, (62, 48, 32))
    # grid
    fill(im, 3, 6, 10, 1, (166, 134, 84))
    fill(im, 3, 10, 10, 1, (166, 134, 84))
    fill(im, 6, 3, 1, 10, (166, 134, 84))
    fill(im, 10, 3, 1, 10, (166, 134, 84))
    fill(im, 7, 7, 2, 2, (62, 224, 208))
    return im


def lamp_side() -> Image.Image:
    im = metal_tex()
    fill(im, 4, 4, 8, 8, (255, 220, 120))
    fill(im, 6, 6, 4, 4, (255, 250, 220))
    return im


def obsidian_tex() -> Image.Image:
    return noise_tex((18, 12, 36), [(8, 6, 20), (40, 24, 70), (12, 8, 28), (70, 40, 120)], 8)


def netherrack_tex() -> Image.Image:
    return noise_tex((88, 36, 36), [(70, 24, 24), (120, 48, 40), (60, 20, 20)], 18)


def end_stone_tex() -> Image.Image:
    return noise_tex((200, 196, 140), [(180, 176, 120), (220, 216, 160), (160, 158, 110)], 19)


def snow_tex() -> Image.Image:
    return noise_tex((236, 240, 244), [(220, 226, 232), (255, 255, 255), (210, 216, 222)], 21)


def item16(kind: str) -> Image.Image:
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    rng = random.Random(kind)
    d = ImageDraw.Draw(im)
    if kind == "moon_rock":
        d.ellipse((2, 3, 13, 14), fill=(168, 158, 146))
        d.ellipse((5, 6, 9, 10), fill=(90, 90, 88))
        px(im, 7, 7, (80, 255, 220))
    elif kind == "star_crystal":
        d.polygon([(8, 1), (11, 6), (15, 8), (11, 10), (8, 15), (5, 10), (1, 8), (5, 6)], fill=(70, 240, 220))
        fill(im, 7, 7, 2, 2, (255, 255, 255))
    elif kind == "signal_core":
        fill(im, 4, 2, 8, 12, (48, 56, 68))
        fill(im, 6, 4, 4, 4, (255, 106, 61))
        fill(im, 6, 9, 4, 3, (62, 224, 208))
        fill(im, 7, 1, 2, 2, (200, 210, 220))
    elif kind == "crew_visor":
        fill(im, 1, 5, 14, 7, (36, 44, 56))
        fill(im, 2, 6, 12, 5, (40, 230, 210))
        fill(im, 2, 6, 12, 1, (200, 255, 250))
        fill(im, 1, 5, 2, 2, (90, 100, 110))
        fill(im, 13, 5, 2, 2, (90, 100, 110))
    elif kind == "ration":
        fill(im, 3, 4, 10, 9, (96, 72, 48))
        fill(im, 4, 5, 8, 3, (255, 106, 61))
        fill(im, 4, 9, 8, 3, (62, 224, 208))
    elif kind == "astro_compass":
        d.ellipse((2, 2, 13, 13), fill=(48, 56, 68))
        d.ellipse((4, 4, 11, 11), fill=(20, 28, 36))
        d.polygon([(8, 3), (9, 8), (8, 8)], fill=(255, 80, 60))
        d.polygon([(8, 12), (7, 8), (8, 8)], fill=(220, 230, 240))
        px(im, 8, 8, (62, 224, 208))
    elif kind == "fuel_cell":
        fill(im, 5, 1, 6, 14, (48, 56, 68))
        fill(im, 6, 3, 4, 10, (80, 255, 180))
        fill(im, 6, 3, 4, 2, (200, 255, 220))
    else:
        for y in range(2, 14):
            for x in range(2, 14):
                px(im, x, y, shade((80, 90, 110), rng.randint(-10, 10)))
    return im


# --- entity skins ---
def paint_head(im, ox, oy, skin, visor, visor_dark, crack=True):
    noise = noise_tex
    # Use fills for classic 64x64 layout
    fill(im, ox + 8, oy + 0, 8, 8, visor)  # top
    fill(im, ox + 16, oy + 0, 8, 8, visor_dark)
    fill(im, ox + 0, oy + 8, 8, 8, visor)
    fill(im, ox + 8, oy + 8, 8, 8, skin)  # face
    fill(im, ox + 16, oy + 8, 8, 8, visor)
    fill(im, ox + 24, oy + 8, 8, 8, visor_dark)
    # helmet rim
    fill(im, ox + 8, oy + 8, 8, 2, visor)
    # visor glass
    fill(im, ox + 9, oy + 11, 6, 4, (40, 230, 210, 240))
    fill(im, ox + 9, oy + 11, 6, 1, (180, 255, 250, 255))
    fill(im, ox + 10, oy + 12, 1, 2, (255, 70, 50, 255))
    fill(im, ox + 13, oy + 12, 1, 2, (255, 70, 50, 255))
    if crack:
        px(im, ox + 12, oy + 10, (220, 240, 240))
        px(im, ox + 13, oy + 11, (220, 240, 240))
        px(im, ox + 14, oy + 12, (200, 220, 220))


def paint_body(im, suit, stripe, dark):
    fill(im, 0, 16, 4, 12, suit)  # R leg
    fill(im, 4, 16, 4, 12, shade(suit, -12))
    fill(im, 16, 16, 8, 12, suit)  # body
    fill(im, 16, 20, 8, 2, stripe)
    fill(im, 19, 18, 2, 2, (40, 230, 210))
    fill(im, 40, 16, 4, 12, suit)  # R arm
    fill(im, 40, 20, 4, 1, stripe)
    fill(im, 16, 48, 4, 12, suit)  # L leg
    fill(im, 32, 48, 4, 12, suit)  # L arm
    fill(im, 32, 52, 4, 1, stripe)
    fill(im, 32, 0, 8, 8, dark)  # hat overlay
    fill(im, 40, 8, 8, 8, (*dark[:3], 180))
    # boots
    fill(im, 0, 26, 4, 2, dark)
    fill(im, 16, 58, 4, 2, dark)


def zombie_skin(kind="astro") -> Image.Image:
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    if kind == "astro":
        skin, suit, stripe, visor, vdark = (92, 140, 92), (48, 56, 68), (255, 106, 61), (70, 82, 96), (32, 38, 48)
    elif kind == "husk":
        skin, suit, stripe, visor, vdark = (180, 150, 90), (120, 100, 70), (220, 160, 40), (90, 70, 40), (50, 40, 24)
    else:
        skin, suit, stripe, visor, vdark = (40, 90, 110), (20, 40, 70), (80, 220, 255), (20, 50, 90), (10, 20, 40)
    paint_head(im, 0, 0, skin, visor, vdark)
    paint_body(im, suit, stripe, visor)
    return im


def skeleton_skin(kind="void") -> Image.Image:
    im = Image.new("RGBA", (64, 32), (0, 0, 0, 0))
    bone = (220, 228, 232) if kind != "dark" else (40, 42, 48)
    helm = (50, 58, 70) if kind != "dark" else (22, 22, 26)
    fill(im, 8, 0, 8, 8, helm)
    fill(im, 0, 8, 8, 8, helm)
    fill(im, 8, 8, 8, 8, bone)
    fill(im, 16, 8, 8, 8, helm)
    fill(im, 24, 8, 8, 8, shade(helm, -10))
    fill(im, 9, 11, 6, 3, (80, 255, 220))
    px(im, 10, 12, (20, 20, 20))
    px(im, 13, 12, (20, 20, 20))
    fill(im, 16, 16, 8, 12, (70, 78, 92))
    fill(im, 16, 20, 8, 1, (80, 255, 220))
    fill(im, 0, 16, 4, 12, bone)
    fill(im, 40, 16, 4, 12, bone)
    return im


def creeper_skin() -> Image.Image:
    im = Image.new("RGBA", (64, 32), (0, 0, 0, 0))
    body = (22, 30, 52)
    glow = (80, 255, 220)
    for box in [(8, 0, 8, 8), (0, 8, 8, 8), (8, 8, 8, 8), (16, 8, 8, 8), (24, 8, 8, 8), (16, 16, 8, 12)]:
        fill(im, *box, body)
    fill(im, 10, 10, 2, 2, glow)
    fill(im, 14, 10, 2, 2, glow)
    fill(im, 11, 13, 4, 3, glow)
    fill(im, 12, 16, 1, 2, glow)
    fill(im, 18, 20, 4, 4, glow)
    for ox in (0, 4, 8, 12):
        fill(im, ox, 16, 4, 6, (16, 22, 40))
    return im


def spider_skin() -> Image.Image:
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    body = (22, 18, 48)
    fill(im, 32, 4, 8, 8, body)
    fill(im, 40, 12, 8, 8, body)
    fill(im, 42, 14, 2, 2, (180, 80, 255))
    fill(im, 45, 14, 2, 2, (180, 80, 255))
    fill(im, 0, 16, 64, 16, (32, 26, 60))
    return im


def enderman_skin() -> Image.Image:
    im = Image.new("RGBA", (64, 32), (10, 10, 16, 255))
    fill(im, 8, 10, 8, 3, (160, 70, 220))
    fill(im, 9, 11, 2, 1, (255, 230, 255))
    fill(im, 13, 11, 2, 1, (255, 230, 255))
    return im


def slime_skin() -> Image.Image:
    im = Image.new("RGBA", (64, 32), (48, 210, 170, 170))
    fill(im, 10, 10, 3, 3, (20, 40, 40, 255))
    fill(im, 18, 10, 3, 3, (20, 40, 40, 255))
    fill(im, 12, 18, 8, 2, (20, 40, 40, 200))
    return im


def ghast_skin() -> Image.Image:
    im = Image.new("RGBA", (64, 32), (0, 0, 0, 0))
    fill(im, 0, 0, 64, 32, (226, 232, 240))
    fill(im, 16, 12, 4, 4, (40, 40, 80))
    fill(im, 28, 12, 4, 4, (40, 40, 80))
    fill(im, 20, 22, 8, 3, (80, 40, 100))
    return im


def pack_icon() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (7, 16, 24, 255))
    d = ImageDraw.Draw(im)
    rng = random.Random(42)
    for _ in range(90):
        x, y = rng.randint(0, 255), rng.randint(0, 255)
        s = rng.randint(1, 2)
        d.ellipse((x, y, x + s, y + s), fill=(200, 230, 255, 200))
    # gift box
    d.rounded_rectangle((58, 88, 198, 214), radius=12, fill=(48, 62, 78))
    d.rectangle((58, 88, 198, 128), fill=(62, 80, 98))
    d.rectangle((118, 88, 138, 214), fill=(62, 224, 208))
    d.rectangle((58, 128, 198, 146), fill=(62, 224, 208))
    d.polygon([(128, 58), (168, 96), (128, 88), (88, 96)], fill=(255, 106, 61))
    d.ellipse((96, 36, 160, 100), fill=(180, 174, 160))
    d.ellipse((108, 48, 128, 66), fill=(120, 114, 100))
    return im


def item_json(identifier: str, name: str, icon: str, extra=None) -> dict:
    comps = {
        "minecraft:max_stack_size": 64,
        "minecraft:icon": icon,
        "minecraft:display_name": {"value": name},
    }
    if extra:
        comps.update(extra)
    return {
        "format_version": "1.20.50",
        "minecraft:item": {
            "description": {"identifier": identifier, "menu_category": {"category": "items"}},
            "components": comps,
        },
    }


def block_json(identifier: str, texture: str, destroy: float, map_color: str, extras=None) -> dict:
    mats = {"*": {"texture": texture, "render_method": "opaque"}}
    if extras and "materials" in extras:
        mats = extras.pop("materials")
    comps = {
        "minecraft:destructible_by_mining": {"seconds_to_destroy": destroy},
        "minecraft:destructible_by_explosion": {"explosion_resistance": 3},
        "minecraft:map_color": map_color,
        "minecraft:material_instances": mats,
        "minecraft:collision_box": True,
        "minecraft:selection_box": True,
    }
    if extras:
        comps.update(extras)
    return {
        "format_version": "1.20.50",
        "minecraft:block": {
            "description": {
                "identifier": identifier,
                "menu_category": {"category": "construction"},
            },
            "components": comps,
        },
    }


def recipe_shaped(identifier, pattern, keys, result, count=1):
    return {
        "format_version": "1.20.50",
        "minecraft:recipe_shaped": {
            "description": {"identifier": identifier},
            "tags": ["crafting_table"],
            "pattern": pattern,
            "key": keys,
            "result": {"item": result, "count": count},
        },
    }


def recipe_shapeless(identifier, ingredients, result, count=1):
    return {
        "format_version": "1.20.50",
        "minecraft:recipe_shapeless": {
            "description": {"identifier": identifier},
            "tags": ["crafting_table"],
            "ingredients": ingredients,
            "result": {"item": result, "count": count},
        },
    }


def loot_extra(vanilla_item, extra_item, extra_max=2):
    return {
        "pools": [
            {
                "rolls": 1,
                "entries": [
                    {
                        "type": "item",
                        "name": vanilla_item,
                        "weight": 1,
                        "functions": [
                            {"function": "set_count", "count": {"min": 0, "max": 2}},
                            {"function": "looting_enchant", "count": {"min": 0, "max": 1}},
                        ],
                    }
                ],
            },
            {
                "rolls": 1,
                "entries": [
                    {
                        "type": "item",
                        "name": extra_item,
                        "weight": 1,
                        "functions": [{"function": "set_count", "count": {"min": 0, "max": extra_max}}],
                    }
                ],
            },
        ]
    }


def main() -> None:
    for p in (RP, BP, GAME):
        p.mkdir(parents=True, exist_ok=True)

    write_json(
        RP / "manifest.json",
        {
            "format_version": 2,
            "header": {
                "name": "Helios Crew Visuals",
                "description": "Space resource pack for Minecraft Education — lunar crust, starwood, visor undead. Original art.",
                "uuid": RP_HEADER,
                "version": [1, 1, 0],
                "min_engine_version": [1, 20, 0],
            },
            "modules": [{"type": "resources", "uuid": RP_MODULE, "version": [1, 1, 0]}],
        },
    )
    write_json(
        BP / "manifest.json",
        {
            "format_version": 2,
            "header": {
                "name": "Helios Crew Systems",
                "description": "Custom Helios blocks, gear, recipes, drops, and a starter kit function. Pair with Helios Crew Visuals.",
                "uuid": BP_HEADER,
                "version": [1, 1, 0],
                "min_engine_version": [1, 20, 0],
            },
            "modules": [{"type": "data", "uuid": BP_MODULE, "version": [1, 1, 0]}],
            "dependencies": [{"uuid": RP_HEADER, "version": [1, 1, 0]}],
        },
    )

    icon = pack_icon()
    save(icon, RP / "pack_icon.png")
    save(icon, BP / "pack_icon.png")
    save(icon.resize((64, 64), Image.NEAREST), GAME / "pack_icon.png")

    skins = {
        "textures/entity/zombie/zombie.png": zombie_skin("astro"),
        "textures/entity/zombie/husk.png": zombie_skin("husk"),
        "textures/entity/zombie/drowned.png": zombie_skin("void"),
        "textures/entity/husk/husk.png": zombie_skin("husk"),
        "textures/entity/zombie_villager/zombie_villager.png": zombie_skin("astro"),
        "textures/entity/skeleton/skeleton.png": skeleton_skin("void"),
        "textures/entity/skeleton/stray.png": skeleton_skin("void"),
        "textures/entity/skeleton/wither_skeleton.png": skeleton_skin("dark"),
        "textures/entity/creeper/creeper.png": creeper_skin(),
        "textures/entity/spider/spider.png": spider_skin(),
        "textures/entity/cave_spider/cave_spider.png": spider_skin(),
        "textures/entity/enderman/enderman.png": enderman_skin(),
        "textures/entity/slime/slime.png": slime_skin(),
        "textures/entity/ghast/ghast.png": ghast_skin(),
    }
    for rel, im in skins.items():
        save(im, RP / rel)
        save(im, GAME / Path(rel).name)

    dirt = dirt_tex()
    blocks = {
        "dirt": dirt,
        "grass_side": grass_side(dirt),
        "grass_top": grass_top(),
        "stone": stone_tex(),
        "cobblestone": cobble_tex(),
        "sand": sand_tex(),
        "gravel": gravel_tex(),
        "obsidian": obsidian_tex(),
        "iron_ore": ore_tex((220, 230, 240)),
        "gold_ore": ore_tex((255, 200, 60)),
        "diamond_ore": ore_tex((80, 255, 230)),
        "coal_ore": ore_tex((20, 20, 22)),
        "log_oak": log_side(),
        "log_top": log_top(),
        "leaves_oak": leaves_tex(),
        "planks": planks_tex(),
        "wool_colored_white": wool_tex(),
        "glass": glass_tex(),
        "glowstone": glow_tex(),
        "netherrack": netherrack_tex(),
        "end_stone": end_stone_tex(),
        "ice": ice_tex(),
        "snow": snow_tex(),
        "bedrock": bedrock_tex(),
        "metal": metal_tex(),
        "roof": roof_tex(),
        "crystal": crystal_tex(),
        "bricks": bricks_tex(),
        "crafting": crafting_tex(),
        "lamp_side": lamp_side(),
    }
    # extra vanilla-path aliases used by Education
    blocks["planks_oak"] = blocks["planks"]

    for name, im in blocks.items():
        save(im, RP / "textures" / "blocks" / f"{name}.png")
        save(im, GAME / "blocks" / f"{name}.png")

    # custom helios_* copies for custom block textures
    custom_map = {
        "helios_crust_top": "grass_top",
        "helios_crust_side": "grass_side",
        "helios_regolith": "dirt",
        "helios_basalt": "stone",
        "helios_starwood_log": "log_oak",
        "helios_starwood_top": "log_top",
        "helios_starwood_planks": "planks",
        "helios_crystal_leaves": "leaves_oak",
        "helios_void_glass": "glass",
        "helios_beacon_lamp": "glowstone",
        "helios_star_ore": "diamond_ore",
        "helios_habitat_plate": "metal",
        "helios_comms_tile": "roof",
        "helios_lunar_ice": "ice",
        "helios_ejecta": "gravel",
        "helios_crystal_block": "crystal",
    }
    for dest, src in custom_map.items():
        save(blocks[src], RP / "textures" / "blocks" / f"{dest}.png")

    items = {
        "moon_rock": item16("moon_rock"),
        "star_crystal": item16("star_crystal"),
        "signal_core": item16("signal_core"),
        "crew_visor": item16("crew_visor"),
        "crew_ration": item16("ration"),
        "astro_compass": item16("astro_compass"),
        "fuel_cell": item16("fuel_cell"),
    }
    for name, im in items.items():
        save(im, RP / "textures" / "items" / f"{name}.png")
        save(im, GAME / "items" / f"{name}.png")

    texture_data = {k: {"textures": f"textures/blocks/{k}"} for k in list(blocks) + list(custom_map)}
    write_json(
        RP / "textures" / "terrain_texture.json",
        {
            "resource_pack_name": "helios_crew",
            "texture_name": "atlas.terrain",
            "padding": 8,
            "num_mip_levels": 4,
            "texture_data": texture_data,
        },
    )
    write_json(
        RP / "textures" / "item_texture.json",
        {
            "resource_pack_name": "helios_crew",
            "texture_name": "atlas.items",
            "texture_data": {n: {"textures": f"textures/items/{n}"} for n in items},
        },
    )

    rp_blocks = {"format_version": [1, 1, 0]}
    for ident, tex in {
        "helios:lunar_crust": "helios_crust_top",
        "helios:regolith": "helios_regolith",
        "helios:basalt": "helios_basalt",
        "helios:starwood_log": "helios_starwood_log",
        "helios:starwood_planks": "helios_starwood_planks",
        "helios:crystal_leaves": "helios_crystal_leaves",
        "helios:void_glass": "helios_void_glass",
        "helios:beacon_lamp": "helios_beacon_lamp",
        "helios:star_ore": "helios_star_ore",
        "helios:habitat_plate": "helios_habitat_plate",
        "helios:comms_tile": "helios_comms_tile",
        "helios:lunar_ice": "helios_lunar_ice",
        "helios:crystal_block": "helios_crystal_block",
    }.items():
        rp_blocks[ident] = {"textures": tex, "sound": "stone"}
    rp_blocks["helios:lunar_crust"]["textures"] = {
        "up": "helios_crust_top",
        "down": "helios_regolith",
        "side": "helios_crust_side",
    }
    rp_blocks["helios:starwood_log"]["textures"] = {
        "up": "helios_starwood_top",
        "down": "helios_starwood_top",
        "side": "helios_starwood_log",
    }
    rp_blocks["helios:crystal_leaves"]["sound"] = "grass"
    rp_blocks["helios:void_glass"]["sound"] = "glass"
    rp_blocks["helios:regolith"]["sound"] = "gravel"
    write_json(RP / "blocks.json", rp_blocks)

    write_json(RP / "texts" / "languages.json", ["en_US"])
    write_json(BP / "texts" / "languages.json", ["en_US"])

    lang = """pack.name=Helios Crew Visuals
pack.description=Space looks for Minecraft Education — a gift for a starfarer.
entity.zombie.name=Astro Undead
entity.zombie_villager_v2.name=Astro Undead Settler
entity.husk.name=Solar Mummy
entity.drowned.name=Void Drowned
entity.skeleton.name=Void Bones
entity.stray.name=Comet Stray
entity.wither_skeleton.name=Eclipse Bones
entity.creeper.name=Star Creeper
entity.spider.name=Orbit Crawler
entity.cave_spider.name=Vent Crawler
entity.enderman.name=Rift Walker
entity.slime.name=Gel Core
entity.ghast.name=Signal Wailer
tile.dirt.name=Regolith
tile.grass.name=Lunar Crust
tile.stone.name=Basalt
tile.sand.name=Moondust
tile.gravel.name=Ejecta
tile.obsidian.name=Void Plate
tile.glowstone.name=Beacon Crystal
tile.helios:lunar_crust.name=Lunar Crust
tile.helios:regolith.name=Regolith
tile.helios:basalt.name=Basalt
tile.helios:starwood_log.name=Starwood Log
tile.helios:starwood_planks.name=Starwood Planks
tile.helios:crystal_leaves.name=Crystal Leaves
tile.helios:void_glass.name=Void Glass
tile.helios:beacon_lamp.name=Beacon Lamp
tile.helios:star_ore.name=Star Ore
tile.helios:habitat_plate.name=Habitat Plate
tile.helios:comms_tile.name=Comms Tile
tile.helios:lunar_ice.name=Lunar Ice
tile.helios:crystal_block.name=Star Crystal Block
item.helios:moon_rock=Moon Rock
item.helios:star_crystal=Star Crystal
item.helios:signal_core=Signal Core
item.helios:crew_visor=Crew Visor
item.helios:crew_ration=Crew Ration
item.helios:astro_compass=Astro Compass
item.helios:fuel_cell=Fuel Cell
"""
    (RP / "texts" / "en_US.lang").write_text(lang)
    (BP / "texts" / "en_US.lang").write_text(lang.replace("Helios Crew Visuals", "Helios Crew Systems"))

    # --- behavior blocks ---
    bp_blocks = {
        "lunar_crust": block_json(
            "helios:lunar_crust",
            "helios_crust_side",
            0.6,
            "#2F6F62",
            {
                "materials": {
                    "*": {"texture": "helios_crust_side", "render_method": "opaque"},
                    "up": {"texture": "helios_crust_top", "render_method": "opaque"},
                    "down": {"texture": "helios_regolith", "render_method": "opaque"},
                }
            },
        ),
        "regolith": block_json("helios:regolith", "helios_regolith", 0.5, "#76563A"),
        "basalt": block_json("helios:basalt", "helios_basalt", 1.5, "#7D7D7D"),
        "starwood_log": block_json("helios:starwood_log", "helios_starwood_log", 2.0, "#362A1E"),
        "starwood_planks": block_json("helios:starwood_planks", "helios_starwood_planks", 2.0, "#A68654"),
        "crystal_leaves": block_json(
            "helios:crystal_leaves",
            "helios_crystal_leaves",
            0.2,
            "#20786C",
            {
                "materials": {
                    "*": {
                        "texture": "helios_crystal_leaves",
                        "render_method": "alpha_test",
                        "ambient_occlusion": True,
                    }
                }
            },
        ),
        "void_glass": block_json(
            "helios:void_glass",
            "helios_void_glass",
            0.3,
            "#50C8D2",
            {
                "materials": {
                    "*": {"texture": "helios_void_glass", "render_method": "blend", "ambient_occlusion": False}
                }
            },
        ),
        "beacon_lamp": block_json(
            "helios:beacon_lamp",
            "helios_beacon_lamp",
            0.3,
            "#FFD25A",
            {"minecraft:light_emission": 15},
        ),
        "star_ore": block_json("helios:star_ore", "helios_star_ore", 3.0, "#50FFE6"),
        "habitat_plate": block_json("helios:habitat_plate", "helios_habitat_plate", 2.5, "#4E5C6C"),
        "comms_tile": block_json("helios:comms_tile", "helios_comms_tile", 1.2, "#5C382C"),
        "lunar_ice": block_json("helios:lunar_ice", "helios_lunar_ice", 0.5, "#8CC8DC"),
        "crystal_block": block_json(
            "helios:crystal_block",
            "helios_crystal_block",
            1.4,
            "#50FFE6",
            {"minecraft:light_emission": 8},
        ),
    }
    for name, data in bp_blocks.items():
        write_json(BP / "blocks" / f"{name}.json", data)

    write_json(BP / "items" / "moon_rock.json", item_json("helios:moon_rock", "Moon Rock", "moon_rock"))
    write_json(BP / "items" / "star_crystal.json", item_json("helios:star_crystal", "Star Crystal", "star_crystal"))
    write_json(BP / "items" / "signal_core.json", item_json("helios:signal_core", "Signal Core", "signal_core"))
    write_json(
        BP / "items" / "crew_visor.json",
        item_json(
            "helios:crew_visor",
            "Crew Visor",
            "crew_visor",
            extra={
                "minecraft:max_stack_size": 1,
                "minecraft:wearable": {"slot": "slot.armor.head"},
                "minecraft:armor": {"protection": 2},
            },
        ),
    )
    write_json(
        BP / "items" / "crew_ration.json",
        item_json(
            "helios:crew_ration",
            "Crew Ration",
            "crew_ration",
            extra={
                "minecraft:use_duration": 1.6,
                "minecraft:use_animation": "eat",
                "minecraft:food": {"nutrition": 6, "saturation_modifier": 0.6, "can_always_eat": True},
            },
        ),
    )
    write_json(BP / "items" / "astro_compass.json", item_json("helios:astro_compass", "Astro Compass", "astro_compass"))
    write_json(BP / "items" / "fuel_cell.json", item_json("helios:fuel_cell", "Fuel Cell", "fuel_cell"))

    recipes = {
        "starwood_planks": recipe_shapeless(
            "helios:starwood_planks", [{"item": "helios:starwood_log"}], "helios:starwood_planks", 4
        ),
        "habitat_plate": recipe_shaped(
            "helios:habitat_plate_craft",
            ["II", "II"],
            {"I": {"item": "minecraft:iron_ingot"}},
            "helios:habitat_plate",
            4,
        ),
        "void_glass": recipe_shaped(
            "helios:void_glass_craft",
            ["GGG", "GCG", "GGG"],
            {"G": {"item": "minecraft:glass"}, "C": {"item": "helios:star_crystal"}},
            "helios:void_glass",
            8,
        ),
        "beacon_lamp": recipe_shaped(
            "helios:beacon_lamp_craft",
            [" G ", "GCG", " G "],
            {"G": {"item": "minecraft:glowstone"}, "C": {"item": "helios:signal_core"}},
            "helios:beacon_lamp",
            4,
        ),
        "crystal_block": recipe_shaped(
            "helios:crystal_block_craft",
            ["CC", "CC"],
            {"C": {"item": "helios:star_crystal"}},
            "helios:crystal_block",
        ),
        "comms_tile": recipe_shaped(
            "helios:comms_tile_craft",
            ["PP", "PP"],
            {"P": {"item": "helios:starwood_planks"}},
            "helios:comms_tile",
            4,
        ),
        "moon_rock_compress": recipe_shaped(
            "helios:moon_rock_compress",
            ["AAA", "AAA", "AAA"],
            {"A": {"item": "helios:moon_rock"}},
            "helios:basalt",
        ),
        "star_crystal": recipe_shaped(
            "helios:star_crystal_craft",
            [" G ", "GAG", " G "],
            {"G": {"item": "minecraft:glowstone_dust"}, "A": {"item": "helios:moon_rock"}},
            "helios:star_crystal",
        ),
        "signal_core": recipe_shaped(
            "helios:signal_core_craft",
            ["IRI", "RSR", "IRI"],
            {
                "I": {"item": "minecraft:iron_ingot"},
                "R": {"item": "minecraft:redstone"},
                "S": {"item": "helios:star_crystal"},
            },
            "helios:signal_core",
        ),
        "crew_visor": recipe_shaped(
            "helios:crew_visor_craft",
            ["III", "G G"],
            {"G": {"item": "helios:void_glass"}, "I": {"item": "minecraft:iron_ingot"}},
            "helios:crew_visor",
        ),
        "crew_ration": recipe_shaped(
            "helios:crew_ration_craft",
            [" B ", "WMW", " B "],
            {
                "B": {"item": "minecraft:bread"},
                "W": {"item": "minecraft:wheat"},
                "M": {"item": "helios:moon_rock"},
            },
            "helios:crew_ration",
            4,
        ),
        "fuel_cell": recipe_shaped(
            "helios:fuel_cell_craft",
            [" I ", "CRC", " I "],
            {
                "I": {"item": "minecraft:iron_ingot"},
                "C": {"item": "helios:star_crystal"},
                "R": {"item": "helios:signal_core"},
            },
            "helios:fuel_cell",
        ),
        "astro_compass": recipe_shaped(
            "helios:astro_compass_craft",
            [" I ", "IRI", " I "],
            {"I": {"item": "minecraft:iron_ingot"}, "R": {"item": "helios:star_crystal"}},
            "helios:astro_compass",
        ),
        "lunar_crust_from_regolith": recipe_shapeless(
            "helios:lunar_crust_mix",
            [{"item": "helios:regolith"}, {"item": "minecraft:wheat_seeds"}],
            "helios:lunar_crust",
        ),
    }
    for name, data in recipes.items():
        write_json(BP / "recipes" / f"{name}.json", data)

    write_json(
        BP / "recipes" / "smelt_star_ore.json",
        {
            "format_version": "1.20.50",
            "minecraft:recipe_furnace": {
                "description": {"identifier": "helios:smelt_star_ore"},
                "tags": ["furnace"],
                "input": "helios:star_ore",
                "output": "helios:star_crystal",
            },
        },
    )

    write_json(BP / "loot_tables" / "entities" / "zombie.json", loot_extra("minecraft:rotten_flesh", "helios:moon_rock"))
    write_json(BP / "loot_tables" / "entities" / "husk.json", loot_extra("minecraft:rotten_flesh", "helios:moon_rock"))
    write_json(BP / "loot_tables" / "entities" / "drowned.json", loot_extra("minecraft:rotten_flesh", "helios:lunar_ice", 1))
    write_json(BP / "loot_tables" / "entities" / "skeleton.json", loot_extra("minecraft:bone", "helios:star_crystal", 1))
    write_json(BP / "loot_tables" / "entities" / "creeper.json", loot_extra("minecraft:gunpowder", "helios:signal_core", 1))
    write_json(BP / "loot_tables" / "entities" / "spider.json", loot_extra("minecraft:string", "helios:fuel_cell", 1))
    write_json(BP / "loot_tables" / "entities" / "enderman.json", loot_extra("minecraft:ender_pearl", "helios:star_crystal", 1))

    (BP / "functions").mkdir(exist_ok=True)
    (BP / "functions" / "kit.mcfunction").write_text(
        "\n".join(
            [
                "give @s helios:crew_visor 1",
                "give @s helios:crew_ration 8",
                "give @s helios:star_crystal 8",
                "give @s helios:moon_rock 16",
                "give @s helios:signal_core 2",
                "give @s helios:starwood_planks 32",
                "give @s helios:habitat_plate 16",
                "give @s helios:void_glass 16",
                "give @s helios:beacon_lamp 8",
                "give @s helios:astro_compass 1",
                "tellraw @s {\"rawtext\":[{\"text\":\"Helios kit deployed. Suit up, starfarer.\"}]}",
                "",
            ]
        )
    )
    write_json(
        BP / "functions" / "tick.json",
        {"values": []},
    )

    (ADDON / "README.txt").write_text(
        """HELIOS CREW — Minecraft Education gift pack  v1.1
====================================================

Bedrock / Education add-on (.mcaddon). Not a Java Forge mod.

INSTALL
1. Download HeliosCrew.mcaddon
2. Open it with Minecraft Education (double-click, or Import).
3. Create or edit a world.
4. Resource Packs → My Packs → activate Helios Crew Visuals.
5. Behavior Packs → My Packs → activate Helios Crew Systems.
6. Cheats ON if you want the starter kit:  /function kit

WHAT YOU GET
Visuals (vanilla worlds look like a space resource pack):
  Astro Undead, Solar Mummies, Void Drowned, Void Bones,
  Star Creepers, Orbit Crawlers, Rift Walkers, lunar ground.

Custom blocks (creative / crafting):
  Lunar Crust, Regolith, Basalt, Starwood Log / Planks,
  Crystal Leaves, Void Glass, Beacon Lamp, Star Ore,
  Habitat Plate, Comms Tile, Lunar Ice, Star Crystal Block.

Gear:
  Crew Visor (helmet), Crew Ration (food), Moon Rock,
  Star Crystal, Signal Core, Fuel Cell, Astro Compass.

Recipes at a crafting table + furnace (star ore → crystal).
Night mobs drop Helios loot. Run /function kit for a care package.

Classroom-safe: no scripts, no weapons, original art.
"""
    )

    # atlas 16 x 2 tiles = 256 x 32
    cols, rows = 16, 2
    atlas = Image.new("RGBA", (cols * 16, rows * 16), (0, 0, 0, 0))
    for i, name in enumerate(ATLAS_ORDER):
        if name not in blocks:
            continue
        x = (i % cols) * 16
        y = (i // cols) * 16
        atlas.paste(blocks[name], (x, y), blocks[name])
    save(atlas, GAME / "atlas.png")

    out = ROOT / "public" / "downloads" / "HeliosCrew.mcaddon"
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for folder in (RP, BP):
            for f in folder.rglob("*"):
                if f.is_file():
                    z.write(f, f.relative_to(ADDON))
        z.write(ADDON / "README.txt", "README.txt")
    (ROOT / "public" / "downloads" / "HeliosCrew.zip").write_bytes(out.read_bytes())
    print("Wrote", out, "size", out.stat().st_size, "atlas", atlas.size)


if __name__ == "__main__":
    main()
