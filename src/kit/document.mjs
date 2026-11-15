// svgkit · document SVG vertical 1080×1920 commun à tous les formats : polices embarquées, styles de base,
// fenêtres de scène, contrat data-* avec svgMaker (durée, fps, musique, rôles hook/final pour l'audit).
import { EN_FONT, TH_FONT, crayonFilter, esc, fixed } from './core.mjs'
import { fontFaceCSS } from './text.mjs'

export const W = 1080, H = 1920
/** Zone sûre Reels/Shorts (voir src/audit.mjs) : le contenu important reste dedans. */
export const SAFE = { top: 220, bottom: 1500, left: 60, right: 1020 }
const f = fixed(3)

export const BASE_CSS = `
text{font-weight:700;paint-order:stroke;stroke-linejoin:round}
.en{font-family:${EN_FONT};word-spacing:.14em;letter-spacing:.012em}.th{font-family:${TH_FONT}}
.sc{opacity:0}
.pop,.fx{transform-box:fill-box;transform-origin:center}
@keyframes win{0%{opacity:0}3%{opacity:1}97%{opacity:1}100%{opacity:0}}
@keyframes winEnd{0%{opacity:0}5%{opacity:1}100%{opacity:1}}
@keyframes pop{0%{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.12)}80%{transform:scale(.95)}100%{opacity:1;transform:none}}
@keyframes up{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:none}}
@keyframes left{0%{opacity:0;transform:translateX(-60px)}100%{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes dim{to{opacity:.25}}
@keyframes out{to{opacity:0}}
@keyframes glow{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes bar{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes twinkle{0%,100%{opacity:.35;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(50px)}}
`

/** Groupe visible de t à t + dur (fondu d'entrée et de sortie ; `last` : reste affiché jusqu'à la fin). */
export const sceneGroup = (t, dur, content, { last = false } = {}) =>
  `<g class="sc" style="animation:${last ? 'winEnd' : 'win'} ${f(dur)}s linear ${f(t)}s both">${content}</g>`

/**
 * Document complet. `body` est dessiné dans l'ordre ; `keyframes` = règles générées (trajectoires, caméra…).
 * `music` : chemin relatif d'une piste (data-music, lu par svgmaker render).
 */
export function svgDocument({ title, format, id, duration, fps = 30, defs = '', css = '', keyframes = [], body, music }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${f(duration)}" data-fps="${fps}"${music ? ` data-music="${esc(music)}"` : ''}>
  <title>${esc(title)}</title>
  <!-- Généré par svgkit (format ${format}, brief ${esc(id)}) : modifier le brief puis « svgmaker new » -->
  <defs>
    ${crayonFilter({ pad: 15, scale: 6 })}
    ${defs}
  </defs>
  <style>${fontFaceCSS()}
${BASE_CSS}
${css}
${keyframes.join('\n')}</style>
${body}
</svg>
`
}
