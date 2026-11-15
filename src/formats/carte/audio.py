"""Bande son du format « carte » : la voix du guide (Ming-3.0, voix inventée « guide », cache partagé avec la série
Roussin & Lino), une musique de marimba qui s'efface sous la voix, et les bruitages du script (whoosh, pop, tick,
ding, tada, sparkle).
    python3 src/formats/carte/audio.py out/<id>        lit script.json, écrit audio.wav et voice.json (durées + enveloppes)
Deux passes (voir build.sh) : les durées des scènes dépendent de la voix réelle, donc on mixe, on reconstruit le SVG
avec voice.json, puis on mixe de nouveau sur le script recalé (les voix sont en cache : la 2e passe est instantanée).
"""
import json, os, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'examples', 'renard-lapin', 'lib'))
import voix  # noqa: E402  (Ming par défaut ; VOIX=kokoro pour le secours)

SR = 48000
out = os.path.abspath(sys.argv[1])
sc = json.load(open(os.path.join(out, 'script.json'), encoding='utf-8'))
DUR = float(sc['duration']) + 0.3
N = int(SR * DUR)
rng = np.random.default_rng(11)


def mix_in(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    sig = sig[: len(buf) - i] * gain
    buf[i:i + len(sig)] += sig


def env(n, a=0.004, r=0.3):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    return e * np.exp(-np.linspace(0, 1, n) * 3 / max(r, 1e-3))


def tone(f, d, vel=1.0, harm=(1, .4, .2)):
    t = np.arange(int(SR * d)) / SR
    return sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(harm)) * env(len(t), 0.003, d * 0.45) * vel


def sweep(f0, f1, d, vol=1.0):
    t = np.arange(int(SR * d)) / SR; f = np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, d * 0.5) * vol


def noise(d, vol=1.0):
    n = int(SR * d); x = rng.standard_normal(n); k = np.cumsum(x); k -= np.convolve(k, np.ones(200) / 200, 'same')
    return k / (np.max(np.abs(k)) + 1e-9) * vol


midi = lambda n: 440 * 2 ** ((n - 69) / 12)

# ── bruitages ────────────────────────────────────────────────────────────────
def sfx(kind, t, buf):
    if kind == 'whoosh':
        n = int(SR * 0.6); sh = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
        mix_in(buf, noise(0.6, 0.5) * sh, t)
    elif kind == 'pop':
        mix_in(buf, sweep(380, 980, 0.11, 0.55), t); mix_in(buf, noise(0.02, 0.3) * np.hanning(int(SR * 0.02)), t)
    elif kind == 'tick':
        mix_in(buf, sweep(1500, 1100, 0.05, 0.6), t)
    elif kind == 'ding':
        tt = np.arange(int(SR * 1.0)) / SR
        mix_in(buf, sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(1320, 1), (1980, .5), (2640, .25)]) * np.exp(-tt * 3.2) * 0.55, t)
    elif kind == 'tada':
        for k, n in enumerate([72, 76, 79, 84]): mix_in(buf, tone(midi(n), 0.7, 0.4, (1, .5, .25)), t + k * 0.09)
    elif kind == 'hit':  # coup sourd discret pour un chiffre ou un mot géant
        mix_in(buf, sweep(140, 55, 0.35, 0.7), t); mix_in(buf, noise(0.05, 0.25) * np.hanning(int(SR * 0.05)), t)
    elif kind == 'sparkle':
        for k, n in enumerate([88, 91, 95, 100]): mix_in(buf, tone(midi(n), 0.3, 0.16, (1, .2)), t + k * 0.07)

sfx_buf = np.zeros(N)
for e in sc['sfx']: sfx(e['kind'], e['t'], sfx_buf)

# ── voix ─────────────────────────────────────────────────────────────────────
voix.prepare([(l['role'], l['text']) for l in sc['lines']])
voice_buf = np.zeros(N); voices = {}; lines_audio = []
for l in sc['lines']:
    x = voix.line(l['role'], l['text'], 60.0, SR)
    mix_in(voice_buf, x, l['t'] + 0.02)
    # enveloppe de volume à 30 i/s (la bouche de la mascotte la suit)
    h = SR // 30; m = len(x) // h
    rms = np.sqrt((x[: m * h].reshape(m, h) ** 2).mean(axis=1)) if m else np.zeros(1)
    e = np.clip(rms / (np.percentile(rms, 95) + 1e-9), 0, 1) ** 0.7
    voices[f"{l['role']}|{l['text']}"] = {'dur': round(len(x) / SR, 3), 'env': [round(float(v), 2) for v in e]}
    print(f"voix {len(x)/SR:4.1f} s  {l['text'][:60]}", flush=True)
    lines_audio.append((f"{l['role']}|{l['text']}", x))

