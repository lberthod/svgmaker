// Décor de la saison 4 (hiver à la montagne) : chaque élément est une fonction qui renvoie une chaîne SVG.
// Convention (identique à farm.mjs) : les objets sont dessinés autour de (0,0) = leur point au sol (centre bas),
// et se posent avec (x, y, s, o) ; les fonds plein écran n'ont pas de position. Sol extérieur : GROUND = 560.
// Les temps sont absolus (secondes de l'épisode). Tous les keyframes sont préfixés « s4 ».
import { W, H, INK, an, ao, anims, vis, tf, addKF } from './kit.mjs';
import { wallClock } from './classroom.mjs';

export const GROUND = 560;
export const FLOOR = 560; // sol du chalet (intérieur)

addKF(`@keyframes s4fall{from{transform:translate(0,-30px)}to{transform:translate(var(--dx),760px)}}
@keyframes s4wfall{from{transform:translate(0,0)}to{transform:translate(var(--dx),205px)}}
@keyframes s4tw{from{opacity:.2}to{opacity:1}}
@keyframes s4bulb{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes s4steam{0%{opacity:0;transform:translateY(0) scaleY(.6)}30%{opacity:.9}100%{opacity:0;transform:translateY(-46px) scaleY(1.2)}}
@keyframes s4smoke{0%{opacity:.9;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(30px,-110px) scale(1.7)}}
@keyframes s4pop{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes s4glow{from{opacity:.1;transform:scale(.94)}to{opacity:.24;transform:scale(1.06)}}
@keyframes s4flame{from{transform:scale(.92,.86) rotate(-3deg)}to{transform:scale(1.06,1.14) rotate(3deg)}}
@keyframes s4spark{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-110px)}}
@keyframes s4grow{from{transform:scaleY(.02)}to{transform:scaleY(1)}}
@keyframes s4slide{from{transform:translate(var(--x0),var(--y0))}to{transform:translate(var(--x1),var(--y1))}}
@keyframes s4puff{0%{opacity:0;transform:scale(.3)}25%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-50px) scale(1.5)}}
@keyframes s4avl{0%{transform:translate(260px,-40px) scale(.2,.1);opacity:0}15%{opacity:1}100%{transform:translate(0,0) scale(1,1);opacity:1}}
@keyframes s4wave{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const shadow = (rx) => `<ellipse cy="5" rx="${rx}" ry="${Math.max(6, rx * 0.09)}" fill="#3a5a8a" opacity=".22"/>`;

// ═════════════════════ ciel, montagnes, neige ═════════════════════

// ciel : 'day' | 'dusk' | 'night' | 'grey' (aplats en bandes)
export const snowSky = (kind = 'day') => {
  const bands = {
    day: ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#dff3ff'],
    dusk: ['#ff9f8f', '#ffb89a', '#ffd3a8', '#ffe8c0'],
    night: ['#10163f', '#161e52', '#1d2766', '#27327c'],
    grey: ['#b4c2d2', '#c3cfdc', '#d2dce6', '#e2e9f0'],
  }[kind] || [];
  return bands.map((c, i) => `<rect y="${(i * GROUND) / 4}" width="${W}" height="${GROUND / 4 + 2}" fill="${c}"/>`).join('');
};

// soleil bas et pâle d'hiver
export const lowSun = (x = 1060, y = 200, s = 1, col = '#fff3a6') => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="70" fill="${col}" opacity=".35"/><circle r="44" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="-14" cy="-14" r="10" fill="#fff" opacity=".6"/><path d="M-14 8 q14 13 28 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-14" cy="-4" r="4" fill="${INK}"/><circle cx="14" cy="-4" r="4" fill="${INK}"/><ellipse cx="-26" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/><ellipse cx="26" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/></g>`;

// chaîne de montagnes enneigées : tone 'day' | 'dusk' | 'night'
export const mountains = (tone = 'day') => {
  const c = { day: ['#a9bfe6', '#8aa6d8'], dusk: ['#c9a6c4', '#ae8ab4'], night: ['#3a4a8a', '#2e3b78'] }[tone] || ['#a9bfe6', '#8aa6d8'];
  const peak = (x, h, w, col) => `<path d="M${x - w} ${GROUND - 40} L${x - w * 0.18} ${GROUND - 40 - h * 0.78} L${x} ${GROUND - 40 - h} L${x + w * 0.2} ${GROUND - 40 - h * 0.74} L${x + w} ${GROUND - 40}Z" ${O(col, 4)}/>
    <path d="M${x - w * 0.3} ${GROUND - 40 - h * 0.7} L${x - w * 0.18} ${GROUND - 40 - h * 0.78} L${x} ${GROUND - 40 - h} L${x + w * 0.2} ${GROUND - 40 - h * 0.74} L${x + w * 0.32} ${GROUND - 40 - h * 0.66} L${x + w * 0.14} ${GROUND - 40 - h * 0.6} L${x} ${GROUND - 40 - h * 0.68} L${x - w * 0.14} ${GROUND - 40 - h * 0.58}Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  return `${peak(180, 300, 260, c[1])}${peak(520, 380, 300, c[0])}${peak(880, 320, 280, c[1])}${peak(1180, 360, 260, c[0])}`;
};

// flocons qui tombent en boucle (plein écran) ; o.n (46), o.speed (1), o.wind (px de dérive, -40), o.col
export const snowfall = (o = {}) => {
  const { n = 46, speed = 1, wind = -40, col = '#ffffff' } = o;
  return `<g>${Array.from({ length: n }, (_, i) => {
    const x = -40 + rnd(i) * (W + 80), r = 2.6 + rnd(i + 7) * 4.6, dur = (4.6 + rnd(i + 3) * 3.4) / speed, dl = -rnd(i + 11) * dur;
    return `<g transform="translate(${x.toFixed(0)} 0)"><g style="--dx:${(wind * (0.6 + rnd(i + 5))).toFixed(0)}px;animation:s4fall ${dur.toFixed(2)}s linear ${dl.toFixed(2)}s infinite"><circle r="${r.toFixed(1)}" fill="${col}" stroke="#a9c8e8" stroke-width="1.4"/></g></g>`;
  }).join('')}</g>`;
};

// sol enneigé de premier plan (à partir de GROUND)
export const snowGround = (tone = 'day') => {
  const c = { day: ['#f6faff', '#dcebf8', '#c4dcf0'], dusk: ['#ffeef0', '#f3d6dc', '#e2bcc8'], night: ['#9fb4de', '#8aa0cc', '#7389b8'] }[tone] || ['#f6faff', '#dcebf8', '#c4dcf0'];
  return `<rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${c[0]}"/>
  <path d="M0 ${GROUND + 8} Q160 ${GROUND - 18} 340 ${GROUND + 4} Q560 ${GROUND - 20} 760 ${GROUND + 6} Q980 ${GROUND - 18} 1160 ${GROUND + 2} Q1230 ${GROUND - 6} ${W} ${GROUND} V${GROUND + 34} H0Z" fill="${c[1]}"/>
  <path d="M0 ${GROUND} Q160 ${GROUND - 26} 340 ${GROUND - 4} Q560 ${GROUND - 28} 760 ${GROUND - 2} Q980 ${GROUND - 26} 1160 ${GROUND - 6} Q1230 ${GROUND - 14} ${W} ${GROUND - 8}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${Array.from({ length: 12 }, (_, i) => { const x = 50 + i * 110 + rnd(i) * 40, y = GROUND + 60 + (i % 4) * 34; return `<path d="M${x} ${y} q30 -10 60 0" stroke="${c[2]}" stroke-width="6" fill="none" stroke-linecap="round"/>`; }).join('')}`;
};

// sapin (pied en (0,0), hauteur ≈ 260) ; o.lights = ampoules qui clignotent ; o.far = plus clair (fond)
export const pine = (x = 0, y = 0, s = 1, o = {}) => {
  const g1 = o.far ? '#4f9a7a' : '#2f8a5b', g2 = o.far ? '#5aa886' : '#3aa06a';
  const tier = (cy, w, h, col) => `<path d="M${-w} ${cy} L0 ${cy - h} L${w} ${cy}Z" ${O(col, 4.5)}/><path d="M${-w * 0.5} ${cy - h * 0.5} L0 ${cy - h} L${w * 0.5} ${cy - h * 0.5} Q${w * 0.25} ${cy - h * 0.38} 0 ${cy - h * 0.52} Q${-w * 0.25} ${cy - h * 0.38} ${-w * 0.5} ${cy - h * 0.5}Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  const lights = o.lights ? [[-30, -60], [26, -52], [-12, -118], [16, -150], [-6, -190], [34, -96]].map(([lx, ly], i) => `<circle cx="${lx}" cy="${ly}" r="6" fill="${['#ffd23f', '#ff6f61', '#7cc8ff'][i % 3]}" stroke="${INK}" stroke-width="2.5" style="animation:s4bulb ${0.9 + (i % 3) * 0.3}s ease-in-out ${i * 0.2}s infinite"/>`).join('') : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${o.far ? '' : shadow(60)}<rect x="-12" y="-30" width="24" height="34" rx="5" ${O('#8a5a33', 4)}/>
  ${tier(-18, 84, 100, g1)}${tier(-74, 66, 92, g2)}${tier(-128, 48, 84, g1)}${lights}</g>`;
};

// forêt de fond : rangée de sapins lointains
export const forest = (y = GROUND - 14) => [60, 210, 380, 560, 760, 940, 1100, 1240].map((x, i) => pine(x, y + (i % 2) * 10, 0.62 + (i % 3) * 0.08, { far: true })).join('');

// fond complet « jour de neige » : ciel, montagnes, forêt, sol ; o.kind 'day'|'dusk'|'night'|'grey', o.fall (flocons), o.sun
export const snowBg = (o = {}) => {
  const { kind = 'day', fall = false, sun = kind === 'day' } = o;
  const tone = kind === 'grey' ? 'day' : kind;
  return `${snowSky(kind)}${sun ? lowSun(1080, 150, 0.9) : ''}${kind === 'night' ? nightStars() : ''}${mountains(tone)}${forest()}${snowGround(tone)}${fall ? snowfall({}) : ''}`;
};

// étoiles qui scintillent (ciel nocturne)
export const nightStars = (n = 40, ymax = 330) => Array.from({ length: n }, (_, i) => {
  const x = rnd(i) * W, y = 20 + rnd(i + 50) * ymax, r = 4 + rnd(i + 99) * 6;
  return `<path d="M${x.toFixed(0)} ${(y - r).toFixed(0)} l${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l-${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l-${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l-${(r * 0.3).toFixed(1)} -${(r * 0.7).toFixed(1)} l-${(r * 0.7).toFixed(1)} -${(r * 0.3).toFixed(1)} l${(r * 0.7).toFixed(1)} -${(r * 0.3).toFixed(1)}Z" fill="#fff6c8" style="animation:s4tw ${1.1 + (i % 5) * 0.4}s ease-in-out ${(i % 7) * 0.25}s infinite alternate"/>`;
}).join('');

// ═════════════════════ pente et luges ═════════════════════

// hauteur de la piste à l'abscisse x (pour poser personnages et luges) ; pente descendante vers la droite
export const slopeY = (x) => 330 + x * 0.24;
export const SLOPE_DEG = (Math.atan(0.24) * 180) / Math.PI;

// fond « piste de luge » : ciel, montagnes, grande pente avec portiques rouges, sapins
export const piste = (o = {}) => {
  const { kind = 'day', fall = false } = o;
  const gate = (x) => `<g transform="translate(${x} ${slopeY(x)}) rotate(${SLOPE_DEG * 0})"><path d="M-40 0 V-96 M40 0 V-96" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-40 0 V-96 M40 0 V-96" stroke="#e8434e" stroke-width="6" stroke-linecap="round"/><path d="M-40 -90 Q0 -72 40 -90 V-72 Q0 -54 -40 -72Z" fill="#ffd23f" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
  return `${snowSky(kind)}${kind === 'day' ? lowSun(1090, 120, 0.8) : ''}${mountains(kind)}
  <path d="M0 ${slopeY(0) - 30} L${W} ${slopeY(W) - 30} V${H} H0Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M0 ${slopeY(0) + 24} L${W} ${slopeY(W) + 24} V${H} H0Z" fill="#e4f0fb"/>
  <path d="M0 ${slopeY(0) - 30} L${W} ${slopeY(W) - 30}" stroke="#bcd8f0" stroke-width="10" stroke-linecap="round" opacity=".6" transform="translate(0 20)"/>
  ${pine(70, slopeY(70) - 20, 0.8)}${pine(150, slopeY(150) - 14, 0.6)}${pine(1220, slopeY(1220) + 190, 1.1)}
  ${gate(420)}${gate(820)}${gate(1100)}
  ${Array.from({ length: 8 }, (_, i) => { const x = 160 + i * 150, y = slopeY(x) + 70 + (i % 3) * 40; return `<path d="M${x} ${y} q30 -6 70 ${6}" stroke="#bcd8f0" stroke-width="6" fill="none" stroke-linecap="round"/>`; }).join('')}
  ${fall ? snowfall({}) : ''}`;
};

// luge en bois vue de côté, avant à droite ; (0,0) = sol sous le centre ; largeur ≈ 200 ; o.slope = true : inclinée selon la pente de piste() ; o.rope (true)
export const sled = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.slope ? SLOPE_DEG : 0}) scale(${s})">${o.shadow === false ? '' : shadow(110)}
  <path d="M-96 -6 H84 Q112 -6 110 -34 Q108 -52 90 -46" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-96 -6 H84 Q112 -6 110 -34 Q108 -52 90 -46" stroke="#e8434e" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-60 -10 V-34 M50 -10 V-34" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-60 -10 V-34 M50 -10 V-34" stroke="#9b6a3c" stroke-width="6" stroke-linecap="round"/>
  <rect x="-100" y="-52" width="196" height="24" rx="10" ${O('#d99a5e', 5)}/><path d="M-70 -46 v12 M-20 -46 v12 M30 -46 v12" stroke="#a8683a" stroke-width="3.5" stroke-linecap="round"/><path d="M-90 -46 h50" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>
  <path d="M96 -38 Q150 -34 168 -6" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" opacity="${o.rope === false ? 0 : 1}"/></g>`;

// grande luge à six places (avant à droite) ; (0,0) = sol sous le centre ; largeur ≈ 700 ; places à x = -280,-170,-60,50,160,270 (assis, pose dessus à y ≈ -46)
export const bigSled = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.slope ? SLOPE_DEG : 0}) scale(${s})">${shadow(380)}
  <path d="M-340 -6 H318 Q352 -6 350 -40 Q348 -62 326 -54" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-340 -6 H318 Q352 -6 350 -40 Q348 -62 326 -54" stroke="#3b82f6" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${[-280, -90, 100, 290].map((px) => `<path d="M${px} -10 V-36" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${px} -10 V-36" stroke="#9b6a3c" stroke-width="6" stroke-linecap="round"/>`).join('')}
  <rect x="-346" y="-58" width="692" height="26" rx="12" ${O('#d99a5e', 5)}/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-300 + i * 66} -52 v14" stroke="#a8683a" stroke-width="3.5" stroke-linecap="round"/>`).join('')}<path d="M-330 -50 h120" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>
  <path d="M346 -44 Q420 -40 440 -6" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;

