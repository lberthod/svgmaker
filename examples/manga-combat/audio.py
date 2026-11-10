"""Bande son de « CROC NOIR » (30 s) : nappe sombre + taikos, pluie, bruitages synthétisés
calés sur les plans de make.mjs, voix macOS (Thomas pour le sabreur, Jacques grave et
ralenti pour la bête). Usage : python3 audio.py  → audio.wav"""
import os, subprocess, tempfile, wave
import numpy as np

SR = 48000
T = 30
N = SR * T
here = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(13)
music = np.zeros(N); sfx = np.zeros(N); vox = np.zeros(N)
ts = lambda d: np.arange(int(SR * d)) / SR

def add(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    buf[i:i + len(sig)] += sig

def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y

def lp_fast(x, width):  # passe-bas par moyenne glissante (rapide)
    k = np.ones(width) / width
    return np.convolve(x, k, 'same')

def hp_fast(x, width):
    return x - lp_fast(x, width)

def decay(n, r):
    return np.exp(-np.linspace(0, 1, n) * r)

def norm(x):
    m = np.max(np.abs(x)); return x / m if m else x

# ── Musique : nappe en ré mineur + taikos ─────────────────────────────────────
def saw(f, d):
    t = ts(d); return 2 * ((t * f) % 1) - 1

def pad(freqs, d, vol):
    s = sum(saw(f * (1 + rng.uniform(-.003, .003)), d) for f in freqs)
    s = lp_fast(s, 60)
    n = len(s); e = np.minimum(1, np.minimum(np.arange(n) / (SR * 1.2), (n - np.arange(n)) / (SR * 0.8)))
    return s * e * vol

m = lambda n: 440 * 2 ** ((n - 69) / 12)
# nappe : ré mineur → si♭ → la (tension) → ré
chords = [(0, 8, [38, 50, 53, 57]), (8, 12, [34, 46, 50, 53]), (12, 19.5, [33, 45, 49, 52]),
          (19.5, 23.5, [34, 46, 49, 53]), (23.5, 26.6, [33, 45, 52, 57]), (26.6, 30, [38, 50, 53, 57])]
for a, b, ch in chords:
    add(music, pad([m(x) for x in ch], b - a + 0.6, 0.18), a)

def taiko(vol=1.0, f0=70):
    t = ts(0.9); f = f0 * (1 + 1.5 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * decay(len(t), 6)
    hit = lp_fast(rng.standard_normal(len(t)), 8) * decay(len(t), 40) * 0.6
    return (body + hit) * vol

# battement lent au début, qui accélère pendant la charge et le choc
beats = [3.6, 4.4, 5.2, 6.0, 6.8, 7.6] + list(np.arange(12, 15.5, 0.43)) + list(np.arange(15.5, 19.5, 0.5)) \
      + [19.6, 20.4, 21.2] + list(np.arange(23.5, 25.4, 0.3))
for i, b in enumerate(beats):
    add(music, taiko(0.9 if i % 2 == 0 else 0.6, 64 if i % 4 else 52), b)

# ── Bruitages ────────────────────────────────────────────────────────────────
def noise(d): return rng.standard_normal(int(SR * d))

def rain(d, vol):
    x = hp_fast(noise(d), 6) * 0.5
    drops = np.zeros(len(x)); idx = rng.integers(0, len(x), int(d * 90)); drops[idx] = rng.uniform(.3, 1, len(idx))
    drops = np.convolve(drops, np.exp(-np.linspace(0, 1, 120) * 8), 'same')
    return (lp_fast(x, 3) + drops * 0.3) * vol

def growl(d, vol):
    t = ts(d); f = 55 + 12 * np.sin(2 * np.pi * 3 * t) + 20 * np.exp(-t * 2)
    tone = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5
    rough = lp_fast(noise(d), 25) * (1 + np.sin(2 * np.pi * 23 * t))
    s = lp_fast(tone + rough * 2, 18)
    e = np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.6)
    return norm(s) * e * vol

def rumble(d, vol):
    t = ts(d); s = lp_fast(noise(d), 300) * 30
    return norm(s + np.sin(2 * np.pi * 32 * t)) * np.minimum(1, t / .2) * decay(len(t), 2) * vol

def whoosh(d, vol, up=True):
    x = noise(d); n = len(x); out = np.zeros(n); seg = 2400
    for k in range(0, n, seg):  # balayage de filtre par blocs
        p = k / n; w = int(4 + (40 * (1 - p) if up else 40 * p))
        out[k:k + seg] = hp_fast(lp_fast(x[k:k + seg + 200], max(2, w))[:len(out[k:k + seg])], 200)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return norm(out) * e * vol

def clang(vol, base=410):
    t = ts(2.2); s = np.zeros(len(t))
    for r, a, dk in [(1, 1, 2.5), (2.76, .7, 3.5), (5.4, .5, 5), (8.9, .35, 7), (1.49, .5, 3), (13.3, .2, 9)]:
        s += a * np.sin(2 * np.pi * base * r * t) * np.exp(-t * dk)
    s += hp_fast(noise(2.2), 4) * np.exp(-t * 60) * 1.5
    return norm(s) * vol

def impact(vol, f0=48):
    t = ts(1.2); f = f0 * (1 + 3 * np.exp(-t * 25))
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4)
    crack = lp_fast(noise(1.2), 3) * np.exp(-t * 18)
    return norm(sub * 1.4 + crack) * vol

