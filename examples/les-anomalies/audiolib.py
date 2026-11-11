"""Bibliothèque son de « LES ANOMALIES » : synthèse musicale (batterie, basse, nappes), bruitages
nommés, voix macOS calées sur timeline.json et mixage. Un épisode l'utilise ainsi :

    import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'les-anomalies'))
    from audiolib import *
    E = Episode(__file__, seed=22, bpm=140)
    E.add_music(E.stab([52, 59, 64, 67], 1.2, .5), 0.1)
    E.section(0.6, 3.5, 'half'); E.section(3.5, 8, 'full', stabs=True) …
    E.finish()   # bruitages de timeline.json + voix + mixage → audio.wav

Sections : drums ∈ full | half | build | none ; riff = liste de notes MIDI (croches).
Bruitages disponibles : voir SFX_NAMES (inconnu → avertissement, rien n'est ajouté).
Contrôle Whisper : VOX_DIR=dossier python3 audio.py écrit chaque réplique traitée (NN.wav).
"""
import json, os, subprocess, tempfile, wave
import numpy as np

SR = 48000
m2f = lambda n: 440 * 2 ** ((n - 69) / 12)

VOICES = {  # clé : (voix macOS, débit, hauteur, traitement)
    'volta': ('Flo (Français (France))', 190, 1.04, None),
    'givre': ('Eddy (Français (France))', 190, .97, None),
    'echo': ('Shelley (Français (France))', 185, 1.06, None),
    'mirage': ('Amélie', 175, 1.0, None),
    'kessler': ('Grandma (Français (France))', 170, .9, 'cold'),
    'robot': ('Thomas', 165, .88, 'robot'),
    'colosse': ('Jacques', 150, .78, 'robot'),
    'omega': ('Thomas', 150, .8, 'omega'),
    'ally': ('Rocko (Français (France))', 185, 1.0, None),
    'ally2': ('Grandpa (Français (France))', 180, 1.05, None),
}

# essai d'une autre voix : ANOM_VOICE='mirage=Amélie,180,1.0' python3 voxtest.py mirage "…"
for _ov in filter(None, os.environ.get('ANOM_VOICE', '').split(';')):
    _k, _v = _ov.split('='); _n, _r, _p = _v.split(','); VOICES[_k] = (_n, int(_r), float(_p), VOICES.get(_k, (0, 0, 0, None))[3])

SFX_NAMES = ['hit', 'whoosh', 'land', 'scan', 'alarm', 'panel', 'lock', 'zap', 'ice', 'tk', 'missile', 'boom',
             'iceWall', 'laser', 'klang', 'charge', 'beam', 'glitch', 'bigboom', 'wind', 'eye',
             'shimmer', 'invis', 'drone', 'swarm', 'holo', 'glass', 'thunder', 'rumble', 'step', 'door',
             'heart', 'powerdown', 'powerup', 'siren', 'train', 'punch', 'freeze', 'crowd', 'beep', 'electric']