// traces de luge dans la neige (deux rails) de (x0,y0) à (x1,y1)
export const sledTracks = (x0, y0, x1, y1) => `<g stroke="#b6d2ea" stroke-width="6" stroke-linecap="round" fill="none" opacity=".9"><path d="M${x0} ${y0 - 6} L${x1} ${y1 - 6}"/><path d="M${x0} ${y0 + 8} L${x1} ${y1 + 8}"/></g>`;

// tas de neige tout doux ; o.grow = temps où il grandit (sinon statique)
export const snowPile = (x = 0, y = 0, s = 1, o = {}) => {
  const body = `<path d="M-130 0 Q-120 -70 -50 -84 Q0 -112 56 -86 Q122 -70 130 0Z" ${O('#fff', 5)}/><path d="M-90 -50 Q-60 -78 -20 -80" stroke="#cfe3f5" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-36" cy="-84" rx="26" ry="8" fill="#fff" opacity=".9"/><path d="M60 -30 q14 -8 30 0" stroke="#cfe3f5" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const inner = o.grow === undefined ? body : tf(body, { t0: o.grow, d: 0.7, from: 'scale(.15,.1)', to: 'scale(1,1)', e: 'cubic-bezier(.2,1.5,.4,1)', o: '0px 0px' });
  return `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
};

