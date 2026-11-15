// Saison 9 « Le grand concours » : décors des Olympiades (cour, piste, gymnase, lancer, dégustation, atelier, salle d'art, podium, cour au soir…)
// et accessoires (médailles, boîte, chronomètre, balles en chaussettes, ruban d'arrivée, podium à marches, dossard…).
// Convention : fonctions qui renvoient une chaîne SVG. Objets autour de (0,0) = point au sol (centre bas), à poser avec (x, y, s) ; fonds = 1280x720
// dessinés de X0 à X1 (monde plus large que l'écran : -340 → 1620) pour les travellings et les zooms. Sol des personnages : GROUND = 560.
// Les animaux regardent à droite. Préfixe de keyframes : o9…
import { W, H, INK, an, ao, anims, vis, tf, cloud, addKF } from './kit.mjs';
import { bulbs, garland } from './theatre.mjs';

export const GROUND = 560;
export const X0 = -340, X1 = W + 340, XW = X1 - X0;

addKF(`@keyframes o9sway{from{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}
@keyframes o9tick{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes o9pop{0%{opacity:0;transform:translate(0,0) scale(.4)}20%{opacity:1}100%{opacity:1;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(1)}}
@keyframes o9cutL{0%{transform:none}100%{transform:translate(-8px,46px) rotate(-34deg)}}
@keyframes o9cutR{0%{transform:none}100%{transform:translate(8px,46px) rotate(34deg)}}
@keyframes o9cloud{from{transform:translateX(-50px)}to{transform:translateX(60px)}}
@keyframes o9glint{0%,100%{opacity:.2}50%{opacity:.9}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const FONT = 'Fredoka, Chalkboard SE, sans-serif';
const g = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const bands = (cols, h = GROUND) => cols.map((c, i) => `<rect x="${X0}" y="${(i * h) / cols.length}" width="${XW}" height="${h / cols.length + 2}" fill="${c}"/>`).join('');
const slab = (y, h, c, line) => `<rect x="${X0}" y="${y}" width="${XW}" height="${h}" fill="${c}"/>${line ? `<path d="M${X0} ${y} H${X1}" stroke="${INK}" stroke-width="${line}"/>` : ''}`;
const DAY = ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#d9f2ff'];
const clouds = (dark = false) => `<g style="animation:o9cloud 16s ease-in-out infinite alternate">${cloud(120, 110, 0.8, dark ? 0.6 : 1)}${cloud(560, 80, 0.55, 0.95)}${cloud(980, 140, 0.75, dark ? 0.6 : 1)}${cloud(1450, 100, 0.7, 1)}</g>`;
const sunFace = (x, y, s = 1) => g(x, y, s, `<g style="transform-origin:0px 0px;animation:o9tick 26s linear infinite">${Array.from({ length: 10 }, (_, i) => `<path d="M0 -66 L9 -48 L-9 -48Z" fill="#ffd23f" transform="rotate(${i * 36})"/>`).join('')}</g><circle r="40" ${O('#ffd23f', 5)}/><circle cx="-14" cy="-14" r="10" fill="#fff" opacity=".5"/><path d="M-13 8 q13 13 26 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-13" cy="-4" r="4" fill="${INK}"/><circle cx="13" cy="-4" r="4" fill="${INK}"/><ellipse cx="-24" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/><ellipse cx="24" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/>`);
const hillsFar = (c1 = '#a5e08a', c2 = '#7fcf6a') => `<path d="M${X0} ${GROUND - 70} Q-100 ${GROUND - 220} 170 ${GROUND - 110} Q440 ${GROUND - 10} 720 ${GROUND - 160} Q980 ${GROUND - 260} 1240 ${GROUND - 110} Q1450 ${GROUND - 30} ${X1} ${GROUND - 120} V${GROUND} H${X0}Z" ${O(c1, 4)}/>
  <path d="M${X0} ${GROUND - 30} Q60 ${GROUND - 110} 400 ${GROUND - 40} Q760 ${GROUND - 120} 1000 ${GROUND - 40} Q1300 ${GROUND - 110} ${X1} ${GROUND - 40} V${GROUND} H${X0}Z" ${O(c2, 4)}/>`;
const tuft = (x, y, c) => `<path d="M${x} ${y} q-4 -14 -10 -18 M${x} ${y} q0 -16 0 -22 M${x} ${y} q4 -14 10 -18" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const grass = (c1 = '#8fd16e', c2 = '#7fc35e', y = GROUND) => `${slab(y, H - y + 4, c1)}<rect x="${X0}" y="${y}" width="${XW}" height="12" fill="${c2}"/>${Array.from({ length: 26 }, (_, i) => tuft(X0 + 30 + i * 78 + rnd(i) * 30, y + 40 + (i % 4) * 36, c2)).join('')}`;

// mur + sol d'une salle : o = { wall, wall2 (bas de mur), floor, floorLine, base }
const room = ({ wall = '#f3dfb8', wall2 = '#b98350', floor = '#d6a566', floorLine = '#bf8a4e', base = '#8a5a33', rail = 190 } = {}) => `${slab(0, GROUND, wall)}
  <rect x="${X0}" y="${GROUND - rail}" width="${XW}" height="${rail}" fill="${wall2}"/><path d="M${X0} ${GROUND - rail} H${X1}" stroke="${INK}" stroke-width="6"/>
  ${Array.from({ length: 24 }, (_, i) => `<path d="M${X0 + i * 84 + 30} ${GROUND - rail + 4} V${GROUND - 8}" stroke="${floorLine}" stroke-width="5" opacity=".7"/>`).join('')}
  <rect x="${X0}" y="${GROUND - 14}" width="${XW}" height="16" fill="${base}" stroke="${INK}" stroke-width="5"/>
  ${slab(GROUND, H - GROUND, floor)}${Array.from({ length: 22 }, (_, i) => `<path d="M${X0 + i * 96 + 20} ${GROUND} L${X0 + i * 130 - 200} ${H}" stroke="${floorLine}" stroke-width="5"/>`).join('')}
  <path d="M${X0} ${GROUND} H${X1}" stroke="${INK}" stroke-width="5"/><path d="M${X0} ${GROUND + 80} H${X1} M${X0} ${GROUND + 130} H${X1}" stroke="${floorLine}" stroke-width="4" opacity=".6"/>`;
const win = (x, y, w = 130, h = 170, night = false) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2 - 8}" y="-8" width="${w + 16}" height="${h + 16}" rx="10" ${O('#fff4dc', 6)}/><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${night ? '#1d2766' : '#bfe6ff'}" stroke="${INK}" stroke-width="4"/><path d="M0 0 V${h} M${-w / 2} ${h / 2} H${w / 2}" stroke="#fff4dc" stroke-width="6"/>${night ? '' : `<path d="M${-w / 2 + 14} ${h * 0.3} Q${-w / 2 + 24} ${h * 0.12} ${-w / 2 + 40} ${h * 0.08}" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".75"/>`}</g>`;

// ═════════════════════ objets ═════════════════════

// banderole : (0,0) = centre ; o.word (défaut OLYMPIADES), o.w largeur, o.col. Deux piquets aux extrémités (o.poles = hauteur, défaut aucune)
export const banner = (x = 0, y = 0, s = 1, o = {}) => {
  const word = o.word || 'OLYMPIADES', w = o.w || Math.max(360, word.length * 44 + 80), col = o.col || '#ff8fb1', fs = Math.min(64, Math.floor((w - 70) / (word.length * 0.62)));
  return g(x, y, s, `<g style="transform-origin:0px -50px;animation:o9sway 3.2s ease-in-out infinite alternate">${o.poles ? [-1, 1].map((k) => `<path d="M${k * (w / 2 + 6)} -50 V${o.poles}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${k * (w / 2 + 6)} -50 V${o.poles}" stroke="#c98a4e" stroke-width="7" stroke-linecap="round"/>`).join('') : ''}
    <path d="M${-w / 2} -50 Q0 -30 ${w / 2} -50 V30 Q0 50 ${-w / 2} 30Z" ${O(col, 6)}/><path d="M${-w / 2 + 12} -42 Q0 -24 ${w / 2 - 12} -42" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".55"/>
    ${[-1, 1].map((k) => `<circle cx="${k * (w / 2 - 6)}" cy="-44" r="7" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/>`).join('')}
    <text x="0" y="${12 + fs * 0.15}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke" stroke-linejoin="round">${word}</text></g>`);
};

// tribune en carton : (0,0) = centre bas ; largeur ≈ 360 · o.rows (3) · o.flags = fanions au sommet (true)
export const cardBleachers = (x = 0, y = 0, s = 1, o = {}) => {
  const rows = o.rows || 3, w = 360;
  const row = (i) => { const yy = -i * 58; return `<rect x="${-w / 2 + i * 6}" y="${yy - 58}" width="${w - i * 12}" height="58" ${O(i % 2 ? '#d9a05b' : '#e3b06c', 5)}/>
    ${Array.from({ length: 14 }, (_, k) => `<path d="M${-w / 2 + i * 6 + 14 + k * ((w - i * 12 - 28) / 13)} ${yy - 52} V${yy - 8}" stroke="#c98a4e" stroke-width="5" opacity=".6"/>`).join('')}
    <rect x="${-w / 2 + i * 6}" y="${yy - 62}" width="${w - i * 12}" height="12" rx="5" ${O('#f4ca8e', 4)}/>
    ${i === 0 ? `<path d="M-60 0 V-34 Q-60 -48 -44 -48 H44 Q60 -48 60 -34 V0Z" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>` : ''}
    ${Array.from({ length: 5 }, (_, k) => `<circle cx="${-w / 2 + 44 + i * 6 + k * ((w - 88 - i * 12) / 4)}" cy="${yy - 30 + (i === 0 ? -6 : 0)}" r="7" fill="${['#ff8fb1', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff'][(k + i) % 5]}" stroke="${INK}" stroke-width="3" opacity="${i === 0 && k === 2 ? 0 : 1}"/>`).join('')}`; };
  const top = -rows * 58 - 62;
  return g(x, y, s, `<ellipse cy="4" rx="${w / 2 + 14}" ry="11" fill="#000" opacity=".2"/>${Array.from({ length: rows }, (_, i) => row(i)).join('')}
    ${o.flags === false ? '' : `<path d="M${-w / 2 + 20} ${top} V${top - 56} M${w / 2 - 20} ${top} V${top - 56}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${-w / 2 + 20} ${top - 50} Q0 ${top - 24} ${w / 2 - 20} ${top - 50}" stroke="${INK}" stroke-width="4" fill="none"/>
    ${Array.from({ length: 6 }, (_, k) => { const u = (k + 0.5) / 6, xx = -w / 2 + 20 + u * (w - 40), yy = top - 50 + Math.sin(Math.PI * u) * 26; return `<path d="M${xx - 14} ${yy - 1} L${xx + 14} ${yy - 1} L${xx} ${yy + 28}Z" ${O(['#ff6f95', '#ffd23f', '#7cc8ff'][k % 3], 3)}/>`; }).join('')}`}`);
};

// plot (cône) : (0,0) = base
export const cone = (x = 0, y = 0, s = 1, col = '#ff8a2b') => g(x, y, s, `<ellipse cy="2" rx="40" ry="9" fill="#000" opacity=".2"/><rect x="-36" y="-14" width="72" height="16" rx="6" ${O('#e8631a', 4)}/><path d="M-26 -12 L-9 -92 Q0 -100 9 -92 L26 -12Z" ${O(col, 4)}/><path d="M-20 -42 H20 M-14 -66 H14" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M-20 -42 H20 M-14 -66 H14" stroke="${INK}" stroke-width="2.5" opacity=".3" stroke-linecap="round" transform="translate(0 6)"/><ellipse cx="-10" cy="-78" rx="3.5" ry="8" fill="#fff" opacity=".45" transform="rotate(14 -10 -78)"/>`);
// les 3 plots de la piste : xs = positions x, y = sol
export const plots = (xs = [260, 640, 1020], y = GROUND + 50, s = 1) => xs.map((x) => cone(x, y, s)).join('');

