"""Bande son de « LES ANOMALIES » ch. 1 (40 s) : musique d'action synthétique (140 bpm, mi mineur),
bruitages synthétisés et voix macOS calées sur timeline.json (Volta : Sandy, Givre : Thomas,
Écho : Shelley, le Traqueur : Jacques passé en voix métallique). Usage : python3 audio.py → audio.wav"""
import json, os, subprocess, tempfile, wave
import numpy as np

SR = 48000
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, 'timeline.json')))
T = tl['duration']; N = int(SR * T)
rng = np.random.default_rng(21)
music = np.zeros(N); sfx = np.zeros(N); vox = np.zeros(N)
ts = lambda d: np.arange(int(SR * d)) / SR

def add(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    buf[i:i + len(sig)] += sig

def lp(x, w): return np.convolve(x, np.ones(w) / w, 'same')
def hp(x, w): return x - lp(x, w)
def norm(x): m = np.max(np.abs(x)); return x / m if m else x
def dec(n, r): return np.exp(-np.linspace(0, 1, n) * r)
def noise(d): return rng.standard_normal(int(SR * d))
m2f = lambda n: 440 * 2 ** ((n - 69) / 12)
def saw(f, d): t = ts(d); return 2 * ((t * f) % 1) - 1
def sq(f, d): t = ts(d); return np.sign(np.sin(2 * np.pi * f * t))
def sweep(f0, f1, d, wave_=np.sin):
    f = np.geomspace(f0, f1, int(SR * d)); return wave_(2 * np.pi * np.cumsum(f) / SR)

# ── Musique ──────────────────────────────────────────────────────────────────
BEAT = 60 / 140
def kick(v=1):
    t = ts(.35); f = 50 * (1 + 3 * np.exp(-t * 40)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) * v
def snare(v=1):
    n = int(.22 * SR); return (hp(noise(.22), 6) * .8 + np.sin(2 * np.pi * 190 * ts(.22)) * .5) * dec(n, 14) * v
def hat(v=1):
    n = int(.05 * SR); return hp(noise(.05), 3) * dec(n, 18) * v
def bass(n, d, v=1):
    s = lp(saw(m2f(n), d) + .5 * sq(m2f(n) / 2, d), 18); e = np.minimum(1, (len(s) - np.arange(len(s))) / (SR * .03))
    return s * e * dec(len(s), 2) * v
def stab(notes, d, v=1):
    s = sum(lp(saw(m2f(n) * (1 + k * .004), d), 6) for n in notes for k in (-1, 1)); return s * dec(len(s), 5) * v
def pad(notes, d, v=1):
    s = sum(lp(saw(m2f(n) * (1 + rng.uniform(-.004, .004)), d), 60) for n in notes)
    n = len(s); e = np.minimum(1, np.minimum(np.arange(n) / (SR * .8), (n - np.arange(n)) / (SR * .6))); return s * e * v

riff = [40, 40, 43, 40, 38, 40, 47, 45]          # mi grave, 8 croches
def section(t0, t1, drums='full', bass_on=True, stabs=False):
    t = t0; i = 0
    while t < t1 - 1e-6:
        b = i // 2
        if drums in ('full', 'half', 'build'):
            if i % 2 == 0 and (drums != 'half' or b % 2 == 0): add(music, kick(), t)
            if drums == 'full' and i % 4 == 2: add(music, snare(.7), t)
            if drums == 'full': add(music, hat(.25 if i % 2 else .4), t)
            if drums == 'build': add(music, snare(.25 + .6 * (t - t0) / max(t1 - t0, .1)), t)
        if bass_on: add(music, bass(riff[i % 8], BEAT / 2 * .95, .55), t)
        if stabs and i % 8 == 0: add(music, stab([64, 67, 71], .3, .25), t)
        t += BEAT / 2; i += 1

add(music, stab([52, 59, 64, 67], 1.2, .5), 0.1); add(music, kick(1.2), .1)       # coup d'ouverture
section(0.6, 3.5, 'half', True)
add(music, pad([40, 47, 52, 55], 4.6, .14), 3.5); section(3.5, 8, 'half', True)
section(8, 12.5, 'full', True, True)
section(12.5, 16, 'full', True, True)
section(16, 23.5, 'full', True, True)
add(music, pad([45, 52, 57, 60], 3.6, .15), 23.5); section(23.5, 26.8, 'build', True)
add(music, sweep(200, 2400, 1.8, lambda x: np.sign(np.sin(x))) * np.linspace(0, .12, int(SR * 1.8)), 26.8)
section(26.8, 28.5, 'build', False)
add(music, stab([52, 59, 64, 67, 71], 1.6, .6), 28.6); add(music, kick(1.4), 28.6)
section(29.2, 32.2, 'full', True, True)
add(music, stab([52, 59, 64], 1.2, .5), 32.2)
add(music, pad([52, 56, 59, 64], 3.2, .16), 33.9)                                       # mi majeur : victoire
add(music, pad([40, 46, 52], 3.4, .2), 36.7); add(music, kick(1.3), 37.0)               # triton sombre
add(music, stab([40, 46, 52, 58], 2.5, .45), 37.0)

# ── Bruitages ────────────────────────────────────────────────────────────────
def boom(v=1, d=2.0, f0=45):
    t = ts(d); f = f0 * (1 + 2 * np.exp(-t * 8))
    low = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.5)
    crack = lp(noise(d), 4) * np.exp(-t * 4)
    return norm(low * 1.2 + crack * .9) * v
