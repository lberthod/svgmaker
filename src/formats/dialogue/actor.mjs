// Format « dialogue » : un acteur = plusieurs poses du même personnage superposées (neutre, talk, surprised…),
// dont une seule est visible à la fois. La pose talk apparaît quand l'enveloppe RÉELLE de la voix dépasse un seuil ;
// sans voice.json elle bat à 0,32 s. Hors parole : pose neutre, clignement, respiration.
import { lipAnimations } from '../../kit/actors/lipsync.mjs'
import { ACTOR_ACTIONS } from './css.mjs'

/** `an(name, dur, delay, { ease, fill, iter })` → valeur de `animation:` (à joindre par des virgules). */
// Une animation « fill: none » qui démarre à 0 s n'est pas appliquée à l'image 0 par le rendu (Chromium, temps fixé
// à 0 alors que l'animation est en pause) : on la passe en « backwards » (aucun effet avant 0 s, la vidéo commence là).
export const animator = (f) => (name, dur, delay, { ease = 'ease-in-out', fill = 'both', iter = 1 } = {}) =>
  `${name} ${f(dur)}s ${ease} ${f(delay)}s ${iter === Infinity ? 'infinite' : iter} ${fill === 'none' && f(delay) <= 0 ? 'backwards' : fill}`

export const ENTER = { pop: ['pop', 0.6, 'cubic-bezier(.3,1.5,.5,1)'], drop: ['dgDrop', 0.9, 'ease-out'], rise: ['dgRise', 0.8, 'ease-out'], 'slide-left': ['dgSlideL', 0.7, 'ease-out'], 'slide-right': ['dgSlideR', 0.7, 'ease-out'], fade: ['fadeIn', 0.5, 'ease-out'] }
export const EXIT = { fade: 'out', pop: 'dgPopOut', drop: 'dgDropOut', 'slide-left': 'dgSlideLOut', 'slide-right': 'dgSlideROut' }

/** Keyframes d'ouverture de la pose talk pour une réplique (marche/arrêt, avec hystérésis), ou bat sans enveloppe. */
function talkOpacity(E, uid, i, l) {
  const { s, f } = E, v = s.voiceOf(l)
  if (!v || v.env.length < 2) return `dgBat 0.32s step-end ${f(l.t)}s ${Math.max(1, Math.ceil(s.durOf(l) / 0.32))}`
  const n = v.env.length, stops = []
  let open = false, last = null
  v.env.forEach((e, k) => {
    open = open ? e > 0.18 : e > 0.3
    if (+open !== last) { stops.push(`${f((k / (n - 1)) * 100)}%{opacity:${+open};animation-timing-function:step-end}`); last = +open }
  })
  s.keyframe(`@keyframes lo${uid}_${i}{${stops.join('')}}`)
  return `lo${uid}_${i} ${f(v.dur)}s linear ${f(l.t)}s`
}

/** Léger étirement du corps suivant l'enveloppe (la voix « porte » le personnage). */
function bodyBeat(E, uid, i, l) {
  const { s, f } = E, v = s.voiceOf(l)
  if (!v || v.env.length < 2) return null
  const n = v.env.length
  s.keyframe(`@keyframes lb${uid}_${i}{${v.env.map((e, k) => `${f((k / (n - 1)) * 100)}%{transform:scale(${f(1 + 0.012 * e)},${f(1 + 0.03 * e)})}`).join('')}}`)
  return `lb${uid}_${i} ${f(v.dur)}s linear ${f(l.t)}s`
}

const blinkSvg = (b, delay) => (b?.eyes ?? []).map(([x, y]) =>
  `<ellipse cx="${x}" cy="${y}" rx="${b.r}" ry="${b.r * 1.05}" fill="${b.color}" style="transform-box:fill-box;transform-origin:center;transform:scaleY(0);animation:dgBlink 3.9s linear ${delay}s infinite"/>`).join('')

/**
 * SVG d'un acteur dans un plan. a = { who, x, y, size, flip, enter, at, exit, exitAt, poses, do, badges, bleed, idle }.
 * lines = répliques de cet acteur dans le plan (s.lines). Retourne le <g> positionné (x, y = centre du dessin).
 */
