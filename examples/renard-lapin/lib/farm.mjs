// Décor de la ferme (saison 2) : chaque élément est une fonction qui renvoie une chaîne SVG.
// Convention : les objets sont dessinés autour de (0,0) = leur point au sol (centre bas), à poser avec put(x, y, s, …) ou x,y,s en paramètres.
// Les animaux regardent à droite (put(..., flip=true) pour les retourner). Sol de la ferme : GROUND = 560.
import { W, H, INK, an, ao, anims, vis, tf, cloud, eyeStates, mouthStates, addKF } from './kit.mjs';

export const GROUND = 560;

addKF(`@keyframes fflame{from{transform:scale(.92,.86) rotate(-3deg)}to{transform:scale(1.06,1.14) rotate(3deg)}}
@keyframes fglow{from{opacity:.07;transform:scale(.94)}to{opacity:.16;transform:scale(1.06)}}
@keyframes fspark{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-130px)}}
@keyframes fsteam{0%{opacity:0;transform:translateY(0) scaleY(.6)}30%{opacity:.9}100%{opacity:0;transform:translateY(-46px) scaleY(1.2)}}
@keyframes fsmoke{0%{opacity:.9;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(-70px,-90px) scale(1.5)}}
@keyframes fripple{0%{opacity:.9;transform:scale(.2)}100%{opacity:0;transform:scale(1.6)}}
@keyframes fdrop{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@keyframes fshoot{0%{opacity:0;transform:translate(0,0)}8%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@keyframes frain{from{transform:translate(0,-60px)}to{transform:translate(-30px,60px)}}
@keyframes fbump{from{transform:translateY(0)}to{transform:translateY(-4px)}}
@keyframes fpeck{0%,100%{transform:rotate(0)}40%,60%{transform:rotate(38deg)}}
@keyframes ftw{from{opacity:.25}to{opacity:1}}
@keyframes flash{0%{opacity:0}8%{opacity:.85}22%{opacity:.1}34%{opacity:.7}100%{opacity:0}}
@keyframes fbolt{0%,100%{opacity:0}6%,60%{opacity:1}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const blushW = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
const beakTalk = (cx, cy, talk, rx = 5, ry = 7) => talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:${cx}px ${cy}px;${an({ n: 'talk', d: 0.14, t: a, c: Math.max(1, Math.round((b - a) / 0.14)), dir: 'alternate' })}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8c2f3a" stroke="${INK}" stroke-width="3"/></g>`)).join('');

// ═════════════════════ fonds ═════════════════════

// ciel : 'day' | 'dusk' | 'night' | 'storm'  (aplats en bandes, pas de dégradé)
export const sky = (kind = 'day') => {
  const bands = {
    day: ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#d9f2ff'],
    dusk: ['#ff9f6b', '#ffb07a', '#ffc98f', '#ffe0a8'],
    night: ['#10163f', '#161e52', '#1d2766', '#27327c'],
    storm: ['#3d4257', '#4b5069', '#5a607a', '#6a7088'],
  }[kind] || [];
  return bands.map((c, i) => `<rect y="${(i * GROUND) / 4}" width="${W}" height="${GROUND / 4 + 2}" fill="${c}"/>`).join('');
};

export const sun = (x = 1090, y = 110, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation:spin 24s linear infinite">${Array.from({ length: 10 }, (_, i) => `<path d="M0 -66 L9 -48 L-9 -48Z" fill="#ffd23f" transform="rotate(${i * 36})"/>`).join('')}</g>
  <circle r="40" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><circle cx="-14" cy="-14" r="10" fill="#fff" opacity=".5"/>
  <path d="M-13 8 q13 13 26 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-13" cy="-4" r="4" fill="${INK}"/><circle cx="13" cy="-4" r="4" fill="${INK}"/><ellipse cx="-24" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/><ellipse cx="24" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/></g>`;

export const clouds = (dark = false) => `<g style="animation:cdrift 14s ease-in-out infinite alternate">${cloud(260, 120, 0.8, dark ? 0.7 : 1)}${cloud(640, 80, 0.55, dark ? 0.7 : 0.95)}${cloud(930, 150, 0.7, dark ? 0.7 : 1)}</g>`;

// collines lointaines + petits arbres + champs
export const hills = (tone = 'day') => {
  const c = { day: ['#a5e08a', '#7fcf6a', '#e9d36a'], dusk: ['#c9b46a', '#a69a58', '#d9a95a'], dark: ['#3a5a58', '#2e4a4a', '#4a5a4a'] }[tone] || ['#a5e08a', '#7fcf6a', '#e9d36a'];
  const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="-34" width="14" height="36" rx="4" ${O(tone === 'dark' ? '#4a3a3a' : '#9b6a3c', 3.5)}/><circle cy="-58" r="34" ${O(tone === 'dark' ? '#2f6b52' : '#3fae55', 3.5)}/><circle cx="-12" cy="-66" r="10" fill="#fff" opacity=".25"/></g>`;
  return `<path d="M0 ${GROUND - 60} Q220 ${GROUND - 220} 470 ${GROUND - 100} Q700 ${GROUND - 20} 900 ${GROUND - 170} Q1100 ${GROUND - 250} ${W} ${GROUND - 110} V${GROUND} H0Z" fill="${c[0]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M0 ${GROUND - 30} Q300 ${GROUND - 120} 600 ${GROUND - 40} Q900 ${GROUND - 110} ${W} ${GROUND - 30} V${GROUND} H0Z" fill="${c[1]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  ${[0, 1, 2, 3].map((i) => `<path d="M${120 + i * 100} ${GROUND - 56 + i * 4} q70 -26 130 -8" stroke="${c[2]}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}
  ${tree(960, GROUND - 100, 0.8)}${tree(1040, GROUND - 92, 0.6)}${tree(110, GROUND - 70, 0.7)}`;
};

// pré de premier plan
export const meadow = (tone = 'day') => {
  const g = { day: ['#8fd16e', '#7fc35e'], dusk: ['#a8b45e', '#98a450'], dark: ['#2f5a52', '#27504a'] }[tone] || ['#8fd16e', '#7fc35e'];
  return `<rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${g[0]}"/><rect y="${GROUND}" width="${W}" height="12" fill="${g[1]}"/>
  ${Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 80 + rnd(i) * 30, y = GROUND + 40 + (i % 4) * 36; return `<path d="M${x} ${y} q-4 -14 -10 -18 M${x} ${y} q0 -16 0 -22 M${x} ${y} q4 -14 10 -18" stroke="${g[1]}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('')}
  ${tone === 'day' ? Array.from({ length: 8 }, (_, i) => { const x = 90 + i * 150 + rnd(i + 9) * 40, y = GROUND + 56 + (i % 3) * 40; return `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos((a * Math.PI) / 180) * 7}" cy="${Math.sin((a * Math.PI) / 180) * 7}" r="5" fill="${i % 2 ? '#fff' : '#ffb3c6'}"/>`).join('')}<circle r="4" fill="#ffd23f"/></g>`; }).join('') : ''}`;
};

