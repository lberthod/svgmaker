// Format « carte » : reel de géographie animé (style « maps ») — une carte qui zoome de scène en scène,
// des régions qui se colorent, des villes épinglées, un chiffre ou un mot en gros. Aujourd'hui : la Suisse
// (cantons et districts, langues). Brief : voir STYLE.md. Pas de voix : une musique peut être ajoutée au rendu.
import { readFileSync } from 'node:fs'
import { anim as kanim, esc, fitSize, textWidth } from '../../kit/core.mjs'
import { SAFE, sceneGroup, svgDocument } from '../../kit/document.mjs'
import { briefError, checkCommon, checkText, clamp, f, textBlock, words } from '../common.mjs'

export const name = 'carte'
export const description = 'Reel géographique « maps » : carte de la Suisse qui zoome, régions colorées par langue, villes, chiffres'

const geo = JSON.parse(readFileSync(new URL('../../kit/geo/ch.json', import.meta.url), 'utf8'))
const MAP_W = geo.width, MAP_H = geo.height

// ------------------------------------------------------------------ langues (district par district, langue dominante)
export const LANGS = {
  de: { name: 'Allemand', color: '#E8503A' },
  fr: { name: 'Français', color: '#3B82F6' },
  it: { name: 'Italien', color: '#2EB872' },
  rm: { name: 'Romanche', color: '#F5B84B' },
  bi: { name: 'Bilingue', color: '#9B6BE0' }, // districts où deux langues se partagent la population (allemand + français)
}
const FR_DISTRICTS = new Set([241, 1001, 1002, 1003, 1004, 1007, 2302, 2303, 2305, 2307, 2308, 2310, 2311, 2312])
const FR_CANTONS = new Set([22, 24, 25, 26])
const IT_DISTRICTS = new Set([1842, 1847])
const RM_DISTRICTS = new Set([1841, 1843, 1850])
const BI_DISTRICTS = new Set([242, 1005])
export const langOf = (d) => RM_DISTRICTS.has(d.id) ? 'rm' : IT_DISTRICTS.has(d.id) || d.canton === 21 ? 'it'
  : BI_DISTRICTS.has(d.id) ? 'bi' : FR_DISTRICTS.has(d.id) || FR_CANTONS.has(d.canton) ? 'fr' : 'de'

const DISTRICTS = geo.districts.map((d) => ({ ...d, lang: langOf(d) }))
const CANTONS = new Map(geo.cantons.map((c) => [c.code, c]))

// ------------------------------------------------------------------ villes (lon, lat) → coordonnées de la carte
export const CITIES = {
  'Genève': [6.14, 46.2], 'Lausanne': [6.63, 46.52], 'Neuchâtel': [6.93, 46.99], 'Fribourg': [7.16, 46.8], 'Morat': [7.11, 46.93], 'Sion': [7.36, 46.23],
  'Delémont': [7.34, 47.36], 'Bienne': [7.25, 47.14], 'Berne': [7.45, 46.95], 'Bâle': [7.59, 47.56], 'Zurich': [8.54, 47.37],
  'Lucerne': [8.31, 47.05], 'Saint-Gall': [9.38, 47.42], 'Coire': [9.53, 46.85], 'Saint-Moritz': [9.84, 46.49], 'Disentis': [8.85, 46.7],
  'Scuol': [10.3, 46.8], 'Poschiavo': [10.06, 46.32], 'Bellinzone': [9.02, 46.19], 'Locarno': [8.8, 46.17], 'Lugano': [8.95, 46.0],
}
const { ckx, minX, maxY, K } = geo.proj
const project = ([lon, lat]) => [(lon * ckx - minX) * K, (maxY - lat) * K]

// ------------------------------------------------------------------ thèmes
const THEMES = {
  night: { bg: '#0E1A33', card: '#13244A', land: '#2A3F6B', line: '#9FB3DC', lake: '#0E1A33', ink: '#FFFFFF', halo: '#0E1A33', accent: '#FFC93C', soft: '#B9C6E4', veil: 0.66 },
  paper: { bg: '#FFF6E9', card: '#FFFDF8', land: '#E7DCCB', line: '#9C8B76', lake: '#BFE3F5', ink: '#2B2118', halo: '#FFF6E9', accent: '#E4572E', soft: '#7A6A5C', veil: 0.7 },
}
export const THEME_NAMES = Object.keys(THEMES)
export const SCENE_TYPES = ['hook', 'map', 'final']

