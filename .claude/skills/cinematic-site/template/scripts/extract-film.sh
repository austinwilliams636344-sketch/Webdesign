#!/bin/zsh
# Turn 3 video segments into a scroll film and register it in src/films.json.
#
#   npm run film -- <key> "<Label>" seg1.mp4 seg2.mp4 seg3.mp4 [--default]
#
# Writes every frame (24 fps) as WebP: public/frames/<key>/hd (1920w, q80) and /sd (1280w, q74).
# Later segments start on the previous segment's end keyframe, so their first frame is dropped.
# --default puts this film first in films.json (= the film the site loads).
set -e
KEY="$1"; LABEL="$2"; shift 2
DEFAULT=0; SEGS=()
for a in "$@"; do [[ "$a" == "--default" ]] && DEFAULT=1 || SEGS+=("$a"); done
[[ -z "$KEY" || ${#SEGS[@]} -lt 1 ]] && { echo "usage: npm run film -- <key> \"<Label>\" seg1.mp4 seg2.mp4 seg3.mp4 [--default]"; exit 1; }
command -v ffmpeg >/dev/null && command -v cwebp >/dev/null || { echo "needs ffmpeg and cwebp (brew install ffmpeg webp)"; exit 1; }

OUT="public/frames/$KEY"; TMP=$(mktemp -d)
rm -rf "$OUT"; mkdir -p "$OUT/hd" "$OUT/sd"
n=0; s=0
for v in "${SEGS[@]}"; do
  s=$((s+1)); mkdir -p "$TMP/$s"
  ffmpeg -loglevel error -i "$v" -vf "fps=24,scale=1920:-2:flags=lanczos" -pix_fmt rgb24 "$TMP/$s/%04d.png"
  files=("$TMP/$s"/*.png)
  [ $s -gt 1 ] && files=(${files[2,-1]})
  for f in $files; do
    n=$((n+1)); name=$(printf 'f_%04d.webp' $n)
    cwebp -quiet -q 80 -m 6 -sharp_yuv "$f" -o "$OUT/hd/$name" &
    cwebp -quiet -q 74 -m 6 -sharp_yuv -resize 1280 0 "$f" -o "$OUT/sd/$name" &
    (( n % 8 == 0 )) && wait
  done
  wait
done
rm -rf "$TMP"

node -e '
const fs = require("fs"); const [key, label, count, def] = process.argv.slice(1)
const p = "src/films.json"; const films = JSON.parse(fs.readFileSync(p, "utf8"))
delete films[key]
const entry = { [key]: { label, count: Number(count) } }
fs.writeFileSync(p, JSON.stringify(def === "1" ? { ...entry, ...films } : { ...films, ...entry }, null, 2) + "\n")
' "$KEY" "${LABEL:-$KEY}" "$n" "$DEFAULT"

# preload the default film's first frame
FIRST=$(node -e 'console.log(Object.keys(require("./src/films.json"))[0])')
sed -i '' -E "s#/frames/[^/]+/(hd|sd)/f_0001.webp#/frames/$FIRST/\1/f_0001.webp#g" index.html
du -sh "$OUT/hd" "$OUT/sd"; echo "film '$KEY': $n frames → src/films.json"
