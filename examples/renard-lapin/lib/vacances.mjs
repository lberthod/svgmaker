// Saison 10 « Les grandes vacances » : décors et accessoires (dernier jour d'école, gare et train, wagon, camping, ponton, lac, plage,
// stand de glaces, chemin des arrivées, grande fête sous les lampions).
// Convention (comme farm.mjs / theatre.mjs) : chaque élément renvoie une chaîne SVG ; objets autour de (0,0) = point au sol (centre bas),
// à poser avec x,y,s en paramètres. Fonds = plein écran 1280x720 et débordent à gauche/droite (−300…+300) : le monde est plus large que l'écran.
// Les animaux regardent à droite. Préfixe de keyframes : v10…
// Sols conseillés pour poser les personnages : GROUND (pré, quai, clairière) · DECK (ponton) · SAND (plage, lac) · CLASS_FLOOR (classe)
import { W, H, INK, an, ao, anims, vis, tf, cloud, addKF } from './kit.mjs';
import { wall, board, windowEl, wallClock, FLOOR as CLASS_FLOOR } from './classroom.mjs';
import { sky, sun, clouds, hills, meadow, nightSky, campfire } from './farm.mjs';
import { garland } from './theatre.mjs';

export const GROUND = 560;   // pré, quai, clairière
export const DECK = 590;     // plancher du ponton
export const SAND = 610;     // plage et rive du lac
export { CLASS_FLOOR };

