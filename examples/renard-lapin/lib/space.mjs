// Saison 7 « Cap sur la lune » : décors (club, atelier, fusée, cabine, ciel étoilé, planètes, lune, retour à la maison) et accessoires.
// Convention : fonctions qui renvoient une chaîne SVG. Objets autour de (0,0) = point au sol (centre bas) sauf mention contraire ;
// fonds = plein écran 1280x720, légèrement débordants (x −80 → W+80) pour absorber caméra et tremblements. Sol : GROUND = 560 (pieds des personnages ≈ 560–640).
// Préfixe de keyframes : s7…
import { W, H, INK, an, ao, anims, vis, tf } from './kit.mjs';
import { addKF } from './kit.mjs';
import { sky, hills, meadow, clouds } from './farm.mjs';

export const GROUND = 560;

addKF(`@keyframes s7tw{0%,100%{opacity:.35;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}
@keyframes s7flame{from{transform:scale(.9,.85)}to{transform:scale(1.08,1.2)}}
@keyframes s7pulse{0%,100%{opacity:.35}50%{opacity:.8}}
@keyframes s7sway{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
@keyframes s7drift{from{transform:translate(0,0) rotate(-4deg)}to{transform:translate(0,-12px) rotate(5deg)}}
@keyframes s7glint{0%,70%,100%{opacity:0;transform:scale(.2)}82%{opacity:1;transform:scale(1)}92%{opacity:0;transform:scale(1.3)}}
@keyframes s7fade{from{opacity:0}to{opacity:1}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const g = (x, y, s, inner, rot = 0) => `<g transform="translate(${x} ${y})${rot ? ` rotate(${rot})` : ''} scale(${s})">${inner}</g>`;
let uid = 0;
const spark4 = (x, y, r, c = '#fff6c8') => `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="${c}"/>`;

// ═════════════════════ ciel étoilé ═════════════════════
// kind : 'night' | 'deep' (espace) | 'dusk' (soir à la maison) ; n = nombre d'étoiles ; twinkle = scintillement
export const starSky = (o = {}) => {
  const { kind = 'night', n = 46, twinkle = true } = o;
  const bands = { night: ['#0d1238', '#141a4d', '#1b2260', '#242c70'], deep: ['#070a22', '#0b0f31', '#0f143c', '#141a48'], dusk: ['#2c2866', '#4a3a82', '#8a4f8f', '#e0768a'] }[kind] || [];
  const stars = Array.from({ length: n }, (_, i) => {
    const x = -40 + rnd(i) * (W + 80), y = 10 + rnd(i + 50) * (H * (kind === 'dusk' ? 0.6 : 0.85)), r = 2 + rnd(i + 9) * 3.2;
    const body = r > 4 ? spark4(0, 0, r * 2.2) : `<circle r="${r}" fill="#fff6c8"/>`;
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${twinkle && i % 3 === 0 ? `<g style="${an({ n: 's7tw', d: 1.6 + rnd(i + 3) * 1.6, t: rnd(i + 7) * 2, c: 99, e: 'ease-in-out' })}">${body}</g>` : body}</g>`;
  }).join('');
  return `${bands.map((c, i) => `<rect x="-80" y="${i * (H / 4)}" width="${W + 160}" height="${H / 4 + 2}" fill="${c}"/>`).join('')}${stars}`;
};

// ═════════════════════ planètes ═════════════════════
// kind : 'saturn' | 'mars' | 'earth' | 'moon' | 'jupiter' | 'venus' | 'neptune' ; (x,y) = centre ; rayon de base 70 × s
export const planet = (kind = 'saturn', x = 0, y = 0, s = 1, o = {}) => {
  const R = 70;
  const sphere = (c, extra = '') => `<circle r="${R}" ${O(c, 5)}/>${extra}<ellipse cx="-26" cy="-36" rx="22" ry="10" fill="#fff" opacity=".4" transform="rotate(-35 -26 -36)"/>`;
  const dots = (pts, c) => pts.map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="2.5"/>`).join('');
  let body;
  if (kind === 'saturn') {
    const rx = R * 1.95, ry = R * 0.46;
    body = `<g transform="rotate(-16)"><path d="M${-rx} 0 A${rx} ${ry} 0 0 1 ${rx} 0" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${-rx} 0 A${rx} ${ry} 0 0 1 ${rx} 0" stroke="#f3d58a" stroke-width="12" fill="none" stroke-linecap="round"/>
      ${sphere('#f6c453', `<path d="M-64 -22 Q0 -8 64 -22 M-68 14 Q0 30 68 14" stroke="#e29e2a" stroke-width="7" fill="none" stroke-linecap="round"/>`)}
      <path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" stroke="#f3d58a" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
  } else if (kind === 'mars') body = sphere('#e8643a', `${dots([[22, 18, 12], [-24, 26, 9], [14, -22, 7], [-32, -6, 6]], '#c44a26')}`);
  else if (kind === 'earth') body = sphere('#3d8fe0', `<path d="M-40 -30 Q-18 -52 6 -34 Q-6 -14 -24 -10 Q-40 -6 -40 -30Z M16 8 Q44 -6 56 18 Q40 50 18 38 Q8 24 16 8Z M-46 24 Q-30 14 -22 34 Q-30 52 -44 44Z" fill="#5fc16a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-12 -52 Q10 -60 34 -46 M-58 4 Q-40 -2 -26 8" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>`);
  else if (kind === 'moon') body = sphere('#efe9d6', dots([[-18, 14, 14], [26, -14, 10], [22, 30, 8], [-34, -22, 6]], '#d6cfb6'));
  else if (kind === 'jupiter') body = sphere('#f0b47a', `<path d="M-66 -26 Q0 -14 66 -26 M-70 6 Q0 20 70 6 M-60 34 Q0 46 60 34" stroke="#d98a4e" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="12" rx="14" ry="8" fill="#e8634a" stroke="${INK}" stroke-width="2.5"/>`);
  else if (kind === 'venus') body = sphere('#f7d77a', `<path d="M-50 -10 Q-10 -30 40 -14 M-44 26 Q0 8 52 24" stroke="#e8b84a" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  else body = sphere('#5aa9e6', `<path d="M-60 -6 Q0 -20 60 -6 M-54 28 Q0 14 54 28" stroke="#3a7fc2" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  const face = o.face ? `<circle cx="-18" cy="-4" r="5" fill="${INK}"/><circle cx="18" cy="-4" r="5" fill="${INK}"/><circle cx="-20" cy="-6.5" r="1.8" fill="#fff"/><circle cx="16" cy="-6.5" r="1.8" fill="#fff"/><path d="M-10 10 Q0 22 10 10" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="-34" cy="8" rx="9" ry="5.5" fill="#ff8fa3" opacity=".7"/><ellipse cx="34" cy="8" rx="9" ry="5.5" fill="#ff8fa3" opacity=".7"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="${o.drift === false ? '' : `animation:s7drift ${5 + (Math.round(x) % 4)}s ease-in-out infinite alternate`}">${body}${face}</g></g>`;
};
export const earth = (x = 0, y = 0, s = 1, o = {}) => planet('earth', x, y, s, o);

