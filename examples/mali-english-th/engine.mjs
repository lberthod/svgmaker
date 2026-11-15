// Moteur « Learn English with Mali » : reel interactif pour enfants thaïlandais (≈ 4 ans).
// Mali (มะลิ), bébé éléphant : marche, saute, parle (bouche calée sur le volume réel de sa voix),
// change d'expression, réagit à chaque objet ; caméra (zoom, tremblement) ; l'enfant répète
// (« Your turn! ») et gagne une étoile par mot ; quiz final.
//
// Un thème = un fichier themes/<id>.mjs (voir themes/README.md). Utilisation : ./build.sh <id>
// API : build(theme, voice) → { svg, script } ; voice = contenu de voice.json (sortie d'audio.py).
//
// Ce fichier est le FORMAT (minutage intro / 5 mots / quiz / fin, interface, étoiles, confettis).
// Le personnage, les gags, la caméra et la synchro labiale viennent de src/kit/actors/.

import * as kit from '../../src/kit/core.mjs'
import { lib } from '../../src/kit/library.mjs'
import { createScene } from '../../src/kit/actors/scene.mjs'
import * as camera from '../../src/kit/actors/camera.mjs'
import { createMali } from '../../src/kit/actors/mali.mjs'
import { runGag } from '../../src/kit/actors/gags.mjs'

// réexportés pour les thèmes (import { INK, S, face, f } from '../engine.mjs')
export { RAINBOW, INK, EN_FONT, TH_FONT, S, esc } from '../../src/kit/core.mjs'
import { RAINBOW, INK, EN_FONT, TH_FONT, S, esc } from '../../src/kit/core.mjs'
export { SKIN, SKIN_D } from '../../src/kit/actors/mali.mjs'
export const GOLD = '#FFC93C'
export const f = kit.fixed(3)
// corps mesuré avec la vraie police : le texte tient dans `width` px (Fredoka en anglais, Mali en thaï)
const fitEn = (s, max, width) => kit.fitSize(s, { kind: 'en', max, width })
const fitTh = (s, max, width) => kit.fitSize(s, { kind: 'th', max, width })
// texte d'une pastille du bas (y 1380…1492) : tient en largeur et en hauteur, encre centrée
const pillText = (s) => { const b = kit.fitInBox(s, { kind: 'th', max: 76, width: 530, height: 96, cy: 1436 }); return `y="${b.y}" text-anchor="middle" font-size="${b.size}"` }

// ------------------------------------------------------------- dessins des mots (centrés 0,0)
export const face = (dy = 0) => `
  <ellipse cx="-42" cy="${dy - 10}" rx="15" ry="21" fill="${INK}"/><ellipse cx="42" cy="${dy - 10}" rx="15" ry="21" fill="${INK}"/>
  <circle cx="-37" cy="${dy - 17}" r="5" fill="#fff"/><circle cx="47" cy="${dy - 17}" r="5" fill="#fff"/>
  <circle cx="-80" cy="${dy + 30}" r="20" fill="#FF8FA3" opacity=".75"/><circle cx="80" cy="${dy + 30}" r="20" fill="#FF8FA3" opacity=".75"/>
  <path d="M -34 ${dy + 34} Q 0 ${dy + 72} 34 ${dy + 34}" fill="none" ${S(10)}/>`
// dessins de base (library/, style Mali) : clé locale → id de bibliothèque ; un thème peut en ajouter (theme.art)
export const ART_BUILTIN = lib({ cat: 'cat-mali', dog: 'dog-mali', apple: 'apple-mali', sun: 'sun-mali', sunSpin: 'sun-spin-mali', fish: 'fish-mali' })
// la position est portée par un <g> : une animation CSS « transform » sur le <path> écraserait l'attribut transform
export const star5 = (x, y, r, c, extra = '') => kit.star5(x, y, r, c, extra, f)

