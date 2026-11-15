// Saison 5 : décor du spectacle (salle des fêtes, scène, rideaux, projecteurs, coulisses, costumes, décors peints, public…).
// Convention : fonctions qui renvoient une chaîne SVG. Objets autour de (0,0) = point au sol (centre bas) ; fonds = plein écran 1280x720.
// Les animaux regardent à droite. Préfixe de keyframes : t5…
import { W, H, INK, an, ao, anims, vis, tf, cloud } from './kit.mjs';
import { addKF } from './kit.mjs';
import { wallClock } from './classroom.mjs';

// repères
export const FLOOR = 560;                                 // sol de la salle des fêtes (hall, coulisses)
export const STAGE = { floor: 430, edge: 650, mid: 560 }; // scène vue de la salle : haut du plancher, bord avant ; mid = bon y pour poser les personnages (≈ 520–640)

addKF(`@keyframes t5beam{from{opacity:.16}to{opacity:.3}}
@keyframes t5burst{0%{opacity:0;transform:scale(.1)}12%{opacity:1}70%{opacity:1}100%{opacity:0;transform:scale(1)}}
@keyframes t5rocket{0%{opacity:0;transform:translateY(0)}10%{opacity:1}100%{opacity:0;transform:translateY(var(--dy))}}
@keyframes t5conf{0%{opacity:0;transform:translate(0,-30px) rotate(0)}8%{opacity:1}100%{opacity:1;transform:translate(var(--dx),760px) rotate(540deg)}}
@keyframes t5bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes t5clap{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-10px) rotate(-3deg)}75%{transform:translateY(-6px) rotate(3deg)}}
@keyframes t5hand{0%,100%{transform:translateX(-5px)}50%{transform:translateX(5px)}}
@keyframes t5stand{from{transform:translateY(0)}to{transform:translateY(-44px)}}
@keyframes t5fly{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-12px)}50%{transform:translate(-6px,-20px)}75%{transform:translate(-12px,-6px)}}
@keyframes t5glow{0%,100%{opacity:.35}50%{opacity:.95}}
@keyframes t5echo{0%{opacity:0;transform:scale(.3)}15%{opacity:.95}100%{opacity:0;transform:scale(1.7)}}
@keyframes t5swing{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes t5fall{0%{transform:translateY(0) rotate(0)}70%{transform:translateY(var(--dy)) rotate(6deg)}82%{transform:translateY(calc(var(--dy) - 26px)) rotate(-4deg)}100%{transform:translateY(var(--dy)) rotate(0)}}
@keyframes t5accord{0%{transform:scale(1,1)}22%{transform:scale(1.03,.94)}50%{transform:scale(1.2,.34)}66%{transform:scale(.94,.52)}80%{transform:scale(1.08,.4)}100%{transform:scale(1.1,.44)}}
@keyframes t5splat{0%{opacity:0;transform:scale(.1)}30%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes t5flick{0%,100%{opacity:1}47%{opacity:1}50%{opacity:.35}53%{opacity:1}}`);

const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const wins = (list, inner) => list.map(([a, b]) => vis(a, b, inner)).join('');
let uid = 0;