// lune du ciel : disque pâle (o.crescent = croissant) · o.glow = temps d'allumage du halo (la lune « s'allume »)
export const moonDisc = (x = 0, y = 0, s = 1, o = {}) => {
  const halo = o.glow !== undefined ? `<g style="opacity:0;${an({ n: 's7fade', d: 1.2, t: o.glow, f: 'forwards' })}"><circle r="104" fill="#fff6b8" opacity=".3"/><circle r="82" fill="#fff6b8" opacity=".45"/></g>` : '';
  const body = o.crescent
    ? `<path d="M10 -66 A66 66 0 1 0 10 66 A100 100 0 0 1 10 -66Z" ${O('#fff3b0', 5)}/><path d="M-30 -30 Q-40 0 -26 30" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`
    : `<circle r="62" ${O('#f6f1d8', 5)}/><circle cx="-18" cy="10" r="13" fill="#e0d9bb"/><circle cx="22" cy="-16" r="9" fill="#e0d9bb"/><circle cx="24" cy="26" r="7" fill="#e0d9bb"/><ellipse cx="-24" cy="-30" rx="18" ry="8" fill="#fff" opacity=".6" transform="rotate(-35 -24 -30)"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${halo}${body}</g>`;
};

// ═════════════════════ terrasse du club et coupole (ép. 1–2) ═════════════════════
// coupole : (0,0) = bas du bâtiment, centre ; o.open = fente ouverte (défaut true)
export const dome = (x = 0, y = 0, s = 1, o = {}) => {
  const open = o.open !== false;
  return g(x, y, s, `<ellipse cy="6" rx="190" ry="12" fill="#000" opacity=".18"/>
    <rect x="-150" y="-120" width="300" height="120" rx="8" ${O('#f6ecd6', 6)}/><path d="M-110 -118 V-4 M-36 -118 V-4 M36 -118 V-4 M110 -118 V-4" stroke="#e3d4b0" stroke-width="5"/>
    <rect x="-30" y="-92" width="60" height="92" rx="8" ${O('#6aa7d9', 5)}/><circle cx="16" cy="-46" r="4.5" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>
    <path d="M-160 -120 A160 160 0 0 1 160 -120Z" ${O('#ffffff', 7)}/>
    <path d="M-120 -120 Q-100 -230 -50 -262 M120 -120 Q100 -230 50 -262 M0 -120 V-280" stroke="#cdd8ea" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${open ? `<path d="M-30 -122 L-24 -272 Q0 -284 24 -272 L30 -122Z" fill="#1d2766" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${spark4(-4, -190, 9)}${spark4(10, -240, 6)}` : ''}
    <path d="M-120 -170 Q-90 -224 -50 -246" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".7"/>
    <circle cy="-292" r="9" ${O('#ffd23f', 4)}/>`);
};

