// Outils partagés par les formats : validation des briefs, blocs de texte mesurés, dessins de bibliothèque.
import { esc, fixed, kindOf, missingChars, validateArt } from '../kit/core.mjs'
import { art as libArt, hasArt } from '../kit/library.mjs'
import { fitBlock } from '../kit/text.mjs'

export const f = fixed(3)
/** Interligne (en em) par police. */
export const LINE = { en: 1.18, th: 1.42 }

/** Erreur de brief lisible : « <id> : cards[2].text : manquant ». */
export function briefError(brief, where, msg) {
  return new Error(`${brief?.id ?? 'brief'} : ${where} : ${msg}`)
}

/** Contrôles communs : id, format, et un texte non vide couvert par les polices. */
export function checkCommon(brief, format) {
  if (!brief || typeof brief !== 'object') throw new Error('brief : objet JSON attendu')
  if (brief.format !== format) throw briefError(brief, 'format', `« ${format} » attendu`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(brief.id ?? '')) throw briefError(brief, 'id', 'minuscules, chiffres et tirets (« astuce-peinture »)')
}
export function checkText(brief, where, s, { required = true, max = 400 } = {}) {
  if (s == null || s === '') { if (required) throw briefError(brief, where, 'texte manquant'); return }
  if (typeof s !== 'string') throw briefError(brief, where, 'chaîne attendue')
  if (s.length > max) throw briefError(brief, where, `trop long (${s.length} > ${max} caractères)`)
  const miss = missingChars(s, kindOf(s))
  if (miss.length) throw briefError(brief, where, `caractères absents des polices embarquées : ${miss.join(' ')}`)
}
export function checkArt(brief, where, id) {
  if (id == null) return
  if (typeof id !== 'string' || !hasArt(id)) throw briefError(brief, where, `dessin « ${id} » absent de library/ (svgmaker art list)`)
  validateArt(libArt(id), id)
}

/** Dessin de bibliothèque centré en (x, y), à la taille `px` (le dessin tient dans ±250). */
export const drawArt = (id, x, y, px, { crayon = true, extra = '' } = {}) =>
  `<g transform="translate(${f(x)} ${f(y)})"><g ${extra}><g transform="scale(${f(px / 500)})"${crayon ? ' filter="url(#crayon)"' : ''}>${libArt(id)}</g></g></g>`

/**
 * Bloc de texte multiligne mesuré, centré sur x (ou aligné à gauche si anchor = 'start').
 * top = haut de l'encre de la première ligne. Retourne { svg, height, size, lines }.
 * anim(i) : style CSS d'animation de la ligne i ; attrs : attributs en plus (data-role…).
 */
export function textBlock(s, { x = 540, top, width = 860, max, min = 30, maxLines = 3, anchor = 'middle', fill, halo, halo_k = 0.14, anim = () => '', attrs = '', tspans }) {
  const kind = kindOf(s)
  const b = fitBlock(s, { kind, max, min, width, maxLines })
  // interligne : la police thaïe (Mali) est plus haute (voyelles et tons au-dessus et au-dessous)
  const lh = b.size * LINE[kind], asc = b.size * 0.78
  const svg = b.lines.map((line, i) => `<text class="${kind}" x="${x}" y="${f(top + asc + i * lh)}" text-anchor="${anchor}" font-size="${b.size}" fill="${fill}" stroke="${halo}" stroke-width="${f(b.size * halo_k)}"${attrs ? ' ' + attrs : ''} style="${anim(i)}">${tspans ? tspans(line, i) : esc(line)}</text>`).join('\n      ')
  return { svg, height: asc + (b.lines.length - 1) * lh + b.size * 0.22, size: b.size, lines: b.lines }
}

/** Nombre de mots (lecture : environ 3 mots par seconde). */
export const words = (...ss) => ss.filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
