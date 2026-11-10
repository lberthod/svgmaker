// svgkit · décors plein cadre (1080×1920), dans le style « dessin d'enfant » ou sobres pour les cartons.
//   const set = scenery('day', { ground: 1365 }) → { defs, body }
// Le sol (si le décor en a un) est à y = ground : les acteurs y posent les pieds.
import { S, cloud, fixed, star5 } from './core.mjs'

const f = fixed(3)
const hill = (ground, fill, stroke) =>
  `<path d="M -200 ${ground - 20} L 0 ${ground - 20} Q 270 ${ground - 60} 540 ${ground - 20} T 1080 ${ground - 30} L 1280 ${ground - 30} L 1280 2120 L -200 2120 Z" fill="${fill}" stroke="${stroke}" stroke-width="10" filter="url(#crayon)"/>`

const SETS = {
  /** Ciel pastel, nuages, colline verte. */
  day: ({ ground }) => ({
    defs: '<linearGradient id="set-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C9"/><stop offset=".55" stop-color="#FFE9EF"/><stop offset="1" stop-color="#D4F1FF"/></linearGradient>',
    body: `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#set-day)"/>
    ${cloud(170, 170, 0.9, 0, { alternate: true })}${cloud(900, 230, 0.7, 1.5, { alternate: true })}${cloud(560, 120, 0.5, 3, { alternate: true })}
    ${hill(ground, '#9BE07A', '#6DBF4E')}`,
  }),
  /** Nuit douce : dégradé bleu, lune souriante, étoiles qui scintillent, colline sombre. */
  night: ({ ground }) => ({
    defs: '<linearGradient id="set-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2440"/><stop offset="1" stop-color="#4B4F9A"/></linearGradient>',
    body: `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#set-night)"/>
    ${[[120, 260, 16], [300, 140, 12], [520, 300, 10], [700, 180, 14], [980, 420, 12], [240, 520, 9], [620, 560, 11], [880, 640, 9]]
      .map(([x, y, r], i) => `<g style="transform-box:fill-box;transform-origin:center;animation:twinkle ${f(1.6 + (i % 3) * 0.5)}s ease-in-out ${f(i * 0.3)}s infinite">${star5(x, y, r, '#FFE07A', '', f)}</g>`).join('')}
    <g transform="translate(860 230)"><circle r="95" fill="#FFF3B0" ${S(10)}/><circle cx="-30" cy="-25" r="16" fill="#F2DC85"/><circle cx="35" cy="30" r="11" fill="#F2DC85"/>
      <path d="M -30 10 q 10 -10 20 0 M 12 10 q 10 -10 20 0" fill="none" ${S(7)}/><path d="M -14 40 q 14 14 28 0" fill="none" ${S(7)}/></g>
    ${hill(ground, '#2F6B4F', '#244F3C')}`,
  }),
  /** Plage : ciel, mer qui ondule, sable. */
  beach: ({ ground }) => ({
    defs: '<linearGradient id="set-beach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE9FF"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>',
    body: `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#set-beach)"/>
    ${cloud(200, 200, 0.8, 0, { alternate: true })}${cloud(820, 300, 0.6, 2, { alternate: true })}
    <path d="M -200 ${ground - 230} Q 60 ${ground - 260} 300 ${ground - 230} T 800 ${ground - 230} T 1280 ${ground - 230} L 1280 ${ground} L -200 ${ground} Z" fill="#5CC8FF" stroke="#2E9BD6" stroke-width="10" filter="url(#crayon)"/>
    ${hill(ground, '#FFE0A3', '#E8B96A')}`,
  }),
  /** Papier crème uni (cartons, quiz sobres). */
  paper: () => ({ defs: '', body: '<rect x="-200" y="-200" width="1480" height="2320" fill="#FFF6E9"/>' }),
  /** Nuit unie (cartons « night »). */
  ink: () => ({ defs: '', body: '<rect x="-200" y="-200" width="1480" height="2320" fill="#141B2D"/>' }),
}

export const SCENERY = Object.keys(SETS)

export function scenery(name, { ground = 1365 } = {}) {
  const set = SETS[name]
  if (!set) throw new Error(`décor « ${name} » inconnu (${SCENERY.join(', ')})`)
  return set({ ground })
}
