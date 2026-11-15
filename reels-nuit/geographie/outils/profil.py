#!/usr/bin/env python3
"""usage: profil.py n z lon,lat lon,lat [lon,lat...]  -> n altitudes (m) le long du trajet (tuiles terrarium, cache relief.py)
Le max local sur ±1 échantillon est gardé pour ne pas rater les sommets."""
import sys, math, numpy as np
sys.path.insert(0,'/Users/loicberthod/Desktop/Coding/svgMaker/src/kit/geo'); import relief
from PIL import Image
n=int(sys.argv[1]); z=int(sys.argv[2]); P=[tuple(map(float,a.split(','))) for a in sys.argv[3:]]
L=[0]
for a,b in zip(P,P[1:]): L.append(L[-1]+math.dist(a,b))
def at(s):
  for k in range(len(P)-1):
    if s<=L[k+1] or k==len(P)-2:
      t=(s-L[k])/max(1e-9,L[k+1]-L[k]); return P[k][0]+t*(P[k+1][0]-P[k][0]), P[k][1]+t*(P[k+1][1]-P[k][1])
cache={}
def elev(lon,lat):
  x,y=relief.merc(lon,lat,z); tx,ty=int(x//256),int(y//256)
  if (tx,ty) not in cache:
    p=relief.fetch(z,tx,ty); a=np.asarray(Image.open(p).convert('RGB'),np.float32); cache[(tx,ty)]=a[...,0]*256+a[...,1]+a[...,2]/256-32768
  return float(cache[(tx,ty)][int(y)%256,int(x)%256])
m=n*6; raw=[elev(*at(L[-1]*k/(m-1))) for k in range(m)]
out=[]
for k in range(n):
  c=round(k*(m-1)/(n-1)); seg=raw[max(0,c-3):c+4]; v=max(seg) if max(seg)>0 else min(seg)
  out.append(int(round(v,-1)))
print(out)
