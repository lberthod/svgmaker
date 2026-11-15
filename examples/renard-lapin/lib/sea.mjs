// Décor de la mer (saison 3) : chaque élément est une fonction qui renvoie une chaîne SVG.
// Convention (comme farm.mjs) : les objets sont dessinés autour de (0,0) = leur point au sol (centre bas) ; x,y,s en paramètres.
// Fonds plein écran 1280×720 : seaBg (plage), harborBg (port), caveBg (grotte), station (gare), seaView (pleine mer, bateau).
// Ligne d'horizon HORIZON = 320, bord de l'eau SHORE = 480, pieds des personnages sur le sable ≈ GROUND = 600.
// Les actions à date prennent des fenêtres/instants absolus en secondes (comme les personnages).
import { W, H, INK, an, ao, anims, vis, tf, cloud, addKF } from './kit.mjs';

export const HORIZON = 320, SHORE = 480, GROUND = 600;

addKF(`@keyframes swave{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
@keyframes sfoam{from{transform:translateY(-10px)}to{transform:translateY(16px)}}
@keyframes sbob{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-10px) rotate(3deg)}}
@keyframes sglint{from{opacity:.15}to{opacity:.9}}
@keyframes sgull{from{transform:scaleY(1)}to{transform:scaleY(.45)}}
@keyframes sflag{from{transform:skewY(-8deg)}to{transform:skewY(8deg)}}
@keyframes sbeam{from{opacity:.25;transform:rotate(-8deg)}to{opacity:.7;transform:rotate(8deg)}}
@keyframes sglow{from{opacity:.12;transform:scale(.94)}to{opacity:.28;transform:scale(1.06)}}
@keyframes sglo2{from{transform:scale(.93)}to{transform:scale(1.07)}}
@keyframes sbigwave{0%{transform:translate(var(--x0),0) scale(.7)}60%{transform:translate(var(--x1),-10px) scale(1.15,1.05)}100%{transform:translate(var(--x2),12px) scale(.9,.6)}}
@keyframes scrumble{0%{transform:none}100%{transform:scale(1.06,.2)}}
@keyframes ssmoke{0%{opacity:.9;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(-60px,-90px) scale(1.5)}}
@keyframes sdrift{from{transform:translateX(0)}to{transform:translateX(-30px)}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const cyc = (a, b, p) => Math.max(1, Math.round((b - a) / p));

// palettes par moment : day | noon | dusk | sunset | night
const PAL = {
  day: { sky: ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#d9f2ff'], sea: ['#37a9e4', '#4cbcf0', '#6fd0f5'], sand: ['#f6dfa0', '#ecd08a'], wet: '#e3c47e', foam: '#ffffff' },
  dusk: { sky: ['#ff9f6b', '#ffb07a', '#ffc98f', '#ffe0a8'], sea: ['#e27f7a', '#ea9283', '#f2a98c'], sand: ['#f2cf94', '#e6bb7a'], wet: '#d6a870', foam: '#fff0dc' },
  sunset: { sky: ['#5c4a9c', '#b2528c', '#ff7f6b', '#ffb870'], sea: ['#6a4a8e', '#8e5594', '#c06494'], sand: ['#e0a878', '#cf9468'], wet: '#b8805e', foam: '#ffd9c9' },
  night: { sky: ['#10163f', '#161e52', '#1d2766', '#27327c'], sea: ['#14204f', '#1a2a62', '#223573'], sand: ['#6a5c86', '#5a4c78'], wet: '#4e4270', foam: '#aab4e8' },
};
PAL.noon = PAL.day;
const P = (k) => PAL[k] || PAL.day;

// ═════════════════════ ciel et soleil ═════════════════════
export const seaSky = (kind = 'day') => P(kind).sky.map((c, i) => `<rect y="${(i * HORIZON) / 4}" width="${W}" height="${HORIZON / 4 + 2}" fill="${c}"/>`).join('');

// soleil visage : (x,y) centre ; o.set = [t0,t1,descente px] le fait glisser vers l'horizon (dessiner AVANT la mer pour qu'il y plonge)
export const seaSun = (x = 1060, y = 110, s = 1, o = {}) => {
  const body = `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation:spin 24s linear infinite">${Array.from({ length: 10 }, (_, i) => `<path d="M0 -70 L9 -52 L-9 -52Z" fill="#ffd23f" transform="rotate(${i * 36})"/>`).join('')}</g>
  <circle r="44" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><circle cx="-15" cy="-15" r="11" fill="#fff" opacity=".5"/>
  <path d="M-14 9 q14 14 28 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-14" cy="-4" r="4.5" fill="${INK}"/><circle cx="14" cy="-4" r="4.5" fill="${INK}"/><ellipse cx="-26" cy="7" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="26" cy="7" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/></g>`;
  return o.set ? tf(body, { t0: o.set[0], d: o.set[1] - o.set[0], from: 'translateY(0px)', to: `translateY(${o.set[2] ?? 120}px)`, e: 'ease-in' }) : body;
};

export const seaClouds = (tone = 'day') => `<g style="animation:cdrift 16s ease-in-out infinite alternate">${cloud(240, 110, 0.8, 1)}${cloud(620, 70, 0.55, 0.95)}${cloud(900, 160, 0.65, 1)}</g>`.replace(/fill="#fff"/g, tone === 'sunset' ? 'fill="#ffc9b0"' : 'fill="#fff"');

// mouettes en vol (décor) : (x,y,s)
export const gull = (x = 400, y = 120, s = 1, delay = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation:sdrift 6s ease-in-out ${delay}s infinite alternate"><g style="transform-origin:0px 0px;animation:sgull .5s ease-in-out ${delay}s infinite alternate"><path d="M-34 4 Q-16 -22 0 0 Q16 -22 34 4" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34 4 Q-16 -22 0 0 Q16 -22 34 4" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g></g>`;

// ═════════════════════ la mer et le sable ═════════════════════

// bande de mer de HORIZON à SHORE ; o.tone ; o.y0/o.y1 pour la changer
export const sea = (tone = 'day', o = {}) => {
  const p = P(tone), y0 = o.y0 ?? HORIZON, y1 = o.y1 ?? SHORE, h = (y1 - y0) / 3;
  const glint = Array.from({ length: 9 }, (_, i) => `<path d="M${60 + i * 140 + rnd(i) * 40} ${y0 + 20 + (i % 3) * h * 0.9} h${28 + rnd(i + 3) * 24}" stroke="${p.foam}" stroke-width="5" stroke-linecap="round" style="animation:sglint ${1 + (i % 4) * 0.4}s ease-in-out ${(i % 5) * 0.3}s infinite alternate"/>`).join('');
  const waves = [0, 1, 2].map((r) => `<g style="animation:swave ${4 + r}s ease-in-out ${r * 0.7}s infinite alternate"><path d="M-100 ${y0 + h * (r + 0.55)} ${Array.from({ length: 16 }, (_, i) => `q40 -14 80 0`).join(' ')}" fill="none" stroke="${p.foam}" stroke-width="5" stroke-linecap="round" opacity=".55"/></g>`).join('');
  return p.sea.map((c, i) => `<rect y="${y0 + i * h}" width="${W}" height="${h + 2}" fill="${c}"/>`).join('') + `<path d="M0 ${y0} H${W}" stroke="${INK}" stroke-width="4" opacity=".5"/>${glint}${waves}`;
};

// plage : sable de SHORE au bas + écume qui va et vient ; o.shells = false pour un sable nu
export const sand = (tone = 'day', o = {}) => {
  const p = P(tone);
  const foam = `<g style="animation:sfoam 3.2s ease-in-out infinite alternate"><path d="M0 ${SHORE - 4} ${Array.from({ length: 13 }, () => 'q50 -16 100 0').join(' ')} V${SHORE + 40} H0Z" fill="${p.foam}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
  const dots = Array.from({ length: 26 }, (_, i) => `<circle cx="${rnd(i) * W}" cy="${SHORE + 80 + rnd(i + 8) * (H - SHORE - 90)}" r="${2 + rnd(i + 2) * 3}" fill="${p.sand[1]}"/>`).join('');
  return `<rect y="${SHORE}" width="${W}" height="${H - SHORE}" fill="${p.sand[0]}"/><rect y="${SHORE}" width="${W}" height="46" fill="${p.wet}"/><path d="M0 ${SHORE + 76} q160 -16 320 0 t320 0 t320 0 t320 0" stroke="${p.sand[1]}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>${dots}${foam}
  ${o.shells === false ? '' : `${starfish(1130, 668, 0.6, '#ff8f6b')}${shell(110, 690, 0.7, 'fan')}${shell(700, 700, 0.55, 'spiral')}`}`;
};

// fond complet « jour à la plage » : tone day|dusk|sunset|night ; o.sun = false, o.clouds = false
export const seaBg = (tone = 'day', o = {}) => {
  const lit = tone === 'day' || tone === 'noon';
  return `${seaSky(tone)}${o.sun === false ? '' : tone === 'night' ? moon() : seaSun(lit ? 1090 : 640, lit ? 110 : 250, lit ? 1 : 1.4)}${o.clouds === false || tone === 'night' ? '' : seaClouds(tone)}${sea(tone)}${sand(tone, o)}`;
};

// pleine mer (pour le bateau) : ciel + mer jusqu'en bas, vagues qui roulent ; (la ligne d'horizon est à y = 300)
export const seaView = (tone = 'day', o = {}) => {
  const p = P(tone);
  return `${seaSky(tone)}${o.sun === false || tone === 'night' ? '' : seaSun(940, 120, 1)}${tone === 'night' ? moon() : seaClouds(tone)}${sea(tone, { y0: HORIZON - 20, y1: H })}
  ${[0, 1, 2, 3].map((r) => `<g style="animation:swave ${3.4 + r * 0.6}s ease-in-out ${r * 0.5}s infinite alternate"><path d="M-100 ${430 + r * 70} ${Array.from({ length: 16 }, () => 'q40 -16 80 0').join(' ')}" fill="none" stroke="${p.foam}" stroke-width="6" stroke-linecap="round" opacity=".7"/></g>`).join('')}`;
};

// coucher de soleil animé : le soleil descend de t0 à t1 et plonge derrière l'horizon, reflet sur l'eau ; remplace seaBg('sunset')
export const sunsetBg = (t0 = 0, t1 = 20, o = {}) => `${seaSky('sunset')}
  ${seaSun(640, 238, 1.5, { set: [t0, t1, o.drop ?? 150] })}${seaClouds('sunset')}${sea('sunset')}
  ${tf(`<path d="M600 332 h80 M590 352 h100 M580 376 h120 M570 404 h140 M560 436 h160" stroke="#ffd23f" stroke-width="10" stroke-linecap="round" opacity=".6"/>`, { t0, d: t1 - t0, from: 'translateY(-20px)', to: 'translateY(30px)' })}
  ${sand('sunset', { shells: o.shells })}`;

export const moon = (x = 1000, y = 120, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: 30 }, (_, i) => `<circle cx="${(rnd(i) * 1100 - x).toFixed(0)}" cy="${(rnd(i + 40) * 200 - y).toFixed(0)}" r="${2 + rnd(i + 9) * 3}" fill="#fff" style="animation:sglint ${1 + rnd(i) * 1.5}s ease-in-out ${rnd(i + 1)}s infinite alternate"/>`).join('')}<path d="M0 -50 A50 50 0 1 0 0 50 A68 68 0 0 1 0 -50Z" ${O('#fff3a6', 5)}/></g>`;

// ═════════════════════ rochers, coquillages, flaques ═════════════════════

// rocher(s) : kind 'pile' (tas) | 'one' | 'arch' (arche) ; (0,0) = pied ; largeur ≈ 300 pour pile
export const rocks = (x = 0, y = 0, s = 1, kind = 'pile') => {
  const R = (d, c = '#9a9fb5') => `<path d="${d}" ${O(c, 5)}/>`;
  const body = kind === 'one'
    ? `${R('M-80 0 Q-90 -70 -30 -96 Q30 -110 70 -60 Q96 -20 80 0Z')}<path d="M-50 -64 Q-20 -90 14 -90" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".4"/><path d="M-30 -20 q16 -8 30 -2" stroke="#7a7f96" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : kind === 'arch'
      ? `${R('M-150 0 Q-160 -150 -60 -190 Q0 -210 60 -190 Q160 -150 150 0 H80 Q80 -80 0 -100 Q-80 -80 -80 0Z')}<path d="M-110 -130 Q-80 -170 -30 -180" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".4"/>`
      : `${R('M-150 0 Q-160 -60 -100 -84 Q-60 -96 -30 -70 Q0 -110 50 -100 Q100 -90 100 -40 Q150 -34 150 0Z', '#a3a8bd')}${R('M-90 0 Q-96 -34 -60 -44 Q-30 -48 -20 0Z', '#8d92a8')}
    <path d="M-120 -66 Q-90 -86 -60 -82 M20 -92 Q50 -96 76 -78" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".4"/><path d="M-140 -8 q14 -12 28 -4 M100 -12 q14 -10 28 -2" stroke="#4f9a5a" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="${kind === 'pile' ? 160 : 100}" ry="10" fill="#000" opacity=".18"/>${body}</g>`;
};

export const starfish = (x = 0, y = 0, s = 1, col = '#ff8f6b') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${Array.from({ length: 10 }, (_, i) => { const a = (i * 36 - 90) * Math.PI / 180, r = i % 2 ? 22 : 62; return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' ')}Z" ${O(col, 5)}/>
  ${[0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos((a - 90) * Math.PI / 180) * 36}" cy="${Math.sin((a - 90) * Math.PI / 180) * 36}" r="4" fill="#fff" opacity=".6"/>`).join('')}<circle cx="-7" cy="-4" r="3.5" fill="${INK}"/><circle cx="7" cy="-4" r="3.5" fill="${INK}"/><path d="M-6 6 q6 6 12 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;

// coquillage : kind 'fan' (coquille Saint-Jacques) | 'spiral' (escargot de mer) | 'croissant' (en forme de croissant !)
export const shell = (x = 0, y = 0, s = 1, kind = 'fan') => {
  const b = kind === 'spiral'
    ? `<path d="M-30 0 Q-40 -50 0 -64 Q40 -56 36 -14 Q30 4 0 0Z" ${O('#ffd9b8', 5)}/><path d="M-4 -30 Q-18 -34 -14 -46 Q0 -54 12 -42 Q16 -26 0 -22" fill="none" stroke="#e8934e" stroke-width="5" stroke-linecap="round"/>`
    : kind === 'croissant'
      ? `<path d="M-60 0 Q-56 -62 0 -66 Q56 -62 60 0 Q40 -16 30 -22 Q0 -8 -30 -22 Q-40 -16 -60 0Z" ${O('#f0b45a', 5)}/><path d="M-30 -24 L-16 -58 M0 -12 V-64 M30 -24 L16 -58" stroke="#c98a2c" stroke-width="4" stroke-linecap="round"/><ellipse cx="-22" cy="-52" rx="14" ry="5" fill="#fff" opacity=".4" transform="rotate(-20 -22 -52)"/>`
      : `<path d="M-50 0 Q-58 -56 0 -66 Q58 -56 50 0Z" ${O('#ffc7d6', 5)}/><path d="M0 0 V-64 M-24 0 L-30 -56 M24 0 L30 -56" stroke="#e58aa6" stroke-width="4" stroke-linecap="round"/><rect x="-18" y="-2" width="36" height="12" rx="5" ${O('#ffc7d6', 4)}/><ellipse cx="-26" cy="-46" rx="12" ry="5" fill="#fff" opacity=".45" transform="rotate(-25 -26 -46)"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="44" ry="7" fill="#000" opacity=".15"/>${b}</g>`;
};

// flaque de marée avec anémone et étoile de mer ; (0,0) = centre ; largeur ≈ 360 ; o.frog = svg posé dedans (ex. Plouf)
export const tidepool = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cy="8" rx="190" ry="48" ${O('#d6b26a', 5)}/><ellipse cy="2" rx="168" ry="38" ${O('#5bc2f0', 5)}/><ellipse cx="-30" cy="-8" rx="100" ry="14" fill="#8fd3ff" opacity=".6"/>
  <path d="M-110 -6 q30 -10 60 0 M30 14 q36 -8 70 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  <g transform="translate(-92 6)">${Array.from({ length: 7 }, (_, i) => `<path d="M${(i - 3) * 8} 6 Q${(i - 3) * 14} -20 ${(i - 3) * 16} -34" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M${(i - 3) * 8} 6 Q${(i - 3) * 14} -20 ${(i - 3) * 16} -34" stroke="${i % 2 ? '#ff7fb0' : '#ff9fc4'}" stroke-width="5.5" fill="none" stroke-linecap="round" style="transform-origin:${(i - 3) * 8}px 6px;animation:sflag 1.${i}s ease-in-out infinite alternate"/>`).join('')}<ellipse cy="8" rx="30" ry="12" ${O('#e8588c', 4)}/></g>
  ${starfish(70, 14, 0.42, '#ffb347')}${o.frog || ''}
  <ellipse cx="-190" cy="22" rx="30" ry="18" ${O('#b8b5ae', 4)}/><ellipse cx="196" cy="24" rx="26" ry="16" ${O('#b8b5ae', 4)}/></g>`;

// ═════════════════════ jeux de plage ═════════════════════

// parasol : (0,0) = pied du mât ; hauteur ≈ 250 ; o.col ; o.tilt = degrés ; o.spin = [[a,b]] tourne sur lui-même comme une hélice (autour du sommet)
export const parasol = (x = 0, y = 0, s = 1, o = {}) => {
  const c1 = o.col || '#e8434e';
  const spin = (o.spin || []).map(([a, b]) => ao({ n: 'spin', d: 0.35, t: a, c: cyc(a, b, 0.35) }));
  const cano = `<path d="M-130 -170 Q-120 -250 0 -262 Q120 -250 130 -170Z" ${O('#fff', 5)}/><path d="M-130 -170 Q-120 -250 -44 -258 Q-60 -214 -62 -170Z M-2 -262 Q40 -214 44 -170 H-18 Q-16 -214 -2 -262Z M44 -170 Q50 -214 82 -252 Q124 -240 130 -170Z" fill="${c1}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-130 -170 q22 18 44 0 q22 18 44 0 q22 18 44 0 q22 18 44 0 q22 18 44 0 q22 18 46 0" ${O('#fff', 5)}/><path d="M-100 -226 Q-76 -246 -48 -250" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/><circle cy="-266" r="8" ${O('#ffd23f', 4)}/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="44" ry="8" fill="#000" opacity=".16"/><g transform="rotate(${o.tilt || 0})"><path d="M0 0 V-190" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M0 0 V-190" stroke="#e8c590" stroke-width="7" stroke-linecap="round"/>
  <g style="transform-origin:0px -262px;${anims(spin)}">${cano}</g></g></g>`;
};

// serviette : (0,0) = centre ; largeur ≈ 240
export const towel = (x = 0, y = 0, s = 1, col = '#ff8fa3') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 0 L-100 -50 H110 L130 0Z" ${O('#fff', 5)}/>${[-70, -30, 10, 50, 90].map((u, i) => `<path d="M${u} -50 L${u * 1.08} 0" stroke="${col}" stroke-width="14" opacity="${i % 2 ? 0 : 1}"/>`).join('')}<path d="M-120 0 L-100 -50 H110 L130 0Z" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-110 -10 h-14 M-104 -22 h-14 M124 -10 h14" stroke="${col}" stroke-width="5" stroke-linecap="round"/></g>`;

// seau : (0,0) = fond ; hauteur ≈ 100 ; o.col ; o.fill = sable dedans ; o.flag = petit drapeau
export const bucket = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="52" ry="8" fill="#000" opacity=".16"/>
  <path d="M-40 -96 Q0 -132 40 -96" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-40 -96 Q0 -132 40 -96" fill="none" stroke="#c9ccd8" stroke-width="4" stroke-linecap="round"/>
  <path d="M-46 -96 L-36 -2 Q0 8 36 -2 L46 -96Z" ${O(o.col || '#3b82f6', 5)}/><ellipse cy="-96" rx="46" ry="11" ${O(o.fill ? '#f0d890' : '#2563eb', 4.5)}/>
  <path d="M-34 -80 L-28 -20" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".4"/><path d="M-42 -50 Q0 -36 42 -50" stroke="#2563eb" stroke-width="5" fill="none" opacity=".7"/>
  ${o.flag ? `<path d="M0 -96 V-166" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><g style="transform-origin:0px -164px;animation:sflag .9s ease-in-out infinite alternate"><path d="M0 -164 L40 -150 L0 -136Z" ${O('#e8434e', 4)}/></g>` : ''}</g>`;

export const spade = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 V-90" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 0 V-90" stroke="#ffd23f" stroke-width="7" stroke-linecap="round"/><path d="M-22 -2 Q-24 22 0 30 Q24 22 22 -2Z" ${O('#e8434e', 5)}/><circle cy="-96" r="9" ${O('#ffd23f', 4)}/></g>`;

// château de sable : (0,0) = centre bas ; largeur ≈ 300, hauteur ≈ 250 ; o.build = [t0,t1] sort du sol ; o.crumble = t (s'écroule) ; o.flag (défaut true) ; o.low = version plus petite/plus simple
export const sandcastle = (x = 0, y = 0, s = 1, o = {}) => {
  const sd = '#e8c36a', sdD = '#d1a84e';
  const tower = (cx, w, h, flag) => `<g transform="translate(${cx} 0)"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="6" ${O(sd, 5)}/>
    ${[-1, 0, 1].map((k) => `<rect x="${k * (w / 3) - w / 6}" y="${-h - 20}" width="${w / 3 - 4}" height="22" rx="4" ${O(sd, 4.5)}/>`).join('')}
    <path d="M${-w / 2 + 8} ${-h + 20} h${w - 16} M${-w / 2 + 6} ${-h * 0.5} h${w - 12}" stroke="${sdD}" stroke-width="5" stroke-linecap="round"/><path d="M-6 0 v-30 q6 -22 12 0 v30" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="${-w / 4}" cy="${-h * 0.7}" rx="6" ry="${h * 0.2}" fill="#fff" opacity=".35"/>${flag ? `<path d="M0 ${-h - 18} V${-h - 76}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><g style="transform-origin:0px ${-h - 74}px;animation:sflag .9s ease-in-out infinite alternate"><path d="M0 ${-h - 74} L42 ${-h - 60} L0 ${-h - 46}Z" ${O('#e8434e', 4)}/></g>` : ''}</g>`;
  const body = o.low
    ? `<path d="M-90 0 Q-90 -50 -40 -60 Q0 -80 40 -60 Q90 -50 90 0Z" ${O(sd, 5)}/>${tower(0, 54, 90, o.flag !== false)}`
    : `<path d="M-150 0 Q-150 -30 -120 -34 H120 Q150 -30 150 0Z" ${O(sdD, 5)}/>${tower(-96, 56, 130, false)}${tower(96, 56, 130, false)}
       <rect x="-60" y="-120" width="120" height="100" rx="6" ${O(sd, 5)}/><path d="M-26 -20 v-40 q26 -30 52 0 v40Z" fill="#8a5a33" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
       ${tower(0, 60, 190, o.flag !== false)}`;
  let g = `<g transform="translate(0 0)">${body}</g>`;
  if (o.build) g = tf(g, { t0: o.build[0], d: o.build[1] - o.build[0], from: 'scale(1,.02)', to: 'scale(1,1)', e: 'cubic-bezier(.3,1.4,.5,1)', o: '0px 0px' });
  if (o.crumble !== undefined) g = `<g style="transform-origin:0px 0px;${an({ n: 'scrumble', d: 0.7, t: o.crumble, f: 'both', e: 'ease-in' })}">${g}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="170" ry="12" fill="#000" opacity=".16"/>${g}</g>`;
};

// grosse vague qui roule sur le sable : de xFrom à xTo (au niveau y), de t0 à t1 ; la dessiner PAR-DESSUS les personnages/le château
export const bigWave = (t0 = 0, t1 = 2.4, y = 560, o = {}) => {
  const x0 = o.x0 ?? -300, x1 = o.x1 ?? 640, x2 = o.x2 ?? -200;
  const wv = `<path d="M-340 60 Q-320 -70 -200 -80 Q-120 -90 -60 -50 Q-20 -90 40 -60 Q100 -30 120 60Z" fill="#4cbcf0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M-340 60 Q-320 -40 -240 -64 Q-200 -50 -170 -28 Q-120 -50 -60 -30 Q-20 -60 20 -36 Q60 -18 120 60Z" fill="#fff" opacity=".9"/><path d="M-300 20 q30 -30 70 -24 M-120 6 q30 -26 70 -14" stroke="#37a9e4" stroke-width="7" fill="none" stroke-linecap="round"/>
    ${Array.from({ length: 7 }, (_, i) => `<circle cx="${-300 + i * 60}" cy="${-70 + (i % 3) * 14}" r="${5 + (i % 3) * 2}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`).join('')}`;
  return `<g transform="translate(0 ${y})"><g style="--x0:${x0}px;--x1:${x1}px;--x2:${x2}px;${an({ n: 'sbigwave', d: t1 - t0, t: t0, f: 'both', e: 'ease-in-out' })}">${wv}</g></g>`;
};

// ballon de plage ; o.hedgehog = ballon-hérisson (piquants) ; o.spin = [[a,b]]
export const beachBall = (x = 0, y = 0, s = 1, o = {}) => {
  const spin = (o.spin || []).map(([a, b]) => ao({ n: 'spin', d: 0.9, t: a, c: cyc(a, b, 0.9) }));
  const seg = (a, c) => `<path d="M0 0 L${(Math.cos(a) * 54).toFixed(1)} ${(Math.sin(a) * 54).toFixed(1)} A54 54 0 0 1 ${(Math.cos(a + Math.PI / 3) * 54).toFixed(1)} ${(Math.sin(a + Math.PI / 3) * 54).toFixed(1)}Z" fill="${c}"/>`;
  const spikes = o.hedgehog ? Array.from({ length: 14 }, (_, i) => `<path d="M-6 -50 L0 -76 L6 -50Z" fill="#8a5230" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" transform="rotate(${i * 25.7})"/>`).join('') : '';
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="${o.hedgehog ? 62 : 56}" rx="44" ry="8" fill="#000" opacity=".16"/><g style="transform-origin:0px 0px;${anims(spin)}">${spikes}
  <circle r="54" fill="#fff"/>${[0, 2, 4].map((i, k) => seg((i * Math.PI) / 3, ['#e8434e', '#ffd23f', '#3b82f6'][k])).join('')}<circle r="54" fill="none" stroke="${INK}" stroke-width="6"/><circle r="8" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="-20" cy="-22" rx="14" ry="7" fill="#fff" opacity=".55" transform="rotate(-35 -20 -22)"/>
  ${o.hedgehog ? `<circle cx="-14" cy="6" r="5" fill="${INK}"/><circle cx="14" cy="6" r="5" fill="${INK}"/><circle cx="-12" cy="4" r="1.8" fill="#fff"/><circle cx="16" cy="4" r="1.8" fill="#fff"/><path d="M-9 20 q9 8 18 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="-30" cy="16" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="30" cy="16" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/>` : ''}</g></g>`;
};

// bouée de sauvetage rouge/blanche ; (0,0) = centre
export const lifebuoy = (x = 0, y = 0, s = 1, col = '#e8434e') => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="48" fill="none" stroke="${INK}" stroke-width="36"/><circle r="48" fill="none" stroke="${col}" stroke-width="26"/>${[45, 135, 225, 315].map((a) => `<path d="M0 -62 v28" stroke="#fff" stroke-width="16" transform="rotate(${a})"/>`).join('')}<circle r="62" fill="none" stroke="${INK}" stroke-width="4"/><circle r="35" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-36 -36 A50 50 0 0 1 8 -58" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/></g>`;

// bouteille à la mer ; (0,0) = fond ; hauteur ≈ 130 ; o.scroll = false pour sans message ; o.rot
export const bottle = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.rot || 0}) scale(${s})"><ellipse cy="3" rx="34" ry="6" fill="#000" opacity=".16"/>
  <path d="M-26 0 Q-30 -64 -12 -80 V-110 H12 V-80 Q30 -64 26 0Z" fill="#a8e6cf" fill-opacity=".85" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="-10" y="-124" width="20" height="18" rx="4" ${O('#c9965a', 4)}/>
  ${o.scroll === false ? '' : `<g transform="translate(0 -40) rotate(8)"><rect x="-9" y="-34" width="18" height="60" rx="8" fill="#fff4d6" stroke="${INK}" stroke-width="3.5"/><path d="M-4 -22 h8 M-4 -10 h8 M-4 2 h8" stroke="#2b5ba8" stroke-width="3" stroke-linecap="round"/><circle cy="10" r="3" fill="#e8434e"/></g>`}
  <path d="M-16 -66 Q-18 -28 -16 -10" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/></g>`;

// poisson : kind 'fish' | 'herring' (hareng, long) | 'sardine' (en peluche : coutures + boutons) ; (0,0) = centre
export const fish = (x = 0, y = 0, s = 1, kind = 'fish', col = '#ff9f43') => {
  const body = kind === 'herring'
    ? `<path d="M-70 0 Q-30 -26 40 -12 L84 -28 L76 0 L84 28 L40 12 Q-30 26 -70 0Z" ${O('#b9c8dc', 4.5)}/><path d="M-60 -2 Q-10 -8 50 -2" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>`
    : `<path d="M-52 0 Q-20 -40 30 -22 L66 -42 Q58 0 66 42 L30 22 Q-20 40 -52 0Z" ${O(kind === 'sardine' ? '#8fb3d9' : col, 4.5)}/>${kind === 'sardine' ? `<path d="M-30 -14 q-4 14 0 28 M-8 -18 q-4 18 0 36" stroke="#fff" stroke-width="3.5" stroke-dasharray="4 5" fill="none"/><circle cx="12" cy="0" r="5" ${O('#ffd23f', 3)}/>` : `<path d="M-10 -30 Q4 0 -10 30" stroke="#fff" stroke-width="5" fill="none" opacity=".5"/>`}`;
  const eyeX = kind === 'herring' ? -50 : -30;
  return `<g transform="translate(${x} ${y}) scale(${s})">${body}<circle cx="${eyeX}" cy="-4" r="6.5" fill="${INK}"/><circle cx="${eyeX - 2}" cy="-6" r="2.2" fill="#fff"/><path d="M${eyeX - 8} 8 q6 5 12 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
};

