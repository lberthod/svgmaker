#!/bin/bash
# Planches d'audit : une image toutes les 0,5 s, 6 images par planche (3 colonnes x 2 lignes, ordre de lecture).
#   reels-nuit/outils/planches.sh <video.mp4> <dossier-sortie>
# planche-NNN.jpg (NNN à partir de 001) couvre t = (NNN-1)*3 s à (NNN-1)*3+2,5 s. Images pleine taille à la demande : ffmpeg -ss <t> -i video -frames:v 1 out.jpg
set -euo pipefail
v="$1"; out="$2"; mkdir -p "$out"; rm -f "$out"/planche-*.jpg
ffmpeg -y -v error -i "$v" -vf "fps=2,scale=360:-1,tile=3x2" -q:v 4 "$out/planche-%03d.jpg"
ls "$out"/planche-*.jpg | wc -l