// barrière en bois
export const fence = (x0 = 0, x1 = W, y = GROUND, s = 1) => {
  const n = Math.max(2, Math.round((x1 - x0) / (70 * s)));
  const posts = Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (i * (x1 - x0)) / n; return `<rect x="${x - 11 * s}" y="${y - 84 * s}" width="${22 * s}" height="${90 * s}" rx="8" ${O('#e8c590', 4)}/>`; }).join('');
  return `<g>${[-30, -66].map((dy) => `<rect x="${x0 - 8}" y="${y + dy * s - 8 * s}" width="${x1 - x0 + 16}" height="${16 * s}" rx="7" ${O('#f6dcae', 4)}/>`).join('')}${posts}</g>`;
};

// fond complet « jour à la ferme » : ciel, soleil, nuages, collines, barrière, pré
export const farmBg = (o = {}) => {
  const { sunny = true, withFence = true } = o;
  return `${sky('day')}${sunny ? sun() : ''}${clouds()}${hills('day')}${withFence ? fence(0, W, GROUND - 6) : ''}${meadow('day')}`;
};

// ═════════════════════ la grange ═════════════════════

// grange rouge vue de face ; (0,0) = centre bas ; largeur ≈ 400, hauteur ≈ 310 ; o.open = temps d'ouverture des portes (ou true = ouvertes)
export const barn = (x = 0, y = 0, s = 1, o = {}) => {
  const open = o.open;
  const leaf = (k) => {
    const ox = k * 70, body = `<rect x="${k > 0 ? 0 : -70}" y="-150" width="70" height="150" ${O('#c43e3e', 4)}/><path d="M${k > 0 ? 6 : -64} -144 L${k > 0 ? 64 : -6} -6 M${k > 0 ? 64 : -6} -144 L${k > 0 ? 6 : -64} -6" stroke="#fff4dc" stroke-width="8" stroke-linecap="round"/><rect x="${k > 0 ? 3 : -67}" y="-147" width="64" height="144" fill="none" stroke="#fff4dc" stroke-width="7"/>`;
    const shown = open === undefined ? body : tf(body, { t0: open === true ? 0 : open, d: open === true ? 0.01 : 0.7, from: 'scaleX(1)', to: 'scaleX(.15)', e: 'ease-out', o: `${ox}px 0px` });
    return shown;
  };
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="6" rx="230" ry="14" fill="#000" opacity=".2"/>
  <path d="M-190 0 V-196 L-150 -250 L0 -304 L150 -250 L190 -196 V0Z" ${O('#e8434e', 6)}/>
  ${Array.from({ length: 7 }, (_, i) => `<path d="M${-150 + i * 50} -4 V-200" stroke="#c43e3e" stroke-width="4" stroke-linecap="round" opacity=".6"/>`).join('')}
  <path d="M-198 -196 L-152 -258 L0 -312 L152 -258 L198 -196" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-198 -196 L-152 -258 L0 -312 L152 -258 L198 -196" stroke="#fff4dc" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="-70" y="-150" width="140" height="150" fill="#2b1e1a"/><path d="M-60 -4 q30 -30 60 0 q30 -26 58 0" fill="#e8c14d" stroke="none" opacity=".9"/>
  ${leaf(-1)}${leaf(1)}
  <rect x="-74" y="-154" width="148" height="154" fill="none" stroke="#fff4dc" stroke-width="7" rx="2"/><rect x="-74" y="-154" width="148" height="154" fill="none" stroke="${INK}" stroke-width="3" rx="2"/>
  <g transform="translate(0 -232)"><rect x="-34" y="-34" width="68" height="68" rx="4" fill="#2b1e1a" stroke="${INK}" stroke-width="4"/><path d="M-30 30 q10 -22 22 -8 q10 -16 26 -2 q10 -6 14 10Z" fill="#e8c14d"/><rect x="-34" y="-34" width="68" height="68" rx="4" fill="none" stroke="#fff4dc" stroke-width="7"/><path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="#fff4dc" stroke-width="6" stroke-linecap="round"/></g>
  <path d="M-188 -40 h-14 M188 -40 h14" stroke="${INK}" stroke-width="4"/><path d="M-120 -170 q-6 -14 4 -20 M130 -176 l10 -12" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/></g>`;
};

// bottes de foin : 'stack' (meule), 'bale' (botte carrée), 'round' (rouleau vu de face)
export const hay = (x = 0, y = 0, s = 1, kind = 'stack') => {
  const straw = (n, w, h) => Array.from({ length: n }, (_, i) => `<path d="M${(rnd(i) - 0.5) * w} ${-rnd(i + 5) * h} l${(rnd(i + 3) - 0.5) * 20} ${-8}" stroke="#c99a2e" stroke-width="3.5" stroke-linecap="round"/>`).join('');
  const body = kind === 'bale'
    ? `<rect x="-60" y="-70" width="120" height="70" rx="10" ${O('#e8c14d', 5)}/><path d="M-26 -70 V0 M26 -70 V0" stroke="#b98a28" stroke-width="5"/>${straw(10, 110, 62)}<rect x="-52" y="-62" width="50" height="10" rx="5" fill="#fff" opacity=".35"/>`
    : kind === 'round'
      ? `<circle cy="-60" r="60" ${O('#e8c14d', 5)}/><circle cy="-60" r="42" fill="none" stroke="#c99a2e" stroke-width="4"/><circle cy="-60" r="24" fill="none" stroke="#c99a2e" stroke-width="4"/><circle cy="-60" r="7" fill="#c99a2e"/><path d="M-40 -88 q20 -14 40 -10" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".4" fill="none"/>`
      : `<path d="M-90 0 Q-96 -90 -30 -150 Q0 -176 30 -150 Q96 -90 90 0Z" ${O('#e8c14d', 5)}/>${straw(16, 150, 120)}<path d="M-50 -100 Q-30 -140 -4 -152" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".4" fill="none"/><path d="M-14 -166 l8 -26 M6 -168 l14 -22" stroke="#e8c14d" stroke-width="6" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="${kind === 'stack' ? 100 : 70}" ry="10" fill="#000" opacity=".18"/>${body}</g>`;
};

// intérieur de la grange (fond plein écran) ; o.lantern (défaut true), o.litAt = temps d'allumage de la lanterne (0 = allumée)
export const barnInside = (o = {}) => {
  const { lantern = true, litAt = 0 } = o;
  const lamp = lantern ? `<g transform="translate(880 210)"><path d="M0 -210 V-34" stroke="${INK}" stroke-width="5"/>
    ${litAt > 0 ? vis(0, litAt, '') : ''}${vis(litAt, 999, `<g style="transform-origin:0px 0px;animation:fglow 1.4s ease-in-out infinite alternate"><circle r="190" fill="#ffe27a"/><circle r="110" fill="#fff3b0"/></g>`)}
    <rect x="-20" y="-40" width="40" height="52" rx="8" ${O(litAt > 0 ? '#bfa05a' : '#ffe27a', 4)}/>${vis(litAt, 999, `<rect x="-14" y="-32" width="28" height="38" rx="6" fill="#fff6c8"/><ellipse cy="-8" rx="8" ry="12" fill="#ffb300"/>`)}<path d="M-14 -44 h28 l-6 -12 h-16z" ${O('#6b4a2e', 3.5)}/></g>` : '';
  return `<rect width="${W}" height="${H}" fill="#a8743f"/>
  ${Array.from({ length: 22 }, (_, i) => `<path d="M${i * 60} 0 V${GROUND}" stroke="#8a5a33" stroke-width="5"/>`).join('')}
  ${Array.from({ length: 6 }, (_, i) => `<ellipse cx="${100 + i * 210}" cy="${120 + (i % 3) * 130}" rx="9" ry="5" fill="#7d5229"/>`).join('')}
  <rect x="0" y="40" width="${W}" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="6"/><path d="M0 560 L420 40 M${W} 560 L860 40" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M0 560 L420 40 M${W} 560 L860 40" stroke="#8a5a33" stroke-width="12" stroke-linecap="round"/>
  <rect x="${W - 150}" y="150" width="70" height="90" rx="6" fill="#2b1e1a" stroke="${INK}" stroke-width="5"/><path d="M${W - 148} 238 q10 -22 24 -8 q12 -16 26 -2 q10 -6 18 10Z" fill="#e8c14d"/>
  <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="#e8c96a"/><rect y="${GROUND}" width="${W}" height="10" fill="#c99a2e"/>
  ${Array.from({ length: 24 }, (_, i) => `<path d="M${20 + i * 54 + rnd(i) * 20} ${GROUND + 30 + (i % 4) * 34} l30 -8" stroke="#c99a2e" stroke-width="5" stroke-linecap="round"/>`).join('')}
  ${hay(150, GROUND + 6, 1.25, 'bale')}${hay(280, GROUND + 6, 1.25, 'bale')}${hay(215, GROUND - 82, 1.25, 'bale')}${hay(1130, GROUND + 6, 1, 'round')}
  <g transform="translate(560 ${GROUND + 6})"><rect x="-70" y="-60" width="140" height="60" rx="10" ${O('#9b6a3c', 5)}/><path d="M-60 -34 h120" stroke="#7d5229" stroke-width="5"/></g>
  ${lamp}`;
};
// voile sombre de la grange : à poser PAR-DESSUS les personnages ; disparaît à t = litAt (lanterne allumée)
export const barnDarkness = (litAt = 99, strength = 0.6) => vis(0, litAt, `<rect width="${W}" height="${H}" fill="#0a0f2e" opacity="${strength}"/>`);

// ═════════════════════ eau et potager ═════════════════════

// éclaboussure : gouttes qui jaillissent de (x,y)
export const splash = (x, y, t0, s = 1, n = 9) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: n }, (_, i) => {
  const dx = (i - (n - 1) / 2) * 16 + (rnd(i) - 0.5) * 12, dy = -(70 + rnd(i + 4) * 70);
  return `<g style="--dx:${dx}px;--dy:${dy}px;${an({ n: 'fdrop', d: 0.8, t: t0 + (i % 3) * 0.04, f: 'both', e: 'cubic-bezier(.2,.8,.5,1)' })}"><path d="M0 0 q-7 12 0 17 q7 -5 0 -17z" fill="#8fd3ff" stroke="${INK}" stroke-width="2.5"/></g>`;
}).join('')}<g style="transform-origin:0px 0px;${an({ n: 'fripple', d: 0.9, t: t0, f: 'both' })}"><ellipse rx="70" ry="16" fill="none" stroke="#fff" stroke-width="6"/></g></g>`;

// mare : (x,y) = centre de l'eau ; o.ripples = [[t,dx,dy]] ronds dans l'eau
export const pond = (x = 0, y = 0, s = 1, o = {}) => {
  const lily = (px, py, r, flower) => `<g transform="translate(${px} ${py})"><ellipse rx="${r}" ry="${r * 0.4}" ${O('#3fae55', 3.5)}/><path d="M0 0 L${r} -${r * 0.12} L${r * 0.8} ${r * 0.18}Z" fill="#8fd16e"/>
    ${flower ? `<g transform="translate(-4 -6)">${[-1, 0, 1].map((k) => `<ellipse cx="${k * 9}" cy="-7" rx="6" ry="10" ${O('#ffb3c6', 2.8)} transform="rotate(${k * 28} ${k * 9} 0)"/>`).join('')}<circle cy="-2" r="4" fill="#ffd23f"/></g>` : ''}</g>`;
  const reed = (rx, ry, h) => `<g transform="translate(${rx} ${ry})"><g style="transform-origin:0px 0px;animation:sway 2.6s ease-in-out infinite alternate"><path d="M0 0 Q-4 -${h / 2} 2 -${h}" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M0 0 Q-4 -${h / 2} 2 -${h}" stroke="#52c468" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="-6" y="-${h + 6}" width="14" height="34" rx="7" ${O('#8a5a33', 3.5)}/></g></g>`;
  const ring = (t, dx, dy) => `<g transform="translate(${dx} ${dy})"><g style="transform-origin:0px 0px;${an({ n: 'fripple', d: 1.2, t, f: 'both' })}"><ellipse rx="60" ry="14" fill="none" stroke="#fff" stroke-width="5"/></g></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="8" rx="276" ry="72" ${O('#c9a26a', 5)}/><ellipse cx="0" cy="4" rx="250" ry="58" ${O('#5bb8f0', 5)}/>
  <ellipse cx="-60" cy="-8" rx="150" ry="26" fill="#8fd3ff" opacity=".6"/><path d="M-140 -22 q40 -12 80 0 M60 22 q40 -10 90 2 M-190 18 q24 8 60 2" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".75"/>
  ${(o.ripples || [[0, -40, 10], [1.4, 90, 22]]).map(([t, dx, dy]) => ring(t, dx, dy)).join('')}
  ${lily(-130, 18, 36, true)}${lily(150, -8, 30, false)}${lily(30, 30, 28, true)}${lily(-30, -24, 24, false)}
  ${[[-268, 24, 3], [262, 8, 5]].map(([a, b]) => '').join('')}
  <ellipse cx="-236" cy="34" rx="30" ry="18" ${O('#b8b5ae', 4)}/><ellipse cx="-218" cy="26" rx="16" ry="10" ${O('#cfccc4', 3.5)}/><ellipse cx="240" cy="36" rx="26" ry="16" ${O('#b8b5ae', 4)}/>
  ${reed(-262, 8, 130)}${reed(-244, 2, 100)}${reed(258, 14, 120)}${reed(274, 22, 90)}</g>`;
};

export const carrot = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-18 -4 Q0 -14 18 -4 L2 70 Q0 74 -2 70Z" ${O('#ff9f43', 4)} transform="translate(0 6)"/><path d="M-8 6 h12 M-6 26 h10 M-3 46 h7" stroke="#d9741a" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M0 4 Q-14 -22 -22 -34 M0 4 Q0 -26 0 -42 M0 4 Q14 -22 22 -34" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M0 4 Q-14 -22 -22 -34 M0 4 Q0 -26 0 -42 M0 4 Q14 -22 22 -34" stroke="#52c468" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-10 8 q-2 6 -2 12" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/></g>`;

export const apple = (x = 0, y = 0, s = 1, col = '#e8434e') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -22 Q-34 -34 -32 0 Q-28 30 -10 28 Q0 24 10 28 Q28 30 32 0 Q34 -34 0 -22Z" ${O(col, 4)}/><path d="M0 -22 Q2 -34 8 -40" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="16" cy="-36" rx="12" ry="6" ${O('#52c468', 3)} transform="rotate(-20 16 -36)"/><ellipse cx="-14" cy="-6" rx="6" ry="10" fill="#fff" opacity=".4" transform="rotate(14 -14 -6)"/></g>`;

// potager : 3 rangées en perspective (carottes, choux, salades) ; (0,0) = centre bas ; largeur ≈ 620
export const garden = (x = 0, y = 0, s = 1) => {
  const row = (ry, kind, n) => {
    const plants = Array.from({ length: n }, (_, i) => {
      const px = -240 + (i * 480) / (n - 1) + (rnd(i + ry) - 0.5) * 10;
      if (kind === 'carrot') return `<g transform="translate(${px} ${ry - 6})"><path d="M-6 0 Q0 -10 6 0Z" fill="#ff9f43" stroke="${INK}" stroke-width="3"/><path d="M0 -2 Q-10 -22 -16 -30 M0 -2 Q0 -26 0 -38 M0 -2 Q10 -22 16 -30" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 -2 Q-10 -22 -16 -30 M0 -2 Q0 -26 0 -38 M0 -2 Q10 -22 16 -30" stroke="#52c468" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
      if (kind === 'cabbage') return `<g transform="translate(${px} ${ry - 10})"><circle r="24" ${O('#7fd08a', 4)}/><path d="M-16 4 q16 -22 32 0 M-10 -8 q10 -10 20 0" stroke="#4aa65e" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="-8" cy="-10" rx="7" ry="4" fill="#fff" opacity=".45"/></g>`;
      return `<g transform="translate(${px} ${ry - 6})"><ellipse rx="22" ry="14" ${O('#a8e063', 4)}/><path d="M-12 -4 q12 -10 24 0" stroke="#6fbf3c" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
    }).join('');
    return `<path d="M-290 ${ry + 14} L-270 ${ry - 18} L270 ${ry - 18} L290 ${ry + 14}Z" ${O('#8a5a33', 5)}/><path d="M-250 ${ry + 4} h500 M-264 ${ry - 8} h528" stroke="#6f4623" stroke-width="4" stroke-linecap="round" opacity=".6"/>${plants}`;
  };
  return `<g transform="translate(${x} ${y}) scale(${s})">${row(-110, 'cabbage', 6)}${row(-54, 'carrot', 8)}${row(6, 'salad', 6)}
  <path d="M-310 -30 V-150 M310 -30 V-150" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-310 -30 V-150 M310 -30 V-150" stroke="#e8c590" stroke-width="5" stroke-linecap="round"/></g>`;
};

// ═════════════════════ la cour : animaux ═════════════════════

// poule (regarde à droite, hauteur ≈ 130) ; o.peck = [[a,b]] picore ; talk = bec ouvert
export function hen(talk = [], o = {}) {
  const w = '#fffaf0';
  const peck = (o.peck || []).map(([a, b]) => ao({ n: 'fpeck', d: Math.min(0.6, b - a), t: a, c: Math.max(1, Math.round((b - a) / 0.6)) }));
  return `<ellipse cx="0" cy="3" rx="54" ry="9" fill="#000" opacity=".2"/>
  ${[-10, 16].map((lx) => `<path d="M${lx} -30 V-4 M${lx} -4 l-10 4 M${lx} -4 l0 6 M${lx} -4 l10 3" stroke="${INK}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M${lx} -30 V-4 M${lx} -4 l-10 4 M${lx} -4 l0 6 M${lx} -4 l10 3" stroke="#ffb300" stroke-width="4" stroke-linecap="round" fill="none"/>`).join('')}
  <g style="transform-origin:0px -50px;animation:breathe 1.2s ease-in-out infinite alternate">
  <g style="transform-origin:-44px -70px;animation:wag .5s ease-in-out infinite alternate">${[-26, 0, 24].map((r) => `<ellipse cx="-58" cy="-78" rx="24" ry="11" ${O('#f2e6cf', 3.5)} transform="rotate(${r - 20} -44 -70)"/>`).join('')}</g>
  <ellipse cx="0" cy="-62" rx="46" ry="40" ${O(w, 4)}/><ellipse cx="-8" cy="-56" rx="26" ry="19" ${O('#f2e6cf', 3.5)}/><ellipse cx="14" cy="-46" rx="20" ry="14" fill="#fff" opacity=".5"/>
  <g style="transform-origin:12px -76px;${peck.length ? 'animation:' + peck.join(',') : ''}">
    <circle cx="38" cy="-102" r="26" ${O(w, 4)}/>
    <circle cx="28" cy="-126" r="9" ${O('#e8434e', 3.5)}/><circle cx="40" cy="-130" r="10" ${O('#e8434e', 3.5)}/><circle cx="52" cy="-124" r="8" ${O('#e8434e', 3.5)}/>
    <polygon points="60,-106 80,-98 60,-92" ${O('#ffb300', 3.5)}/><path d="M60 -99 L76 -98" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="58" cy="-84" rx="6" ry="9" ${O('#e8434e', 3)}/>
    ${eyeStates([[44, -108, 8, 1.5]], o.eyes || [])}${beakTalk(66, -96, talk, 7, 5)}
    <ellipse cx="42" cy="-92" rx="8" ry="5" fill="#ff8fa3" opacity=".75"/>${blushW([[42, -92, 11]], o.blush || [])}</g></g>`;
}

// poussin (hauteur ≈ 62) ; o.hop = [[a,b,h]] ; o.shell = true : coquille d'œuf sur la tête
export function chick(talk = [], o = {}) {
  const hops = o.hop || [];
  let inner = `<ellipse cx="0" cy="3" rx="26" ry="6" fill="#000" opacity=".2"/>
  ${[-8, 9].map((lx) => `<path d="M${lx} -10 V-2 M${lx} -2 l-6 3 M${lx} -2 l6 3" stroke="#ff9f43" stroke-width="4" stroke-linecap="round" fill="none"/>`).join('')}
  <circle cx="0" cy="-34" r="28" ${O('#ffe14a', 4)}/><ellipse cx="-9" cy="-26" rx="9" ry="6" ${O('#ffd23f', 3)} transform="rotate(20 -9 -26)"/>
  ${o.shell ? `<path d="M-26 -42 L-18 -50 L-10 -42 L0 -52 L10 -42 L18 -50 L26 -42 Q22 -66 0 -68 Q-22 -66 -26 -42Z" ${O('#fffaf0', 3.5)}/>` : `<path d="M-4 -62 q-4 -10 -10 -12 M2 -62 q0 -12 2 -16 M8 -60 q4 -8 10 -8" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`}
  ${eyeStates([[12, -40, 7, 1.5], [-6, -40, 6, 1.5]], o.eyes || [])}
  <polygon points="20,-32 32,-29 20,-24" ${O('#ff9f43', 3)}/>${beakTalk(25, -26, talk, 5, 4)}
  <ellipse cx="2" cy="-26" rx="5" ry="3" fill="#ff8fa3" opacity=".75"/>${blushW([[2, -26, 8]], o.blush || [])}`;
  for (const [a, b, h] of hops) { const n = Math.max(1, Math.round((b - a) / 0.35)); inner = `<g style="--h:${h}px;${an({ n: 'hop', d: (b - a) / n, t: a, c: n })}">${inner}</g>`; }
  return inner;
}

// vache (regarde à droite, hauteur ≈ 240) ; talk = bouche
export function cow(talk = [], o = {}) {
  const w = '#fffaf0', pt = '#4a3b40', pk = '#ffb3b8';
  return `<ellipse cx="10" cy="3" rx="140" ry="12" fill="#000" opacity=".2"/>
  <g style="transform-origin:-134px -150px;animation:wag .9s ease-in-out infinite alternate"><path d="M-134 -150 Q-170 -130 -160 -84" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M-134 -150 Q-170 -130 -160 -84" stroke="${w}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-160" cy="-76" rx="10" ry="16" ${O(pt, 3.5)}/></g>
  ${[-96, 28].map((lx) => `<rect x="${lx}" y="-86" width="30" height="78" rx="12" ${O('#e7e0d4', 4)}/><rect x="${lx}" y="-20" width="30" height="16" rx="7" ${O('#4a3b40', 3.5)}/>`).join('')}
  <ellipse cx="-40" cy="-62" rx="26" ry="18" ${O(pk, 4)}/>
  <g style="transform-origin:0px -80px;animation:breathe 1.5s ease-in-out infinite alternate">
  <ellipse cx="-14" cy="-128" rx="124" ry="72" ${O(w, 4)}/>
  <path d="M-96 -164 Q-70 -190 -48 -170 Q-40 -146 -70 -142 Q-98 -140 -96 -164Z M2 -112 Q34 -130 56 -108 Q58 -82 28 -80 Q0 -84 2 -112Z M-82 -108 Q-62 -118 -52 -100 Q-56 -84 -76 -88Z" fill="${pt}"/>
  <ellipse cx="-34" cy="-166" rx="42" ry="10" fill="#fff" opacity=".5" transform="rotate(-6 -34 -166)"/>
  ${[-96, 28].map((lx) => `<rect x="${lx + 34}" y="-86" width="30" height="78" rx="12" ${O(w, 4)}/><rect x="${lx + 34}" y="-20" width="30" height="16" rx="7" ${O(pt, 3.5)}/>`).join('')}
  <rect x="64" y="-150" width="18" height="48" rx="8" fill="#e8434e" stroke="${INK}" stroke-width="4" transform="rotate(-8 72 -126)"/><circle cx="82" cy="-100" r="11" ${O('#ffd23f', 3.5)}/>
  <g style="transform-origin:96px -184px;animation:earidle 1.3s ease-in-out infinite alternate">
  <ellipse cx="58" cy="-190" rx="26" ry="12" ${O(w, 4)} transform="rotate(-24 58 -190)"/><ellipse cx="58" cy="-190" rx="14" ry="6" fill="${pk}" transform="rotate(-24 58 -190)"/></g>
  <path d="M96 -214 Q86 -240 70 -236 M132 -214 Q136 -242 152 -240" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M96 -214 Q86 -240 70 -236 M132 -214 Q136 -242 152 -240" stroke="#f6e3a8" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="112" cy="-170" r="50" ${O(w, 4)}/><path d="M80 -190 Q100 -216 118 -202 Q108 -176 88 -170Z" fill="${pt}"/>
  <ellipse cx="144" cy="-146" rx="36" ry="28" ${O(pk, 4)}/><ellipse cx="156" cy="-154" rx="4.5" ry="6" fill="${INK}"/><ellipse cx="134" cy="-156" rx="4.5" ry="6" fill="${INK}"/>
  ${eyeStates([[100, -178, 12, 2], [128, -180, 10, 2]], o.eyes || [])}
  ${mouthStates(142, -138, talk, o.moods || [], o.mood || 'calm')}
  <ellipse cx="90" cy="-150" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>${blushW([[90, -150, 14]], o.blush || [])}</g>`;
}

// cochon (regarde à droite, hauteur ≈ 150) ; talk = bouche
export function pig(talk = [], o = {}) {
  const pk = '#ffb3c6', pk2 = '#ff9db2';
  return `<ellipse cx="0" cy="3" rx="110" ry="11" fill="#000" opacity=".2"/>
  <path d="M-96 -92 Q-122 -108 -114 -126 Q-102 -140 -92 -124 Q-110 -118 -102 -108" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-96 -92 Q-122 -108 -114 -126 Q-102 -140 -92 -124 Q-110 -118 -102 -108" stroke="${pk2}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${[-64, 38].map((lx) => `<rect x="${lx}" y="-48" width="26" height="44" rx="11" ${O(pk2, 4)}/><rect x="${lx}" y="-14" width="26" height="12" rx="6" ${O('#8a5a6a', 3.5)}/>`).join('')}
  <g style="transform-origin:0px -50px;animation:breathe 1.3s ease-in-out infinite alternate">
  <ellipse cx="-8" cy="-84" rx="94" ry="62" ${O(pk, 4)}/><ellipse cx="-30" cy="-112" rx="46" ry="12" fill="#fff" opacity=".4" transform="rotate(-8 -30 -112)"/>
  ${[-34, 66].map((lx) => `<rect x="${lx}" y="-50" width="28" height="46" rx="12" ${O(pk, 4)}/><rect x="${lx}" y="-14" width="28" height="12" rx="6" ${O('#8a5a6a', 3.5)}/>`).join('')}
  <path d="M60 -140 L72 -166 L96 -138Z" ${O(pk2, 4)}/><path d="M68 -142 L74 -156 L86 -140Z" fill="#ff7f9f"/>
  <circle cx="84" cy="-100" r="46" ${O(pk, 4)}/>
  <ellipse cx="124" cy="-90" rx="24" ry="19" ${O(pk2, 4)}/><ellipse cx="116" cy="-90" rx="4" ry="7" fill="${INK}"/><ellipse cx="134" cy="-92" rx="4" ry="7" fill="${INK}"/>
  ${eyeStates([[74, -114, 11, 2], [100, -118, 9, 2]], o.eyes || [])}
  ${mouthStates(104, -68, talk, o.moods || [], o.mood || 'calm')}
  <ellipse cx="66" cy="-92" rx="10" ry="6" fill="#ff7f9f" opacity=".75"/>${blushW([[66, -92, 14]], o.blush || [])}</g>`;
}

// le tracteur-car de Papi Bernard (vue de côté, avant à droite) ; (0,0) = sol sous le centre ; largeur ≈ 540, hauteur ≈ 260
// o.drive = [[a,b]] roues + rebonds ; o.smoke (défaut true) ; o.inside = svg dessiné derrière les vitres (passagers : coords locales du car)
export function tractorBus(o = {}) {
  const drive = o.drive || [], smoke = o.smoke !== false;
  const wheel = (cx, cy, r) => {
    const sp = drive.map(([a, b]) => { const c = Math.max(1, Math.round((b - a) / 0.5)); return ao({ n: 'spin', d: (b - a) / c, t: a, c }); });
    return `<g transform="translate(${cx} ${cy})"><g style="transform-origin:0px 0px;${anims(sp)}"><circle r="${r}" ${O('#3a3340', 6)}/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M0 -${r} v-6" stroke="${INK}" stroke-width="7" stroke-linecap="round" transform="rotate(${i * 36})"/>`).join('')}
      <circle r="${r * 0.56}" ${O('#e8434e', 4)}/>${[0, 90, 180, 270].map((a) => `<circle cx="0" cy="-${r * 0.32}" r="${r * 0.07}" fill="#fff" transform="rotate(${a})"/>`).join('')}<circle r="${r * 0.14}" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g></g>`;
  };
  const bump = drive.map(([a, b]) => ao({ n: 'fbump', d: 0.16, t: a, c: Math.max(1, Math.round((b - a) / 0.16)), dir: 'alternate' }));
  const smokeEl = smoke ? [0, 1, 2].map((i) => `<g transform="translate(190 -214)"><g style="${an({ n: 'fsmoke', d: 1.4, t: i * 0.47, c: 999 })}"><circle r="16" fill="#e8e8f0" stroke="#bcbccc" stroke-width="3"/></g></g>`).join('') : '';
  return `<ellipse cx="0" cy="4" rx="290" ry="14" fill="#000" opacity=".22"/>
  <g style="${bump.length ? 'animation:' + bump.join(',') : ''}">
  ${smokeEl}
  <rect x="-254" y="-130" width="520" height="40" rx="12" ${O('#6b4a2e', 5)}/>
  <path d="M-254 -90 V-210 Q-254 -240 -224 -240 H70 Q92 -240 92 -214 V-90Z" ${O('#ffd23f', 6)}/>
  <rect x="-248" y="-130" width="336" height="18" fill="#e8434e" stroke="${INK}" stroke-width="4"/>
  ${[0, 1, 2].map((i) => { const wx = -230 + i * 106; return `<rect x="${wx}" y="-214" width="90" height="70" rx="12" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/>${o.inside && i < 2 ? '' : ''}`; }).join('')}
  ${o.inside ? `<g>${o.inside}</g>` : ''}
  ${[0, 1, 2].map((i) => { const wx = -230 + i * 106; return `<rect x="${wx}" y="-214" width="90" height="70" rx="12" fill="#fff" opacity=".18" stroke="${INK}" stroke-width="5"/><path d="M${wx + 12} -200 l22 -4 M${wx + 12} -184 l12 -2" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`; }).join('')}
  <path d="M92 -96 V-170 Q92 -186 110 -186 H210 Q244 -186 252 -156 L262 -96Z" ${O('#e8434e', 6)}/>
  <rect x="204" y="-176" width="42" height="64" rx="10" ${O('#c43e3e', 4)}/><path d="M212 -164 v40 M224 -164 v40 M236 -164 v40" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <rect x="182" y="-232" width="18" height="48" rx="6" ${O('#8a8a9a', 4)}/><rect x="178" y="-238" width="26" height="12" rx="5" ${O('#6a6a7a', 4)}/>
  <circle cx="256" cy="-142" r="13" ${O('#fff3a6', 4)}/>
  ${wheel(-150, -64, 66)}${wheel(170, -42, 44)}
  <path d="M-224 -245 h300" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".45"/></g>`;
}

// ═════════════════════ pique-nique, feu de camp ═════════════════════

// nappe à carreaux en perspective, (0,0) = centre ; largeur ≈ 500 ; o.items = false pour la nappe seule
export const picnic = (x = 0, y = 0, s = 1, o = {}) => {
  const P = (u, v) => { const yy = -50 + 90 * v, h = 170 + 80 * v; return [-h + 2 * h * u, yy]; };
  const cols = 8, rows = 3;
  const checks = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if ((i + j) % 2 === 0) {
    const pts = [P(i / cols, j / rows), P((i + 1) / cols, j / rows), P((i + 1) / cols, (j + 1) / rows), P(i / cols, (j + 1) / rows)];
    checks.push(`<path d="M${pts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join(' L')}Z" fill="#ff8f8f"/>`);
  }
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-170 -50 L170 -50 L250 40 L-250 40Z" fill="#fff" stroke="none"/>${checks.join('')}<path d="M-170 -50 L170 -50 L250 40 L-250 40Z" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${o.items === false ? '' : `<g transform="translate(-110 -14)"><path d="M-40 0 Q-44 -34 0 -34 Q44 -34 40 0Z" ${O('#d9a05b', 4)}/><path d="M-34 -14 h68 M-28 -26 h56" stroke="#b97a33" stroke-width="3.5"/><path d="M-30 -30 Q0 -76 30 -30" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-30 -30 Q0 -76 30 -30" stroke="#d9a05b" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>
  <g transform="translate(30 4)"><path d="M-30 0 L0 -30 L30 0Z" ${O('#ffe9a8', 4)}/><path d="M-26 -3 L0 -24 L26 -3" fill="none" stroke="#e8a838" stroke-width="3.5"/><circle cx="8" cy="-8" r="5" fill="#e8434e"/></g>
  <g transform="translate(110 -6)"><rect x="-14" y="-52" width="28" height="52" rx="9" ${O('#ffb36b', 4)}/><rect x="-7" y="-66" width="14" height="16" rx="4" ${O('#fff', 3.5)}/><rect x="-14" y="-32" width="28" height="14" fill="#fff" opacity=".6"/></g>
  <g transform="translate(-30 14)">${apple(0, 0, 0.5)}</g>`}</g>`;
};