// ═════════════════════ bateau, phare, port ═════════════════════

// petit bateau de pêche, de profil, étrave à droite ; (0,0) = ligne de flottaison au centre ; longueur ≈ 340 ;
// o.bob = false immobile ; o.sail = voile ; o.lantern = lanterne au mât (true = allumée, nombre = temps d'allumage) ; o.broken = lanterne cassée ; o.col coque ; o.inside = svg dans le cockpit (personnages à y ≈ -40)
export const boat = (x = 0, y = 0, s = 1, o = {}) => {
  const hull = o.col || '#e8434e';
  const lamp = o.lantern ? `<g transform="translate(100 -250)">${o.broken ? `<g transform="rotate(30)">` : '<g>'}<path d="M0 -20 V-4" stroke="${INK}" stroke-width="5"/><g style="transform-origin:0px 10px;animation:sglo2 1.2s ease-in-out infinite alternate"><circle cy="10" r="90" fill="#ffe27a" fill-opacity=".14"/><circle cy="10" r="56" fill="#ffe27a" fill-opacity=".2"/></g><rect x="-14" y="-6" width="28" height="36" rx="7" ${O(o.broken ? '#bfa05a' : '#ffe27a', 4)}/>${o.broken ? `<path d="M-10 0 l8 10 l-6 8 l8 8" stroke="${INK}" stroke-width="3" fill="none"/>` : `<ellipse cy="14" rx="6" ry="9" fill="#ffb300"/>`}</g></g>` : '';
  const sail = o.sail ? `<path d="M118 -250 V-70 Q40 -60 -20 -78 Q40 -150 118 -250Z" ${O('#fff', 5)}/><path d="M80 -190 Q40 -130 10 -86" stroke="#bfe6ff" stroke-width="6" fill="none" stroke-linecap="round"/>` : '';
  const body = `<ellipse cy="14" rx="190" ry="14" fill="#000" opacity=".15"/>
  <path d="M100 -250 V-60" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M100 -250 V-60" stroke="#e8c590" stroke-width="6" stroke-linecap="round"/>${sail}${lamp}
  ${o.inside ? `<g>${o.inside}</g>` : ''}
  <path d="M-170 -54 H190 Q180 4 120 20 H-110 Q-160 10 -170 -54Z" ${O(hull, 6)}/><path d="M-166 -38 H186" stroke="#fff" stroke-width="12"/><path d="M-170 -54 H190" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <path d="M-166 -38 H186" stroke="${INK}" stroke-width="3" opacity=".35"/>${[-100, -40, 20, 80].map((u) => `<circle cx="${u}" cy="-12" r="12" fill="#bfe6ff" stroke="${INK}" stroke-width="4.5"/>`).join('')}
  <path d="M-150 -50 H170" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/><ellipse cx="-30" cy="22" rx="200" ry="8" fill="#fff" opacity=".6"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="transform-origin:0px 10px;${o.bob === false ? '' : 'animation:sbob 2.4s ease-in-out infinite alternate'}">${body}</g></g>`;
};

