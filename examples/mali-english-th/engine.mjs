// Moteur « Learn English with Mali » : reel interactif pour enfants thaïlandais (≈ 4 ans).
// Mali (มะลิ), bébé éléphant : marche, saute, parle (bouche calée sur le volume réel de sa voix),
// change d'expression, réagit à chaque objet ; caméra (zoom, tremblement) ; l'enfant répète
// (« Your turn! ») et gagne une étoile par mot ; quiz final.
//
// Un thème = un fichier themes/<id>.mjs (voir themes/README.md). Utilisation : ./build.sh <id>
// API : build(theme, voice) → { svg, script } ; voice = contenu de voice.json (sortie d'audio.py).

export const RAINBOW = ['#F23B3B', '#FF8A3D', '#F2B705', '#3DBE5A', '#1E9BE0', '#8E5BD9']
export const INK = '#3B2A20', SKIN = '#A9D3F0', SKIN_D = '#86B9DF', GOLD = '#FFC93C'
export const EN_FONT = `'Chalkboard SE','Comic Sans MS','Arial Rounded MT Bold',sans-serif`
export const TH_FONT = `'Sukhumvit Set','Thonburi',sans-serif`
export const f = (n) => +n.toFixed(3)
export const S = (w = 12) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`

// ------------------------------------------------------------- dessins des mots (centrés 0,0)
export const face = (dy = 0) => `
  <ellipse cx="-42" cy="${dy - 10}" rx="15" ry="21" fill="${INK}"/><ellipse cx="42" cy="${dy - 10}" rx="15" ry="21" fill="${INK}"/>
  <circle cx="-37" cy="${dy - 17}" r="5" fill="#fff"/><circle cx="47" cy="${dy - 17}" r="5" fill="#fff"/>
  <circle cx="-80" cy="${dy + 30}" r="20" fill="#FF8FA3" opacity=".75"/><circle cx="80" cy="${dy + 30}" r="20" fill="#FF8FA3" opacity=".75"/>
  <path d="M -34 ${dy + 34} Q 0 ${dy + 72} 34 ${dy + 34}" fill="none" ${S(10)}/>`
export const ART_BUILTIN = {
  cat: `
    <path d="M -128 -40 L -150 -205 L -38 -132 Z" fill="#FF8A3D" ${S()}/><path d="M 128 -40 L 150 -205 L 38 -132 Z" fill="#FF8A3D" ${S()}/>
    <path d="M -118 -70 L -132 -168 L -66 -124 Z" fill="#FFB3C1"/><path d="M 118 -70 L 132 -168 L 66 -124 Z" fill="#FFB3C1"/>
    <circle r="150" fill="#FF8A3D" ${S()}/>
    <path d="M -60 -120 q 20 25 0 50 M 0 -140 q 20 25 0 50 M 60 -120 q 20 25 0 50" fill="none" stroke="#E2661B" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="-50" cy="-5" rx="17" ry="25" fill="${INK}"/><ellipse cx="50" cy="-5" rx="17" ry="25" fill="${INK}"/>
    <circle cx="-44" cy="-13" r="6" fill="#fff"/><circle cx="56" cy="-13" r="6" fill="#fff"/>
    <path d="M -16 34 L 16 34 L 0 52 Z" fill="#FF6F91" ${S(6)}/>
    <path d="M 0 52 Q -18 80 -38 64 M 0 52 Q 18 80 38 64" fill="none" ${S(8)}/>
    <path d="M -55 45 L -175 25 M -55 62 L -170 75 M 55 45 L 175 25 M 55 62 L 170 75" fill="none" ${S(7)}/>
    <circle cx="-95" cy="40" r="18" fill="#FF8FA3" opacity=".7"/><circle cx="95" cy="40" r="18" fill="#FF8FA3" opacity=".7"/>`,
  dog: `
    <ellipse cx="-138" cy="-10" rx="58" ry="118" transform="rotate(18 -138 -10)" fill="#7A4B2A" ${S()}/>
    <ellipse cx="138" cy="-10" rx="58" ry="118" transform="rotate(-18 138 -10)" fill="#7A4B2A" ${S()}/>
    <ellipse rx="140" ry="150" fill="#D9A066" ${S()}/>
    <ellipse cx="52" cy="-30" rx="48" ry="44" fill="#F3D3A8"/>
    <ellipse cx="0" cy="62" rx="82" ry="62" fill="#F3D3A8" ${S(8)}/>
    <ellipse cx="-48" cy="-28" rx="16" ry="23" fill="${INK}"/><ellipse cx="52" cy="-28" rx="16" ry="23" fill="${INK}"/>
    <circle cx="-42" cy="-35" r="6" fill="#fff"/><circle cx="58" cy="-35" r="6" fill="#fff"/>
    <ellipse cx="0" cy="32" rx="32" ry="22" fill="${INK}"/><ellipse cx="-8" cy="25" rx="9" ry="5" fill="#fff" opacity=".8"/>
    <path d="M 0 54 L 0 72 M 0 72 Q -26 96 -46 78 M 0 72 Q 26 96 46 78" fill="none" ${S(8)}/>
    <path d="M -16 90 Q 0 140 16 90 Z" fill="#FF6F91" ${S(6)}/>`,
  apple: `
    <path d="M 0 -150 Q 6 -195 30 -215" fill="none" stroke="#7A4B2A" stroke-width="18" stroke-linecap="round"/>
    <path d="M 22 -170 Q 85 -230 140 -180 Q 85 -130 22 -170 Z" fill="#3DBE5A" ${S(9)}/>
    <path d="M 0 -120 C 70 -185 205 -140 192 10 C 180 150 90 205 0 175 C -90 205 -180 150 -192 10 C -205 -140 -70 -185 0 -120 Z" fill="#F23B3B" ${S()}/>
    <ellipse cx="-110" cy="-50" rx="24" ry="48" transform="rotate(20 -110 -50)" fill="#fff" opacity=".55"/>
    ${face(30)}`,
  sun: `<circle r="128" fill="#FFD93B" ${S()}/><circle cx="-30" cy="-60" r="40" fill="#FFF0A0" opacity=".7"/>${face(10)}`,
  sunSpin: Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, r1 = 165, r2 = i % 2 ? 215 : 235
    return `<line x1="${f(Math.cos(a) * r1)}" y1="${f(Math.sin(a) * r1)}" x2="${f(Math.cos(a) * r2)}" y2="${f(Math.sin(a) * r2)}" stroke="#FFB400" stroke-width="24" stroke-linecap="round"/>`
  }).join(''),
  fish: `
    <path d="M 110 0 L 215 -95 Q 190 0 215 95 Z" fill="#29A8F0" ${S()}/>
    <path d="M -40 -95 Q 10 -165 70 -92 Z" fill="#29A8F0" ${S(9)}/>
    <ellipse cx="-20" cy="0" rx="165" ry="108" fill="#5CC8FF" ${S()}/>
    <path d="M 10 -40 q 25 40 0 80 M 55 -40 q 25 40 0 80" fill="none" stroke="#2E9BD6" stroke-width="10" stroke-linecap="round"/>
    <circle cx="-100" cy="-22" r="30" fill="#fff" ${S(7)}/><circle cx="-94" cy="-20" r="15" fill="${INK}"/><circle cx="-89" cy="-26" r="5" fill="#fff"/>
    <path d="M -150 30 Q -128 52 -104 34" fill="none" ${S(9)}/>
    <circle cx="-60" cy="30" r="15" fill="#FF8FA3" opacity=".7"/>`,
}
// la position est portée par un <g> : une animation CSS « transform » sur le <path> écraserait l'attribut transform
export const star5 = (x, y, r, c, extra = '') => `<g transform="translate(${x} ${y})"><path d="${Array.from({ length: 10 }, (_, i) => {
  const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r
  return `${i ? 'L' : 'M'}${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)}`
}).join(' ')}Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" ${extra}/></g>`

