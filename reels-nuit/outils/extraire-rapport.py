#!/usr/bin/env python3
"""Extrait le rapport final (appel SubagentHandback) d'un agent d'audit : extraire-rapport.py <agentId> <sortie.md>"""
import json, sys, glob
aid, out = sys.argv[1], sys.argv[2]
f = glob.glob(f'/private/tmp/claude-501/*/*/tasks/{aid}.output')[0]
txt = None
for l in open(f):
    if not l.strip(): continue
    r = json.loads(l)
    m = r.get('message') or {}
    c = m.get('content')
    if isinstance(c, list):
        for b in c:
            if b.get('type') == 'tool_use' and 'andback' in b.get('name', ''):
                i = b.get('input', {}); txt = next((v for v in i.values() if isinstance(v, str) and len(v) > 200), None) or json.dumps(i, ensure_ascii=False)
            elif b.get('type') == 'text' and m.get('role') == 'assistant' and txt is None:
                last = b['text']
if txt is None: txt = last if 'last' in dir() else ''
open(out, 'w').write(txt)
print(out, len(txt))