// terrasse en bois face à la campagne, coupole au fond ; o.sky = 'day' | 'dusk' ; o.dome = false pour la retirer
export const terrace = (o = {}) => {
  const { sky: sk = 'day' } = o;
  const post = (x) => `<rect x="${x - 11}" y="${GROUND - 120}" width="22" height="126" rx="8" ${O('#e8c590', 4)}/>`;
  return `<rect x="-80" y="0" width="${W + 160}" height="${H}" fill="#9ad6ff"/>${sky(sk)}${sk === 'day' ? clouds() : ''}${hills(sk === 'day' ? 'day' : 'dusk')}
  ${o.dome === false ? '' : dome(930, GROUND - 40, 0.9)}
  <rect x="-80" y="${GROUND - 70}" width="${W + 160}" height="${H - GROUND + 70}" fill="#d9a05b"/><path d="M-80 ${GROUND - 70} H${W + 80}" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M-80 ${GROUND - 40 + i * 24} H${W + 80}" stroke="#b97f3e" stroke-width="4"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<path d="M${40 + i * 100 + (i % 3) * 20} ${GROUND - 66 + (i % 5) * 28} h40" stroke="#c98a4e" stroke-width="4" stroke-linecap="round"/>`).join('')}
  <rect x="-80" y="${GROUND - 112}" width="${W + 160}" height="16" rx="7" ${O('#f6dcae', 4)}/><rect x="-80" y="${GROUND - 76}" width="${W + 160}" height="12" rx="6" ${O('#f6dcae', 4)}/>${[-30, 190, 410, 630, 850, 1070, 1290].map(post).join('')}
  ${[150, 400, 700, 1050].map((x, i) => `<g transform="translate(${x} 20)"><path d="M0 -20 v50" stroke="${INK}" stroke-width="3"/><g transform="translate(0 56) scale(.4) rotate(${i % 2 ? 10 : -10})">${goldStar(0, 0, 1, { glow: false, flat: true })}</g></g>`).join('')}`;
};

// ═════════════════════ club d'astronomie intérieur (ép. 1, 15) ═════════════════════
export const clubInside = (o = {}) => {
  const { night = false } = o;
  const wall = night ? '#8c9ccc' : '#cfe0f4';
  const wp = Array.from({ length: 30 }, (_, i) => `<path d="M${-40 + (i % 10) * 140 + (Math.floor(i / 10) % 2) * 70} ${60 + Math.floor(i / 10) * 140} l5 11 11 2 -9 8 3 12 -10 -6 -10 6 3 -12 -9 -8 11 -2z" fill="${night ? '#a9b8e6' : '#e6f0fb'}"/>`).join('');
  const poster = (x, y, rot, kind, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-70" y="-92" width="140" height="184" rx="6" fill="#000" opacity=".15" transform="translate(6 7)"/><rect x="-70" y="-92" width="140" height="184" rx="6" ${O(c, 5)}/><rect x="-56" y="-78" width="112" height="112" rx="4" fill="#141a4d"/>${planet(kind, 0, -22, 0.55, { drift: false })}${spark4(-34, -58, 6)}${spark4(36, 8, 5)}<path d="M-50 56 h100 M-50 72 h70" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>`;
  return `<rect x="-80" y="0" width="${W + 160}" height="${H}" fill="${wall}"/>${wp}
  <rect x="-80" y="${GROUND - 30}" width="${W + 160}" height="${H - GROUND + 30}" fill="#c98a4e"/><path d="M-80 ${GROUND - 30} H${W + 80}" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 110 - 30} ${GROUND - 26} L${i * 140 - 120} ${H}" stroke="#a8743f" stroke-width="4"/>`).join('')}
  <rect x="-80" y="${GROUND - 56}" width="${W + 160}" height="26" fill="#7a8fc0" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(640 250)"><circle r="146" ${O('#e8c590', 7)}/><circle r="124" ${O('#10153f', 5)}/>
    <path d="M-124 0 H124 M0 -124 V124" stroke="#e8c590" stroke-width="7"/>${[[-70, -60], [60, -70], [-40, 60], [80, 50], [20, 20], [-90, 20]].map(([a, b], i) => `<g style="${an({ n: 's7tw', d: 2 + i * 0.3, t: i * 0.4, c: 99 })}">${spark4(a, b, 7 + (i % 3) * 2)}</g>`).join('')}
    ${moonDisc(54, -42, 0.5, { crescent: true })}<path d="M-96 -60 Q-70 -100 -30 -108" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".45"/></g>
  ${poster(190, 250, -3, 'saturn', '#fff4dc')}${poster(1090, 250, 3, 'mars', '#ffe6f0')}
  <path d="M-10 70 Q320 140 640 80 Q960 140 1290 70" stroke="${INK}" stroke-width="4" fill="none"/>${[100, 300, 500, 780, 980, 1180].map((x, i) => `<g transform="translate(${x} ${100 + (i % 2) * 18}) rotate(${i % 2 ? 8 : -8}) scale(.34)">${goldStar(0, 0, 1, { flat: true })}</g>`).join('')}
  <rect x="990" y="${GROUND - 140}" width="230" height="16" rx="6" ${O('#a8743f', 5)}/><g transform="translate(1066 ${GROUND - 140})"><circle cy="-34" r="34" ${O('#5aa9e6', 5)}/><path d="M-20 -50 Q0 -64 14 -46 Q0 -34 -20 -50Z M6 -20 Q26 -30 30 -10 Q16 -4 6 -20Z" fill="#5fc16a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 0 v8" stroke="${INK}" stroke-width="6"/></g>
  <rect x="1176" y="${GROUND - 244}" width="12" height="104" fill="#a8743f"/><ellipse cx="500" cy="${GROUND + 60}" rx="320" ry="40" fill="#e8434e" stroke="${INK}" stroke-width="5" opacity=".55"/>`;
};

// ═════════════════════ atelier de cartons (ép. 3–4) ═════════════════════
// carton : (0,0) = centre bas ; o.w/o.h taille ; o.open = rabats ouverts ; o.col teinte
export const box = (x = 0, y = 0, s = 1, o = {}) => {
  const { w = 110, h = 86, col = '#d9a15f' } = o;
  return g(x, y, s, `<ellipse cy="4" rx="${w * 0.62}" ry="9" fill="#000" opacity=".16"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="5" ${O(col, 5)}/>
    <rect x="${-w / 2 + 6}" y="${-h}" width="${w - 12}" height="${h * 0.3}" fill="#c88a45" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="${-14}" y="${-h}" width="28" height="${h * 0.62}" fill="#f3e3b8" stroke="${INK}" stroke-width="3.5"/><path d="M${-w / 2 + 12} ${-h * 0.4} h${w * 0.2}" stroke="#b97f3e" stroke-width="4" stroke-linecap="round"/>
    ${o.open ? `<path d="M${-w / 2} ${-h} L${-w / 2 - 22} ${-h - 30} L${-w / 4} ${-h - 14}Z M${w / 2} ${-h} L${w / 2 + 22} ${-h - 30} L${w / 4} ${-h - 14}Z" ${O('#c88a45', 4)}/>` : ''}
    <ellipse cx="${-w * 0.26}" cy="${-h * 0.8}" rx="${w * 0.14}" ry="5" fill="#fff" opacity=".4" transform="rotate(-10)"/>`);
};
export const boxes = (x = 0, y = 0, s = 1, n = 6) => g(x, y, s, [[0, 0, 130, 100], [-76, 0, 100, 80], [80, 0, 96, 78], [-30, -100, 110, 84], [48, -78, 90, 70], [-4, -184, 80, 62]].slice(0, n).map(([bx, by, w, h], i) => box(bx, by, 1, { w, h, col: i % 2 ? '#d9a15f' : '#e3b06a' })).join(''));

export const cardboardShop = (o = {}) => {
  return `<rect x="-80" y="0" width="${W + 160}" height="${H}" fill="#e0b684"/>
  ${Array.from({ length: 18 }, (_, i) => `<path d="M${-60 + i * 80} 0 V${GROUND}" stroke="#c99a64" stroke-width="5"/>`).join('')}
  <rect x="-80" y="0" width="${W + 160}" height="60" fill="#a8743f" stroke="${INK}" stroke-width="5"/>
  <g>${`<rect x="${790 - 190}" y="120" width="380" height="${GROUND - 120}" fill="#9ad6ff"/><path d="M600 ${GROUND - 70} Q730 ${GROUND - 170} 830 ${GROUND - 90} Q910 ${GROUND - 150} 980 ${GROUND - 80} V${GROUND} H600Z" fill="#7fcf6a"/><ellipse cx="880" cy="190" rx="70" ry="24" fill="#fff"/>`}<rect x="600" y="120" width="380" height="${GROUND - 120}" fill="none" stroke="${INK}" stroke-width="10"/><rect x="590" y="112" width="400" height="${GROUND - 112}" fill="none" stroke="#a8743f" stroke-width="14"/></g>
  <rect x="-80" y="${GROUND - 20}" width="${W + 160}" height="${H - GROUND + 20}" fill="#b98350"/><path d="M-80 ${GROUND - 20} H${W + 80}" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 150 - 40} ${GROUND - 14} L${i * 190 - 200} ${H}" stroke="#9c6a3c" stroke-width="4"/>`).join('')}
  <g transform="translate(150 150)"><path d="M0 0 L-20 60 M0 0 L20 60" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle r="30" ${O('#f6f1d8', 5)}/><path d="M0 -20 V0 L12 8" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/></g>
  <g transform="translate(330 120)"><path d="M0 -40 V20" stroke="${INK}" stroke-width="3"/><path d="M-16 20 L-4 90 L4 90 L16 20Z" ${O('#cfd5e2', 4)}/><path d="M-40 20 L0 30 L40 20" stroke="${INK}" stroke-width="3" fill="none"/></g>
  <rect x="1040" y="${GROUND - 112}" width="260" height="14" rx="5" ${O('#a8743f', 5)}/><path d="M1060 ${GROUND - 98} V${GROUND} M1280 ${GROUND - 98} V${GROUND}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M1060 ${GROUND - 98} V${GROUND} M1280 ${GROUND - 98} V${GROUND}" stroke="#a8743f" stroke-width="5" stroke-linecap="round"/>
  ${boxes(70, GROUND + 6, 1, 6)}${box(1200, GROUND - 112, 0.6, { w: 90, h: 70 })}`;
};

// ═════════════════════ la fusée en carton ═════════════════════
// (0,0) = centre bas ; hauteur ≈ 470, largeur ≈ 230 ; o.raw = carton brut (avant peinture) · o.star (défaut true) = étoile dorée collée sur le nez
// o.flame = flamme animée · o.windows = nb de hublots 1–3 (défaut 2) · o.smile = petit sourire sur le nez · o.noShadow
export const rocket = (x = 0, y = 0, s = 1, o = {}) => {
  const { raw = false, star = true, flame = false, windows = 2 } = o;
  const body = raw ? '#d9a15f' : '#e8434e', bodyD = raw ? '#c88a45' : '#c43040', fin = raw ? '#c88a45' : '#3b82f6', band = '#fff4dc';
  const fl = flame ? `<g style="transform-origin:0px 0px;animation:s7flame .25s ease-in-out infinite alternate"><path d="M-50 4 Q-60 70 0 100 Q60 70 50 4Z" ${O('#ff8a2b', 5)}/><path d="M-26 4 Q-30 44 0 64 Q30 44 26 4Z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>` : '';
  const hub = (cy, r) => `<circle cy="${cy}" r="${r + 10}" ${O('#cfd5e2', 6)}/><circle cy="${cy}" r="${r}" ${O('#9bd7ff', 5)}/><path d="M${-r * 0.55} ${cy - r * 0.15} Q${-r * 0.4} ${cy - r * 0.6} ${r * 0.05} ${cy - r * 0.66}" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>`;
  return g(x, y, s, `${o.noShadow ? '' : `<ellipse cy="6" rx="150" ry="14" fill="#000" opacity=".2"/>`}${fl}
    <path d="M-92 -120 L-176 -30 Q-182 4 -150 4 H-80Z" ${O(fin, 6)}/><path d="M92 -120 L176 -30 Q182 4 150 4 H80Z" ${O(fin, 6)}/>
    <path d="M-104 0 V-270 Q-104 -380 0 -468 Q104 -380 104 -270 V0Z" ${O(body, 7)}/>
    <path d="M-104 -250 Q-104 -380 0 -468 L-30 -468 Q-84 -380 -78 -250Z" fill="#fff" opacity=".18"/>
    <path d="M-104 -66 H104 V-30 H-104Z" fill="${band}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-100 -330 H100" stroke="${INK}" stroke-width="5" opacity=".25"/>
    <path d="M-104 -120 H104" stroke="${bodyD}" stroke-width="5" opacity=".7"/>
    ${raw ? `<path d="M-70 -200 l60 -40 M30 -90 l60 -34 M-82 -300 h40" stroke="#f3e3b8" stroke-width="16" stroke-linecap="round" opacity=".9"/><path d="M-70 -200 l60 -40 M30 -90 l60 -34" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".3"/>` : ''}
    ${hub(-250, 40)}${windows >= 2 ? hub(-160, 28) : ''}${windows >= 3 ? `<circle cx="-62" cy="-210" r="14" ${O('#9bd7ff', 4)}/>` : ''}
    <path d="M-60 -2 v-24 M-30 -2 v-24 M30 -2 v-24 M60 -2 v-24" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".35"/>
    ${o.smile ? `<path d="M-20 -340 Q0 -322 20 -340" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>` : ''}
    ${star ? goldStar(0, -430, 0.42, { glint: true }) : ''}`);
};