// ruban d'arrivée entre deux piquets : (0,0) = centre bas ; largeur 300 · o.cut = temps de la coupure (le ruban tombe en deux)
export const finishTape = (x = 0, y = 0, s = 1, o = {}) => {
  const post = (k) => `<rect x="${k * 150 - 11}" y="-150" width="22" height="150" rx="9" ${O('#fff', 4)}/><path d="M${k * 150 - 11} -128 L${k * 150 + 11} -140 M${k * 150 - 11} -100 L${k * 150 + 11} -112 M${k * 150 - 11} -72 L${k * 150 + 11} -84 M${k * 150 - 11} -44 L${k * 150 + 11} -56" stroke="#e8434e" stroke-width="12"/><rect x="${k * 150 - 11}" y="-150" width="22" height="150" rx="9" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="${k * 150}" cy="-156" r="11" ${O('#ffd23f', 4)}/>`;
  const half = (k) => `<path d="M${k * 140} -118 Q${k * 70} -92 0 -100" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${k * 140} -118 Q${k * 70} -92 0 -100" stroke="#e8434e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${k * 130} -122 Q${k * 70} -100 ${k * 20} -106" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>`;
  const rib = o.cut === undefined ? `${half(-1)}${half(1)}`
    : vis(0, o.cut, `${half(-1)}${half(1)}`) + vis(o.cut, 999, `<g style="transform-origin:-140px -118px;${an({ n: 'o9cutL', d: 0.7, t: o.cut, f: 'forwards', e: 'ease-in' })}">${half(-1)}</g><g style="transform-origin:140px -118px;${an({ n: 'o9cutR', d: 0.7, t: o.cut, f: 'forwards', e: 'ease-in' })}">${half(1)}</g>`);
  return g(x, y, s, `<ellipse cy="4" rx="190" ry="10" fill="#000" opacity=".18"/>${post(-1)}${post(1)}${rib}`);
};

// dossard : (0,0) = centre · n = numéro (7), rot = degrés · fly = [t0, t1, dx, dy] il s'envole · col = couleur du chiffre
export const bibTag = (x = 0, y = 0, s = 1, n = 7, rot = 0, col = '#e8434e') => g(x, y, s, `<g transform="rotate(${rot})"><rect x="-30" y="-34" width="60" height="68" rx="9" ${O('#fff', 5)}/><circle cx="-22" cy="-26" r="3.4" fill="#bbb"/><circle cx="22" cy="-26" r="3.4" fill="#bbb"/><circle cx="-22" cy="26" r="3.4" fill="#bbb"/><circle cx="22" cy="26" r="3.4" fill="#bbb"/><text x="0" y="17" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="52" fill="${col}">${n}</text><path d="M-22 -22 h14" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".0"/></g>`);

