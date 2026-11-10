// svgkit · primitives partagées par les générateurs de SVG animés (séries kids-english-th, Mali…).
// Tout est pur : chaînes SVG en sortie (seules les polices sont lues sur disque, par text.mjs).
import { FONTS } from './text.mjs'
export { fitBlock, fitInBox, fitSize, fontFaceCSS, inkExtent, kindOf, missingChars, textWidth, wrapLines } from './text.mjs'

// ---------------------------------------------------------------- charte « dessin d'enfant »
export const INK = '#3B2A20'
export const RAINBOW = ['#F23B3B', '#FF8A3D', '#F2B705', '#3DBE5A', '#1E9BE0', '#8E5BD9']
// polices libres embarquées (text.mjs : Fredoka pour l'anglais, Mali pour le thaï), avec repli système
export const EN_FONT = FONTS.en.stack
export const TH_FONT = FONTS.th.stack

// ---------------------------------------------------------------- nombres et texte
/** Arrondi à `digits` décimales, sans zéros inutiles : fixed(2)(1.5) → 1.5. */
export const fixed = (digits) => (n) => +n.toFixed(digits)

/** Échappe un texte destiné au contenu d'un élément ou d'un attribut SVG. */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Mot « arc-en-ciel » : une couleur par lettre. `keepSpaces` laisse les espaces hors des <tspan>. */
export const rainbow = (word, offset = 0, { keepSpaces = false } = {}) =>
  [...word].map((c, i) => (keepSpaces && c === ' ' ? ' ' : `<tspan fill="${RAINBOW[(i + offset) % RAINBOW.length]}">${esc(c)}</tspan>`)).join('')

// ---------------------------------------------------------------- styles et animation
/** Contour encre standard (attributs). */
export const S = (w = 12) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`

/** Déclaration CSS `animation:` ; `fmt` arrondit durée et délai. */
export const anim = (name, dur, delay, ease = 'cubic-bezier(.3,1.5,.5,1)', fill = 'both', fmt = fixed(3)) =>
  `animation:${name} ${fmt(dur)}s ${ease} ${fmt(delay)}s ${fill}`

// ---------------------------------------------------------------- formes et décors
/** Tracé d'une étoile à 5 branches centrée en (0,0). */
export const starPath = (r, fmt = fixed(3)) =>
  `${Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r
    return `${i ? 'L' : 'M'}${fmt(Math.cos(a) * rr)} ${fmt(Math.sin(a) * rr)}`
  }).join(' ')}Z`

/** Étoile pleine en (x, y) ; la position est portée par un <g> (une animation « transform » sur le <path> ne l'écrase pas). */
export const star5 = (x, y, r, c, extra = '', fmt = fixed(3)) =>
  `<g transform="translate(${x} ${y})"><path d="${starPath(r, fmt)}" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" ${extra}/></g>`

export const CLOUD_PATH = 'M -110 30 Q -130 -20 -80 -30 Q -70 -80 -10 -70 Q 30 -110 80 -60 Q 140 -60 130 0 Q 160 40 110 50 L -90 50 Q -140 50 -110 30 Z'

/** Nuage qui dérive ; `alternate` ajoute « alternate » à l'animation. */
export const cloud = (x, y, k, delay, { alternate = false } = {}) =>
  `<g transform="translate(${x} ${y}) scale(${k})"><g style="animation:drift 7s ease-in-out ${delay}s infinite${alternate ? ' alternate' : ''}"><path d="${CLOUD_PATH}" fill="#fff" stroke="#BFE3F2" stroke-width="8" stroke-linejoin="round"/></g></g>`

/** Dégradé de ciel pastel (id « sky »). */
export const SKY_GRADIENT = '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C9"/><stop offset=".55" stop-color="#FFE9EF"/><stop offset="1" stop-color="#D4F1FF"/></linearGradient>'

/** Filtre « crayon » (id « crayon ») : léger tremblé du trait. `pad` en %, `scale` = amplitude. */
export const crayonFilter = ({ pad = 10, scale = 7 } = {}) => `<filter id="crayon" x="-${pad}%" y="-${pad}%" width="${100 + 2 * pad}%" height="${100 + 2 * pad}%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`

// ---------------------------------------------------------------- validation des dessins
const FORBIDDEN = /<script|<animate|<set\b|animation|@keyframes|\bid=|\bclass=|<style|href=|<image|<foreignObject|\bon[a-z]+=/i

/**
 * Un dessin (`art`) est du SVG statique : ni script, ni animation, ni style, ni id/class, ni lien, ni image.
 * Lève une erreur « <where> : … » sinon. Retourne le dessin.
 */
export function validateArt(part, where = 'dessin') {
  if (typeof part !== 'string' || !part.trim()) throw new Error(`${where} : dessin vide`)
  const m = FORBIDDEN.exec(part)
  if (m) throw new Error(`${where} : « ${m[0]} » interdit dans un dessin (script, animation, style, id, class, href, image, on…)`)
  // balises équilibrées : un dessin mal fermé casserait tout le SVG
  const open = (part.match(/<[a-zA-Z][^>]*[^/]>|<[a-zA-Z]+>/g) || []).length
  const close = (part.match(/<\/[a-zA-Z]+>/g) || []).length
  if (open !== close) throw new Error(`${where} : balises non équilibrées (${open} ouvertes, ${close} fermées)`)
  return part
}
