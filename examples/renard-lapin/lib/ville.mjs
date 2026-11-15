// Décor de la grande ville (saison 6) : chaque élément est une fonction qui renvoie une chaîne SVG.
// Convention (comme farm.mjs) : objets dessinés autour de (0,0) = leur point au sol (centre bas), à poser avec (x, y, s, o).
// Fonds « larges » : paramètre o.w (défaut WORLD = 2560 = deux écrans) pour que la caméra puisse défiler ; sol de la rue : GROUND = 560 (pavés de 560 à 720,
// les personnages se posent vers y = 620–670). Ciels : 'day' | 'dawn' | 'dusk' | 'night'.
//
// Fonds       : citySky(kind,w) · cityClouds(w) · skyline(w,tone) · sidewalk(w,tone) · roadGround(w) · streetBg(o) · plazaBg(o) · parkBg(o) · stationBg(o) · marketBg(o)
//               constructionBg(o) · nightBg(o) · bakeryInside(o) · postInside(o) · metroBg(o) · museumInside(o)
// Bâtiments   : building · bakery · postOffice · fireStation · museumFront · metroEntrance · windowBalcony
// Mobilier    : fountain · bench · tree · streetLamp · lampRow · mailbox · hydrant · trafficLight · crosswalk · ticketMachine · stationClock · plinth · ropeStand
// Véhicules   : car · fireTruck · train · metroTrain · tram · crane
// Accessoires : letter · stamp · baguette · breadBasket · oven · ticket · frame · cone · barrier · hole · hardHat · duck · marketStall · fireworkBurst
import { W, H, INK, an, ao, anims, vis, tf, cloud, addKF } from './kit.mjs';
import { apple } from './farm.mjs';

export const GROUND = 560;
export const WORLD = 2560;

