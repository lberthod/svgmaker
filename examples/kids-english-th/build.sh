#!/usr/bin/env bash
# Production complète de la série : SVG → voix + musique → MP4 (svgMaker), puis copie dans videos/.
#   ./build.sh                 tous les thèmes
#   ./build.sh themes/0[0-1]*  une sélection
set -euo pipefail
cd "$(dirname "$0")"
THEMES=("${@:-themes/*.json}")
[ $# -eq 0 ] && THEMES=(themes/*.json)

echo "1/3 · SVG"
node make.mjs "${THEMES[@]}"

echo "2/3 · voix et musique (6 en parallèle)"
for t in "${THEMES[@]}"; do id=$(basename "$t" .json); d="out/$id"
  # ne refait l'audio que si les répliques ont changé
  if [ ! -f "$d/audio.wav" ] || [ "$d/cues.json" -nt "$d/audio.wav" ]; then echo "$d"; fi
done | xargs -P 6 -n 1 python3 audio.py

echo "3/3 · vidéos (svgMaker, incrémental)"
node ../../bin/svgmaker.mjs render $(for t in "${THEMES[@]}"; do id=$(basename "$t" .json); echo "out/$id/$id.svg"; done) --audit --cover-at 3.5

mkdir -p videos
for t in "${THEMES[@]}"; do id=$(basename "$t" .json); cp -p "out/$id/$id.mp4" "videos/$id.mp4"; cp -p "out/$id/$id-cover.jpg" "videos/$id-cover.jpg"; done
echo "→ $(ls videos/*.mp4 | wc -l | tr -d ' ') vidéos dans $(pwd)/videos"