class Episode:
    def __init__(self, file, seed=21, bpm=140):
        self.here = os.path.dirname(os.path.abspath(file))
        self.tl = json.load(open(os.path.join(self.here, 'timeline.json')))
        self.T = self.tl['duration']; self.N = int(SR * self.T)
        self.rng = np.random.default_rng(seed)
        self.music = np.zeros(self.N); self.sfx = np.zeros(self.N); self.vox = np.zeros(self.N)
        self.BEAT = 60 / bpm
        self.riff = [40, 40, 43, 40, 38, 40, 47, 45]

    # ── primitives ──
    def ts(self, d): return np.arange(int(SR * d)) / SR
    def add(self, buf, sig, t, gain=1.0):
        i = int(t * SR)
        if i >= self.N or i < 0: return
        sig = sig[: self.N - i] * gain
        buf[i:i + len(sig)] += sig
    def add_music(self, sig, t, gain=1.0): self.add(self.music, sig, t, gain)
    def add_sfx(self, sig, t, gain=1.0): self.add(self.sfx, sig, t, gain)
    @staticmethod
    def lp(x, w): return np.convolve(x, np.ones(w) / w, 'same')
    def hp(self, x, w): return x - self.lp(x, w)
    @staticmethod
    def norm(x): m = np.max(np.abs(x)) if len(x) else 0; return x / m if m else x
    @staticmethod
    def dec(n, r): return np.exp(-np.linspace(0, 1, n) * r)
    def noise(self, d): return self.rng.standard_normal(int(SR * d))
    def saw(self, f, d): t = self.ts(d); return 2 * ((t * f) % 1) - 1
    def sq(self, f, d): t = self.ts(d); return np.sign(np.sin(2 * np.pi * f * t))
    def sweep(self, f0, f1, d, wave_=np.sin):
        f = np.geomspace(f0, f1, int(SR * d)); return wave_(2 * np.pi * np.cumsum(f) / SR)

    # ── instruments ──
    def kick(self, v=1):
        t = self.ts(.35); f = 50 * (1 + 3 * np.exp(-t * 40)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) * v
    def snare(self, v=1):
        n = int(.22 * SR); return (self.hp(self.noise(.22), 6) * .8 + np.sin(2 * np.pi * 190 * self.ts(.22)) * .5) * self.dec(n, 14) * v
    def hat(self, v=1):
        n = int(.05 * SR); return self.hp(self.noise(.05), 3) * self.dec(n, 18) * v
    def bass(self, n, d, v=1):
        s = self.lp(self.saw(m2f(n), d) + .5 * self.sq(m2f(n) / 2, d), 18); e = np.minimum(1, (len(s) - np.arange(len(s))) / (SR * .03))
        return s * e * self.dec(len(s), 2) * v
    def stab(self, notes, d, v=1):
        s = sum(self.lp(self.saw(m2f(n) * (1 + k * .004), d), 6) for n in notes for k in (-1, 1)); return s * self.dec(len(s), 5) * v
    def pad(self, notes, d, v=1):
        s = sum(self.lp(self.saw(m2f(n) * (1 + self.rng.uniform(-.004, .004)), d), 60) for n in notes)
        n = len(s); e = np.minimum(1, np.minimum(np.arange(n) / (SR * .8), (n - np.arange(n)) / (SR * .6))); return s * e * v
    def lead(self, notes, t0, step=None, v=.18):  # mélodie carrée douce, une note par pas (None = silence)
        step = step or self.BEAT / 2
        for i, n in enumerate(notes):
            if n is None: continue
            d = step * .9; s = self.lp(self.sq(m2f(n), d), 10) * self.dec(int(SR * d), 3)
            self.add_music(s * v, t0 + i * step)
    def riser(self, t0, d=1.8, v=.12):
        self.add_music(self.sweep(200, 2400, d, lambda x: np.sign(np.sin(x))) * np.linspace(0, v, int(SR * d)), t0)

    def section(self, t0, t1, drums='full', bass_on=True, stabs=False, riff=None, chord=(64, 67, 71)):
        riff = riff or self.riff
        t = t0; i = 0
        while t < t1 - 1e-6:
            b = i // 2
            if drums in ('full', 'half', 'build'):
                if i % 2 == 0 and (drums != 'half' or b % 2 == 0): self.add_music(self.kick(), t)
                if drums == 'full' and i % 4 == 2: self.add_music(self.snare(.7), t)
                if drums == 'full': self.add_music(self.hat(.25 if i % 2 else .4), t)
                if drums == 'build': self.add_music(self.snare(.25 + .6 * (t - t0) / max(t1 - t0, .1)), t)
            if bass_on: self.add_music(self.bass(riff[i % len(riff)], self.BEAT / 2 * .95, .55), t)
            if stabs and i % 8 == 0: self.add_music(self.stab(list(chord), .3, .25), t)
            t += self.BEAT / 2; i += 1

    # ── bruitages ──
    def boom(self, v=1, d=2.0, f0=45):
        t = self.ts(d); f = f0 * (1 + 2 * np.exp(-t * 8))
        low = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.5)
        crack = self.lp(self.noise(d), 4) * np.exp(-t * 4)
        return self.norm(low * 1.2 + crack * .9) * v
    def whoosh(self, d, v=1, w=25):
        x = self.lp(self.noise(d), w); return self.norm(x) * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 1.5 * v
    def zap(self, d=.5, v=1):
        t = self.ts(d); s = np.sign(np.sin(2 * np.pi * (90 + 40 * np.sin(2 * np.pi * 13 * t)) * t)) * .6 + self.hp(self.noise(d), 3) * (self.rng.random(len(t)) > .7)
        return s * self.dec(len(t), 4) * v
    def ice(self, d=.8, v=1):
        s = np.zeros(int(SR * d))
        for _ in range(26):
            i = int(self.rng.uniform(0, d * .85) * SR); k = self.sweep(self.rng.uniform(2500, 6000), self.rng.uniform(1500, 3000), .06) * self.dec(int(.06 * SR), 6)
            s[i:i + len(k)] += k[: len(s) - i] * self.rng.uniform(.3, 1)
        return s * v
    def tk(self, d=1.6, v=1):
        t = self.ts(d); s = np.sin(2 * np.pi * 110 * t + 3 * np.sin(2 * np.pi * 5 * t)) + .5 * np.sin(2 * np.pi * 220.7 * t)
        return s * np.sin(np.pi * np.linspace(0, 1, len(t))) * v
    def metal(self, v=1):
        t = self.ts(1.2); s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * r) for f, r in [(523, 4), (1187, 5), (1730, 7), (2650, 9)])
        return (self.norm(s) + self.lp(self.noise(1.2), 3) * np.exp(-t * 30)) * v
    def shimmer(self, d=1.2, v=1):
        t = self.ts(d); s = sum(np.sin(2 * np.pi * f * t + 2 * np.sin(2 * np.pi * 6 * t)) for f in (1320, 1980, 2640))
        return self.norm(s) * np.sin(np.pi * np.linspace(0, 1, len(t))) * v

    def sfx_event(self, n, t0):
        A = self.add_sfx
        if n == 'hit': A(self.boom(.7, 1.0, 55), t0)
        elif n == 'whoosh': A(self.whoosh(1.3, .8), t0)
        elif n == 'land': A(self.boom(.8, 1.2, 40), t0)
        elif n == 'scan': A(self.sweep(300, 1200, 1.4) * .12 * np.sin(np.pi * np.linspace(0, 1, int(SR * 1.4))), t0)
        elif n == 'alarm':
            for k in range(3): A(self.sq(880, .16) * .08 * self.dec(int(.16 * SR), 1), t0 + k * .25); A(self.sq(660, .16) * .08, t0 + k * .25 + .125)
        elif n == 'panel': A(self.whoosh(.25, .5, 8), t0); A(self.boom(.35, .3, 90), t0 + .2)
        elif n == 'lock': A(self.sq(1760, .07) * .12, t0); A(self.sq(1760, .07) * .12, t0 + .1)
        elif n == 'zap': A(self.zap(.6, .55), t0)
        elif n == 'ice': A(self.ice(.7, .6), t0)
        elif n == 'tk': A(self.tk(1.6, .35), t0)
        elif n == 'missile': A(self.whoosh(.9, .45, 6) + self.sweep(1200, 500, .9) * .08, t0)
        elif n == 'boom': A(self.boom(1.0), t0)
        elif n == 'iceWall': A(self.ice(1.0, .9), t0); A(self.boom(.5, .6, 70), t0)
        elif n == 'laser': A(self.sweep(2400, 400, .25) * .35, t0); A(self.sq(140, 1.8) * .12 * self.dec(int(SR * 1.8), 1.5), t0 + .1); A(self.zap(1.5, .3), t0 + .15)
        elif n == 'klang': A(self.metal(.8), t0)
        elif n == 'charge': A(self.sweep(80, 900, 2.6, lambda x: np.sign(np.sin(x))) * np.linspace(0, .2, int(SR * 2.6)), t0); A(self.zap(2.4, .3), t0 + .2)
        elif n == 'beam': A((self.sq(110, .7) * .3 + self.whoosh(.7, .6, 4)) * np.linspace(.4, 1, int(SR * .7)), t0)
        elif n == 'glitch':
            for k in range(8): A(self.sq(self.rng.choice([220, 330, 880, 1320]), .07) * .2, t0 + k * .15 + self.rng.uniform(0, .05))
        elif n == 'bigboom': A(self.boom(1.3, 3.0, 35), t0); A(self.metal(.4), t0 + .15)
        elif n == 'wind': A(self.whoosh(2.8, .25, 60), t0)
        elif n == 'eye': A(self.sweep(60, 40, 2.5) * .5 * self.dec(int(SR * 2.5), 1.5), t0); A(self.sweep(1800, 900, .4) * .15, t0 + .1)
        elif n == 'shimmer': A(self.shimmer(1.2, .22), t0)
        elif n == 'invis': A(self.sweep(1800, 300, .6) * .18 * self.dec(int(SR * .6), 2), t0); A(self.shimmer(.8, .15), t0)
        elif n == 'drone':
            t = self.ts(2.0); A(np.sign(np.sin(2 * np.pi * (180 + 8 * np.sin(2 * np.pi * 30 * t)) * t)) * .05 * np.sin(np.pi * np.linspace(0, 1, len(t))), t0)
        elif n == 'swarm':
            for k in range(6): self.sfx_event('drone', t0 + k * .17)
        elif n == 'holo': A(self.sweep(500, 1500, .3) * .12, t0); A(self.lp(self.noise(1.0), 2) * .04 * self.dec(int(SR), 2), t0)
        elif n == 'glass': A(self.ice(.9, .8), t0); A(self.hp(self.noise(.4), 2) * .4 * self.dec(int(SR * .4), 8), t0)
        elif n == 'thunder': A(self.boom(1.2, 3.2, 30), t0); A(self.lp(self.noise(2.5), 40) * .8 * self.dec(int(SR * 2.5), 2), t0 + .1)
        elif n == 'rumble': A(self.norm(self.lp(self.noise(2.0), 300)) * np.sin(np.pi * np.linspace(0, 1, int(SR * 2.0))) * .9, t0)
        elif n == 'step': A(self.boom(.5, .5, 50), t0)
        elif n == 'door': A(self.whoosh(.6, .4, 10), t0); A(self.metal(.3), t0 + .5)
        elif n == 'heart':
            for k in range(2): A(self.kick(.7) * self.lp(np.ones(int(.35 * SR)), 1), t0 + k * .28)
        elif n == 'powerdown': A(self.sweep(900, 50, 1.5, lambda x: np.sign(np.sin(x))) * .12 * self.dec(int(SR * 1.5), 1), t0)
        elif n == 'powerup': A(self.sweep(60, 1400, 1.5, lambda x: np.sign(np.sin(x))) * np.linspace(0, .16, int(SR * 1.5)), t0); A(self.zap(1.2, .3), t0 + .3)
        elif n == 'siren':
            t = self.ts(2.4); A(np.sin(2 * np.pi * np.cumsum(700 + 250 * np.sin(2 * np.pi * 1.2 * t)) / SR) * .07, t0)
        elif n == 'train': A(self.norm(self.lp(self.noise(3.0), 60)) * np.sin(np.pi * np.linspace(0, 1, int(SR * 3))) * .5, t0)
        elif n == 'punch': A(self.boom(.6, .4, 80), t0); A(self.whoosh(.15, .4, 4), t0 - .1)
        elif n == 'freeze': A(self.ice(1.2, .8), t0); A(self.sweep(3000, 800, .8) * .1, t0)
        elif n == 'crowd': A(self.lp(self.noise(2.5), 12) * .25 * np.sin(np.pi * np.linspace(0, 1, int(SR * 2.5))), t0)
        elif n == 'beep': A(self.sq(1320, .09) * .1, t0)
        elif n == 'electric': A(self.zap(1.4, .5), t0); A(self.hp(self.noise(1.4), 2) * (self.rng.random(int(SR * 1.4)) > .9) * .3, t0)
        else: print('  ⚠ bruitage inconnu :', n)

    # ── voix ──
    def voices(self, rewrite=None):
        """rewrite : dict texte affiché → texte prononcé (pour les mots que la synthèse avale)."""
        rewrite = rewrite or {}
        QA = os.environ.get('VOX_DIR')
        def rd(p):
            with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(float) / 32768
        def ff(i, o, af): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', i, '-af', af, '-ar', str(SR), '-ac', '1', o], check=True)
        sil = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
        self.windows = []
        for idx, ln in enumerate(self.tl['lines']):
            v, rate, pitch, fx = VOICES[ln['who']]
            text = rewrite.get(ln['text'], ln['text']).replace('…', ',').replace('!', '')
            with tempfile.TemporaryDirectory() as d:
                a, w, w2 = (os.path.join(d, n) for n in ('v.aiff', 'v.wav', 'v2.wav'))
                subprocess.run(['say', '-v', v, '-r', str(rate), '-o', a, text], check=True)
                ff(a, w, f'{sil},asetrate={int(22050 * pitch)},aresample={SR},atempo={1 / pitch:.3f},highpass=f=90,acompressor=threshold=-18dB:ratio=3')
                x = rd(w); win = ln['t1'] - ln['t0'] - 0.05
                if len(x) / SR > win:
                    ff(w, w2, f'atempo={min(len(x) / SR / win, 1.8):.3f}'); x = rd(w2)
            t = np.arange(len(x)) / SR
            if fx == 'robot':  # métal léger, reste intelligible
                x = .72 * x + .28 * x * np.sin(2 * np.pi * 70 * t)
                x = x + .3 * np.concatenate([np.zeros(int(.016 * SR)), x])[: len(x)]
            elif fx == 'omega':
                x = .6 * x + .4 * x * np.sin(2 * np.pi * 55 * t)
                for dl, g in ((.011, .35), (.023, .25)): x = x + g * np.concatenate([np.zeros(int(dl * SR)), x])[: len(x)]
            elif fx == 'cold':  # léger écho de salle
                x = x + .22 * np.concatenate([np.zeros(int(.06 * SR)), x])[: len(x)]
            if len(x) / SR > ln['t1'] - ln['t0'] + .05: print('  ⚠ réplique plus longue que sa bulle :', ln['text'])
            if QA:
                os.makedirs(QA, exist_ok=True)
                with wave.open(os.path.join(QA, f"{idx:02d}.wav"), 'wb') as f:
                    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((self.norm(x) * 30000).astype(np.int16).tobytes())
            print(f"  {ln['who']:7} {ln['t0']:5.2f} → {ln['t0'] + len(x) / SR:5.2f} / {ln['t1']:5.2f}  {ln['text']}")
            self.add(self.vox, self.norm(x), ln['t0'] + 0.03)
            self.windows.append((ln['t0'] - .1, ln['t0'] + len(x) / SR + .2))

    def finish(self, rewrite=None, music_gain=.4, sfx_gain=.75):
        for e in self.tl['sfx']: self.sfx_event(e['name'], e['t'])
        self.voices(rewrite)
        duck = np.ones(self.N)
        for a, b in self.windows: duck[int(max(a, 0) * SR):int(b * SR)] = .35
        duck = self.lp(duck, 4800)
        mix = self.norm(self.music) * music_gain * duck + self.norm(self.sfx) * sfx_gain * (.2 + .8 * duck) + self.vox * .95
        mix = np.tanh(mix * 1.3) / np.tanh(1.3); mix *= .95 / np.max(np.abs(mix))
        with wave.open(os.path.join(self.here, 'audio.wav'), 'wb') as f:
            f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
        print('audio.wav ok,', self.T, 's')
