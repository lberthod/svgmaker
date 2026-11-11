// Format « dialogue » : des personnages qui parlent (bouche synchronisée sur l'enveloppe réelle de leur voix),
// plans de 9:16 avec décor, accessoires animés, gags, caméra, texte à l'écran, sous-titres, mode quiz, carton final.
// Brief : voir STYLE.md. Les dessins viennent de library/ ; un id absent donne un cadre de remplacement + avertissement.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { RAINBOW, anim as kanim, esc } from '../../kit/core.mjs'
import { punch, quake, cameraMoves, cameraStyle } from '../../kit/actors/camera.mjs'
import { createScene } from '../../kit/actors/scene.mjs'
import { SAFE, svgDocument } from '../../kit/document.mjs'
import { SCENERY, scenery } from '../../kit/scenery.mjs'
import { fitBlock, kindOf } from '../../kit/text.mjs'
import { LINE, briefError, checkCommon, checkText, clamp, f, textBlock } from '../common.mjs'
import { animator, drawActor } from './actor.mjs'
import { createArts } from './art.mjs'
import { ACTOR_ACTIONS, ACTOR_ENTERS, ACTOR_EXITS, DIALOGUE_CSS, IDLES, PART_ANIMS, PROP_ANIMS, PROP_ENTERS, PROP_EXITS } from './css.mjs'

export const name = 'dialogue'
export const description = 'Personnages qui parlent (bouche sur la vraie voix), props, gags, caméra, sous-titres, quiz'

const THEMES = {
  night: { bg: ['#141B2D', '#2D3270'], ink: '#FFFFFF', halo: '#141B2D', accent: '#FFC93C' },
  warm: { bg: ['#FFF6E9', '#FFE3C4'], ink: '#2B2118', halo: '#FFF6E9', accent: '#E4572E' },
}
export const THEME_NAMES = Object.keys(THEMES)
const PALETTE = ['#2E8B57', '#C9772E', '#7A5CC4', '#2B8CC4']
const NARRATOR = 'narrator', NARRATOR_COLOR = '#FFE07A'
export const GAG_TYPES = ['shock', 'bonk', 'stamp', 'burst']
export const TEXT_KINDS = ['title', 'date', 'label', 'countdown']
const END_DUR = 3.4 // carton final : ≥ 2,8 s lisible après son entrée
const SUB_BOTTOM = 1470 // bas des sous-titres (zone sûre : ≤ 1500)