// ═════════════════════ la salle des fêtes (fond) ═════════════════════
// o.h, o.m = heure de l'horloge (défaut 8h00) · o.clock = false pour la retirer · o.night = fenêtres sombres · o.bunting = fanions (défaut true) · o.seats = rangées de fauteuils au premier plan
export const hall = (o = {}) => {
  const { h = 8, m = 0, clock = true, night = false, bunting = true, seats = false } = o;
  const win = (x) => `<g transform="translate(${x} 70)"><path d="M-54 280 V70 Q-54 -10 0 -10 Q54 -10 54 70 V280Z" ${O('#fff4dc', 6)}/><path d="M-42 270 V70 Q-42 4 0 4 Q42 4 42 70 V270Z" ${O(night ? '#1d2766' : '#bfe6ff', 4)}/>
    ${night ? `<path d="M-14 60 l4 8 8 3 -8 3 -4 8 -4 -8 -8 -3 8 -3Z M16 120 l3 6 6 2 -6 2 -3 6 -3 -6 -6 -2 6 -2Z" fill="#fff6c8"/>` : `<path d="M-30 60 Q-20 30 -4 24" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>`}
    <path d="M0 4 V270 M-42 130 H42" stroke="#fff4dc" stroke-width="6"/></g>`;
  const flags = ['#ff8fb1', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff', '#ffb36b'];
  return `<rect width="${W}" height="${H}" fill="#f3dfb8"/>
  <rect y="${FLOOR - 190}" width="${W}" height="190" fill="#b98350"/><path d="M0 ${FLOOR - 190} H${W}" stroke="${INK}" stroke-width="6"/>
  ${Array.from({ length: 16 }, (_, i) => `<path d="M${i * 84 + 30} ${FLOOR - 186} V${FLOOR - 6}" stroke="#a06f3f" stroke-width="5"/>`).join('')}
  <rect y="${FLOOR - 14}" width="${W}" height="16" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>
  ${[150, 400, 880, 1130].map(win).join('')}
  ${[640].map((x) => `<g transform="translate(${x} 140)"><path d="M-6 -140 V-40" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-40" width="120" height="14" rx="7" ${O('#c9a24a', 4)}/>${[-48, -16, 16, 48].map((k) => `<path d="M${k} -26 V-8" stroke="${INK}" stroke-width="4"/><circle cx="${k}" cy="-4" r="9" fill="#fff6c8" stroke="${INK}" stroke-width="3.5"/>`).join('')}</g>`).join('')}
  ${clock ? wallClock(h, m, 640, 92) : ''}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#d6a566"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 96 + 20} ${FLOOR} L${i * 120 - 120} ${H}" stroke="#bf8a4e" stroke-width="5"/>`).join('')}<path d="M0 ${FLOOR} H${W}" stroke="${INK}" stroke-width="5"/><path d="M0 ${FLOOR + 80} H${W} M0 ${FLOOR + 130} H${W}" stroke="#bf8a4e" stroke-width="4" opacity=".6"/>
  ${bunting ? garland(0, 40, W, 40, 14, flags) : ''}${seats ? seatRows({ y: H + 10, rows: 1, n: 7, s: 1.5 }) : ''}`;
};

// guirlande de fanions : de (x0,y0) à (x1,y1), affaissée de `sag` px
export const garland = (x0 = 0, y0 = 40, x1 = W, y1 = 40, sag = 24, cols = ['#ff8fb1', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff', '#ff9f43']) => {
  const N = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) / 62));
  const P = (u) => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + Math.sin(Math.PI * u) * sag];
  let fl = '';
  for (let i = 0; i < N; i++) { const [x, y] = P((i + 0.5) / N); fl += `<path d="M${(x - 20).toFixed(0)} ${(y - 2).toFixed(0)} L${(x + 20).toFixed(0)} ${(y - 2).toFixed(0)} L${x.toFixed(0)} ${(y + 42).toFixed(0)}Z" ${O(cols[i % cols.length], 3.5)}/>`; }
  let d = `M${x0} ${y0}`; for (let i = 1; i <= 20; i++) { const [x, y] = P(i / 20); d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
  return `<path d="${d}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>${fl}`;
};

// guirlande d'ampoules (rangée de petites lampes qui scintillent)
export const bulbs = (x0 = 100, x1 = 1180, y = 60, sag = 20, n = 14) => {
  let d = `M${x0} ${y}`; for (let i = 1; i <= 20; i++) { const u = i / 20; d += ` L${(x0 + (x1 - x0) * u).toFixed(0)} ${(y + Math.sin(Math.PI * u) * sag).toFixed(0)}`; }
  return `<path d="${d}" stroke="${INK}" stroke-width="5" fill="none"/>${Array.from({ length: n }, (_, i) => { const u = (i + 0.5) / n; return `<circle cx="${(x0 + (x1 - x0) * u).toFixed(0)}" cy="${(y + Math.sin(Math.PI * u) * sag + 12).toFixed(0)}" r="9" fill="${['#ffd23f', '#ff8fb1', '#9be08a', '#7cc8ff'][i % 4]}" stroke="${INK}" stroke-width="3.5" style="animation:t5flick ${1.4 + (i % 4) * 0.3}s ${(i % 5) * 0.2}s infinite"/>`; }).join('')}`;
};

// porte du fond (porte à deux battants + panneau SORTIE) : (0,0) = centre bas, largeur ≈ 190, hauteur ≈ 320 · o.open = temps d'ouverture (ou true)
export const backDoor = (x = 0, y = 0, s = 1, o = {}) => {
  const leaf = (k) => {
    const body = `<rect x="${k > 0 ? 0 : -80}" y="-250" width="80" height="250" ${O('#8a5a33', 5)}/><rect x="${k > 0 ? 12 : -68}" y="-232" width="56" height="86" rx="6" fill="#a8743f" stroke="${INK}" stroke-width="3.5"/><rect x="${k > 0 ? 12 : -68}" y="-130" width="56" height="86" rx="6" fill="#a8743f" stroke="${INK}" stroke-width="3.5"/><circle cx="${k > 0 ? 14 : -14}" cy="-124" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>`;
    if (o.open === undefined) return body;
    return tf(body, { t0: o.open === true ? 0 : o.open, d: o.open === true ? 0.01 : 0.6, from: 'scaleX(1)', to: 'scaleX(.12)', e: 'ease-out', o: `${k * 80}px 0px` });
  };
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-96" y="-268" width="192" height="270" rx="10" ${O('#e8d3a8', 6)}/><rect x="-80" y="-250" width="160" height="250" fill="#ffe9a8"/>${leaf(-1)}${leaf(1)}
  <rect x="-44" y="-318" width="88" height="34" rx="8" ${O('#2fae66', 5)}/><path d="M-30 -301 h18 M-6 -301 h10 M12 -301 h16" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M-80 -250 h160" stroke="${INK}" stroke-width="4"/></g>`;
};

// ═════════════════════ la scène (fond vu de la salle) ═════════════════════
// o.backdrop = svg du décor peint (voir backdrop()) · o.frame = false pour retirer l'arche · rideaux : voir curtains()
export const stage = (o = {}) => {
  const { backdrop = backdropPlain(), frame = true } = o;
  const boards = Array.from({ length: 12 }, (_, i) => `<path d="M${W / 2 + (i - 5.5) * 36} ${STAGE.floor} L${W / 2 + (i - 5.5) * 170} ${STAGE.edge}" stroke="#a8743f" stroke-width="4" opacity=".8"/>`).join('');
  return `<rect width="${W}" height="${H}" fill="#241a3a"/>
  <g>${backdrop}</g>
  <path d="M0 ${STAGE.floor} H${W} V${STAGE.edge} H0Z" fill="#d6a566"/>${boards}<path d="M0 ${STAGE.floor} H${W}" stroke="${INK}" stroke-width="5"/><path d="M0 ${STAGE.floor + 60} H${W} M0 ${STAGE.floor + 130} H${W}" stroke="#bf8a4e" stroke-width="4" opacity=".7"/>
  <rect y="${STAGE.edge}" width="${W}" height="${H - STAGE.edge}" fill="#7a4a2a" stroke="${INK}" stroke-width="6"/><rect y="${STAGE.edge}" width="${W}" height="14" fill="#9b6a3c"/>
  ${Array.from({ length: 11 }, (_, i) => `<g transform="translate(${70 + i * 114} ${STAGE.edge + 36})"><path d="M-14 10 h28 v-12 q0 -18 -14 -18 q-14 0 -14 18Z" ${O('#8a8a9a', 3.5)}/><circle cy="-14" r="9" fill="#fff3a6" stroke="${INK}" stroke-width="3"/></g>`).join('')}
  ${frame ? `<rect x="0" y="0" width="${W}" height="64" fill="#8a1f2e" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 100 - 4} 64 q50 46 100 0Z" ${O('#a82a3c', 4)}/>`).join('')}<rect y="56" width="${W}" height="10" fill="#e8c14d" stroke="${INK}" stroke-width="4"/>
  ${[0, 1].map((k) => `<rect x="${k ? W - 44 : -4}" y="0" width="48" height="${STAGE.edge}" fill="#8a1f2e" stroke="${INK}" stroke-width="6"/><rect x="${k ? W - 30 : 8}" y="70" width="10" height="${STAGE.edge - 80}" rx="5" fill="#e8c14d" opacity=".7"/>`).join('')}` : ''}`;
};

