"""Synthèse française Ming-3.0 (licence MIT, local) en lot : un WAV par réplique.
Chaque personnage parle avec SA voix de référence, inventée par conception de voix (ming_design.py → voix-ref/<who>.wav),
clonée ici réplique par réplique pour qu'elle reste identique d'un épisode à l'autre. Aucune voix réelle n'est utilisée.
Même logique que ~/ai-video/tts_ming.py (amorce « … » puis mot sacrifié « Bon. », réécoute Whisper, 5 prises max,
contrôle de durée), mais chaque réplique va dans son propre fichier. Le débruitage DeepFilterNet se fait en une
seule passe si DEBRUIT=1 (inutile avec les références conçues, qui n'ont pas de souffle de micro).
    ~/ai-video/ming-venv/bin/python tts_ming_fr.py jobs.json      jobs : [{"out": "x.wav", "text": "...", "who": "fox"}, …]
"""
import json, os, re, subprocess, sys, tempfile, unicodedata
import mlx.core as mx, numpy as np, soundfile as sf, mlx_whisper
from num2words import num2words
from mlx_audio.tts.utils import load_model

# VOIX_REF_DIR : dossier des références d'un autre projet (défaut : voix-ref/ à côté de ce script)
REFDIR = os.environ.get("VOIX_REF_DIR") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "voix-ref")
def ref_of(who):
    return os.path.join(REFDIR, who + ".wav"), open(os.path.join(REFDIR, who + ".txt"), encoding="utf-8").read().strip()
DEBIT, SAC, VERBATIM = 14.5, "Bon", "Euh, alors, hum... bah, euh, voilà, hein, ben."
WH = "mlx-community/whisper-large-v3-turbo"


def lettres(t):
    t = re.sub(r"(\d+)\s*h\s*(\d{2})", lambda m: f"{num2words(int(m[1]), lang='fr')} heures {num2words(int(m[2]), lang='fr')}", t)
    t = re.sub(r"(\d+)\s*h\b", lambda m: f"{num2words(int(m[1]), lang='fr')} heures", t)
    t = re.sub(r"\d+", lambda m: num2words(int(m[0]), lang="fr"), t.replace("+", " plus "))
    return re.sub(r" {2,}", " ", t).strip()


def mots(t):
    t = "".join(c for c in unicodedata.normalize("NFD", lettres(t).lower()) if unicodedata.category(c) != "Mn").replace("’", "'")
    return re.findall(r"[a-zœæ]+", t.replace("-", " "))


def fautes(a, b):
    a, b = mots(a), mots(b); d = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, y in enumerate(b, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[-1]


jobs = json.load(open(sys.argv[1], encoding="utf-8"))
model = load_model(os.path.expanduser("~/ai-video/models/ming-3.0-tts-0.5B-bf16"))
sr = model.sample_rate
tmp = tempfile.mkdtemp(); f = os.path.join(tmp, "p.wav")
takes, warn = [], 0
for j in jobs:
    # la balise [Laughter] de Ming a été essayée (11 nov. 2026) : avec le clonage elle fait sauter des mots → rires écrits « Hihi »
    REF, REF_TEXT = ref_of(j["who"]); best = None
    l = j["text"]; dit = lettres(j.get("say") or l)  # « say » : écriture phonétique facultative, l'affichage et le contrôle gardent « text »
    for amorce, seed in (("… ", 1), ("… ", 2), (SAC + ". ", 1), (SAC + ". ", 2), (SAC + ". ", 3)):
        mx.random.seed(seed)
        w = np.array(next(model.generate(text=amorce + dit, lang_code="fr", ref_audio=REF, ref_text=REF_TEXT)).audio, dtype=np.float32)
        sf.write(f, w, sr)
        if amorce.startswith(SAC):
            ws = [x for sg in mlx_whisper.transcribe(f, path_or_hf_repo=WH, language="fr", temperature=0.0, word_timestamps=True)["segments"] for x in sg["words"]]
            if len(ws) > 1 and re.sub(r"\W", "", ws[0]["word"].lower()) == SAC.lower():
                w = w[int(max(0, ws[1]["start"] - 0.06) * sr):]; sf.write(f, w, sr)
        hyp = mlx_whisper.transcribe(f, path_or_hf_repo=WH, language="fr", temperature=0.0, initial_prompt=VERBATIM)["text"]
        e = fautes(l, hyp); att = max(len(dit) / DEBIT, 0.6)
        if not 0.5 * att <= len(w) / sr <= 1.8 * att + 0.4: e += 10
        if best is None or e < best[0]: best = (e, w, hyp)
        if e == 0: break
    e, w, hyp = best; warn += e > 0
    print(f"[ming] {len(w)/sr:.1f}s{'  ⚠ ' + hyp.strip()[:60] if e else ''}  {l[:50]}", flush=True)
    takes.append(w)
# débruitage en une passe : bout à bout avec 0,5 s de silence, nettoyage, recoupe
gap = np.zeros(int(0.5 * sr), dtype=np.float32)
cat = os.path.join(tmp, "all.wav"); sf.write(cat, np.concatenate([x for w in takes for x in (w, gap)]), sr)
ok = os.environ.get("DEBRUIT") == "1" and subprocess.run([os.path.expanduser("~/ai-video/denoise-venv/bin/python"), os.path.expanduser("~/ai-video/debruiter.py"), cat],
                    capture_output=True).returncode == 0
clean, _ = sf.read(cat, dtype="float32") if ok else (None, None)
i = 0
for j, w in zip(jobs, takes):
    x = clean[i:i + len(w)] if ok else w; i += len(w) + len(gap)
    sf.write(j["out"], x / (np.max(np.abs(x)) + 1e-9) * 0.95, sr)
print(f"ming fr : {len(jobs)} réplique(s), {warn} à réécouter, nettoyage {'ok' if ok else 'non'}")