// ═════════════════════ cabine de la fusée (ép. 7–10, 14) ═════════════════════
// o.view : 'dark' | 'paper' (étoiles de papier agitées) | 'stars' | 'planets' | 'earth' | 'moon'
export const cabin = (o = {}) => {
  const { view = 'dark' } = o;
  const n = uid++;
  const holes = [[640, 232, 130], [250, 250, 68], [1030, 250, 68]];
  const inView = {
    dark: '',
    stars: '',
    paper: [[470, 130, 0], [760, 190, 1], [610, 290, 2], [900, 120, 3], [300, 210, 4], [1000, 280, 5]].map(([a, b, i]) => `<g transform="translate(${a} ${b})"><g style="transform-origin:0px -40px;${an({ n: 's7sway', d: 0.7 + i * 0.1, c: 99, dir: 'alternate', e: 'ease-in-out' })}"><path d="M0 -40 V-12" stroke="${INK}" stroke-width="3"/>${goldStar(0, 12, 0.5, { flat: true })}</g></g>`).join(''),
    planets: `${planet('saturn', 700, 210, 1.0)}${planet('mars', 262, 262, 0.5)}`,
    earth: planet('earth', 640, 250, 1.6),
    moon: `<rect x="-80" y="300" width="${W + 160}" height="140" fill="#cfd3de"/><path d="M-80 300 Q300 270 640 300 Q980 270 1360 300" stroke="${INK}" stroke-width="4" fill="none"/>${planet('earth', 900, 180, 0.7)}`,
  }[view] || '';
  const panelBtn = (x, y, c) => `<circle cx="${x}" cy="${y}" r="13" ${O(c, 4)}/><circle cx="${x - 4}" cy="${y - 4}" r="3.5" fill="#fff" opacity=".7"/>`;
  return `<rect x="-80" y="0" width="${W + 160}" height="${H}" fill="#d9a468"/>
  ${Array.from({ length: 22 }, (_, i) => `<path d="M${-60 + i * 66} 0 V${H}" stroke="#c98d4e" stroke-width="5" opacity=".7"/>`).join('')}
  <rect x="-80" y="0" width="${W + 160}" height="46" fill="#c88a45" stroke="${INK}" stroke-width="5"/>
  <clipPath id="s7cab${n}">${holes.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join('')}</clipPath>
  <g clip-path="url(#s7cab${n})">${starSky({ kind: 'deep', n: 70 })}${inView}</g>
  ${holes.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="#cfd5e2" stroke-width="22"/><circle cx="${cx}" cy="${cy}" r="${r + 25}" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="none" stroke="${INK}" stroke-width="5"/>${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${cx + Math.cos((a * Math.PI) / 180) * (r + 14)}" cy="${cy + Math.sin((a * Math.PI) / 180) * (r + 14)}" r="4" fill="#8f98ad" stroke="${INK}" stroke-width="2"/>`).join('')}<path d="M${cx - r * 0.7} ${cy - r * 0.4} Q${cx - r * 0.5} ${cy - r * 0.8} ${cx - r * 0.1} ${cy - r * 0.85}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/>`).join('')}
  <rect x="-80" y="${GROUND + 10}" width="${W + 160}" height="${H - GROUND - 10}" fill="#b98350"/><path d="M-80 ${GROUND + 10} H${W + 80}" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 110 - 30} ${GROUND + 14} L${i * 140 - 120} ${H}" stroke="#9c6a3c" stroke-width="4"/>`).join('')}
  <g transform="translate(640 ${GROUND + 6})"><path d="M-250 0 V-70 Q-250 -100 -216 -100 H216 Q250 -100 250 -70 V0Z" ${O('#8f98ad', 6)}/><rect x="-232" y="-90" width="464" height="40" rx="12" fill="#cfd5e2" stroke="${INK}" stroke-width="4"/>
    ${[[-190, '#e8434e'], [-150, '#ffd23f'], [-110, '#4ade80'], [110, '#3b82f6'], [150, '#ffd23f'], [190, '#e8434e']].map(([x, c], i) => panelBtn(x, -70, c)).join('')}
    <rect x="-70" y="-84" width="140" height="28" rx="8" fill="#10153f" stroke="${INK}" stroke-width="4"/><path d="M-56 -70 q14 -14 28 0 t28 0 t28 0 t28 0" stroke="#7cf0b8" stroke-width="4" fill="none" stroke-linecap="round"/></g>
  <path d="M-80 ${GROUND - 4} V${GROUND - 4}" stroke="${INK}"/>`;
};

// ═════════════════════ surface lunaire ═════════════════════
// cratère : (0,0) = centre du fond ; part : 'all' | 'back' (trou + bord arrière) | 'front' (bord avant, à dessiner APRÈS le personnage qui en sort)
export const crater = (x = 0, y = 0, s = 1, o = {}) => {
  const { part = 'all', rx = 130, ry = 34 } = o;
  const back = `<ellipse rx="${rx}" ry="${ry}" ${O('#aab0c4', 6)}/><ellipse cy="${ry * 0.16}" rx="${rx * 0.86}" ry="${ry * 0.78}" fill="#8e95ad"/><path d="M${-rx * 0.7} ${-ry * 0.5} Q0 ${-ry * 0.95} ${rx * 0.7} ${-ry * 0.5}" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>`;
  const front = `<path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${-rx + 4} 2 A${rx - 4} ${ry - 3} 0 0 0 ${rx - 4} 2 L${rx - 4} 12 A${rx - 4} ${ry + 8} 0 0 1 ${-rx + 4} 12Z" fill="#dfe2ec" stroke="none"/><path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return g(x, y, s, part === 'back' ? back : part === 'front' ? front : `${back}${front}`);
};
// sol lunaire : ciel noir-bleu étoilé, Terre bleue (o.earth, défaut true), collines grises, cratères, cailloux
export const moonSurface = (o = {}) => {
  const { earth: showEarth = true } = o;
  const rocks = [[120, 640, 1], [330, 690, 0.7], [1180, 650, 0.9], [900, 700, 0.6]].map(([x, y, s]) => g(x, y, s, `<path d="M-34 0 Q-38 -30 -10 -38 Q22 -42 34 -14 Q40 0 30 4Z" ${O('#b4b9cb', 4)}/><ellipse cx="-8" cy="-26" rx="12" ry="5" fill="#fff" opacity=".4"/>`)).join('');
  return `${starSky({ kind: 'deep', n: 60 })}${showEarth ? earth(1010, 170, 1.15) : ''}
  <path d="M-80 ${GROUND - 70} Q120 ${GROUND - 170} 330 ${GROUND - 90} Q520 ${GROUND - 40} 700 ${GROUND - 120} Q900 ${GROUND - 190} 1100 ${GROUND - 90} Q1250 ${GROUND - 60} 1360 ${GROUND - 120} V${GROUND} H-80Z" ${O('#8f94ab', 5)}/>
  <rect x="-80" y="${GROUND - 40}" width="${W + 160}" height="${H - GROUND + 40}" fill="#cfd3de"/><path d="M-80 ${GROUND - 40} Q300 ${GROUND - 70} 640 ${GROUND - 40} T1360 ${GROUND - 40}" stroke="${INK}" stroke-width="5" fill="#cfd3de"/>
  <rect x="-80" y="${GROUND + 60}" width="${W + 160}" height="${H - GROUND - 60}" fill="#dde0ea"/><path d="M-80 ${GROUND + 60} Q320 ${GROUND + 30} 700 ${GROUND + 62} T1360 ${GROUND + 50}" stroke="#aab0c4" stroke-width="6" fill="none"/>
  ${crater(260, GROUND - 6, 0.7)}${crater(1010, GROUND - 14, 0.55)}${crater(640, GROUND + 100, 0.5, { rx: 120, ry: 26 })}${crater(130, GROUND + 90, 0.4)}
  ${rocks}`;
};

