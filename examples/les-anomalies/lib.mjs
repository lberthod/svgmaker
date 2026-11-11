// Bibliothèque commune de « LES ANOMALIES » : constantes, effets manga, personnages, robot, décors,
// caméra, particules, bulles, CSS d'animation et assemblage. Chaque épisode (../les-anomalies-epN/make.mjs)
// importe ce module, déclare ses répliques avec setLines(), ses plans avec scene(), puis appelle build().
import { writeFileSync } from 'node:fs';

export const W = 1080, H = 1920, T = 40;
export const PAPER = '#f4f0e6', INK = '#0d0d12', NIGHT = '#16161f', RED = '#e3122a';
export const VOLTA = '#ffd21f', GIVRE = '#2ec5ff', ECHO = '#a35bff', MIRAGE = '#2fe07d', ORANGE = '#ff7a1a';
export const svgCss = (rule) => css.push(rule); // règle CSS supplémentaire propre à un épisode

let seed = 11;
export const reseed = (s) => { seed = s; };
export const rnd = (a = 0, b = 1) => { seed = (seed * 16807) % 2147483647; return a + ((seed - 1) / 2147483646) * (b - a); };
export const f = (n) => Math.round(n * 10) / 10;
export const pc = (s) => +((s / T) * 100).toFixed(4);
export const g4 = (n) => +n.toFixed(4);
export const rad = (a) => (a * Math.PI) / 180;
export const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))]; // 0 = vers le bas, 90 = vers la droite, 180 = vers le haut


let LINES = [];
export const setLines = (l) => { LINES = l; };
const SFX = [];
export const sfx = (name, t) => SFX.push({ name, t });
// ---------- Visibilité par fenêtres de temps ----------
const css = [];
let vid = 0;
export const vis = (a, b, body) => {
  const id = `v${vid++}`;
  const A = pc(a), B = pc(Math.min(b, T));
  const kf = a <= 0
    ? `0%,${B}%{opacity:1} ${g4(B + 0.01)}%,100%{opacity:0}`
    : b >= T ? `0%,${g4(A - 0.01)}%{opacity:0} ${A}%,100%{opacity:1}`
      : `0%,${g4(A - 0.01)}%{opacity:0} ${A}%,${B}%{opacity:1} ${g4(B + 0.01)}%,100%{opacity:0}`;
  css.push(`@keyframes ${id}{${kf}} .${id}{animation:${id} ${T}s linear both}`);
  return `<g class="${id}">${body}</g>`;
};
const scenes = [];
export const scene = (a, b, body) => scenes.push(vis(a, b, body));
// animation ponctuelle (classe CSS + délai), éventuellement avec origine en px
export const an = (cls, delay, body, origin = null, extra = '') =>
  `<g class="${cls}" style="animation-delay:${delay}s${origin ? `;transform-origin:${origin[0]}px ${origin[1]}px` : ''}${extra}">${body}</g>`;

// ---------- Graphismes manga ----------
export const radial = (cx, cy, n, color, rIn = [300, 560], rOut = 1800) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd(-0.02, 0.02), w = rnd(0.004, 0.016), r0 = rnd(...rIn);
    const p = (r, d) => `${f(cx + Math.cos(a + d) * r)},${f(cy + Math.sin(a + d) * r)}`;
    s += `<polygon points="${p(r0, 0)} ${p(rOut, -w)} ${p(rOut, w)}"/>`;
  }
  return `<g class="throb" style="transform-origin:${cx}px ${cy}px;animation-delay:-${f(rnd(0, 0.3))}s"><g fill="${color}">${s}</g></g>`;
};
export const burst = (cx, cy, rIn, rOut, n, fill, stroke = 'none') => {
  let pts = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? rIn * rnd(0.8, 1.1) : rOut * rnd(0.7, 1.15);
    pts += `${f(cx + Math.cos(a) * r)},${f(cy + Math.sin(a) * r)} `;
  }
  return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="8" stroke-linejoin="round"/>`;
};
export const cracks = (cx, cy, n, len, color, w = 5) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    let x = cx, y = cy, a = rnd(0, Math.PI * 2), d = `M${f(x)} ${f(y)}`;
    for (let k = 0; k < 5; k++) { a += rnd(-0.6, 0.6); x += Math.cos(a) * len / 5; y += Math.sin(a) * len / 5; d += ` L${f(x)} ${f(y)}`; }
    s += `<path d="${d}"/>`;
  }
  return `<g fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round">${s}</g>`;
};
// éclair en zigzag de (x0,y0) à (x1,y1)
export const zig = (x0, y0, x1, y1, n = 9, j = 40) => {
  let d = `M${f(x0)} ${f(y0)}`;
  const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1;
  for (let i = 1; i < n; i++) {
    const t = i / n, o = rnd(-j, j);
    d += ` L${f(x0 + (x1 - x0) * t + (nx / L) * o)} ${f(y0 + (y1 - y0) * t + (ny / L) * o)}`;
  }
  return d + ` L${f(x1)} ${f(y1)}`;
};
// éclair qui scintille : deux tracés alternés
export const bolt = (x0, y0, x1, y1, color, w = 14, n = 9, j = 40, delay = 0) => {
  const one = (k) => `<g class="flick${k}" style="animation-delay:${delay}s"><path d="${zig(x0, y0, x1, y1, n, j)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"/><path d="${zig(x0, y0, x1, y1, n, j * 0.15)}" fill="none" stroke="#fff" stroke-width="${w * 0.35}" stroke-linecap="round" opacity="0"/></g>`;
  const a = zig(x0, y0, x1, y1, n, j), b = zig(x0, y0, x1, y1, n, j);
  const path = (d, k) => `<g class="flick${k}" style="animation-delay:${delay}s"><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${f(w * 0.35)}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  void one;
  return path(a, 1) + path(b, 2);
};
export const onom = (x, y, txt, size, rot, fill, stroke, delay, cls = 'slam') =>
  an(cls, delay, `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" class="onom" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.round(size / 9)}">${txt}</text>`);
let clipDefs = '';
export const panel = (id, x, y, w, h, body, bg = PAPER) => {
  clipDefs += `<clipPath id="c_${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
  return `<g clip-path="url(#c_${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>${body}</g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="10"/>`;
};
// bulle de dialogue (ronde pour les mutants, rectangulaire et rouge pour le robot)
export const bubbleFor = (k, x, y, lines, tail = [0, 70]) => {
  const L = LINES[k], robot = ['robot', 'colosse', 'omega'].includes(L.who);
  const cw = robot ? 27.5 : 23;
  const w = Math.max(...lines.map((l) => l.length)) * cw + (robot ? 70 : 90), h = lines.length * 50 + 56;
  const [tx, ty] = tail;
  const tailPath = `M${x - 24} ${y + Math.sign(ty || 1) * (h / 2 - 12)} L${x + tx} ${y + ty + Math.sign(ty || 1) * (h / 2)} L${x + 24} ${y + Math.sign(ty || 1) * (h / 2 - 12)}Z`;
  const shape = robot
    ? `<path d="${tailPath}" fill="${INK}" stroke="${RED}" stroke-width="5" stroke-linejoin="round"/>
       <rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="${INK}" stroke="${RED}" stroke-width="6"/>
       <rect x="${f(x - w / 2 + 10)}" y="${f(y - h / 2 + 10)}" width="${f(w - 20)}" height="${f(h - 20)}" fill="none" stroke="${RED}" stroke-width="2" opacity=".6"/>
       <path d="M${x - 22} ${y + Math.sign(ty || 1) * (h / 2 - 3)} L${x + 22} ${y + Math.sign(ty || 1) * (h / 2 - 3)}" stroke="${INK}" stroke-width="8"/>`
    : `<path d="${tailPath}" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
       <ellipse cx="${x}" cy="${y}" rx="${f(w / 2)}" ry="${f(h / 2)}" fill="#fff" stroke="${INK}" stroke-width="6"/>
       <path d="M${x - 20} ${y + Math.sign(ty || 1) * (h / 2 - 9)} L${x + 20} ${y + Math.sign(ty || 1) * (h / 2 - 9)}" stroke="#fff" stroke-width="10"/>`;
  const txt = lines.map((l, i) => `<text x="${x}" y="${f(y - ((lines.length - 1) * 50) / 2 + i * 50 + 14)}" class="${robot ? 'rt' : 'bt'}">${l}</text>`).join('');
  return vis(L.t0, L.t1, an('pop', L.t0, shape + txt));
};
export const tag = (x, y, name, power, color, delay) => an('pop', delay, `
  <rect width="${name.length * 30 + power.length * 21 + 80}" height="66" fill="${INK}" stroke="${color}" stroke-width="5" transform="translate(${x + 14} ${y}) skewX(-12)"/>
  <text x="${x + 26}" y="${y + 47}" class="tagn" fill="${color}">${name}<tspan class="tagp" fill="${PAPER}"> · ${power}</tspan></text>`);