/** Contrôle d'un thème (voir themes/README.md). Lève une erreur explicite, sinon retourne le thème. */
export function validateTheme(theme, id = theme?.id) {
  const err = (m) => { throw new Error(`themes/${id}.mjs : ${m}`) }
  if (!theme || typeof theme !== 'object') err('export default manquant')
  if (theme.id !== id) err(`déclare id « ${theme.id} »`)
  if (!theme.title?.en || !theme.title?.th) err('title.en et title.th obligatoires')
  if (!Array.isArray(theme.words) || theme.words.length !== 5) err(`le thème doit avoir 5 mots (${theme.words?.length ?? 0})`)
  for (const [k, v] of Object.entries(theme.art || {})) {
    try { kit.validateArt(v, `art.${k}`) } catch (e) { err(e.message) }
  }
  const ART = { ...ART_BUILTIN, ...(theme.art || {}) }
  for (const [i, w] of theme.words.entries()) {
    const where = `mot ${i + 1} (${w.en ?? '?'})`
    for (const k of ['en', 'say', 'th', 'art', 'color']) if (!w[k]) err(`${where} : champ « ${k} » manquant`)
    if (!ART[w.art]) err(`${where} : dessin « ${w.art} » introuvable (ni dans art du thème, ni dans ART_BUILTIN)`)
    if (!/^#[0-9A-Fa-f]{6}$/.test(w.color)) err(`${where} : color attendu #RRGGBB`)
    if (w.sound && [...w.sound].length > 12) err(`${where} : sound « ${w.sound} » dépasse 12 caractères`)
  }
  const q = theme.quiz
  if (!q || !Array.isArray(q.choices) || q.choices.length !== 3) err('quiz.choices : 3 indices de mots attendus')
  for (const c of [q.answer, ...q.choices]) if (!Number.isInteger(c) || c < 0 || c > 4) err(`quiz : indice ${c} hors de 0..4`)
  if (!q.choices.includes(q.answer)) err('quiz : answer doit figurer dans choices')
  return theme
}

export function build(theme, VOICE = {}) {
  const WORDS = theme.words
  const QUIZ = theme.quiz
const INTRO = 8.0, SCENE = 9.0
const Q = INTRO + WORDS.length * SCENE
const O = Q + 10
const D = O + 6.5  // la réplique thaïe de fin (~2,9 s) doit finir avant le fondu de rendu (1,2 s)
const MALI_X = 290, GROUND = 1365, MALI_K = 1.3
const OBJ = { x: 825, y: 1110 }
const SLOT = (i) => ({ x: 540 + (i - 2.5) * 84, y: 1565 })
// ------------------------------------------------------------- scène, caméra, acteur (src/kit/actors)
const s = createScene({ fmt: f, voice: VOICE })
const { lines, sfx, say, fx, win, path } = s
const custom = s.keyframes, front = s.front
const actor = createMali(s, { x: MALI_X, ground: GROUND, k: MALI_K, duration: D })
const { walk, hop, expr } = actor
const HEAD = actor.head // centre de la tête de Mali (monde)
const punch = (...a) => camera.punch(s, ...a)

  const ART = { ...ART_BUILTIN, ...(theme.art || {}) }
// un dessin « <clé>Spin » (ex. sunSpin = rayons) tourne derrière le dessin principal
const art = (k, scale) => `<g transform="scale(${scale})" filter="url(#crayon)">${ART[k + 'Spin'] ? `<g class="spin"><use href="#art-${k}Spin"/></g>` : ''}<use href="#art-${k}"/></g>`

// ------------------------------------------------------------- styles
const css = `
text{font-weight:700;paint-order:stroke;stroke:#fff;stroke-linejoin:round}
.en{font-family:${EN_FONT}}.th{font-family:${TH_FONT}}
.sc{opacity:0}
.pop,.fx{transform-box:fill-box;transform-origin:center}
.legA,.legB{transform-box:fill-box;transform-origin:50% 0%}
.ear{transform-origin:96px -258px}
.eye{transform-box:fill-box;transform-origin:center}
.ex{opacity:0}
.mouth{opacity:0;transform-box:fill-box;transform-origin:center}
.trunk{transform-origin:178px -246px}
.tail{transform-origin:-128px -165px;animation:tailwag 1.1s ease-in-out infinite alternate}
.flower{animation:spin 6s linear infinite}
.glasses,.dizzy{opacity:0}
.spin{animation:spin 9s linear infinite}
@keyframes show{0%,100%{opacity:1}}
@keyframes hide{0%,100%{opacity:0}}
@keyframes scene{0%{opacity:0}4%{opacity:1}95%{opacity:1}100%{opacity:0}}
@keyframes sceneUI{0%{opacity:0;transform:translateX(140px)}5%{opacity:1;transform:none}95%{opacity:1;transform:none}100%{opacity:0;transform:translateX(-140px)}}
@keyframes sceneEnd{0%{opacity:0}8%{opacity:1}100%{opacity:1}}
@keyframes pop{0%{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.12)}80%{transform:scale(.95)}100%{opacity:1;transform:none}}
@keyframes up{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:none}}
@keyframes banner{0%{opacity:0;transform:scale(.5)}8%{opacity:1;transform:none}92%{opacity:1;transform:none}100%{opacity:0;transform:scale(.9)}}
@keyframes shrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes eq{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes bubble{0%{opacity:0;transform:scale(.3)}15%{opacity:1;transform:scale(1.1)}25%{transform:none}85%{opacity:1}100%{opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes wiggle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}}
@keyframes swim{0%,100%{transform:translate(-22px,0) rotate(-4deg)}50%{transform:translate(22px,-12px) rotate(4deg)}}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-9px)}}
@keyframes tailwag{from{transform:rotate(-10deg)}to{transform:rotate(12deg)}}
@keyframes flap{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.84)}}
@keyframes listen{0%{transform:scaleX(1)}15%,85%{transform:scaleX(1.35) rotate(-8deg)}100%{transform:scaleX(1)}}
@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes talk{from{opacity:1;transform:scale(.8,.25)}to{opacity:1;transform:scale(1,1.15)}}
@keyframes walkA{0%,100%{transform:rotate(16deg)}50%{transform:rotate(-16deg)}}
@keyframes walkB{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(16deg)}}
@keyframes hop{0%,100%{transform:none}45%{transform:translateY(-140px)}}
@keyframes bigjump{0%,100%{transform:none}10%{transform:translateY(10px) scaleY(.92)}45%{transform:translateY(-230px) rotate(-6deg)}}
@keyframes shake{0%,100%{transform:none}10%,30%,50%,70%,90%{transform:rotate(-7deg)}20%,40%,60%,80%{transform:rotate(7deg)}}
@keyframes lean{0%,100%{transform:none}15%,85%{transform:rotate(-7deg) translateX(-12px)}}
@keyframes tilt{0%,100%{transform:none}20%,60%{transform:rotate(6deg)}40%,80%{transform:rotate(-6deg)}}
@keyframes dance{0%,100%{transform:none}25%{transform:rotate(-8deg) translateY(-30px)}50%{transform:none}75%{transform:rotate(8deg) translateY(-30px)}}
@keyframes wave{0%,100%{transform:none}15%,45%,75%{transform:rotate(-72deg)}30%,60%,90%{transform:rotate(-48deg)}}
@keyframes point{0%,100%{transform:none}20%,80%{transform:rotate(-34deg)}}
@keyframes glasses{0%{opacity:1;transform:translateY(-170px)}10%{opacity:1;transform:none}94%{opacity:1;transform:none}100%{opacity:0;transform:none}}
@keyframes dizzy{0%{opacity:0;transform:rotate(0)}10%,88%{opacity:1}100%{opacity:0;transform:rotate(600deg)}}
@keyframes glow{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes fade{to{opacity:.3}}
@keyframes away{0%{transform:none;opacity:1}100%{transform:translate(120px,-1100px) rotate(15deg);opacity:0}}
@keyframes ring{0%{opacity:0;transform:scale(.3)}15%{opacity:1;transform:scale(1.1)}30%,45%,60%,75%{transform:scale(1)}37%,52%,67%{transform:scale(1.12)}90%{opacity:1}100%{opacity:0;transform:scale(1.2)}}
@keyframes burst{0%{opacity:0;transform:scale(.3) rotate(0)}30%{opacity:1}100%{opacity:0;transform:scale(1.4) rotate(40deg)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(50px)}}
@keyframes sway{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes wing{from{transform:scaleX(1)}to{transform:scaleX(.25)}}
@keyframes birdflap{from{transform:scaleY(1)}to{transform:scaleY(-.6)}}
@keyframes slotOn{0%{fill:#FFFDF5;transform:scale(1)}45%{fill:${GOLD};transform:scale(1.7)}100%{fill:${GOLD};transform:scale(1.15)}}
.wiggleIdle{animation:wiggle 1.4s ease-in-out infinite}.bounceIdle{animation:bounce 0.9s ease-in-out infinite}.swingIdle{animation:wiggle 1.8s ease-in-out infinite}.swimIdle{animation:swim 2.2s ease-in-out infinite}
`
// ------------------------------------------------------------- utilitaires de scène
const anim = (name, dur, delay, ease, fill) => kit.anim(name, dur, delay, ease, fill, f)
const rainbow = (word, o = 0) => kit.rainbow(word, o)
const bubbleText = (x, y, text, t, color) => `
  <g class="fx" style="${anim('bubble', 1.6, t, 'ease-out')}">
    <path d="M ${x - 120} ${y - 60} h 240 a 30 30 0 0 1 30 30 v 50 a 30 30 0 0 1 -30 30 h -90 l -30 30 l -6 -30 h -114 a 30 30 0 0 1 -30 -30 v -50 a 30 30 0 0 1 30 -30 z" fill="#fff" ${S(7)}/>
    <text class="en" x="${x}" y="${y + 18}" text-anchor="middle" font-size="${fitEn(text, 54, 230)}" fill="${color}" stroke-width="6">${esc(text)}</text>
  </g>`
// bandeau « à toi de dire » : micro, égaliseur qui « écoute », barre de temps
const yourTurn = (t, word) => {
  // place libre entre le micro et l'égaliseur ≈ 480 px : le corps s'adapte à la longueur du mot
  // (Chalkboard ≈ 0,56 em par caractère ; « · พูดตามนะ » ≈ 3,4 em au corps anglais)
  const fs = f(Math.min(50, 460 / (kit.textWidth(`Say “${word}”!`, 'en') + 0.8 * kit.textWidth(' · พูดตามนะ', 'th'))))
  fx(t + 0.95, 'tick'); fx(t + 1.75, 'tick'); fx(t + 2.55, 'tick')
  const bars = [0, 1, 2, 3].map((k) => `<rect x="${760 + k * 22}" y="1400" width="14" height="44" rx="7" fill="#8E5BD9" style="transform-box:fill-box;transform-origin:center bottom;animation:eq ${f(0.35 + k * 0.07)}s ease-in-out ${f(t + 0.8)}s 6"/>`).join('')
  return `
  <g class="fx" style="${anim('banner', 2.9, t, 'ease-out')}">
    <rect x="150" y="1378" width="780" height="112" rx="56" fill="#fff" stroke="#8E5BD9" stroke-width="10"/>
    <text class="en" x="225" y="1450" text-anchor="middle" font-size="60" stroke-width="0">🎤</text>
    <text x="510" y="1438" text-anchor="middle" font-size="${fs}" fill="#8E5BD9" stroke-width="6"><tspan class="en">Say “${esc(word)}”!</tspan><tspan class="th" font-size="${f(fs * 0.8)}" fill="#7A6A5C"> · พูดตามนะ</tspan></text>
    ${bars}
    <rect x="290" y="1458" width="440" height="14" rx="7" fill="#E8DDF7"/>
    <rect x="290" y="1458" width="440" height="14" rx="7" fill="#8E5BD9" style="transform-box:fill-box;transform-origin:left center;${anim('shrink', 2.6, t + 0.2, 'linear')}"/>
  </g>`
}
// confettis réutilisables : chaque pièce reçoit toutes les fenêtres de fête
const party = []
const celebrate = (t) => { party.push(t); fx(t, 'yay') }
function confetti() {
  const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647) })()
  let out = ''
  for (let i = 0; i < 34; i++) {
    const x = 60 + rnd() * 960, dx = (rnd() - 0.5) * 300, c = RAINBOW[i % RAINBOW.length], w = 16 + rnd() * 14
    const name = `cf${i}`
    custom.push(`@keyframes ${name}{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:1;transform:translate(${f(dx)}px,1650px) rotate(${Math.round(rnd() * 900)}deg)}}`)
    const list = party.map((t) => `${name} ${f(1.6 + rnd() * 0.8)}s ease-in ${f(t + rnd() * 0.25)}s`).join(',')
    out += i % 3 ? `<rect x="${f(x)}" y="${f(60 + rnd() * 200)}" width="${f(w)}" height="${f(w * 0.55)}" rx="3" fill="${c}" style="opacity:0;transform-box:fill-box;transform-origin:center;animation:${list}"/>`
      : star5(f(x), f(60 + rnd() * 200), 13, c, `style="opacity:0;transform-box:fill-box;transform-origin:center;animation:${list}"`)
  }
  return out
}
// étoiles gagnées : une étoile vole de Mali vers sa case, la case devient dorée
const rewards = []
const reward = (t, i) => { rewards.push({ t, i }); fx(t, 'whoosh'); fx(t + 0.85, 'collect') }
function rewardLayer() {
  const fly = rewards.map(({ t, i }) => {
    const s = SLOT(i)
    const n = path(`fly${i}`, [[0, HEAD.x + 40, HEAD.y - 120, 0, 0.3, 1], [15, HEAD.x + 60, HEAD.y - 230, 90, 1.6, 1], [55, (HEAD.x + s.x) / 2 + 120, 900, 300, 1.3, 1], [100, s.x, s.y, 720, 0.8, 1]])
    return `<g style="opacity:0;${anim(n, 0.9, t, 'ease-in-out', 'none')}">${star5(0, 0, 34, GOLD)}</g>`
  }).join('')
  const slots = WORDS.map((_, i) => i).concat([5]).map((i) => {
    const s = SLOT(i), r = rewards.find((x) => x.i === i), big = i === 5
    return star5(s.x, s.y, big ? 34 : 26, '#FFFDF5', `class="fx" style="${r ? anim('slotOn', 0.6, r.t + 0.85, 'ease-out') : ''}"`)
  }).join('')
  return fly + slots
}