// feu de camp : (0,0) = centre bas ; hauteur ≈ 190 ; o.glow (défaut true)
export const campfire = (x = 0, y = 0, s = 1, o = {}) => {
  const flame = (sc, dl, c, h) => `<g style="transform-origin:0px 0px;${an({ n: 'fflame', d: 0.26 + dl * 0.07, t: dl * 0.05, c: 999, dir: 'alternate', e: 'ease-in-out' })}"><path d="M0 0 C-${46 * sc} -6 -${50 * sc} -${h * 0.5} -${8 * sc} -${h} C-${4 * sc} -${h * 0.62} ${14 * sc} -${h * 0.6} ${22 * sc} -${h * 0.78} C${54 * sc} -${h * 0.4} ${46 * sc} -6 0 0Z" ${O(c, 4)}/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  ${o.glow === false ? '' : `<g style="transform-origin:0px -50px;animation:fglow 1.1s ease-in-out infinite alternate"><circle cy="-50" r="200" fill="#ffb347"/></g>`}
  <ellipse cy="6" rx="130" ry="18" fill="#000" opacity=".25"/>
  ${[-110, -66, -20, 26, 70, 110].map((a, i) => `<ellipse cx="${Math.sin(((i * 60 + 20) * Math.PI) / 180) * 98}" cy="${Math.cos(((i * 60 + 20) * Math.PI) / 180) * 18 - 6}" rx="26" ry="17" ${O(i % 2 ? '#b8b5ae' : '#cfccc4', 4)}/>`).join('')}
  <rect x="-90" y="-26" width="180" height="26" rx="13" ${O('#8a5a33', 5)} transform="rotate(-10 0 -13)"/><rect x="-90" y="-26" width="180" height="26" rx="13" ${O('#9b6a3c', 5)} transform="rotate(10 0 -13)"/>
  ${flame(1.1, 0, '#e8434e', 150)}${flame(0.8, 1, '#ff9f43', 120)}${flame(0.5, 2, '#ffe14a', 86)}
  ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${-40 + i * 20} -80)"><g style="--dx:${(i - 2) * 18}px;${an({ n: 'fspark', d: 1.4 + (i % 3) * 0.3, t: i * 0.37, c: 999 })}"><circle r="4" fill="#ffd23f"/></g></g>`).join('')}</g>`;
};

// guimauve au bout d'un bâton (main en (0,0), le bâton part vers la droite)
export const marshmallow = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 L160 0" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M0 0 L160 0" stroke="#9b6a3c" stroke-width="4.5" stroke-linecap="round"/><rect x="138" y="-17" width="34" height="34" rx="12" ${O('#fff', 4)}/><path d="M150 -10 q-4 10 0 20" stroke="#ffd2a0" stroke-width="5" stroke-linecap="round" fill="none"/></g>`;