// décors peints pour le fond de scène : 'plain' | 'night' | 'day' | 'forest'
const backdropPlain = () => `<rect width="${W}" height="${STAGE.floor + 10}" fill="#f1e2bd"/><path d="M0 ${STAGE.floor - 40} H${W}" stroke="#d8c293" stroke-width="6"/>`;
export const backdrop = (kind = 'night') => {
  const ground = (c1, c2) => `<path d="M0 ${STAGE.floor - 90} Q240 ${STAGE.floor - 190} 500 ${STAGE.floor - 100} Q780 ${STAGE.floor - 30} ${W} ${STAGE.floor - 130} V${STAGE.floor + 10} H0Z" ${O(c1, 5)}/><path d="M0 ${STAGE.floor - 40} Q320 ${STAGE.floor - 110} 700 ${STAGE.floor - 50} Q1000 ${STAGE.floor - 20} ${W} ${STAGE.floor - 60} V${STAGE.floor + 10} H0Z" ${O(c2, 5)}/>`;
  if (kind === 'plain') return backdropPlain();
  if (kind === 'night') {
    const bands = ['#10163f', '#161e52', '#1d2766', '#27327c'].map((c, i) => `<rect y="${(i * STAGE.floor) / 4}" width="${W}" height="${STAGE.floor / 4 + 2}" fill="${c}"/>`).join('');
    const stars = Array.from({ length: 22 }, (_, i) => { const x = 90 + rnd(i) * 1100, y = 80 + rnd(i + 40) * 250, r = 8 + rnd(i + 9) * 10; return `<path d="M${x.toFixed(0)} ${(y - r).toFixed(0)} L${(x + r * 0.3).toFixed(0)} ${(y - r * 0.3).toFixed(0)} L${(x + r).toFixed(0)} ${y.toFixed(0)} L${(x + r * 0.3).toFixed(0)} ${(y + r * 0.3).toFixed(0)} L${x.toFixed(0)} ${(y + r).toFixed(0)} L${(x - r * 0.3).toFixed(0)} ${(y + r * 0.3).toFixed(0)} L${(x - r).toFixed(0)} ${y.toFixed(0)} L${(x - r * 0.3).toFixed(0)} ${(y - r * 0.3).toFixed(0)}Z" fill="#fff6c8" style="animation:t5flick ${1.6 + (i % 5) * 0.4}s ${(i % 7) * 0.3}s infinite"/>`; }).join('');
    return `${bands}${stars}<g transform="translate(1030 170) rotate(-20)"><path d="M0 -56 A56 56 0 1 0 0 56 A74 74 0 0 1 0 -56Z" ${O('#fff3a6', 5)}/></g>${ground('#2e4a7a', '#27406a')}`;
  }
  if (kind === 'forest') {
    const tree = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-14" y="-90" width="28" height="94" rx="8" ${O('#9b6a3c', 4)}/><circle cy="-130" r="66" ${O('#3fae55', 5)}/><circle cx="-24" cy="-150" r="18" fill="#fff" opacity=".25"/></g>`;
    return `<rect width="${W}" height="${STAGE.floor + 10}" fill="#bfe6ff"/>${ground('#7fcf6a', '#5fb85a')}${tree(160, STAGE.floor - 60, 1.3)}${tree(420, STAGE.floor - 70, 1)}${tree(900, STAGE.floor - 70, 1.1)}${tree(1130, STAGE.floor - 56, 1.4)}`;
  }
  return `<rect width="${W}" height="${STAGE.floor + 10}" fill="#9ad6ff"/><rect y="200" width="${W}" height="${STAGE.floor}" fill="#bfe6ff"/><g transform="translate(160 150)"><circle r="46" ${O('#ffd23f', 5)}/></g>${ground('#a5e08a', '#7fcf6a')}${cloud(520, 130, 0.9)}${cloud(900, 90, 0.7)}`;
};

// ═════════════════════ rideaux ═════════════════════
// rideau de scène : deux pans qui coulissent. o.start = 'closed' | 'open' (défaut 'closed') ; o.events = [[t,'open'|'close']…] ; o.dur = durée du mouvement (1.4 s)
// À poser APRÈS les personnages de la scène (devant eux), AVANT les bulles. o.col = couleur
export const curtains = (o = {}) => {
  const { start = 'closed', events = [], dur = 1.4, col = '#c9283e', colD = '#9b1c2e' } = o;
  const pan = () => `<path d="M0 0 H666 V${STAGE.edge - 6} Q640 ${STAGE.edge + 8} 600 ${STAGE.edge - 6} Q560 ${STAGE.edge + 10} 520 ${STAGE.edge - 6} Q480 ${STAGE.edge + 10} 440 ${STAGE.edge - 6} Q400 ${STAGE.edge + 10} 360 ${STAGE.edge - 6} Q320 ${STAGE.edge + 10} 280 ${STAGE.edge - 6} Q240 ${STAGE.edge + 10} 200 ${STAGE.edge - 6} Q160 ${STAGE.edge + 10} 120 ${STAGE.edge - 6} Q80 ${STAGE.edge + 10} 40 ${STAGE.edge - 6} L0 ${STAGE.edge - 6}Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 80 + 40} 70 V${STAGE.edge - 20}" stroke="${colD}" stroke-width="22" stroke-linecap="round" opacity=".55"/>`).join('')}${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 80 + 22} 90 V${STAGE.edge - 80}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".16"/>`).join('')}
    <path d="M590 ${STAGE.edge - 170} h20 v-6" stroke="#e8c14d" stroke-width="9" stroke-linecap="round" fill="none"/>`;
  const both = (sc) => `<g transform="scale(${sc} 1)">${pan()}</g><g transform="translate(${W} 0) scale(${-sc} 1)">${pan()}</g>`;
  const SC = { closed: 1, open: 0.16 };
  const evs = [...events].sort((x, y) => x[0] - y[0]);
  let cur = start, t = 0, out = '';
  for (const [te, kind] of evs) {
    const tgt = kind === 'open' ? 'open' : 'closed';
    if (te > t) out += vis(t, te, both(SC[cur]));
    const mv = (inner, a, b, side) => tf(inner, { t0: te, d: dur, from: `scaleX(${a})`, to: `scaleX(${b})`, e: 'ease-in-out', o: '0px 0px' });
    out += vis(te, te + dur, `${mv(pan(), SC[cur], SC[tgt])}<g transform="translate(${W} 0) scale(-1 1)">${mv(pan(), SC[cur], SC[tgt])}</g>`);
    cur = tgt; t = te + dur;
  }
  return out + vis(t, 999, both(SC[cur]));
};

