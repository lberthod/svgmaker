"""Bande son de « Au pied de la lettre » ép. 1 (55 s) : voix macOS calées sur timeline.json
(Lou : Flo aiguë, Nadia : Shelley, M. Boulon : Grandpa), musique sautillante, bruitages
synthétisés. Usage : python3 audio.py  → audio.wav"""
import json, os, subprocess, tempfile, wave
import numpy as np

SR = 48000
T = 55
N = SR * T
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, 'timeline.json')))
rng = np.random.default_rng(5)
music = np.zeros(N); sfx = np.zeros(N); vox = np.zeros(N)
ts = lambda d: np.arange(int(SR * d)) / SR

def add(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    buf[i:i + len(sig)] += sig

def env(n, a=0.004, r=0.3):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    return e * np.exp(-np.linspace(0, 1, n) / max(r, 1e-3) * 3)

def tone(f, d, vel=1.0, harm=(1, .4, .15), r=None):
    t = ts(d); s = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(harm))
    return s * env(len(t), 0.003, r or d * 0.45) * vel

def lp(x, w): return np.convolve(x, np.ones(w) / w, 'same')
def norm(x): m = np.max(np.abs(x)); return x / m if m else x
m2f = lambda n: 440 * 2 ** ((n - 69) / 12)

# ── musique : pizzicato + basse, 120 bpm ; tendue pendant l'avalanche, calme après le tri ──
beat = 0.5
melA = [72, 74, 76, 79, 77, 76, 74, 72, 71, 74, 79, 77, 76, 74, 72, None]
melB = [69, 72, 76, 72, 70, 74, 77, 74, 69, 72, 76, 79, 77, 74, 71, None]   # tension
bassA = [48, 55, 53, 55]; bassB = [45, 52, 46, 53]
t = 0.0; i = 0
while t < T - 0.3:
    tense = 6.2 <= t < 30.8 or t >= 51.0
    calm = 39.5 <= t < 48
    mel, bass = (melB, bassB) if tense else (melA, bassA)
    n = mel[i % 16]
    if n and not (t > 51.9 and t < 52.6):
        add(music, tone(m2f(n), 0.28, 0.45 if not calm else 0.3, (1, .5, .2), 0.12), t)
    if i % 2 == 0: add(music, tone(m2f(bass[(i // 4) % 4]), 0.45, 0.6, (1, .3)), t)
    if tense and i % 2 == 1: add(music, rng.standard_normal(int(.03 * SR)) * np.exp(-np.linspace(0, 9, int(.03 * SR))) * .15, t)
    t += beat / 2; i += 1

# ── bruitages ──
def noise(d): return rng.standard_normal(int(SR * d))
def rustle(d, vol):  # froissement de papier : bruit aigu en rafales
    x = noise(d) - lp(noise(d), 4); g = np.abs(lp(noise(d), 1500)); g = g / g.max()
    return x * g * env(len(x), .02, d) * vol
def whoosh(d, vol, up=True):
    x = noise(d); y = lp(x, 30) if up else lp(x, 10)
    return norm(y) * np.sin(np.pi * np.linspace(0, 1, len(y))) ** 1.5 * vol
def sweep(f0, f1, d, vol=1):
    f = np.linspace(f0, f1, int(SR * d))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(f), .005, d * .5) * vol
def thud(vol, f0=70):
    tt = ts(.5); f = f0 * (1 + 2 * np.exp(-tt * 30))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) + lp(noise(.5), 6) * np.exp(-tt * 30)) * vol
def coo(t0, vol=.5):  # roucoulement de Pip
    for k, (f, d) in enumerate([(330, .22), (300, .3)]):
        tt = ts(d); fm = f * (1 + .05 * np.sin(2 * np.pi * 25 * tt)) * np.linspace(1.05, .92, len(tt))
        add(sfx, np.sin(2 * np.pi * np.cumsum(fm) / SR) * np.sin(np.pi * tt / d) * vol, t0 + k * .26)
def ding(t0, vol=.5):
    for f, a in [(1320, 1), (1980, .5)]: add(sfx, tone(f, 1.0, a * vol, (1,), .5), t0)

for e in tl['sfx']:
    n, t0 = e['name'], e['t']
    if n == 'toc': add(sfx, thud(.7, 220), t0)
    elif n == 'floump': add(sfx, thud(1.0, 55), t0); add(sfx, rustle(1.0, .7), t0)
    elif n == 'pop': add(sfx, sweep(300, 1100, .18, .7), t0); add(sfx, rustle(.6, .5), t0)
    elif n == 'window': add(sfx, thud(.5, 160), t0); add(sfx, whoosh(1.2, .5), t0 + .1)
    elif n == 'swirl': add(sfx, whoosh(8.4, .55), t0)
    elif n == 'inhale': add(sfx, whoosh(1.15, .7, True) * np.linspace(.3, 1, int(SR * 1.15)), t0)
    elif n == 'exhale': add(sfx, whoosh(1.0, 1.0, False), t0)
    elif n == 'plop': add(sfx, sweep(500, 200, .15, .5), t0)
    elif n == 'rumble': add(sfx, norm(lp(noise(.9), 300)) * env(int(.9 * SR), .2, .9) * .9, t0)
    elif n == 'boom': add(sfx, thud(1.2, 40), t0); add(sfx, rustle(2.2, .9), t0 + .05)
# écran qui compte, pluie de courrier, tri, respiration n° 2, battements d'ailes
for k in range(6): add(sfx, tone(1500, .06, .25, (1,)), .25 + k * .28)
for k in range(40): add(sfx, rustle(.35, .35), 6.3 + k * .19 + rng.uniform(0, .1))
for k in range(30): add(sfx, rustle(.3, .3), 31 + k * .28 + rng.uniform(0, .1))
add(sfx, whoosh(.9, .5, True) * np.linspace(.3, 1, int(SR * .9)), 45.7); add(sfx, whoosh(.8, .7, False), 46.8)
for k in range(12): add(sfx, sweep(260, 160, .07, .25), 29.8 + k * .14); add(sfx, sweep(260, 160, .07, .25), 47.9 + k * .1)
coo(.9, .35); coo(24.0, .3); coo(49.45, .5); ding(49.2)
add(sfx, sweep(200, 900, .3, .4), 5.95)

# ── voix ──
voices = {'lou': ('Flo (Français (France))', 205, 1.2), 'nad': ('Shelley (Français (France))', 200, 1.0), 'boul': ('Grandpa (Français (France))', 175, .95)}
def rd(p):
    with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(float) / 32768
def ff(i, o, af): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', i, '-af', af, '-ar', str(SR), '-ac', '1', o], check=True)
sil = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
windows = []
for ln in tl['lines']:
    v, rate, pitch = voices[ln['who']]
    text = ln['text'].replace('!', ' ').replace('…', '.').replace('?!', '?')
    if ln['text'] == 'Mmmf !': text = 'Mmmmh.'
    with tempfile.TemporaryDirectory() as d:
        a, w, w2 = (os.path.join(d, n) for n in ('v.aiff', 'v.wav', 'v2.wav'))
        subprocess.run(['say', '-v', v, '-r', str(rate), '-o', a, text], check=True)
        ff(a, w, f'{sil},asetrate={int(22050 * pitch)},aresample={SR},atempo={1 / pitch:.3f},highpass=f=90,acompressor=threshold=-18dB:ratio=3')
        x = rd(w); win = ln['t1'] - ln['t0'] - 0.1
        if ln['text'] == 'Mmmf !': x = lp(x, 30) * 3  # étouffé sous le tas
        if len(x) / SR > win:
            ff(w, w2, f'atempo={min(len(x) / SR / win, 1.9):.3f}'); x = rd(w2)
    print(f"  {ln['who']:4} {ln['t0']:5.2f} → {ln['t0'] + len(x) / SR:5.2f} / {ln['t1']:5.2f}  {ln['text']}")
    add(vox, norm(x), ln['t0'] + 0.05)
    windows.append((ln['t0'] - .1, ln['t0'] + len(x) / SR + .2))

duck = np.ones(N)
for a, b in windows: duck[int(a * SR):int(b * SR)] = .35
duck = lp(duck, 4800)
mix = norm(music) * .32 * duck + norm(sfx) * .7 * (.4 + .6 * duck) + vox * .95
mix = np.tanh(mix * 1.2) / np.tanh(1.2); mix *= .95 / np.max(np.abs(mix))
with wave.open(os.path.join(here, 'audio.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio.wav ok,', T, 's')
