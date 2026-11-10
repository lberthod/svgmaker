#!/usr/bin/env bash
# Publie les vidéos sur le VPS : /mnt/data/kids-english-media → https://api.loicberthod.ch/kids-english/
#   ./publish.sh            envoie les versions web (web/*.mp4, *-cover.jpg) et index.json (rsync incrémental)
# Lancer ./web.sh avant pour (re)créer les versions web à partir des masters.
# Le bloc Caddy « handle_path /kids-english/* » doit déjà exister (voir README de la série).
set -euo pipefail
cd "$(dirname "$0")"
HOST=ubuntu@179.237.71.235
KEY=~/.ssh/loicberthodvps
DEST=/mnt/data/kids-english-media
BASE=https://api.loicberthod.ch/kids-english

# index.json : catalogue public (thème, mots, URLs) pour une appli, un site ou un planificateur de posts
node -e '
const fs = require("fs"), base = process.argv[1]
const items = fs.readdirSync("themes").filter((f) => f.endsWith(".json")).sort().flatMap((f) => {
  const t = JSON.parse(fs.readFileSync("themes/" + f, "utf8")), id = t.id
  if (!fs.existsSync(`web/${id}.mp4`)) return []
  return [{
    id, title: t.theme.en, titleTh: t.theme.th,
    words: t.words.map((w) => ({ en: w.en, th: w.th, say: w.say })),
    video: `${base}/${id}.mp4`, cover: `${base}/${id}-cover.jpg`,
    bytes: fs.statSync(`web/${id}.mp4`).size,
  }]
})
fs.writeFileSync("web/index.json", JSON.stringify({ updated: new Date().toISOString(), count: items.length, items }, null, 2))
console.log(`index.json : ${items.length} vidéos`)
' "$BASE"

ssh -i "$KEY" "$HOST" "mkdir -p $DEST"
rsync -az --stats -e "ssh -i $KEY" --include='*.mp4' --include='*-cover.jpg' --include='index.json' --exclude='*' web/ "$HOST:$DEST/"
echo "→ $BASE/index.json"