// ═════════════════════ nuit et orage ═════════════════════

// ciel étoilé complet : ciel nuit, lune, étoiles qui scintillent, collines sombres ; o.hills = false pour le ciel seul
export const nightSky = (o = {}) => `${sky('night')}
  ${Array.from({ length: 46 }, (_, i) => { const x = rnd(i) * W, y = rnd(i + 50) * (GROUND - 60), r = 4 + rnd(i + 99) * 7; return `<path d="M${x.toFixed(0)} ${(y - r).toFixed(0)} l${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l-${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l-${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l-${(r * 0.3).toFixed(1)} -${(r * 0.7).toFixed(1)} l-${(r * 0.7).toFixed(1)} -${(r * 0.3).toFixed(1)} l${(r * 0.7).toFixed(1)} -${(r * 0.3).toFixed(1)}Z" fill="#fff6c8" style="animation:ftw ${1.1 + (i % 5) * 0.4}s ease-in-out ${(i % 7) * 0.25}s infinite alternate"/>`; }).join('')}
  <g transform="translate(1060 120) rotate(-20)"><path d="M0 -52 A52 52 0 1 0 0 52 A70 70 0 0 1 0 -52Z" ${O('#fff3a6', 5)}/></g>
  ${o.hills === false ? '' : `${hills('dark')}${meadow('dark')}`}`;