addKF(`@keyframes v10sway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes v10flick{0%,100%{opacity:1}45%{opacity:.82}50%{opacity:.6}55%{opacity:.85}}
@keyframes v10glow{from{opacity:.14;transform:scale(.94)}to{opacity:.3;transform:scale(1.06)}}
@keyframes v10bob{from{transform:translateY(0)}to{transform:translateY(-7px)}}
@keyframes v10drift{from{transform:translateX(-18px)}to{transform:translateX(18px)}}
@keyframes v10scroll{from{transform:translateX(0)}to{transform:translateX(-640px)}}
@keyframes v10lift{0%{transform:rotate(0)}100%{transform:rotate(-84deg)}}
@keyframes v10bite{0%,100%{transform:translateY(0)}25%{transform:translateY(22px)}50%{transform:translateY(4px)}75%{transform:translateY(16px)}}
@keyframes v10tunnel{0%{opacity:0}18%,82%{opacity:1}100%{opacity:0}}
@keyframes v10foam{from{transform:translateX(-26px)}to{transform:translateX(26px)}}
@keyframes v10smoke{0%{opacity:.9;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(-60px,-110px) scale(1.5)}}
@keyframes v10shake{from{transform:translateX(-2px)}to{transform:translateX(2px)}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const X0 = -300, WW = W + 600;   // débord horizontal des fonds
const loop = (name, d, extra = '') => `animation:${name} ${d}s ease-in-out infinite alternate;${extra}`;

// ciel large en bandes (day | dusk | night) sur tout le monde
const skyW = (kind = 'day', h = GROUND) => {
  const bands = { day: ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#d9f2ff'], dusk: ['#ff9f6b', '#ffb07a', '#ffc98f', '#ffe0a8'], night: ['#10163f', '#161e52', '#1d2766', '#27327c'] }[kind];
  return bands.map((c, i) => `<rect x="${X0}" y="${(i * h) / 4}" width="${WW}" height="${h / 4 + 2}" fill="${c}"/>`).join('');
};
const star = (x, y, r, t = 0) => `<path d="M${x} ${y - r} l${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l${(-r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l${(-r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l${(-r * 0.3).toFixed(1)} ${(-r * 0.7).toFixed(1)} l${(-r * 0.7).toFixed(1)} ${(-r * 0.3).toFixed(1)} l${(r * 0.7).toFixed(1)} ${(-r * 0.3).toFixed(1)}Z" fill="#fff6c8" style="animation:ftw ${1.1 + (t % 5) * 0.4}s ease-in-out ${(t % 7) * 0.25}s infinite alternate"/>`;
const pine = (x, y, s = 1, c = '#2f9a5a') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-30" width="18" height="32" rx="5" ${O('#9b6a3c', 3.5)}/>${[[0, 86, 60], [-34, 62, 48], [-66, 40, 36]].map(([dy, w, h], i) => `<path d="M${-w / 2} ${-30 + dy} L0 ${-30 + dy - h - 18} L${w / 2} ${-30 + dy}Z" ${O(i % 2 ? c : '#3fae55', 4)}/>`).join('')}<path d="M-14 -98 l8 -14" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".3"/></g>`;
const roundTree = (x, y, s = 1, c = '#3fae55') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-12" y="-80" width="24" height="84" rx="8" ${O('#9b6a3c', 4)}/><circle cy="-120" r="58" ${O(c, 5)}/><circle cx="-20" cy="-138" r="15" fill="#fff" opacity=".25"/></g>`;

// ═════════════════════ accessoires ═════════════════════

// valise : (0,0) = dessous ; largeur ≈ 170, hauteur ≈ 140 · o.col · o.open = true : couvercle levé, vêtements qui débordent · o.strain = true : elle gigote
export const suitcase = (x = 0, y = 0, s = 1, o = {}) => {
  const c = o.col || '#ff8a2b', cD = '#d96a12';
  const body = `<rect x="-84" y="-100" width="168" height="100" rx="16" ${O(c, 6)}/><rect x="-62" y="-100" width="14" height="100" fill="${cD}" opacity=".7"/><rect x="48" y="-100" width="14" height="100" fill="${cD}" opacity=".7"/>
    <rect x="-84" y="-100" width="168" height="100" rx="16" fill="none" stroke="${INK}" stroke-width="6"/>
    <path d="M-24 -100 V-128 Q-24 -138 -14 -138 H14 Q24 -138 24 -128 V-100" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M-24 -100 V-128 Q-24 -138 -14 -138 H14 Q24 -138 24 -128 V-100" stroke="#8a5a33" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="-22" y="-62" width="12" height="14" rx="3" ${O('#ffd23f', 3)}/><rect x="10" y="-62" width="12" height="14" rx="3" ${O('#ffd23f', 3)}/>
    <circle cx="-34" cy="-30" r="14" ${O('#fff', 3.5)}/><path d="M-34 -38 l4 8 8 1 -6 6 2 8 -8 -4 -8 4 2 -8 -6 -6 8 -1Z" fill="#e8434e" transform="scale(.7) translate(-14 -12)"/>
    <rect x="30" y="-40" width="34" height="22" rx="5" ${O('#7cc8ff', 3)} transform="rotate(-8 47 -29)"/><path d="M36 -30 h20" stroke="#fff" stroke-width="3" stroke-linecap="round" transform="rotate(-8 47 -29)"/>
    <ellipse cx="-62" cy="-82" rx="20" ry="6" fill="#fff" opacity=".35"/>
    <circle cx="-62" cy="2" r="6" ${O('#8a5a33', 3.5)}/><circle cx="62" cy="2" r="6" ${O('#8a5a33', 3.5)}/>`;
  const open = `<path d="M-84 -60 L-98 -170 Q-96 -184 -82 -184 H66 Q82 -184 84 -168 L84 -60Z" ${O(c, 6)}/><path d="M-60 -168 H60" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".4"/>
    <rect x="-84" y="-60" width="168" height="60" rx="14" ${O(cD, 6)}/><ellipse cx="0" cy="-58" rx="74" ry="12" fill="#ffe9a8" stroke="${INK}" stroke-width="4"/>
    <path d="M-50 -64 Q-40 -108 -16 -92 Q-8 -78 -10 -64Z" ${O('#7cc8ff', 4)}/><path d="M6 -64 Q16 -116 44 -96 Q54 -80 40 -64Z" ${O('#ff8fb1', 4)}/><path d="M-20 -64 Q-6 -92 4 -64Z" ${O('#ffd23f', 4)}/>`;
  const inner = o.open ? open : body;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="88" ry="9" fill="#000" opacity=".2"/>${o.strain ? `<g style="${loop('v10shake', 0.09)}">${inner}</g>` : inner}</g>`;
};

// tente canadienne : (0,0) = centre bas ; largeur ≈ 240, hauteur ≈ 160 · o.col (toit) · o.upside = true : retournée, toit au sol · o.flap = false : porte fermée
export const tent = (x = 0, y = 0, s = 1, o = {}) => {
  const c = o.col || '#ff6f95', cD = o.colD || '#e04a78';
  const body = `<path d="M-120 0 L0 -160 L120 0Z" ${O(c, 6)}/><path d="M0 -160 L120 0 H52 Z" fill="${cD}" opacity=".55"/><path d="M-120 0 L0 -160 L120 0Z" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M-34 0 L0 -88 L34 0Z" ${O(o.flap === false ? c : '#3a2a4a', 5)}/>${o.flap === false ? '' : `<path d="M-34 0 L-6 -78 Q-14 -30 -52 0Z" ${O('#fff1d0', 4)}/><path d="M34 0 L8 -70 Q16 -30 52 0Z" ${O('#fff1d0', 4)}/>`}
    <path d="M-78 -64 L-30 -138" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".35"/>
    <path d="M0 -160 V-182" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M0 -182 L22 -174 L0 -166Z" ${O('#ffd23f', 3.5)}/>
    <path d="M-120 0 L-170 6 M120 0 L170 6" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><path d="M-170 0 v14 M170 0 v14" stroke="#c98a4e" stroke-width="7" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="150" ry="10" fill="#000" opacity=".18"/>${o.upside ? `<g transform="rotate(180 0 -80)">${body}</g>` : body}</g>`;
};

// canne à pêche : (0,0) = main (poignée), la canne part vers le haut-droite · rot = rotation en ° · o.len = longueur du fil (150) · o.bob = false : sans flotteur
// o.catch = svg accroché au bout du fil (botte, poisson…) · o.bite = [t…] : le flotteur plonge
export const fishingRod = (x = 0, y = 0, s = 1, rot = 0, o = {}) => {
  const len = o.len ?? 150, tx = 250, ty = -170;
  const bites = [].concat(o.bite ?? []).map((t) => ao({ n: 'v10bite', d: 0.9, t }));
  const end = o.catch ? o.catch : o.bob === false ? '' : `<g style="${bites.length ? anims(bites) : ''}"><circle r="11" ${O('#fff', 3.5)}/><path d="M-11 0 A11 11 0 0 1 11 0Z" fill="#e8434e" stroke="${INK}" stroke-width="3"/><path d="M0 -11 V-20" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></g>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-14 8 L${tx} ${ty}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-14 8 L${tx} ${ty}" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/>
  <rect x="-22" y="-2" width="40" height="18" rx="8" ${O('#e8434e', 4)} transform="rotate(-34 0 8)"/><circle cx="14" cy="-8" r="10" ${O('#cfd2dc', 3.5)}/>
  <path d="M${tx} ${ty} Q${tx + 24} ${ty + len * 0.4} ${tx + 22} ${ty + len}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <g transform="translate(${tx + 22} ${ty + len})">${end}</g></g>`;
};

// glace en cornet : (0,0) = pointe du cornet ; n boules (1–5), hauteur ≈ 90 + 36 n · o.drip = true : une coulée · o.cherry = true : cerise
export const iceCone = (x = 0, y = 0, s = 1, n = 1, o = {}) => {
  const cols = o.cols || ['#ff8fb8', '#9be8c8', '#fff1b0', '#ffb36b', '#c7a3ff'];
  const sc = (i) => `<g transform="translate(0 ${-96 - i * 36})"><path d="M-27 -2 Q-31 12 -22 10 Q-15 18 -7 10 Q1 18 9 10 Q17 18 23 10 Q31 12 27 -2Z" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cy="-14" r="26" ${O(cols[i % 5], 4.5)}/><ellipse cx="-10" cy="-25" rx="7.5" ry="4.5" fill="#fff" opacity=".65" transform="rotate(-30 -10 -25)"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -96 L0 0 L30 -96Z" ${O('#e8b86a', 4.5)}/><path d="M-20 -72 L18 -72 M-12 -48 L12 -48 M-24 -90 L9 -20 M24 -90 L-9 -20" stroke="#b97a33" stroke-width="3" stroke-linecap="round"/>
  ${Array.from({ length: n }, (_, i) => sc(i)).join('')}${o.cherry ? `<g transform="translate(0 ${-96 - n * 36 - 6})"><circle r="10" ${O('#e8434e', 3.5)}/><path d="M0 -10 Q6 -22 14 -22" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>` : ''}
  ${o.drip ? `<path d="M22 -86 Q30 -70 24 -58 Q14 -56 16 -70Z" ${O(cols[0], 3)}/>` : ''}</g>`;
};

// lampion en papier : (0,0) = point d'accroche (haut) ; hauteur ≈ 100 · o.col · o.sway = false : immobile
export const lampion = (x = 0, y = 0, s = 1, col = '#ff6f95', o = {}) => {
  const n = Math.round(x + y);
  const body = `<path d="M0 0 V14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cy="40" r="42" fill="#ffe9a8" opacity=".35" style="animation:v10glow ${1.4 + (n % 4) * 0.3}s ease-in-out infinite alternate"/>
    <rect x="-12" y="12" width="24" height="9" rx="3" ${O('#8a5a33', 3.5)}/><ellipse cy="52" rx="28" ry="32" ${O(col, 4.5)}/><path d="M-12 22 Q-28 52 -12 82 M12 22 Q28 52 12 82 M0 20 V84" stroke="${INK}" stroke-width="3" fill="none" opacity=".45"/>
    <ellipse cx="-11" cy="40" rx="6" ry="12" fill="#fff" opacity=".45" transform="rotate(12 -11 40)"/><rect x="-12" y="82" width="24" height="9" rx="3" ${O('#8a5a33', 3.5)}/><path d="M0 91 V104 M-6 91 L-9 102 M6 91 L9 102" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="${o.sway === false ? '' : `transform-origin:0px 0px;${loop('v10sway', 1.6 + (n % 5) * 0.25)}`}">${body}</g></g>`;
};

// guirlande de lampions : fil de (x0,y0) à (x1,y1), n lampions de couleurs alternées, affaissée de `sag`
export const lampions = (x0 = 40, y0 = 70, x1 = 1240, y1 = 70, sag = 40, n = 7, s = 0.8) => {
  const P = (u) => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + Math.sin(Math.PI * u) * sag];
  let d = `M${x0} ${y0}`; for (let i = 1; i <= 24; i++) { const [x, y] = P(i / 24); d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
  const cols = ['#ff6f95', '#ffd23f', '#7cc8ff', '#9be08a', '#ff9f43', '#c7a3ff'];
  return `<path d="${d}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>${Array.from({ length: n }, (_, i) => { const [x, y] = P((i + 0.5) / n); return lampion(+x.toFixed(0), +y.toFixed(0), s, cols[i % 6]); }).join('')}`;
};

// parasol de plage : (0,0) = pied du mât ; hauteur ≈ 260, largeur ≈ 300 · o.col (rayures colorées / blanches)
export const parasol = (x = 0, y = 0, s = 1, o = {}) => {
  const c = o.col || '#e8434e';
  const seg = (a, b, col) => `<path d="M${a} -218 Q${(a + b) / 2} -262 ${b} -218 L${b * 0.9} -206Z" fill="${col}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="50" ry="8" fill="#000" opacity=".15"/><path d="M0 0 V-226" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 0 V-226" stroke="#e8d3a8" stroke-width="5" stroke-linecap="round"/>
  <path d="M-150 -204 Q-130 -300 0 -304 Q130 -300 150 -204 Q112 -222 75 -204 Q38 -222 0 -204 Q-38 -222 -75 -204 Q-112 -222 -150 -204Z" ${O('#fff', 5)}/>
  ${[[-130, -80], [-26, 26], [80, 130]].map(([a, b]) => `<path d="M${a} -208 Q${(a + b) / 2 - 10} -300 ${b} -208 Q${(a + b) / 2} -222 ${a} -208Z" fill="${c}"/>`).join('')}
  <path d="M-150 -204 Q-130 -300 0 -304 Q130 -300 150 -204 Q112 -222 75 -204 Q38 -222 0 -204 Q-38 -222 -75 -204 Q-112 -222 -150 -204Z" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <ellipse cx="-60" cy="-270" rx="34" ry="7" fill="#fff" opacity=".5" transform="rotate(-14 -60 -270)"/></g>`;
};

// bouée canard / anneau : (0,0) = centre ; diamètre ≈ 130 · o.col · o.float = true : flotte doucement (v10bob)
export const buoy = (x = 0, y = 0, s = 1, o = {}) => {
  const c = o.col || '#ffd23f';
  const ring = `<ellipse rx="66" ry="34" ${O(c, 6)}/><ellipse rx="26" ry="12" fill="#7cc8ff" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return `<path d="M${(Math.cos(a) * 30).toFixed(0)} ${(Math.sin(a) * 15).toFixed(0)} L${(Math.cos(a) * 64).toFixed(0)} ${(Math.sin(a) * 32).toFixed(0)}" stroke="#fff" stroke-width="12" stroke-linecap="butt" opacity=".9"/>`; }).join('')}
    <ellipse rx="66" ry="34" fill="none" stroke="${INK}" stroke-width="6"/><ellipse rx="26" ry="12" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="-34" cy="-14" rx="14" ry="5" fill="#fff" opacity=".6" transform="rotate(-20 -34 -14)"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="${o.float ? loop('v10bob', 1.3) : ''}">${ring}</g></g>`;
};

// botte en caoutchouc (prise de pêche) : (0,0) = dessous ; hauteur ≈ 100
export const boot = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-26 -100 H18 V-40 Q50 -30 54 -10 Q54 4 40 4 H-26Z" ${O('#e8b300', 5)}/><rect x="-30" y="-108" width="52" height="16" rx="6" ${O('#c99500', 4.5)}/><path d="M-20 -80 V-30" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/><path d="M-26 -6 H54" stroke="${INK}" stroke-width="4"/><path d="M14 14 q-4 10 0 14 q6 -4 0 -14Z" fill="#8fd3ff" stroke="${INK}" stroke-width="2.5"/></g>`;

// château de sable : (0,0) = base ; largeur ≈ 220, hauteur ≈ 170 · o.flag = false : sans fanion
export const sandcastle = (x = 0, y = 0, s = 1, o = {}) => {
  const sand = '#f0cf8a', sandD = '#d9b068';
  const tower = (cx, w, h) => `<rect x="${cx - w / 2}" y="${-h}" width="${w}" height="${h}" ${O(sand, 4.5)}/>${[-1, 0, 1].map((k) => `<rect x="${cx + k * w * 0.32 - 7}" y="${-h - 12}" width="14" height="14" ${O(sand, 3.5)}/>`).join('')}<path d="M${cx - w / 2 + 8} ${-h + 18} v${h * 0.5}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="130" ry="14" fill="${sandD}" opacity=".7"/>${tower(-72, 52, 100)}${tower(72, 52, 100)}<rect x="-80" y="-80" width="160" height="80" ${O(sand, 4.5)}/>${tower(0, 64, 134)}
  <path d="M-22 0 V-30 Q0 -52 22 -30 V0Z" fill="#3a2a4a" stroke="${INK}" stroke-width="4"/>${[-30, 30].map((k) => `<rect x="${k - 8}" y="-62" width="16" height="22" rx="8" fill="#3a2a4a" stroke="${INK}" stroke-width="3.5"/>`).join('')}
  ${o.flag === false ? '' : `<path d="M0 -146 V-196" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M0 -196 L34 -184 L0 -172Z" ${O('#e8434e', 3.5)}/>`}</g>`;
};

// billet de train : (0,0) = centre ; 70x36
export const ticket = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-36 -18 H36 V-6 a6 6 0 0 0 0 12 V18 H-36 V6 a6 6 0 0 0 0 -12Z" ${O('#fff3a6', 4)}/><path d="M14 -18 V18" stroke="${INK}" stroke-width="2.5" stroke-dasharray="4 4"/><path d="M-26 -6 h30 M-26 6 h22" stroke="#e8434e" stroke-width="4" stroke-linecap="round"/><circle cx="26" cy="0" r="5" fill="#7cc8ff" stroke="${INK}" stroke-width="2.5"/></g>`;

// panneau « CAMPING » sur poteau : (0,0) = pied du poteau ; hauteur ≈ 230, largeur ≈ 230
export const campSign = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="46" ry="7" fill="#000" opacity=".18"/><rect x="-9" y="-190" width="18" height="190" rx="6" ${O('#9b6a3c', 4.5)}/>
  <rect x="-110" y="-232" width="220" height="62" rx="14" ${O('#3fae55', 6)}/><rect x="-100" y="-222" width="200" height="42" rx="8" fill="none" stroke="#fff" stroke-width="3" opacity=".75"/><text x="0" y="-190" style="font-size:34px;fill:#fffbe6;letter-spacing:2px">CAMPING</text>
  <path d="M-70 -228 l10 -10 M-40 -230 l6 -12" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>${[-1, 1].map((k) => `<circle cx="${k * 98}" cy="-218" r="4" fill="#fff3a6"/>`).join('')}</g>`;

// barrière du camping : (0,0) = pied du poteau (à droite), la lisse part vers la gauche (longueur ≈ 340) · o.lift = [t0, durée] : elle se lève (84°), o.up = true : déjà levée
export const gate = (x = 0, y = 0, s = 1, o = {}) => {
  const bar = `<rect x="-340" y="-14" width="352" height="28" rx="12" ${O('#fff', 5)}/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${-330 + i * 70} -12 h34 l-12 24 h-34Z" fill="#e8434e"/>`).join('')}<rect x="-340" y="-14" width="352" height="28" rx="12" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="-326" cy="0" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><ellipse cx="-200" cy="-8" rx="70" ry="4" fill="#fff" opacity=".5"/>`;
  const L = o.lift ? `animation:v10lift ${o.lift[1]}s ease-in-out ${o.lift[0]}s 1 normal both` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="50" ry="8" fill="#000" opacity=".18"/><rect x="-26" y="-132" width="52" height="132" rx="10" ${O('#cfd2dc', 5)}/><rect x="-26" y="-132" width="52" height="30" rx="10" ${O('#e8434e', 5)}/><circle cy="-70" r="10" ${O('#ffd23f', 4)}/>
  <g transform="translate(0 -110)"><g style="transform-origin:0px 0px;${o.up ? 'transform:rotate(-84deg)' : L}">${bar}</g></g></g>`;
};

// charrette-glacière de Marius : (0,0) = sol sous les roues ; largeur ≈ 300 (poignée à gauche), hauteur ≈ 330 avec parasol · o.parasol = false
export const iceCart = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="150" ry="11" fill="#000" opacity=".2"/>
  ${o.parasol === false ? '' : `<path d="M20 -128 V-250" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M20 -128 V-250" stroke="#e8d3a8" stroke-width="5" stroke-linecap="round"/>
  <path d="M-86 -236 Q-70 -312 20 -314 Q110 -312 126 -236 Q98 -250 73 -236 Q46 -250 20 -236 Q-6 -250 -33 -236 Q-60 -250 -86 -236Z" ${O('#fff', 5)}/>${[[-74, -26], [-26, 20], [20, 66], [66, 114]].map(([a, b], i) => i % 2 === 0 ? `<path d="M${a} -240 Q${(a + b) / 2} -308 ${b} -240 Q${(a + b) / 2} -250 ${a} -240Z" fill="#e8434e"/>` : '').join('')}
  <path d="M-86 -236 Q-70 -312 20 -314 Q110 -312 126 -236 Q98 -250 73 -236 Q46 -250 20 -236 Q-6 -250 -33 -236 Q-60 -250 -86 -236Z" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-34" cy="-292" rx="26" ry="6" fill="#fff" opacity=".6" transform="rotate(-12 -34 -292)"/>`}
  <path d="M-150 -86 L-100 -96" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-150 -86 L-100 -96" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/><rect x="-170" y="-96" width="34" height="14" rx="7" ${O('#8a5a33', 4)}/>
  <rect x="-110" y="-136" width="260" height="112" rx="18" ${O('#ffd23f', 6)}/><rect x="-110" y="-136" width="260" height="30" rx="14" ${O('#fff', 5)}/>
  <rect x="-60" y="-100" width="150" height="56" rx="10" ${O('#bfe6ff', 4.5)}/><path d="M-48 -90 l22 0" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  ${[['#ff8fb8', -36], ['#9be8c8', 0], ['#fff1b0', 36], ['#ffb36b', 72]].map(([c, cx]) => `<circle cx="${cx}" cy="-66" r="13" ${O(c, 3.5)}/>`).join('')}
  <text x="-6" y="-112" style="font-size:20px;fill:${INK};letter-spacing:2px">GLACES</text>
  <rect x="-100" y="-60" width="24" height="26" rx="5" ${O('#e8434e', 3.5)}/><path d="M-96 -48 h16" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-70" cy="-128" rx="30" ry="6" fill="#fff" opacity=".45"/>
  ${[-70, 90].map((wx) => `<circle cx="${wx}" cy="-22" r="30" ${O('#4a4458', 6)}/><circle cx="${wx}" cy="-22" r="12" ${O('#cfd2dc', 4)}/><path d="M${wx} -50 V6 M${wx - 28} -22 H${wx + 28}" stroke="#cfd2dc" stroke-width="3"/>`).join('')}</g>`;

// train : (0,0) = rails sous la locomotive (au centre), les wagons partent vers la gauche ; longueur ≈ 280 + 330 par wagon, hauteur ≈ 250
// o.wagons (2) · o.smoke = false · o.open = true : portes ouvertes (rectangle noir) · o.cols = couleurs des wagons
export const train = (x = 0, y = 0, s = 1, o = {}) => {
  const n = o.wagons ?? 2, cols = o.cols || ['#4a90e2', '#ffd23f', '#9be08a', '#c7a3ff'];
  const wheel = (cx, r = 30) => `<circle cx="${cx}" cy="${-r}" r="${r}" ${O('#4a4458', 6)}/><circle cx="${cx}" cy="${-r}" r="${r * 0.4}" ${O('#cfd2dc', 4)}/><path d="M${cx} ${-r * 1.8} V${-r * 0.2}" stroke="#cfd2dc" stroke-width="3"/>`;
  const wagon = (cx, c) => `<g transform="translate(${cx} 0)"><rect x="-150" y="-200" width="300" height="150" rx="18" ${O(c, 6)}/><rect x="-150" y="-200" width="300" height="26" rx="12" fill="#fff" opacity=".35"/><path d="M-150 -62 H150" stroke="${INK}" stroke-width="5"/>
    ${[-104, -54, 98].map((wx) => `<rect x="${wx - 24}" y="-164" width="48" height="52" rx="14" ${O('#bfe6ff', 4.5)}/><path d="M${wx - 14} -150 l14 -4" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join('')}
    <rect x="-6" y="-170" width="52" height="120" rx="8" ${O(o.open ? '#3a2a4a' : '#e8d3a8', 4.5)}/>${o.open ? '' : `<path d="M20 -166 V-54" stroke="${INK}" stroke-width="3.5"/>`}
    <rect x="-150" y="-50" width="300" height="12" fill="${INK}"/>${wheel(-100, 26)}${wheel(100, 26)}<ellipse cx="-90" cy="-188" rx="34" ry="5" fill="#fff" opacity=".4"/></g>`;
  const loco = `<g><rect x="-110" y="-120" width="250" height="84" rx="30" ${O('#e8434e', 6)}/><rect x="-142" y="-216" width="104" height="180" rx="16" ${O('#c7313c', 6)}/><rect x="-154" y="-232" width="128" height="26" rx="12" ${O('#4a4458', 5)}/>
    <rect x="-124" y="-186" width="60" height="56" rx="14" ${O('#bfe6ff', 4.5)}/><path d="M-112 -172 l16 -4" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <rect x="66" y="-176" width="34" height="62" rx="8" ${O('#4a4458', 5)}/><path d="M56 -176 H110 L98 -202 H68Z" ${O('#4a4458', 5)}/>
    <circle cx="140" cy="-80" r="12" ${O('#fff3a6', 4)}/><path d="M138 -36 L176 -10 H140Z" ${O('#ffd23f', 4.5)}/><rect x="-110" y="-56" width="250" height="14" rx="4" fill="${INK}"/>
    <ellipse cx="-30" cy="-108" rx="60" ry="7" fill="#fff" opacity=".35"/><path d="M-60 -92 H110" stroke="#ffd23f" stroke-width="7" stroke-linecap="round"/>${wheel(-86, 36)}${wheel(-8, 28)}${wheel(66, 28)}${wheel(120, 24)}<path d="M-86 -36 H120" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-86 -36 H120" stroke="#cfd2dc" stroke-width="3" stroke-linecap="round"/></g>`;
  const smoke = o.smoke === false ? '' : Array.from({ length: 3 }, (_, i) => `<g transform="translate(83 -208)"><g style="animation:v10smoke 2.4s ease-out ${i * 0.8}s infinite"><circle r="22" fill="#fff" stroke="#dbe3ee" stroke-width="3"/></g></g>`).join('');
  const couplers = Array.from({ length: n }, (_, i) => `<rect x="${-150 - i * 330 - 30}" y="-70" width="40" height="10" rx="4" ${O('#4a4458', 3.5)}/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: n }, (_, i) => wagon(-300 - i * 330, cols[i % cols.length])).join('')}${couplers}${loco}${smoke}</g>`;
};

// ═════════════════════ fonds ═════════════════════

// 1 · classe le dernier jour : tableau avec soleil et valise dessinés, fanions « VACANCES », fenêtre d'été. o.h, o.m = horloge (8h00)
export const lastDay = (o = {}) => {
  const { h = 8, m = 0 } = o;
  const drawing = `<g transform="translate(410 190)"><g style="animation:spin 20s linear infinite;transform-origin:0px 0px">${Array.from({ length: 8 }, (_, i) => `<path d="M0 -58 l7 -16 l7 16" stroke="#ffe14a" stroke-width="6" fill="none" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="38" fill="#ffd23f" stroke="#fff" stroke-width="4"/><path d="M-14 8 q14 12 28 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-12" cy="-6" r="4" fill="#fff"/><circle cx="12" cy="-6" r="4" fill="#fff"/></g>
    <path d="M330 300 Q380 270 430 300 T530 300 T630 300" stroke="#7cc8ff" stroke-width="7" fill="none" stroke-linecap="round"/>
    <g transform="translate(800 280)"><rect x="-44" y="-50" width="88" height="62" rx="10" fill="none" stroke="#ffb36b" stroke-width="6"/><path d="M-14 -50 v-14 h28 v14" stroke="#ffb36b" stroke-width="6" fill="none" stroke-linecap="round"/></g>
    <text x="690" y="212" style="font-size:60px;fill:#fff;font-family:Fredoka,'Chalkboard SE',sans-serif">Vacances !</text>`;
  const letters = 'VACANCES'.split('');
  const flags = `<path d="M-20 22 Q640 60 1300 22" stroke="${INK}" stroke-width="4" fill="none"/>${letters.map((c, i) => { const x = 130 + i * 146, y = 28 + Math.sin(((x + 20) / 1280) * Math.PI) * 20; return `<g transform="translate(${x} ${y.toFixed(0)}) rotate(${i % 2 ? 4 : -4})"><path d="M-30 0 H30 L25 54 H-25Z" ${O(['#ff8fb1', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff', '#ffb36b'][i % 6], 3.5)}/><text y="40" style="font-size:32px;fill:${INK}">${c}</text></g>`; }).join('')}`;
  return `<rect x="${X0}" width="${WW}" height="${H}" fill="#ffe9bd"/>${wall}${windowEl(`<g transform="translate(1160 160)"><circle r="30" fill="#ffd23f" stroke="${INK}" stroke-width="4"/></g>${cloud(1040, 230, 0.5)}`)}${board(drawing)}${wallClock(h, m, 150, 200)}${flags}`;
};

// 2 · quai de gare : bâtiment à gauche avec horloge, quai, lampadaires, rails, train à droite (o.train = false pour le poser soi-même avec train()). o.h, o.m = horloge (10h00) · o.trainX = décalage du train
export const platform = (o = {}) => {
  const { h = 10, m = 0, withTrain = o.train !== false, trainX = 0 } = o;
  const lamp = (lx) => `<g transform="translate(${lx} 580)"><rect x="-6" y="-210" width="12" height="212" rx="4" ${O('#4a4458', 4)}/><path d="M-30 -210 H30 L22 -240 H-22Z" ${O('#2fae66', 4.5)}/><circle cy="-198" r="9" ${O('#fff3a6', 3.5)}/></g>`;
  return `${skyW('day', 520)}<g style="animation:cdrift 16s ease-in-out infinite alternate">${cloud(300, 100, 0.8)}${cloud(780, 70, 0.6)}${cloud(1090, 150, 0.7)}</g>
  ${hills('day').replace(/V560H0Z/g, 'V520H0Z')}
  <g transform="translate(40 484)"><rect x="0" y="-300" width="400" height="300" rx="10" ${O('#ffe9a8', 6)}/><path d="M-24 -300 L200 -392 L424 -300Z" ${O('#c9283e', 6)}/><rect x="30" y="-170" width="76" height="100" rx="8" ${O('#9ad6ff', 5)}/><rect x="124" y="-170" width="76" height="100" rx="8" ${O('#9ad6ff', 5)}/>
    <rect x="270" y="-190" width="96" height="190" rx="8" ${O('#a8743f', 5)}/><circle cx="348" cy="-92" r="8" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><rect x="110" y="-224" width="150" height="38" rx="10" ${O('#2fae66', 5)}/><text x="185" y="-196" style="font-size:32px;fill:#fff;letter-spacing:4px">GARE</text></g>
  ${wallClock(h, m, 240, 214)}
  <rect x="${X0}" y="484" width="${WW}" height="70" fill="#7a6a5c"/><rect x="${X0}" y="484" width="${WW}" height="10" fill="#9a8a7a"/>
  ${Array.from({ length: 36 }, (_, i) => `<rect x="${X0 + i * 46}" y="528" width="18" height="12" rx="3" ${O('#8a5a33', 3)}/>`).join('')}<rect x="${X0}" y="520" width="${WW}" height="9" fill="#cfd2dc" stroke="${INK}" stroke-width="4"/>
  ${withTrain ? train(1000 + trainX, 548, 1) : ''}
  <rect x="${X0}" y="${GROUND}" width="${WW}" height="${H - GROUND + 20}" fill="#e6d3b0"/><rect x="${X0}" y="${GROUND}" width="${WW}" height="14" fill="#cdb98f" stroke="${INK}" stroke-width="5"/><path d="M${X0} ${GROUND + 36} H${W + 300}" stroke="#ffd23f" stroke-width="12"/>
  ${Array.from({ length: 24 }, (_, i) => `<path d="M${X0 + i * 78} ${GROUND + 70} H${X0 + i * 78 + 48}" stroke="#d3bf96" stroke-width="5" stroke-linecap="round"/>`).join('')}
  ${lamp(620)}${lamp(1180)}
  <g transform="translate(900 700)"><rect x="-90" y="-58" width="180" height="16" rx="6" ${O('#c98a4e', 5)}/><rect x="-80" y="-42" width="16" height="42" ${O('#8a5a33', 4)}/><rect x="64" y="-42" width="16" height="42" ${O('#8a5a33', 4)}/></g>`;
};

// 3 · intérieur du wagon : banquettes, fenêtre où le paysage défile, o.tunnel = [t0, durée] : un tunnel noir passe dans la fenêtre
export const wagon = (o = {}) => {
  const land = (k) => `<g>${[0, 640].map((dx) => `<g transform="translate(${dx} 0)">${k === 0 ? `<path d="M0 360 Q100 250 200 340 Q330 220 440 330 Q540 270 640 360V420H0Z" fill="#a5e08a" stroke="${INK}" stroke-width="4"/>` : `${roundTree(120, 420, 0.5)}${roundTree(420, 420, 0.4, '#52c468')}<path d="M240 420 v-40 h40 v40" fill="none" stroke="${INK}" stroke-width="4"/><path d="M560 420 h60" stroke="#fff" stroke-width="5" opacity=".6"/>`}</g>`).join('')}</g>`;
  const tun = o.tunnel ? `<rect x="340" y="100" width="600" height="300" fill="#15122a" style="opacity:0;${an({ n: 'v10tunnel', d: o.tunnel[1], t: o.tunnel[0], f: 'both' })}"/>` : '';
  return `<rect x="${X0}" width="${WW}" height="${H}" fill="#f5dfae"/>
  ${Array.from({ length: 24 }, (_, i) => `<rect x="${X0 + i * 60}" y="0" width="30" height="470" fill="#efd39a" opacity=".6"/>`).join('')}
  <rect x="${X0}" y="440" width="${WW}" height="40" fill="#b9854f" stroke="${INK}" stroke-width="5"/>
  <rect x="320" y="80" width="640" height="340" rx="24" ${O('#a8743f', 8)}/>
  <defs><clipPath id="v10win"><rect x="340" y="100" width="600" height="300" rx="10"/></clipPath></defs>
  <rect x="340" y="100" width="600" height="300" rx="10" fill="#9ad6ff"/>
  <g clip-path="url(#v10win)">${cloud(560, 190, 0.7)}<g style="animation:v10scroll 6s linear infinite">${land(0)}</g><g style="animation:v10scroll 2.4s linear infinite">${land(1)}</g>${tun}<path d="M360 120 L470 120 L380 220Z" fill="#fff" opacity=".25"/></g>
  <rect x="340" y="100" width="600" height="300" rx="10" fill="none" stroke="${INK}" stroke-width="6"/><path d="M640 100 V400" stroke="${INK}" stroke-width="6"/><path d="M340 270 H940" stroke="${INK}" stroke-width="0"/>
  <rect x="${X0}" y="480" width="${WW}" height="${H - 480 + 20}" fill="#9a6b3e"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${X0 + i * 120} 490 V${H}" stroke="#86592f" stroke-width="5"/>`).join('')}
  <g transform="translate(60 520)"><rect x="-80" y="-170" width="150" height="170" rx="26" ${O('#e8434e', 6)}/><rect x="-100" y="-90" width="260" height="90" rx="22" ${O('#c7313c', 6)}/></g>
  <g transform="translate(1200 520)"><rect x="-70" y="-170" width="150" height="170" rx="26" ${O('#e8434e', 6)}/><rect x="-160" y="-90" width="260" height="90" rx="22" ${O('#c7313c', 6)}/></g>
`;
};

// 4 · camping : pré avec tentes en cercle, pins, chemin, feux et fanions. o.tents = false pour ne pas dessiner les tentes de fond · o.sky = 'day'|'dusk'
export const camping = (o = {}) => {
  const tone = o.sky || 'day';
  const T = [[140, 548, 0.5, '#7cc8ff'], [330, 540, 0.42, '#ffd23f'], [900, 540, 0.42, '#9be08a'], [1090, 548, 0.5, '#c7a3ff'], [1240, 552, 0.55, '#ff9f43']];
  return `${skyW(tone)}${tone === 'day' ? sun(1130, 110, 0.9) : ''}<g style="animation:cdrift 15s ease-in-out infinite alternate">${cloud(250, 120, 0.8)}${cloud(640, 80, 0.55)}${cloud(930, 150, 0.7)}</g>
  <rect x="${X0}" y="${GROUND - 160}" width="${WW}" height="170" fill="#9fdc8a"/>${hills(tone === 'day' ? 'day' : 'dusk')}
  ${[60, 210, 470, 790, 1010, 1180, 1270].map((px, i) => pine(px, 468 + (i % 2) * 16, 0.62 + (i % 3) * 0.1, i % 2 ? '#2f9a5a' : '#3fae55')).join('')}
  ${o.tents === false ? '' : T.map(([tx, ty, ts, c]) => tent(tx, ty, ts, { col: c, colD: '#00000033' })).join('')}
  <rect x="${X0}" y="${GROUND}" width="${WW}" height="${H - GROUND + 20}" fill="#8fd16e"/><rect x="${X0}" y="${GROUND}" width="${WW}" height="12" fill="#7fc35e"/>
  ${Array.from({ length: 14 }, (_, i) => { const px = X0 + 20 + i * 108 + rnd(i) * 40, py = GROUND + 40 + (i % 4) * 36; return `<path d="M${px.toFixed(0)} ${py} q-4 -14 -10 -18 M${px.toFixed(0)} ${py} q0 -16 0 -22 M${px.toFixed(0)} ${py} q4 -14 10 -18" stroke="#7fc35e" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('')}
  <path d="M${X0} 700 Q300 640 640 664 T${W + 300} 650" stroke="#e6d3a2" stroke-width="30" fill="none" stroke-linecap="round" opacity=".7"/>
  ${garland(0, 20, W, 20, 20)}`;
};

// 4bis · entrée du camping : fond de pré, cabane de Pétronille, panneau et barrière · o.lift = [t0, durée] la barrière se lève · o.up = true levée · barrière en x ≈ 860 (la lisse ferme le chemin de 520 à 860)
export const campEntrance = (o = {}) => `${camping({ tents: false, ...o })}
  <g transform="translate(1130 ${GROUND + 20})"><rect x="-90" y="-170" width="180" height="170" rx="10" ${O('#f6dcae', 6)}/><path d="M-110 -170 L0 -250 L110 -170Z" ${O('#e8434e', 6)}/><rect x="-60" y="-130" width="70" height="60" rx="8" ${O('#bfe6ff', 5)}/><rect x="30" y="-120" width="46" height="120" rx="6" ${O('#a8743f', 5)}/><path d="M-60 -74 H10" stroke="${INK}" stroke-width="5"/></g>
  ${campSign(300, GROUND + 14, 0.9)}${gate(860, GROUND + 18, 1, o)}`;

// 5 · ponton de pêche : lac, rive d'en face, ponton en bois au premier plan (pieds des personnages à DECK = 590), seau, bollards, roseaux
export const jetty = (o = {}) => `${skyW('day', 400)}<g style="animation:cdrift 18s ease-in-out infinite alternate">${cloud(240, 110, 0.8)}${cloud(720, 70, 0.6)}${cloud(1040, 140, 0.75)}</g>${sun(1120, 110, 0.9)}
  <path d="M${X0} 380 Q150 270 360 340 Q560 400 760 320 Q1000 250 ${W + 300} 360 V420 H${X0}Z" ${O('#7fcf6a', 5)}/>${pine(180, 372, 0.7)}${pine(250, 380, 0.55)}${pine(980, 346, 0.7)}${roundTree(1120, 366, 0.5)}
  <rect x="${X0}" y="390" width="${WW}" height="${H - 380}" fill="#5fc1ee"/>${[0, 1, 2, 3].map((i) => `<rect x="${X0}" y="${400 + i * 36}" width="${WW}" height="18" fill="#7cd0f6" opacity=".6"/>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<path d="M${X0 + i * 150 + rnd(i) * 60} ${430 + (i % 4) * 28} h${50 + (i % 3) * 20}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6" style="${loop('v10drift', 2.2 + (i % 4) * 0.5)}"/>`).join('')}
  <g transform="translate(900 410)"><path d="M-60 0 Q0 22 60 0 L46 -16 Q0 -2 -46 -16Z" ${O('#ffb36b', 4)}/></g>
  ${[[60, 520, 1], [1190, 530, 0.9]].map(([rx, ry, rs]) => `<g transform="translate(${rx} ${ry}) scale(${rs})">${[-16, 0, 16].map((d, i) => `<path d="M${d} 0 Q${d - 6} -60 ${d + (i - 1) * 14} -${86 + i * 10}" stroke="#3a8a3a" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="${d + (i - 1) * 14}" cy="-${92 + i * 10}" rx="7" ry="16" ${O('#8a5a33', 3.5)}/>`).join('')}</g>`).join('')}
  <rect x="${X0}" y="540" width="${WW}" height="${H - 540 + 20}" fill="#a8743f"/>
  ${Array.from({ length: 6 }, (_, i) => `<rect x="${X0}" y="${540 + i * 36}" width="${WW}" height="32" ${O(i % 2 ? '#b98350' : '#c98a4e', 4)}/>`).join('')}
  ${Array.from({ length: 22 }, (_, i) => `<path d="M${X0 + 40 + i * 80 + (i % 3) * 10} ${546 + (i % 6) * 36} h26" stroke="#8a5a33" stroke-width="4" stroke-linecap="round"/>`).join('')}
  <rect x="${X0}" y="540" width="${WW}" height="8" fill="#8a5a33"/>
  ${[80, 1200].map((px) => `<g transform="translate(${px} 548)"><rect x="-16" y="-70" width="32" height="76" rx="10" ${O('#8a5a33', 5)}/><ellipse cy="-70" rx="16" ry="6" ${O('#a8743f', 4)}/><path d="M0 -70 Q40 -70 40 -30" stroke="${INK}" stroke-width="5" fill="none"/></g>`).join('')}
  <g transform="translate(1040 640)"><path d="M-34 -50 H34 L28 0 H-28Z" ${O('#4a90e2', 5)}/><ellipse cy="-50" rx="34" ry="8" ${O('#9ad6ff', 4)}/><path d="M-34 -50 Q0 -108 34 -50" stroke="${INK}" stroke-width="5" fill="none"/><path d="M-12 -60 l22 -8" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/></g>`;

// 6 · lac pour la baignade : eau large, rive d'en face, rive de sable au premier plan (SAND = 610), bouées de bord · o.waves = false : sans rides animées
export const lake = (o = {}) => `${skyW('day', 360)}${sun(1100, 110, 0.9)}<g style="animation:cdrift 17s ease-in-out infinite alternate">${cloud(260, 110, 0.8)}${cloud(700, 80, 0.55)}${cloud(1000, 160, 0.7)}</g>
  <path d="M${X0} 330 Q120 250 330 310 Q560 370 800 290 Q1040 230 ${W + 300} 320 V380 H${X0}Z" ${O('#7fcf6a', 5)}/>${pine(120, 330, 0.7)}${pine(190, 340, 0.55)}${roundTree(1060, 318, 0.55)}${pine(1170, 310, 0.65)}
  <rect x="${X0}" y="350" width="${WW}" height="300" fill="#4fb8ec"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${X0}" y="${356 + i * 52}" width="${WW}" height="24" fill="#6fcbf3" opacity=".7"/>`).join('')}
  ${o.waves === false ? '' : Array.from({ length: 16 }, (_, i) => `<path d="M${X0 + (i % 8) * 190 + rnd(i) * 70} ${390 + Math.floor(i / 8) * 90 + (i % 3) * 30} q14 -10 28 0 q14 10 28 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7" style="${loop('v10foam', 2 + (i % 5) * 0.4)}"/>`).join('')}
  ${[[300, 470], [980, 440]].map(([bx, by]) => `<g transform="translate(${bx} ${by})"><g style="${loop('v10bob', 1.4)}"><path d="M0 0 V-40" stroke="${INK}" stroke-width="4"/><circle r="12" ${O('#e8434e', 3.5)}/></g></g>`).join('')}
  <path d="M${X0} 590 Q300 560 640 580 T${W + 300} 570 V${H + 20} H${X0}Z" ${O('#f2d796', 6)}/><path d="M${X0} 590 Q300 560 640 580 T${W + 300} 570" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".6" style="${loop('v10foam', 2.4)}"/>
  ${Array.from({ length: 22 }, (_, i) => `<ellipse cx="${(X0 + 30 + i * 70 + rnd(i) * 40).toFixed(0)}" cy="${640 + (i % 4) * 22}" rx="${5 + (i % 3) * 2}" ry="3" fill="#d9b068" opacity=".8"/>`).join('')}
  ${buoy(1100, 650, 0.6, { col: '#ff6f95' })}`;

// 7 · plage : mer, horizon, écume animée, sable (SAND = 610), coquillages · o.parasols = false · o.castle = true : un château de sable
export const beach = (o = {}) => `${skyW('day', 340)}${sun(1130, 100, 0.9)}<g style="animation:cdrift 15s ease-in-out infinite alternate">${cloud(300, 100, 0.8)}${cloud(740, 70, 0.55)}${cloud(1000, 150, 0.7)}</g>
  <rect x="${X0}" y="320" width="${WW}" height="${H}" fill="#3fb0e6"/>${[0, 1, 2, 3].map((i) => `<rect x="${X0}" y="${330 + i * 46}" width="${WW}" height="22" fill="#62c6f2" opacity=".75"/>`).join('')}<path d="M${X0} 320 H${W + 300}" stroke="#bfe9ff" stroke-width="5"/>
  ${[[180, 392], [520, 440], [940, 400]].map(([bx, by], i) => `<g transform="translate(${bx} ${by})"><g style="${loop('v10bob', 1.8 + i * 0.3)}"><path d="M-6 -6 V-62 L38 -10Z" ${O('#fff', 3.5)}/><path d="M-12 -6 V-48 L-40 -10Z" ${O(['#e8434e', '#ffd23f', '#e8434e'][i], 3.5)}/><path d="M-48 -6 H46 L36 10 H-38Z" ${O('#ff9f43', 4)}/></g></g>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<path d="M${X0 + (i % 5) * 330 + rnd(i) * 90} ${380 + Math.floor(i / 5) * 70} q16 -12 32 0 q16 12 32 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7" style="${loop('v10foam', 2 + (i % 4) * 0.5)}"/>`).join('')}
  <path d="M${X0} 520 Q200 490 480 510 T${W + 300} 500 V${H + 20} H${X0}Z" fill="#f4dc9e"/><path d="M${X0} 520 Q200 490 480 510 T${W + 300} 500" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" style="${loop('v10foam', 2.6)}"/><path d="M${X0} 520 Q200 490 480 510 T${W + 300} 500" stroke="${INK}" stroke-width="5" fill="none" opacity=".35"/>
  ${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${(X0 + 20 + i * 66 + rnd(i + 3) * 40).toFixed(0)}" cy="${560 + (i % 5) * 32}" rx="${4 + (i % 3) * 2}" ry="3" fill="#dcb872" opacity=".8"/>`).join('')}
  ${[[110, 596], [1180, 664]].map(([sx, sy], i) => `<g transform="translate(${sx} ${sy}) scale(${0.8 - i * 0.1})"><path d="M-22 0 Q-30 -30 0 -34 Q30 -30 22 0Z" ${O(i ? '#ff8fb1' : '#fff3e0', 4)}/><path d="M0 -34 V0 M-12 -30 L-8 0 M12 -30 L8 0" stroke="${INK}" stroke-width="2.5" opacity=".5"/></g>`).join('')}
  ${o.parasols === false ? '' : parasol(1080, 590, 0.85, { col: '#ff9f43' }) + parasol(150, 570, 0.7, { col: '#4a90e2' })}${o.castle ? sandcastle(900, 640, 0.8) : ''}`;

// 8 · stand de glaces : plage avec la charrette de Marius (x ≈ 880) et un menu · o.cartX, o.parasols = false
export const iceStand = (o = {}) => `${beach({ parasols: false, ...o })}
  ${parasol(210, 575, 0.75, { col: '#9be08a' })}
  <g transform="translate(120 650) rotate(-4)"><rect x="-70" y="-110" width="140" height="110" rx="12" ${O('#6b4a2e', 5)}/><rect x="-60" y="-100" width="120" height="90" rx="6" fill="#2f6b4f"/>${[['#ff8fb8', -30], ['#9be8c8', 0], ['#fff1b0', 30]].map(([c, cx], i) => `<circle cx="${cx}" cy="-70" r="11" ${O(c, 3)}/><path d="M${cx - 18} -42 h36" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`).join('')}<path d="M-30 -22 h60" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/><path d="M-30 0 L-44 8 M30 0 L44 8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>
  ${iceCart(o.cartX ?? 900, 648, 1, o)}`;

// 9 · chemin des arrivées : sentier sinueux qui s'enfonce vers le camping (au fond : lueur du feu et fanions), ciel du soir · o.sky = 'dusk' (défaut) | 'day' | 'night'
export const arrivals = (o = {}) => {
  const tone = o.sky || 'dusk';
  const post = (px, py, s) => `<g transform="translate(${px} ${py}) scale(${s})"><rect x="-6" y="-100" width="12" height="102" rx="4" ${O('#9b6a3c', 3.5)}/><rect x="-5" y="-100" width="10" height="10" fill="#fff3a6" opacity="0"/><path d="M-30 -96 H30 L22 -124 H-22Z" ${O('#fff3a6', 3.5)}/><circle cy="-104" r="8" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>`;
  return `${skyW(tone, 440)}${tone === 'night' ? Array.from({ length: 18 }, (_, i) => star(rnd(i) * W, 30 + rnd(i + 30) * 260, 5 + rnd(i + 60) * 7, i)).join('') : tone === 'dusk' ? sun(240, 320, 1.1) : sun(1100, 110, 0.9)}
  <g style="animation:cdrift 16s ease-in-out infinite alternate">${cloud(300, 110, 0.8, 0.9)}${cloud(780, 80, 0.6, 0.9)}${cloud(1050, 150, 0.7, 0.9)}</g>
  <path d="M${X0} 420 Q100 330 330 390 Q560 450 800 360 Q1050 290 ${W + 300} 400 V500 H${X0}Z" fill="${tone === 'dusk' ? '#c9b46a' : '#a5e08a'}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${pine(150, 410, 0.55)}${pine(230, 420, 0.45)}${pine(1010, 380, 0.6)}${pine(1090, 392, 0.5)}
  <g transform="translate(640 430)">${[-70, -26, 20, 66].map((tx, i) => tent(tx * 1.3, i % 2 ? 4 : 0, 0.16, { col: ['#ff6f95', '#ffd23f', '#7cc8ff', '#9be08a'][i] })).join('')}<circle cx="0" cy="-10" r="60" fill="#ffb347" opacity=".14" style="animation:v10glow 1.4s ease-in-out infinite alternate"/></g>
  <rect x="${X0}" y="440" width="${WW}" height="${H - 440 + 20}" fill="${tone === 'dusk' ? '#a8b45e' : '#8fd16e'}"/><rect x="${X0}" y="440" width="${WW}" height="10" fill="${tone === 'dusk' ? '#98a450' : '#7fc35e'}" stroke="${INK}" stroke-width="4"/>
  <path d="M560 440 Q640 440 700 440 Q760 520 880 560 Q1060 610 ${W + 300} 640 V${H + 20} H${X0} V680 Q300 650 520 600 Q680 560 600 500 Q560 470 560 440Z" fill="#f1dfb0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M600 470 Q640 520 590 560 Q500 620 300 660 M690 470 Q720 520 800 560 Q980 620 1180 650" stroke="#e0c98e" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>
  ${post(90, 650, 0.8)}${post(1140, 640, 0.9)}${post(430, 540, 0.5)}${post(840, 520, 0.45)}${campSign(1020, 600, 0.55)}
  ${Array.from({ length: 12 }, (_, i) => { const px = X0 + 30 + i * 140 + rnd(i) * 40, py = 640 + (i % 3) * 22; return `<path d="M${px.toFixed(0)} ${py} q-4 -14 -10 -18 M${px.toFixed(0)} ${py} q0 -16 0 -22 M${px.toFixed(0)} ${py} q4 -14 10 -18" stroke="${tone === 'dusk' ? '#98a450' : '#7fc35e'}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('')}`;
};

// 10 · grande fête sous les lampions : clairière de nuit, guirlandes de lampions et de fanions, tables, banc, feu · o.lights = false (sans lampions) · o.tables = false · o.fire = true (feu de camp au centre) · o.sky = 'night' (défaut) | 'dusk'
export const fete = (o = {}) => {
  const { lights = true, tables = true, fire = false } = o;
  const tone = o.sky || 'night';
  const table = (tx, ty, s) => `<g transform="translate(${tx} ${ty}) scale(${s})"><ellipse cy="4" rx="150" ry="11" fill="#000" opacity=".25"/><rect x="-140" y="-96" width="280" height="22" rx="8" ${O('#fff', 5)}/>${[-1, 0, 1].map((k) => `<path d="M${k * 90 - 14} -96 h28 v22 h-28Z" fill="#ff8fa3" opacity=".8"/>`).join('')}<rect x="-120" y="-74" width="14" height="74" ${O('#8a5a33', 4)}/><rect x="106" y="-74" width="14" height="74" ${O('#8a5a33', 4)}/>
    <g transform="translate(-80 -96)"><rect x="-30" y="-14" width="60" height="14" rx="4" ${O('#ffe9a8', 3.5)}/><rect x="-24" y="-38" width="48" height="26" rx="6" ${O('#ff8fb8', 3.5)}/><circle cy="-46" r="7" ${O('#e8434e', 3)}/></g>
    <g transform="translate(10 -96)">${[-30, 0, 30].map((cx, i) => `<path d="M${cx - 12} -26 L${cx - 9} 0 H${cx + 9} L${cx + 12} -26Z" ${O(['#7cc8ff', '#ffd23f', '#9be08a'][i], 3)}/>`).join('')}</g>
    <g transform="translate(96 -96)"><path d="M-22 0 Q-26 -20 0 -22 Q26 -20 22 0Z" ${O('#e8a838', 3.5)}/><path d="M-14 -12 h28" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g></g>`;
  const ground = tone === 'night' ? ['#2f5a52', '#27504a'] : ['#a8b45e', '#98a450'];
  const sk = tone === 'night' ? `${skyW('night')}${Array.from({ length: 30 }, (_, i) => star(rnd(i) * W, 20 + rnd(i + 50) * 230, 4 + rnd(i + 99) * 7, i)).join('')}<g transform="translate(1090 110) rotate(-20)"><path d="M0 -50 A50 50 0 1 0 0 50 A68 68 0 0 1 0 -50Z" ${O('#fff3a6', 5)}/></g>` : skyW('dusk');
  return `${sk}
  ${hills(tone === 'night' ? 'dark' : 'dusk')}${[50, 190, 1090, 1240].map((px, i) => pine(px, 470 + (i % 2) * 14, 0.9, tone === 'night' ? '#1f6b4a' : '#3a8a52')).join('')}
  <rect x="${X0}" y="${GROUND}" width="${WW}" height="${H - GROUND + 20}" fill="${ground[0]}"/><rect x="${X0}" y="${GROUND}" width="${WW}" height="12" fill="${ground[1]}"/>
  ${Array.from({ length: 14 }, (_, i) => { const px = X0 + 20 + i * 110 + rnd(i) * 40, py = GROUND + 44 + (i % 4) * 34; return `<path d="M${px.toFixed(0)} ${py} q-4 -14 -10 -18 M${px.toFixed(0)} ${py} q0 -16 0 -22 M${px.toFixed(0)} ${py} q4 -14 10 -18" stroke="${ground[1]}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('')}
  ${tables ? table(200, GROUND + 14, 0.8) + table(1080, GROUND + 14, 0.8) : ''}
  ${fire ? campfire(640, GROUND + 70, 1) : ''}
  ${lights ? `${[20, 640, 1260].map((px) => `<rect x="${px - 8}" y="40" width="16" height="${GROUND - 30}" rx="6" ${O('#8a5a33', 5)}/>`).join('')}${garland(20, 60, 640, 60, 34)}${garland(640, 60, 1260, 60, 34)}${lampions(20, 100, 640, 100, 46, 7, 0.75)}${lampions(640, 100, 1260, 100, 46, 7, 0.75)}
  <g opacity=".35">${[170, 460, 820, 1110].map((gx) => `<ellipse cx="${gx}" cy="${GROUND + 60}" rx="150" ry="26" fill="#ffd27a" style="animation:v10glow 1.8s ease-in-out infinite alternate"/>`).join('')}</g>` : ''}`;
};

// clairière du feu de camp (ép. 12 et 15) : raccourci de fete() sans lampions ni tables, avec feu · o.sky = 'dusk' | 'night'
export const clearing = (o = {}) => fete({ lights: false, tables: false, fire: true, sky: 'dusk', ...o });
