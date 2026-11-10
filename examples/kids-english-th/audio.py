"""Bande son d'un reel « 5 English words » : voix macOS (Samantha en anglais, Kanya en thaï)
calées sur cues.json, petite musique de xylophone, « ding » à chaque nouveau mot.

Usage : python3 audio.py out/<id> [out/<id2> …]  → out/<id>/audio.wav (48 kHz stéréo)

Règles de minutage :
- une réplique « after » démarre au plus tôt 0,15 s après la fin de la précédente ;
- la répétition lente d'un mot est accélérée si elle déborde sur la réplique suivante ;
- une réplique trop longue pour son créneau est légèrement accélérée (atempo ≤ 1,35).
"""
import json
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 48000


def load_wav(path):
    with wave.open(path) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768


def speak(text, voice, rate, tempo=1.0):
    with tempfile.TemporaryDirectory() as d:
        aiff, wav = os.path.join(d, "v.aiff"), os.path.join(d, "v.wav")
        subprocess.run(["say", "-v", voice, "-r", str(rate), "-o", aiff, text], check=True)
        af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        af += f"atempo={tempo:.3f}," if tempo != 1.0 else ""
        af += "acompressor=threshold=-18dB:ratio=3,volume=1.6"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", aiff, "-af", af, "-ar", str(SR), "-ac", "1", wav], check=True)
        return load_wav(wav)


def mallet(freq, dur=0.9, vel=1.0):
    t = np.arange(int(SR * dur)) / SR
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t * 6) + 0.35 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 18)
    return s * np.clip(t / 0.004, 0, 1) * vel


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def make(dirpath):
    cfg = json.load(open(os.path.join(dirpath, "cues.json"), encoding="utf-8"))
    D = cfg["duration"]
    N = int(SR * D)
    voice, music = np.zeros(N), np.zeros(N)

    def put(buf, t0, sig, gain=1.0):
        i = int(t0 * SR)
        if 0 <= i < len(buf):
            j = min(len(buf), i + len(sig))
            buf[i:j] += sig[: j - i] * gain

    cues = cfg["cues"]
    warnings = []
    prev_end = 0.0
    for k, c in enumerate(cues):
        nxt = cues[k + 1]["t"] if k + 1 < len(cues) and not cues[k + 1].get("after") else None
        start = max(c["t"], prev_end + 0.15) if c.get("after") else c["t"]
        rate = c["rate"]
        s = speak(c["text"], c["voice"], rate)
        if nxt is not None and start + len(s) / SR > nxt - 0.1 and c.get("slow"):
            rate = 150
            s = speak(c["text"], c["voice"], rate)
        if nxt is not None and start + len(s) / SR > nxt - 0.1:
            room = max(0.3, nxt - 0.1 - start)
            tempo = min(1.35, (len(s) / SR) / room)
            if tempo > 1.0:
                s = speak(c["text"], c["voice"], rate, tempo)
        end = start + len(s) / SR
        if nxt is not None and end > nxt + 0.02:
            warnings.append(f"« {c['text']} » déborde de {end - nxt:.2f} s")
        if end > D - 0.2:
            warnings.append(f"« {c['text']} » dépasse la fin de la vidéo")
        put(voice, start, s)
        if c.get("ding"):
            for j, m in enumerate([84, 88, 91]):
                put(voice, c["t"] - 0.6 + j * 0.06, mallet(hz(m), 0.7, 0.35))
        if c["text"] == "Great job!":
            for j, m in enumerate([72, 76, 79, 84, 88]):
                put(voice, start - 0.3 + j * 0.08, mallet(hz(m), 1.2, 0.4))
        prev_end = end

    # musique : xylophone pentatonique doux (même mélodie pour toute la série = identité sonore)
    beat = 60 / 104
    melody = [72, 74, 76, 79, 76, 74, 72, 69, 72, 76, 79, 81, 79, 76, 74, 72]
    bass = [48, 48, 45, 45, 43, 43, 48, 48]
    t, k = 0.0, 0
    while t < D:
        put(music, t, mallet(hz(melody[k % len(melody)]), 0.8, 0.55))
        if k % 2 == 0:
            put(music, t, mallet(hz(bass[(k // 2) % len(bass)]), 1.4, 0.5))
        t += beat / 2 if k % 4 == 3 else beat
        k += 1

    # ducking : la musique baisse quand quelqu'un parle
    env = np.convolve((np.abs(voice) > 0.02).astype(float), np.ones(int(SR * 0.25)) / (SR * 0.25), mode="same")
    music *= 1 - 0.65 * np.clip(env * 3, 0, 1)
    mix = np.tanh((voice + music * 0.22) * 1.1)
    mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.9
    pcm = (np.stack([mix, mix], axis=1) * 32767).astype(np.int16)
    with wave.open(os.path.join(dirpath, "audio.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    status = "✓" if not warnings else "⚠"
    print(f"{status} {cfg['id']} · audio {D} s" + "".join(f"\n    ⚠ {m}" for m in warnings), flush=True)
    return not warnings


if __name__ == "__main__":
    # un débordement de quelques centièmes est signalé mais ne bloque pas la production
    for d in sys.argv[1:]:
        make(d)
