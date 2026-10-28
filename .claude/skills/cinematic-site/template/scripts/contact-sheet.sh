#!/bin/zsh
# Contact sheet of one or more videos (one row each) to eyeball motion, seams and artifacts.
#   zsh scripts/contact-sheet.sh out.jpg a.mp4 [b.mp4 ...]
set -e
OUT="$1"; shift
args=(); filt=""; i=0
for v in "$@"; do args+=(-i "$v"); filt+="[$i]fps=0.75,scale=320:-2,tile=6x1[r$i];"; i=$((i+1)); done
if [ $i -eq 1 ]; then ffmpeg -loglevel error -y "${args[@]}" -filter_complex "${filt%;}" -map "[r0]" -frames:v 1 "$OUT"
else ins=""; for j in $(seq 0 $((i-1))); do ins+="[r$j]"; done
  ffmpeg -loglevel error -y "${args[@]}" -filter_complex "${filt}${ins}vstack=inputs=$i" -frames:v 1 "$OUT"; fi
echo "$OUT"