// ═════════════════════ projecteurs ═════════════════════
// projecteur (lampe suspendue) : (0,0) = point d'accroche ; rot = degrés (0 = pointe vers le bas, positif = vers la gauche de l'écran… vers la droite si négatif)
// o.fall = temps de chute (la lampe se décroche, tombe de o.drop px et rebondit) · o.swing = true : pendule
export const lamp = (x = 0, y = 0, s = 1, rot = 0, o = {}) => {
  const body = `<path d="M0 0 V26" stroke="${INK}" stroke-width="7"/><g transform="rotate(${rot} 0 26)"><rect x="-30" y="26" width="60" height="60" rx="12" ${O('#4a4458', 5)}/><path d="M-22 46 h44 M-22 62 h44" stroke="#6a6480" stroke-width="5" stroke-linecap="round"/><path d="M-34 86 L-44 112 H44 L34 86Z" ${O('#2c2838', 5)}/><ellipse cy="112" rx="44" ry="8" fill="#fff6c8" stroke="${INK}" stroke-width="4"/></g>`;
  let inner = body;
  if (o.swing) inner = `<g style="transform-origin:0px 0px;animation:t5swing 1.1s ease-in-out infinite alternate">${inner}</g>`;
  if (o.fall !== undefined) inner = `<g style="--dy:${o.drop ?? 380}px;${an({ n: 't5fall', d: 1.2, t: o.fall, f: 'both', e: 'ease-in' })}">${inner}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
};

// faisceau de projecteur : du point (x,0)… de (x0,y0) vers l'ellipse au sol (x1,y1) de demi-largeur w ; o.on = [[a,b]] fenêtres allumées (défaut toujours) ; o.col
export const beam = (x0, y0, x1, y1, w = 120, o = {}) => {
  const col = o.col || '#fff3b0', on = o.on || [[0, 999]];
  return wins(on, `<g style="animation:t5beam 1.2s ease-in-out infinite alternate"><path d="M${x0 - 16} ${y0} L${x0 + 16} ${y0} L${x1 + w} ${y1} L${x1 - w} ${y1}Z" fill="${col}" opacity="1"/><ellipse cx="${x1}" cy="${y1}" rx="${w}" ry="${Math.round(w * 0.22)}" fill="${col}"/></g>`);
};

// pastille lumineuse au sol (pool of light) sans faisceau : ellipse blanche douce
export const pool = (x, y, rx = 130, on = [[0, 999]], col = '#fff3b0') => wins(on, `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${Math.round(rx * 0.2)}" fill="${col}" opacity=".5"/><ellipse cx="${x}" cy="${y}" rx="${rx * 0.62}" ry="${Math.round(rx * 0.12)}" fill="${col}" opacity=".6"/>`);

// ═════════════════════ la panne (obscurité) ═════════════════════
// voile sombre plein écran à poser PAR-DESSUS tout (sous les bulles) : o.on = [[a,b]] ; o.strength (.82) ; o.lights = [{x,y,r,t0}] : cercles de lumière percés dans le noir (lucioles, projecteur de poche)
export const blackout = (o = {}) => {
  const on = o.on || [[0, 999]], strength = o.strength ?? 0.82, lights = o.lights || [];
  if (!lights.length) return wins(on, `<rect width="${W}" height="${H}" fill="#070a24" opacity="${strength}"/>`);
  return on.map(([a, b]) => {
    const id = `t5m${uid++}`;
    const holes = lights.map(({ x, y, r, t0 = 0 }) => `<g style="opacity:0;${an({ n: 'cardk', d: 0.5, t: t0, f: 'both' })}"><circle cx="${x}" cy="${y}" r="${r}" fill="#000" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="#000" opacity=".7"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="#000"/></g>`).join('');
    return vis(a, b, `<mask id="${id}"><rect width="${W}" height="${H}" fill="#fff"/>${holes}</mask><rect width="${W}" height="${H}" fill="#070a24" opacity="${strength}" mask="url(#${id})"/>`);
  }).join('');
};

// luciole : (x,y) = centre ; clignote ; o.fly = true : volette
export const firefly = (x, y, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="${o.fly === false ? '' : `animation:t5fly ${2.4 + (Math.round(x) % 5) * 0.3}s ease-in-out infinite`}"><circle r="22" fill="#fff3a6" opacity=".35" style="animation:t5glow ${1 + (Math.round(y) % 4) * 0.25}s ease-in-out infinite"/><circle r="9" fill="#ffe14a" stroke="${INK}" stroke-width="3" style="animation:t5glow 1.2s ease-in-out infinite"/><ellipse cx="-9" cy="-9" rx="8" ry="4" fill="#fff" opacity=".8" transform="rotate(-30 -9 -9)"/></g></g>`;

// ═════════════════════ coulisses ═════════════════════
// fond des coulisses : mur sombre, pendrillons noirs, cordages, miroir à ampoules, caisses ; sol y = FLOOR
export const backstage = (o = {}) => `<rect width="${W}" height="${H}" fill="#3a3350"/>
  <rect y="${FLOOR - 40}" width="${W}" height="${H - FLOOR + 40}" fill="#6a4a30"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 110 + 20} ${FLOOR - 36} L${i * 140 - 100} ${H}" stroke="#573a24" stroke-width="5"/>`).join('')}<path d="M0 ${FLOOR - 36} H${W}" stroke="${INK}" stroke-width="6"/>
  ${[60, 1220].map((x, k) => `<g transform="translate(${x} 0)"><path d="M${k ? -90 : -60} 0 H${k ? 60 : 90} V${FLOOR - 36} H${k ? -90 : -60}Z" fill="#1c1828" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map((i) => `<path d="M${(k ? -70 : -40) + i * 44} 20 V${FLOOR - 56}" stroke="#2e2840" stroke-width="16" stroke-linecap="round"/>`).join('')}</g>`).join('')}
  <g transform="translate(450 210)"><rect x="-130" y="-90" width="260" height="190" rx="16" ${O('#e8d3a8', 6)}/><rect x="-112" y="-72" width="224" height="154" rx="8" fill="#cfe9f7" stroke="${INK}" stroke-width="5"/><path d="M-80 -40 l50 -10 M-86 -14 l30 -6" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>
    ${Array.from({ length: 7 }, (_, i) => `<circle cx="${-108 + i * 36}" cy="-100" r="9" fill="#fff6c8" stroke="${INK}" stroke-width="3.5" style="animation:t5flick ${1.5 + (i % 3) * 0.4}s infinite"/>`).join('')}</g>
  ${[[830, 150], [920, 120], [1010, 160]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path d="M0 -140 V${y * 0.1}" stroke="${INK}" stroke-width="5"/><path d="M0 0 V${180 + i * 30}" stroke="#d9b779" stroke-width="7" stroke-linecap="round"/><path d="M0 0 V${180 + i * 30}" stroke="${INK}" stroke-width="2.5" stroke-dasharray="6 8"/><rect x="-24" y="${180 + i * 30}" width="48" height="46" rx="10" ${O(['#c98a4e', '#7fb3ff', '#ffb36b'][i], 4)}/></g>`).join('')}
  <path d="M0 ${FLOOR - 36} Q320 ${FLOOR - 80} 640 ${FLOOR - 36}" stroke="${INK}" stroke-width="5" fill="none" opacity=".0"/>
  ${crate(1130, FLOOR - 36, 1.2)}${crate(1015, FLOOR - 36, 0.9)}${crate(1090, FLOOR - 130, 0.9)}${garland(0, 30, W, 30, 12)}`;

export const crate = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-56" y="-100" width="112" height="100" rx="6" ${O('#c98a4e', 5)}/><path d="M-50 -94 L50 -6 M50 -94 L-50 -6" stroke="#a8743f" stroke-width="7"/><rect x="-56" y="-100" width="112" height="100" rx="6" fill="none" stroke="${INK}" stroke-width="5"/></g>`;

// ═════════════════════ costumes ═════════════════════
// costume de scène seul (sur cintre / mannequin) : kind = 'sun' | 'moon' | 'cloud' | 'star' ; (0,0) = centre ; largeur ≈ 130
export const costume = (kind = 'sun', x = 0, y = 0, s = 1) => {
  const bodies = {
    sun: `${Array.from({ length: 10 }, (_, i) => `<path d="M0 -62 L12 -42 L-12 -42Z" ${O('#ff9f43', 3.5)} transform="rotate(${i * 36})"/>`).join('')}<circle r="44" ${O('#ffd23f', 5)}/><circle cx="-14" cy="-14" r="9" fill="#fff" opacity=".5"/>`,
    moon: `<path d="M10 -56 A56 56 0 1 0 10 56 A42 42 0 0 1 10 -56Z" ${O('#fff3a6', 5)}/><ellipse cx="-24" cy="-20" rx="8" ry="14" fill="#fff" opacity=".6"/>`,
    cloud: `<ellipse cx="0" cy="12" rx="62" ry="30" ${O('#fff', 5)}/><ellipse cx="-36" cy="-6" rx="30" ry="26" ${O('#fff', 5)}/><ellipse cx="24" cy="-18" rx="38" ry="32" ${O('#fff', 5)}/><ellipse cx="0" cy="14" rx="56" ry="24" fill="#fff"/><ellipse cx="-30" cy="-12" rx="12" ry="6" fill="#bfe6ff" opacity=".7"/>`,
    star: `<path d="M0 -62 L16 -22 L58 -20 L25 8 L36 50 L0 26 L-36 50 L-25 8 L-58 -20 L-16 -22Z" ${O('#ffe14a', 5)}/><ellipse cx="-12" cy="-22" rx="8" ry="14" fill="#fff" opacity=".55"/>`,
  };
  return `<g transform="translate(${x} ${y}) scale(${s})">${bodies[kind] || bodies.sun}</g>`;
};
// costume porté : à poser DERRIÈRE le personnage (couche arrière). (cx,cy) = centre du corps, dans le repère du personnage (renard/lapin : (0,-100)) ; s = échelle
export const costumeBack = (kind = 'sun', cx = 0, cy = -100, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${(1.9 * s).toFixed(2)})" opacity="1">${kind === 'star' ? costume('star', 0, 0, 1) : costume(kind, 0, 0, 1)}</g>`;
// costume porté, couche avant (petit plastron/ruban autour du cou) : à poser DEVANT le personnage
export const costumeFront = (kind = 'sun', cx = 0, cy = -60, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${s})">${kind === 'cloud'
  ? `<ellipse cx="-8" cy="14" rx="46" ry="20" ${O('#fff', 4)}/><ellipse cx="-34" cy="4" rx="20" ry="16" ${O('#fff', 4)}/><ellipse cx="20" cy="4" rx="22" ry="16" ${O('#fff', 4)}/><ellipse cx="-8" cy="12" rx="40" ry="14" fill="#fff"/>`
  : kind === 'sun' ? `<path d="M-50 -2 Q-8 24 36 -2 L30 18 Q-8 40 -44 18Z" ${O('#ff9f43', 4)}/><circle cx="-8" cy="14" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>`
  : `<path d="M-46 0 Q-8 22 34 0 L28 14 Q-8 34 -40 14Z" ${O('#7a4ad8', 4)}/><path d="M-8 8 l4 8 8 2 -6 5 2 8 -8 -4 -8 4 2 -8 -6 -5 8 -2Z" fill="#ffe14a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`}</g>`;

// portant à costumes : (0,0) = centre bas ; largeur ≈ 360, hauteur ≈ 300 ; porte soleil, lune, nuage et étoile sur cintres
export const costumeRack = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="190" ry="12" fill="#000" opacity=".2"/>
  <path d="M-170 0 L-150 -300 M170 0 L150 -300 M-160 0 H-190 M160 0 H190" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-170 0 L-150 -300 M170 0 L150 -300" stroke="#c98a4e" stroke-width="7" stroke-linecap="round"/><path d="M-152 -296 H152" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-152 -296 H152" stroke="#e8c14d" stroke-width="7" stroke-linecap="round"/>
  ${[[-110, 'sun'], [-38, 'moon'], [38, 'cloud'], [112, 'star']].map(([px, k]) => `<path d="M${px} -296 L${px} -282 L${px - 26} -262 H${px + 26} L${px} -282" stroke="${INK}" stroke-width="5" fill="none" stroke-linejoin="round"/>${costume(k, px, -196, 0.78)}`).join('')}</g>`;

// mannequin de couture : (0,0) = centre bas ; hauteur ≈ 250 ; o.kind = costume épinglé dessus
export const dressForm = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-110 M-34 0 H34" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 0 V-110 M-34 0 H34" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/>
  <path d="M-46 -112 Q-50 -190 -18 -218 Q0 -226 18 -218 Q50 -190 46 -112 Q0 -96 -46 -112Z" ${O('#f1d9b5', 5)}/><path d="M-14 -234 Q0 -240 14 -234 V-220 H-14Z" ${O('#f1d9b5', 4)}/><path d="M-30 -160 h60" stroke="#d6bb91" stroke-width="4" stroke-linecap="round"/>
  ${o.kind ? costume(o.kind, 0, -160, 0.6) : ''}<path d="M-46 -176 Q-6 -156 46 -178" stroke="#ff8fb8" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-46 -176 Q-6 -156 46 -178" stroke="${INK}" stroke-width="2.4" stroke-dasharray="3 7" fill="none"/></g>`;

// bobine / ruban : (x,y,s) petite pelote de ruban rose
export const ribbon = (x = 0, y = 0, s = 1, col = '#ff8fb8') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-30" y="-22" width="60" height="44" rx="8" ${O(col, 4)}/><ellipse cx="0" cy="-22" rx="30" ry="9" ${O('#fff', 3.5)}/><ellipse cx="0" cy="22" rx="30" ry="9" fill="${col}" stroke="${INK}" stroke-width="3.5"/><path d="M30 6 Q60 8 56 34 Q48 54 70 62" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M30 6 Q60 8 56 34 Q48 54 70 62" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;

// ═════════════════════ décors en carton, peinture, outils ═════════════════════
// arbre en carton-planches sur pied : (0,0) = centre bas ; hauteur ≈ 330 · o.fold = temps où il se plie en accordéon (le pied reste droit) · o.paint = taches de peinture
export const cardTree = (x = 0, y = 0, s = 1, o = {}) => {
  const tree = `<rect x="-26" y="-190" width="52" height="190" ${O('#c98a4e', 5)}/>${[-150, -100, -50].map((k) => `<path d="M-26 ${k} h52" stroke="#a8743f" stroke-width="4"/>`).join('')}<path d="M-12 -30 q8 -10 6 -40" stroke="#a8743f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="-262" r="82" ${O('#3fae55', 5)}/><circle cx="-62" cy="-226" r="48" ${O('#3fae55', 5)}/><circle cx="62" cy="-226" r="48" ${O('#3fae55', 5)}/><circle cx="0" cy="-262" r="76" fill="#3fae55"/><circle cx="-62" cy="-226" r="42" fill="#3fae55"/><circle cx="62" cy="-226" r="42" fill="#3fae55"/>
    <circle cx="-30" cy="-292" r="12" fill="#fff" opacity=".3"/>${[[-28, -270], [30, -240], [-60, -216], [56, -278]].map(([ax, ay]) => `<circle cx="${ax}" cy="${ay}" r="10" ${O('#e8434e', 3)}/>`).join('')}${o.paint ? `<path d="M-40 -150 q10 -30 28 -10 q16 -18 24 8 q-6 18 -26 14 q-18 8 -26 -12Z" fill="#7cc8ff" stroke="${INK}" stroke-width="3"/>` : ''}`;
  const foot = `<path d="M-60 0 L-26 -50 M60 0 L26 -50" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-60 0 L-26 -50 M60 0 L26 -50" stroke="#a8743f" stroke-width="8" stroke-linecap="round"/><rect x="-70" y="-8" width="140" height="14" rx="6" ${O('#8a5a33', 4)}/>`;
  const body = o.fold === undefined ? tree : `<g style="transform-origin:0px 0px;${an({ n: 't5accord', d: 0.9, t: o.fold, f: 'both', e: 'ease-in' })}">${tree}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="2" rx="90" ry="9" fill="#000" opacity=".2"/>${foot}${body}</g>`;
};

// panneau de décor en carton : kind = 'house' | 'moon' | 'cloud' | 'star' ; (0,0) = centre bas ; hauteur ≈ 260 avec pied
export const flat = (kind = 'house', x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 L-40 -60 M70 0 L40 -60" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-70 0 L-40 -60 M70 0 L40 -60" stroke="#a8743f" stroke-width="7" stroke-linecap="round"/>
  ${kind === 'house' ? `<rect x="-90" y="-210" width="180" height="150" ${O('#ffd7a8', 5)}/><path d="M-110 -210 L0 -300 L110 -210Z" ${O('#e8434e', 5)}/><rect x="-24" y="-130" width="48" height="70" rx="6" ${O('#8a5a33', 4)}/><rect x="-74" y="-180" width="40" height="40" rx="4" ${O('#bfe6ff', 4)}/><rect x="34" y="-180" width="40" height="40" rx="4" ${O('#bfe6ff', 4)}/>`
    : kind === 'moon' ? `<g transform="translate(0 -170)">${costume('moon', 0, 0, 1.6)}</g>` : kind === 'star' ? `<g transform="translate(0 -170)">${costume('star', 0, 0, 1.6)}</g>` : `<g transform="translate(0 -170)">${costume('cloud', 0, 0, 1.8)}</g>`}</g>`;

// grosse éclaboussure de peinture : (x,y) = centre ; apparaît à t0 ; col
export const paintSplat = (x, y, t0, s = 1, col = '#ff6f95') => `<g transform="translate(${x} ${y}) scale(${s})"><g style="transform-origin:0px 0px;${an({ n: 't5splat', d: 0.45, t: t0, f: 'both', e: 'cubic-bezier(.2,1.4,.4,1)' })}">
  <path d="M0 -70 Q22 -90 34 -62 Q70 -76 66 -36 Q96 -24 70 6 Q86 38 48 42 Q40 76 8 58 Q-20 84 -38 52 Q-78 58 -66 20 Q-100 -6 -64 -26 Q-72 -62 -34 -58 Q-26 -90 0 -70Z" fill="${col}" stroke="${INK}" stroke-width="5"/>
  ${[[-96, -50, 12], [100, 20, 14], [74, -84, 9], [-76, 74, 10], [20, 100, 11]].map(([dx, dy, r]) => `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${col}" stroke="${INK}" stroke-width="4"/>`).join('')}<ellipse cx="-24" cy="-30" rx="14" ry="8" fill="#fff" opacity=".45" transform="rotate(-30 -24 -30)"/></g></g>`;

export const paintCan = (x = 0, y = 0, s = 1, col = '#ff6f95') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-32" y="-56" width="64" height="56" rx="8" ${O('#cfd2dc', 5)}/><rect x="-32" y="-40" width="64" height="22" fill="${col}" stroke="${INK}" stroke-width="3.5"/><ellipse cy="-56" rx="32" ry="9" ${O(col, 4)}/><path d="M-32 -56 Q0 -108 32 -56" stroke="${INK}" stroke-width="4" fill="none"/></g>`;
// pinceau (tenu en main : manche vers la gauche) à passer en `item`
export const brush = (col = '#ff6f95') => `<g transform="rotate(-30)"><rect x="-8" y="-62" width="16" height="64" rx="7" ${O('#c98a4e', 4)}/><rect x="-9" y="-6" width="18" height="12" fill="#cfd2dc" stroke="${INK}" stroke-width="3"/><path d="M-9 6 L9 6 Q12 26 0 30 Q-12 26 -9 6Z" ${O(col, 3.5)}/></g>`;
// plan roulé de Bastien (item) et planches
export const blueprint = `<g transform="rotate(-20)"><rect x="-8" y="-44" width="16" height="70" rx="7" ${O('#7fb3ff', 4)}/><path d="M-4 -30 h8 M-4 -18 h8 M-4 -6 h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="-10" y="-50" width="20" height="9" rx="4" fill="#ff8a2b" stroke="${INK}" stroke-width="3"/></g>`;
export const planks = (x = 0, y = 0, s = 1, n = 3) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: n }, (_, i) => `<rect x="${-80 + (i % 2) * 8}" y="${-22 - i * 22}" width="160" height="20" rx="4" ${O(i % 2 ? '#d9a05b' : '#c98a4e', 4)}/><path d="M${-40 + i * 12} ${-18 - i * 22} h30" stroke="#a8743f" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
export const ladder = (x = 0, y = 0, s = 1, h = 260) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 0 L-26 -${h} M34 0 L26 -${h}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-34 0 L-26 -${h} M34 0 L26 -${h}" stroke="#e8b54a" stroke-width="8" stroke-linecap="round"/>${Array.from({ length: Math.floor(h / 48) }, (_, i) => `<path d="M${-31 + i * 1.4} ${-26 - i * 48} H${31 - i * 1.4}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${-31 + i * 1.4} ${-26 - i * 48} H${31 - i * 1.4}" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/>`).join('')}</g>`;

// étoile en carton (celle de la pièce) : (0,0) = centre ; o.face (défaut true) ; o.glow = true : halo ; en `item` : s'accroche à la main par le bas du manche (item = cardStar({handle:true}))
export const cardStar = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})">${o.glow ? `<circle r="120" fill="#fff3a6" opacity=".3" style="animation:t5glow 1.4s ease-in-out infinite"/>` : ''}${o.handle ? `<path d="M0 40 V120" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 40 V120" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/>` : ''}
  <path d="M0 -76 L20 -26 L74 -24 L32 10 L46 62 L0 32 L-46 62 L-32 10 L-74 -24 L-20 -26Z" ${O('#ffe14a', 6)}/><ellipse cx="-16" cy="-34" rx="8" ry="16" fill="#fff" opacity=".55" transform="rotate(20 -16 -34)"/>
  ${o.face === false ? '' : `<circle cx="-14" cy="0" r="5" fill="${INK}"/><circle cx="14" cy="0" r="5" fill="${INK}"/><circle cx="-12.5" cy="-1.5" r="1.7" fill="#fff"/><circle cx="15.5" cy="-1.5" r="1.7" fill="#fff"/><path d="M-9 14 Q0 24 9 14" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="-28" cy="12" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="28" cy="12" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/>`}</g>`;

// ═════════════════════ affiche ═════════════════════
// affiche du spectacle : (0,0) = centre ; 270 x 380 · o.hour = heure écrite (défaut '20h30') · o.curl = true : coin décollé · o.rot
export const poster = (x = 0, y = 0, s = 1, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.rot || 0}) scale(${s})"><rect x="-132" y="-186" width="270" height="380" rx="6" fill="#000" opacity=".15"/>
  <rect x="-135" y="-190" width="270" height="380" rx="6" ${O('#fff7e0', 6)}/><rect x="-118" y="-174" width="236" height="348" rx="4" fill="#24307a" stroke="${INK}" stroke-width="3.5"/>
  ${[[-80, -140, 5], [86, -120, 4], [-92, -60, 4], [92, 4, 5], [70, -150, 3]].map(([sx, sy, r]) => `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#fff6c8"/>`).join('')}
  <g transform="translate(0 -56) scale(1.15)"><path d="M0 -62 L16 -20 L58 -18 L26 10 L36 52 L0 28 L-36 52 L-26 10 L-58 -18 L-16 -20Z" ${O('#ffe14a', 5)}/><circle cx="-11" cy="0" r="4.2" fill="${INK}"/><circle cx="11" cy="0" r="4.2" fill="${INK}"/><path d="M-7 12 Q0 20 7 12" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
  <rect x="-100" y="40" width="200" height="40" rx="8" fill="#fff7e0" stroke="${INK}" stroke-width="3.5"/><path d="M-80 54 h160 M-60 68 h120" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <rect x="-70" y="100" width="140" height="56" rx="10" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><text y="142" style="font-size:40px;fill:${INK}">${o.hour || '20h30'}</text>
  <path d="M-135 -190 L-100 -190 L-135 -150Z" fill="${o.curl ? '#e8dcc0' : 'none'}" stroke="${o.curl ? INK : 'none'}" stroke-width="3"/>
  <rect x="-24" y="-204" width="48" height="22" rx="4" fill="#ffd2a0" opacity=".85" stroke="${INK}" stroke-width="2.5"/><rect x="-24" y="178" width="48" height="22" rx="4" fill="#ffd2a0" opacity=".85" stroke="${INK}" stroke-width="2.5"/></g>`;

// ═════════════════════ salle : fauteuils et public ═════════════════════
// fauteuil rouge de théâtre, vu de face : (0,0) = centre bas ; 80 de large, 100 de haut
export const seat = (x = 0, y = 0, s = 1, col = '#c9283e') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-38" y="-100" width="76" height="76" rx="18" ${O(col, 5)}/><rect x="-22" y="-84" width="44" height="30" rx="10" fill="#fff" opacity=".18"/><rect x="-44" y="-52" width="88" height="40" rx="12" ${O(col, 5)}/><rect x="-30" y="-14" width="60" height="14" rx="5" ${O('#6a4a30', 4)}/></g>`;
// rangées de fauteuils (au premier plan) : o = { y, rows, n, s, gap, col } ; la rangée la plus proche est la plus grande
export const seatRows = (o = {}) => {
  const { y = 700, rows = 2, n = 7, s = 1.3, col = '#c9283e' } = o;
  let out = '';
  for (let r = 0; r < rows; r++) { const sc = s * (1 + r * 0.1), yy = y - r * 70 * s; for (let i = 0; i < n; i++) out += seat(W / (n * 2) + (i * W) / n, yy, sc, col); }
  return out;
};