// ------------------------------------------------------------- décor vivant (dans la caméra)
function ambient() {
  const flower = (x, y, c, d) => `<g transform="translate(${x} ${y})"><g style="transform-origin:0 0;animation:sway ${f(1.6 + d)}s ease-in-out ${f(d)}s infinite alternate">
    <path d="M 0 0 q -6 -40 0 -70" fill="none" stroke="#3DBE5A" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="-16" cy="-34" rx="14" ry="7" transform="rotate(-30 -16 -34)" fill="#3DBE5A"/>
    <g transform="translate(0 -78)">${[0, 60, 120, 180, 240, 300].map((r) => `<ellipse cx="0" cy="-14" rx="10" ry="15" transform="rotate(${r})" fill="${c}" ${S(3)}/>`).join('')}<circle r="9" fill="#FFE07A" ${S(3)}/></g></g></g>`
  const fly = path('butterfly', [[0, -80, 760, 10], [18, 260, 680, -10], [36, 520, 900, 15], [54, 760, 700, -15], [72, 1000, 860, 10], [86, 1160, 720, 0], [100, 1160, 720, 0]])
  const bird = path('bird', [[0, -120, 180], [100, 1220, 120]])
  return `
  ${flower(40, GROUND + 25, '#FF8FA3', 0)}${flower(1010, GROUND + 15, '#B892FF', 0.4)}${flower(950, GROUND + 70, '#FFB86B', 0.8)}${flower(110, GROUND + 95, '#7FD1FF', 0.2)}
  <g style="animation:${fly} 14s linear 1s infinite both"><g transform="scale(.9)">
    <g style="transform-box:fill-box;transform-origin:right center;animation:wing .17s ease-in-out infinite alternate"><ellipse cx="-18" cy="-8" rx="22" ry="16" fill="#FF8FA3" ${S(4)}/><ellipse cx="-14" cy="12" rx="14" ry="10" fill="#FFC2D1" ${S(4)}/></g>
    <g style="transform-box:fill-box;transform-origin:left center;animation:wing .17s ease-in-out infinite alternate"><ellipse cx="18" cy="-8" rx="22" ry="16" fill="#FF8FA3" ${S(4)}/><ellipse cx="14" cy="12" rx="14" ry="10" fill="#FFC2D1" ${S(4)}/></g>
    <rect x="-4" y="-18" width="8" height="38" rx="4" fill="${INK}"/></g></g>
  <g style="animation:${bird} 16s linear 3s infinite both">${[0, 70].map((dx, k) => `<g transform="translate(${dx} ${k * 30})"><path d="M -22 0 q 11 -14 22 0 q 11 -14 22 0" fill="none" ${S(5)} style="transform-box:fill-box;transform-origin:center;animation:birdflap .3s ease-in-out ${k * 0.1}s infinite alternate"/></g>`).join('')}</g>`
}

