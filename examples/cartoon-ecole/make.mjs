// Renard & Lapin vont à l'école — 30 s, 1280x720, 4 scènes en plans coupés.
// Génère cartoon-ecole.svg + timeline.json (répliques et effets pour audio.py).
import { writeFileSync } from 'node:fs';

const W = 1280, H = 720;
const INK = '#3a2418';
const lines = []; // {who,t0,t1,text}
const sfxEv = []; // {name,t}

// ───────── helpers d'animation (tout est piloté par le temps absolu) ─────────
const an = ({ n, d, e = 'linear', t = 0, c = 1, dir = 'normal', f = 'none' }) =>
  `animation:${n} ${d}s ${e} ${t}s ${c} ${dir} ${f}`;
const vis = (t0, t1, inner) =>
  `<g class="v" style="${an({ n: 'vis', d: t1 - t0, t: t0, f: 'forwards' })}">${inner}</g>`;
const tf = (inner, { t0, d, from, to, e = 'ease-in-out', o = '0px 0px' }) =>
  `<g style="--f:${from};--t:${to};transform-origin:${o};${an({ n: 'tfk', d, e, t: t0, f: 'both' })}">${inner}</g>`;
const shake = (inner, t0, d, s = 8) =>
  `<g style="--s:${s}px;${an({ n: 'shake', d: 0.05, t: t0, c: Math.max(1, Math.round(d / 0.05)), dir: 'alternate' })}">${inner}</g>`;
