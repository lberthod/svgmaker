// Subdivisions (régions/provinces/départements), fleuves et lacs d'Europe (Natural Earth 1:10m, domaine public)
// → chemins SVG dans le MÊME repère que ch.json / eu.json. Résultat versionné : src/kit/geo/eu-regions.json.
//   node scripts/build-geo-regions.mjs <dossier contenant ne_10m_admin_1_states_provinces.geojson,
//        ne_10m_rivers_lake_centerlines.geojson, ne_10m_lakes.geojson>
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage : node scripts/build-geo-regions.mjs <dossier des geojson Natural Earth>')
const ch = JSON.parse(readFileSync(new URL('../src/kit/geo/ch.json', import.meta.url), 'utf8'))
const eu = JSON.parse(readFileSync(new URL('../src/kit/geo/eu.json', import.meta.url), 'utf8'))
const { ckx, minX, maxY, K } = ch.proj
const load = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8')).features

const TOL = { region: 1.0, river: 0.8, lake: 0.8 }
const MIN_AREA = 0.5
const WIN = { lon0: -25, lon1: 45, lat0: 33, lat1: 72 }
// code adm0_a3 (Natural Earth) → nom dans eu.json
const A3 = { FRA: 'France', MAR: 'Morocco', UKR: 'Ukraine', BLR: 'Belarus', LTU: 'Lithuania', CZE: 'Czechia', DEU: 'Germany', LVA: 'Latvia', NOR: 'Norway', SWE: 'Sweden', LUX: 'Luxembourg', BEL: 'Belgium', ALB: 'Albania', KOS: 'Kosovo', TUR: 'Turkey', ESP: 'Spain', DNK: 'Denmark', TUN: 'Tunisia', ROU: 'Romania', HUN: 'Hungary', SVK: 'Slovakia', POL: 'Poland', IRL: 'Ireland', GBR: 'United Kingdom', GRC: 'Greece', AUT: 'Austria', ITA: 'Italy', CHE: 'Switzerland', NLD: 'Netherlands', LIE: 'Liechtenstein', SRB: 'Serbia', HRV: 'Croatia', SVN: 'Slovenia', BGR: 'Bulgaria', SMR: 'San Marino', MCO: 'Monaco', DZA: 'Algeria', AND: 'Andorra', MNE: 'Montenegro', BIH: 'Bosnia and Herz.', PRT: 'Portugal', MDA: 'Moldova', MLT: 'Malta' }
const NAMES = new Set(eu.countries.map((c) => c.name))
const ALIAS = { 'Bosnia and Herzegovina': 'Bosnia and Herz.', Czech: 'Czechia', 'Czech Republic': 'Czechia', Macedonia: 'North Macedonia', 'The Netherlands': 'Netherlands' }
const countryOf = (p) => { const n = A3[p.adm0_a3] || ALIAS[p.admin] || p.admin; return NAMES.has(n) ? n : null }

const P = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]
const num = (v) => +v.toFixed(1)
const inWin = ([lon, lat]) => lon > WIN.lon0 && lon < WIN.lon1 && lat > WIN.lat0 && lat < WIN.lat1
const area = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1 } return Math.abs(s) / 2 }
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
// anneau fermé : deux moitiés avant Douglas-Peucker (cf. build-geo-ch.mjs)
function closedPath(ring, tol) {
  const full = ring.map(P)
  if (full.length > 1 && full[0][0] === full.at(-1)[0] && full[0][1] === full.at(-1)[1]) full.pop()
  if (full.length < 4 || area(full) < MIN_AREA) return ''
  full.push(full[0])
  const m = full.length >> 1
  const pts = [...simplify(full.slice(0, m + 1), tol), ...simplify(full.slice(m), tol).slice(1)]
  pts.pop()
  return pts.length > 2 && area(pts) >= MIN_AREA ? `M${seg(pts)}Z` : ''
}
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [])

// régions
const regions = [], perCountry = {}
for (const f of load('ne_10m_admin_1_states_provinces.geojson')) {
  const c = countryOf(f.properties); if (!c || !f.geometry) continue
  let d = ''
  for (const poly of polys(f.geometry)) for (const r of poly) if (r.some(inWin)) d += closedPath(r, TOL.region)
  if (!d) continue
  regions.push({ c, n: f.properties.name || f.properties.name_en || '', d }); perCountry[c] = (perCountry[c] || 0) + 1
}
// fleuves
const rivers = []
for (const f of load('ne_10m_rivers_lake_centerlines.geojson')) {
  const sr = f.properties.scalerank
  if (!f.geometry || sr > 8 || f.properties.featurecla === 'Lake Centerline') continue
  const lines = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates
  let d = ''
  for (const l of lines) { if (!l.some(inWin)) continue; const pts = simplify(l.map(P), TOL.river); if (pts.length > 1) d += `M${seg(pts)}` }
  if (d) rivers.push({ n: f.properties.name_en || f.properties.name || '', r: Math.max(1, Math.min(6, Math.round(sr))), d })
}
// lacs
const lakes = []
for (const f of load('ne_10m_lakes.geojson')) {
  if (!f.geometry || f.properties.scalerank > 6) continue
  let d = ''
  for (const poly of polys(f.geometry)) for (const r of poly) if (r.some(inWin)) d += closedPath(r, TOL.lake)
  if (d) lakes.push({ n: f.properties.name_en || f.properties.name || '', d })
}
const out = { source: 'Natural Earth 1:10m admin-1, rivers_lake_centerlines, lakes (domaine public), même projection que ch.json/eu.json', regions, rivers, lakes }
const json = JSON.stringify(out)
writeFileSync(new URL('../src/kit/geo/eu-regions.json', import.meta.url), json)
console.log('eu-regions.json', (json.length / 1048576).toFixed(2), 'Mo,', regions.length, 'régions,', rivers.length, 'fleuves,', lakes.length, 'lacs')
console.log(Object.entries(perCountry).map(([k, v]) => `${k}:${v}`).join(' '))
console.log('pays sans régions :', [...NAMES].filter((n) => !perCountry[n]).join(', ') || '—')