// phare : (0,0) = pied ; hauteur ≈ 420 ; o.light = faisceau qui balaie
export const lighthouse = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cy="4" rx="100" ry="12" fill="#000" opacity=".18"/>
  ${o.light ? `<g transform="translate(0 -372)"><g style="transform-origin:0px 0px;animation:sbeam 1.6s ease-in-out infinite alternate"><path d="M0 0 L520 -60 V60Z M0 0 L-520 -60 V60Z" fill="#fff3a6"/></g></g>` : ''}
  <path d="M-62 0 L-40 -300 H40 L62 0Z" ${O('#fff', 6)}/><path d="M-58 -60 L-54 -120 H54 L58 -60Z M-50 -180 L-46 -240 H46 L50 -180Z" fill="#e8434e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-48 -300 H48 V-312 H-48Z" ${O('#6a6a7a', 5)}/><rect x="-32" y="-362" width="64" height="52" rx="8" ${O(o.light ? '#fff3a6' : '#bfe6ff', 5)}/><path d="M-32 -336 h64 M0 -362 V-310" stroke="${INK}" stroke-width="4"/>
  <path d="M-42 -362 Q0 -420 42 -362Z" ${O('#e8434e', 5)}/><circle cy="-420" r="7" ${O('#ffd23f', 3.5)}/><path d="M-20 -30 v-30 q20 -22 40 0 v30Z" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><path d="M-30 -270 L-22 -130" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/></g>`;

// maison de port colorée : (0,0) = pied ; largeur ≈ 150
const house = (x, y, w, h, col, roof) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" ${O(col, 5)}/><path d="M${-w / 2 - 8} ${-h} L0 ${-h - 50} L${w / 2 + 8} ${-h}Z" ${O(roof, 5)}/><rect x="${-w * 0.32}" y="${-h * 0.7}" width="${w * 0.26}" height="${w * 0.26}" rx="4" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/><rect x="${w * 0.08}" y="${-h * 0.7}" width="${w * 0.26}" height="${w * 0.26}" rx="4" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/><rect x="-14" y="-40" width="28" height="40" rx="4" fill="#8a5a33" stroke="${INK}" stroke-width="4"/></g>`;