// silhouette de spectateur : kind 0 rond · 1 oreilles de lapin · 2 oreilles de chat · 3 oreilles d'ours · 4 chapeau
const spec = (kind, c) => {
  const ear = [`<ellipse cx="-14" cy="-86" rx="8" ry="26" fill="${c}"/><ellipse cx="14" cy="-86" rx="8" ry="26" fill="${c}"/>`, `<path d="M-26 -50 L-24 -80 L-6 -58Z M26 -50 L24 -80 L6 -58Z" fill="${c}"/>`, `<circle cx="-24" cy="-60" r="10" fill="${c}"/><circle cx="24" cy="-60" r="10" fill="${c}"/>`, `<rect x="-30" y="-64" width="60" height="9" rx="4" fill="${c}"/><rect x="-18" y="-84" width="36" height="24" rx="6" fill="${c}"/>`];
  return `<ellipse cx="0" cy="12" rx="46" ry="34" fill="${c}"/><circle cx="0" cy="-30" r="32" fill="${c}"/>${kind ? ear[kind - 1] : ''}<path d="M-20 -48 Q-10 -58 4 -56" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".14"/>`;
};
// public en silhouette : rangées de spectateurs vus de dos/face, (x0..x1) à la hauteur y (base des épaules)
// o = { y: 720, x0: 40, x1: 1240, n: 9, s: 1.3, row: 0 (assombrit les rangées plus loin), clap: [[a,b]] applaudit, stand: t (se lève), lights: [t…] lucioles/lampes allumées par les spectateurs, seed }
export const crowd = (o = {}) => {
  const { y = 730, x0 = 40, x1 = 1240, n = 9, s = 1.3, row = 0, clap = [], stand, lights = [], seed = 0 } = o;
  const cols = ['#2a2347', '#211b3b', '#19142f', '#120e24'], c = cols[Math.min(row, 3)];
  let out = '';
  for (let i = 0; i < n; i++) {
    const px = x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)) + (rnd(i + seed) - 0.5) * 30, kind = Math.floor(rnd(i * 3 + seed + 7) * 5) % 5, py = y - rnd(i + seed + 20) * 18;
    let g = `<g transform="translate(${px.toFixed(0)} ${py.toFixed(0)}) scale(${(s * (0.92 + rnd(i + seed + 5) * 0.2)).toFixed(2)})">${spec(kind, c)}</g>`;
    const hands = clap.length ? wins(clap, `<g transform="translate(${px.toFixed(0)} ${(py - 40 * s).toFixed(0)}) scale(${s})"><g style="animation:t5hand .22s ease-in-out infinite"><circle cx="-8" cy="0" r="10" fill="${c}"/><circle cx="8" cy="0" r="10" fill="${c}"/></g></g>`) : '';
    if (clap.length) g = clap.reduce((acc, [a, b]) => `<g style="${an({ n: 't5clap', d: 0.5 + (i % 3) * 0.07, t: a + (i % 4) * 0.05, c: Math.max(1, Math.round((b - a) / 0.55)) })}">${acc}</g>`, g);
    if (stand !== undefined) g = `<g style="${an({ n: 't5stand', d: 0.5, t: stand + (i % 5) * 0.06, f: 'both', e: 'cubic-bezier(.3,1.4,.5,1)' })}">${g}</g>`;
    out += g + hands;
  }
  const fl = lights.map((t0) => Array.from({ length: Math.max(3, Math.round(n / 2)) }, (_, i) => vis(t0 + i * 0.12, 999, firefly(x0 + rnd(i * 5 + seed + t0) * (x1 - x0), y - 80 - rnd(i + 3) * 140, 0.9))).join('')).join('');
  return out + fl;
};

