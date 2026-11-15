#!/bin/bash
# Produit, un par un (la synthèse vocale Ming ne se partage pas), tous les briefs de reels-nuit/briefs/ :
#   reels-nuit/produire.sh [brief.json …]     (sans argument : tous, dans l'ordre)
# Chaque reel : build.sh (voix + calage mots + rendu + audit) puis copie du MP4 dans reels-nuit/final/ et ligne dans STATUS.txt.
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
list=("$@"); [ ${#list[@]} -eq 0 ] && list=(reels-nuit/briefs/*.json)
for brief in "${list[@]}"; do
  id=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).id)" "$brief")
  out="$(dirname "$brief")/out/$id"
  log="reels-nuit/logs/$id.log"; mkdir -p reels-nuit/logs
  echo "$(date '+%H:%M:%S') début $id" >> reels-nuit/STATUS.txt
  src/formats/build.sh "$brief" --crf 25 > "$log" 2>&1
  alerts=$(grep -o '[0-9]* alerte(s) d.audit' "$log" | tail -1)
  if [ -f "$out/$id.mp4" ]; then
    cp "$out/$id.mp4" "reels-nuit/final/$(basename "$brief" .json).mp4"
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/$id.mp4" | cut -c1-5)
    echo "$(date '+%H:%M:%S') ok    $id  ${dur}s  ${alerts:-audit ?}" >> reels-nuit/STATUS.txt
  else
    echo "$(date '+%H:%M:%S') ÉCHEC $id  (voir $log)" >> reels-nuit/STATUS.txt
  fi
done
echo "$(date '+%H:%M:%S') lot terminé" >> reels-nuit/STATUS.txt