// ------------------------------------------------------------------ validation
export function validate(b) {
  checkCommon(b, name)
  if (b.theme && !THEMES[b.theme]) throw briefError(b, 'theme', `${THEME_NAMES.join(' | ')} attendu`)
  checkText(b, 'title', b.title, { required: false, max: 80 })
  if (b.captions && !['bar', 'bubble'].includes(b.captions)) throw briefError(b, 'captions', 'bar | bubble')
  for (const k of ['voices', 'timeline', 'audio']) if (b[k] != null && typeof b[k] !== 'string') throw briefError(b, k, 'chemin (relatif au brief) attendu')
  const cast = b.cast
  if (!cast || typeof cast !== 'object' || !Object.keys(cast).length) throw briefError(b, 'cast', 'au moins un personnage { id: { art, talk, surprised } }')
  for (const [id, c] of Object.entries(cast)) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) || id === NARRATOR) throw briefError(b, `cast.${id}`, `identifiant en minuscules (« ${NARRATOR} » est réservé à la voix off)`)
    if (typeof c?.art !== 'string') throw briefError(b, `cast.${id}.art`, 'id du dessin neutre attendu')
    for (const p of ['talk', 'surprised']) if (c[p] != null && typeof c[p] !== 'string') throw briefError(b, `cast.${id}.${p}`, 'id de dessin attendu')
    if (c.color && !/^#[0-9A-Fa-f]{6}$/.test(c.color)) throw briefError(b, `cast.${id}.color`, '#RRGGBB attendu')
  }
  if (!Array.isArray(b.shots) || b.shots.length < 1 || b.shots.length > 12) throw briefError(b, 'shots', '1 à 12 plans')
  const who = (w, v) => { if (v !== NARRATOR && !cast[v]) throw briefError(b, w, `« ${v} » absent de cast (${[NARRATOR, ...Object.keys(cast)].join(' | ')})`) }
  const tIn = (w, t, d) => { if (!(t >= 0 && t <= d)) throw briefError(b, w, `entre 0 et ${d} (secondes depuis le début du plan)`) }
  b.shots.forEach((s, i) => {
    const w = `shots[${i}]`
    if (!(s.duration >= 1.5 && s.duration <= 15)) throw briefError(b, `${w}.duration`, 'entre 1,5 et 15 s')
    for (const [k, l] of (s.lines ?? []).entries()) {
      who(`${w}.lines[${k}].who`, l.who)
      checkText(b, `${w}.lines[${k}].text`, l.text, { max: 90 })
      tIn(`${w}.lines[${k}].at`, l.at, s.duration)
    }
    const seen = new Set()
    for (const [k, a] of (s.actors ?? []).entries()) {
      const wa = `${w}.actors[${k}]`
      if (!cast[a.who]) throw briefError(b, `${wa}.who`, `« ${a.who} » absent de cast`)
      if (seen.has(a.who)) throw briefError(b, `${wa}.who`, 'un acteur ne figure qu\'une fois par plan')
      seen.add(a.who)
      if (!(a.size >= 150 && a.size <= 1600)) throw briefError(b, `${wa}.size`, 'entre 150 et 1600 px (côté du carré de dessin)')
      if (!Number.isFinite(a.x) || !Number.isFinite(a.y)) throw briefError(b, `${wa}`, 'x et y (centre du dessin, en px) attendus')
      if (a.enter && !ACTOR_ENTERS.includes(a.enter)) throw briefError(b, `${wa}.enter`, ACTOR_ENTERS.join(' | '))
      if (a.exit && !ACTOR_EXITS.includes(a.exit)) throw briefError(b, `${wa}.exit`, ACTOR_EXITS.join(' | '))
      for (const [j, x] of (a.do ?? []).entries()) if (!ACTOR_ACTIONS[x.do]) throw briefError(b, `${wa}.do[${j}].do`, Object.keys(ACTOR_ACTIONS).join(' | '))
      for (const [j, x] of (a.poses ?? []).entries()) if (typeof cast[a.who][x.pose] !== 'string') throw briefError(b, `${wa}.poses[${j}].pose`, `pose « ${x.pose} » non déclarée dans cast.${a.who}`)
    }
    for (const [k, p] of (s.props ?? []).entries()) {
      const wp = `${w}.props[${k}]`
      if (typeof p.art !== 'string') throw briefError(b, `${wp}.art`, 'id de dessin attendu')
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) throw briefError(b, wp, 'x et y attendus')
      if (p.enter && !PROP_ENTERS.includes(p.enter)) throw briefError(b, `${wp}.enter`, PROP_ENTERS.join(' | '))
      if (p.exit && !PROP_EXITS[p.exit?.do ?? p.exit]) throw briefError(b, `${wp}.exit`, Object.keys(PROP_EXITS).join(' | '))
      if (p.idle && !(p.idle in IDLES)) throw briefError(b, `${wp}.idle`, Object.keys(IDLES).join(' | '))
      for (const [j, x] of (p.anims ?? []).entries()) if (!PROP_ANIMS[x.do]) throw briefError(b, `${wp}.anims[${j}].do`, Object.keys(PROP_ANIMS).join(' | '))
      for (const [j, x] of (p.parts ?? []).entries()) if (!PART_ANIMS[x.do] || typeof x.part !== 'string') throw briefError(b, `${wp}.parts[${j}]`, `{ part, do } avec do = ${Object.keys(PART_ANIMS).join(' | ')}`)
    }
    for (const [k, g] of (s.gags ?? []).entries()) {
      if (!GAG_TYPES.includes(g.type)) throw briefError(b, `${w}.gags[${k}].type`, GAG_TYPES.join(' | '))
      if (['shock', 'bonk', 'stamp'].includes(g.type) && !cast[g.who]) throw briefError(b, `${w}.gags[${k}].who`, 'personnage de cast attendu')
      if (g.type === 'stamp') checkText(b, `${w}.gags[${k}].text`, g.text, { max: 3 })
    }
    for (const [k, c] of (s.camera ?? []).entries()) {
      if (!(c.quake || c.zoom || c.to)) throw briefError(b, `${w}.camera[${k}]`, '{ at, dur, zoom, x, y } | { at, dur, quake } | { at, dur, to: { zoom, x, y } }')
      tIn(`${w}.camera[${k}].at`, c.at, s.duration)
    }
    for (const [k, t] of (s.texts ?? []).entries()) {
      if (!TEXT_KINDS.includes(t.kind)) throw briefError(b, `${w}.texts[${k}].kind`, TEXT_KINDS.join(' | '))
      if (t.kind !== 'countdown') checkText(b, `${w}.texts[${k}].text`, t.text, { max: 60 })
      tIn(`${w}.texts[${k}].at`, t.at ?? 0, s.duration)
    }
    if (s.quiz) {
      const q = s.quiz
      if (!Array.isArray(q.cards) || q.cards.length !== 3) throw briefError(b, `${w}.quiz.cards`, '3 cartes { art }')
      q.cards.forEach((c, k) => { if (typeof c.art !== 'string') throw briefError(b, `${w}.quiz.cards[${k}].art`, 'id de dessin attendu') })
      if (![0, 1, 2].includes(q.correct)) throw briefError(b, `${w}.quiz.correct`, 'indice 0, 1 ou 2')
      const cd = q.countdown ?? 3
      if (!(cd >= 1 && cd <= 5)) throw briefError(b, `${w}.quiz.countdown`, 'entre 1 et 5 chiffres')
      if ((q.cdAt ?? (q.at ?? 0.3) + 1) + cd * (q.step ?? 1) >= s.duration) throw briefError(b, `${w}.quiz`, 'la révélation tombe après la fin du plan : allonger le plan ou raccourcir le compte à rebours')
    }
  })
  const s0 = b.shots[0]
  const hook = (s0.texts ?? []).find((t) => t.kind === 'title')
  if (!hook) throw briefError(b, 'shots[0].texts', 'une accroche écrite est obligatoire : { "kind": "title", "text": "…", "at": 0.1 } (lisible avant 1 s)')
  if (!((hook.at ?? 0) <= 0.6)) throw briefError(b, 'shots[0].texts', 'l\'accroche doit apparaître avant 0,6 s')
  if (b.end) {
    checkText(b, 'end.text', b.end.text, { max: 40 })
    checkText(b, 'end.sub', b.end.sub, { required: false, max: 70 })
    const last = b.shots.at(-1).duration, ed = b.end.dur ?? END_DUR
    if (!(ed >= 3 && ed <= last)) throw briefError(b, 'end.dur', `entre 3 s et la durée du dernier plan (${last} s) : le carton final reste ≥ 2,8 s lisible`)
  }
  return b
}

