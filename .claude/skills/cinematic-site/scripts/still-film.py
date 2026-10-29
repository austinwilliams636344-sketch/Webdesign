# Free scroll film from 4 keyframes (no video model): sub-pixel push-ins + crossfades + drifting embers.
#   python3 still-film.py <dir with K1.jpg..K4.jpg> <out dir>   -> seg1.mp4 seg2.mp4 seg3.mp4 (8 s each, 24 fps)
# Tune SEGS below (zoom + centre per keyframe, crossfade window, ember amount) for each film.
import sys, os, subprocess, numpy as np
from PIL import Image
K, OUT = sys.argv[1], sys.argv[2]
W, H, FPS, SEC = 1920, 1080, 24, 8
N = FPS * SEC
imgs = [Image.open(f"{K}/K{i}.jpg").convert("RGB") for i in range(1, 5)]

def ease(t): t = min(max(t, 0), 1); return t * t * (3 - 2 * t)

def view(im, zoom, cx, cy):
    """Crop a 16:9 window (zoom >= 1) centred near (cx, cy) in fractions, sub-pixel, resized to W x H."""
    iw, ih = im.size
    bw = min(iw, ih * W / H) / zoom; bh = bw * H / W
    x0 = min(max(cx * iw - bw / 2, 0), iw - bw); y0 = min(max(cy * ih - bh / 2, 0), ih - bh)
    return np.asarray(im.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + bw, y0 + bh)), np.float32)

rng = np.random.default_rng(3)
P = 70
px, py = rng.random(P) * W, rng.random(P) * H
vx, vy = rng.normal(0, 0.25, P), -rng.uniform(0.6, 2.2, P)
size, bright = rng.uniform(1.2, 3.2, P), rng.uniform(0.35, 1, P)
def embers(frame, amount):
    if amount <= 0: return frame
    global px, py
    px = (px + vx) % W; py = py + vy; py[py < -10] += H + 20
    for x, y, s, b in zip(px, py, size, bright):
        r = int(s * 3); x0, x1, y0, y1 = int(max(0, x - r)), int(min(W, x + r)), int(max(0, y - r)), int(min(H, y + r))
        if x1 <= x0 or y1 <= y0: continue
        yy, xx = np.mgrid[y0:y1, x0:x1]
        g = np.exp(-((xx - x) ** 2 + (yy - y) ** 2) / (2 * s * s))[..., None] * b * amount
        frame[y0:y1, x0:x1] += g * np.array([255, 130, 40], np.float32)
    return frame

# (A image, zoom a0->a1, centre), (B image, zoom b0->b1, centre), crossfade window, ember amount (start, end)
SEGS = [
    ((0, 1.0, 1.32, 0.52, 0.55), (1, 1.18, 1.0, 0.5, 0.52), (0.5, 0.92), (0.15, 0.6)),   # pit -> brisket floats
    ((1, 1.0, 1.08, 0.5, 0.52), (2, 1.14, 1.0, 0.5, 0.5), (0.38, 0.85), (0.6, 0.7)),     # brisket -> layers
    ((2, 1.0, 1.12, 0.5, 0.5), (3, 1.28, 1.0, 0.5, 0.66), (0.42, 0.9), (0.7, 0.0)),      # layers -> the tray
]
for s, (A, B, (f0, f1), (e0, e1)) in enumerate(SEGS, 1):
    d = f"{OUT}/tmp{s}"; os.makedirs(d, exist_ok=True)
    for i in range(N):
        t = i / (N - 1)
        ta = ease(t / f1); tb = ease((t - f0) / (1 - f0))
        a = view(imgs[A[0]], A[1] + (A[2] - A[1]) * ta, A[3], A[4])
        mix = ease((t - f0) / (f1 - f0))
        frame = a
        if mix > 0:
            b = view(imgs[B[0]], B[1] + (B[2] - B[1]) * tb, B[3], B[4])
            # dip through darkness in the middle of the crossfade so it reads as "the world dissolves"
            dip = 1 - 0.35 * np.sin(np.pi * mix)
            frame = (a * (1 - mix) + b * mix) * dip
        if i == N - 1:  # land exactly on the next keyframe so the segments join seamlessly
            frame = view(imgs[B[0]], B[2], B[3], B[4])
        else:
            frame = embers(frame, e0 + (e1 - e0) * t)
        Image.fromarray(np.clip(frame, 0, 255).astype(np.uint8)).save(f"{d}/{i:04d}.png", compress_level=1)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i", f"{d}/%04d.png",
                    "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", f"{OUT}/seg{s}.mp4"], check=True)
    subprocess.run(["rm", "-rf", d]); print("seg", s, "done", flush=True)