export function build(theme, VOICE = {}) {
  const WORDS = theme.words
  const QUIZ = theme.quiz
const INTRO = 8.0, SCENE = 9.0
const Q = INTRO + WORDS.length * SCENE
const O = Q + 10
const D = O + 5
const MALI_X = 290, GROUND = 1365, MALI_K = 1.3
const HEAD = { x: MALI_X + 125, y: GROUND - 345 } // centre de la tête de Mali (monde)
const OBJ = { x: 825, y: 1110 }
const SLOT = (i) => ({ x: 540 + (i - 2.5) * 84, y: 1565 })
// ------------------------------------------------------------- script (voix + bruitages)
const lines = [] // { t, role: narrator|mali_en|mali_th, text }
const sfx = [] // { t, kind }
const say = (t, role, text) => lines.push({ t: f(t), role, text })
const fx = (t, kind) => sfx.push({ t: f(t), kind })
const voiceOf = (l) => VOICE[`${l.role}|${l.text}`]
const durOf = (l) => voiceOf(l)?.dur ?? 0.09 * l.text.length + 0.3

// ------------------------------------------------------------- calques animés (fenêtres « fill none »)
const ev = { hop: [], shake: [], trunk: [], ear: [], legsA: [], legsB: [], glasses: [], dizzy: [], cam: [] }
const win = (layer, name, t, dur, ease = 'ease-in-out') => ev[layer].push(`${name} ${f(dur)}s ${ease} ${f(t)}s`)
const walk = (t, dur) => {
  const n = Math.max(1, Math.round(dur / 0.5))
  ev.legsA.push(`walkA 0.5s linear ${f(t)}s ${n}`)
  ev.legsB.push(`walkB 0.5s linear ${f(t)}s ${n}`)
  for (let k = 0; k < n; k++) fx(t + k * 0.5 + 0.1, 'step')
}
const hop = (t, big = false) => { win('hop', big ? 'bigjump' : 'hop', t, big ? 0.7 : 0.5, 'ease-out'); fx(t, 'boing') }

// expressions : yeux (normal, happy, wide, dizzy, squint) et bouche (smile, o, laugh)
const EXPR = { eyes: [], mouth: [] }
const expr = (t, dur, eyes, mouth) => {
  if (eyes) EXPR.eyes.push({ t, dur, k: eyes })
  if (mouth) EXPR.mouth.push({ t, dur, k: mouth })
}

// caméra : zoom (punch) vers un point, tremblement
const custom = []
const front = [] // éléments de scène dessinés AU-DESSUS de Mali (repères de « self »)
let camN = 0
const punch = (t, dur, cx, cy, s = 1.12) => {
  const n = `cam${camN++}`, z = `translate(${cx}px,${cy}px) scale(${s}) translate(${-cx}px,${-cy}px)`
  custom.push(`@keyframes ${n}{0%,100%{transform:none}22%,78%{transform:${z}}}`)
  win('cam', n, t, dur, 'ease-in-out')
}
const quake = (t, dur, a = 16) => {
  const n = `cam${camN++}`
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p, i) => {
    const k = (1 - p / 100) * a, x = i % 2 ? k : -k, y = i % 3 ? -k * 0.6 : k * 0.6
    return `${p}%{transform:translate(${f(p === 100 ? 0 : x)}px,${f(p === 100 ? 0 : y)}px)}`
  })
  custom.push(`@keyframes ${n}{${steps.join('')}}`)
  win('cam', n, t, dur, 'linear')
}

  const ART = { ...ART_BUILTIN, ...(theme.art || {}) }