// ------------------------------------------------------------- intro
function intro() {
  walk(0, 2.2)
  hop(2.3)
  win('trunk', 'wave', 2.6, 1.4)
  expr(2.3, 2.6, 'happy', 'laugh')
  say(2.4, 'mali_en', "Hi! I'm Mali!")
  say(3.7, 'mali_th', 'สวัสดีจ้า ฉันชื่อมะลิ')
  say(6.25, 'mali_en', theme.title.say ?? `Let's learn ${theme.title.en.toLowerCase()}!`)
  win('trunk', 'point', 6.15, 1.4); fx(6.1, 'sparkle')
  punch(2.2, 2.8, HEAD.x + 60, HEAD.y + 40, 1.1)
  return {
    stage: bubbleText(MALI_X + 360, 760, 'Hi!', 2.4, '#8E5BD9'),
    ui: `
    <text class="en pop" x="540" y="400" text-anchor="middle" font-size="96" fill="${INK}" stroke-width="16" data-role="hook" style="${anim('pop', 0.6, 0.15)}">Learn English</text>
    <text class="en pop" x="540" y="520" text-anchor="middle" font-size="120" stroke-width="18" data-role="hook" style="${anim('pop', 0.6, 0.45)}">${rainbow('with Mali!')}</text>
    <text class="th fx" x="540" y="610" text-anchor="middle" font-size="56" fill="#1E9BE0" stroke-width="10" style="${anim('up', 0.5, 1.0, 'ease-out')}">มาเรียนภาษาอังกฤษกับมะลิ 🐘</text>
    <g class="pop" style="${anim('pop', 0.6, 6.05)}">
      <rect x="130" y="660" width="820" height="112" rx="56" fill="${theme.color ?? '#8E5BD9'}" stroke="${INK}" stroke-width="8"/>
      <text x="540" y="736" text-anchor="middle" font-size="${f(Math.min(50, 760 / (kit.textWidth(`${theme.title.emoji ?? ''} ${theme.title.en}`, 'en') + kit.textWidth(` · ${theme.title.th}`, 'th'))))}" fill="#fff" style="stroke:${INK};stroke-width:6px"><tspan class="en">${esc(theme.title.emoji ?? '')} ${esc(theme.title.en)}</tspan><tspan class="th"> · ${esc(theme.title.th)}</tspan></text>
    </g>`,
  }
}

