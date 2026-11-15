// Format « carte » : reel de géographie animé (style « maps ») — une carte qui zoome de scène en scène,
// des régions qui se colorent, des villes épinglées, un chiffre ou un mot en gros. Aujourd'hui : la Suisse
// (cantons et districts, langues), racontée par une mascotte (voix Ming), avec questions à décompte, bruitages et
// révision finale. Brief : voir STYLE.md. Voix et musique : src/formats/carte/audio.py (deux passes, voir build.sh).
import { readFileSync } from 'node:fs'
import { RAINBOW, anim as kanim, fitSize, textWidth } from '../../kit/core.mjs'
import { SAFE, sceneGroup, svgDocument } from '../../kit/document.mjs'
import { briefError, checkCommon, checkText, clamp, drawArt, f, textBlock, words } from '../common.mjs'

export const name = 'carte'
export const description = 'Reel géographique « maps » : carte de la Suisse qui zoome, régions colorées par langue, villes, chiffres'

export const geo = JSON.parse(readFileSync(new URL('../../kit/geo/ch.json', import.meta.url), 'utf8'))
const MAP_W = geo.width, MAP_H = geo.height

// ------------------------------------------------------------------ langues (district par district, langue dominante)
export const LANGS = {
  de: { name: 'Allemand', color: '#E8503A' },
  fr: { name: 'Français', color: '#3B82F6' },
  it: { name: 'Italien', color: '#2EB872' },
  rm: { name: 'Romanche', color: '#FF9F1C' },
  bi: { name: 'Bilingue', color: '#9B6BE0' }, // districts où deux langues se partagent la population (allemand + français)
}
const FR_DISTRICTS = new Set([241, 1001, 1002, 1003, 1004, 1007, 2302, 2303, 2305, 2307, 2308, 2310, 2311, 2312])
const FR_CANTONS = new Set([22, 24, 25, 26])
const IT_DISTRICTS = new Set([1842, 1847])
const RM_DISTRICTS = new Set([1841, 1843, 1850])
const BI_DISTRICTS = new Set([242, 1005])
export const langOf = (d) => RM_DISTRICTS.has(d.id) ? 'rm' : IT_DISTRICTS.has(d.id) || d.canton === 21 ? 'it'
  : BI_DISTRICTS.has(d.id) ? 'bi' : FR_DISTRICTS.has(d.id) || FR_CANTONS.has(d.canton) ? 'fr' : 'de'

export const DISTRICTS = geo.districts.map((d) => ({ ...d, lang: langOf(d) }))
export const CANTONS = new Map(geo.cantons.map((c) => [c.code, c]))