// ---------- Personnages : squelette posé, pieds au sol (y = 0) ----------
export const CH = {
  volta: { accent: VOLTA, hair: 'spiky' },
  givre: { accent: GIVRE, hair: 'swept' },
  echo: { accent: ECHO, hair: 'long' },
  mirage: { accent: MIRAGE, hair: 'hood' },
  kessler: { accent: RED, hair: 'bun', coat: true, visor: true },
};
// nouveau personnage (mutants libérés, etc.) : addChar('rose', { accent: '#ff5fa2', hair: 'spiky' | 'swept' | 'long' | 'hood' | 'bun' })
export const addChar = (k, def) => { CH[k] = def; };
export const POSES = {
  stand: { la: [-10, -4], ra: [10, 4], ll: [-6, -3], rl: [6, 3] },
  hips: { la: [-50, 30], ra: [50, -30], ll: [-9, -4], rl: [9, 4] },
  cast: { la: [-25, -12], ra: [100, 96], ll: [-28, -6], rl: [22, 10], lean: 6 },
  castUp: { la: [-30, -15], ra: [140, 150], ll: [-22, -6], rl: [18, 8] },
  slam: { la: [40, 10], ra: [55, 18], ll: [-75, 5], rl: [60, -15], lean: 28 },
  float: { la: [-115, -140], ra: [115, 140], ll: [-5, 4], rl: [6, 16] },
  throw: { la: [-60, -40], ra: [125, 110], ll: [-8, 4], rl: [10, 20], lean: 8 },
  charge: { la: [-155, -172], ra: [155, 172], ll: [-24, -16], rl: [24, 16], shout: true, hairUp: true },
  leap: { la: [-130, -100], ra: [70, 110], ll: [-45, 20], rl: [55, -30], lean: 14 },
  run: { la: [-50, -110], ra: [45, 120], ll: [-45, -5], rl: [40, -40], lean: 14 },
  kneel: { la: [-15, -5], ra: [30, 70], ll: [-95, 0], rl: [8, 4], lean: 12 },
  point: { la: [-12, -4], ra: [92, 92], ll: [-10, -4], rl: [10, 4] },
  guard: { la: [-60, -150], ra: [60, 150], ll: [-16, -6], rl: [16, 6] },
  sad: { la: [-4, 0], ra: [4, 0], ll: [-4, -2], rl: [4, 2], lean: -6 },
};
export const joints = (p) => {
  const lean = p.lean || 0;
  const rot = ([x, y]) => { // rotation du haut du corps autour de la hanche (0,-300)
    const a = rad(lean), dx = x, dy = y + 300;
    return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a) - 300];
  };
  const limb = (o, [a1, a2], l1, l2) => {
    const e = [o[0] + dir(a1)[0] * l1, o[1] + dir(a1)[1] * l1];
    return [o, e, [e[0] + dir(a2)[0] * l2, e[1] + dir(a2)[1] * l2]];
  };
  const LS = rot([-66, -500]), RS = rot([66, -500]);
  const la = limb(LS, p.la.map((a) => a + lean), 125, 118), ra = limb(RS, p.ra.map((a) => a + lean), 125, 118);
  const ll = limb([-28, -300], p.ll, 150, 150), rl = limb([28, -300], p.rl, 150, 150);
  const ground = Math.max(ll[2][1], rl[2][1]);
  return { la, ra, ll, rl, ground, rot, lean };
};
export const P = (pt) => `${f(pt[0])} ${f(pt[1])}`;
export const figure = (who, pose, opts = {}) => {
  const c = CH[who], p = POSES[pose], J = joints(p), A = c.accent;
  const glowEyes = opts.glow;
  // profil d'animation : [bras G amplitude°, durée, bras D, durée, tête, durée, cheveux, durée]
  const prof = { idle: [6, 1.3, 6, 1.1, 3, 1.7, 5, 0.9], fight: [16, 0.32, 16, 0.28, 4, 0.6, 8, 0.3], cast: [5, 1, 3, 0.12, 2, 1.2, 6, 0.4], charge: [4, 0.1, 4, 0.11, 3, 0.2, 9, 0.15], still: null }[opts.anim || 'idle'];
  const sw = (body, o, r, d) => prof ? `<g class="sw" style="transform-origin:${f(o[0])}px ${f(o[1])}px;--r:${r}deg;animation-duration:${d}s;animation-delay:-${f(rnd(0, d))}s">${body}</g>` : body;
  const hairSw = (body) => prof ? sw(body, [0, -600], prof[6], prof[7]) : body;
  const leg = ([h, k, ft], front) => `
    <path d="M${P(h)} L${P(k)} L${P(ft)}" fill="none" stroke="${INK}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${P(h)} L${P(k)}" fill="none" stroke="${A}" stroke-width="5" opacity=".8"/>
    <path d="M${P([k[0] + (ft[0] - k[0]) * 0.35, k[1] + (ft[1] - k[1]) * 0.35])} L${P(ft)}" stroke="${A}" stroke-width="38" stroke-linecap="round"/>
    <ellipse cx="${f(ft[0] + (front ? 14 : -14))}" cy="${f(ft[1] + 12)}" rx="34" ry="16" fill="${INK}"/>`;
  const arm = ([s, e, h]) => `
    <path d="M${P(s)} L${P(e)} L${P(h)}" fill="none" stroke="${INK}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${P(s)} L${P(e)}" fill="none" stroke="${A}" stroke-width="5" opacity=".8"/>
    <path d="M${P([e[0] + (h[0] - e[0]) * 0.45, e[1] + (h[1] - e[1]) * 0.45])} L${P(h)}" stroke="${A}" stroke-width="34" stroke-linecap="round"/>
    <circle cx="${f(h[0])}" cy="${f(h[1])}" r="24" fill="${A}" stroke="${INK}" stroke-width="5"/>`;
  // cheveux
  const spiky = (() => {
    let pts = '';
    const up = p.hairUp;
    for (let i = 0; i <= 14; i++) {
      const a = -180 + (i / 14) * 180, r = i % 2 ? 58 : (up ? 118 : 92);
      const aa = up ? -90 + (a + 90) * 0.55 : a;
      pts += `${f(Math.cos(rad(aa)) * r)},${f(-600 + Math.sin(rad(aa)) * r)} `;
    }
    return `<polygon points="${pts} 50,-590 30,-620 10,-600 -10,-622 -30,-600 -50,-590" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="${up ? '-8,-650 18,-740 22,-650' : '-30,-640 -70,-690 -18,-650'}" fill="${A}"/>`;
  })();
  const hair = {
    spiky,
    swept: `<path d="M-50 -606 C-62 -660 -20 -690 30 -680 C70 -672 96 -650 112 -626 C90 -632 76 -628 66 -620 C84 -610 92 -596 96 -580 C76 -594 60 -604 48 -608 C30 -640 -10 -640 -50 -606Z" fill="${PAPER}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-20 -664 C20 -668 60 -652 88 -628 M-30 -644 C10 -654 40 -642 60 -626" fill="none" stroke="${A}" stroke-width="5"/>`,
    long: '',
    hood: `<path d="M-60 -604 C-66 -676 66 -676 60 -604 C52 -640 30 -652 0 -652 C-30 -652 -52 -640 -60 -604Z" fill="${INK}" stroke="${A}" stroke-width="5"/>
      <path d="M-40 -640 C-10 -650 20 -648 44 -632" fill="none" stroke="${A}" stroke-width="4" opacity=".7"/>`,
    bun: `<path d="M-50 -604 C-56 -664 56 -664 50 -604 C40 -636 -40 -636 -50 -604Z" fill="${INK}" stroke="${INK}" stroke-width="4"/>
      <circle cx="0" cy="-676" r="30" fill="${INK}"/><path d="M-30 -690 L34 -660" stroke="${RED}" stroke-width="5"/>`,
  }[c.hair] ?? '';
  const backHair = c.hair === 'hood'
    ? `<path d="M-70 -600 C-80 -700 80 -700 70 -600 L80 -520 L-80 -520Z" fill="${INK}" stroke="${A}" stroke-width="5" stroke-linejoin="round"/>`
    : c.hair === 'long'
    ? `<path d="M-52 -610 C-70 -680 40 -700 60 -630 C${opts.float ? '120 -640 170 -700 210 -760 C190 -680 150 -600 120 -560 C160 -560 190 -600 230 -620 C200 -540 130 -510 70 -520' : '80 -560 90 -480 80 -420 C60 -440 50 -470 40 -500 C30 -460 10 -440 -20 -430'} C-60 -470 -70 -540 -52 -610Z" fill="${A}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
       <path d="M0 -650 C40 -640 70 -610 ${opts.float ? '150 -650' : '70 -480'}" fill="none" stroke="${INK}" stroke-width="3" opacity=".5"/>` : '';
  const bangs = c.hair === 'long'
    ? `<path d="M-50 -600 C-50 -660 50 -672 52 -606 C30 -630 10 -628 0 -612 C-12 -630 -36 -626 -50 -600Z" fill="${A}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` : '';
  const eye = (x, y, s) => glowEyes
    ? `<path d="M${x - 14 * s} ${y + 2} Q${x} ${y - 10} ${x + 14 * s} ${y - 2} L${x + 12 * s} ${y + 6} Q${x} ${y + 8} ${x - 12 * s} ${y + 6}Z" fill="${A}" stroke="${INK}" stroke-width="3" filter="url(#glow)"/>
       <ellipse cx="${x}" cy="${y + 1}" rx="7" ry="3" fill="#fff"/>`
    : `<path d="M${x - 14 * s} ${y + 2} Q${x} ${y - 10} ${x + 14 * s} ${y - 2} L${x + 12 * s} ${y + 6} Q${x} ${y + 8} ${x - 12 * s} ${y + 6}Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
       <circle cx="${x + 2 * s}" cy="${y}" r="6" fill="${A}" stroke="${INK}" stroke-width="1.5"/><circle cx="${x + 2 * s}" cy="${y}" r="3" fill="${INK}"/><circle cx="${x + 4 * s}" cy="${y - 2}" r="1.6" fill="#fff"/>
       <path d="M${x - 15 * s} ${y + 1} Q${x} ${y - 12} ${x + 15 * s} ${y - 3}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  const mouth = p.shout || opts.shout
    ? `<path d="M-14 -566 Q0 -572 14 -566 Q8 -544 0 -542 Q-8 -544 -14 -566Z" fill="${INK}"/><path d="M-8 -552 Q0 -548 8 -552" stroke="${RED}" stroke-width="3" fill="none"/>`
    : `<path d="M-11 -561 Q0 -564 11 -563" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const head = `
    ${hairSw(backHair)}
    <rect x="-16" y="-548" width="32" height="44" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
    <path d="M-46 -620 Q-50 -566 -22 -542 L0 -532 L22 -542 Q50 -566 46 -620 Q40 -660 0 -662 Q-40 -660 -46 -620Z" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>
    <path d="M22 -542 Q50 -566 46 -620 L34 -600 Q36 -566 14 -540Z" fill="url(#tone)" opacity=".5"/>
    ${c.visor ? `<path d="M-48 -608 L48 -608 L44 -584 L-44 -584Z" fill="${RED}" stroke="${INK}" stroke-width="4" filter="url(#glow)"/><path d="M-40 -598 L40 -598" stroke="#fff" stroke-width="3" opacity=".8"/>` : `${eye(-20, -594, -1)}${eye(20, -594, 1)}`}
    <path d="M-36 -617 L-8 -607 M36 -617 L8 -607" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    ${mouth}
    ${hairSw(hair + bangs)}`;
  const torso = `
    <path d="M-74 -514 Q0 -534 74 -514 L52 -330 L58 -288 L-58 -288 L-52 -330Z" fill="${INK}"/>
    <path d="M58 -508 L40 -330 L58 -290" fill="none" stroke="${PAPER}" stroke-width="3" opacity=".55"/>
    <path d="M-66 -500 L-30 -440 L0 -470 L30 -440 L66 -500" fill="none" stroke="${A}" stroke-width="6" stroke-linejoin="round"/>
    <polygon points="0,-470 -26,-426 26,-426" fill="${A}" stroke="${PAPER}" stroke-width="3"/>
    <rect x="-54" y="-330" width="108" height="20" fill="${A}" stroke="${INK}" stroke-width="3"/>
    ${c.coat ? `<path d="M-76 -512 L-60 -520 L-20 -440 L-14 -150 L-104 -130 Z M76 -512 L60 -520 L20 -440 L14 -150 L104 -130 Z" fill="${PAPER}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-80 -300 L-40 -290 M80 -300 L40 -290" stroke="${INK}" stroke-width="3"/><path d="M-40 -470 L-24 -440" stroke="${RED}" stroke-width="6"/>` : ''}`;
  // bras arrière / avant selon le côté
  const upper = `<g transform="rotate(${J.lean} 0 -300)">${torso}${prof ? sw(head, [0, -530], prof[4], prof[5]) : head}</g>`;
  const armL = prof ? sw(arm(J.la), J.la[0], prof[0], prof[1]) : arm(J.la), armR = prof ? sw(arm(J.ra), J.ra[0], prof[2], prof[3]) : arm(J.ra);
  return `<g transform="translate(0 ${f(-J.ground)})"><g class="br" style="transform-origin:0px ${f(J.ground)}px;animation-delay:-${f(rnd(0, 1.4))}s">${armL}${leg(J.ll, false)}${leg(J.rl, true)}${upper}${armR}</g></g>`;
};
// position monde d'une main : figure placée en (X,Y), échelle s, miroir m
export const hand = (pose, side, X, Y, s, m = 1) => {
  const J = joints(POSES[pose]), h = J[side][2];
  return [X + m * s * h[0], Y + s * (h[1] - J.ground)];
};
export const put = (body, x, y, s, m = 1, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot}) scale(${m * s} ${s})">${body}</g>`;

