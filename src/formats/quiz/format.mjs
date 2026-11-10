// Format « quiz » : questions à choix (2 à 4, illustrés par la bibliothèque), compte à rebours,
// révélation de la bonne réponse, explication, carton final. Bruitages prévus dans script.json (tick, ding…).
import { RAINBOW, anim as kanim, esc, rainbow } from '../../kit/core.mjs'
import { SAFE, sceneGroup, svgDocument } from '../../kit/document.mjs'
import { scenery } from '../../kit/scenery.mjs'
import { briefError, checkArt, checkCommon, checkText, drawArt, f, textBlock } from '../common.mjs'

export const name = 'quiz'
export const description = 'Quiz : question, 2 à 4 choix illustrés, compte à rebours, révélation, explication'

const THEMES = {
  kids: { set: 'day', ink: '#3B2A20', halo: '#FFFFFF', accent: '#8E5BD9', soft: '#7A6A5C', card: '#FFFFFF', crayon: true, rainbow: true },
  warm: { set: 'paper', ink: '#2B2118', halo: '#FFF6E9', accent: '#E4572E', soft: '#7A6A5C', card: '#FFFFFF', crayon: false },
  night: { set: 'night', ink: '#FFFFFF', halo: '#1B2440', accent: '#FFC93C', soft: '#D5DAEA', card: '#FFFFFF', crayon: true },
}
const LETTERS = ['A', 'B', 'C', 'D']
const TITLE = 2.8, OUTRO = 3.6

export function validate(b) {
  checkCommon(b, name)
  if (b.theme && !THEMES[b.theme]) throw briefError(b, 'theme', `${Object.keys(THEMES).join(' | ')} attendu`)
  checkText(b, 'title', b.title, { max: 60 })
  checkText(b, 'sub', b.sub, { required: false, max: 80 })
  if (b.countdown != null && !(b.countdown >= 2 && b.countdown <= 6)) throw briefError(b, 'countdown', 'entre 2 et 6 s')
  if (!Array.isArray(b.questions) || b.questions.length < 1 || b.questions.length > 8) throw briefError(b, 'questions', '1 à 8 questions')
  b.questions.forEach((q, i) => {
    const w = `questions[${i}]`
    checkText(b, `${w}.q`, q.q, { max: 90 })
    checkText(b, `${w}.explain`, q.explain, { required: false, max: 90 })
    if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 4) throw briefError(b, `${w}.choices`, '2 à 4 choix')
    q.choices.forEach((c, k) => {
      if (!c.art && !c.label) throw briefError(b, `${w}.choices[${k}]`, 'un dessin (art) et/ou un texte (label)')
      checkArt(b, `${w}.choices[${k}].art`, c.art)
      checkText(b, `${w}.choices[${k}].label`, c.label, { required: false, max: 30 })
    })
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) throw briefError(b, `${w}.answer`, `indice de 0 à ${q.choices.length - 1}`)
  })
  checkText(b, 'outro.text', b.outro?.text, { required: false, max: 40 })
  checkText(b, 'outro.sub', b.outro?.sub, { required: false, max: 80 })
  return b
}

/** Cases des choix : (x, y) du centre, largeur, hauteur. */
function slots(n) {
  if (n === 2) return [[290, 930], [790, 930]].map(([x, y]) => ({ x, y, w: 420, h: 520 }))
  if (n === 3) return [[205, 930], [540, 930], [875, 930]].map(([x, y]) => ({ x, y, w: 300, h: 440 }))
  return [[290, 760], [790, 760], [290, 1130], [790, 1130]].map(([x, y]) => ({ x, y, w: 420, h: 340 }))
}

export const questionDuration = (b) => 1.6 + (b.countdown ?? 3) + 2.8

