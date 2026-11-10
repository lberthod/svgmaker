"""Bande son de « Learn English with Mali » à partir de script.json.

Voix
- anglais : Kokoro-82M (MLX, local) — narrateur « am_michael », Mali « af_heart » rendue plus aiguë ;
  repli automatique sur la voix macOS Samantha si Kokoro est indisponible ;
- thaï : voix macOS Kanya (Kokoro ne parle pas thaï), rendue plus aiguë pour Mali.
Bruitages synthétisés, petite musique de xylophone qui baisse sous les voix.

Sorties
- audio.wav (48 kHz stéréo) ;
- voice.json : pour chaque réplique, sa durée et son enveloppe de volume à 30 i/s → make.mjs
  en tire la synchronisation labiale de Mali (la bouche s'ouvre avec la voix, syllabe par syllabe) ;
- contrôle Whisper de chaque réplique (écarts affichés).

Usage : python3 audio.py out/<thème> [--no-qa]   (lit script.json, écrit audio.wav et voice.json dans ce dossier)
Plusieurs thèmes peuvent tourner en parallèle : la synthèse et Whisper (GPU) passent par un verrou
(~/.cache/mali-gpu.lock), un seul job GPU à la fois, comme le demandent les notes d'~/ai-video.
"""
import fcntl
import json
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.join(HERE, "tools")
VENV_PY = os.path.expanduser("~/ai-video/tools-venv/bin/python")  # mlx_audio + mlx_whisper
SR, FPS = 48000, 30
args = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = os.path.abspath(args[0]) if args else HERE
cfg = json.load(open(os.path.join(OUT, "script.json"), encoding="utf-8"))
_lock = open(os.path.expanduser("~/.cache/mali-gpu.lock"), "w")
fcntl.flock(_lock, fcntl.LOCK_EX)  # libéré à la fin du processus
D = cfg["duration"]
N = int(SR * D)
voice, fxbuf, music = np.zeros(N), np.zeros(N), np.zeros(N)
rng = np.random.default_rng(11)

# rôle → (moteur, voix, vitesse/débit, hauteur)
ROLES = {
    "narrator": ("kokoro", "am_michael", 0.9, 1.0),
    "mali_en": ("kokoro", "af_heart", 1.0, 1.17),
    "mali_th": ("say", "Kanya", 170, 1.14),
}
SAY_FALLBACK = ("say", "Samantha", 150)
PRONOUNCE = {"Mali": "Mah-lee"}  # orthographe pour la synthèse uniquement
ENV = dict(os.environ, HF_HUB_OFFLINE="1")


def tt(d):
    return np.arange(int(SR * d)) / SR


def put(buf, t0, sig, gain=1.0):
    i = int(t0 * SR)
    if 0 <= i < len(buf):
        j = min(len(buf), i + len(sig))
        buf[i:j] += sig[: j - i] * gain


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def load_wav(path):
    with wave.open(path) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768


def post(src, dst, pitch):
    """Coupe les silences, change la hauteur sans changer le débit, compresse, 48 kHz mono."""
    af = "silenceremove=start_periods=1:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
    if pitch != 1.0:
        af += f",aresample=48000,asetrate={int(48000 * pitch)},aresample=48000,atempo={1 / pitch:.4f}"
    af += ",acompressor=threshold=-18dB:ratio=3,volume=1.6"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", af, "-ar", str(SR), "-ac", "1", dst], check=True)


def tts_text(text):
    for k, v in PRONOUNCE.items():
        text = text.replace(k, v)
    return text


tmp = tempfile.mkdtemp(prefix="mali-")
lines = cfg["lines"]
raw = [os.path.join(tmp, f"raw{i}.wav") for i in range(len(lines))]
final = [os.path.join(tmp, f"v{i}.wav") for i in range(len(lines))]