// ═════════════════════ feux d'artifice, confettis, écho ═════════════════════
// un bouquet de feu d'artifice : (x,y) = centre de l'éclat ; part à t0 (la fusée monte 0,6 s avant) ; col ; r = rayon (≈ 110)
export const firework = (x, y, t0, o = {}) => {
  const col = o.col || '#ffd23f', col2 = o.col2 || '#ff6f95', r = o.r || 110, n = 12;
  const rays = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `<path d="M${(Math.cos(a) * r * 0.5).toFixed(1)} ${(Math.sin(a) * r * 0.5).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}" stroke="${i % 2 ? col : col2}" stroke-width="9" stroke-linecap="round"/><circle cx="${(Math.cos(a + 0.26) * r * 1.12).toFixed(1)}" cy="${(Math.sin(a + 0.26) * r * 1.12).toFixed(1)}" r="6" fill="${i % 2 ? col2 : col}"/>`; }).join('');
  const rs = o.rise || 220;
  return `<g transform="translate(${x} ${y})"><g transform="translate(0 ${rs})"><g style="--dy:${-rs}px;${an({ n: 't5rocket', d: 0.6, t: Math.max(0, t0 - 0.6), f: 'both', e: 'ease-out' })}"><path d="M0 0 V26" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g></g>
  <g style="transform-origin:0px 0px;${an({ n: 't5burst', d: 1.4, t: t0, f: 'both', e: 'ease-out' })}">${rays}<circle r="12" fill="#fff"/></g></g>`;
};

