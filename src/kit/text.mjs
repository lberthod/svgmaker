// svgkit · polices embarquées et texte MESURÉ (avances réelles des glyphes, sans navigateur).
//
// Polices libres (SIL OFL 1.1, voir fonts/*-OFL.txt), préparées par fonts/build-fonts.py :
//   en : Fredoka Bold (latin, arrondie)        → famille CSS « Fredoka »
//   th : Mali Bold (thaï + latin, pour enfants) → famille CSS « Mali »
// Embarquées en base64 dans le <style> du SVG : le rendu est identique sur toutes les machines.
import { readFileSync } from 'node:fs'
import path from 'node:path'

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), 'fonts')
export const FONTS = {
  en: { family: 'Fredoka', file: 'en.woff2', stack: `'Fredoka','Chalkboard SE','Comic Sans MS',sans-serif` },
  th: { family: 'Mali', file: 'th.woff2', stack: `'Mali','Sukhumvit Set','Thonburi',sans-serif` },
}

let metrics = null
const M = () => (metrics ??= JSON.parse(readFileSync(path.join(DIR, 'metrics.json'), 'utf8')))

let faces = null
/** Règles @font-face (polices complètes du jeu de caractères, en base64) à placer dans le <style>. */
export function fontFaceCSS() {
  faces ??= Object.values(FONTS).map((f) =>
    `@font-face{font-family:'${f.family}';font-weight:700;font-style:normal;src:url(data:font/woff2;base64,${readFileSync(path.join(DIR, f.file)).toString('base64')}) format('woff2')}`,
  ).join('\n')
  return faces
}

/**
 * Largeur en px de `s` dans la police `kind` ('en' | 'th') au corps `size`.
 * Les voyelles et tons thaïs au-dessus ou au-dessous ont une avance nulle (lue dans la police).
 * Caractère absent (emoji…) : compté 1 em.
 */
export function textWidth(s, kind = 'en', size = 1) {
  const { upm, adv } = M()[kind]
  let w = 0
  for (const ch of String(s)) w += adv[ch.codePointAt(0)] ?? upm
  return (w / upm) * size
}

/** Corps (entier) qui fait tenir `s` dans `width` px, sans dépasser `max` ni descendre sous `min`. */
export function fitSize(s, { kind = 'en', max, width, min = 1 }) {
  const w1 = textWidth(s, kind, 1)
  // arrondi inférieur : le texte ne dépasse jamais `width`
  return Math.max(min, Math.floor(Math.min(max, w1 ? width / w1 : max)))
}

const UPPER_VOWEL = /[ัิ-ื็]/u, TONE = /[่-์]/u

/**
 * Étendue verticale de l'encre de `s`, en em, par rapport à la ligne de base (y vers le haut) :
 * { top, bottom }. Un ton posé sur une voyelle haute (ตั๊, กิ่) monte beaucoup plus haut que les lettres.
 */
export function inkExtent(s, kind = 'en') {
  const { upm, ink, stackTop } = M()[kind]
  let top = 0, bottom = 0
  const chars = [...String(s)]
  chars.forEach((ch, i) => {
    const b = ink[ch.codePointAt(0)]
    if (b) { bottom = Math.min(bottom, b[0]); top = Math.max(top, b[1]) }
    if (TONE.test(ch) && i && UPPER_VOWEL.test(chars[i - 1])) top = Math.max(top, stackTop)
  })
  return { top: top / upm, bottom: bottom / upm }
}

/**
 * Place `s` dans une boîte : corps maximal qui tient en largeur ET en hauteur (encre réelle),
 * et ligne de base qui centre l'encre verticalement sur `cy`. Retourne { size, y }.
 */
export function fitInBox(s, { kind = 'en', max, width, height, cy }) {
  const { top, bottom } = inkExtent(s, kind)
  const size = Math.min(fitSize(s, { kind, max, width }), Math.floor(height / Math.max(0.5, top - bottom)))
  return { size, y: +(cy + ((top + bottom) / 2) * size).toFixed(2) }
}

/** Police d'un texte : thaï s'il contient un caractère thaï, sinon latin. */
export const kindOf = (s) => (/[฀-๿]/.test(String(s)) ? 'th' : 'en')

// mots qui ne commencent jamais une ligne (unités après un nombre, ponctuation haute à la française, « · »)
const GLUE_PREV = /^(°\S*|%|‰|h|min|s|ms|km|m|cm|mm|kg|g|€|CHF|[!?:;»·…—–])$/
const GLUE_NEXT = /^[«]$/

/** Mots insécables : « 18 °C », « 24 h », « Bonne nuit ! », « « Oui » » restent ensemble. */
function tokens(para) {
  const out = []
  for (const w of para.split(/[ \t]+/).filter(Boolean)) {
    const prev = out.at(-1)
    if (prev != null && (GLUE_PREV.test(w) || GLUE_NEXT.test(prev))) out[out.length - 1] = `${prev} ${w}`
    else out.push(w)
  }
  return out
}

function greedy(words, kind, size, width) {
  const lines = []
  let cur = ''
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word
    if (cur && textWidth(next, kind, size) > width) { lines.push(cur); cur = word } else cur = next
  }
  lines.push(cur)
  return lines
}

/**
 * Coupe `s` en lignes de `width` px au plus, aux espaces (un mot trop long reste seul sur sa ligne).
 * Lignes équilibrées (comme text-wrap: balance) : à nombre de lignes égal, on prend la largeur la plus
 * étroite, ce qui évite un mot orphelin sur la dernière ligne.
 */
export function wrapLines(s, { kind = kindOf(s), size, width, balance = true }) {
  const lines = []
  for (const para of String(s).split('\n')) {
    const words = tokens(para)
    let best = greedy(words, kind, size, width)
    if (balance && best.length > 1) {
      let lo = width / best.length, hi = width
      for (let k = 0; k < 14; k++) {
        const mid = (lo + hi) / 2, l = greedy(words, kind, size, mid)
        if (l.length <= best.length && Math.max(...l.map((x) => textWidth(x, kind, size))) <= mid + 0.5) { hi = mid; best = l } else lo = mid
      }
    }
    lines.push(...best)
  }
  return lines
}

/**
 * Bloc de texte : le plus grand corps (≤ max, ≥ min) pour lequel `s` tient en `maxLines` lignes
 * de `width` px. Retourne { size, lines, width } (width = ligne la plus longue).
 */
export function fitBlock(s, { kind = kindOf(s), max, min = 26, width, maxLines = 3 }) {
  for (let size = max; size >= min; size -= 2) {
    const lines = wrapLines(s, { kind, size, width })
    const w = Math.max(...lines.map((l) => textWidth(l, kind, size)))
    if (lines.length <= maxLines && w <= width) return { size, lines, width: w }
  }
  const lines = wrapLines(s, { kind, size: min, width })
  return { size: min, lines, width: Math.max(...lines.map((l) => textWidth(l, kind, min))) }
}

/** Est-ce que des caractères de `s` manquent dans la police `kind` ? (hors espaces et emoji) */
export function missingChars(s, kind = 'en') {
  const { adv } = M()[kind]
  return [...new Set([...String(s)].filter((ch) => !(ch.codePointAt(0) in adv) && !/\p{Extended_Pictographic}|\s|️/u.test(ch)))]
}
