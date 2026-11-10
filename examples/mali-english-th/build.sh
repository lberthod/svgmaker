#!/bin/bash
# Pipeline complet d'un thème de Mali :
#   ./build.sh <thème>            → out/<thème>/mali-<thème>.mp4 (+ svg, audio, planche, audit)
#   JOBS=3 ./build.sh <thème>     → nombre de navigateurs pour le rendu (défaut 3)
# 1) SVG (bouche estimée) → 2) voix + bruitages + contrôle Whisper → 3) SVG (bouche réelle) → 4) rendu MP4
set -euo pipefail
cd "$(dirname "$0")"
id="${1:?usage : ./build.sh <thème>}"
node make.mjs "$id"
python3 audio.py "out/$id"
node make.mjs "$id"
node ../../bin/svgmaker.mjs render "out/$id/mali-$id.svg" --music "out/$id/audio.wav" --audit --sheet -j "${JOBS:-3}"
