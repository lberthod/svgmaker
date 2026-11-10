"""Bande son du cartoon : voix macOS (Thomas, Flo, Grandpa) calées sur timeline.json,
musique de marimba, bruitages synthétisés. Usage : python3 audio.py  → audio.wav"""
import json, os, subprocess, tempfile, wave
import numpy as np

SR = 48000
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, 'timeline.json')))
N = SR * 30
mix = np.zeros(N)
rng = np.random.default_rng(7)

def add(sig, t, gain=1.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    mix[i:i + len(sig)] += sig

def env(n, a=0.005, r=0.3):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    e *= np.exp(-np.linspace(0, 1, n) / max(r, 1e-3) * 3); return e

def tone(f, d, vel=1.0, harm=(1, .4, .2)):
    t = np.arange(int(SR * d)) / SR
    s = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(harm))
    return s * env(len(t), 0.003, d * 0.45) * vel

# ── musique : 132 bpm, do majeur, marimba + basse ─────────────────────────────
bpm = 132; beat = 60 / bpm
mel = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 76, 74]
bass = [48, 48, 55, 55, 53, 53, 55, 55]
m = lambda n: 440 * 2 ** ((n - 69) / 12)
t = 0.0; i = 0
while t < 30:
    add(tone(m(mel[i % 16]), 0.35, 0.5, (1, .5, .1)), t); 
    if i % 2 == 0: add(tone(m(bass[(i // 2) % 8]), 0.5, 0.6, (1, .3)), t)
    if i % 4 == 2: add(tone(m(mel[i % 16] - 12), 0.2, 0.25), t + beat / 2)
    t += beat / 2; i += 1
# pulsation légère
for k in range(int(30 / beat)):
    add(rng.standard_normal(int(0.03 * SR)) * np.exp(-np.linspace(0, 8, int(0.03 * SR))) * 0.12, k * beat + (beat / 2 if k % 2 else 0))
music_gain = 0.45; mix *= music_gain

# ── bruitages ─────────────────────────────────────────────────────────────────
def noise(d, f0, f1, vol=1):
    n = int(SR * d); x = rng.standard_normal(n)
    k = np.cumsum(x); k -= np.convolve(k, np.ones(200) / 200, 'same')
    return k / np.max(np.abs(k)) * np.exp(-np.linspace(0, 1, n) * 3) * vol
def sweep(f0, f1, d, vol=1):
    t = np.arange(int(SR * d)) / SR; f = np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.005, d * .5) * vol
def bell(d=1.8):
    t = np.arange(int(SR * d)) / SR
    return sum(a * np.sin(2 * np.pi * f * t) for f, a in [(880, 1), (1320, .6), (1760, .4), (2230, .25)]) * np.exp(-t * 2.2) * 0.5

for e in tl['sfx']:
    n, t0 = e['name'], e['t']
    if n == 'alarm':
        for k in range(14):
            add(np.sign(np.sin(2 * np.pi * 1700 * np.arange(int(0.07 * SR)) / SR)) * 0.18, t0 + k * 0.16)
    elif n == 'boing': add(sweep(300, 900, 0.5, 0.6), t0); add(np.sin(2*np.pi*np.arange(int(.2*SR))/SR*60)*0.01, t0)
    elif n == 'skid': add(noise(0.6, 0, 0, 0.5) * np.linspace(1, 0.1, int(0.6 * SR)), t0)
    elif n == 'splash': add(noise(0.7, 0, 0, 0.9), t0); add(sweep(500, 120, 0.3, 0.5), t0)
    elif n == 'bell': add(bell(), t0); add(bell(), t0 + 0.55, 0.8)
# whooshs de course et bruits de pas
add(noise(1.2, 0, 0, 0.5), 3.85); add(noise(1.4, 0, 0, 0.45), 12.3); add(noise(1.5, 0, 0, 0.4), 21.0)
for k in range(int((21.2 - 12.6) / 0.16)):
    add(sweep(120, 70, 0.05, 0.25), 12.6 + k * 0.32)
add(sweep(900, 500, 0.25, 0.4), 10.3)   # oiseau
add(sweep(200, 900, 0.3, 0.5), 2.35)     # sursaut
# ── voix ──────────────────────────────────────────────────────────────────────
voices = {'fox': ('Thomas', 190, 1.0), 'rab': ('Flo (Français (France))', 200, 1.22), 'owl': ('Grandpa (Français (France))', 170, 0.92), 'snail': ('Grandma (Français (France))', 105, 1.0)}
def rd(p):
    with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(float) / 32768
def ff(i, o, af):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', i, '-af', af, '-ar', str(SR), '-ac', '1', o], check=True)
sil = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
for ln in tl['lines']:
    v, rate, pitch = voices[ln['who']]
    with tempfile.TemporaryDirectory() as d:
        a, w, w2 = (os.path.join(d, n) for n in ('v.aiff', 'v.wav', 'v2.wav'))
        subprocess.run(['say', '-v', v, '-r', str(rate), '-o', a, ln['text'].replace('!', ' ')], check=True)
        ff(a, w, f'{sil},asetrate={int(22050 * pitch)},aresample={SR},atempo={1 / pitch:.3f},acompressor=threshold=-18dB:ratio=3,volume=1.5')
        x = rd(w); win = ln['t1'] - ln['t0'] - 0.08
        if len(x) / SR > win:
            ff(w, w2, f'atempo={min(len(x) / SR / win, 2.0):.3f}'); x = rd(w2)
    add(x, ln['t0'] + 0.04, 1.0)
mix = np.tanh(mix * 0.9) * 0.95
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(here, 'audio.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('audio.wav ok')