# ── instants des mots (Whisper) : permettent de caler une image sur un mot précis ; mis en cache avec la voix ──
import hashlib, subprocess, tempfile
WPY = os.path.expanduser('~/ai-video/ming-venv/bin/python')
if lines_audio and os.path.exists(WPY):
    cache_dir = os.path.expanduser('~/.cache/svgmaker-voix'); os.makedirs(cache_dir, exist_ok=True)
    todo = []
    for key, x in lines_audio:
        pcm = (x * 32767).astype(np.int16).tobytes(); h = hashlib.sha1(pcm).hexdigest()[:16]; cf = os.path.join(cache_dir, h + '.words.json')
        if os.path.exists(cf): voices[key]['words'] = json.load(open(cf, encoding='utf-8')); continue
        wf = os.path.join(tempfile.gettempdir(), f'wt_{h}.wav')
        with wave.open(wf, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
        todo.append((key, wf, cf))
    if todo:
        jin, jout = os.path.join(tempfile.gettempdir(), 'wt_in.json'), os.path.join(tempfile.gettempdir(), 'wt_out.json')
        json.dump([t[1] for t in todo], open(jin, 'w'))
        r = subprocess.run([WPY, os.path.join(HERE, 'wordtimes.py'), jin, jout], env={**os.environ, 'HF_HUB_OFFLINE': '1'}, capture_output=True, text=True)
        if r.returncode == 0:
            for (key, wf, cf), ws in zip(todo, json.load(open(jout, encoding='utf-8'))):
                voices[key]['words'] = ws; json.dump(ws, open(cf, 'w', encoding='utf-8'), ensure_ascii=False)
        else: print('mots (Whisper) indisponibles :', r.stderr[-200:])

# ── musique : au choix du script (« music » : pad = nappe lente et sobre pour l'histoire, marimba = joyeuse) ──
def pad_music():
    bp = 74; bt = 60 / bp; out = np.zeros(N)
    prog = [(57, 60, 64), (53, 57, 60), (48, 55, 64), (52, 55, 59)]  # La mineur, Fa, Do/mi, Mi mineur
    t = 0.0; i = 0
    while t < DUR:
        c = prog[(i // 2) % 4]; d = 2 * bt * 2
        for n in c:
            tt = np.arange(int(SR * d)) / SR
            a = np.minimum(1, tt / 1.2) * np.minimum(1, (d - tt) / 1.0)
            out_i = (np.sin(2 * np.pi * midi(n) * tt) + 0.35 * np.sin(2 * np.pi * midi(n) * 2 * tt) + 0.15 * np.sin(2 * np.pi * midi(n) * 3 * tt)) * a * 0.22
            mix_in(out, out_i, t)
        mix_in(out, tone(midi(c[0] - 12), d, 0.5, (1, .25)), t)
        for k, n in enumerate((c[2] + 12, c[1] + 12, c[2] + 12, c[0] + 24)):  # petites notes de piano, espacées
            mix_in(out, tone(midi(n), 1.1, 0.3, (1, .35, .1)), t + (k * 1.0 + 0.5) * bt)
        t += d; i += 2
    return out * 0.55

# ── musique : marimba joyeuse (Do - La mineur - Fa - Sol), qui s'efface sous la voix ──
bpm = 118; beat = 60 / bpm
chords = [(60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)]
music = np.zeros(N); t = 0.0; i = 0
while t < DUR and sc.get('music', 'marimba') != 'pad':
    c = chords[(i // 8) % 4]; step = i % 8
    mix_in(music, tone(midi(c[[0, 1, 2, 1, 2, 1, 0, 2][step]] + 12), 0.32, 0.5, (1, .45, .1)), t)
    if step % 4 == 0: mix_in(music, tone(midi(c[0] - 12), 0.55, 0.6, (1, .3)), t)
    if step % 2 == 1: mix_in(music, noise(0.03, 0.12) * np.exp(-np.linspace(0, 8, int(SR * 0.03))), t)
    t += beat / 2; i += 1
if sc.get('music') == 'pad': music = pad_music()
else: music *= 0.32
# ducking : la musique baisse pendant que le narrateur parle
sp = np.convolve((np.abs(voice_buf) > 0.02).astype(float), np.ones(int(SR * 0.3)) / (SR * 0.3), mode='same')
music *= 1 - (0.8 if sc.get('music') == 'pad' else 0.7) * np.clip(sp * 3, 0, 1)
music *= np.minimum(1, np.linspace(0, 1, N) * DUR / 1.5) * np.minimum(1, np.linspace(1, 0, N) * DUR / 1.5)

mix = np.tanh((voice_buf * 1.0 + music + sfx_buf * 0.7) * 0.9) * 0.95
with wave.open(os.path.join(out, 'audio.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
json.dump(voices, open(os.path.join(out, 'voice.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print('audio.wav ok', round(DUR, 1), 's')
