// Format « atlas » : reel d'histoire/géographie « sur carte » — fond de carte plein écran (relief de satellite stylisé),
// territoires colorés, petits personnages plats avec bulles et étiquettes, légendes jaunes, rayons de lumière, chiffres
// géants, questions à décompte et révélation, bouton « abonné ». Narré par la voix « guide » (Ming).
// Aujourd'hui : la Suisse et ses langues, dans son contexte européen. Brief : voir STYLE.md.
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { RAINBOW, anim as kanim, fitSize, textWidth } from '../../kit/core.mjs'
import { sceneGroup, svgDocument } from '../../kit/document.mjs'
import { PEOPLE, person } from '../../kit/people.mjs'
import { RAYS_CSS, rays } from '../../kit/rays.mjs'
import { briefError, checkCommon, checkText, clamp, f, textBlock } from '../common.mjs'
import { ART_CSS, ART_H, ART_W, KINDS as ART_KINDS, art as drawArt } from './art.mjs'
import { ALL, CANTONS, CITIES, DISTRICTS, LANGS, bboxOf, geo, hasSel, pick, plan, project, sceneDuration } from '../carte/format.mjs'

export const name = 'atlas'
export const description = 'Reel « sur carte » : relief plein écran, territoires, personnages plats, bulles, questions à décompte, voix du guide'

const eu = JSON.parse(readFileSync(new URL('../../kit/geo/eu.json', import.meta.url), 'utf8'))
const regionsData = existsSync(new URL('../../kit/geo/eu-regions.json', import.meta.url)) ? JSON.parse(readFileSync(new URL('../../kit/geo/eu-regions.json', import.meta.url), 'utf8')) : { regions: [], rivers: [], lakes: [] }
// Mode « monde » (scripts/build-geo-world.mjs) : Russie, Caucase, Proche-Orient, Afrique, Asie, Amériques, et les morceaux
// lointains des pays d'Europe (t = "sup" : Canaries, Svalbard, outre-mer…). Actif si le brief dit `"world": true` ou cite un
// pays / une région absents de eu.json / eu-regions.json. Les pays du monde sont ajoutés APRÈS ceux de eu.json (mêmes
// index a-e0…), et seulement ceux que la caméra voit ou que le brief cite : hors de ce mode, le SVG est inchangé.
const readOpt = (f, dflt) => (existsSync(new URL(f, import.meta.url)) ? JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8')) : dflt)
const worldData = readOpt('../../kit/geo/world.json', { countries: [] })
const worldRegions = readOpt('../../kit/geo/world-regions.json', { regions: [], rivers: [], lakes: [] })
const EUW = { countries: [...eu.countries, ...worldData.countries] }
const riversDetail = readOpt('../../kit/geo/eu-rivers-detail.json', { rivers: [] }) // fleuves secondaires : seulement si le brief dit `"rivers": "detail"`
const REGW = { regions: [...regionsData.regions, ...worldRegions.regions], rivers: [...regionsData.rivers, ...worldRegions.rivers], lakes: [...regionsData.lakes, ...worldRegions.lakes] }
const EU_NAMES = new Set(eu.countries.map((c) => c.name))
/** noms de pays et régions cités par un brief (fond, surbrillances, arts compare/split) */
function geoRefs(b) {
  const cs = [...(b.base?.countries ?? [])], rs = []
  for (const s of b.scenes ?? []) {
    for (const h of s.highlight == null ? [] : [].concat(s.highlight)) { cs.push(...(h.countries ?? [])); rs.push(...(h.regions ?? [])) }
    for (const ar of [].concat(s.art ?? [])) for (const q of [...(ar.items ?? []), ...(ar.parts ?? [])]) { if (q?.country) cs.push(q.country); if (q?.region) rs.push(q.region) }
  }
  return { cs, rs }
}
export function isWorld(b) {
  if (b.world === true) return true
  if (b.world === false) return false
  const { cs, rs } = geoRefs(b)
  return cs.some((c) => !EU_NAMES.has(c)) || rs.some((q) => !regionsData.regions.some((r) => r.c === q.c && r.n === q.n))
}
const DESERT = new Set(['Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'W. Sahara', 'Mauritania', 'Mali', 'Niger', 'Chad', 'Sudan', 'Saudi Arabia', 'Iraq', 'Syria', 'Jordan', 'Kuwait', 'Qatar', 'Bahrain', 'United Arab Emirates', 'Oman', 'Yemen', 'Israel', 'Palestine', 'Iran', 'Afghanistan', 'Turkmenistan', 'Uzbekistan', 'Kazakhstan', 'Pakistan', 'Mongolia', 'Djibouti', 'Eritrea', 'Somalia', 'Somaliland', 'Namibia', 'Botswana', 'Australia'])
/** Image de relief générée par src/kit/geo/relief.py (cache ~/.cache/svgmaker-geo) : même nom des deux côtés ; « -w » = masque terre/mer du mode monde. */
export const reliefFile = (t, world = false) => path.join(homedir(), '.cache', 'svgmaker-geo', `relief-${t.box.join('_')}-${t.px ?? 2400}-${t.z ?? 7}${world ? '-w' : ''}${t.sea ? `-s${t.sea}` : ''}.jpg`)
export const SCENE_TYPES = ['hook', 'map', 'final']
const NAVY = '#0B1F3A', YELLOW = '#FFD83C'
const COUNT = 3
const DEFAULT_VOICE = 'guide' // voix de la série (Ming, voix inventée, sans prénom) ; changeable par brief : { "voice": "narrateur" } (voir examples/renard-lapin/lib/voix-ref/)
const norm = (w) => String(w).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const AFRICA = new Set(['Morocco', 'Algeria', 'Tunisia'])
const BACKDROPS = {
  prairie: `<defs><linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB7E6"/><stop offset=".6" stop-color="#F6D8B5"/></linearGradient></defs>
    <rect x="-10" y="-10" width="1100" height="1940" fill="url(#a-sky)"/>
    <path d="M0 880 L140 700 L260 800 L420 560 L560 780 L700 620 L860 790 L1000 660 L1080 740 V1100 H0 Z" fill="#D5E2F2"/>
    <path d="M0 960 L180 820 L330 920 L520 760 L700 900 L880 800 L1080 930 V1150 H0 Z" fill="#8FA9C7"/>
    <rect y="1010" width="1080" height="200" fill="#4C93B8"/>
    <path d="M-10 1180 Q300 1120 560 1160 T1090 1140 V1930 H-10 Z" fill="#6FAE4D"/>
    <path d="M-10 1270 Q300 1210 560 1250 T1090 1230 V1930 H-10 Z" fill="#5B9B3F"/>`,
}
const up = (s) => s.toLocaleUpperCase('fr')
/** Une réplique du narrateur : « texte lu » (phonétique possible) ou { say: texte lu, show: sous-titre affiché }. */
const sayText = (x) => (typeof x === 'string' ? x : x.say)
/** Écritures lues de travers par la voix (chiffres romains, abréviations…) → texte à prononcer ; le sous-titre garde l'original. */
const PHON = [[/\bVIIIe\b/g, 'huitième'], [/\bXVIIe\b/g, 'dix-septième'], [/\bXIXe\b/g, 'dix-neuvième'], [/\bXIVe\b/g, 'quatorzième'], [/\bXIe\b/g, 'onzième'], [/\bVe\b/g, 'cinquième'], [/\bIer\b/g, 'premier'], [/\bIII\b/g, 'trois'], [/\bII\b/g, 'deux'], [/\b1er\b/g, 'premier'], [/\bav\. J\.-C\./g, 'avant Jésus-Christ'], [/\bSadowa\b/g, 'Sadova']]
/** Nombres en toutes lettres (la voix lit « 660 000 » chiffre par chiffre) : 1815 → « mille huit cent quinze », 47 % → « quarante-sept pour cent ». */
const U20 = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
const T10 = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante']
function below100(n, final) {
  if (n < 20) return U20[n]
  const t = Math.floor(n / 10), u = n % 10
  if (t <= 6) return u === 0 ? T10[t] : u === 1 ? `${T10[t]} et un` : `${T10[t]}-${U20[u]}`
  if (t === 7) return u === 1 ? 'soixante et onze' : `soixante-${U20[10 + u]}`
  if (t === 8) return u === 0 ? (final ? 'quatre-vingts' : 'quatre-vingt') : `quatre-vingt-${U20[u]}`
  return `quatre-vingt-${U20[10 + u]}`
}
function below1000(n, final) {
  const h = Math.floor(n / 100), r = n % 100
  let out = h === 0 ? '' : h === 1 ? 'cent' : `${U20[h]} cent`
  if (h > 1 && r === 0 && final) out += 's'
  if (r) out += (out ? ' ' : '') + below100(r, final)
  return out
}
export function nombreEnLettres(n) {
  if (n === 0) return 'zéro'
  const m = Math.floor(n / 1e6), th = Math.floor((n % 1e6) / 1000), r = n % 1000, parts = []
  if (m) parts.push(m === 1 ? 'un million' : `${below1000(m, false)} millions`)
  if (th) parts.push(th === 1 ? 'mille' : `${below1000(th, false)} mille`)
  if (r) parts.push(below1000(r, true))
  return parts.join(' ')
}
const SEP = '[ \u202f\u00a0]'
const ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100 }
const romanToInt = (r) => [...r].reduce((t, c, i, a) => t + (ROMAN[c] < (ROMAN[a[i + 1]] ?? 0) ? -ROMAN[c] : ROMAN[c]), 0)
/** 1 → premier, 12 → douzième, 21 → vingt et unième : les ordinaux sont dits en lettres. */
export function ordinalEnLettres(n, fem = false) {
  if (n === 1) return fem ? 'première' : 'premier'
  const words = nombreEnLettres(n).replace(/(vingt|cent)s$/, '$1').split(/([ -])/)
  const last = words.pop()
  const o = last === 'cinq' ? 'cinquième' : last === 'neuf' ? 'neuvième' : last === 'un' ? 'unième' : /e$/.test(last) ? last.slice(0, -1) + 'ième' : last + 'ième'
  return words.join('') + o
}
/** Affichage : « VIIIe » → « 8e » (la police colle les I et les V) ; la voix lit déjà les ordinaux en lettres. */
export const disp = (t) => String(t).replace(/\b([IVX]{1,6})(er|ère|re|e|ème)\b/g, (m, r, suf) => `${romanToInt(r)}${/^(er|ère|re)$/.test(suf) ? (suf === 'er' ? 'er' : 're') : 'e'}`)
const ordinals = (t) => t
  .replace(/\b(\d+)(?:ère|re)\b/g, (m, n) => ordinalEnLettres(+n, true))
  .replace(/\b(\d+)(?:er|e|ème|è)\b/g, (m, n) => ordinalEnLettres(+n))
  .replace(/\b([IVX]{1,6})(ère|re)\b/g, (m, r) => ordinalEnLettres(romanToInt(r), true))
  .replace(/\b([IVX]{1,6})(er|e|ème)\b/g, (m, r) => ordinalEnLettres(romanToInt(r)))
const numWords = (t) => ordinals(t)
  .replace(/km²/g, 'kilomètres carrés').replace(/m²/g, 'mètres carrés')
  .replace(new RegExp(`(\\d+(?:${SEP}\\d{3})*),(\\d+)`, 'g'), (m, i, d) => `${nombreEnLettres(+i.replace(new RegExp(SEP, 'g'), ''))} virgule ${[...d].map((c) => U20[+c]).join(' ')}`)
  .replace(new RegExp(`\\d+(?:${SEP}\\d{3})*`, 'g'), (m) => nombreEnLettres(+m.replace(new RegExp(SEP, 'g'), '')))
  .replace(/\s*%/g, ' pour cent')
export const phon = (t) => numWords(PHON.reduce((acc, [re, to]) => acc.replace(re, to), t))
const lev = (a, b) => { const d = Array.from({ length: b.length + 1 }, (_, j) => j); for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t } } return d[b.length] }
const mapSay = (v, fn) => (v == null ? v : typeof v === 'string' || Array.isArray(v) ? [].concat(v).map(fn) : { ...v, ask: v.ask == null ? v.ask : [].concat(v.ask).map(fn), answer: v.answer == null ? v.answer : [].concat(v.answer).map(fn) })
/** Scène avec des répliques en texte simple (ce que lit plan()), + table texte lu → sous-titre. */
const normScene = (s, shows) => ({ ...s, say: mapSay(s.say, (x) => { const raw = sayText(x), spoken = phon(raw), show = disp(typeof x === 'string' ? raw : x.show ?? raw); if (spoken !== show) shows.set(spoken, show); return spoken }) })
const CROWD_OTHER = '#9AA7BD'

