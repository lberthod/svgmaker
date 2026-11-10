// Reels « 5 mots d'anglais » pour enfants thaïlandais (≈ 4 ans), un thème = une vidéo.
// Style dessin d'enfant : traits épais au crayon, couleurs vives, objets qui sourient.
//
//   node make.mjs themes/001-farm-animals.json [autres.json…]
//     → out/<id>/<id>.svg + out/<id>/cues.json (minutage des voix, lu par audio.py)
//
// Format d'un thème : voir STYLE.md.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import * as kit from '../../src/kit/core.mjs'
import { resolveArt } from '../../src/kit/library.mjs'

const { RAINBOW, INK, EN_FONT, TH_FONT, esc, validateArt } = kit
const HERE = path.dirname(new URL(import.meta.url).pathname)
const INTRO = 5.0, SCENE = 5.2, OUTRO_LEN = 7.4
const IDLES = ['wiggle', 'bounce', 'swing', 'swim', 'pulse', 'float', 'spin']
const f = kit.fixed(2)

// corps qui fait tenir le texte dans `width` px, mesuré avec la vraie police (thaï → Mali, sinon Fredoka)
const kindOf = (s) => (/[฀-๿]/.test(s) ? 'th' : 'en')
const fit = (s, max, width) => kit.fitSize(s, { kind: kindOf(s), max, width })

