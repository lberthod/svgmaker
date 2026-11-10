#!/usr/bin/env bash
# Versions web légères des masters (pour l'hébergement) : H.264 crf 26, preset slow, tune animation,
# son AAC mono 64 kb/s, faststart. ~2,4 Mo au lieu de ~7,7 Mo, SSIM ≈ 0,997 (invisible à l'œil).
#   ./web.sh      → web/<id>.mp4 + web/<id>-cover.jpg (incrémental, 6 en parallèle)
# Les masters (videos/) restent la version à publier sur Instagram / TikTok.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p web
for m in videos/*.mp4; do
  id=$(basename "$m" .mp4)
  [ -f "web/$id.mp4" ] && [ "web/$id.mp4" -nt "$m" ] && continue
  echo "$id"
done | xargs -P 6 -n 1 sh -c '
  ffmpeg -v error -y -i "videos/$1.mp4" \
    -c:v libx264 -crf 26 -preset slow -tune animation -pix_fmt yuv420p \
    -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 64k -ac 1 -movflags +faststart "web/$1.tmp.mp4" && mv "web/$1.tmp.mp4" "web/$1.mp4" && echo "✓ $1"' _
for c in videos/*-cover.jpg; do cp -p "$c" web/; done
echo "→ $(ls web/*.mp4 | wc -l | tr -d " ") vidéos web · $(du -sh web | cut -f1)"