// étoile filante : de (x0,y0) vers (x1,y1)
export const shootingStar = (t0, x0 = 300, y0 = 90, x1 = 800, y1 = 300, dur = 1.1) => `<g transform="translate(${x0} ${y0}) rotate(${(Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI})"><g style="--dx:${Math.hypot(x1 - x0, y1 - y0).toFixed(0)}px;--dy:0px;${an({ n: 'fshoot', d: dur, t: t0, f: 'both', e: 'ease-in' })}">
  <path d="M0 0 L-120 -6 L-120 6Z" fill="#fff6c8" opacity=".6"/><path d="M0 -16 L5 -5 L17 -4 L8 4 L11 16 L0 9 L-11 16 L-8 4 L-17 -4 L-5 -5Z" ${O('#ffe14a', 3.5)}/></g></g>`;

// ciel d'orage plein écran : nuages sombres, éclairs aux temps o.flashes = [t…], pluie o.rain (défaut true)
export const stormSky = (o = {}) => {
  const { flashes = [], rain = true } = o;
  const cl = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#4a4d63" stroke="${INK}" stroke-width="${4 / s}"><ellipse rx="110" ry="40"/><ellipse cx="-56" cy="-28" rx="56" ry="42"/><ellipse cx="38" cy="-44" rx="66" ry="50"/><ellipse cx="-10" cy="-22" rx="30" ry="12" fill="#6a6e88" stroke="none" opacity=".7"/></g>`;
  return `${sky('storm')}
  <g style="animation:cdrift 9s ease-in-out infinite alternate">${cl(180, 110, 1.4)}${cl(560, 70, 1.3)}${cl(940, 120, 1.5)}${cl(1230, 60, 1.2)}</g>
  ${hills('dark')}
  ${flashes.map((t, i) => { const bx = 380 + ((i * 310) % 520); return `<g style="${an({ n: 'fbolt', d: 0.4, t, f: 'both' })}"><path d="M${bx} 170 L${bx - 34} 300 L${bx - 4} 300 L${bx - 46} 440 L${bx + 40} 270 L${bx + 8} 270 L${bx + 36} 170Z" ${O('#ffe14a', 6)}/></g>`; }).join('')}
  ${rain ? `<g style="animation:frain .5s linear infinite" opacity=".7">${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 41) % 1400 - 60} ${(i * 67) % 760 - 60} l-12 30" stroke="#bfe6ff" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>` : ''}`;
};
// éclair blanc plein écran : à poser PAR-DESSUS tout aux mêmes temps que stormSky
export const flash = (times = []) => times.map((t) => `<rect width="${W}" height="${H}" fill="#fff" style="opacity:0;${an({ n: 'flash', d: 0.5, t })}"/>`).join('');

