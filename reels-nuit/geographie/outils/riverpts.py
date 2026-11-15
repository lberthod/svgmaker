#!/usr/bin/env python3
"""usage: riverpts.py <Nom NE ou alias, ou Nom1+Nom2> [n_points=14] [lon0 lat0 lon1 lat1]  -> liste [lon,lat] ordonnée amont->aval approximative, pour line.points"""
import json, re, sys, math
G='/Users/loicberthod/Desktop/Coding/svgMaker/src/kit/geo/'
pr=json.load(open(G+'ch.json'))['proj']; ckx,minX,maxY,K=pr['ckx'],pr['minX'],pr['maxY'],pr['K']
r=json.load(open(G+'eu-regions.json'))
try: r['rivers']+=json.load(open(G+'eu-rivers-detail.json'))['rivers']
except FileNotFoundError: pass
ALIAS={'Rhin':'Rhein+Rhine','Tage':'Tajo+Tagus','Dniepr':'Dnieper+Dnepre+Dniepr','Saône':'Sane+Saône','Meuse':'Maas','Escaut':'Schelde','Vistule':'Vistula','Tamise':'Thames'}
name=sys.argv[1]; names=set(ALIAS.get(name,name).split('+')); n=int(sys.argv[2]) if len(sys.argv)>2 else 14
box=list(map(float,sys.argv[3:7])) if len(sys.argv)>6 else None
segs=[]
for x in r['rivers']:
  if x['n'] not in names: continue
  for sub in re.split(r'(?=M)',x['d']):
    v=[float(t) for t in re.findall(r'-?\d+\.?\d*',sub)]
    pts=[((v[i]/K+minX)/ckx, maxY-v[i+1]/K) for i in range(0,len(v)-1,2)]
    if box: pts=[p for p in pts if box[0]<=p[0]<=box[2] and box[1]<=p[1]<=box[3]]
    if len(pts)>1: segs.append(pts)
# chaîner les segments : glouton par extrémités les plus proches
segs.sort(key=len,reverse=True); chain=segs.pop(0)
while segs:
  best=None
  for i,s in enumerate(segs):
    for rev in (False,True):
      ss=s[::-1] if rev else s
      for end in ('h','t'):
        a=chain[-1] if end=='t' else chain[0]; b=ss[0] if end=='t' else ss[-1]
        d=math.dist(a,b)
        if best is None or d<best[0]: best=(d,i,rev,end)
  d,i,rev,end=best
  if d>1.0: segs.pop(i); continue
  s=segs.pop(i); s=s[::-1] if rev else s
  chain=chain+s if end=='t' else s+chain
L=[0]
for a,b in zip(chain,chain[1:]): L.append(L[-1]+math.dist(a,b))
out=[]
for k in range(n):
  t=L[-1]*k/(n-1); j=min(range(len(L)),key=lambda i:abs(L[i]-t)); out.append([round(chain[j][0],2),round(chain[j][1],2)])
print(json.dumps(out))