// boulangerie du port (kiosque) : (0,0) = pied ; largeur ≈ 220 ; contient une vitrine de coquillages-biscuits
export const bakery = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="124" ry="10" fill="#000" opacity=".16"/>
  <rect x="-100" y="-140" width="200" height="140" ${O('#ffe9a8', 5)}/><path d="M-116 -140 H116 L100 -186 H-100Z" ${O('#fff', 5)}/>${[-100, -60, -20, 20, 60].map((u, i) => `<path d="M${u} -186 L${u - 4 + (u < 0 ? -2 : 0)} -140 H${u + 40} L${u + 36} -186Z" fill="${i % 2 ? '#ff8fa3' : '#fff'}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`).join('')}
  <rect x="-80" y="-120" width="160" height="70" rx="6" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/><rect x="-80" y="-84" width="160" height="14" fill="#c9965a" stroke="${INK}" stroke-width="4"/>
  ${shell(-44, -86, 0.4, 'fan')}${shell(0, -86, 0.4, 'spiral')}${shell(44, -86, 0.4, 'fan')}<rect x="-90" y="-50" width="180" height="50" fill="#c9965a" stroke="${INK}" stroke-width="5"/>
  <circle cx="0" cy="-206" r="22" ${O('#f0b45a', 4)}/><path d="M-14 -208 q14 -14 28 0 M-10 -198 q10 8 20 0" stroke="#c98a2c" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;

