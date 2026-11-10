// svgkit · acteur « Mali » (มะลิ), bébé éléphant : marche, saute, parle (bouche synchronisée),
// change d'expression, agite la trompe et les oreilles, met des lunettes, voit des étoiles.
//
//   const mali = createMali(s, { x: 290, ground: 1365, k: 1.3, duration: D })
//   mali.walk(0, 2.2); mali.hop(2.3); mali.expr(2.3, 2.6, 'happy', 'laugh')
//   s.win('trunk', 'wave', 2.6, 1.4)          calques : hop shake trunk ear legsA legsB glasses dizzy
//   …
//   mali.draw()                               SVG de Mali (pieds en 0,0, regarde à droite), à la fin
//
// Le gabarit doit fournir les @keyframes et classes utilisées (walkA, hop, blink, talk, show, hide…)
// et l'animation de trajectoire `pathName` (déplacement de Mali dans la scène).
import { INK, S, star5 } from '../core.mjs'
import { lipAnimations, speakingDuring } from './lipsync.mjs'

export const SKIN = '#A9D3F0', SKIN_D = '#86B9DF'

/** Feuille de style de Mali : classes des parties du corps et animations des calques (à mettre dans <style>). */
export const MALI_CSS = `
.legA,.legB{transform-box:fill-box;transform-origin:50% 0%}
.ear{transform-origin:96px -258px}
.eye{transform-box:fill-box;transform-origin:center}
.ex{opacity:0}
.mouth{opacity:0;transform-box:fill-box;transform-origin:center}
.trunk{transform-origin:178px -246px}
.tail{transform-origin:-128px -165px;animation:tailwag 1.1s ease-in-out infinite alternate}
.flower{animation:spin 6s linear infinite}
.glasses,.dizzy{opacity:0}
@keyframes show{0%,100%{opacity:1}}
@keyframes hide{0%,100%{opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
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
`

/** Parties du corps (monde) pour Mali posée en (x, ground) à l'échelle k ; la trompe est LEVÉE (animation wave). */
export const maliParts = (x, ground, k) => ({
  nose: { x: x + 235 * k, y: ground - 240 * k, r: 95 },
  ears: { x: x + 22 * k, y: ground - 258 * k, r: 120 },
  eyes: { x: x + 135 * k, y: ground - 285 * k, r: 55 },
  mouth: { x: x + 128 * k, y: ground - 205 * k, r: 50 },
  feet: { x: x + 20 * k, y: ground - 30 * k, r: 120 },
  tail: { x: x - 150 * k, y: ground - 120 * k, r: 60 },
})

const leg = (x, cls, fill) => `<g class="${cls}"><rect x="${x - 26}" y="-105" width="52" height="105" rx="24" fill="${fill}" ${S(10)}/><path d="M ${x - 14} -8 v -10 M ${x} -8 v -12 M ${x + 14} -8 v -10" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`

export function createMali(s, { x = 290, ground = 1365, k = 1.3, duration, pathName = 'maliPath' } = {}) {
  const f = s.f
  const EXPR = { eyes: [], mouth: [] } // expressions : yeux (happy, wide, dizzy, squint) et bouche (o, laugh)
  const m = {
    x, ground, k,
    head: { x: x + 125, y: ground - 345 }, // centre de la tête (monde)
    // parties du corps (monde), pour les gags « self » : la trompe est LEVÉE (animation wave)
    parts: maliParts(x, ground, k),
    walk: (t, dur) => {
      const n = Math.max(1, Math.round(dur / 0.5))
      s.layer('legsA').push(`walkA 0.5s linear ${f(t)}s ${n}`)
      s.layer('legsB').push(`walkB 0.5s linear ${f(t)}s ${n}`)
      for (let i = 0; i < n; i++) s.fx(t + i * 0.5 + 0.1, 'step')
    },
    hop: (t, big = false) => { s.win('hop', big ? 'bigjump' : 'hop', t, big ? 0.7 : 0.5, 'ease-out'); s.fx(t, 'boing') },
    expr: (t, dur, eyes, mouth) => {
      if (eyes) EXPR.eyes.push({ t, dur, k: eyes })
      if (mouth) EXPR.mouth.push({ t, dur, k: mouth })
    },
    /** SVG de Mali ; à appeler APRÈS toutes les répliques et expressions (bouche, yeux). */
    draw: () => {
      const a = s.animList, L = s.layer
      const speaking = s.lines.filter((l) => l.role !== 'narrator')
      const lip = lipAnimations(s, speaking)
      const show = (list, kk) => list.filter((e) => e.k === kk).map((e) => `show ${f(e.dur)}s linear ${f(e.t)}s`)
      const hideAll = (list) => list.map((e) => `hide ${f(e.dur)}s linear ${f(e.t)}s`)
      const mouths = EXPR.mouth.filter((e) => !speakingDuring(s, speaking, e.t, e.dur)) // pendant qu'elle parle, la bouche suit la voix
      return `
  <g style="animation:${pathName} ${f(duration)}s linear 0s both">
   <g style="${a(L('hop'))}">
    <g style="${a(L('shake'))}">
     <g style="animation:bob 1.3s ease-in-out infinite alternate" filter="url(#crayon)"><g transform="scale(${k})">
      <ellipse cx="20" cy="4" rx="150" ry="16" fill="#000" opacity=".12"/>
      <g class="tail"><path d="M -128 -165 q -45 15 -38 60" fill="none" ${S(10)}/><circle cx="-166" cy="-100" r="13" fill="${INK}"/></g>
      ${leg(-75, 'legB', SKIN_D)}${leg(45, 'legA', SKIN_D)}
      <ellipse cx="0" cy="-160" rx="138" ry="102" fill="${SKIN}" ${S()}/>
      <ellipse cx="10" cy="-125" rx="80" ry="50" fill="#C9E6F8"/>
      ${leg(-35, 'legA', SKIN)}${leg(85, 'legB', SKIN)}
      <circle cx="98" cy="-262" r="108" fill="${SKIN}" ${S()}/>
      <g class="ear" style="${a(L('ear'), 'flap 2.6s ease-in-out infinite')}">
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
      <g class="trunk" style="${a(L('trunk'))}">
        <path d="M 172 -276 C 245 -270 268 -190 256 -140 C 252 -120 224 -118 222 -138 C 228 -178 214 -212 172 -220 Z" fill="${SKIN}" ${S()}/>
        <path d="M 214 -238 q 10 6 6 18 M 232 -200 q 12 4 8 16" fill="none" stroke="${SKIN_D}" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g transform="translate(70 -362)"><g class="flower">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-17" rx="12" ry="19" transform="rotate(${r})" fill="#fff" ${S(4)}/>`).join('')}<circle r="9" fill="#F2B705"/></g></g>
      <g class="glasses" style="${a(L('glasses'))}">
        <path d="M 60 -300 L 112 -292" ${S(7)}/>
        <rect x="108" y="-312" width="78" height="46" rx="18" fill="#1C1C28" ${S(6)}/><path d="M 122 -302 l 18 0" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      </g>
      <g transform="translate(95 -400)"><g class="dizzy" style="${a(L('dizzy'))}">${star5(-70, 0, 24, '#F2B705', '', f)}${star5(60, -20, 20, '#FF8FA3', '', f)}${star5(0, 35, 18, '#7FD1FF', '', f)}</g></g>
     </g></g>
    </g>
   </g>
  </g>`
    },
  }
  return m
}
