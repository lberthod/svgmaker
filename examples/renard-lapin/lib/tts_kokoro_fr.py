"""Synthèse française Kokoro-82M (MLX, local, licence Apache 2.0), toutes les répliques en un seul chargement.

À lancer avec le Python qui contient mlx_audio (~/ai-video/tools-venv) :
    HF_HUB_OFFLINE=1 ~/ai-video/tools-venv/bin/python tts_kokoro_fr.py jobs.json
jobs.json : [{"out": "x.wav", "text": "...", "speed": 1.0}, …]   → WAV mono 24 kHz 16 bits (voix ff_siwis).
"""
import json, sys, wave
import numpy as np
from mlx_audio.tts.utils import load_model

SR = 24000
jobs = json.load(open(sys.argv[1], encoding="utf-8"))
model = load_model("mlx-community/Kokoro-82M-bf16")
for j in jobs:
    a = np.concatenate([np.array(r.audio) for r in model.generate(
        text=j["text"], voice=j.get("voice", "ff_siwis"), speed=j.get("speed", 1.0), lang_code="f")]).astype(np.float64)
    a = a / (np.max(np.abs(a)) + 1e-9) * 0.95
    with wave.open(j["out"], "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a * 32767).astype(np.int16).tobytes())
print(f"kokoro fr : {len(jobs)} réplique(s)")