// un dessin « <clé>Spin » (ex. sunSpin = rayons) tourne derrière le dessin principal
const art = (k, scale) => `<g transform="scale(${scale})" filter="url(#crayon)">${ART[k + 'Spin'] ? `<g class="spin"><use href="#art-${k}Spin"/></g>` : ''}<use href="#art-${k}"/></g>`
// ------------------------------------------------------------- Mali (pieds en 0,0, regarde à droite)
const leg = (x, cls, fill) => `<g class="${cls}"><rect x="${x - 26}" y="-105" width="52" height="105" rx="24" fill="${fill}" ${S(10)}/><path d="M ${x - 14} -8 v -10 M ${x} -8 v -12 M ${x + 14} -8 v -10" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`

function mali() {
  const speaking = lines.filter((l) => l.role !== 'narrator')
  const busy = (t, d) => speaking.some((l) => l.t < t + d && l.t + durOf(l) > t)
  // synchronisation labiale : une keyframe par image (30 i/s) tirée de l'enveloppe de la voix
  const lip = speaking.map((l, i) => {
    const v = voiceOf(l)
    if (!v || v.env.length < 2) {
      const n = Math.max(2, Math.round(durOf(l) / 0.16) & ~1)
      return `talk 0.16s ease-in-out ${f(l.t)}s ${n} alternate`
    }
    const n = v.env.length
    custom.push(`@keyframes ls${i}{${v.env.map((e, k) => `${f((k / (n - 1)) * 100)}%{opacity:1;transform:scale(${f(0.75 + 0.3 * e)},${f(0.1 + 1.05 * e)})}`).join('')}}`)
    return `ls${i} ${f(v.dur)}s linear ${f(l.t)}s`
  })
  const show = (list, k) => list.filter((e) => e.k === k).map((e) => `show ${f(e.dur)}s linear ${f(e.t)}s`)
  const hideAll = (list) => list.map((e) => `hide ${f(e.dur)}s linear ${f(e.t)}s`)
  const mouths = EXPR.mouth.filter((e) => !busy(e.t, e.dur)) // pendant qu'elle parle, la bouche suit la voix
  const a = (list, base = '') => `animation:${[base, ...list].filter(Boolean).join(',') || 'none'}`
  return `
  <g style="animation:maliPath ${f(D)}s linear 0s both">
   <g style="${a(ev.hop)}">
    <g style="${a(ev.shake)}">
     <g style="animation:bob 1.3s ease-in-out infinite alternate" filter="url(#crayon)"><g transform="scale(${MALI_K})">
      <ellipse cx="20" cy="4" rx="150" ry="16" fill="#000" opacity=".12"/>
      <g class="tail"><path d="M -128 -165 q -45 15 -38 60" fill="none" ${S(10)}/><circle cx="-166" cy="-100" r="13" fill="${INK}"/></g>
      ${leg(-75, 'legB', SKIN_D)}${leg(45, 'legA', SKIN_D)}
      <ellipse cx="0" cy="-160" rx="138" ry="102" fill="${SKIN}" ${S()}/>
      <ellipse cx="10" cy="-125" rx="80" ry="50" fill="#C9E6F8"/>
      ${leg(-35, 'legA', SKIN)}${leg(85, 'legB', SKIN)}
      <circle cx="98" cy="-262" r="108" fill="${SKIN}" ${S()}/>
      <g class="ear" style="${a(ev.ear, 'flap 2.6s ease-in-out infinite')}">
        <ellipse cx="22" cy="-258" rx="74" ry="94" fill="${SKIN}" ${S()}/>
        <ellipse cx="22" cy="-258" rx="50" ry="68" fill="#FFC2D1"/>
      </g>
      <g class="eye" style="${a(hideAll(EXPR.eyes), 'blink 3.4s linear infinite')}">
        <ellipse cx="135" cy="-285" rx="16" ry="22" fill="${INK}"/><circle cx="141" cy="-293" r="6" fill="#fff"/>
      </g>
      <g class="ex" style="${a(show(EXPR.eyes, 'happy'))}"><path d="M 116 -280 Q 135 -306 154 -280" fill="none" ${S(8)}/></g>
      <g class="ex" style="${a(show(EXPR.eyes, 'wide'))}"><ellipse cx="136" cy="-288" rx="23" ry="29" fill="#fff" ${S(5)}/><circle cx="140" cy="-286" r="9" fill="${INK}"/></g>
      <g class="ex" style="${a(show(EXPR.eyes, 'dizzy'))}"><circle cx="135" cy="-285" r="22" fill="#fff" ${S(5)}/><path d="M 135 -285 m -3 0 a 3 3 0 1 1 6 0 a 7 7 0 1 1 -14 0 a 11 11 0 1 1 22 0 a 15 15 0 1 1 -30 0" fill="none" ${S(4)}/></g>
      <g class="ex" style="${a(show(EXPR.eyes, 'squint'))}"><path d="M 118 -298 L 150 -285 L 118 -272" fill="none" ${S(8)}/></g>
      <circle cx="158" cy="-222" r="18" fill="#FF8FA3" opacity=".75"/>
      <path d="M 112 -214 q 16 16 34 2" fill="none" ${S(7)} style="${a(hideAll(mouths))}"/>
      <g class="ex" style="${a(show(mouths, 'o'))}"><ellipse cx="128" cy="-204" rx="13" ry="17" fill="#8A2E44" ${S(5)}/></g>
      <g class="ex" style="${a(show(mouths, 'laugh'))}"><path d="M 106 -217 Q 131 -166 158 -216 Z" fill="#8A2E44" ${S(6)}/><path d="M 120 -192 q 12 -10 24 0 q -12 12 -24 0 Z" fill="#FF6F91"/></g>
      <ellipse class="mouth" cx="128" cy="-205" rx="16" ry="14" fill="#8A2E44" ${S(5)} style="${a(lip)}"/>
      <g class="trunk" style="${a(ev.trunk)}">
        <path d="M 172 -276 C 245 -270 268 -190 256 -140 C 252 -120 224 -118 222 -138 C 228 -178 214 -212 172 -220 Z" fill="${SKIN}" ${S()}/>
        <path d="M 214 -238 q 10 6 6 18 M 232 -200 q 12 4 8 16" fill="none" stroke="${SKIN_D}" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g transform="translate(70 -362)"><g class="flower">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-17" rx="12" ry="19" transform="rotate(${r})" fill="#fff" ${S(4)}/>`).join('')}<circle r="9" fill="#F2B705"/></g></g>
      <g class="glasses" style="${a(ev.glasses)}">
        <path d="M 60 -300 L 112 -292" ${S(7)}/>
        <rect x="108" y="-312" width="78" height="46" rx="18" fill="#1C1C28" ${S(6)}/><path d="M 122 -302 l 18 0" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      </g>
      <g transform="translate(95 -400)"><g class="dizzy" style="${a(ev.dizzy)}">${star5(-70, 0, 24, '#F2B705')}${star5(60, -20, 20, '#FF8FA3')}${star5(0, 35, 18, '#7FD1FF')}</g></g>
     </g></g>
    </g>
   </g>
  </g>`
}

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
const anim = (name, dur, delay, ease = 'cubic-bezier(.3,1.5,.5,1)', fill = 'both') => `animation:${name} ${f(dur)}s ${ease} ${f(delay)}s ${fill}`
const rainbow = (word, o = 0) => [...word].map((c, i) => `<tspan fill="${RAINBOW[(i + o) % RAINBOW.length]}">${c}</tspan>`).join('')
const path = (name, pts) => {
  custom.push(`@keyframes ${name}{${pts.map(([p, x, y, r = 0, s = 1, o = 1]) => `${p}%{transform:translate(${x}px,${y}px) rotate(${r}deg) scale(${s});opacity:${o}}`).join('')}}`)
  return name
}
const bubbleText = (x, y, text, t, color) => `
  <g class="fx" style="${anim('bubble', 1.6, t, 'ease-out')}">
    <path d="M ${x - 120} ${y - 60} h 240 a 30 30 0 0 1 30 30 v 50 a 30 30 0 0 1 -30 30 h -90 l -30 30 l -6 -30 h -114 a 30 30 0 0 1 -30 -30 v -50 a 30 30 0 0 1 30 -30 z" fill="#fff" ${S(7)}/>
    <text class="en" x="${x}" y="${y + 18}" text-anchor="middle" font-size="54" fill="${color}" stroke-width="6">${text}</text>
  </g>`
// bandeau « à toi de dire » : micro, égaliseur qui « écoute », barre de temps
const yourTurn = (t, word) => {
  // place libre entre le micro et l'égaliseur ≈ 480 px : le corps s'adapte à la longueur du mot
  // (Chalkboard ≈ 0,56 em par caractère ; « · พูดตามนะ » ≈ 3,4 em au corps anglais)
  const fs = f(Math.min(50, 470 / (0.56 * (word.length + 7) + 3.4)))
  fx(t + 0.95, 'tick'); fx(t + 1.75, 'tick'); fx(t + 2.55, 'tick')
  const bars = [0, 1, 2, 3].map((k) => `<rect x="${760 + k * 22}" y="1400" width="14" height="44" rx="7" fill="#8E5BD9" style="transform-box:fill-box;transform-origin:center bottom;animation:eq ${f(0.35 + k * 0.07)}s ease-in-out ${f(t + 0.8)}s 6"/>`).join('')
  return `
  <g class="fx" style="${anim('banner', 2.9, t, 'ease-out')}">
    <rect x="150" y="1378" width="780" height="112" rx="56" fill="#fff" stroke="#8E5BD9" stroke-width="10"/>
    <text class="en" x="225" y="1450" text-anchor="middle" font-size="60" stroke-width="0">🎤</text>
    <text x="510" y="1438" text-anchor="middle" font-size="${fs}" fill="#8E5BD9" stroke-width="6"><tspan class="en">Say “${word}”!</tspan><tspan class="th" font-size="${f(fs * 0.8)}" fill="#7A6A5C"> · พูดตามนะ</tspan></text>
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
      <text x="540" y="736" text-anchor="middle" font-size="50" fill="#fff" style="stroke:${INK};stroke-width:6px"><tspan class="en">${theme.title.emoji ?? ''} ${theme.title.en}</tspan><tspan class="th"> · ${theme.title.th}</tspan></text>
    </g>`,
  }
}

// ------------------------------------------------------------- une scène par mot
// Gags génériques : chaque mot choisit un type ; l'objet dessiné est w.art.
//   w.gag = 'box' | { type: 'box', sfx: 'meow' } … (sfx = bruitage de l'objet, voir audio.py)
// Parties de Mali utilisables par « self » (coordonnées monde, Mali à l'échelle MALI_K)
const PART = {
  // trompe LEVÉE (animation wave : -48° à -72° autour de (178,-246)) : milieu de la trompe ≈ (235,-240)
  nose: { x: MALI_X + 235 * MALI_K, y: GROUND - 240 * MALI_K, r: 95 },
  ears: { x: MALI_X + 22 * MALI_K, y: GROUND - 258 * MALI_K, r: 120 },
  eyes: { x: MALI_X + 135 * MALI_K, y: GROUND - 285 * MALI_K, r: 55 },
  mouth: { x: MALI_X + 128 * MALI_K, y: GROUND - 205 * MALI_K, r: 50 },
  feet: { x: MALI_X + 20 * MALI_K, y: GROUND - 30 * MALI_K, r: 120 },
  tail: { x: MALI_X - 150 * MALI_K, y: GROUND - 120 * MALI_K, r: 60 },
}
function gag(w, t) {
  const g = typeof w.gag === 'string' ? { type: w.gag } : w.gag
  const snd = (k, def) => fx(t + k, g.sfx ?? def)
  switch (g.type) {
    case 'box': { // l'objet sort d'un carton, Mali sursaute
      fx(t + 0.45, 'pop'); snd(0.6, 'pop'); hop(t + 0.55, true)
      expr(t + 0.5, 1.4, 'wide', 'o'); punch(t + 0.4, 1.5, 600, 1040, 1.13)
      return `<g transform="translate(${OBJ.x} ${OBJ.y}) scale(1.2)">
        <g style="${anim(path(`peek${t}`, [[0, 0, 190], [70, 0, -25], [100, 0, 0]]), 0.6, t + 0.4, 'ease-out')}"><g class="wiggleIdle">${art(w.art, g.scale ?? 0.62)}</g></g>
        <path d="M -165 40 L -205 -15 L -60 30 Z M 165 40 L 205 -15 L 60 30 Z" fill="#C98D4C" ${S(8)}/>
        <rect x="-160" y="40" width="320" height="185" rx="14" fill="#D9A35F" ${S(9)}/>
        <path d="M -60 95 h 120" stroke="#B57A3A" stroke-width="10" stroke-linecap="round"/>
      </g>`
    }
    case 'run': { // l'objet arrive en bondissant, Mali rit aux éclats
      for (const k of [0, 0.25, 0.5, 0.75]) fx(t + k, 'step')
      snd(0.95, 'boing'); snd(1.35, 'boing'); fx(t + 1.05, 'giggle'); win('shake', 'shake', t + 1.0, 0.8)
      expr(t + 0.95, 1.1, 'happy', 'laugh'); punch(t + 0.85, 1.3, 640, 1080, 1.12)
      return `<g transform="translate(${OBJ.x} ${OBJ.y + 80}) scale(1.2)">
        <g style="${anim(path(`run${t}`, [[0, 480, 0], [25, 360, -70], [50, 240, 0], [75, 120, -70], [100, 0, 0]]), 0.9, t, 'linear')}">
          <g style="${anim('bounce', 0.4, t + 0.9, 'ease-in-out', 'none')};animation-iteration-count:3">${art(w.art, g.scale ?? 0.62)}</g>
        </g></g>`
    }
    case 'bonk': { // l'objet tombe sur la tête de Mali puis rebondit
      snd(0.62, 'bonk'); win('dizzy', 'dizzy', t + 0.7, 1.6); win('shake', 'tilt', t + 0.7, 1.4)
      expr(t + 0.62, 1.6, 'dizzy', 'o'); quake(t + 0.6, 0.45, 18)
      const hx = MALI_X + 98 * MALI_K, hy = GROUND - 375 * MALI_K - 75
      return `<g style="${anim(path(`fall${t}`, [[0, hx, -200], [36, hx, hy], [40, hx, hy + 12], [65, 560, hy - 260, 200], [88, OBJ.x - 10, OBJ.y - 10, 330], [94, OBJ.x, OBJ.y - 40, 350], [100, OBJ.x, OBJ.y, 360]]), 1.7, t, 'linear')}">
        <g class="swingIdle">${art(w.art, g.scale ?? 0.5)}</g></g>`
    }
    case 'rise': { // l'objet se lève derrière la colline (g.glasses : Mali met ses lunettes)
      fx(t + 0.2, 'sparkle')
      if (g.glasses) { fx(t + 1.05, 'cool'); win('glasses', 'glasses', t + 1.0, SCENE - 1.0, 'linear') }
      snd(0.9, 'sparkle')
      expr(t + 1.1, 1.0, g.glasses ? null : 'happy', 'laugh'); punch(t + 0.1, 1.6, OBJ.x, 1000, 1.08)
      return `<g transform="translate(${OBJ.x} ${OBJ.y - 120}) scale(1.15)">
          <g style="${anim(path(`rise${t}`, [[0, 0, 520, -90], [80, 0, -20, 10], [100, 0, 0, 0]]), 1.3, t + 0.1, 'ease-out')}">${art(w.art, 0.62)}</g>
        </g>
        <path d="M 560 ${GROUND + 15} Q 700 1060 820 1080 Q 980 1100 1080 ${GROUND - 120} L 1080 ${GROUND + 15} Z" fill="#7DD36A" stroke="#55B046" stroke-width="10" filter="url(#crayon)"/>`
    }
    case 'splash': { // l'objet saute de la mare et éclabousse Mali
      fx(t + 0.2, 'splash'); snd(1.0, 'splash'); win('shake', 'shake', t + 1.05, 0.7)
      expr(t + 1.0, 1.0, 'squint', 'o'); quake(t + 1.0, 0.35, 12)
      const drops = [0, 1, 2, 3, 4].map((k) => `<circle r="${14 - k}" fill="#7FD1FF" ${S(4)} style="opacity:0;${anim(path(`drop${t}_${k}`, [[0, OBJ.x - 40, GROUND - 30, 0, 1, 1], [55, 600 - k * 40, 980 - k * 30, 0, 1, 1], [100, MALI_X + 200 - k * 30, GROUND - 440 + k * 40, 0, 0.6, 0]]), 0.9, t + 0.25 + k * 0.05, 'ease-out')}"/>`).join('')
      return `<ellipse cx="${OBJ.x}" cy="${GROUND - 15}" rx="200" ry="48" fill="#6CC6F5" stroke="#2E9BD6" stroke-width="10" filter="url(#crayon)"/>
        ${g.bubble === false ? '' : `<circle cx="${OBJ.x}" cy="${OBJ.y - 40}" r="185" fill="#D6F3FF" fill-opacity=".55" stroke="#7FD1FF" stroke-width="8" class="fx" style="${anim('pop', 0.5, t + 1.0)}"/>`}
        <g style="${anim(path(`jump${t}`, [[0, OBJ.x, GROUND, -70, 1, 0], [10, OBJ.x - 20, GROUND - 120, -60, 1, 1], [50, OBJ.x - 120, 860, 0], [100, OBJ.x, OBJ.y - 40, 20]]), 1.0, t + 0.15, 'ease-out')}">
          <g class="swimIdle">${art(w.art, g.scale ?? 0.56)}</g></g>${drops}`
    }
    case 'float': { // l'objet descend du ciel accroché à un ballon, Mali lève les yeux et rit
      fx(t + 0.1, 'sparkle'); snd(1.5, 'pop'); win('shake', 'tilt', t + 0.3, 1.2)
      expr(t + 1.5, 1.1, 'happy', 'laugh')
      const bc = g.balloon ?? w.color
      return `<g style="${anim(path(`float${t}`, [[0, OBJ.x + 60, -380, 8], [35, OBJ.x - 40, 400, -8], [70, OBJ.x + 25, 880, 6], [100, OBJ.x, OBJ.y + 20, 0]]), 1.6, t, 'ease-out')}">
          <g style="${anim('away', 1.4, t + 1.75, 'ease-in', 'forwards')}">
            <path d="M 0 -150 C 20 -210 -20 -260 0 -320" fill="none" stroke="${INK}" stroke-width="5"/>
            <g transform="translate(0 -400)"><g class="swingIdle"><ellipse rx="70" ry="85" fill="${bc}" ${S(8)}/><ellipse cx="-24" cy="-30" rx="14" ry="24" fill="#fff" opacity=".5"/><path d="M -10 84 L 10 84 L 0 98 Z" fill="${bc}" ${S(5)}/></g></g>
          </g>
          <g class="swingIdle">${art(w.art, g.scale ?? 0.6)}</g></g>`
    }
    case 'drive': { // l'objet (véhicule…) arrive en glissant avec un « bip bip », Mali recule surpris
      snd(0.15, 'vroom'); fx(t + 0.75, 'beep'); fx(t + 1.05, 'beep'); win('shake', 'lean', t + 0.6, 1.0)
      expr(t + 0.6, 1.1, 'wide', 'o'); punch(t + 0.6, 1.3, 640, 1080, 1.1)
      const puffs = [0, 1, 2].map((k) => `<circle r="${26 - k * 5}" fill="#fff" ${S(5)} style="opacity:0;${anim(path(`puff${t}_${k}`, [[0, OBJ.x + 160, OBJ.y + 120, 0, 0.4, 1], [100, OBJ.x + 300 + k * 50, OBJ.y + 40 - k * 30, 0, 1.4, 0]]), 0.8, t + 0.5 + k * 0.12, 'ease-out')}"/>`).join('')
      return `<g style="${anim(path(`drive${t}`, [[0, OBJ.x + 700, OBJ.y + 40, 0], [80, OBJ.x - 30, OBJ.y + 40, -4], [90, OBJ.x + 10, OBJ.y + 40, 2], [100, OBJ.x, OBJ.y + 40, 0]]), 1.0, t, 'ease-out')}">
          <g class="bounceIdle">${art(w.art, g.scale ?? 0.75)}</g></g>${puffs}`
    }
    case 'fly': { // l'objet traverse le ciel en arc puis se pose, Mali le suit des yeux
      fx(t, 'whoosh'); snd(0.5, 'whoosh'); fx(t + 1.4, 'pop'); win('shake', 'tilt', t + 0.2, 1.4)
      expr(t + 0.2, 1.2, 'wide', 'o'); expr(t + 1.5, 0.9, 'happy', 'laugh'); punch(t + 0.1, 1.5, 540, 900, 1.06)
      return `<g style="${anim(path(`fly${t}`, [[0, -260, 820, -10, 0.9], [45, 420, 520, 5, 1], [75, 960, 700, 15, 1], [100, OBJ.x, OBJ.y, 0, 1]]), 1.5, t, 'ease-in-out')}">
          <g class="swingIdle">${art(w.art, g.scale ?? 0.62)}</g></g>`
    }
    case 'self': { // partie du corps : l'objet s'affiche dans une carte, la partie de Mali est entourée et bouge
      const p = PART[g.part]
      if (!p) throw new Error(`gag self : partie inconnue « ${g.part} » (${Object.keys(PART).join(', ')})`)
      snd(0.45, 'sparkle')
      if (g.part === 'nose') win('trunk', 'wave', t + 0.5, 1.8)
      if (g.part === 'ears') win('ear', 'listen', t + 0.5, 1.8)
      if (g.part === 'eyes') { expr(t + 0.5, 0.6, 'wide', 'o'); expr(t + 1.2, 0.5, 'squint', null); expr(t + 1.8, 0.6, 'wide', null) }
      if (g.part === 'mouth') expr(t + 0.5, 1.8, 'happy', 'laugh')
      if (g.part === 'feet') { hop(t + 0.5); hop(t + 1.15); fx(t + 1.0, 'step'); fx(t + 1.65, 'step') }
      if (g.part === 'tail') win('shake', 'shake', t + 0.5, 1.2)
      if (g.part !== 'mouth') expr(t + 2.3, 0.8, 'happy', 'laugh')
      punch(t + 0.4, 1.9, p.x, p.y, 1.16)
      front.push(`<g transform="translate(${f(p.x)} ${f(p.y)})"><g class="fx" style="${anim('ring', 2.2, t + 0.4, 'ease-out')}">
          <circle r="${p.r + 18}" fill="none" stroke="#fff" stroke-width="16" opacity=".85"/>
          <circle r="${p.r}" fill="none" stroke="${w.color}" stroke-width="12" stroke-dasharray="26 16" stroke-linecap="round"/></g></g>`)
      return `<g transform="translate(${OBJ.x + 10} ${OBJ.y - 20})"><g class="pop" style="${anim('pop', 0.6, t + 0.1)}">
          <rect x="-150" y="-150" width="300" height="300" rx="50" fill="#fff" stroke="${w.color}" stroke-width="12"/>
          ${art(w.art, g.scale ?? 0.6)}</g></g>`
    }
    case 'pop': // l'objet apparaît dans une gerbe d'étincelles, Mali applaudit
    default: {
      snd(0.4, 'sparkle'); fx(t + 0.35, 'pop'); win('shake', 'dance', t + 0.6, 1.0)
      expr(t + 0.5, 1.2, 'happy', 'laugh'); punch(t + 0.3, 1.4, OBJ.x - 100, OBJ.y, 1.08)
      const rays = Array.from({ length: 10 }, (_, k) => { const a = (k * Math.PI) / 5; return `<line x1="${f(Math.cos(a) * 190)}" y1="${f(Math.sin(a) * 190)}" x2="${f(Math.cos(a) * 250)}" y2="${f(Math.sin(a) * 250)}" stroke="${RAINBOW[k % 6]}" stroke-width="14" stroke-linecap="round"/>` }).join('')
      return `<g transform="translate(${OBJ.x} ${OBJ.y})"><g class="fx" style="${anim('burst', 0.9, t + 0.3, 'ease-out')}">${rays}</g>
        <g class="pop" style="${anim('pop', 0.7, t + 0.3)}"><g class="swingIdle">${art(w.art, g.scale ?? 0.7)}</g></g></g>`
    }
  }
}

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
      <text class="en" x="540" y="460" text-anchor="middle" font-size="160" stroke-width="16">${theme.wordColor === 'own' ? `<tspan fill="${w.color}" style="stroke:${INK};stroke-width:7px">${w.en}</tspan>` : rainbow(w.en, i)}</text>
      <text class="th" x="540" y="540" text-anchor="middle" font-size="42" fill="#7A6A5C" stroke-width="8">อ่านว่า “${w.say}”</text>
    </g>
    ${yourTurn(t + 3.8, w.en)}
    <g class="pop" style="${anim('pop', 0.6, t + 6.8)}">
      <rect x="250" y="1380" width="580" height="112" rx="56" fill="${w.color}" stroke="${INK}" stroke-width="8"/>
      <text class="th" x="540" y="1462" text-anchor="middle" font-size="76" fill="#fff" style="stroke:${INK};stroke-width:7px">${w.en} = ${w.th}</text>
    </g>`,
  }
}