// ═════════════════════ retour à la maison, le soir (ép. 14–15) ═════════════════════
// cottage de Mme Escargot : (0,0) = centre bas ; fenêtre centrée en (-58,-122), rebord à y=-92 (poser l étoile dorée dessus) ; o.light = fenêtre allumée
export const snailCottage = (x = 0, y = 0, s = 1, o = {}) => g(x, y, s, `<ellipse cy="6" rx="130" ry="12" fill="#000" opacity=".22"/>
  <path d="M-110 0 Q-120 -140 0 -150 Q120 -140 110 0Z" ${O('#e8b27a', 6)}/><circle cx="62" cy="-176" r="62" ${O('#c77a4a', 6)}/><circle cx="62" cy="-176" r="40" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="62" cy="-176" r="20" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="38" cy="-206" rx="18" ry="8" fill="#fff" opacity=".4" transform="rotate(-30 38 -206)"/>
  <rect x="-96" y="-150" width="76" height="56" rx="12" ${O(o.light ? '#ffe27a' : '#2a2f66', 5)}/><path d="M-58 -150 V-94 M-96 -122 H-20" stroke="${INK}" stroke-width="4"/>
  <rect x="-106" y="-98" width="96" height="12" rx="5" ${O('#f6dcae', 5)}/>${o.light ? `<ellipse cx="-58" cy="-122" rx="60" ry="46" fill="#ffe27a" opacity=".25"/>` : ''}
  <path d="M30 0 V-60 Q30 -84 52 -84 Q74 -84 74 -60 V0Z" ${O('#6aa7d9', 5)}/><circle cx="64" cy="-34" r="4" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>`);