export function build(b) {
  const th = THEMES[b.theme ?? 'kids']
  const set = scenery(th.set)
  const anim = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const cd = b.countdown ?? 3, QD = questionDuration(b)
  const sfx = [], fx = (t, kind) => sfx.push({ t: f(t), kind })
  const keyTimes = [1.2]
  const groups = []
  const head = (s, t0, o = {}) => textBlock(s, { top: SAFE.top + 40, max: 92, maxLines: 3, fill: th.ink, halo: th.halo, ...o, anim: (i) => anim('pop', 0.6, t0 + i * 0.1) })

  // titre (accroche)
  const tt = head(b.title, 0.1, { max: 130, top: 640, attrs: 'data-role="hook"', tspans: th.rainbow ? (l, i) => rainbow(l, i * 2) : undefined })
  groups.push(sceneGroup(0, TITLE, `
    ${tt.svg}
    ${b.sub ? textBlock(b.sub, { top: 660 + tt.height + 40, max: 60, maxLines: 2, fill: th.accent, halo: th.halo, anim: () => anim('up', 0.5, 0.6, 'ease-out') }).svg : ''}
    <text class="en" x="540" y="1290" text-anchor="middle" font-size="96" fill="${th.accent}" stroke="${th.halo}" stroke-width="12" style="${anim('up', 0.5, 1.0, 'ease-out')}">${b.questions.length} × ?</text>`))
  fx(0.1, 'whoosh')

  b.questions.forEach((q, i) => {
    const t0 = TITLE + i * QD, tr = t0 + 1.6 + cd
    keyTimes.push(f(tr - 0.6), f(tr + 1.4))
    fx(t0, 'whoosh'); for (let k = 0; k < cd; k++) fx(t0 + 1.6 + k, 'tick'); fx(tr, 'ding')
    const qb = head(q.q, t0 + 0.1)
    const sl = slots(q.choices.length)
    const cards = q.choices.map((c, k) => {
      const s = sl[k], ok = k === q.answer, d = t0 + 0.6 + k * 0.15
      const artPx = Math.min(s.w - 60, s.h - (c.label ? 150 : 60))
      const artY = c.label ? s.y - s.h / 2 + 30 + artPx / 2 : s.y
      const label = c.label ? textBlock(c.label, { x: s.x, top: c.art ? s.y + s.h / 2 - 110 : s.y - 40, width: s.w - 40, max: c.art ? 56 : 84, maxLines: 2, fill: th.ink, halo: th.card }).svg : ''
      return `<g class="pop" style="${anim('pop', 0.5, d)}">
      <g class="fx" style="${ok ? anim('glow', 0.6, tr, 'ease-in-out', 'none') + ';animation-iteration-count:3' : anim('dim', 0.4, tr, 'ease-out', 'forwards')}">
        <rect x="${f(s.x - s.w / 2)}" y="${f(s.y - s.h / 2)}" width="${s.w}" height="${s.h}" rx="44" fill="${th.card}" stroke="${RAINBOW[(i + k) % RAINBOW.length]}" stroke-width="12"/>
        ${c.art ? drawArt(c.art, s.x, artY, artPx, { crayon: th.crayon }) : ''}
        ${label}
        <circle cx="${f(s.x - s.w / 2 + 44)}" cy="${f(s.y - s.h / 2 + 44)}" r="34" fill="${th.accent}"/><text class="en" x="${f(s.x - s.w / 2 + 44)}" y="${f(s.y - s.h / 2 + 60)}" text-anchor="middle" font-size="44" fill="#fff" stroke-width="0">${LETTERS[k]}</text>
      </g>
      ${ok ? `<g class="pop" style="${anim('pop', 0.5, tr)}"><circle cx="${f(s.x + s.w / 2 - 40)}" cy="${f(s.y - s.h / 2 + 40)}" r="50" fill="#3DBE5A" stroke="#fff" stroke-width="8"/><path d="M ${f(s.x + s.w / 2 - 64)} ${f(s.y - s.h / 2 + 40)} l 17 19 l 32 -38" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>` : ''}
    </g>`
    }).join('\n    ')
    const bar = `<g style="${anim('fadeIn', 0.3, t0 + 1.5, 'ease-out')}"><rect x="190" y="1372" width="700" height="26" rx="13" fill="${th.soft}" opacity=".3"/>
      <rect x="190" y="1372" width="700" height="26" rx="13" fill="${th.accent}" style="transform-box:fill-box;transform-origin:left center;${anim('bar', cd, t0 + 1.6, 'linear')}"/></g>`
    const ans = q.choices[q.answer]
    const explain = textBlock(q.explain ?? `${LETTERS[q.answer]} · ${ans.label ?? ''}`.trim(), { top: 1330, max: 58, maxLines: 2, fill: th.ink, halo: th.halo, anim: () => anim('up', 0.5, tr + 0.4, 'ease-out') })
    groups.push(sceneGroup(t0, QD, `
    ${qb.svg}
    ${cards}
    <g style="${anim('out', 0.25, tr, 'linear', 'forwards')}">${bar}</g>
    ${explain.svg}`))
  })

  // carton final
  const tO = TITLE + b.questions.length * QD
  keyTimes.push(f(tO + 1.8))
  fx(tO + 0.2, 'yay')
  const ot = head(b.outro?.text ?? 'Great job!', tO + 0.2, { max: 130, top: 700, attrs: 'data-role="final"', tspans: th.rainbow ? (l, i) => rainbow(l, i * 2 + 1) : (l) => esc(l) })
  const stars = [0, 1, 2].map((k) => `<g class="pop" style="${anim('pop', 0.5, tO + 0.6 + k * 0.2)}"><g transform="translate(${360 + k * 180} 560)"><path d="${'M0 -60 L17.6 -24.3 L57.1 -18.5 L28.5 9.3 L35.3 48.5 L0 30 L-35.3 48.5 L-28.5 9.3 L-57.1 -18.5 L-17.6 -24.3Z'}" fill="#FFC93C" stroke="#3B2A20" stroke-width="6" stroke-linejoin="round"/></g></g>`).join('')
  groups.push(sceneGroup(tO, OUTRO, `
    ${stars}
    ${ot.svg}
    ${b.outro?.sub ? textBlock(b.outro.sub, { top: 720 + ot.height + 40, max: 60, maxLines: 2, fill: th.accent, halo: th.halo, attrs: 'data-role="final"', anim: () => anim('up', 0.5, tO + 0.8, 'ease-out') }).svg : ''}`, { last: true }))

  const duration = f(tO + OUTRO)
  const svg = svgDocument({ title: b.title, format: name, id: b.id, duration, defs: set.defs, body: `  ${set.body}\n  ${groups.join('\n  ')}` })
  return { svg, script: { id: b.id, duration, lines: [], sfx }, duration, keyTimes }
}