// bitte d'amarrage, filet suspendu, caisses
export const bollard = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="34" ry="7" fill="#000" opacity=".16"/><path d="M-22 0 V-34 Q-30 -50 -12 -56 H12 Q30 -50 22 -34 V0Z" ${O('#4a4a5e', 5)}/><path d="M-14 -22 h28 M-14 -10 h28" stroke="#c9965a" stroke-width="7" stroke-linecap="round"/></g>`;
export const crate = (x = 0, y = 0, s = 1, fishy = false) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="56" ry="8" fill="#000" opacity=".16"/>${fishy ? `${fish(-12, -46, 0.4, 'fish', '#ff9f43')}${fish(14, -40, 0.4, 'herring')}` : ''}<rect x="-48" y="-56" width="96" height="56" rx="5" ${O('#d9a05b', 5)}/><path d="M-48 -38 H48 M-48 -18 H48 M-24 -56 V0 M24 -56 V0" stroke="#a8743f" stroke-width="5"/><path d="M-40 -48 h30" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/></g>`;
export const net = (x = 0, y = 0, s = 1, w = 200, h = 120) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q${w / 2} ${h} ${w} 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M0 0 Q${w / 2} ${h} ${w} 0" fill="none" stroke="#e8c590" stroke-width="3.5" stroke-linecap="round"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${(i + 1) * w / 8} ${h * 0.4 + Math.sin((i + 1) / 8 * Math.PI) * 4} V${h * (0.4 + Math.sin((i + 1) / 8 * Math.PI) * 0.45) * 0.9}" stroke="#e8c590" stroke-width="3" opacity=".8"/>`).join('')}${[0.2, 0.5, 0.8].map((u) => `<circle cx="${u * w}" cy="${h * 4 * u * (1 - u)}" r="8" ${O(u === 0.5 ? '#ff8fa3' : '#ffd23f', 3.5)}/>`).join('')}</g>`;