// avalanche douce : paquets de neige qui roulent de la droite vers (x,y) à partir de t0, puis restent
export const avalanche = (x = 0, y = 0, t0 = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[[0, 110, 1], [-70, 90, 0.8], [60, 120, 0.9], [-120, 70, 0.7]].map(([dx, h, k], i) => `<g style="${an({ n: 's4avl', d: 0.8, t: t0 + i * 0.12, f: 'both', e: 'ease-out' })}"><g transform="translate(${dx} 0)"><path d="M${-70 * k} 0 Q${-64 * k} ${-h * 0.7} 0 ${-h} Q${64 * k} ${-h * 0.7} ${70 * k} 0Z" ${O('#fff', 5)}/><path d="M${-34 * k} ${-h * 0.5} q${14 * k} ${-18 * k} ${34 * k} ${-14 * k}" stroke="#cfe3f5" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>`).join('')}</g>`;

// bonhomme de neige ; hauteur ≈ 270 ; o.upsideDown (grosse boule en haut, petite « tête » en bas) ; o.noNose ; o.noseAt (temps où la carotte apparaît)
// o.build = temps de départ : les boules apparaissent l'une après l'autre (0.5 s d'écart)
export const snowman = (x = 0, y = 0, s = 1, o = {}) => {
  const popIn = (inner, k) => (o.build === undefined ? inner : `<g style="transform-origin:0px 0px;${an({ n: 's4pop', d: 0.45, t: o.build + k * 0.5, f: 'both' })}">${inner}</g>`);
  const ball = (cy, r) => `<circle cy="${cy}" r="${r}" ${O('#fff', 5)}/><ellipse cx="${-r * 0.36}" cy="${cy - r * 0.42}" rx="${r * 0.24}" ry="${r * 0.14}" fill="#dcebf8" transform="rotate(-30 ${-r * 0.36} ${cy - r * 0.42})"/>`;
  const rs = o.upsideDown ? [34, 46, 62] : [62, 46, 34]; // du bas vers le haut
  const c0 = -rs[0], c1 = -2 * rs[0] - rs[1] + 10, c2 = c1 - rs[1] - rs[2] + 10;
  const centers = [c0, c1, c2], head = o.upsideDown ? 0 : 2;
  const hy = centers[head], hr = rs[head];
  const nose = o.noNose ? '' : `<path d="M${hr * 0.1} ${hy + 4} L${hr * 1.15} ${hy + 12} L${hr * 0.1} ${hy + 18}Z" ${O('#ff9f43', 3.5)}/>`;
  const noseEl = o.noseAt !== undefined ? `<g style="transform-origin:${hr * 0.1}px ${hy + 10}px;${an({ n: 's4pop', d: 0.3, t: o.noseAt, f: 'both' })}">${nose || `<path d="M${hr * 0.1} ${hy + 4} L${hr * 1.15} ${hy + 12} L${hr * 0.1} ${hy + 18}Z" ${O('#ff9f43', 3.5)}/>`}</g>` : nose;
  const face = `<circle cx="${-hr * 0.3}" cy="${hy - 8}" r="5.5" fill="${INK}"/><circle cx="${hr * 0.42}" cy="${hy - 8}" r="5.5" fill="${INK}"/><circle cx="${-hr * 0.3 - 1.5}" cy="${hy - 10}" r="1.8" fill="#fff"/><circle cx="${hr * 0.42 - 1.5}" cy="${hy - 10}" r="1.8" fill="#fff"/>
    ${[-2, -1, 0, 1, 2].map((k) => `<circle cx="${k * hr * 0.2 + hr * 0.08}" cy="${hy + 26 + Math.abs(k) * 2.5 * (hr / 34) - 6}" r="3.2" fill="${INK}"/>`).join('')}
    <ellipse cx="${-hr * 0.5}" cy="${hy + 8}" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="${hr * 0.66}" cy="${hy + 12}" rx="7" ry="4.5" fill="#ff8fa3" opacity=".6"/>`;
  const mid = centers[1], midR = rs[1];
  const arms = `<path d="M${-midR + 6} ${mid - 6} L${-midR - 56} ${mid - 36} M${-midR - 34} ${mid - 26} l-6 -20" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${-midR + 6} ${mid - 6} L${-midR - 56} ${mid - 36} M${-midR - 34} ${mid - 26} l-6 -20" stroke="#8a5a33" stroke-width="6" stroke-linecap="round"/><path d="M${midR - 6} ${mid - 6} L${midR + 56} ${mid - 40} M${midR + 34} ${mid - 28} l8 -18" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${midR - 6} ${mid - 6} L${midR + 56} ${mid - 40} M${midR + 34} ${mid - 28} l8 -18" stroke="#8a5a33" stroke-width="6" stroke-linecap="round"/>`;
  const scarf = `<g transform="translate(0 ${o.upsideDown ? c1 - rs[1] + 8 : c2 + rs[2] - 8})"><path d="M${-rs[2] * 0.9} 0 Q0 ${rs[2] * 0.5} ${rs[2] * 0.9} 0 L${rs[2] * 0.8} ${-12} Q0 ${rs[2] * 0.3 - 12} ${-rs[2] * 0.8} -12Z" ${O('#e8434e', 4)}/><path d="M${rs[2] * 0.3} 6 l6 34 l22 -4 l-8 -30Z" ${O('#e8434e', 4)}/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(86)}
    ${popIn(ball(c0, rs[0]), 0)}${popIn(ball(c1, rs[1]) + arms, 1)}${popIn(ball(c2, rs[2]) + (o.upsideDown ? '' : ''), 2)}
    ${popIn(`${face}${noseEl}${o.upsideDown ? '' : ''}`, 3)}${popIn(scarf, 3)}</g>`;
};

// ═════════════════════ le chalet (extérieur) ═════════════════════

