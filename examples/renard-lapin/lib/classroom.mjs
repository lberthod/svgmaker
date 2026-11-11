// Salle de classe réutilisable (créée pour l'épisode 2) : mur, banderole ABC, tableau, horloge, fenêtre, radiateur, étagère, plante.
import { W, H, INK, an, cloud } from './kit.mjs';

export const FLOOR = 540;

// horloge murale : h, m (heure affichée)
export const wallClock = (h, m, x = 150, y = 150) => `<g transform="translate(${x} ${y})"><circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="50" fill="none" stroke="#3b82f6" stroke-width="3" transform="scale(.86)"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-38" x2="0" y2="${i % 3 ? -33 : -28}" stroke="${INK}" stroke-width="${i % 3 ? 2.5 : 4}" transform="rotate(${i * 30})"/>`).join('')}
  <line x1="0" y1="0" x2="0" y2="-34" stroke="${INK}" stroke-width="4" stroke-linecap="round" transform="rotate(${m * 6})"/><line x1="0" y1="0" x2="0" y2="-22" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${(h % 12) * 30 + m * 0.5})"/><circle r="4.5" fill="#e8434e"/></g>`;

// tableau : inner = contenu dessiné dans la zone verte (x 306–866, y 104–340)
export const board = (inner = '') => `<g>
  <rect x="290" y="88" width="592" height="268" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="6"/>
  <rect x="306" y="104" width="560" height="236" rx="4" fill="#2f6b4f"/>
  <path d="M330 300 Q420 285 470 310 M640 130 Q720 120 800 140" stroke="#4d8a6c" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>
  ${inner}
  <rect x="300" y="340" width="572" height="14" rx="4" fill="#a8743f" stroke="${INK}" stroke-width="4"/>
  <rect x="340" y="332" width="34" height="9" rx="4" fill="#fff"/><rect x="392" y="333" width="26" height="8" rx="4" fill="#ff8fb1"/><rect x="800" y="331" width="44" height="12" rx="3" fill="#6b4a2e" stroke="${INK}" stroke-width="2.5"/></g>`;

export const banner = `<g>${'ABCDEFGHIJKL'.split('').map((c, i) => { const x = 60 + i * 100; const col = ['#ff8fb1', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff', '#ffb36b'][i % 6]; return `<g transform="translate(${x} ${30 + (i % 2) * 4}) rotate(${i % 2 ? 4 : -4})"><path d="M-32 0 L32 0 L26 50 L-26 50Z" fill="${col}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><text y="38" style="font-size:32px;fill:${INK}">${c}</text></g>`; }).join('')}
  <path d="M0 26 Q640 46 1280 26" stroke="${INK}" stroke-width="3" fill="none"/></g>`;

// fenêtre : extérieur découpé dans la vitre ; outside = éléments supplémentaires dehors (oiseau…) ; open = battant droit ouvert
export const WIN = { X: 950, Y: 118, W: 262, H: 270 };
export const windowEl = (outside = '', { open = false } = {}) => {
  const { X: WX, Y: WY, W: WW, H: WH } = WIN;
  return `<defs><clipPath id="win"><rect x="${WX + 12}" y="${WY + 12}" width="${WW - 24}" height="${WH - 24}"/></clipPath>
  <linearGradient id="skyw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc4ff"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient></defs>
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>
  <g clip-path="url(#win)">
    <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="url(#skyw)"/>
    <g style="animation:cdrift 11s ease-in-out infinite alternate">${cloud(1020, 170, 0.55)}${cloud(1170, 210, 0.42)}</g>
    <rect x="${WX}" y="${WY + 200}" width="${WW}" height="80" fill="#7ac35a"/>
    <g transform="translate(1180 330)"><rect x="-10" y="-80" width="20" height="82" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle cy="-110" r="52" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="-38" cy="-80" r="30" fill="#52c468" stroke="${INK}" stroke-width="4"/></g>
    <rect x="${WX}" y="${WY + WH - 30}" width="${WW}" height="30" fill="#c9b79a"/>
    ${outside}
  </g>
  <rect x="${WX + WW / 2 - 5}" y="${WY}" width="10" height="${WH}" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <rect x="${WX}" y="${WY + 118}" width="${WW}" height="10" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <rect x="${WX + 12}" y="${WY + 12}" width="${WW - 24}" height="${WH - 24}" fill="none" stroke="${INK}" stroke-width="4"/>
  ${open ? '' : `<path d="M${WX + 30} ${WY + 40} l40 -14 M${WX + 30} ${WY + 62} l24 -8" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`}
  <rect x="${WX - 16}" y="${WY + WH - 4}" width="${WW + 32}" height="18" rx="5" fill="#eadfca" stroke="${INK}" stroke-width="5"/>`;
};
// battant ouvert vers l'intérieur (dessiné par-dessus, devant le mur)
export const openSash = () => { const { X: WX, Y: WY, W: WW } = WIN; return `<path d="M${WX + WW / 2} ${WY + 12} L${WX + WW / 2 - 70} ${WY - 2} L${WX + WW / 2 - 70} ${WY + 132} L${WX + WW / 2} ${WY + 118}Z" fill="#dff3ff" fill-opacity=".85" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${WX + WW / 2 - 52} ${WY + 30} l20 6" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`; };

