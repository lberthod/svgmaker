// svgkit · petits personnages plats « atlas » : tête ronde, corps arrondi, yeux en points, sourire (comme les
// figurines des vidéos d'histoire sur carte). Origine = milieu des pieds ; le personnage mesure 160 unités de haut
// et ±50 de large. person(preset|options) → SVG ; la couleur du vêtement code la langue (cf. LANGS).
import { fixed } from './core.mjs'

const f = fixed(2)
const INK = '#2B2118'

/** Personnages prêts à l'emploi (la couleur du vêtement = la couleur de la langue sur la carte). */
export const PEOPLE = {
  heidi: { skin: '#F4CBA2', hair: '#7A4A2B', style: 'braids', outfit: '#E5322D', apron: true },
  de: { skin: '#F1C79E', hair: '#B5651D', style: 'short', outfit: '#E8503A', hat: 'tyrol' },
  fr: { skin: '#E9B98E', hair: '#2B2118', style: 'short', outfit: '#3B82F6', scarf: '#FFFFFF' },
  it: { skin: '#E7B488', hair: '#3A2418', style: 'short', outfit: '#2EB872', hat: 'straw' },
  rm: { skin: '#F2C9A0', hair: '#C08A3E', style: 'short', outfit: '#FF9F1C', horns: true },
  // personnages d'époque (histoire)
  celte: { skin: '#F1C79E', hair: '#C9622B', style: 'short', outfit: '#3E9A63', moustache: true },
  romain: { skin: '#E9B98E', hair: '#2B2118', style: 'short', outfit: '#C62828', hat: 'helmet' },
  cesar: { skin: '#E9B98E', hair: '#2B2118', style: 'short', outfit: '#8E1B1B', laurel: true },
  alaman: { skin: '#F4CBA2', hair: '#E3B341', style: 'short', outfit: '#E8503A', beard: true },
  burgonde: { skin: '#F1C79E', hair: '#8A5A2B', style: 'short', outfit: '#3B82F6', beard: true, hat: 'crown' },
  roi: { skin: '#F1C79E', hair: '#9AA0A8', style: 'short', outfit: '#6B3FA0', hat: 'crown', beard: true },
  soldat: { skin: '#E9B98E', hair: '#3A2418', style: 'short', outfit: '#4F6B45', hat: 'helmet' },
  marin: { skin: '#E9B98E', hair: '#3A2418', style: 'short', outfit: '#2F5D9B', hat: 'cap', scarf: '#FFFFFF' },
  ouvrier: { skin: '#F1C79E', hair: '#7A4A2B', style: 'short', outfit: '#E0872B', hat: 'hardhat' },
  paysan: { skin: '#E9B98E', hair: '#5B3A1E', style: 'short', outfit: '#8C6A3F', hat: 'straw' },
  rebelle: { skin: '#F1C79E', hair: '#2B2118', style: 'short', outfit: '#C62828', beard: true, hat: 'beret' },
  savant: { skin: '#F4CBA2', hair: '#B8B8B8', style: 'short', outfit: '#5B6C8F', beard: true, moustache: true },
  confedere: { skin: '#F1C79E', hair: '#7A4A2B', style: 'short', outfit: '#E5322D', scarf: '#FFFFFF' },
}

const darker = (hex, k = 0.78) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('')

/**
 * @param {string|object} o  nom d'un preset (PEOPLE) ou options { skin, hair, style: 'short'|'braids', outfit, hat: 'tyrol'|'straw'|'crown',
 *   horns, scarf, apron, flag, mood: 'happy'|'wow'|'sad'|'oops', wave }
 */