// chalet en rondins, vue de face ; (0,0) = centre bas ; largeur ≈ 520, hauteur ≈ 340
// o.open = temps d'ouverture de la porte (ou true = ouverte) ; o.smoke (true) ; o.lit (true) fenêtres allumées ; o.snowRoof (true)
export const chalet = (x = 0, y = 0, s = 1, o = {}) => {
  const { open, smoke = true, lit = true } = o;
  const door = (() => {
    const leaf = `<rect x="-42" y="-128" width="84" height="128" rx="8" ${O('#a8683a', 5)}/><path d="M0 -128 V0 M-42 -64 H42" stroke="#7d4a28" stroke-width="4"/><circle cx="26" cy="-62" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle cx="-21" cy="-96" r="9" fill="#ffe8a8" stroke="${INK}" stroke-width="3"/>`;
    const hole = `<rect x="-42" y="-128" width="84" height="128" rx="8" fill="#3a2418"/><rect x="-36" y="-122" width="72" height="122" rx="5" fill="#ffc86b"/><path d="M-36 -4 H36" stroke="#e8a838" stroke-width="6"/>`;
    if (open === undefined) return leaf;
    return `${hole}${open === true ? `<g transform="translate(-42 0) scale(.16 1) translate(42 0)">${leaf}</g>` : tf(leaf, { t0: open, d: 0.5, from: 'scaleX(1)', to: 'scaleX(.16)', e: 'ease-out', o: '-42px 0px' })}`;
  })();
  const win = (wx) => `<g transform="translate(${wx} -104)"><rect x="-44" y="-44" width="88" height="88" rx="10" ${O(lit ? '#ffe08a' : '#bfe6ff', 5)}/><path d="M0 -44 V44 M-44 0 H44" stroke="${INK}" stroke-width="5"/><path d="M-34 -32 l16 -2 M-34 -22 l8 -1" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <rect x="-70" y="-44" width="24" height="88" rx="6" ${O('#e8434e', 4)}/><rect x="46" y="-44" width="24" height="88" rx="6" ${O('#e8434e', 4)}/><path d="M-58 -10 q-7 -9 0 -13 q7 4 0 13z M58 -10 q-7 -9 0 -13 q7 4 0 13z" fill="#fff"/>
    <path d="M-56 44 H56 V64 H-56Z" ${O('#8a5a33', 4)}/><path d="M-44 64 q10 -8 20 0 q10 -10 22 0 q10 -8 20 0" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
  const smk = smoke ? [0, 1, 2].map((i) => `<g transform="translate(150 -318)"><g style="${an({ n: 's4smoke', d: 2.4, t: i * 0.8, c: 999 })}"><circle r="18" fill="#f2f4f8" stroke="#c9d3e0" stroke-width="3"/></g></g>`).join('') : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(300)}
  ${smk}
  <rect x="132" y="-322" width="42" height="90" rx="6" ${O('#b8b5ae', 5)}/><rect x="126" y="-330" width="54" height="16" rx="6" ${O('#cfccc4', 5)}/>
  <rect x="-230" y="-180" width="460" height="180" rx="10" ${O('#c98a4e', 6)}/>
  ${Array.from({ length: 5 }, (_, i) => `<path d="M-226 ${-150 + i * 36} H226" stroke="#a8683a" stroke-width="5"/><ellipse cx="-214" cy="${-150 + i * 36}" rx="6" ry="14" fill="#b87a42" stroke="#a8683a" stroke-width="3" opacity=".9"/><ellipse cx="214" cy="${-150 + i * 36}" rx="6" ry="14" fill="#b87a42" stroke="#a8683a" stroke-width="3"/>`).join('')}
  <path d="M-230 -30 H230" stroke="${INK}" stroke-width="5" opacity=".0"/><rect x="-236" y="-22" width="472" height="22" rx="8" ${O('#b8b5ae', 5)}/><path d="M-170 -22 V0 M-90 -22 V0 M-10 -22 V0 M70 -22 V0 M150 -22 V0" stroke="#8f8c85" stroke-width="3.5"/>
  ${win(-150)}${win(150)}
  <g transform="translate(0 -22)"><rect x="-56" y="-132" width="112" height="132" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>${door}<rect x="-56" y="-142" width="112" height="14" rx="6" ${O('#e8434e', 4)}/></g>
  <path d="M-270 -170 L0 -318 L270 -170 L270 -140 L0 -286 L-270 -140Z" ${O('#8a4a2c', 6)}/>
  <path d="M-286 -170 Q-250 -216 -190 -226 Q-120 -270 0 -330 Q120 -270 190 -226 Q250 -216 286 -170 Q270 -148 250 -170 Q230 -144 210 -170 Q190 -140 160 -166 Q0 -250 -160 -166 Q-190 -140 -210 -170 Q-230 -144 -250 -170 Q-270 -148 -286 -170Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-150 -218 Q-110 -246 -60 -266 M40 -290 Q80 -270 110 -252" stroke="#cfe3f5" stroke-width="7" fill="none" stroke-linecap="round"/>
  <g fill="#bfe6ff" stroke="${INK}" stroke-width="3" stroke-linejoin="round">${[-240, -190, 190, 240].map((ix, i) => `<path d="M${ix - 7} -156 L${ix} ${-120 + (i % 2) * 14} L${ix + 7} -156Z"/>`).join('')}</g>
  <path d="M-60 0 H60 L80 20 H-80Z" fill="#e8f2fc" stroke="${INK}" stroke-width="4" stroke-linejoin="round" opacity=".0"/>
  <path d="M-246 -6 q20 -34 50 -20 q12 -22 40 -12 q-4 20 -10 38Z" fill="#fff" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M226 -4 q14 -30 48 -20 q4 14 -2 24Z" fill="#fff" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/></g>`;
};

// ═════════════════════ le chalet (intérieur) ═════════════════════