// ---------------------------------------------------------------- validation
export function validate(t, file = '') {
  const err = (m) => { throw new Error(`${file || t.id} : ${m}`) }
  if (!/^\d{3}-[a-z0-9-]+$/.test(t.id || '')) err('id attendu « NNN-slug »')
  if (!t.theme?.en || !t.theme?.th) err('theme.en et theme.th obligatoires')
  if (!Array.isArray(t.words) || t.words.length !== 5) err('exactement 5 mots')
  for (const [i, w] of t.words.entries()) {
    const where = `mot ${i + 1} (${w.en})`
    for (const k of ['en', 'say', 'th', 'color', 'idle', 'art']) if (!w[k]) err(`${where} : champ « ${k} » manquant`)
    if (!IDLES.includes(w.idle)) err(`${where} : idle doit être ${IDLES.join('|')}`)
    if (!/^#[0-9A-Fa-f]{6}$/.test(w.color)) err(`${where} : color attendu #RRGGBB`)
    // art / spin : id de library/ (« cow ») ou, à défaut, dessin SVG en ligne
    try {
      validateArt(resolveArt(w.art), `art « ${w.art.slice(0, 40)} »`)
      if (w.spin) validateArt(resolveArt(w.spin), `spin « ${w.spin.slice(0, 40)} »`)
    } catch (e) { err(`${where} : ${e.message}`) }
  }
  return t
}

// ---------------------------------------------------------------- styles
const css = `
text{font-weight:700;paint-order:stroke;stroke:#fff;stroke-linejoin:round}
.en{font-family:${EN_FONT}}.th{font-family:${TH_FONT}}
.sc{opacity:0;transform-box:view-box;transform-origin:540px 860px}
.pop,.fx{transform-box:fill-box;transform-origin:center}
@keyframes scene{0%{opacity:0;transform:scale(.9)}5%{opacity:1;transform:none}93%{opacity:1;transform:none}100%{opacity:0;transform:scale(1.04)}}
@keyframes sceneEnd{0%{opacity:0;transform:scale(.9)}6%{opacity:1;transform:none}100%{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.12)}80%{transform:scale(.95)}100%{opacity:1;transform:none}}
@keyframes up{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:none}}
@keyframes wiggle{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-26px)}}
@keyframes swing{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes swim{0%,100%{transform:translate(-28px,0) rotate(-3deg)}50%{transform:translate(28px,-14px) rotate(3deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes float{0%,100%{transform:translate(0,0) rotate(-2deg)}50%{transform:translate(0,-34px) rotate(2deg)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinSlow{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
@keyframes rise{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-260px) scale(1.1)}}
@keyframes twinkle{0%,100%{opacity:.25;transform:scale(.7) rotate(0deg)}50%{opacity:1;transform:scale(1.15) rotate(20deg)}}
@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(40px)}}
@keyframes dotOn{from{fill:#fff;transform:scale(1)}50%{transform:scale(1.5)}to{transform:scale(1.15)}}
.wiggle{animation:wiggle 1.4s ease-in-out infinite}.bounce{animation:bounce 1.1s ease-in-out infinite}
.swing{animation:swing 1.6s ease-in-out infinite}.swim{animation:swim 2.2s ease-in-out infinite}
.pulse{animation:pulse 1.2s ease-in-out infinite}.float{animation:float 2.4s ease-in-out infinite}
.spin{animation:spinSlow 2.6s ease-in-out infinite}.rays{animation:spin 9s linear infinite}`

const anim = (name, dur, delay, ease) => kit.anim(name, dur, delay, ease, 'both', f)
const rainbow = (word, offset = 0) => kit.rainbow(word, offset, { keepSpaces: true })
const star = (x, y, r, color, delay) =>
  `<g transform="translate(${x} ${y})"><path class="fx" style="animation:twinkle 1.6s ease-in-out ${f(delay)}s infinite" d="${kit.starPath(r, f)}" fill="${color}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`
const cloud = (x, y, k, delay) => kit.cloud(x, y, k, delay)

/** Dessin d'un mot : art statique (via <use>), rayons tournants éventuels, bulles éventuelles. */
const artOf = (w, i, animated = true) => {
  const spin = w.spin ? (animated ? `<g class="rays" style="transform-origin:0 0"><use href="#spin-${i}"/></g>` : `<use href="#spin-${i}"/>`) : ''
  const bubbles = w.bubbles && animated
    ? [0, 1, 2].map((k) => `<circle cx="${-210 + k * 26}" cy="${-60 - k * 30}" r="${14 + k * 6}" fill="#D6F3FF" stroke="${INK}" stroke-width="5" style="animation:rise 2.4s ease-out ${f(k * 0.8)}s infinite"/>`).join('')
    : ''
  return `${bubbles}${spin}<use href="#art-${i}"/>`
}

export function build(t) {
  const W = t.words
  const OUTRO = INTRO + W.length * SCENE
  const D = OUTRO + OUTRO_LEN
  const cues = [] // { t, voice, text, rate, after? } — after : se cale après la réplique précédente

  const intro = () => {
    cues.push({ t: 0.3, voice: 'Samantha', rate: 165, text: `Let's learn English! ${t.theme.en}!` })
    cues.push({ t: 2.2, voice: 'Kanya', rate: 170, text: `มาเรียนคำศัพท์ หมวด${t.theme.voiceTh || t.theme.th} กัน!`, after: true })
    const ts = fit(t.theme.en, 150, 900)
    return `
  <g class="sc" style="animation:scene ${INTRO}s ease-out 0s both">
    <g transform="translate(540 480) scale(.8)"><g class="pop" style="${anim('pop', 0.7, 0)}"><g class="bounce" filter="url(#crayon)">${artOf(W[0], 0)}</g></g></g>
    <text class="en pop" x="540" y="830" text-anchor="middle" font-size="${fit('Let’s learn English!', 96, 900)}" fill="${INK}" stroke-width="14" data-role="hook" style="${anim('pop', 0.6, 0.15)}">Let’s learn English!</text>
    <text class="en pop" x="540" y="${f(830 + 40 + ts * 0.9)}" text-anchor="middle" font-size="${ts}" stroke-width="20" data-role="hook" style="${anim('pop', 0.6, 0.5)}">${rainbow(t.theme.en)}</text>
    <text class="th fx" x="540" y="${f(830 + 140 + ts * 0.9)}" text-anchor="middle" font-size="${fit(t.theme.th, 70, 880)}" fill="#1E9BE0" stroke-width="12" style="${anim('up', 0.5, 2.0, 'ease-out')}">${esc(t.theme.th)}</text>
    <text class="th fx" x="540" y="${f(830 + 230 + ts * 0.9)}" text-anchor="middle" font-size="50" fill="#7A6A5C" stroke-width="10" style="${anim('up', 0.5, 2.5, 'ease-out')}">5 คำศัพท์ง่าย ๆ</text>
  </g>`
  }

  const scene = (w, i) => {
    const t0 = INTRO + i * SCENE
    cues.push({ t: t0 + 0.7, voice: 'Samantha', rate: 150, text: w.en, ding: true })
    cues.push({ t: t0 + 2.0, voice: 'Samantha', rate: 118, text: w.en, slow: true })
    cues.push({ t: t0 + 3.2, voice: 'Kanya', rate: 150, text: w.th })
    // pastille 118 px de haut : l'encre (tons thaïs empilés compris) reste dedans, centrée
    const { size: thSize, y: thY } = kit.fitInBox(w.th, { kind: 'th', max: 80, width: 640, height: 100, cy: 1349 })
    const pillW = Math.max(380, Math.min(860, kit.textWidth(w.th, 'th', thSize) + 140))
    return `
  <g class="sc" style="animation:scene ${SCENE}s ease-out ${f(t0)}s both">
    <g transform="rotate(${i % 2 ? 2 : -2} 540 665)">
      <rect x="170" y="330" width="740" height="680" rx="70" fill="#fff" stroke="${w.color}" stroke-width="16" filter="url(#crayon)"/>
      <rect x="196" y="356" width="688" height="628" rx="52" fill="none" stroke="${w.color}" stroke-width="5" stroke-dasharray="2 18" stroke-linecap="round" opacity=".6"/>
    </g>
    ${star(230, 380, 34, '#F2B705', t0 + 3.0)}${star(855, 420, 26, '#FF8FA3', t0 + 3.3)}${star(860, 950, 30, '#7FD1FF', t0 + 3.6)}
    <g transform="translate(540 680)">
      <g class="pop" style="${anim('pop', 0.7, t0 + 0.1)}">
        <g filter="url(#crayon)" class="${w.idle}">${artOf(w, i)}</g>
      </g>
    </g>
    <text class="en pop" x="540" y="1170" text-anchor="middle" font-size="${fit(w.en, 168, 800)}" stroke-width="18" style="${anim('pop', 0.6, t0 + 0.6)}">${rainbow(w.en, i)}</text>
    <text class="th fx" x="540" y="1252" text-anchor="middle" font-size="${fit('อ่านว่า “' + w.say + '”', 46, 900)}" fill="#7A6A5C" stroke-width="10" style="${anim('up', 0.5, t0 + 1.8, 'ease-out')}">อ่านว่า “${esc(w.say)}”</text>
    <g class="pop" style="${anim('pop', 0.6, t0 + 3.0)}">
      <rect x="${f(540 - pillW / 2)}" y="1290" width="${f(pillW)}" height="118" rx="59" fill="${w.color}" stroke="${INK}" stroke-width="8"/>
      <text class="th" x="540" y="${f(thY)}" text-anchor="middle" font-size="${thSize}" fill="#fff" style="stroke:${INK};stroke-width:7px">${esc(w.th)}</text>
    </g>
  </g>`
  }

  const recap = () => {
    cues.push({ t: OUTRO + 0.3, voice: 'Samantha', rate: 160, text: 'Great job!' })
    cues.push({ t: OUTRO + 1.5, voice: 'Kanya', rate: 160, text: 'เก่งมาก!', after: true })
    const pos = [[220, 650], [540, 650], [860, 650], [380, 1080], [700, 1080]]
    W.forEach((w, i) => cues.push({ t: OUTRO + 2.7 + i * 0.85, voice: 'Samantha', rate: 165, text: w.en, after: true }))
    const cards = W.map((w, i) => {
      const [x, y] = pos[i], d = OUTRO + 2.6 + i * 0.85
      return `
    <g class="pop" style="${anim('pop', 0.55, d)}">
      <rect x="${x - 135}" y="${y - 135}" width="270" height="270" rx="44" fill="#fff" stroke="${w.color}" stroke-width="10"/>
      <g transform="translate(${x} ${y}) scale(.5)" filter="url(#crayon)">${artOf(w, i, false)}</g>
      <text class="en" x="${x}" y="${y + 205}" text-anchor="middle" font-size="${fit(w.en, 62, 280)}" fill="${w.color}" stroke-width="10">${esc(w.en)}</text>
    </g>`
    }).join('')
    return `
  <g class="sc" style="animation:sceneEnd ${f(D - OUTRO)}s ease-out ${f(OUTRO)}s both">
    <text class="en pop" x="540" y="385" text-anchor="middle" font-size="120" stroke-width="16" data-role="final" style="${anim('pop', 0.6, OUTRO + 0.2)}">${rainbow('Great job!', 2)}</text>
    <text class="th pop" x="540" y="482" text-anchor="middle" font-size="72" fill="#3DBE5A" stroke-width="12" data-role="final" style="${anim('pop', 0.6, OUTRO + 1.4)}">เก่งมาก! 👏</text>
    ${cards}
    <text class="th fx" x="540" y="1395" text-anchor="middle" font-size="54" fill="#7A6A5C" stroke-width="10" style="${anim('up', 0.6, OUTRO + 6.4, 'ease-out')}">พูดตามนะ · Say it again!</text>
  </g>`
  }

  const dots = W.map((w, i) => `<circle class="fx" cx="${540 + (i - 2) * 92}" cy="1478" r="22" fill="${w.color}" stroke="${INK}" stroke-width="6" style="animation:dotOn .5s ease-out ${f(INTRO + i * SCENE)}s both"/>`).join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" data-duration="${f(D)}" data-fps="30" data-music="audio.wav">
  <title>${esc(t.theme.en)} · 5 English words for kids · ${esc(t.theme.th)}</title>
  <!-- Généré par make.mjs depuis themes/${t.id}.json : ne pas éditer à la main. -->
  <defs>
    ${kit.SKY_GRADIENT}
    ${kit.crayonFilter({ pad: 10, scale: 7 })}
    ${W.map((w, i) => `<g id="art-${i}">${resolveArt(w.art)}</g>${w.spin ? `<g id="spin-${i}">${resolveArt(w.spin)}</g>` : ''}`).join('\n    ')}
  </defs>
  <style>${kit.fontFaceCSS()}
${css}</style>
  <rect width="1080" height="1920" fill="url(#sky)"/>
  ${cloud(170, 170, 0.9, 0)}${cloud(900, 260, 0.7, 1.5)}${cloud(820, 1640, 0.6, 3)}
  <path d="M 0 1580 Q 270 1530 540 1580 T 1080 1570 L 1080 1920 L 0 1920 Z" fill="#9BE07A" stroke="#6DBF4E" stroke-width="10" filter="url(#crayon)"/>
  ${[120, 300, 760, 960].map((x, i) => `<g transform="translate(${x} ${1620 + (i % 2) * 40})"><circle r="16" fill="${RAINBOW[i]}"/><circle r="7" fill="#FFF4C9"/></g>`).join('')}
  ${intro()}
  ${W.map(scene).join('')}
  ${recap()}
  ${dots}
</svg>
`
  return { svg, cues: { id: t.id, duration: f(D), sceneStarts: W.map((_, i) => f(INTRO + i * SCENE)), outro: f(OUTRO), cues } }
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const files = process.argv.slice(2)
  if (!files.length) { console.error('usage : node make.mjs themes/<id>.json…'); process.exit(1) }
  let bad = 0
  for (const file of files) {
    try {
      const t = validate(JSON.parse(readFileSync(file, 'utf8')), path.basename(file))
      const { svg, cues } = build(t)
      const dir = path.join(HERE, 'out', t.id)
      mkdirSync(dir, { recursive: true })
      writeFileSync(path.join(dir, `${t.id}.svg`), svg)
      // n'écrase cues.json que s'il change : build.sh ne refait alors l'audio que si nécessaire
      const cf = path.join(dir, 'cues.json'), cj = JSON.stringify(cues, null, 2)
      if (!existsSync(cf) || readFileSync(cf, 'utf8') !== cj) writeFileSync(cf, cj)
      console.log(`✓ ${t.id} · ${cues.duration} s`)
    } catch (e) { bad++; console.error(`✗ ${e.message}`) }
  }
  process.exit(bad ? 1 : 0)
}
