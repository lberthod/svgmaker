#!/bin/bash
# Publie des épisodes sur https://terranarrata.fr (projet Astro /Users/loicberthod/Desktop/Coding/terranarrata, série « europe »).
#   reels-nuit/outils/publier.sh <id> [<id> …]      ex. 16-royaume-uni 26-hongrie
# Pour chaque id : réencode final/<id>.mp4 en 720x1280 (faststart), refait l'affiche (t = 3 s), met à jour/crée la fiche
# de l'épisode (titre = question d'ouverture du brief), puis `npm run serie -- ingest europe` et `npm run deploy`.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; SITE="$HOME/Desktop/Coding/terranarrata"; M="$SITE/media/europe"
[ $# -ge 1 ] || { echo "usage : publier.sh <id> …"; exit 1; }
mkdir -p "$M/videos" "$M/posters" "$M/thumbs"
for id in "$@"; do
  src="$ROOT/reels-nuit/final/$id.mp4"; [ -f "$src" ] || { echo "✖ $src absent"; exit 1; }
  echo "▶ $id"
  ffmpeg -y -v error -i "$src" -vf scale=720:1280 -c:v libx264 -crf 27 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$M/videos/$id.mp4"
  rm -f "$M/posters/$id.jpg" "$M/thumbs/$id.jpg"
  ffmpeg -y -v error -ss 3 -i "$src" -frames:v 1 -vf scale=540:-1 -q:v 3 "$M/posters/$id.jpg"
done
cd "$SITE" && npm run -s serie -- ingest europe
python3 - "$ROOT" "$SITE" "$@" <<'PY'
import sys, json, re, os
root, site, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
for id in ids:
    num, name = id.split('-', 1)
    slug = re.sub(r'-v\d+$', '', name)
    f = f'{site}/src/content/episodes/europe/{slug}.md'
    if not os.path.exists(f): print('  (fiche introuvable, ingest l\'a peut-être nommée autrement)', f); continue
    s = open(f).read()
    s = re.sub(r'^draft: true$', 'draft: false', s, count=1, flags=re.M)  # l'ingest crée les nouvelles fiches en brouillon
    open(f, 'w').write(s)
    if int(num) >= 26:  # nouvelle fiche : titre = question d'ouverture
        b = json.load(open(f'{root}/reels-nuit/briefs/{id}.json'))
        q = (b['scenes'][0].get('say') or [''])[0]
        q = q if isinstance(q, str) else q.get('say', '')
        label = b['scenes'][0].get('sub') or name.replace('-', ' ').title()
        s = re.sub(r'^title: .*$', 'title: ' + json.dumps(q, ensure_ascii=False), s, count=1, flags=re.M)
        open(f, 'w').write(s)
        print('  fiche :', slug, '→', q)
PY
npm run -s deploy
echo "✔ publié : $*"
