#!/bin/bash
# Rendu d'un ou plusieurs épisodes de la saison 2 : make → audio (voix Ming) → vidéo → couverture.
# Usage : s2/render.sh s2e01-le-grand-depart [autres…]   (sans argument : tous les dossiers s2/s2e*)
cd "$(dirname "$0")/../../.." || exit 1
LIST=("$@"); [ ${#LIST[@]} -eq 0 ] && LIST=($(cd examples/renard-lapin/s2 && ls -d s2e*))
for D in "${LIST[@]}"; do
  E=examples/renard-lapin/s2/$D
  N=${D#s2e??-}
  node $E/make.mjs >/dev/null || { echo "ÉCHEC make $D"; continue; }
  BPM=$(python3 -c "import json;print(json.load(open('$E/timeline.json')).get('bpm',120))")
  python3 examples/renard-lapin/lib/audio.py $E $BPM >/dev/null || { echo "ÉCHEC audio $D"; continue; }
  SVG=$(ls $E/*.svg | head -1)
  node bin/svgmaker.mjs render $SVG -o $E -f --music $E/audio.wav --music-volume 1.0 >/dev/null 2>&1 || { echo "ÉCHEC rendu $D"; continue; }
  MP4=${SVG%.svg}.mp4
  ffmpeg -v error -y -ss 27 -i $MP4 -frames:v 1 -q:v 3 ${SVG%.svg}-cover.jpg
  echo "OK $D"
done
