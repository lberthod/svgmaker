#!/bin/bash
# Production complète d'un brief (tous formats) :
#   src/formats/build.sh <brief.json> [--music piste.wav]
# 1) SVG (voix estimées) → 2) voix + bruitages (audio.py de Mali, si le brief a des répliques ou des bruitages)
# → 3) SVG recalé sur les vraies voix → 4) rendu MP4 + audit + planche
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
brief="${1:?usage : src/formats/build.sh <brief.json> [--music piste.wav]}"; shift || true
id=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).id)" "$brief")
out="$(dirname "$brief")/out/$id"
node "$ROOT/bin/svgmaker.mjs" new "$brief"
if node -e "const s=require(process.argv[1]);process.exit(s.lines.length||s.sfx.length?0:1)" "$(cd "$out" && pwd)/script.json"; then
  python3 "$ROOT/examples/mali-english-th/audio.py" "$out"
  node "$ROOT/bin/svgmaker.mjs" new "$brief"
  set -- --music "$out/audio.wav" "$@"
fi
node "$ROOT/bin/svgmaker.mjs" render "$out/$id.svg" --audit --sheet -j "${JOBS:-4}" "$@"