// ---------- Gros plan sur les yeux ----------
export const bigEyes = (cx, cy, who) => {
  const A = CH[who].accent;
  const one = (x, s) => `
    <path d="M${x - 150 * s} ${cy + 20} Q${x - 20 * s} ${cy - 95} ${x + 150 * s} ${cy - 30} L${x + 132 * s} ${cy + 40} Q${x} ${cy + 75} ${x - 140 * s} ${cy + 36}Z" fill="#fff" stroke="${INK}" stroke-width="7"/>
    <g clip-path="url(#eyeclip${s > 0 ? 'R' : 'L'}_${who})">
      <g class="dart" style="animation-delay:-${f(rnd(0, 1.6))}s">
      <circle cx="${x + 10 * s}" cy="${cy - 4}" r="72" fill="${A}" filter="url(#glow)"/>
      <circle cx="${x + 10 * s}" cy="${cy - 4}" r="72" fill="none" stroke="${INK}" stroke-width="10"/>
      <circle cx="${x + 10 * s}" cy="${cy - 4}" r="44" fill="url(#iris_${who})"/>
      <circle cx="${x + 10 * s}" cy="${cy - 4}" r="22" fill="${INK}"/>
      <circle cx="${x + 34 * s}" cy="${cy - 30}" r="14" fill="#fff"/><circle cx="${x - 12 * s}" cy="${cy + 22}" r="6" fill="#fff"/>
      </g>
    </g>
    <path d="M${x - 160 * s} ${cy + 16} Q${x - 20 * s} ${cy - 108} ${x + 160 * s} ${cy - 34}" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>
    <path d="M${x - 150 * s} ${cy - 120} L${x + 150 * s} ${cy - 150}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>`;
  clipDefs += [-1, 1].map((s) => { const x = cx + 210 * s; return `<clipPath id="eyeclip${s > 0 ? 'R' : 'L'}_${who}"><path d="M${x - 150 * s} ${cy + 20} Q${x - 20 * s} ${cy - 95} ${x + 150 * s} ${cy - 30} L${x + 132 * s} ${cy + 40} Q${x} ${cy + 75} ${x - 140 * s} ${cy + 36}Z"/></clipPath>`; }).join('');
  return one(cx - 210, -1) + one(cx + 210, 1) + `<path d="M${cx - 20} ${cy + 130} Q${cx} ${cy + 150} ${cx + 30} ${cy + 128}" stroke="${INK}" stroke-width="7" fill="none"/>`;
};