addKF(`@keyframes vjet{0%{transform:translateY(8px) scaleY(.5);opacity:.6}50%{transform:translateY(0) scaleY(1);opacity:1}100%{transform:translateY(8px) scaleY(.5);opacity:.6}}
@keyframes vdrop{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),70px)}}
@keyframes vglow{from{opacity:.55;transform:scale(.95)}to{opacity:.85;transform:scale(1.05)}}
@keyframes vlampon{0%{opacity:0}100%{opacity:1}}
@keyframes vlight{0%,49%{opacity:1}50%,100%{opacity:.2}}
@keyframes vburst{0%{opacity:0;transform:scale(.1)}12%{opacity:1}70%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.12)}}
@keyframes vrise{0%{opacity:0;transform:translateY(var(--dy))}20%{opacity:1}100%{opacity:0;transform:translateY(0)}}
@keyframes vpoof{0%{opacity:0;transform:scale(.2)}25%{opacity:.95}100%{opacity:0;transform:scale(1.5) translateY(-30px)}}
@keyframes vtwk{from{opacity:.3}to{opacity:1}}
@keyframes vbob{from{transform:translateY(0)}to{transform:translateY(-4px)}}
@keyframes vwheel{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes vsmoke{0%{opacity:.9;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(30px,-70px) scale(1.4)}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const shadow = (rx) => `<ellipse cy="5" rx="${rx}" ry="12" fill="#000" opacity=".18"/>`;
const hl = (x, y, rx, rot = -10, op = 0.4) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${Math.max(3, rx * 0.22)}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`;
// fenêtres complémentaires d'une liste [[a,b]] sur [0,999]
const comp = (wins = []) => { const s = [...wins].sort((p, q) => p[0] - q[0]); const out = []; let t = 0; for (const [a, b] of s) { if (a > t) out.push([t, a]); t = Math.max(t, b); } out.push([t, 999]); return out; };
const winsVis = (wins, inner) => wins.map(([a, b]) => vis(a, b, inner)).join('');

// ═════════════════════ ciels et fonds ═════════════════════

export const citySky = (kind = 'day', w = WORLD) => {
  const bands = { day: ['#7cc8ff', '#9ad6ff', '#bfe6ff', '#dff3ff'], dawn: ['#ffb7a0', '#ffc9a0', '#ffdfb0', '#fff0c8'], dusk: ['#ff9f6b', '#ffb07a', '#ffc98f', '#ffe0a8'], night: ['#10163f', '#161e52', '#1d2766', '#27327c'] }[kind] || [];
  return bands.map((c, i) => `<rect y="${(i * GROUND) / 4}" width="${w}" height="${GROUND / 4 + 2}" fill="${c}"/>`).join('');
};
export const cityClouds = (w = WORLD, dark = false) => `<g style="animation:cdrift 16s ease-in-out infinite alternate">${Array.from({ length: Math.ceil(w / 560) }, (_, i) => cloud(160 + i * 560 + rnd(i) * 160, 90 + rnd(i + 3) * 70, 0.55 + rnd(i + 7) * 0.3, dark ? 0.6 : 0.95)).join('')}</g>`;
export const stars = (w = WORLD, n = 46) => Array.from({ length: n }, (_, i) => `<circle cx="${(rnd(i + 1) * w).toFixed(0)}" cy="${(20 + rnd(i + 9) * 300).toFixed(0)}" r="${(1.8 + rnd(i + 5) * 2.6).toFixed(1)}" fill="#fff8c8" style="animation:vtwk ${(0.8 + rnd(i + 2)).toFixed(2)}s ease-in-out ${(rnd(i + 4)).toFixed(2)}s infinite alternate"/>`).join('') + `<g transform="translate(${Math.round(w * 0.82)} 110)"><circle r="46" fill="#fff6c8" stroke="${INK}" stroke-width="4"/><circle cx="14" cy="-8" r="38" fill="#10163f" opacity="0"/><circle cx="-14" cy="-14" r="9" fill="#f0e6a8"/><circle cx="12" cy="14" r="6" fill="#f0e6a8"/></g>`;

// immeubles lointains (sans contour épais) : tone = 'day' | 'dusk' | 'night'
export const skyline = (w = WORLD, tone = 'day') => {
  const pal = { day: ['#c9d8ee', '#d8c9ee', '#eed0d0', '#cfe6d8', '#e8e0c4'], dusk: ['#b79aa8', '#a58aa0', '#c49a8a', '#9a8aa8', '#b8a090'], night: ['#2a3470', '#323c7e', '#27306a', '#38428a', '#2c3676'] }[tone] || [];
  const win = tone === 'night' ? '#ffe27a' : '#ffffff';
  let out = '', x = -20, i = 0;
  while (x < w) {
    const bw = 90 + rnd(i + 1) * 90, bh = 170 + rnd(i + 2) * 190, c = pal[i % pal.length];
    out += `<rect x="${x.toFixed(0)}" y="${(GROUND - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" rx="6" fill="${c}" stroke="${tone === 'night' ? '#1a2250' : '#8a7aa0'}" stroke-width="3.5"/>`;
    for (let r = 0; r < Math.floor(bh / 48); r++) for (let k = 0; k < Math.floor(bw / 36); k++) if (tone !== 'night' || rnd(i * 31 + r * 7 + k) > 0.4) out += `<rect x="${(x + 12 + k * 36).toFixed(0)}" y="${(GROUND - bh + 16 + r * 48).toFixed(0)}" width="16" height="22" rx="3" fill="${win}" opacity="${tone === 'night' ? 0.9 : 0.7}"/>`;
    if (i % 3 === 1) out += `<rect x="${(x + bw / 2 - 2).toFixed(0)}" y="${(GROUND - bh - 26).toFixed(0)}" width="4" height="26" fill="#8a7aa0"/>`;
    x += bw + 6 + rnd(i + 4) * 14; i++;
  }
  return out;
};
// trottoir de pavés (560 → 720) ; tone = 'day' | 'dusk' | 'night'
export const sidewalk = (w = WORLD, tone = 'day') => {
  const c = { day: ['#d9d3c6', '#c9c2b2', '#bdb5a3'], dusk: ['#c4b49a', '#b4a58c', '#a89a82'], night: ['#4a4d6e', '#3e4162', '#363858'] }[tone] || [];
  return `<rect y="${GROUND}" width="${w}" height="${H - GROUND}" fill="${c[0]}"/><rect y="${GROUND}" width="${w}" height="16" fill="${c[1]}" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: Math.ceil(w / 96) + 1 }, (_, i) => `<path d="M${i * 96 - 20} ${GROUND + 16} l-26 ${H - GROUND}" stroke="${c[2]}" stroke-width="4" stroke-linecap="round"/>`).join('')}
  <path d="M0 ${GROUND + 70} H${w} M0 ${GROUND + 124} H${w}" stroke="${c[2]}" stroke-width="3.5" opacity=".7"/>`;
};
// chaussée (au lieu du trottoir) : bande sombre avec lignes jaunes
export const roadGround = (w = WORLD, tone = 'day') => {
  const c = tone === 'night' ? ['#30314f', '#262742'] : ['#6a6f80', '#5a5f70'];
  return `<rect y="${GROUND - 30}" width="${w}" height="${H - GROUND + 30}" fill="${c[0]}"/><rect y="${GROUND - 30}" width="${w}" height="20" fill="#cfc8b8" stroke="${INK}" stroke-width="4"/>
  <rect y="${GROUND - 12}" width="${w}" height="${H - GROUND + 12}" fill="${c[0]}"/>
  ${Array.from({ length: Math.ceil(w / 150) }, (_, i) => `<rect x="${i * 150 + 20}" y="${GROUND + 118}" width="80" height="12" rx="6" fill="#ffe27a" stroke="${INK}" stroke-width="3"/>`).join('')}`;
};
// passage piéton : (x,y) = coin gauche des bandes, largeur wd ; à poser SUR la chaussée (les rayures s'alignent avec celles de Zazie)
export const crosswalk = (x = 0, wd = 560, o = {}) => {
  const n = Math.max(2, Math.floor(wd / 70)), st = wd / n;
  return `<g transform="translate(${x} 0)">${Array.from({ length: n }, (_, i) => `<path d="M${i * st + 6} ${GROUND - 8} L${i * st + st - 14} ${GROUND - 8} L${i * st + st - 30} ${H} L${i * st - 22} ${H}Z" fill="#fff" stroke="${INK}" stroke-width="${o.ink ?? 4}" stroke-linejoin="round"/>`).join('')}</g>`;
};

const gutterBuildings = (w, tone) => {
  const cols = tone === 'night' ? ['#4a4f9a', '#5a4a8a', '#3f5a9a'] : tone === 'dusk' ? ['#e8a07a', '#d8887a', '#c89a6a'] : ['#ffcf6b', '#ff9f8a', '#9ad6a4', '#8cc4f2', '#f2b0d0'];
  let out = '', x = 40, i = 0;
  while (x < w - 120) { const bw = 180 + rnd(i + 11) * 80; out += building(x + bw / 2, GROUND, 1, { w: bw, h: 250 + rnd(i + 12) * 120, col: cols[i % cols.length], tone, door: i % 2 === 0, roof: i % 3 === 0 ? 'tri' : 'flat' }); x += bw + 14; i++; }
  return out;
};
// rue : ciel + nuages + skyline + façades + trottoir (o.kind, o.w, o.ground = 'sidewalk' | 'road', o.facades = true)
export const streetBg = (o = {}) => {
  const { kind = 'day', w = WORLD, ground = 'sidewalk', facades = true } = o;
  const tone = kind === 'night' ? 'night' : kind === 'day' ? 'day' : 'dusk';
  return `${citySky(kind, w)}${kind === 'night' ? stars(w) : cityClouds(w)}${skyline(w, tone)}${facades ? gutterBuildings(w, tone) : ''}${ground === 'road' ? roadGround(w, tone) : sidewalk(w, tone)}`;
};
// place : ciel + skyline + façades basses + pavés (la fontaine se pose dessus)
export const plazaBg = (o = {}) => streetBg({ ...o, facades: o.facades ?? true });
export const nightBg = (o = {}) => streetBg({ ...o, kind: 'night' });
export const parkBg = (o = {}) => {
  const { w = WORLD, kind = 'day' } = o;
  const tone = kind === 'day' ? 'day' : 'dusk';
  return `${citySky(kind, w)}${cityClouds(w)}${skyline(w, tone)}
  <path d="M0 ${GROUND - 20} Q${w * 0.2} ${GROUND - 90} ${w * 0.4} ${GROUND - 24} T${w * 0.8} ${GROUND - 30} T${w} ${GROUND - 20} V${H} H0Z" fill="#a5e08a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect y="${GROUND + 10}" width="${w}" height="${H - GROUND - 10}" fill="#7fcf6a"/>
  <path d="M0 ${GROUND + 36} Q${w * 0.25} ${GROUND + 20} ${w * 0.5} ${GROUND + 40} T${w} ${GROUND + 34} V${GROUND + 110} Q${w * 0.5} ${GROUND + 130} 0 ${GROUND + 100}Z" fill="#e9d9a8" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: Math.ceil(w / 130) }, (_, i) => `<g transform="translate(${60 + i * 130} ${GROUND + 160 + (i % 3) * 14})"><path d="M0 0 q-3 -10 0 -16 M6 2 q2 -9 6 -12" stroke="#4fae55" stroke-width="4" stroke-linecap="round" fill="none"/></g>`).join('')}`;
};
export const stationBg = (o = {}) => {
  const { w = WORLD, kind = 'day' } = o;
  return `${citySky(kind, w)}${cityClouds(w)}${skyline(w, kind === 'day' ? 'day' : 'dusk')}
  <rect y="${GROUND - 60}" width="${w}" height="46" fill="#6a6f80"/><rect y="${GROUND - 20}" width="${w}" height="8" fill="#4a4a58"/>
  ${Array.from({ length: Math.ceil(w / 44) }, (_, i) => `<rect x="${i * 44 + 4}" y="${GROUND - 24}" width="30" height="14" rx="3" ${O('#9b6a3c', 3)}/>`).join('')}
  <path d="M0 ${GROUND - 40} H${w} M0 ${GROUND - 26} H${w}" stroke="#c9c9d8" stroke-width="5"/>
  <rect y="${GROUND - 6}" width="${w}" height="${H - GROUND + 6}" fill="#c9c2b2"/><rect y="${GROUND - 6}" width="${w}" height="16" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: Math.ceil(w / 140) }, (_, i) => `<path d="M${i * 140} ${GROUND + 10} l-30 ${H - GROUND}" stroke="#b5ad9b" stroke-width="4" stroke-linecap="round"/>`).join('')}
  <rect x="0" y="24" width="${w}" height="26" fill="#3f6fc0" stroke="${INK}" stroke-width="5"/>${Array.from({ length: Math.ceil(w / 220) }, (_, i) => `<path d="M${i * 220 + 60} 50 V${GROUND - 70}" stroke="#3f6fc0" stroke-width="16" stroke-linecap="round"/><path d="M${i * 220 + 60} 50 V${GROUND - 70}" stroke="${INK}" stroke-width="4" opacity=".4"/>`).join('')}`;
};
export const marketBg = (o = {}) => streetBg({ ...o, facades: o.facades ?? true });
export const constructionBg = (o = {}) => {
  const { w = WORLD } = o;
  return `${citySky('day', w)}${cityClouds(w)}${skyline(w, 'day')}
  <rect y="${GROUND}" width="${w}" height="${H - GROUND}" fill="#d9b98a"/><path d="M0 ${GROUND + 6} H${w}" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: Math.ceil(w / 160) }, (_, i) => `<ellipse cx="${60 + i * 160 + rnd(i) * 40}" cy="${GROUND + 70 + rnd(i + 3) * 70}" rx="${20 + rnd(i + 5) * 20}" ry="7" fill="#c9a572"/>`).join('')}
  <g transform="translate(0 ${GROUND})"><path d="M0 -50 H${w}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 -50 H${w}" stroke="#ffd23f" stroke-width="5" stroke-dasharray="40 26"/></g>`;
};

// ═════════════════════ immeubles et boutiques ═════════════════════

// façade générique ; (0,0) = centre bas ; o.w, o.h, o.col, o.roof = 'flat'|'tri', o.door, o.tone ('night' = fenêtres allumées), o.rows
export const building = (x = 0, y = 0, s = 1, o = {}) => {
  const { w = 220, h = 300, col = '#ffcf6b', roof = 'flat', door = false, tone = 'day' } = o;
  const rows = o.rows ?? Math.max(1, Math.floor((h - (door ? 120 : 60)) / 92)), cols = Math.max(1, Math.floor(w / 90));
  const glass = tone === 'night' ? '#ffe27a' : '#bfe6ff';
  const wins = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, k) => {
    const cx = -w / 2 + (w / cols) * (k + 0.5), cy = -h + 62 + r * 92, lit = tone !== 'night' || rnd(r * 9 + k + w) > 0.3;
    return `<rect x="${cx - 24}" y="${cy - 30}" width="48" height="62" rx="6" ${O('#fff4dc', 4)}/><rect x="${cx - 17}" y="${cy - 23}" width="34" height="48" rx="3" fill="${lit ? glass : '#3a4478'}"/><path d="M${cx} ${cy - 23} V${cy + 25} M${cx - 17} ${cy} H${cx + 17}" stroke="#fff4dc" stroke-width="3.5"/><path d="M${cx - 12} ${cy - 16} l9 -2" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/><rect x="${cx - 28}" y="${cy + 30}" width="56" height="7" rx="3" ${O('#c9b79a', 3)}/>`;
  }).join('')).join('');
  const dr = door ? `<rect x="-26" y="-92" width="52" height="92" rx="8" ${O('#9b6a3c', 4)}/><path d="M-26 -60 H26" stroke="${INK}" stroke-width="3" opacity=".4"/><circle cx="14" cy="-44" r="4" fill="#ffd23f" stroke="${INK}" stroke-width="2"/><path d="M-18 -84 q6 -2 8 4" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45" fill="none"/>` : '';
  const rf = roof === 'tri' ? `<path d="M${-w / 2 - 12} ${-h} L0 ${-h - 64} L${w / 2 + 12} ${-h}Z" ${O('#c43e3e', 5)}/>${hl(-w / 5, -h - 28, 24, -26, 0.4)}<rect x="${w / 4}" y="${-h - 62}" width="20" height="40" ${O('#a8483a', 4)}/>` : `<rect x="${-w / 2 - 8}" y="${-h - 18}" width="${w + 16}" height="22" rx="6" ${O('#fff4dc', 5)}/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="6" ${O(col, 6)}/>${hl(-w / 2 + 30, -h + 22, 26, -4, 0.35)}${wins}${dr}${rf}</g>`;
};