export function person(o) {
  const p = typeof o === 'string' ? { ...PEOPLE[o] } : { ...(PEOPLE[o.who] ?? {}), ...o }
  const skin = p.skin ?? '#F1C79E', hair = p.hair ?? '#7A4A2B', outfit = p.outfit ?? '#E5322D', mood = p.mood ?? 'happy'
  const out = []
  // pieds et jambes
  out.push(`<rect x="-24" y="-26" width="18" height="26" rx="6" fill="#5B4636"/><rect x="6" y="-26" width="18" height="26" rx="6" fill="#5B4636"/>`)
  // bras (celui de droite lève une main s'il salue)
  out.push(`<rect x="-47" y="-92" width="15" height="46" rx="7.5" fill="${darker(outfit)}"/>`)
  out.push(p.wave
    ? `<g transform="rotate(-150 40 -88)"><rect x="33" y="-92" width="15" height="46" rx="7.5" fill="${darker(outfit)}"/><circle cx="40.5" cy="-44" r="9" fill="${skin}"/></g>`
    : `<rect x="32" y="-92" width="15" height="46" rx="7.5" fill="${darker(outfit)}"/>`)
  // corps
  out.push(`<rect x="-35" y="-98" width="70" height="78" rx="18" fill="${outfit}"/>`)
  if (p.apron) out.push(`<rect x="-19" y="-76" width="38" height="52" rx="8" fill="#fff"/><path d="M -3 -66 H 3 V -54 H 9 V -48 H 3 V -36 H -3 V -48 H -9 V -54 H -3 Z" fill="#E5322D"/>`)
  if (p.scarf) out.push(`<path d="M -26 -96 Q 0 -80 26 -96 L 26 -84 Q 0 -68 -26 -84 Z" fill="${p.scarf}"/>`)
  // cheveux derrière la tête (nattes)
  if (p.style === 'braids') out.push(`<ellipse cx="-31" cy="-110" rx="9" ry="22" fill="${hair}"/><ellipse cx="31" cy="-110" rx="9" ry="22" fill="${hair}"/>`)
  // tête
  out.push(`<circle cx="0" cy="-126" r="33" fill="${skin}"/>`)
  out.push(`<path d="M -33 -128 Q -34 -164 0 -164 Q 34 -164 33 -128 Q 22 -146 0 -146 Q -22 -146 -33 -128 Z" fill="${hair}"/>`)
  if (p.beard) out.push(`<path d="M -27 -118 Q -24 -86 0 -84 Q 24 -86 27 -118 Q 14 -100 0 -100 Q -14 -100 -27 -118 Z" fill="${hair}"/>`)
  // visage
  const eye = mood === 'wow' ? 'r="4.6"' : 'r="3.8"'
  out.push(`<circle cx="-11" cy="-124" ${eye} fill="${INK}"/><circle cx="11" cy="-124" ${eye} fill="${INK}"/>`)
  out.push(`<circle cx="-21" cy="-114" r="5.5" fill="#E8836B" opacity=".45"/><circle cx="21" cy="-114" r="5.5" fill="#E8836B" opacity=".45"/>`)
  out.push({
    happy: `<path d="M -10 -110 Q 0 -100 10 -110" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`,
    wow: `<ellipse cx="0" cy="-107" rx="6" ry="8" fill="${INK}"/>`,
    sad: `<path d="M -10 -104 Q 0 -113 10 -104" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`,
    oops: `<path d="M -10 -107 H 10" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`,
  }[mood] ?? '')
  if (p.moustache) out.push(`<path d="M -16 -112 Q -8 -118 0 -112 Q 8 -118 16 -112 Q 8 -106 0 -110 Q -8 -106 -16 -112 Z" fill="${hair}"/>`)
  // chapeaux et accessoires
  if (p.hat === 'helmet') out.push(`<path d="M -35 -134 Q -36 -178 0 -178 Q 36 -178 35 -134 Z" fill="#C9CED6" stroke="#8A919C" stroke-width="2.5" stroke-linejoin="round"/><rect x="-6" y="-200" width="12" height="28" rx="6" fill="#C62828"/><rect x="-35" y="-140" width="70" height="7" rx="3.5" fill="#9AA1AC"/>`)
  if (p.laurel) out.push(`<path d="M -32 -142 Q -30 -170 0 -172 Q 30 -170 32 -142" fill="none" stroke="#3E9A63" stroke-width="7" stroke-linecap="round"/><circle cx="-30" cy="-150" r="6" fill="#3E9A63"/><circle cx="-24" cy="-162" r="6" fill="#3E9A63"/><circle cx="30" cy="-150" r="6" fill="#3E9A63"/><circle cx="24" cy="-162" r="6" fill="#3E9A63"/>`)
  if (p.hat === 'tyrol') out.push(`<ellipse cx="0" cy="-152" rx="40" ry="9" fill="#2F7D4F"/><path d="M -25 -152 Q -22 -184 0 -184 Q 22 -184 25 -152 Z" fill="#3E9A63"/><path d="M 14 -170 Q 40 -196 46 -176 Q 30 -178 18 -164 Z" fill="#E5322D"/>`)
  if (p.hat === 'straw') out.push(`<ellipse cx="0" cy="-150" rx="46" ry="10" fill="#E9CE82"/><path d="M -26 -150 Q -24 -178 0 -178 Q 24 -178 26 -150 Z" fill="#F2DC9C"/><rect x="-26" y="-160" width="52" height="8" fill="#2EB872"/>`)
  if (p.hat === 'cap') out.push(`<ellipse cx="0" cy="-153" rx="38" ry="8" fill="#F5F5F5"/><path d="M -30 -153 Q -28 -176 0 -176 Q 28 -176 30 -153 Z" fill="#F5F5F5" stroke="#C9CED6" stroke-width="2"/><rect x="-30" y="-162" width="60" height="9" fill="#1F3A68"/>`)
  if (p.hat === 'hardhat') out.push(`<path d="M -34 -146 Q -34 -184 0 -184 Q 34 -184 34 -146 Z" fill="#F7C93C" stroke="#C99A1E" stroke-width="2.5" stroke-linejoin="round"/><rect x="-42" y="-148" width="84" height="9" rx="4.5" fill="#E0AE1E"/>`)
  if (p.hat === 'beret') out.push(`<path d="M -34 -146 Q -40 -170 -6 -172 Q 36 -176 38 -152 Q 10 -142 -34 -146 Z" fill="#2B2B33" stroke="#17171C" stroke-width="2" stroke-linejoin="round"/>`)
  if (p.hat === 'crown') out.push(`<path d="M -22 -158 L -22 -182 L -11 -170 L 0 -188 L 11 -170 L 22 -182 L 22 -158 Z" fill="#F7C93C" stroke="#C99A1E" stroke-width="2.5" stroke-linejoin="round"/>`)
  if (p.horns) out.push(`<path d="M -20 -158 Q -34 -180 -22 -202 Q -26 -178 -8 -164 Z M 20 -158 Q 34 -180 22 -202 Q 26 -178 8 -164 Z" fill="#8B6B45" stroke="#5E4529" stroke-width="2.5" stroke-linejoin="round"/>`)
  if (p.flag) out.push(`<rect x="52" y="-196" width="5" height="190" fill="#7A5A3A"/><rect x="57" y="-196" width="62" height="46" fill="#E5322D"/><path d="M 82 -186 H 94 V -176 H 104 V -166 H 94 V -156 H 82 V -166 H 72 V -176 H 82 Z" fill="#fff"/>`)
  return out.join('')
}
export const personNames = Object.keys(PEOPLE)
export { f as _f }