// ------------------------------------------------------------- une scène par mot
// Gags génériques : chaque mot choisit un type ; l'objet dessiné est w.art.
//   w.gag = 'box' | { type: 'box', sfx: 'meow' } … (sfx = bruitage de l'objet, voir audio.py)
const gag = (w, t) => runGag({ s, actor, art, anim, obj: OBJ, scene: SCENE }, w, t)

function sceneWord(w, i) {
  const t = INTRO + i * SCENE
  fx(t - 0.05, 'whoosh')
  say(t + 1.6, 'narrator', w.en)
  win('trunk', 'point', t + 2.5, 1.3); say(t + 2.6, 'mali_en', `${w.en}!`)
  say(t + 3.8, 'mali_en', 'Your turn!')
  win('shake', 'lean', t + 4.6, 2.0); win('ear', 'listen', t + 4.6, 2.0)
  celebrate(t + 6.7); win('shake', 'dance', t + 6.75, 1.2); expr(t + 6.7, 1.6, 'happy', 'laugh')
  say(t + 6.75, 'mali_en', 'Yay!')
  reward(t + 7.0, i)
  say(t + 7.4, 'mali_th', w.th)
  return {
    stage: `${gag(w, t)}${bubbleText(OBJ.x - 20, 735, w.sound, t + 0.6, w.color)}`,
    ui: `
    <g class="pop" style="${anim('pop', 0.6, t + 1.4)}">
      <rect x="230" y="285" width="620" height="290" rx="60" fill="#fff" stroke="${w.color}" stroke-width="14" filter="url(#crayon)"/>
      <text class="en" x="540" y="460" text-anchor="middle" font-size="${fitEn(w.en, 160, 560)}" stroke-width="16">${theme.wordColor === 'own' ? `<tspan fill="${w.color}" style="stroke:${INK};stroke-width:7px">${esc(w.en)}</tspan>` : rainbow(w.en, i)}</text>
      <text class="th" x="540" y="540" text-anchor="middle" font-size="${fitTh(`อ่านว่า “${w.say}”`, 42, 580)}" fill="#7A6A5C" stroke-width="8">อ่านว่า “${esc(w.say)}”</text>
    </g>
    ${yourTurn(t + 3.8, w.en)}
    <g class="pop" style="${anim('pop', 0.6, t + 6.8)}">
      <rect x="250" y="1380" width="580" height="112" rx="56" fill="${w.color}" stroke="${INK}" stroke-width="8"/>
      <text class="th" x="540" ${pillText(`${w.en} = ${w.th}`)} fill="#fff" style="stroke:${INK};stroke-width:7px">${esc(w.en)} = ${esc(w.th)}</text>
    </g>`,
  }
}