// pluie de confettis plein écran à partir de t0 (n bandes, cycle infini)
export const confetti = (t0, n = 36, dur = 3) => Array.from({ length: n }, (_, i) => `<g transform="translate(${(rnd(i + 1) * W).toFixed(0)} 0)"><g style="--dx:${((rnd(i + 11) - 0.5) * 160).toFixed(0)}px;${an({ n: 't5conf', d: dur + rnd(i + 21) * 1.5, t: t0 + rnd(i + 31) * 1.2, c: 99, e: 'linear' })}"><rect width="${10 + (i % 3) * 3}" height="${16 + (i % 2) * 6}" rx="2" fill="${['#ff6f95', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff', '#ff9f43'][i % 6]}" stroke="${INK}" stroke-width="2"/></g></g>`).join('');

// écho : ondes concentriques qui s'élargissent depuis (x,y) à t0 ; o.n anneaux, o.col ; à poser pour « l'écho répond »
export const echo = (x, y, t0, o = {}) => `<g transform="translate(${x} ${y})">${Array.from({ length: o.n || 3 }, (_, i) => `<g style="transform-origin:0px 0px;${an({ n: 't5echo', d: 1.1, t: t0 + i * 0.28, f: 'both', e: 'ease-out' })}"><path d="M${30 + i * 8} -50 Q${74 + i * 8} 0 ${30 + i * 8} 50" stroke="${o.col || '#fff'}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${30 + i * 8} -50 Q${74 + i * 8} 0 ${30 + i * 8} 50" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".5" transform="translate(4 0)"/></g>`).join('')}</g>`;