def slash(vol):
    d = 0.45; t = ts(d); x = hp_fast(noise(d), 3)
    ring = np.sin(2 * np.pi * (3200 - 1800 * t / d) * t) * 0.3
    return norm(x * np.exp(-t * 9) + ring * np.exp(-t * 5)) * vol

def splat(vol):
    s = np.zeros(int(SR * .4))
    for _ in range(9):
        i = rng.integers(0, len(s) - 2400); s[i:i + 2400] += lp_fast(noise(.05), 12) * np.exp(-np.linspace(0, 1, 2400) * 6)
    return norm(s) * vol

def gong(vol):
    t = ts(4.0); s = sum(a * np.sin(2 * np.pi * 98 * r * t) * np.exp(-t * dk)
                        for r, a, dk in [(1, 1, .6), (2.01, .5, .9), (2.98, .3, 1.3), (4.2, .2, 2)])
    return norm(s) * np.minimum(1, t / .01) * vol

add(sfx, rain(3.5, .25), 0)                       # 1 · titre sous la pluie
add(sfx, gong(.55), 0.15)
add(sfx, rumble(2.0, .8), 3.5)                     # 2 · la bête sort du sol
add(sfx, impact(.7, 40), 4.1)
add(sfx, growl(2.2, .95), 4.15)
add(sfx, growl(1.4, .5), 6.0)
add(sfx, rain(4.0, .3), 8)                         # 3 · le sabreur
add(sfx, whoosh(1.4, .8), 12.1)                    # 4 · charge
add(sfx, whoosh(.9, .7, False), 13.6)
add(sfx, growl(1.0, .6), 14.0)
add(sfx, impact(1.0), 15.5)                        # 5 · choc
add(sfx, clang(.85), 15.52)
add(sfx, clang(.6, 520), 17.6)
add(sfx, impact(.5, 60), 17.6)
add(sfx, whoosh(.5, .6, False), 19.45)             # 6 · riposte
add(sfx, impact(.9, 44), 19.6)
add(sfx, splat(.6), 19.75)
add(sfx, rain(4.0, .25), 20.2)
add(sfx, whoosh(1.8, .6), 23.5)                    # 7 · envol puis coupe
add(sfx, slash(1.0), 25.45)
add(sfx, impact(.9, 38), 25.6)
add(sfx, splat(.7), 25.8)
add(sfx, gong(.7), 26.6)                           # 8 · fin
add(sfx, rain(3.4, .3), 26.6)