// fenêtre de chalet, (0,0) = centre ; 250×230 ; o.view 'snow'|'day'|'dusk'|'night' ; o.frost = givre sur la vitre ; o.art = svg dessiné sur la vitre (coords locales)
export const chaletWindow = (x = 0, y = 0, s = 1, o = {}) => {
  const { view = 'snow', frost = false, art = '' } = o;
  const bg = { snow: '#d6e6f4', day: '#9ad6ff', dusk: '#ffc28f', night: '#1d2766' }[view] || '#d6e6f4';
  const moon = view === 'night' ? `<g transform="translate(40 -50) rotate(-20)"><path d="M0 -30 A30 30 0 1 0 0 30 A40 40 0 0 1 0 -30Z" ${O('#fff3a6', 4)}/></g>${[[-70, -70], [-30, -30], [-80, 10], [20, 20], [60, -80], [-10, -90]].map(([sx, sy], i) => `<path d="M${sx} ${sy - 6} l2 4 l5 2 l-5 2 l-2 4 l-2 -4 l-5 -2 l5 -2Z" fill="#fff6c8" style="animation:s4tw ${1 + i * 0.3}s ease-in-out infinite alternate"/>`).join('')}` : '';
  const mount = view !== 'night' ? `<path d="M-100 70 L-50 -4 L-20 30 L30 -30 L100 60 V100 H-100Z" fill="${view === 'dusk' ? '#c9a6c4' : '#a9bfe6'}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-60 -18 L-50 -4 L-38 12 L-50 6 L-60 12Z M30 -30 L48 -4 L34 -8 L28 0 L20 -6Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` : `<path d="M-100 70 L-50 10 L-20 40 L30 -10 L100 60 V100 H-100Z" fill="#3a4a8a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  const fl = (view === 'snow' || view === 'day') ? Array.from({ length: 14 }, (_, i) => { const fx = -100 + rnd(i) * 200, dur = 3 + rnd(i + 3) * 2; return `<g transform="translate(${fx.toFixed(0)} -100)"><g style="--dx:-20px;animation:s4wfall ${(dur * 0.5).toFixed(2)}s linear ${(-rnd(i + 11) * dur).toFixed(2)}s infinite"><circle r="${(2.4 + rnd(i + 7) * 2.6).toFixed(1)}" fill="#fff" stroke="#a9c8e8" stroke-width="1"/></g></g>`; }).join('') : '';
  const crystals = frost ? `<g stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".9">${[[-100, -100, 1, 1], [100, -100, -1, 1], [-100, 100, 1, -1], [100, 100, -1, -1]].map(([cx, cy, sx, sy]) => `<path d="M${cx} ${cy} q${28 * sx} ${6 * sy} ${44 * sx} ${34 * sy} M${cx} ${cy} q${6 * sx} ${28 * sy} ${34 * sx} ${44 * sy} M${cx + 20 * sx} ${cy + 20 * sy} l${22 * sx} ${-4 * sy}"/>`).join('')}</g><rect x="-100" y="-100" width="200" height="200" fill="#e8f4ff" opacity=".28"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-100" y="-100" width="200" height="200" fill="${bg}"/>${moon}${mount}${fl}${crystals}${art}
  <rect x="-100" y="-100" width="200" height="200" fill="#fff" opacity=".08"/>
  <path d="M-100 -100 L-48 -92 M100 100 L40 92" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6" transform="translate(12 20)"/>
  <path d="M0 -112 V112 M-112 0 H112" stroke="${INK}" stroke-width="9"/><path d="M0 -112 V112 M-112 0 H112" stroke="#c98a4e" stroke-width="4.5"/>
  <rect x="-110" y="-110" width="220" height="220" rx="8" fill="none" stroke="${INK}" stroke-width="18"/><rect x="-110" y="-110" width="220" height="220" rx="8" fill="none" stroke="#c98a4e" stroke-width="10"/>
  <rect x="-126" y="104" width="252" height="20" rx="8" ${O('#a8683a', 4.5)}/>
  </g>`;
};

// cheminée de pierre avec feu ; (0,0) = centre bas ; largeur ≈ 360, hauteur ≈ 320 ; o.fire (true) ; o.stockings (true)
export const fireplace = (x = 0, y = 0, s = 1, o = {}) => {
  const { fire = true, stockings = true } = o;
  const flame = (sc, dl, c, h) => `<g style="transform-origin:0px 0px;${an({ n: 's4flame', d: 0.3 + dl * 0.07, t: dl * 0.05, c: 999, dir: 'alternate', e: 'ease-in-out' })}"><path d="M0 0 C-${46 * sc} -6 -${50 * sc} -${h * 0.5} -${8 * sc} -${h} C-${4 * sc} -${h * 0.62} ${14 * sc} -${h * 0.6} ${22 * sc} -${h * 0.78} C${54 * sc} -${h * 0.4} ${46 * sc} -6 0 0Z" ${O(c, 4)}/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(200)}
  ${fire ? `<g transform="translate(0 -92)"><g style="transform-origin:0px 0px;animation:s4glow 1.1s ease-in-out infinite alternate"><circle r="260" fill="#ffb347"/></g></g>` : ''}
  <path d="M-180 0 V-250 Q-180 -300 -130 -300 H130 Q180 -300 180 -250 V0Z" ${O('#a8a39a', 6)}/>
  ${[[-160, -250], [-76, -250], [10, -250], [96, -250], [-120, -180], [-34, -180], [52, -180], [-160, -110], [96, -110], [-160, -40], [96, -40]].map(([sx, sy], i) => `<rect x="${sx}" y="${sy}" width="${i % 2 ? 76 : 66}" height="60" rx="14" fill="${i % 3 ? '#c9c5bb' : '#bab6ac'}" stroke="#8f8b82" stroke-width="3.5"/>`).join('')}
  <path d="M-110 0 V-130 Q-110 -170 -70 -170 H70 Q110 -170 110 -130 V0Z" fill="#2b1e1a" stroke="${INK}" stroke-width="6"/>
  ${fire ? `<g transform="translate(0 -6)"><ellipse cy="0" rx="82" ry="10" fill="#e8a838" opacity=".7"/><rect x="-70" y="-24" width="140" height="22" rx="11" ${O('#8a5a33', 4)} transform="rotate(-6 0 -13)"/><rect x="-62" y="-26" width="124" height="20" rx="10" ${O('#9b6a3c', 4)} transform="rotate(8 0 -13)"/>
    <g transform="translate(0 -18)">${flame(1.15, 0, '#e8434e', 120)}${flame(0.85, 1, '#ff9f43', 94)}${flame(0.5, 2, '#ffe14a', 64)}</g>
    ${[0, 1, 2, 3].map((i) => `<g transform="translate(${-30 + i * 20} -80)"><g style="--dx:${(i - 1.5) * 14}px;${an({ n: 's4spark', d: 1.4 + (i % 3) * 0.3, t: i * 0.37, c: 999 })}"><circle r="3.5" fill="#ffd23f"/></g></g>`).join('')}</g>` : ''}
  <rect x="-208" y="-322" width="416" height="34" rx="12" ${O('#8a5a33', 6)}/><rect x="-196" y="-316" width="150" height="8" rx="4" fill="#fff" opacity=".3"/>
  ${stockings ? [[-130, '#e8434e'], [-70, '#3fae55'], [-10, '#3b82f6']].map(([sx, col]) => `<g transform="translate(${sx} -288)"><path d="M-10 0 H10 V30 Q10 44 24 46 Q34 52 22 62 Q-6 64 -10 38Z" ${O(col, 4)}/><rect x="-14" y="-6" width="28" height="12" rx="5" ${O('#fff', 3.5)}/></g>`).join('') : ''}
  </g>`;
};

// tapis rond en laine ; (0,0) = centre
export const rug = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="250" ry="38" ${O('#e8434e', 5)}/><ellipse rx="196" ry="28" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/><ellipse rx="140" ry="19" fill="#3b82f6" stroke="${INK}" stroke-width="3.5"/><ellipse rx="84" ry="10" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M-240 12 l-12 8 M240 12 l12 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`;

// intérieur du chalet plein écran : murs en rondins, plancher, fenêtre, cheminée, horloge
// o.h/o.m = heure de l'horloge (ou o.clock = false) · o.view = vue par la fenêtre ('snow'|'day'|'dusk'|'night') · o.fire (true) · o.frost · o.tree (sapin dans le coin)
export const chaletInside = (o = {}) => {
  const { h = 7, m = 30, clock = true, view = 'snow', fire = true, frost = false, tree = false, window: win = true, art = '' } = o;
  const night = view === 'night';
  return `<rect width="${W}" height="${H}" fill="${night ? '#a8683a' : '#c98a4e'}"/>
  ${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${i * 80 + 20} H${W}" stroke="#a8683a" stroke-width="6"/>`).join('')}
  ${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${60 + ((i * 200) % 1200)}" cy="${i * 80 + 20 + 40}" rx="12" ry="7" fill="#b87a42" stroke="#a8683a" stroke-width="3"/>`).join('')}
  <rect y="0" width="${W}" height="38" fill="#8a5a33" stroke="${INK}" stroke-width="6"/>
  <path d="M0 0 V560 M${W} 0 V560" stroke="${INK}" stroke-width="0"/>
  ${win ? chaletWindow(250, 250, 1, { view, frost, art }) : ''}
  ${clock ? wallClock(h, m, 640, 150) : ''}
  <g transform="translate(540 330)"><rect x="0" y="0" width="200" height="14" rx="6" ${O('#8a5a33', 4)}/>${[[24, '#e8434e'], [76, '#ffd23f'], [128, '#3fae55']].map(([bx, c]) => `<g transform="translate(${bx} 0)"><path d="M0 0 V-34 H30 V0Z" ${O(c, 3.5)} transform="translate(0 0)"/><path d="M30 -24 q16 0 16 12 q0 12 -16 12" fill="none" stroke="${INK}" stroke-width="4"/></g>`).join('')}</g>
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#a8683a"/><rect y="${FLOOR}" width="${W}" height="14" fill="#8a5a33"/>
  ${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 140 + 20} ${FLOOR + 14} L${i * 140 - 30} ${H}" stroke="#8a5a33" stroke-width="5"/>`).join('')}<path d="M0 ${FLOOR + 92} H${W}" stroke="#8a5a33" stroke-width="4"/>
  ${rug(560, 650, 1)}
  ${fireplace(1050, FLOOR + 10, 1, { fire })}
  ${tree ? xmasTree(120, FLOOR + 40, 0.9, { lit: true }) : ''}`;
};

// ═════════════════════ fête, cuisine, objets ═════════════════════

// sapin de Noël décoré (pied en (0,0), hauteur ≈ 330) ; o.lit (true) ampoules qui clignotent ; o.star (true) ; o.balls (true)
export const xmasTree = (x = 0, y = 0, s = 1, o = {}) => {
  const { lit = true, star = true, balls = true } = o;
  const tier = (cy, w, h, col) => `<path d="M${-w} ${cy} L0 ${cy - h} L${w} ${cy}Z" ${O(col, 5)}/>`;
  const dots = [[-58, -40, '#e8434e'], [46, -34, '#ffd23f'], [-20, -96, '#3b82f6'], [34, -112, '#e8434e'], [-42, -150, '#ffd23f'], [8, -184, '#e8434e'], [-14, -230, '#3b82f6'], [22, -230, '#ffd23f']];
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(90)}<rect x="-16" y="-34" width="32" height="38" rx="6" ${O('#8a5a33', 4.5)}/>
  ${tier(-22, 100, 112, '#2f8a5b')}${tier(-90, 80, 108, '#3aa06a')}${tier(-160, 60, 100, '#2f8a5b')}${tier(-222, 40, 80, '#3aa06a')}
  <path d="M-80 -60 Q-20 -40 70 -76 M-62 -130 Q-6 -108 56 -140 M-40 -194 Q0 -176 40 -202" stroke="#ffd23f" stroke-width="6" fill="none" stroke-linecap="round" opacity=".95"/>
  ${balls ? dots.map(([bx, by, c]) => `<circle cx="${bx}" cy="${by}" r="9" fill="${c}" stroke="${INK}" stroke-width="3"/><circle cx="${bx - 3}" cy="${by - 3}" r="2.6" fill="#fff" opacity=".7"/>`).join('') : ''}
  ${lit ? [[-70, -76], [0, -52], [64, -88], [-34, -140], [30, -156], [-8, -208], [12, -258]].map(([bx, by], i) => `<circle cx="${bx}" cy="${by}" r="6" fill="${['#fff3a6', '#ff9fbf', '#9be08a'][i % 3]}" stroke="${INK}" stroke-width="2.5" style="animation:s4bulb ${0.8 + (i % 3) * 0.3}s ease-in-out ${i * 0.17}s infinite"/>`).join('') : ''}
  ${star ? `<g transform="translate(0 -306)"><path d="M0 -26 L8 -9 L26 -7 L13 6 L16 25 L0 16 L-16 25 L-13 6 L-26 -7 L-8 -9Z" ${O('#ffd23f', 4.5)}/><path d="M-4 -12 L0 -18" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>` : ''}</g>`;
};

