// Convertit la carte de la Suisse (paquet npm « swiss-maps », données swisstopo / OFS généralisées)
// en chemins SVG prêts à l'emploi : src/kit/geo/ch.json. À lancer une seule fois (le résultat est versionné) :
//   npm pack swiss-maps && tar xzf swiss-maps-*.tgz && node scripts/build-geo-ch.mjs package/2024
// Aucun accès réseau au rendu : le format « carte » lit ch.json.
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage : node scripts/build-geo-ch.mjs <dossier-swiss-maps/année>')

/** Lecture minimale d'un fichier .dbf (noms des districts). */
function dbf(file) {
  const b = readFileSync(file), n = b.readUInt32LE(4), hl = b.readUInt16LE(8), rl = b.readUInt16LE(10), fields = []
  for (let o = 32; b[o] !== 0x0d; o += 32) fields.push({ name: b.toString('latin1', o, o + 11).replace(/\0.*/, ''), len: b[o + 16] })
  return Array.from({ length: n }, (_, i) => {
    let o = hl + i * rl + 1; const r = {}
    for (const f of fields) { r[f.name] = b.toString('utf8', o, o + f.len).replace(/\0/g, '').trim(); o += f.len }
    return r
  })
}

const topo = JSON.parse(readFileSync(path.join(dir, 'ch-combined.json'), 'utf8'))
const { scale, translate } = topo.transform
// décodage des arcs (deltas quantifiés) → [lon, lat]
const arcs = topo.arcs.map((a) => { let x = 0, y = 0; return a.map(([dx, dy]) => [(x += dx) * scale[0] + translate[0], (y += dy) * scale[1] + translate[1]]) })
const ring = (idx) => idx.flatMap((i, k) => { const a = i >= 0 ? arcs[i] : [...arcs[~i]].reverse(); return k ? a.slice(1) : a })

// projection : équirectangulaire corrigée de cos(46,8°), largeur 1000
const LAT0 = 46.8, ckx = Math.cos((LAT0 * Math.PI) / 180)
const raw = (g) => (g.type === 'Polygon' ? [g.arcs] : g.arcs).flatMap((poly) => poly.map(ring))
const all = [...topo.objects.country.geometries].flatMap(raw).flat()
const xs = all.map(([lon]) => lon * ckx), ys = all.map(([, lat]) => lat)
const minX = Math.min(...xs), maxX = Math.max(...xs), maxY = Math.max(...ys), minY = Math.min(...ys)
const K = 1000 / (maxX - minX)
const P = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]
const num = (v) => +v.toFixed(1)
/** Douglas-Peucker léger : on garde 1 point sur ~0,6 unité d'écart. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Array(pts.length).fill(false); keep[0] = keep[pts.length - 1] = true
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop(); let dmax = 0, im = -1
    const [ax, ay] = pts[a], [bx, by] = pts[b], L = Math.hypot(bx - ax, by - ay) || 1e-9
    for (let i = a + 1; i < b; i++) { const d = Math.abs((by - ay) * pts[i][0] - (bx - ax) * pts[i][1] + bx * ay - by * ax) / L; if (d > dmax) { dmax = d; im = i } }
    if (dmax > tol && im > 0) { keep[im] = true; stack.push([a, im], [im, b]) }
  }
  return pts.filter((_, i) => keep[i])
}
const pathOf = (g, tol = 0.45) => raw(g).map((r) => {
  // anneau fermé (premier = dernier point) : on le coupe en deux moitiés pour que Douglas-Peucker ait deux extrémités distinctes
  const full = r.map(P), m = full.length >> 1
  const pts = [...simplify(full.slice(0, m + 1), tol), ...simplify(full.slice(m), tol).slice(1)]
  return pts.length < 3 ? '' : `M${pts.map(([x, y]) => `${num(x)} ${num(y)}`).join('L')}Z`
}).join('')

const dnames = Object.fromEntries(dbf(path.join(dir, 'districts.dbf')).map((r) => [r.id, r]))
const cnames = Object.fromEntries(dbf(path.join(dir, 'cantons.dbf')).map((r) => [r.id, r.name]))
const ABBR = { 1: 'ZH', 2: 'BE', 3: 'LU', 4: 'UR', 5: 'SZ', 6: 'OW', 7: 'NW', 8: 'GL', 9: 'ZG', 10: 'FR', 11: 'SO', 12: 'BS', 13: 'BL', 14: 'SH', 15: 'AR', 16: 'AI', 17: 'SG', 18: 'GR', 19: 'AG', 20: 'TG', 21: 'TI', 22: 'VD', 23: 'VS', 24: 'NE', 25: 'GE', 26: 'JU' }
const out = {
  source: 'swiss-maps 4.7.0 (swisstopo / OFS, limites généralisées 2024), projection équirectangulaire',
  width: 1000, height: num((maxY - minY) * K),
  proj: { ckx, minX, maxY, K }, // [lon, lat] → x = (lon·ckx − minX)·K, y = (maxY − lat)·K
  country: pathOf(topo.objects.country.geometries[0], 0.3),
  cantons: topo.objects.cantons.geometries.map((g) => ({ id: g.id, code: ABBR[g.id], name: cnames[g.id].split(' / ')[0], d: pathOf(g) })),
  districts: topo.objects.districts.geometries.map((g) => ({ id: g.id, canton: +dnames[g.id].KTNR, name: dnames[g.id].name, d: pathOf(g, 0.6) })),
  lakes: topo.objects.lakes.geometries.map((g) => pathOf(g, 0.5)).filter(Boolean),
}
writeFileSync(new URL('../src/kit/geo/ch.json', import.meta.url), JSON.stringify(out))
console.log('ch.json', Math.round(JSON.stringify(out).length / 1024), 'Ko', out.width, '×', out.height, out.cantons.length, 'cantons', out.districts.length, 'districts')