// ---------- Le Traqueur (robot chasseur), centre du torse en (0,0) ----------
const robotArmT = (B, Tm, E) => `<path d="M-300 -260 L-420 140 L-330 170 L-230 -200Z" fill="${B}" stroke="${Tm}" stroke-width="4"/>
    <rect x="-440" y="120" width="130" height="150" rx="16" fill="${B}" stroke="${Tm}" stroke-width="4"/>
    <circle cx="-375" cy="250" r="34" fill="${E}" filter="url(#glow)"/><circle cx="-375" cy="250" r="16" fill="#fff"/>`;
export const rsw = (body, o, r, d) => `<g class="sw" style="transform-origin:${o[0]}px ${o[1]}px;--r:${r}deg;animation-duration:${d}s;animation-delay:-${f(rnd(0, d))}s">${body}</g>`;
export const robotG = (amp = 1, o = {}) => { const B = o.body || INK, Tm = o.trim || PAPER, E = o.eye || RED; const robotArm = robotArmT(B, Tm, E); return `<g>
  <path d="M-200 140 L-260 700 L-120 700 L-90 160Z M200 140 L260 700 L120 700 L90 160Z" fill="${B}" stroke="${Tm}" stroke-width="4"/>
  <path d="M-240 420 L-140 420 M240 420 L140 420" stroke="${E}" stroke-width="10"/>
  <path d="M-270 -330 L270 -330 L230 60 L130 170 L-130 170 L-230 60Z" fill="${B}" stroke="${Tm}" stroke-width="5"/>
  <path d="M-270 -330 L-230 60 L-130 170 L-100 -320Z" fill="url(#toneL)" opacity=".5"/>
  <path d="M-180 -270 L180 -270 L150 -40 L-150 -40Z" fill="none" stroke="${Tm}" stroke-width="3" opacity=".5"/>
  <g class="epulse" style="transform-origin:0px -110px"><path d="M-56 -100 L-24 -100 L-24 -120 A62 62 0 1 1 24 -120 L24 -100 L56 -100" fill="none" stroke="${E}" stroke-width="16" stroke-linejoin="round"/></g>
  <g fill="${Tm}" opacity=".7"><circle cx="-200" cy="-300" r="7"/><circle cx="200" cy="-300" r="7"/><circle cx="-160" cy="20" r="7"/><circle cx="160" cy="20" r="7"/></g>
  ${rsw(robotArm, [-265, -230], 6 * amp, 1.1)}
  <g transform="scale(-1 1)">${rsw(robotArm, [-265, -230], 6 * amp, 0.9)}</g>
  <path d="M-420 -210 C-430 -350 -330 -400 -200 -380 L-170 -260 C-260 -270 -340 -240 -420 -210Z" fill="${B}" stroke="${Tm}" stroke-width="5"/>
  <path d="M420 -210 C430 -350 330 -400 200 -380 L170 -260 C260 -270 340 -240 420 -210Z" fill="${B}" stroke="${Tm}" stroke-width="5"/>
  <rect x="-380" y="-430" width="120" height="70" fill="${B}" stroke="${Tm}" stroke-width="4" transform="rotate(-12 -320 -395)"/>
  <g fill="${E}" class="flick1"><circle cx="-350" cy="-388" r="10"/><circle cx="-320" cy="-394" r="10"/><circle cx="-290" cy="-400" r="10"/></g>
  ${rsw(`<path d="M-120 -540 L120 -540 L146 -410 L84 -330 L-84 -330 L-146 -410Z" fill="${B}" stroke="${Tm}" stroke-width="5"/>
  <path d="M-150 -560 L-120 -640 L-100 -545 M150 -560 L120 -640 L100 -545" fill="${B}" stroke="${Tm}" stroke-width="4"/>
  <rect x="-110" y="-462" width="220" height="40" rx="6" fill="#2a0005"/>${o.twin ? `<g class="epulse" style="transform-origin:-60px -442px"><ellipse cx="-60" cy="-442" rx="30" ry="14" fill="${E}" filter="url(#glow)"/></g><g class="epulse" style="transform-origin:60px -442px"><ellipse cx="60" cy="-442" rx="30" ry="14" fill="${E}" filter="url(#glow)"/></g>` : ''}
  ${o.twin ? '' : `<g class="epulse" style="transform-origin:0px -442px"><ellipse cx="0" cy="-442" rx="46" ry="14" fill="${E}" filter="url(#glow)"/><ellipse cx="0" cy="-442" rx="16" ry="6" fill="#fff"/></g>`}
  <path d="M-60 -370 L60 -370 M-50 -350 L50 -350" stroke="${Tm}" stroke-width="4" opacity=".6"/>`, [0, -330], 4 * amp, 1.4)}
</g>` };
export const ROBOT_EYE = [0, -442];

