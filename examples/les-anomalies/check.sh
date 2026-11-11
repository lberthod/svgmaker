#!/bin/zsh
# Boucle de contrôle d'un épisode : node make.mjs → audio.py (+ répliques isolées) → Whisper → rendu + audit
# → planche de contrôle 20 images (qa-planche.jpg, une image toutes les 2 s ; lecture en lignes : 1 s, 3 s, 5 s…).
# usage : zsh examples/les-anomalies/check.sh 2 [--no-whisper] [--jobs 4]
set -e
N=$1; shift
WH=1; J=6
while [[ $# -gt 0 ]]; do case $1 in --no-whisper) WH=0;; --jobs) J=$2; shift;; esac; shift; done
LIB=${0:A:h}; ROOT=${LIB:h:h}; D=$ROOT/examples/les-anomalies-ep$N; NAME=les-anomalies-ep$N
cd $D
node make.mjs
rm -rf .vox; VOX_DIR=$D/.vox python3 audio.py
if [[ $WH == 1 ]]; then
  python3 -c "
import json; tl=json.load(open('timeline.json'))
json.dump([{'wav': f'.vox/{i:02d}.wav', 'text': l['text'], 'lang': 'fr'} for i,l in enumerate(tl['lines'])], open('.vox/checks.json','w'), ensure_ascii=False)"
  HF_HUB_OFFLINE=1 ~/ai-video/tools-venv/bin/python $ROOT/examples/mali-english-th/tools/qa_whisper.py .vox/checks.json 2>/dev/null | grep -v '^$' || true
fi
cd $ROOT
node bin/svgmaker.mjs render $D/$NAME.svg -f -j $J --audit --gif --sheet --cover-at ${COVER:-1.2} 2>&1 | tail -4
T=$(mktemp -d); i=0
for t in 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39; do
  i=$((i+1)); ffmpeg -v error -y -ss $t -i $D/$NAME.mp4 -frames:v 1 -vf "scale=300:-1" $T/f_$(printf %02d $i).jpg
done
ffmpeg -v error -y -pattern_type glob -i "$T/f_*.jpg" -filter_complex "tile=5x4:padding=4" -frames:v 1 -q:v 3 $D/qa-planche.jpg; rm -rf $T
echo "planche : $D/qa-planche.jpg"