// guirlande lumineuse entre deux points (ampoules qui clignotent) ; o.n (12), o.sag (40)
export const lightString = (x1, y1, x2, y2, o = {}) => {
  const { n = 12, sag = 40 } = o, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2;
  const P = (t) => [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2];
  return `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${Array.from({ length: n }, (_, i) => { const [px, py] = P((i + 0.5) / n); return `<g transform="translate(${px.toFixed(1)} ${(py + 8).toFixed(1)})"><path d="M-4 -8 h8 l2 6 h-12Z" fill="#6b6b78" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cy="4" rx="7" ry="9" fill="${['#ffd23f', '#ff6f61', '#7cc8ff', '#9be08a'][i % 4]}" stroke="${INK}" stroke-width="3" style="animation:s4bulb ${0.9 + (i % 3) * 0.3}s ease-in-out ${i * 0.13}s infinite"/></g>`; }).join('')}`;
};

// tasse de chocolat chaud ; (0,0) = centre bas ; largeur ≈ 120 ; o.steam (true) ; o.marsh (true) guimauves
export const mug = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M46 -64 Q84 -64 80 -34 Q76 -10 44 -16" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M46 -64 Q84 -64 80 -34 Q76 -10 44 -16" stroke="#ff8fa3" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-52 -78 H52 L44 -6 Q40 4 28 4 H-28 Q-40 4 -44 -6Z" ${O('#ff8fa3', 5)}/><path d="M-44 -48 H46" stroke="#fff" stroke-width="7" opacity=".6"/><path d="M-36 -68 v40" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
  <ellipse cy="-78" rx="52" ry="12" ${O('#7a4a2a', 4.5)}/><ellipse cx="-8" cy="-80" rx="26" ry="5" fill="#9b6a3c"/>
  ${o.marsh === false ? '' : `<rect x="-26" y="-100" width="26" height="22" rx="9" ${O('#fff', 3.5)} transform="rotate(-12 -13 -89)"/><rect x="4" y="-98" width="24" height="20" rx="9" ${O('#ffe2ec', 3.5)} transform="rotate(10 16 -88)"/>`}
  ${o.steam === false ? '' : [-22, 4, 28].map((dx, i) => `<g transform="translate(${dx} -112)"><g style="${an({ n: 's4steam', d: 1.6, t: i * 0.5, c: 999 })}"><path d="M0 0 q-8 -12 0 -22 q8 -10 0 -20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/></g></g>`).join('')}</g>`;

// caquelon de fondue sur son réchaud ; (0,0) = centre bas ; largeur ≈ 220 ; o.steam (true)
export const fondue = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(120)}
  <rect x="-70" y="-24" width="140" height="24" rx="10" ${O('#8a8a9a', 5)}/><path d="M-50 -24 L-40 -48 H40 L50 -24" ${O('#6a6a7a', 4.5)}/><g style="transform-origin:0px -48px;animation:s4flame .4s ease-in-out infinite alternate"><path d="M0 -48 C-14 -54 -14 -68 0 -80 C14 -68 14 -54 0 -48Z" ${O('#ffb347', 3.5)}/></g>
  <path d="M-96 -140 Q-96 -64 -66 -56 H66 Q96 -64 96 -140Z" ${O('#e8434e', 6)}/><path d="M-80 -120 q4 40 22 56" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/>
  <ellipse cy="-140" rx="96" ry="18" ${O('#c43e3e', 5)}/><ellipse cy="-141" rx="82" ry="12" ${O('#ffd23f', 4)}/><ellipse cx="-20" cy="-144" rx="26" ry="4" fill="#fff" opacity=".6"/>
  <path d="M-96 -112 H-130 Q-142 -112 -142 -124" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-96 -112 H-130 Q-142 -112 -142 -124" stroke="#8a5a33" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${o.steam === false ? '' : [-28, 0, 28].map((dx, i) => `<g transform="translate(${dx} -164)"><g style="${an({ n: 's4steam', d: 1.8, t: i * 0.6, c: 999 })}"><path d="M0 0 q-8 -12 0 -22 q8 -10 0 -20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/></g></g>`).join('')}</g>`;

// fil de fromage qui s'étire de (x,y) vers le haut jusqu'à y - h, de t0 à t0 + d (reste tendu ensuite)
export const cheeseString = (x, y, h, t0, d = 2) => `<g transform="translate(${x} ${y})"><g style="transform-origin:0px 0px;${an({ n: 's4grow', d, t: t0, f: 'both', e: 'ease-out' })}">
  <path d="M0 0 Q-10 ${-h * 0.25} 0 ${-h * 0.5} Q10 ${-h * 0.75} 0 ${-h}" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M0 0 Q-10 ${-h * 0.25} 0 ${-h * 0.5} Q10 ${-h * 0.75} 0 ${-h}" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-1 ${-h * 0.3} v${-h * 0.16}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></g></g>`;