// ---------- Décors ----------
export const city = (y0, dark = INK, lit = VOLTA) => {
  let s = '', w2 = '', x = -20;
  while (x < W + 40) {
    const w = rnd(80, 170), h = rnd(200, 520), top = y0 - h;
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(H - top)}"/>`;
    for (let yy = top + 30; yy < y0 + 120; yy += 46) for (let xx = x + 16; xx < x + w - 24; xx += 34) if (rnd() > 0.72) w2 += `<rect x="${f(xx)}" y="${f(yy)}" width="14" height="20"/>`;
    x += w + rnd(4, 20);
  }
  return `<g fill="${dark}">${s}</g><g fill="${lit}" opacity=".55">${w2}</g>`;
};
export const nightSky = `<rect width="${W}" height="${H}" fill="${NIGHT}"/><rect width="${W}" height="${H}" fill="url(#toneP)" opacity=".12"/>`;
export const searchlight = (x, cls, delay) => an(cls, delay, `<polygon points="${x - 18},${H} ${x + 18},${H} ${x + 200},-100 ${x - 200},-100" fill="${PAPER}" opacity=".13"/>`, [x, H]);
export const car = (cx, cy, s, color) => `<g transform="translate(${cx} ${cy}) scale(${s})">
  <path d="M-170 0 L-170 -50 Q-160 -70 -120 -74 L-70 -120 Q-50 -134 -10 -134 L70 -134 Q100 -134 120 -100 L150 -74 Q180 -70 180 -40 L180 0Z" fill="${INK}" stroke="${color}" stroke-width="10" filter="url(#glow)"/>
  <path d="M-60 -112 L-20 -112 L-20 -80 L-96 -80Z M0 -112 L66 -112 L100 -80 L0 -80Z" fill="${PAPER}" opacity=".8"/>
  <circle cx="-100" cy="4" r="34" fill="${INK}" stroke="${PAPER}" stroke-width="5"/><circle cx="110" cy="4" r="34" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>
</g>`;
export const aura = (cx, cy, color, n = 3, r0 = 120, delay = 0) => Array.from({ length: n }, (_, i) =>
  an('ripple', delay + i * 0.4, `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="none" stroke="${color}" stroke-width="8" filter="url(#glow)"/>`, [cx, cy], ';animation-iteration-count:infinite')).join('');
export const crystal = (x, yb, w, h, lean = 0) => `<polygon points="${f(x - w / 2)},${yb} ${f(x - w / 2 + lean)},${f(yb - h * 0.8)} ${f(x + lean * 1.3)},${f(yb - h)} ${f(x + w / 2 + lean)},${f(yb - h * 0.78)} ${f(x + w / 2)},${yb}" fill="#c8f1ff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M${f(x + lean * 1.3)} ${f(yb - h)} L${f(x + lean * 0.3)} ${yb}" stroke="${GIVRE}" stroke-width="5"/>
  <polygon points="${f(x + lean * 1.3)},${f(yb - h)} ${f(x + w / 2 + lean)},${f(yb - h * 0.78)} ${f(x + w / 2)},${yb} ${f(x + lean * 0.3)},${yb}" fill="${GIVRE}" opacity=".45"/>`;
export const smoke = (cx, cy, n, spread, color = '#8a8a96', op = 0.8) => {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${f(cx + rnd(-spread, spread))}" cy="${f(cy + rnd(-spread * 0.4, spread * 0.4))}" r="${f(rnd(50, 120))}"/>`;
  return `<g fill="${color}" opacity="${op}" stroke="${INK}" stroke-width="5">${s}</g>`;
};

export const reticle = (x, y, r, d) => an('lock', d, `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${RED}" stroke-width="7"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="none" stroke="${RED}" stroke-width="4"/>
  <path d="M${x - r - 30} ${y} L${x - r * 0.55} ${y} M${x + r * 0.55} ${y} L${x + r + 30} ${y} M${x} ${y - r - 30} L${x} ${y - r * 0.55} M${x} ${y + r * 0.55} L${x} ${y + r + 30}" stroke="${RED}" stroke-width="7"/>`, [x, y]);