// boulangerie, devanture ; largeur ≈ 440, hauteur ≈ 340 ; o.lit = lumière chaude (enseigne + vitrine plus claires)
export const bakery = (x = 0, y = 0, s = 1, o = {}) => {
  const stripes = Array.from({ length: 8 }, (_, i) => `<path d="M${-220 + i * 55} -250 h55 l-8 54 h-55Z" ${O(i % 2 ? '#fff4dc' : '#e8434e', 4)}/>`).join('');
  const loaf = (cx, cy, c = '#e9a84a') => `<ellipse cx="${cx}" cy="${cy}" rx="22" ry="12" ${O(c, 3.5)}/><path d="M${cx - 10} ${cy - 6} l6 8 M${cx} ${cy - 8} l6 8" stroke="#b97520" stroke-width="2.5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(230)}
  <rect x="-210" y="-330" width="420" height="330" rx="8" ${O('#ffe2b0', 6)}/><rect x="-210" y="-330" width="420" height="64" rx="8" ${O('#a8683a', 6)}/>
  <g transform="translate(0 -298)"><ellipse rx="64" ry="24" fill="${o.lit ? '#fff3b0' : '#fff4dc'}" stroke="${INK}" stroke-width="4"/><g transform="scale(.9) translate(0 8)"><path d="M-40 8 Q-34 -30 0 -32 Q34 -30 40 8 Q26 -6 14 -9 Q0 -1 -14 -9 Q-26 -6 -40 8Z" ${O('#e9a84a', 4)}/><path d="M-14 -9 Q-13 -22 -5 -30 M14 -9 Q13 -22 5 -30" stroke="#b97520" stroke-width="3" fill="none"/></g></g>
  <rect x="-186" y="-182" width="230" height="130" rx="8" ${O('#bfe6ff', 5)}/><path d="M-186 -100 H44" stroke="#fff4dc" stroke-width="6"/>
  ${loaf(-150, -108)}${loaf(-100, -108, '#d9923a')}<path d="M-70 -118 l50 20" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-70 -118 l50 20" stroke="#e9a84a" stroke-width="7" stroke-linecap="round"/>${loaf(-150, -64)}${loaf(-100, -64)}${loaf(-50, -64, '#d9923a')}<ellipse cx="-4" cy="-64" rx="20" ry="12" ${O('#f6d08a', 3.5)}/>
  ${hl(-130, -168, 34, -8, 0.5)}
  <rect x="74" y="-190" width="108" height="190" rx="8" ${O('#9b6a3c', 5)}/><rect x="88" y="-176" width="80" height="100" rx="5" ${O('#bfe6ff', 4)}/><circle cx="92" cy="-60" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>
  ${stripes}<path d="M-220 -196 q27 24 55 0 q27 24 55 0 q27 24 55 0 q27 24 55 0 q27 24 55 0 q27 24 55 0 q27 24 55 0 q27 24 55 0" fill="none" stroke="${INK}" stroke-width="0"/>
  <path d="M-224 -250 H224 L216 -196 H-216Z" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
};
// four à bois ; (0,0) = centre bas ; o.open = temps d'ouverture de la porte (nuage de farine) ; o.fire = flamme visible
export const oven = (x = 0, y = 0, s = 1, o = {}) => {
  const t = o.open ?? 0;
  const door = t > 0 ? tf(`<rect x="-62" y="-150" width="124" height="112" rx="52" ${O('#8a8a9a', 5)}/>`, { t0: t, d: 0.6, from: 'scaleX(1)', to: 'scaleX(.12)', e: 'ease-out', o: '-62px 0px' }) : '';
  const puff = t > 0 ? [0, 1, 2, 3, 4].map((i) => `<g transform="translate(${-70 + i * 36} -120)"><g style="${an({ n: 'vpoof', d: 1.3, t: t + 0.15 + i * 0.07, f: 'both' })}"><circle r="${30 + (i % 2) * 14}" fill="#fff" stroke="#e6e2ea" stroke-width="3"/></g></g>`).join('') : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(150)}
  <path d="M-130 0 V-190 Q-130 -280 0 -280 Q130 -280 130 -190 V0Z" ${O('#c9674a', 6)}/>${Array.from({ length: 5 }, (_, i) => `<path d="M-128 ${-40 - i * 40} H128" stroke="#a8483a" stroke-width="3.5" opacity=".5"/>`).join('')}${hl(-70, -240, 30, -30, 0.35)}
  <path d="M-86 -30 V-120 Q-86 -184 0 -184 Q86 -184 86 -120 V-30Z" fill="#2b1e1a" stroke="${INK}" stroke-width="5"/><path d="M-60 -30 Q-30 -90 0 -60 Q30 -110 56 -30Z" fill="#ff8a2b"/><path d="M-30 -30 Q-10 -66 4 -48 Q22 -76 34 -30Z" fill="#ffd23f"/>
  ${door}<rect x="-20" y="-300" width="40" height="30" ${O('#a8483a', 4)}/>${puff}</g>`;
};

// baguette ; (0,0) = centre ; longueur ≈ 150
export const baguette = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-80" y="-14" width="160" height="28" rx="14" ${O('#e9a84a', 4.5)}/>${[-44, -14, 16, 46].map((k) => `<path d="M${k - 8} -9 l10 18" stroke="#b97520" stroke-width="4" stroke-linecap="round"/>`).join('')}<path d="M-64 -7 H40" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".5"/></g>`;
// panier de pain ; (0,0) = centre bas
export const breadBasket = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="2" rx="62" ry="9" fill="#000" opacity=".15"/>${baguette(-16, -48, 0.5, -64)}${baguette(10, -50, 0.5, -76)}<ellipse cx="-30" cy="-38" rx="22" ry="12" ${O('#d9923a', 3.5)}/><ellipse cx="30" cy="-36" rx="20" ry="12" ${O('#e9a84a', 3.5)}/>
  <path d="M-58 -40 H58 L48 0 H-48Z" ${O('#c99a52', 4.5)}/>${[-30, -10, 10, 30].map((k) => `<path d="M${k} -40 V0" stroke="#a8783a" stroke-width="3" opacity=".6"/>`).join('')}<path d="M-54 -22 H54" stroke="#a8783a" stroke-width="3" opacity=".6"/></g>`;
// intérieur de la boulangerie (plein écran, w = W) : mur, étagères de pain, comptoir
export const bakeryInside = (o = {}) => {
  const w = o.w ?? W;
  const shelf = (x, y) => `<rect x="${x}" y="${y}" width="250" height="14" rx="5" ${O('#a8683a', 4)}/>${[0, 1, 2].map((i) => `<ellipse cx="${x + 44 + i * 78}" cy="${y - 14}" rx="${i === 1 ? 26 : 30}" ry="15" ${O(i === 1 ? '#d9923a' : '#e9a84a', 3.5)}/>`).join('')}`;
  return `<rect width="${w}" height="${H}" fill="#ffe9bd"/>${Array.from({ length: Math.ceil(w / 80) }, (_, i) => `<rect x="${i * 80}" y="0" width="40" height="${GROUND}" fill="#fbdca0" opacity=".6"/>`).join('')}
  <rect y="${GROUND}" width="${w}" height="${H - GROUND}" fill="#e8c898"/>${Array.from({ length: Math.ceil(w / 90) }, (_, i) => `<path d="M${i * 90} ${GROUND} l-30 ${H - GROUND}" stroke="#d3b080" stroke-width="4"/>`).join('')}
  ${shelf(60, 190)}${shelf(60, 300)}${shelf(330, 190)}${shelf(330, 300)}
  <path d="M-0 40 q${w / 8} 30 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0" fill="none" stroke="#e8434e" stroke-width="10" stroke-linecap="round"/>
  <rect x="${w * 0.6}" y="${GROUND - 20}" width="${w * 0.4}" height="130" rx="10" ${O('#a8683a', 6)}/><rect x="${w * 0.6 - 8}" y="${GROUND - 36}" width="${w * 0.4 + 16}" height="24" rx="8" ${O('#e8c898', 5)}/>${hl(w * 0.7, GROUND - 26, 60, 0, 0.5)}`;
};

// ═════════════════════ poste ═════════════════════

// lettre : enveloppe crème, timbre jaune soleil, cœur rouge au dos (o.back = true) ; (0,0) = centre ; 90 × 60
export const letter = (x = 0, y = 0, s = 1, rot = 0, o = {}) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${o.back ? `<rect x="-46" y="-32" width="92" height="64" rx="6" ${O('#fff1cf', 4)}/><path d="M-44 -30 L0 6 L44 -30" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 22 C-26 4 -12 -12 0 2 C12 -12 26 4 0 22Z" fill="#e8434e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" transform="translate(0 -2) scale(.82)"/>`
  : `<rect x="-46" y="-32" width="92" height="64" rx="6" ${O('#fff1cf', 4)}/><path d="M-44 -30 L0 4 L44 -30" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M-30 14 h30 M-30 22 h20" stroke="#b9a78a" stroke-width="3" stroke-linecap="round"/>${stamp(28, -12, 0.5)}`}<path d="M-38 -26 l22 5" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/></g>`;
// timbre jaune en forme de soleil ; (0,0) = centre ; ≈ 60 de large
export const stamp = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${Array.from({ length: 24 }, (_, i) => `${i ? 'L' : 'M'}${(Math.cos((i / 24) * 6.2832) * (i % 2 ? 30 : 34)).toFixed(1)} ${(Math.sin((i / 24) * 6.2832) * (i % 2 ? 30 : 34)).toFixed(1)}`).join(' ')}Z" ${O('#fff4dc', 3.5)}/>
  ${Array.from({ length: 8 }, (_, i) => `<path d="M0 -22 L5 -15 L-5 -15Z" fill="#ff9f1c" transform="rotate(${i * 45})"/>`).join('')}<circle r="12" ${O('#ffd23f', 3.2)}/><circle cx="-4" cy="-4" r="3" fill="#fff" opacity=".7"/></g>`;