// ------------------------------------------------------------------ géométrie
const bboxOf = (ds) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const d of ds) {
    const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
    for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]) }
  }
  return { x0, y0, x1, y1 }
}
const ALL = { x0: 0, y0: 0, x1: MAP_W, y1: MAP_H }

/** Éléments à colorer pour une sélection { langs | cantons | districts }. */
function pick(sel) {
  const out = []
  for (const code of sel.cantons ?? []) { const c = CANTONS.get(code); out.push({ ref: `c${c.id}`, d: c.d, lang: null }) }
  for (const d of DISTRICTS) if ((sel.langs ?? []).includes(d.lang) || (sel.districts ?? []).includes(d.id)) out.push({ ref: `d${d.id}`, d: d.d, lang: d.lang })
  return out
}
const hasSel = (sel) => (sel.langs?.length ?? 0) + (sel.cantons?.length ?? 0) + (sel.districts?.length ?? 0) > 0

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

// ------------------------------------------------------------------ validation
export function validate(b) {
  checkCommon(b, name)
  if (b.map != null && b.map !== 'suisse') throw briefError(b, 'map', '« suisse » est la seule carte disponible')
  if (b.theme && !THEMES[b.theme]) throw briefError(b, 'theme', `${THEME_NAMES.join(' | ')} attendu`)
  if (b.brand?.color && !/^#[0-9A-Fa-f]{6}$/.test(b.brand.color)) throw briefError(b, 'brand.color', '#RRGGBB attendu')
  checkText(b, 'brand.name', b.brand?.name, { required: false, max: 40 })
  const sc = b.scenes
  if (!Array.isArray(sc) || sc.length < 2 || sc.length > 12) throw briefError(b, 'scenes', '2 à 12 scènes')
  if (sc[0].type !== 'hook') throw briefError(b, 'scenes[0]', 'la première scène est une accroche (type « hook »)')
  if (sc.at(-1).type !== 'final') throw briefError(b, `scenes[${sc.length - 1}]`, 'la dernière scène est un carton final (type « final »)')
  const checkSel = (w, sel) => {
    for (const l of sel.langs ?? []) if (!LANGS[l]) throw briefError(b, `${w}.langs`, `${Object.keys(LANGS).join(' | ')} attendu (« ${l} »)`)
    for (const c of sel.cantons ?? []) if (!CANTONS.has(c)) throw briefError(b, `${w}.cantons`, `code de canton inconnu : « ${c} » (GE, VD, GR…)`)
    for (const d of sel.districts ?? []) if (!DISTRICTS.some((x) => x.id === d)) throw briefError(b, `${w}.districts`, `numéro de district inconnu : ${d}`)
  }
  sc.forEach((s, i) => {
    const w = `scenes[${i}]`
    if (!SCENE_TYPES.includes(s.type)) throw briefError(b, `${w}.type`, `${SCENE_TYPES.join(' | ')} attendu`)
    checkText(b, `${w}.text`, s.text, { max: 120 })
    checkText(b, `${w}.sub`, s.sub, { required: false, max: 80 })
    if (s.duration != null && !(s.duration >= 2.5 && s.duration <= 14)) throw briefError(b, `${w}.duration`, 'entre 2,5 et 14 s')
    if (s.focus && s.focus !== 'all') checkSel(`${w}.focus`, s.focus)
    highlightsOf(s).forEach((h, k) => {
      if (!hasSel(h)) throw briefError(b, `${w}.highlight[${k}]`, 'langs, cantons ou districts attendu')
      checkSel(`${w}.highlight[${k}]`, h)
      if (h.color != null && !/^#[0-9A-Fa-f]{6}$/.test(h.color)) throw briefError(b, `${w}.highlight[${k}].color`, '#RRGGBB attendu')
    })
    for (const [k, p] of (s.pins ?? []).entries()) {
      const label = typeof p === 'string' ? p : p.label
      if (typeof p === 'string' ? !CITIES[p] : !CITIES[p.city] && !(Array.isArray(p.at) && p.at.length === 2)) throw briefError(b, `${w}.pins[${k}]`, `ville connue (${Object.keys(CITIES).join(', ')}) ou { label, at: [lon, lat] }`)
      checkText(b, `${w}.pins[${k}].label`, label ?? p.city, { max: 24 })
      if (p.side && !['t', 'b', 'l', 'r'].includes(p.side)) throw briefError(b, `${w}.pins[${k}].side`, 't | b | l | r')
    }
    if (s.stat) { checkText(b, `${w}.stat.value`, s.stat.value, { max: 10 }); checkText(b, `${w}.stat.label`, s.stat.label, { required: false, max: 40 }) }
    if (s.word) checkText(b, `${w}.word.text`, s.word.text, { max: 24 })
    for (const k of ['stat', 'word']) if (s[k]?.lang && !LANGS[s[k].lang]) throw briefError(b, `${w}.${k}.lang`, `${Object.keys(LANGS).join(' | ')} attendu`)
    if (s.flag != null && s.flag !== 'ch') throw briefError(b, `${w}.flag`, '« ch » (drapeau suisse) attendu')
  })
  return b
}

/** Durée d'une scène : lecture (environ 3 mots/s) + temps du zoom + une pause par région colorée. */
export function sceneDuration(sc) {
  if (sc.duration) return sc.duration
  const n = words(sc.text, sc.sub, sc.stat?.label, sc.word?.text)
  if (sc.type === 'final') return clamp(2.4 + n * 0.3, 4, 7)
  if (sc.type === 'hook') return clamp(2 + n * 0.26 + highlightsOf(sc).length * 0.8, 3.4, 6)
  return clamp(1.5 + n * 0.26 + highlightsOf(sc).length * 0.7 + (sc.pins?.length ? 0.6 : 0), 3.6, 8)
}

// ------------------------------------------------------------------ construction
export function build(b) {
  const th = { ...THEMES[b.theme ?? 'night'] }
  if (b.brand?.color) th.accent = b.brand.color
  const anim = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const sc = b.scenes
  const durs = sc.map(sceneDuration)
  const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, v) => a + v, 0))
  const D = durs.reduce((a, v) => a + v, 0)
  const cams = sc.map(sceneCam)
  const MOVE = 1.1 // durée du zoom de caméra entre deux scènes
  const moveOf = (i) => (i === 0 ? 1.8 : sameCam(cams[i], cams[i - 1]) ? 0.3 : MOVE)

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
  const keyframes = [`@keyframes mapcam{${stops.join('')}}`]

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

  const layers = { highlights: [], pins: [] }, ui = []
  const keyTimes = []
  sc.forEach((s, i) => {
    const t0 = starts[i], dur = durs[i], last = i === sc.length - 1, move = moveOf(i)
    keyTimes.push(f(t0 + Math.min(dur - 0.3, move + 0.9)))

    // ---- régions colorées (balayage de gauche à droite), conservées jusqu'à la fin sauf keep:false
    highlightsOf(s).forEach((h, k) => {
      const at = t0 + (h.at ?? move + 0.2 + k * 0.9), items = pick(h).sort((p, q) => bboxOf([p.d]).x0 - bboxOf([q.d]).x0)
      const uses = items.map((p, n) => `<use href="#m-${p.ref}" fill="${fillOf(p, h.color)}" class="sc" style="${anim('fadeIn', 0.5, at + (n / items.length) * 0.7, 'ease-out')}"/>`).join('')
      const g = `<g stroke="${th.bg}" stroke-width="1">${uses}</g>`
      layers.highlights.push(h.keep === false ? sceneGroup(t0, dur, g) : g)
    })

    // ---- villes épinglées (en taille constante : on annule le zoom de la caméra)
    const pins = (s.pins ?? []).map((p, n) => {
      const o = typeof p === 'string' ? { city: p } : p
      const [x, y] = project(o.at ?? CITIES[o.city]), label = o.label ?? o.city, side = o.side ?? 't'
      const SZ = 38, off = 24
      const w = textWidth(label, 'en', SZ)
      const tb = textBlock(label, {
        x: side === 'r' ? off : side === 'l' ? -off : 0, anchor: side === 'r' ? 'start' : side === 'l' ? 'end' : 'middle',
        top: side === 't' ? -off - SZ * 0.9 : side === 'b' ? off : -SZ * 0.43, max: SZ, min: SZ, maxLines: 1, width: Math.ceil(w) + 8,
        fill: th.ink, halo: th.halo, halo_k: 0.2,
      })
      const d = t0 + move + 0.3 + n * 0.35
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

    // ---- bas : mot / chiffre / légende / drapeau, empilés et centrés dans la zone libre sous la carte
    const bottom = []
    const put = (h, render) => bottom.push({ h, render })
    const delay = t0 + (last ? 0.9 : move + 0.4)
    if (s.flag === 'ch') put(150, (y) => `<g transform="translate(540 ${f(y + 75)})"><g class="pop" style="${anim('pop', 0.6, t0 + 0.7)}"><rect x="-75" y="-75" width="150" height="150" rx="18" fill="#E5322D"/><path d="M -12 -48 H 12 V -12 H 48 V 12 H 12 V 48 H -12 V 12 H -48 V -12 H -12 Z" fill="#fff"/></g></g>`)
    if (s.word) {
      const col = s.word.lang ? LANGS[s.word.lang].color : th.accent
      const sz = fitSize(s.word.text, { kind: 'en', max: 112, width: 900 })
      put(sz * 0.95, (y) => textBlock(s.word.text, { top: y, max: sz, min: sz, maxLines: 1, fill: col, halo: th.halo, halo_k: 0.16, anim: () => anim('pop', 0.6, delay) }).svg)
    }
    if (s.stat) {
      const col = s.stat.lang ? LANGS[s.stat.lang].color : th.accent
      const vs = fitSize(s.stat.value, { kind: 'en', max: 76, width: 380 }), pw = textWidth(s.stat.value, 'en', vs) + 76, H = 108
      const ls = s.stat.label ? fitSize(s.stat.label, { kind: 'en', max: 46, min: 30, width: 920 - pw - 24 }) : 0
      const lw = s.stat.label ? textWidth(s.stat.label, 'en', ls) : 0
      const x0 = 540 - (pw + (lw ? 24 + lw : 0)) / 2
      put(H, (y) => `<g style="${anim('pop', 0.6, delay + 0.15)}" class="pop"><rect x="${f(x0)}" y="${f(y)}" width="${f(pw)}" height="${H}" rx="54" fill="${col}"/>
      ${textBlock(s.stat.value, { x: x0 + pw / 2, top: y + H / 2 - vs * 0.43, max: vs, min: vs, maxLines: 1, width: pw, fill: '#fff', halo: col, halo_k: 0 }).svg}
      ${lw ? textBlock(s.stat.label, { x: x0 + pw + 24, anchor: 'start', top: y + H / 2 - ls * 0.43, max: ls, min: ls, maxLines: 1, width: lw + 8, fill: th.ink, halo: th.halo, halo_k: 0.14 }).svg : ''}</g>`)
    }
    if (s.legend) {
      const keys = ['de', 'fr', 'it', 'rm'], SZ = 40
      put(2 * 62 + 8, (y) => keys.map((k, n) => {
        const x = n % 2 ? 560 : 130, yy = y + Math.floor(n / 2) * 70
        return `<g style="${anim('up', 0.4, delay + n * 0.15, 'ease-out')}"><circle cx="${x}" cy="${f(yy + 31)}" r="20" fill="${LANGS[k].color}"/>${textBlock(LANGS[k].name, { x: x + 36, anchor: 'start', top: yy + 31 - SZ * 0.43, max: SZ, min: SZ, maxLines: 1, width: 360, fill: th.ink, halo: th.halo, halo_k: 0.14 }).svg}</g>`
      }).join(''))
    }
    if (last && b.brand?.name) put(96, (y) => `<g class="pop" style="${anim('pop', 0.6, t0 + 1.2)}"><rect x="290" y="${f(y)}" width="500" height="96" rx="48" fill="${th.accent}"/>
      ${textBlock(b.brand.name, { max: 48, maxLines: 1, width: 440, top: y + 24, fill: '#fff', halo: th.accent, halo_k: 0, attrs: role }).svg}</g>`)
    const gap = 26, zoneTop = last ? 1000 : 1235, zoneBottom = SAFE.bottom - 10
    const total = bottom.reduce((a, p) => a + p.h, 0) + gap * Math.max(0, bottom.length - 1)
    let y = last ? zoneTop : Math.min(zoneTop + 20, (zoneTop + zoneBottom) / 2 - total / 2 + 10)
    const bottomSvg = bottom.map((p) => { const out = p.render(y); y += p.h + gap; return out }).join('\n    ')

    const veil = last ? `<rect x="-200" y="-200" width="1480" height="2320" fill="${th.bg}" opacity="${th.veil}" class="sc" style="${anim('fadeIn', 0.8, t0, 'ease-out')}"/>` : ''
    ui.push(sceneGroup(t0, dur, `${veil}${topSvg}\n    ${bottomSvg}`, { last }))
  })

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
  ${ui.join('\n  ')}`
  const svg = svgDocument({ title: b.title ?? sc[0].text, format: name, id: b.id, duration: D, defs, keyframes, body })
  return { svg, script: { id: b.id, duration: f(D), lines: [], sfx: [] }, duration: f(D), keyTimes }
}