# ── Voix ─────────────────────────────────────────────────────────────────────
def say(text, voice, rate, pitch=1.0):
    with tempfile.TemporaryDirectory() as d:
        a, w = os.path.join(d, 'v.aiff'), os.path.join(d, 'v.wav')
        subprocess.run(['say', '-v', voice, '-r', str(rate), '-o', a, text], check=True)
        af = f'asetrate={int(SR * pitch)},aresample={SR}' if pitch != 1 else f'aresample={SR}'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', a, '-af', af, '-ac', '1', '-ar', str(SR), w], check=True)
        with wave.open(w) as f:
            return np.frombuffer(f.readframes(f.getnframes()), np.int16) / 32768

def fit(sig, maxd):
    """Accélère légèrement une réplique trop longue pour son plan."""
    if len(sig) <= maxd * SR: return sig
    idx = np.linspace(0, len(sig) - 1, int(maxd * SR)); return np.interp(idx, np.arange(len(sig)), sig)

def ming(i, af=''):
    """Réplique générée par Ming-3.0 (voix clonée de Loïc, voir voix/*.txt), silences coupés.
    Repli sur la voix macOS si le fichier manque."""
    src = os.path.join(here, 'voix', f'{i}.wav')
    if not os.path.exists(src): return None
    trim = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
    with tempfile.TemporaryDirectory() as d:
        w = os.path.join(d, 'v.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-af', ','.join(x for x in (trim, af) if x),
                        '-ac', '1', '-ar', str(SR), w], check=True)
        with wave.open(w) as f:
            return np.frombuffer(f.readframes(f.getnframes()), np.int16) / 32768

def room(sig, gain=.1):  # petite réverbe : quelques échos amortis
    out = np.concatenate([sig, np.zeros(int(SR * .5))])
    for dl, g in [(.043, 1), (.071, .8), (.113, .6), (.167, .4)]:
        i = int(dl * SR); out[i:i + len(sig)] += lp_fast(sig, 8) * g * gain
    return out

# Bête : voix de Loïc descendue d'une quarte et demie, ralentie, saturée, doublée d'un grondement
BEAST_AF = f'asetrate={44100 * 0.72:.0f},aresample={SR},atempo=1.15'
h1 = ming(1); h2 = ming(2); b = ming(3, BEAST_AF); h4 = ming(4)
if h1 is None:  # repli : voix macOS
    h1, h2, h4 = (fit(say(t, 'Thomas', 175, .93), d) for t, d in
                  [('Tu as dévoré mon village.', 1.65), ('Ce soir... tu paies.', 1.7), ('Pas... encore.', 1.0)])
    b = fit(say('Faible... humain.', 'Jacques', 130, 0.68), 1.6)
add(vox, room(h1), 8.5)
add(vox, room(h2), 10.35)
b = np.tanh(b * 1.6) / np.tanh(1.6)
add(vox, room(b, .2), 21.0, 1.0); add(vox, lp_fast(b, 6), 21.12, .22)   # écho caverneux
add(sfx, growl(len(b) / SR + .2, .12), 20.95)
add(vox, room(h4), 22.75, .95)

# ── Mixage ───────────────────────────────────────────────────────────────────
duck = np.ones(N)  # la musique baisse sous les voix
for a, b in [(8.4, 10.1), (10.1, 12), (20.9, 23.6)]:
    duck[int(a * SR):int(b * SR)] = 0.5
duck = lp_fast(duck, 4800)
mix = norm(music) * 0.45 * duck + norm(sfx) * 0.9 + norm(vox) * 0.85
mix = np.tanh(mix * 1.3) / np.tanh(1.3)          # légère saturation, peaks maîtrisés
mix *= 0.95 / np.max(np.abs(mix))
out = os.path.join(here, 'audio.wav')
with wave.open(out, 'w') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio.wav écrit,', T, 's')
