// Pays d'Europe (paquet npm « world-atlas », Natural Earth, domaine public) → chemins SVG dans le MÊME repère que
// src/kit/geo/ch.json (même projection : x = (lon·cos 46,8° − minX)·K, y = (maxY − lat)·K), pour que la Suisse
// s'inscrive au bon endroit dans son contexte européen. Résultat versionné : src/kit/geo/eu.json.
//   npm pack world-atlas && tar xzf world-atlas-*.tgz && node scripts/build-geo-eu.mjs package/countries-10m.json
import { readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) throw new Error('usage : node scripts/build-geo-eu.mjs <countries-10m.json>')
const ch = JSON.parse(readFileSync(new URL('../src/kit/geo/ch.json', import.meta.url), 'utf8'))
const { ckx, minX, maxY, K } = ch.proj
const topo = JSON.parse(readFileSync(file, 'utf8'))
const { scale, translate } = topo.transform
const arcs = topo.arcs.map((a) => { let x = 0, y = 0; return a.map(([dx, dy]) => [(x += dx) * scale[0] + translate[0], (y += dy) * scale[1] + translate[1]]) })
const ring = (idx) => idx.flatMap((i, k) => { const a = i >= 0 ? arcs[i] : [...arcs[~i]].reverse(); return k ? a.slice(1) : a })
const polys = (g) => (g.type === 'Polygon' ? [g.arcs] : g.arcs)

const NEAR = new Set(['France', 'Germany', 'Italy', 'Austria', 'Liechtenstein', 'Switzerland', 'Monaco', 'San Marino'])
const FINE = new Set(['Belgium', 'Netherlands', 'Luxembourg', 'Denmark', 'Ireland', 'United Kingdom', 'Portugal', 'Spain', 'Hungary', 'Czechia', 'Slovakia', 'Slovenia', 'Croatia', 'Poland', 'Norway', 'Sweden', 'Finland', 'Estonia', 'Iceland', 'Latvia', 'Lithuania']) // pays racontés dans les reels : contour plus fin
const KEEP = new Set([...NEAR, 'Spain', 'Portugal', 'Andorra', 'United Kingdom', 'Ireland', 'Belgium', 'Netherlands', 'Luxembourg', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Kosovo', 'Malta', 'Morocco', 'Algeria', 'Tunisia', 'Norway', 'Sweden', 'Lithuania', 'Latvia', 'Moldova', 'Ukraine', 'Belarus', 'Turkey', 'Finland', 'Estonia', 'Iceland', 'Macedonia', 'Cyprus', 'N. Cyprus'])
// on ne garde que ce qui touche la fenêtre utile (Atlantique → Balkans, Afrique du Nord → mer du Nord)
const WIN = { lon0: -26, lon1: 36, lat0: 33, lat1: 72 }
const P = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]
const num = (v) => +v.toFixed(1)
function simplify(pts, tol) { // Douglas-Peucker
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
const inside = ([lon, lat]) => lon > WIN.lon0 && lon < WIN.lon1 && lat > WIN.lat0 && lat < WIN.lat1
const countries = []
for (const g of topo.objects.countries.geometries) {
  const raw = g.properties.name, name = raw === 'Macedonia' ? 'North Macedonia' : raw
  if (!KEEP.has(raw)) continue
  const tol = NEAR.has(name) ? 0.7 : FINE.has(name) ? 0.9 : 2.2
  let d = ''
  for (const poly of polys(g)) for (const r of poly.map(ring)) {
    if (!r.some(inside)) continue
    const full = r.map(P), m = full.length >> 1 // anneau fermé : deux moitiés (cf. build-geo-ch.mjs)
    const pts = [...simplify(full.slice(0, m + 1), tol), ...simplify(full.slice(m), tol).slice(1)]
    if (pts.length > 3) d += `M${pts.map(([x, y]) => `${num(x)} ${num(y)}`).join('L')}Z`
  }
  if (d) countries.push({ name, d })
}
const out = { source: 'world-atlas 2.0.2 (Natural Earth 1:10m, domaine public), même projection que ch.json', countries }
writeFileSync(new URL('../src/kit/geo/eu.json', import.meta.url), JSON.stringify(out))
console.log('eu.json', Math.round(JSON.stringify(out).length / 1024), 'Ko,', countries.length, 'pays')
