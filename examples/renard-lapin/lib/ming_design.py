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
    'guide': ("一位年轻活泼的女性旅行向导，声音明亮清脆，语速轻快，语气俏皮热情，充满好奇，像在给孩子们讲有趣的故事。",
              "Salut les curieux ! Aujourd'hui, on part en voyage sur la carte. Accrochez-vous, c'est parti !"),
    'hedge': ("一个六岁的小女孩，声音轻柔，有点害羞，说话慢一点，语气温柔，带着一点胆怯。",
              "Bonjour... Je m'appelle Piquette. Je suis nouvelle ici. Est-ce que je peux jouer avec vous ?"),
    'badger': ("一位六十岁左右的农民大叔，声音低沉浑厚，沙哑温暖，语速缓慢，语气友善又爽朗。",
               "Bienvenue à la ferme, les enfants ! Ici, on se lève tôt, mais on mange de bonnes choses."),
    'frog': ("一个五岁的小男孩，声音沙沙的，爱开玩笑，说话很有节奏，语气搞笑。",
             "Ouaf, je suis Plouf ! Je saute, je plonge, et je fais des éclaboussures partout !"),
    'crab': ("一个五岁左右的小男孩，声音鼻音重，尖尖脆脆，语速很快，调皮爱笑，语气得意。",
             "Clac clac ! Regardez mes pinces ! Je suis le plus rapide de toute la plage, hihi !"),
    'pelican': ("一位七十岁左右的老船长，声音低沉沙哑，浑厚温暖，语速缓慢，爱讲故事，语气慈祥爽朗。",
                "Ho ho ho ! Moi, mes amis, j'ai traversé sept mers avec mon bateau. Montez à bord !"),
    'otter': ("一个十二岁左右的大姐姐，声音清亮有力，活泼开朗，语速轻快，充满自信，语气热情。",
              "Attention à la vague, tout le monde ! Moi, je surveille la plage. Suivez-moi, c'est par là !"),
    'marmot': ("一位慈祥的老奶奶，声音温暖柔和，带着睡意，语速很慢，语气亲切又迷迷糊糊。",
               "Oh là là... Je me suis encore endormie. Venez, mes petits, il y a du chocolat chaud."),
    'ibex': ("一位年轻的男滑雪教练，声音洪亮清晰，充满活力，语速较快，语气热情鼓舞人心。",
             "Hop hop hop ! Les skis bien droits, les enfants ! Allez, on descend la piste ensemble !"),
    'lynx': ("一个五岁的小孩，声音轻柔细小，像在悄悄说话，语速慢，语气好奇又有点害羞。",
             "Chut... J'ai fait un dessin. C'est un secret. Tu veux le voir, mais doucement ?"),
    'beaver': ("一位四十岁左右的男工头，声音粗哑浑厚，语速稳，语气自豪又爱显摆，说话像在报尺寸。",
               "Trois planches et demie, mes amis ! Moi, je construis des décors solides, solides, solides."),
    'giraffe': ("一位温柔的年轻女士，声音轻柔飘忽，语速偏慢，语气梦幻，有点心不在焉。",
                "Oh, un ruban rose... où est-ce que je l'ai mis ? Venez, je vais prendre vos mesures."),
    'mole': ("一个老爷爷般的小个子，声音沙哑，压低嗓门说悄悄话，语速急，语气紧张又认真。",
             "Psst ! Chut ! Vous avez oublié la phrase ! Je répète : la petite étoile a peur !"),
    'raccoon': ("一位温和的中年大叔，声音低沉柔和，语速慢，像面包师，亲切沉稳，爱干净又有点完美主义。",
                "Mes amis, le pain est sorti du four. C'est propre, c'est chaud, et il sent très bon."),
    'pigeon': ("一位急性子的年轻邮递员，声音明亮偏尖，语速很快，自豪又爱数数，带着点喉音。",
               "Livraison en vingt secondes, chrono en main ! Une lettre, deux lettres, trois lettres. Signez ici !"),
    'zebra': ("一位冷静的年轻女士，声音清晰平稳，语速适中，认真严肃又暗暗温柔，像交通协管员。",
              "On regarde à gauche, on regarde à droite, puis on traverse. Donne-moi la main, je t'accompagne."),
    'koala': ("一位年迈的男科学家，声音低沉沙哑，语速非常慢，慢吞吞的，困倦温和，说话说到一半会打哈欠。",
              "Doucement... on regarde les étoiles. Il y a tout le temps du monde, mes amis, tout le temps."),
    'meerkat': ("一个十岁左右的小女孩，声音清脆明亮，语速快，机灵好奇，充满活力，语气兴奋。",
                "Je vois quelque chose là-bas, derrière la colline ! Vite, tenez-vous bien, on décolle tout de suite !"),
    'moonling': ("一个神秘的小精灵，声音空灵轻柔，像唱歌一样，音调很高，语速缓慢，害羞又温柔。",
                 "Bienvenue sur ma lune. Ici, tout brille doucement, et la nuit n'a jamais peur de personne."),
    'deer': ("一个八岁左右的小女孩，声音很轻，几乎是耳语，害羞胆怯，语速偏慢，带着梦幻的好奇。",
             "Je reste derrière l'arbre, si tu veux bien. Je regarde les fleurs, mais je n'ose pas approcher."),
    'squirrel': ("一个九岁左右的小女孩，声音又细又快，爱说话，机灵活泼，语气急切，总在忙着收集东西。",
                 "Je le mets de côté, celui-là ! Et celui-là aussi ! Attends, où est-ce que j'ai caché le premier ?"),
    'boar': ("一个体型很大的温柔男孩，声音低沉憨厚，语速很慢，天真老实，有点胆小，像个大宝宝。",
             "Je porte, c'est facile. Montez sur mon dos, les amis. Mais s'il vous plaît, pas de papillons !"),
    'cheetah': ("一个十五岁左右的男少年，声音明亮有劲，语速飞快，说个不停，热心又急躁，像运动员。",
                "J'arrive avant de partir ! Attends, mes lacets... voilà ! Maintenant je cours, je cours, je cours !"),
    'penguin': ("一位中年男裁判，声音一本正经，略显鼻音，语速平稳，严肃认真又有点笨拙，爱讲规则。",
                "Chacun son tour, s'il vous plaît. Selon le règlement, article trois, on lève la main avant de sauter."),
    'hamster': ("一个五六岁的小女孩，声音又尖又小，含着东西似的圆润，语速快，自信满满，慷慨热情。",
                "Une pincée de sucre, deux pincées de farine ! Je suis toute petite, mais je sais très bien faire."),
    'turtle': ("一位六十岁左右的老奶奶，声音温暖圆润，语速很慢，从容不迫，亲切好客，语气安详。",
               "Doucement, doucement, tout arrive à son heure. Entrez dans mon camping, la clé est dans ma poche."),
    'seal': ("一位四十岁左右的男商贩，声音低沉洪亮，圆润爽朗，语速适中偏慢，开朗爱玩，像在吆喝叫卖。",
             "Une boule, deux boules, trois boules ! Pour chaque enfant, une glace bien fraîche, offerte par Marius !"),
    # narrateurs neutres des séries « histoire / géographie sur carte » (pas de personnage, pas de prénom)
    'narrateur': ("一位四十岁左右的男性纪录片旁白，声音低沉沉稳，清晰有磁性，语速中等偏快，语气平静而专注，像在讲述历史故事。",
                  "En l'an mille deux cent quatre-vingt-onze, trois vallées s'allient et la Suisse naît."),
    'narratrice': ("一位四十岁左右的成熟女性纪录片旁白，声音平稳清晰，温暖而权威，语速中等，语气沉着自信。",
                   "En quatorze cent quatre-vingt-un, Fribourg rejoint la Confédération, puis Vaud, le Tessin et Genève."),
    'coin': ("一个五岁的小男孩，声音尖尖的，有点傻乎乎的，语气开心。",
             "Coin coin ! Regardez mon château de sable ! Il est grand, il est beau !"),
}
# hauteur visée (Hz) : à fautes égales, la prise la plus proche gagne
TARGET = {'narrateur': 125, 'narratrice': 200, 'fox': 240, 'rab': 280, 'owl': 210, 'snail': 175, 'mimi': 330, 'coin': 290, 'guide': 250, 'hedge': 300, 'badger': 120, 'frog': 220, 'crab': 260, 'pelican': 140, 'otter': 340, 'marmot': 190, 'ibex': 150, 'lynx': 320, 'beaver': 150, 'giraffe': 260, 'mole': 190, 'raccoon': 130, 'pigeon': 250, 'zebra': 210, 'koala': 140, 'meerkat': 300, 'moonling': 340, 'deer': 280, 'squirrel': 330, 'boar': 120, 'cheetah': 280, 'penguin': 220, 'hamster': 330, 'turtle': 210, 'seal': 130}
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