// ------------------------------------------------------------- quiz
function quiz() {
  const ans = WORDS[QUIZ.answer]
  fx(Q - 0.05, 'whoosh')
  const qEn = QUIZ.q?.en ?? `Where ${ans.plural ? 'are' : 'is'} the ${ans.en.toLowerCase()}?`, qTh = QUIZ.q?.th ?? `${ans.th}อยู่ไหนนะ?`
  const qFs = fitEn(qEn, 96, 900) // la question tient entre les marges (≈ 900 px)
  say(Q + 0.3, 'mali_en', qEn)
  say(Q + 1.8, 'mali_th', qTh)
  win('shake', 'tilt', Q + 3.0, 2.6); fx(Q + 3.0, 'drumroll'); win('trunk', 'point', Q + 3.0, 2.6)
  celebrate(Q + 5.8); win('shake', 'dance', Q + 5.85, 1.2); win('trunk', 'wave', Q + 5.9, 1.6); expr(Q + 5.8, 2.6, 'happy', 'laugh')
  fx(Q + 5.75, 'ding'); say(Q + 6.0, 'mali_en', `Yes! ${ans.en}!`); say(Q + 7.4, 'mali_th', 'เก่งมาก!')
  reward(Q + 6.4, 5)
  const xs = [220, 540, 860]
  const cards = QUIZ.choices.map((wi, k) => {
    const w = WORDS[wi], x = xs[k], ok = wi === QUIZ.answer
    return `
    <g class="pop" style="${anim('pop', 0.5, Q + 0.6 + k * 0.25)}">
      <g class="fx" style="${ok ? anim('glow', 0.6, Q + 5.8, 'ease-in-out', 'none') + ';animation-iteration-count:3' : anim('fade', 0.4, Q + 5.8, 'ease-out', 'forwards')}">
        <rect x="${x - 120}" y="585" width="240" height="240" rx="42" fill="#fff" stroke="${w.color}" stroke-width="12"/>
        <g transform="translate(${x} 705)">${art(w.art, 0.42)}</g>
      </g>
    </g>
    ${ok ? `<g class="pop" style="${anim('pop', 0.5, Q + 5.8)}"><circle cx="${x + 98}" cy="598" r="48" fill="#3DBE5A" ${S(8)}/><path d="M ${x + 75} 598 l 16 18 l 31 -36" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g class="pop" style="${anim('pop', 0.6, Q + 6.0)}"><rect x="250" y="1380" width="580" height="112" rx="56" fill="${w.color}" stroke="${INK}" stroke-width="8"/>
      <text class="th" x="540" ${pillText(`${w.en} = ${w.th}`)} fill="#fff" style="stroke:${INK};stroke-width:7px">${esc(w.en)} = ${esc(w.th)}</text></g>` : ''}`
  }).join('')
  return {
    stage: '',
    ui: `
    <text class="en pop" x="540" y="420" text-anchor="middle" font-size="${qFs}" stroke-width="16" style="${anim('pop', 0.6, Q + 0.2)}">${theme.wordColor === 'own' ? `<tspan fill="${INK}">${esc(qEn)}</tspan>` : rainbow(qEn, 3)}</text>
    <text class="th fx" x="540" y="510" text-anchor="middle" font-size="${fitTh(`${qTh} 🤔`, 60, 900)}" fill="#1E9BE0" stroke-width="10" style="${anim('up', 0.5, Q + 1.7, 'ease-out')}">${esc(qTh)} 🤔</text>
    ${cards}
    <g class="fx" style="${anim('banner', 2.8, Q + 3.0, 'ease-out')}">
      <rect x="250" y="1378" width="580" height="112" rx="56" fill="#fff" stroke="#8E5BD9" stroke-width="10"/>
      <text class="en" x="540" y="1440" text-anchor="middle" font-size="54" fill="#8E5BD9" stroke-width="6">3 · 2 · 1 …</text>
      <rect x="330" y="1458" width="420" height="14" rx="7" fill="#8E5BD9" style="transform-box:fill-box;transform-origin:left center;${anim('shrink', 2.6, Q + 3.1, 'linear')}"/>
    </g>`,
  }
}