// ═════════════════════ le trou du souffleur ═════════════════════
// (x,y) = centre du trou, au bord de la scène ; largeur ≈ 220. `inner` = svg dessiné DANS le trou, pieds en (0,0) = fond du trou (ex. mole() ; il est coupé par le rebord, seul le haut dépasse).
// o.rise = [t0,t1] : le personnage monte du fond ; o.down = px dont on enfonce le personnage sous le rebord (défaut 60 : la tête et le torse dépassent) ; o.lamp = false pour retirer la petite lampe
export const prompterHole = (x = 0, y = 0, s = 1, inner = '', o = {}) => {
  const id = `t5p${uid++}`, down = o.down ?? 60, rise = o.rise;
  const content = rise ? tf(inner, { t0: rise[0], d: rise[1] - rise[0], from: 'translateY(150px)', to: 'translateY(0px)', e: 'cubic-bezier(.3,1.4,.5,1)' }) : inner;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <clipPath id="${id}"><path d="M-300 -400 H300 V10 H-300Z"/></clipPath>
  <ellipse cx="0" cy="0" rx="112" ry="26" ${O('#1a1020', 6)}/>
  <g clip-path="url(#${id})"><g transform="translate(0 ${down})">${content}</g></g>
  <path d="M-112 0 A112 26 0 0 0 112 0 V18 A112 34 0 0 1 -112 18Z" ${O('#8a5a33', 6)}/><path d="M-98 14 q98 30 196 0" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".3"/>
  ${o.lamp === false ? '' : `<g transform="translate(-130 -6)"><path d="M0 0 Q-10 -40 6 -64" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-6 -66 L24 -80 L30 -58Z" ${O('#ffd23f', 4)}/><circle cx="20" cy="-58" r="14" fill="#fff6c8" opacity=".5" style="animation:t5glow 1.2s ease-in-out infinite"/></g>`}</g>`;
};
