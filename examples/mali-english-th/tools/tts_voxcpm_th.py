"""Voix thaïe de Mali avec VoxCPM2 (openbmb, licence Apache 2.0, « free for commercial use »), en local (MLX).

Kokoro ne parle pas thaï et les voix macOS `say` sont interdites (licence personnelle, non commerciale).
La voix de Mali est INVENTÉE par la conception de voix de VoxCPM2 (une description → une voix, sans
enregistrement de personne). La prise retenue devient la référence (voix-ref/mali_th.wav + .txt + .json) ;
toutes les répliques la reprennent ensuite, pour que Mali ait la même voix d'une vidéo à l'autre.

À lancer avec le Python qui contient mlx_audio et mlx_whisper (~/ai-video/tools-venv) :
  1. conception (une fois) :
     HF_HUB_OFFLINE=1 tools-venv/bin/python tts_voxcpm_th.py design <graine> [<graine>…]
        → voix-ref/candidats/mali_th-<graine>.wav, transcription Whisper affichée
     HF_HUB_OFFLINE=1 tools-venv/bin/python tts_voxcpm_th.py keep <graine>
        → voix-ref/mali_th.{wav,txt,json}
  2. répliques :
     HF_HUB_OFFLINE=1 tools-venv/bin/python tts_voxcpm_th.py jobs.json
        jobs.json : [{"out": "x.wav", "text": "แมว", "check": "แมว", "takes": 3, "max_takes": 6}, …]
        text = ce que dit le moteur (écriture de synthèse éventuelle), check = le texte affiché, que Whisper
        doit retrouver. Chaque réplique est générée `takes` fois, et jusqu'à `max_takes` fois tant que la
        meilleure prise reste sous 0,85 ; Whisper (thaï) relit chaque prise et la plus fidèle est gardée
        dans x.wav. Résultat par réplique : x.json {"heard", "score", "take"}.
Sortie : WAV mono 48 kHz 16 bits.
"""
import difflib
import json
import os
import re
import sys
import unicodedata
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(os.path.dirname(HERE), "voix-ref")
MODEL = os.environ.get("VOXCPM_MODEL", "mlx-community/VoxCPM2-8bit")
WHISPER = "mlx-community/whisper-large-v3-turbo"
# description de la voix inventée (aucune personne réelle) et phrase de référence sans mot difficile
DESIGN = ("A young Thai woman with a warm, sweet and cheerful voice, medium-high pitch, gentle and friendly, "
          "clear pronunciation, speaking slowly and kindly to small children")
DESIGN_TEXT = "สวัสดีจ้า วันนี้เรามาเรียนภาษาอังกฤษด้วยกันนะ สนุกมากเลย"


def load():
    from mlx_audio.tts.utils import load as load_model
    return load_model(MODEL)


def synth(m, text, seed, **kw):
    import mlx.core as mx
    mx.random.seed(seed)
    return np.concatenate([np.array(r.audio, np.float64) for r in m.generate(text=text, **kw)])


def save(path, a, sr):
    a = a / (np.max(np.abs(a)) + 1e-9) * 0.95
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((a * 32767).astype(np.int16).tobytes())


def norm(s):
    return re.sub(r"[^\w฀-๿]+", "", unicodedata.normalize("NFC", s.lower()))


def heard(a, sr):
    """Transcription thaïe d'une prise, avec 0,8 s de silence autour (Whisper lit mal un mot collé au bord)."""
    import mlx_whisper
    x = np.interp(np.arange(0, len(a), sr / 16000), np.arange(len(a)), a).astype(np.float32)
    pad = np.zeros(int(0.8 * 16000), np.float32)
    x = np.concatenate([pad, x, pad])
    r = mlx_whisper.transcribe(x, path_or_hf_repo=WHISPER, language="th", temperature=0.0,
                               condition_on_previous_text=False)
    return r["text"].strip()


def score(text, got):
    a, b = norm(text), norm(got)
    return round(difflib.SequenceMatcher(None, a, b).ratio(), 3) if a and b else 0.0


def main():
    cmd = sys.argv[1]
    m = load()
    sr = m.sample_rate
    if cmd == "design":
        cand = os.path.join(REF_DIR, "candidats")
        os.makedirs(cand, exist_ok=True)
        for s in map(int, sys.argv[2:]):
            a = synth(m, DESIGN_TEXT, s, instruct=DESIGN)
            save(os.path.join(cand, f"mali_th-{s}.wav"), a, sr)
            got = heard(a, sr)
            print(f"candidat {s} : {len(a) / sr:.2f} s · score {score(DESIGN_TEXT, got)} · « {got} »", flush=True)
        return
    if cmd == "keep":
        s = int(sys.argv[2])
        src = os.path.join(REF_DIR, "candidats", f"mali_th-{s}.wav")
        os.makedirs(REF_DIR, exist_ok=True)
        with open(src, "rb") as f, open(os.path.join(REF_DIR, "mali_th.wav"), "wb") as g:
            g.write(f.read())
        open(os.path.join(REF_DIR, "mali_th.txt"), "w", encoding="utf-8").write(DESIGN_TEXT + "\n")
        json.dump({"moteur": f"VoxCPM2 ({MODEL}), licence Apache 2.0",
                   "conception": "voix inventée par description (voice design), aucune personne réelle clonée",
                   "description": DESIGN, "seed": s, "texte": DESIGN_TEXT},
                  open(os.path.join(REF_DIR, "mali_th.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print(f"voix thaïe de Mali : graine {s} → {REF_DIR}/mali_th.wav")
        return
    # répliques
    ref = os.path.join(REF_DIR, "mali_th.wav")
    if not os.path.exists(ref):
        sys.exit(f"✗ voix thaïe de Mali absente ({ref}) : lancer « design » puis « keep » (voir l'en-tête)")
    ref_text = open(os.path.join(REF_DIR, "mali_th.txt"), encoding="utf-8").read().strip()
    jobs = json.load(open(cmd, encoding="utf-8"))
    for j in jobs:
        best, check = None, j.get("check", j["text"])
        n0, n1 = int(j.get("takes", 3)), int(j.get("max_takes", j.get("takes", 3)))
        for k in range(n1):
            if k >= n0 and best[0] >= 0.85:
                break
            # référence + continuation : même timbre et même ton que la phrase de référence
            a = synth(m, j["text"], 1000 + k, ref_audio=ref, prompt_audio=ref, prompt_text=ref_text)
            got = heard(a, sr)
            sc = score(check, got)
            # prise qui s'emballe (le modèle répète une syllabe en boucle) : trop longue pour le texte, rejetée
            if len(a) / sr > 1.5 + 0.3 * len(check):
                sc = 0.0
            if best is None or sc > best[0]:
                best = (sc, k, a, got)
            if sc >= 0.999:
                break
        sc, k, a, got = best
        save(j["out"], a, sr)
        json.dump({"heard": got, "score": sc, "take": k},
                  open(os.path.splitext(j["out"])[0] + ".json", "w", encoding="utf-8"), ensure_ascii=False)
        said = f" (dit « {j['text']} »)" if j["text"] != check else ""
        print(f"{'✓' if sc >= 0.999 else 'ℹ'} [th] « {check} »{said} · entendu « {got} » ({sc}, prise {k + 1})", flush=True)


if __name__ == "__main__":
    main()