# --- synthèse -------------------------------------------------------------------
jobs = [{"out": raw[i], "text": tts_text(l["text"]), "voice": ROLES[l["role"]][1], "speed": ROLES[l["role"]][2]}
        for i, l in enumerate(lines) if ROLES[l["role"]][0] == "kokoro"]
kokoro_ok = False
if jobs and os.path.exists(VENV_PY):
    jf = os.path.join(tmp, "jobs.json")
    json.dump(jobs, open(jf, "w", encoding="utf-8"), ensure_ascii=False)
    r = subprocess.run([VENV_PY, os.path.join(TOOLS, "tts_kokoro.py"), jf], env=ENV, capture_output=True, text=True)
    kokoro_ok = r.returncode == 0
    if not kokoro_ok:
        print("⚠ Kokoro indisponible, repli sur Samantha :", r.stderr.strip().splitlines()[-1:] or "")
for i, l in enumerate(lines):
    eng, v, rate, pitch = ROLES[l["role"]]
    if eng == "kokoro" and not kokoro_ok:
        eng, v, rate = SAY_FALLBACK
    if eng == "say":
        aiff = os.path.join(tmp, f"raw{i}.aiff")
        subprocess.run(["say", "-v", v, "-r", str(rate), "-o", aiff, tts_text(l["text"])], check=True)
        post(aiff, final[i], pitch)
    else:
        post(raw[i], final[i], pitch)

# --- contrôle Whisper, puis réparation des mots anglais mal prononcés ----------------
def qa(idx, tag):
    """Transcrit les répliques idx (avec 0,8 s de silence autour) ; renvoie {i: ok}."""
    checks = []
    for i in idx:
        padded = os.path.join(tmp, f"qa{i}.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", final[i], "-af", "adelay=800,apad=pad_dur=0.8", padded], check=True)
        checks.append({"wav": padded, "text": lines[i]["text"], "lang": "th" if lines[i]["role"] == "mali_th" else "en"})
    cf, rf = os.path.join(tmp, f"checks_{tag}.json"), os.path.join(tmp, f"results_{tag}.json")
    json.dump(checks, open(cf, "w", encoding="utf-8"), ensure_ascii=False)
    try:  # délai maximal : le verrou GPU bloque les autres builds tant que ce processus tourne
        r = subprocess.run([VENV_PY, os.path.join(TOOLS, "qa_whisper.py"), cf, rf], env=ENV, capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        print(f"⚠ contrôle Whisper [{tag}] trop long (> 10 min), ignoré")
        return {}
    if r.returncode:
        print("⚠ contrôle Whisper impossible :", r.stderr.strip()[-300:])
        return {}
    for x in r.stdout.splitlines():
        if x.startswith(("⚠", "ℹ")):
            print(f"  [{tag}] {x}")
    return {i: res["ok"] for i, res in zip(idx, json.load(open(rf, encoding="utf-8")))}


if "--no-qa" not in sys.argv and os.path.exists(VENV_PY) and kokoro_ok:
    res = qa(list(range(len(lines))), "contrôle")
    bad = [i for i, ok in res.items() if not ok and ROLES[lines[i]["role"]][0] == "kokoro"]
    if bad:
        todo, n0 = list(bad), len(bad)
        for k in range(1, 5):  # mots porteurs « A », « The », « One », « Look, a »
            fix = [{"out": raw[i], "text": tts_text(lines[i]["text"]), "voice": ROLES[lines[i]["role"]][1],
                    "speed": ROLES[lines[i]["role"]][2], "carrier": k} for i in todo]
            jf = os.path.join(tmp, f"fix{k}.json")
            json.dump(fix, open(jf, "w", encoding="utf-8"), ensure_ascii=False)
            try:
                subprocess.run([VENV_PY, os.path.join(TOOLS, "tts_kokoro.py"), jf], env=ENV, capture_output=True, text=True, timeout=600)
            except subprocess.TimeoutExpired:
                print(f"⚠ réparation {k} trop longue (> 10 min), arrêtée")
                break
            for i in todo:
                post(raw[i], final[i], ROLES[lines[i]["role"]][3])
            res2 = qa(todo, f"réparation {k}")
            todo = [i for i in todo if not res2.get(i)]
            if not todo:
                break
        still = [lines[i]["text"] for i in todo]
        print(f"réparation : {n0 - len(still)}/{n0} réplique(s) corrigée(s)" + (f" · reste : {still}" if still else ""))
    else:
        print("contrôle Whisper : anglais OK")

# --- placement, enveloppes pour la bouche ---------------------------------------
voices, ends = {}, []
for i, l in enumerate(lines):
    s = load_wav(final[i])
    put(voice, l["t"], s)
    d = len(s) / SR
    hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(s[k:k + hop] ** 2)) for k in range(0, len(s), hop)])
    env = np.clip(rms / (np.percentile(rms, 95) + 1e-9), 0, 1) ** 0.7
    voices[f"{l['role']}|{l['text']}"] = {"dur": round(d, 3), "env": [round(float(x), 2) for x in env]}
    ends.append((l["t"], l["t"] + d, l["text"]))
