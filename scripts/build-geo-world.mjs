// Carte « monde » : tous les pays ABSENTS de eu.json (Russie, Caucase, Proche-Orient, Afrique, Asie, Amériques…)
// + les morceaux des pays de eu.json situés hors de sa fenêtre (Canaries, Açores, Svalbard, outre-mer français…),
// dans le MÊME repère que ch.json/eu.json (x = (lon·cos 46,8° − minX)·K, y = (maxY − lat)·K).
// eu.json n'est PAS modifié : les briefs existants restent identiques. Le format atlas ne charge ces données
// qu'en « mode monde » (brief `"world": true`, ou pays/région du monde cité dans le brief).
// Résultats versionnés : src/kit/geo/world.json (pays) et src/kit/geo/world-regions.json (régions, fleuves, lacs).
//   node scripts/build-geo-world.mjs <countries-10m.json (world-atlas 2.0.2)> <dossier des geojson Natural Earth 10m>
// Antiméridien : chaque anneau est décalé de ±360° pour rester du côté de la masse principale de son pays
// (la Tchoukotka russe passe à 180-190° E, les Aléoutiennes américaines à 172-180° W → −188/−180).
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [file, dir] = process.argv.slice(2)
if (!file || !dir) throw new Error('usage : node scripts/build-geo-world.mjs <countries-10m.json> <dossier geojson Natural Earth>')
const ch = JSON.parse(readFileSync(new URL('../src/kit/geo/ch.json', import.meta.url), 'utf8'))
const eu = JSON.parse(readFileSync(new URL('../src/kit/geo/eu.json', import.meta.url), 'utf8'))
const { ckx, minX, maxY, K } = ch.proj
const P = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]
const num = (v) => +v.toFixed(1)
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
/** anneau [lon,lat] fermé → « M…Z » simplifié (deux moitiés, cf. build-geo-ch.mjs), '' si trop petit */
function ringPath(ring, tol, minArea) {
  const full = ring.map(P)
  if (full.length > 1 && full[0][0] === full.at(-1)[0] && full[0][1] === full.at(-1)[1]) full.pop()
  if (full.length < 4 || area(full) < minArea) return ''
  full.push(full[0])
  const m = full.length >> 1
  const pts = [...simplify(full.slice(0, m + 1), tol), ...simplify(full.slice(m), tol).slice(1)]
  pts.pop()
  return pts.length > 2 && area(pts) >= minArea ? `M${seg(pts)}Z` : ''
}
const bbOf = (d) => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number); for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]) } return [x0, y0, x1, y1].map(Math.round) }
const meanLon = (r) => r.reduce((s, p) => s + p[0], 0) / r.length
/** décale chaque anneau de ±360° vers la masse principale (anneau le plus long) : antiméridien */
/** un anneau qui saute de +180 à −180 est rendu continu (sinon : trait horizontal sur toute la carte) */
const cont = (r) => { let off = 0; return r.map(([x, y], i) => { if (i) { const d = x + off - r[i - 1][0] - (r[i - 1].off ?? 0); if (d > 180) off -= 360; else if (d < -180) off += 360 } const p = [x + off, y]; r[i].off = off; return p }) }
function unwrap(rings) {
  rings = rings.map(cont)
  if (!rings.length) return rings
  let anchor = meanLon(rings.reduce((a, b) => (b.length > a.length ? b : a)))
  anchor -= 360 * Math.round(anchor / 360) // masse principale ramenée entre −180° et 180°
  return rings.map((r) => { const k = Math.round((meanLon(r) - anchor) / 360); return k ? r.map(([x, y]) => [x - 360 * k, y]) : r })
}

// ---------------------------------------------------------------- pays (world-atlas, Natural Earth 1:10m)
const topo = JSON.parse(readFileSync(file, 'utf8'))
const { scale, translate } = topo.transform
const arcs = topo.arcs.map((a) => { let x = 0, y = 0; return a.map(([dx, dy]) => [(x += dx) * scale[0] + translate[0], (y += dy) * scale[1] + translate[1]]) })
const ring = (idx) => idx.flatMap((i, k) => { const a = i >= 0 ? arcs[i] : [...arcs[~i]].reverse(); return k ? a.slice(1) : a })
const polys = (g) => (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [])

