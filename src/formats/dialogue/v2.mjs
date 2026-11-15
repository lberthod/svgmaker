// Format « dialogue », V2 : décors plein cadre en 3 couches (parallaxe) et personnages articulés (une pose = un fichier).
// Contrat des dessins : src/kit/v2art.mjs et STYLE.md (« V2 : décors plein cadre et personnages articulés »).
import { art as libArt, artText, hasArt, index } from '../../kit/library.mjs'
import { scopeIds, splitLayers, validatePose, validateScene } from '../../kit/v2art.mjs'

export const PARALLAX = { back: 0.7, mid: 1, fore: 1.3 }
const FPS_CYCLE = 8 // images par seconde d'un cycle de marche

/** Animations d'ambiance appliquées d'office aux parties d'un décor selon leur nom (désactivables : scene.ambient = false). */
export const AMBIENT = [[/^(flame|lamp-flame)/, 'flicker'], [/^(smoke|lamp-smoke)/, 'smoke'], [/^dust-/, 'twinkle'], [/^bell$/, 'swing'], [/^sheet-\d+/, 'sway'], [/^window-glow$/, 'glow']]
export const V2_CSS = `
@keyframes dgFlicker{0%,100%{transform:scale(1,1);opacity:1}25%{transform:scale(.9,1.1)}50%{transform:scale(1.06,.93);opacity:.85}75%{transform:scale(.95,1.05)}}
@keyframes dgSmoke{0%{transform:translateY(0) scale(1);opacity:.85}100%{transform:translateY(-70px) scale(1.5);opacity:0}}
@keyframes dgTwinkle{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes dgSwing{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(9deg)}}
@keyframes dgSway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes dgGlowP{0%,100%{opacity:1}50%{opacity:.65}}
@keyframes dgSpin{to{transform:rotate(360deg)}}
@keyframes dgShowP{from{opacity:0}to{opacity:1}}
@keyframes dgHideP{from{opacity:1}to{opacity:0}}
@keyframes dgBatInv{0%{opacity:0}50%{opacity:1}}
@keyframes dgEyesC{0%{opacity:0;animation-timing-function:step-end}92%{opacity:1;animation-timing-function:step-end}96%{opacity:0}}
@keyframes dgEyesO{0%{opacity:1;animation-timing-function:step-end}92%{opacity:0;animation-timing-function:step-end}96%{opacity:1}}
`

const isScene = (id) => hasArt(id) && index()[id].kind === 'scene'

/**
 * Décor plein cadre d'un plan : { defs, back, mid, fore, wrap(layer, inner) } ou null (décor absent → avertissement).
 * spec = "id" | { id, x, pan: [{ at, dur, to, ease }], parallax: { back, fore } } ; x / to = décalage horizontal (px) du cadre dans le décor.
 */