// ------------------------------------------------------------------ villes (lon, lat) → coordonnées de la carte
export const CITIES = {
  'Bruxelles': [4.35, 50.85], 'Anvers': [4.4, 51.22], 'Bruges': [3.22, 51.21], 'Liège': [5.57, 50.63], 'Waterloo': [4.4, 50.68], 'Namur': [4.87, 50.47], 'Gand': [3.72, 51.05], 'Eupen': [6.03, 50.63],
  'Amsterdam': [4.9, 52.37], 'Rotterdam': [4.48, 51.92], 'La Haye': [4.31, 52.08], 'Middelbourg': [3.61, 51.5], 'Leeuwarden': [5.79, 53.2],
  'Lisbonne': [-9.14, 38.72], 'Porto': [-8.61, 41.15], 'Guimarães': [-8.29, 41.44], 'Coimbra': [-8.43, 40.21], 'Faro': [-7.93, 37.02], 'Ceuta': [-5.31, 35.89],
  'Madrid': [-3.7, 40.42], 'Barcelone': [2.17, 41.39], 'Bilbao': [-2.93, 43.26], 'Séville': [-5.98, 37.39], 'Grenade': [-3.6, 37.18], 'Tolède': [-4.02, 39.86], 'Covadonga': [-5.06, 43.31], 'Santiago': [-8.54, 42.88], 'Valence': [-0.38, 39.47],
  'Vienne': [16.37, 48.21], 'Budapest': [19.04, 47.5], 'Prague': [14.42, 50.08], 'Sarajevo': [18.41, 43.86], 'Zagreb': [15.98, 45.81], 'Ljubljana': [14.51, 46.06], 'Trieste': [13.77, 45.65],
  'Paris': [2.35, 48.86], 'Marseille': [5.37, 43.3], 'Strasbourg': [7.75, 48.58], 'Bordeaux': [-0.58, 44.84], 'Brest': [-4.49, 48.39], 'Villers-Cotterêts': [3.09, 49.25], 'Versailles': [2.13, 48.8], 'Toulouse': [1.44, 43.6],
  'Berlin': [13.4, 52.52], 'Munich': [11.58, 48.14], 'Hambourg': [9.99, 53.55], 'Francfort': [8.68, 50.11], 'Cologne': [6.96, 50.94], 'Dresde': [13.74, 51.05],
  'Dublin': [-6.27, 53.35], 'Belfast': [-5.93, 54.6], 'Cork': [-8.47, 51.9], 'Londres': [-0.13, 51.51],
  'Oslo': [10.75, 59.91], 'Stockholm': [18.07, 59.33], 'Copenhague': [12.57, 55.68], 'Calmar': [16.36, 56.66],
  'Turin': [7.69, 45.07], 'Naples': [14.27, 40.85], 'Venise': [12.33, 45.44], 'Florence': [11.26, 43.77], 'Palerme': [13.36, 38.12], 'Gênes': [8.93, 44.41], 'Marsala': [12.44, 37.8],
  'Rome': [12.5, 41.9], 'Milan': [9.19, 45.46], 'Lyon': [4.83, 45.76], 'Genève': [6.14, 46.2], 'Lausanne': [6.63, 46.52], 'Neuchâtel': [6.93, 46.99], 'Fribourg': [7.16, 46.8], 'Morat': [7.11, 46.93], 'Sion': [7.36, 46.23],
  'Delémont': [7.34, 47.36], 'Bienne': [7.25, 47.14], 'Berne': [7.45, 46.95], 'Bâle': [7.59, 47.56], 'Zurich': [8.54, 47.37],
  'Lucerne': [8.31, 47.05], 'Saint-Gall': [9.38, 47.42], 'Coire': [9.53, 46.85], 'Saint-Moritz': [9.84, 46.49], 'Disentis': [8.85, 46.7],
  'Scuol': [10.3, 46.8], 'Poschiavo': [10.06, 46.32], 'Bellinzone': [9.02, 46.19], 'Locarno': [8.8, 46.17], 'Lugano': [8.95, 46.0],
  // ajout extension de la carte (session empires, 13/11/2026) : Europe historique, Russie, Caucase, Proche-Orient, monde
  'Aix-la-Chapelle': [6.08, 50.78], 'Tournai': [3.39, 50.61], 'Soissons': [3.32, 49.38], 'Reims': [4.03, 49.26], 'Poitiers': [0.34, 46.58], 'Orléans': [1.9, 47.9], 'Rouen': [1.1, 49.44], 'Caen': [-0.37, 49.18], 'Tours': [0.69, 47.39], 'Angers': [-0.55, 47.47], 'Nantes': [-1.55, 47.22], 'Lille': [3.06, 50.63],
  'Dijon': [5.04, 47.32], 'Nancy': [6.18, 48.69], 'Metz': [6.18, 49.12], 'Verdun': [5.38, 49.16], 'Avignon': [4.81, 43.95], 'Arles': [4.63, 43.68], 'Narbonne': [3.0, 43.18], 'Nice': [7.27, 43.7], 'Ajaccio': [8.74, 41.92], 'Sèvres': [2.21, 48.82], 'Lunéville': [6.5, 48.59],
  'Trèves': [6.64, 49.75], 'Mayence': [8.27, 50.0], 'Worms': [8.36, 49.63], 'Augsbourg': [10.9, 48.37], 'Nuremberg': [11.08, 49.45], 'Ratisbonne': [12.1, 49.02], 'Leipzig': [12.37, 51.34], 'Iéna': [11.59, 50.93], 'Potsdam': [13.06, 52.39], 'Münster': [7.63, 51.96], 'Osnabrück': [8.05, 52.28], 'Rastatt': [8.2, 48.86], 'Kiel': [10.13, 54.32], 'Lübeck': [10.69, 53.87], 'Brême': [8.8, 53.08],
  'Utrecht': [5.12, 52.09], 'Nimègue': [5.86, 51.84], 'Maastricht': [5.69, 50.85], 'Austerlitz': [16.76, 49.15], 'Wagram': [16.56, 48.3], 'Bratislava': [17.11, 48.15], 'Cracovie': [19.94, 50.06], 'Varsovie': [21.01, 52.23], 'Gdansk': [18.65, 54.35], 'Kaliningrad': [20.51, 54.71], 'Tilsit': [21.88, 55.08], 'Brest-Litovsk': [23.69, 52.1],
  'Riga': [24.11, 56.95], 'Tallinn': [24.75, 59.44], 'Vilnius': [25.28, 54.69], 'Helsinki': [24.94, 60.17], 'Nystad': [21.41, 60.8], 'Visby': [18.29, 57.64], 'Uppsala': [17.64, 59.86], 'Roskilde': [12.08, 55.64], 'Bergen': [5.32, 60.39], 'Trondheim': [10.4, 63.43],
  'York': [-1.08, 53.96], 'Winchester': [-1.31, 51.06], 'Hastings': [0.57, 50.86], 'Édimbourg': [-3.19, 55.95], 'Carlisle': [-2.94, 54.89], 'Newcastle': [-1.61, 54.97],
  'Cordoue': [-4.78, 37.88], 'Gibraltar': [-5.35, 36.14], 'Tordesillas': [-5.0, 41.5], 'Tanger': [-5.81, 35.77], 'Alger': [3.06, 36.75], 'Tunis': [10.18, 36.8], 'Carthage': [10.32, 36.85], 'Syracuse': [15.29, 37.08], 'Ravenne': [12.2, 44.42], 'Pavie': [9.16, 45.19], 'Vérone': [10.99, 45.44], 'Aquilée': [13.37, 45.77], 'Campo Formio': [13.16, 46.03], 'Rapallo': [9.23, 44.35],
  'Belgrade': [20.46, 44.82], 'Skopje': [21.43, 42.0], 'Ohrid': [20.8, 41.12], 'Kosovo Polje': [21.1, 42.66], 'Raguse': [18.09, 42.65], 'Split': [16.44, 43.51], 'Durrës': [19.45, 41.32], 'Mohács': [18.68, 45.99], 'Carlowitz': [19.93, 45.2], 'Passarowitz': [21.18, 44.62],
  'Thessalonique': [22.94, 40.64], 'Athènes': [23.73, 37.98], 'Sparte': [22.43, 37.07], 'Pella': [22.52, 40.76], 'Sofia': [23.32, 42.7], 'Varna': [27.91, 43.21], 'Bucarest': [26.1, 44.43], 'Kaynardja': [26.53, 44.03],
  'Constantinople': [28.98, 41.01], 'Istanbul': [28.98, 41.01], 'Byzance': [28.98, 41.01], 'San Stefano': [28.82, 40.97], 'Andrinople': [26.56, 41.68], 'Nicée': [29.72, 40.43], 'Ankara': [32.85, 39.93], 'Trébizonde': [39.72, 41.0], 'Antioche': [36.16, 36.2], 'Issos': [36.2, 36.84],
  'Kiev': [30.52, 50.45], 'Odessa': [30.73, 46.48], 'Sébastopol': [33.52, 44.6], 'Yalta': [34.16, 44.5], 'Caffa': [35.38, 45.03], 'Azov': [39.42, 47.11], 'Minsk': [27.56, 53.9], 'Smolensk': [32.05, 54.78], 'Novgorod': [31.27, 58.52], 'Staraïa Ladoga': [32.3, 60.0],
  'Moscou': [37.62, 55.75], 'Saint-Pétersbourg': [30.32, 59.94], 'Kazan': [49.11, 55.79], 'Volgograd': [44.5, 48.7], 'Astrakhan': [48.03, 46.35], 'Saraï': [47.43, 46.97], 'Itil': [47.9, 46.6], 'Ekaterinbourg': [60.6, 56.84], 'Elbrouz': [42.44, 43.35],
  'Tbilissi': [44.79, 41.72], 'Erevan': [44.51, 40.18], 'Bakou': [49.87, 40.41], 'Damas': [36.29, 33.51], 'Tyr': [35.2, 33.27], 'Jérusalem': [35.21, 31.77], 'Alexandrie': [29.92, 31.2], 'Le Caire': [31.24, 30.04], 'Suez': [32.55, 29.97], 'Siwa': [25.52, 29.2],
  'Bagdad': [44.37, 33.31], 'Babylone': [44.42, 32.54], 'Gaugamèles': [43.37, 36.57], 'Persépolis': [52.89, 29.93], 'Téhéran': [51.39, 35.69], 'Samarcande': [66.97, 39.65], 'Boukhara': [64.42, 39.77], 'Kaboul': [69.17, 34.53], 'Taxila': [72.83, 33.75], 'Aden': [45.03, 12.79],
  'Karakorum': [102.83, 47.2], 'Oulan-Bator': [106.92, 47.92], 'Pékin': [116.4, 39.9], 'Delhi': [77.21, 28.61], 'Bombay': [72.88, 19.08], 'Calcutta': [88.36, 22.57], 'Goa': [73.83, 15.5], 'Calicut': [75.78, 11.25], 'Pondichéry': [79.83, 11.93],
  'Malacca': [102.25, 2.19], 'Singapour': [103.82, 1.35], 'Batavia': [106.85, -6.2], 'Macao': [113.54, 22.2], 'Hong Kong': [114.17, 22.32], 'Hanoï': [105.85, 21.03], 'Nagasaki': [129.87, 32.75], 'Sydney': [151.21, -33.87],
  'Le Cap': [18.42, -33.92], 'Luanda': [13.23, -8.84], 'Mozambique': [40.74, -15.03], 'Elmina': [-1.35, 5.08], 'Dakar': [-17.44, 14.69], 'Saint-Louis': [-16.5, 16.03], 'Tombouctou': [-3.0, 16.77], 'Brazzaville': [15.28, -4.27], 'Tananarive': [47.52, -18.88],
  'Rio de Janeiro': [-43.17, -22.91], 'Salvador': [-38.5, -12.97], 'Lima': [-77.04, -12.05], 'Cuzco': [-71.97, -13.53], 'Mexico': [-99.13, 19.43], 'La Havane': [-82.37, 23.13], 'New York': [-74.0, 40.71], 'Québec': [-71.21, 46.81], 'Montréal': [-73.57, 45.5], 'Cayenne': [-52.33, 4.94],
}
const { ckx, minX, maxY, K } = geo.proj
export const project = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]

