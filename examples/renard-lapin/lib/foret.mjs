// Saison 8 « La forêt des contes » : décors de forêt et accessoires (carnet, panier, champignons, lanterne…).
// Convention : fonctions qui renvoient une chaîne SVG. Objets autour de (0,0) = point au sol (centre bas), à poser avec x,y,s en paramètres.
// Fonds = monde plus large que l'écran : de X0 = -640 à X1 = 1920 (2560 px) par défaut (o.x0 / o.x1), hauteur 720, sol GROUND = 560.
// Les personnages se posent entre y ≈ 590 et 660. Préfixe de keyframes : f8…
import { W, H, INK, an, ao, anims, vis, cloud, addKF } from './kit.mjs';

export const GROUND = 560;
export const X0 = -640, X1 = W + 640;

addKF(`@keyframes f8flame{from{transform:scale(.92,.86) rotate(-3deg)}to{transform:scale(1.06,1.14) rotate(3deg)}}
@keyframes f8glow{from{opacity:.1;transform:scale(.94)}to{opacity:.22;transform:scale(1.06)}}
@keyframes f8spark{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-130px)}}
@keyframes f8fly{0%,100%{transform:translate(0,0)}25%{transform:translate(12px,-14px)}50%{transform:translate(-8px,-24px)}75%{transform:translate(-14px,-8px)}}
@keyframes f8lite{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes f8glow2{from{opacity:.12;transform:scale(.94)}to{opacity:.26;transform:scale(1.06)}}
@keyframes f8on{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}
@keyframes f8water{from{transform:translateX(0)}to{transform:translateX(-60px)}}
@keyframes f8boing{0%{transform:scale(1)}20%{transform:scale(1.25,.6)}50%{transform:scale(.88,1.2)}75%{transform:scale(1.08,.94)}100%{transform:scale(1)}}
@keyframes f8unroll{0%{transform:scaleY(.06)}70%{transform:scaleY(1.05)}100%{transform:scaleY(1)}}
@keyframes f8sway{from{transform:rotate(-1.2deg)}to{transform:rotate(1.4deg)}}
@keyframes f8lamp{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const ext = (o = {}) => [o.x0 ?? X0, o.x1 ?? X1];

// ───────── palettes par moment de la journée : 'dawn' | 'day' | 'dusk' | 'night' ─────────
const TONES = {
  dawn: { sky: ['#ffbfa0', '#ffd2a8', '#ffe2b4', '#fff0c8'], g0: '#9fcf7c', g1: '#8cbc6a', leaf: ['#4fa86a', '#3f9a5c'], far: ['#8fc79a', '#7bb88a'], trunk: '#9b6a3c', moss: '#6fb45a' },
  day: { sky: ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#d9f2ff'], g0: '#8fd16e', g1: '#7fc35e', leaf: ['#3fae55', '#2f9a48'], far: ['#8fd3a0', '#7bc58e'], trunk: '#9b6a3c', moss: '#6fc05a' },
  dusk: { sky: ['#ff9f6b', '#ffb07a', '#ffc98f', '#ffe0a8'], g0: '#a8b45e', g1: '#98a450', leaf: ['#5a9a4a', '#4a8a42'], far: ['#b0a070', '#9a9066'], trunk: '#8a5a33', moss: '#8aa850' },
  night: { sky: ['#14103a', '#1d1850', '#272264', '#322c78'], g0: '#3a3870', g1: '#323064', leaf: ['#2c3a78', '#243068'], far: ['#2a2a6a', '#222260'], trunk: '#4a3a62', moss: '#3e4a7e' },
};
const T = (k) => TONES[k] || TONES.day;

const band = (x0, x1, y, h, c) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="${c}"/>`;
// ciel en bandes (pas de dégradé)
export const forestSky = (tone = 'day', o = {}) => { const [x0, x1] = ext(o); return T(tone).sky.map((c, i) => band(x0, x1, (i * GROUND) / 4, GROUND / 4 + 2, c)).join(''); };

// ───────── arbres ─────────
// chêne rond : (0,0) = pied ; hauteur ≈ 250 × s
export const arbre = (x = 0, y = 0, s = 1, o = {}) => {
  const tn = o.trunk || '#9b6a3c', l0 = o.leaf || '#3fae55', l1 = o.leaf2 || '#2f9a48';
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="64" ry="9" fill="#000" opacity=".15"/>
  <path d="M-18 4 Q-14 -70 -12 -130 L12 -130 Q14 -70 18 4Z" ${O(tn, 4)}/><path d="M-6 -60 Q-34 -86 -46 -100" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-6 -60 Q-34 -86 -46 -100" stroke="${tn}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="-44" cy="-150" r="52" ${O(l1, 4)}/><circle cx="46" cy="-152" r="50" ${O(l1, 4)}/><circle cy="-186" r="62" ${O(l0, 4)}/><circle cx="-6" cy="-132" r="48" ${O(l0, 4)}/>
  <ellipse cx="-22" cy="-212" rx="24" ry="9" fill="#fff" opacity=".28" transform="rotate(-24 -22 -212)"/></g>`;
};
// sapin rond : hauteur ≈ 250 × s
export const sapin = (x = 0, y = 0, s = 1, o = {}) => {
  const l0 = o.leaf || '#2f9a58', l1 = o.leaf2 || '#278a4a', tn = o.trunk || '#8a5a33';
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="50" ry="8" fill="#000" opacity=".15"/><rect x="-11" y="-40" width="22" height="44" rx="6" ${O(tn, 4)}/>
  <path d="M-62 -30 Q0 -52 62 -30 Q50 -70 0 -96 Q-50 -70 -62 -30Z" ${O(l1, 4)}/><path d="M-50 -88 Q0 -108 50 -88 Q40 -128 0 -152 Q-40 -128 -50 -88Z" ${O(l0, 4)}/><path d="M-36 -140 Q0 -156 36 -140 Q26 -190 0 -230 Q-26 -190 -36 -140Z" ${O(l1, 4)}/>
  <ellipse cx="-14" cy="-176" rx="6" ry="14" fill="#fff" opacity=".28" transform="rotate(20 -14 -176)"/></g>`;
};
// grand tronc de premier plan (bord d'écran) : (0,0) = pied ; monte au-delà du cadre
export const grosTronc = (x = 0, y = 0, s = 1, o = {}) => {
  const tn = o.trunk || '#9b6a3c', dk = o.dark || '#7a5230';
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 10 Q-46 -30 -50 -120 L-44 -700 L44 -700 L50 -120 Q46 -30 80 10Z" ${O(tn, 6)}/>
  <path d="M-20 -60 Q-26 -200 -18 -340 M18 -100 Q24 -220 14 -360" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-4" cy="-210" rx="9" ry="16" fill="${dk}" stroke="${INK}" stroke-width="4"/>
  <path d="M-34 -140 Q-36 -300 -30 -460" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".2"/></g>`;
};
// buisson / touffe d'herbe
export const buisson = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="3" rx="54" ry="8" fill="#000" opacity=".12"/><circle cx="-26" cy="-24" r="28" ${O(o.leaf2 || '#2f9a48', 4)}/><circle cx="26" cy="-22" r="26" ${O(o.leaf2 || '#2f9a48', 4)}/><circle cy="-36" r="32" ${O(o.leaf || '#3fae55', 4)}/><ellipse cx="-10" cy="-50" rx="12" ry="5" fill="#fff" opacity=".3" transform="rotate(-20 -10 -50)"/></g>`;
export const touffe = (x = 0, y = 0, s = 1, c = '#5aa84a') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 q-6 -16 -16 -22 M0 0 q0 -22 0 -30 M0 0 q6 -16 16 -22" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
// fleur des prés : (0,0) = pied ; o.big = grande fleur (gag de Capucine : hauteur ≈ 330 × s)
export const fleur = (x = 0, y = 0, s = 1, o = {}) => {
  const col = o.col || '#ff8fb8', h = o.big ? 300 : 70, r = o.big ? 56 : 14;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="transform-origin:0px 0px;animation:f8sway ${2.4 + (Math.round(x) % 3) * 0.3}s ease-in-out infinite alternate">
  <path d="M0 0 Q${o.big ? 14 : 4} ${-h * 0.5} 0 ${-h}" stroke="${INK}" stroke-width="${o.big ? 20 : 9}" fill="none" stroke-linecap="round"/><path d="M0 0 Q${o.big ? 14 : 4} ${-h * 0.5} 0 ${-h}" stroke="#4fa05a" stroke-width="${o.big ? 11 : 4.5}" fill="none" stroke-linecap="round"/>
  <ellipse cx="${o.big ? 40 : 10}" cy="${-h * 0.3}" rx="${o.big ? 40 : 10}" ry="${o.big ? 14 : 5}" ${O('#52c468', o.big ? 4 : 3)} transform="rotate(-24 0 ${-h * 0.3})"/>
  <g transform="translate(0 ${-h})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="${-r * 0.95}" rx="${r * 0.58}" ry="${r * 0.7}" ${O(col, o.big ? 4 : 3)} transform="rotate(${a})"/>`).join('')}<circle r="${r * 0.5}" ${O('#ffd23f', o.big ? 4 : 3)}/><ellipse cx="${-r * 0.16}" cy="${-r * 0.2}" rx="${r * 0.16}" ry="${r * 0.1}" fill="#fff" opacity=".6"/></g></g></g>`;
};
// tronc fin (derrière lequel Capucine se cache, pattes qui dépassent) : (0,0) = pied ; hauteur 380 × s
export const tronc = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="40" ry="7" fill="#000" opacity=".15"/><path d="M-20 4 Q-16 -140 -14 -380 L14 -380 Q16 -140 20 4Z" ${O(o.col || '#9b6a3c', 5)}/><path d="M-4 -60 Q-8 -200 -2 -320" stroke="#7a5230" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M14 -240 Q40 -262 52 -300" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M14 -240 Q40 -262 52 -300" stroke="${o.col || '#9b6a3c'}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="52" cy="-306" rx="20" ry="13" ${O('#3fae55', 3.5)} transform="rotate(-30 52 -306)"/><path d="M-8 -300 L-6 -140" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".22"/></g>`;
// tronc couché pour faire un pont : largeur 300 × s ; (0,0) = centre bas
export const rondin = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="6" rx="150" ry="9" fill="#000" opacity=".15"/><rect x="-150" y="-56" width="300" height="56" rx="26" ${O('#9b6a3c', 5)}/><ellipse cx="150" cy="-28" rx="14" ry="26" ${O('#e8c58a', 4)}/><path d="M-110 -34 H60 M-80 -16 H100" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/><path d="M-120 -44 H-30" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".28"/></g>`;

// rangée d'arbres lointains (plus clairs) sur toute la largeur
const farRow = (tone, o, y, seed, sc) => {
  const [x0, x1] = ext(o), t = T(tone);
  let out = '';
  for (let x = x0 - 40, i = 0; x < x1 + 60; i++) {
    const s = sc * (0.8 + rnd(i + seed) * 0.5);
    out += i % 3 === 1 ? sapin(x, y, s * 0.9, { leaf: t.far[0], leaf2: t.far[1], trunk: t.trunk }) : arbre(x, y, s * 0.8, { leaf: t.far[0], leaf2: t.far[1], trunk: t.trunk });
    x += 120 * s + rnd(i + seed + 40) * 70;
  }
  return out;
};
// sol : bande d'herbe (y = GROUND jusqu'au bas)
const ground = (tone, o = {}) => {
  const [x0, x1] = ext(o), t = T(tone);
  const tufts = Array.from({ length: Math.round((x1 - x0) / 85) }, (_, i) => touffe(x0 + 30 + i * 85 + rnd(i) * 30, GROUND + 46 + (i % 4) * 34, 1, tone === 'night' ? '#4a5a96' : t.g1)).join('');
  return `${band(x0, x1, GROUND, H - GROUND + 2, t.g0)}${band(x0, x1, GROUND, 12, t.g1)}${tufts}`;
};
// soleil bas / lune
const sunLow = (x, y, tone) => `<g transform="translate(${x} ${y})"><circle r="${tone === 'dawn' ? 70 : 56}" fill="#fff3a6" opacity=".4"/><circle r="44" ${O('#ffd23f', 5)}/><circle cx="-14" cy="-14" r="10" fill="#fff" opacity=".5"/><path d="M-13 8 q13 13 26 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-13" cy="-4" r="4" fill="${INK}"/><circle cx="13" cy="-4" r="4" fill="${INK}"/><ellipse cx="-24" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/><ellipse cx="24" cy="6" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/></g>`;
const moon = (x, y) => `<g transform="translate(${x} ${y}) rotate(-20)"><circle r="70" fill="#fff3a6" opacity=".14"/><path d="M0 -52 A52 52 0 1 0 0 52 A70 70 0 0 1 0 -52Z" ${O('#fff3a6', 5)}/></g>`;
const stars = (o, n = 40) => { const [x0, x1] = ext(o); return Array.from({ length: n }, (_, i) => { const x = x0 + rnd(i) * (x1 - x0), y = 20 + rnd(i + 50) * (GROUND - 160), r = 4 + rnd(i + 99) * 6; return `<path d="M${x.toFixed(0)} ${(y - r).toFixed(0)} l${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l-${(r * 0.7).toFixed(1)} ${(r * 0.3).toFixed(1)} l-${(r * 0.3).toFixed(1)} ${(r * 0.7).toFixed(1)} l-${(r * 0.3).toFixed(1)} -${(r * 0.7).toFixed(1)} l-${(r * 0.7).toFixed(1)} -${(r * 0.3).toFixed(1)} l${(r * 0.7).toFixed(1)} -${(r * 0.3).toFixed(1)}Z" fill="#fff6c8" style="animation:f8lite ${1.4 + rnd(i + 7) * 1.6}s ease-in-out ${rnd(i + 3)}s infinite"/>`; }).join(''); };
// ciel + lointain commun
const backdrop = (tone, o = {}) => `${forestSky(tone, o)}${tone === 'night' ? stars(o) : ''}${farRow(tone, o, GROUND - 24, 3, 1.35)}${farRow(tone, o, GROUND - 6, 17, 1.0)}`;

// ═════════════════════ fonds ═════════════════════

// lisière du bois à l'aube (ép. 1, 10) : prairie à gauche, mur d'arbres à droite, panneau-flèche, soleil levant. o.tone = 'dawn' | 'day' | 'dusk'
export const lisiere = (o = {}) => {
  const tone = o.tone || 'dawn', t = T(tone), [x0, x1] = ext(o);
  const wall = [820, 960, 1100, 1240, 1380, 1520, 1660, 1800].map((x, i) => (i % 2 ? sapin(x, GROUND + 20, 1.5 + rnd(i) * 0.3, { leaf: t.leaf[0], leaf2: t.leaf[1] }) : arbre(x, GROUND + 24, 1.7 + rnd(i + 5) * 0.3, { leaf: t.leaf[0], leaf2: t.leaf[1], trunk: t.trunk }))).join('');
  const flowers = Array.from({ length: 14 }, (_, i) => fleur(x0 + 60 + i * 130 + rnd(i) * 50, GROUND + 56 + (i % 3) * 38, 1, { col: ['#ff8fb8', '#ffd23f', '#fff', '#c7a3ff'][i % 4] })).join('');
  const sign = `<g transform="translate(120 ${GROUND + 80})"><rect x="-8" y="-150" width="16" height="150" rx="5" ${O('#9b6a3c', 4)}/><path d="M-6 -146 H84 L112 -120 L84 -94 H-6Z" ${O('#e8c58a', 4)}/><path d="M64 -128 l26 8 -26 8" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-22 -118 H-6" stroke="${INK}" stroke-width="0"/></g>`;
  return `${forestSky(tone, o)}${tone === 'night' ? '' : sunLow(500, 190, tone)}${tone === 'dusk' ? '' : `<g style="animation:cdrift 16s ease-in-out infinite alternate">${cloud(100, 130, 0.8, 0.9)}${cloud(900, 90, 0.6, 0.85)}${cloud(1500, 150, 0.75, 0.9)}</g>`}
  ${farRow(tone, o, GROUND - 6, 11, 1.1)}${ground(tone, o)}${flowers}${wall}${sign}`;
};

// sentier de mousse (ép. 2, 9, 12) : chemin ondulant à travers les troncs ; les personnages marchent dessus (y ≈ 600–650). o.tone = 'day' | 'dawn' | 'dusk'
export const sentier = (o = {}) => {
  const tone = o.tone || 'day', t = T(tone), [x0, x1] = ext(o);
  const wave = (k) => { let d = `M${x0} ${GROUND + 70 + k}`; for (let x = x0; x <= x1; x += 80) d += ` L${x} ${GROUND + 84 + k + Math.sin(x / 150) * 14}`; return d; };
  const edge = (a, b) => { let d = `M${x0} ${H + 4} L${x0} ${GROUND + 66 + a}`; for (let x = x0; x <= x1; x += 80) d += ` L${x} ${GROUND + 82 + a + Math.sin(x / 150) * 14}`; d += ` L${x1} ${H + 4}Z`; return d; };
  const trunks = Array.from({ length: Math.round((x1 - x0) / 230) }, (_, i) => { const x = x0 + 70 + i * 230 + rnd(i) * 60; return `<g transform="translate(${x} ${GROUND + 24}) scale(${0.9 + rnd(i + 3) * 0.4})"><ellipse cy="4" rx="44" ry="7" fill="#000" opacity=".15"/><path d="M-30 6 Q-24 -60 -26 -220 L-20 -300 L20 -300 L26 -220 Q24 -60 34 6Z" ${O(i % 2 ? '#8a5a33' : t.trunk, 5)}/><path d="M-8 -30 Q-12 -130 -8 -230" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".22"/></g>`; }).join('');
  const canopy = (() => { let s = ''; for (let x = x0 - 30, i = 0; x < x1 + 60; i++) { const r = 80 + rnd(i + 21) * 50; s += `<circle cx="${x.toFixed(0)}" cy="${(30 + rnd(i + 9) * 40).toFixed(0)}" r="${r.toFixed(0)}" ${O(i % 2 ? t.leaf[1] : t.leaf[0], 5)}/>`; x += r * 1.1; } return s; })();
  const moss = Array.from({ length: Math.round((x1 - x0) / 140) }, (_, i) => `<ellipse cx="${(x0 + 50 + i * 140 + rnd(i + 2) * 50).toFixed(0)}" cy="${(GROUND + 120 + (i % 3) * 22).toFixed(0)}" rx="${34 + rnd(i) * 20}" ry="10" fill="${t.moss}" stroke="${INK}" stroke-width="3.5"/>`).join('');
  return `${forestSky(tone, o)}${farRow(tone, o, GROUND - 10, 5, 1.2)}${band(x0, x1, GROUND - 40, 40, t.far[1])}${trunks}${canopy}
  ${band(x0, x1, GROUND, H - GROUND + 2, t.moss)}<path d="${edge(-6, 0)}" fill="#e2c392" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="${edge(60, 0)}" fill="${t.g0}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${moss}${Array.from({ length: Math.round((x1 - x0) / 120) }, (_, i) => `<ellipse cx="${(x0 + 40 + i * 120 + rnd(i + 8) * 40).toFixed(0)}" cy="${(GROUND + 96 + (i % 3) * 14).toFixed(0)}" rx="14" ry="5" fill="#c9a870" opacity=".7"/>`).join('')}`;
};

// échelle de corde : (0,0) = bas ; elle pend depuis (0,-h) ; o.unroll = temps où elle se déroule (sinon posée) ; o.h = hauteur (défaut 300)
export const echelle = (x = 0, y = 0, s = 1, o = {}) => {
  const h = o.h ?? 300, n = Math.floor(h / 44);
  const rope = (px) => `<path d="M${px} 0 V${-h}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${px} 0 V${-h}" stroke="#e8c58a" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 5"/>`;
  const steps = Array.from({ length: n }, (_, i) => `<rect x="-28" y="${-30 - i * 44}" width="56" height="14" rx="7" ${O('#c98a4e', 4)}/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="transform-origin:0px ${-h}px;${o.unroll !== undefined ? an({ n: 'f8unroll', d: 1.1, t: o.unroll, f: 'both', e: 'cubic-bezier(.3,1.3,.5,1)' }) : ''}">${rope(-28)}${rope(28)}${steps}</g></g>`;
};

// grand chêne avec cabane (ép. 5, 8) : (0,0) = pied du tronc ; hauteur ≈ 620 × s ; plate-forme à (≈110, -330) ; échelle à o.ladder (true = posée, nombre = temps de déroulement)
export const cabane = (x = 0, y = 0, s = 1, o = {}) => {
  const tn = o.trunk || '#9b6a3c', l0 = o.leaf || '#3fae55', l1 = o.leaf2 || '#2f9a48';
  const hut = `<g transform="translate(130 -330)"><rect x="-120" y="-4" width="250" height="20" rx="6" ${O('#c98a4e', 5)}/>
    <rect x="-90" y="-130" width="190" height="128" rx="8" ${O('#e8b86a', 5)}/>${[-60, -26, 8, 42, 76].map((px) => `<path d="M${px} -126 V-6" stroke="#b9823f" stroke-width="4"/>`).join('')}
    <path d="M-112 -128 L5 -206 L122 -128Z" ${O('#e8434e', 5)}/><path d="M-70 -138 L5 -190 L80 -138" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".3"/>
    <rect x="-34" y="-100" width="58" height="56" rx="10" ${O('#9fd7ff', 5)}/><path d="M-5 -100 V-44 M-34 -72 H24" stroke="${INK}" stroke-width="4"/><path d="M-26 -92 l12 -4" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M58 -100 h30 v70 h-30Z" ${O('#a8743f', 4)}/><circle cx="80" cy="-64" r="4" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>
    <path d="M-110 -2 V-60 M120 -2 V-60" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-110 -58 H-70 M80 -58 H120" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M5 -206 V-240" stroke="${INK}" stroke-width="5"/><path d="M5 -240 L44 -228 5 -216Z" ${O('#ffd23f', 3.5)}/></g>`;
  const lad = o.ladder ? echelle(50, 0, 1, { h: 330, unroll: typeof o.ladder === 'number' ? o.ladder : undefined }) : '';
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="6" rx="150" ry="14" fill="#000" opacity=".18"/>
  <path d="M-76 8 Q-34 -40 -42 -160 Q-46 -330 -52 -440 L52 -440 Q46 -330 46 -160 Q40 -40 96 8Z" ${O(tn, 6)}/>
  <path d="M-10 -40 Q-22 -200 -14 -380" stroke="#7a5230" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-6" cy="-190" rx="11" ry="18" fill="#7a5230" stroke="${INK}" stroke-width="4"/><path d="M-30 -120 Q-36 -300 -30 -420" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".2"/>
  <path d="M40 -300 Q150 -330 250 -320 L250 -296 Q150 -300 50 -270Z" ${O(tn, 5)}/>
  <circle cx="-150" cy="-480" r="120" ${O(l1, 5)}/><circle cx="170" cy="-500" r="116" ${O(l1, 5)}/><circle cx="-10" cy="-560" r="136" ${O(l0, 5)}/><circle cx="-190" cy="-400" r="78" ${O(l0, 5)}/><circle cx="240" cy="-420" r="80" ${O(l0, 5)}/>
  <ellipse cx="-60" cy="-620" rx="60" ry="14" fill="#fff" opacity=".28" transform="rotate(-18 -60 -620)"/>
  ${hut}${lad}</g>`;
};
// fond complet « le grand chêne » : lointain, sol, chêne et cabane au centre. o.tone, o.ladder
export const cabaneBg = (o = {}) => { const tone = o.tone || 'day', t = T(tone); return `${backdrop(tone, o)}${ground(tone, o)}${buisson(300, GROUND + 70, 1.4, { leaf: t.leaf[0], leaf2: t.leaf[1] })}${cabane(640, GROUND + 80, 1, { ladder: o.ladder, leaf: t.leaf[0], leaf2: t.leaf[1], trunk: t.trunk })}${buisson(1100, GROUND + 90, 1.2, { leaf: t.leaf[0], leaf2: t.leaf[1] })}`; };

// pierres de rivière : (0,0) = centre bas
export const pierre = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="8" rx="${o.rx || 62}" ry="12" fill="#fff" opacity=".35"/><path d="M-${o.rx || 62} 0 Q-${(o.rx || 62) - 6} -${o.h || 40} -14 -${(o.h || 40) + 6} Q${(o.rx || 62) - 10} -${o.h || 40} ${o.rx || 62} 0 Q0 12 -${o.rx || 62} 0Z" ${O(o.col || '#b8bcc8', 4.5)}/><ellipse cx="-16" cy="-${(o.h || 40) - 10}" rx="${((o.rx || 62) * 0.3).toFixed(0)}" ry="6" fill="#fff" opacity=".5" transform="rotate(-10 -16 -${(o.h || 40) - 10})"/></g>`;
export const pierres = (x = 0, y = 0, s = 1, n = 4, gap = 120) => Array.from({ length: n }, (_, i) => pierre(x + i * gap * s, y + (i % 2) * 10 * s, s * (0.8 + rnd(i + 4) * 0.35), { col: i % 2 ? '#a9aebb' : '#c4c8d2' })).join('');
// caillou blanc du Petit Poucet de Lino
export const caillou = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 0 Q-26 -16 -8 -22 Q16 -26 24 -6 Q24 4 10 4 Z" ${O('#fffdf6', 4)}/><ellipse cx="-6" cy="-14" rx="7" ry="3.4" fill="#fff" opacity=".9" transform="rotate(-16 -6 -14)"/><path d="M6 -8 q4 -2 8 0" stroke="#d6d0c2" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;

// rivière (ép. 6, 11) : berges à gauche et à droite, eau claire au milieu (largeur o.gap, centre o.cx), pierres. o.tone, o.stones = true (pierres dans l'eau)
export const riviere = (o = {}) => {
  const tone = o.tone || 'day', t = T(tone), [x0, x1] = ext(o), cx = o.cx ?? 640, g = o.gap ?? 560, wl = cx - g / 2, wr = cx + g / 2;
  const water = tone === 'night' ? ['#2a4a9a', '#3a5cb0'] : ['#5fc0f0', '#8fd8ff'];
  const ripples = Array.from({ length: 9 }, (_, i) => { const y = GROUND - 30 + i * 26, x = wl + 30 + rnd(i) * (g - 160); return `<g style="animation:f8water ${3 + (i % 3)}s linear infinite alternate"><path d="M${x.toFixed(0)} ${y} q22 -12 44 0 t44 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/></g>`; }).join('');
  return `${backdrop(tone, o)}${ground(tone, o)}
  <path d="M${wl + 26} ${GROUND - 14} L${wr - 26} ${GROUND - 14} L${wr + 26} ${H + 4} L${wl - 26} ${H + 4}Z" fill="${water[0]}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M${wl + 60} ${GROUND + 20} L${wr - 60} ${GROUND + 20} L${wr - 30} ${H + 4} L${wl + 30} ${H + 4}Z" fill="${water[1]}" opacity=".85"/>
  <g style="clip-path:polygon(${wl + 26}px ${GROUND - 14}px,${wr - 26}px ${GROUND - 14}px,${wr + 26}px ${H}px,${wl - 26}px ${H}px)">${ripples}</g>
  ${buisson(wl - 200, GROUND + 40, 1.2, { leaf: t.leaf[0], leaf2: t.leaf[1] })}${buisson(wr + 220, GROUND + 50, 1.3, { leaf: t.leaf[0], leaf2: t.leaf[1] })}
  ${o.stones === false ? '' : pierres(wl + 20, GROUND + 86, 0.9, 4, g / 4.4)}${pierre(wl - 40, GROUND + 90, 0.7)}${pierre(wr + 40, GROUND + 100, 0.8)}`;
};

// champignon : (0,0) = pied ; hauteur ≈ 110 × s ; o.kind = 'red' (à pois) | 'brown' | 'yellow' ; o.bounce = [t…] rebondit (gag du gros champignon)
export const champignon = (x = 0, y = 0, s = 1, o = {}) => {
  const k = { red: ['#e8434e', '#c7313c'], brown: ['#b9773a', '#8f5226'], yellow: ['#ffcf3f', '#e8a81a'] }[o.kind || 'red'];
  const bounce = [].concat(o.bounce ?? []).map((t) => ao({ n: 'f8boing', d: 0.6, t }));
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="46" ry="8" fill="#000" opacity=".16"/><g style="transform-origin:0px 0px;${anims(bounce)}">
  <path d="M-16 4 Q-20 -30 -14 -52 L14 -52 Q20 -30 16 4Z" ${O('#fff0d6', 4)}/><path d="M-12 -40 Q0 -34 12 -40" stroke="#e0c9a6" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M-58 -50 Q-60 -116 0 -118 Q60 -116 58 -50 Q0 -36 -58 -50Z" ${O(k[0], 5)}/>
  ${(o.kind || 'red') === 'red' ? `<circle cx="-26" cy="-84" r="9" fill="#fff"/><circle cx="12" cy="-98" r="11" fill="#fff"/><circle cx="34" cy="-70" r="8" fill="#fff"/><circle cx="-6" cy="-64" r="6" fill="#fff"/>` : `<circle cx="-22" cy="-82" r="6" fill="${k[1]}"/><circle cx="20" cy="-86" r="7" fill="${k[1]}"/>`}
  <ellipse cx="-30" cy="-100" rx="16" ry="6" fill="#fff" opacity=".4" transform="rotate(-26 -30 -100)"/></g></g>`;
};
export const champignons = (x = 0, y = 0, s = 1, kind = 'red') => `${champignon(x - 50 * s, y + 6 * s, 0.7 * s, { kind })}${champignon(x + 40 * s, y, 0.95 * s, { kind })}${champignon(x - 4 * s, y + 18 * s, 0.55 * s, { kind: kind === 'red' ? 'brown' : 'red' })}`;

// clairière aux champignons (ép. 3, 4, 9) : cercle de lumière, fleurs, champignons de toutes tailles. o.tone, o.flowers = true (défaut), o.big = [t…] rebonds du gros champignon à (≈ 900, sol)
export const clairiere = (o = {}) => {
  const tone = o.tone || 'day', t = T(tone), [x0, x1] = ext(o);
  const ring = [-500, -280, -60, 1260, 1480, 1700].map((x, i) => (i % 2 ? sapin(x, GROUND + 20, 1.7, { leaf: t.leaf[0], leaf2: t.leaf[1] }) : arbre(x, GROUND + 26, 1.9, { leaf: t.leaf[0], leaf2: t.leaf[1], trunk: t.trunk }))).join('');
  const m = Array.from({ length: 16 }, (_, i) => champignon(x0 + 100 + i * 150 + rnd(i + 31) * 60, GROUND + 64 + (i % 4) * 30, 0.5 + rnd(i + 5) * 0.35, { kind: ['red', 'brown', 'yellow', 'red'][i % 4] })).join('');
  const f = o.flowers === false ? '' : Array.from({ length: 18 }, (_, i) => fleur(x0 + 50 + i * 140 + rnd(i + 12) * 60, GROUND + 70 + (i % 3) * 40, 1, { col: ['#ff8fb8', '#fff', '#c7a3ff', '#ffd23f'][i % 4] })).join('');
  const beams = tone === 'night' ? '' : [380, 700, 960].map((x, i) => `<path d="M${x} 0 L${x + 120} ${GROUND} L${x + 40} ${GROUND}Z" fill="#fff6c8" opacity=".16"/>`).join('');
  return `${backdrop(tone, o)}${ring}${ground(tone, o)}${beams}<ellipse cx="640" cy="${GROUND + 110}" rx="520" ry="70" fill="${t.g1}" opacity=".5"/>${f}${m}
  ${champignon(900, GROUND + 78, 1.9, { kind: 'red', bounce: o.big })}`;
};

// feu de camp : (0,0) = centre bas ; hauteur ≈ 190 × s ; o.glow = false retire la lueur
export const feuDeCamp = (x = 0, y = 0, s = 1, o = {}) => {
  const flame = (sc, dl, c, h) => `<g style="transform-origin:0px 0px;${an({ n: 'f8flame', d: 0.26 + dl * 0.07, t: dl * 0.05, c: 999, dir: 'alternate', e: 'ease-in-out' })}"><path d="M0 0 C-${46 * sc} -6 -${50 * sc} -${h * 0.5} -${8 * sc} -${h} C-${4 * sc} -${h * 0.62} ${14 * sc} -${h * 0.6} ${22 * sc} -${h * 0.78} C${54 * sc} -${h * 0.4} ${46 * sc} -6 0 0Z" ${O(c, 4)}/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  ${o.glow === false ? '' : `<g style="transform-origin:0px -50px;animation:f8glow 1.1s ease-in-out infinite alternate"><circle cy="-50" r="220" fill="#ffb347"/></g>`}
  <ellipse cy="6" rx="130" ry="18" fill="#000" opacity=".25"/>
  ${Array.from({ length: 7 }, (_, i) => { const a = ((i * 51 + 10) * Math.PI) / 180; return `<ellipse cx="${(Math.sin(a) * 100).toFixed(0)}" cy="${(Math.cos(a) * 18 - 6).toFixed(0)}" rx="26" ry="17" ${O(i % 2 ? '#b8b5ae' : '#cfccc4', 4)}/>`; }).join('')}
  <rect x="-90" y="-26" width="180" height="26" rx="13" ${O('#8a5a33', 5)} transform="rotate(-10 0 -13)"/><rect x="-90" y="-26" width="180" height="26" rx="13" ${O('#9b6a3c', 5)} transform="rotate(10 0 -13)"/>
  ${flame(1.1, 0, '#e8434e', 150)}${flame(0.8, 1, '#ff9f43', 120)}${flame(0.5, 2, '#ffe14a', 86)}
  ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${-40 + i * 20} -80)"><g style="--dx:${(i - 2) * 18}px;${an({ n: 'f8spark', d: 1.4 + (i % 3) * 0.3, t: i * 0.37, c: 999 })}"><circle r="4" fill="#ffd23f"/></g></g>`).join('')}</g>`;
};
// bûche-siège : (0,0) = centre bas ; largeur ≈ 170 × s
export const buche = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="90" ry="9" fill="#000" opacity=".2"/><rect x="-84" y="-54" width="168" height="54" rx="24" ${O('#9b6a3c', 5)}/><ellipse cx="84" cy="-27" rx="13" ry="25" ${O('#e8c58a', 4)}/><ellipse cx="84" cy="-27" rx="5" ry="11" fill="none" stroke="#b9823f" stroke-width="3"/><path d="M-60 -34 H30" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/><path d="M-66 -44 H-8" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".28"/></g>`;
// fond « feu de camp » (ép. 13) : crépuscule, grands arbres, feu au centre, bûches de chaque côté. o.tone = 'dusk' (défaut) | 'night'
export const campBg = (o = {}) => {
  const tone = o.tone || 'dusk', t = T(tone);
  const trees = [-420, -160, 1380, 1640].map((x, i) => (i % 2 ? sapin(x, GROUND + 24, 1.9, { leaf: t.leaf[0], leaf2: t.leaf[1] }) : arbre(x, GROUND + 30, 2.1, { leaf: t.leaf[0], leaf2: t.leaf[1], trunk: t.trunk }))).join('');
  return `${backdrop(tone, o)}${trees}${ground(tone, o)}<ellipse cx="640" cy="${GROUND + 100}" rx="480" ry="90" fill="#ffb347" opacity=".18"/>
  ${buche(380, GROUND + 100, 1)}${buche(900, GROUND + 100, 1)}${feuDeCamp(640, GROUND + 90, 1.15)}`;
};

// luciole : (x,y) = centre ; clignote, volette ; o.on = temps d'allumage (sinon allumée dès le début)
export const luciole = (x, y, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="${o.fly === false ? '' : `animation:f8fly ${2.4 + (Math.round(x) % 5) * 0.3}s ease-in-out infinite`}"><g style="transform-origin:0px 0px;${o.on !== undefined ? an({ n: 'f8on', d: 0.5, t: o.on, f: 'both' }) : ''}"><g style="animation:f8lite ${1 + (Math.round(y) % 4) * 0.25}s ease-in-out infinite"><circle r="24" fill="#ffe97a" opacity=".38"/></g><ellipse rx="10" ry="8" fill="#ffe14a" stroke="${INK}" stroke-width="3"/><ellipse cx="-4" cy="-10" rx="8" ry="4" fill="#fff" opacity=".85" transform="rotate(-30 -4 -10)"/><circle cx="6" cy="-1" r="2" fill="${INK}"/></g></g></g>`;
// lucioles qui forment un croissant (ép. 15) : centre (x,y), rayon r, allumées une à une à partir de t0
export const lucioleCroissant = (x = 640, y = 300, s = 1, t0 = 0, n = 14) => Array.from({ length: n }, (_, i) => { const a = (-150 + (i * 300) / (n - 1)) * Math.PI / 180, r = 130, k = i / (n - 1), th = 1 - 0.7 * Math.sin(Math.PI * k); return luciole(x + s * (Math.cos(a) * r * 0.9 - 40 + (1 - th) * 30), y + s * Math.sin(a) * r * 0.9, 0.9 * s, { on: t0 + i * 0.18, fly: false }); }).join('');

// forêt la nuit (ép. 14, 15) : violette, étoilée, lune, lucioles. o.fireflies = nombre (défaut 16) · o.on = temps d'allumage des lucioles (défaut : dès le début) · o.moon = false
export const nuitForet = (o = {}) => {
  const [x0, x1] = ext(o), t = T('night');
  const trees = [-520, -300, 1380, 1620, 1840].map((x, i) => (i % 2 ? sapin(x, GROUND + 24, 1.8, { leaf: t.leaf[0], leaf2: t.leaf[1], trunk: t.trunk }) : arbre(x, GROUND + 30, 2.0, { leaf: t.leaf[0], leaf2: t.leaf[1], trunk: t.trunk }))).join('');
  const lights = Array.from({ length: o.fireflies ?? 16 }, (_, i) => luciole(x0 + 100 + rnd(i + 70) * (x1 - x0 - 200), GROUND - 150 + rnd(i + 90) * 280, 0.8 + rnd(i + 3) * 0.5, { on: o.on === undefined ? undefined : o.on + rnd(i) * 1.6 })).join('');
  return `${backdrop('night', o)}${o.moon === false ? '' : moon(1020, 130)}${trees}${ground('night', o)}${[300, 940].map((x) => buisson(x, GROUND + 80, 1.3, { leaf: t.leaf[0], leaf2: t.leaf[1] })).join('')}${lights}`;
};

// ═════════════════════ accessoires ═════════════════════

// carnet des contes (fil rouge de Lino) : (0,0) = centre ; largeur ≈ 80 × s fermé ; o.open = ouvert (largeur ≈ 150) ; o.stuck = ['pebble'|'leaf'|'feather'|'drop'…] trouvailles collées (carnet ouvert)
export const carnet = (x = 0, y = 0, s = 1, o = {}) => {
  const glyph = (k, gx, gy) => ({
    pebble: `<g transform="translate(${gx} ${gy}) scale(.7)">${caillou(0, 12, 1)}</g>`,
    leaf: `<g transform="translate(${gx} ${gy}) rotate(-30)"><path d="M0 -16 Q16 -4 0 16 Q-16 -4 0 -16Z" ${O('#e8603a', 3)}/><path d="M0 -12 V18" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></g>`,
    feather: `<g transform="translate(${gx} ${gy}) rotate(30)"><path d="M0 -18 Q14 -4 0 18 Q-12 -4 0 -18Z" ${O('#9fd7ff', 3)}/><path d="M0 -14 V22" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></g>`,
    drop: `<g transform="translate(${gx} ${gy})"><path d="M0 -16 Q14 4 0 14 Q-14 4 0 -16Z" ${O('#8fd3ff', 3)}/><ellipse cx="-4" cy="2" rx="2.5" ry="4" fill="#fff" opacity=".8"/></g>`,
  }[k] || '');
  if (o.open) {
    const st = (o.stuck || []).slice(0, 4);
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-78" y="-56" width="156" height="112" rx="10" ${O('#2f9a58', 5)}/><path d="M-70 -48 H-2 V50 H-70Z" ${O('#fffaf0', 4)}/><path d="M2 -48 H70 V50 H2Z" ${O('#fffaf0', 4)}/><path d="M0 -50 V52" stroke="${INK}" stroke-width="4"/>
    ${[-30, -14, 2, 18, 34].map((ly) => `<path d="M-60 ${ly} H-12" stroke="#cdbf9e" stroke-width="3" stroke-linecap="round"/>`).join('')}
    ${st.map((k, i) => glyph(k, [-34, 36, -34, 36][i], [-12, -12, 22, 22][i])).join('')}</g>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-52" width="80" height="104" rx="9" ${O('#2f9a58', 5)}/><rect x="-34" y="-46" width="14" height="92" rx="4" fill="#238a4a"/><rect x="26" y="-52" width="12" height="104" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><path d="M-6 -30 Q8 -42 20 -30 Q14 -14 -6 -30Z" ${O('#ffd23f', 3.5)}/><path d="M-4 -28 q10 -2 14 4" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-30 -42 q30 -6 52 0" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/></g>`;
};
// panier de pique-nique de Roussin : (0,0) = centre bas ; largeur ≈ 130 × s ; o.croissant = croissant qui dépasse ; o.empty = ouvert, vide
export const panier = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="70" ry="9" fill="#000" opacity=".16"/>
  <path d="M-52 -66 Q0 -130 52 -66" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-52 -66 Q0 -130 52 -66" stroke="#c98a4e" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${o.croissant ? `<g transform="translate(-6 -64) rotate(-18) scale(.9)"><path d="M-40 8 Q-34 -30 0 -32 Q34 -30 40 8 Q26 -6 14 -9 Q0 -1 -14 -9 Q-26 -6 -40 8Z" ${O('#e9a84a', 4)}/><path d="M-16 -22 q4 8 2 14 M2 -26 q2 8 0 14 M18 -20 q2 6 -2 12" stroke="#b97520" stroke-width="3" fill="none" stroke-linecap="round"/></g>` : ''}
  ${o.empty ? `<ellipse cy="-56" rx="64" ry="12" ${O('#8a5a33', 5)}/>` : `<path d="M-60 -58 Q-30 -88 0 -70 Q30 -88 60 -58Z" ${O('#ff8fa3', 4)}/><path d="M-44 -66 l8 6 M-12 -74 l8 6 M20 -72 l8 6" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`}
  <path d="M-66 -58 H66 L56 0 Q0 10 -56 0Z" ${O('#e8b86a', 5)}/><path d="M-60 -40 H60 M-56 -22 H56 M-30 -56 L-24 0 M0 -56 V4 M30 -56 L24 0" stroke="#b9823f" stroke-width="4" stroke-linecap="round"/><path d="M-50 -52 H-10" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/></g>`;
// lanterne (Taupin, la nuit) : (0,0) = bas ; hauteur ≈ 100 × s ; o.lit = false éteinte ; o.hang = true : suspendue (anse en haut, se balance)
export const lanterne = (x = 0, y = 0, s = 1, o = {}) => {
  const lit = o.lit !== false;
  const body = `${lit ? `<circle cy="-48" r="90" fill="#ffe97a" style="animation:f8glow2 1.3s ease-in-out infinite alternate"/>` : ''}
  <path d="M-22 -90 Q0 -128 22 -90" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-22 -90 Q0 -128 22 -90" stroke="#cfd2dc" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <rect x="-30" y="-96" width="60" height="12" rx="5" ${O('#8a8da0', 4)}/><rect x="-30" y="-12" width="60" height="14" rx="6" ${O('#8a8da0', 4)}/>
  <path d="M-26 -84 H26 L30 -12 H-30Z" ${O(lit ? '#fff3a6' : '#cfe8f6', 4.5)}/>
  ${lit ? `<g style="transform-origin:0px -16px;animation:f8flame .4s ease-in-out infinite alternate"><path d="M0 -16 C-14 -20 -14 -42 0 -62 C14 -42 14 -20 0 -16Z" ${O('#ff9f43', 3.5)}/><path d="M0 -18 C-6 -22 -6 -34 0 -44 C6 -34 6 -22 0 -18Z" fill="#ffe14a"/></g>` : ''}
  <path d="M-18 -78 L-18 -26 M18 -78 L18 -26" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".6"/><path d="M-20 -78 l6 -2 M-22 -64 v14" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${o.hang ? `<g style="transform-origin:0px -120px;animation:f8lamp 1.8s ease-in-out infinite alternate">${body}</g>` : body}</g>`;
};
