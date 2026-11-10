// svgkit · gags : l'entrée en scène d'un objet ET la réaction de l'acteur, en un mot-clé.
//
//   runGag(ctx, word, t) → SVG de l'objet (dans la caméra)
//   ctx = { s, actor, art, anim, obj: { x, y }, scene }   (scène, acteur, dessin d'un mot, animation CSS,
//                                                          position de l'objet, durée d'une scène)
//   word.gag = 'box' | { type: 'box', sfx: 'meow', scale: 0.6, … } ; word.art = clé du dessin
//
// L'acteur doit offrir hop(t, big), expr(t, dur, yeux, bouche), x, k, ground, parts{…} et les calques
// shake, trunk, ear, glasses, dizzy (c'est le cas de Mali). Les bruitages sont ceux d'audio.py.
import { RAINBOW, INK, S } from '../core.mjs'
import { punch as camPunch, quake as camQuake } from './camera.mjs'

/** Feuille de style des gags (classes d'objets et animations), à mettre dans <style> avec MALI_CSS. */
export const GAG_CSS = `
.pop,.fx{transform-box:fill-box;transform-origin:center}
.spin{animation:spin 9s linear infinite}
@keyframes pop{0%{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.12)}80%{transform:scale(.95)}100%{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes wiggle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}}
@keyframes swim{0%,100%{transform:translate(-22px,0) rotate(-4deg)}50%{transform:translate(22px,-12px) rotate(4deg)}}
@keyframes away{0%{transform:none;opacity:1}100%{transform:translate(120px,-1100px) rotate(15deg);opacity:0}}
@keyframes ring{0%{opacity:0;transform:scale(.3)}15%{opacity:1;transform:scale(1.1)}30%,45%,60%,75%{transform:scale(1)}37%,52%,67%{transform:scale(1.12)}90%{opacity:1}100%{opacity:0;transform:scale(1.2)}}
@keyframes burst{0%{opacity:0;transform:scale(.3) rotate(0)}30%{opacity:1}100%{opacity:0;transform:scale(1.4) rotate(40deg)}}
.wiggleIdle{animation:wiggle 1.4s ease-in-out infinite}.bounceIdle{animation:bounce 0.9s ease-in-out infinite}.swingIdle{animation:wiggle 1.8s ease-in-out infinite}.swimIdle{animation:swim 2.2s ease-in-out infinite}
`

/** Gags disponibles (le type inconnu retombe sur « pop »). */
export const GAG_TYPES = ['box', 'run', 'bonk', 'rise', 'splash', 'float', 'drive', 'fly', 'self', 'pop']

export function runGag(ctx, w, t) {
  const { s, actor, art, anim, obj: OBJ, scene: SCENE } = ctx
  const { fx, win, path, front, f } = s
  const { hop, expr, parts: PART, x: MALI_X, k: MALI_K, ground: GROUND } = actor
  const punch = (...a) => camPunch(s, ...a), quake = (...a) => camQuake(s, ...a)
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
