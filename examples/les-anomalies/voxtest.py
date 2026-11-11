"""Teste des variantes de réplique à la voix d'un personnage, avec le même traitement que audiolib,
puis les fait transcrire par Whisper. Usage :
  python3 voxtest.py mirage "Laissez-moi tranquille !" "Laisse-moi tranquille !"
(lance Whisper via ~/ai-video/tools-venv ; ✓ = compris tel quel)"""
import json, os, subprocess, sys, tempfile
here = os.path.dirname(os.path.abspath(__file__))
who, texts = sys.argv[1], sys.argv[2:]
d = tempfile.mkdtemp()
json.dump({'duration': 4 * len(texts) + 2, 'lines': [{'who': who, 't0': 4 * i + .5, 't1': 4 * i + 3.9, 'text': t} for i, t in enumerate(texts)], 'sfx': []},
          open(os.path.join(d, 'timeline.json'), 'w'))
open(os.path.join(d, 'a.py'), 'w').write(f"import sys; sys.path.insert(0, {here!r})\nfrom audiolib import Episode\nE = Episode(__file__)\nE.voices()\n")
env = dict(os.environ, VOX_DIR=os.path.join(d, 'vox'))
subprocess.run([sys.executable, os.path.join(d, 'a.py')], env=env, check=True, stdout=subprocess.DEVNULL)
json.dump([{'wav': os.path.join(d, 'vox', f'{i:02d}.wav'), 'text': t, 'lang': 'fr'} for i, t in enumerate(texts)], open(os.path.join(d, 'c.json'), 'w'), ensure_ascii=False)
subprocess.run([os.path.expanduser('~/ai-video/tools-venv/bin/python'), os.path.join(here, '..', 'mali-english-th', 'tools', 'qa_whisper.py'), os.path.join(d, 'c.json')],
               env=dict(os.environ, HF_HUB_OFFLINE='1'), stderr=subprocess.DEVNULL)
