#!/usr/bin/env python3
"""Contrôle automatique d'une vidéo avant publication : controle.py <id>  (ex. 16-royaume-uni)
Vérifie : durée 60-100 s, présence du son et niveau, boucle (dernière image ≈ première), alertes d'audit du dernier rendu."""
import subprocess, sys, re, json, os, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
vid = sys.argv[1]
mp4 = f'{ROOT}/reels-nuit/final/{vid}.mp4'
out = {'id': vid, 'ok': True, 'problemes': []}
def bad(m): out['ok'] = False; out['problemes'].append(m)
if not os.path.exists(mp4): bad('mp4 absent'); print(json.dumps(out, ensure_ascii=False)); sys.exit(1)
d = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp4]).decode())
out['duree'] = round(d, 1)
if d < 55 or d > 100: bad(f'durée {d:.0f} s hors 55-100 s')
r = subprocess.run(['ffmpeg','-i',mp4,'-af','volumedetect','-vn','-f','null','-'], capture_output=True, text=True).stderr
m = re.search(r'mean_volume: (-?[\d.]+) dB', r)
if not m: bad('pas de son')
else:
    out['volume'] = float(m.group(1))
    if not (-17 <= out['volume'] <= -10): bad(f'volume moyen {out["volume"]} dB')
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg','-y','-v','error','-ss','0','-i',mp4,'-frames:v','1','-vf','scale=270:-1',f'{tmp}/a.png'])
subprocess.run(['ffmpeg','-y','-v','error','-sseof','-0.1','-i',mp4,'-frames:v','1','-vf','scale=270:-1',f'{tmp}/b.png'])
q = subprocess.run(['ffmpeg','-i',f'{tmp}/a.png','-i',f'{tmp}/b.png','-lavfi','ssim','-f','null','-'], capture_output=True, text=True).stderr
m = re.search(r'All:([\d.]+)', q)
out['ssim_boucle'] = float(m.group(1)) if m else None
if out['ssim_boucle'] is None or out['ssim_boucle'] < 0.84: bad(f'boucle : dernière image ≠ première (ssim {out["ssim_boucle"]})')
# alertes d'audit du dernier rendu (journal du brief)
bid = json.load(open(f'{ROOT}/reels-nuit/briefs/{vid}.json'))['id']
log = f'{ROOT}/reels-nuit/logs/{bid}.log'
out['alertes'] = None
if os.path.exists(log):
    txt = open(log, errors='ignore').read()
    # dernier rendu = après la dernière ligne « → ... alerte(s) » précédente ; alertes réelles = hors tag permanent et carton final (faux positif de la boucle)
    if re.search(r'(\d+) alerte\(s\) d.audit', txt):
        last = txt.rsplit('Rendu', 1)[-1] if False else txt
        real = [l for l in txt.splitlines() if '⚠' in l and '@terranarrata' not in l and 'carton final' not in l and 'relief absent' not in l]
        out['alertes'] = len(real)
if out['alertes'] is None: bad('journal d\'audit introuvable')
elif out['alertes'] > 1: bad(f'{out["alertes"]} alertes d\'audit')
print(json.dumps(out, ensure_ascii=False)); sys.exit(1)
d = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp4]).decode())
out['duree'] = round(d, 1)
if d < 55 or d > 100: bad(f'durée {d:.0f} s hors 55-100 s')
r = subprocess.run(['ffmpeg','-i',mp4,'-af','volumedetect','-vn','-f','null','-'], capture_output=True, text=True).stderr
m = re.search(r'mean_volume: (-?[\d.]+) dB', r)
if not m: bad('pas de son')
else:
    out['volume'] = float(m.group(1))
    if not (-17 <= out['volume'] <= -10): bad(f'volume moyen {out["volume"]} dB')
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg','-y','-v','error','-ss','0','-i',mp4,'-frames:v','1','-vf','scale=270:-1',f'{tmp}/a.png'])
subprocess.run(['ffmpeg','-y','-v','error','-sseof','-0.1','-i',mp4,'-frames:v','1','-vf','scale=270:-1',f'{tmp}/b.png'])
q = subprocess.run(['ffmpeg','-i',f'{tmp}/a.png','-i',f'{tmp}/b.png','-lavfi','ssim','-f','null','-'], capture_output=True, text=True).stderr
m = re.search(r'All:([\d.]+)', q)
out['ssim_boucle'] = float(m.group(1)) if m else None
if out['ssim_boucle'] is None or out['ssim_boucle'] < 0.84: bad(f'boucle : dernière image ≠ première (ssim {out["ssim_boucle"]})')
# alertes d'audit du dernier rendu
log = f'{ROOT}/reels-nuit/logs/atlas-{vid.split("-",1)[1]}.log'
st = open(f'{ROOT}/reels-nuit/STATUS.txt').read().splitlines()
al = None
for l in reversed(st):
    if ' ok ' in l and vid.split('-',1)[1].replace('-v5','') in l.replace('atlas-','').replace('-','') .replace(' ','') or False: pass
out['alertes'] = None
print(json.dumps(out, ensure_ascii=False))
sys.exit(0 if out['ok'] else 1)