// ponton en bois (premier plan) : de x0 à x1, dessus à y ; pilotis en dessous
export const pier = (x0 = 0, x1 = W, y = 560) => `<g>${Array.from({ length: Math.round((x1 - x0) / 90) + 1 }, (_, i) => `<rect x="${x0 + i * 90 - 9}" y="${y}" width="18" height="${H - y}" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>`).join('')}<rect x="${x0}" y="${y - 8}" width="${x1 - x0}" height="40" ${O('#d9a05b', 6)}/>${Array.from({ length: Math.round((x1 - x0) / 70) }, (_, i) => `<path d="M${x0 + 70 * (i + 1)} ${y - 6} V${y + 30}" stroke="#a8743f" stroke-width="4"/>`).join('')}<rect x="${x0}" y="${y - 8}" width="${x1 - x0}" height="8" fill="#fff" opacity=".25"/></g>`;

// fond du petit port : ciel, mer, quai, maisons colorées, phare lointain, bateaux, filets ; o.tone ; o.lighthouse (défaut true)
export const harborBg = (o = {}) => {
  const tone = o.tone || 'day';
  return `${seaSky(tone)}${tone === 'night' ? moon() : seaSun(1100, 100, 0.9)}${seaClouds(tone)}${sea(tone, { y0: HORIZON, y1: 520 })}
  ${o.lighthouse === false ? '' : lighthouse(1130, 372, 0.38, { light: tone !== 'day' })}
  ${boat(220, 392, 0.34, { col: '#3b82f6' })}${boat(520, 410, 0.3, { col: '#ffd23f', sail: true })}${boat(860, 400, 0.36, { col: '#52c468' })}
  <rect y="500" width="${W}" height="${H - 500}" fill="${P(tone).sand[0]}" stroke="${INK}" stroke-width="5"/><path d="M0 548 H${W} M0 640 H${W}" stroke="${P(tone).sand[1]}" stroke-width="6" opacity=".7"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 110 + 6}" y="${506 + (i % 2) * 6}" width="96" height="30" rx="5" fill="#cdbf9d" stroke="${INK}" stroke-width="3.5" opacity=".8"/>`).join('')}
  ${house(150, 500, 130, 110, '#ffb3c6', '#e8434e')}${house(300, 500, 110, 90, '#bfe6ff', '#3b82f6')}${house(1000, 500, 120, 100, '#ffe27a', '#ff9f43')}${house(1150, 500, 110, 80, '#b6f0c2', '#e8434e')}
  ${bollard(80, 640, 0.9)}${bollard(1190, 650, 0.9)}${net(1010, 560, 0.8, 200, 110)}${crate(400, 690, 0.9, true)}${crate(480, 692, 0.7)}`;
};

// ═════════════════════ gare et train ═════════════════════

// train (une voiture jaune + locomotive bleue à droite) ; (0,0) = rails ; longueur ≈ 700 ; o.drive = [[a,b]] roues qui tournent + cahot ; o.smoke (défaut true) ; o.windows = svg dans les fenêtres (têtes)
export const train = (x = 0, y = 0, s = 1, o = {}) => {
  const drive = o.drive || [];
  const wheel = (cx) => {
    const sp = drive.map(([a, b]) => { const c = cyc(a, b, 0.5); return ao({ n: 'spin', d: (b - a) / c, t: a, c }); });
    return `<g transform="translate(${cx} -24)"><g style="transform-origin:0px 0px;${anims(sp)}"><circle r="24" ${O('#3a3340', 5)}/><circle r="12" ${O('#ffd23f', 3.5)}/><path d="M0 -24 V24 M-24 0 H24" stroke="#fff" stroke-width="4" opacity=".6"/></g></g>`;
  };
  const bump = drive.map(([a, b]) => ao({ n: 'fbump', d: 0.16, t: a, c: cyc(a, b, 0.16), dir: 'alternate' }));
  const smoke = o.smoke === false ? '' : [0, 1, 2].map((i) => `<g transform="translate(290 -214)"><g style="${an({ n: 'ssmoke', d: 1.4, t: i * 0.47, c: 999 })}"><circle r="18" fill="#f0f0f8" stroke="#c4c4d6" stroke-width="3"/></g></g>`).join('');
  const cabin = (cx, col) => `<rect x="${cx - 150}" y="-170" width="300" height="130" rx="18" ${O(col, 6)}/><rect x="${cx - 150}" y="-80" width="300" height="12" fill="#fff"/><rect x="${cx - 150}" y="-86" width="300" height="3" fill="${INK}" opacity=".3"/>${[-90, 0, 90].map((u) => `<rect x="${cx + u - 36}" y="-150" width="72" height="56" rx="12" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/><path d="M${cx + u - 24} -138 l22 -4" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`).join('')}`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="400" ry="12" fill="#000" opacity=".2"/><g style="${anims(bump)}">
  ${smoke}${cabin(-210, '#ffd23f')}<path d="M-60 -100 h20" stroke="${INK}" stroke-width="8"/>
  <path d="M170 -40 V-170 H250 Q262 -170 262 -150 V-130 H320 Q350 -130 352 -100 V-40Z" ${O('#3b82f6', 6)}/><rect x="192" y="-150" width="50" height="50" rx="10" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/><rect x="258" y="-212" width="34" height="48" rx="8" ${O('#6a6a7a', 5)}/><rect x="252" y="-222" width="46" height="14" rx="6" ${O('#4a4a5e', 4)}/>
  <circle cx="338" cy="-90" r="12" ${O('#fff3a6', 4)}/><path d="M170 -40 V-50 H350" stroke="#fff" stroke-width="7" opacity=".6"/><path d="M190 -160 H240" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
  <rect x="-368" y="-44" width="738" height="14" rx="6" ${O('#6a6a7a', 4)}/>${wheel(-300)}${wheel(-120)}${wheel(-0 + 130)}${wheel(260)}${wheel(330)}</g></g>`;
};

