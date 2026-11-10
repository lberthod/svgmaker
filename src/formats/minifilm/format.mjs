// Format « minifilm » : une petite histoire en plans (3 à 8), avec Mali, décors, accessoires de la
// bibliothèque, gags, caméra, répliques sous-titrées. Voix réelles et bouche synchronisée en deux passes :
//   svgmaker new brief.json → python3 examples/mali-english-th/audio.py out/<id> → svgmaker new brief.json → render
import { anim as kanim } from '../../kit/core.mjs'
import { cameraMoves, cameraStyle, punch, quake } from '../../kit/actors/camera.mjs'
import { GAG_CSS, GAG_TYPES, runGag } from '../../kit/actors/gags.mjs'
import { MALI_CSS, createMali, maliParts } from '../../kit/actors/mali.mjs'
import { createScene } from '../../kit/actors/scene.mjs'
import { sceneGroup, svgDocument } from '../../kit/document.mjs'
import { art as libArt } from '../../kit/library.mjs'
import { SCENERY, scenery } from '../../kit/scenery.mjs'
import { fitBlock, kindOf } from '../../kit/text.mjs'
import { LINE, briefError, checkArt, checkCommon, checkText, f, textBlock } from '../common.mjs'

export const name = 'minifilm'
export const description = 'Petite histoire en plans : Mali, décors, accessoires, gags, caméra, voix et sous-titres'

const GROUND = 1365, MALI_K = 1.3
const END = 3.8 // carton de fin : ≥ 2,8 s lisible après son entrée
export const ROLES = ['narrator', 'mali_en', 'mali_th'] // voix d'audio.py (Mali)
export const ACTIONS = { wave: ['trunk', 1.6], point: ['trunk', 1.3], dance: ['shake', 1.2], shake: ['shake', 0.8], tilt: ['shake', 1.4], lean: ['shake', 1.2], listen: ['ear', 1.8], glasses: ['glasses', 3], dizzy: ['dizzy', 1.6], hop: [null, 0.5], bigjump: [null, 0.7] }
const ENTERS = ['pop', 'drop', 'fly', 'rise', 'none']
const IDLES = { wiggle: 'wiggleIdle', bounce: 'bounceIdle', swing: 'swingIdle', swim: 'swimIdle', none: '' }
const EYES = ['happy', 'wide', 'dizzy', 'squint'], MOUTHS = ['o', 'laugh']

export function validate(b) {
  checkCommon(b, name)
  checkText(b, 'title.en', b.title?.en, { max: 40 })
  checkText(b, 'title.th', b.title?.th, { required: false, max: 40 })
  checkText(b, 'end', b.end, { required: false, max: 30 })
  if (!Array.isArray(b.shots) || b.shots.length < 1 || b.shots.length > 8) throw briefError(b, 'shots', '1 à 8 plans')
  if (!(b.shots.at(-1).duration >= 4.5)) throw briefError(b, `shots[${b.shots.length - 1}].duration`, 'le dernier plan dure au moins 4,5 s (carton de fin)')
  let x = -280
  b.shots.forEach((s, i) => {
    const w = `shots[${i}]`
    if (!(s.duration >= 2 && s.duration <= 15)) throw briefError(b, `${w}.duration`, 'entre 2 et 15 s')
    if (s.set && !SCENERY.includes(s.set)) throw briefError(b, `${w}.set`, `${SCENERY.join(' | ')} attendu`)
    const m = s.mali ?? {}
    if (m.x != null && !(m.x >= 120 && m.x <= 700)) throw briefError(b, `${w}.mali.x`, 'entre 120 et 700 (Mali regarde à droite, l’objet est à droite)')
    if (m.move && !['stay', 'walk', 'cut', 'walk-out'].includes(m.move)) throw briefError(b, `${w}.mali.move`, 'stay | walk | cut | walk-out')
    if (m.move === 'walk' && m.x != null && m.x < x) throw briefError(b, `${w}.mali`, 'Mali ne marche que vers la droite : utiliser « cut » pour la replacer')
    if (m.x != null) x = m.x
    for (const [k, l] of (s.lines ?? []).entries()) {
      if (!ROLES.includes(l.role)) throw briefError(b, `${w}.lines[${k}].role`, `${ROLES.join(' | ')} attendu`)
      checkText(b, `${w}.lines[${k}].text`, l.text, { max: 70 })
      if (!(l.at >= 0 && l.at < s.duration)) throw briefError(b, `${w}.lines[${k}].at`, `entre 0 et ${s.duration}`)
    }
    for (const [k, a] of (s.actions ?? []).entries()) {
      if (a.do && !ACTIONS[a.do]) throw briefError(b, `${w}.actions[${k}].do`, `${Object.keys(ACTIONS).join(' | ')} attendu`)
      if (a.eyes && !EYES.includes(a.eyes)) throw briefError(b, `${w}.actions[${k}].eyes`, EYES.join(' | '))
      if (a.mouth && !MOUTHS.includes(a.mouth)) throw briefError(b, `${w}.actions[${k}].mouth`, MOUTHS.join(' | '))
    }
    for (const [k, p] of (s.props ?? []).entries()) {
      checkArt(b, `${w}.props[${k}].art`, p.art)
      if (p.enter && !ENTERS.includes(p.enter)) throw briefError(b, `${w}.props[${k}].enter`, ENTERS.join(' | '))
      if (p.idle && !(p.idle in IDLES)) throw briefError(b, `${w}.props[${k}].idle`, Object.keys(IDLES).join(' | '))
    }
    if (s.gag) {
      checkArt(b, `${w}.gag.art`, s.gag.art)
      if (!GAG_TYPES.includes(s.gag.type)) throw briefError(b, `${w}.gag.type`, GAG_TYPES.join(' | '))
    }
  })
  return b
}