// médaille : (0,0) = centre du disque, le ruban monte au-dessus · o.col (or), o.ribbon
export const medal = (x = 0, y = 0, s = 1, o = {}) => {
  const col = o.col || '#ffd23f', colD = o.colD || '#f0b400', rb = o.ribbon || '#3b82f6';
  return g(x, y, s, `<path d="M-30 -92 L-8 -22 H12 L-6 -92Z" ${O(rb, 4)}/><path d="M30 -92 L8 -22 H-12 L6 -92Z" ${O('#e8434e', 4)}/>
    <circle r="34" ${O(col, 5)}/><circle r="24" fill="${colD}" stroke="${INK}" stroke-width="3"/><path d="M0 -15 l4.6 9.6 10.4 1.4 -7.6 7.4 1.9 10.4 -9.3 -5 -9.3 5 1.9 -10.4 -7.6 -7.4 10.4 -1.4Z" fill="#fff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="-14" cy="-18" rx="9" ry="4" fill="#fff" opacity=".6" transform="rotate(-35 -14 -18)"/>`);
};
// la boîte aux médailles de Mme Chouette : (0,0) = centre bas ; largeur 190, hauteur ≈ 110
// o.open = temps d'ouverture du couvercle (ou true = ouverte) · o.n = médailles qui dépassent à l'ouverture (6) · o.spill = true : quelques-unes débordent sur le devant
export const medalBox = (x = 0, y = 0, s = 1, o = {}) => {
  const isOpen = o.open !== undefined, nn = o.n ?? 6, cols = ['#ffd23f', '#ffd23f', '#ffd23f'];
  const body = `<rect x="-95" y="-92" width="190" height="92" rx="12" ${O('#c98a4e', 6)}/><path d="M-95 -60 H95" stroke="${INK}" stroke-width="4"/><path d="M-70 -86 V-6 M-30 -86 V-6 M30 -86 V-6 M70 -86 V-6" stroke="#a8743f" stroke-width="5" opacity=".5"/><rect x="-14" y="-70" width="28" height="26" rx="6" ${O('#ffd23f', 4)}/><circle cy="-57" r="4.5" fill="${INK}"/><rect x="-95" y="-94" width="190" height="14" rx="6" ${O('#e0a866', 4)}/>`;
  const lid = (op) => `<g style="transform-origin:-95px -94px;${op}"><rect x="-95" y="-132" width="190" height="42" rx="12" ${O('#e0a866', 6)}/><path d="M-80 -118 q10 -8 20 0 M60 -118 q10 -8 20 0" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/><path d="M0 -126 l5 10 11 1.6 -8 7.6 2 11 -10 -5.2 -10 5.2 2 -11 -8 -7.6 11 -1.6Z" fill="#ffd23f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`;
  const items = Array.from({ length: nn }, (_, i) => { const k = (i - (nn - 1) / 2) / Math.max(1, (nn - 1) / 2), c = ['#ffd23f', '#ffd23f'][0]; return `<g transform="translate(${k * 58} ${-96 - (i % 2) * 18}) rotate(${k * 18}) scale(.58)"><path d="M-22 -60 L-6 -12 H10 L-4 -60Z" fill="${['#3b82f6', '#e8434e', '#2fae66'][i % 3]}" stroke="${INK}" stroke-width="5"/><circle cy="14" r="34" ${O(c, 6)}/><path d="M0 -4 l5 10 11 1.6 -8 7.6 2 11 -10 -5.2 -10 5.2 2 -11 -8 -7.6 11 -1.6Z" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`; }).join('');
  const spill = o.spill ? `<g transform="translate(-64 -34) rotate(-12) scale(.5)"><circle r="34" ${O('#ffd23f', 6)}/><path d="M0 -14 l5 10 11 1.6 -8 7.6 2 11 -10 -5.2 -10 5.2 2 -11 -8 -7.6 11 -1.6Z" fill="#fff" stroke="${INK}" stroke-width="3"/></g><g transform="translate(74 -26) rotate(18) scale(.5)"><circle r="34" ${O('#ffd23f', 6)}/><path d="M0 -14 l5 10 11 1.6 -8 7.6 2 11 -10 -5.2 -10 5.2 2 -11 -8 -7.6 11 -1.6Z" fill="#fff" stroke="${INK}" stroke-width="3"/></g>` : '';
  if (!isOpen) return g(x, y, s, `<ellipse cy="4" rx="110" ry="11" fill="#000" opacity=".2"/>${body}${lid('')}`);
  const backLid = `<rect x="-92" y="-176" width="184" height="86" rx="12" ${O('#a8743f', 6)}/><rect x="-80" y="-164" width="160" height="62" rx="8" fill="#e0a866" stroke="${INK}" stroke-width="3.5"/><path d="M0 -156 l5 10 11 1.6 -8 7.6 2 11 -10 -5.2 -10 5.2 2 -11 -8 -7.6 11 -1.6Z" fill="#ffd23f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  const closedAt = o.open === true ? '' : vis(0, o.open, lid(''));
  const openAt = o.open === true ? backLid : vis(o.open, 999, backLid);
  const itemsAt = o.open === true ? items : vis(o.open + 0.2, 999, items);
  return g(x, y, s, `<ellipse cy="4" rx="110" ry="11" fill="#000" opacity=".2"/>${openAt}${itemsAt}${body}${o.open === true ? spill : vis(o.open + 0.4, 999, spill)}${closedAt}`);
};

// chronomètre : (0,0) = centre du cadran, rayon 44, bouton au-dessus · o.run = [[a,b]] la trotteuse tourne · o.ring = [[a,b]] il sonne (tremble)
export const stopwatch = (x = 0, y = 0, s = 1, o = {}) => {
  const hand = (o.run || []).length ? (o.run || []).map(([a, b]) => vis(a, b, `<g style="transform-origin:0px 0px;${an({ n: 'o9tick', d: 1.4, t: 0, c: 99 })}"><path d="M0 4 V-30" stroke="#e8434e" stroke-width="5" stroke-linecap="round"/></g>`)).join('') : `<path d="M0 4 V-30" stroke="#e8434e" stroke-width="5" stroke-linecap="round"/>`;
  const body = `<rect x="-9" y="-70" width="18" height="16" rx="4" ${O('#aab', 4)}/><rect x="-14" y="-78" width="28" height="12" rx="5" ${O('#e8434e', 4)}/><path d="M32 -42 l12 -12" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M32 -42 l12 -12" stroke="#aab" stroke-width="4" stroke-linecap="round"/>
    <circle r="50" ${O('#c9ced8', 6)}/><circle r="40" fill="#fff" stroke="${INK}" stroke-width="3.5"/>${Array.from({ length: 12 }, (_, i) => `<path d="M0 -36 v${i % 3 ? 4 : 8}" stroke="${INK}" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}
    ${hand}<circle r="5.5" fill="${INK}"/><ellipse cx="-20" cy="-26" rx="12" ry="5" fill="#fff" opacity=".7" transform="rotate(-40 -20 -26)"/>`;
  const inner = (o.ring || []).length ? `<g style="transform-origin:0px 0px;--s:2px;animation:${(o.ring).map(([a, b]) => ao({ n: 'shake', d: 0.045, t: a, c: Math.round((b - a) / 0.045), dir: 'alternate' })).join(',')}">${body}</g>` : body;
  return g(x, y, s, inner);
};
// version « tenue en main » (origine = main, le cadran dépasse au-dessus)
export const stopwatchItem = (o = {}) => stopwatch(0, -30, 0.62, o);

// balle en chaussette : (0,0) = centre, rayon ≈ 26 · col, rot
export const sockBall = (x = 0, y = 0, s = 1, col = '#ff8fb1', rot = 0) => g(x, y, s, `<g transform="rotate(${rot})"><circle r="26" ${O('#fff', 4.5)}/><path d="M-24 -9 Q0 -19 24 -9 M-26 4 Q0 -6 26 4 M-20 16 Q0 8 20 16" stroke="${col}" stroke-width="8" fill="none" stroke-linecap="round"/><circle r="26" fill="none" stroke="${INK}" stroke-width="4.5"/><path d="M14 -22 Q34 -30 36 -14 Q30 -6 18 -12Z" ${O(col, 3.5)}/><path d="M24 -22 l3 6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-10" cy="-12" rx="7" ry="4" fill="#fff" opacity=".6" transform="rotate(-30 -10 -12)"/></g>`);

// podium à marches : (0,0) = centre bas · o.n = nombre de marches (3) · o.w = largeur d'une marche (110) · o.nums = chiffres (true)
// l'ordre est celui d'un vrai podium : 1 au centre, 2 à gauche, 3 à droite, puis 4 à gauche, 5 à droite…
export const podiumSteps = (x = 0, y = 0, s = 1, o = {}) => {
  const n = o.n || 3, w = o.w || 110, cols = ['#ffd23f', '#c9ced8', '#e0985a', '#7cc8ff', '#c7a3ff', '#9be08a', '#ff8fb1', '#ffb36b'];
  const order = []; for (let r = 1; r <= n; r++) { if (r === 1) order.push(1); else if (r % 2 === 0) order.unshift(r); else order.push(r); }
  const hOf = (r) => Math.max(46, 150 - (r - 1) * 36);
  const x0 = (-n * w) / 2;
  return g(x, y, s, `<ellipse cy="5" rx="${(n * w) / 2 + 20}" ry="12" fill="#000" opacity=".2"/>${order.map((r, i) => { const hh = hOf(r), xx = x0 + i * w; return `<rect x="${xx}" y="${-hh}" width="${w}" height="${hh}" ${O(cols[(r - 1) % cols.length], 6)}/><rect x="${xx + 6}" y="${-hh + 6}" width="${w - 12}" height="12" rx="5" fill="#fff" opacity=".4"/>${o.nums === false ? '' : `<text x="${xx + w / 2}" y="${-hh / 2 + 22}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${hh > 70 ? 64 : 56}" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">${r}</text>`}`; }).join('')}`);
};
// largeur utile d'un podium de n marches (pour poser les personnages) et hauteur d'une marche de rang r
export const podiumSlots = (n = 3, w = 110) => { const order = []; for (let r = 1; r <= n; r++) { if (r === 1) order.push(1); else if (r % 2 === 0) order.unshift(r); else order.push(r); } return order.map((r, i) => ({ rank: r, dx: (-n * w) / 2 + i * w + w / 2, top: -Math.max(46, 150 - (r - 1) * 36) })); };

// poutre d'équilibre : (0,0) = centre bas, longueur 540, dessus à -150 (assez haut pour qu'un manchot glisse dessous) · o.mat = tapis dessous (true)
export const balanceBeam = (x = 0, y = 0, s = 1, o = {}) => {
  const leg = (k) => `<path d="M${k * 210 - 26} 0 L${k * 210 - 6} -128 H${k * 210 + 6} L${k * 210 + 26} 0Z" ${O('#aab4c6', 5)}/><rect x="${k * 210 - 20}" y="-134" width="40" height="14" rx="5" ${O('#8a94aa', 4)}/>`;
  return g(x, y, s, `<ellipse cy="4" rx="290" ry="11" fill="#000" opacity=".18"/>${o.mat ? mat(0, 0, 1, { w: 620 }) : ''}${leg(-1)}${leg(1)}
    <rect x="-270" y="-168" width="540" height="34" rx="16" ${O('#e0a866', 6)}/><path d="M-250 -156 H236" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/><path d="M-270 -148 H270" stroke="#c98a4e" stroke-width="4" opacity=".6"/>`);
};
// tapis de gym : (0,0) = centre bas · o.w · o.col
export const mat = (x = 0, y = 0, s = 1, o = {}) => { const w = o.w || 300, c = o.col || '#3b82f6'; return g(x, y, s, `<rect x="${-w / 2}" y="-22" width="${w}" height="24" rx="10" ${O(c, 5)}/><path d="${Array.from({ length: Math.floor(w / 100) - 1 }, (_, i) => `M${-w / 2 + (i + 1) * (w / Math.floor(w / 100))} -20 V0`).join(' ')}" stroke="${INK}" stroke-width="3.5" opacity=".5"/><rect x="${-w / 2 + 12}" y="-18" width="${w - 24}" height="6" rx="3" fill="#fff" opacity=".35"/>`); };

// cible ronde sur pied : (0,0) = pied · rayon 92, centre à -200
export const target = (x = 0, y = 0, s = 1) => g(x, y, s, `<ellipse cy="4" rx="90" ry="10" fill="#000" opacity=".2"/><path d="M-50 0 L-8 -112 M50 0 L8 -112" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-50 0 L-8 -112 M50 0 L8 -112" stroke="#c98a4e" stroke-width="7" stroke-linecap="round"/>
  <g transform="translate(0 -200)"><circle r="94" ${O('#fff', 6)}/><circle r="72" ${O('#3b82f6', 4)}/><circle r="50" ${O('#fff', 4)}/><circle r="32" ${O('#e8434e', 4)}/><circle r="13" ${O('#ffd23f', 4)}/><path d="M-70 -56 Q-52 -72 -30 -76" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/></g>`);
// mètre au sol : (0,0) = début, de gauche à droite · o.len (700) · o.step (70)
export const groundRuler = (x = 0, y = 0, s = 1, o = {}) => { const len = o.len || 700, st = o.step || 70, n = Math.round(len / st); return g(x, y, s, `<rect x="0" y="-18" width="${len}" height="36" rx="8" ${O('#ffd23f', 5)}/>${Array.from({ length: n + 1 }, (_, i) => `<path d="M${i * st} -18 v${i % 5 === 0 ? 20 : 12}" stroke="${INK}" stroke-width="${i % 5 === 0 ? 5 : 3.5}" stroke-linecap="round"/>`).join('')}<rect x="8" y="-14" width="${len - 16}" height="6" rx="3" fill="#fff" opacity=".45"/>`); };

// table avec nappe : (0,0) = centre bas · o.w (300) · o.h (118) · o.col · o.check = nappe à carreaux
export const clothTable = (x = 0, y = 0, s = 1, o = {}) => {
  const w = o.w || 300, h = o.h || 118, c = o.col || '#ffffff', n = Math.round(w / 40);
  return g(x, y, s, `<ellipse cy="4" rx="${w / 2 + 16}" ry="11" fill="#000" opacity=".18"/><path d="M${-w / 2 + 14} -${h} H${w / 2 - 14} V-8 H${-w / 2 + 14}Z" fill="#a8743f" stroke="${INK}" stroke-width="4"/>
    <path d="M${-w / 2} -${h} H${w / 2} V${-20} ${Array.from({ length: n }, (_, i) => `q${-w / n / 2} 24 ${-w / n} 0`).join(' ')}Z" ${O(c, 5)}/>
    ${o.check ? Array.from({ length: n }, (_, i) => `<rect x="${-w / 2 + i * (w / n) + 2}" y="${-h + 4}" width="${w / (2 * n)}" height="${h - 30}" fill="#e8434e" opacity=".35"/>`).join('') : ''}
    <rect x="${-w / 2}" y="-${h + 8}" width="${w}" height="16" rx="7" ${O(c === '#ffffff' ? '#fff' : c, 5)}/><path d="M${-w / 2 + 14} -${h + 3} H${w / 2 - 14}" stroke="#d9dfef" stroke-width="4" stroke-linecap="round"/>`);
};
// gâteau sur plat : (0,0) = bas du plat · o.rise = [t0, t1, k] il gonfle comme un nuage (échelle k) · o.cherry
export const cake = (x = 0, y = 0, s = 1, o = {}) => {
  const body = `<ellipse cy="-4" rx="64" ry="12" ${O('#d9dfef', 4)}/><path d="M-52 -8 V-52 Q-52 -62 -40 -62 H40 Q52 -62 52 -52 V-8 Q0 6 -52 -8Z" ${O('#f6c487', 5)}/><path d="M-54 -50 q12 16 26 2 q12 18 26 2 q14 16 26 -2 q12 16 28 0 V-60 Q0 -76 -54 -60Z" ${O('#ff8fb1', 4)}/><path d="M-30 -30 h60" stroke="#e8a060" stroke-width="5" stroke-linecap="round"/>${o.cherry === false ? '' : `<circle cy="-78" r="11" ${O('#e8434e', 4)}/><path d="M0 -88 q4 -12 12 -14" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="-4" cy="-82" rx="3" ry="2" fill="#fff" opacity=".7"/>`}`;
  return g(x, y, s, o.rise ? tf(body, { t0: o.rise[0], d: o.rise[1] - o.rise[0], from: 'scale(1)', to: `scale(${o.rise[2]})`, e: 'ease-out', o: '0px 0px' }) : body);
};
// chevalet : (0,0) = pied · o.art = 'friends' | 'blur' | 'blank' | 'frame'
export const easel = (x = 0, y = 0, s = 1, o = {}) => {
  const art = { blank: '', blur: `<path d="M-40 -150 H44 M-44 -126 H40 M-38 -102 H46 M-42 -78 H36" stroke="#7cc8ff" stroke-width="14" stroke-linecap="round" opacity=".8"/><path d="M-30 -138 H36 M-34 -114 H30 M-30 -90 H40" stroke="#ff8fb1" stroke-width="10" stroke-linecap="round" opacity=".8"/>`,
    friends: `<circle cx="-30" cy="-138" r="14" fill="#ffb36b" stroke="${INK}" stroke-width="3.5"/><circle cx="2" cy="-132" r="14" fill="#c7a3ff" stroke="${INK}" stroke-width="3.5"/><circle cx="34" cy="-138" r="14" fill="#9be08a" stroke="${INK}" stroke-width="3.5"/><path d="M-30 -124 V-92 M2 -118 V-86 M34 -124 V-92" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-44 -80 Q0 -66 44 -80" stroke="#e8434e" stroke-width="7" fill="none" stroke-linecap="round"/>` }[o.art || 'friends'] ?? '';
  return g(x, y, s, `<ellipse cy="4" rx="80" ry="9" fill="#000" opacity=".18"/><path d="M-60 0 L-24 -206 M60 0 L24 -206 M0 -60 V-206" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-60 0 L-24 -206 M60 0 L24 -206 M0 -60 V-206" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/>
    <rect x="-56" y="-186" width="112" height="132" rx="5" ${O('#fff', 5)}/>${art}<rect x="-66" y="-58" width="132" height="12" rx="5" ${O('#e0a866', 4)}/>`);
};
// pots de peinture + pinceau : (0,0) = centre bas
export const paintPots = (x = 0, y = 0, s = 1) => g(x, y, s, `${['#e8434e', '#ffd23f', '#3b82f6', '#2fae66'].map((c, i) => `<g transform="translate(${-66 + i * 44} 0)"><rect x="-18" y="-40" width="36" height="40" rx="7" ${O('#fff', 4)}/><rect x="-18" y="-30" width="36" height="18" fill="${c}" stroke="${INK}" stroke-width="3"/><ellipse cy="-40" rx="18" ry="6" ${O(c, 3.5)}/></g>`).join('')}<g transform="translate(70 -2) rotate(-62)"><rect x="-4" y="-56" width="8" height="52" rx="4" ${O('#c98a4e', 3.5)}/><path d="M-5 -4 L5 -4 Q8 12 0 16 Q-8 12 -5 -4Z" ${O('#e8434e', 3)}/></g>`);
// établi : (0,0) = centre bas · largeur 300
export const bench = (x = 0, y = 0, s = 1) => g(x, y, s, `<ellipse cy="4" rx="170" ry="11" fill="#000" opacity=".18"/><rect x="-142" y="-76" width="22" height="76" rx="6" ${O('#a8743f', 5)}/><rect x="120" y="-76" width="22" height="76" rx="6" ${O('#a8743f', 5)}/><rect x="-150" y="-104" width="300" height="32" rx="10" ${O('#e0a866', 6)}/><path d="M-132 -92 H118" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/>
  <rect x="96" y="-136" width="36" height="34" rx="6" ${O('#e8434e', 4)}/><path d="M114 -136 V-150" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><g transform="translate(-92 -104)"><rect x="-4" y="-34" width="8" height="34" rx="3" ${O('#c98a4e', 3.5)}/><rect x="-18" y="-48" width="36" height="16" rx="5" ${O('#aab4c6', 4)}/></g>
  <path d="M-30 -104 q4 -22 20 -20 q18 -2 22 20Z" ${O('#ffd23f', 4)}/>`);
// engrenage décoratif qui tourne : (0,0) = centre · r
export const gear = (x = 0, y = 0, s = 1, col = '#aab4c6', dur = 8) => g(x, y, s, `<g style="transform-origin:0px 0px;animation:o9tick ${dur}s linear infinite">${Array.from({ length: 8 }, (_, i) => `<rect x="-9" y="-46" width="18" height="18" rx="4" ${O(col, 3.5)} transform="rotate(${i * 45})"/>`).join('')}<circle r="34" ${O(col, 4.5)}/><circle r="13" fill="#fff" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-14" cy="-16" rx="9" ry="4" fill="#fff" opacity=".45" transform="rotate(-35 -14 -16)"/></g>`);
// cadre de tableau : (0,0) = centre · o.w · o.h · o.rot · o.art ('friends' | 'sun' | 'blank')
export const frame = (x = 0, y = 0, s = 1, o = {}) => {
  const w = o.w || 130, h = o.h || 100, art = { friends: `<circle cx="${-w * 0.25}" cy="${-h * 0.08}" r="${h * 0.16}" fill="#ffb36b" stroke="${INK}" stroke-width="3"/><circle cx="${w * 0.02}" cy="${-h * 0.02}" r="${h * 0.16}" fill="#c7a3ff" stroke="${INK}" stroke-width="3"/><circle cx="${w * 0.27}" cy="${-h * 0.08}" r="${h * 0.16}" fill="#9be08a" stroke="${INK}" stroke-width="3"/><path d="M${-w * 0.35} ${h * 0.3} Q0 ${h * 0.14} ${w * 0.35} ${h * 0.3}" stroke="#e8434e" stroke-width="6" fill="none" stroke-linecap="round"/>`, sun: `<circle cy="${-h * 0.05}" r="${h * 0.22}" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M${-w * 0.4} ${h * 0.34} Q0 ${h * 0.12} ${w * 0.4} ${h * 0.34}" stroke="#2fae66" stroke-width="8" fill="none" stroke-linecap="round"/>`, blank: '' }[o.art || 'friends'] ?? '';
  return g(x, y, s, `<g transform="rotate(${o.rot || 0})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" ${O('#e0a866', 7)}/><rect x="${-w / 2 + 10}" y="${-h / 2 + 10}" width="${w - 20}" height="${h - 20}" fill="#fff" stroke="${INK}" stroke-width="3.5"/>${art}</g>`);
};
// four : (0,0) = centre bas · o.on = [[a,b]] voyant allumé · largeur 200
export const oven = (x = 0, y = 0, s = 1, o = {}) => g(x, y, s, `<ellipse cy="4" rx="120" ry="11" fill="#000" opacity=".18"/><rect x="-100" y="-190" width="200" height="190" rx="16" ${O('#e7ebf3', 6)}/><rect x="-100" y="-190" width="200" height="46" rx="14" ${O('#c9ced8', 5)}/>${[-60, -20, 20, 60].map((k) => `<circle cx="${k}" cy="-167" r="11" ${O('#fff', 3.5)}/><path d="M${k} -167 v-7" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}
  <rect x="-76" y="-126" width="152" height="96" rx="12" ${O('#3a3a4a', 5)}/><rect x="-64" y="-114" width="128" height="72" rx="8" fill="${(o.on || []).length ? '#2a2a38' : '#4a4a5c'}" stroke="${INK}" stroke-width="3.5"/>${(o.on || []).map(([a, b]) => vis(a, b, `<rect x="-64" y="-114" width="128" height="72" rx="8" fill="#ffb347" stroke="${INK}" stroke-width="3.5" style="animation:o9glint 1s ease-in-out infinite"/><ellipse cy="-62" rx="30" ry="16" ${O('#f6c487', 3.5)}/>`)).join('')}<path d="M-56 -108 L-24 -112" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/><rect x="-60" y="-26" width="120" height="9" rx="4" ${O('#aab4c6', 3.5)}/>`);
// plan de travail de cuisine : (0,0) = centre bas · o.w (360)
export const counter = (x = 0, y = 0, s = 1, o = {}) => { const w = o.w || 360; return g(x, y, s, `<ellipse cy="4" rx="${w / 2 + 14}" ry="11" fill="#000" opacity=".18"/><rect x="${-w / 2}" y="-130" width="${w}" height="130" rx="8" ${O('#7cc8ff', 6)}/><rect x="${-w / 2 - 8}" y="-146" width="${w + 16}" height="22" rx="8" ${O('#f3e3c3', 5)}/>${[-1, 0, 1].map((k) => `<rect x="${k * (w / 3) - w / 6 + 8}" y="-112" width="${w / 3 - 16}" height="88" rx="6" fill="#9ad6ff" stroke="${INK}" stroke-width="4"/><circle cx="${k * (w / 3)}" cy="-100" r="5" ${O('#ffd23f', 3)}/>`).join('')}`); };

// ═════════════════════ décors (fonds 1280x720, dessinés de X0 à X1) ═════════════════════

// 1. la cour de l'école avec tribunes en carton et banderole · o.banner (true) · o.bleachers (true)
export const cour = (o = {}) => {
  const { banner: ban = true, bleachers = true } = o;
  const facade = `<rect x="${X0}" y="300" width="${XW}" height="${GROUND - 300}" fill="#ffe9c2"/><rect x="${X0}" y="276" width="${XW}" height="30" fill="#e8634a" stroke="${INK}" stroke-width="5"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${X0 + i * 170 + 40} 300 V${GROUND - 14}" stroke="#f0d8a4" stroke-width="5" opacity=".7"/>`).join('')}
    ${[60, 330, 950, 1220, -190, 1480].map((cx) => win(cx, 346, 96, 120)).join('')}<path d="M${X0} 300 H${X1} M${X0} ${GROUND - 14} H${X1}" stroke="${INK}" stroke-width="5"/>
    <g transform="translate(640 ${GROUND})"><rect x="-80" y="-232" width="160" height="232" rx="10" ${O('#8a5a33', 6)}/><rect x="-62" y="-214" width="124" height="214" fill="#ffe9a8" stroke="${INK}" stroke-width="4"/><path d="M0 -214 V0" stroke="${INK}" stroke-width="4"/><circle cx="-12" cy="-104" r="6" ${O('#ffd23f', 3)}/><circle cx="12" cy="-104" r="6" ${O('#ffd23f', 3)}/></g>`;
  return `${bands(DAY)}${sunFace(1100, 110)}${clouds()}${hillsFar('#b9e6a0', '#9bd78a')}${facade}
    ${slab(GROUND, H - GROUND + 4, '#e7cf9f', 5)}<path d="M${X0} ${GROUND + 70} H${X1} M${X0} ${GROUND + 130} H${X1}" stroke="#d3b982" stroke-width="5"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${X0 + 60 + i * 200} ${GROUND + 70} V${GROUND + 130}" stroke="#d3b982" stroke-width="5"/>`).join('')}
    ${bleachers ? `${cardBleachers(150, GROUND + 6, 1)}${cardBleachers(1130, GROUND + 6, 1)}${cardBleachers(-300, GROUND + 6, 1)}${cardBleachers(1580, GROUND + 6, 1)}` : ''}
    ${ban ? banner(640, 150, 1, { w: 640, poles: 420 }) : ''}${garland(X0, 30, X1, 30, 20)}`;
};

// 2. la piste (3 plots) : herbe, piste rouge, ligne de départ et d'arrivée · o.plots (true) · o.tape = ruban à l'arrivée (true)
export const piste = (o = {}) => {
  const { plots: pl = true, tape = true } = o;
  return `${bands(DAY)}${sunFace(180, 120)}${clouds()}${hillsFar()}${grass('#8fd16e', '#7fc35e', 470)}
    ${slab(500, H - 500, '#e58a5a', 5)}${[0, 1, 2, 3, 4].map((i) => `<path d="M${X0} ${GROUND + 6 + i * 36} H${X1}" stroke="#d2744a" stroke-width="3" opacity="0"/>`).join('')}
    <path d="M${X0} ${GROUND + 66} H${X1}" stroke="#fff" stroke-width="7" opacity=".85"/><path d="M${X0} ${GROUND + 140} H${X1}" stroke="#fff" stroke-width="7" opacity=".85"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${X0 + 70 + i * 160} ${GROUND + 100} h54" stroke="#d2744a" stroke-width="6" stroke-linecap="round"/>`).join('')}
    <rect x="130" y="500" width="22" height="${H - 500}" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M130 ${GROUND - 60} h22 M130 ${GROUND - 20} h22 M130 ${GROUND + 20} h22" stroke="${INK}" stroke-width="8" opacity=".85"/>
    <rect x="1130" y="500" width="22" height="${H - 500}" fill="#fff" stroke="${INK}" stroke-width="4"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${1130 + (i % 2) * 11}" y="${500 + i * 25}" width="11" height="25" fill="${INK}"/>`).join('')}
    ${cardBleachers(-120, 478, 0.8)}${cardBleachers(1450, 478, 0.8)}${pl ? plots([300, 640, 980]) : ''}${tape ? finishTape(1270, 590, 0.9) : ''}
    ${banner(640, 100, 0.9, { word: 'DÉPART', w: 440, poles: 520, col: '#ffd23f' })}`;
};

// 3. le gymnase : mur, espalier, hautes fenêtres, sol de parquet, poutre au centre · o.beam (true) · o.mat (true)
export const gymnase = (o = {}) => {
  const { beam = true, mats = true } = o;
  const wallBars = (x) => `<g transform="translate(${x} ${GROUND})"><rect x="-96" y="-360" width="192" height="360" rx="6" ${O('#e0a866', 6)}/>${Array.from({ length: 11 }, (_, i) => `<rect x="-90" y="${-346 + i * 32}" width="180" height="10" rx="5" ${O('#c98a4e', 3.5)}/>`).join('')}${[-90, 90].map((k) => `<rect x="${k - 6}" y="-360" width="12" height="360" rx="5" ${O('#a8743f', 4)}/>`).join('')}</g>`;
  return `${room({ wall: '#fbe6b8', wall2: '#e8c06a', floor: '#e0a866', floorLine: '#c98a4e', base: '#8a5a33', rail: 150 })}
    ${[420, 640, 860].map((cx) => win(cx, 70, 150, 110)).join('')}${wallBars(-60)}${wallBars(1340)}
    <g transform="translate(1100 ${GROUND})"><path d="M0 -460 V-250" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="-244" r="9" ${O('#e8434e', 4)}/><path d="M0 -460 V-250" stroke="#d9a05b" stroke-width="3.5" stroke-dasharray="8 6"/></g>
    <path d="M${X0} ${GROUND + 104} Q640 ${GROUND + 70} ${X1} ${GROUND + 104}" stroke="#fff" stroke-width="7" fill="none" opacity=".8"/><circle cx="640" cy="${GROUND + 150}" r="0" fill="none"/>
    ${banner(640, 190, 0.8, { word: 'ÉQUILIBRE', w: 460, col: '#7cc8ff' })}
    ${mats ? `${mat(250, GROUND + 70, 1, { w: 340 })}${mat(1030, GROUND + 70, 1, { w: 340, col: '#ff8fb1' })}` : ''}${beam ? balanceBeam(640, GROUND + 70, 1, { mat: true }) : ''}`;
};

// 4. le terrain de lancer : herbe, cible ronde, mètre au sol · o.target (true) · o.ruler (true)
export const terrainLancer = (o = {}) => {
  const { target: tg = true, ruler = true } = o;
  return `${bands(DAY)}${sunFace(1120, 110)}${clouds()}${hillsFar()}${grass('#8fd16e', '#7fc35e', 470)}
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${X0} ${GROUND + 40 + i * 28} H${X1}" stroke="#7fc35e" stroke-width="3" opacity=".0"/>`).join('')}
    <path d="M120 ${GROUND + 30} V${H}" stroke="#fff" stroke-width="9" opacity=".9"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${X0 + 40 + i * 400}" y="470" width="30" height="18" rx="5" fill="#d9a05b" stroke="${INK}" stroke-width="3.5" opacity="0"/>`).join('')}
    ${ruler ? groundRuler(130, GROUND + 90, 1, { len: 1050, step: 75 }) : ''}${tg ? target(1180, GROUND + 22, 1) : ''}
    ${banner(520, 130, 0.85, { word: 'LANCER', w: 380, poles: 500, col: '#ff8fb1' })}`;
};

// 5. la salle de dégustation : table de jury au fond, nappes, gâteaux · o.cakes (true)
export const salleDegustation = (o = {}) => {
  const { cakes = true } = o;
  return `${room({ wall: '#ffe1ea', wall2: '#ff9fbd', floor: '#f3d8b0', floorLine: '#dfbd8a', base: '#c9556f', rail: 170 })}
    ${win(160, 100, 130, 150)}${win(1120, 100, 130, 150)}${bulbs(220, 1060, 50, 24, 12)}
    ${frame(640, 220, 1.2, { w: 150, h: 110, art: 'sun' })}${garland(X0, 26, X1, 26, 16)}
    ${clothTable(640, GROUND + 6, 1.45, { w: 380, col: '#fff' })}${clothTable(130, GROUND + 90, 0.9, { w: 280, col: '#ff8fb1' })}${clothTable(1150, GROUND + 90, 0.9, { w: 280, col: '#7cc8ff' })}
    ${cakes ? `${cake(570, GROUND - 160, 1)}${cake(710, GROUND - 160, 0.85, { cherry: false })}${cake(130, GROUND - 6, 0.85)}${cake(1150, GROUND - 6, 0.85, { cherry: false })}` : ''}`;
};

// 6. l'atelier de Bastien : mur, établi, panneau d'outils, engrenages · o.bench (true)
export const atelier = (o = {}) => {
  const { bench: bn = true } = o;
  const tool = (kind, x, y) => `<g transform="translate(${x} ${y})">${{ hammer: `<rect x="-5" y="-4" width="10" height="64" rx="4" ${O('#c98a4e', 3.5)}/><rect x="-24" y="-20" width="48" height="22" rx="6" ${O('#aab4c6', 4)}/>`, saw: `<path d="M-10 0 H10 V64 L-10 52Z" ${O('#dfe3ee', 4)}/><rect x="-14" y="-12" width="28" height="14" rx="5" ${O('#e8631a', 3.5)}/>`, wrench: `<rect x="-6" y="0" width="12" height="62" rx="5" ${O('#aab4c6', 3.5)}/><circle cy="-6" r="17" ${O('#aab4c6', 4)}/><rect x="-6" y="-24" width="12" height="16" fill="#9a7a58"/>`, tape: `<circle r="24" ${O('#ffd23f', 4)}/><circle r="11" fill="#fff" stroke="${INK}" stroke-width="3"/>` }[kind]}</g>`;
  return `${room({ wall: '#e3f0ff', wall2: '#9ad0f2', floor: '#cfa971', floorLine: '#b88f5a', base: '#6a7fa0', rail: 150 })}
    <rect x="80" y="130" width="500" height="280" rx="12" ${O('#e0a866', 7)}/>${Array.from({ length: 5 }, (_, r) => Array.from({ length: 12 }, (__, c) => `<circle cx="${112 + c * 40}" cy="${158 + r * 54}" r="3.5" fill="#a8743f"/>`).join('')).join('')}
    ${tool('hammer', 150, 190)}${tool('saw', 250, 190)}${tool('wrench', 350, 190)}${tool('tape', 450, 218)}${tool('hammer', 520, 290)}${tool('wrench', 200, 300)}
    ${gear(800, 190, 1.5, '#aab4c6', 9)}${gear(920, 270, 1, '#ffb36b', -6)}${gear(1090, 170, 1.2, '#9ad0f2', 7)}
    ${win(1130, 300, 110, 90)}${bulbs(100, 1180, 40, 18, 12)}
    ${bn ? `${bench(780, GROUND + 70, 1.2)}` : ''}`;
};

// 7. la salle d'art : chevalets, pots de peinture, étagère, dessins au mur · o.easels (true)
export const salleArt = (o = {}) => {
  const { easels = true } = o;
  return `${room({ wall: '#fff3d6', wall2: '#ffd9a0', floor: '#d6a566', floorLine: '#bf8a4e', base: '#a86a3a', rail: 160 })}
    ${win(1060, 80, 150, 170)}${frame(180, 200, 1, { art: 'sun', rot: -3 })}${frame(340, 170, 0.85, { art: 'friends', rot: 3 })}${frame(500, 210, 0.95, { art: 'sun', rot: -2 })}
    <path d="M110 120 H590" stroke="${INK}" stroke-width="4"/><rect x="740" y="${GROUND - 250}" width="240" height="14" rx="5" ${O('#c98a4e', 5)}/>${[780, 850, 920].map((cx, i) => `<rect x="${cx - 16}" y="${GROUND - 292}" width="32" height="42" rx="6" ${O(['#e8434e', '#3b82f6', '#ffd23f'][i], 4)}/>`).join('')}
    ${paintPots(860, GROUND - 236, 0.75)}${garland(X0, 24, X1, 24, 14)}
    ${easels ? `${easel(260, GROUND + 70, 1.1, { art: 'friends' })}${easel(560, GROUND + 70, 1.1, { art: 'blur' })}${easel(1120, GROUND + 70, 1.1, { art: 'blank' })}` : ''}${paintPots(820, GROUND + 70, 1)}`;
};

// 8. le podium : fond de la cour au soir, estrade centrale · o.n = marches (3) · o.nums
export const podiumScene = (o = {}) => `${courSoir(o)}${podiumSteps(640, GROUND + 70, 1.3, { n: o.n || 3, nums: o.nums })}`;

// 9. la cour au soir : ciel violet et orange, guirlandes lumineuses, tribunes éclairées · o.lights (true)
export const courSoir = (o = {}) => {
  const { lights = true, bleachers = true } = o;
  return `${bands(['#5b4a9a', '#8a5aa8', '#e0709a', '#ffb07a'])}
    <g transform="translate(1000 170) rotate(-20)"><path d="M0 -58 A58 58 0 1 0 0 58 A76 76 0 0 1 0 -58Z" ${O('#fff3a6', 5)}/></g>
    ${Array.from({ length: 16 }, (_, i) => `<path d="M${Math.round(rnd(i) * 1500 - 110)} ${30 + Math.round(rnd(i + 5) * 220)} l5 9 10 1.4 -7.4 7 2 10 -9.6 -5 -9.6 5 2 -10 -7.4 -7 10 -1.4Z" fill="#fff6c8" opacity=".85" style="animation:o9glint ${2 + (i % 4) * 0.6}s ${(i % 5) * 0.4}s ease-in-out infinite"/>`).join('')}
    <rect x="${X0}" y="300" width="${XW}" height="${GROUND - 300}" fill="#c9a0b8"/><rect x="${X0}" y="276" width="${XW}" height="30" fill="#b24a5a" stroke="${INK}" stroke-width="5"/>${[60, 330, 950, 1220, -190, 1480].map((cx) => win(cx, 346, 96, 120, true)).join('')}<path d="M${X0} 300 H${X1} M${X0} ${GROUND - 14} H${X1}" stroke="${INK}" stroke-width="5"/>
    ${slab(GROUND, H - GROUND + 4, '#b9a0b0', 5)}<path d="M${X0} ${GROUND + 70} H${X1} M${X0} ${GROUND + 130} H${X1}" stroke="#a48c9c" stroke-width="5"/>
    ${bleachers ? `${cardBleachers(150, GROUND + 6, 1)}${cardBleachers(1130, GROUND + 6, 1)}${cardBleachers(-300, GROUND + 6, 1)}${cardBleachers(1580, GROUND + 6, 1)}` : ''}
    ${lights ? `${bulbs(X0 + 20, 420, 90, 40, 8)}${bulbs(420, 860, 90, 40, 8)}${bulbs(860, X1 - 20, 90, 40, 8)}` : ''}
    <rect x="${X0}" y="0" width="${XW}" height="${H}" fill="#1d1a4a" opacity=".14"/>`;
};

// 10. la pelouse d'échauffement : herbe, tapis bleus alignés, seau d'eau
export const pelouse = () => `${bands(DAY)}${sunFace(1100, 110)}${clouds()}${hillsFar()}${grass('#8fd16e', '#7fc35e', 500)}${[180, 520, 860, 1200].map((cx) => mat(cx, GROUND + 100, 1, { w: 280 })).join('')}${banner(640, 130, 0.8, { word: 'ÉCHAUFFEMENT', w: 560, poles: 530, col: '#9be08a' })}
  <g transform="translate(1160 ${GROUND + 40})"><ellipse cy="4" rx="60" ry="9" fill="#000" opacity=".2"/><path d="M-44 -78 L-36 0 H36 L44 -78Z" ${O('#7cc8ff', 5)}/><ellipse cy="-78" rx="44" ry="12" ${O('#3b82f6', 4)}/><ellipse cy="-76" rx="34" ry="8" fill="#9ad6ff"/><path d="M-44 -78 Q0 -150 44 -78" stroke="${INK}" stroke-width="5" fill="none"/></g>`;

// 11. la fosse de sable et sa règle géante
export const fosseSable = () => `${bands(DAY)}${sunFace(180, 110)}${clouds()}${hillsFar()}${grass('#8fd16e', '#7fc35e', 480)}
  <path d="M300 ${GROUND + 10} Q310 ${GROUND - 10} 340 ${GROUND - 10} H1100 Q1140 ${GROUND - 10} 1150 ${GROUND + 14} V${H} H300Z" ${O('#f3d9a0', 6)}/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${340 + (i % 7) * 110 + rnd(i) * 40}" cy="${GROUND + 50 + Math.floor(i / 7) * 60}" r="5" fill="#dcbc7c"/>`).join('')}
  ${groundRuler(160, GROUND + 130, 1, { len: 1000, step: 100 })}<rect x="150" y="${GROUND - 60}" width="20" height="${H - GROUND + 60}" fill="#fff" stroke="${INK}" stroke-width="4"/>${banner(720, 120, 0.8, { word: 'SAUT', w: 300, poles: 560, col: '#ffb36b' })}`;

// 12. la prairie du pique-nique (herbe, nappe à carreaux) · o.cloth = nappe (true)
export const prairie = (o = {}) => `${bands(DAY)}${sunFace(1120, 110)}${clouds()}${hillsFar()}${grass('#8fd16e', '#7fc35e', 470)}${o.cloth === false ? '' : `<path d="M180 ${GROUND + 110} L300 ${GROUND + 10} H980 L1100 ${GROUND + 110}Z" ${O('#fff', 6)}/>${Array.from({ length: 12 }, (_, i) => `<path d="M${300 + i * 56 - 120 + 0} ${GROUND + 10} L${300 + i * 56 - 200} ${GROUND + 110}" stroke="#e8434e" stroke-width="22" opacity=".45"/>`).join('')}<path d="M180 ${GROUND + 110} L300 ${GROUND + 10} H980 L1100 ${GROUND + 110}Z" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`}`;

// 13. la cuisine de l'école : carrelage, plans de travail, four · o.oven (true)
export const cuisine = (o = {}) => `${room({ wall: '#f4f9ff', wall2: '#cfe8ff', floor: '#f1e4c4', floorLine: '#dccaa0', base: '#8aa6c9', rail: 200 })}${win(1000, 80, 150, 130)}${frame(300, 160, 0.9, { art: 'sun' })}${garland(X0, 24, X1, 24, 12)}
  ${counter(210, GROUND + 6, 1, { w: 380 })}${counter(1040, GROUND + 6, 0.9, { w: 340 })}${o.oven === false ? '' : oven(620, GROUND + 4, 1.15, { on: o.ovenOn || [] })}`;

// 14. le couloir d'exposition : mur, rail, cadres alignés (o.tilt = true : tous de travers)
export const couloir = (o = {}) => `${room({ wall: '#fdeacc', wall2: '#e8b87a', floor: '#d9b480', floorLine: '#c29a64', base: '#9b6a3c', rail: 110 })}${bulbs(60, 1220, 36, 16, 14)}
  ${[130, 360, 590, 820, 1050, 1260, -100].map((cx, i) => frame(cx, 250 + (i % 2) * 30, 1.2, { art: ['friends', 'sun'][i % 2], rot: o.tilt ? 14 : 0, w: 150, h: 120 })).join('')}`;