export function sceneLayers(E, spec, t0, d, i) {
  const o = typeof spec === 'string' ? { id: spec } : spec
  if (!isScene(o.id)) { E.warnings.push(`décor « ${o.id} » (plan ${i + 1}) absent de library/scenes : dégradé du thème à la place`); return null }
  let w, layers
  try { ({ w, layers } = validateScene(artText(o.id), o.id)) } catch (e) { E.warnings.push(`décor « ${o.id} » invalide : ${e.message}`); return null }
  const max = w - 1080, f = E.f
  const clampX = (x) => Math.min(max, Math.max(0, x ?? 0))
  const px = { ...PARALLAX, ...(o.parallax ?? {}) }
  // décalage du cadre dans le temps (secondes depuis le début du plan)
  let cur = clampX(o.x)
  const stops = [{ t: 0, x: cur, ease: 'linear' }]
  for (const p of [...(o.pan ?? [])].sort((a, b) => a.at - b.at)) {
    const end = Math.min(d, p.at + (p.dur ?? 2)), to = clampX(p.to)
    if (p.at - 0.001 > stops.at(-1).t) stops.push({ t: p.at - 0.001, x: cur, ease: 'linear' })
    stops.push({ t: p.at, x: cur, ease: p.ease ?? 'ease-in-out' }, { t: end, x: to, ease: 'linear' })
    cur = to
  }
  if (stops.at(-1).t < d) stops.push({ t: d, x: cur, ease: 'linear' })
  const moving = stops.some((s) => s.x !== stops[0].x)
  const pre = `sc${i}`
  const wrap = (layer, inner) => {
    const k = px[layer]
    if (!moving) return `<g data-layer="${layer}" class="${pre}" transform="translate(${f(-stops[0].x * k)} 0)">${inner}</g>`
    const n = `pan${i}_${layer}`
    E.s.keyframe(`@keyframes ${n}{${stops.map((s) => `${f((s.t / d) * 100)}%{transform:translateX(${f(-s.x * k)}px);animation-timing-function:${s.ease}}`).join('')}}`)
    return `<g data-layer="${layer}" class="${pre}" style="animation:${n} ${f(d)}s linear ${f(t0)}s both">${inner}</g>`
  }
  return { w, cls: pre, parts: [...new Set([...artText(o.id).matchAll(/data-part="([^"]+)"/g)].map((m) => m[1]))], ambient: o.ambient !== false, defs: scopeIds(layers.rest.replace(/<\/?defs>/g, ''), pre), back: scopeIds(layers.back, pre), mid: scopeIds(layers.mid, pre), fore: scopeIds(layers.fore, pre), wrap }
}

/** Pose d'un personnage : { svg (ids préfixés), height, grips } ; null si absente ou invalide (avertissement). */
function loadPose(E, id, prefix) {
  if (!hasArt(id) || index()[id].kind !== 'pose') { E.warnings.push(`pose « ${id} » absente de library/ (fichier perso--pose.svg, data-kind="pose") : cadre de remplacement`); return null }
  try {
    const { height, grips } = validatePose(artText(id), id)
    return { svg: scopeIds(libArt(id), prefix), height, grips }
  } catch (e) { E.warnings.push(`pose « ${id} » invalide : ${e.message}`); return null }
}

/** Ouverture de la bouche (mouth-open) et son inverse (mouth-closed) pour une réplique, d'après l'enveloppe. */
function mouthAnims(E, uid, i, l) {
  const { s, f } = E, v = s.voiceOf(l)
  if (!v || v.env.length < 2) {
    const n = Math.max(1, Math.ceil(s.durOf(l) / 0.32))
    return [`dgBat 0.32s step-end ${f(l.t)}s ${n}`, `dgBatInv 0.32s step-end ${f(l.t)}s ${n}`]
  }
  const n = v.env.length, so = [], sc = []
  let open = false, last = null
  v.env.forEach((e, k) => {
    open = open ? e > 0.18 : e > 0.3
    if (+open !== last) {
      const p = f((k / (n - 1)) * 100)
      so.push(`${p}%{opacity:${+open};animation-timing-function:step-end}`); sc.push(`${p}%{opacity:${1 - open};animation-timing-function:step-end}`); last = +open
    }
  })
  s.keyframe(`@keyframes mo${uid}_${i}{${so.join('')}}`)
  s.keyframe(`@keyframes mc${uid}_${i}{${sc.join('')}}`)
  return [`mo${uid}_${i} ${f(v.dur)}s linear ${f(l.t)}s`, `mc${uid}_${i} ${f(v.dur)}s linear ${f(l.t)}s`]
}

/**
 * Personnage articulé dans un plan. a = { who, x, y (pieds, coordonnées du décor), height?, pose, play: [{ at, pose } | { at, walk, dur }],
 * flip, hold: { art, size, rotate, grip: r|l|both, behind, poses, offset } | [ … ], rim, enter, at, exit, exitAt, bleed }. Retourne le <g> positionné.
 */
export function drawRig(E, a, t0, d, lines, { ENTER, EXIT }) {
  const { s, f, an, A, css } = E
  const def = E.cast[a.who], uid = E.uid(), cls = `rg${uid}`
  const H = a.height ?? def.height ?? 1000
  const poseIds = def.poses
  // segments [début, fin, pose] et trajectoire [t, x] (temps relatifs au plan)
  const segs = [], path = [[0, a.x]], face = [[0, a.flip ? -1 : 1]]
  let cur = a.pose ?? 'idle', from = 0, x = a.x
  for (const ev of [...(a.play ?? [])].sort((p, q) => p.at - q.at)) {
    if (ev.pose) { segs.push([from, ev.at, cur]); cur = ev.pose; from = ev.at }
    if (ev.walk != null) {
      const dur = ev.dur ?? Math.max(0.6, Math.abs(ev.walk - x) / 300)
      segs.push([from, ev.at, cur])
      if (poseIds.walk) segs.push([ev.at, ev.at + dur, 'walk']); else segs.push([ev.at, ev.at + dur, cur])
      path.push([ev.at, x], [ev.at + dur, ev.walk])
      if (ev.walk !== x) face.push([ev.at, ev.walk < x ? -1 : 1])
      x = ev.walk; from = ev.at + dur
    }
  }
  segs.push([from, d, cur])
  // couches : une par pose fixe, une par image d'un cycle (tableau d'ids)
  const used = [...new Set(segs.map((g) => g[2]))]
  const layers = []
  for (const name of used) {
    const ids = poseIds[name]
    if (!ids) { E.warnings.push(`acteur « ${a.who} » : pose « ${name} » non déclarée dans cast.${a.who}.poses`); continue }
    const frames = Array.isArray(ids) ? ids : [ids]
    const windows = segs.filter((g) => g[2] === name && g[1] > g[0])
    frames.forEach((id, k) => {
      const P = loadPose(E, id, `${cls}p${layers.length}`)
      const sc = H / (P?.height ?? 1000)
      const body = P ? P.svg : `<g transform="translate(0 -500) scale(2.5)">${A.svg(id, { color: def.color, where: `pose de ${a.who}` })}</g>`
      // accessoires tenus : main droite, gauche ou les deux (milieu des deux prises), devant ou derrière le corps
      const holds = (Array.isArray(a.hold) ? a.hold : a.hold ? [a.hold] : []).filter((h) => !h.poses || h.poses.includes(name))
      const behind = [], front = []
      for (const h of holds) {
        const gr = P?.grips?.['grip-r'], gl = P?.grips?.['grip-l'], side = h.grip ?? 'r'
        const g = side === 'both' ? (gr && gl ? [(gr[0] + gl[0]) / 2, (gr[1] + gl[1]) / 2] : gr ?? gl) : P?.grips?.[`grip-${side}`]
        if (!g) continue
        const [dx, dy] = h.offset ?? [0, 0]
        // un accessoire tenu par un personnage retourné reste lisible (texte de la page à l'endroit), sauf mirror: true
        const unflip = a.flip && !h.mirror ? -1 : 1
        ;(h.behind ? behind : front).push(`<g transform="translate(${f(g[0] * sc + dx)} ${f(g[1] * sc + dy)}) rotate(${h.rotate ?? 0})"><g transform="scale(${f(unflip * (h.size ?? 200) / 500)} ${f((h.size ?? 200) / 500)})">${A.svg(h.art, { where: `accessoire de ${a.who}` })}</g></g>`)
      }
      const [ox, oy] = (a.offsets ?? def.offsets)?.[name] ?? [0, 0] // décalage d'une pose dont l'ancre n'est pas au sol (px à l'écran)
      const anims = frames.length === 1
        ? windows.map(([u, v]) => an('dgOn', v - u, t0 + u, { ease: 'linear', fill: u === 0 ? 'backwards' : 'none' })) // première fenêtre : visible dès l'image 0 du plan
        : windows.map(([u, v]) => {
          const n = frames.length, kf = `cyc${n}_${k}`, fps = def.fps?.[name] ?? FPS_CYCLE
          s.keyframe(`@keyframes ${kf}{0%{opacity:${k === 0 ? 1 : 0};animation-timing-function:step-end}${f((k / n) * 100)}%{opacity:1;animation-timing-function:step-end}${f(((k + 1) / n) * 100)}%{opacity:0}}`)
          return `${kf} ${f(n / fps)}s step-end ${f(t0 + u)}s ${f(((v - u) * fps) / n)}`
        })
      // pose de départ (dessin unique) : visible par défaut et éteinte quand une autre pose joue. Une fenêtre d'animation
      // qui commence à 0 s n'est pas fiable dans le rendu image par image (pose absente des premières images).
      let base = 0, list = anims
      if (frames.length === 1 && windows[0]?.[0] === 0) {
        base = 1
        const gaps = []
        let c = 0
        for (const [u, v] of windows) { if (u > c) gaps.push([c, u]); c = Math.max(c, v) }
        if (c < d) gaps.push([c, d])
        list = gaps.map(([u, v]) => an('dgOff', v - u, t0 + u, { ease: 'linear', fill: 'none' }))
      }
      layers.push(`<g data-pose="${name}${frames.length > 1 ? `-${k + 1}` : ''}" style="opacity:${base};animation:${list.join(',') || 'none'}"><g transform="translate(${f(ox)} ${f(oy)})">${behind.join('')}<g transform="scale(${f(sc)})">${body}</g>${front.join('')}</g></g>`)
    })
  }
  // bouche (enveloppe de la voix) et yeux (clignement), pour toutes les poses du personnage
  const m = lines.map((l, i) => mouthAnims(E, uid, i, l))
  const blink = -((uid * 1.3) % 3.4)
  css.push(`.${cls} [data-part="mouth-open"]{opacity:0;animation:${m.map((x) => x[0]).join(',') || 'none'}}`)
  css.push(`.${cls} [data-part="mouth-closed"]{animation:${m.map((x) => x[1]).join(',') || 'none'}}`)
  css.push(`.${cls} [data-part="eyes-closed"]{opacity:0;animation:dgEyesC 3.9s linear ${f(blink)}s infinite}`)
  css.push(`.${cls} [data-part="eyes-open"]{animation:dgEyesO 3.9s linear ${f(blink)}s infinite}`)
  // déplacement et orientation (dessin tourné vers la droite ; il se retourne quand il marche vers la gauche)
  path.push([d, x])
  const moveName = `mv${uid}`, faceName = `fc${uid}`
  const moving = path.some((p) => p[1] !== a.x)
  if (moving) s.keyframe(`@keyframes ${moveName}{${path.map(([t, px]) => `${f((t / d) * 100)}%{transform:translateX(${f(px - a.x)}px)}`).join('')}}`)
  const turning = face.some((p) => p[1] !== face[0][1])
  if (turning) s.keyframe(`@keyframes ${faceName}{${face.map(([t, k]) => `${f((t / d) * 100)}%{transform:scaleX(${k});animation-timing-function:step-end}`).join('')}100%{transform:scaleX(${face.at(-1)[1]})}}`)
  const en = ENTER[a.enter ?? 'none'], enter = en ? an(en[0], en[1], t0 + (a.at ?? 0), { ease: en[2] }) : ''
  const ex = a.exit ? an(EXIT[a.exit], 0.5, t0 + (a.exitAt ?? 0), { ease: 'ease-in', fill: 'forwards' }) : ''
  const breathe = a.idle === false ? '' : `animation:dgBreath ${f(3.2 + (uid % 3) * 0.4)}s ease-in-out ${f(blink)}s infinite`
  E.rigCls[a.who] = cls
  // liseré : lumière chaude d'un côté (bougie) ou contour clair tout autour (personnage sombre sur décor sombre)
  const rim = a.rim ?? def.rim
  let rimAttr = ''
  if (rim) {
    const r = typeof rim === 'string' ? { color: rim } : rim, id = `rim${uid}`, wpx = r.width ?? 4
    E.defs.add(r.side === 'all' || r.side == null && r.dx == null
      ? `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="${wpx}" result="d"/><feFlood flood-color="${r.color ?? '#F2DFB0'}" flood-opacity="${r.opacity ?? 0.9}"/><feComposite in2="d" operator="in" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
      : `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feOffset in="SourceAlpha" dx="${r.dx ?? (r.side === 'right' ? wpx : -wpx)}" dy="${r.dy ?? 0}" result="o"/><feFlood flood-color="${r.color ?? '#FFB547'}" flood-opacity="${r.opacity ?? 1}"/><feComposite in2="o" operator="in" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`)
    rimAttr = ` filter="url(#${id})"`
  }
  return `<g transform="translate(${f(a.x)} ${f(a.y)})"${rimAttr}><g style="animation:${moving ? `${moveName} ${f(d)}s linear ${f(t0)}s both` : 'none'}">
    <g style="${turning ? `animation:${faceName} ${f(d)}s linear ${f(t0)}s both` : `transform:scaleX(${face[0][1]})`}"><g style="animation:${ex || 'none'}"><g style="transform-origin:0px 0px;animation:${enter || 'none'}">
    <g class="${cls}" data-actor="${a.who}"${a.bleed ? ' data-bleed="1"' : ''} style="transform-origin:0px 0px;${breathe}">${layers.join('')}</g></g></g></g></g></g>`
}