// ---------- Mouvement : caméra par plan, fonds débordants, particules ----------
export const BG = (fill) => `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${fill}"/>`;
export const GROUND = (y, fill = INK) => `<rect x="-700" y="${y}" width="${W + 1400}" height="1400" fill="${fill}"/>`;
export const sky = `${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>`;
export const tr = (x, y, r, s) => `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
let cid = 0;
// cam(a, b, [[t, x, y, rot, scale, easing?], …], monde, origine) : mouvement continu de la caméra sur le plan
export const cam = (a, b, frames, body, origin = [540, 960]) => {
  const id = `cam${cid++}`, d = b - a;
  const kf = frames.map(([t, x, y, r, sc, e]) => `${g4(Math.min(100, Math.max(0, ((t - a) / d) * 100)))}%{transform:${tr(x, y, r, sc)}${e ? `;animation-timing-function:${e}` : ''}}`).join(' ');
  css.push(`@keyframes ${id}{${kf}} .${id}{transform-box:view-box;transform-origin:${origin[0]}px ${origin[1]}px;animation:${id} ${d}s ease-in-out ${a}s both}`);
  return `<g class="${id}">${body}</g>`;
};
// particules en boucle : chacune part de (x,y) et dérive de (dx,dy)
export const particles = (n, color, [x0, x1], [y0, y1], [dx, dy], r = [3, 8], dur = [1.4, 2.8], op = 1) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const d = rnd(...dur);
    s += `<circle class="pt" cx="${f(rnd(x0, x1))}" cy="${f(rnd(y0, y1))}" r="${f(rnd(...r))}" style="--dx:${f(dx * rnd(0.6, 1.4))}px;--dy:${f(dy * rnd(0.6, 1.4))}px;animation-duration:${f(d)}s;animation-delay:-${f(rnd(0, d))}s"/>`;
  }
  return `<g fill="${color}" opacity="${op}">${s}</g>`;
};
// traits de vitesse qui filent
export const streaks = (n, color, [y0, y1], dx, w = [3, 7], dur = [0.25, 0.5], ang = 0) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const d = rnd(...dur), l = rnd(120, 420);
    s += `<rect class="pt" x="${f(rnd(-300, W))}" y="${f(rnd(y0, y1))}" width="${f(l)}" height="${f(rnd(...w))}" style="--dx:${f(dx)}px;--dy:0px;animation-duration:${f(d)}s;animation-delay:-${f(rnd(0, d))}s"/>`;
  }
  return `<g fill="${color}" transform="rotate(${ang} 540 960)">${s}</g>`;
};
export const shakeAt = (t, body, n = 2, cls = 'shake') => an(cls, t, body, null, `;animation-iteration-count:${n}`);
export const flashAt = (t) => vis(t, t + 0.4, `<rect class="flash" style="animation-delay:${t}s" width="${W}" height="${H}" fill="#fff"/>`);

// ---------- Mouvements génériques ----------
// mv : arrive depuis un décalage [dx,dy] jusqu'à sa place ; go : part de sa place vers [dx,dy] (reste à l'arrivée)
let mid = 0;
const moveCls = (t, d, from, to, ease) => {
  const id = `mv${mid++}`;
  css.push(`@keyframes ${id}{from{transform:${from}}to{transform:${to}}} .${id}{transform-box:view-box;transform-origin:0 0;animation:${id} ${d}s ${ease} ${t}s both}`);
  return id;
};
export const mv = (t, d, [dx, dy], body, ease = 'cubic-bezier(.3,.7,.3,1)', rot = 0) =>
  `<g class="${moveCls(t, d, `translate(${dx}px,${dy}px) rotate(${rot}deg)`, 'translate(0,0) rotate(0deg)', ease)}">${body}</g>`;
export const go = (t, d, [dx, dy], body, ease = 'cubic-bezier(.5,0,.8,.5)', rot = 0) =>
  `<g class="${moveCls(t, d, 'translate(0,0) rotate(0deg)', `translate(${dx}px,${dy}px) rotate(${rot}deg)`, ease)}">${body}</g>`;
// keyframes libres : anim(t, d, ['0%{…}', '100%{…}'], body, { origin, ease, iter })
export const anim = (t, d, frames, body, o = {}) => {
  const id = `ak${mid++}`;
  css.push(`@keyframes ${id}{${frames.join(' ')}} .${id}{transform-box:view-box;transform-origin:${o.origin ? `${o.origin[0]}px ${o.origin[1]}px` : '0 0'};animation:${id} ${d}s ${o.ease || 'ease-in-out'} ${t}s ${o.iter || 1} ${o.dir || 'normal'} both}`);
  return `<g class="${id}">${body}</g>`;
};
export const fadeIn = (t, d, body) => anim(t, d, ['from{opacity:0}', 'to{opacity:1}'], body);
export const fadeOut = (t, d, body) => anim(t, d, ['from{opacity:1}', 'to{opacity:0}'], body);
export const ghost = (body, lo = 0.18, hi = 0.5) => anim(0, 0.9, [`from{opacity:${lo}}`, `to{opacity:${hi}}`], body, { iter: 'infinite', dir: 'alternate' });
export const bobbing = (body, amp = 14, d = 1) => anim(-rnd(0, d), d, [`from{transform:translate(0,-${amp}px)}`, `to{transform:translate(0,${amp}px)}`], body, { iter: 'infinite', dir: 'alternate' });
export const spin = (cx, cy, d, body) => anim(0, d, ['from{transform:rotate(0deg)}', 'to{transform:rotate(360deg)}'], body, { origin: [cx, cy], ease: 'linear', iter: 'infinite' });

// ---------- Nouveaux éléments récurrents ----------
// drone OMEGA (centre 0,0) : disque noir, œil rouge, rotors qui clignotent
export const droneG = (eye = RED) => `<g>
  <g class="flick1"><ellipse cx="-70" cy="-34" rx="56" ry="9" fill="${PAPER}" opacity=".55"/><ellipse cx="70" cy="-34" rx="56" ry="9" fill="${PAPER}" opacity=".55"/></g>
  <path d="M-70 -30 L-30 -10 M70 -30 L30 -10" stroke="${INK}" stroke-width="10"/>
  <path d="M-46 -12 L46 -12 L36 22 L-36 22Z" fill="${INK}" stroke="${PAPER}" stroke-width="3"/>
  <g class="epulse" style="transform-origin:0px 6px"><circle cx="0" cy="6" r="13" fill="${eye}" filter="url(#glow)"/></g>
  <path d="M-12 22 L-20 40 M12 22 L20 40" stroke="${INK}" stroke-width="6"/></g>`;
export const drone = (x, y, s = 1, eye = RED) => put(bobbing(droneG(eye), 10, rnd(0.5, 0.9)), x, y, s);
export const swarm = (n, [x0, x1], [y0, y1], [s0, s1] = [0.3, 0.7], eye = RED) =>
  Array.from({ length: n }, () => drone(f(rnd(x0, x1)), f(rnd(y0, y1)), f(rnd(s0, s1) * 100) / 100, eye)).join('');
// écran holographique (cadre + lignes de balayage qui défilent), contenu clippé
let hid = 0;
export const holo = (x, y, w, h, body, color = RED) => {
  const id = `h${hid++}`;
  clipDefs += `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
  const lines = Array.from({ length: Math.ceil(h / 24) + 2 }, (_, i) => `<rect x="${x}" y="${y + i * 24 - 24}" width="${w}" height="6"/>`).join('');
  return `<g class="flick1" style="animation-duration:.5s"><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity=".16"/>${body}
    <g fill="${color}" opacity=".18" class="scanlines" style="animation-iteration-count:infinite;animation-duration:.6s">${lines}</g></g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="6" filter="url(#glow)"/></g>`;
};
// Tour OMEGA (base au sol yb, centre x)
export const tower = (x, yb, s = 1) => {
  let win = '';
  for (let yy = -1500; yy < -60; yy += 70) for (const dx of [-90, -30, 30, 90]) if (rnd() > 0.45) win += `<rect x="${dx - 12}" y="${yy}" width="24" height="34"/>`;
  return put(`<path d="M-200 0 L-160 -1500 L-60 -1700 L-40 -1960 L40 -1960 L60 -1700 L160 -1500 L200 0Z" fill="${INK}" stroke="${RED}" stroke-width="6"/>
    <path d="M-160 -1500 L160 -1500" stroke="${RED}" stroke-width="5" opacity=".7"/>
    <g fill="${RED}" opacity=".75">${win}</g>
    <g class="epulse" style="transform-origin:0px -1620px"><path d="M-46 -1600 L-18 -1600 L-18 -1616 A50 50 0 1 1 18 -1616 L18 -1600 L46 -1600" fill="none" stroke="${RED}" stroke-width="13" filter="url(#glow)"/></g>
    <circle cx="0" cy="-1960" r="14" fill="${RED}" class="flick1"/>`, x, yb, s);
};
// cuve de laboratoire (base yb), avec un dormeur en silhouette de couleur
export const tube = (x, yb, color, s = 1, who = null) => put(`
  <rect x="-110" y="-700" width="220" height="660" rx="30" fill="${color}" opacity=".22"/>
  ${who ? `<g opacity=".85">${put(figure(who, 'float', { anim: 'still', float: true }), 0, -120, 0.85)}</g>` : `<path d="M0 -560 C-50 -560 -50 -480 0 -480 C50 -480 50 -560 0 -560Z M-40 -470 L40 -470 L30 -260 L-30 -260Z" fill="${INK}" opacity=".7"/>`}
  ${particles(6, '#fff', [-80, 80], [-640, -120], [0, -200], [3, 6], [1.2, 2.2], 0.7)}
  <rect x="-110" y="-700" width="220" height="660" rx="30" fill="none" stroke="${color}" stroke-width="8" filter="url(#glow)"/>
  <path d="M-70 -660 L-70 -100" stroke="#fff" stroke-width="10" opacity=".35"/>
  <rect x="-140" y="-760" width="280" height="70" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>
  <rect x="-140" y="-50" width="280" height="70" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>
  <circle cx="0" cy="-15" r="12" fill="${color}" class="flick1"/>`, x, yb, s);
// toits (sol à y0) avec château d'eau et antennes
export const rooftops = (y0, dark = '#07070b', lit = VOLTA) => {
  let s = '', x = -700;
  while (x < W + 700) {
    const w = rnd(220, 420), h = rnd(0, 120);
    s += `<rect x="${f(x)}" y="${f(y0 - h)}" width="${f(w)}" height="${f(1600 + h)}"/>`;
    if (rnd() > 0.6) s += `<path d="M${f(x + w * 0.4)} ${f(y0 - h)} L${f(x + w * 0.4)} ${f(y0 - h - rnd(100, 220))}" stroke="${dark}" stroke-width="8"/>`;
    x += w + rnd(10, 40);
  }
  return `<g fill="${dark}">${s}</g><g fill="${lit}" opacity=".5">${Array.from({ length: 30 }, () => `<rect x="${f(rnd(-700, W + 700))}" y="${f(rnd(y0 + 20, y0 + 600))}" width="14" height="20"/>`).join('')}</g>`;
};
export const waterTower = (x, yb, s = 1) => put(`<path d="M-120 0 L-90 -260 M120 0 L90 -260 M-100 -120 L100 -120" stroke="${INK}" stroke-width="16" fill="none"/>
  <path d="M-150 -260 L150 -260 L140 -520 L0 -600 L-140 -520Z" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>
  <path d="M-140 -340 L140 -340 M-140 -430 L140 -430" stroke="${PAPER}" stroke-width="3" opacity=".5"/>
  <rect x="-40" y="-330" width="80" height="60" fill="${VOLTA}" opacity=".8"/>`, x, yb, s);
