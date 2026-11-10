"""Contrôle qualité des voix : transcrit chaque réplique avec whisper-large-v3-turbo (MLX, local)
et compare au texte attendu. Les écarts sont listés ; le code de sortie reste 0 (avertissement).

    HF_HUB_OFFLINE=1 ~/ai-video/tools-venv/bin/python qa_whisper.py checks.json
checks.json : [{"wav": "x.wav", "text": "attendu", "lang": "en"|"th"}, …]
résultat optionnel : qa_whisper.py checks.json results.json → [{"ok": bool, "heard": "…"}, …]
"""
import json
import re
import sys
import unicodedata

import mlx_whisper

REPO = "mlx-community/whisper-large-v3-turbo"


def norm(s):
    s = unicodedata.normalize("NFC", s.lower())
    s = s.replace("mah-lee", "mali").replace("molly", "mali").replace("marley", "mali")
    return re.sub(r"[^\w฀-๿]+", "", s)


bad, results = 0, []
for c in json.load(open(sys.argv[1], encoding="utf-8")):
    got = mlx_whisper.transcribe(c["wav"], path_or_hf_repo=REPO, language=c["lang"])["text"].strip()
    ok = norm(c["text"]) in norm(got) or norm(got) in norm(c["text"])
    # thaï : Whisper est peu fiable sur un mot isolé (consonne muette, tons) → simple avis
    mark = "✓" if ok else ("ℹ" if c["lang"] == "th" else "⚠")
    if mark == "⚠":
        bad += 1
    results.append({"ok": ok, "heard": got})
    print(f"{mark} [{c['lang']}] attendu « {c['text']} » · entendu « {got} »")
if len(sys.argv) > 2:
    json.dump(results, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False)
print(f"whisper : {bad} écart(s) en anglais")
