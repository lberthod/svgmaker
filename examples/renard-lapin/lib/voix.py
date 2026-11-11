"""Voix de la série, deux moteurs locaux au choix (variable d'environnement VOIX) :
  VOIX=ming   (défaut) Ming-3.0 (MIT) : une voix inventée par personnage (ming_design.py → voix-ref/), clonée
              à chaque réplique ; naturelle et expressive ; voir tts_ming_fr.py
  VOIX=kokoro Kokoro-82M (Apache 2.0), voix française ff_siwis ; voir tts_kokoro_fr.py
Chaque personnage a sa hauteur (pitch) et son débit (speed), réglés par moteur (voix d'homme adulte pour Ming,
voix de femme pour Kokoro). Les répliques synthétisées sont
gardées en cache (~/.cache/svgmaker-voix) pour que les re-rendus soient rapides.
Repli sur la voix macOS `say` si Kokoro n'est pas disponible (usage personnel uniquement)."""
import hashlib, json, os, re, subprocess, tempfile, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.environ.get('VOIX', 'ming')
PY = os.path.expanduser('~/ai-video/ming-venv/bin/python' if ENGINE == 'ming' else '~/ai-video/tools-venv/bin/python')
SCRIPT = 'tts_ming_fr.py' if ENGINE == 'ming' else 'tts_kokoro_fr.py'
CACHE = os.path.expanduser('~/.cache/svgmaker-voix')
#            pitch, speed
VOICES = {'fox': (1.0, 1.0), 'rab': (1.04, 1.0), 'owl': (1.0, 1.0), 'snail': (1.0, 0.92),
          'mimi': (1.08, 1.0), 'coin': (1.05, 1.0)} if ENGINE == 'ming' else \
         {'fox': (0.86, 1.05), 'rab': (1.16, 1.1), 'owl': (0.74, 0.92), 'snail': (0.82, 0.78),
          'mimi': (1.38, 1.1), 'coin': (1.3, 1.15)}
SAY = {'fox': ('Thomas', 190, 1.0), 'rab': ('Flo (Français (France))', 200, 1.22), 'owl': ('Grandpa (Français (France))', 170, 0.92),
       'snail': ('Grandma (Français (France))', 105, 1.0), 'mimi': ('Flo (Français (France))', 210, 1.5), 'coin': ('Thomas', 210, 1.45)}
SIL = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'


NUM = 'zéro un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize'.split()
TENS = {2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante'}


def nombre(n):
    if n <= 16: return NUM[n]
    if n < 20: return 'dix-' + NUM[n - 10]
    d, u = divmod(n, 10)
    return TENS[d] + ('' if u == 0 else ' et un' if u == 1 else '-' + NUM[u])


def _clean(text):
    t = re.sub(r'\bTA-DA+\b', 'Tadaa', text, flags=re.I).replace('+', ' plus ').replace('…', '...')
    # rires : « Hi hi hi » est lu « Aïe aïe aïe » ; collés, ils sont dits comme un rire
    t = re.sub(r'\b([HhKk])([ia])(?:[ -]h[ia]\b)+', lambda m: re.sub(r'[ -]', '', m[0]).capitalize(), t)
    t = re.sub(r'\b(\d{1,2})h(\d{2})\b', lambda m: f'{nombre(int(m[1]))} heures {nombre(int(m[2]))}', t)
    t = re.sub(r'\b(\d{1,2})h\b', lambda m: f'{nombre(int(m[1]))} heures', t)
    t = re.sub(r'\b([0-5]?\d)\b', lambda m: nombre(int(m[1])), t)
    return re.sub(r'\s+', ' ', t).strip()


def _ref_id(who):  # la référence change → le cache est refait
    p = os.path.join(HERE, 'voix-ref', who + '.wav')
    return os.path.getsize(p) if ENGINE == 'ming' and os.path.exists(p) else 0


def _key(who, text):
    return hashlib.sha1(f'v2|{ENGINE}|{who}|{_ref_id(who)}|{_clean(text)}|{VOICES[who]}'.encode()).hexdigest()[:16]


def _rd(p):
    with wave.open(p) as f:
        return np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(float) / 32768


def _ff(i, o, af, sr):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', i, '-af', af, '-ar', str(sr), '-ac', '1', o], check=True)


def prepare(items):
    """items : liste de (who, text). Synthétise en un lot ce qui manque au cache."""
    os.makedirs(CACHE, exist_ok=True)
    jobs, seen = [], set()
    for who, text in items:
        k = _key(who, text); out = os.path.join(CACHE, k + '.raw.wav')
        if k in seen or os.path.exists(out): continue
        seen.add(k); jobs.append({'out': out, 'text': _clean(text), 'speed': VOICES[who][1], 'who': who})
    if not jobs: return True
    if not os.path.exists(PY): return False
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False, encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False); jf = f.name
    r = subprocess.run([PY, os.path.join(HERE, SCRIPT), jf], env={**os.environ, 'HF_HUB_OFFLINE': '1'},
                       capture_output=True, text=True)
    os.unlink(jf)
    print(r.stdout.strip().splitlines()[-1] if r.returncode == 0 and r.stdout.strip() else r.stderr[-600:])
    return r.returncode == 0


def line(who, text, win, sr):
    """Réplique prête à mixer (np.array à `sr`), raccourcie si besoin pour tenir dans `win` secondes."""
    with tempfile.TemporaryDirectory() as d:
        w, w2 = os.path.join(d, 'v.wav'), os.path.join(d, 'v2.wav')
        raw = os.path.join(CACHE, _key(who, text) + '.raw.wav')
        if os.path.exists(raw):
            p, sp = VOICES[who]
            with wave.open(raw) as f: rsr = f.getframerate()
            tempo = (1 / p) * (sp if ENGINE == 'ming' else 1)  # Ming n'a pas de réglage de débit : on l'applique ici
            _ff(raw, w, f'{SIL},asetrate={int(rsr * p)},aresample={sr},atempo={tempo:.3f},'
                        f'acompressor=threshold=-18dB:ratio=3,volume=1.4', sr)
        else:  # repli : voix macOS
            v, rate, p = SAY[who]; a = os.path.join(d, 'v.aiff')
            subprocess.run(['say', '-v', v, '-r', str(rate), '-o', a, text.replace('!', ' ').replace('+', 'plus')], check=True)
            _ff(a, w, f'{SIL},asetrate={int(22050 * p)},aresample={sr},atempo={1 / p:.3f},acompressor=threshold=-18dB:ratio=3,volume=1.5', sr)
        x = _rd(w)
        if len(x) / sr > win:
            _ff(w, w2, f'atempo={min(len(x) / sr / win, 2.0):.3f}', sr); x = _rd(w2)
    return x