// pluie oblique en boucle
export const rain = (n = 60, color = '#9aa3b8', op = 0.5) => `<g opacity="${op}">${streaks(n, color, [-400, 2300], 1400, [2, 3], [0.35, 0.6], 78)}</g>`; // pluie presque verticale

// ---------- Couche HUD (textes hors caméra) ----------
export const header = (n, title, t = 0.05) => an('pop', t, `<rect x="140" y="226" width="800" height="62" fill="${INK}" stroke="${RED}" stroke-width="4"/>
  <text x="540" y="270" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:34px;letter-spacing:6px">ÉPISODE ${n} · ${title.toUpperCase()}</text>`);
export const logo = (t = 0.1, y = 420, size = 120) => an('slam', t, `<text x="540" y="${y}" class="title" style="font-size:${size}px">LES ANOMALIES</text>`);
export const hook = (text, t = 0.3, y = 1440, size = 44) => an('pop', t, `<text data-role="hook" x="540" y="${y}" class="cap" text-anchor="middle" fill="${PAPER}" stroke="${INK}" stroke-width="8" paint-order="stroke" style="font-size:${size}px">${text}</text>`);
export const caption = (text, t, y = 1440, size = 40, fill = PAPER) => an('pop', t, `<text x="540" y="${y}" class="cap" text-anchor="middle" fill="${fill}" stroke="${INK}" stroke-width="8" paint-order="stroke" style="font-size:${size}px">${text}</text>`);
// carton final immobile (≥ 2,8 s) : ne jamais l'animer en échelle
export const finalCard = (t = 36.9, sub = 'À SUIVRE…', y = 1180) => `${vis(t, T, `<rect x="-10" y="${y - 130}" width="${W + 20}" height="${sub ? 280 : 190}" fill="${INK}" opacity=".62"/>`)}${an('pop', t, `<text data-role="final" x="540" y="${y}" class="title" style="font-size:120px">LES ANOMALIES</text>`)}
  ${an('pop', t + 0.25, `<text x="540" y="${y + 100}" class="cap" text-anchor="middle" fill="${PAPER}" stroke="${INK}" stroke-width="8" paint-order="stroke" style="font-size:44px;letter-spacing:10px">${sub}</text>`)}`;