// boîte aux lettres jaune sur pied ; (0,0) = pied
export const mailbox = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(40)}<rect x="-8" y="-60" width="16" height="60" ${O('#6a6f80', 4)}/><path d="M-44 -64 V-130 Q-44 -168 0 -168 Q44 -168 44 -130 V-64Z" ${O('#ffd23f', 5)}/><rect x="-28" y="-130" width="56" height="9" rx="4" fill="${INK}"/>${hl(-18, -152, 14, -30, 0.55)}<path d="M-44 -90 H44" stroke="#f0b400" stroke-width="5"/></g>`;
// bureau de poste ; largeur ≈ 420, hauteur ≈ 330
export const postOffice = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(230)}
  <rect x="-210" y="-300" width="420" height="300" rx="8" ${O('#ffd23f', 6)}/><rect x="-224" y="-316" width="448" height="34" rx="8" ${O('#3f6fc0', 6)}/>${hl(-150, -306, 50, 0, 0.4)}
  <g transform="translate(0 -240)"><circle r="46" ${O('#fff4dc', 5)}/><path d="M-26 -8 H26 V20 H-26Z" ${O('#ffffff', 3.5)}/><path d="M-26 -8 L0 10 L26 -8" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="0" cy="-26" r="0"/></g>
  <rect x="-170" y="-180" width="130" height="110" rx="8" ${O('#bfe6ff', 5)}/><path d="M-105 -180 V-70 M-170 -125 H-40" stroke="#fff4dc" stroke-width="6"/>${hl(-140, -164, 22, -10, 0.55)}
  <rect x="20" y="-190" width="120" height="190" rx="8" ${O('#9b6a3c', 5)}/><rect x="36" y="-174" width="88" height="100" rx="5" ${O('#bfe6ff', 4)}/><circle cx="48" cy="-60" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>
  <g transform="translate(176 -70)">${mailbox(0, 70, 0.62)}</g></g>`;
// intérieur de la poste : mur, comptoir à guichet (hublot), balance, tampon ; o.w
export const postInside = (o = {}) => {
  const w = o.w ?? W;
  return `<rect width="${w}" height="${H}" fill="#fff0c8"/><rect y="${GROUND}" width="${w}" height="${H - GROUND}" fill="#c9b79a"/>${Array.from({ length: Math.ceil(w / 110) }, (_, i) => `<path d="M${i * 110} ${GROUND} l-30 ${H - GROUND}" stroke="#b5a387" stroke-width="4"/>`).join('')}
  <rect y="0" width="${w}" height="30" fill="#3f6fc0" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(150 120)">${Array.from({ length: 6 }, (_, i) => `<rect x="${(i % 3) * 78}" y="${Math.floor(i / 3) * 86}" width="66" height="74" rx="6" ${O('#ffe9a8', 4)}/><circle cx="${(i % 3) * 78 + 33}" cy="${Math.floor(i / 3) * 86 + 37}" r="9" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>`).join('')}</g>
  <rect x="${w * 0.46}" y="110" width="${w * 0.32}" height="210" rx="10" ${O('#bfe6ff', 6)}/><path d="M${w * 0.46 + w * 0.16} 110 V320" stroke="#fff4dc" stroke-width="7"/>${hl(w * 0.5, 134, 40, -6, 0.55)}
  <rect x="${w * 0.4}" y="${GROUND - 40}" width="${w * 0.45}" height="150" rx="10" ${O('#a8683a', 6)}/><rect x="${w * 0.4 - 10}" y="${GROUND - 58}" width="${w * 0.45 + 20}" height="26" rx="8" ${O('#e8c898', 5)}/>${hl(w * 0.55, GROUND - 48, 80, 0, 0.5)}
  <g transform="translate(${w * 0.46} ${GROUND - 58})"><rect x="0" y="-26" width="54" height="26" rx="6" ${O('#e8434e', 4)}/><rect x="14" y="-62" width="26" height="40" rx="8" ${O('#8a5a33', 4)}/></g>`;
};

// ═════════════════════ pompiers ═════════════════════