warn = [f"« {a} » (fin {a1:.2f} s) chevauche « {b} » ({b0:.2f} s)" for (_, a1, a), (b0, _, b) in zip(ends, ends[1:]) if a1 > b0 + 0.03]
warn += [f"« {t} » dépasse la fin" for _, e, t in ends if e > D - 0.2]


# --- bruitages ------------------------------------------------------------------
def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def mallet(freq, dur=0.9, vel=1.0):
    x = tt(dur)
    s = np.sin(2 * np.pi * freq * x) * np.exp(-x * 6) + 0.35 * np.sin(2 * np.pi * freq * 4 * x) * np.exp(-x * 18)
    return s * np.clip(x / 0.004, 0, 1) * vel


def glide(f0, f1, d, decay=4.0):
    x = tt(d)
    fr = f0 * (f1 / f0) ** (x / d)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-x * decay)


def arp(notes, step, dur, vel):
    out = np.zeros(int(SR * (step * len(notes) + dur)))
    for j, m in enumerate(notes):
        s = mallet(hz(m), dur, vel)
        i = int(j * step * SR)
        out[i:i + len(s)] += s
    return out


def sfx(kind):
    if kind == "step":
        x = tt(0.12)
        return np.sin(2 * np.pi * 85 * x) * np.exp(-x * 40) * 0.6 + lp(rng.normal(0, 1, len(x)), 20) * np.exp(-x * 50) * 0.3
    if kind == "boing":
        x = tt(0.45)
        fr = 180 + 260 * np.exp(-x * 9) * (1 + 0.35 * np.sin(2 * np.pi * 14 * x))
        return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-x * 5) * 0.8
    if kind == "pop":
        return glide(400, 1400, 0.09, 20) * 0.7
    if kind == "meow":
        x = tt(0.7)
        env = np.sin(np.pi * np.clip(x / 0.7, 0, 1)) ** 0.8
        fr = 520 + 420 * np.sin(np.pi * x / 0.7) ** 1.5 + 14 * np.sin(2 * np.pi * 6 * x)
        ph = np.cumsum(fr) / SR
        return (np.sin(2 * np.pi * ph) + 0.5 * np.sin(4 * np.pi * ph) + 0.3 * np.sin(6 * np.pi * ph)) * env * 0.45
    if kind == "woof":
        x = tt(0.28)
        ph = np.cumsum(260 * np.exp(-x * 3) + 120) / SR
        s = np.sign(np.sin(2 * np.pi * ph)) * 0.4 + np.sin(2 * np.pi * ph)
        return lp(s, 6) * np.exp(-x * 9) * 0.7 + lp(rng.normal(0, 1, len(x)), 5) * np.exp(-x * 25) * 0.2
    if kind == "bonk":
        x = tt(0.4)
        return (np.sin(2 * np.pi * (300 * np.exp(-x * 10) + 160) * x) * np.exp(-x * 12) + 0.5 * np.sin(2 * np.pi * 820 * x) * np.exp(-x * 30)) * 0.9
    if kind == "splash":
        x = tt(0.6)
        n = rng.normal(0, 1, len(x))
        return (n - lp(n, 4)) * np.exp(-x * 6) * 0.35 + lp(n, 3) * np.exp(-x * 9) * 0.3
    if kind == "sparkle":
        return arp([88, 91, 95, 100, 103], 0.09, 0.6, 0.25)
    if kind == "cool":
        x = tt(0.8)
        return (np.sin(2 * np.pi * 2637 * x) + 0.6 * np.sin(2 * np.pi * 3951 * x) + 0.3 * np.sin(2 * np.pi * 5274 * x)) * np.exp(-x * 5) * 0.25
    if kind == "tick":
        x = tt(0.08)
        return np.sin(2 * np.pi * 1500 * x) * np.exp(-x * 60) * 0.5
    if kind == "drumroll":
        x = tt(2.6)
        n = rng.normal(0, 1, len(x)) * (0.55 + 0.45 * np.sin(2 * np.pi * 22 * x) ** 2)
        return lp(n, 8) * (0.15 + 0.35 * x / 2.6)
    if kind == "ding":
        return mallet(hz(88), 1.2, 0.6) + mallet(hz(95), 1.2, 0.4)
    if kind == "yay":
        return arp([72, 76, 79, 84, 88, 91], 0.07, 1.0, 0.4)
    if kind == "whoosh":
        x = tt(0.45)
        n = rng.normal(0, 1, len(x))
        band = lp(n, 3) - lp(n, 18)
        return band * np.sin(np.pi * x / 0.45) ** 2 * 0.5
    if kind == "collect":  # étoile gagnée
        a, g = arp([84, 88, 91, 96], 0.05, 0.5, 0.3), glide(900, 2400, 0.25, 6) * 0.15
        a[: len(g)] += g
        return a
    if kind == "giggle":
        out = np.zeros(int(SR * 0.7))
        for j in range(4):
            s = glide(700 - j * 40, 520 - j * 40, 0.12, 14) * 0.35
            i = int(j * 0.15 * SR)
            out[i:i + len(s)] += s
        return out
    if kind == "moo":  # meuh : grave, glissando descendant, voix nasale
        x = tt(1.0)
        ph = np.cumsum(150 - 45 * x + 6 * np.sin(2 * np.pi * 5 * x)) / SR
        s = np.sin(2 * np.pi * ph) + 0.6 * np.sin(4 * np.pi * ph) + 0.4 * np.sin(6 * np.pi * ph) + 0.25 * np.sin(8 * np.pi * ph)
        return lp(s, 4) * np.sin(np.pi * np.clip(x / 1.0, 0, 1)) ** 0.6 * 0.4
    if kind == "oink":  # groin groin : deux grognements courts nasillards
        out = np.zeros(int(SR * 0.6))
        for j in range(2):
            x = tt(0.18)
            ph = np.cumsum(240 + 80 * np.sin(np.pi * x / 0.18)) / SR
            s = np.sign(np.sin(2 * np.pi * ph)) * 0.5 + lp(rng.normal(0, 1, len(x)), 3) * 0.3
            i = int(j * 0.26 * SR)
            out[i:i + len(x)] += lp(s, 5) * np.sin(np.pi * x / 0.18) * 0.45
        return out
    if kind == "quack":  # coin-coin
        out = np.zeros(int(SR * 0.6))
        for j in range(2):
            x = tt(0.17)
            ph = np.cumsum(520 - 120 * x / 0.17) / SR
            s = np.sign(np.sin(2 * np.pi * ph)) + 0.5 * np.sign(np.sin(6 * np.pi * ph))
            i = int(j * 0.25 * SR)
            out[i:i + len(x)] += lp(s, 3) * np.exp(-x * 6) * 0.3
        return out
    if kind == "cluck":  # cot-cot-codet
        out = np.zeros(int(SR * 0.8))
        for j, (f0, d) in enumerate([(700, 0.07), (700, 0.07), (900, 0.22)]):
            s = glide(f0, f0 * 1.4, d, 10) * 0.4
            i = int([0, 0.13, 0.28][j] * SR)
            out[i:i + len(s)] += s
        return out
    if kind == "neigh":  # hennissement : vibrato rapide descendant
        x = tt(1.0)
        ph = np.cumsum((900 - 500 * x) * (1 + 0.08 * np.sin(2 * np.pi * 18 * x))) / SR
        s = np.sin(2 * np.pi * ph) + 0.4 * np.sin(4 * np.pi * ph)
        return s * np.sin(np.pi * x) ** 0.7 * np.exp(-x * 0.8) * 0.3
    if kind == "beep":  # klaxon (deux tons)
        x = tt(0.22)
        s = np.sign(np.sin(2 * np.pi * 440 * x)) * 0.5 + np.sign(np.sin(2 * np.pi * 554 * x)) * 0.5
        return lp(s, 6) * np.clip(x / 0.01, 0, 1) * np.clip((0.22 - x) / 0.02, 0, 1) * 0.3
    if kind == "toot":  # sifflet de train
        x = tt(0.9)
        s = sum(np.sin(2 * np.pi * f0 * x) for f0 in (587, 740, 880)) / 3 + lp(rng.normal(0, 1, len(x)), 2) * 0.08
        return s * np.clip(x / 0.05, 0, 1) * np.clip((0.9 - x) / 0.15, 0, 1) * 0.35
    if kind == "vroom":  # moteur qui arrive
        x = tt(1.0)
        ph = np.cumsum(60 + 70 * x + 8 * np.sin(2 * np.pi * 9 * x)) / SR
        s = np.sign(np.sin(2 * np.pi * ph)) * 0.6 + lp(rng.normal(0, 1, len(x)), 12) * 0.4
        return lp(s, 8) * np.clip(x / 0.3, 0, 1) * np.clip((1.0 - x) / 0.2, 0, 1) * 0.35
    raise ValueError(kind)