// mêmes règles que build-geo-eu.mjs pour savoir ce que eu.json contient déjà
const EU_RAW = new Set(['France', 'Germany', 'Italy', 'Austria', 'Liechtenstein', 'Switzerland', 'Monaco', 'San Marino', 'Spain', 'Portugal', 'Andorra', 'United Kingdom', 'Ireland', 'Belgium', 'Netherlands', 'Luxembourg', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Kosovo', 'Malta', 'Morocco', 'Algeria', 'Tunisia', 'Norway', 'Sweden', 'Lithuania', 'Latvia', 'Moldova', 'Ukraine', 'Belarus', 'Turkey', 'Finland', 'Estonia', 'Iceland', 'Macedonia', 'Cyprus', 'N. Cyprus'])
const EU_WIN = { lon0: -26, lon1: 36, lat0: 33, lat1: 72 }
const inEuWin = ([lon, lat]) => lon > EU_WIN.lon0 && lon < EU_WIN.lon1 && lat > EU_WIN.lat0 && lat < EU_WIN.lat1
const EU_NAMES = new Set(eu.countries.map((c) => c.name))
// zone « proche » (contours fins) : Russie, Caucase, Proche-Orient, Afrique du Nord, Asie centrale, Sahel, Arabie
const NEAR_WIN = { lon0: -20, lon1: 80, lat0: 10, lat1: 84 }
const SKIP = new Set(['Antarctica', 'Fr. S. Antarctic Lands', 'Heard I. and McDonald Is.'])
const MERGE = { Baikonur: 'Kazakhstan', 'Cyprus U.N. Buffer Zone': 'Cyprus', Macedonia: 'North Macedonia' }
const TOL = { near: 2.2, russia: 3.2, small: 0.9, far: 10, sup: 2.2 }
const MINA = { near: 12, russia: 80, small: 1, far: 1500, sup: 12 }
const SMALL = new Set(['Gibraltar', 'Vatican', 'Jersey', 'Guernsey', 'Isle of Man', 'Åland', 'Faeroe Is.', 'Akrotiri', 'Dhekelia', 'Cyprus U.N. Buffer Zone', 'Lebanon', 'Israel', 'Palestine', 'Bahrain', 'Qatar', 'Kuwait', 'Armenia', 'Hong Kong', 'Macao', 'Singapore'])

const out = []
const stat = {}
for (const g of topo.objects.countries.geometries) {
  const raw = g.properties.name
  if (SKIP.has(raw)) continue
  const name = MERGE[raw] ?? raw
  const all = unwrap(polys(g).flatMap((poly) => poly.map(ring)))
  let rings, tier
  if (EU_RAW.has(raw)) { rings = all.filter((r) => !r.some(inEuWin)); tier = 'sup' } // morceaux hors fenêtre de eu.json
  else {
    rings = all
    const big = all.reduce((a, b) => (b.length > a.length ? b : a), all[0] ?? [])
    const [lo, la] = [meanLon(big), big.reduce((s, p) => s + p[1], 0) / (big.length || 1)]
    tier = name === 'Russia' ? 'russia' : SMALL.has(raw) ? 'small' : lo > NEAR_WIN.lon0 && lo < NEAR_WIN.lon1 && la > NEAR_WIN.lat0 && la < NEAR_WIN.lat1 ? 'near' : 'far'
  }
  // Crimée : anneau à part dans la source (rattaché à la Russie) → Ukraine, frontières reconnues par l'ONU (rés. 68/262)
  const crimea = (r) => r.every(([lo, la]) => lo > 32.3 && lo < 36.8 && la > 44.2 && la < 46.4)
  if (name === 'Russia') { const cr = rings.filter(crimea); rings = rings.filter((r) => !crimea(r)); let dc = ''; for (const r of cr) dc += ringPath(r, TOL.sup, MINA.sup); if (dc) out.push({ name: 'Ukraine', t: 'sup', d: dc }) }
  let d = ''
  for (const r of rings) d += ringPath(r, TOL[tier], MINA[tier])
  if (!d) continue
  if (!EU_RAW.has(raw) && EU_NAMES.has(name) && !MERGE[raw]) throw new Error(`doublon avec eu.json : ${name}`)
  out.push({ name, t: tier, d })
  stat[tier] = (stat[tier] ?? 0) + d.length
}
// fusion des entrées de même nom (Baikonur → Kazakhstan…)
const countries = []
for (const c of out) { const o = countries.find((x) => x.name === c.name && x.t === c.t); if (o) o.d += c.d; else countries.push(c) }
for (const c of countries) c.bb = bbOf(c.d)
const world = { source: 'world-atlas 2.0.2 (Natural Earth 1:10m, domaine public), même projection que ch.json/eu.json ; pays absents de eu.json + morceaux hors fenêtre (t = "sup")', countries }
const wj = JSON.stringify(world)
writeFileSync(new URL('../src/kit/geo/world.json', import.meta.url), wj)
console.log('world.json', Math.round(wj.length / 1024), 'Ko,', countries.length, 'entrées ;', Object.entries(stat).map(([k, v]) => `${k} ${Math.round(v / 1024)} Ko`).join(', '))

// ---------------------------------------------------------------- régions, fleuves, lacs hors de eu-regions.json
const load = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8')).features
const gpolys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [])
const REG_WIN = { lon0: -25, lon1: 45, lat0: 33, lat1: 72 } // fenêtre de build-geo-regions.mjs
const inRegWin = ([lon, lat]) => lon > REG_WIN.lon0 && lon < REG_WIN.lon1 && lat > REG_WIN.lat0 && lat < REG_WIN.lat1
const A3 = { RUS: 'Russia', GEO: 'Georgia', ARM: 'Armenia', AZE: 'Azerbaijan', KAZ: 'Kazakhstan', UZB: 'Uzbekistan', TKM: 'Turkmenistan', KGZ: 'Kyrgyzstan', TJK: 'Tajikistan', AFG: 'Afghanistan', IRN: 'Iran', IRQ: 'Iraq', SYR: 'Syria', LBN: 'Lebanon', ISR: 'Israel', PSX: 'Palestine', PSE: 'Palestine', JOR: 'Jordan', SAU: 'Saudi Arabia', EGY: 'Egypt', LBY: 'Libya', KWT: 'Kuwait' }
const regions = [], per = {}
for (const f of load('ne_10m_admin_1_states_provinces.geojson')) {
  let c = A3[f.properties.adm0_a3]; if (!c || !f.geometry) continue
  if (c === 'Russia' && ['Crimea', 'Sevastopol'].includes(f.properties.name)) c = 'Ukraine' // frontières reconnues par l'ONU (rés. 68/262), comme le pays « Ukraine » de eu.json
  const rs = unwrap(gpolys(f.geometry).flat())
  let d = ''
  for (const r of rs) d += ringPath(r, c === 'Russia' ? 2.2 : 1.4, 4)
  if (!d) continue
  regions.push({ c, n: f.properties.name || f.properties.name_en || '', d }); per[c] = (per[c] || 0) + 1
}
const rivers = []
for (const f of load('ne_10m_rivers_lake_centerlines.geojson')) {
  const sr = f.properties.scalerank
  if (!f.geometry || f.properties.featurecla === 'Lake Centerline') continue
  const lines = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates
  if (sr <= 8 && lines.some((l) => l.some(inRegWin))) continue // déjà dans eu-regions.json
  if (sr > 5) continue
  let d = ''
  for (const l of lines) { const pts = simplify(l.map(P), 2); if (pts.length > 1) d += `M${seg(pts)}` }
  if (d) rivers.push({ n: f.properties.name_en || f.properties.name || '', r: Math.max(1, Math.min(6, Math.round(sr))), d })
}
const lakes = []
for (const f of load('ne_10m_lakes.geojson')) {
  if (!f.geometry || f.properties.scalerank > 4) continue
  const rs = gpolys(f.geometry).flat()
  if (f.properties.scalerank <= 6 && rs.some((r) => r.some(inRegWin))) continue // déjà dans eu-regions.json
  let d = ''
  for (const r of rs) d += ringPath(r, 2, 30)
  if (d) lakes.push({ n: f.properties.name_en || f.properties.name || '', d })
}
const rj = JSON.stringify({ source: 'Natural Earth 1:10m admin-1 (Russie, Caucase, Proche-Orient, Asie centrale, Égypte, Libye), fleuves et lacs hors de eu-regions.json (domaine public)', regions, rivers, lakes })
writeFileSync(new URL('../src/kit/geo/world-regions.json', import.meta.url), rj)
console.log('world-regions.json', (rj.length / 1048576).toFixed(2), 'Mo,', regions.length, 'régions,', rivers.length, 'fleuves,', lakes.length, 'lacs')
console.log(Object.entries(per).map(([k, v]) => `${k}:${v}`).join(' '))
