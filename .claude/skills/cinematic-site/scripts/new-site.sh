#!/bin/zsh
# Create a new cinematic site from the template.
#   zsh new-site.sh <target-dir>
# Copies the template, installs dependencies, and prints the next steps.
set -e
SKILL_DIR="${0:A:h:h}"
TARGET="$1"
[[ -z "$TARGET" ]] && { echo "usage: new-site.sh <target-dir>"; exit 1; }
[[ -e "$TARGET" && -n "$(ls -A "$TARGET" 2>/dev/null)" ]] && { echo "target exists and is not empty: $TARGET"; exit 1; }
mkdir -p "$TARGET"
rsync -a --exclude node_modules --exclude dist --exclude qa "$SKILL_DIR/template/" "$TARGET/"
cd "$TARGET"
npm install --no-audit --no-fund --loglevel=error
for t in ffmpeg cwebp; do command -v $t >/dev/null || echo "⚠ missing $t (brew install ffmpeg webp)"; done
[[ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]] || echo "⚠ Google Chrome not found: QA scripts need CHROME=/path/to/chrome"
echo "✓ site created at $TARGET"
echo "next: edit src/site.config.js + src/theme.js, add public/img/*, then: npm run film -- main \"Main\" seg1.mp4 seg2.mp4 seg3.mp4 --default"