// ---------- Assemblage ----------
const STYLE = () => `
  .onom{font-family:Impact,'Arial Black',sans-serif;font-style:italic;text-anchor:middle;paint-order:stroke;stroke-linejoin:round;letter-spacing:4px}
  .title{font-family:Impact,'Arial Black',sans-serif;text-anchor:middle;fill:${PAPER};stroke:${RED};stroke-width:10px;paint-order:stroke;letter-spacing:6px}
  .bt{font-family:'Avenir Next Condensed','Arial Narrow',sans-serif;font-weight:800;font-size:42px;text-anchor:middle;fill:${INK}}
  .rt{font-family:Menlo,'Courier New',monospace;font-weight:700;font-size:44px;text-anchor:middle;fill:#ff4a4a}
  .cap{font-family:'Avenir Next Condensed','Arial Narrow',sans-serif;font-weight:700;font-size:36px}
  .tagn{font-family:Impact,'Arial Black',sans-serif;font-size:44px;letter-spacing:3px}
  .tagp{font-family:'Avenir Next Condensed','Arial Narrow',sans-serif;font-weight:700;font-size:36px;letter-spacing:1px}
  .pop,.slam,.zoomslow{transform-box:fill-box;transform-origin:center}
  .descend,.hover,.shake,.shakeS,.leapA,.leapB,.leapC,.rise,.liftA,.liftB,.throwA,.throwB,.bob,.inL,.inR,.fly,.drift,.chunk{transform-box:view-box;transform-origin:0 0}
  .swayL,.swayR,.scan,.impact,.ripple,.beamIn,.beamUp,.eyeOpen{transform-box:view-box}
  .scanDown{transform-box:view-box;animation:scanDown 1.1s linear both}
  .lock{transform-box:view-box;animation:lock .3s cubic-bezier(.2,1.5,.4,1) both}
  .pop{animation:pop .22s cubic-bezier(.2,1.6,.4,1) both}
  .slam{animation:slam .3s cubic-bezier(.2,1.8,.4,1) both}
  .zoomslow{animation:zoomslow 3.5s ease-out both}
  .swayL{animation:sway 3.5s ease-in-out both}
  .swayR{animation:sway 3.5s ease-in-out reverse both}
  .descend{animation:descend 1.4s cubic-bezier(.2,.8,.3,1) both}
  .hover{animation:hover 1.2s ease-in-out alternate}
  .scan{animation:scan 1.6s ease-in-out both}
  .flick1{animation:flick .16s steps(1) infinite}
  .flick2{animation:flick .16s steps(1) infinite reverse}
  .inL{animation:inL .28s cubic-bezier(.2,1.2,.4,1) both}
  .inR{animation:inR .28s cubic-bezier(.2,1.2,.4,1) both}
  .ripple{animation:ripple 1.2s ease-out both}
  .trail{stroke-dasharray:1;animation:draw .6s ease-out both}
  .draw{stroke-dasharray:1;animation:draw .4s ease-out both}
  .fly{animation:fly .6s cubic-bezier(.4,0,.8,.6) both}
  .impact{animation:impact .45s cubic-bezier(.2,1.5,.4,1) both}
  .flash{animation:flash .35s ease-out both}
  .drift{animation:drift 3s ease-out both}
  .leapA{animation:leapA 1.6s cubic-bezier(.2,.8,.3,1) both}
  .leapB{animation:leapB 1.6s cubic-bezier(.2,.8,.3,1) both}
  .leapC{animation:leapC 1.6s cubic-bezier(.2,.8,.3,1) both}
  .rise{animation:rise .5s cubic-bezier(.2,1.3,.4,1) both}
  .beamIn{animation:beamIn .2s ease-out both}
  .beamUp{animation:beamUp .3s ease-out both}
  .bob{animation:bob 1s ease-in-out alternate}
  .liftA{animation:lift 1.3s cubic-bezier(.3,.8,.3,1) both}
  .liftB{animation:lift2 1.3s cubic-bezier(.3,.8,.3,1) both}
  .throwA{animation:throwA .5s cubic-bezier(.6,0,.9,.5) both}
  .throwB{animation:throwB .5s cubic-bezier(.6,0,.9,.5) both}
  .flow{animation:flow .4s linear infinite}
  .shake{animation:shake .5s linear both}
  .shakeS{animation:shakeS .4s linear both}
  .chunk{animation:chunk 1.6s cubic-bezier(.1,.7,.3,1) both}
  .eyeOpen{animation:eyeOpen .6s cubic-bezier(.2,1.4,.4,1) both}
  @keyframes scanDown{from{transform:translate(0,0)}to{transform:translate(0,560px)}}
  @keyframes lock{from{transform:scale(2.2) rotate(45deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
  .sw,.br,.pt,.throb,.parx,.dart,.grow,.epulse,.wob,.dropIn,.pulse,.beat,.spinS,.zoomP,.blink,.scanlines{transform-box:view-box}
  .sw{animation:sw 1s ease-in-out infinite alternate}
  .br{animation:br 1.4s ease-in-out infinite alternate}
  .pt{animation:pt 2s linear infinite}
  .throb{animation:throb .28s ease-in-out infinite alternate}
  .parx{animation:parx 4s ease-in-out both}
  .dart{animation:dart 1.6s ease-in-out infinite}
  .grow{animation:grow .45s cubic-bezier(.2,1.5,.4,1) both}
  .epulse{animation:epulse .5s ease-in-out infinite alternate}
  .wob{animation:wob .7s ease-in-out alternate}
  .dropIn{animation:dropIn .55s cubic-bezier(.5,0,.9,.6) both}
  .pulse{animation:pulse .3s ease-in-out alternate}
  .beat{animation:beat .45s ease-in-out alternate}
  .spinS{animation:spinS 1.6s linear both}
  .zoomP{animation:zoomP 4.5s ease-out both}
  .blink{animation:blinkO .5s steps(1) infinite}
  .scanlines{animation:scanl 1.2s linear}
  @keyframes sw{from{transform:rotate(calc(var(--r) * -1))}to{transform:rotate(var(--r))}}
  @keyframes br{from{transform:scale(1,1)}to{transform:scale(1.015,1.03)}}
  @keyframes pt{0%{transform:translate(0,0);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
  @keyframes throb{from{transform:scale(1) rotate(0deg)}to{transform:scale(1.06) rotate(2deg)}}
  @keyframes parx{from{transform:translate(0,0)}to{transform:translate(-60px,0)}}
  @keyframes dart{0%,100%{transform:translate(0,0)}30%{transform:translate(14px,-4px)}60%{transform:translate(-12px,3px)}}
  @keyframes grow{from{transform:scale(1,0)}to{transform:scale(1,1)}}
  @keyframes epulse{from{transform:scale(1)}to{transform:scale(1.18,1.3)}}
  @keyframes wob{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
  @keyframes dropIn{from{transform:translate(0,-420px)}to{transform:translate(0,0)}}
  @keyframes pulse{from{transform:scale(.9);opacity:.6}to{transform:scale(1.12);opacity:1}}
  @keyframes beat{from{transform:scale(1)}to{transform:scale(1.035)}}
  @keyframes spinS{from{transform:rotate(0deg)}to{transform:rotate(40deg)}}
  @keyframes zoomP{from{transform:scale(1.15)}to{transform:scale(1)}}
  @keyframes blinkO{0%{opacity:1}50%{opacity:.35}}
  @keyframes scanl{from{transform:translate(0,0)}to{transform:translate(0,60px)}}
  @keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
  @keyframes slam{from{opacity:0;transform:scale(2.4)}to{opacity:1;transform:scale(1)}}
  @keyframes zoomslow{from{transform:scale(1)}to{transform:scale(1.07)}}
  @keyframes sway{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
  @keyframes descend{from{transform:translate(0,-1500px)}to{transform:translate(0,0)}}
  @keyframes hover{from{transform:translate(0,-10px)}to{transform:translate(0,12px)}}
  @keyframes scan{0%{transform:rotate(-24deg);opacity:0}15%{opacity:1}50%{transform:rotate(22deg)}100%{transform:rotate(0deg);opacity:1}}
  @keyframes flick{0%{opacity:1}50%{opacity:.15}}
  @keyframes inL{from{transform:translate(-1100px,0)}to{transform:translate(0,0)}}
  @keyframes inR{from{transform:translate(1100px,0)}to{transform:translate(0,0)}}
  @keyframes ripple{from{transform:scale(.4);opacity:1}to{transform:scale(2.2);opacity:0}}
  @keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
  @keyframes fly{from{transform:translate(var(--fx),var(--fy))}to{transform:translate(0,0)}}
  @keyframes impact{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes flash{from{opacity:.7}to{opacity:0}}
  @keyframes drift{from{transform:translate(0,40px);opacity:0}30%{opacity:1}to{transform:translate(0,-60px);opacity:1}}
  @keyframes leapA{from{transform:translate(130px,420px)}to{transform:translate(0,0)}}
  @keyframes leapB{from{transform:translate(-420px,40px)}to{transform:translate(0,0)}}
  @keyframes leapC{from{transform:translate(-300px,-200px)}to{transform:translate(0,0)}}
  @keyframes rise{from{transform:translate(0,1500px)}to{transform:translate(0,0)}}
  @keyframes beamIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes beamUp{from{transform:scale(1,0)}to{transform:scale(1,1)}}
  @keyframes bob{from{transform:translate(0,-14px)}to{transform:translate(0,14px)}}
  @keyframes lift{from{transform:translate(0,0) rotate(0deg)}to{transform:translate(-40px,-420px)}}
  @keyframes lift2{from{transform:translate(0,0)}to{transform:translate(-60px,-560px)}}
  @keyframes throwA{from{transform:translate(0,0)}to{transform:translate(900px,-1300px)}}
  @keyframes throwB{from{transform:translate(0,0)}to{transform:translate(800px,-1400px)}}
  @keyframes flow{from{stroke-dashoffset:64}to{stroke-dashoffset:0}}
  @keyframes shake{0%,100%{transform:translate(0,0)}10%{transform:translate(-22px,10px)}20%{transform:translate(18px,-14px)}30%{transform:translate(-14px,16px)}40%{transform:translate(20px,6px)}50%{transform:translate(-16px,-12px)}60%{transform:translate(12px,14px)}70%{transform:translate(-9px,-7px)}80%{transform:translate(7px,8px)}90%{transform:translate(-4px,-3px)}}
  @keyframes shakeS{0%,100%{transform:translate(0,0)}25%{transform:translate(-8px,5px)}50%{transform:translate(7px,-6px)}75%{transform:translate(-5px,-4px)}}
  @keyframes chunk{from{transform:translate(0,0) rotate(0deg);opacity:1}to{transform:translate(var(--cx),var(--cy)) rotate(var(--cr));opacity:1}}
  @keyframes eyeOpen{from{transform:scale(1,0)}to{transform:scale(1,1)}}
  ${css.join('\n  ')}
`;
// build(import.meta.url, 'les-anomalies-ep2') → <nom>.svg + timeline.json dans le dossier de l'épisode
export const build = (base, name) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-duration="${T}" data-fps="30" data-music="audio.wav">
<defs>
  <pattern id="tone" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="6" cy="6" r="2.6" fill="${INK}"/></pattern>
  <pattern id="toneL" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="1.6" fill="${PAPER}"/></pattern>
  <pattern id="toneP" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="7" cy="7" r="2.4" fill="${PAPER}"/></pattern>
  <radialGradient id="vglow"><stop offset="0" stop-color="${VOLTA}" stop-opacity=".55"/><stop offset="1" stop-color="${VOLTA}" stop-opacity="0"/></radialGradient>
  <radialGradient id="rglow"><stop offset="0" stop-color="${RED}" stop-opacity=".55"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
  <radialGradient id="gglow"><stop offset="0" stop-color="${MIRAGE}" stop-opacity=".5"/><stop offset="1" stop-color="${MIRAGE}" stop-opacity="0"/></radialGradient>
  ${Object.keys(CH).map((k) => `<radialGradient id="iris_${k}"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="${CH[k].accent}"/><stop offset="1" stop-color="${INK}"/></radialGradient>`).join('')}
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  ${clipDefs}
</defs>
<style>${STYLE()}</style>
<rect width="${W}" height="${H}" fill="${INK}"/>
${scenes.join('\n')}
</svg>`;
  writeFileSync(new URL(`./${name}.svg`, base), svg);
  writeFileSync(new URL('./timeline.json', base), JSON.stringify({ duration: T, lines: LINES, sfx: SFX.sort((a, b) => a.t - b.t) }, null, 1));
  console.log(`${name}.svg écrit,`, scenes.length, 'plans,', Math.round(svg.length / 1024), 'Ko');
};