// fond de gare : ciel, quai, abri, horloge ronde (aiguilles pour h:m), bancs, rails ; o.h, o.m heure affichée ; o.tone
export const station = (o = {}) => {
  const { h = 7, m = 30, tone = 'day' } = o;
  const hand = (deg, len, w) => `<path d="M0 0 L${(Math.sin(deg * Math.PI / 180) * len).toFixed(1)} ${(-Math.cos(deg * Math.PI / 180) * len).toFixed(1)}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `${seaSky(tone)}${seaSun(1100, 120, 0.9)}${seaClouds(tone)}
  <rect y="320" width="${W}" height="260" fill="#d9f2ff"/><path d="M0 420 Q220 340 460 410 Q700 330 960 400 Q1120 350 1280 410 V560 H0Z" fill="#a5e08a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M0 330 H${W}" stroke="none"/>
  <rect y="560" width="${W}" height="160" fill="#c9ccd8" stroke="${INK}" stroke-width="5"/><path d="M0 600 H${W}" stroke="#a9acba" stroke-width="6"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 100 + 20} 604 V720" stroke="#a9acba" stroke-width="4" opacity=".6"/>`).join('')}
  <rect y="534" width="${W}" height="30" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><path d="M0 549 H${W}" stroke="${INK}" stroke-width="3" stroke-dasharray="26 18" opacity=".5"/>
  <path d="M120 360 H520 L560 330 H80Z" ${O('#e8434e', 5)}/><rect x="140" y="360" width="16" height="174" ${O('#8a5a33', 4)}/><rect x="484" y="360" width="16" height="174" ${O('#8a5a33', 4)}/>
  <g transform="translate(320 440)"><circle r="54" ${O('#fff', 6)}/>${Array.from({ length: 12 }, (_, i) => `<path d="M0 -44 v${i % 3 ? 5 : 9}" stroke="${INK}" stroke-width="${i % 3 ? 3 : 5}" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}${hand(((h % 12) + m / 60) * 30, 26, 7)}${hand(m * 6, 38, 5)}<circle r="5" fill="#e8434e" stroke="${INK}" stroke-width="2.5"/></g>
  <rect x="740" y="470" width="220" height="64" rx="10" ${O('#3b82f6', 5)}/><path d="M760 502 h60 M840 502 h100" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M770 520 l40 0 M880 520 h50" stroke="#bfe6ff" stroke-width="5" stroke-linecap="round"/><rect x="760" y="534" width="14" height="26" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><rect x="926" y="534" width="14" height="26" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>
  ${bench(1120, 566, 0.9)}`;
};
export const bench = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-70" width="140" height="14" rx="6" ${O('#d9a05b', 4)}/><rect x="-70" y="-48" width="140" height="14" rx="6" ${O('#d9a05b', 4)}/><rect x="-64" y="-30" width="128" height="16" rx="6" ${O('#e8c590', 4)}/><rect x="-56" y="-14" width="12" height="16" fill="#4a4a5e" stroke="${INK}" stroke-width="3.5"/><rect x="44" y="-14" width="12" height="16" fill="#4a4a5e" stroke="${INK}" stroke-width="3.5"/></g>`;

// valise : (0,0) = fond ; o.col ; o.spikes = piquants qui dépassent (valise de Piquette)
export const suitcase = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="64" ry="8" fill="#000" opacity=".16"/>
  ${o.spikes ? Array.from({ length: 9 }, (_, i) => `<path d="M${-46 + i * 11} -70 L${-52 + i * 13} -112 L${-36 + i * 11 + 4} -70Z" fill="#8a5230" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`).join('') : ''}
  <path d="M-22 -80 V-96 H22 V-80" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><rect x="-60" y="-80" width="120" height="78" rx="12" ${O(o.col || '#ff8f6b', 6)}/><path d="M-60 -52 H60" stroke="${INK}" stroke-width="4" opacity=".4"/><rect x="-10" y="-60" width="20" height="14" rx="4" ${O('#ffd23f', 3.5)}/><path d="M-48 -72 h30" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/></g>`;

// ═════════════════════ grotte et lumière ═════════════════════

// entrée de grotte vue de la plage (rochers + trou sombre) : (0,0) = pied ; largeur ≈ 420
export const caveMouth = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="230" ry="14" fill="#000" opacity=".18"/>
  <path d="M-220 0 Q-230 -170 -100 -250 Q0 -300 100 -250 Q230 -170 220 0Z" ${O('#8d92a8', 6)}/><path d="M-120 0 Q-130 -120 -60 -170 Q0 -196 60 -170 Q130 -120 120 0Z" fill="#1d1a33" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-170 -150 Q-130 -230 -50 -252" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".35"/><path d="M-200 -60 q20 -14 40 -4 M150 -100 q20 -16 40 -4" stroke="#6f748c" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="-30" cy="-60" r="5" fill="#ffe27a" style="animation:sglint 1.1s ease-in-out infinite alternate"/><circle cx="36" cy="-90" r="4" fill="#ffe27a" style="animation:sglint 1.6s ease-in-out .4s infinite alternate"/></g>`;

// intérieur de grotte (fond plein écran) ; o.lit = temps d'apparition de la lueur (0 = toujours) ; o.crystals (défaut true)
export const caveBg = (o = {}) => {
  const { lit = 0, crystals = true } = o;
  const cr = (cx, cy, r, c) => `<g transform="translate(${cx} ${cy}) rotate(${r})"><path d="M-14 0 L-8 -56 L0 -74 L10 -52 L14 0Z" ${O(c, 4.5)}/><path d="M-6 -6 L-4 -50" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></g>`;
  const glow = vis(lit, 999, `<g style="transform-origin:640px 470px;animation:sglo2 1.6s ease-in-out infinite alternate"><circle cx="640" cy="470" r="380" fill="#9fe8ff" fill-opacity=".08"/><circle cx="640" cy="470" r="270" fill="#9fe8ff" fill-opacity=".1"/><circle cx="640" cy="470" r="160" fill="#9fe8ff" fill-opacity=".12"/></g>`);
  return `<rect width="${W}" height="${H}" fill="#2b2547"/><path d="M0 0 H${W} V120 Q1180 200 1100 150 Q1000 90 930 170 Q840 80 760 150 Q640 60 540 150 Q440 90 340 160 Q220 100 130 170 Q60 130 0 150Z" ${O('#443a68', 6)}/>
  ${[160, 400, 780, 1060].map((u, i) => `<path d="M${u - 26} ${130 + (i % 2) * 10} L${u} ${230 + i * 14} L${u + 26} ${130 + (i % 2) * 10}Z" ${O('#554a7c', 5)}/>`).join('')}
  <path d="M0 560 Q320 520 640 556 Q960 520 ${W} 560 V${H} H0Z" ${O('#5a4e82', 6)}/><path d="M0 640 Q320 610 640 640 T${W} 640" stroke="#6e629a" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${glow}${crystals ? `${vis(lit, 999, `${cr(180, 560, -12, '#7fe3ff')}${cr(226, 566, 14, '#b6f0ff')}${cr(1060, 556, 10, '#ff9fe0')}${cr(1110, 562, -14, '#ffc8f0')}${cr(660, 540, 0, '#9fe8ff')}`)}` : ''}
  <path d="M140 706 q20 -14 40 0 M900 700 q20 -12 36 0" stroke="#3a3158" stroke-width="6" fill="none" stroke-linecap="round"/>`;
};

// lanterne ; (0,0) = anneau ; o.lit = temps d'allumage (0 = allumée) ; o.cracked
export const lantern = (x = 0, y = 0, s = 1, o = {}) => {
  const lit = o.lit ?? 0;
  return `<g transform="translate(${x} ${y}) scale(${s})">${vis(lit, 999, `<g style="transform-origin:0px 30px;animation:sglo2 1.3s ease-in-out infinite alternate"><circle cy="30" r="150" fill="#ffe27a" fill-opacity=".1"/><circle cy="30" r="95" fill="#ffe27a" fill-opacity=".14"/><circle cy="30" r="50" fill="#fff3b0" fill-opacity=".25"/></g>`)}
  <path d="M0 0 V-20" stroke="${INK}" stroke-width="5"/><circle cy="-22" r="8" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-20 10 H20 L14 0 H-14Z" ${O('#6b4a2e', 3.5)}/><rect x="-22" y="10" width="44" height="52" rx="9" ${O(lit > 0 ? '#bfa05a' : '#ffe27a', 4.5)}/>${vis(lit, 999, `<rect x="-15" y="17" width="30" height="38" rx="6" fill="#fff6c8"/><ellipse cy="40" rx="8" ry="12" fill="#ffb300"/>`)}
  ${o.cracked ? `<path d="M-6 12 l8 12 l-8 10 l9 14" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` : ''}<rect x="-26" y="60" width="52" height="10" rx="4" ${O('#6b4a2e', 3.5)}/></g>`;
};