// ------------------------------------------------------------------ fichiers externes (voix, minutage)
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))

/** voice.json : { "who|texte": { dur, env } } (format svgMaker) ; accepte aussi { lines: [{ who, text, t0, t1, env? }] }. */
function normalizeVoice(raw) {
  if (!raw) return {}
  const arr = Array.isArray(raw) ? raw : raw.lines
  if (!Array.isArray(arr)) return raw
  return Object.fromEntries(arr.map((l) => [`${l.who ?? l.role}|${l.text}`, { dur: l.dur ?? +(l.t1 - l.t0).toFixed(3), env: l.env ?? [] }]))
}

// ------------------------------------------------------------------ construction
export function build(b, voiceIn = {}, ctx = {}) {
  const th = THEMES[b.theme ?? 'night']
  const warnings = []
  const A = createArts(warnings)
  const dir = ctx.baseDir
  const ref = (p) => (dir && p ? path.resolve(dir, p) : null)

  // voix : voice.json du brief (si présent) complète celui du dossier de sortie
  const vf = ref(b.voices)
  let voice = { ...voiceIn }
  if (vf) { if (existsSync(vf)) voice = { ...voice, ...normalizeVoice(readJson(vf)) }; else warnings.push(`voices : ${b.voices} introuvable (bouche en battement, durées estimées)`) }
  const tf = ref(b.timeline)
  let timeline = null
  if (tf) { if (existsSync(tf)) timeline = readJson(tf).lines ?? []; else warnings.push(`timeline : ${b.timeline} introuvable (temps du brief)`) }

  const cast = Object.fromEntries(Object.entries(b.cast).map(([id, c], i) => [id, { ...c, color: c.color ?? PALETTE[i % PALETTE.length] }]))
  const colorOf = (who) => (who === NARRATOR ? NARRATOR_COLOR : cast[who].color)
  const starts = []
  let D = 0
  for (const sh of b.shots) { starts.push(D); D += sh.duration }

  // ---- répliques : temps absolus (timeline.json si fourni, sinon `at` du plan, sans chevauchement)
  const pool = timeline ? [...timeline] : []
  const entries = []
  b.shots.forEach((sh, i) => (sh.lines ?? []).forEach((l) => entries.push({ shot: i, who: l.who, text: l.text, t: starts[i] + l.at, fixed: false })))
  for (const e of entries) {
    const k = pool.findIndex((x) => (x.who ?? x.role) === e.who && x.text === e.text)
    if (k < 0) { if (timeline) warnings.push(`timeline : réplique « ${e.text} » (${e.who}) absente de timeline.json : temps du brief conservé`); continue }
    const [x] = pool.splice(k, 1)
    e.t = x.t0 ?? x.t; e.fixed = true
    if (x.t1 != null) voice[`${e.who}|${e.text}`] ??= { dur: +(x.t1 - x.t0).toFixed(3), env: [] }
  }
  const s = createScene({ voice })
  let prevEnd = -Infinity
  for (const e of entries.sort((x, y) => x.t - y.t)) {
    if (!e.fixed) e.t = Math.max(e.t, prevEnd + 0.15)
    s.say(e.t, e.who, e.text)
    prevEnd = e.t + s.durOf({ role: e.who, text: e.text })
    e.dur = s.durOf({ role: e.who, text: e.text })
    const sh = b.shots.findIndex((_, i) => e.t >= starts[i] && e.t < starts[i] + b.shots[i].duration + 0.001)
    if (sh !== e.shot) warnings.push(`réplique « ${e.text} » : démarre à ${f(e.t)} s, hors de son plan ${e.shot + 1} (${f(starts[e.shot])}–${f(starts[e.shot] + b.shots[e.shot].duration)} s)`)
  }

  const css = []
  let uidN = 0
  const E = { s, f, A, cast, css, warnings, uid: () => uidN++, an: animator(f) }
  const an = E.an
  const kfm = (n, dur, delay, ease, fill) => kanim(n, dur, delay, ease, fill, f)
  const win = (t, d, inner, mode = 'dwin') => `<g class="sc" style="animation:${mode} ${f(d)}s linear ${f(t)}s both">${inner}</g>`
  const defs = new Set([`<linearGradient id="dg-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${th.bg[0]}"/><stop offset="1" stop-color="${th.bg[1]}"/></linearGradient>`])
  const world = [], ui = [], keyTimes = []
  const shotActors = []

  // ---- décor plein cadre
  const background = (spec, i) => {
    const base = `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#dg-bg)"/>`
    if (spec == null) return base
    if (typeof spec === 'string' && SCENERY.includes(spec)) { const sc = scenery(spec); defs.add(sc.defs); return sc.body }
    if (typeof spec === 'string' && spec.startsWith('#')) return `<rect x="-200" y="-200" width="1480" height="2320" fill="${esc(spec)}"/>`
    if (spec.from && spec.to) { defs.add(`<linearGradient id="dg-bg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${esc(spec.from)}"/><stop offset="1" stop-color="${esc(spec.to)}"/></linearGradient>`); return `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#dg-bg${i})"/>` }
    const o = typeof spec === 'string' ? { art: spec } : spec
    const fit = o.fit ?? 'cover', k = (fit === 'width' ? 1080 / 390 : 1920 / 390) * (o.k ?? 1) // 390 = le cadre arrondi des décors de library/ est hors champ
    return `${base}<g transform="translate(${540 + (o.x ?? 0)} ${o.y ?? 960}) scale(${f(k)})">${A.svg(o.art, { where: `décor du plan ${i + 1}` })}</g>`
  }

  // ---- accessoires
  const partRules = new Map()
  const drawProp = (p, t0, i, k) => {
    const sz = p.size ?? 300, T = t0 + (p.at ?? 0.3), cls = `p${i}_${k}`
    const enter = p.enter ?? 'pop', ea = enter === 'none' ? null : PROP_ANIMS[enter]
    const ease = enter === 'pop' ? 'cubic-bezier(.3,1.5,.5,1)' : 'ease-out'
    const sty = (enter === 'grow' ? `--k0:${p.k0 ?? 0.15};--k:${p.k ?? 1};` : '')
    const exit = p.exit ? (typeof p.exit === 'string' ? { do: p.exit } : p.exit) : null
    const exitA = exit ? an(PROP_EXITS[exit.do], 0.5, t0 + (exit.at ?? 0), { ease: 'ease-in', fill: 'forwards' }) : ''
    if (ea) s.fx(T, { pop: 'pop', drop: 'boing', rise: 'whoosh', fly: 'whoosh', stamp: 'bonk' }[enter] ?? 'pop')
    let inner = `<g class="${cls}" transform="scale(${f(sz / 500)})">${A.svg(p.art, { where: `accessoire du plan ${i + 1}` })}</g>`
    if (p.idle && IDLES[p.idle]) inner = `<g class="fx" style="animation:${IDLES[p.idle]}">${inner}</g>`
    for (const x of [...(p.anims ?? [])].reverse()) {
      const [kf, dd, perSec, fill] = PROP_ANIMS[x.do], d = x.dur ?? dd
      const iter = perSec ? Math.max(1, Math.round(d * perSec)) : 1
      if (['drop', 'rise', 'fly', 'pop', 'stamp', 'grow', 'fade'].includes(x.do)) s.fx(t0 + x.at, { drop: 'boing', stamp: 'bonk', pop: 'pop' }[x.do] ?? 'whoosh')
      inner = `<g class="fx" style="--k:${x.k ?? (x.do === 'pulse' ? 1.14 : x.do === 'shrink' ? 0.3 : 1)};--k0:${x.k0 ?? 1};animation:${an(kf, d, t0 + x.at, { ease: x.do === 'pop' ? 'cubic-bezier(.3,1.5,.5,1)' : 'ease-in-out', fill, iter })}">${inner}</g>`
    }
    // parties animables du dessin (data-part) : règles CSS propres à cette instance
    const names = A.parts(p.art)
    for (const pt of p.parts ?? []) {
      const re = new RegExp(`^${pt.part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)
      const hit = names.filter((n) => re.test(n)).sort((a, c) => a.localeCompare(c, 'en', { numeric: true }))
      if (!hit.length) { warnings.push(`dessin « ${p.art} » : partie « ${pt.part} » introuvable (data-part)`); continue }
      const [kf, dd, fill] = PART_ANIMS[pt.do]
      hit.forEach((n, j) => {
        const key = `${cls} ${n}`, r = partRules.get(key) ?? { list: [], vars: '', origin: pt.origin === 'bottom' ? '50% 100%' : pt.origin === 'top' ? '50% 0%' : 'center' }
        const d = pt.dur ?? dd, loop = pt.loop || ['pulse', 'wiggle'].includes(pt.do)
        r.list.push(an(kf, d, t0 + (pt.at ?? 0) + j * (pt.every ?? 0), { ease: pt.do === 'pop' ? 'cubic-bezier(.3,1.5,.5,1)' : 'ease-in-out', fill, iter: pt.loop ? Infinity : loop ? Math.max(1, Math.round(d / 0.8)) : 1 }))
        r.vars += `--k:${pt.k ?? (pt.do === 'shrink' ? 0.3 : 1.2)};--k0:${pt.k0 ?? 0.15};`
        if (['pop', 'appear', 'grow', 'stamp', 'fill'].includes(pt.do)) s.fx(t0 + (pt.at ?? 0) + j * (pt.every ?? 0), 'pop')
        partRules.set(key, r)
      })
    }
    return `<g transform="translate(${f(p.x)} ${f(p.y)}) scale(${p.flip ? -1 : 1} 1)"><g class="fx" style="animation:${exitA || 'none'}"><g class="fx" style="${sty}animation:${ea ? an(ea[0], p.enterDur ?? ea[1], T, { ease }) : 'none'}">${inner}</g></g></g>`
  }

  // ---- caméra d'un plan : zoom/pan/travelling qui reste (« to »), compilé en une seule animation
  const cams = []
  const compileCam = (moves, d, t0, i) => {
    const norm = (c) => { const k = c.zoom ?? 1; return { k, x: clamp(c.x ?? 540, 540 / k, 1080 - 540 / k), y: clamp(c.y ?? 960, 960 / k, 1920 - 960 / k) } }
    const st = (v) => `translate(540px,960px) scale(${f(v.k)}) translate(${f(-v.x)}px,${f(-v.y)}px)`
    let cur = norm({}), stops = [{ t: 0, st: cur, ease: 'linear' }]
    for (const m of [...moves].sort((a, c) => a.at - c.at)) {
      const from = m.from ? norm(m.from) : cur, to = norm({ zoom: m.to.zoom ?? cur.k, x: m.to.x ?? cur.x, y: m.to.y ?? cur.y })
      const end = Math.min(d, m.at + (m.dur ?? 1.5))
      if (m.at - 0.001 > stops.at(-1).t) stops.push({ t: m.at - 0.001, st: cur, ease: 'linear' })
      stops.push({ t: m.at, st: from, ease: m.ease ?? 'ease-in-out' }, { t: end, st: to, ease: 'linear' })
      cur = to
    }
    if (stops.at(-1).t < d) stops.push({ t: d, st: cur, ease: 'linear' })
    const n = `cam_s${i}`
    s.keyframe(`@keyframes ${n}{${stops.map((x) => `${f((x.t / d) * 100)}%{transform:${st(x.st)};animation-timing-function:${x.ease}}`).join('')}}`)
    cams.push(n)
    return `animation:${n} ${f(d)}s linear ${f(t0)}s both`
  }

  // ---- plans
  const n = b.shots.length
  b.shots.forEach((sh, i) => {
    const t0 = starts[i], d = sh.duration
    const actors = (sh.actors ?? []).map((a) => ({ ...a, poses: [...(a.poses ?? [])], do: [...(a.do ?? [])], badges: [] }))
    const props = (sh.props ?? []).map((p) => ({ ...p, anims: [...(p.anims ?? [])] }))
    const moves = [...(sh.camera ?? [])]
    const extra = [] // éléments du monde créés par les gags
    const actorOf = (who, where) => { const a = actors.find((x) => x.who === who); if (!a) warnings.push(`plan ${i + 1} : ${where} sur « ${who} » ignoré (l'acteur n'est pas dans le plan)`); return a }
    for (const g of sh.gags ?? []) {
      const T = t0 + g.at
      if (g.type === 'shock') {
        const a = actorOf(g.who, 'gag shock'); if (!a) continue
        a.poses.push({ at: g.at, dur: g.dur ?? 1.3, pose: 'surprised' }); a.do.push({ at: g.at, do: 'hop' })
        moves.push({ at: g.at, dur: 0.4, quake: g.quake ?? 10 }); s.fx(T, 'boing')
      } else if (g.type === 'bonk') {
        const a = actorOf(g.who, 'gag bonk'); if (!a) continue
        const top = a.y + (cast[g.who].top ?? -200) * (a.size / 500)
        a.poses.push({ at: g.at + 0.35, dur: 1.4, pose: 'surprised' }); a.do.push({ at: g.at + 0.35, do: 'shake' })
        moves.push({ at: g.at + 0.35, dur: 0.45, quake: 16 }); s.fx(T + 0.35, 'bonk')
        extra.push(`<g transform="translate(${f(a.x)} ${f(top - (g.size ?? 170) * 0.3)})"><g class="fx" style="animation:${an('dgBonk', 1.6, T, { ease: 'linear' })}"><g transform="scale(${f((g.size ?? 170) / 500)})">${A.svg(g.art, { where: 'gag bonk' })}</g></g></g>`)
      } else if (g.type === 'stamp') {
        const a = actorOf(g.who, 'gag stamp'); if (!a) continue
        a.badges.push({ at: g.at, text: esc(g.text), color: g.color ?? '#C0392B', dx: g.dx, dy: g.dy })
        moves.push({ at: g.at + 0.2, dur: 0.35, quake: g.quake ?? 9 }); s.fx(T + 0.2, 'bonk')
      } else if (g.type === 'burst') {
        const rays = Array.from({ length: 10 }, (_, k) => { const t = (k * Math.PI) / 5; return `<line x1="${f(Math.cos(t) * 130)}" y1="${f(Math.sin(t) * 130)}" x2="${f(Math.cos(t) * 200)}" y2="${f(Math.sin(t) * 200)}" stroke="${RAINBOW[k % 6]}" stroke-width="14" stroke-linecap="round"/>` }).join('')
        extra.push(`<g transform="translate(${g.x ?? 540} ${g.y ?? 900})"><g class="fx" style="animation:${an('dgBurst', 0.9, T, { ease: 'ease-out' })}">${rays}</g></g>`); s.fx(T, 'sparkle')
      }
    }
    for (const a of actors) {
      for (const x of a.do) if (x.do === 'surprised' && !a.poses.some((w) => w.at === x.at)) a.poses.push({ at: x.at, dur: x.dur ?? 1.2, pose: 'surprised' })
      if (a.enter && a.enter !== 'none') s.fx(t0 + (a.at ?? 0), a.enter === 'drop' ? 'boing' : 'pop')
    }
    shotActors.push(actors)

    // quiz : trois cartes, compte à rebours, révélation
    let quizSvg = ''
    if (sh.quiz) {
      const q = sh.quiz, S = q.size ?? 340, cy = q.y ?? 800, xs = [197, 540, 883], u = S / 500
      const tc = t0 + (q.at ?? 0.3), cdAt = t0 + (q.cdAt ?? (q.at ?? 0.3) + 1), N = q.countdown ?? 3, st = q.step ?? 1, R = cdAt + N * st
      s.fx(cdAt, 'drumroll'); s.fx(R, 'ding')
      const frameOk = A.has(q.frame ?? 'quiz-card')
      if (!frameOk) warnings.push(`dessin « ${q.frame ?? 'quiz-card'} » (carte du quiz) absent de library/ : carte de repli`)
      quizSvg = q.cards.map((c, k) => {
        const ok = k === q.correct, cls = `q${i}_${k}`
        if (frameOk && ok) css.push(`.${cls} [data-part="glow"]{animation:${an('fadeIn', 0.4, R, { ease: 'ease-out', fill: 'forwards' })}}`)
        if (frameOk) css.push(`.${cls} [data-part="glow"]{opacity:0}`)
        const frame = frameOk ? A.svg(q.frame ?? 'quiz-card') : '<rect x="-200" y="-170" width="400" height="340" rx="50" fill="#FFF6E9" stroke="#3B2A20" stroke-width="12"/><rect x="-150" y="-50" width="300" height="192" rx="30" fill="#DCE9F8" stroke="#3B2A20" stroke-width="7"/><circle cx="-136" cy="-108" r="40" fill="#8E5BD9" stroke="#3B2A20" stroke-width="9"/>'
        const ring = !frameOk && ok ? `<rect x="-215" y="-185" width="430" height="370" rx="62" fill="none" stroke="#FFC93C" stroke-width="16" style="opacity:0;animation:${an('fadeIn', 0.4, R, { ease: 'ease-out', fill: 'forwards' })}"/>` : ''
        const [lx, ly] = q.letterAt ?? [-136, -108]
        const reveal = ok ? an('dgPulse', 0.6, R, { fill: 'none', iter: 3 }) : an('dim', 0.4, R, { ease: 'ease-out', fill: 'forwards' })
        return `<g transform="translate(${xs[k]} ${cy})"><g class="fx" style="animation:${an('pop', 0.5, tc + k * 0.15, { ease: 'cubic-bezier(.3,1.5,.5,1)' })}"><g class="fx" style="--k:1.1;animation:${reveal}">
        <g class="${cls}" transform="scale(${f(u)})">${frame}${ring}<g transform="translate(0 40) scale(.5)">${A.svg(c.art, { where: `carte ${'ABC'[k]} du quiz` })}</g>
        <text class="en" x="${lx}" y="${f(ly + 18)}" text-anchor="middle" font-size="50" fill="#fff" stroke="#3B2A20" stroke-width="5">${'ABC'[k]}</text></g></g></g></g>`
      }).join('')
      for (let j = 0; j < N; j++) {
        s.fx(cdAt + j * st, 'tick')
        ui.push(win(cdAt + j * st, st, `<g class="fx" style="animation:${an('dgCd', st, cdAt + j * st, { ease: 'linear' })}"><circle cx="540" cy="480" r="120" fill="${th.accent}" stroke="${th.halo}" stroke-width="10"/><text class="en" x="540" y="${f(430 + 190 * 0.36)}" text-anchor="middle" font-size="190" fill="#141B2D" stroke="${th.accent}" stroke-width="0">${N - j}</text></g>`))
      }
      if (q.zoom) moves.push({ at: R - t0, dur: 2.2, zoom: q.zoom, x: xs[q.correct], y: cy })
      sh.__reveal = R - t0
    }

    // compte à rebours libre
    for (const t of (sh.texts ?? []).filter((x) => x.kind === 'countdown')) {
      const N = t.from ?? 3, T = t0 + (t.at ?? 0), st = t.step ?? 1
      for (let j = 0; j < N; j++) {
        s.fx(T + j * st, 'tick')
        ui.push(win(T + j * st, st, `<g class="fx" style="animation:${an('dgCd', st, T + j * st, { ease: 'linear' })}"><circle cx="540" cy="${t.y ?? 430}" r="120" fill="${th.accent}" stroke="${th.halo}" stroke-width="10"/><text class="en" x="540" y="${f((t.y ?? 430) + 190 * 0.36)}" text-anchor="middle" font-size="190" fill="#141B2D" stroke-width="0">${N - j}</text></g>`))
      }
    }

    // caméra
    for (const m of moves) {
      if (m.quake) quake(s, t0 + m.at, m.dur ?? 0.4, m.quake)
      else if (m.zoom && !m.to) punch(s, t0 + m.at, m.dur ?? 1.5, m.x ?? 540, m.y ?? 900, m.zoom)
    }
    const camStyle = moves.some((m) => m.to) ? compileCam(moves.filter((m) => m.to), d, t0, i) : ''

    const spk = (who) => s.lines.filter((l) => l.role === who && l.t >= t0 - 0.001 && l.t < t0 + d)
    const back = props.map((p, k) => [p, k]).filter(([p]) => p.layer !== 'front').map(([p, k]) => drawProp(p, t0, i, k)).join('')
    const front = props.map((p, k) => [p, k]).filter(([p]) => p.layer === 'front').map(([p, k]) => drawProp(p, t0, i, k)).join('')
    const act = actors.map((a) => drawActor(E, a, t0, spk(a.who))).join('')
    world.push(win(t0, d, `<g style="${camStyle || 'animation:none'}">${background(sh.bg ?? b.bg, i)}${quizSvg}${back}${act}${extra.join('')}${front}</g>`, n === 1 ? 'dwinOnly' : i === 0 ? 'dwin0' : i === n - 1 ? 'dwinEnd' : 'dwin'))

    // texte à l'écran (empilé sous la zone haute masquée, sans chevauchement dans le temps)
    const texts = (sh.texts ?? []).filter((x) => x.kind !== 'countdown').map((x) => ({ ...x, at: x.at ?? 0 }))
    const placed = []
    const draw = (x, y, T, hook) => {
      const role = hook ? 'data-role="hook"' : ''
      if (x.kind === 'title') return textBlock(x.text, { top: y, max: 104, min: 48, maxLines: 2, width: 900, fill: th.ink, halo: th.halo, attrs: role, anim: (j) => kfm('pop', 0.45, T + 0.02 + j * 0.1) })
      const fb = fitBlock(x.text, { kind: kindOf(x.text), max: x.kind === 'date' ? 60 : 50, min: 34, width: 760, maxLines: 1 })
      const w = fb.width + 90, h = fb.size * 1.5
      const tb = textBlock(x.text, { top: y + (h - fb.size * 1.05) / 2, max: fb.size, min: fb.size, maxLines: 1, width: 760, fill: x.kind === 'date' ? '#3B2A20' : th.accent, halo: x.kind === 'date' ? '#F3E3B8' : '#0B1020', halo_k: 0, attrs: role })
      const fill = x.kind === 'date' ? '#F3E3B8' : '#0B1020', stroke = x.kind === 'date' ? '#3B2A20' : th.accent
      return { height: h, svg: `<g class="pop" style="${kfm('pop', 0.45, T)}"><rect x="${f(540 - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}" fill="${fill}" fill-opacity="${x.kind === 'date' ? 1 : 0.82}" stroke="${stroke}" stroke-width="7"/>${tb.svg}</g>` }
    }
    texts.sort((a, c) => a.at - c.at).forEach((x) => {
      const T = t0 + x.at, end = x.dur ? T + x.dur : t0 + d
      const act2 = placed.filter((p) => p.end > T + 0.01)
      const y = x.y ?? SAFE.top + 30 + act2.reduce((acc, p) => acc + p.h + 26, 0)
      const r = draw(x, y, T, i === 0 && x.kind === 'title' && x === texts.find((o) => o.kind === 'title'))
      placed.push({ end, h: r.height })
      ui.push(win(T, end - T, r.svg))
    })
    // instant de la planche d'aperçu
    const l1 = s.lines.find((l) => l.t >= t0 && l.t < t0 + d)
    keyTimes.push(f(t0 + (sh.focus ?? (sh.__reveal != null ? sh.__reveal + 0.6 : l1 ? Math.min(d - 0.2, l1.t - t0 + 0.7) : d * 0.6))))
  })

  // ---- sous-titres (ou bulles) : un par réplique, dans la zone sûre
  const lineList = s.lines
  lineList.forEach((l, k) => {
    const next = lineList[k + 1]
    const d = Math.min(s.durOf(l) + 0.35, next ? next.t - l.t - 0.04 : Infinity)
    const kind = kindOf(l.text), col = colorOf(l.role), isN = l.role === NARRATOR
    const fb = fitBlock(l.text, { kind, max: 52, min: 34, width: 760, maxLines: 2 })
    const h = fb.lines.length * fb.size * LINE[kind] + 40, w = fb.width + 80
    const tx = (fill, halo, top, x = 540) => textBlock(l.text, { x, top, max: fb.size, min: fb.size, maxLines: 2, width: 760, fill, halo, halo_k: isN ? 0.06 : 0.1 }).svg
    const si = starts.findIndex((st, i) => l.t >= st && l.t < st + b.shots[i].duration + 0.001)
    const a = !isN && b.captions === 'bubble' ? shotActors[si]?.find((x) => x.who === l.role) : null
    let svg
    if (a) {
      const top = a.y + (cast[l.role].top ?? -200) * (a.size / 500)
      const bx = clamp(a.x, 70 + w / 2, 1010 - w / 2), by = clamp(top - 70 - h, SAFE.top + 20, SUB_BOTTOM - h)
      const tailX = clamp(a.x, bx - w / 2 + 60, bx + w / 2 - 60)
      svg = `<g class="fx" style="animation:${an('pop', 0.3, l.t, { ease: 'cubic-bezier(.3,1.5,.5,1)' })}"><path d="M ${f(tailX - 26)} ${f(by + h - 4)} L ${f(a.x)} ${f(Math.max(by + h + 20, top - 14))} L ${f(tailX + 26)} ${f(by + h - 4)} Z" fill="#fff" stroke="${col}" stroke-width="8" stroke-linejoin="round"/>
        <rect x="${f(bx - w / 2)}" y="${f(by)}" width="${f(w)}" height="${f(h)}" rx="${f(Math.min(44, h / 2))}" fill="#fff" stroke="${col}" stroke-width="9"/>
        <path d="M ${f(tailX - 20)} ${f(by + h - 4)} L ${f(tailX + 20)} ${f(by + h - 4)}" stroke="#fff" stroke-width="12"/>${tx('#2B2118', '#fff', by + 20, bx)}</g>`
    } else if (isN) {
      svg = `<rect x="${f(540 - w / 2)}" y="${f(SUB_BOTTOM - h)}" width="${f(w)}" height="${f(h)}" rx="${f(Math.min(40, h / 2))}" fill="#0B1020" opacity=".62" stroke="${NARRATOR_COLOR}" stroke-width="4" stroke-dasharray="14 10"/>${tx(NARRATOR_COLOR, '#000', SUB_BOTTOM - h + 20)}`
    } else {
      svg = `<rect x="${f(540 - w / 2)}" y="${f(SUB_BOTTOM - h)}" width="${f(w)}" height="${f(h)}" rx="${f(Math.min(40, h / 2))}" fill="${col}" opacity=".94" stroke="#fff" stroke-width="4"/>${tx('#FFFFFF', '#000', SUB_BOTTOM - h + 20)}`
    }
    ui.push(win(l.t, d, svg))
  })

  // ---- carton final (reste affiché jusqu'à la fin)
  if (b.end) {
    const ed = b.end.dur ?? END_DUR, tE = D - ed
    const tb = textBlock(b.end.text, { top: SAFE.top + 40, max: 120, min: 56, maxLines: 2, width: 900, fill: th.accent, halo: th.halo, attrs: 'data-role="final"', anim: (j) => kfm('pop', 0.35, tE + 0.05 + j * 0.08) })
    const sub = b.end.sub ? textBlock(b.end.sub, { top: SAFE.top + 40 + tb.height + 24, max: 58, min: 34, maxLines: 2, width: 880, fill: th.ink, halo: th.halo, attrs: 'data-role="final"', anim: () => kfm('up', 0.35, tE + 0.3, 'ease-out') }).svg : ''
    ui.push(win(tE, ed, `${tb.svg}${sub}`, 'dwinEnd'))
    keyTimes.push(f(D - 0.5))
  }

  // règles CSS des parties animables
  for (const [key, r] of partRules) {
    const [cls, part] = key.split(' ')
    css.push(`.${cls} [data-part="${part}"]{transform-box:fill-box;transform-origin:${r.origin};${r.vars};animation:${r.list.join(',')}}`)
  }

  let music
  if (b.audio && dir && ctx.outDir) {
    const af = ref(b.audio)
    if (existsSync(af)) music = path.relative(ctx.outDir, af)
    else warnings.push(`audio : ${b.audio} introuvable (rendu muet jusqu'à la production de la bande son)`)
  }
  const body = `  <g style="${cameraStyle(s)}">\n  ${world.join('\n  ')}\n  </g>\n  ${ui.join('\n  ')}`
  const svg = svgDocument({
    title: b.title ?? b.shots[0].texts.find((t) => t.kind === 'title').text, format: name, id: b.id, duration: D, defs: [...defs].join('\n    '),
    css: DIALOGUE_CSS + css.join('\n'), keyframes: s.keyframes, body, music,
  })
  const script = s.script(b.id, D)
  script.lines = script.lines.map((l) => ({ ...l, who: l.role }))
  return { svg, script, duration: f(D), keyTimes: keyTimes.sort((a, c) => a - c), info: { lines: s.lines.length, sfx: s.sfx.length, camera: cameraMoves(s) + cams.length, warnings, timeline: !!timeline } }
}