// ═════════════════════ objets de cuisine ═════════════════════

// tarte aux pommes ; (0,0) = centre bas ; largeur ≈ 170 ; o.steam = true : vapeur
export const pie = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cy="-2" rx="96" ry="18" ${O('#fff', 4)}/>
  <path d="M-72 -22 L-66 -2 Q0 12 66 -2 L72 -22Z" ${O('#d99a3d', 4)}/><ellipse cy="-26" rx="76" ry="30" ${O('#f0b758', 4)}/>
  ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 71).toFixed(1)}" cy="${(-26 + Math.sin(a) * 27).toFixed(1)}" r="6" ${O('#e8a843', 2.5)}/>`; }).join('')}
  <ellipse cy="-28" rx="56" ry="20" fill="#e8434e" stroke="${INK}" stroke-width="3.5" opacity=".85"/>
  ${[-30, -10, 10, 30].map((k) => `<path d="M${k - 24} -44 L${k + 24} -12" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${k - 24} -44 L${k + 24} -12" stroke="#f0b758" stroke-width="6" stroke-linecap="round"/>`).join('')}
  <ellipse cx="-30" cy="-40" rx="22" ry="5" fill="#fff" opacity=".4"/>
  ${o.steam ? [-30, 0, 30].map((dx, i) => `<g transform="translate(${dx} -56)"><g style="${an({ n: 'fsteam', d: 1.6, t: i * 0.5, c: 999 })}"><path d="M0 0 q-8 -12 0 -22 q8 -10 0 -20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/></g></g>`).join('') : ''}</g>`;

// œuf ; (0,0) = centre bas ; hauteur ≈ 64 ; o.crack = true : fêlé ; o.col = couleur
export const egg = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -66 C-34 -66 -40 -14 -34 -6 C-28 4 28 4 34 -6 C40 -14 34 -66 0 -66Z" ${O(o.col || '#fffaf0', 4)}/><ellipse cx="-14" cy="-40" rx="7" ry="15" fill="#fff" opacity=".6" transform="rotate(14 -14 -40)"/>${o.crack ? `<path d="M-30 -34 L-18 -42 L-8 -30 L4 -44 L16 -32 L30 -40" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</g>`;

// cuillère en bois pour la course d'œufs : (0,0) = bout du manche, le cuilleron est à (190,0) ; o.egg = true : œuf posé dessus
export const spoon = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 H150" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M0 0 H150" stroke="#c98a4e" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="186" cy="0" rx="42" ry="28" ${O('#d99a5e', 5)}/><ellipse cx="186" cy="-3" rx="30" ry="18" fill="#c98a4e"/><ellipse cx="174" cy="-8" rx="12" ry="5" fill="#fff" opacity=".4"/>
  ${o.egg ? egg(186, -6, 0.62, o.crack ? { crack: true } : {}) : ''}</g>`;
