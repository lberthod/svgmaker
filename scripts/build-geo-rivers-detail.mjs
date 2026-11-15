// Fleuves secondaires d'Europe (Natural Earth 1:10m, domaine public) : rang 9-10 de rivers_lake_centerlines
// + supplément européen (rivers_europe, rang 10-11 : Aar, Reuss, Saône, Arno, Somme, Isar…), même repère que eu.json.
// Résultat versionné : src/kit/geo/eu-rivers-detail.json, utilisé seulement par les briefs atlas `"rivers": "detail"`.
//   node scripts/build-geo-rivers-detail.mjs <dossier contenant ne_10m_rivers_lake_centerlines.geojson, ne_10m_rivers_europe.geojson>
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage : node scripts/build-geo-rivers-detail.mjs <dossier des geojson Natural Earth>')
const ch = JSON.parse(readFileSync(new URL('../src/kit/geo/ch.json', import.meta.url), 'utf8'))
const { ckx, minX, maxY, K } = ch.proj
const load = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8')).features
const WIN = { lon0: -25, lon1: 45, lat0: 33, lat1: 72 }, TOL = 0.6
const P = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]
const num = (v) => +v.toFixed(1)
const inWin = ([lon, lat]) => lon > WIN.lon0 && lon < WIN.lon1 && lat > WIN.lat0 && lat < WIN.lat1
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
const seg = (pts) => pts.map(([x, y]) => `${num(x)} ${num(y)}`).join('L')
const rivers = []
const add = (f, keepRank) => {
  const p = f.properties, sr = p.scalerank
  if (!f.geometry || !keepRank(sr) || p.featurecla === 'Lake Centerline') return
  const lines = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates
  let d = ''
  for (const l of lines) { if (!l.some(inWin)) continue; const pts = simplify(l.map(P), TOL); if (pts.length > 1) d += `M${seg(pts)}` }
  if (d) rivers.push({ n: p.name_fr || p.name_en || p.name || '', r: sr, d })
}
for (const f of load('ne_10m_rivers_lake_centerlines.geojson')) add(f, (sr) => sr >= 9 && sr <= 10)
for (const f of load('ne_10m_rivers_europe.geojson')) add(f, (sr) => sr <= 11)
const json = JSON.stringify({ source: 'Natural Earth 1:10m rivers_lake_centerlines (rang 9-10) + rivers_europe (rang 10-11), domaine public, même projection que eu.json', rivers })
writeFileSync(new URL('../src/kit/geo/eu-rivers-detail.json', import.meta.url), json)
console.log('eu-rivers-detail.json', (json.length / 1048576).toFixed(2), 'Mo,', rivers.length, 'tracés')