def whoosh(d, v=1, w=25):
    x = lp(noise(d), w); return norm(x) * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 1.5 * v
def zap(d=.5, v=1):
    t = ts(d); s = np.sign(np.sin(2 * np.pi * (90 + 40 * np.sin(2 * np.pi * 13 * t)) * t)) * .6 + hp(noise(d), 3) * (rng.random(len(t)) > .7)
    return s * dec(len(t), 4) * v
def ice(d=.8, v=1):
    s = np.zeros(int(SR * d))
    for _ in range(26):
        i = int(rng.uniform(0, d * .85) * SR); k = sweep(rng.uniform(2500, 6000), rng.uniform(1500, 3000), .06) * dec(int(.06 * SR), 6)
        s[i:i + len(k)] += k[: len(s) - i] * rng.uniform(.3, 1)
    return s * v
def tk(d=1.6, v=1):
    t = ts(d); s = np.sin(2 * np.pi * 110 * t + 3 * np.sin(2 * np.pi * 5 * t)) + .5 * np.sin(2 * np.pi * 220.7 * t)
    return s * np.sin(np.pi * np.linspace(0, 1, len(t))) * v
def metal(v=1):
    t = ts(1.2); s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * r) for f, r in [(523, 4), (1187, 5), (1730, 7), (2650, 9)])
    return (norm(s) + lp(noise(1.2), 3) * np.exp(-t * 30)) * v

for e in tl['sfx']:
    n, t0 = e['name'], e['t']
    if n == 'hit': add(sfx, boom(.7, 1.0, 55), t0)
    elif n == 'whoosh': add(sfx, whoosh(1.3, .8), t0)
    elif n == 'land': add(sfx, boom(.8, 1.2, 40), t0)
    elif n == 'scan': add(sfx, sweep(300, 1200, 1.4) * .12 * np.sin(np.pi * np.linspace(0, 1, int(SR * 1.4))), t0)
    elif n == 'alarm':
        for k in range(3): add(sfx, sq(880, .16) * .08 * dec(int(.16 * SR), 1), t0 + k * .25); add(sfx, sq(660, .16) * .08, t0 + k * .25 + .125)
    elif n == 'panel': add(sfx, whoosh(.25, .5, 8), t0); add(sfx, boom(.35, .3, 90), t0 + .2)
    elif n == 'lock': add(sfx, sq(1760, .07) * .12, t0); add(sfx, sq(1760, .07) * .12, t0 + .1)
    elif n == 'zap': add(sfx, zap(.6, .55), t0)
    elif n == 'ice': add(sfx, ice(.7, .6), t0)
    elif n == 'tk': add(sfx, tk(1.6, .35), t0)
    elif n == 'missile': add(sfx, whoosh(.9, .45, 6) + sweep(1200, 500, .9) * .08, t0)
    elif n == 'boom': add(sfx, boom(1.0), t0)
    elif n == 'iceWall': add(sfx, ice(1.0, .9), t0); add(sfx, boom(.5, .6, 70), t0)
    elif n == 'laser': add(sfx, sweep(2400, 400, .25) * .35, t0); add(sfx, sq(140, 1.8) * .12 * dec(int(SR * 1.8), 1.5), t0 + .1); add(sfx, zap(1.5, .3), t0 + .15)
    elif n == 'klang': add(sfx, metal(.8), t0)
    elif n == 'charge': add(sfx, sweep(80, 900, 2.6, lambda x: np.sign(np.sin(x))) * np.linspace(0, .2, int(SR * 2.6)), t0); add(sfx, zap(2.4, .3), t0 + .2)
    elif n == 'beam': add(sfx, (sq(110, .7) * .3 + whoosh(.7, .6, 4)) * np.linspace(.4, 1, int(SR * .7)), t0)
    elif n == 'glitch':
        for k in range(8): add(sfx, sq(rng.choice([220, 330, 880, 1320]), .07) * .2, t0 + k * .15 + rng.uniform(0, .05))
    elif n == 'bigboom': add(sfx, boom(1.3, 3.0, 35), t0); add(sfx, metal(.4), t0 + .15)
    elif n == 'wind': add(sfx, whoosh(2.8, .25, 60), t0)
    elif n == 'eye': add(sfx, sweep(60, 40, 2.5) * .5 * dec(int(SR * 2.5), 1.5), t0); add(sfx, sweep(1800, 900, .4) * .15, t0 + .1)