// ------------------------------------------------------------------ thèmes
const THEMES = {
  night: { bg: '#0E1A33', card: '#13244A', chip: '#26407A', land: '#2A3F6B', line: '#9FB3DC', lake: '#0E1A33', ink: '#FFFFFF', halo: '#0E1A33', accent: '#FFC93C', soft: '#B9C6E4', veil: 0.66 },
  paper: { bg: '#FFF6E9', card: '#FFFDF8', chip: '#FFFFFF', land: '#E7DCCB', line: '#9C8B76', lake: '#BFE3F5', ink: '#2B2118', halo: '#FFF6E9', accent: '#E4572E', soft: '#7A6A5C', veil: 0.7 },
}
export const THEME_NAMES = Object.keys(THEMES)
export const SCENE_TYPES = ['hook', 'map', 'final']

// ------------------------------------------------------------------ géométrie
export const bboxOf = (ds) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const d of ds) {
    const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
    for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]) }
  }
  return { x0, y0, x1, y1 }
}
export const ALL = { x0: 0, y0: 0, x1: MAP_W, y1: MAP_H }

/** Éléments à colorer pour une sélection { langs | cantons | districts }. */
export function pick(sel) {
  const out = []
  for (const code of sel.cantons ?? []) { const c = CANTONS.get(code); out.push({ ref: `c${c.id}`, d: c.d, lang: null }) }
  for (const d of DISTRICTS) if ((sel.langs ?? []).includes(d.lang) || (sel.districts ?? []).includes(d.id)) out.push({ ref: `d${d.id}`, d: d.d, lang: d.lang })
  return out
}
export const hasSel = (sel) => (sel.langs?.length ?? 0) + (sel.cantons?.length ?? 0) + (sel.districts?.length ?? 0) > 0

// zone de la carte à l'écran (sous le texte, au-dessus du bas) et caméra qui la cadre
const BOX = { cx: 540, cy: 895, w: 940, h: 580 }
const CARD = { x: 40, y: 575, w: 1000, h: 640 } // fenêtre de la carte : le texte reste au-dessus, les chiffres en dessous
function camFor(bb, pad) {
  const w = (bb.x1 - bb.x0) * (1 + 2 * pad), h = (bb.y1 - bb.y0) * (1 + 2 * pad)
  const s = clamp(Math.min(BOX.w / w, BOX.h / h), 0.5, 5.5), cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2
  return { s, tx: BOX.cx - cx * s, ty: BOX.cy - cy * s }
}
const zoomAround = (c, z) => ({ s: c.s * z, tx: BOX.cx - (BOX.cx - c.tx) * z, ty: BOX.cy - (BOX.cy - c.ty) * z })
const camCss = (c) => `translate(${f(c.tx)}px,${f(c.ty)}px) scale(${f(c.s)})`
const sameCam = (a, b) => a && b && Math.abs(a.s - b.s) < 1e-6 && Math.abs(a.tx - b.tx) < 1e-3 && Math.abs(a.ty - b.ty) < 1e-3