// ------------------------------------------------------------------ caméra
const BOX = { cx: 540, cy: 965, w: 980, h: 1100 }
const lonlatBox = ([lon0, lat0, lon1, lat1]) => { const a = project([lon0, lat1]), b = project([lon1, lat0]); return { x0: a[0], y0: a[1], x1: b[0], y1: b[1] } }
const EUROPE = lonlatBox([-7, 41, 18, 53])
function camFor(bb, pad, lo = 0.12) { // lo : zoom arrière maximal (0,12 ≈ 37° de longitude ; le mode monde descend plus bas)
  const w = (bb.x1 - bb.x0) * (1 + 2 * pad), h = (bb.y1 - bb.y0) * (1 + 2 * pad)
  const s = clamp(Math.min(BOX.w / w, BOX.h / h), lo, 7), cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2
  return { s, tx: BOX.cx - cx * s, ty: BOX.cy - cy * s }
}
const camCss = (c) => `translate(${f(c.tx)}px,${f(c.ty)}px) scale(${f(c.s)})`
const sameCam = (a, b) => a && b && Math.abs(a.s - b.s) < 1e-6 && Math.abs(a.tx - b.tx) < 1e-3 && Math.abs(a.ty - b.ty) < 1e-3
const highlightsOf = (sc) => (sc.highlight == null ? [] : Array.isArray(sc.highlight) ? sc.highlight : [sc.highlight])
function sceneCam(sc, lo = 0.12) {
  const fo = sc.focus
  if (fo === 'europe') return camFor(EUROPE, 0.02)
  if (fo && Array.isArray(fo.box)) return camFor(lonlatBox(fo.box), 0, lo)
  if (sc.type === 'final' || fo === 'all') return camFor(ALL, 0.16)
  const hs = highlightsOf(sc)
  const sel = fo ?? { langs: hs.flatMap((h) => h.langs ?? []), cantons: hs.flatMap((h) => h.cantons ?? []), districts: hs.flatMap((h) => h.districts ?? []) }
  if (!hasSel(sel)) return camFor(ALL, 0.16)
  return camFor(bboxOf(pick(sel).map((p) => p.d)), sc.pad ?? 0.15)
}
const where = (at) => (typeof at === 'string' ? project(CITIES[at]) : project(at))

