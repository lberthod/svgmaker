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

# ── bruitages d'ambiance (saisons 6-10) : doux, pic ≤ 0,5, 0,3 à 3 s ───────────
# Générateur local par son : ne touche pas au rng partagé, les anciens sfx restent identiques.
def _lp(x, k):
    return np.convolve(x, np.ones(k) / k, 'same')
def _wn(r, d):
    return r.standard_normal(int(SR * d))
def _tt(d):
    return np.arange(int(SR * d)) / SR
def _fade(x, a=0.05, b=0.15):
    n = len(x); x = x.copy(); na = max(1, int(a * SR)); nb = max(1, int(b * SR))
    x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x
def _pulses(d, times, f, dec, vol=1.0, r=None):
    y = np.zeros(int(SR * d))
    for tp in times:
        s0 = int(tp * SR); tt = _tt(0.25)
        v = np.sin(2 * np.pi * f * tt) * np.exp(-tt * dec) * vol
        v = v[: len(y) - s0]; y[s0:s0 + len(v)] += v
    return y
def _nsfx(n):
    r = np.random.default_rng(sum(map(ord, n)) + 1000)
    if n == 'wind':
        d = 2.8; x = _lp(_wn(r, d), 60); t = _tt(d)
        x = x * (0.55 + 0.45 * np.sin(2 * np.pi * 0.45 * t + 1)) ; return _fade(x, 0.5, 0.7)
    if n == 'leaves':  # vent dans les feuilles : souffle + froissements
        d = 2.4; t = _tt(d); x = _lp(_wn(r, d), 25) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.6 * t))
        y = _lp(_wn(r, d), 4) * (r.random(len(t)) > 0.995) * 3
        y = _lp(y, 6); return _fade(x + _lp(_wn(r, d), 5) * 0.15 * (0.5 + 0.5 * np.sin(2 * np.pi * 1.3 * t)), 0.4, 0.6)
    if n == 'footleaves':  # pas dans les feuilles mortes
        d = 1.6; y = np.zeros(int(SR * d))
        for k in range(6):
            s0 = int((0.05 + k * 0.26) * SR); g = _wn(r, 0.2); g = np.diff(g, prepend=0) * np.exp(-_tt(0.2) * 14) * (0.8 + 0.4 * r.random())
            g = _lp(g, 3); y[s0:s0 + len(g)] += g[: len(y) - s0]
        return y
    if n == 'crickets':
        d = 3.0; t = _tt(d); y = np.zeros(len(t))
        for f, ph in ((4300, 0), (4700, 0.37)):
            gate = (((t + ph) * 5.5) % 1 < 0.45) * ((t * 5.5 * 6 % 1) < 0.7) * 1.0
            gate = _lp(gate, 90); y += np.sin(2 * np.pi * f * t) * gate * (0.8 if ph == 0 else 0.5)
        return _fade(y, 0.3, 0.4)
    if n == 'traffic':  # trafic doux, lointain
        d = 3.0; t = _tt(d); x = _lp(_wn(r, d), 40) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * t))
        x += np.sin(2 * np.pi * 70 * t) * 0.35 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * t + 2))
        v = np.sin(2 * np.pi * np.cumsum(180 + 40 * np.sin(2 * np.pi * 0.35 * t)) / SR) * np.hanning(len(t)) * 0.12
        return _fade(x + v, 0.5, 0.6)
    if n == 'siren':  # sirène de pompier lointaine, deux tons
        d = 2.8; t = _tt(d); f = np.where((t * 1.25) % 1 < 0.5, 660, 880).astype(float); f = _lp(f, 2400)
        y = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.hanning(len(t)) ** 0.7
        return _lp(y, 4)
    if n == 'tram':  # frein de tram : chuintement doux + grincement
        d = 1.8; t = _tt(d); x = _lp(_wn(r, d), 5) * np.hanning(len(t)) ** 1.5 * 0.7
        f = np.linspace(2300, 1500, len(t)); sq = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(len(t)) ** 3 * 0.18
        return x + sq
    if n == 'station':  # annonce de gare : ding-dong-ding
        d = 2.3; y = np.zeros(int(SR * d))
        for k, nn in enumerate([79, 74, 79, 72]):
            v = tone(m(nn), 0.8, 0.6, (1, .3, .1)); s0 = int(k * 0.42 * SR); y[s0:s0 + len(v)] += v[: len(y) - s0]
        return y
    if n == 'train':  # train qui part : chuf-chuf accéléré + sifflet
        d = 3.0; y = np.zeros(int(SR * d)); tp = 0.1; gap = 0.5
        while tp < d - 0.3:
            s0 = int(tp * SR); g = _lp(_wn(r, 0.22), 30) * np.exp(-_tt(0.22) * 16)
            y[s0:s0 + len(g)] += g[: len(y) - s0] * 1.0; tp += gap; gap = max(0.2, gap * 0.9)
        t = _tt(0.6); w = (np.sin(2 * np.pi * 740 * t) + 0.4 * np.sin(2 * np.pi * 1110 * t)) * np.hanning(len(t)) * 0.25
        y[: len(w)] += w
        return y
    if n == 'fanfare':
        d = 2.2; y = np.zeros(int(SR * d))
        for k, (nn, dd) in enumerate([(67, .25), (72, .25), (76, .25), (79, .9)]):
            v = tone(m(nn), dd + 0.3, 0.5, (1, .5, .35, .2)); s0 = int([0, .28, .56, .84][k] * SR)
            y[s0:s0 + len(v)] += v[: len(y) - s0]
        return y
    if n == 'whistle':  # sifflet d'arbitre : deux coups, pas trop aigu
        d = 1.0; y = np.zeros(int(SR * d))
        for s0, dd in ((0.0, 0.3), (0.4, 0.5)):
            t = _tt(dd); tr = np.sin(2 * np.pi * 36 * t); f = 2200 + 40 * tr
            v = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.8 + 0.2 * tr) * np.hanning(len(t)) ** 0.5
            i = int(s0 * SR); y[i:i + len(v)] += v
        return y
    if n == 'applause':
        d = 3.0; t = _tt(d); y = np.zeros(len(t))
        for k in range(110):
            s0 = int(r.random() * (len(t) - 2500)); c = np.diff(_wn(r, 0.05), prepend=0) * np.exp(-_tt(0.05) * 120)
            y[s0:s0 + len(c)] += c * (0.4 + r.random())
        y = _lp(y, 3) * np.hanning(len(t)) ** 0.5
        return y
    if n == 'oven':  # ding de four
        t = _tt(1.6); return (np.sin(2 * np.pi * 2093 * t) + 0.3 * np.sin(2 * np.pi * 4186 * t)) * np.exp(-t * 3.5)
    if n == 'owl':  # hulotte : hou ... hou-hou-hou
        d = 2.6; y = np.zeros(int(SR * d))
        for s0, dd, f0 in ((0.0, 0.7, 400), (1.0, 0.25, 380), (1.35, 0.25, 380), (1.7, 0.7, 340)):
            t = _tt(dd); f = f0 * (1 - 0.12 * t / dd)
            v = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.2 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.hanning(len(t)) ** 1.5
            i = int(s0 * SR); y[i:i + len(v)] += v
        return y
    if n == 'fire':  # crépitement de feu
        d = 2.6; t = _tt(d); y = _lp(_wn(r, d), 12) * 0.25 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t))
        for _ in range(28):
            s0 = int(r.random() * (len(t) - 2000)); L = int(SR * (0.004 + 0.012 * r.random()))
            c = np.diff(_wn(r, 0.02), prepend=0)[:L] * np.exp(-np.arange(L) / (L / 4)) * (0.3 + 1.2 * r.random())
            y[s0:s0 + L] += _lp(c, 2)
        return _fade(y, 0.2, 0.3)
    if n == 'lapping':  # clapotis
        d = 2.4; t = _tt(d); y = np.zeros(len(t))
        for _ in range(16):
            s0 = int(r.random() * (len(t) - 9000)); f0 = 500 + 700 * r.random(); u = _tt(0.15)
            v = np.sin(2 * np.pi * np.cumsum(f0 + 1500 * u) / SR) * np.exp(-u * 30) * 0.5
            y[s0:s0 + len(v)] += v
        return _fade(y + _lp(_wn(r, d), 20) * 0.2, 0.2, 0.4)
    if n == 'departbell':  # cloche de départ : trois coups
        d = 2.2; y = np.zeros(int(SR * d))
        for k in range(3):
            v = bell(1.2); s0 = int(k * 0.5 * SR); y[s0:s0 + len(v)] += v[: len(y) - s0]
        return y
    if n == 'market':  # ambiance de marché : murmure + tintements
        d = 3.0; t = _tt(d); y = _lp(_wn(r, d), 14) * 0.5 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.9 * t))
        for s0 in (0.5, 1.4, 2.2):
            v = tone(2600, 0.25, 0.3, (1, .3)); i = int(s0 * SR); y[i:i + len(v)] += v
        return _fade(y, 0.3, 0.4)
    if n == 'firecrackers':  # pétards lointains et sourds
        d = 1.6; y = np.zeros(int(SR * d))
        for s0 in (0.0, 0.12, 0.2, 0.55, 0.62, 0.7, 0.78, 1.1):
            L = int(0.06 * SR); c = _lp(_wn(r, 0.06), 6)[:L] * np.exp(-np.arange(L) / (L / 5)); i = int(s0 * SR); y[i:i + L] += c * 1.3
        return y
    if n == 'rocket':  # ronronnement de fusée
        d = 3.0; t = _tt(d); x = _lp(_wn(r, d), 30) * 0.6 + np.sin(2 * np.pi * 55 * t) * 0.4 + np.sin(2 * np.pi * 110 * t) * 0.15
        return _fade(x * (0.8 + 0.2 * np.sin(2 * np.pi * 7 * t)), 0.4, 0.5)
    if n == 'countdown':  # bips de compte à rebours
        d = 2.2; y = _pulses(d, [0, 0.5, 1.0], 880, 9, 0.8); y += _pulses(d, [1.5], 1320, 5, 0.8); return y
    if n == 'space':  # souffle d'ambiance spatiale
        d = 3.0; t = _tt(d); x = _lp(_wn(r, d), 80) * 0.7 + np.sin(2 * np.pi * 220 * t) * 0.15 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t))
        x += np.sin(2 * np.pi * 330.5 * t) * 0.1; return _fade(x, 0.8, 0.9)
    if n == 'moonchime':  # tintement de la lune
        d = 2.2; y = np.zeros(int(SR * d))
        for k, nn in enumerate([96, 100, 103, 108]):
            v = tone(m(nn), 1.2, 0.4, (1, .15)); i = int(k * 0.2 * SR); y[i:i + len(v)] += v[: len(y) - i]
        return y
    return None
NEWSFX = ('wind leaves footleaves crickets traffic siren tram station train fanfare whistle applause oven owl fire '
          'lapping departbell market firecrackers rocket countdown space moonchime').split()
def newsfx(n, t0):
    if n not in NEWSFX: return
    y = np.nan_to_num(_nsfx(n)); pk = np.max(np.abs(y))
    if pk > 0: y = y / pk * 0.5
    add(y, t0)
for e in tl['sfx']: eventsfx(e['name'], e['t']); newsfx(e['name'], e['t'])

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
