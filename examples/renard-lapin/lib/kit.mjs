// Kit commun de la série Roussin & Lino (extrait et généralisé de l'épisode 1).
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
@keyframes pointk{0%{transform:rotate(var(--r))}18%,82%{transform:rotate(-64deg)}50%{transform:rotate(-74deg)}100%{transform:rotate(var(--r))}}
@keyframes lookk{0%{transform:translateX(0)}15%,85%{transform:translateX(var(--lx))}100%{transform:translateX(0)}}
@keyframes wavek{0%{transform:rotate(var(--r))}15%,45%,75%{transform:rotate(-100deg)}30%,60%,90%{transform:rotate(-62deg)}100%{transform:rotate(var(--r))}}
@keyframes raisek{0%{transform:rotate(var(--r))}12%{transform:translateY(-34px) rotate(-176deg)}25%,55%,85%{transform:translateY(-34px) rotate(-158deg)}40%,70%{transform:translateY(-34px) rotate(-182deg)}100%{transform:rotate(var(--r))}}
@keyframes raisewig{from{transform:rotate(-9deg)}to{transform:rotate(7deg)}}
@keyframes raiseup{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
@keyframes foreup{0%{transform:rotate(-35deg)}12%,88%{transform:rotate(12deg)}100%{transform:rotate(-35deg)}}
@keyframes hide{0%,99.9%{opacity:0}100%{opacity:1}}
@keyframes blushk{0%{opacity:0;transform:scale(.4)}15%{opacity:1;transform:scale(1.1)}25%,90%{opacity:1;transform:scale(1)}100%{opacity:0}}
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
const arm = (sx, sy, fill, hand, wins, kind, len = 30, rest = 0, gest = [], item = '') => {
  const sl = wins.map((w) => ao(w.mode === 'run' ? { n: `arm${kind}`, d: w.P, t: w.t0, c: w.n } : { n: 'armBdA', d: w.P, t: w.t0, c: w.n }));
  for (const [a, b, g = 'gestk'] of gest) if (!wins.some((w) => a < w.t1 && b > w.t0)) sl.push(ao({ n: g, d: b - a, t: a }));
  const swing = anims(sl);
  const fore = anims([...wins.map((w) => ao({ n: 'forearmk', d: w.t1 - w.t0, t: w.t0 })), ...gest.filter((g) => g[2] === 'raisek').map(([a, b]) => ao({ n: 'foreup', d: b - a, t: a }))]);
  const st = `--r:${rest}deg;transform-origin:${sx}px ${sy + 6}px;${rest ? `transform:rotate(${rest}deg);` : ''}${swing}`;
  const fst = `transform-origin:${sx}px ${sy + len}px;${rest ? 'transform:rotate(-35deg);' : ''}${fore}`;
  const O = () => `fill="${INK}" stroke="${INK}" stroke-width="8"`, F = (c) => `fill="${c}"`;
  const up = (o) => `<rect x="${sx - 9}" y="${sy}" width="18" height="${len + 8}" rx="9" ${o(fill)}/>`;
  const lo = (o) => `<rect x="${sx - 8}" y="${sy + len - 6}" width="16" height="${len + 6}" rx="8" ${o(fill)}/><circle cx="${sx}" cy="${sy + len * 2 + 2}" r="10" ${o(hand)}/>`;
  return `<g style="${st}"><g style="${fst}">${lo(O)}</g>${up(O)}<g style="${fst}">${lo(F)}${item ? `<g transform="translate(${sx} ${sy + len * 2 + 2})">${item}</g>` : ''}</g>${up(F)}</g>`;
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

const eyes = (cx, cy, r, big, look = 3, ly = 1) => `<g style="transform-origin:${cx}px ${cy}px;animation:blink 3.6s ${(Math.abs(Math.round(cy)) % 7) * 0.4}s infinite">
  <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.1}" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
  <circle cx="${cx + look}" cy="${cy + ly}" r="${r * 0.72}" fill="#2a1710"/>
  <circle cx="${cx + look - r * 0.24}" cy="${cy + ly - 1 - r * 0.3}" r="${r * 0.3}" fill="#fff"/>
  <circle cx="${cx + look + r * 0.26}" cy="${cy + ly - 1 + r * 0.32}" r="${r * 0.13}" fill="#fff"/></g>`;
// états d'yeux par fenêtres : segs = [[t0, t1, kind]], kind ∈ arc | sq | wide | up | back | shut ; ouverts ailleurs
const eyeStates = (list, segs) => {
  const draw = (kind) => list.map(([x, y, r, l], i) => {
    if (kind === 'arc') return `<path d="M${x - r * 0.8} ${y + 3} Q${x} ${y - r} ${x + r * 0.8} ${y + 3}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (kind === 'shut') return `<path d="M${x - r * 0.8} ${y} Q${x} ${y + r * 0.6} ${x + r * 0.8} ${y}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (kind === 'sq') { const k = i ? -1 : 1; return `<path d="M${x - k * r * 0.7} ${y - r * 0.6} L${x + k * r * 0.5} ${y} L${x - k * r * 0.7} ${y + r * 0.6}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
    if (kind === 'wide') return `<g transform="translate(${x} ${y}) scale(1.18) translate(${-x} ${-y})">${eyes(x, y, r, false, l, 0)}</g>`;
    if (kind === 'up') return eyes(x, y, r, false, l + r * 0.1, -r * 0.42);
    if (kind === 'back') return eyes(x, y, r, false, -r * 0.3, 1);
    if (kind === 'down') return eyes(x, y, r, false, l, r * 0.4);
    if (kind === 'side') return eyes(x, y, r, false, r * 0.36, 1);
    if (kind === 'spiral') return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.1}" fill="#fff" stroke="${INK}" stroke-width="3.5"/><g style="transform-origin:${x}px ${y}px;animation:spin .5s linear infinite"><path d="M${x} ${y} m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5 a8 8 0 1 1 -8 -8 a${r * 0.75} ${r * 0.75} 0 1 1 ${r * 0.75} ${r * 0.75}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
    if (kind === 'closed') return `<path d="M${x - r * 0.8} ${y + 2} h${r * 1.6}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    return eyes(x, y, r, false, l);
  }).join('');
  const s = [...segs].sort((a, b) => a[0] - b[0]);
  let out = '', t = 0;
  for (const [a, b, k] of s) { if (a > t) out += vis(t, a, draw('open')); out += vis(a, b, draw(k)); t = b; }
  return out + vis(t, 99, draw('open'));
};
// bouche par fenêtres : moods = [[t0, t1, mood]], mood ∈ calm | panic | happy | shy | sad ; talk = [[t0, t1]]
const mouthStates = (cx, cy, talk, moods, base = 'calm') => {
  const restOf = (m) => m === 'panic' ? `<path d="M${cx - 11} ${cy + 3} q5.5 -6 11 0 q5.5 6 11 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : m === 'happy' ? `<path d="M${cx - 13} ${cy - 2} Q${cx} ${cy + 24} ${cx + 13} ${cy - 2}Z" fill="#c4545c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy + 11}" rx="6" ry="4" fill="#ff9aa8"/>`
    : m === 'shy' ? `<path d="M${cx - 7} ${cy + 4} Q${cx} ${cy + 9} ${cx + 7} ${cy + 4}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : m === 'sad' ? `<path d="M${cx - 10} ${cy + 7} Q${cx} ${cy - 1} ${cx + 10} ${cy + 7}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : m === 'oh' ? `<ellipse cx="${cx}" cy="${cy + 6}" rx="7" ry="9" fill="#c4545c" stroke="${INK}" stroke-width="3.5"/>`
    : m === 'yawn' ? `<ellipse cx="${cx}" cy="${cy + 7}" rx="12" ry="16" fill="#8c2f3a" stroke="${INK}" stroke-width="4"/><ellipse cx="${cx}" cy="${cy + 16}" rx="7" ry="4.5" fill="#ff8fa3"/>`
    : m === 'yawnbig' ? `<ellipse cx="${cx - 4}" cy="${cy + 6}" rx="17" ry="24" fill="#8c2f3a" stroke="${INK}" stroke-width="4"/><ellipse cx="${cx - 4}" cy="${cy + 20}" rx="10" ry="6" fill="#ff8fa3"/>`
    : `<path d="M${cx - 12} ${cy} Q${cx} ${cy + 11} ${cx + 12} ${cy}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const moodAt = (t) => { for (const [a, b, m] of moods) if (t >= a && t < b) return m; return base; };
  const s = [...moods].sort((a, b) => a[0] - b[0]);
  let rest = '', t = 0;
  for (const [a, b, m] of s) { if (a > t) rest += vis(t, a, restOf(base)); rest += vis(a, b, restOf(m)); t = b; }
  rest += vis(t, 99, restOf(base));
  // pendant qu'il parle, la bouche de repos est masquée
  const hidden = talk.reduce((acc, [a, b]) => acc, rest);
  const open = talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:${cx}px ${cy}px;${an({ n: 'talk', d: 0.14, t: a, c: Math.max(1, Math.round((b - a) / 0.14)), dir: 'alternate' })}">
    ${moodAt(a) === 'sad' ? `<path d="M${cx - 11} ${cy + 12} Q${cx} ${cy - 8} ${cx + 11} ${cy + 12}Z" fill="#c4545c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`
      : moodAt(a) === 'panic' || moodAt(a) === 'oh'
      ? `<ellipse cx="${cx}" cy="${cy + 8}" rx="9" ry="13" fill="#c4545c" stroke="${INK}" stroke-width="3.5"/><ellipse cx="${cx}" cy="${cy + 15}" rx="5" ry="3.5" fill="#ff9aa8"/>`
      : `<path d="M${cx - 12} ${cy - 2} Q${cx} ${cy + 24} ${cx + 12} ${cy - 2}Z" fill="#c4545c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy + 11}" rx="6" ry="4" fill="#ff9aa8"/>`}</g>`)).join('');
  const mask = (inner) => talk.length ? `<g style="${anims(talk.map(([a, b]) => ao({ n: 'hide', d: b - a, t: a })))}">${inner}</g>` : inner;
  return mask(hidden) + open;
};
const blushEl = (pts, wins) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
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
// bras levé derrière la tête (main levée / doigt pointé vers le haut) : wins = [[t0, t1]]
const raiseArm = (wins = [], fur, paw, line, dx = 0, rot = 10, sc = 1, dy = 0) => wins.map(([a, b]) => vis(a, b, `<g transform="translate(${dx} ${dy}) translate(-30 -104) scale(${sc}) translate(30 104)"><g style="transform-origin:-30px -104px;${an({ n: 'raisewig', d: 0.22, t: a, c: Math.max(1, Math.round((b - a) / 0.22)), dir: 'alternate', e: 'ease-in-out' })}"><g style="transform-origin:-30px -104px;${an({ n: 'raiseup', d: 0.22, t: b - 0.22, dir: 'reverse', f: 'forwards' })}"><g style="transform-origin:-30px -104px;${an({ n: 'raiseup', d: 0.25, t: a, f: 'both', e: 'cubic-bezier(.3,1.6,.5,1)' })}"><g transform="rotate(${rot} -30 -104)">
  <rect x="-43" y="-160" width="26" height="62" rx="13" fill="${fur}" stroke="${INK}" stroke-width="4"/>
  <g transform="rotate(26 -30 -152)"><rect x="-42" y="-204" width="24" height="56" rx="12" fill="${fur}" stroke="${INK}" stroke-width="4"/><rect x="-42" y="-160" width="24" height="14" fill="${fur}"/>
  <rect x="-28" y="-250" width="12" height="40" rx="6" fill="${paw}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-30" cy="-210" rx="16" ry="15" fill="${paw}" stroke="${INK}" stroke-width="4"/><path d="M-40 -206 h12" stroke="${line}" stroke-width="3" stroke-linecap="round"/></g></g></g></g></g></g>`)).join('');
function fox(o = {}) {
  const { run, talk = [], mood = 'calm', holdArm = false, wetFrom = 999, jumps = [], sweatWin = null } = o;
  const col = '#f28a1e', far = '#c76a10', dark = '#6a3512', cream = '#fff0d6';
  const wins = mkWins(run, [], [], o.runExtra || []);
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
    ${o.noBag ? '' : `<rect x="-64" y="-148" width="52" height="62" rx="14" fill="#3b82f6" stroke="${INK}" stroke-width="4"/>
    <rect x="-56" y="-120" width="38" height="16" rx="5" fill="#2563eb"/>
    <path d="M-12 -140 Q18 -110 36 -96" stroke="#2563eb" stroke-width="7" fill="none" stroke-linecap="round"/>`}
    ${raiseArm(o.raise, col, dark, '#4b230a', 4, 16)}${raiseArm(o.point, col, col, dark, 74, 42, 1.5, 64)}
    ${headWrap(`<g transform="translate(70 -134) scale(1.16) translate(-70 126)">
      <polygon points="28,-172 40,-232 72,-182" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="40,-178 45,-214 62,-184" fill="${dark}"/>
      <polygon points="66,-182 100,-226 108,-170" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="80,-184 98,-210 100,-180" fill="${dark}"/>
      <circle cx="70" cy="-148" r="46" fill="${col}" stroke="${INK}" stroke-width="4"/>
      <path d="M52 -126 Q86 -150 124 -134 Q120 -104 84 -104 Q56 -106 52 -126Z" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
      <ellipse cx="125" cy="-136" rx="9" ry="7" fill="${INK}"/>
      ${o.eyes ? eyeStates([[68, -158, 15, 2], [101, -158, 11, 2]], o.eyes) : happyEyes([[68, -158, 15, 2], [101, -158, 11, 2]], o.happyAt || 0, o.squint || null)}
      <path d="${mood === 'panic' ? 'M54 -176 Q66 -183 82 -192 M96 -176 Q104 -182 112 -184' : 'M56 -182 Q68 -188 82 -184 M96 -180 Q104 -183 110 -180'}" stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"/>
      ${o.moods ? mouthStates(104, -118, talk, o.moods, mood) : mouthTalk(104, -118, talk, mood, o.panicAt || 0, o.happyAt || 0)}
      <ellipse cx="62" cy="-132" rx="10" ry="6" fill="#ff8c8c" opacity=".7"/><ellipse cx="108" cy="-126" rx="8" ry="5" fill="#ff8c8c" opacity=".5"/>${blushEl([[60, -130, 15], [110, -124, 11]], o.blush || [])}${(o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('')}</g>`, wins, 40, -120)}${o.overHead || ''}
  </g>
  ${holdArm
    ? `<g style="transform-origin:34px -96px;transform:rotate(-100deg);${o.dropArmAt ? an({ n: 'armdrop', d: 0.3, t: o.dropArmAt, f: 'forwards' }) : ''}"><rect x="25" y="-96" width="20" height="58" rx="10" fill="${col}" stroke="${INK}" stroke-width="4"/><circle cx="35" cy="-38" r="11" fill="${dark}"/></g>`
    : arm(34, -100, col, dark, wins, 'B', 20, -30, o.gest ?? talk, o.item || '')}`, wins, 9)}</g>
  ${leg(-30, col, dark, wins, 'A', false, 34, 30, 28, 22, 16)}`;
  if (sweatWin) inner += sweat((o.upright ?? -14) <= -20 ? -44 : -24, -228, sweatWin[0], sweatWin[1]);
  if (run && !o.noDust) inner += dust(run[0], run[1]);
  if (wetFrom < 900) inner += vis(wetFrom, wetFrom + 4.5, [0, 1, 2, 3].map((i) =>
    `<g transform="translate(${-30 + i * 30} -40)"><g style="${an({ n: 'dripk', d: 0.8, t: i * 0.2, c: 999 })}"><path d="M0 0 q-6 12 0 16 q6 -4 0 -16z" fill="#8fd3ff" stroke="${INK}" stroke-width="2"/></g></g>`).join(''));
  const jw = jumps;
  for (const [a, b, h] of jw) inner = `<g style="--h:${h}px;${an({ n: 'jmp', d: b - a, t: a })}">${inner}</g>`;
  return (o.noShadow ? '' : sh) + extras(inner, o, wins);
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
    ${raiseArm(o.raise, fur, '#fff', '#cfcbe0', -6, -22, 1.15)}
    ${headWrap(`<g transform="translate(52 -142) scale(1.2) translate(-52 130)">
      <g style="transform-origin:30px -190px;${earAnim(0)}">
        <ellipse cx="22" cy="-236" rx="19" ry="50" fill="${fur}" stroke="${INK}" stroke-width="4" transform="rotate(-10 22 -236)"/><ellipse cx="22" cy="-236" rx="9" ry="36" fill="${pink}" transform="rotate(-10 22 -236)"/></g>
      <g style="transform-origin:62px -190px;${earAnim(0.07)}">
        <ellipse cx="64" cy="-232" rx="19" ry="50" fill="${fur}" stroke="${INK}" stroke-width="4" transform="rotate(14 64 -232)"/><ellipse cx="64" cy="-232" rx="9" ry="36" fill="${pink}" transform="rotate(14 64 -232)"/></g>
      <ellipse cx="54" cy="-152" rx="55" ry="46" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="70" cy="-131" rx="27" ry="18" fill="#fff"/>
      ${o.eyes ? eyeStates([[36, -155, 16, 2], [80, -155, 16, 2]], o.eyes) : happyEyes([[36, -155, 16, 2], [80, -155, 16, 2]], o.happyAt || 0)}
      <path d="M63 -144 h14 l-7 8z" fill="#ff7f9f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      ${o.moods ? mouthStates(70, -124, talk, o.moods, mood) : mouthTalk(70, -124, talk, mood, 0, o.happyAt || 0)}
      <ellipse cx="14" cy="-134" rx="11" ry="7" fill="${pink}" opacity=".9"/><ellipse cx="96" cy="-134" rx="11" ry="7" fill="${pink}" opacity=".9"/>${blushEl([[14, -132, 15], [96, -132, 15]], o.blush || [])}${(o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('')}</g>`, wins, 40, -118)}
  </g>
  ${arm(30, -96, fur, '#ffffff', wins, 'B', 22, -28, o.gest ?? talk, o.item || '')}`, wins, 8)}</g>
  ${leg(-26, fur, fur, wins, 'A', false, 26, 24, 30, 32, 14, true)}`;
  if (sweatWin) inner += sweat(122, -196, sweatWin[0], sweatWin[1]);
  if (run) inner += dust(run[0], run[1]);
  for (const [a, b, h] of hops) { const n = Math.max(1, Math.round((b - a) / 0.42)); inner = `<g style="--h:${h}px;${an({ n: 'hop', d: (b - a) / n, t: a, c: n })}">${inner}</g>`; }
  for (const [a, b, h] of jumps) inner = `<g style="--h:${h}px;${an({ n: 'jmp', d: b - a, t: a })}">${inner}</g>`;
  return sh + extras(inner, o, wins);
}

function owl(talk = [], o = {}) {
  const happyAt = o.happyAt ?? 26.7, watchAt = o.watchAt === undefined ? 24.6 : o.watchAt;
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
  ${vis(0, happyAt, `<g style="--lx:${(o.look && o.look[0] && o.look[0][2]) || 0}px;${anims((o.look || []).map(([a, b]) => ao({ n: 'lookk', d: b - a, t: a })))}"><circle cx="-22" cy="-146" r="12" fill="${INK}"/><circle cx="22" cy="-146" r="12" fill="${INK}"/><circle cx="-18" cy="-151" r="4" fill="#fff"/><circle cx="26" cy="-151" r="4" fill="#fff"/></g>`)}${vis(happyAt, 99, `<path d="M-40 -146 Q-26 -164 -12 -146 M12 -146 Q26 -164 40 -146" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`)}
  <path d="M-46 -188 Q-28 -198 -10 -190 M46 -188 Q28 -198 10 -190" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>
  <polygon points="-11,-132 11,-132 0,-108" fill="#ffb300" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="-26" cy="-148" r="32" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="26" cy="-148" r="32" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="-46" cy="-112" rx="12" ry="7" fill="#f4a6b0" opacity=".75"/><ellipse cx="46" cy="-112" rx="12" ry="7" fill="#f4a6b0" opacity=".75"/>
  ${(o.lids || []).map(([a, b]) => vis(a, b, `<path d="M-53 -148 A27 27 0 0 1 1 -148 Z M-1 -148 A27 27 0 0 1 53 -148 Z" fill="${lt}" stroke="${INK}" stroke-width="4"/>`)).join('')}
  ${(o.yawn || []).map(([a, b]) => vis(a, b, `<circle cx="-26" cy="-148" r="26" fill="${lt}"/><circle cx="26" cy="-148" r="26" fill="${lt}"/><path d="M-42 -146 Q-26 -136 -10 -146 M10 -146 Q26 -136 42 -146" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-108" rx="20" ry="20" fill="#8c2f3a" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-96" rx="10" ry="5" fill="#ff8fa3"/><polygon points="-13,-137 13,-137 0,-124" fill="#ffb300" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><polygon points="-10,-90 10,-90 0,-81" fill="#e39a00" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`)).join('')}
  ${talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:0px -108px;${an({ n: 'talk', d: 0.14, t: a, c: Math.max(1, Math.round((b - a) / 0.14)), dir: 'alternate' })}"><polygon points="-8,-112 8,-112 0,-97" fill="#e39a00" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`)).join('')}
  </g>
  ${watchAt !== null ? `<g style="transform-origin:46px -96px;${an({ n: 'watchk', d: 0.35, t: watchAt, f: 'both', e: 'cubic-bezier(.3,1.5,.5,1)' })}"><g style="transform-origin:46px -96px;${an({ n: 'tapk', d: 0.12, t: watchAt + 0.7, c: 4, dir: 'alternate' })}"><ellipse cx="66" cy="-112" rx="18" ry="46" fill="${br}" stroke="${INK}" stroke-width="4" transform="rotate(-14 64 -104)"/>
  <g transform="translate(86 -136) scale(.8)"><rect x="-8" y="-36" width="16" height="72" rx="5" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle r="26" fill="#fff" stroke="${INK}" stroke-width="5"/><circle r="20" fill="#fff" stroke="#c7bba6" stroke-width="2"/>
  <line x1="0" y1="0" x2="1.5" y2="15" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><line x1="0" y1="0" x2="-10" y2="3" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><circle r="3" fill="#e8434e"/></g></g></g>`
  : `<g transform="translate(0 22)"><g style="--r:78deg;transform-origin:62px -120px;transform:rotate(78deg);${anims([...(o.point || []).map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...(o.wave || []).map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a }))])}">
    <path d="M124 -120 L196 -129" stroke="#7a4a22" stroke-width="7" stroke-linecap="round"/><circle cx="197" cy="-129" r="5" fill="#ffe27a" stroke="${INK}" stroke-width="2.5"/>
    <ellipse cx="98" cy="-120" rx="40" ry="17" fill="${br}" stroke="${INK}" stroke-width="4"/><circle cx="134" cy="-120" r="10" fill="${br}" stroke="${INK}" stroke-width="3"/></g></g>`}`;
}

// trajectoire échantillonnée : fn(t, u) -> {x, y, r?, s?|sx?,sy?} ; renvoie le style d'animation (à poser sur un <g>)
let trkN = 0;
const trackKF = (t0, t1, fn, fps = 30) => {
  const n = `trk${trkN++}`, N = Math.max(2, Math.round((t1 - t0) * fps));
  let s = `@keyframes ${n}{`;
  for (let i = 0; i <= N; i++) {
    const u = i / N, p = fn(t0 + u * (t1 - t0), u);
    s += `${(u * 100).toFixed(2)}%{transform:translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)${p.r ? ` rotate(${p.r.toFixed(1)}deg)` : ''} scale(${(p.sx ?? p.s ?? 1).toFixed(3)},${(p.sy ?? p.s ?? 1).toFixed(3)})}`;
  }
  extraKF += s + '}\n';
  return an({ n, d: t1 - t0, t: t0, f: 'both' });
};
const track = (inner, t0, t1, fn, fps) => `<g style="${trackKF(t0, t1, fn, fps)}">${inner}</g>`;
const put = (x, y, s, inner, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${inner}</g>`;
const cloud = (x, y, s, o = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}"><ellipse rx="74" ry="28"/><ellipse cx="-38" cy="-18" rx="38" ry="28"/><ellipse cx="26" cy="-28" rx="46" ry="34"/></g>`;

export const style = () => `
text{font-family:"Chalkboard SE","Comic Sans MS","Arial Rounded MT Bold",sans-serif;text-anchor:middle;font-weight:700}
.bt{fill:${INK};font-weight:700}
.sfx{stroke:${INK};stroke-width:9;paint-order:stroke;stroke-linejoin:round;font-weight:900}
.v{opacity:0}
@keyframes vis{0%,99.9%{opacity:1}100%{opacity:0}}
@keyframes tfk{from{transform:var(--f)}to{transform:var(--t)}}
@keyframes pop{0%{opacity:0;transform:scale(.4)}3%{opacity:1;transform:scale(1.1)}8%{transform:scale(1)}97%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.97)}}
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
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
${extraKF}`;

export { W, H, INK, lines, sfxEv, an, ao, anims, vis, tf, shake, scene, esc, bub, sfx, ss, interp, fox, rabbit, owl, put, cloud, eyes, eyeStates, mouthStates, sweat, dust, shadowEl, track, trackKF };
export const addKF = (s) => { extraKF += s + '\n'; };