const scene = (t0, t1, inner) => vis(t0, t1, inner);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// bulle de BD : (x,y) = pointe de la queue, juste au-dessus de la tête
function bub(who, text, x, y, t0, dur, shout = false, local = false) {
  lines.push({ who, t0, t1: t0 + dur, text });
  const fs = shout ? 42 : 34, w = text.length * fs * 0.56 + 56, h = fs + 34;
  const cx = local ? x : Math.min(Math.max(x, w / 2 + 14), W - 14 - w / 2), rel = cx - x;
  const fill = shout ? '#fff36b' : '#ffffff';
  return `<g transform="translate(${x} ${y})"><g style="${an({ n: 'pop', d: dur, t: t0, f: 'both' })}">
  <rect x="${rel - w / 2}" y="${-h - 30}" width="${w}" height="${h}" rx="${shout ? 14 : 26}" fill="${fill}" stroke="${INK}" stroke-width="5"/>
  <path d="M-20 -32 L0 0 L16 -32Z" fill="${fill}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="-17" y="-37" width="31" height="9" fill="${fill}"/>
  <text x="${rel}" y="${-30 - h / 2 + fs * 0.34}" class="bt" style="font-size:${fs}px">${esc(text)}</text></g></g>`;
}
function sfx(text, x, y, t0, dur, rot = 0, fill = '#ffd23f', fs = 110, name) {
  if (name) sfxEv.push({ name, t: t0 });
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><g style="${an({ n: 'sfxk', d: dur, t: t0, f: 'both' })}">
  <text class="sfx" style="font-size:${fs}px;fill:${fill}">${esc(text)}</text></g></g>`;
}

// ───────── personnages (pieds en (0,0), regardent à droite) ─────────
let extraKF = '';
const ss = (x) => x * x * (3 - 2 * x);
const interp = (pts, u) => { for (let i = 0; i < pts.length - 1; i++) { const [a, va] = pts[i], [b, vb] = pts[i + 1]; if (u >= a && u <= b) return va + (vb - va) * ss((u - a) / (b - a)); } return pts[pts.length - 1][1]; };
const runTh = (u) => (u < 0.5 ? -38 + 80 * (u / 0.5) : 42 - 80 * ss((u - 0.5) / 0.5));
const runSh = (u) => { if (u < 0.5) return 6 + 16 * (u / 0.5); const v = (u - 0.5) / 0.5; return v < 0.44 ? 22 + 73 * Math.sin((Math.PI / 2) * v / 0.44) : 95 - 89 * ss((v - 0.44) / 0.56); };
const bTh = (u) => interp([[0, -30], [0.15, 8], [0.3, 48], [0.6, 10], [0.85, -36], [1, -30]], u);
const bSh = (u) => interp([[0, 15], [0.15, 50], [0.3, 8], [0.55, 92], [0.85, 20], [1, 15]], u);
const armR = (u) => -68 * Math.cos(2 * Math.PI * u) - 12;
const armBd = (u) => interp([[0, -10], [0.3, -75], [0.6, -20], [1, -10]], u);
const SHIFT = { A: 0, B: 0.5 }, SHIFT_B = { A: 0, B: 0.1 };
const fns = { thA: [runTh, 0], thB: [runTh, 0.5], shA: [runSh, 0], shB: [runSh, 0.5], bThA: [bTh, 0], bThB: [bTh, 0.1], bShA: [bSh, 0], bShB: [bSh, 0.1], armA: [armR, 0], armB: [armR, 0.5], armBdA: [armBd, 0] };
for (const [name, [fn, sh]] of Object.entries(fns)) {
  let s = `@keyframes ${name}{`;
  for (let i = 0; i <= 28; i++) s += `${((i / 28) * 100).toFixed(2)}%{transform:rotate(${fn(((i % 28) / 28 + sh) % 1).toFixed(1)}deg)}`;
  extraKF += s + '}\n';
}
extraKF += `@keyframes legRestRun{from{transform:rotate(var(--pr))}to{transform:rotate(0)}}
@keyframes legRestBound{from{transform:rotate(var(--pb))}to{transform:rotate(0)}}
@keyframes bobk{0%,100%{transform:translateY(12px)}50%{transform:translateY(0);animation-timing-function:ease-in}}
@keyframes headk{0%,100%{transform:translateY(2px) rotate(2deg)}50%{transform:translateY(-3px) rotate(-3deg)}}
@keyframes forearmk{0%{transform:rotate(0)}10%,90%{transform:rotate(-70deg)}100%{transform:rotate(0)}}
@keyframes idlehead{from{transform:rotate(-2.5deg) translateY(0)}to{transform:rotate(2.5deg) translateY(-2px)}}
@keyframes skidk{0%{transform:rotate(0)}22%{transform:rotate(-17deg)}58%{transform:rotate(6deg)}100%{transform:rotate(0)}}
@keyframes jolt{0%{transform:translateY(0) scale(1)}20%{transform:translateY(-34px) scale(.88,1.18)}45%{transform:translateY(0) scale(1.16,.84)}70%{transform:scale(.97,1.04)}100%{transform:scale(1)}}
@keyframes antic{0%{transform:scale(1)}100%{transform:scale(1.22,.74)}}
@keyframes crawl{0%,100%{transform:scale(.9,1.06)}50%{transform:scale(1.14,.92)}}
@keyframes stalk{from{transform:rotate(-10deg)}to{transform:rotate(12deg)}}
@keyframes sway{from{transform:skewX(-2deg)}to{transform:skewX(2.5deg)}}
@keyframes cdrift{from{transform:translateX(-60px)}to{transform:translateX(70px)}}
@keyframes fallk{0%{transform:none}15%{transform:translate(0px,-8px) rotate(-12deg)}24%{transform:translate(-10px,30px) rotate(-6deg) scale(1.15,.82)}30%{transform:translate(-15px,34px) rotate(-8deg) scale(1.03,.92)}62%{transform:translate(-15px,34px) rotate(-8deg) scale(1.03,.92)}74%{transform:translate(-12px,14px) rotate(-10deg)}84%{transform:translate(-6px,0px) rotate(5deg)}92%{transform:rotate(-3deg)}100%{transform:none}}
@keyframes owlsway{from{transform:rotate(-2deg)}to{transform:rotate(2deg)}}
@keyframes gestk{0%{transform:rotate(var(--r))}15%{transform:rotate(-120deg)}30%{transform:rotate(-95deg)}45%{transform:rotate(-120deg)}60%{transform:rotate(-95deg)}80%{transform:rotate(-115deg)}100%{transform:rotate(var(--r))}}
@keyframes watchk{from{transform:rotate(75deg)}to{transform:rotate(0deg)}}
@keyframes tapk{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes leapk{0%{transform:translate(0px,-95px) scale(1.1,.85)}15%{transform:translate(0px,-130px) scale(.9,1.12)}45%{transform:translate(0px,-250px)}85%{transform:translate(0px,0px) scale(.95,1.05)}92%{transform:translate(0px,6px) scale(1.15,.85)}100%{transform:translate(0px,0px)}}
@keyframes lookback{0%,5.9%{transform:scale(1,1)}6%,93.9%{transform:scale(-1,1)}94%,100%{transform:scale(1,1)}}
@keyframes armdrop{from{transform:rotate(-100deg)}to{transform:rotate(-25deg)}}
@keyframes croidown{0%{transform:none}15%{transform:translate(12px,36px) rotate(22deg)}85%{transform:translate(12px,36px) rotate(22deg)}100%{transform:none}}
@keyframes shhop{0%,100%{transform:scale(1.05,1)}50%{transform:scale(.6,.75);opacity:.12}}
@keyframes shjmp{0%,100%{transform:scale(1.1,1)}50%{transform:scale(.5,.7);opacity:.1}}
`;
const ao = (o) => an(o).slice(10);
const anims = (list) => (list.length ? `animation:${list.join(',')}` : '');
// fenêtres de marche : [{t0,t1,mode:'run'|'bound',P,n}]
const mkWins = (run, hops = [], jumps = [], extra = []) => {
  const w = [];
  for (const [a, b] of extra) { const n = Math.max(1, Math.round((b - a) / 0.36)); w.push({ t0: a, t1: b, mode: 'run', P: (b - a) / n, n }); }
  if (run && !hops.length && !jumps.length) { const n = Math.max(1, Math.round((run[1] - run[0]) / 0.36)); w.push({ t0: run[0], t1: run[1], mode: 'run', P: (run[1] - run[0]) / n, n }); }
  for (const [a, b] of hops) { const n = Math.max(1, Math.round((b - a) / 0.42)); w.push({ t0: a, t1: b, mode: 'run', P: (b - a) / n, n }); }
  for (const [a, b] of jumps) w.push({ t0: a, t1: b, mode: 'bound', P: b - a, n: 1 });
  return w;
};
const poseOf = (kind, mode, part, front) => {
  if (mode === 'run') return (part === 'th' ? runTh : runSh)(SHIFT[kind]);
  return (part === 'th' ? bTh : bSh)(SHIFT_B[front ? 'B' : 'A']);
};
const legAnim = (wins, kind, part, front) => {
  const L = [];
  for (const w of wins) {
    const nm = w.mode === 'run' ? `${part}${kind}` : `b${part[0].toUpperCase()}${part.slice(1)}${front ? 'B' : 'A'}`;
    const rest = w.mode === 'run' ? 'legRestRun' : 'legRestBound';
    if (!wins.some((x) => x !== w && Math.abs(x.t1 - w.t0) < 0.05)) L.push(ao({ n: rest, d: 0.12, e: 'ease-out', t: w.t0 - 0.12, dir: 'reverse' }));
    L.push(ao({ n: nm, d: w.P, t: w.t0, c: w.n }));
    if (!wins.some((x) => x !== w && Math.abs(x.t0 - w.t1) < 0.05)) L.push(ao({ n: rest, d: 0.16, e: 'ease-out', t: w.t1 }));
  }
  return anims(L);
};
const leg = (x, fill, sock, wins, kind, front, th = 36, sh = 36, w = 22, foot = 17, sockH = 28, haunch = false) => {
  const hipY = -(th + sh), hx = x + w / 2, sw = haunch ? 20 : Math.max(16, w - 4);
  const poses = (part) => `--pr:${poseOf(kind, 'run', part, front).toFixed(1)}deg;--pb:${poseOf(kind, 'bound', part, front).toFixed(1)}deg;`;
  const thS = `transform-origin:${hx}px ${hipY + 6}px;${poses('th')}${legAnim(wins, kind, 'th', front)}`;
  const shS = `transform-origin:${hx}px ${hipY + th}px;${poses('sh')}${legAnim(wins, kind, 'sh', front)}`;
  const O = () => `fill="${INK}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"`, F = (c) => `fill="${c}"`;
  const shin = (o) => `<rect x="${hx - sw / 2}" y="${hipY + th - 8}" width="${sw}" height="${sh + 8}" rx="${sw / 2}" ${o(fill)}/>` +
    (sock === fill ? '' : `<rect x="${hx - sw / 2}" y="${-sockH}" width="${sw}" height="${sockH}" rx="${sw / 2}" ${o(sock)}/>`) +
    `<ellipse cx="${hx + foot * 0.45}" cy="-6" rx="${foot}" ry="${haunch ? 11 : 9}" ${o(sock)}/>`;
  const thigh = (o) => haunch
    ? `<ellipse cx="${hx}" cy="${hipY + th * 0.55}" rx="${w * 0.8}" ry="${th * 0.9}" ${o(fill)}/>`
    : `<rect x="${x}" y="${hipY}" width="${w}" height="${th + 10}" rx="${w / 2}" ${o(fill)}/>`;
  return `<g style="${thS}"><g style="${shS}">${shin(O)}</g>${thigh(O)}<g style="${shS}">${shin(F)}</g>${thigh(F)}</g>`;
};
const arm = (sx, sy, fill, hand, wins, kind, len = 30, rest = 0, gest = []) => {
  const sl = wins.map((w) => ao(w.mode === 'run' ? { n: `arm${kind}`, d: w.P, t: w.t0, c: w.n } : { n: 'armBdA', d: w.P, t: w.t0, c: w.n }));
  for (const [a, b] of gest) if (!wins.some((w) => a < w.t1 && b > w.t0)) sl.push(ao({ n: 'gestk', d: b - a, t: a }));
  const swing = anims(sl);
  const fore = anims(wins.map((w) => ao({ n: 'forearmk', d: w.t1 - w.t0, t: w.t0 })));
  const st = `--r:${rest}deg;transform-origin:${sx}px ${sy + 6}px;${rest ? `transform:rotate(${rest}deg);` : ''}${swing}`;
  const fst = `transform-origin:${sx}px ${sy + len}px;${rest ? 'transform:rotate(-35deg);' : ''}${fore}`;
  const O = () => `fill="${INK}" stroke="${INK}" stroke-width="8"`, F = (c) => `fill="${c}"`;
  const up = (o) => `<rect x="${sx - 9}" y="${sy}" width="18" height="${len + 8}" rx="9" ${o(fill)}/>`;
  const lo = (o) => `<rect x="${sx - 8}" y="${sy + len - 6}" width="16" height="${len + 6}" rx="8" ${o(fill)}/><circle cx="${sx}" cy="${sy + len * 2 + 2}" r="10" ${o(hand)}/>`;
  return `<g style="${st}"><g style="${fst}">${lo(O)}</g>${up(O)}<g style="${fst}">${lo(F)}</g>${up(F)}</g>`;
};
// rebond du torse + inclinaison + tête, par fenêtre
const bodyWrap = (inner, wins, lean) => {
  const run = wins.filter((w) => w.mode === 'run');
  const bob = anims(run.map((w) => ao({ n: 'bobk', d: w.P / 2, e: 'ease-out', t: w.t0, c: w.n * 2 })));
  const lk = anims(wins.map((w) => ao({ n: 'leank', d: w.t1 - w.t0, t: w.t0 })));
  return `<g style="${bob}"><g style="--l:${lean}deg;transform-origin:0px -72px;${lk}">${inner}</g></g>`;
};
const headWrap = (inner, wins, ox, oy) => {
  const run = wins.filter((w) => w.mode === 'run');
  const hb = anims(run.map((w) => ao({ n: 'headk', d: w.P / 2, e: 'ease-in-out', t: w.t0 + 0.05, c: w.n * 2 })));
  return `<g style="transform-origin:${ox}px ${oy}px;animation:idlehead 1.7s ease-in-out infinite alternate"><g style="transform-origin:${ox}px ${oy}px;${hb}">${inner}</g></g>`;
};

const eyes = (cx, cy, r, big, look = 3) => `<g style="transform-origin:${cx}px ${cy}px;animation:blink 3.6s ${(Math.abs(Math.round(cy)) % 7) * 0.4}s infinite">
  <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.1}" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
  <circle cx="${cx + look}" cy="${cy + 1}" r="${r * 0.72}" fill="#2a1710"/>
  <circle cx="${cx + look - r * 0.24}" cy="${cy - r * 0.3}" r="${r * 0.3}" fill="#fff"/>
  <circle cx="${cx + look + r * 0.26}" cy="${cy + r * 0.32}" r="${r * 0.13}" fill="#fff"/></g>`;
const happyEyes = (list, h, sq = null) => {
  const open = list.map(([x, y, r, l]) => eyes(x, y, r, false, l)).join('');
  const arcs = list.map(([x, y, r]) => `<path d="M${x - r * 0.8} ${y + 3} Q${x} ${y - r} ${x + r * 0.8} ${y + 3}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('');
  const sqz = list.map(([x, y, r], i) => { const k = i ? -1 : 1; return `<path d="M${x - k * r * 0.7} ${y - r * 0.6} L${x + k * r * 0.5} ${y} L${x - k * r * 0.7} ${y + r * 0.6}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }).join('');
  const end = h || 99;
  let out = sq ? vis(0, sq[0], open) + vis(sq[0], sq[1], sqz) + vis(sq[1], end, open) : (h ? vis(0, h, open) : open);
  if (h) out += vis(h, 99, arcs);
  return out;
};
const mouthTalk = (cx, cy, talk, mood, panicAt = 0, happyAt = 0) => {
  const restOf = (m) => m === 'panic'
    ? `<path d="M${cx - 11} ${cy + 3} q5.5 -6 11 0 q5.5 6 11 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${cx - 12} ${cy} Q${cx} ${cy + 11} ${cx + 12} ${cy}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  let rest = panicAt ? vis(0, panicAt, restOf('calm')) + vis(panicAt, 99, restOf('panic')) : restOf(mood);
  if (happyAt) rest = vis(0, happyAt, rest) + vis(happyAt, 99, `<path d="M${cx - 13} ${cy - 2} Q${cx} ${cy + 24} ${cx + 13} ${cy - 2}Z" fill="#c4545c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy + 11}" rx="6" ry="4" fill="#ff9aa8"/>`);
  const open = talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:${cx}px ${cy}px;${an({ n: 'talk', d: 0.14, t: a, c: Math.max(1, Math.round((b - a) / 0.14)), dir: 'alternate' })}">
    ${(mood === 'panic' || (panicAt && a >= panicAt)) && !(happyAt && a >= happyAt)
      ? `<ellipse cx="${cx}" cy="${cy + 8}" rx="9" ry="13" fill="#c4545c" stroke="${INK}" stroke-width="3.5"/><ellipse cx="${cx}" cy="${cy + 15}" rx="5" ry="3.5" fill="#ff9aa8"/>`
      : `<path d="M${cx - 12} ${cy - 2} Q${cx} ${cy + 24} ${cx + 12} ${cy - 2}Z" fill="#c4545c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy + 11}" rx="6" ry="4" fill="#ff9aa8"/>`}</g>`)).join('');
  return rest + open;
};
const sweat = (x, y, t0, t1) => vis(t0, t1, `<g style="${an({ n: 'sweatk', d: 0.5, c: 99 })}"><path d="M${x} ${y} q-9 16 0 22 q9 -6 0 -22z" fill="#8fd3ff" stroke="${INK}" stroke-width="2.5"/></g>`);
const dust = (t0, t1, x = -70, y = 0) => vis(t0, t1, [0, 1, 2].map((i) =>
  `<g transform="translate(${x} ${y})"><g style="${an({ n: 'dustk', d: 0.42, t: i * 0.14, c: 99 })}"><circle r="20" fill="#f3e6c8" stroke="#d6c39a" stroke-width="3"/></g></g>`).join(''));
const extras = (inner, o, wins) => {
  const { splashAt = 0, shiver = null, jolt = 0, skid = 0 } = o;
  if (splashAt) inner = `<g style="${an({ n: 'fallk', d: 1.65, t: splashAt - 0.25 })}">${inner}</g>`;
  if (jolt) inner = `<g style="animation:${[].concat(jolt).map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',')}">${inner}</g>`;
  if (o.lookback) inner = `<g style="${an({ n: 'lookback', d: 1.0, t: o.lookback })}">${inner}</g>`;
  if (skid) inner = `<g style="${an({ n: 'skidk', d: 0.8, t: skid })}">${inner}</g>`;
  if (shiver) inner = `<g style="--s:3px;${an({ n: 'shake', d: 0.045, t: shiver[0], c: Math.round((shiver[1] - shiver[0]) / 0.045), dir: 'alternate' })}">${inner}</g>`;
  return inner;
};

const shadowEl = (rx, hops, jumps) => {
  const L = [];
  hops.forEach(([a, b]) => { const n = Math.max(1, Math.round((b - a) / 0.42)); L.push(ao({ n: 'shhop', d: (b - a) / n, t: a, c: n })); });
  jumps.forEach(([a, b]) => L.push(ao({ n: 'shjmp', d: b - a, t: a })));
  return `<ellipse cx="0" cy="3" rx="${rx}" ry="12" fill="#000" opacity=".22" style="transform-origin:0px 3px;${anims(L)}"/>`;
};
function fox(o = {}) {
  const { run, talk = [], mood = 'calm', holdArm = false, wetFrom = 999, jumps = [], sweatWin = null } = o;
  const col = '#f28a1e', far = '#c76a10', dark = '#6a3512', cream = '#fff0d6';
  const wins = mkWins(run);
  const sh = shadowEl(78, [], jumps);
  let inner = `
  ${leg(4, far, '#4b230a', wins, 'B', false, 34, 30, 26, 20, 16)}
  <g transform="translate(0 8) rotate(${o.upright ?? -14} 0 -66)">${holdArm ? '' : arm(34, -100, far, '#4b230a', wins, 'A', 20, -30)}
  ${bodyWrap(`
  <g style="transform-origin:-55px -100px;${an({ n: 'wag', d: run ? 0.18 : 0.45, e: 'ease-in-out', c: 999, dir: 'alternate' })}">
    <path d="M-50 -92 C-120 -70 -150 -150 -110 -190 C-95 -150 -75 -135 -48 -122Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-110 -190 C-92 -176 -86 -160 -88 -146 C-104 -148 -124 -160 -124 -172Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>
  <g style="transform-origin:0px -72px;animation:breathe 1.1s ease-in-out infinite alternate">
    <ellipse cx="0" cy="-98" rx="60" ry="58" fill="${col}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="14" cy="-88" rx="44" ry="38" fill="${cream}"/>
    <rect x="-64" y="-148" width="52" height="62" rx="14" fill="#3b82f6" stroke="${INK}" stroke-width="4"/>
    <rect x="-56" y="-120" width="38" height="16" rx="5" fill="#2563eb"/>
    <path d="M-12 -140 Q18 -110 36 -96" stroke="#2563eb" stroke-width="7" fill="none" stroke-linecap="round"/>
    ${headWrap(`<g transform="translate(70 -134) scale(1.16) translate(-70 126)">
      <polygon points="28,-172 40,-232 72,-182" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="40,-178 45,-214 62,-184" fill="${dark}"/>
      <polygon points="66,-182 100,-226 108,-170" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="80,-184 98,-210 100,-180" fill="${dark}"/>
      <circle cx="70" cy="-148" r="46" fill="${col}" stroke="${INK}" stroke-width="4"/>
      <path d="M52 -126 Q86 -150 124 -134 Q120 -104 84 -104 Q56 -106 52 -126Z" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
      <ellipse cx="125" cy="-136" rx="9" ry="7" fill="${INK}"/>
      ${happyEyes([[68, -158, 15, 2], [101, -158, 11, 2]], o.happyAt || 0, o.squint || null)}
      <path d="${mood === 'panic' ? 'M54 -176 Q66 -183 82 -192 M96 -176 Q104 -182 112 -184' : 'M56 -182 Q68 -188 82 -184 M96 -180 Q104 -183 110 -180'}" stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"/>
      ${mouthTalk(104, -118, talk, mood, o.panicAt || 0, o.happyAt || 0)}
      <ellipse cx="62" cy="-132" rx="10" ry="6" fill="#ff8c8c" opacity=".7"/><ellipse cx="108" cy="-126" rx="8" ry="5" fill="#ff8c8c" opacity=".5"/></g>`, wins, 40, -120)}
  </g>
  ${holdArm
    ? `<g style="transform-origin:34px -96px;transform:rotate(-100deg);${o.dropArmAt ? an({ n: 'armdrop', d: 0.3, t: o.dropArmAt, f: 'forwards' }) : ''}"><rect x="25" y="-96" width="20" height="58" rx="10" fill="${col}" stroke="${INK}" stroke-width="4"/><circle cx="35" cy="-38" r="11" fill="${dark}"/></g>`
    : arm(34, -100, col, dark, wins, 'B', 20, -30, talk)}`, wins, 9)}</g>
  ${leg(-30, col, dark, wins, 'A', false, 34, 30, 28, 22, 16)}`;
  if (sweatWin) inner += sweat((o.upright ?? -14) <= -20 ? -44 : -24, -228, sweatWin[0], sweatWin[1]);
  if (run) inner += dust(run[0], run[1]);
  if (wetFrom < 900) inner += vis(wetFrom, wetFrom + 4.5, [0, 1, 2, 3].map((i) =>
    `<g transform="translate(${-30 + i * 30} -40)"><g style="${an({ n: 'dripk', d: 0.8, t: i * 0.2, c: 999 })}"><path d="M0 0 q-6 12 0 16 q6 -4 0 -16z" fill="#8fd3ff" stroke="${INK}" stroke-width="2"/></g></g>`).join(''));
  const jw = jumps;
  for (const [a, b, h] of jw) inner = `<g style="--h:${h}px;${an({ n: 'jmp', d: b - a, t: a })}">${inner}</g>`;
  return sh + extras(inner, o, wins);
}

function rabbit(o = {}) {
  const { run, talk = [], mood = 'calm', hops = [], jumps = [], sweatWin = null } = o;
  const fur = '#f1eff7', shade = '#cfcbe0', farc = '#a9a5c2', pink = '#ffb3c6', bag = '#22a06b';
  const wins = mkWins(run, hops, jumps, o.runExtra || []);
  const earAnim = (t) => (run || hops.length ? an({ n: 'earrun', d: 0.2, e: 'ease-in-out', t, c: 999, dir: 'alternate' }) : an({ n: 'earidle', d: 0.9, e: 'ease-in-out', t, c: 999, dir: 'alternate' }));
  const sh = shadowEl(74, hops, jumps);
  let inner = `
  ${leg(-2, '#e9e6f4', '#e9e6f4', wins, 'B', false, 26, 24, 28, 30, 14, true)}
  <g transform="translate(0 20)">${arm(30, -96, '#e9e6f4', '#ffffff', wins, 'A', 22, -28)}
  ${bodyWrap(`
  <circle cx="-60" cy="-90" r="23" fill="#fff" stroke="${INK}" stroke-width="4"/>
  <g style="transform-origin:0px -68px;animation:breathe 1s ease-in-out infinite alternate">
    <ellipse cx="0" cy="-98" rx="60" ry="56" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="14" cy="-90" rx="40" ry="40" fill="#fff"/>
    ${o.noBag ? '' : `<rect x="-56" y="-150" width="46" height="60" rx="14" fill="${bag}" stroke="${INK}" stroke-width="4"/>
    <rect x="-50" y="-122" width="34" height="16" rx="5" fill="#188657"/>
    <path d="M-10 -142 Q16 -112 30 -98" stroke="#188657" stroke-width="7" fill="none" stroke-linecap="round"/>`}
    ${headWrap(`<g transform="translate(52 -142) scale(1.2) translate(-52 130)">
      <g style="transform-origin:30px -190px;${earAnim(0)}">
        <ellipse cx="22" cy="-236" rx="19" ry="50" fill="${fur}" stroke="${INK}" stroke-width="4" transform="rotate(-10 22 -236)"/><ellipse cx="22" cy="-236" rx="9" ry="36" fill="${pink}" transform="rotate(-10 22 -236)"/></g>
      <g style="transform-origin:62px -190px;${earAnim(0.07)}">
        <ellipse cx="64" cy="-232" rx="19" ry="50" fill="${fur}" stroke="${INK}" stroke-width="4" transform="rotate(14 64 -232)"/><ellipse cx="64" cy="-232" rx="9" ry="36" fill="${pink}" transform="rotate(14 64 -232)"/></g>
      <ellipse cx="54" cy="-152" rx="55" ry="46" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="70" cy="-131" rx="27" ry="18" fill="#fff"/>
      ${happyEyes([[36, -155, 16, 2], [80, -155, 16, 2]], o.happyAt || 0)}
      <path d="M63 -144 h14 l-7 8z" fill="#ff7f9f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      ${mouthTalk(70, -124, talk, mood, 0, o.happyAt || 0)}
      <ellipse cx="14" cy="-134" rx="11" ry="7" fill="${pink}" opacity=".9"/><ellipse cx="96" cy="-134" rx="11" ry="7" fill="${pink}" opacity=".9"/></g>`, wins, 40, -118)}
  </g>
  ${arm(30, -96, fur, '#ffffff', wins, 'B', 22, -28, talk)}`, wins, 8)}</g>
  ${leg(-26, fur, fur, wins, 'A', false, 26, 24, 30, 32, 14, true)}`;
  if (sweatWin) inner += sweat(122, -196, sweatWin[0], sweatWin[1]);
  if (run) inner += dust(run[0], run[1]);
  for (const [a, b, h] of hops) { const n = Math.max(1, Math.round((b - a) / 0.42)); inner = `<g style="--h:${h}px;${an({ n: 'hop', d: (b - a) / n, t: a, c: n })}">${inner}</g>`; }
  for (const [a, b, h] of jumps) inner = `<g style="--h:${h}px;${an({ n: 'jmp', d: b - a, t: a })}">${inner}</g>`;
  return sh + extras(inner, o, wins);
}

function owl(talk = []) {
  const br = '#8d6a4a', lt = '#e9d5b5';
  return `<ellipse cx="0" cy="3" rx="70" ry="11" fill="#000" opacity=".22"/>
  <rect x="-30" y="-42" width="16" height="36" rx="7" fill="#ffb300" stroke="${INK}" stroke-width="4"/><rect x="14" y="-42" width="16" height="36" rx="7" fill="#ffb300" stroke="${INK}" stroke-width="4"/>${[-22, 22].map((x) => `<ellipse cx="${x}" cy="-7" rx="25" ry="10" fill="#ffb300" stroke="${INK}" stroke-width="4"/><path d="M${x - 8} -13 v7 M${x + 8} -13 v7" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join('')}
  <g style="transform-origin:0 -60px;animation:breathe 1.3s ease-in-out infinite alternate">
  <ellipse cx="0" cy="-110" rx="62" ry="82" fill="${br}" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="0" cy="-90" rx="40" ry="56" fill="${lt}"/>
  <path d="M-36 -110 q36 14 72 0 M-32 -88 q32 14 64 0 M-28 -66 q28 12 56 0" stroke="${br}" stroke-width="4" fill="none"/>
  <ellipse cx="-64" cy="-96" rx="17" ry="44" fill="${br}" stroke="${INK}" stroke-width="4" transform="rotate(14 -64 -96)"/>
  <polygon points="-52,-176 -34,-212 -18,-180" fill="${br}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="52,-176 34,-212 18,-180" fill="${br}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="-26" cy="-148" r="27" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="26" cy="-148" r="27" fill="#fff" stroke="${INK}" stroke-width="4"/>
  ${vis(0, 26.7, `<circle cx="-22" cy="-146" r="12" fill="${INK}"/><circle cx="22" cy="-146" r="12" fill="${INK}"/><circle cx="-18" cy="-151" r="4" fill="#fff"/><circle cx="26" cy="-151" r="4" fill="#fff"/>`)}${vis(26.7, 99, `<path d="M-40 -146 Q-26 -164 -12 -146 M12 -146 Q26 -164 40 -146" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`)}
  <path d="M-46 -188 Q-28 -198 -10 -190 M46 -188 Q28 -198 10 -190" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>
  <polygon points="-11,-132 11,-132 0,-108" fill="#ffb300" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="-26" cy="-148" r="32" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="26" cy="-148" r="32" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="-46" cy="-112" rx="12" ry="7" fill="#f4a6b0" opacity=".75"/><ellipse cx="46" cy="-112" rx="12" ry="7" fill="#f4a6b0" opacity=".75"/>
  ${talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:0px -108px;${an({ n: 'talk', d: 0.14, t: a, c: Math.max(1, Math.round((b - a) / 0.14)), dir: 'alternate' })}"><polygon points="-8,-112 8,-112 0,-97" fill="#e39a00" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`)).join('')}
  </g>
  <g style="transform-origin:46px -96px;${an({ n: 'watchk', d: 0.35, t: 24.6, f: 'both', e: 'cubic-bezier(.3,1.5,.5,1)' })}"><g style="transform-origin:46px -96px;${an({ n: 'tapk', d: 0.12, t: 25.3, c: 4, dir: 'alternate' })}"><ellipse cx="66" cy="-112" rx="18" ry="46" fill="${br}" stroke="${INK}" stroke-width="4" transform="rotate(-14 64 -104)"/>
  <g transform="translate(86 -136) scale(.8)"><rect x="-8" y="-36" width="16" height="72" rx="5" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle r="26" fill="#fff" stroke="${INK}" stroke-width="5"/><circle r="20" fill="#fff" stroke="#c7bba6" stroke-width="2"/>
  <line x1="0" y1="0" x2="1.5" y2="15" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><line x1="0" y1="0" x2="-10" y2="3" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><circle r="3" fill="#e8434e"/></g></g></g>`;
}

const put = (x, y, s, inner, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${inner}</g>`;
const cloud = (x, y, s, o = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}"><ellipse rx="74" ry="28"/><ellipse cx="-38" cy="-18" rx="38" ry="28"/><ellipse cx="26" cy="-28" rx="46" ry="34"/></g>`;

// ───────── SCÈNE 1 · réveil en retard (0 → 5.6) ─────────
const T1 = 0, T1e = 5.6;
const clockHands = `<line x1="0" y1="0" x2="13" y2="22" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="-17" y2="6" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
const s1 = scene(T1, T1e, tf(`
  <rect width="${W}" height="${H}" fill="#ffd9a3"/>
  ${Array.from({ length: 17 }, (_, i) => `<rect x="${i * 80}" width="40" height="560" fill="#ffc98a" opacity=".55"/>`).join('')}
  <rect y="560" width="${W}" height="160" fill="#b5733a"/>${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${590 + i * 18}" x2="${W}" y2="${590 + i * 18}" stroke="#9c5f2c" stroke-width="3"/>`).join('')}
  <rect y="548" width="${W}" height="16" fill="#8a5224"/>
  <g transform="translate(860 110)"><rect width="320" height="300" rx="14" fill="#fff" stroke="${INK}" stroke-width="6"/>
    <defs><linearGradient id="dawn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff9a52"/><stop offset=".5" stop-color="#ffd27a"/><stop offset="1" stop-color="#8fd0ff"/></linearGradient></defs>
    <rect x="14" y="14" width="292" height="272" fill="url(#dawn)"/><circle cx="160" cy="250" r="64" fill="#fff3a0"/>
    <rect x="14" y="14" width="292" height="272" fill="none" stroke="#fff" stroke-width="8"/><line x1="160" y1="14" x2="160" y2="286" stroke="#fff" stroke-width="8"/><line x1="14" y1="150" x2="306" y2="150" stroke="#fff" stroke-width="8"/>
    <rect x="-62" y="-28" width="444" height="14" rx="7" fill="#8a5224" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -12px;animation:sway 2.4s ease-in-out infinite alternate"><path d="M-50 -12 L50 -12 Q46 96 26 186 Q54 252 58 332 L-50 332 Z" fill="#ff8fb1" stroke="${INK}" stroke-width="5"/><path d="M-22 0 Q-16 160 -28 320 M12 0 Q18 150 22 300" stroke="#e86a93" stroke-width="4" fill="none"/></g>
    <g style="transform-origin:320px -12px;animation:sway 2.4s ease-in-out .4s infinite alternate-reverse"><path d="M370 -12 L270 -12 Q274 96 294 186 Q266 252 262 332 L370 332 Z" fill="#ff8fb1" stroke="${INK}" stroke-width="5"/><path d="M342 0 Q336 160 348 320 M308 0 Q302 150 298 300" stroke="#e86a93" stroke-width="4" fill="none"/></g></g>
  <g transform="translate(110 380)">
    <rect x="0" y="70" width="560" height="150" rx="16" fill="#9a5f2c" stroke="${INK}" stroke-width="5"/>
    <rect x="-8" y="0" width="30" height="220" rx="8" fill="#7e4b20" stroke="${INK}" stroke-width="5"/>
    <rect x="12" y="52" width="520" height="62" rx="26" fill="#fff" stroke="${INK}" stroke-width="5"/>
    <rect x="12" y="92" width="520" height="104" rx="22" fill="#5fa8ff" stroke="${INK}" stroke-width="5"/>
    ${[110, 230, 350, 470].map((x) => `<circle cx="${x}" cy="150" r="14" fill="#fff" opacity=".5"/>`).join('')}</g>
  <ellipse cx="640" cy="650" rx="330" ry="46" fill="#e8434e" stroke="${INK}" stroke-width="5"/><ellipse cx="640" cy="650" rx="250" ry="28" fill="#ff8a8a"/>
  <g transform="translate(110 178)"><rect width="150" height="190" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="14" y="14" width="122" height="162" fill="#d6f0ff"/><circle cx="75" cy="86" r="30" fill="#ff8a3d" stroke="${INK}" stroke-width="4"/><path d="M75 56 l-6 -26 l12 0z" fill="#3fae55"/></g>
  <g transform="translate(560 175)"><rect width="190" height="110" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="14" y="14" width="162" height="92" fill="#ffe9a8"/><text x="95" y="75" class="bt" style="font-size:34px;fill:#8a5a00">1+1=2</text></g>
  <g transform="translate(600 120)"><rect width="200" height="12" rx="4" fill="#8a5224" stroke="${INK}" stroke-width="4"/><rect x="20" y="-52" width="34" height="52" fill="#e8434e" stroke="${INK}" stroke-width="4"/><rect x="60" y="-64" width="30" height="64" fill="#3b82f6" stroke="${INK}" stroke-width="4"/><rect x="96" y="-44" width="40" height="44" fill="#22a06b" stroke="${INK}" stroke-width="4"/></g>
  <g transform="translate(790 430)"><rect x="0" y="80" width="150" height="90" rx="10" fill="#8a5224" stroke="${INK}" stroke-width="5"/></g>
  `, { t0: 0, d: T1e, from: 'scale(1)', to: 'scale(1.07)', o: '640px 400px', e: 'linear' }) +
  // Lapin endormi (0 → 2.3) : tête de face sur l'oreiller, oreilles tombantes, couette jusqu'au menton
  vis(0, 2.3, `<g>
    <rect x="136" y="388" width="214" height="96" rx="42" fill="#fff" stroke="${INK}" stroke-width="5"/>
    <g style="transform-origin:200px 410px;animation:earidle 2s ease-in-out infinite alternate"><ellipse cx="150" cy="398" rx="82" ry="21" fill="#f1eff7" stroke="${INK}" stroke-width="5" transform="rotate(-10 150 398)"/><ellipse cx="146" cy="398" rx="60" ry="9" fill="#ffb3c6" transform="rotate(-10 146 398)"/>
    <ellipse cx="156" cy="432" rx="78" ry="20" fill="#e4e1f0" stroke="${INK}" stroke-width="5" transform="rotate(8 156 432)"/><ellipse cx="152" cy="432" rx="56" ry="8" fill="#ffb3c6" transform="rotate(8 152 432)"/></g>
    <ellipse cx="243" cy="428" rx="62" ry="56" fill="#f4f2fa" stroke="${INK}" stroke-width="5"/>
    <path d="M214 424 q13 12 27 0 M247 424 q13 12 27 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="243" cy="446" rx="30" ry="20" fill="#fff"/>
    <path d="M234 440 h18 l-9 10z" fill="#ff6f95" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M243 450 q-8 10 -16 4 M243 450 q8 10 16 4" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    
    <path d="M214 446 l-30 -6 M214 452 l-32 4 M272 446 l30 -6 M272 452 l32 4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="206" cy="440" rx="11" ry="6" fill="#ffb3c6" opacity=".85"/><ellipse cx="280" cy="440" rx="11" ry="6" fill="#ffb3c6" opacity=".85"/>
    <g style="transform-origin:400px 520px;animation:breathe 1.3s ease-in-out infinite alternate">
      <path d="M124 480 C170 458 236 470 276 476 C340 446 440 420 528 440 C584 452 622 466 650 476 L650 580 L124 580 Z" fill="#6fb2ff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M140 490 Q210 478 272 486" stroke="#4a90e2" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${[330, 420, 510, 590].map((x, i) => `<circle cx="${x}" cy="${486 - (i === 1 || i === 2 ? 20 : 0)}" r="11" fill="#fff" opacity=".6"/>`).join('')}</g>
    <g style="${an({ n: 'zzz', d: 1.5, c: 99 })}"><text x="330" y="372" class="sfx" style="font-size:84px;fill:#fff;stroke-width:8">Z</text></g>
    <g style="${an({ n: 'zzz', d: 1.5, t: 0.5, c: 99 })}"><text x="400" y="332" class="sfx" style="font-size:64px;fill:#fff;stroke-width:8">z</text></g>
    <g style="${an({ n: 'zzz', d: 1.5, t: 1.0, c: 99 })}"><text x="456" y="302" class="sfx" style="font-size:48px;fill:#fff;stroke-width:7">z</text></g></g>`) +
  vis(2.3, 2.95, tf(`<path d="M124 480 C170 458 236 470 276 476 C340 446 440 420 528 440 C584 452 622 466 650 476 L650 580 L124 580 Z" fill="#6fb2ff" stroke="${INK}" stroke-width="5"/>`, { t0: 2.3, d: 0.65, from: 'translate(0px,0px) rotate(0deg)', to: 'translate(280px,-560px) rotate(42deg)', o: '390px 520px', e: 'cubic-bezier(.2,.7,.4,1)' })) +
  vis(0, 3.95, `<g transform="translate(84 404) rotate(-8)"><path d="M2 -4 Q20 -28 38 -4" stroke="#188657" stroke-width="6" fill="none"/><rect x="-4" y="-4" width="46" height="58" rx="13" fill="#22a06b" stroke="${INK}" stroke-width="4"/><rect x="2" y="22" width="34" height="14" rx="5" fill="#188657"/></g>`) +
  // réveil qui sonne
  `<g transform="translate(865 520)">
    ${vis(0, 2.3, `<g style="transform-origin:0 -10px;--s:4px;${an({ n: 'rattle', d: 0.07, c: 999, dir: 'alternate' })}">
      <circle cx="-26" cy="-84" r="16" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><circle cx="26" cy="-84" r="16" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
      <circle cx="0" cy="-40" r="52" fill="#e8434e" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-40" r="40" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <g transform="translate(0 -40)">${clockHands}</g><rect x="-30" y="0" width="12" height="14" fill="${INK}"/><rect x="18" y="0" width="12" height="14" fill="${INK}"/></g>
      <path d="M-86 -70 q-14 30 0 60 M88 -70 q14 30 0 60 M-110 -86 q-26 46 0 92 M112 -86 q26 46 0 92" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`)}
    ${vis(2.3, 99, `<circle cx="-26" cy="-84" r="16" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><circle cx="26" cy="-84" r="16" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
      <circle cx="0" cy="-40" r="52" fill="#e8434e" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-40" r="40" fill="#fff" stroke="${INK}" stroke-width="3"/><g transform="translate(0 -40)">${clockHands}</g><rect x="-30" y="0" width="12" height="14" fill="${INK}"/><rect x="18" y="0" width="12" height="14" fill="${INK}"/>`)}
  </g>` +
  sfx('DRING !', 700, 400, 0.15, 2.1, -8, '#ffd23f', 84, 'alarm') +
  // réveil en sursaut : Lapin assis (2.3 → 3.9)
  vis(2.3, 3.9, `<g transform="translate(300 505)"><g style="transform-origin:0 0;${an({ n: 'wake', d: 0.5, t: 2.3, f: 'both' })}">
    ${shake(tf(rabbit({ talk: [[2.55, 3.8]], mood: 'panic', sweatWin: [2.5, 3.9], noBag: true }), { t0: 3.4, d: 0.45, from: 'scale(1,1)', to: 'scale(1.22,.74)' }), 2.6, 0.7, 2)}</g></g>
    <g transform="translate(490 296)"><g style="${an({ n: 'sfxk', d: 1.4, t: 2.35, f: 'both' })}"><text class="sfx" style="font-size:110px;fill:#e8434e">!!</text></g></g>`) +
  bub('rab', 'Oh non ! 8h25 !!', 345, 175, 2.5, 1.4, true) +
  // Lapin file (3.9 → 5.6)
  vis(3.9, T1e, tf(
    `<g style="${an({ n: 'leapk', d: 0.7, t: 3.9, f: 'both' })}">${put(0, 0, 1.2, rabbit({ run: [4.55, 5.55], runExtra: [[4.55, 5.55]], jumps: [[3.9, 4.55, 0]], talk: [], mood: 'panic' }))}</g>`,
    { t0: 3.9, d: 1.5, from: 'translate(300px,600px)', to: 'translate(1600px,600px)', e: 'cubic-bezier(.6,0,.9,.5)' })) +
  vis(3.85, 4.4, `<g transform="translate(300 590)">${[0, 1, 2, 3].map((i) => `<g style="${an({ n: 'dustk', d: 0.5, t: 3.9 + i * 0.07 })}"><circle cx="${-20 - i * 30}" cy="${-i * 8}" r="${30 - i * 3}" fill="#f3e6c8" stroke="#d6c39a" stroke-width="3"/></g>`).join('')}</g>`) +
  sfx('BOING !', 565, 165, 4.05, 1.2, 6, '#6ee7ff', 84, 'boing')
);
const S1 = shake(s1, 2.3, 0.45, 9);

// ───────── SCÈNE 2 · Renard et le croissant (5.6 → 12.6) ─────────
const T2 = 5.6, T2e = 12.6;
const house = (x, w, h, c, r) => `<g transform="translate(${x} ${560 - h})"><rect width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="5"/><polygon points="-12,0 ${w / 2},-70 ${w + 12},0" fill="${r}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${[0, 1].map((i) => `<rect x="${24 + i * (w - 96)}" y="${h * 0.3}" width="52" height="58" rx="6" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/>`).join('')}<rect x="${w / 2 - 22}" y="${h - 76}" width="44" height="76" rx="6" fill="#7a4a2a" stroke="${INK}" stroke-width="4"/></g>`;
const croissant = `<g><path d="M-40 8 Q-34 -30 0 -32 Q34 -30 40 8 Q26 -6 14 -9 Q0 -1 -14 -9 Q-26 -6 -40 8Z" fill="#e9a84a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-14 -9 Q-13 -22 -5 -30 M14 -9 Q13 -22 5 -30" stroke="#b97520" stroke-width="3" fill="none"/><path d="M-22 -22 Q0 -30 22 -22" stroke="#f6d08a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const s2 = scene(T2, T2e, tf(`
  <defs><linearGradient id="morn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#ffe3b8"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#morn)"/>
  <circle cx="190" cy="250" r="80" fill="#fff3a0"/>
  <g style="animation:cdrift 9s ease-in-out infinite alternate">${cloud(500, 120, 1.1, .9)}${cloud(980, 190, 0.8, .9)}</g>
  ${house(40, 220, 200, '#ff9d8a', '#c0392b')}${house(300, 190, 250, '#ffe08a', '#d97706')}${house(560, 230, 190, '#9fd8ff', '#2563eb')}${house(850, 200, 240, '#b9e8a0', '#15803d')}${house(1090, 210, 205, '#f6b8e8', '#a21caf')}
  <rect y="560" width="${W}" height="160" fill="#9aa3ad"/><rect y="552" width="${W}" height="30" fill="#cfd5db" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${30 + i * 170}" y="650" width="100" height="12" rx="6" fill="#fff"/>`).join('')}
  <g transform="translate(1130 560)"><rect x="-8" y="-300" width="16" height="300" fill="#3a3f4a" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-308" r="24" fill="#ffe27a" stroke="${INK}" stroke-width="4"/></g>
  `, { t0: T2, d: T2e - T2, from: 'scale(1)', to: 'scale(1.04)', o: '800px 420px', e: 'linear' }) +
  // Renard campé, croissant en main
  vis(0, 11.95, put(850, 612, 1.4, fox({ talk: [[6.65, 7.8], [10.85, 12.1]], holdArm: true, run: null, jolt: [9.1, 10.65], dropArmAt: 11.3, panicAt: 10.65, upright: -24, sweatWin: [9.1, 11.95] }), true)) +
  vis(11.95, 99, tf(put(0, 0, 1.4, fox({ run: [11.95, 12.7], mood: 'panic' })), { t0: 11.95, d: 0.5, from: 'translate(820px,612px)', to: 'translate(1480px,612px)', e: 'cubic-bezier(.35,0,.7,1)' })) +
  vis(0, 10.65, `<g transform="translate(753 434)"><g style="${an({ n: 'croidown', d: 1.4, t: 6.55 })}"><g style="${an({ n: 'munch', d: 0.3, c: 999, dir: 'alternate' })}">${croissant}</g></g></g>`) +
  // Lapin déboule puis dérape
  vis(T2, 99, tf(tf(put(0, 0, 1.4, rabbit({ run: [5.7, 6.3], runExtra: [[5.7, 6.3], [12.1, 12.7]], talk: [[8.0, 9.4]], mood: 'panic', sweatWin: [6.6, 12.1], skid: 6.3, hops: [[7.0, 12.05, 10]] })), { t0: 12.1, d: 0.55, from: 'translate(0px,0px)', to: 'translate(900px,0px)', e: 'cubic-bezier(.35,0,.7,1)' }),
    { t0: T2, d: 0.9, from: 'translate(-260px,612px)', to: 'translate(400px,612px)', e: 'cubic-bezier(.2,.3,.4,1)' })) +
  // dérapage Lapin → poussière
  vis(6.45, 7.2, `<g transform="translate(500 606)">${[0, 1, 2, 3, 4].map((i) => `<g style="${an({ n: 'dustk', d: 0.55, t: 6.5 + i * 0.05 })}"><circle cx="${-i * 26}" cy="${-i * 6}" r="${26 - i * 2}" fill="#e6e9ee" stroke="#b9c0c9" stroke-width="3"/></g>`).join('')}</g>`) +
  sfx('SCRIIITCH !', 290, 110, 6.2, 1.1, -6, '#ff9a3d', 70, 'skid') +
  bub('fox', 'Salut ! Tu cours ?', 760, 232, 6.7, 1.3) +
  bub('rab', "8h30 !! L'ÉCOLE !!", 440, 165, 8.0, 1.5, true) +
  // oiseau voleur
  vis(0, 10.35, `<g transform="translate(1130 196) scale(2.2)"><ellipse rx="22" ry="16" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><circle cx="-18" cy="-8" r="12" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><polygon points="-28,-8 -40,-4 -28,-1" fill="#ffb300" stroke="${INK}" stroke-width="2.5"/><circle cx="-21" cy="-10" r="3" fill="${INK}"/></g>`) +
  vis(10.3, 99, tf(tf(`<g transform="scale(2.2)"><g style="transform-origin:0 0;${an({ n: 'flap', d: 0.12, t: 10.3, c: 999, dir: 'alternate' })}"><ellipse rx="22" ry="14" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><circle cx="-18" cy="-6" r="12" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><polygon points="-28,-6 -40,-3 -28,0" fill="#ffb300" stroke="${INK}" stroke-width="2.5"/><circle cx="-21" cy="-8" r="3" fill="${INK}"/><path d="M0 -4 Q18 -50 36 -26 Q16 -10 6 2Z" fill="#b8232d" stroke="${INK}" stroke-width="3"/></g></g>
      ${vis(10.65, 99, `<g transform="translate(-8 42) scale(.85)">${croissant}</g>`)}`,
    { t0: 10.3, d: 0.35, from: 'translate(1130px,196px)', to: 'translate(756px,424px)', e: 'ease-in' }).replace('both', 'forwards'),
    { t0: 10.7, d: 1.5, from: 'translate(0px,0px)', to: 'translate(420px,-480px)', e: 'cubic-bezier(.3,.2,.5,1)' })) +
  vis(10.65, 12.6, `<g transform="translate(995 240)"><g style="${an({ n: 'sfxk', d: 1.2, t: 10.65, f: 'both' })}"><text class="sfx" style="font-size:96px;fill:#e8434e">!</text></g></g>`) +
  sfx('ZIP !', 1010, 190, 10.3, 0.8, 8, '#ff6f95', 80) +
  bub('fox', 'Mon croissant !!', 780, 200, 10.8, 1.2, true)
);

// ───────── SCÈNE 3 · la course (12.6 → 21.2) ─────────
const T3 = 12.6, T3e = 21.2, V = 640;
const hillPath = () => { let d = 'M0 480'; for (let i = 0; i <= 64; i++) { const x = i * 20; d += ` L${x} ${(470 + Math.sin((i / 64) * Math.PI * 2) * 46 + Math.sin((i / 64) * Math.PI * 6) * 14).toFixed(1)}`; } return d + ' L1280 720 L0 720Z'; };
const treeS = (x, s = 1) => `<g transform="translate(${x} 540) scale(${s})"><rect x="-14" y="-110" width="28" height="112" rx="8" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><circle cy="-150" r="72" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="-52" cy="-108" r="46" fill="#52c468" stroke="${INK}" stroke-width="4"/><circle cx="52" cy="-112" r="48" fill="#39a04d" stroke="${INK}" stroke-width="4"/></g>`;
const loop = (inner, v, id) => `<g style="animation:scrl ${1280 / v}s linear infinite"><g>${inner}</g><g transform="translate(1280 0)">${inner}</g></g>`;
const midTrees = [90, 330, 610, 880, 1150].map((x, i) => treeS(x, 0.8 + (i % 3) * 0.12)).join('');
const nearStuff = `<rect y="540" width="1280" height="200" fill="#6cc24a"/><rect y="600" width="1280" height="140" fill="#ecd29a"/><rect y="596" width="1280" height="10" fill="#d8b878"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 160 + 70}" y="490" width="16" height="76" fill="#d1a46c" stroke="${INK}" stroke-width="3"/>`).join('')}<rect y="506" width="1280" height="9" fill="#d1a46c" stroke="${INK}" stroke-width="3"/><rect y="534" width="1280" height="9" fill="#d1a46c" stroke="${INK}" stroke-width="3"/>
  ${Array.from({ length: 16 }, (_, i) => `<circle cx="${i * 80 + 20}" cy="${660 + (i % 3) * 22}" r="${5 + (i % 2) * 3}" fill="#c9a96a"/>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${i * 128 + 40}" cy="716" rx="${50 + (i % 3) * 14}" ry="${26 + (i % 2) * 8}" fill="#3f9a3c" stroke="${INK}" stroke-width="4"/>`).join('')}
  ${Array.from({ length: 8 }, (_, i) => `<g transform="translate(${i * 160 + 30} ${566})"><rect x="-1.5" y="-18" width="3" height="18" fill="#2f8a3b"/><circle cy="-22" r="9" fill="${['#ff6fa5', '#ffd23f', '#b57bff', '#fff'][i % 4]}" stroke="${INK}" stroke-width="2"/></g>`).join('')}`;
const worldX = (xAt, tAt, t) => xAt - V * (t - tAt);
const item = (inner, xAt, tAt, y) => {
  const x0 = worldX(xAt, tAt, T3), dist = x0 + 400;
  return `<g transform="translate(0 ${y})">${tf(inner, { t0: T3, d: dist / V, from: `translate(${x0}px,0px)`, to: `translate(-400px,0px)`, e: 'linear' })}</g>`;
};
const puddle = `<ellipse rx="130" ry="26" fill="#5ba7e8" stroke="${INK}" stroke-width="5"/><ellipse cx="-30" cy="-6" rx="60" ry="9" fill="#a9d6ff"/>`;
const snail = `<g>
  <path d="M70 0 L92 -4 Q70 -14 60 -20 L-40 -20 L-50 0Z" fill="#c8e6a0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-16" rx="64" ry="17" fill="#c8e6a0" stroke="${INK}" stroke-width="4"/>
  <circle cx="8" cy="-46" r="38" fill="#ff9f43" stroke="${INK}" stroke-width="4"/>
  <path d="M8 -46 m0 0 a7 7 0 1 1 7 7 a14 14 0 1 1 -20 -12 a22 22 0 1 1 28 30" stroke="#b9650f" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="-58" cy="-34" r="19" fill="#c8e6a0" stroke="${INK}" stroke-width="4"/>
  <g style="transform-origin:-66px -48px;${an({ n: 'stalk', d: 0.7, e: 'ease-in-out', c: 999, dir: 'alternate' })}"><path d="M-66 -48 L-72 -76" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="-72" cy="-80" r="9" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="-74" cy="-80" r="4.5" fill="#2a1710"/></g>
  <g style="transform-origin:-52px -50px;${an({ n: 'stalk', d: 0.7, e: 'ease-in-out', t: 0.2, c: 999, dir: 'alternate' })}"><path d="M-52 -50 L-48 -78" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="-48" cy="-82" r="9" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="-50" cy="-82" r="4.5" fill="#2a1710"/></g>
  <path d="M-72 -30 q7 8 14 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="-50" cy="-30" rx="6" ry="4" fill="#ffb3c6" opacity=".9"/></g>`;
const snailFull = `<g style="${an({ n: 'crawl', d: 0.7, e: 'ease-in-out', c: 999, dir: 'alternate' })}"><g transform="scale(1.3)">${snail}</g></g>` +
  `<g transform="translate(-80 0)"><path d="M0 0 q-60 6 -140 0" stroke="#bfe6ff" stroke-width="7" stroke-linecap="round" opacity=".7" fill="none"/></g>`;
const FOX_X = 430, RAB_X = 770, FEET = 625;
const s3 = scene(T3, T3e, `
  <defs><linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58b8ff"/><stop offset="1" stop-color="#e0f4ff"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky3)"/>
  <circle cx="1190" cy="90" r="50" fill="#ffe96a"/>
  ${loop(cloud(200, 130, 1.2) + cloud(700, 90, 0.8) + cloud(1000, 200, 1), 40)}
  ${loop(`<path d="${hillPath()}" fill="#9fd8a0" stroke="${INK}" stroke-width="4"/>`, 90)}
  ${loop(midTrees, 260)}
  ${loop(nearStuff, V)}
  ${vis(0, 14.66, item(puddle, RAB_X, 14.1, 618))}
  ${vis(14.65, 17.4, `<g transform="translate(380 626)">${tf(`<g transform="scale(1.3,1.1)">${puddle}</g>`, { t0: 15.95, d: 1.3, from: 'translate(0px,0px)', to: 'translate(-832px,0px)', e: 'linear' })}</g>`)}
  ${item(snailFull, RAB_X, 18.2, 612)}
  ` +
  // personnages
  put(FOX_X, FEET - 8, 1.3, fox({ run: [T3, T3e], talk: [[15.5, 16.6], [18.2, 18.9]], mood: 'calm', panicAt: 14.65, squint: [14.65, 15.7], wetFrom: 14.7, splashAt: 14.65, shiver: [14.85, 16.85], jumps: [[18.3, 19.05, 150]], sweatWin: [19.3, 21.2] })) +
  vis(14.65, 15.95, `<path d="M211 626 A169 29 0 0 0 549 626 Z" fill="#5ba7e8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M260 634 Q380 650 500 634" stroke="#a9d6ff" stroke-width="5" fill="none" stroke-linecap="round"/>`) +
  put(RAB_X, FEET + 10, 1.42, rabbit({ run: [T3, T3e], talk: [[13.0, 14.0], [17.5, 17.95], [19.75, 21.0]], mood: 'panic', lookback: 14.8,
    hops: [[T3, 13.7, 55], [14.5, 17.8, 55], [18.6, T3e, 55]], jumps: [[13.7, 14.5, 135], [17.8, 18.6, 135]] })) +
  bub('snail', 'Bonjour...', 1130, 540, 17.5, 0.65) +
  // lignes de vitesse
  [].map((y, i) => `<g style="${an({ n: 'spd', d: 0.32, t: i * 0.05, c: 999 })}"><rect x="0" y="${y}" width="${220 + (i % 3) * 80}" height="5" rx="2.5" fill="#fff" opacity=".7"/></g>`).join('') +
  // splash
  vis(14.65, 15.55, `<g transform="translate(${FOX_X + 20} 610)">${Array.from({ length: 10 }, (_, i) => `<g style="--dx:${(i - 5) * 26}px;--dy:${-130 - (i % 3) * 40}px;${an({ n: 'drop', d: 0.8, t: 14.65, f: 'both', e: 'ease-out' })}"><circle r="${8 - (i % 3)}" fill="#8fd3ff" stroke="${INK}" stroke-width="2.5"/></g>`).join('')}</g>`) +
  sfx('SPLASH !', FOX_X - 140, 300, 14.65, 1.0, -12, '#6ee7ff', 84, 'splash') +
  bub('rab', 'Attention, flaque !', RAB_X + 40, 195, 13.0, 1.0, true) +
  bub('fox', 'Brrr ! Mes chaussettes !', FOX_X + 20, 255, 15.5, 1.3) +
  bub('rab', 'Saute ! Saute !', RAB_X + 40, 195, 17.5, 0.45, true) +
  bub('fox', 'Pardon, madame...', FOX_X + 60, 150, 18.2, 0.7) +
  sfx('DRING !', 300, 120, 19.5, 1.5, 6, '#ffd23f', 90, 'bell') +
  bub('rab', 'La cloche !! Vite !!', RAB_X + 40, 195, 19.75, 1.35, true)
);

// ───────── SCÈNE 4 · arrivée pile à l'heure (21.2 → 30) ─────────
const T4 = 21.2;
const confetti = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 83) % 1280, c = ['#ff6fa5', '#ffd23f', '#6ee7ff', '#b57bff', '#6cc24a'][i % 5];
  return `<g transform="translate(${x} -30)"><g style="${an({ n: 'conf', d: 2.2 + (i % 5) * 0.3, t: 27.3 + (i % 7) * 0.12, f: 'both' })}"><rect width="14" height="20" rx="3" fill="${c}"/></g></g>`;
}).join('');
const s4 = scene(T4, 99, `
  <rect width="${W}" height="${H}" fill="url(#sky3)"/>
  <circle cx="1100" cy="110" r="52" fill="#ffe96a"/>${cloud(220, 130, 1.1)}${cloud(560, 90, .8)}
  <g transform="translate(760 560)"><rect x="0" y="-330" width="620" height="330" fill="#e0574f" stroke="${INK}" stroke-width="6"/>
    <rect x="-20" y="-345" width="660" height="30" fill="#8c2f2b" stroke="${INK}" stroke-width="6"/>
    ${[40, 400, 500].map((x) => `<rect x="${x}" y="-260" width="70" height="90" rx="8" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/>`).join('')}
    <rect x="215" y="-450" width="190" height="125" fill="#c9443d" stroke="${INK}" stroke-width="6"/><polygon points="200,-450 310,-540 420,-450" fill="#8c2f2b" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <g transform="translate(310 -392)"><circle r="46" fill="#fff" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-38" x2="0" y2="${i % 3 ? -33 : -28}" stroke="${INK}" stroke-width="${i % 3 ? 2.5 : 4}" transform="rotate(${i * 30})"/>`).join('')}
      <g style="${an({ n: 'tickh', d: 0.2, t: 26.15, f: 'both' })}"><line x1="0" y1="0" x2="0" y2="-36" stroke="${INK}" stroke-width="4" stroke-linecap="round" style="transform:rotate(174deg)"/></g>
      <line x1="0" y1="0" x2="-19" y2="5" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle r="4" fill="#e8434e"/></g>
    <g transform="translate(310 -560)"><g style="transform-origin:0 -10px;--s:1px;${an({ n: 'bellrock', d: 0.18, t: 26.15, c: 14, dir: 'alternate' })}"><circle r="16" fill="#ffd23f" stroke="${INK}" stroke-width="4"/></g></g>
    <rect x="158" y="-300" width="236" height="300" rx="12" fill="#f3e3c8" stroke="${INK}" stroke-width="5"/>${[[172, -284, '#ffd23f'], [330, -280, '#9fd8ff'], [172, -120, '#ff9aa8'], [336, -110, '#b9e8a0']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="50" height="40" rx="3" fill="${c}" stroke="${INK}" stroke-width="2.5"/>`).join('')}
    <rect x="450" y="-190" width="140" height="190" rx="12" fill="#5a3320" stroke="${INK}" stroke-width="6"/><rect x="460" y="-180" width="120" height="180" rx="8" fill="#2d1a10"/>
    <text x="310" y="-321" class="bt" style="font-size:26px;fill:#fff6d6;letter-spacing:4px">ÉCOLE</text></g>
  <rect y="560" width="${W}" height="160" fill="#8fd0e8"/><rect y="560" width="${W}" height="160" fill="#7ab86a"/><rect y="560" width="${W}" height="14" fill="#5d9a4e"/>
  <rect y="600" width="${W}" height="120" fill="#ecd29a"/><rect y="596" width="${W}" height="10" fill="#d8b878"/>
  ${Array.from({ length: 5 }, (_, i) => `<rect x="${20 + i * 100}" y="500" width="14" height="64" fill="#d1a46c" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="14" y="515" width="450" height="9" fill="#d1a46c" stroke="${INK}" stroke-width="3"/>
  ${treeS(90, 0.95)}${treeS(300, 0.78)}${treeS(640, 0.7)}
  <rect x="462" y="496" width="16" height="70" fill="#d1a46c" stroke="${INK}" stroke-width="3"/>
  ${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${i * 128 + 40}" cy="716" rx="${50 + (i % 3) * 14}" ry="${26 + (i % 2) * 8}" fill="#3f9a3c" stroke="${INK}" stroke-width="4"/>`).join('')}
  ${Array.from({ length: 14 }, (_, i) => `<circle cx="${i * 92 + 30}" cy="${640 + (i % 3) * 16}" r="${5 + (i % 2) * 3}" fill="#c9a96a"/>`).join('')}
  <g transform="translate(560 574)"><ellipse rx="46" ry="26" fill="#3f9a3c" stroke="${INK}" stroke-width="4"/>${[-24, 0, 24].map((x, i) => `<circle cx="${x}" cy="${-10 + (i % 2) * 6}" r="8" fill="${['#ff6fa5', '#ffd23f', '#b57bff'][i]}" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g>
  <g transform="translate(1180 584)"><ellipse rx="52" ry="26" fill="#3f9a3c" stroke="${INK}" stroke-width="4"/>${[-28, -6, 18, 36].map((x, i) => `<circle cx="${x}" cy="${-10 + (i % 2) * 6}" r="8" fill="${['#ffd23f', '#ff6fa5', '#fff', '#ff8a3d'][i]}" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g>
  <rect x="1186" y="548" width="188" height="14" rx="4" fill="#d8c9a6" stroke="${INK}" stroke-width="4"/><rect x="1198" y="536" width="164" height="14" rx="4" fill="#e6d9ba" stroke="${INK}" stroke-width="4"/>
  <rect x="1166" y="110" width="8" height="108" fill="#8a5a33" stroke="${INK}" stroke-width="3"/>
  <g style="transform-origin:1174px 134px;${an({ n: 'wag', d: 0.6, e: 'ease-in-out', c: 999, dir: 'alternate' })}"><path d="M1174 114 l78 22 l-78 22z" fill="#e8434e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>
  <g transform="translate(835 372)"><circle r="19" fill="#ffd7b0" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="-3" r="2.6" fill="#2a1710"/><circle cx="6" cy="-3" r="2.6" fill="#2a1710"/><path d="M-6 6 q6 6 12 0" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-19 -6 q4 -18 19 -16 q15 -2 19 16 q-18 -10 -38 0z" fill="#6b3d1e" stroke="${INK}" stroke-width="3"/></g><g transform="translate(1195 372)"><circle r="19" fill="#ffd7b0" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="-3" r="2.6" fill="#2a1710"/><circle cx="6" cy="-3" r="2.6" fill="#2a1710"/><path d="M-6 6 q6 6 12 0" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-19 -6 q4 -18 19 -16 q15 -2 19 16 q-18 -10 -38 0z" fill="#6b3d1e" stroke="${INK}" stroke-width="3"/></g><g transform="translate(1295 372)"><circle r="19" fill="#ffd7b0" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="-3" r="2.6" fill="#2a1710"/><circle cx="6" cy="-3" r="2.6" fill="#2a1710"/><path d="M-6 6 q6 6 12 0" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-19 -6 q4 -18 19 -16 q15 -2 19 16 q-18 -10 -38 0z" fill="#6b3d1e" stroke="${INK}" stroke-width="3"/></g>
  `) +
  confetti +
  vis(T4, 99, put(1040, 614, 1.4, `<g style="animation:owlsway 1.8s ease-in-out infinite alternate"><g style="animation:${ao({ n: 'jolt', d: 0.6, t: 26.25 })},${ao({ n: 'jolt', d: 0.6, t: 27.2 })},${ao({ n: 'jolt', d: 0.6, t: 28.4 })},${ao({ n: 'jolt', d: 0.6, t: 29.2 })}">${owl([[24.9, 26.3], [26.8, 28.2]])}</g></g>`, true)) +
  vis(T4, 99, tf(tf(put(0, 0, 1.4, fox({ run: [21.3, 22.95], talk: [], mood: 'calm', sweatWin: [23.4, 26.6], happyAt: 26.6, skid: 22.95, jolt: 26.2, upright: -24, jumps: [[27.0, 27.65, 40], [28.2, 28.85, 40]] })), { t0: 22.9, d: 0.6, from: 'translate(0px,0px)', to: 'translate(200px,0px)', e: 'cubic-bezier(.2,.9,.3,1.12)' }),
    { t0: T4, d: 1.7, from: 'translate(-1180px,614px)', to: 'translate(100px,614px)', e: 'linear' })) +
  vis(T4, 99, tf(tf(put(0, 0, 1.4, rabbit({ run: [21.3, 22.95], talk: [[23.9, 24.8]], mood: 'panic', sweatWin: [23.4, 26.6], happyAt: 26.6, skid: 22.95, jolt: 26.3, jumps: [[27.15, 27.8, 70], [28.35, 29.0, 70]] })), { t0: 22.9, d: 0.6, from: 'translate(0px,0px)', to: 'translate(200px,0px)', e: 'cubic-bezier(.2,.9,.3,1.12)' }),
    { t0: T4, d: 1.7, from: 'translate(-910px,614px)', to: 'translate(390px,614px)', e: 'linear' })) +
  vis(23.2, 24.0, `<g transform="translate(700 606)">${[0, 1, 2, 3, 4].map((i) => `<g style="${an({ n: 'dustk', d: 0.6, t: 23.2 + i * 0.05 })}"><circle cx="${-i * 28}" cy="${-i * 5}" r="${28 - i * 2}" fill="#f3e6c8" stroke="#d6c39a" stroke-width="3"/></g>`).join('')}</g>`) +
  sfx('SCRIIITCH !', 470, 668, 22.95, 1.1, -6, '#ff9a3d', 60, 'skid') +
  bub('rab', 'Ouf !!', 630, 170, 23.9, 1.0, true) +
  bub('owl', '8h29 et 59 secondes !', 1020, 322, 24.9, 1.9) +
  sfx('DRING !', 720, 112, 26.15, 1.3, 6, '#ffd23f', 90, 'bell') +
  bub('owl', 'Bravo, pile à l\'heure !', 1020, 322, 26.8, 1.5) +
  `<g style="${an({ n: 'cardk', d: 0.6, t: 27.6, f: 'both', e: 'cubic-bezier(.2,1.6,.4,1)' })}"><g transform="translate(330 72) scale(.76)">
    <rect x="-279" y="-76" width="570" height="168" rx="30" fill="#000" opacity=".22" transform="rotate(-1.5)"/><rect x="-285" y="-84" width="570" height="168" rx="30" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(-1.5)"/>
    <text y="4" class="sfx" style="font-size:68px;fill:#e8434e;stroke:#fff;stroke-width:0">Renard &amp; Lapin</text>
    <text y="58" class="bt" style="font-size:38px;fill:#2b5ba8">vont à l'école !</text></g></g>`;

const style = `
text{font-family:"Chalkboard SE","Comic Sans MS","Arial Rounded MT Bold",sans-serif;text-anchor:middle;font-weight:700}
.bt{fill:${INK};font-weight:700}
.sfx{stroke:${INK};stroke-width:9;paint-order:stroke;stroke-linejoin:round;font-weight:900}
.v{opacity:0}
@keyframes vis{0%,99.9%{opacity:1}100%{opacity:0}}
@keyframes tfk{from{transform:var(--f)}to{transform:var(--t)}}
@keyframes pop{0%{opacity:0;transform:scale(.2)}9%{opacity:1;transform:scale(1.15)}16%{transform:scale(1)}96%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.95)}}
@keyframes sfxk{0%{opacity:0;transform:scale(.2) rotate(-12deg)}10%{opacity:1;transform:scale(1.3) rotate(4deg)}20%{transform:scale(1) rotate(0)}85%{opacity:1}100%{opacity:0;transform:scale(1.05)}}
@keyframes swing{from{transform:rotate(calc(var(--a) * -1))}to{transform:rotate(var(--a))}}
@keyframes leank{0%{transform:rotate(0)}10%,90%{transform:rotate(var(--l))}100%{transform:rotate(0)}}
@keyframes hop{0%,100%{transform:translateY(0) scale(1.14,.86)}18%{transform:translateY(0) scale(.92,1.12)}50%{transform:translateY(calc(var(--h) * -1)) scale(.96,1.06)}82%{transform:translateY(0) scale(.92,1.12)}}
@keyframes jmp{0%{transform:translateY(0) scale(1.15,.85);animation-timing-function:cubic-bezier(.2,.8,.4,1)}12%{transform:translateY(0) scale(.9,1.15);animation-timing-function:cubic-bezier(.2,.8,.4,1)}50%{transform:translateY(calc(var(--h) * -1)) scale(.95,1.08);animation-timing-function:cubic-bezier(.6,0,.8,.2)}88%{transform:translateY(0) scale(.9,1.12)}100%{transform:translateY(0) scale(1)}}
@keyframes squash{0%{transform:scale(1)}25%{transform:scale(1.3,.7)}55%{transform:scale(.88,1.16)}100%{transform:scale(1)}}
@keyframes blink{0%,96.8%,100%{transform:scaleY(1)}98.4%{transform:scaleY(.08)}}
@keyframes breathe{from{transform:scale(1,1)}to{transform:scale(1.02,.975)}}
@keyframes wag{from{transform:rotate(-9deg)}to{transform:rotate(12deg)}}
@keyframes earrun{from{transform:rotate(18deg)}to{transform:rotate(48deg)}}
@keyframes earidle{from{transform:rotate(-3deg)}to{transform:rotate(5deg)}}
@keyframes talk{from{transform:scaleY(.35)}to{transform:scaleY(1.05)}}
@keyframes shake{from{transform:translate(calc(var(--s) * -1),0)}to{transform:translate(var(--s),calc(var(--s) * .5))}}
@keyframes rattle{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
@keyframes wake{0%{transform:rotate(-70deg) translateY(10px)}40%{transform:rotate(8deg) scale(1.15,.85)}70%{transform:rotate(-3deg) scale(.96,1.06)}100%{transform:none}}
@keyframes zzz{0%{opacity:0;transform:translate(0,0)}30%{opacity:1}100%{opacity:0;transform:translate(26px,-70px)}}
@keyframes dustk{0%{opacity:.85;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(-80px,-34px) scale(1.5)}}
@keyframes sweatk{from{transform:translate(0,0)}to{transform:translate(4px,8px)}}
@keyframes dripk{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(80px)}}
@keyframes drop{0%{opacity:1;transform:translate(0,0)}60%{transform:translate(calc(var(--dx) * .8),var(--dy))}100%{opacity:0;transform:translate(var(--dx),0)}}
@keyframes scrl{from{transform:translateX(0)}to{transform:translateX(-1280px)}}
@keyframes spd{from{opacity:1;transform:translateX(1400px)}to{opacity:0;transform:translateX(-300px)}}
@keyframes munch{from{transform:translate(0,0) rotate(-4deg)}to{transform:translate(6px,-8px) rotate(6deg)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.55)}}
@keyframes conf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:1;transform:translate(60px,820px) rotate(540deg)}}
@keyframes cardk{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}
@keyframes tickh{from{transform:rotate(0)}to{transform:rotate(6deg)}}
@keyframes bellrock{from{transform:rotate(-30deg)}to{transform:rotate(30deg)}}
${extraKF}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="30" data-fps="30">
<style>${style}</style>
${S1}${shake(s2, 6.45, 0.3, 6)}${tf(s3, { t0: T3, d: T3e - T3, from: 'scale(1)', to: 'scale(1.05)', o: '640px 420px', e: 'linear' })}${shake(s4, 23.3, 0.3, 5)}
${[T2, T3, T4].map((t) => tf(`<polygon points="0,0 1500,0 1600,720 100,720" fill="#fff6d6"/>`, { t0: t - 0.2, d: 0.4, from: 'translate(-1700px,0px)', to: 'translate(1400px,0px)', e: 'linear' })).join('')}
</svg>`;
writeFileSync(new URL('./cartoon-ecole.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