// ------------------------------------------------------------- quiz
function quiz() {
  const ans = WORDS[QUIZ.answer]
  fx(Q - 0.05, 'whoosh')
  const qEn = QUIZ.q?.en ?? `Where ${ans.plural ? 'are' : 'is'} the ${ans.en.toLowerCase()}?`, qTh = QUIZ.q?.th ?? `${ans.th}อยู่ไหนนะ?`
  const qFs = f(Math.min(96, 900 / (0.56 * qEn.length))) // la question tient entre les marges (≈ 900 px)
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
      <text class="th" x="540" y="1462" text-anchor="middle" font-size="76" fill="#fff" style="stroke:${INK};stroke-width:7px">${w.en} = ${w.th}</text></g>` : ''}`
  }).join('')
  return {
    stage: '',
    ui: `
    <text class="en pop" x="540" y="420" text-anchor="middle" font-size="${qFs}" stroke-width="16" style="${anim('pop', 0.6, Q + 0.2)}">${theme.wordColor === 'own' ? `<tspan fill="${INK}">${qEn}</tspan>` : rainbow(qEn, 3)}</text>
    <text class="th fx" x="540" y="510" text-anchor="middle" font-size="60" fill="#1E9BE0" stroke-width="10" style="${anim('up', 0.5, Q + 1.7, 'ease-out')}">${qTh} 🤔</text>
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
  walk(O + 2.6, 2.4)
  const mini = WORDS.map((w, i) => {
    const x = 150 + i * 195
    return `<g class="pop" style="${anim('pop', 0.45, O + 0.6 + i * 0.15)}"><rect x="${x - 82}" y="590" width="164" height="164" rx="30" fill="#fff" stroke="${w.color}" stroke-width="8"/><g transform="translate(${x} 672)">${art(w.art, 0.3)}</g>
      <text class="en" x="${x}" y="812" text-anchor="middle" font-size="${f(Math.min(44, 175 / (0.56 * w.en.length)))}" fill="${w.color}" stroke-width="8">${w.en}</text></g>`
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
custom.push(`@keyframes maliPath{0%{transform:translate(-280px,${GROUND}px)}${pct(2.2)}%{transform:translate(${MALI_X}px,${GROUND}px)}${pct(O + 2.6)}%{transform:translate(${MALI_X}px,${GROUND}px)}${pct(O + 5)}%{transform:translate(1350px,${GROUND}px)}100%{transform:translate(1350px,${GROUND}px)}}`)
const stage = parts.map((p) => wrap(p, 'stage')).join('')
const ui = parts.map((p) => wrap(p, 'ui')).join('')
const maliSvg = mali()
const rewardSvg = rewardLayer()
const confettiSvg = confetti()
const ambientSvg = ambient() // AVANT le gabarit : ambient() ajoute des keyframes à custom
const cloud = (x, y, k, d) => `<g transform="translate(${x} ${y}) scale(${k})"><g style="animation:drift 7s ease-in-out ${d}s infinite alternate"><path d="M -110 30 Q -130 -20 -80 -30 Q -70 -80 -10 -70 Q 30 -110 80 -60 Q 140 -60 130 0 Q 160 40 110 50 L -90 50 Q -140 50 -110 30 Z" fill="#fff" stroke="#BFE3F2" stroke-width="8" stroke-linejoin="round"/></g></g>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" data-duration="${f(D)}" data-fps="30">
  <title>Learn English with Mali · ${theme.title.en} · ${theme.title.th}</title>
  <!-- Généré par engine.mjs (thème ${theme.id}) : modifier themes/${theme.id}.mjs puis ./build.sh ${theme.id} -->
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C9"/><stop offset=".55" stop-color="#FFE9EF"/><stop offset="1" stop-color="#D4F1FF"/></linearGradient>
    <filter id="crayon" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    ${Object.entries(ART).map(([k, v]) => `<g id="art-${k}">${v}</g>`).join('\n    ')}
  </defs>
  <style>${css}
${custom.join('\n')}</style>
  <g style="animation:${ev.cam.join(',') || 'none'}">
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
  script: { id: theme.id, duration: f(D), lines: lines.sort((a, b) => a.t - b.t), sfx: sfx.sort((a, b) => a.t - b.t) },
  info: { duration: f(D), lines: lines.length, sfx: sfx.length, camera: camN, lipsync: Object.keys(VOICE).length > 0 },
}
}