// bûche de Noël ; (0,0) = centre bas ; largeur ≈ 300 ; o.bite = true : une bouchée manquante sur le glaçage
export const buche = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(180)}
  <ellipse cy="-4" rx="168" ry="22" ${O('#fff', 5)}/>
  <path d="M-140 -22 V-92 Q-140 -118 -110 -118 H110 Q140 -118 140 -92 V-22 Q140 -2 110 -2 H-110 Q-140 -2 -140 -22Z" ${O('#7a4a2a', 6)}/>
  <path d="M-130 -78 q40 -14 80 0 t80 0 t80 0 M-130 -50 q40 -14 80 0 t80 0 t80 0" stroke="#5a3318" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="140" cy="-60" rx="26" ry="42" ${O('#c98a4e', 5)}/><ellipse cx="140" cy="-60" rx="16" ry="27" fill="none" stroke="#7a4a2a" stroke-width="4"/><ellipse cx="140" cy="-60" rx="6" ry="12" fill="none" stroke="#7a4a2a" stroke-width="4"/>
  <path d="M-136 -104 Q-110 -142 -60 -126 Q-30 -150 20 -128 Q64 -146 100 -122 Q132 -128 138 -100 Q120 -112 108 -98 Q96 -112 80 -98 Q66 -112 52 -98 Q36 -112 22 -98 Q8 -112 -8 -98 Q-24 -112 -40 -98 Q-60 -112 -76 -98 Q-96 -112 -110 -98 Q-124 -110 -136 -104Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${o.bite ? `<path d="M-30 -138 q10 14 22 0 q10 12 20 0" fill="#7a4a2a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` : ''}
  <g transform="translate(-20 -140)"><ellipse cx="-14" cy="0" rx="16" ry="8" ${O('#3fae55', 3.5)} transform="rotate(-24 -14 0)"/><ellipse cx="16" cy="0" rx="16" ry="8" ${O('#3fae55', 3.5)} transform="rotate(24 16 0)"/><circle cx="-4" cy="-6" r="7" ${O('#e8434e', 3)}/><circle cx="8" cy="-4" r="7" ${O('#e8434e', 3)}/></g>
  <g transform="translate(-92 -126)"><path d="M-16 0 Q-14 -24 0 -24 Q14 -24 16 0Z" ${O('#fff', 3.5)}/><rect x="-5" y="0" width="10" height="12" rx="4" ${O('#ffe2ec', 3)}/></g>
  <path d="M-110 -112 q30 -10 60 -2" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round" fill="none"/></g>`;

// thermomètre mural (pied/base en (0,0), hauteur ≈ 260) ; o.temp = valeur initiale (°C, entre -20 et 30) ; o.to + o.t0 : la valeur change à t0 (le mercure descend en 1,2 s)
export const thermometer = (x = 0, y = 0, s = 1, o = {}) => {
  const { temp = -4, to, t0 = 0 } = o;
  const MAXH = 190, f = (t) => Math.max(0.05, Math.min(1, (t + 20) / 50));
  const label = (t) => `<text y="64" style="font-size:40px;fill:${INK};font-weight:900">${t}°C</text>`;
  const liquid = to === undefined
    ? `<g transform="translate(0 -40) scale(1 ${f(temp)})"><rect x="-8" y="-${MAXH}" width="16" height="${MAXH + 6}" fill="#e8434e"/></g>`
    : `<g transform="translate(0 -40)">${tf(`<rect x="-8" y="-${MAXH}" width="16" height="${MAXH + 6}" fill="#e8434e"/>`, { t0, d: 1.2, from: `scaleY(${f(temp)})`, to: `scaleY(${f(to)})`, e: 'ease-in-out', o: '0px 0px' })}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-30" y="-262" width="60" height="268" rx="30" ${O('#fff', 6)}/><rect x="-14" y="-236" width="28" height="196" rx="14" fill="#e8f0f8" stroke="${INK}" stroke-width="4"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M16 ${-60 - i * 33} h${i % 2 ? 8 : 14}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}
  ${liquid}
  <circle cy="-24" r="22" ${O('#e8434e', 5)}/><circle cx="-7" cy="-31" r="6" fill="#fff" opacity=".6"/><rect x="-6" y="-236" width="5" height="120" rx="2.5" fill="#fff" opacity=".55" transform="translate(-4 0)"/>
  ${to === undefined ? label(temp) : vis(0, t0, label(temp)) + vis(t0, 999, label(to))}</g>`;
};

// écharpe tendue entre deux mains (deux amis qui tirent) ; o.col ; o.sag affaissement (20)
export const scarf = (x1, y1, x2, y2, o = {}) => {
  const { col = '#e8434e', sag = 20 } = o, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag;
  const d = `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  return `<path d="${d}" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width="16" fill="none" stroke-dasharray="10 24" stroke-dashoffset="-4"/>`;
};

// bonnet à pompom (bas-centre en (0,0), largeur ≈ 112, hauteur ≈ 130) ; o.col ; o.rot
export const beanie = (x = 0, y = 0, s = 1, o = {}) => {
  const { col = '#e8434e', rot = 0 } = o;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-54 -14 Q-58 -100 6 -104 Q70 -100 56 -14Z" ${O(col, 4.5)}/><path d="M-36 -62 Q-10 -90 24 -84" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/><path d="M-44 -50 Q0 -36 52 -50" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0"/>
  <path d="M-58 -26 Q0 -10 60 -26 L62 2 Q0 20 -60 2Z" ${O('#fff', 4.5)}/><path d="M-30 -14 v18 M0 -10 v20 M30 -14 v18" stroke="#d8e2ee" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="8" cy="-116" r="16" ${O('#fff', 4.5)}/><circle cx="3" cy="-121" r="5" fill="#e8f0f8"/></g>`;
};
// le bonnet de Roussin, à passer dans hat:[[a,b,foxBeanie(drop)]] de fox() ; drop 0 = bien posé, 1 = tombé sur les yeux
export const foxBeanie = (drop = 0, o = {}) => `<g transform="translate(70 ${-166 + drop * 34}) rotate(${o.rot ?? -6 + drop * 8} 0 0) scale(${0.92 + drop * 0.1})"><g transform="translate(0 0)">${beanie(0, 0, 1, { col: o.col || '#e8434e' })}</g></g>`;

// moufle (main en (0,0), hauteur ≈ 60) ; o.col
export const mitten = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 -4 Q-26 -50 0 -52 Q26 -50 22 -4Z" ${O(o.col || '#3b82f6', 4)}/><ellipse cx="-26" cy="-26" rx="9" ry="14" ${O(o.col || '#3b82f6', 3.5)} transform="rotate(30 -26 -26)"/><rect x="-26" y="-6" width="52" height="16" rx="6" ${O('#fff', 4)}/><path d="M-12 -34 q8 -8 18 -2" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/></g>`;

// ═════════════════════ lac gelé, patins, raquettes, traces ═════════════════════

