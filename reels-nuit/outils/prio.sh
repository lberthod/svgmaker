#!/bin/bash
# Ajoute des briefs en TÊTE de la file de rendus : prio.sh reels-nuit/briefs/XX.json …
cd "$(dirname "$0")/../.."
Q=reels-nuit/queue.txt; touch $Q
python3 - "$Q" "$@" <<'PY'
import sys
q,new=sys.argv[1],sys.argv[2:]
L=[l for l in open(q).read().splitlines() if l.strip() and l not in new]
open(q,'w').write('\n'.join(new+L)+'\n')
PY
