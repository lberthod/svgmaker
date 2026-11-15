// Génère (si absentes) les images de relief demandées par un brief atlas ("terrain": [{ box, px, z, sea? }] ; sea = niveau de la mer en mètres) via src/kit/geo/relief.py.
//   node scripts/make-relief.mjs <brief.json>
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { isWorld, reliefFile } from '../src/formats/atlas/format.mjs'

const b = JSON.parse(readFileSync(process.argv[2], 'utf8')), world = isWorld(b) // mode monde : masque terre/mer avec world.json, fichier « -w »
for (const t of b.terrain ?? []) {
  const out = reliefFile(t, world)
  if (existsSync(out)) continue
  mkdirSync(path.dirname(out), { recursive: true })
  const r = spawnSync('python3', [new URL('../src/kit/geo/relief.py', import.meta.url).pathname, ...t.box, t.px ?? 2400, t.z ?? 7, out, ...(world ? ['monde'] : []), ...(t.sea ? [`sea=${t.sea}`] : [])], { stdio: 'inherit' })
  if (r.status !== 0) { console.error('relief.py a échoué pour', t.box); process.exit(1) }
}