// lac gelé vu en perspective ; (x,y) = centre de la glace ; largeur ≈ 900
export const frozenLake = (x = 640, y = 620, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="10" rx="470" ry="104" ${O('#e8f2fc', 6)}/><ellipse cx="0" cy="2" rx="438" ry="86" ${O('#a8dcf5', 6)}/>
  <ellipse cx="-70" cy="-12" rx="280" ry="38" fill="#d6f0fc" opacity=".85"/>
  <path d="M-250 -30 q60 -16 130 -2 M60 24 q80 -14 160 4 M-300 28 q50 10 110 2 M180 -34 q40 -8 90 2" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M-120 20 q60 -50 140 -30 q70 14 40 40 M-60 4 q50 -24 100 -8" stroke="#6fb8e0" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/>
  ${[[-430, 20, 34], [-400, 60, 24], [420, 24, 30], [452, 4, 22], [330, 90, 26]].map(([sx, sy, r]) => `<ellipse cx="${sx}" cy="${sy}" rx="${r}" ry="${r * 0.55}" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('')}
  ${[[-466, 14], [-452, 6], [470, 18]].map(([rx, ry]) => `<path d="M${rx} ${ry} q-6 -40 2 -70 M${rx + 10} ${ry} q4 -30 12 -50" stroke="#bfa066" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}</g>`;

// lame de patin à poser sous un pied (pied en (0,0)) ; flip = tourne vers la gauche
export const skateBlade = (x = 0, y = 0, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path d="M-30 4 H38 Q54 4 52 -14" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-30 4 H38 Q54 4 52 -14" stroke="#dfe6ee" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-14 4 V-8 M30 4 V-8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-20 1 h30" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>`;

// raquette à neige vue de côté, à poser sous un pied (pied en (0,0)) ; flip
export const snowshoe = (x = 0, y = 0, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="6" cy="6" rx="60" ry="9" ${O('#c98a4e', 4.5)}/><path d="M-40 6 H52 M-24 0 V12 M-6 0 V12 M12 0 V12 M30 0 V12" stroke="${INK}" stroke-width="3" opacity=".7"/><path d="M-60 6 q-14 -2 -16 6" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-16 -2 h36" stroke="#e8434e" stroke-width="7" stroke-linecap="round"/></g>`;

// traces de pas en forme de cœur vu d'en haut ; (0,0) = centre ; largeur ≈ 420 ; t0 = début, empreintes qui apparaissent une à une en `dur` s
export const heartTracks = (x = 0, y = 0, s = 1, o = {}) => {
  const { t0 = 0, dur = 5, n = 30 } = o;
  const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]; });
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="300" ry="190" fill="#fff" stroke="#cfe3f5" stroke-width="6"/>
  ${pts.map(([px, py], i) => { const [qx, qy] = pts[(i + 1) % n], a = (Math.atan2(qy - py, qx - px) * 180) / Math.PI, side = i % 2 ? 6 : -6;
    return `<g transform="translate(${(px * 11).toFixed(1)} ${(py * 11 + 10).toFixed(1)}) rotate(${a.toFixed(0)})"><g style="transform-origin:0px 0px;${an({ n: 's4pop', d: 0.3, t: t0 + (i / n) * dur, f: 'both' })}"><ellipse cy="${side}" rx="17" ry="10" fill="#b6d2ea" stroke="#8fb4d4" stroke-width="3"/><path d="M-8 ${side - 5} v10 M0 ${side - 6} v12 M8 ${side - 5} v10" stroke="#8fb4d4" stroke-width="2.5" stroke-linecap="round"/></g></g>`; }).join('')}</g>`;
};

// ═════════════════════ sieste, fresque, divers ═════════════════════

// matelas / sac de couchage posé au sol ; (0,0) = centre bas ; largeur ≈ 220 ; o.col ; o.pillow (true)
export const mat = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="120" ry="12" fill="#3a2418" opacity=".2"/><rect x="-110" y="-34" width="220" height="36" rx="16" ${O(o.col || '#7cc8ff', 5)}/><path d="M-60 -30 v28 M0 -30 v28 M60 -30 v28" stroke="#fff" stroke-width="4" opacity=".45" stroke-linecap="round"/>${o.pillow === false ? '' : `<ellipse cx="-80" cy="-42" rx="34" ry="16" ${O('#fff', 4)}/>`}</g>`;

// fresque sur la vitre givrée : portraits tracés en blanc, apparaissant un par un ; à poser dans chaletWindow({art}) ou sur une vitre ; coords locales ±100
// o.t0 début, o.step intervalle entre dessins (0,6 s), o.count 1..8
export const fresco = (o = {}) => {
  const { t0 = 0, step = 0.6, count = 8 } = o;
  const face = (cx, cy, kind) => {
    const ears = { fox: `<path d="M-14 -12 L-12 -30 L0 -16 M14 -12 L12 -30 L0 -16" />`, rab: `<path d="M-10 -14 Q-14 -42 -4 -40 Q0 -28 -2 -16 M10 -14 Q14 -42 4 -40 Q0 -28 2 -16" />`, owl: `<path d="M-14 -14 L-12 -28 L-2 -18 M14 -14 L12 -28 L2 -18" /><circle cx="-6" cy="2" r="9"/><circle cx="6" cy="2" r="9"/>`, hedge: `<path d="M-16 -8 L-12 -22 L-6 -12 L0 -26 L6 -12 L12 -22 L16 -8" />`, snail: `<path d="M-8 -14 l-4 -16 M8 -14 l4 -16" /><circle cx="14" cy="-30" r="3"/>`, mimi: `<path d="M-14 -10 q-4 -14 6 -16 M14 -10 q4 -14 -6 -16" />`, bad: `<path d="M-12 -6 v-12 M12 -6 v-12 M0 -14 v-10" />`, mar: `<circle cx="-12" cy="-14" r="5"/><circle cx="12" cy="-14" r="5"/>` }[kind] || '';
    return `<g transform="translate(${cx} ${cy})" stroke="#fff" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle r="18"/>${ears}<circle cx="-6" cy="-1" r="1.6" fill="#fff"/><circle cx="6" cy="-1" r="1.6" fill="#fff"/><path d="M-5 7 q5 5 10 0"/></g>`;
  };
  const kinds = ['fox', 'rab', 'owl', 'hedge', 'snail', 'bad', 'mimi', 'mar'];
  const pos = [[-52, -56], [4, -64], [56, -52], [-64, 4], [-6, 8], [54, 6], [-40, 62], [26, 62]];
  return `<g opacity=".95">${pos.slice(0, count).map(([px, py], i) => `<g style="transform-origin:${px}px ${py}px;${an({ n: 's4pop', d: 0.5, t: t0 + i * step, f: 'both' })}">${face(px, py, kinds[i])}</g>`).join('')}
  <g style="transform-origin:0px 86px;${an({ n: 's4pop', d: 0.5, t: t0 + count * step, f: 'both' })}"><path d="M0 92 c-18 -12 -22 -26 -10 -30 c6 -2 10 2 10 6 c0 -4 4 -8 10 -6 c12 4 8 18 -10 30Z" stroke="#fff" stroke-width="3.6" fill="none" stroke-linejoin="round"/></g></g>`;
};

// mouton (pour compter), regarde à droite ; (0,0) = sol ; hauteur ≈ 110 ; o.jump = [[a,b,h]] saute
export const sheep = (x = 0, y = 0, s = 1, o = {}) => {
  let inner = `${shadow(48)}${[-18, 16].map((lx) => `<rect x="${lx}" y="-30" width="9" height="32" rx="4" ${O('#4a3b40', 3.5)}/>`).join('')}
  <circle cx="-26" cy="-58" r="22" ${O('#fff', 4)}/><circle cx="-6" cy="-74" r="26" ${O('#fff', 4)}/><circle cx="20" cy="-62" r="26" ${O('#fff', 4)}/><circle cx="2" cy="-48" r="26" ${O('#fff', 4)}/>
  <ellipse cx="44" cy="-56" rx="20" ry="22" ${O('#4a3b40', 4)}/><circle cx="52" cy="-60" r="4.5" fill="#fff"/><circle cx="53" cy="-60" r="2.4" fill="${INK}"/><path d="M46 -42 q6 5 12 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="-46" rx="6" ry="4" fill="#ff8fa3" opacity=".7"/>
  <ellipse cx="26" cy="-78" rx="14" ry="7" ${O('#4a3b40', 3.5)} transform="rotate(-30 26 -78)"/>`;
  for (const [a, b, h] of o.jump || []) inner = `<g style="--h:${h}px;${an({ n: 'jmp', d: b - a, t: a })}">${inner}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
};

// barrière de bois (pour les moutons) ; (0,0) = centre bas ; largeur ≈ 160
export const woodFence = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[-70, 70].map((px) => `<rect x="${px - 10}" y="-100" width="20" height="104" rx="7" ${O('#e8c590', 4)}/>`).join('')}${[-80, -44].map((py) => `<rect x="-90" y="${py - 7}" width="180" height="14" rx="6" ${O('#f6dcae', 4)}/>`).join('')}</g>`;

// petite pile de flocons en l'air qui jaillit (poof de neige) de (x,y) à t0
export const snowPoof = (x, y, t0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: 7 }, (_, i) => `<g style="--dx:${(i - 3) * 22}px;${an({ n: 's4puff', d: 1.1, t: t0 + (i % 3) * 0.05, f: 'both' })}"><circle cx="0" cy="${-(i % 3) * 10}" r="${14 + (i % 3) * 5}" fill="#fff" stroke="#bcd8f0" stroke-width="3"/></g>`).join('')}</g>`;