/** Éléments mis en évidence d'une scène : liste de { sel, color?, at?, keep? }. */
const highlightsOf = (sc) => (sc.highlight == null ? [] : Array.isArray(sc.highlight) ? sc.highlight : [sc.highlight])
const focusSel = (sc) => {
  if (sc.focus && sc.focus !== 'all') return sc.focus
  const hs = highlightsOf(sc)
  return { langs: hs.flatMap((h) => h.langs ?? []), cantons: hs.flatMap((h) => h.cantons ?? []), districts: hs.flatMap((h) => h.districts ?? []) }
}
function sceneCam(sc) {
  if (sc.type === 'final' || sc.focus === 'all') return camFor(ALL, 0)
  const sel = focusSel(sc)
  if (!hasSel(sel)) return camFor(ALL, 0)
  return camFor(bboxOf(pick(sel).map((p) => p.d)), sc.pad ?? 0.12)
}

// ------------------------------------------------------------------ narration, questions, rythme
export const ROLE = 'guide' // la voix de la mascotte (Ming, voix inventée : examples/renard-lapin/lib/voix-ref/guide.wav)
const COUNT = 3 // secondes de décompte avant la révélation d'une question
const BOTTOM = { cx: 630, w: 740 } // zone du bas, à droite de la mascotte
const MASCOT = { x: 128, y: 1392, px: 215 }
const isQuiz = (sc) => Array.isArray(sc.choices)
/** `say` : « texte » | [« texte », …] | { ask, answer } (questions) → { pre, post } */
function narration(sc) {
  const say = sc.say
  if (say == null) return { pre: [], post: [] }
  if (typeof say === 'string' || Array.isArray(say)) return { pre: [].concat(say), post: [] }
  return { pre: [].concat(say.ask ?? []), post: [].concat(say.answer ?? []) }
}
/**
 * Minutage d'une scène (en secondes depuis son début) : instant de chaque réplique, décompte et révélation d'une
 * question. Les durées sont celles de la vraie voix (voice.json), estimées au premier passage.
 */
export function plan(sc, voice = {}, role = ROLE) {
  const dur = (text) => voice[`${role}|${text}`]?.dur ?? 0.065 * text.length + 0.4
  const { pre, post } = narration(sc)
  const lines = [], quiz = isQuiz(sc)
  let t = 0.45
  for (const text of pre) { lines.push({ t, text }); t += dur(text) + 0.45 }
  let countdown = null, reveal = null
  if (quiz) { t = Math.max(t, 1.8) + 0.1; countdown = t; reveal = t + COUNT; t = reveal + 0.9 }
  for (const text of post) { lines.push({ t, text }); t += dur(text) + 0.45 }
  const end = quiz ? Math.max(t - 0.45 + 0.7, reveal + 2.4) : lines.length ? t - 0.45 + 0.7 : null
  return { lines, countdown, reveal, end }
}