// ------------------------------------------------------------------ validation
export function validate(b) {
  checkCommon(b, name)
  if (b.rivers != null && b.rivers !== 'detail') throw briefError(b, 'rivers', '« detail » (ajoute les fleuves secondaires : Saône, Durance, Aar, Reuss, Arno, Vltava…) ou rien')
  if (b.open != null && !(Array.isArray(b.open.box) && b.open.box.length === 4 && b.open.box.every(Number.isFinite))) throw briefError(b, 'open.box', '[lon0, lat0, lon1, lat1] : vue de la première et de la dernière image (Europe par défaut)')
  for (const [k, t] of (b.terrain ?? []).entries()) if (t.sea != null && !Number.isFinite(t.sea)) throw briefError(b, `terrain[${k}].sea`, 'niveau de la mer en mètres (ex. -120)')
  for (const [k, t] of (b.terrain ?? []).entries()) if (t.fadeIn != null && !(t.scenes && Number.isFinite(t.fadeIn) && t.fadeIn > 0 && t.fadeIn <= 10)) throw briefError(b, `terrain[${k}].fadeIn`, 'durée en s (0 à 10) de l\'apparition de la couche ; exige `scenes`')
  for (const [k, s] of (b.scenes ?? []).entries()) if (s.still != null && typeof s.still !== 'boolean') throw briefError(b, `scenes[${k}].still`, 'true : caméra fixe sur le cadrage (pas de visite)')
  for (const [k, t] of (b.terrain ?? []).entries()) if (t.scenes != null && !(k > 0 && Array.isArray(t.scenes) && t.scenes.length && t.scenes.every((i) => Number.isInteger(i) && i >= 0 && i < (b.scenes ?? []).length))) throw briefError(b, `terrain[${k}].scenes`, 'indices de scènes consécutives où cette couche de relief est visible (pas sur la 1re couche)')
  if (b.suisse != null && typeof b.suisse !== 'boolean') throw briefError(b, 'suisse', 'true ou false (cantons et lacs suisses dessinés par-dessus la carte)')
  if (b.world != null && typeof b.world !== 'boolean') throw briefError(b, 'world', 'true (carte du monde : Russie, Proche-Orient, Afrique, Asie, Amériques) ou false')
  const wm = isWorld(b), G = wm ? EUW : eu, R = wm ? REGW : regionsData
  if (b.voice != null && !/^[a-z]+$/.test(b.voice)) throw briefError(b, 'voice', 'nom d’une voix de voix-ref/ (guide, narrateur, narratrice…)')
  if (b.base != null) { for (const c of b.base.countries ?? []) if (!G.countries.some((x) => x.name === c)) throw briefError(b, 'base.countries', `pays inconnu : « ${c} »`); if (!Array.isArray(b.base.countries) || !b.base.countries.length) throw briefError(b, 'base.countries', 'liste de pays (noms anglais de Natural Earth)') }
  if (b.map != null && b.map !== 'suisse') throw briefError(b, 'map', '« suisse » est la seule carte disponible')
  const sc = b.scenes
  if (!Array.isArray(sc) || sc.length < 2 || sc.length > 16) throw briefError(b, 'scenes', '2 à 16 scènes')
  if (sc[0].type !== 'hook') throw briefError(b, 'scenes[0]', 'la première scène est une accroche (type « hook »)')
  if (sc.at(-1).type !== 'final') throw briefError(b, `scenes[${sc.length - 1}]`, 'la dernière scène est un carton final (type « final »)')
  const checkSel = (w, sel) => {
    for (const l of sel.langs ?? []) if (!LANGS[l]) throw briefError(b, `${w}.langs`, `${Object.keys(LANGS).join(' | ')} attendu (« ${l} »)`)
    for (const c of sel.cantons ?? []) if (!CANTONS.has(c)) throw briefError(b, `${w}.cantons`, `code de canton inconnu : « ${c} » (GE, VD, GR…)`)
    for (const d of sel.districts ?? []) if (!DISTRICTS.some((x) => x.id === d)) throw briefError(b, `${w}.districts`, `numéro de district inconnu : ${d}`)
  }
  let nLines = 0
  const checkAt = (w, at) => {
    if (at == null || typeof at === 'number') return
    if (!(Number.isInteger(at.line) && at.line >= 0)) throw briefError(b, `${w}.at`, 'secondes, ou { line: n°, word?: mot dit, d?: décalage } (n° de réplique du narrateur)')
    if (at.line >= nLines) throw briefError(b, `${w}.at`, `réplique n° ${at.line} inexistante (la scène en a ${nLines})`)
    if (at.word != null && typeof at.word !== 'string') throw briefError(b, `${w}.at.word`, 'un mot (texte)')
  }
  const hex = (w, v) => { if (v != null && !/^#[0-9A-Fa-f]{6}$/.test(v)) throw briefError(b, w, '#RRGGBB attendu') }
  const checkPlace = (w, at) => {
    if (typeof at === 'string' ? !CITIES[at] : !(Array.isArray(at) && at.length === 2 && at.every(Number.isFinite))) throw briefError(b, w, `ville connue (${Object.keys(CITIES).join(', ')}) ou [lon, lat]`)
  }
  sc.forEach((s, i) => {
    for (const [k, ar] of [].concat(s.art ?? []).entries()) if (!ART_KINDS.includes(ar.kind)) throw briefError(b, `scenes[${i}].art[${k}].kind`, `${ART_KINDS.join(' | ')} attendu (« ${ar.kind} »)`)
    for (const [k, ar] of [].concat(s.art ?? []).entries()) if (ar.kind === 'profile') { if (!(Array.isArray(ar.h) && ar.h.length >= 3 && ar.h.every(Number.isFinite))) throw briefError(b, `scenes[${i}].art[${k}].h`, 'au moins 3 altitudes en mètres (de gauche à droite)'); for (const [m, q] of (ar.peaks ?? []).entries()) if (!(Number.isInteger(q.i) && q.i >= 0 && q.i < ar.h.length && q.label)) throw briefError(b, `scenes[${i}].art[${k}].peaks[${m}]`, '{ i: index dans h, label, value? }') }
    if (typeof s.say === 'string' || Array.isArray(s.say)) for (const [k, x] of [].concat(s.say).entries()) { const sp = phon(sayText(x)); if (/\d/.test(sp)) throw briefError(b, `scenes[${i}].say[${k}]`, `chiffre non converti dans le texte dit (écris le nombre en lettres) : « ${sp} »`) }
    const w = `scenes[${i}]`
    nLines = s.say == null ? 0 : typeof s.say === 'string' ? 1 : Array.isArray(s.say) ? s.say.length : [].concat(s.say.ask ?? [], s.say.answer ?? []).length
    if (!SCENE_TYPES.includes(s.type)) throw briefError(b, `${w}.type`, `${SCENE_TYPES.join(' | ')} attendu`)
    checkText(b, `${w}.text`, s.text, { max: 80 }); checkText(b, `${w}.text (en majuscules)`, up(s.text ?? ''), { max: 80 })
    checkText(b, `${w}.sub`, s.sub, { required: false, max: 80 })
    if (s.duration != null && !(s.duration >= 2.5 && s.duration <= 20)) throw briefError(b, `${w}.duration`, 'entre 2,5 et 20 s')
    if (s.focus && s.focus !== 'all' && s.focus !== 'europe') { if (s.focus.box) { if (!(Array.isArray(s.focus.box) && s.focus.box.length === 4 && s.focus.box.every(Number.isFinite))) throw briefError(b, `${w}.focus.box`, '[lon0, lat0, lon1, lat1]') } else checkSel(`${w}.focus`, s.focus) }
    highlightsOf(s).forEach((h, k) => {
      const polys = [...(h.area ? [h.area] : []), ...(h.areas ?? [])] // polygones libres [[lon, lat], …]
      for (const [m, pg] of polys.entries()) if (!(Array.isArray(pg) && pg.length >= 3 && pg.every((q) => Array.isArray(q) && q.length === 2 && q.every(Number.isFinite)))) throw briefError(b, `${w}.highlight[${k}].${h.area && !m ? 'area' : 'areas'}`, 'polygone : au moins 3 points [lon, lat]')
      if (!hasSel(h) && !(h.countries?.length) && !(h.regions?.length) && !polys.length) throw briefError(b, `${w}.highlight[${k}]`, 'langs, cantons, districts, countries, regions ou area attendu')
      for (const q of h.regions ?? []) if (!R.regions.some((r) => r.c === q.c && r.n === q.n)) throw briefError(b, `${w}.highlight[${k}].regions`, `région inconnue : « ${q.c} / ${q.n} » ({ "c": "Belgium", "n": "Luxembourg" } : pays et nom de eu-regions.json ou world-regions.json)`)
      for (const c of h.countries ?? []) if (!G.countries.some((x) => x.name === c)) throw briefError(b, `${w}.highlight[${k}].countries`, `pays inconnu : « ${c} » (${G.countries.slice(0, 12).map((x) => x.name).join(', ')}…, noms anglais de Natural Earth, voir eu.json et world.json)`)
      checkSel(`${w}.highlight[${k}]`, h); checkAt(`${w}.highlight[${k}]`, h.at)
      if (h.color != null && !/^#[0-9A-Fa-f]{6}$/.test(h.color)) throw briefError(b, `${w}.highlight[${k}].color`, '#RRGGBB attendu')
    })
    for (const [k, p] of (s.people ?? []).entries()) {
      const pw = `${w}.people[${k}]`
      if (p.xy == null) checkPlace(`${pw}.at`, p.at); else if (!(Array.isArray(p.xy) && p.xy.length === 2 && p.xy.every(Number.isFinite))) throw briefError(b, `${pw}.xy`, '[x, y] en pixels écran')
      checkAt(pw, p.when); hex(`${pw}.outfit`, p.outfit); hex(`${pw}.skin`, p.skin); hex(`${pw}.hair`, p.hair)
      if (p.rays != null && p.rays !== true) hex(`${pw}.rays`, p.rays)
      if (p.who && !PEOPLE[p.who]) throw briefError(b, `${pw}.who`, `${Object.keys(PEOPLE).join(' | ')} attendu`)
      if (p.mood && !['happy', 'wow', 'sad', 'oops'].includes(p.mood)) throw briefError(b, `${pw}.mood`, 'happy | wow | sad | oops')
      checkText(b, `${pw}.say`, p.say, { required: false, max: 34 })
      if (p.label) { checkText(b, `${pw}.label.title`, p.label.title, { max: 28 }); checkText(b, `${pw}.label.sub`, p.label.sub, { required: false, max: 40 }) }
    }
    for (const [k, p] of (s.pills ?? []).entries()) {
      const pw = `${w}.pills[${k}]`
      checkPlace(`${pw}.at`, p.at); checkAt(pw, p.when)
      if (p.stack) { if (!Array.isArray(p.stack) || p.stack.length < 1 || p.stack.length > 4) throw briefError(b, `${pw}.stack`, '1 à 4 pastilles'); p.stack.forEach((x, n) => { checkText(b, `${pw}.stack[${n}].text`, x.text, { max: 20 }); if (x.lang && !LANGS[x.lang]) throw briefError(b, `${pw}.stack[${n}].lang`, Object.keys(LANGS).join(' | ')) }) }
      else checkText(b, `${pw}.title`, p.title, { max: 28 })
      checkText(b, `${pw}.sub`, p.sub, { required: false, max: 40 })
      if (p.side && !['t', 'b', 'l', 'r'].includes(p.side)) throw briefError(b, `${pw}.side`, 't | b | l | r')
    }
    if (s.line) { if (!Array.isArray(s.line.points) || s.line.points.length < 2) throw briefError(b, `${w}.line.points`, '2 points minimum (ville ou [lon, lat])'); s.line.points.forEach((p, k) => checkPlace(`${w}.line.points[${k}]`, p)); if (s.line.parts != null) { if (!Array.isArray(s.line.parts)) throw briefError(b, `${w}.line.parts`, 'liste de tracés : [[ville | [lon, lat], …], …]'); s.line.parts.forEach((pt, m) => { if (!Array.isArray(pt) || pt.length < 2) throw briefError(b, `${w}.line.parts[${m}]`, '2 points minimum'); pt.forEach((p, k) => checkPlace(`${w}.line.parts[${m}][${k}]`, p)) }) } checkAt(`${w}.line`, s.line.at); if (s.line.label) checkText(b, `${w}.line.label`, s.line.label, { max: 40 }); for (const k of ['width', 'draw']) if (s.line[k] != null && !(Number.isFinite(s.line[k]) && s.line[k] > 0 && s.line[k] <= 30)) throw briefError(b, `${w}.line.${k}`, 'nombre > 0 (width : épaisseur en px, 8 par défaut ; draw : durée du tracé en s, 1,6 par défaut)') }
    for (const [k, l] of (s.labels ?? []).entries()) { checkPlace(`${w}.labels[${k}].at`, l.at); checkText(b, `${w}.labels[${k}].text`, l.text, { max: 30 }); checkAt(`${w}.labels[${k}]`, l.when); checkAt(`${w}.labels[${k}].until`, l.until) }
    if (s.crowd) {
      if (!Array.isArray(s.crowd.groups) || s.crowd.groups.length < 1 || s.crowd.groups.length > 6) throw briefError(b, `${w}.crowd.groups`, '1 à 6 groupes { lang | color, n, label?, at? }')
      const tot = s.crowd.groups.reduce((a, g) => a + g.n, 0)
      if (!(tot >= 1 && tot <= 100)) throw briefError(b, `${w}.crowd.groups`, `100 personnes au plus (total ${tot})`)
      s.crowd.groups.forEach((g, k) => { if (!Number.isInteger(g.n) || g.n < 1) throw briefError(b, `${w}.crowd.groups[${k}].n`, 'entier ≥ 1'); if (g.lang && !LANGS[g.lang]) throw briefError(b, `${w}.crowd.groups[${k}].lang`, Object.keys(LANGS).join(' | ')); checkText(b, `${w}.crowd.groups[${k}].label`, g.label, { required: false, max: 28 }); checkAt(`${w}.crowd.groups[${k}]`, g.at) })
    }
    if (s.backdrop != null && !BACKDROPS[s.backdrop]) throw briefError(b, `${w}.backdrop`, `${Object.keys(BACKDROPS).join(' | ')} attendu`)
    if (s.note != null) checkText(b, `${w}.note`, s.note, { max: 60 })
    if (s.year != null) checkText(b, `${w}.year`, String(s.year), { max: 26 })
    for (const [k, mv] of (s.moves ?? []).entries()) {
      const mw = `${w}.moves[${k}]`
      checkPlace(`${mw}.from`, mv.from); checkPlace(`${mw}.to`, mv.to); checkAt(mw, mv.at)
      if (JSON.stringify(mv.from) === JSON.stringify(mv.to)) throw briefError(b, mw, 'départ et arrivée identiques')
      if (mv.n != null && !(Number.isInteger(mv.n) && mv.n >= 0 && mv.n <= 8)) throw briefError(b, `${mw}.n`, 'entier de 0 à 8 (silhouettes ; 0 = flèche seule)')
      if (mv.color != null && !/^#[0-9A-Fa-f]{6}$/.test(mv.color)) throw briefError(b, `${mw}.color`, '#RRGGBB attendu')
      if (mv.label) checkText(b, `${mw}.label`, mv.label, { max: 28 })
    }
    if (s.big) { checkText(b, `${w}.big.value`, s.big.value, { max: 12 }); checkText(b, `${w}.big.sub`, s.big.sub, { required: false, max: 50 }); checkAt(`${w}.big`, s.big.at) }
    if (s.say != null) {
      const v = s.say, list = typeof v === 'string' || Array.isArray(v) ? [].concat(v) : [].concat(v.ask ?? [], v.answer ?? [])
      for (const t of list) {
        if (!(typeof t === 'string' ? t : t?.say) || sayText(t).length > 260) throw briefError(b, `${w}.say`, 'texte lu (≤ 260 caractères) ou { say, show } attendu')
        if (typeof t !== 'string' && t.show != null) checkText(b, `${w}.say (sous-titre)`, t.show, { max: 260 })
        else if (typeof t === 'string') checkText(b, `${w}.say (sous-titre)`, t, { max: 260 })
      }
    }
    if (s.choices != null) {
      if (!Array.isArray(s.choices) || s.choices.length < 2 || s.choices.length > 3) throw briefError(b, `${w}.choices`, '2 ou 3 choix')
      s.choices.forEach((c, k) => checkText(b, `${w}.choices[${k}]`, c, { max: 22 }))
      if (!Number.isInteger(s.answer) || s.answer < 0 || s.answer >= s.choices.length) throw briefError(b, `${w}.answer`, `index du bon choix (0 à ${s.choices.length - 1})`)
      if (s.type === 'final') throw briefError(b, w, 'le carton final n\'est pas une question')
    }
  })
  return b
}

// ------------------------------------------------------------------ construction
let uid = 0
export function build(b, voice = {}) {
  uid = 0
  const world = isWorld(b), G = world ? EUW : eu, R = world ? REGW : regionsData
  const swiss = b.suisse ?? !world // cantons, districts et lacs suisses par-dessus la carte (masqués par défaut en mode monde)
  const NARR = b.voice ?? DEFAULT_VOICE
  const anim = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const shows = new Map()
  const sc = b.scenes.map((s) => normScene(s, shows))
  const plans = sc.map((s) => plan(s, voice, NARR))
  const durs = sc.map((s) => sceneDuration(s, voice, NARR))
  const LOOPBACK = 1.6
  durs[durs.length - 1] += LOOPBACK // tenue finale : le dernier plan reste affiché après la voix, puis la caméra revient à la vue du début (lecture en boucle)
  const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, v) => a + v, 0))
  const D = durs.reduce((a, v) => a + v, 0)
  const cams = sc.map((s) => sceneCam(s, world ? 0.004 : 0.12))
  // vue d'ouverture = vue de fin (boucle) : l'Europe par défaut, ou `open.box` (cadrage serré dès la première image)
  const openCam = b.open?.box ? camFor(lonlatBox(b.open.box), 0, world ? 0.004 : 0.12) : camFor(EUROPE, 0.02)
  const MOVE = 1.6
  const moveOf = (i) => (i === 0 ? 2.8 : sameCam(cams[i], cams[i - 1]) ? 0.3 : MOVE)
  const script = { lines: [], sfx: [], music: 'pad' }
  const fx = (t, kind) => script.sfx.push({ t: f(t), kind })
  const keyframes = [RAYS_CSS, ...ART_CSS, '@keyframes cdring{from{stroke-dashoffset:0}to{stroke-dashoffset:289}}',
    `@keyframes endfade{0%,${((D - 1.5) / D * 100).toFixed(3)}%{opacity:1}${((D - 0.7) / D * 100).toFixed(3)}%,100%{opacity:0}}`,
    '@keyframes drawline{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}',
    '@keyframes nudge{0%{transform:translate(110px,150px)}100%{transform:translate(8px,12px)}}',
    '@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}', '@keyframes bobf{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '@keyframes ping{0%{opacity:0;transform:scale(1)}12%{opacity:.9}100%{opacity:0;transform:scale(4.2)}}',
    '@keyframes walkL{from{transform:translateX(-170px)}to{transform:translateX(0)}}', '@keyframes walkR{from{transform:translateX(170px)}to{transform:translateX(0)}}',
    '@keyframes flash{0%{opacity:0}18%{opacity:1}45%{opacity:.25}65%{opacity:1}100%{opacity:0}}', '@keyframes breathe{0%,100%{opacity:1}50%{opacity:.9}}', '@keyframes marchO{0%{opacity:0}12%{opacity:1}82%{opacity:1}100%{opacity:0}}',
    '@keyframes press{0%,100%{transform:scale(1)}40%{transform:scale(.93)}70%{transform:scale(1.05)}}']

  // ---- défs : tracés uniques, relief (bruit éclairé), halo des côtes
  // mode monde : on n'embarque que les pays du monde vus par une caméra (marge d'une demi-vue) ou cités par le brief
  const camViews = [openCam, ...cams].map((c) => { const w = 1080 / c.s, h = 1920 / c.s; return { x0: -c.tx / c.s - w / 2, x1: (1080 - c.tx) / c.s + w / 2, y0: -c.ty / c.s - h / 2, y1: (1920 - c.ty) / c.s + h / 2 } })
  const cited = new Set(geoRefs(b).cs)
  const wanted = (c) => cited.has(c.name) || (c.bb && camViews.some((v) => c.bb[2] >= v.x0 && c.bb[0] <= v.x1 && c.bb[3] >= v.y0 && c.bb[1] <= v.y1))
  const W = G.countries.map((c, n) => ({ id: `a-e${n}`, d: c.d, name: c.name })).filter((c, n) => n < eu.countries.length || wanted(G.countries[n]))
  const eb0 = bboxOf(W.map((c) => c.d)), m = 300
  const eb = world ? camViews.reduce((a, v) => ({ x0: Math.min(a.x0, v.x0), y0: Math.min(a.y0, v.y0), x1: Math.max(a.x1, v.x1), y1: Math.max(a.y1, v.y1) }), eb0) : eb0
  const rect = `x="${f(eb.x0 - m)}" y="${f(eb.y0 - m)}" width="${f(eb.x1 - eb.x0 + 2 * m)}" height="${f(eb.y1 - eb.y0 + 2 * m)}"`
  const alps = [[5.8, 43.6], [6.9, 44.9], [7.4, 46.0], [9.0, 46.4], [10.6, 46.6], [12.5, 46.6], [14.2, 46.8]].map(project)
  const alpsD = 'M' + alps.map((p) => p.map(f).join(' ')).join('L')
  const defs = [
    '<linearGradient id="a-sea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2C7F86"/><stop offset="1" stop-color="#1B5663"/></linearGradient>',
    '<filter id="a-shade" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.011 0.011" numOctaves="6" seed="11" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.3" result="h"/><feDiffuseLighting in="h" surfaceScale="7" diffuseConstant="1" lighting-color="#fff" result="lit"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting><feColorMatrix in="lit" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.09  0 0 0 0 0.03  -2.1 0 0 0 1.8"/></filter>',
    '<linearGradient id="a-vt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1F3A" stop-opacity=".78"/><stop offset=".6" stop-color="#0B1F3A" stop-opacity=".45"/><stop offset="1" stop-color="#0B1F3A" stop-opacity="0"/></linearGradient><linearGradient id="a-vb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0B1F3A" stop-opacity=".6"/><stop offset="1" stop-color="#0B1F3A" stop-opacity="0"/></linearGradient>',
    '<filter id="a-feather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="60"/></filter>',
    '<filter id="a-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>',
    '<filter id="a-blur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="60"/></filter>',
    ...W.map((c) => `<path id="${c.id}" d="${c.d}"/>`),
    `<clipPath id="a-card"><rect width="${ART_W}" height="${ART_H}" rx="44"/></clipPath>`,
    `<clipPath id="a-land">${W.map((c) => `<use href="#${c.id}"/>`).join('')}</clipPath>`,
    `<path id="a-ch" d="${geo.country}"/>`,
    ...[...CANTONS.values()].map((c) => `<path id="m-c${c.id}" d="${c.d}" vector-effect="non-scaling-stroke"/>`),
    ...DISTRICTS.map((d) => `<path id="m-d${d.id}" d="${d.d}" vector-effect="non-scaling-stroke"/>`),
    `<path id="a-lakes" d="${geo.lakes.join('')}"/>`,
    `<pattern id="m-bi" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="${LANGS.de.color}"/><rect width="4.5" height="9" fill="${LANGS.fr.color}"/></pattern>`,
  ].join('\n    ')
  const fillOf = (p, color) => color ?? (p.lang === 'bi' ? 'url(#m-bi)' : p.lang ? LANGS[p.lang].color : YELLOW)

  // ---- petites pièces d'interface (tailles en pixels écran)
  const pill = ({ title, sub, x = 0, y = 0, fill = NAVY, stroke = '#fff', tsize = 36, ssize = 32, textFill = '#fff', center = true }) => {
    const w = Math.max(textWidth(title, 'en', tsize), sub ? textWidth(sub, 'en', ssize) : 0) + 44, h = sub ? 94 : 60
    const x0 = center ? x - w / 2 : x, tx = x0 + w / 2
    const t = textBlock(title, { x: tx, top: y + (sub ? 30 : h / 2) - tsize * 0.43, max: tsize, min: tsize, maxLines: 1, width: Math.ceil(w), fill: textFill, halo: fill, halo_k: 0 })
    const s2 = sub ? textBlock(sub, { x: tx, top: y + 70 - ssize * 0.43, max: ssize, min: ssize, maxLines: 1, width: Math.ceil(w), fill: '#C9D6EE', halo: fill, halo_k: 0 }).svg : ''
    return { w, h, x0, svg: `<rect x="${f(x0)}" y="${f(y)}" width="${f(w)}" height="${h}" rx="${sub ? 18 : 30}" fill="${fill}" fill-opacity=".88" stroke="${stroke}" stroke-width="3"/>${t.svg}${s2}` }
  }

  const layers = { highlights: [], entities: [], lines: [] }, ui = [], regionDefs = new Map()
  const keyTimes = [], sceneBoxes = []
  sc.forEach((s, i) => {
    const t0 = starts[i], dur = durs[i] - (i === sc.length - 1 ? 1.0 : 0), last = i === sc.length - 1, move = moveOf(i), p = plans[i], quiz = Array.isArray(s.choices), cam = cams[i]
    keyTimes.push(f(t0 + Math.min(dur - 0.3, move + 0.9)))
    if (i > 0 && !sameCam(cams[i], cams[i - 1])) fx(t0 + 0.05, 'whoosh')
    for (const l of p.lines) script.lines.push({ t: f(t0 + l.t), role: NARR, text: l.text })
    // instant d'un mot de la narration (Whisper, voice.json) : { line, word } ; sans mesure (1re passe) : début de la réplique
    const wordT = (spec) => {
      const ln = p.lines[spec.line]
      if (!ln || !spec.word) return 0
      const entry = voice[`${NARR}|${ln.text}`], ws = entry?.words, target = norm(spec.word)
      if (ws) {
        const k = ws.findIndex((x) => { const w = norm(x.w); return w.startsWith(target) || (w.length >= 3 && target.startsWith(w)) || lev(w, target) <= (target.length >= 7 ? 2 : 1) })
        if (k >= 0) return ws[k].t
      }
      // repli : position du mot dans le texte lu, proportionnelle à la durée de la réplique (jamais « au début » par défaut)
      const text = norm(ln.text), pos = text.indexOf(target)
      return pos >= 0 ? (pos / text.length) * (entry?.dur ?? 0.065 * ln.text.length + 0.4) : 0
    }
    const atRaw = (spec, dflt) => t0 + (spec == null ? dflt : typeof spec === 'number' ? spec : (p.lines[spec.line]?.t ?? dflt) + wordT(spec) + (spec.d ?? 0))
    // fenêtres des animations plein cadre : ce qui devait apparaître sur la carte pendant l'une d'elles est repoussé juste après (la carte est cachée)
    const artWins = [].concat(s.art ?? []).map((ar, ai) => { const a0 = atRaw(ar.at, move + 0.4 + ai * 0.5); return [a0, Math.min(a0 + (ar.dur ?? 5.5), t0 + dur - 0.2)] })
    const at = (spec, dflt) => { let d = atRaw(spec, dflt); for (const [w0, w1] of artWins) if (d >= w0 - 0.05 && d < w1 && w1 + 0.25 < t0 + dur - 0.6) d = w1 + 0.25; return d }
    const screenEnts = []
    const afterMove = quiz ? p.reveal + 0.3 : move + 0.2

    // ---- territoires colorés (balayage de gauche à droite)
    highlightsOf(s).forEach((h, k) => {
      const a = at(h.at, (quiz ? p.reveal + 0.1 : move + 0.2) + k * 0.9)
      const regItems = (h.regions ?? []).map((q) => { const n = R.regions.findIndex((r) => r.c === q.c && r.n === q.n), id = `a-rg${n}`; regionDefs.set(id, `<path id="${id}" d="${R.regions[n].d}"/>`); return { href: `#${id}`, d: R.regions[n].d, lang: null } })
      const areaItems = [...(h.area ? [h.area] : []), ...(h.areas ?? [])].map((pg) => { const d = 'M' + pg.map((q) => project(q).map(f).join(' ')).join('L') + 'Z', id = `a-ar${regionDefs.size}`; regionDefs.set(id, `<path id="${id}" d="${d}"/>`); return { href: `#${id}`, d, lang: null, clip: true } }) // polygone libre : découpé sur les terres (pas de mer coloriée)
      const items = [...regItems, ...areaItems, ...(hasSel(h) ? pick(h).map((i) => ({ ...i, href: `#m-${i.ref}` })) : []), ...(h.countries ?? []).flatMap((nm) => G.countries.map((c, n) => (c.name === nm ? { href: `#a-e${n}`, d: c.d, lang: null } : null)).filter(Boolean))]
        .sort((u, v) => bboxOf([u.d]).x0 - bboxOf([v.d]).x0)
      const uses = items.map((it, n) => `<use href="${it.href}"${it.clip ? ' clip-path="url(#a-land)"' : ''} fill="${fillOf(it, h.color)}" class="sc" style="${anim('fadeIn', 0.6, a + (n / items.length) * 0.9, 'ease-out')}"/>`).join('')
      const flash = `<g fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round">${items.map((it) => `<use href="${it.href}"${it.clip ? ' clip-path="url(#a-land)"' : ''} vector-effect="non-scaling-stroke" class="sc" style="animation:flash 1.5s ease-out ${f(a + 0.5)}s both"/>`).join('')}</g>`
      const g = `<g style="animation:breathe 2.8s ease-in-out ${f(a + 1.2)}s infinite"><g fill-opacity=".88" stroke="#fff" stroke-opacity=".25" stroke-width="1">${uses}</g></g>${flash}`
      layers.highlights.push(h.keep === false ? sceneGroup(t0, dur, g) : g)
      fx(a, 'sparkle')
    })

    // ---- trait (ex. le « Röstigraben ») qui se dessine sur la carte
    let lineLabel = null
    if (s.line) {
      const pts = s.line.points.map(where), d = [s.line.points, ...(s.line.parts ?? [])].map((q) => 'M' + q.map(where).map(([x, y]) => `${f(x)} ${f(y)}`).join('L')).join(''), a = at(s.line.at, afterMove), col = s.line.color ?? YELLOW
      const lw = s.line.width ?? 8, dr = s.line.draw ?? 1.6 // épaisseur du trait (liseré navy = +7) et durée du tracé (s)
      const mid = pts[Math.floor(pts.length / 2)]
      layers.lines.push(sceneGroup(t0, dur, `<path d="${d}" pathLength="1" fill="none" stroke="${NAVY}" stroke-width="${f((lw + 7) / cam.s)}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" style="animation:drawline ${f(dr)}s ease-out ${f(a)}s both"/>
        <path d="${d}" pathLength="1" fill="none" stroke="${col}" stroke-width="${f(lw / cam.s)}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" style="animation:drawline ${f(dr)}s ease-out ${f(a)}s both"/>`))
      fx(a, 'whoosh')
      if (s.line.label) lineLabel = { pl: pill({ title: s.line.label, x: 0, y: -30, tsize: 34, stroke: col }), mid, a }
    }

    // ---- balise : halo pulsé permanent sur un lieu (ex. le Luxembourg), pour situer le sujet
    for (const bc of [].concat(s.beacon ?? [])) {
      const [bx, by] = where(bc.at), ba = at(bc.when, move + 0.2), col = bc.color ?? YELLOW
      layers.lines.push(sceneGroup(t0, dur, `<g transform="translate(${f(bx)} ${f(by)}) scale(${f(1 / cam.s)})"><g class="sc" style="${anim('fadeIn', 0.4, ba, 'ease-out')}"><circle r="34" fill="${col}" fill-opacity=".28" style="transform-box:fill-box;transform-origin:center;animation:breathe 1.8s ease-in-out ${f(ba)}s infinite"/><circle r="30" fill="none" stroke="${col}" stroke-width="6" style="transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out ${f(ba + 0.2)}s infinite backwards"/><circle r="30" fill="none" stroke="${col}" stroke-width="6" style="transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out ${f(ba + 1.3)}s infinite backwards"/><circle r="11" fill="${col}" stroke="#fff" stroke-width="4"/></g></g>`))
    }

    // ---- étiquettes sur la carte (pastille sombre, comme « Orléans » / « Reims »)
    const ents = [], items = []
    const ring = (d) => `<circle r="9" fill="none" stroke="#fff" stroke-width="3" style="transform-box:fill-box;transform-origin:center;animation:ping 1.8s ease-out ${f(d + 0.4)}s infinite backwards"/>`
    for (const [n, pl] of (s.pills ?? []).entries()) {
      const [x, y] = where(pl.at), d = at(pl.when, afterMove + n * 0.4), side = pl.side ?? 'b'
      let lab, rel
      if (pl.stack) { // pastilles colorées empilées (« CHEVAL / ARMURE / UNE CHANCE »)
        lab = pl.stack.map((it, k) => {
          const col = it.color ?? (it.lang ? LANGS[it.lang].color : NAVY), q = pill({ title: up(it.text), x: 0, y: 28 + k * 70, fill: col, stroke: '#fff', tsize: 36 }), dd = d + k * 0.8
          fx(dd, 'pop')
          return `<g class="pop" style="${anim('pop', 0.45, dd)}">${q.svg}</g>`
        }).join('')
        rel = { x0: -190, x1: 190, y0: 20, y1: 28 + pl.stack.length * 70 }
      } else {
        const w0 = pill({ title: pl.title, sub: pl.sub }).w, hh = pl.sub ? 94 : 60
        lab = (side === 'r' ? pill({ title: pl.title, sub: pl.sub, x: 24, y: -hh / 2, center: false })
          : side === 'l' ? pill({ title: pl.title, sub: pl.sub, x: -24 - w0, y: -hh / 2, center: false })
            : pill({ title: pl.title, sub: pl.sub, x: 0, y: side === 't' ? -34 - hh : 26 })).svg
        rel = side === 'r' ? { x0: 24, x1: 24 + w0, y0: -hh / 2, y1: hh / 2 } : side === 'l' ? { x0: -24 - w0, x1: -24, y0: -hh / 2, y1: hh / 2 }
          : side === 't' ? { x0: -w0 / 2, x1: w0 / 2, y0: -34 - hh, y1: -34 } : { x0: -w0 / 2, x1: w0 / 2, y0: 26, y1: 26 + hh }
        fx(d, 'pop')
      }
      const cx = (rel.x0 + rel.x1) / 2, cy = (rel.y0 + rel.y1) / 2
      items.push({ kind: 'pill', x, y, rel, html: (ox, oy) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(1 / cam.s)})"><g class="pop" style="${anim('pop', 0.5, d)}">${ox || oy ? `<line x1="0" y1="0" x2="${f(cx + ox)}" y2="${f(cy + oy)}" stroke="#fff" stroke-width="3" stroke-opacity=".8"/>` : ''}${ring(d)}<circle r="9" fill="#fff" stroke="${NAVY}" stroke-width="3"/><g transform="translate(${f(ox)} ${f(oy)})">${lab}</g></g></g>` })
    }

    // ---- déplacements : flèche courbe qui se dessine + petites silhouettes qui marchent (invasions, migrations)
    const sil = (fill) => `<circle cx="0" cy="-20" r="10" fill="${fill}" stroke="${NAVY}" stroke-width="2.5"/><path d="M -12 -8 Q -12 -12 -7 -12 H 7 Q 12 -12 12 -8 V 14 H 5 V 30 H -5 V 14 H -12 Z" fill="${fill}" stroke="${NAVY}" stroke-width="2.5" stroke-linejoin="round"/>`
    for (const [n, mv] of (s.moves ?? []).entries()) {
      const [x1, y1] = where(mv.from), [x2, y2] = where(mv.to), a = at(mv.at, afterMove + n * 0.6), dd = mv.dur ?? 2.6, col = mv.color ?? '#FFFFFF', cnt = mv.n ?? 5
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, cx = mx - (y2 - y1) * 0.16, cy = my + (x2 - x1) * 0.16
      const d = `M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`, ang = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI
      keyframes.push(`@keyframes mv${i}_${n}{from{transform:translate(0px,0px)}to{transform:translate(${f(x2 - x1)}px,${f(y2 - y1)}px)}}`)
      layers.lines.push(sceneGroup(t0, dur, `<path d="${d}" pathLength="1" fill="none" stroke="${NAVY}" stroke-width="${f(19 / cam.s)}" stroke-linecap="round" stroke-dasharray="1" style="animation:drawline ${f(dd)}s ease-in-out ${f(a)}s both"/>
        <path d="${d}" pathLength="1" fill="none" stroke="${col}" stroke-width="${f(11 / cam.s)}" stroke-linecap="round" stroke-dasharray="1" style="animation:drawline ${f(dd)}s ease-in-out ${f(a)}s both"/>
        <g transform="translate(${f(x2)} ${f(y2)}) scale(${f(1 / cam.s)}) rotate(${f(ang)})"><path d="M 6 0 L -28 -19 L -28 19 Z" fill="${col}" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round" class="sc" style="${anim('fadeIn', 0.3, a + dd * 0.85)}"/></g>
        <g class="sc" style="${anim('fadeIn', 0.3, a)}"><g style="animation:marchO ${f(dd + 0.6)}s linear ${f(a)}s infinite backwards"><g style="animation:mv${i}_${n} ${f(dd + 0.6)}s ease-in-out ${f(a)}s infinite backwards"><g transform="translate(${f(x1)} ${f(y1)}) scale(${f(1 / cam.s)})">${Array.from({ length: cnt }, (_, q) => `<g transform="translate(${f((q % 3) * 66 - 66)} ${f(Math.floor(q / 3) * 72 - 18)}) scale(2)"><g style="animation:bobf 0.45s ease-in-out ${f(-q * 0.11)}s infinite">${sil(col)}</g></g>`).join('')}</g></g></g></g>`))
      fx(a, 'whoosh')
      if (mv.label) { // étiquette au milieu de la flèche (point t = 0,5 de la courbe), décalée perpendiculairement (côté bas de l'écran)
        const mp = pill({ title: mv.label, x: 0, y: -30, tsize: 34, stroke: col }), qx = 0.25 * x1 + 0.5 * cx + 0.25 * x2, qy = 0.25 * y1 + 0.5 * cy + 0.25 * y2
        const nl = Math.hypot(x2 - x1, y2 - y1) || 1; let nx = -(y2 - y1) / nl, ny = (x2 - x1) / nl; if (ny < 0) { nx = -nx; ny = -ny }
        const off = 60 / cam.s, lx = qx + nx * off, ly = qy + ny * off
        items.push({ kind: 'move', x: lx, y: ly, rel: { x0: -mp.w / 2, x1: mp.w / 2, y0: -30, y1: 30 }, html: (ox, oy) => `<g transform="translate(${f(lx)} ${f(ly)}) scale(${f(1 / cam.s)})"><g class="pop" style="${anim('pop', 0.5, a + dd)}"><g transform="translate(${f(ox)} ${f(oy)})">${mp.svg}</g></g></g>` })
      }
    }

    // ---- personnages (rayons, bulle, étiquette) : ils entrent en marchant puis rebondissent doucement
    for (const [n, pe] of (s.people ?? []).entries()) {
      const [x, y] = pe.xy ?? where(pe.at), sk = pe.xy ? 1 : 1 / cam.s, size = pe.size ?? 250, k = size / 160, d = at(pe.when, afterMove + n * 0.35)
      const preset = PEOPLE[pe.who] ?? {}
      const rcol = pe.rays === true ? (preset.outfit ?? '#FFFFFF') : pe.rays
      const ray = pe.rays ? `<g transform="translate(0 ${f(-size * 0.55)})">${rays({ id: `a-r${uid++}`, r: size * 2.1, color: rcol })}</g>` : ''
      let bubble = '', bw = 0, btop = 0
      if (pe.say) {
        const sz = 34, w = Math.max(textWidth(pe.say, 'en', sz) + 48, 120), h = 66, top = -size * 1.22 - h - 14, dd = d + 0.5
        bw = w; btop = top
        bubble = `<g class="pop" style="${anim('pop', 0.5, dd)}"><rect x="${f(-w / 2)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" rx="30" fill="#fff"/><path d="M -12 ${f(top + h - 2)} L 0 ${f(top + h + 20)} L 14 ${f(top + h - 2)} Z" fill="#fff"/>${textBlock(pe.say, { x: 0, top: top + h / 2 - sz * 0.43, max: sz, min: sz, maxLines: 1, width: Math.ceil(w), fill: NAVY, halo: '#fff', halo_k: 0 }).svg}</g>`
        fx(dd, 'pop')
      }
      const label = pe.label ? `<g transform="translate(0 16)">${pill({ title: pe.label.title, sub: pe.label.sub, tsize: 38, stroke: '#fff' }).svg}</g>` : ''
      fx(d, 'pop')
      const dir = (x * cam.s + cam.tx) > 540 ? 'walkR' : 'walkL' // vient du bord le plus proche
      const body = (ox, oy) => `<g transform="translate(${f(x + (ox / cam.s) * (pe.xy ? 0 : 1))} ${f(y + (oy / cam.s) * (pe.xy ? 0 : 1))}) scale(${f(sk)})">${ray ? `<g class="sc" style="${anim('fadeIn', 0.8, d, 'ease-out')}">${ray}</g>` : ''}<g style="animation:${dir} 0.9s cubic-bezier(.2,.8,.3,1) ${f(d)}s both"><g class="pop" style="${anim('pop', 0.55, d)}"><g style="animation:bob ${f(1.5 + (n % 3) * 0.2)}s ease-in-out ${f(-n * 0.5)}s infinite"><g transform="scale(${f(k)})">${person({ ...preset, ...pe })}</g></g>${label}</g></g>${bubble}</g>`
      if (pe.xy) screenEnts.push(body(0, 0))
      else items.push({ kind: 'people', x, y, rel: { x0: -Math.max(size * 0.42, bw / 2), x1: Math.max(size * 0.42, bw / 2), y0: pe.say ? btop : -size * 1.15, y1: pe.label ? 16 + (pe.label.sub ? 100 : 70) : 8 }, html: body })
    }
    // ---- noms de territoires (texte blanc sur la carte, comme « Allemagne » / « Russie »)
    for (const [n, l] of (s.labels ?? []).entries()) {
      const [x, y] = where(l.at), d = at(l.when, afterMove + 0.3 + n * 0.3), sz = Math.max(l.size ?? 46, 38), lw = textWidth(l.text, 'en', sz) + 40, lh = sz * 1.45
      const mk = (ox, oy) => {
        const g = `<g transform="translate(${f(x + ox / cam.s)} ${f(y + oy / cam.s)}) scale(${f(1 / cam.s)})"><g class="sc" style="${anim('fadeIn', 0.6, d, 'ease-out')}"><rect x="${f(-lw / 2)}" y="${f(-lh / 2)}" width="${f(lw)}" height="${f(lh)}" rx="${f(lh / 2)}" fill="${NAVY}" fill-opacity=".88" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>${textBlock(l.text, { x: 0, top: -sz * 0.43, max: sz, min: sz, maxLines: 1, width: Math.ceil(lw), fill: '#fff', halo: NAVY, halo_k: 0.12 }).svg}</g></g>`
        return l.until == null ? g : sceneGroup(d, Math.max(0.8, at(l.until, dur) - d), g.replace(`class="sc" style="${anim('fadeIn', 0.6, d, 'ease-out')}"`, `class="sc" style="${anim('fadeIn', 0.6, 0, 'ease-out')}"`))
      }
      items.push({ kind: 'label', x, y, rel: { x0: -lw / 2, x1: lw / 2, y0: -lh / 2, y1: lh / 2 }, html: mk })
    }
    if (lineLabel) items.push({ kind: 'move', x: lineLabel.mid[0], y: lineLabel.mid[1], rel: { x0: -lineLabel.pl.w / 2, x1: lineLabel.pl.w / 2, y0: -30, y1: 30 }, html: (ox, oy) => `<g transform="translate(${f(lineLabel.mid[0])} ${f(lineLabel.mid[1])}) scale(${f(1 / cam.s)})"><g class="pop" style="${anim('pop', 0.5, lineLabel.a + 1.0)}"><g transform="translate(${f(ox)} ${f(oy)})">${lineLabel.pl.svg}</g></g></g>` })
    // ---- mise en page automatique : rien ne se superpose (on décale pastilles, personnages et noms dans le cadre)
    {
      const R = { x0: 135, x1: 945, y0: 590, y1: 1245 }, boxes = [], res = new Map()
      const ov = (a, c) => Math.max(0, Math.min(a[2], c[2]) - Math.max(a[0], c[0])) * Math.max(0, Math.min(a[3], c[3]) - Math.max(a[1], c[1]))
      const cands = [[0, 0]]; for (const r of [70, 130, 190, 260, 340]) for (let q = 0; q < 12; q++) cands.push([r * Math.cos((q * Math.PI) / 6), r * Math.sin((q * Math.PI) / 6)])
      const prio = { people: 0, pill: 1, label: 2, move: 3 }
      for (const it of [...items].sort((u, v) => prio[u.kind] - prio[v.kind])) {
        const sx = cam.tx + it.x * cam.s, sy = cam.ty + it.y * cam.s
        let best = null
        for (const [ox, oy] of cands) {
          const P = 22, bx = [sx + ox + it.rel.x0 - P, sy + oy + it.rel.y0 - P, sx + ox + it.rel.x1 + P, sy + oy + it.rel.y1 + P] // marge de 12 px : deux éléments ne se touchent plus
          const area = (bx[2] - bx[0]) * (bx[3] - bx[1]), inside = ov(bx, [R.x0, R.y0, R.x1, R.y1])
          const cost = boxes.reduce((a, c) => a + ov(bx, c), 0) * 3 + (area - inside) * 2 + Math.hypot(ox, oy) * (it.kind === 'label' ? 90 : 25)
          if (!best || cost < best.cost) best = { cost, ox, oy, bx }
          if (cost === 0) break
        }
        boxes.push(best.bx); res.set(it, [best.ox, best.oy])
      }
      for (const it of items) { const [ox, oy] = res.get(it); ents.push(it.html(ox, oy)) }
      sceneBoxes[i] = boxes.map((bx) => ({ x0: (bx[0] - cam.tx) / cam.s, y0: (bx[1] - cam.ty) / cam.s, x1: (bx[2] - cam.tx) / cam.s, y1: (bx[3] - cam.ty) / cam.s }))
    }
    if (ents.length) layers.entities.push(sceneGroup(t0, dur, ents.join('')))

    // ---- couche écran : légende jaune, sous-titre, chiffre géant, questions, bouton abonné
    const role = s.type === 'hook' ? 'data-role="hook"' : last ? 'data-role="final"' : ''
    const subsOut = []
    const parts = [], below = []
    if (s.backdrop) below.push(sceneGroup(t0, dur, BACKDROPS[s.backdrop])) // below : chiffre géant, qui assombrit la carte quelques secondes sous la légende
    if (s.big) {
      const a = at(s.big.at, quiz ? p.reveal + 0.3 : (p.lines.length ? p.lines[0].t + 0.8 : move + 0.3)), bd = s.big.dur ?? 2.6, vs = fitSize(up(s.big.value), { kind: 'en', max: 260, width: 820 })
      below.push(sceneGroup(a, bd, `<rect x="-200" y="-200" width="1480" height="2320" fill="${NAVY}" fill-opacity=".4"/>
      <g class="pop" style="${anim('pop', 0.6, a)}">${textBlock(up(s.big.value), { x: 540, top: 640, max: vs, min: vs, maxLines: 1, width: 940, fill: YELLOW, halo: NAVY, halo_k: 0.14 }).svg}
      ${s.big.sub ? textBlock(up(s.big.sub), { x: 540, top: 640 + vs * 1.2 + 10, max: 56, min: 34, maxLines: 2, width: 880, fill: '#fff', halo: NAVY, halo_k: 0.16 }).svg : ''}</g>`))
      fx(a, 'hit')
    }
    for (const [ai, ar] of [].concat(s.art ?? []).entries()) { // animation SVG plein cadre (château, traité, statistiques…) qui remplace la carte un instant
      const [a0, a1] = artWins[ai], ad = a1 - a0
      const r = drawArt(ar.kind, ar, a0, ad, { anim, sg: sceneGroup, f, tb: textBlock, tw: textWidth, NAVY, YELLOW, nextId: () => uid++, paths: Object.fromEntries(G.countries.filter((c) => c.t !== 'sup').map((c) => [c.name, c.d])), bbox: (d) => bboxOf([d]), region: (c, n) => R.regions.find((r) => r.c === c && r.n === n)?.d, areaPath: (pg) => 'M' + pg.map((q) => project(q).map(f).join(' ')).join('L') + 'Z' })
      keyframes.push(...r.css)
      below.push(sceneGroup(a0, ad, `<rect x="-200" y="-200" width="1480" height="2320" fill="${NAVY}" fill-opacity=".3" class="sc" style="${anim('fadeIn', 0.3, a0, 'ease-out')}"/>
        <g transform="translate(70 580)"><g class="pop" style="${anim('pop', 0.6, a0)}"><g clip-path="url(#a-card)">${r.svg}</g><rect width="${ART_W}" height="${ART_H}" rx="44" fill="none" stroke="#fff" stroke-width="5"/></g></g>`.replace('<g transform="translate(70 580)">', `<g transform="translate(70 580)" style="${anim('out', 0.3, a1 - 0.3, 'ease-in')}">`)))
      fx(a0, 'whoosh'); fx(a0 + 0.5, 'pop')
    }
    if (s.crowd) { // « la Suisse en 100 personnes » : une silhouette par habitant, colorée par langue
      const C = 10, DX = 62, DY = 66, x00 = 540 - ((C - 1) * DX) / 2, y00 = 560, icon = (fill) => `<g transform="scale(.72)"><circle cx="0" cy="-20" r="10" fill="${fill}"/><path d="M -12 -8 Q -12 -12 -7 -12 H 7 Q 12 -12 12 -8 V 14 H 5 V 30 H -5 V 14 H -12 Z" fill="${fill}"/></g>`
      let k = 0, a0 = at(s.crowd.at, move + 0.3), pillRow = []
      const dim = sceneGroup(t0, dur, `<rect x="-200" y="-200" width="1480" height="2320" fill="${NAVY}" fill-opacity=".62" class="sc" style="${anim('fadeIn', 0.8, a0, 'ease-out')}"/>`)
      const icons = []
      s.crowd.groups.forEach((g, gi) => {
        const col = g.color ?? (g.lang ? LANGS[g.lang].color : CROWD_OTHER), ga = at(g.at, a0 - t0 + 0.4 + gi * 1.6)
        for (let q = 0; q < g.n; q++, k++) {
          const cx = x00 + (k % C) * DX, cy = y00 + Math.floor(k / C) * DY
          icons.push(`<g transform="translate(${f(cx)} ${f(cy)})"><g class="pop" style="${anim('pop', 0.35, ga + q * Math.min(0.045, 1.4 / g.n))}">${icon(col)}</g></g>`)
        }
        fx(ga, 'sparkle')
        if (g.label) {
          const pw = pill({ title: g.label, x: 0, y: 0, fill: col, tsize: 34 })
          const col2 = gi % 2, row = Math.floor(gi / 2)
          pillRow.push(`<g transform="translate(${f(300 + col2 * 480)} ${1190 + row * 76})"><g class="pop" style="${anim('pop', 0.45, ga + 0.1)}">${pw.svg}</g></g>`)
        }
      })
      below.push(dim)
      parts.push(`<g>${icons.join('')}</g>${pillRow.join('')}`)
    }
    if (screenEnts.length) parts.push(screenEnts.join(''))
    const capTop = s.year != null ? 372 : 250
    if (s.year != null) parts.push(textBlock(disp(s.year), { x: 540, top: 250, max: 100, min: 60, maxLines: 1, width: 900, fill: '#fff', halo: NAVY, halo_k: 0.14, anim: () => anim('up', 0.6, t0 + (s.type === 'hook' ? 0.4 : 0.05), 'ease-out') }).svg)
    const cap = textBlock(up(disp(s.text)), { top: capTop, max: s.type === 'hook' ? 72 : 76, min: 40, maxLines: 3, width: 900, fill: s.type === 'hook' || last ? '#fff' : YELLOW, halo: NAVY, halo_k: 0.16, attrs: role,
      anim: (n) => anim('up', 0.6, t0 + (s.type === 'hook' ? 0.4 : 0.1) + n * 0.12, 'ease-out') })
    parts.push(cap.svg)
    if (s.sub) parts.push(textBlock(s.sub, { top: capTop + cap.height + 18, max: 48, min: 32, maxLines: 2, width: 900, fill: '#fff', halo: NAVY, halo_k: 0.16, attrs: last ? role : '', anim: () => anim('up', 0.5, t0 + 0.6, 'ease-out') }).svg)

    // ---- sous-titres : la phrase entière, calés sur la voix
    const subY = 1340
    for (const l of p.lines) {
      const show = shows.get(l.text) ?? l.text
      const ld = voice[`${NARR}|${l.text}`]?.dur ?? 0.065 * l.text.length + 0.4
      // la phrase est coupée en morceaux de 2 lignes au plus (≈ 56 caractères), à la virgule de préférence
      const clauses = show.match(/(?:[^,;:]|[,;:](?=\d))+[,;:]?\s*/g)?.map((x) => x.trim()).filter(Boolean) ?? [show]
      const pieces = clauses.flatMap((c) => { if (c.length <= 56) return [c]; const w = c.split(/\s+/), n = Math.ceil(c.length / 52), per = Math.ceil(w.length / n); return Array.from({ length: n }, (_, k) => w.slice(k * per, (k + 1) * per).join(' ')) })
      const chunks = []
      for (const c of pieces) { if (chunks.length && (chunks.at(-1) + ' ' + c).length <= 56) chunks[chunks.length - 1] += ' ' + c; else chunks.push(c) }
      const FW = new Set(['le', 'la', 'les', 'l', 'de', 'du', 'des', 'd', 'un', 'une', 'à', 'au', 'aux', 'en', 'et', 'ou', 'entre', 'dans', 'sur', 'par', 'pour', 'que', 'qui', 'se', 'sa', 'son', 'ses', 'sous', 'avec', 'ce', 'cette', 'plus', 'ne', 'est', 'a'])
      for (let k = 0; k < chunks.length - 1; k++) { const w = chunks[k].split(' '); while (w.length > 2 && FW.has(norm(w.at(-1)))) chunks[k + 1] = w.pop() + ' ' + chunks[k + 1]; chunks[k] = w.join(' ') }
      for (let k = 0; k < chunks.length - 1; k++) { const nx = chunks[k + 1].split(' ')[0], w = chunks[k].split(' '); if (/^(?=[IVXLCDM])[IVXLCDM]+(er|e)?[,.;:!?»…]*$/.test(nx) && w.length > 1) { chunks[k + 1] = w.pop() + ' ' + chunks[k + 1]; chunks[k] = w.join(' ') } } // « Henri | VIII » : le prénom suit son chiffre romain
      for (let k = 0; k < chunks.length - 1; k++) if (chunks[k].split(' ').length < 3 && (chunks[k] + ' ' + chunks[k + 1]).length <= 72) { chunks[k + 1] = chunks[k] + ' ' + chunks[k + 1]; chunks.splice(k, 1); k-- } // pas de sous-titre orphelin de 1 ou 2 mots
      const tot = chunks.reduce((a, c) => a + c.length, 0), subBottom = s.crowd ? 1515 : 1480
      let tt = t0 + l.t
      chunks.forEach((ch, k) => {
        const cd = k === chunks.length - 1 ? Math.max(0.8, ld + 0.15 - (tt - t0 - l.t)) : Math.max(0.7, (ld * ch.length) / tot)
        const o = { x: 540, max: 54, min: 42, maxLines: 2, width: 740, fill: '#fff', halo: NAVY, halo_k: 0.2 }
        const y0 = subBottom - (textBlock(ch, { ...o, top: 0 }).height + 44), tb = textBlock(ch, { ...o, top: y0 + 22 })
        const pw = Math.min(820, Math.max(...tb.lines.map((L) => textWidth(L, 'en', tb.size))) + 70)
        const tw = new Set(norm(`${s.text ?? ''} ${s.type === 'hook' ? (s.sub ?? '') : ''}`).split(/\s+/).filter(Boolean)), cw = norm(ch).split(/\s+/).filter(Boolean)
        const dupTitle = s.type === 'hook' && l === p.lines[0] && cw.length >= 3 && cw.filter((w) => tw.has(w)).length / cw.length >= 0.75 // le sous-titre répète le titre : on ne l'affiche pas deux fois
        if (!dupTitle) subsOut.push(sceneGroup(tt, cd, `<rect x="${f(540 - pw / 2)}" y="${f(y0)}" width="${f(pw)}" height="${f(tb.height + 44)}" rx="30" fill="${NAVY}" fill-opacity=".9"/>${tb.svg}`))
        tt += cd
      })
    }
    if (s.note) parts.push(`<g class="sc" style="${anim('fadeIn', 0.6, t0 + 0.6, 'ease-out')}">${pill({ title: s.note, x: 540, y: 1262, tsize: 32 }).svg}</g>`)
    const extras = []
    if (quiz) {
      const n = s.choices.length, H = 84, G = 14, Wd = n === 3 ? 270 : 420, y0 = 1290, ra = t0 + p.reveal, xs = (k) => 540 - (n * Wd + (n - 1) * G) / 2 + k * (Wd + G)
      parts.push(s.choices.map((c, k) => {
        const x0 = xs(k), ok = k === s.answer, sz = fitSize(up(c), { kind: 'en', max: 40, min: 28, width: Wd - 92 })
        const lab = (fill, halo) => textBlock(up(c), { x: x0 + 66 + (Wd - 66 - 12) / 2, top: y0 + H / 2 - sz * 0.43, max: sz, min: sz, maxLines: 1, width: Wd - 84, fill, halo, halo_k: 0 }).svg
        const badge = (fill) => `<circle cx="${x0 + 38}" cy="${y0 + H / 2}" r="24" fill="${fill}"/>${textBlock('ABC'[k], { x: x0 + 38, top: y0 + H / 2 - 32 * 0.43, max: 32, min: 32, maxLines: 1, width: 50, fill: '#fff', halo: fill, halo_k: 0 }).svg}`
        return `<g class="pop" style="${anim('pop', 0.5, t0 + 0.9 + k * 0.14)}"><g style="${ok ? '' : anim('dim', 0.4, ra, 'ease-out')}">
        <rect x="${f(x0)}" y="${y0}" width="${Wd}" height="${H}" rx="42" fill="${NAVY}" fill-opacity=".9" stroke="#fff" stroke-width="3"/>${badge('#3B82F6')}${lab('#fff', NAVY)}</g>
        ${ok ? `<g class="pop sc" style="${anim('pop', 0.5, ra)}"><rect x="${f(x0)}" y="${y0}" width="${Wd}" height="${H}" rx="42" fill="#2EB872" stroke="#fff" stroke-width="4"/>${badge('#1C8A55')}${lab('#fff', '#2EB872')}<path d="M ${f(x0 + Wd - 44)} ${y0 + H / 2} l 9 10 l 18 -22" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>` : ''}</g>`
      }).join(''))
      const ca = t0 + p.countdown
      extras.push(sceneGroup(ca, COUNT, `<g transform="translate(940 560)"><circle r="50" fill="${NAVY}" opacity=".85"/><circle r="46" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="8"/>
      <circle r="46" fill="none" stroke="${YELLOW}" stroke-width="8" stroke-linecap="round" stroke-dasharray="289" transform="rotate(-90)" style="animation:cdring ${COUNT}s linear ${f(ca)}s both"/>
      ${[3, 2, 1].map((c, k) => `<g class="sc" style="animation:win 1s linear ${f(ca + k)}s both">${textBlock(String(c), { x: 0, top: -26, max: 64, min: 64, maxLines: 1, width: 80, fill: '#fff', halo: NAVY, halo_k: 0.1 }).svg}</g>`).join('')}</g>`))
      for (let k = 0; k < COUNT; k++) fx(ca + k, 'tick')
      fx(ra, 'ding'); fx(ra + 0.1, 'tada')
      const seed = (i + 1) * 7919, rnd = (k) => { const v = Math.sin(seed + k * 12.9898) * 43758.5453; return v - Math.floor(v) }
      const cy = y0 + H / 2, cxp = xs(s.answer) + Wd / 2
      extras.push(sceneGroup(ra, 2.2, Array.from({ length: 28 }, (_, k) => {
        const dx = (rnd(k) - 0.5) * 900, upv = 160 + rnd(k + 40) * 260, dy = 280 + rnd(k + 80) * 240, rot = (rnd(k + 120) - 0.5) * 900, col = RAINBOW[k % RAINBOW.length], sz = 14 + rnd(k + 160) * 14
        keyframes.push(`@keyframes cf${i}_${k}{0%{transform:translate(0,0) rotate(0);opacity:1}40%{transform:translate(${f(dx * 0.7)}px,${f(-upv)}px) rotate(${f(rot * 0.5)}deg);opacity:1}100%{transform:translate(${f(dx)}px,${f(dy)}px) rotate(${f(rot)}deg);opacity:0}}`)
        return `<rect x="${f(cxp - sz / 2)}" y="${f(cy)}" width="${f(sz)}" height="${f(sz * 0.55)}" rx="3" fill="${col}" class="sc" style="transform-box:fill-box;transform-origin:center;animation:cf${i}_${k} 1.7s cubic-bezier(.2,.7,.3,1) ${f(ra)}s both"/>`
      }).join('')))
    }
    if (last && s.cta === true) { // bouton « abonné » (seulement si le brief le demande : cta: true) : un curseur clique sur « S'ABONNER »
      const ta = t0 + 1.6, tc = t0 + 2.9, cx = 540, cy = 1215, w = 470, h = 104
      const label = (txt, a, b) => `<g class="sc" style="animation:fadeIn .2s linear ${f(a)}s both${b ? `,out .15s linear ${f(b)}s both` : ''}">${textBlock(txt, { x: cx + 36, top: cy - 17, max: 40, min: 40, maxLines: 1, width: 380, fill: '#fff', halo: NAVY, halo_k: 0 }).svg}</g>`
      parts.push(`<g class="pop" style="${anim('pop', 0.6, ta)}"><g style="transform-box:fill-box;transform-origin:center;animation:press .45s ease ${f(tc)}s both">
      <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="52" fill="${NAVY}" fill-opacity=".92" stroke="#fff" stroke-width="3"/>
      <path d="M ${cx - 150} ${cy + 14} H ${cx - 98} Q ${cx - 108} ${cy + 4} ${cx - 108} ${cy - 14} Q ${cx - 108} ${cy - 34} ${cx - 124} ${cy - 34} Q ${cx - 140} ${cy - 34} ${cx - 140} ${cy - 14} Q ${cx - 140} ${cy + 4} ${cx - 150} ${cy + 14} Z M ${cx - 132} ${cy + 20} H ${cx - 116} Q ${cx - 116} ${cy + 32} ${cx - 124} ${cy + 32} Q ${cx - 132} ${cy + 32} ${cx - 132} ${cy + 20} Z" fill="#fff"/>
      ${label("S'ABONNER", ta, tc)}${label('ABONNÉ', tc)}
      <path d="M ${cx + 152} ${cy} l 11 12 l 22 -26" fill="none" stroke="#2EB872" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" class="sc" style="${anim('fadeIn', 0.2, tc)}"/></g>
      <g transform="translate(${cx + 150} ${cy + 20})"><path d="M 0 0 L 0 38 L 10 29 L 18 46 L 26 42 L 18 26 L 32 26 Z" fill="#fff" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round" class="sc" style="animation:nudge ${f(tc - ta - 0.6)}s ease-in-out ${f(ta + 0.5)}s both,fadeIn .2s linear ${f(ta + 0.5)}s both"/></g></g>`)
      fx(tc, 'ding')
    }

    ui.push(...below, sceneGroup(t0, dur, parts.join('\n    '), { last }))
    ui.push(...subsOut, ...extras)
  })

  // ---- caméra : démarre sur l'Europe puis glisse de scène en scène
  const stops = [], pct = (t) => f((t / D) * 100)
  // visite : la caméra ne reste jamais plus de ~1,7 s sur la même vue ; elle glisse vers les éléments de la scène (personnages, pastilles, flèches…)
  const anchors = (sx) => [...(sx.people ?? []).map((q) => q.at), ...(sx.pills ?? []).map((q) => q.at), ...(sx.moves ?? []).map((q) => q.to), ...(sx.labels ?? []).map((q) => q.at)].filter((q) => q != null && !(typeof q === 'string' && !CITIES[q])).map(where)
  const segs = []
  for (let i = 0; i < sc.length; i++) { if (i && sameCam(cams[i], cams[i - 1])) { segs.at(-1).last = i; segs.at(-1).anch.push(...anchors(sc[i])); segs.at(-1).bx.push(...(sceneBoxes[i] ?? [])) } else segs.push({ first: i, last: i, cam: cams[i], anch: anchors(sc[i]), bx: [...(sceneBoxes[i] ?? [])] }) }
  const fits = (cm, bx) => bx.every((q) => { const x0 = cm.tx + cm.s * q.x0, x1 = cm.tx + cm.s * q.x1, y0 = cm.ty + cm.s * q.y0, y1 = cm.ty + cm.s * q.y1; return x0 >= 70 && x1 <= 1010 && y0 >= 575 && y1 <= 1290 })
  const tour = (c, anch, bx, j, T) => {
    const n = Math.max(1, Math.round(T / 1.7)), pts = []
    const Kz = [1.1, 1.0, 1.12, 1.04, 1.1, 1.02], cw = [(BOX.cx - c.tx) / c.s, (BOX.cy - c.ty) / c.s]
    for (let w = 1; w <= n; w++) {
      const k = Kz[(w + j) % Kz.length], tgt = anch.length ? anch[(w - 1 + j) % anch.length] : [cw[0] + ((w % 2) * 2 - 1) * 40 / c.s, cw[1] + ((w % 3) - 1) * 34 / c.s]
      const lerp0 = anch.length ? 0.25 : 1
      // vue validée : tous les éléments de la scène doivent rester dans le cadre sûr ; sinon on réduit le zoom puis le décalage
      let pick = c
      for (const [kk, ll] of [[k, lerp0], [k, lerp0 / 2], [1 + (k - 1) / 2, lerp0 / 2], [1, lerp0 / 2], [1, 0]]) {
        const px = cw[0] + (tgt[0] - cw[0]) * ll, py = cw[1] + (tgt[1] - cw[1]) * ll, s2 = c.s * kk, cand = { s: s2, tx: BOX.cx - px * s2, ty: BOX.cy - py * s2 }
        if (fits(cand, bx)) { pick = cand; break }
      }
      pts.push({ k: w / n, cam: pick })
    }
    return pts
  }
  segs.forEach((g, j) => {
    const end = starts[g.last] + durs[g.last] - (j === segs.length - 1 ? LOOPBACK : 0), arrive = j === 0 ? moveOf(0) : starts[g.first] + MOVE, T = Math.max(0.5, end - arrive)
    if (j === 0) stops.push(`0%{transform:${camCss(openCam)};animation-timing-function:cubic-bezier(.45,0,.2,1)}`)
    else stops.push(`${pct(starts[g.first])}%{transform:${camCss(segs[j - 1].end)};animation-timing-function:cubic-bezier(.45,0,.2,1)}`)
    stops.push(`${pct(arrive)}%{transform:${camCss(g.cam)};animation-timing-function:cubic-bezier(.45,.05,.55,.95)}`)
    // scène fixe (`still: true` sur toutes les scènes du segment) : pas de visite, la caméra reste sur le cadrage
    const pts = sc.slice(g.first, g.last + 1).every((x) => x.still) ? [{ k: 1, cam: g.cam }] : tour(g.cam, g.anch, g.bx, j, T)
    pts.forEach((q, w) => { stops.push(`${pct(arrive + q.k * T)}%{transform:${camCss(q.cam)}${w < pts.length - 1 ? ';animation-timing-function:cubic-bezier(.45,.05,.55,.95)' : ''}}`) })
    g.end = pts.at(-1).cam
  })
  // boucle : la caméra revient à sa vue de départ pendant la tenue finale, pour que la dernière image soit la première
  stops.push(`${pct(D - LOOPBACK)}%{transform:${camCss(segs.at(-1).end)};animation-timing-function:cubic-bezier(.45,0,.2,1)}`)
  stops.push(`${pct(D - 0.45)}%{transform:${camCss(openCam)}}`, `100%{transform:${camCss(openCam)}}`)
  keyframes.push(`@keyframes mapcam{${stops.join('')}}`)
  fx(0.05, 'whoosh')

  const baseG = b.base ? `<g fill="#fff" fill-opacity="${b.base.opacity ?? 0.14}" stroke="#fff" stroke-opacity=".9" stroke-width="2.6" stroke-linejoin="round">${(b.base.countries).flatMap((nm) => G.countries.map((c, n) => (c.name === nm ? `<use href="#a-e${n}" vector-effect="non-scaling-stroke"/>` : ''))).join('')}</g>` : ''
  const landG = W.map((c) => `<use href="#${c.id}"/>`).join('')
  const SAND = world ? DESERT : AFRICA
  const landN = W.filter((c) => !SAND.has(c.name)).map((c) => `<use href="#${c.id}"/>`).join('')
  const landA = W.filter((c) => SAND.has(c.name)).map((c) => `<use href="#${c.id}"/>`).join('')
  // relief réel (tuiles d'altitude, relief.py) si le brief le demande et que l'image existe ; sinon relief procédural
  const terr = (b.terrain ?? []).map((t, n) => {
    const file = reliefFile(t, world)
    if (!existsSync(file)) { console.warn(`⚠ relief absent : ${file} (lancer src/kit/geo/relief.py)`); return null }
    const [x0, y0] = project([t.box[0], t.box[3]]), [x1, y1] = project([t.box[2], t.box[1]]), fb = (x1 - x0) * 0.025, img = `<image x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" preserveAspectRatio="none" href="data:image/jpeg;base64,${readFileSync(file).toString('base64')}"/>`
    if (!n) return img
    // couche limitée à certaines scènes (ex. mer basse de la dernière glaciation) : fondu d'entrée et de sortie
    const only = (layer) => {
      if (!t.scenes) return layer
      // fadeIn (s) : entrée lente, ex. la mer qui se vide sous les yeux ; sinon fondu court calé sur le début de la scène
      const a0 = starts[Math.min(...t.scenes)], a1 = starts[Math.max(...t.scenes)] + durs[Math.max(...t.scenes)], fd = 0.6, fi = t.fadeIn ?? 0
      keyframes.push(`@keyframes a-tl${n}{0%,${pct(Math.max(0, fi ? a0 : a0 - fd))}%{opacity:0}${pct(a0 + fi)}%,${pct(Math.max(a0, a1 - fd))}%{opacity:1}${pct(a1)}%,100%{opacity:0}}`)
      return `<g style="animation:a-tl${n} ${f(D)}s linear 0s both">${layer}</g>`
    }
    const fe = (x1 - x0) * 0.06
    return only(`<filter id="a-tf${n}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${f(fb)}"/></filter><mask id="a-tm${n}" maskUnits="userSpaceOnUse" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}"><rect x="${f(x0 + fe)}" y="${f(y0 + fe)}" width="${f(x1 - x0 - 2 * fe)}" height="${f(y1 - y0 - 2 * fe)}" fill="#fff" filter="url(#a-tf${n})"/></mask><g mask="url(#a-tm${n})">${img}</g>`)
  }).filter(Boolean)
  const proc = terr.length ? '' : `<g fill="none" stroke="#58B0AE" stroke-width="30" stroke-linejoin="round" opacity=".55" filter="url(#a-blur)">${landG}</g>
    <g fill="#667B48">${landN}</g><g fill="#C4AC74">${landA}</g>
    <g clip-path="url(#a-land)">
      <path d="${alpsD}" fill="none" stroke="#9C8156" stroke-width="330" stroke-linecap="round" opacity=".85" filter="url(#a-blur2)"/>
      <path d="${alpsD}" fill="none" stroke="#E4DFD2" stroke-width="70" stroke-linecap="round" opacity=".5" filter="url(#a-blur)"/>
      <rect ${rect} fill="#fff" filter="url(#a-shade)"/>
    </g>`
  // subdivisions (régions, départements, provinces), fleuves et lacs de toute l'Europe, limités à ce que la caméra peut voir
  // mode monde : les vues très larges (zoom < 0,05, plus de 90° de longitude) ne dessinent pas les subdivisions (illisibles et lourdes)
  const views = [openCam, ...cams].filter((c) => !world || c.s >= 0.05).map((c) => ({ x0: -c.tx / c.s - 250,x1: (1080 - c.tx) / c.s + 250, y0: -c.ty / c.s - 250, y1: (1920 - c.ty) / c.s + 250 }))
  const seen = (d) => { const q = bboxOf([d]); return views.some((v) => q.x1 >= v.x0 && q.x0 <= v.x1 && q.y1 >= v.y0 && q.y0 <= v.y1) }
  const regionsG = b.regions === false ? '' : `<g fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="1.1" stroke-linejoin="round">${R.regions.filter((r) => r.c !== 'Switzerland' && seen(r.d)).map((r) => `<path d="${r.d}" vector-effect="non-scaling-stroke"/>`).join('')}</g>
    <g fill="#4AA8C8" fill-opacity=".92" stroke="#fff" stroke-opacity=".45" stroke-width=".8">${R.lakes.filter((l) => seen(l.d)).map((l) => `<path d="${l.d}" vector-effect="non-scaling-stroke"/>`).join('')}</g>
    <g fill="none" stroke="#7CC8EC" stroke-linecap="round" stroke-linejoin="round">${R.rivers.filter((r) => seen(r.d)).map((r) => `<path d="${r.d}" stroke-width="${f(Math.max(1.1, 3.4 - (r.r ?? 4) * 0.4))}" vector-effect="non-scaling-stroke"/>`).join('')}${b.rivers === 'detail' ? `<g stroke-opacity=".85">${riversDetail.rivers.filter((r) => seen(r.d)).map((r) => `<path d="${r.d}" stroke-width="1.1" vector-effect="non-scaling-stroke"/>`).join('')}</g>` : ''}</g>`
  const body = `  <rect x="-200" y="-200" width="1480" height="2320" fill="${NAVY}"/>
  <g style="transform-origin:0 0;animation:mapcam ${f(D)}s linear 0s both">
    <rect ${rect} fill="url(#a-sea)"/>
    ${terr.join('\n    ')}
    ${proc}
    <g fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="2.8" stroke-linejoin="round">${W.map((c) => `<use href="#${c.id}" vector-effect="non-scaling-stroke"/>`).join('')}</g>
    ${regionsG}
    ${swiss ? `<g fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1">${DISTRICTS.map((d) => `<use href="#m-d${d.id}"/>`).join('')}</g>` : ''}
    ${baseG}
    <g style="animation:endfade ${f(D)}s linear 0s both">${layers.highlights.join('\n    ')}</g>
    ${swiss ? `<g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round">${[...CANTONS.values()].map((c) => `<use href="#m-c${c.id}"/>`).join('')}</g>
    <use href="#a-lakes" fill="#3A9CB4" stroke="#fff" stroke-opacity=".4" stroke-width=".8"/>
    <use href="#a-ch" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : ''}
    <g style="animation:endfade ${f(D)}s linear 0s both">${layers.lines.join('\n    ')}
    ${layers.entities.join('\n    ')}</g>
  </g>
  <rect x="0" y="0" width="1080" height="800" fill="url(#a-vt)"/><rect x="0" y="1150" width="1080" height="770" fill="url(#a-vb)"/>
  <g style="animation:endfade ${f(D)}s linear 0s both">${ui.join('\n  ')}</g>
  ${b.handle === false ? '' : `<g opacity=".92">${textBlock(b.handle ?? '@terranarrata', { x: 540, top: 1484, max: 32, min: 32, maxLines: 1, width: 520, fill: '#fff', halo: NAVY, halo_k: 0.16 }).svg}</g>`}`
  const svg = svgDocument({ title: b.title ?? sc[0].text, format: name, id: b.id, duration: D, defs: defs + [...regionDefs.values()].join(''), keyframes, body })
  script.sfx = script.sfx.filter((e) => ['whoosh', 'hit', 'ding', 'tada', 'tick'].includes(e.kind)).sort((a, c) => a.t - c.t)
  return { svg, script: { id: b.id, duration: f(D), music: 'pad', lines: script.lines.sort((a, c) => a.t - c.t), sfx: script.sfx }, duration: f(D), keyTimes, info: { lines: script.lines.length, sfx: script.sfx.length } }
}
