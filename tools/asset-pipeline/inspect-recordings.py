"""Read user-provided recordings, save evenly sampled frames without modifying video."""
import json
from pathlib import Path
import cv2
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[2]
out = root / 'ASSET_WORK' / 'polish' / 'recordings'
out.mkdir(parents=True, exist_ok=True)
records = []
for stem in ['224014', '224101']:
    path = Path('C:/Users/Adrian/Videos/Screen Recordings') / f'Screen Recording 2026-10-11 {stem}.mp4'
    cap = cv2.VideoCapture(str(path))
    fps = cap.get(cv2.CAP_PROP_FPS)
    count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = count / fps
    sheet = Image.new('RGB', (1920, 5 * 292), '#172128')
    draw = ImageDraw.Draw(sheet)
    frames = []
    for i in range(20):
        t = max(0, (duration - .1) * i / 19)
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        rgb = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        dest = out / f'{stem}-{i:02d}.jpg'
        rgb.save(dest, quality=92)
        tile = rgb.copy()
        tile.thumbnail((480, 270))
        x, y = (i % 4) * 480, (i // 4) * 292
        sheet.paste(tile, (x, y + 22))
        draw.text((x + 6, y + 4), f'{stem} | {t:.2f} sec | frame {i:02d}', fill='white')
        frames.append({'seconds': t, 'path': str(dest)})
    cap.release()
    sheet.save(out / f'{stem}-timeline.jpg', quality=95)
    records.append({'source': str(path), 'fps': fps, 'frameCount': count, 'duration': duration, 'frames': frames})
(out / 'metadata.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
print(json.dumps([{k: v for k, v in r.items() if k != 'frames'} for r in records], indent=2))