export const radiator = (drip = false) => {
  const sockDrip = (x, d) => `<g transform="translate(${x} 470)"><g style="${an({ n: 'dripk', d: 1.1, t: d, c: 999 })}"><path d="M0 0 q-5 10 0 13 q5 -3 0 -13z" fill="#8fd3ff" stroke="${INK}" stroke-width="2"/></g></g>`;
  return `<g><rect x="1000" y="410" width="200" height="96" rx="10" fill="#e9edf2" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 7 }, (_, i) => `<rect x="${1012 + i * 27}" y="420" width="18" height="76" rx="8" fill="#d3dae3" stroke="${INK}" stroke-width="2.5"/>`).join('')}
  <path d="M1062 404 v14 M1138 404 v14" stroke="${INK}" stroke-width="3"/>
  ${[1118, 1162].map((x, i) => `<g style="transform-origin:${x}px 404px;animation:sway ${1.6 + i * 0.3}s ease-in-out infinite alternate"><path d="M${x - 11} 400 L${x + 11} 400 L${x + 11} 446 Q${x + 11} 462 ${x - 5} 462 L${x - 26} 462 Q${x - 36} 462 ${x - 36} 452 Q${x - 36} 442 ${x - 11} 440Z" fill="#f28a1e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="${x - 11}" y="400" width="22" height="9" fill="#fff"/><rect x="${x - 11}" y="418" width="22" height="7" fill="#fff"/><path d="M${x - 26} 462 Q${x - 36} 462 ${x - 36} 452 Q${x - 36} 444 ${x - 26} 443Z" fill="#fff"/><path d="M${x - 11} 400 L${x + 11} 400 L${x + 11} 446 Q${x + 11} 462 ${x - 5} 462 L${x - 26} 462 Q${x - 36} 462 ${x - 36} 452 Q${x - 36} 442 ${x - 11} 440Z" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>`).join('')}
  ${drip ? sockDrip(1104, 0) + sockDrip(1148, 0.55) : ''}</g>`;
};

export const wall = `
  <rect width="${W}" height="${H}" fill="#ffe9bd"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80 + 40}" y="0" width="40" height="${FLOOR - 90}" fill="#ffe0a6" opacity=".7"/>`).join('')}
  <rect y="${FLOOR - 92}" width="${W}" height="92" fill="#f4c27f"/><rect y="${FLOOR - 98}" width="${W}" height="12" rx="4" fill="#d9954f" stroke="${INK}" stroke-width="3"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80 + 12}" y="${FLOOR - 76}" width="56" height="62" rx="6" fill="#efb46a"/>`).join('')}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#c98a4e"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#b37740" stroke-width="3"/>`).join('')}
  <rect y="${FLOOR - 6}" width="${W}" height="10" fill="#8a5224"/>
  <g transform="translate(900 470)"><rect x="-26" y="-46" width="52" height="46" rx="6" fill="#ff9f43" stroke="${INK}" stroke-width="4"/><path d="M0 -46 q-26 -40 -10 -70 M0 -46 q16 -44 30 -60 M0 -46 q-2 -30 4 -58" stroke="#3fae55" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-10" cy="-116" rx="14" ry="9" fill="#52c468" stroke="${INK}" stroke-width="3"/><ellipse cx="30" cy="-106" rx="14" ry="9" fill="#52c468" stroke="${INK}" stroke-width="3"/></g>
  <g transform="translate(40 380)"><rect width="190" height="10" rx="4" fill="#8a5224" stroke="${INK}" stroke-width="3.5"/></g>
  <g transform="translate(36 312)"><rect width="22" height="66" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><rect x="24" y="10" width="26" height="56" fill="#3b82f6" stroke="${INK}" stroke-width="3.5"/><rect x="52" y="-2" width="20" height="68" fill="#22a06b" stroke="${INK}" stroke-width="3.5"/><rect x="74" y="16" width="30" height="50" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/></g>`;

// pupitres
export const desk = (x, top, w, bottom, items = '') => `<g>
  <path d="M${x - w / 2 + 14} ${top - 22} L${x + w / 2 - 14} ${top - 22} L${x + w / 2} ${top} L${x - w / 2} ${top}Z" fill="#eec08a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${items}
  <rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="6" fill="#d49a5c" stroke="${INK}" stroke-width="5"/>
  <rect x="${x - w / 2 + 18}" y="${top + 16}" width="${w - 36}" height="${Math.max(10, (bottom - top) * 0.32)}" rx="6" fill="#c2884c"/></g>`;
export const pencil = (x, y, r = -8) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-34" y="-5" width="60" height="10" rx="3" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M26 -5 L40 0 L26 5Z" fill="#f3d2a2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="-40" y="-5" width="8" height="10" rx="2" fill="#ff8fb1" stroke="${INK}" stroke-width="3"/></g>`;
export const book = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M-46 -6 L0 -14 L46 -6 L46 2 L0 -6 L-46 2Z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-40 -6 L0 -12 L40 -6" stroke="#fff" stroke-width="3" fill="none"/></g>`;
