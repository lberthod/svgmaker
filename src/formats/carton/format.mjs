// Format « carton » : typographie animée en cartons successifs (astuce, chiffre clé, liste, citation, offre).
// Brief : voir STYLE.md. Pas de voix : une musique peut être ajoutée au rendu (--music).
import { RAINBOW, anim as kanim, esc, rainbow } from '../../kit/core.mjs'
import { SAFE, sceneGroup, svgDocument } from '../../kit/document.mjs'
import { scenery } from '../../kit/scenery.mjs'
import { briefError, checkArt, checkCommon, checkText, clamp, drawArt, f, textBlock, words } from '../common.mjs'

export const name = 'carton'
export const description = 'Typographie animée : accroche, texte, chiffre clé, liste, citation, carton final'
export const CARD_TYPES = ['hook', 'text', 'stat', 'list', 'quote', 'final']

const THEMES = {
  warm: { set: 'paper', ink: '#2B2118', halo: '#FFF6E9', accent: '#E4572E', soft: '#7A6A5C', crayon: false },
  night: { set: 'ink', ink: '#FFFFFF', halo: '#141B2D', accent: '#FFC93C', soft: '#B9C2D9', crayon: false },
  kids: { set: 'day', ink: '#3B2A20', halo: '#FFFFFF', accent: '#8E5BD9', soft: '#7A6A5C', crayon: true, rainbow: true },
}
export const THEME_NAMES = Object.keys(THEMES)

