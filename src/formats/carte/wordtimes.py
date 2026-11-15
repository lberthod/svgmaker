"""Instants des mots d'une réplique (Whisper, mot à mot) : sert à caler une image sur un mot précis (at: { line, word }).
    ~/ai-video/ming-venv/bin/python wordtimes.py in.json out.json     in : [wav…] → out : [[{"w": mot, "t": secondes}…]…]"""
import json, sys
import mlx_whisper

WH = 'mlx-community/whisper-large-v3-turbo'
files = json.load(open(sys.argv[1]))
out = []
for f in files:
    r = mlx_whisper.transcribe(f, path_or_hf_repo=WH, language='fr', temperature=0.0, word_timestamps=True)
    out.append([{'w': w['word'].strip(), 't': round(float(w['start']), 2)} for sg in r['segments'] for w in sg['words']])
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False)
