"""Bande son commune de la série : voix Kokoro calées sur timeline.json de l'épisode,
musique de marimba, bruitages synthétisés. Usage : python3 lib/audio.py <dossier-épisode> [bpm]"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

SR = 48000
ep = os.path.abspath(sys.argv[1])
tl = json.load(open(os.path.join(ep, 'timeline.json')))
DUR = tl.get('duration', 30)
N = int(SR * DUR)
mix = np.zeros(N)
rng = np.random.default_rng(7)

def add(sig, t, gain=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    mix[i:i + len(sig)] += sig

def env(n, a=0.005, r=0.3):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    e *= np.exp(-np.linspace(0, 1, n) / max(r, 1e-3) * 3); return e

def tone(f, d, vel=1.0, harm=(1, .4, .2)):
    t = np.arange(int(SR * d)) / SR
    s = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(harm))
    return s * env(len(t), 0.003, d * 0.45) * vel
m = lambda n: 440 * 2 ** ((n - 69) / 12)

# ── musique : marimba + basse, tempo réglable ─────────────────────────────────
bpm = float(sys.argv[2]) if len(sys.argv) > 2 else tl.get('bpm', 132); beat = 60 / bpm
mel = tl.get('melody', [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 76, 74])
bass = [48, 48, 55, 55, 53, 53, 55, 55]
t = 0.0; i = 0
while t < DUR:
    add(tone(m(mel[i % len(mel)]), 0.35, 0.5, (1, .5, .1)), t)
    if i % 2 == 0: add(tone(m(bass[(i // 2) % 8]), 0.5, 0.6, (1, .3)), t)
    if i % 4 == 2: add(tone(m(mel[i % len(mel)] - 12), 0.2, 0.25), t + beat / 2)
    t += beat / 2; i += 1
for k in range(int(DUR / beat)):
    add(rng.standard_normal(int(0.03 * SR)) * np.exp(-np.linspace(0, 8, int(0.03 * SR))) * 0.12, k * beat + (beat / 2 if k % 2 else 0))
mix *= tl.get('music_gain', 0.4)

# ── bruitages ─────────────────────────────────────────────────────────────────
def noise(d, vol=1):
    n = int(SR * d); x = rng.standard_normal(n)
    k = np.cumsum(x); k -= np.convolve(k, np.ones(200) / 200, 'same')
    return k / np.max(np.abs(k)) * np.exp(-np.linspace(0, 1, n) * 3) * vol
def sweep(f0, f1, d, vol=1):
    t = np.arange(int(SR * d)) / SR; f = np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.005, d * .5) * vol
def bell(d=1.8):
    t = np.arange(int(SR * d)) / SR
    return sum(a * np.sin(2 * np.pi * f * t) for f, a in [(880, 1), (1320, .6), (1760, .4), (2230, .25)]) * np.exp(-t * 2.2) * 0.5
def eventsfx(n, t0):
    if n == 'alarm':
        for k in range(14): add(np.sign(np.sin(2 * np.pi * 1700 * np.arange(int(0.07 * SR)) / SR)) * 0.18, t0 + k * 0.16)
    elif n == 'boing': add(sweep(300, 900, 0.5, 0.6), t0)
    elif n == 'skid': add(noise(0.6, 0.5) * np.linspace(1, 0.1, int(0.6 * SR)), t0)
    elif n == 'splash': add(noise(0.7, 0.9), t0); add(sweep(500, 120, 0.3, 0.5), t0)
    elif n == 'bell':  # sonnerie électrique d'école
        tt = np.arange(int(1.4 * SR)) / SR
        add(np.sign(np.sin(2 * np.pi * 22 * tt)) * np.sin(2 * np.pi * 1050 * tt) * 0.16 * np.minimum(1, (1.4 - tt) * 4), t0)
        add(bell(), t0, 0.6)
    elif n == 'chalk':
        for k in range(5):
            x = rng.standard_normal(int(0.16 * SR)); x = np.diff(x, prepend=0) * np.hanning(len(x)) * 0.10
            add(x, t0 + k * 0.25)
    elif n == 'tummy':
        tt = np.arange(int(1.3 * SR)) / SR; f = 70 + 25 * np.sin(2 * np.pi * 3 * tt)
        add(np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * tt)) * np.hanning(len(tt)) * 0.75, t0)
        add(sweep(160, 90, 0.4, 0.3), t0 + 0.9)
    elif n == 'knock':
        for k in (0, 0.22, 0.5, 0.72): add(sweep(900, 300, 0.06, 0.45) + 0, t0 + k); add(noise(0.05, 0.25), t0 + k)
    elif n == 'chirp':
        for k in range(3): add(sweep(2600, 3800, 0.07, 0.22), t0 + k * 0.1)
    elif n == 'chime':
        for k, nn in enumerate([84, 88, 91, 96]): add(tone(m(nn), 0.5, 0.35, (1, .2)), t0 + k * 0.07)
    elif n == 'whoosh': add(noise(0.6, 0.45), t0)
    elif n == 'wave': pass
    elif n == 'click': add(sweep(2400, 1800, 0.03, 0.5), t0); add(sweep(2000, 1500, 0.03, 0.4), t0 + 0.08)
    elif n == 'step':
        for k in range(6): add(sweep(500 + k * 60, 300, 0.06, 0.35), t0 + k * 0.13)
    elif n == 'slide': add(sweep(1400, 500, 0.7, 0.35), t0); add(noise(0.6, 0.25), t0)
    elif n == 'poof':
        x = noise(0.8, 1.0); x = np.convolve(x, np.ones(40) / 40, 'same'); add(x * 2.5, t0); add(sweep(220, 70, 0.3, 0.6), t0)
    elif n == 'clink': add(tone(2800, 0.35, 0.5, (1, .3, .2)), t0); add(tone(4200, 0.25, 0.25, (1,)), t0 + 0.02)
    elif n == 'brush':
        for k in range(6):
            x = rng.standard_normal(int(0.09 * SR)); x = np.convolve(x, np.ones(8) / 8, 'same') * np.hanning(len(x)) * 0.18
            add(x, t0 + k * 0.17)
    elif n == 'laugh':
        for k in range(5): add(sweep(520 - k * 20, 380, 0.11, 0.25) * 1.0, t0 + k * 0.18)
    elif n == 'crack': add(noise(0.12, 0.8), t0); add(noise(0.08, 0.5), t0 + 0.07)
    elif n == 'sniff':
        for k in range(2): add(noise(0.18, 0.35) * np.linspace(0.2, 1, int(0.18 * SR)), t0 + k * 0.3)
    elif n == 'door': add(sweep(300, 220, 0.4, 0.3), t0); add(noise(0.1, 0.2), t0 + 0.35)
    elif n == 'yawn': add(sweep(380, 160, 1.2, 0.35), t0); add(noise(1.0, 0.12), t0 + 0.1)
    elif n == 'handbell':
        for k in range(8): add(bell(0.9) * 0.8, t0 + k * 0.18)
for e in tl['sfx']: eventsfx(e['name'], e['t'])

# ── voix (Kokoro, voir voix.py) ───────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import voix
chorus = {'class': ['fox', 'rab', 'mimi', 'coin']}
voix.prepare([(w, ln['text']) for ln in tl['lines'] for w in chorus.get(ln['who'], [ln['who']])])
for ln in tl['lines']:
    if ln['who'] in chorus:
        for k, who in enumerate(chorus[ln['who']]):
            add(voix.line(who, ln['text'], ln['t1'] - ln['t0'] - 0.08, SR), ln['t0'] + 0.04 + k * 0.03, 0.55)
    else:
        add(voix.line(ln['who'], ln['text'], ln['t1'] - ln['t0'] - 0.08, SR), ln['t0'] + 0.04)
mix = np.tanh(mix * 0.9) * 0.95
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(ep, 'audio.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('audio.wav ok', DUR, 's')