export function drawActor(E, a, t0, lines) {
  const { s, f, A, an } = E
  const def = E.cast[a.who], k = a.size / 500, sx = a.flip ? -1 : 1
  const uid = E.uid(), T = t0 + (a.at ?? 0)
  const org = `transform-origin:0px ${f((def.feet ?? 160) * k)}px`
  const color = def.color
  const blinkDelay = -((uid * 1.3) % 3.4)
  const wins = (a.poses ?? []).filter((w) => {
    const ok = A.has(def[w.pose])
    if (!ok) E.warnings.push(`acteur « ${a.who} » : pose « ${w.pose} » (${def[w.pose] ?? 'non déclarée dans cast'}) absente : pose neutre conservée`)
    return ok
  }).map((w) => ({ T: t0 + w.at, d: w.dur ?? 1.2, pose: w.pose }))

  const hasTalk = A.has(def.talk) && lines.length > 0
  if (lines.length && !A.has(def.talk) && !def.mouth)
    E.warnings.push(`acteur « ${a.who} » : pose talk (${def.talk ?? 'non déclarée'}) absente et pas de cast.${a.who}.mouth : seul un léger rebond marque la parole`)

  const lay = (id, style, extra = '', pose = 'pose') => `<g data-pose="${pose}" style="${style}"><g transform="scale(${f(k)})">${A.svg(id, { color, where: `acteur ${a.who}` })}${extra}</g></g>`
  const off = wins.map((w) => an('dgOff', w.d, w.T, { ease: 'linear', fill: 'none' }))
  const mouthAnims = !hasTalk && def.mouth && lines.length ? lipAnimations({ ...s, keyframe: (c) => s.keyframe(c.replace(/@keyframes ls(\d+)/, `@keyframes ls${uid}_$1`)) }, lines).map((x) => x.replace(/^ls(\d+) /, `ls${uid}_$1 `)) : []
  const mouth = mouthAnims.length ? `<g transform="translate(${def.mouth.x} ${def.mouth.y})"><ellipse rx="${def.mouth.w / 2}" ry="${def.mouth.w * 0.4}" fill="#7A1F2B" stroke="#3B2A20" stroke-width="5" class="fx" style="opacity:0;animation:${mouthAnims.join(',')}"/></g>` : ''
  const layers = [lay(def.art, `opacity:1;animation:${off.join(',') || 'none'}`, blinkSvg(def.blink, blinkDelay) + mouth, 'neutral')]
  if (hasTalk) layers.push(lay(def.talk, `opacity:0;animation:${[...lines.map((l, i) => talkOpacity(E, uid, i, l)), ...off].join(',')}`, blinkSvg(def.blink, blinkDelay), 'talk'))
  for (const pose of [...new Set(wins.map((w) => w.pose))])
    layers.push(lay(def[pose], `opacity:0;animation:${wins.filter((w) => w.pose === pose).map((w) => an('dgOn', w.d, w.T, { ease: 'linear', fill: 'none' })).join(',')}`, '', pose))

  const beats = lines.map((l, i) => bodyBeat(E, uid, i, l)).filter(Boolean)
  const badges = (a.badges ?? []).map((b) => {
    const kb = Math.min(1.4, Math.max(0.7, a.size / 500)), bx = (b.dx ?? def.badge?.x ?? 0) * k, by = (b.dy ?? def.badge?.y ?? -20) * k
    return `<g transform="translate(${f(bx)} ${f(by)}) scale(${sx} 1)"><g class="fx" style="animation:${an('dgStamp', 0.5, t0 + b.at, { ease: 'ease-out' })}"><g transform="rotate(-8) scale(${f(kb)})">
      <rect x="-55" y="-55" width="110" height="110" rx="20" fill="#FFF3D6" fill-opacity=".94" stroke="${b.color}" stroke-width="9"/>
      <text class="en" x="0" y="31" text-anchor="middle" font-size="88" fill="${b.color}" stroke-width="0">${b.text}</text></g></g></g>`
  }).join('')
  const dur = (name) => (ACTOR_ACTIONS[name] ?? [0, 0.6])[1]
  const acts = (a.do ?? []).map((x) => an(ACTOR_ACTIONS[x.do][0], x.dur ?? dur(x.do), t0 + x.at, { fill: 'none' }))
  const body = `<g style="${org};animation:${beats.join(',') || 'none'}">${layers.join('')}</g>`
  const breathe = a.idle === false ? body + badges : `<g style="${org};animation:dgBreath ${f(3.2 + (uid % 3) * 0.4)}s ease-in-out ${f(blinkDelay)}s infinite">${body}${badges}</g>`
  const en = ENTER[a.enter ?? 'none'], enter = en ? an(en[0], en[1], T, { ease: en[2] }) : ''
  const ex = a.exit ? an(EXIT[a.exit], 0.5, t0 + (a.exitAt ?? 0), { ease: 'ease-in', fill: 'forwards' }) : ''
  return `<g transform="translate(${f(a.x)} ${f(a.y)})"><g transform="scale(${sx} 1)"><g style="${org};animation:${ex || 'none'}"><g style="${org};animation:${enter || 'none'}">
    <g data-actor="${a.who}"${a.bleed ? ' data-bleed="1"' : ''} style="${org};animation:${acts.join(',') || 'none'}">${breathe}</g></g></g></g></g>`
}