// ------------------------------------------------------------------ validation
export function validate(b) {
  checkCommon(b, name)
  if (b.map != null && b.map !== 'suisse') throw briefError(b, 'map', '« suisse » est la seule carte disponible')
  if (b.theme && !THEMES[b.theme]) throw briefError(b, 'theme', `${THEME_NAMES.join(' | ')} attendu`)
  if (b.brand?.color && !/^#[0-9A-Fa-f]{6}$/.test(b.brand.color)) throw briefError(b, 'brand.color', '#RRGGBB attendu')
  checkText(b, 'brand.name', b.brand?.name, { required: false, max: 40 })
  const sc = b.scenes
  if (!Array.isArray(sc) || sc.length < 2 || sc.length > 14) throw briefError(b, 'scenes', '2 à 14 scènes')
  if (sc[0].type !== 'hook') throw briefError(b, 'scenes[0]', 'la première scène est une accroche (type « hook »)')
  if (sc.at(-1).type !== 'final') throw briefError(b, `scenes[${sc.length - 1}]`, 'la dernière scène est un carton final (type « final »)')
  const checkSel = (w, sel) => {
    for (const l of sel.langs ?? []) if (!LANGS[l]) throw briefError(b, `${w}.langs`, `${Object.keys(LANGS).join(' | ')} attendu (« ${l} »)`)
    for (const c of sel.cantons ?? []) if (!CANTONS.has(c)) throw briefError(b, `${w}.cantons`, `code de canton inconnu : « ${c} » (GE, VD, GR…)`)
    for (const d of sel.districts ?? []) if (!DISTRICTS.some((x) => x.id === d)) throw briefError(b, `${w}.districts`, `numéro de district inconnu : ${d}`)
  }
  const checkAt = (w, at) => {
    if (at == null || typeof at === 'number') return
    if (!(Number.isInteger(at.line) && at.line >= 0)) throw briefError(b, `${w}.at`, 'secondes, ou { line: n°, d?: décalage } (n° de réplique du narrateur)')
  }
  const checkSay = (w, v) => { for (const t of v) if (typeof t !== 'string' || !t || t.length > 260) throw briefError(b, w, 'texte lu (≤ 260 caractères) attendu') }
  sc.forEach((s, i) => {
    const w = `scenes[${i}]`
    if (!SCENE_TYPES.includes(s.type)) throw briefError(b, `${w}.type`, `${SCENE_TYPES.join(' | ')} attendu`)
    checkText(b, `${w}.text`, s.text, { max: 120 })
    checkText(b, `${w}.sub`, s.sub, { required: false, max: 80 })
    if (s.duration != null && !(s.duration >= 2.5 && s.duration <= 20)) throw briefError(b, `${w}.duration`, 'entre 2,5 et 20 s')
    if (s.focus && s.focus !== 'all') checkSel(`${w}.focus`, s.focus)
    highlightsOf(s).forEach((h, k) => {
      if (!hasSel(h)) throw briefError(b, `${w}.highlight[${k}]`, 'langs, cantons ou districts attendu')
      checkSel(`${w}.highlight[${k}]`, h)
      checkAt(`${w}.highlight[${k}]`, h.at)
      if (h.color != null && !/^#[0-9A-Fa-f]{6}$/.test(h.color)) throw briefError(b, `${w}.highlight[${k}].color`, '#RRGGBB attendu')
    })
    for (const [k, p] of (s.pins ?? []).entries()) {
      const label = typeof p === 'string' ? p : p.label
      if (typeof p === 'string' ? !CITIES[p] : !CITIES[p.city] && !(Array.isArray(p.at) && p.at.length === 2)) throw briefError(b, `${w}.pins[${k}]`, `ville connue (${Object.keys(CITIES).join(', ')}) ou { label, at: [lon, lat] }`)
      checkText(b, `${w}.pins[${k}].label`, label ?? p.city, { max: 24 })
      if (p.side && !['t', 'b', 'l', 'r'].includes(p.side)) throw briefError(b, `${w}.pins[${k}].side`, 't | b | l | r')
    }
    if (s.stat) { checkText(b, `${w}.stat.value`, s.stat.value, { max: 10 }); checkText(b, `${w}.stat.label`, s.stat.label, { required: false, max: 40 }); checkAt(`${w}.stat`, s.stat.at) }
    if (s.word) { checkText(b, `${w}.word.text`, s.word.text, { max: 24 }); checkAt(`${w}.word`, s.word.at) }
    for (const k of ['stat', 'word']) if (s[k]?.lang && !LANGS[s[k].lang]) throw briefError(b, `${w}.${k}.lang`, `${Object.keys(LANGS).join(' | ')} attendu`)
    if (s.flag != null && s.flag !== 'ch') throw briefError(b, `${w}.flag`, '« ch » (drapeau suisse) attendu')
    if (s.words != null) {
      if (!Array.isArray(s.words) || s.words.length < 2 || s.words.length > 4) throw briefError(b, `${w}.words`, '2 à 4 mots')
      s.words.forEach((x, k) => {
        checkText(b, `${w}.words[${k}].text`, x.text, { max: 20 }); checkAt(`${w}.words[${k}]`, x.at)
        if (x.lang && !LANGS[x.lang]) throw briefError(b, `${w}.words[${k}].lang`, `${Object.keys(LANGS).join(' | ')} attendu`)
      })
    }
    if (s.say != null) {
      const say = s.say
      if (typeof say === 'string' || Array.isArray(say)) checkSay(`${w}.say`, [].concat(say))
      else if (typeof say === 'object') { checkSay(`${w}.say.ask`, [].concat(say.ask ?? [])); checkSay(`${w}.say.answer`, [].concat(say.answer ?? [])) }
      else throw briefError(b, `${w}.say`, 'texte, liste de textes ou { ask, answer }')
    }
    if (s.choices != null) {
      if (!Array.isArray(s.choices) || s.choices.length < 2 || s.choices.length > 3) throw briefError(b, `${w}.choices`, '2 ou 3 choix')
      s.choices.forEach((c, k) => checkText(b, `${w}.choices[${k}]`, c, { max: 18 }))
      if (!Number.isInteger(s.answer) || s.answer < 0 || s.answer >= s.choices.length) throw briefError(b, `${w}.answer`, `index du bon choix (0 à ${s.choices.length - 1})`)
      if (s.word && s.stat) throw briefError(b, w, 'une question affiche un mot ou un chiffre à la révélation, pas les deux')
      if (s.type === 'final') throw briefError(b, w, 'le carton final n\'est pas une question')
    }
  })
  return b
}

/** Durée d'une scène : celle de la narration (voix réelles), sinon la lecture (environ 3 mots/s) + le zoom + une pause par région. */
export function sceneDuration(sc, voice = {}, role = ROLE) {
  const p = plan(sc, voice, role)
  if (p.end != null) return Math.max(sc.duration ?? 0, p.end, sc.type === 'final' ? 4 : 3.6)
  if (sc.duration) return sc.duration
  const n = words(sc.text, sc.sub, sc.stat?.label, sc.word?.text)
  if (sc.type === 'final') return clamp(2.4 + n * 0.3, 4, 7)
  if (sc.type === 'hook') return clamp(2 + n * 0.26 + highlightsOf(sc).length * 0.8, 3.4, 6)
  return clamp(1.5 + n * 0.26 + highlightsOf(sc).length * 0.7 + (sc.pins?.length ? 0.6 : 0), 3.6, 8)
}

// ------------------------------------------------------------------ construction
export function build(b, voice = {}) {
  const th = { ...THEMES[b.theme ?? 'night'] }
  if (b.brand?.color) th.accent = b.brand.color
  const anim = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const sc = b.scenes
  const plans = sc.map((s) => plan(s, voice))
  const durs = sc.map((s) => sceneDuration(s, voice))
  const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, v) => a + v, 0))
  const D = durs.reduce((a, v) => a + v, 0)
  const cams = sc.map(sceneCam)
  const MOVE = 1.1 // durée du zoom de caméra entre deux scènes
  const moveOf = (i) => (i === 0 ? 1.8 : sameCam(cams[i], cams[i - 1]) ? 0.3 : MOVE)
  const script = { lines: [], sfx: [] }
  const fx = (t, kind) => script.sfx.push({ t: f(t), kind })

  // ---- caméra : un seul calque « carte » qui glisse et zoome de scène en scène
  const stops = [], pct = (t) => f((t / D) * 100)
  stops.push(`0%{transform:${camCss(zoomAround(cams[0], 1.5))};animation-timing-function:cubic-bezier(.35,0,.15,1)}`)
  stops.push(`${pct(moveOf(0))}%{transform:${camCss(cams[0])}}`)
  for (let i = 1; i < sc.length; i++) {
    if (sameCam(cams[i], cams[i - 1])) continue
    stops.push(`${pct(starts[i])}%{transform:${camCss(cams[i - 1])};animation-timing-function:cubic-bezier(.45,0,.15,1)}`)
    stops.push(`${pct(starts[i] + MOVE)}%{transform:${camCss(cams[i])}}`)
  }
  stops.push(`100%{transform:${camCss(cams.at(-1))}}`)
  const keyframes = [`@keyframes mapcam{${stops.join('')}}`,
    '@keyframes mtalk{0%{opacity:0}50%,100%{opacity:1}}',
    '@keyframes mbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}',
    '@keyframes cdring{from{stroke-dashoffset:0}to{stroke-dashoffset:314}}']
  fx(0.05, 'whoosh')

  // ---- défs : une fois chaque tracé, réutilisé par <use> ; motif rayé pour les districts bilingues
  const defs = [
    `<clipPath id="m-clip"><rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="36"/></clipPath>`,
    `<path id="m-ch" d="${geo.country}"/>`,
    ...[...CANTONS.values()].map((c) => `<path id="m-c${c.id}" d="${c.d}" vector-effect="non-scaling-stroke"/>`),
    ...DISTRICTS.map((d) => `<path id="m-d${d.id}" d="${d.d}" vector-effect="non-scaling-stroke"/>`),
    `<path id="m-lakes" d="${geo.lakes.join('')}"/>`,
    `<pattern id="m-bi" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="${LANGS.de.color}"/><rect width="4.5" height="9" fill="${LANGS.fr.color}"/></pattern>`,
  ].join('\n    ')
  const fillOf = (p, color) => color ?? (p.lang === 'bi' ? 'url(#m-bi)' : p.lang ? LANGS[p.lang].color : th.accent)

  const layers = { highlights: [], pins: [] }, ui = [], surprised = []
  const keyTimes = []
  sc.forEach((s, i) => {
    const t0 = starts[i], dur = durs[i], last = i === sc.length - 1, move = moveOf(i), p = plans[i], quiz = isQuiz(s)
    keyTimes.push(f(t0 + Math.min(dur - 0.3, move + 0.9)))
    if (i > 0 && !sameCam(cams[i], cams[i - 1])) fx(t0 + 0.05, 'whoosh')
    for (const l of p.lines) script.lines.push({ t: f(t0 + l.t), role: ROLE, text: l.text })
    // instant (absolu) d'un élément : secondes depuis le début de la scène, ou { line, d } = début d'une réplique du narrateur
    const at = (spec, dflt) => t0 + (spec == null ? dflt : typeof spec === 'number' ? spec : (p.lines[spec.line]?.t ?? dflt) + (spec.d ?? 0))

    // ---- régions colorées (balayage de gauche à droite), conservées jusqu'à la fin sauf keep:false ; dans une question : à la révélation
    highlightsOf(s).forEach((h, k) => {
      const a = at(h.at, quiz ? p.reveal + 0.1 + k * 0.5 : move + 0.2 + k * 0.9), items = pick(h).sort((u, v) => bboxOf([u.d]).x0 - bboxOf([v.d]).x0)
      const uses = items.map((it, n) => `<use href="#m-${it.ref}" fill="${fillOf(it, h.color)}" class="sc" style="${anim('fadeIn', 0.5, a + (n / items.length) * 0.7, 'ease-out')}"/>`).join('')
      const g = `<g stroke="${th.bg}" stroke-width="1">${uses}</g>`
      layers.highlights.push(h.keep === false ? sceneGroup(t0, dur, g) : g)
      fx(a, 'sparkle')
    })

    // ---- villes épinglées (en taille constante : on annule le zoom de la caméra)
    const pins = (s.pins ?? []).map((pin, n) => {
      const o = typeof pin === 'string' ? { city: pin } : pin
      const [x, y] = project(o.at ?? CITIES[o.city]), label = o.label ?? o.city, side = o.side ?? 't'
      const SZ = 38, off = 24
      const w = textWidth(label, 'en', SZ)
      const tb = textBlock(label, {
        x: side === 'r' ? off : side === 'l' ? -off : 0, anchor: side === 'r' ? 'start' : side === 'l' ? 'end' : 'middle',
        top: side === 't' ? -off - SZ * 0.9 : side === 'b' ? off : -SZ * 0.43, max: SZ, min: SZ, maxLines: 1, width: Math.ceil(w) + 8,
        fill: th.ink, halo: th.halo, halo_k: 0.2,
      })
      const d = at(o.when, (quiz ? p.reveal + 0.3 : move + 0.3) + n * 0.35)
      fx(d, 'pop')
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(1 / cams[i].s)})"><g class="pop" style="${anim('pop', 0.5, d)}"><circle r="12" fill="${th.accent}" stroke="${th.ink}" stroke-width="5"/>${tb.svg}</g></g>`
    })
    if (pins.length) layers.pins.push(sceneGroup(t0, dur, pins.join('')))

    // ---- texte du haut (accroche, titre de scène)
    const role = s.type === 'hook' ? 'data-role="hook"' : last ? 'data-role="final"' : ''
    const big = s.type !== 'map'
    const top = textBlock(s.text, { top: 250, max: s.type === 'hook' ? 104 : last ? 104 : 84, min: 40, maxLines: 3, fill: th.ink, halo: th.halo, attrs: role,
      anim: (n) => anim(big ? 'pop' : 'up', 0.6, t0 + 0.1 + n * 0.12, big ? undefined : 'ease-out') })
    let topSvg = top.svg
    if (s.sub) topSvg += '\n    ' + textBlock(s.sub, { top: 250 + top.height + 18, max: 54, min: 34, maxLines: 2, fill: th.soft, halo: th.halo,
      attrs: last ? role : '', anim: () => anim('up', 0.5, t0 + 0.6, 'ease-out') }).svg

    // ---- bas : choix, mot / chiffre / mots / légende / drapeau, empilés et centrés dans la zone libre sous la carte
    const bottom = []
    const put = (h, render) => bottom.push({ h, render })
    const cx = last ? 540 : BOTTOM.cx, bw = last ? 900 : BOTTOM.w, x0b = cx - bw / 2
    const extras = []
    if (quiz) {
      const n = s.choices.length, w = (bw - (n - 1) * 14) / n, H = 92, ra = t0 + p.reveal
      put(H, (y) => {
        const chips = s.choices.map((c, k) => {
          const x = x0b + k * (w + 14), ok = k === s.answer, sz = fitSize(c, { kind: 'en', max: 44, min: 30, width: w - 30 })
          const label = (fill, halo) => textBlock(c, { x: x + w / 2, top: y + H / 2 - sz * 0.43, max: sz, min: sz, maxLines: 1, width: w - 20, fill, halo, halo_k: 0 }).svg
          return `<g class="pop" style="${anim('pop', 0.5, t0 + 0.9 + k * 0.14)}"><g style="${ok ? '' : anim('dim', 0.4, ra, 'ease-out')}">
        <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${H}" rx="26" fill="${th.chip}" stroke="${th.line}" stroke-opacity=".5" stroke-width="3"/>${label(th.ink, th.chip)}</g>
        ${ok ? `<g class="pop sc" style="${anim('pop', 0.5, ra)}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${H}" rx="26" fill="#2EB872" stroke="#fff" stroke-width="4"/>${label('#fff', '#2EB872')}
        <path d="M ${f(x + w - 38)} ${f(y + 18)} l 9 10 l 18 -20" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>` : ''}</g>`
        }).join('\n      ')
        return chips
      })
      // décompte (anneau + 3, 2, 1) dans le coin de la carte, puis confettis sur la bonne réponse
      const ca = t0 + p.countdown
      extras.push(sceneGroup(ca, COUNT, `<g transform="translate(975 660)"><circle r="50" fill="${th.bg}" opacity=".7"/><circle r="50" fill="none" stroke="${th.line}" stroke-opacity=".4" stroke-width="9"/>
      <circle r="50" fill="none" stroke="${th.accent}" stroke-width="9" stroke-linecap="round" stroke-dasharray="314" transform="rotate(-90)" style="animation:cdring ${COUNT}s linear ${f(ca)}s both"/>
      ${[3, 2, 1].map((c, k) => `<g class="sc" style="animation:win 1s linear ${f(ca + k)}s both">${textBlock(String(c), { x: 0, top: -26, max: 64, min: 64, maxLines: 1, width: 80, fill: th.ink, halo: th.halo, halo_k: 0.1 }).svg}</g>`).join('')}</g>`))
      for (let k = 0; k < COUNT; k++) fx(ca + k, 'tick')
      fx(ra, 'ding'); fx(ra + 0.1, 'tada')
      const chipW = w, cxp = x0b + s.answer * (chipW + 14) + chipW / 2, seed = (i + 1) * 7919
      const rnd = (k) => { const v = Math.sin(seed + k * 12.9898) * 43758.5453; return v - Math.floor(v) }
      extras.push(sceneGroup(ra, 2.2, Array.from({ length: 26 }, (_, k) => {
        const dx = (rnd(k) - 0.5) * 760, up = 150 + rnd(k + 40) * 230, dy = 240 + rnd(k + 80) * 200, rot = (rnd(k + 120) - 0.5) * 900, col = RAINBOW[k % RAINBOW.length], sz = 14 + rnd(k + 160) * 12
        keyframes.push(`@keyframes cf${i}_${k}{0%{transform:translate(0,0) rotate(0);opacity:1}40%{transform:translate(${f(dx * 0.7)}px,${f(-up)}px) rotate(${f(rot * 0.5)}deg);opacity:1}100%{transform:translate(${f(dx)}px,${f(dy)}px) rotate(${f(rot)}deg);opacity:0}}`)
        return `<rect x="${f(cxp - sz / 2)}" y="1285" width="${f(sz)}" height="${f(sz * 0.55)}" rx="3" fill="${col}" class="sc" style="transform-box:fill-box;transform-origin:center;animation:cf${i}_${k} 1.7s cubic-bezier(.2,.7,.3,1) ${f(ra)}s both"/>`
      }).join('')))
      // la mascotte est surprise à la révélation
      surprised.push(sceneGroup(ra - 0.05, 1.5, drawArt('marmot-surprised', MASCOT.x, MASCOT.y, MASCOT.px, { crayon: true })))
    }
    const delay = last ? t0 + 0.9 : at(s.word?.at ?? s.stat?.at, quiz ? p.reveal + 0.5 : p.lines.length ? p.lines.at(-1).t : move + 0.4)
    if (s.flag === 'ch') put(150, (y) => `<g transform="translate(${cx} ${f(y + 75)})"><g class="pop" style="${anim('pop', 0.6, t0 + 0.7)}"><rect x="-75" y="-75" width="150" height="150" rx="18" fill="#E5322D"/><path d="M -12 -48 H 12 V -12 H 48 V 12 H 12 V 48 H -12 V 12 H -48 V -12 H -12 Z" fill="#fff"/></g></g>`)
    if (s.word) {
      const col = s.word.lang ? LANGS[s.word.lang].color : th.accent
      const sz = fitSize(s.word.text, { kind: 'en', max: 112, width: bw - 20 })
      put(sz * 0.95, (y) => `<g class="pop" style="${anim('pop', 0.6, delay)}">${textBlock(s.word.text, { x: cx, top: y, max: sz, min: sz, maxLines: 1, fill: col, halo: th.halo, halo_k: 0.16 }).svg}</g>`)
      fx(delay, 'pop')
    }
    if (s.stat) {
      const col = s.stat.lang ? LANGS[s.stat.lang].color : th.accent
      const vs = fitSize(s.stat.value, { kind: 'en', max: 76, width: 380 }), pw = textWidth(s.stat.value, 'en', vs) + 76, H = 108
      const ls = s.stat.label ? fitSize(s.stat.label, { kind: 'en', max: 46, min: 30, width: bw - 20 - pw - 24 }) : 0
      const lw = s.stat.label ? textWidth(s.stat.label, 'en', ls) : 0
      const x0 = cx - (pw + (lw ? 24 + lw : 0)) / 2, sd = at(s.stat.at, quiz ? p.reveal + 0.6 : p.lines.length ? p.lines[0].t + 1.1 : move + 0.55)
      put(H, (y) => `<g style="${anim('pop', 0.6, sd)}" class="pop"><rect x="${f(x0)}" y="${f(y)}" width="${f(pw)}" height="${H}" rx="54" fill="${col}"/>
      ${textBlock(s.stat.value, { x: x0 + pw / 2, top: y + H / 2 - vs * 0.43, max: vs, min: vs, maxLines: 1, width: pw, fill: '#fff', halo: col, halo_k: 0 }).svg}
      ${lw ? textBlock(s.stat.label, { x: x0 + pw + 24, anchor: 'start', top: y + H / 2 - ls * 0.43, max: ls, min: ls, maxLines: 1, width: lw + 8, fill: th.ink, halo: th.halo, halo_k: 0.14 }).svg : ''}</g>`)
      fx(sd, 'pop')
    }
    if (s.words) { // révision : une pastille par mot, qui apparaît quand le narrateur le dit
      const n = s.words.length, w = (bw - 14) / 2, H = 88, rows = Math.ceil(n / 2)
      put(rows * H + (rows - 1) * 14, (y) => s.words.map((x, k) => {
        const col = x.lang ? LANGS[x.lang].color : th.accent, xx = x0b + (k % 2) * (w + 14), yy = y + Math.floor(k / 2) * (H + 14), sz = fitSize(x.text, { kind: 'en', max: 48, min: 30, width: w - 30 })
        const d = at(x.at, (p.lines.length ? p.lines.at(-1).t : move) + 0.2 + k * 0.85)
        fx(d, 'pop')
        return `<g class="pop" style="${anim('pop', 0.5, d)}"><rect x="${f(xx)}" y="${f(yy)}" width="${f(w)}" height="${H}" rx="44" fill="${col}"/>${textBlock(x.text, { x: xx + w / 2, top: yy + H / 2 - sz * 0.43, max: sz, min: sz, maxLines: 1, width: w - 20, fill: '#fff', halo: col, halo_k: 0 }).svg}</g>`
      }).join('\n      '))
    }
    if (s.legend) {
      const keys = ['de', 'fr', 'it', 'rm'], SZ = 40
      put(2 * 62 + 8, (y) => keys.map((k, n) => {
        const x = x0b + 20 + (n % 2) * (bw / 2), yy = y + Math.floor(n / 2) * 70
        return `<g style="${anim('up', 0.4, t0 + (p.lines.length ? p.lines.at(-1).t : move + 0.4) + n * 0.15, 'ease-out')}"><circle cx="${f(x)}" cy="${f(yy + 31)}" r="20" fill="${LANGS[k].color}"/>${textBlock(LANGS[k].name, { x: x + 36, anchor: 'start', top: yy + 31 - SZ * 0.43, max: SZ, min: SZ, maxLines: 1, width: 280, fill: th.ink, halo: th.halo, halo_k: 0.14 }).svg}</g>`
      }).join(''))
    }
    if (last && b.brand?.name) put(96, (y) => `<g class="pop" style="${anim('pop', 0.6, t0 + 1.2)}"><rect x="290" y="${f(y)}" width="500" height="96" rx="48" fill="${th.accent}"/>
      ${textBlock(b.brand.name, { max: 48, maxLines: 1, width: 440, top: y + 24, fill: '#fff', halo: th.accent, halo_k: 0, attrs: role }).svg}</g>`)
    const gap = 26, zoneTop = last ? 1000 : 1235, zoneBottom = SAFE.bottom - 10
    const total = bottom.reduce((a, q) => a + q.h, 0) + gap * Math.max(0, bottom.length - 1)
    let y = last ? zoneTop : Math.min(zoneTop + 20, (zoneTop + zoneBottom) / 2 - total / 2 + 10)
    const bottomSvg = bottom.map((q) => { const out = q.render(y); y += q.h + gap; return out }).join('\n    ')

    const veil = last ? `<rect x="-200" y="-200" width="1480" height="2320" fill="${th.bg}" opacity="${th.veil}" class="sc" style="${anim('fadeIn', 0.8, t0, 'ease-out')}"/>` : ''
    ui.push(sceneGroup(t0, dur, `${veil}${topSvg}\n    ${bottomSvg}`, { last }))
    ui.push(...extras)
  })

  // ---- la mascotte (marmotte) : bouche calée sur l'enveloppe réelle de la voix, petit rebond permanent
  const talk = script.lines.map((l, k) => {
    const v = voice[`${ROLE}|${l.text}`]
    if (!(v?.env?.length > 1)) return `mtalk 0.18s steps(1,end) ${f(l.t)}s ${Math.max(2, Math.round((0.075 * l.text.length + 0.4) / 0.18) & ~1)} alternate`
    keyframes.push(`@keyframes mt${k}{${v.env.map((e, j) => `${f((j / (v.env.length - 1)) * 100)}%{opacity:${e > 0.3 ? 1 : 0}}`).join('')}}`)
    return `mt${k} ${f(v.dur)}s steps(1,end) ${f(l.t)}s`
  })
  const mascot = `<g class="pop" style="${anim('pop', 0.7, 0.3)}"><g style="animation:mbob 1.7s ease-in-out infinite">
    ${drawArt('marmot', MASCOT.x, MASCOT.y, MASCOT.px, { crayon: true })}
    <g style="opacity:0;animation:${talk.join(',') || 'none'}">${drawArt('marmot-talk', MASCOT.x, MASCOT.y, MASCOT.px, { crayon: true })}</g>
    ${surprised.join('')}</g></g>`

  const body = `  <rect x="-200" y="-200" width="1480" height="2320" fill="${th.bg}"/>
  <rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="36" fill="${th.card}"/>
  <g clip-path="url(#m-clip)"><g style="transform-origin:0 0;animation:mapcam ${f(D)}s linear 0s both">
    <use href="#m-ch" fill="none" stroke="${th.land}" stroke-width="16" stroke-linejoin="round" opacity=".55"/>
    <g fill="${th.land}" stroke="${th.bg}" stroke-width="1">${DISTRICTS.map((d) => `<use href="#m-d${d.id}"/>`).join('')}</g>
    ${layers.highlights.join('\n    ')}
    <g fill="none" stroke="${th.line}" stroke-width="1.6" stroke-opacity=".85" stroke-linejoin="round">${[...CANTONS.values()].map((c) => `<use href="#m-c${c.id}"/>`).join('')}</g>
    <use href="#m-lakes" fill="${th.lake}" stroke="${th.line}" stroke-width=".6" stroke-opacity=".5"/>
    ${layers.pins.join('\n    ')}
  </g></g>
  <rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="36" fill="none" stroke="${th.line}" stroke-opacity=".35" stroke-width="3"/>
  ${ui.join('\n  ')}
  ${mascot}`
  const svg = svgDocument({ title: b.title ?? sc[0].text, format: name, id: b.id, duration: D, defs, keyframes, body })
  script.sfx.sort((a, c) => a.t - c.t)
  return { svg, script: { id: b.id, duration: f(D), lines: script.lines.sort((a, c) => a.t - c.t), sfx: script.sfx }, duration: f(D), keyTimes, info: { lines: script.lines.length, sfx: script.sfx.length } }
}
