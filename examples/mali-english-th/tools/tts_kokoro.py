"""Synthèse anglaise Kokoro-82M (MLX, local), toutes les répliques en un seul chargement du modèle.

À lancer avec le Python qui contient mlx_audio (~/ai-video/tools-venv) :
    HF_HUB_OFFLINE=1 ~/ai-video/tools-venv/bin/python tts_kokoro.py jobs.json
jobs.json : [{"out": "x.wav", "text": "...", "voice": "af_heart", "speed": 1.0, "carrier": false}, …]
Sortie : WAV mono 24 kHz 16 bits.

carrier = true (réparation d'un mot isolé mal prononcé) : Kokoro dit souvent « Vish » pour « Fish! »
seul, mais prononce bien « A fish! ». On fait donc dire « A fish! », Whisper donne l'instant exact
où commence « fish » (horodatage par mot) et on coupe juste avant.
"""
import json
import re
import sys
import wave

import numpy as np
from mlx_audio.tts.utils import load_model

SR = 24000
CARRIERS = ["A", "The", "One", "Look, a"]  # essayés tour à tour par audio.py (carrier = 1, 2, 3, 4)


def synth(model, text, voice, speed):
    parts = [np.array(r.audio) for r in model.generate(text=text, voice=voice, speed=speed, lang_code="a")]
    return np.concatenate(parts).astype(np.float64)


def save(path, a):
    a = a / (np.max(np.abs(a)) + 1e-9) * 0.95
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((a * 32767).astype(np.int16).tobytes())


def word_start(a, word):
    """Instant (s) où Whisper entend `word` dans `a`, ou None."""
    import mlx_whisper
    x = np.interp(np.arange(0, len(a), SR / 16000), np.arange(len(a)), a).astype(np.float32)  # 16 kHz pour Whisper
    r = mlx_whisper.transcribe(x, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="en", word_timestamps=True)
    target = re.sub(r"\W", "", word.lower())
    for seg in r.get("segments", []):
        for w in seg.get("words", []):
            if re.sub(r"\W", "", w["word"].lower()) == target:
                return w["start"]
    return None


jobs = json.load(open(sys.argv[1], encoding="utf-8"))
model = load_model("mlx-community/Kokoro-82M-bf16")
fixed = 0
for j in jobs:
    text, voice, speed = j["text"], j.get("voice", "af_heart"), j.get("speed", 1.0)
    a = None
    words = re.findall(r"[A-Za-z]+", text)
    if j.get("carrier") and len(words) == 1:
        punct = "!" if "!" in text else "."
        prefix = CARRIERS[(int(j["carrier"]) - 1) % len(CARRIERS)]
        full = synth(model, f"{prefix} {words[0].lower()}{punct}", voice, speed)
        t = word_start(full, words[0])
        if t is not None:
            a, fixed = full[max(0, int((t - 0.02) * SR)):], fixed + 1
    if a is None:
        a = synth(model, text, voice, speed)
    save(j["out"], a)
print(f"kokoro : {len(jobs)} réplique(s)" + (f", {fixed} réparée(s) par mot porteur" if fixed else ""))
