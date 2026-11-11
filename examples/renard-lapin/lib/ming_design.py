"""Crée la voix de référence de chaque personnage avec la conception de voix de Ming-3.0 (description → voix),
sans aucune voix réelle. Plusieurs graines par personnage ; Whisper garde la prise la mieux lue.
Ensuite tts_ming_fr.py clone cette référence pour toutes les répliques du personnage (voix stable).
    ~/ai-video/ming-venv/bin/python ming_design.py [personnage…]      → voix-ref/<perso>.wav + .txt + .json
"""
import json, os, re, sys, unicodedata
import mlx.core as mx, numpy as np, soundfile as sf, mlx_whisper
from mlx_audio.tts.utils import load_model
from mlx_audio.tts.models.bailingmm.bailingmm import ming3_instruction

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get('VOIX_REF_DIR') or os.path.join(HERE, 'voix-ref')  # dossier de sortie d'un autre projet possible
# description (en chinois, langue d'entraînement des légendes de style) + phrase de référence française
CHARS = {
    'fox': ("一个七岁左右的小男孩，声音清亮活泼，有点调皮贪吃，语气兴奋，充满活力。",
            "Moi, j'adore les croissants ! Le matin, je cours très vite pour aller à l'école avec mon ami."),
    'rab': ("一个六岁左右的小男孩，声音高而柔和，说话很快，认真又有点紧张，像个小学霸。",
            "Attends-moi ! Je compte mes pas : un, deux, trois, quatre. On va être en retard !"),
    'owl': ("一位温柔慈祥的中年女老师，声音温暖清晰，语速适中，语气耐心友善。",
            "Bonjour la classe ! Aujourd'hui, nous allons apprendre les lettres. Levez la main, s'il vous plaît."),
    'snail': ("一位非常年老的老奶奶，声音沙哑缓慢，慢吞吞的，语气慈爱。",
              "Oh là là, doucement les enfants... Moi, je prends mon temps. Bonne journée, mes petits."),
    'mimi': ("一个四岁的小女孩，声音非常尖细可爱，爱笑，语气天真。",
             "Hihihi ! C'est rigolo ! Moi aussi je veux jouer avec vous, s'il te plaît !"),
    'coin': ("一个五岁的小男孩，声音尖尖的，有点傻乎乎的，语气开心。",
             "Coin coin ! Regardez mon château de sable ! Il est grand, il est beau !"),
}
# hauteur visée (Hz) : à fautes égales, la prise la plus proche gagne
TARGET = {'fox': 240, 'rab': 280, 'owl': 210, 'snail': 175, 'mimi': 330, 'coin': 290}
# --chars perso.json (ou VOIX_CHARS_JSON) : personnages d'un autre projet {"nom": {"style": "…", "text": "…", "target": Hz}}
_cj = sys.argv[sys.argv.index('--chars') + 1] if '--chars' in sys.argv else os.environ.get('VOIX_CHARS_JSON')
if '--chars' in sys.argv: del sys.argv[sys.argv.index('--chars'):sys.argv.index('--chars') + 2]
if _cj:
    _d = json.load(open(_cj, encoding='utf-8'))
    CHARS = {k: (v['style'], v['text']) for k, v in _d.items()}; TARGET = {k: v.get('target', 220) for k, v in _d.items()}
SEEDS = int(os.environ.get('VOIX_SEEDS', 6))
WH = 'mlx-community/whisper-large-v3-turbo'


def mots(t):
    t = ''.join(c for c in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(c) != 'Mn')
    return re.findall(r'[a-z]+', t)


def fautes(a, b):
    a, b = mots(a), mots(b); d = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, y in enumerate(b, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[-1]


def f0(w, sr):  # hauteur médiane grossière (autocorrélation), pour le journal
    hs = []
    for i in range(0, len(w) - 2048, 2048):
        x = w[i:i + 2048]
        if np.abs(x).mean() < 0.02: continue
        c = np.correlate(x, x, 'full')[2047:]; lo, hi = int(sr / 500), int(sr / 70)
        hs.append(sr / (lo + np.argmax(c[lo:hi])))
    return int(np.median(hs)) if hs else 0


os.makedirs(OUT, exist_ok=True)
model = load_model(os.path.expanduser('~/ai-video/models/ming-3.0-tts-0.5B-bf16')); sr = model.sample_rate
for who in (sys.argv[1:] or CHARS):
    style, text = CHARS[who]; best = None
    for seed in range(1, SEEDS + 1):
        mx.random.seed(seed)
        w = np.array(next(model.generate(text=text, lang_code='fr', instruct=ming3_instruction(style=style),
                                         use_zero_spk_emb=True)).audio, dtype=np.float32)
        p = os.path.join(OUT, f'{who}-{seed}.wav'); sf.write(p, w, sr)
        hyp = mlx_whisper.transcribe(p, path_or_hf_repo=WH, language='fr', temperature=0.0)['text']
        e = fautes(text, hyp) + (10 if not 2.5 < len(w) / sr < 12 else 0); h = f0(w, sr)
        print(f'{who} graine {seed} : {e} faute(s), {len(w)/sr:.1f} s, ~{h} Hz', flush=True)
        score = e * 1000 + abs(h - TARGET[who])
        if best is None or score < best[0]: best = (score, seed, w, e)
    _, seed, w, e = best
    sf.write(os.path.join(OUT, f'{who}.wav'), w, sr)
    open(os.path.join(OUT, f'{who}.txt'), 'w').write(text)
    json.dump({'style': style, 'seed': seed, 'fautes': e}, open(os.path.join(OUT, f'{who}.json'), 'w'), ensure_ascii=False)
    print(f'→ {who} : graine {seed}', flush=True)