// ------------------------------------------------------------- fin
function outro() {
  fx(O - 0.05, 'whoosh')
  say(O + 0.3, 'mali_en', 'Bye-bye! See you soon!')
  say(O + 2.0, 'mali_th', 'บ๊ายบาย แล้วเจอกันนะ')
  win('trunk', 'wave', O + 0.3, 2.0)
  hop(O + 0.2)
  expr(O + 0.2, 2.6, 'happy', 'laugh')
  walk(O + 3.4, 2.4)  // Mali sort après « บ๊ายบาย… », pas pendant
  const mini = WORDS.map((w, i) => {
    const x = 150 + i * 195
    return `<g class="pop" style="${anim('pop', 0.45, O + 0.6 + i * 0.15)}"><rect x="${x - 82}" y="590" width="164" height="164" rx="30" fill="#fff" stroke="${w.color}" stroke-width="8"/><g transform="translate(${x} 672)">${art(w.art, 0.3)}</g>
      <text class="en" x="${x}" y="812" text-anchor="middle" font-size="${fitEn(w.en, 44, 175)}" fill="${w.color}" stroke-width="8">${esc(w.en)}</text></g>`
  }).join('')
  return {
    stage: '',
    ui: `
    <text class="en pop" x="540" y="420" text-anchor="middle" font-size="130" stroke-width="18" data-role="final" style="${anim('pop', 0.6, O + 0.1)}">${rainbow('Bye-bye!', 1)} 👋</text>
    <text class="th pop" x="540" y="520" text-anchor="middle" font-size="60" fill="#3DBE5A" stroke-width="10" data-role="final" style="${anim('pop', 0.6, O + 0.5)}">บ๊ายบาย แล้วเจอกันนะ!</text>
    ${mini}`,
  }
}