// camion de pompiers rouge vu de côté, regarde à droite ; (0,0) = centre bas ; largeur ≈ 400 ; o.drive = [[a,b]] roues/rebond ; o.light = gyrophare clignotant ; o.ladder = false
export const fireTruck = (x = 0, y = 0, s = 1, o = {}) => {
  const drive = o.drive || [];
  const wheel = (cx) => `<g transform="translate(${cx} -34)"><g style="transform-origin:0px 0px;${anims(drive.map(([a, b]) => ao({ n: 'vwheel', d: 0.45, t: a, c: Math.max(1, Math.round((b - a) / 0.45)) })))}"><circle r="34" ${O('#3a3340', 6)}/><circle r="17" ${O('#d8d4e0', 4)}/><path d="M0 -17 V17 M-17 0 H17" stroke="${INK}" stroke-width="3.5"/></g></g>`;
  const bump = drive.map(([a, b]) => ao({ n: 'vbob', d: 0.16, t: a, c: Math.max(1, Math.round((b - a) / 0.16)), dir: 'alternate' }));
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(200)}<g style="${anims(bump)}">
  ${o.ladder === false ? '' : `<path d="M-150 -156 L40 -190" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-150 -156 L40 -190" stroke="#d8d4e0" stroke-width="8" stroke-linecap="round"/>${[-110, -70, -30, 10].map((k) => `<path d="M${k} ${-163 - (k + 150) * 0.18} l-3 -14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('')}`}
  <rect x="-196" y="-170" width="260" height="116" rx="14" ${O('#e8434e', 6)}/><path d="M64 -150 H116 Q150 -150 168 -112 L196 -100 V-54 H64Z" ${O('#e8434e', 6)}/>
  <path d="M82 -138 H116 Q136 -136 148 -112 H82Z" ${O('#bfe6ff', 5)}/><path d="M92 -130 l18 0" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  <rect x="-180" y="-98" width="232" height="14" rx="7" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/><rect x="-180" y="-70" width="150" height="10" rx="5" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>
  <rect x="-196" y="-60" width="400" height="14" rx="7" ${O('#d8d4e0', 5)}/>
  ${o.light === false ? '' : `<g transform="translate(116 -166)"><rect x="-22" y="0" width="44" height="14" rx="5" ${O('#d8d4e0', 4)}/><path d="M-18 0 Q-18 -26 0 -26 Q18 -26 18 0Z" ${O('#6fc3ff', 4)}/><g style="animation:vlight .5s steps(1) infinite"><path d="M-18 0 Q-18 -26 0 -26 Q18 -26 18 0Z" fill="#ff5a5a" stroke="${INK}" stroke-width="4"/></g></g>`}
  <path d="M184 -88 h14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="190" cy="-74" r="8" fill="#ffe27a" stroke="${INK}" stroke-width="3.5"/>
  ${hl(-100, -158, 60, -2, 0.35)}</g>${wheel(-110)}${wheel(100)}</g>`;
};
// caserne : bâtiment rouge à grande porte ; largeur ≈ 480, hauteur ≈ 380 ; o.open = temps d'ouverture de la porte (true = ouverte)
export const fireStation = (x = 0, y = 0, s = 1, o = {}) => {
  const door = o.open === true ? '' : o.open === undefined ? `<rect x="-120" y="-190" width="240" height="190" fill="#e6e2ee"/>` : tf(`<rect x="-120" y="-190" width="240" height="190" fill="#e6e2ee"/>`, { t0: o.open, d: 0.9, from: 'translateY(0)', to: 'translateY(-190px)', e: 'ease-in' });
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(280)}
  <rect x="-240" y="-300" width="480" height="300" rx="8" ${O('#e8434e', 6)}/><rect x="-256" y="-320" width="512" height="32" rx="8" ${O('#fff4dc', 6)}/>
  <rect x="-60" y="-440" width="120" height="130" rx="6" ${O('#e8434e', 6)}/><path d="M-72 -440 L0 -490 L72 -440Z" ${O('#c43e3e', 5)}/><circle cx="0" cy="-390" r="34" ${O('#fff4dc', 5)}/><path d="M0 -390 V-410 M0 -390 L14 -382" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <rect x="-120" y="-190" width="240" height="190" fill="#4a3a3a" stroke="${INK}" stroke-width="5"/>${door}${Array.from({ length: 5 }, (_, i) => `<path d="M-116 ${-170 + i * 36} H116" stroke="#b9b5c6" stroke-width="3.5" opacity="${o.open === true ? 0 : 1}"/>`).join('')}
  <rect x="-120" y="-190" width="240" height="190" fill="none" stroke="${INK}" stroke-width="7"/><rect x="-196" y="-250" width="54" height="64" rx="6" ${O('#bfe6ff', 4)}/><rect x="142" y="-250" width="54" height="64" rx="6" ${O('#bfe6ff', 4)}/>
  <g transform="translate(-170 -90)"><circle r="30" ${O('#fff4dc', 4)}/><path d="M0 -16 Q14 0 0 14 Q-14 0 0 -16Z" ${O('#ff8a2b', 3)}/></g>${hl(-170, -276, 50, 0, 0.35)}</g>`;
};
// borne d'incendie ; (0,0) = pied
export const hydrant = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(36)}<rect x="-26" y="-84" width="52" height="84" rx="10" ${O('#e8434e', 5)}/><path d="M-22 -84 Q-22 -112 0 -112 Q22 -112 22 -84Z" ${O('#e8434e', 5)}/><rect x="-34" y="-62" width="68" height="18" rx="7" ${O('#ffd23f', 4)}/><circle cx="0" cy="-122" r="7" ${O('#d8d4e0', 3.5)}/>${hl(-12, -76, 8, -80, 0.5)}</g>`;

// ═════════════════════ circulation ═════════════════════

// voiture ronde mignonne vue de côté (regarde à droite) ; (0,0) = centre bas ; largeur ≈ 230 ; o.col, o.drive = [[a,b]]
export const car = (x = 0, y = 0, s = 1, o = {}) => {
  const col = o.col || '#5fb7f2', drive = o.drive || [];
  const wheel = (cx) => `<g transform="translate(${cx} -22)"><g style="transform-origin:0px 0px;${anims(drive.map(([a, b]) => ao({ n: 'vwheel', d: 0.4, t: a, c: Math.max(1, Math.round((b - a) / 0.4)) })))}"><circle r="22" ${O('#3a3340', 5)}/><circle r="10" ${O('#d8d4e0', 3.5)}/><path d="M0 -10 V10 M-10 0 H10" stroke="${INK}" stroke-width="3"/></g></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(120)}<path d="M-108 -32 Q-112 -62 -80 -66 L-52 -66 Q-36 -112 4 -112 Q48 -112 62 -66 L90 -64 Q116 -60 112 -32Z" ${O(col, 6)}/>
  <path d="M-36 -68 Q-26 -98 2 -98 L2 -68Z M14 -68 V-98 Q40 -98 48 -68Z" ${O('#dff3ff', 4)}/><circle cx="-6" cy="-92" r="0"/>${hl(-70, -56, 20, -8, 0.5)}<circle cx="102" cy="-46" r="9" fill="#ffe27a" stroke="${INK}" stroke-width="4"/><rect x="-110" y="-50" width="12" height="16" rx="4" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/>${wheel(-62)}${wheel(66)}</g>`;
};
// feu tricolore ; (0,0) = pied ; hauteur ≈ 280 ; rouge par défaut ; o.green = [[a,b]] fenêtres où il est vert
export const trafficLight = (x = 0, y = 0, s = 1, o = {}) => {
  const g = o.green || [], off = (c) => `<circle r="16" fill="#4a4458" stroke="${INK}" stroke-width="3.5"/>`;
  const lamp = (cy, col, wins) => `<g transform="translate(0 ${cy})">${off()}${winsVis(wins, `<circle r="16" fill="${col}" stroke="${INK}" stroke-width="3.5"/><circle r="30" fill="${col}" opacity=".25"/><circle cx="-5" cy="-5" r="4" fill="#fff" opacity=".7"/>`)}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(36)}<rect x="-8" y="-200" width="16" height="200" ${O('#6a6f80', 4.5)}/><rect x="-30" y="-290" width="60" height="124" rx="14" ${O('#3a3340', 5.5)}/>
  ${lamp(-262, '#ff4a4a', comp(g))}${lamp(-228, '#ffd23f', [])}${lamp(-194, '#4ade80', g)}${hl(-14, -280, 8, -70, 0.35)}</g>`;
};

// ═════════════════════ gare, métro, tram ═════════════════════

// horloge ronde de gare ; o.h, o.m = heure affichée
export const stationClock = (x = 0, y = 0, s = 1, o = {}) => {
  const h = o.h ?? 10, m = o.m ?? 40;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -40 V-100" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle r="56" ${O('#fff4dc', 6)}/>${Array.from({ length: 12 }, (_, i) => `<path d="M0 -46 v${i % 3 ? 5 : 10}" stroke="${INK}" stroke-width="${i % 3 ? 3 : 5}" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}
  <path d="M0 0 V-26" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${(h % 12) * 30 + m * 0.5})"/><path d="M0 0 V-38" stroke="${INK}" stroke-width="4" stroke-linecap="round" transform="rotate(${m * 6})"/><circle r="5" fill="#e8434e"/>${hl(-20, -34, 14, -30, 0.55)}</g>`;
};
// wagon utile : fenêtres, porte ; helper interne
const wagonBody = (w, col, o = {}) => {
  const n = Math.floor((w - 130) / 90);
  return `<rect x="${-w / 2}" y="-190" width="${w}" height="150" rx="26" ${O(col, 6)}/><rect x="${-w / 2}" y="-100" width="${w}" height="18" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/>
  ${Array.from({ length: n }, (_, i) => `<rect x="${-w / 2 + 24 + i * 90}" y="-168" width="68" height="56" rx="12" ${O('#dff3ff', 4.5)}/><path d="M${-w / 2 + 34 + i * 90} -156 l16 -2" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`).join('')}
  <rect x="${w / 2 - 82}" y="-176" width="58" height="136" rx="10" ${O('#3a3340', 4.5)}/>${hl(-w / 2 + 70, -184, 40, 0, 0.4)}`;
};
// train de gare, vu de côté (regarde à droite) : locomotive + 1 wagon ; (0,0) = rail ; largeur ≈ 720 ; o.doorOpen = temps d'ouverture de la porte du wagon
export const train = (x = 0, y = 0, s = 1, o = {}) => {
  const doorT = o.doorOpen;
  const wheels = (cs, r = 26) => cs.map((cx) => `<g transform="translate(${cx} -${r})"><circle r="${r}" ${O('#3a3340', 5)}/><circle r="${r * 0.45}" ${O('#d8d4e0', 3.5)}/></g>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <g transform="translate(-170 0)">${wagonBody(340, '#ffd23f')}${doorT !== undefined ? vis(0, doorT, `<rect x="88" y="-176" width="58" height="136" rx="10" ${O('#ffe27a', 4.5)}/>`) : ''}${wheels([-120, -70, 70, 120])}</g>
  <rect x="2" y="-50" width="24" height="12" rx="5" ${O('#6a6f80', 4)}/>
  <g transform="translate(180 0)"><path d="M-150 -40 V-170 Q-150 -192 -128 -192 H70 L110 -150 V-40Z" ${O('#e8434e', 6)}/><path d="M-120 -178 H-30 V-110 H-120Z" ${O('#dff3ff', 4.5)}/><rect x="-130" y="-100" width="236" height="14" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/>
  <rect x="38" y="-246" width="46" height="56" rx="8" ${O('#6a6f80', 5)}/><g transform="translate(60 -250)">${[0, 1, 2].map((i) => `<g style="${an({ n: 'vsmoke', d: 1.8, t: i * 0.6, c: 999 })}"><circle r="14" fill="#fff" stroke="#c9c9d8" stroke-width="3"/></g>`).join('')}</g>
  <circle cx="96" cy="-90" r="12" fill="#ffe27a" stroke="${INK}" stroke-width="4"/>${hl(-70, -186, 40, 0, 0.4)}${wheels([-90, -30, 40, 90], 30)}</g></g>`;
};
// rame de métro (vue de face de côté, regarde à droite) ; ≈ 560 de large ; o.doorOpen = temps d'ouverture des portes
export const metroTrain = (x = 0, y = 0, s = 1, o = {}) => {
  const t = o.doorOpen;
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-280" y="-200" width="560" height="168" rx="34" ${O('#5fb7f2', 6)}/><rect x="-280" y="-110" width="560" height="14" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/>
  ${[-210, -40, 130].map((cx) => `<rect x="${cx - 40}" y="-180" width="80" height="62" rx="12" ${O('#dff3ff', 4.5)}/>`).join('')}
  ${[-125, 45].map((cx) => `<rect x="${cx - 26}" y="-180" width="52" height="148" rx="8" ${O(t === undefined ? '#3a3340' : '#ffe27a', 4.5)}/>${t !== undefined ? vis(0, t, `<rect x="${cx - 26}" y="-180" width="52" height="148" rx="8" ${O('#3a3340', 4.5)}/>`) : ''}<path d="M${cx} -180 V-32" stroke="${INK}" stroke-width="3.5"/>`).join('')}
  <circle cx="250" cy="-70" r="10" fill="#ffe27a" stroke="${INK}" stroke-width="4"/>${hl(-180, -192, 70, 0, 0.4)}<rect x="-256" y="-32" width="512" height="18" rx="8" ${O('#3a3340', 4)}/></g>`;
};
// tram jaune vu de côté (regarde à droite), perche sur le toit ; ≈ 560 de large ; (0,0) = rail
export const tram = (x = 0, y = 0, s = 1, o = {}) => {
  const drive = o.drive || [];
  const bump = drive.map(([a, b]) => ao({ n: 'vbob', d: 0.18, t: a, c: Math.max(1, Math.round((b - a) / 0.18)), dir: 'alternate' }));
  return `<g transform="translate(${x} ${y}) scale(${s})"><g style="${anims(bump)}">
  <path d="M-150 -214 L-60 -300 L100 -300" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-150 -214 L-60 -300 L100 -300" stroke="#8a8aa0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="-280" y="-230" width="560" height="190" rx="40" ${O('#ffd23f', 6)}/><rect x="-280" y="-120" width="560" height="16" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/>
  ${[-210, -110, -10, 90].map((cx) => `<rect x="${cx - 36}" y="-208" width="72" height="72" rx="14" ${O('#dff3ff', 4.5)}/>`).join('')}<rect x="168" y="-208" width="84" height="150" rx="14" ${O('#3a3340', 4.5)}/><path d="M178 -198 H242 V-150 H178Z" fill="#dff3ff" stroke="${INK}" stroke-width="3"/>
  <circle cx="262" cy="-86" r="9" fill="#ffe27a" stroke="${INK}" stroke-width="4"/>${hl(-170, -220, 70, 0, 0.45)}</g>
  ${[-190, -60, 90, 200].map((cx) => `<g transform="translate(${cx} -26)"><g style="transform-origin:0px 0px;${anims(drive.map(([a, b]) => ao({ n: 'vwheel', d: 0.5, t: a, c: Math.max(1, Math.round((b - a) / 0.5)) })))}"><circle r="26" ${O('#3a3340', 5)}/><circle r="11" ${O('#d8d4e0', 3.5)}/><path d="M0 -11 V11" stroke="${INK}" stroke-width="3"/></g></g>`).join('')}</g>`;
};
// rails de tram sur la chaussée (bande basse) + fils aériens ; à poser sous le tram
export const tramRails = (w = WORLD, y = GROUND + 40) => `<path d="M0 ${y} H${w} M0 ${y + 14} H${w}" stroke="${INK}" stroke-width="7"/><path d="M0 ${y} H${w} M0 ${y + 14} H${w}" stroke="#d8d4e0" stroke-width="3"/>${Array.from({ length: Math.ceil(w / 40) }, (_, i) => `<path d="M${i * 40} ${y + 18} v8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('')}<path d="M0 60 H${w}" stroke="${INK}" stroke-width="4"/>`;
// distributeur de tickets ; (0,0) = pied ; hauteur ≈ 250
export const ticketMachine = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(64)}<rect x="-54" y="-250" width="108" height="250" rx="14" ${O('#5fb7f2', 6)}/><rect x="-38" y="-230" width="76" height="60" rx="8" ${O('#dff3ff', 4)}/><path d="M-28 -214 h40 M-28 -196 h28" stroke="#3f6fc0" stroke-width="5" stroke-linecap="round"/>
  ${[0, 1, 2].map((i) => `<circle cx="${-20 + i * 20}" cy="-146" r="8" ${O('#ffd23f', 3.5)}/>`).join('')}<circle cx="0" cy="-112" r="16" ${O('#e8434e', 4)}/><rect x="-30" y="-70" width="60" height="22" rx="6" fill="#2b1e1a" stroke="${INK}" stroke-width="4"/>${hl(-30, -240, 12, -80, 0.5)}</g>`;
// ticket de métro jaune ; (0,0) = centre ; 56 × 34
export const ticket = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-30" y="-18" width="60" height="36" rx="5" ${O('#ffd23f', 3.5)}/><path d="M-20 -4 h24 M-20 6 h16" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".6"/><circle cx="20" cy="0" r="6" fill="none" stroke="${INK}" stroke-width="3"/></g>`;
// panneau M : dessiné sans texte
const metroM = (r = 40) => `<circle r="${r}" ${O('#e8434e', 5)}/><path d="M${-r * 0.5} ${r * 0.4} V${-r * 0.4} L0 ${r * 0.1} L${r * 0.5} ${-r * 0.4} V${r * 0.4}" fill="none" stroke="#fff" stroke-width="${r * 0.18}" stroke-linecap="round" stroke-linejoin="round"/>`;
// entrée de métro sur la rue : arche + escalier + panneau ; ≈ 260 de large
export const metroEntrance = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(150)}<path d="M-130 0 V-150 Q-130 -230 0 -230 Q130 -230 130 -150 V0Z" ${O('#e8c898', 6)}/><path d="M-96 0 V-140 Q-96 -190 0 -190 Q96 -190 96 -140 V0Z" fill="#2b1e1a" stroke="${INK}" stroke-width="5"/>
  ${[0, 1, 2, 3].map((i) => `<path d="M${-86 + i * 14} ${-20 - i * 14} H${86 - i * 14}" stroke="#7a6a8a" stroke-width="8" stroke-linecap="round"/>`).join('')}<g transform="translate(0 -282)"><path d="M0 40 V0" stroke="${INK}" stroke-width="8"/>${metroM(44)}</g>${hl(-80, -212, 30, -40, 0.4)}</g>`;
// quai de métro (plein monde) : voûte, carrelage, rails ; o.w
export const metroBg = (o = {}) => {
  const w = o.w ?? WORLD;
  return `<rect width="${w}" height="${H}" fill="#6a6f9a"/>${Array.from({ length: Math.ceil(w / 90) }, (_, i) => Array.from({ length: 6 }, (_, k) => `<rect x="${i * 90 + 3}" y="${k * 60 + 3}" width="84" height="54" rx="6" fill="${(i + k) % 2 ? '#e6ecf5' : '#f6f9ff'}" stroke="#aab4cc" stroke-width="2.5"/>`).join('')).join('')}
  <rect width="${w}" height="46" fill="#3f6fc0" stroke="${INK}" stroke-width="5"/>${Array.from({ length: Math.ceil(w / 320) }, (_, i) => `<g transform="translate(${160 + i * 320} 23)"><g transform="scale(.46)">${metroM(40)}</g></g><rect x="${i * 320 + 280}" y="70" width="12" height="${GROUND - 70}" fill="#aab4cc" stroke="${INK}" stroke-width="4"/>`).join('')}
  <rect y="${GROUND - 70}" width="${w}" height="70" fill="#2b2a44"/><path d="M0 ${GROUND - 40} H${w} M0 ${GROUND - 26} H${w}" stroke="#aab4cc" stroke-width="5"/>
  <rect y="${GROUND}" width="${w}" height="${H - GROUND}" fill="#cfc8b8"/><rect y="${GROUND}" width="${w}" height="14" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>${Array.from({ length: Math.ceil(w / 120) }, (_, i) => `<path d="M${i * 120} ${GROUND + 14} l-30 ${H - GROUND}" stroke="#b5ad9b" stroke-width="4"/>`).join('')}`;
};

// ═════════════════════ marché, fontaine, parc ═════════════════════

// étal de marché à auvent rayé ; (0,0) = centre bas ; largeur ≈ 320 ; o.kind = 'apples' | 'flowers' | 'oranges' ; o.col = couleur de l'auvent
export const marketStall = (x = 0, y = 0, s = 1, o = {}) => {
  const { kind = 'apples', col = '#5fb7f2' } = o;
  const goods = Array.from({ length: 9 }, (_, i) => {
    const cx = i > 4 ? -81 + (i - 5) * 54 : -108 + i * 54, cy = i > 4 ? -92 : -66;
    if (kind === 'flowers') return `<circle cx="${cx}" cy="${cy - 14}" r="13" ${O(['#ff6f95', '#ffd23f', '#c78bf0'][i % 3], 3.5)}/><circle cx="${cx}" cy="${cy - 14}" r="4" fill="#fff"/><path d="M${cx} ${cy} V${cy + 24}" stroke="#4fae55" stroke-width="4" stroke-linecap="round"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="19" ${O(kind === 'oranges' ? '#ff9f1c' : i % 2 ? '#e8434e' : '#6fcf5a', 3.5)}/><circle cx="${cx - 6}" cy="${cy - 7}" r="5" fill="#fff" opacity=".55"/><path d="M${cx} ${cy - 18} q4 -8 10 -8" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(180)}<rect x="-150" y="-250" width="12" height="250" ${O('#a8683a', 4)}/><rect x="138" y="-250" width="12" height="250" ${O('#a8683a', 4)}/>
  <rect x="-140" y="-110" width="280" height="110" rx="8" ${O('#c99a52', 5)}/><rect x="-128" y="-128" width="256" height="30" rx="8" ${O('#a8683a', 4)}/>${goods}
  ${Array.from({ length: 6 }, (_, i) => `<path d="M${-168 + i * 56} -290 h56 l-10 64 h-56Z" ${O(i % 2 ? '#fff4dc' : col, 4)}/>`).join('')}<path d="M-168 -290 L-146 -318 H146 L168 -290Z" ${O(col, 5)}/>${hl(-90, -304, 40, 0, 0.4)}</g>`;
};
// fontaine ronde à deux vasques ; (0,0) = centre bas ; largeur ≈ 340, hauteur ≈ 300 ; o.jet = false pour l'éteindre
export const fountain = (x = 0, y = 0, s = 1, o = {}) => {
  const jet = o.jet !== false;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(190)}
  <path d="M-170 0 V-40 Q0 -64 170 -40 V0Q0 22 -170 0Z" ${O('#e6e2ee', 6)}/><ellipse cy="-42" rx="170" ry="30" ${O('#d8d4e0', 6)}/><ellipse cy="-44" rx="150" ry="22" fill="#6fc3ff"/><ellipse cx="-40" cy="-48" rx="60" ry="6" fill="#fff" opacity=".5"/>
  <rect x="-18" y="-190" width="36" height="150" rx="10" ${O('#d8d4e0', 5)}/><path d="M-84 -176 Q0 -150 84 -176 Q70 -130 0 -126 Q-70 -130 -84 -176Z" ${O('#e6e2ee', 5)}/><ellipse cy="-178" rx="84" ry="12" fill="#6fc3ff" stroke="${INK}" stroke-width="4"/>
  <rect x="-10" y="-250" width="20" height="74" rx="8" ${O('#d8d4e0', 4.5)}/>
  ${jet ? `<g transform="translate(0 -250)"><g style="transform-origin:0px 0px;animation:vjet .9s ease-in-out infinite"><path d="M0 0 Q-6 -50 0 -80 Q6 -50 0 0Z" fill="#9adfff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>${[-1, 1].map((k, i) => `<g style="--dx:${k * 60}px;${an({ n: 'vdrop', d: 1.1, t: i * 0.3, c: 999 })}"><path d="M${k * 6} -60 q${k * 20} -30 ${k * 50} 6" stroke="#9adfff" stroke-width="7" fill="none" stroke-linecap="round"/></g>`).join('')}</g>` : ''}
  ${hl(-110, -62, 30, -4, 0.55)}</g>`;
};
// banc ; (0,0) = centre bas ; largeur ≈ 240
export const bench = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(130)}<rect x="-110" y="-44" width="14" height="46" rx="4" ${O('#6a6f80', 4)}/><rect x="96" y="-44" width="14" height="46" rx="4" ${O('#6a6f80', 4)}/>
  <rect x="-124" y="-62" width="248" height="22" rx="8" ${O('#c9874a', 5)}/><rect x="-124" y="-130" width="248" height="22" rx="8" ${O('#c9874a', 5)}/><rect x="-124" y="-100" width="248" height="22" rx="8" ${O('#c9874a', 5)}/>${hl(-70, -124, 40, 0, 0.4)}</g>`;
// arbre rond ; (0,0) = pied ; hauteur ≈ 300 ; o.col
export const tree = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(70)}<rect x="-18" y="-130" width="36" height="132" rx="10" ${O('#9b6a3c', 5)}/><circle cx="0" cy="-196" r="86" ${O(o.col || '#3fae55', 6)}/><circle cx="-54" cy="-150" r="46" ${O(o.col || '#3fae55', 5)}/><circle cx="56" cy="-156" r="44" ${O(o.col || '#3fae55', 5)}/><circle cx="-26" cy="-230" r="22" fill="#fff" opacity=".28"/><circle cx="-12" cy="-150" r="6" fill="#e8434e" stroke="${INK}" stroke-width="2.5"/><circle cx="30" cy="-210" r="6" fill="#e8434e" stroke="${INK}" stroke-width="2.5"/></g>`;
// petit canard (regarde à droite) ; (0,0) = centre bas
export const duck = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="2" rx="40" ry="8" fill="#000" opacity=".15"/><ellipse cx="-4" cy="-24" rx="38" ry="26" ${O('#ffe27a', 4)}/><path d="M-36 -34 q-14 -6 -18 6 q10 8 20 4Z" ${O('#ffe27a', 3.5)}/><circle cx="24" cy="-52" r="20" ${O('#ffe27a', 4)}/><path d="M42 -50 l16 4 l-16 8Z" ${O('#ff9f1c', 3.5)}/><circle cx="28" cy="-58" r="4" fill="${INK}"/><circle cx="29" cy="-59" r="1.3" fill="#fff"/><ellipse cx="22" cy="-44" rx="5" ry="3" fill="#ff8fa3" opacity=".7"/><ellipse cx="-8" cy="-22" rx="16" ry="10" fill="#f0c93a" stroke="${INK}" stroke-width="3"/></g>`;

