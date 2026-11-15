#!/bin/bash
# Production complète d'un brief (tous formats) :
#   src/formats/build.sh <brief.json> [--music piste.wav]
# Format dialogue : pas d'audio.py (voix du dossier du brief), rendu direct.
# 1) SVG (voix estimées) → 2) voix + bruitages (audio.py de Mali, si le brief a des répliques ou des bruitages)
# → 3) SVG recalé sur les vraies voix → 4) rendu MP4 + audit + planche
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
brief="${1:?usage : src/formats/build.sh <brief.json> [--music piste.wav]}"; shift || true
id=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).id)" "$brief")
out="$(dirname "$brief")/out/$id"
node "$ROOT/bin/svgmaker.mjs" new "$brief"
fmt=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).format)" "$brief")
if [ "$fmt" = "dialogue" ]; then
  # dialogue : les voix sont déjà produites dans le dossier du brief (voices / timeline / audio du brief),
  # on ne lance PAS audio.py de Mali. Le SVG porte data-music → le rendu mixe audio.wav.
  if ! grep -q 'data-music=' "$out/$id.svg"; then
    echo "⚠ pas d'audio (champ « audio » du brief absent ou audio.wav introuvable) : rendu MUET" >&2
  fi
  node "$ROOT/bin/svgmaker.mjs" render "$out/$id.svg" --audit --sheet -j "${JOBS:-4}" "$@"
  exit $?
fi
if [ "$fmt" = "atlas" ]; then node "$ROOT/scripts/make-relief.mjs" "$brief"; fi
if [ "$fmt" = "carte" ] || [ "$fmt" = "atlas" ]; then
  # carte : la durée des scènes dépend de la voix réelle → mixage, SVG recalé sur voice.json, puis remixage sur le script recalé
  python3 "$ROOT/src/formats/carte/audio.py" "$out"
  node "$ROOT/bin/svgmaker.mjs" new "$brief"
  python3 "$ROOT/src/formats/carte/audio.py" "$out"
  node "$ROOT/bin/svgmaker.mjs" new "$brief"
  set -- --music "$out/audio.wav" "$@"
elif node -e "const s=require(process.argv[1]);process.exit(s.lines.length||s.sfx.length?0:1)" "$(cd "$out" && pwd)/script.json"; then
  python3 "$ROOT/examples/mali-english-th/audio.py" "$out"
  node "$ROOT/bin/svgmaker.mjs" new "$brief"
  set -- --music "$out/audio.wav" "$@"
fi
node "$ROOT/bin/svgmaker.mjs" render "$out/$id.svg" --audit --sheet -j "${JOBS:-4}" "$@"