// ------------------------------------------------------------- assemblage
const parts = [
  { s: 0, d: INTRO, k: 'scene', ...intro() },
  ...WORDS.map((w, i) => ({ s: INTRO + i * SCENE, d: SCENE, k: 'scene', ...sceneWord(w, i) })),
  { s: Q, d: O - Q, k: 'scene', ...quiz() },
  { s: O, d: D - O, k: 'sceneEnd', ...outro() },
]
const wrap = (p, which) => `<g class="sc" style="animation:${which === 'ui' && p.k === 'scene' ? 'sceneUI' : p.k} ${f(p.d)}s ${which === 'ui' ? 'cubic-bezier(.2,.8,.2,1)' : 'linear'} ${f(p.s)}s both">${p[which]}</g>`
const pct = (t) => f((t / D) * 100)
custom.push(`@keyframes maliPath{0%{transform:translate(-280px,${GROUND}px)}${pct(2.2)}%{transform:translate(${MALI_X}px,${GROUND}px)}${pct(O + 3.4)}%{transform:translate(${MALI_X}px,${GROUND}px)}${pct(O + 5.8)}%{transform:translate(1350px,${GROUND}px)}100%{transform:translate(1350px,${GROUND}px)}}`)
const stage = parts.map((p) => wrap(p, 'stage')).join('')
const ui = parts.map((p) => wrap(p, 'ui')).join('')
const maliSvg = actor.draw()
const rewardSvg = rewardLayer()
const confettiSvg = confetti()
const ambientSvg = ambient() // AVANT le gabarit : ambient() ajoute des keyframes à custom
const cloud = (x, y, k, d) => kit.cloud(x, y, k, d, { alternate: true })

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" data-duration="${f(D)}" data-fps="30">
  <title>Learn English with Mali · ${esc(theme.title.en)} · ${esc(theme.title.th)}</title>
  <!-- Généré par engine.mjs (thème ${theme.id}) : modifier themes/${theme.id}.mjs puis ./build.sh ${theme.id} -->
  <defs>
    ${kit.SKY_GRADIENT}
    ${kit.crayonFilter({ pad: 15, scale: 6 })}
    ${Object.entries(ART).map(([k, v]) => `<g id="art-${k}">${v}</g>`).join('\n    ')}
  </defs>
  <style>${kit.fontFaceCSS()}
${css}
${custom.join('\n')}</style>
  <g style="${camera.cameraStyle(s)}">
    <rect x="-200" y="-200" width="1480" height="2320" fill="url(#sky)"/>
    ${cloud(170, 170, 0.9, 0)}${cloud(900, 230, 0.7, 1.5)}${cloud(560, 120, 0.5, 3)}
    <path d="M -200 ${GROUND - 20} L 0 ${GROUND - 20} Q 270 ${GROUND - 60} 540 ${GROUND - 20} T 1080 ${GROUND - 30} L 1280 ${GROUND - 30} L 1280 2120 L -200 2120 Z" fill="#9BE07A" stroke="#6DBF4E" stroke-width="10" filter="url(#crayon)"/>
    ${ambientSvg}
    ${stage}
    ${maliSvg}
    ${front.join('')}
  </g>
  ${ui}
  ${confettiSvg}
  ${rewardSvg}
</svg>
`
return {
  svg,
  script: s.script(theme.id, D),
  info: { duration: f(D), lines: lines.length, sfx: sfx.length, camera: camera.cameraMoves(s), lipsync: Object.keys(VOICE).length > 0 },
}
}
