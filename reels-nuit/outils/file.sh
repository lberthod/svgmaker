#!/bin/bash
# File d'attente de rendus : traite reels-nuit/queue.txt (un chemin de brief par ligne, le premier d'abord), un rendu à la fois.
#   reels-nuit/outils/file.sh            (à lancer une seule fois, en arrière-plan)
#   echo reels-nuit/briefs/XX.json >> reels-nuit/queue.txt          (ajouter en fin de file)
#   reels-nuit/outils/prio.sh reels-nuit/briefs/XX.json             (ajouter en tête de file)
# La ligne STOP arrête le traitement. Journal : reels-nuit/logs/file.log
cd "$(dirname "$0")/../.."
Q=reels-nuit/queue.txt; touch $Q
while true; do
  next=$(grep -v '^\s*$' $Q | head -1)
  if [ -z "$next" ]; then sleep 20; continue; fi
  [ "$next" = "STOP" ] && { echo "$(date +%H:%M:%S) STOP" >> reels-nuit/logs/file.log; exit 0; }
  grep -v -x -F -m1 "$next" $Q > $Q.tmp || true; python3 - "$Q" "$next" <<'PY'
import sys
q,n=sys.argv[1],sys.argv[2]
L=open(q).read().splitlines(); 
if n in L: L.remove(n)
open(q,'w').write('\n'.join(L)+('\n' if L else ''))
PY
  rm -f $Q.tmp
  echo "$(date +%H:%M:%S) rendu $next" >> reels-nuit/logs/file.log
  reels-nuit/produire.sh "$next" >> reels-nuit/logs/file.log 2>&1
done