# ── Voix ─────────────────────────────────────────────────────────────────────
voices = {'volta': ('Flo (Français (France))', 190, 1.04), 'givre': ('Eddy (Français (France))', 190, .97),
          'echo': ('Shelley (Français (France))', 185, 1.06), 'robot': ('Thomas', 165, .88)}
QA = os.environ.get('VOX_DIR')  # si défini : chaque réplique traitée y est écrite pour le contrôle Whisper
def rd(p):
    with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(float) / 32768
def ff(i, o, af): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', i, '-af', af, '-ar', str(SR), '-ac', '1', o], check=True)
sil = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
windows = []
for ln in tl['lines']:
    v, rate, pitch = voices[ln['who']]
    text = ln['text'].replace('…', ',').replace('!', '').replace("l'a", "l'a")
    with tempfile.TemporaryDirectory() as d:
        a, w, w2 = (os.path.join(d, n) for n in ('v.aiff', 'v.wav', 'v2.wav'))
        subprocess.run(['say', '-v', v, '-r', str(rate), '-o', a, text], check=True)
        ff(a, w, f'{sil},asetrate={int(22050 * pitch)},aresample={SR},atempo={1 / pitch:.3f},highpass=f=90,acompressor=threshold=-18dB:ratio=3')
        x = rd(w); win = ln['t1'] - ln['t0'] - 0.05
        if len(x) / SR > win:
            ff(w, w2, f'atempo={min(len(x) / SR / win, 1.8):.3f}'); x = rd(w2)
    if ln['who'] == 'robot':  # voix métallique légère (reste intelligible) : modulation en anneau + écho court
        t = np.arange(len(x)) / SR
        x = .72 * x + .28 * x * np.sin(2 * np.pi * 70 * t)
        x = x + .3 * np.concatenate([np.zeros(int(.016 * SR)), x])[: len(x)]
    if len(x) / SR > ln['t1'] - ln['t0'] + .05: print('  ⚠ réplique plus longue que sa bulle :', ln['text'])
    if QA:
        with wave.open(os.path.join(QA, f"{len(windows):02d}.wav"), 'wb') as f:
            f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((norm(x) * 30000).astype(np.int16).tobytes())
    print(f"  {ln['who']:5} {ln['t0']:5.2f} → {ln['t0'] + len(x) / SR:5.2f} / {ln['t1']:5.2f}  {ln['text']}")
    add(vox, norm(x), ln['t0'] + 0.03)
    windows.append((ln['t0'] - .1, ln['t0'] + len(x) / SR + .2))

duck = np.ones(N)
for a, b in windows: duck[int(a * SR):int(b * SR)] = .35
duck = lp(duck, 4800)
mix = norm(music) * .4 * duck + norm(sfx) * .75 * (.2 + .8 * duck) + vox * .95  # bruitages à −14 dB sous les voix
mix = np.tanh(mix * 1.3) / np.tanh(1.3); mix *= .95 / np.max(np.abs(mix))
with wave.open(os.path.join(here, 'audio.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio.wav ok,', T, 's')