// maison, jardin, fusée garée, lune ; o.sky = 'dusk' (défaut) | 'night' ; o.rocket = false pour retirer la fusée ; o.light = fenêtres allumées
export const homeEvening = (o = {}) => {
  const { sky: sk = 'dusk', light = true } = o;
  const house = (x) => g(x, GROUND + 6, 1, `<ellipse cy="6" rx="190" ry="14" fill="#000" opacity=".25"/>
    <rect x="-150" y="-210" width="300" height="210" rx="10" ${O('#f0d2a0', 6)}/><path d="M-176 -208 L0 -330 L176 -208Z" ${O('#c0504d', 7)}/><rect x="86" y="-300" width="36" height="70" ${O('#a8743f', 5)}/>
    <rect x="-134" y="-170" width="84" height="84" rx="12" ${O(light ? '#ffe27a' : '#2a2f66', 5)}/><path d="M-92 -170 V-86 M-134 -128 H-50" stroke="${INK}" stroke-width="4"/>${light ? `<ellipse cx="-92" cy="-128" rx="80" ry="62" fill="#ffe27a" opacity=".22"/>` : ''}
    <rect x="50" y="-170" width="84" height="84" rx="12" ${O(light ? '#ffe27a' : '#2a2f66', 5)}/><path d="M92 -170 V-86 M50 -128 H134" stroke="${INK}" stroke-width="4"/>
    <rect x="-26" y="-110" width="52" height="110" rx="14" ${O('#6aa7d9', 5)}/><circle cx="12" cy="-52" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>`);
  return `${starSky({ kind: sk === 'night' ? 'night' : 'dusk', n: 40 })}${moonDisc(1040, 150, 1.05, { crescent: true })}
  <path d="M-80 ${GROUND - 40} Q200 ${GROUND - 170} 460 ${GROUND - 70} Q720 ${GROUND - 10} 960 ${GROUND - 120} Q1200 ${GROUND - 180} 1360 ${GROUND - 70} V${GROUND} H-80Z" ${O('#4a3a6e', 5)}/>
  <rect x="-80" y="${GROUND - 20}" width="${W + 160}" height="${H - GROUND + 20}" fill="#5a9468"/><path d="M-80 ${GROUND - 20} H${W + 80}" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 14 }, (_, i) => `<path d="M${30 + i * 96} ${GROUND + 50 + (i % 4) * 30} q-4 -14 -10 -18 M${30 + i * 96} ${GROUND + 50 + (i % 4) * 30} q4 -14 10 -18" stroke="#3f7a52" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
  <path d="M250 ${GROUND + 6} Q330 ${GROUND + 90} 420 ${H}" stroke="#e8c590" stroke-width="70" fill="none" stroke-linecap="round" opacity=".7"/>
  ${snailCottage(1130, GROUND + 4, 0.8, { light })}${house(300)}
  ${o.rocket === false ? '' : rocket(760, GROUND + 14, 0.62, { star: true })}`;
};

// chambre de Roussin et Lino, la nuit : fenêtre sur la lune ; o.moonGlow = temps où la lune s'allume ; o.lamp = lampe de chevet allumée
export const bedroom = (o = {}) => {
  const { lamp = true } = o;
  const bed = (x, c) => g(x, GROUND + 70, 1, `<ellipse cy="14" rx="200" ry="14" fill="#000" opacity=".2"/><rect x="-190" y="-90" width="380" height="80" rx="20" ${O('#a8743f', 6)}/><rect x="-176" y="-130" width="352" height="82" rx="24" ${O('#ffffff', 5)}/><rect x="-176" y="-86" width="352" height="64" rx="18" ${O(c, 5)}/><path d="M-120 -86 v64 M-40 -86 v64 M40 -86 v64" stroke="#fff" stroke-width="5" opacity=".3" stroke-linecap="round"/><ellipse cx="-110" cy="-124" rx="64" ry="22" ${O('#f3f6fb', 4)}/>`);
  return `<rect x="-80" y="0" width="${W + 160}" height="${H}" fill="#6a5a9a"/>
  ${Array.from({ length: 12 }, (_, i) => `<path d="M${-40 + i * 120} 0 V${GROUND - 30}" stroke="#5d4e8a" stroke-width="8"/>`).join('')}
  <rect x="-80" y="${GROUND - 30}" width="${W + 160}" height="${H - GROUND + 30}" fill="#a8743f"/><path d="M-80 ${GROUND - 30} H${W + 80}" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(640 240)"><path d="M-130 170 V-20 Q-130 -150 0 -150 Q130 -150 130 -20 V170Z" ${O('#fff4dc', 8)}/><path d="M-110 160 V-20 Q-110 -128 0 -128 Q110 -128 110 -20 V160Z" ${O('#141a4d', 5)}/><path d="M0 -128 V160 M-110 10 H110" stroke="#fff4dc" stroke-width="7"/>
    ${[[-60, -40], [70, -70], [-70, 80], [60, 90], [30, 30]].map(([a, b], i) => `<g style="${an({ n: 's7tw', d: 2 + i * 0.4, t: i * 0.3, c: 99 })}">${spark4(a, b, 8)}</g>`).join('')}
    ${moonDisc(40, -30, 0.55, { crescent: true, glow: o.moonGlow })}</g>
  ${bed(250, '#ff9fb0')}${bed(1030, '#7cc8ff')}
  <g transform="translate(640 ${GROUND + 6})"><rect x="-70" y="-92" width="140" height="92" rx="8" ${O('#c98a4e', 5)}/><path d="M-70 -46 H70" stroke="${INK}" stroke-width="4"/><circle cy="-70" r="4" fill="${INK}"/><circle cy="-24" r="4" fill="${INK}"/>
    <path d="M-20 -92 V-118 M20 -92 V-118" stroke="${INK}" stroke-width="5"/><path d="M-44 -118 H44 L30 -170 H-30Z" ${O(lamp ? '#ffe27a' : '#cdbf90', 5)}/>${lamp ? `<ellipse cy="-140" rx="100" ry="70" fill="#ffe27a" opacity=".2"/>` : ''}</g>`;
};

// ═════════════════════ accessoires ═════════════════════
// télescope sur trépied : (0,0) = centre bas du trépied ; la lunette pivote autour de (0,-170), pointe vers la droite et le haut
// o.aim = angle de repos en degrés (défaut -32 ; négatif = vers le haut) · o.swing = [[t0,t1,aimFrom,aimTo]] pivotement lent
// o.tip = svg collé au bout de la lunette (ex. croissant), dessiné dans le repère du bout (la lunette mesure ≈ 250)
export const telescope = (x = 0, y = 0, s = 1, o = {}) => {
  const { aim = -32, swing = [], tip = '' } = o;
  let tube = `<g transform="rotate(${aim} 0 -170)">${swing.length ? '' : ''}${telescopeTube(tip)}</g>`;
  swing.forEach(([t0, t1, a, b], i) => { tube = tf(`<g>${telescopeTube(tip)}</g>`, { t0, d: t1 - t0, from: `rotate(${a}deg)`, to: `rotate(${b}deg)`, e: 'ease-in-out', o: '0px -170px' }); });
  return g(x, y, s, `<ellipse cy="5" rx="110" ry="11" fill="#000" opacity=".2"/>
    <path d="M0 -164 L-86 0 M0 -164 L86 0 M0 -164 L2 0" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M0 -164 L-86 0 M0 -164 L86 0 M0 -164 L2 0" stroke="#c98a4e" stroke-width="8" stroke-linecap="round"/>
    <path d="M-54 -62 H54" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    ${tube}
    <circle cy="-170" r="17" ${O('#cfd5e2', 5)}/><circle cx="-4" cy="-174" r="5" fill="#fff" opacity=".6"/>`);
};
const telescopeTube = (tip) => `<rect x="-70" y="-186" width="56" height="32" rx="12" ${O('#9a6a3a', 5)}/><rect x="-14" y="-190" width="236" height="40" rx="14" ${O('#3b6fd8', 6)}/><rect x="40" y="-196" width="16" height="52" rx="6" ${O('#e8c14d', 4)}/><rect x="170" y="-196" width="16" height="52" rx="6" ${O('#e8c14d', 4)}/><rect x="210" y="-198" width="44" height="56" rx="12" ${O('#2e58b8', 6)}/><ellipse cx="254" cy="-170" rx="8" ry="24" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/>
  <path d="M0 -184 H150" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".45"/><path d="M-40 -150 v-22" stroke="${INK}" stroke-width="3" opacity="0"/>${tip ? `<g transform="translate(262 -170)">${tip}</g>` : ''}`;

// casque en bol : (0,0) = centre bas du bol (le bord repose sur le haut de la tête) ; largeur ≈ 130, hauteur ≈ 86 + antenne ; à passer dans hat=[[a,b,svg]]
export const bowlHelmet = (x = 0, y = 0, s = 1, o = {}) => g(x, y, s, `<path d="M-64 0 Q-70 -80 0 -84 Q70 -80 64 0Z" ${O(o.col || '#e3e8f2', 5)}/><path d="M-60 -6 H60" stroke="${INK}" stroke-width="5" opacity=".5"/>
  <rect x="-48" y="-54" width="96" height="30" rx="14" fill="#6bb6ff" stroke="${INK}" stroke-width="4.5"/><path d="M-36 -46 Q-16 -52 4 -48" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M0 -84 V-112" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cy="-118" r="9" ${O('#ff5c7a', 4)}/>
  <path d="M-62 -8 Q-70 -50 -40 -76" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M-56 4 Q0 22 56 4" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>`);

// étoile dorée de Mme Escargot (en papier doré) : (0,0) = centre ; rayon ≈ 60 × s
// o.glow = halo qui pulse · o.glint = petit éclat qui scintille · o.flat = sans reflet ni éclat (décoration)
export const goldStar = (x = 0, y = 0, s = 1, o = {}) => {
  const pts = Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? 26 : 62; return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' L');
  return g(x, y, s, `${o.glow ? `<g style="animation:s7pulse 1.4s ease-in-out infinite"><circle r="110" fill="#fff3a6" opacity=".5"/><circle r="84" fill="#fff3a6" opacity=".6"/></g>` : ''}
    <path d="M${pts}Z" ${O('#ffd23f', 7)}/><path d="M0 -62 L0 -26 M60 -19 L25 -8 M37 50 L15 21 M-37 50 L-15 21 M-60 -19 L-25 -8" stroke="#f0a800" stroke-width="4" stroke-linecap="round"/>
    ${o.flat ? '' : `<path d="M-14 -34 L-4 -52" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/><circle cx="-26" cy="-8" r="5" fill="#fff" opacity=".7"/>`}
    ${o.glint ? `<g style="transform-origin:34px -34px;${an({ n: 's7glint', d: 2.4, c: 99 })}">${spark4(34, -34, 22, '#fff')}</g>` : ''}`);
};