export function validate(b) {
  checkCommon(b, name)
  if (b.theme && !THEMES[b.theme]) throw briefError(b, 'theme', `${THEME_NAMES.join(' | ')} attendu`)
  if (b.brand?.color && !/^#[0-9A-Fa-f]{6}$/.test(b.brand.color)) throw briefError(b, 'brand.color', '#RRGGBB attendu')
  checkText(b, 'brand.name', b.brand?.name, { required: false, max: 40 })
  const cards = b.cards
  if (!Array.isArray(cards) || cards.length < 2 || cards.length > 12) throw briefError(b, 'cards', '2 à 12 cartons')
  if (cards[0].type !== 'hook') throw briefError(b, 'cards[0]', 'le premier carton est une accroche (type « hook »)')
  if (cards.at(-1).type !== 'final') throw briefError(b, `cards[${cards.length - 1}]`, 'le dernier carton est un carton final (type « final »)')
  cards.forEach((c, i) => {
    const w = `cards[${i}]`
    if (!CARD_TYPES.includes(c.type)) throw briefError(b, `${w}.type`, `${CARD_TYPES.join(' | ')} attendu`)
    if (c.type === 'stat') checkText(b, `${w}.value`, c.value, { max: 12 })
    if (c.type === 'list') {
      checkText(b, `${w}.title`, c.title, { required: false, max: 60 })
      if (!Array.isArray(c.items) || c.items.length < 2 || c.items.length > 5) throw briefError(b, `${w}.items`, '2 à 5 éléments')
      c.items.forEach((it, k) => checkText(b, `${w}.items[${k}]`, it, { max: 60 }))
    } else checkText(b, `${w}.text`, c.text, { max: c.type === 'quote' ? 220 : 140 })
    checkText(b, `${w}.sub`, c.sub, { required: false, max: 80 })
    checkText(b, `${w}.by`, c.by, { required: false, max: 60 })
    checkArt(b, `${w}.art`, c.art)
    if (c.duration != null && !(c.duration >= 1.5 && c.duration <= 12)) throw briefError(b, `${w}.duration`, 'entre 1,5 et 12 s')
  })
  return b
}

/** Durée de lecture d'un carton (environ 3 mots/s, bornée), sauf si le brief la fixe. */
export function cardDuration(c) {
  if (c.duration) return c.duration
  const n = words(c.text, c.sub, c.title, c.by, ...(c.items ?? []), c.value)
  if (c.type === 'list') return clamp(1.4 + c.items.length * 0.9 + n * 0.12, 3, 8)
  if (c.type === 'final') return clamp(2.4 + n * 0.3, 4, 7) // ≥ 2,8 s lisible après l'animation d'entrée
  if (c.type === 'hook') return clamp(1.4 + n * 0.3, 2.2, 4.5)
  return clamp(1.6 + n * 0.32, 2.4, 7)
}

export function build(b) {
  const th = { ...THEMES[b.theme ?? 'warm'] }
  if (b.brand?.color) th.accent = b.brand.color
  const set = scenery(th.set)
  const anim = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const keyTimes = []
  let t = 0
  const groups = b.cards.map((c, idx) => {
    const dur = cardDuration(c), t0 = t
    t += dur
    keyTimes.push(f(t0 + Math.min(dur - 0.3, 1.6 + (c.type === 'list' ? c.items.length * 0.6 : 0))))
    const last = idx === b.cards.length - 1
    const role = c.type === 'hook' ? 'data-role="hook"' : last ? 'data-role="final"' : ''
    // pile verticale : dessin éventuel, puis les blocs de texte, centrée dans la zone sûre
    const parts = []
    const push = (h, render) => parts.push({ h, render })
    const gap = 36
    if (c.art) push(380, (y) => drawArt(c.art, 540, y + 190, 380, { crayon: th.crayon, extra: `class="pop" style="${anim('pop', 0.7, t0 + 0.05)}"` }))
    const rb = (line, i) => (th.rainbow && (c.type === 'hook' || c.type === 'final') ? rainbow(line, i * 3) : esc(line))
    const block = (s, o) => { const tb = textBlock(s, { fill: th.ink, halo: th.halo, ...o, top: 0 }); return { tb, o } }
    const addBlock = (s, o) => {
      const { tb } = block(s, o)
      push(tb.height, (y) => textBlock(s, { fill: th.ink, halo: th.halo, ...o, top: y }).svg)
    }
    if (c.type === 'hook' || c.type === 'final') {
      addBlock(c.text, { max: c.type === 'hook' ? 132 : 112, maxLines: 3, attrs: role, tspans: rb,
        anim: (i) => anim('pop', 0.6, t0 + 0.1 + i * 0.12) })
      if (c.sub) addBlock(c.sub, { max: 60, maxLines: 2, fill: th.accent, attrs: last ? role : '', anim: () => anim('up', 0.5, t0 + 0.55, 'ease-out') })
      if (last && b.brand?.name) push(96, (y) => `<g class="pop" style="${anim('pop', 0.6, t0 + 0.9)}"><rect x="290" y="${f(y)}" width="500" height="96" rx="48" fill="${th.accent}"/>
      ${textBlock(b.brand.name, { max: 48, maxLines: 1, width: 440, top: y + 24, fill: '#fff', halo: th.accent, halo_k: 0, attrs: role }).svg}</g>`)
    } else if (c.type === 'text') {
      addBlock(c.text, { max: 96, maxLines: 5, anim: (i) => anim('up', 0.5, t0 + 0.1 + i * 0.15, 'ease-out') })
      if (c.sub) addBlock(c.sub, { max: 54, maxLines: 2, fill: th.soft, anim: () => anim('up', 0.5, t0 + 0.8, 'ease-out') })
    } else if (c.type === 'stat') {
      const v = textBlock(c.value, { max: 280, maxLines: 1, top: 0, fill: th.accent, halo: th.halo })
      push(v.height + 28, (y) => {
        const tb = textBlock(c.value, { max: 280, maxLines: 1, top: y, fill: th.accent, halo: th.halo, anim: () => anim('pop', 0.7, t0 + 0.1) })
        return `${tb.svg}
      <rect x="${f(540 - 180)}" y="${f(y + tb.height + 8)}" width="360" height="14" rx="7" fill="${th.accent}" opacity=".35" style="transform-box:fill-box;transform-origin:left center;${anim('grow', 0.6, t0 + 0.5, 'ease-out')}"/>`
      })
      addBlock(c.text, { max: 72, maxLines: 3, anim: () => anim('up', 0.5, t0 + 0.7, 'ease-out') })
      if (c.sub) addBlock(c.sub, { max: 46, maxLines: 2, fill: th.soft, anim: () => anim('up', 0.5, t0 + 1.0, 'ease-out') })
    } else if (c.type === 'quote') {
      // guillemet dessiné (pas un <text> géant, dont la boîte recouvrirait la citation)
      push(120, (y) => `<g transform="translate(540 ${f(y + 60)})"><g class="pop" style="${anim('pop', 0.6, t0 + 0.05)}" fill="${th.accent}">${[-46, 46].map((dx) => `<path d="M ${dx + 30} -52 C ${dx - 20} -40 ${dx - 42} -10 ${dx - 40} 24 C ${dx - 40} 46 ${dx - 24} 58 ${dx - 6} 58 C ${dx + 14} 58 ${dx + 28} 44 ${dx + 28} 26 C ${dx + 28} 8 ${dx + 14} -4 ${dx - 4} -4 C ${dx - 2} -22 ${dx + 10} -36 ${dx + 34} -42 Z"/>`).join('')}</g></g>`)
      addBlock(c.text, { max: 76, maxLines: 6, anim: (i) => anim('fadeIn', 0.6, t0 + 0.3 + i * 0.12, 'ease-out') })
      if (c.by) addBlock(`— ${c.by}`, { max: 46, maxLines: 1, fill: th.soft, anim: () => anim('up', 0.5, t0 + 1.0, 'ease-out') })
    } else if (c.type === 'list') {
      if (c.title) addBlock(c.title, { max: 84, maxLines: 2, fill: th.accent, anim: () => anim('pop', 0.6, t0 + 0.1) })
      c.items.forEach((it, k) => {
        const d = t0 + 0.6 + k * 0.6
        const o = { max: 62, maxLines: 2, width: 700, x: 250, anchor: 'start' }
        const { tb } = block(it, o)
        push(Math.max(tb.height, 76), (y) => `<g style="${anim('left', 0.45, d, 'ease-out')}">
      <circle cx="190" cy="${f(y + 38)}" r="34" fill="${RAINBOW[k % RAINBOW.length]}"/><path d="M 174 ${f(y + 38)} l 11 12 l 22 -24" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      ${textBlock(it, { ...o, fill: th.ink, halo: th.halo, top: y + Math.max(0, (76 - tb.height) / 2) }).svg}</g>`)
      })
    }
    const total = parts.reduce((a, p) => a + p.h, 0) + gap * (parts.length - 1)
    let y = Math.max(SAFE.top + 40, (SAFE.top + SAFE.bottom) / 2 - total / 2)
    const content = parts.map((p) => { const s = p.render(y); y += p.h + gap; return s }).join('\n      ')
    return sceneGroup(t0, dur, `\n      ${content}\n    `, { last })
  })
  const duration = f(t)
  const svg = svgDocument({
    title: b.title ?? b.cards[0].text, format: name, id: b.id, duration, defs: set.defs,
    body: `  ${set.body}\n  ${groups.join('\n  ')}`,
  })
  return { svg, script: { id: b.id, duration, lines: [], sfx: [] }, duration, keyTimes }
}