// ═════════════════════ musée ═════════════════════

// tableau encadré ; (0,0) = centre ; 150 × 120 ; o.kind = 'landscape' | 'sun' | 'stripes' | 'portrait'
export const frame = (x = 0, y = 0, s = 1, o = {}) => {
  const k = o.kind || 'landscape';
  const art = { landscape: `<rect x="-62" y="-48" width="124" height="96" fill="#bfe6ff"/><path d="M-62 48 V8 Q-30 -22 0 8 Q30 -14 62 6 V48Z" fill="#7fcf6a"/><circle cx="30" cy="-24" r="12" fill="#ffd23f"/>`,
    sun: `<rect x="-62" y="-48" width="124" height="96" fill="#ffb07a"/><circle cx="0" cy="12" r="30" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M-62 30 H62 V48 H-62Z" fill="#c45a6a"/>`,
    stripes: `<rect x="-62" y="-48" width="124" height="96" fill="#fff"/>${[-50, -30, -10, 10, 30, 50].map((cx) => `<rect x="${cx - 7}" y="-48" width="14" height="96" fill="${INK}"/>`).join('')}`,
    portrait: `<rect x="-62" y="-48" width="124" height="96" fill="#d9c6f0"/><circle cx="0" cy="-8" r="26" fill="#ffd9b8" stroke="${INK}" stroke-width="3"/><path d="M-40 48 Q0 8 40 48Z" fill="#e8434e"/><circle cx="-9" cy="-12" r="3" fill="${INK}"/><circle cx="9" cy="-12" r="3" fill="${INK}"/>` }[k];
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-76" y="-62" width="152" height="124" rx="6" ${O('#e0a43a', 6)}/><rect x="-62" y="-48" width="124" height="96" fill="#fff"/>${art}<rect x="-62" y="-48" width="124" height="96" fill="none" stroke="${INK}" stroke-width="3.5"/>${hl(-30, -34, 20, -20, 0.5)}</g>`;
};
// piédestal de statue ; (0,0) = centre bas ; 150 de large, 110 de haut
export const plinth = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(100)}<rect x="-76" y="-18" width="152" height="20" rx="6" ${O('#d8d4e0', 5)}/><rect x="-62" y="-104" width="124" height="90" rx="6" ${O('#f0ece6', 5)}/><rect x="-72" y="-120" width="144" height="20" rx="6" ${O('#d8d4e0', 5)}/>${hl(-30, -80, 20, -70, 0.5)}</g>`;
// poteau à cordon rouge ; (0,0) = pied
export const ropeStand = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="2" rx="26" ry="7" ${O('#e0a43a', 4)}/><rect x="-5" y="-84" width="10" height="84" fill="#e0a43a" stroke="${INK}" stroke-width="3.5"/><circle cy="-90" r="10" ${O('#e0a43a', 4)}/><path d="M10 -84 Q70 -50 130 -84" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M10 -84 Q70 -50 130 -84" fill="none" stroke="#e8434e" stroke-width="5" stroke-linecap="round"/></g>`;
// façade du musée : fronton à colonnes ; largeur ≈ 480, hauteur ≈ 380
export const museumFront = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(280)}<rect x="-250" y="-28" width="500" height="28" rx="6" ${O('#d8d4e0', 5)}/><rect x="-230" y="-56" width="460" height="28" rx="6" ${O('#e6e2ee', 5)}/>
  <rect x="-214" y="-290" width="428" height="236" ${O('#f0ece6', 6)}/>${[-170, -60, 50, 160].map((cx) => `<rect x="${cx - 22}" y="-270" width="44" height="214" rx="8" ${O('#fff', 5)}/><path d="M${cx - 8} -260 V-66" stroke="#d8d4e0" stroke-width="4" stroke-linecap="round"/>`).join('')}
  <path d="M-240 -290 L0 -392 L240 -290Z" ${O('#e6e2ee', 6)}/><circle cy="-322" r="22" ${O('#ffd23f', 4)}/>${hl(-120, -350, 40, -24, 0.4)}<rect x="-30" y="-130" width="60" height="76" rx="6" fill="#4a3a3a" stroke="${INK}" stroke-width="4"/></g>`;
// salle du musée : mur crème, plinthe, parquet, 3 cadres ; o.w
export const museumInside = (o = {}) => {
  const w = o.w ?? WORLD;
  const kinds = ['landscape', 'sun', 'portrait', 'stripes'];
  return `<rect width="${w}" height="${H}" fill="#f4e4c8"/><rect y="0" width="${w}" height="40" fill="#a8683a" stroke="${INK}" stroke-width="5"/>${Array.from({ length: Math.ceil(w / 160) }, (_, i) => `<rect x="${i * 160 + 6}" y="${GROUND - 120}" width="148" height="110" rx="6" fill="#ecd7b0" stroke="#d3b98a" stroke-width="3"/>`).join('')}
  <rect y="${GROUND - 8}" width="${w}" height="${H - GROUND + 8}" fill="#c9874a"/><rect y="${GROUND - 8}" width="${w}" height="14" fill="#a8683a" stroke="${INK}" stroke-width="4"/>${Array.from({ length: Math.ceil(w / 120) }, (_, i) => `<path d="M${i * 120} ${GROUND + 6} l-30 ${H - GROUND}" stroke="#a8683a" stroke-width="4"/>`).join('')}
  ${Array.from({ length: Math.floor(w / 380) }, (_, i) => frame(190 + i * 380, 230, 1.5, { kind: kinds[i % 4] })).join('')}`;
};

// ═════════════════════ chantier ═════════════════════

// cône de chantier ; (0,0) = centre bas ; hauteur ≈ 90
export const cone = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-38" y="-10" width="76" height="14" rx="5" ${O('#ff8a2b', 4)}/><path d="M-26 -10 L-10 -88 H10 L26 -10Z" ${O('#ff8a2b', 4.5)}/><path d="M-20 -42 H20 L16 -62 H-16Z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-6 -80 l-4 14" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></g>`;
// barrière rayée ; (0,0) = centre bas ; largeur ≈ 240
export const barrier = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(130)}<rect x="-100" y="-80" width="10" height="80" ${O('#6a6f80', 3.5)}/><rect x="90" y="-80" width="10" height="80" ${O('#6a6f80', 3.5)}/><rect x="-120" y="-118" width="240" height="44" rx="8" ${O('#fff', 5)}/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-104 + i * 40} -76 l22 0 l18 -40 h-22Z" fill="#e8434e" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`).join('')}<rect x="-120" y="-118" width="240" height="44" rx="8" fill="none" stroke="${INK}" stroke-width="5"/>${hl(-80, -108, 30, 0, 0.5)}</g>`;
// trou de chantier ; (0,0) = centre du bord haut ; largeur ≈ 280
export const hole = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="150" ry="34" ${O('#6a4a30', 5)}/><ellipse cy="6" rx="124" ry="22" fill="#3a2a20"/><ellipse cx="-30" cy="8" rx="40" ry="6" fill="#fff" opacity=".12"/>${[-130, 128].map((cx, i) => `<ellipse cx="${cx}" cy="${-2}" rx="${16 + i * 4}" ry="9" fill="#c9a572" stroke="${INK}" stroke-width="3.5"/>`).join('')}</g>`;
// casque de chantier jaune ; (0,0) = centre bas ; 90 de large
export const hardHat = (x = 0, y = 0, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-44 0 Q-46 -56 0 -58 Q46 -56 44 0Z" ${O('#ffd23f', 5)}/><rect x="-54" y="-8" width="108" height="14" rx="7" ${O('#f0b400', 4.5)}/><path d="M0 -58 V-8" stroke="#f0b400" stroke-width="9" stroke-linecap="round"/><path d="M0 -58 V-8" stroke="${INK}" stroke-width="3" opacity=".4"/><ellipse cx="-24" cy="-38" rx="12" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 -24 -38)"/></g>`;
// grue de chantier jaune ; (0,0) = pied ; hauteur ≈ 540 ; flèche vers la droite ; o.sway = true : la flèche se balance
export const crane = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(110)}<rect x="-70" y="-30" width="140" height="30" rx="6" ${O('#6a6f80', 5)}/>
  <rect x="-24" y="-420" width="48" height="394" ${O('#ffd23f', 5)}/>${Array.from({ length: 8 }, (_, i) => `<path d="M-24 ${-30 - i * 49} L24 ${-79 - i * 49} M24 ${-30 - i * 49} L-24 ${-79 - i * 49}" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`).join('')}
  <g style="transform-origin:0px -430px;${o.sway ? 'animation:c6sway 3s ease-in-out infinite alternate' : ''}"><rect x="-160" y="-452" width="460" height="30" rx="8" ${O('#ffd23f', 5)}/><rect x="-190" y="-446" width="40" height="40" rx="6" ${O('#6a6f80', 4.5)}/><rect x="-24" y="-480" width="48" height="40" rx="8" ${O('#e8434e', 5)}/>
  <path d="M250 -422 V-300" stroke="${INK}" stroke-width="5"/><g transform="translate(250 -296)"><path d="M0 0 V10 q-14 6 -14 18 q14 6 28 0 q0 -12 -14 -18" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><rect x="-26" y="26" width="52" height="30" rx="6" ${O('#c9874a', 4)}/></g></g></g>`;

// ═════════════════════ soir : lampadaires, feux d'artifice, fenêtre ═════════════════════

// lampadaire ; (0,0) = pied ; hauteur ≈ 400 ; o.on = temps d'allumage (0 ou absent = allumé, false = éteint, > 0 = s'allume à ce temps avec un petit clignotement)
export const streetLamp = (x = 0, y = 0, s = 1, o = {}) => {
  const on = o.on === undefined ? 0 : o.on;
  const lit = on === false ? '' : (on > 0 ? `<g style="${an({ n: 'vlampon', d: 0.25, t: on, f: 'both' })}">` : '<g>') + `<g style="transform-origin:0px 0px;animation:vglow 1.6s ease-in-out infinite alternate"><ellipse cx="0" cy="40" rx="130" ry="170" fill="#ffe27a" opacity=".22"/><ellipse cx="0" cy="40" rx="76" ry="100" fill="#fff3b0" opacity=".3"/></g><rect x="-20" y="-24" width="40" height="46" rx="12" fill="#fff6c8"/><ellipse cy="0" rx="9" ry="14" fill="#ffb300"/></g>`;
  const glass = `<rect x="-24" y="-30" width="48" height="56" rx="14" ${O(on === false || on > 0 ? '#e6e2ee' : '#fff6c8', 5)}/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(50)}<path d="M-26 0 L-14 -40 H14 L26 0Z" ${O('#3a4a5a', 5)}/><rect x="-8" y="-380" width="16" height="344" rx="6" ${O('#4a5a6a', 4.5)}/><path d="M0 -380 Q0 -420 30 -420" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M0 -380 Q0 -420 30 -420" stroke="#4a5a6a" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g transform="translate(34 -392)"><path d="M-26 -34 H26 L14 -48 H-14Z" ${O('#4a5a6a', 4)}/>${glass}<g transform="translate(0 -2)">${lit}</g><path d="M-20 28 H20" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>
  <path d="M0 -300 L22 -280" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M22 -280 q10 20 4 44" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="26" cy="-232" r="5" ${O('#e8434e', 2.5)}/></g>`;
};
// rangée de lampadaires qui s'allument en vague : de x0 à x1, n lampadaires, premier allumé à t0, un autre toutes les dt secondes
export const lampRow = (x0, x1, n, t0, dt = 0.35, y = GROUND + 30, s = 0.85) => Array.from({ length: n }, (_, i) => streetLamp(x0 + ((x1 - x0) * i) / Math.max(1, n - 1), y, s, { on: t0 + i * dt })).join('');
// feu d'artifice : explosion à t0 en (x,y) ; o.col, o.col2, o.r, o.shape = 'round' (étoile) | 'croissant' (en forme de croissant)
export const fireworkBurst = (x, y, t0, o = {}) => {
  const col = o.col || '#ffd23f', col2 = o.col2 || '#ff6f95', r = o.r || 110, rs = o.rise || 220;
  const body = o.shape === 'croissant'
    ? `<path d="M${-r} ${r * 0.35} Q${-r * 0.9} ${-r * 0.8} 0 ${-r * 0.8} Q${r * 0.9} ${-r * 0.8} ${r} ${r * 0.35} Q${r * 0.55} ${-r * 0.05} ${r * 0.28} ${-r * 0.12} Q0 ${r * 0.12} ${-r * 0.28} ${-r * 0.12} Q${-r * 0.55} ${-r * 0.05} ${-r} ${r * 0.35}Z" fill="${col}" stroke="${col2}" stroke-width="10" stroke-linejoin="round"/><path d="M${-r * 0.4} ${-r * 0.5} Q0 ${-r * 0.62} ${r * 0.4} ${-r * 0.5}" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>${Array.from({ length: 8 }, (_, i) => `<circle cx="${(Math.cos(i * 0.785) * r * 1.15).toFixed(0)}" cy="${(Math.sin(i * 0.785) * r * 1.0).toFixed(0)}" r="6" fill="${i % 2 ? col : col2}"/>`).join('')}`
    : Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${(Math.cos(a) * r * 0.45).toFixed(1)} ${(Math.sin(a) * r * 0.45).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}" stroke="${i % 2 ? col : col2}" stroke-width="9" stroke-linecap="round"/><circle cx="${(Math.cos(a) * r * 1.12).toFixed(1)}" cy="${(Math.sin(a) * r * 1.12).toFixed(1)}" r="6" fill="${i % 2 ? col2 : col}"/>`; }).join('') + `<circle r="14" fill="#fff"/>`;
  return `<g transform="translate(${x} ${y})"><g style="--dy:${rs}px;${an({ n: 'vrise', d: 0.6, t: Math.max(0, t0 - 0.6), f: 'both', e: 'ease-out' })}"><path d="M0 0 V28" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>
  <g style="transform-origin:0px 0px;${an({ n: 'vburst', d: 1.6, t: t0, f: 'both', e: 'ease-out' })}">${body}</g></g>`;
};
// fenêtre à balcon (celle de Mamie Marmotte) ; (0,0) = bas du balcon, centre ; ≈ 200 × 300 ; o.lit = lumière chaude derrière le rideau
export const windowBalcony = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-100" y="-300" width="200" height="260" rx="8" ${O('#ffcf6b', 6)}/><rect x="-66" y="-268" width="132" height="190" rx="10" ${O('#fff4dc', 5)}/><rect x="-54" y="-256" width="108" height="166" rx="6" fill="${o.lit === false ? '#3a4478' : '#ffe9a0'}"/>
  <path d="M-54 -256 q16 50 0 166 M54 -256 q-16 50 0 166" fill="#ff8fb1" stroke="${INK}" stroke-width="4" opacity=".95"/><path d="M0 -256 V-90" stroke="#fff4dc" stroke-width="5"/>${hl(-30, -240, 22, -10, 0.55)}
  <rect x="-120" y="-60" width="240" height="22" rx="8" ${O('#fff4dc', 5)}/><rect x="-120" y="-40" width="240" height="40" rx="6" ${O('#e8c898', 5)}/>${Array.from({ length: 8 }, (_, i) => `<path d="M${-104 + i * 30} -40 V0" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('')}
  <circle cx="-80" cy="-72" r="12" ${O('#ff6f95', 3.5)}/><circle cx="-46" cy="-68" r="10" ${O('#ffd23f', 3.5)}/><circle cx="76" cy="-72" r="12" ${O('#c78bf0', 3.5)}/></g>`;