// ceinture en ficelle : (0,0) = centre du nœud (à poser sur le ventre) ; largeur ≈ 130 ; deux bouts qui pendent
export const stringBelt = (x = 0, y = 0, s = 1) => g(x, y, s, `<path d="M-62 -10 Q0 18 62 -10" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-62 -10 Q0 18 62 -10" stroke="#e8c590" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-62 -10 Q0 18 62 -10" stroke="#b98350" stroke-width="2.5" stroke-dasharray="5 7" fill="none" stroke-linecap="round"/>
  <path d="M0 8 Q-14 40 -26 52 M0 8 Q16 36 24 58" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 8 Q-14 40 -26 52 M0 8 Q16 36 24 58" stroke="#e8c590" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cy="6" r="11" ${O('#e8c590', 4)}/><path d="M-6 2 q6 8 12 0" stroke="#b98350" stroke-width="3" fill="none" stroke-linecap="round"/>`);

// volant en assiette (ép. 14) : (0,0) = centre ; rayon ≈ 60
export const plateWheel = (x = 0, y = 0, s = 1) => g(x, y, s, `<circle r="62" ${O('#ffffff', 6)}/><circle r="40" fill="#e8f1fb" stroke="${INK}" stroke-width="4"/><circle r="12" ${O('#ffd23f', 4)}/><path d="M-30 -22 Q-16 -40 6 -42" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/><path d="M-62 0 H-80 M62 0 H80" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`);