export function build(b, voice = {}) {
  const D = b.shots.reduce((a, s) => a + s.duration, 0)
  const s = createScene({ voice })
  const anim = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const used = new Set() // dessins référencés (dans <defs>)
  const art = (id, scale) => { used.add(id); return `<g transform="scale(${scale})" filter="url(#crayon)"><use href="#art-${id}"/></g>` }

  // ------------------------------------------------ trajectoire de Mali (points [t, x], coupes franches)
  const pts = [[0, -280]]
  let x = -280
  const starts = []
  let t = 0
  for (const sh of b.shots) starts.push(t), (t += sh.duration)
  const actor = createMali(s, { x: 290, ground: GROUND, k: MALI_K, duration: D })
  b.shots.forEach((sh, i) => {
    const t0 = starts[i], m = sh.mali ?? {}, nx = m.x ?? x
    if (m.move === 'cut' || (i === 0 && m.move !== 'walk')) { pts.push([t0, x], [t0 + 0.001, nx]); x = nx }
    else if (nx !== x) { // marche jusqu'à nx
      const dur = Math.min(sh.duration - 0.5, Math.max(0.8, Math.abs(nx - x) / 260))
      pts.push([t0, x], [t0 + dur, nx]); actor.walk(t0, dur); x = nx
    }
    if (m.move === 'walk-out') {
      const dur = Math.min(2.4, sh.duration - 0.3), tw = t0 + sh.duration - dur
      pts.push([tw, x], [t0 + sh.duration, 1350]); actor.walk(tw, dur); x = 1350
    }
  })
  pts.push([D, x])
  s.keyframe(`@keyframes maliPath{${pts.map(([tt, xx]) => `${f((tt / D) * 100)}%{transform:translate(${f(xx)}px,${GROUND}px)}`).join('')}}`)

  // ------------------------------------------------ plans
  const stage = [], ui = [], keyTimes = [], setDefs = new Set()
  const actorAt = (tt) => { let cur = -280; for (const [pt, px] of pts) if (pt <= tt) cur = px; return cur }
  b.shots.forEach((sh, i) => {
    const t0 = starts[i], set = scenery(sh.set ?? b.shots[i - 1]?.set ?? 'day', { ground: GROUND })
    keyTimes.push(f(t0 + sh.duration * 0.6))
    // une réplique attend la fin de la précédente (+0,15 s) : voix et sous-titres ne se chevauchent jamais
    for (const l of sh.lines ?? []) {
      const prev = s.lines.at(-1)
      s.say(Math.max(t0 + l.at, prev ? prev.t + s.durOf(prev) + 0.15 : 0), l.role, l.text)
    }
    for (const a of sh.actions ?? []) {
      const at = t0 + (a.at ?? 0)
      if (a.do === 'hop' || a.do === 'bigjump') actor.hop(at, a.do === 'bigjump')
      else if (a.do) { const [layer, d] = ACTIONS[a.do]; s.win(layer, a.do, at, a.dur ?? d, a.do === 'glasses' ? 'linear' : 'ease-in-out') }
      if (a.eyes || a.mouth) actor.expr(at, a.dur ?? 1.2, a.eyes ?? null, a.mouth ?? null)
      if (a.sfx) s.fx(at, a.sfx)
    }
    for (const c of sh.camera ?? []) {
      if (c.quake) quake(s, t0 + c.at, c.dur ?? 0.4, c.quake)
      else punch(s, t0 + c.at, c.dur ?? 1.5, c.x ?? actorAt(t0 + c.at) + 160, c.y ?? 1000, c.k ?? 1.12)
    }
    const props = (sh.props ?? []).map((p, k) => {
      const d = t0 + (p.at ?? 0.3), px = p.size ?? 300, sc = f(px / 500)
      const enter = p.enter ?? 'pop'
      const path = enter === 'drop' ? s.path(`drop${i}_${k}`, [[0, 0, -900], [70, 0, 20], [85, 0, -30], [100, 0, 0]])
        : enter === 'fly' ? s.path(`fly${i}_${k}`, [[0, -1200, -300, -20], [100, 0, 0, 0]])
        : enter === 'rise' ? s.path(`rise${i}_${k}`, [[0, 0, 600, 0, 1, 0], [100, 0, 0, 0, 1, 1]]) : null
      if (enter !== 'none') s.fx(d, enter === 'pop' ? 'pop' : enter === 'drop' ? 'boing' : 'whoosh')
      const style = enter === 'none' ? '' : enter === 'pop' ? anim('pop', 0.6, d) : anim(path, 0.9, d, 'ease-out')
      return `<g transform="translate(${p.x} ${p.y})"><g class="${enter === 'pop' ? 'pop' : ''}" style="${style}"><g class="${IDLES[p.idle ?? 'swing']}">${art(p.art, sc)}</g></g></g>`
    }).join('')
    // l'acteur « vu » à sa position au moment du gag (tête, parties du corps) ; ses calques restent partagés
    const gx = sh.gag ? actorAt(t0 + (sh.gag.at ?? 0.5)) : 0
    const view = { ...actor, x: gx, head: { x: gx + 125, y: GROUND - 345 }, parts: maliParts(gx, GROUND, MALI_K) }
    const gag = sh.gag ? runGag({ s, actor: view, art, anim, obj: { x: sh.gag.x ?? 825, y: sh.gag.y ?? 1110 }, scene: sh.duration },
      { art: sh.gag.art, color: sh.gag.color ?? '#8E5BD9', gag: { ...sh.gag, type: sh.gag.type } }, t0 + (sh.gag.at ?? 0.5)) : ''
    stage.push(sceneGroup(t0, sh.duration, `${set.body}${props}${gag}`, { last: i === b.shots.length - 1 }))
    setDefs.add(set.defs)
  })

  // ------------------------------------------------ sous-titres (hors caméra), un par réplique
  for (const [k, l] of s.lines.entries()) {
    const next = s.lines[k + 1]
    const kind = kindOf(l.text), dur = Math.min(s.durOf(l) + 0.4, next ? next.t - l.t - 0.05 : Infinity)
    const fb = fitBlock(l.text, { kind, max: 54, min: 30, width: 820, maxLines: 2 })
    const h = fb.lines.length * fb.size * LINE[kind] + 34
    ui.push(sceneGroup(l.t, dur, `<rect x="110" y="${f(1500 - h)}" width="860" height="${f(h)}" rx="${f(Math.min(40, h / 2))}" fill="#000" opacity=".55"/>
    ${textBlock(l.text, { top: 1500 - h + 22, max: fb.size, min: fb.size, maxLines: 2, width: 820, fill: l.role === 'narrator' ? '#FFE07A' : '#fff', halo: '#000', halo_k: 0.08 }).svg}`))
  }

  // ------------------------------------------------ titre (accroche) et fin
  const tb = textBlock(b.title.en, { top: 300, max: 120, maxLines: 2, fill: '#3B2A20', halo: '#fff', attrs: 'data-role="hook"', anim: (i) => anim('pop', 0.6, 0.15 + i * 0.12) })
  ui.unshift(sceneGroup(0, Math.min(3.2, b.shots[0].duration), `${tb.svg}
    ${b.title.th ? textBlock(b.title.th, { top: 320 + tb.height + 20, max: 64, maxLines: 1, fill: '#1E9BE0', halo: '#fff', anim: () => anim('up', 0.5, 0.6, 'ease-out') }).svg : ''}`))
  const tEnd = D - END
  ui.push(sceneGroup(tEnd, END, textBlock(b.end ?? 'The end', { top: 330, max: 130, maxLines: 1, fill: '#3B2A20', halo: '#fff', attrs: 'data-role="final"', anim: () => anim('pop', 0.6, tEnd + 0.1) }).svg, { last: true }))
  keyTimes.unshift(1.5); keyTimes.push(f(D - 0.5))

  const maliSvg = actor.draw()
  const defs = [...setDefs, ...[...used].map((id) => `<g id="art-${id}">${libArt(id)}</g>`)].join('\n    ')
  const svg = svgDocument({
    title: `${b.title.en}${b.title.th ? ' · ' + b.title.th : ''}`, format: name, id: b.id, duration: D, defs,
    css: MALI_CSS + GAG_CSS, keyframes: s.keyframes,
    body: `  <g style="${cameraStyle(s)}">
  ${scenery(b.shots[0].set ?? 'day', { ground: GROUND }).body}
  ${stage.join('\n  ')}
  ${maliSvg}
  ${s.front.join('')}
  </g>
  ${ui.join('\n  ')}`,
  })
  return { svg, script: s.script(b.id, D), duration: f(D), keyTimes, info: { lines: s.lines.length, sfx: s.sfx.length, camera: cameraMoves(s) } }
}