for e in cfg["sfx"]:
    put(fxbuf, e["t"], sfx(e["kind"]))

# --- musique --------------------------------------------------------------------
beat = 60 / 108
melody = [72, 74, 76, 79, 76, 74, 72, 69, 72, 76, 79, 81, 79, 76, 74, 72]
bass = [48, 48, 45, 45, 43, 43, 48, 48]
t, k = 0.0, 0
while t < D:
    put(music, t, mallet(hz(melody[k % len(melody)]), 0.8, 0.55))
    if k % 2 == 0:
        put(music, t, mallet(hz(bass[(k // 2) % len(bass)]), 1.4, 0.5))
    t += beat / 2 if k % 4 == 3 else beat
    k += 1
env = np.convolve((np.abs(voice) > 0.02).astype(float), np.ones(int(SR * 0.25)) / (SR * 0.25), mode="same")
music *= 1 - 0.7 * np.clip(env * 3, 0, 1)

mix = np.tanh((voice + fxbuf * 0.55 + music * 0.2) * 1.1)
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.9
pcm = (np.stack([mix, mix], axis=1) * 32767).astype(np.int16)
with wave.open(os.path.join(OUT, "audio.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
json.dump(voices, open(os.path.join(OUT, "voice.json"), "w", encoding="utf-8"), ensure_ascii=False)
print(f"audio.wav · {D} s · {len(lines)} répliques (anglais : {'Kokoro' if kokoro_ok else 'Samantha'}) · {len(cfg['sfx'])} bruitages")
for m in warn:
    print("⚠", m)

