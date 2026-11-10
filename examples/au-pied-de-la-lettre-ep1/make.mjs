// « Au pied de la lettre » · Épisode 1 « La boîte mail » — 55 s, 1080×1920 (Reel 9:16).
// Génère au-pied-de-la-lettre-ep1.svg + timeline.json (répliques et bruitages pour audio.py).
// Tout est piloté par le temps absolu : chaque piste kf() est une animation de 55 s.
import { writeFileSync } from 'node:fs';

const W = 1080, H = 1920, D = 55;
const INK = '#3a2418';
const lines = []; // {who,t0,t1,text}
const sfxEv = []; // {name,t}
const ev = (name, t) => sfxEv.push({ name, t: +t.toFixed(3) });

// ───────── moteur d'animation ─────────
const KF = [];
let kid = 0;
const pc = (t) => ((Math.min(Math.max(t, 0), D) / D) * 100).toFixed(4) + '%';
// pistes : [[t, valeur, easing du segment qui part de ce point]]
function kf(points, prop = 'transform') {
  const p = [...points].sort((a, b) => a[0] - b[0]);
  const name = 'k' + kid++;
  let s = `@keyframes ${name}{`;
  if (p[0][0] > 0) s += `0%{${prop}:${p[0][1]};animation-timing-function:linear}`;
  for (const [t, v, e = 'ease-in-out'] of p) s += `${pc(t)}{${prop}:${v};animation-timing-function:${e}}`;
  if (p.at(-1)[0] < D) s += `100%{${prop}:${p.at(-1)[1]}}`;
  KF.push(s + '}');
  return `animation:${name} ${D}s linear 0s 1 normal both`;
}
const T = (points, inner, o = '0px 0px') => `<g style="transform-origin:${o};${kf(points)}">${inner}</g>`;
const rot = (pts) => pts.map(([t, a, e]) => [t, `rotate(${a}deg)`, e]);
const an = ({ n, d, e = 'linear', t = 0, c = 1, dir = 'normal', f = 'none' }) => `animation:${n} ${d}s ${e} ${t}s ${c} ${dir} ${f}`;
const vis = (t0, t1, inner) => `<g class="v" style="${an({ n: 'vis', d: t1 - t0, t: t0, f: 'forwards' })}">${inner}</g>`;
const tf = (inner, { t0, d, from, to, e = 'ease-in-out', o = '0px 0px' }) =>
  `<g style="--f:${from};--t:${to};transform-origin:${o};${an({ n: 'tfk', d, e, t: t0, f: 'both' })}">${inner}</g>`;
const shake = (inner, t0, d, s = 8) =>
  `<g style="--s:${s}px;${an({ n: 'shake', d: 0.05, t: t0, c: Math.max(1, Math.round(d / 0.05)), dir: 'alternate' })}">${inner}</g>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const put = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const R = (a, b) => a + (b - a) * rnd();

// bulle : (x,y) = pointe ; tail = longueur de la pointe ; follow = piste [[t,dy]] si le locuteur bouge
function bub(who, text, x, y, t0, dur, { shout = false, tail = 30, follow = null } = {}) {
  lines.push({ who, t0, t1: +(t0 + dur).toFixed(2), text });
  const fs = shout ? 50 : 44, w = text.length * fs * 0.55 + 64, h = fs + 36;
  const cx = Math.min(Math.max(x, w / 2 + 70), W - 70 - w / 2), rel = cx - x;
  const fill = shout ? '#fff36b' : '#ffffff';
  const tx = Math.max(Math.min(0, rel + w / 2 - 50), rel - w / 2 + 50);
  let g = `<g style="${an({ n: 'pop', d: dur, t: t0, f: 'both' })}">
  <rect x="${rel - w / 2}" y="${-h - tail}" width="${w}" height="${h}" rx="${shout ? 16 : 30}" fill="${fill}" stroke="${INK}" stroke-width="6"/>
  <path d="M${tx - 22} ${-tail - 4} L0 0 L${tx + 18} ${-tail - 4}Z" fill="${fill}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <rect x="${tx - 18}" y="${-tail - 10}" width="${34}" height="11" fill="${fill}"/>
  <text x="${rel}" y="${-tail - h / 2 + fs * 0.35}" class="bt" style="font-size:${fs}px">${esc(text)}</text></g>`;
  if (follow) g = T(follow.map(([t, dy, e]) => [t, `translate(0px,${dy}px)`, e]), g);
  return `<g transform="translate(${x} ${y})">${g}</g>`;
}
function sfx(text, x, y, t0, dur, rotd = 0, fill = '#ffd23f', fs = 110, name) {
  if (name) ev(name, t0);
  return `<g transform="translate(${x} ${y}) rotate(${rotd})"><g style="${an({ n: 'sfxk', d: dur, t: t0, f: 'both' })}">
  <text class="sfx" style="font-size:${fs}px;fill:${fill}">${esc(text)}</text></g></g>`;
}

// ───────── visages (règles du guide : grands yeux, pas de dents, sourcils fins) ─────────
const segs = (moods) => {
  const m = [...moods].sort((a, b) => a[0] - b[0]), out = [];
  let t = 0;
  for (const [a, b, md] of m) { if (a > t) out.push([t, a, 'calm']); out.push([a, b, md]); t = b; }
  if (t < 99) out.push([t, 99, 'calm']);
  return out;
};
const moodAt = (S, t) => (S.find(([a, b]) => t >= a && t < b) || [0, 0, 'calm'])[2];
function face({ ex, ey, er, my, mw = 13, by, talk = [], moods = [], look = [], blink = 0, browC = INK, browW = 5 }) {
  const S = segs(moods);
  const lookSt = look.length ? kf(look.map(([t, dx, dy, e]) => [t, `translate(${dx}px,${dy}px)`, e])) : '';
  const open = `<g style="transform-origin:0px ${ey}px;animation:blink 3.7s ${blink}s infinite">` +
    [-ex, ex].map((x) => `<ellipse cx="${x}" cy="${ey}" rx="${er}" ry="${er * 1.12}" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('') +
    `<g style="${lookSt}">` + [-ex, ex].map((x) => `<circle cx="${x}" cy="${ey + 1}" r="${er * 0.72}" fill="#2a1710"/><circle cx="${x - er * 0.24}" cy="${ey - er * 0.3}" r="${er * 0.3}" fill="#fff"/><circle cx="${x + er * 0.26}" cy="${ey + er * 0.32}" r="${er * 0.13}" fill="#fff"/>`).join('') + '</g></g>';
  const st = `stroke="${INK}" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const eyesOf = (m) => {
    if (m === 'happy') return [-ex, ex].map((x) => `<path d="M${x - er * 0.85} ${ey + 4} Q${x} ${ey - er * 1.05} ${x + er * 0.85} ${ey + 4}" ${st}/>`).join('');
    if (m === 'shock') return [-ex, ex].map((x, i) => { const k = i ? -1 : 1; return `<path d="M${x - k * er * 0.7} ${ey - er * 0.65} L${x + k * er * 0.55} ${ey} L${x - k * er * 0.7} ${ey + er * 0.65}" ${st}/>`; }).join('');
    if (m === 'sleep') return [-ex, ex].map((x) => `<path d="M${x - er * 0.8} ${ey - 2} Q${x} ${ey + er * 0.8} ${x + er * 0.8} ${ey - 2}" ${st}/>`).join('');
    return open;
  };
  const browOf = (m) => [-1, 1].map((s) => {
    const cx = s * ex, o = cx + s * er * 0.85, i = cx - s * er * 0.85;
    let d;
    if (m === 'worried' || m === 'sad') d = `M${o} ${by + 5} Q${cx} ${by - 2} ${i} ${by - 9}`;
    else if (m === 'panic' || m === 'shock') d = `M${o} ${by - 6} Q${cx} ${by - 20} ${i} ${by - 8}`;
    else if (m === 'happy') d = `M${o} ${by - 2} Q${cx} ${by - 13} ${i} ${by - 2}`;
    else d = `M${o} ${by + 2} Q${cx} ${by - 7} ${i} ${by + 2}`;
    return `<path d="${d}" stroke="${browC}" stroke-width="${browW}" fill="none" stroke-linecap="round"/>`;
  }).join('');
  const D_ = `<path d="M${-mw} ${my - 2} Q0 ${my + 26} ${mw} ${my - 2}Z" fill="#c4545c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="0" cy="${my + 12}" rx="${mw * 0.45}" ry="4" fill="#ff9aa8"/>`;
  const O_ = `<ellipse cx="0" cy="${my + 8}" rx="${mw * 0.72}" ry="${mw}" fill="#c4545c" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="${my + 14}" rx="${mw * 0.4}" ry="3.5" fill="#ff9aa8"/>`;
  const mouthOf = (m) => {
    if (m === 'panic') return O_;
    if (m === 'shock') return `<ellipse cx="0" cy="${my + 4}" rx="${mw * 0.55}" ry="${mw * 0.7}" fill="#c4545c" stroke="${INK}" stroke-width="4"/>`;
    if (m === 'happy') return D_;
    if (m === 'worried') return `<path d="M${-mw} ${my + 3} q${mw / 2} -6 ${mw} 0 q${mw / 2} 6 ${mw} 0" ${st}/>`;
    if (m === 'sad') return `<path d="M${-mw} ${my + 8} Q0 ${my - 4} ${mw} ${my + 8}" ${st}/>`;
    if (m === 'sleep') return `<path d="M${-mw * 0.6} ${my} Q0 ${my + 7} ${mw * 0.6} ${my}" ${st}/>`;
    return `<path d="M${-mw} ${my} Q0 ${my + 12} ${mw} ${my}" ${st}/>`;
  };
  // pendant une réplique, la bouche au repos disparaît (sinon deux bouches)
  const restWins = [];
  for (const [a, b, m] of S) {
    let cur = a;
    for (const [ta, tb] of [...talk].sort((x, y) => x[0] - y[0])) {
      if (tb <= cur || ta >= b) continue;
      if (ta > cur) restWins.push([cur, ta, m]);
      cur = Math.max(cur, tb);
    }
    if (cur < b) restWins.push([cur, b, m]);
  }
  let out = S.map(([a, b, m]) => vis(a, b, eyesOf(m) + browOf(m))).join('');
  out += restWins.map(([a, b, m]) => vis(a, b, mouthOf(m))).join('');
  out += talk.map(([a, b]) => {
    const m = moodAt(S, a + 0.01), shape = m === 'panic' || m === 'shock' ? O_ : D_;
    return vis(a, b, `<g style="transform-origin:0px ${my}px;${an({ n: 'talk', d: 0.13, t: a, c: Math.max(1, Math.round((b - a) / 0.13)), dir: 'alternate' })}">${shape}</g>`);
  }).join('');
  return out;
}
const sweat = (x, y, wins) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'sweatk', d: 0.5, c: 999, dir: 'alternate' })}"><path d="M${x} ${y} q-11 19 0 26 q11 -7 0 -26z" fill="#8fd3ff" stroke="${INK}" stroke-width="3"/></g>`)).join('');

// bras d'un seul tenant, pivot à l'épaule ; held = objet tenu, gardé droit par contre-rotation
function arm({ sx, sy, len, w, sleeve, hand, track, held = '' }) {
  const tr = track || [[0, 0]];
  const L = len + 4;
  const st = `transform-origin:${sx}px ${sy}px;${kf(rot(tr))}`;
  const counter = held ? `transform-origin:${sx}px ${sy + L}px;${kf(rot(tr.map(([t, a, e]) => [t, -a, e])))}` : '';
  return `<g style="${st}"><rect x="${sx - w / 2}" y="${sy - 6}" width="${w}" height="${len + 6}" rx="${w / 2}" fill="${sleeve}" stroke="${INK}" stroke-width="5"/>
    <circle cx="${sx}" cy="${sy + L}" r="${w * 0.55}" fill="${hand}" stroke="${INK}" stroke-width="5"/>
    ${held ? `<g style="${counter}"><g transform="translate(${sx} ${sy + L})">${held}</g></g>` : ''}</g>`;
}
// sauts sur place (CSS hop avec --h)
const hopWrap = (inner, hops = []) => {
  for (const [a, b, h, per = 0.42] of hops) { const n = Math.max(1, Math.round((b - a) / per)); inner = `<g style="--h:${h}px;${an({ n: 'hop', d: (b - a) / n, t: a, c: n })}">${inner}</g>`; }
  return inner;
};
const shadow = (rx) => `<ellipse cx="0" cy="2" rx="${rx}" ry="13" fill="#000" opacity=".2"/>`;

// ───────── personnages (pieds en (0,0), de face) ─────────
function lou(o = {}) {
  const skin = '#ffd9b8', hair = '#a24a1f', top = '#3fb27f', leg = '#3d5a99';
  const head = `
    <g style="transform-origin:78px -318px;${kf(rot(o.pony || [[0, 0]]))}"><g style="transform-origin:78px -318px;animation:ponyk 1.6s ease-in-out infinite alternate">
      <path d="M78 -322 C130 -350 168 -300 150 -236 C140 -200 120 -186 104 -196 C122 -240 110 -290 74 -300Z" fill="${hair}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M96 -300 C126 -296 140 -262 132 -226" stroke="#7d3412" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>
    <circle cx="-86" cy="-246" r="17" fill="${skin}" stroke="${INK}" stroke-width="5"/><circle cx="86" cy="-246" r="17" fill="${skin}" stroke="${INK}" stroke-width="5"/>
    <circle cx="0" cy="-255" r="88" fill="${skin}" stroke="${INK}" stroke-width="5"/>
    <path d="M-92 -248 C-100 -330 -44 -362 0 -360 C52 -362 104 -330 92 -248 C86 -282 66 -298 40 -296 C30 -280 8 -274 -8 -290 C-24 -276 -52 -278 -66 -298 C-82 -290 -90 -272 -92 -248Z" fill="${hair}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="78" cy="-318" r="13" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
    <path d="M-60 -318 l7 -15 l7 15 l15 2 l-11 10 l3 15 l-14 -8 l-14 8 l3 -15 l-11 -10z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <ellipse cx="-56" cy="-212" rx="14" ry="8" fill="#ff8c8c" opacity=".75"/><ellipse cx="56" cy="-212" rx="14" ry="8" fill="#ff8c8c" opacity=".75"/>
    <path d="M-5 -222 q5 5 10 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${face({ ex: 33, ey: -244, er: 21, my: -204, mw: 14, by: -280, talk: o.talk, moods: o.moods, look: o.look, blink: 0.3 })}`;
  const inner = `
    <rect x="-36" y="-76" width="26" height="70" rx="12" fill="${leg}" stroke="${INK}" stroke-width="5"/><rect x="10" y="-76" width="26" height="70" rx="12" fill="${leg}" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="-26" cy="-8" rx="24" ry="12" fill="#e8434e" stroke="${INK}" stroke-width="5"/><ellipse cx="26" cy="-8" rx="24" ry="12" fill="#e8434e" stroke="${INK}" stroke-width="5"/>
    <g style="transform-origin:0px -70px;animation:breathe 1.2s ease-in-out infinite alternate">
      <path d="M-50 -180 C-62 -150 -68 -100 -72 -62 Q0 -50 72 -62 C68 -100 62 -150 50 -180 Q0 -196 -50 -180Z" fill="${top}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-64 -120 Q0 -108 64 -120" stroke="#ffd23f" stroke-width="13" fill="none"/>
      <path d="M-22 -186 Q0 -170 22 -186" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
      ${arm({ sx: -54, sy: -170, len: 66, w: 26, sleeve: top, hand: skin, track: o.armL || [[0, 12]], held: o.heldL })}
      ${arm({ sx: 54, sy: -170, len: 66, w: 26, sleeve: top, hand: skin, track: o.armR || [[0, -12]], held: o.heldR })}
      <g style="transform-origin:0px -180px;${kf(rot(o.head || [[0, 0]]))}"><g style="transform-origin:0px -180px;animation:idlehead 1.9s ease-in-out infinite alternate">${head}</g></g>
      ${sweat(104, -300, o.sweat || [])}
    </g>`;
  return shadow(70) + hopWrap(T(o.body || [[0, 'none']], inner), o.hops);
}

function nadia(o = {}) {
  const skin = '#c68863', hair = '#2a1a14', jk = '#7b4fd1', leg = '#2f3a5c';
  const head = `
    ${[[-72, -360, 40], [72, -360, 40], [-58, -410, 38], [58, -410, 38], [0, -428, 46]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hair}" stroke="${INK}" stroke-width="5"/>`).join('')}
    <circle cx="0" cy="-462" r="36" fill="${hair}" stroke="${INK}" stroke-width="5"/><rect x="-30" y="-436" width="60" height="12" rx="6" fill="#ffb300" stroke="${INK}" stroke-width="3.5"/>
    <circle cx="-80" cy="-336" r="15" fill="${skin}" stroke="${INK}" stroke-width="5"/><circle cx="80" cy="-336" r="15" fill="${skin}" stroke="${INK}" stroke-width="5"/>
    <circle cx="-82" cy="-312" r="7" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle cx="82" cy="-312" r="7" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>
    <circle cx="0" cy="-345" r="80" fill="${skin}" stroke="${INK}" stroke-width="5"/>
    <path d="M-84 -342 C-86 -418 -30 -434 0 -430 C40 -434 88 -412 84 -342 C72 -380 42 -392 12 -384 C-14 -396 -58 -392 -84 -342Z" fill="${hair}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="-52" cy="-304" rx="13" ry="7" fill="#ff7f7f" opacity=".6"/><ellipse cx="52" cy="-304" rx="13" ry="7" fill="#ff7f7f" opacity=".6"/>
    <path d="M-5 -315 q5 5 10 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${face({ ex: 31, ey: -336, er: 19, my: -293, mw: 13, by: -370, talk: o.talk, moods: o.moods, look: o.look, blink: 1.4 })}`;
  const inner = `
    <rect x="-38" y="-120" width="30" height="112" rx="13" fill="${leg}" stroke="${INK}" stroke-width="5"/><rect x="8" y="-120" width="30" height="112" rx="13" fill="${leg}" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="-27" cy="-8" rx="26" ry="12" fill="#2a2a33" stroke="${INK}" stroke-width="5"/><ellipse cx="27" cy="-8" rx="26" ry="12" fill="#2a2a33" stroke="${INK}" stroke-width="5"/>
    <g style="transform-origin:0px -110px;animation:breathe 1.3s ease-in-out infinite alternate">
      <path d="M-62 -264 C-78 -220 -82 -150 -80 -104 Q0 -94 80 -104 C82 -150 78 -220 62 -264 Q0 -282 -62 -264Z" fill="${jk}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-26 -270 L0 -206 L26 -270Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-20 -266 L-8 -186 M20 -266 L8 -186" stroke="#e8434e" stroke-width="5" fill="none"/>
      <rect x="-20" y="-190" width="40" height="46" rx="6" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><path d="M-11 -172 h22 M-11 -160 h16" stroke="${INK}" stroke-width="3"/>
      ${arm({ sx: -66, sy: -254, len: 90, w: 30, sleeve: jk, hand: skin, track: o.armL || [[0, 10]], held: o.heldL })}
      ${arm({ sx: 66, sy: -254, len: 90, w: 30, sleeve: jk, hand: skin, track: o.armR || [[0, -10]], held: o.heldR })}
      <g style="transform-origin:0px -270px;${kf(rot(o.head || [[0, 0]]))}"><g style="transform-origin:0px -270px;animation:idlehead 2.1s ease-in-out .5s infinite alternate">${head}</g></g>
      ${sweat(-104, -390, o.sweat || [])}
    </g>`;
  return shadow(80) + hopWrap(T(o.body || [[0, 'none']], inner), o.hops);
}

function boulon(o = {}) {
  const skin = '#f6c7a1', suit = '#2b3f73', grey = '#c9c9d2';
  const head = `
    <circle cx="-80" cy="-346" r="17" fill="${skin}" stroke="${INK}" stroke-width="5"/><circle cx="80" cy="-346" r="17" fill="${skin}" stroke="${INK}" stroke-width="5"/>
    <circle cx="0" cy="-350" r="80" fill="${skin}" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="-24" cy="-404" rx="24" ry="10" fill="#fff" opacity=".55"/>
    <g style="transform-origin:0px -380px;${kf(o.tufts || [[0, 'none']])}">
      <ellipse cx="-74" cy="-380" rx="22" ry="30" fill="${grey}" stroke="${INK}" stroke-width="5"/><ellipse cx="74" cy="-380" rx="22" ry="30" fill="${grey}" stroke="${INK}" stroke-width="5"/>
      <path d="M-24 -426 Q0 -446 28 -428 M-10 -429 Q8 -444 30 -436" stroke="${grey}" stroke-width="6" fill="none" stroke-linecap="round"/></g>
    <ellipse cx="-55" cy="-318" rx="13" ry="7" fill="#ff8c8c" opacity=".65"/><ellipse cx="55" cy="-318" rx="13" ry="7" fill="#ff8c8c" opacity=".65"/>
    ${face({ ex: 31, ey: -360, er: 18, my: -294, mw: 14, by: -392, talk: o.talk, moods: o.moods, look: o.look, blink: 2.2, browC: '#8d8d99', browW: 8 })}
    <ellipse cx="0" cy="-330" rx="16" ry="13" fill="#f2a283" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -316px;${kf(o.mous || [[0, 'none']])}"><path d="M0 -320 C-20 -330 -56 -326 -62 -300 C-42 -308 -18 -304 0 -312 C18 -304 42 -308 62 -300 C56 -326 20 -330 0 -320Z" fill="${grey}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/></g>`;
  const inner = `
    <rect x="-44" y="-100" width="32" height="92" rx="13" fill="#5b6070" stroke="${INK}" stroke-width="5"/><rect x="12" y="-100" width="32" height="92" rx="13" fill="#5b6070" stroke="${INK}" stroke-width="5"/>
    <g style="transform-origin:0px -90px;${kf(o.chest || [[0, 'none']])}"><g style="transform-origin:0px -90px;animation:breathe 1.5s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-185" rx="102" ry="100" fill="${suit}" stroke="${INK}" stroke-width="5"/>
      <path d="M-32 -280 L0 -200 L32 -280Z" fill="#fff"/>
      <path d="M-10 -272 L10 -272 L16 -204 L0 -184 L-16 -204Z" fill="#e8434e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <g clip-path="url(#bClip)">${[['#2a5cc9', -20], ['#fff', 0], ['#e8434e', 20]].map(([c, d]) => `<path d="M${-120 - 0.6 * d} ${-270 + 0.8 * d} L${110 - 0.6 * d} ${-95 + 0.8 * d}" stroke="${c}" stroke-width="21"/>`).join('')}</g>
      <ellipse cx="0" cy="-185" rx="102" ry="100" fill="none" stroke="${INK}" stroke-width="5"/>
      ${arm({ sx: -88, sy: -240, len: 82, w: 32, sleeve: suit, hand: skin, track: o.armL || [[0, 22]], held: o.heldL })}
      ${arm({ sx: 88, sy: -240, len: 82, w: 32, sleeve: suit, hand: skin, track: o.armR || [[0, -22]], held: o.heldR })}
      <g style="transform-origin:0px -276px;${kf(rot(o.head || [[0, 0]]))}"><g style="transform-origin:0px -276px;animation:idlehead 2.4s ease-in-out 1s infinite alternate">${head}${o.hat || ''}</g></g>
      ${sweat(108, -400, o.sweat || [])}
    </g></g>`;
  return T(o.body || [[0, 'none']], inner);
}

// Pip, pigeon de la mairie (pieds en (0,0), regarde à droite)
const pipBody = (wing = '', eyes = 'open') => `
  <ellipse cx="-4" cy="-46" rx="54" ry="40" fill="#9aa7bd" stroke="${INK}" stroke-width="5"/>
  <path d="M-52 -56 L-86 -70 L-80 -40 Z" fill="#7f8ba3" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
  <ellipse cx="10" cy="-36" rx="34" ry="24" fill="#c5cee0"/>
  ${wing || `<path d="M-40 -56 C-20 -80 20 -70 26 -48 C6 -40 -20 -38 -40 -56Z" fill="#7f8ba3" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`}
  <path d="M20 -66 C30 -78 50 -78 56 -64" stroke="#5fbf9a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M24 -72 C34 -80 46 -80 52 -72" stroke="#a46fd1" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="-90" r="30" fill="#9aa7bd" stroke="${INK}" stroke-width="5"/>
  <path d="M66 -94 L84 -88 L66 -82Z" fill="#ffb300" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  ${eyes === 'sleep' ? `<path d="M40 -96 Q48 -88 56 -96" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    : `<g style="transform-origin:48px -96px;animation:blink 3.1s .7s infinite"><circle cx="48" cy="-96" r="11" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="51" cy="-95" r="7.5" fill="#2a1710"/><circle cx="49" cy="-98" r="3" fill="#fff"/></g>`}
  <ellipse cx="34" cy="-74" rx="8" ry="5" fill="#ff9aa8" opacity=".8"/>`;
const pipFeet = `<path d="M-12 -8 v-0 M-14 0 l6 -12 l6 12 M8 0 l6 -12 l6 12" stroke="#ff8a3d" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const pipFly = (extra = '') => `<g transform="translate(0 -40)">${pipBody(`<g style="transform-origin:-10px -56px;animation:flap .14s ease-in-out infinite alternate"><path d="M-10 -56 C-40 -130 20 -150 40 -120 C20 -100 6 -76 -10 -56Z" fill="#7f8ba3" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/></g>`)}${extra}</g>`;

// ───────── enveloppes ─────────
const envl = (w = 110, h = 74, c = '#fffaf0', extra = '') => `<g><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="7" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M${-w / 2 + 4} ${-h / 2 + 5} L0 ${h * 0.1} L${w / 2 - 4} ${-h / 2 + 5}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>${extra}</g>`;
const ECOL = ['#fffaf0', '#fffaf0', '#fffaf0', '#ffd6e4', '#d6ecff', '#fff1a8', '#e3f7d3'];
const labelEnv = (label, band, ink = '#fff', icon = '') => `<g transform="rotate(-4)">${envl(270, 176, '#fffaf0', `<rect x="-124" y="14" width="248" height="56" rx="12" fill="${band}" stroke="${INK}" stroke-width="4"/><text y="54" class="bt" style="font-size:32px;fill:${ink}">${label}</text>${icon}`)}</g>`;

// ───────── tas de papier (le sommet est à y = 0 dans le repère du tas) ─────────
const smooth = (x) => x * x * (3 - 2 * x);
const flatNear = (x) => Math.max(...[170, 900].map((c) => 1 - smooth(Math.min(1, Math.max(0, (Math.abs(x - c) - 70) / 80)))));
const cy = (x) => (1 - flatNear(x)) * (-24 * Math.sin(x / 53) - 14 * Math.sin(x / 23 + 1));
let contour = 'M-80 1300 L-80 0';
for (let x = -80; x <= 1160; x += 20) contour += ` L${x} ${cy(x).toFixed(1)}`;
contour += ' L1160 1300Z';
const pileInside = Array.from({ length: 150 }, () => `<g transform="translate(${R(-60, 1140).toFixed(0)} ${R(10, 700).toFixed(0)}) rotate(${R(-40, 40).toFixed(0)})">${envl(R(90, 130), R(60, 84), ECOL[Math.floor(R(0, ECOL.length))])}</g>`).join('');
const pileEdge = Array.from({ length: 26 }, (_, i) => { const x = -60 + i * 47 + R(-10, 10); return `<g transform="translate(${x.toFixed(0)} ${(cy(x) + 4).toFixed(0)}) rotate(${R(-35, 35).toFixed(0)})">${envl(R(92, 120), R(62, 78), ECOL[Math.floor(R(0, ECOL.length))])}</g>`; }).join('');
const mainPile = `<path d="${contour}" fill="#f1e6cc" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><g clip-path="url(#pileClip)">${pileInside}</g>${pileEdge}`;
const heapPath = 'M250 460 L250 130 C262 26 362 -40 540 -50 C718 -40 818 26 830 130 L830 460Z';
const heapIn = Array.from({ length: 50 }, () => `<g transform="translate(${R(260, 820).toFixed(0)} ${R(-20, 440).toFixed(0)}) rotate(${R(-40, 40).toFixed(0)})">${envl(R(90, 120), R(60, 80), ECOL[Math.floor(R(0, ECOL.length))])}</g>`).join('');
const heapEdge = [[300, 70], [360, 0], [430, -32], [500, -46], [570, -46], [640, -34], [710, -6], [770, 40], [810, 100]].map(([x, y]) => `<g transform="translate(${x} ${y}) rotate(${R(-35, 35).toFixed(0)})">${envl(R(92, 116), R(62, 76), ECOL[Math.floor(R(0, ECOL.length))])}</g>`).join('');
const deskHeap = `<path d="${heapPath}" fill="#f1e6cc" stroke="${INK}" stroke-width="6"/><g clip-path="url(#heapClip)">${heapIn}</g>${heapEdge}`;

// hauteur du tas principal (sommet), en px de scène
const P_LOW = 2000, P_TOP = 940, R0 = 6.4, R1 = 14.0, DN0 = 30.8, VDN = 120;
const DN1 = DN0 + (P_LOW - P_TOP) / VDN;
const P = (t) => (t < R0 ? P_LOW : t < R1 ? P_LOW - ((P_LOW - P_TOP) * (t - R0)) / (R1 - R0) : t < DN0 ? P_TOP : t < DN1 ? P_TOP + VDN * (t - DN0) : P_LOW);
const HEAP = [[0, 1960], [R0, 1960, 'linear'], [R1, 900], [37.6, 900, 'ease-in'], [39.4, 1650]];
const heapTop = (t) => (t < 37.6 ? Math.min(P(t) - 40, 1960) : 900 + 750 * ((t - 37.6) / 1.8) ** 2) - 50;

// ───────── décor : bureau du maire ─────────
const LOU_X = 170, LOU_S = 1.25, NAD_X = 900, NAD_S = 1.22, BOU_X = 540, BOU_Y = 1500, BOU_S = 1.3;
const counter = (txt, col, fs = 124) => `<text x="710" y="${fs > 100 ? 560 : 548}" class="sfx" data-role="hook" style="font-size:${fs}px;fill:${col};stroke-width:0">${txt}</text>`;
const screenTxt = (big, small, col) => counter(big, col) + `<text x="710" y="626" class="bt" data-role="hook" style="font-size:40px;fill:#2b3f73">${small}</text>`;
const screen = `<g>
  <rect x="402" y="312" width="616" height="396" rx="22" fill="#2b2f3a" stroke="${INK}" stroke-width="6"/>
  <rect x="424" y="334" width="572" height="352" rx="8" fill="#eef5ff"/>
  <rect x="424" y="334" width="572" height="62" rx="8" fill="#3b82f6"/>
  <g transform="translate(470 365) scale(.42)">${envl(110, 74, '#fff')}</g>
  ${[[0, 14], [28, 99]].map(([a, b]) => vis(a, b, `<text x="730" y="378" class="bt" style="font-size:32px;fill:#fff">Boîte de réception</text>`)).join('')}
  ${['839', '841', '843', '844', '846', '847'].map((n, i, a) => vis(i === 0 ? 0 : 0.25 + i * 0.28, i === a.length - 1 ? 6.4 : 0.25 + (i + 1) * 0.28, screenTxt(n, 'messages non lus', '#e8434e'))).join('')}
  ${vis(6.4, 31.2, `<g style="${an({ n: 'flash', d: 0.5, t: 6.4, c: 99, dir: 'alternate' })}">${screenTxt('999+', 'messages non lus', '#e8434e')}</g>`)}
  ${[['612', 31.2], ['305', 32.6], ['128', 34.0], ['42', 35.4], ['11', 36.8], ['5', 38.0]].map(([n, t], i, a) => vis(t, i < a.length - 1 ? a[i + 1][1] : 39.4, screenTxt(n, 'messages non lus', '#e88a1a'))).join('')}
  ${vis(39.4, 49.2, screenTxt('3', 'messages importants', '#22a06b'))}
  ${vis(49.2, 99, `<g style="${an({ n: 'flash', d: 0.4, t: 49.2, c: 99, dir: 'alternate' })}">${screenTxt('+1', 'nouveau courrier !', '#e8434e')}</g>`)}
</g>`;
const signBoard = vis(0, 34.1, `<g transform="translate(710 704)">${T([[0, 'none'], [32.9, 'translate(0px,0px) rotate(0deg) scale(1)', 'ease-in'], [33.5, 'translate(-430px,-110px) rotate(-200deg) scale(.6)'], [34.1, 'translate(-1000px,-160px) rotate(-420deg) scale(.4)']], `<g style="transform-origin:-226px 6px;${kf(rot([[0, 0], [31.6, 0, 'cubic-bezier(.3,1.6,.5,1)'], [32.2, 14], [33.0, 9], [33.6, 15], [55, 15]]))}">
  <path d="M-226 6 L0 -26 L226 6" stroke="${INK}" stroke-width="3" fill="none"/>
  <rect x="-240" y="6" width="480" height="66" rx="10" fill="#22a06b" stroke="${INK}" stroke-width="5"/>
  <text y="51" class="bt" style="font-size:31px;fill:#fff;letter-spacing:1px">TOUT EST SOUS CONTRÔLE</text></g>`, '-226px 6px')}</g>`) + `<circle cx="484" cy="710" r="6" fill="#888" stroke="${INK}" stroke-width="3"/>`;
const cloudS = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse rx="60" ry="22"/><ellipse cx="-30" cy="-14" rx="30" ry="22"/><ellipse cx="20" cy="-22" rx="36" ry="27"/></g>`;
const WIN_OPEN = 29.6;
const windowEl = `<g>
  <rect x="60" y="380" width="320" height="480" fill="#8fd0ff"/>
  <g style="animation:cdrift 12s ease-in-out infinite alternate">${cloudS(150, 470, 0.9)}${cloudS(300, 560, 0.6)}</g>
  <path d="M60 760 L110 700 L150 730 L200 660 L250 700 L300 640 L380 700 L380 860 L60 860Z" fill="#c9b6e8" stroke="${INK}" stroke-width="3"/>
  <path d="M60 800 h90 v-50 l30 -30 l30 30 v50 h60 v-36 h40 v36 h70 V860 H60Z" fill="#e8a27a" stroke="${INK}" stroke-width="3"/>
  <g style="transform-origin:66px 0px;${kf([[0, 'scaleX(1)'], [WIN_OPEN, 'scaleX(1)', 'cubic-bezier(.3,1.5,.5,1)'], [WIN_OPEN + 0.35, 'scaleX(.16)']])}">
    <rect x="66" y="386" width="154" height="468" fill="#bfe6ff" opacity=".45" stroke="#fff" stroke-width="10"/><path d="M143 386 V854 M66 620 H220" stroke="#fff" stroke-width="8"/><path d="M90 420 l40 -30 M92 470 l70 -54" stroke="#fff" stroke-width="7" opacity=".7"/></g>
  <g style="transform-origin:374px 0px;${kf([[0, 'scaleX(1)'], [WIN_OPEN, 'scaleX(1)', 'cubic-bezier(.3,1.5,.5,1)'], [WIN_OPEN + 0.35, 'scaleX(.16)']])}">
    <rect x="220" y="386" width="154" height="468" fill="#bfe6ff" opacity=".45" stroke="#fff" stroke-width="10"/><path d="M297 386 V854 M220 620 H374" stroke="#fff" stroke-width="8"/><path d="M244 430 l40 -30" stroke="#fff" stroke-width="7" opacity=".7"/></g>
  <rect x="54" y="374" width="332" height="492" fill="none" stroke="${INK}" stroke-width="8"/>
  <rect x="40" y="860" width="360" height="22" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <rect x="20" y="352" width="400" height="14" rx="7" fill="#8a5224" stroke="${INK}" stroke-width="4"/>
  <g style="transform-origin:46px 360px;animation:sway 2.6s ease-in-out infinite alternate"><path d="M14 360 L82 360 Q78 600 60 880 L4 880 Q12 600 14 360Z" fill="#ff8fb1" stroke="${INK}" stroke-width="5"/><path d="M36 372 Q34 620 24 870 M60 372 Q58 620 48 870" stroke="#e86a93" stroke-width="4" fill="none"/></g>
  <g style="transform-origin:394px 360px;animation:sway 2.6s ease-in-out .5s infinite alternate-reverse"><path d="M358 360 L426 360 Q428 600 436 880 L378 880 Q362 600 358 360Z" fill="#ff8fb1" stroke="${INK}" stroke-width="5"/><path d="M380 372 Q382 620 392 870 M404 372 Q406 620 414 870" stroke="#e86a93" stroke-width="4" fill="none"/></g>
</g>`;
const cabinet = `<g transform="translate(830 880)">${[0, 1, 2].map((i) => `<rect x="0" y="${i * 140}" width="230" height="140" fill="#9db0c8" stroke="${INK}" stroke-width="5"/><rect x="85" y="${i * 140 + 30}" width="60" height="24" rx="5" fill="#fff" stroke="${INK}" stroke-width="3.5"/><rect x="95" y="${i * 140 + 80}" width="40" height="12" rx="6" fill="#5b6070"/>`).join('')}
  <g transform="translate(40 -60)"><rect width="34" height="60" fill="#e8434e" stroke="${INK}" stroke-width="4"/><rect x="38" y="-10" width="30" height="70" fill="#3b82f6" stroke="${INK}" stroke-width="4"/><rect x="72" y="6" width="40" height="54" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><rect x="116" y="-4" width="28" height="64" fill="#22a06b" stroke="${INK}" stroke-width="4"/></g>
  <g transform="translate(190 0)"><path d="M-22 0 L-16 -50 L16 -50 L22 0Z" fill="#e88a5a" stroke="${INK}" stroke-width="4"/><path d="M0 -50 C-30 -90 -40 -110 -20 -130 M0 -50 C10 -100 30 -110 40 -140 M0 -50 C-6 -100 0 -130 4 -150" stroke="#3fae55" stroke-width="10" fill="none" stroke-linecap="round"/></g></g>`;
const lamp = `<g transform="translate(540 0)"><line x1="0" y1="0" x2="0" y2="150" stroke="${INK}" stroke-width="5"/><g style="transform-origin:0px 0px;animation:lampk 3s ease-in-out infinite alternate"><path d="M-70 210 Q-60 150 0 145 Q60 150 70 210Z" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="212" rx="22" ry="10" fill="#fff8c4" stroke="${INK}" stroke-width="3"/></g></g>`;
const wallBg = `
  <rect width="${W}" height="1310" fill="#f6e7c8"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 80 + 20}" y="130" width="34" height="1180" fill="#efdcb6"/>`).join('')}
  <rect width="${W}" height="120" fill="#e9d4ad"/><rect y="112" width="${W}" height="22" fill="#c9a878" stroke="${INK}" stroke-width="4"/>
  <rect y="1290" width="${W}" height="630" fill="#c98f5a"/>
  ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${1330 + i * i * 9 + i * 30}" x2="${W}" y2="${1330 + i * i * 9 + i * 30}" stroke="#a9703f" stroke-width="4"/>`).join('')}
  ${Array.from({ length: 12 }, (_, i) => `<line x1="${540 + (i - 5.5) * 100}" y1="1290" x2="${540 + (i - 5.5) * 260}" y2="1920" stroke="#a9703f" stroke-width="3"/>`).join('')}
  <rect y="1278" width="${W}" height="24" fill="#8a5224" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="560" cy="1760" rx="470" ry="110" fill="#d8504a" stroke="${INK}" stroke-width="5"/><ellipse cx="560" cy="1760" rx="380" ry="76" fill="none" stroke="#ffd23f" stroke-width="8" stroke-dasharray="26 18"/>
  ${lamp}${windowEl}${screen}${signBoard}${cabinet}`;
const desk = `
  <path d="M276 1236 L804 1236 L836 1292 L244 1292Z" fill="#b8763f" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="244" y="1290" width="592" height="270" fill="#8f5530" stroke="${INK}" stroke-width="5"/>
  <rect x="274" y="1320" width="240" height="210" rx="10" fill="#9f6338" stroke="${INK}" stroke-width="4"/><rect x="566" y="1320" width="240" height="210" rx="10" fill="#9f6338" stroke="${INK}" stroke-width="4"/>
  <rect x="404" y="1350" width="272" height="64" rx="10" fill="#22a06b" stroke="${INK}" stroke-width="5"/><text x="540" y="1393" class="bt" style="font-size:31px;fill:#fff">M. LE MAIRE</text>
  <g transform="translate(330 1238)"><rect x="-6" y="-92" width="150" height="92" rx="8" fill="#c7cdd8" stroke="${INK}" stroke-width="5"/><circle cx="69" cy="-46" r="14" fill="#fff" opacity=".8"/></g>
  <g transform="translate(740 1240)"><rect x="-26" y="-56" width="52" height="56" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M26 -44 q22 4 0 28" stroke="${INK}" stroke-width="5" fill="none"/><path d="M-10 -66 q6 -10 0 -20 M8 -66 q6 -10 0 -20" stroke="#bbb" stroke-width="4" fill="none" style="animation:steam 1.4s ease-in-out infinite alternate"/></g>`;

// ───────── Monsieur Boulon (derrière le bureau) ─────────
const envOnHead = vis(39.0, 40.55, `<g transform="translate(18 -446) rotate(-14)">${envl(110, 72, '#fff1a8')}</g>`);
const boulonEl = put(BOU_X, BOU_Y, BOU_S, boulon({
  talk: [[2.9, 3.85], [41.05, 42.4], [50.05, 51.15]],
  moods: [[0.7, 2.8, 'worried'], [2.8, 5.4, 'panic'], [5.4, 5.95, 'worried'], [5.95, 6.6, 'shock'], [6.6, 39.0, 'panic'], [39.0, 40.6, 'shock'], [41.0, 44.3, 'happy'], [44.3, 45.6, 'happy'], [45.6, 47.4, 'happy'], [49.4, 51.0, 'sad'], [51.0, 52.5, 'shock']],
  look: [[0, 5, -7], [2.8, 5, -7], [3.0, 0, 0], [5.9, 0, -8], [39, 0, 0], [49.3, 0, 0], [49.5, 6, 6], [50.85, 6, 6], [51.0, -7, 0]],
  armL: [[0, 22], [2.8, 22, 'cubic-bezier(.3,1.4,.5,1)'], [3.1, 150], [3.6, 140], [4.1, 152], [4.6, 140], [5.1, 150], [5.6, 24], [5.95, 24, 'ease-out'], [6.2, 165], [6.7, 150], [7.2, 166], [7.7, 150], [8.2, 166], [8.7, 150], [9.2, 166], [9.7, 150], [10.2, 166], [10.7, 150], [11.2, 166], [39.2, 166], [39.6, 22], [41.0, 22, 'cubic-bezier(.3,1.3,.5,1)'], [41.4, 112], [44.3, 112], [44.8, 40], [49.4, 40], [49.8, 10]],
  armR: [[0, -22], [2.8, -22, 'cubic-bezier(.3,1.4,.5,1)'], [3.1, -150], [3.6, -140], [4.1, -152], [4.6, -140], [5.1, -150], [5.6, -24], [5.95, -24, 'ease-out'], [6.2, -165], [6.7, -150], [7.2, -166], [7.7, -150], [8.2, -166], [8.7, -150], [9.2, -166], [9.7, -150], [10.2, -166], [10.7, -150], [11.2, -166], [39.2, -166], [39.6, -22], [41.0, -22, 'cubic-bezier(.3,1.3,.5,1)'], [41.4, -112], [44.3, -112], [44.8, -40], [49.4, -40], [49.8, -10]],
  head: [[0, 0], [0.6, 7], [2.8, 7], [3.1, 0], [40.15, 0], [40.25, -12], [40.35, 12], [40.45, -10], [40.55, 0], [49.3, 0], [49.6, 8], [50.85, 8], [51.0, -6]],
  chest: [[0, 'scale(1,1)'], [6.0, 'scale(1,1)', 'ease-out'], [6.08, 'scale(1.12,.86)'], [6.35, 'scale(1,1)'], [43.0, 'scale(1,1)'], [44.2, 'scale(1.14,1.08)'], [44.4, 'scale(1.14,1.08)', 'ease-out'], [44.85, 'scale(.94,.98)'], [45.3, 'scale(1,1)'], [45.7, 'scale(1,1)'], [46.6, 'scale(1.1,1.06)'], [46.8, 'scale(1.1,1.06)', 'ease-out'], [47.15, 'scale(.96,.99)'], [47.5, 'scale(1,1)']],
  tufts: [[0, 'none'], [39.0, 'none'], [39.05, 'scale(1.25,1.35) rotate(8deg)'], [40.6, 'scale(1.25,1.35) rotate(8deg)'], [40.8, 'none']],
  mous: [[0, 'none'], [44.4, 'none'], [44.5, 'scaleX(1.18) translateY(-6px)'], [44.7, 'scaleX(.96)'], [44.9, 'scaleX(1.12) translateY(-4px)'], [45.2, 'none']],
  sweat: [[1.2, 2.8], [49.6, 52.1]],
  hat: envOnHead,
}));

// ───────── Nadia ─────────
const clipboard = `<g transform="rotate(-8) translate(-40 -70)"><rect x="-6" y="-8" width="96" height="124" rx="8" fill="#b8763f" stroke="${INK}" stroke-width="5"/><rect x="6" y="6" width="72" height="100" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="26" y="-14" width="34" height="16" rx="5" fill="#9aa3ad" stroke="${INK}" stroke-width="3"/><path d="M16 30 h52 M16 48 h44 M16 66 h50 M16 84 h30" stroke="#9aa3ad" stroke-width="5"/></g>`;
const wave = (t0, t1, base, amp, per = 0.5) => { const p = []; for (let t = t0, i = 0; t < t1; t += per / 2, i++) p.push([+t.toFixed(3), base + (i % 2 ? amp : -amp)]); return p; };
const nadiaA = put(NAD_X, 1700, NAD_S, nadia({
  talk: [[7.5, 8.5]],
  moods: [[2.8, 5.95, 'worried'], [5.95, 6.5, 'shock'], [6.5, 99, 'panic']],
  look: [[0, 0, 6], [2.7, 0, 6], [2.9, -7, 0], [5.9, -7, 0], [6.1, 0, -8]],
  armL: [[0, 10], [6.4, 10, 'ease-out'], [6.7, 158], ...wave(6.9, 13.5, 160, 14)],
  armR: [[0, 38], [6.4, 38, 'ease-out'], [6.7, -158], ...wave(6.9, 13.5, -160, 14)],
  heldR: vis(0, 6.45, clipboard),
  head: [[0, 6], [2.8, 6], [3.0, -6], [5.9, -6], [6.1, 0]],
  body: [[0, 'none'], [9.4, 'none'], [9.8, 'scale(1.06,.9)'], [14, 'scale(1.06,.9)']],
  sweat: [[2.9, 6.0], [6.5, 14]],
}));
const nadiaFeet = [[28.0, 1500, 'ease-out'], [28.25, 1110], [28.45, 1160], [DN0, 1160, 'linear'], [35.3, 1700]];
const NF = (t) => (t < 28.25 ? 1110 : t < DN0 ? 1160 : Math.min(1700, P(t) + 220));
const nadThrows = [31.2, 32.1, 33.0, 33.9, 36.6, 37.5];
const throwTrack = (times, rest, up, out = 1) => { const p = [[0, rest]]; for (const t of times) p.push([t - 0.3, rest, 'ease-in'], [t, up * out, 'ease-out'], [t + 0.3, rest]); return p; };
const importantStack = `<g transform="translate(-24 -36) rotate(10)">${[0, 1, 2].map((i) => `<g transform="translate(${i * 6} ${-i * 12})">${envl(96, 64, '#e3f7d3', i === 2 ? `<circle cx="30" cy="12" r="12" fill="#22a06b" stroke="${INK}" stroke-width="3"/><path d="M24 12 l5 5 l9 -10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>` : '')}</g>`).join('')}</g>`;
const nadiaB = T(nadiaFeet.map(([t, y, e]) => [t, `translate(${NAD_X}px,${y}px) scale(${NAD_S})`, e]), nadia({
  talk: [[28.55, 29.4], [34.45, 35.72]],
  moods: [[28.0, 28.35, 'shock'], [28.35, 31.0, 'happy'], [37.4, 43.0, 'happy'], [44.4, 45.6, 'shock'], [46.8, 47.4, 'shock'], [49.4, 51.0, 'worried'], [51.0, 52.5, 'shock']],
  look: [[28, 0, 0], [31.0, -7, -2], [37.4, -7, -2], [37.6, -6, 0], [41.0, -7, 0], [49.3, -6, 2], [51.0, -7, 0]],
  armL: [[28.0, 150], [28.5, 150], [28.8, 20], [30.9, 20], ...throwTrack(nadThrows, 20, 150).slice(1), [38.2, 20], [44.4, 20], [44.6, 60], [45.3, 20]],
  armR: [[28.0, -150], [28.5, -150], [28.8, -14], [32.9, -14], [33.2, 40], [44.4, 40], [44.6, 0], [45.3, 40]],
  heldR: vis(33.1, 99, importantStack),
  body: [[0, 'none'], [43.0, 'none'], [44.2, 'rotate(-5deg)'], [44.4, 'rotate(-5deg)', 'ease-out'], [44.7, 'rotate(9deg)'], [45.6, 'rotate(0deg)'], [46.6, 'rotate(-3deg)'], [46.8, 'rotate(-3deg)', 'ease-out'], [47.1, 'rotate(6deg)'], [47.6, 'rotate(0deg)']],
}));
// main de Nadia qui dépasse du tas (repère du tas)
const formSheet = `<g transform="translate(-70 -110) rotate(4)"><rect x="-120" y="-70" width="240" height="140" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-120" y="-70" width="240" height="42" rx="8" fill="#7b4fd1"/><text y="-38" class="bt" style="font-size:28px;fill:#fff">FORMULAIRE</text><path d="M-96 0 h150 M-96 22 h120 M-96 44 h160" stroke="#9aa3ad" stroke-width="6"/><rect x="60" y="14" width="34" height="34" fill="none" stroke="${INK}" stroke-width="4"/><path d="M64 30 l10 10 l18 -22" stroke="#22a06b" stroke-width="6" fill="none"/></g>`;
const nadHand = vis(13.2, 28.0, `<g transform="translate(${NAD_X} 0)"><g style="transform-origin:0px 10px;${kf(rot([[13.2, 0], ...wave(13.4, 21.6, 0, 18, 0.6), [21.7, 0], [24.9, 0], ...wave(25.0, 27.9, 0, 12, 0.7)]))}">
  ${tf(`<rect x="-17" y="-96" width="34" height="110" rx="15" fill="#7b4fd1" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-104" r="20" fill="#c68863" stroke="${INK}" stroke-width="5"/><path d="M-14 -118 l-6 -14 M-2 -122 l-2 -16 M10 -120 l4 -14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>${vis(23.5, 25.0, formSheet)}`, { t0: 13.2, d: 0.3, from: 'translate(0px,110px)', to: 'translate(0px,0px)', e: 'cubic-bezier(.3,1.5,.5,1)' })}
</g></g>`);

// ───────── Lou ─────────
const LOU_UP0 = R0 + (P_LOW - 1640) / ((P_LOW - P_TOP) / (R1 - R0)); // le tas atteint ses pieds
const LOU_DN1 = DN0 + (1640 - P_TOP) / VDN;
const louFeet = [[0, 1640], [LOU_UP0, 1640, 'linear'], [R1, P_TOP], [DN0, P_TOP, 'linear'], [LOU_DN1, 1640]];
const LF = (t) => (t < LOU_UP0 ? 1640 : t < R1 ? Math.min(1640, P(t)) : t < DN0 ? P_TOP : Math.min(1640, P(t)));
const readEnvs = [
  [17.6, 20.4, labelEnv('PROMO -50 %', '#ff5c93')],
  [20.8, 23.8, labelEnv('RAPPEL AUTO', '#8a94a6', '#fff')],
  [24.2, 27.3, labelEnv('NEWSLETTER', '#f0a020')],
];
const louThrows = [31.5, 32.4, 33.3, 34.2, 35.1, 36.0, 37.0, 37.9];
const louArmR = [[0, -12], [5.95, -12, 'ease-out'], [6.2, -40], [8.9, -40, 'ease-out'], [9.1, -150], ...wave(9.3, 13.9, -150, 12, 0.42), [14.0, -20], [14.6, -20], [14.9, -45], [16.0, -45], [16.4, -12]];
readEnvs.forEach(([a, b], i) => louArmR.push(i ? [a - 0.2, -60] : [a - 0.3, -14], [a, -98, 'ease-out'], [b - 0.25, -98, 'ease-in'], [b, -165, 'ease-out']));
louArmR.push([27.6, -60], [27.9, -12], [43.0, -12], [44.4, -12, 'ease-out'], [44.6, -40], [45.4, -12]);
const louEl = T(louFeet.map(([t, y, e]) => [t, `translate(${LOU_X}px,${y}px) scale(${LOU_S})`, e]), lou({
  talk: [[14.65, 15.25], [18.4, 19.42], [21.45, 22.85], [25.05, 26.2], [31.65, 32.87]],
  moods: [[5.95, 6.5, 'shock'], [6.5, 8.9, 'worried'], [8.9, 14.0, 'panic'], [14.6, 16.0, 'panic'], [27.2, 27.8, 'happy'], [28.2, 31.0, 'happy'], [37.5, 43.0, 'happy'], [44.4, 45.6, 'shock'], [46.8, 47.4, 'shock'], [49.4, 51.0, 'worried'], [51.0, 52.5, 'shock']],
  look: [[0, 6, -6], [5.9, 6, -6], [6.0, 0, -8], [14.0, 0, -8], [14.3, 7, 5], [16.2, 7, 5], [16.5, 6, 0], [28.0, 6, 0], [28.3, 7, 0], [31.0, -7, -2], [38.0, -7, -2], [38.3, 6, -2], [49.3, 6, 0], [49.5, 7, 3], [51.0, -7, 0]],
  armL: [[0, 12], [8.9, 12, 'ease-out'], [9.1, 150], ...wave(9.3, 13.9, 150, 12, 0.42), [14.0, 20], [28.2, 20], [28.4, 140], [28.9, 120], [29.3, 140, 'cubic-bezier(.3,1.4,.5,1)'], [29.6, 175], [30.0, 20], ...throwTrack(louThrows, 20, 150).slice(1), [38.4, 20], [44.4, 20, 'ease-out'], [44.6, 50], [45.4, 20]],
  armR: louArmR,
  heldR: readEnvs.map(([a, b, e]) => vis(a, b, `<g transform="translate(140 -70)">${e}</g>`)).join(''),
  head: [[0, -4], [5.95, -4], [6.1, 0], [14.0, 0], [14.3, 8], [16.0, 8], [16.4, 4], [27.4, 4], [27.6, 0]],
  pony: [[0, 0], [9.0, 0], ...wave(9.0, 14, 10, 12, 0.42), [14.2, 0], [31.0, 0], [31.4, -40], ...wave(31.6, 39.2, -45, 10, 0.5), [39.6, 0], [43.0, 0], [44.2, 22], [44.4, 22, 'ease-out'], [44.7, -80], [45.6, -60], [46.0, 0], [46.6, 12], [46.8, 12, 'ease-out'], [47.1, -50], [47.6, 0]],
  body: [[0, 'none'], [R1 - 0.05, 'none', 'ease-out'], [R1 + 0.08, 'scale(1.16,.82)'], [R1 + 0.35, 'scale(.96,1.05)'], [R1 + 0.55, 'none'], [43.0, 'none'], [44.2, 'rotate(5deg)'], [44.4, 'rotate(5deg)', 'ease-out'], [44.7, 'rotate(-9deg)'], [45.6, 'rotate(0deg)'], [46.6, 'rotate(3deg)'], [46.8, 'rotate(3deg)', 'ease-out'], [47.1, 'rotate(-6deg)'], [47.6, 'rotate(0deg)']],
  hops: [[LOU_UP0 + 0.05, R1 - 0.05, 38]],
  sweat: [[6.5, 14.0]],
}));

// ───────── Pip ─────────
const PIP_X = 905, PIP_Y = 314;
const blanket = `<g transform="translate(-2 -40)"><path d="M-64 -10 Q-62 -60 -10 -62 Q40 -62 46 -30 L52 26 L-60 26Z" fill="#fff6d6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-60 -6 L-4 26 L52 -2" fill="none" stroke="${INK}" stroke-width="3.5"/><rect x="18" y="-46" width="20" height="24" fill="#ff8fb1" stroke="${INK}" stroke-width="3"/></g>`;
const zzz = (x, y, t0, t1) => vis(t0, t1, [0, 1, 2].map((i) => `<g style="${an({ n: 'zzz', d: 1.5, t: i * 0.5, c: 99 })}"><text x="${x + i * 26}" y="${y - i * 30}" class="sfx" style="font-size:${46 - i * 8}px;fill:#fff;stroke-width:7">z</text></g>`).join(''));
const pipEl =
  vis(0, 10.5, put(PIP_X, PIP_Y, 1.05, `<g style="transform-origin:0px 0px;${kf([[0, 'none'], [5.95, 'none', 'ease-out'], [6.05, 'translateY(-26px) scale(.9,1.12)'], [6.3, 'none'], [10.0, 'none'], [10.2, 'translateY(-20px)'], [10.45, 'none']])}"><g style="transform-origin:0px 0px;animation:pipbob .9s ease-in-out infinite alternate">${pipBody()}</g>${pipFeet}</g>`)) +
  vis(10.5, 29.75, put(PIP_X, PIP_Y, 1.05, `<g style="transform-origin:0px 0px;animation:breathe 1.6s ease-in-out infinite alternate">${pipBody('', 'sleep')}${blanket}</g>${pipFeet}`) + zzz(PIP_X + 40, PIP_Y - 140, 11.4, 29.4)) +
  // la lettre qui devient couverture : elle tombe sur Pip
  vis(9.8, 10.55, tf(`<g transform="rotate(20)">${envl(110, 74)}</g>`, { t0: 9.8, d: 0.75, from: `translate(${PIP_X - 160}px,-80px) rotate(-60deg)`, to: `translate(${PIP_X}px,${PIP_Y - 60}px) rotate(0deg)`, e: 'ease-in' })) +
  // réveil par le vent et envol par la fenêtre
  vis(29.75, 31.2, T([[29.75, `translate(${PIP_X}px,${PIP_Y - 30}px) scale(-1.05,1.05)`, 'ease-in'], [30.4, `translate(560px,420px) scale(-1.05,1.05)`], [31.2, `translate(-200px,560px) scale(-.9,.9)`]], pipFly())) +
  vis(29.75, 30.6, tf(blanket, { t0: 29.75, d: 0.85, from: `translate(${PIP_X}px,${PIP_Y}px) rotate(0deg)`, to: `translate(260px,600px) rotate(-200deg)`, e: 'ease-in' })) +
  // retour avec une lettre (48 → 49.2) puis posé sur le bureau
  vis(47.9, 49.15, T([[47.9, 'translate(-160px,520px) scale(1,1)', 'ease-out'], [48.5, 'translate(330px,700px) scale(1,1)', 'ease-in-out'], [49.15, 'translate(700px,1150px) scale(1,1)']], pipFly(`<g transform="translate(92 -84) rotate(10) scale(.55)">${envl(110, 74, '#ffd6e4')}</g>`))) +
  vis(49.15, 99, put(712, 1238, 0.95, `<g style="transform-origin:0px 0px;${kf([[49.15, 'scale(1.18,.82)', 'ease-out'], [49.4, 'none'], [50.85, 'none'], [51.0, 'translateY(-22px) scale(.9,1.12)'], [51.25, 'none']])}"><g style="transform-origin:0px 0px;animation:pipbob .7s ease-in-out infinite alternate">${pipBody()}</g>${pipFeet}</g>`)) +
  vis(49.15, 99, `<g transform="translate(640 1222) rotate(-8)">${envl(110, 74, '#ffd6e4', `<circle cx="34" cy="14" r="10" fill="#e8434e" stroke="${INK}" stroke-width="3"/>`)}</g>`);

// ───────── courrier qui tombe (6 → 14) ─────────
let rain = '';
rain = vis(5.3, 6.0, tf(`<g transform="rotate(-10)">${envl(120, 80, '#fff1a8')}</g>`, { t0: 5.3, d: 0.7, from: `translate(${BOU_X + 30}px,-100px) rotate(-30deg)`, to: `translate(${BOU_X + 20}px,${BOU_Y - 440 * BOU_S}px) rotate(10deg)`, e: 'ease-in' })) +
  vis(6.0, 6.8, tf(`<g transform="rotate(-10)">${envl(120, 80, '#fff1a8')}</g>`, { t0: 6.0, d: 0.8, from: `translate(${BOU_X + 20}px,${BOU_Y - 440 * BOU_S}px) rotate(10deg)`, to: `translate(${BOU_X + 260}px,${BOU_Y - 300}px) rotate(160deg)`, e: 'cubic-bezier(.2,.6,.6,1)' }));
for (let i = 0; i < 70; i++) {
  const t0 = 6.25 + (i / 70) * 7.2 + R(-0.15, 0.15), d = R(1.0, 1.6), x = R(30, 1050);
  if (x > 820 && x < 990 && t0 < 9.5) continue; // pas de lettre sur Pip avant la couverture
  rain += vis(t0, t0 + d, tf(`<g transform="scale(${R(0.85, 1.15).toFixed(2)})">${envl(110, 74, ECOL[i % ECOL.length])}</g>`, { t0, d, from: `translate(${x.toFixed(0)}px,-90px) rotate(${R(-90, 90).toFixed(0)}deg)`, to: `translate(${(x + R(-120, 120)).toFixed(0)}px,2050px) rotate(${R(-400, 400).toFixed(0)}deg)`, e: 'cubic-bezier(.4,0,.9,.6)' }));
}

// ───────── tri : enveloppes aspirées par la fenêtre (31 → 39.5) ─────────
const WINC = [220, 610];
const flyOut = (x, y, t0, d = 1.25, c = '#ffd6e4') => (x = Math.round(x), y = Math.round(y), vis(t0, t0 + d, T([[t0, `translate(${x}px,${y}px) rotate(0deg) scale(1)`, 'ease-out'], [t0 + d * 0.35, `translate(${(x + WINC[0]) / 2 + 60}px,${Math.min(y, WINC[1]) - 160}px) rotate(${R(140, 260).toFixed(0)}deg) scale(.95)`, 'ease-in-out'], [t0 + d * 0.75, `translate(${WINC[0] + R(-40, 40)}px,${WINC[1] + R(-80, 80)}px) rotate(${R(380, 520).toFixed(0)}deg) scale(.8)`, 'ease-in'], [t0 + d, `translate(-220px,${R(420, 700).toFixed(0)}px) rotate(700deg) scale(.6)`]], envl(110, 74, c))));
let sortFx = '';
for (let i = 0; i < 46; i++) {
  const t0 = 31.0 + (i / 46) * 6.2 + R(-0.1, 0.1), x = R(330, 1040);
  sortFx += flyOut(x, P(t0) + 20, t0, R(1.1, 1.5), ECOL[i % ECOL.length]);
}
for (let i = 0; i < 16; i++) { const t0 = 37.3 + (i / 16) * 1.9; sortFx += flyOut(R(330, 760), heapTop(t0), t0, R(1.0, 1.3), ECOL[(i + 3) % ECOL.length]); }
// lettres lancées depuis les mains
const handAt = (x0, feet, s, sx, sy, len, a) => { const r = (a * Math.PI) / 180; return [x0 + (sx - len * Math.sin(r)) * s, feet + (sy + len * Math.cos(r)) * s]; };
for (const t of louThrows) { const [x, y] = handAt(LOU_X, LF(t), LOU_S, -54, -170, 70, 150); sortFx += flyOut(x, y, t, 0.9, '#ffd6e4'); }
for (const t of nadThrows) { const [x, y] = handAt(NAD_X, NF(t), NAD_S, -66, -254, 94, 150); sortFx += flyOut(x, y, t, 1.1, '#d6ecff'); }
const swirl = vis(30.9, 39.6, `<g transform="translate(${WINC[0]} ${WINC[1]})"><g style="animation:spin .8s linear infinite">${[0, 1, 2].map((i) => `<path d="M${-60 - i * 40} 0 A${60 + i * 40} ${60 + i * 40} 0 0 1 ${20 + i * 30} ${-58 - i * 38}" stroke="#fff" stroke-width="${10 - i * 2}" fill="none" stroke-linecap="round" opacity=".85" transform="rotate(${i * 120})"/>`).join('')}</g></g>`);

// ───────── respiration : la pièce gonfle (43 → 47.6) ─────────
const roomBreath = [[0, 'none'], [43.0, 'scale(1,1)'], [44.2, 'scale(1.07,1.04)'], [44.4, 'scale(1.07,1.04)', 'ease-out'], [44.85, 'scale(.96,.98)'], [45.3, 'scale(1,1)'], [45.7, 'scale(1,1)'], [46.6, 'scale(1.05,1.03)'], [46.8, 'scale(1.05,1.03)', 'ease-out'], [47.15, 'scale(.97,.99)'], [47.5, 'scale(1,1)']];
const mouthY = BOU_Y - 292 * BOU_S;
const gust = (t0, s) => vis(t0, t0 + 0.9, `<g transform="translate(${BOU_X} ${mouthY}) scale(${s})">${[-1, 1].map((k) => [0, 1, 2].map((i) => `<g transform="scale(${k} 1)"><g style="${an({ n: 'gustk', d: 0.8, t: t0 + i * 0.07, f: 'both', e: 'ease-out' })}"><path d="M40 ${-30 + i * 30} q60 -20 120 0 t120 0" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".9"/></g></g>`).join('')).join('')}</g>`);
const suck = (t0, t1) => vis(t0, t1, `<g transform="translate(${BOU_X} ${mouthY})">${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="rotate(${-150 + i * 60})"><g style="${an({ n: 'suckk', d: 0.6, t: t0 + i * 0.1, c: 3 })}"><path d="M230 0 h70" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".85"/></g></g>`).join('')}</g>`);

// ───────── dernier plan : la boîte aux lettres de la mairie (52 → 55) ─────────
const T5 = 51.5;
const flag = `<g transform="translate(540 300)"><rect x="-4" y="0" width="8" height="140" fill="#8a8f99" stroke="${INK}" stroke-width="3"/><g style="transform-origin:4px 20px;animation:flagk .5s ease-in-out infinite alternate"><rect x="4" y="6" width="44" height="66" fill="#2a5cc9" stroke="${INK}" stroke-width="3"/><rect x="48" y="6" width="44" height="66" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="92" y="6" width="44" height="66" fill="#e8434e" stroke="${INK}" stroke-width="3"/></g></g>`;
const facade = `
  <defs><linearGradient id="skyE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58b8ff"/><stop offset="1" stop-color="#e0f4ff"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#skyE)"/>
  ${cloudS(200, 260, 1.3)}${cloudS(880, 200, 1)}
  ${flag}
  <polygon points="80,560 540,420 1000,560" fill="#e3cfa2" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <g transform="translate(540 500)"><circle r="38" fill="#fff" stroke="${INK}" stroke-width="5"/><line x1="0" y1="0" x2="0" y2="-26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="18" y2="6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>
  <rect x="100" y="560" width="880" height="900" fill="#efe0bd" stroke="${INK}" stroke-width="6"/>
  ${Array.from({ length: 8 }, (_, i) => `<line x1="100" y1="${640 + i * 100}" x2="980" y2="${640 + i * 100}" stroke="#dcc79c" stroke-width="4"/>`).join('')}
  <rect x="300" y="590" width="480" height="76" rx="8" fill="#2b3f73" stroke="${INK}" stroke-width="5"/><text x="540" y="645" class="bt" style="font-size:46px;fill:#fff;letter-spacing:6px">MAIRIE</text>
  ${[180, 430, 680].map((x) => `<rect x="${x}" y="720" width="220" height="250" rx="10" fill="#9fd4ff" stroke="${INK}" stroke-width="6"/><path d="M${x + 110} 720 V970 M${x} 840 H${x + 220}" stroke="#fff" stroke-width="7"/>`).join('')}
  ${[180, 680].map((x) => `<rect x="${x}" y="1040" width="220" height="250" rx="10" fill="#9fd4ff" stroke="${INK}" stroke-width="6"/><path d="M${x + 110} 1040 V1290 M${x} 1160 H${x + 220}" stroke="#fff" stroke-width="7"/>`).join('')}
  <rect x="440" y="1080" width="200" height="380" rx="12" fill="#7a4a2a" stroke="${INK}" stroke-width="6"/>
  <rect y="1460" width="${W}" height="460" fill="#b9bec7"/><rect y="1452" width="${W}" height="24" fill="#d6dae0" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="${i * 200 + 60}" y1="1476" x2="${i * 260 - 100}" y2="1920" stroke="#a5abb5" stroke-width="4"/>`).join('')}`;
const box = `<g transform="translate(540 1560)">
  <rect x="-16" y="-10" width="32" height="200" fill="#3a3f4a" stroke="${INK}" stroke-width="5"/>
  <g style="transform-origin:0px 0px;${kf([[T5, 'none'], [T5 + 0.1, 'none', 'ease-in'], [T5 + 0.62, 'scale(1.16,1.1)'], [T5 + 0.72, 'scale(.9,1.12)'], [T5 + 0.95, 'scale(1.04,.97)'], [T5 + 1.2, 'none']])}"><g style="--s:5px;${an({ n: 'shake', d: 0.05, t: T5 + 0.1, c: 12, dir: 'alternate' })}">
    <rect x="-150" y="-380" width="300" height="370" rx="40" fill="#2a5cc9" stroke="${INK}" stroke-width="7"/>
    <rect x="-110" y="-150" width="220" height="56" rx="10" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><text y="-108" class="bt" style="font-size:38px;fill:${INK}">COURRIER</text>
    <path d="M-60 -60 h120" stroke="#1d4396" stroke-width="10" stroke-linecap="round"/>
    <g style="transform-origin:-150px -380px;${kf(rot([[T5, 0], [T5 + 0.68, 0, 'cubic-bezier(.2,1.4,.5,1)'], [T5 + 0.9, -118], [55, -112]]))}"><rect x="-150" y="-380" width="300" height="150" rx="40" fill="#3b6fe0" stroke="${INK}" stroke-width="7"/><rect x="-90" y="-320" width="180" height="20" rx="10" fill="#1d4396"/></g>
  </g></g></g>`;
let geyser = '';
for (let i = 0; i < 64; i++) {
  const t0 = T5 + 0.7 + (i / 64) * 2.2, vx = R(-650, 650), vy = R(-1900, -1200), g = 2300, dd = 2.2, pts = [];
  for (let k = 0; k <= 6; k++) { const u = (k / 6) * dd; pts.push([t0 + u, `translate(${(540 + vx * u).toFixed(0)}px,${(1290 + vy * u + (g * u * u) / 2).toFixed(0)}px) rotate(${(R(-1, 1) * 200 * u).toFixed(0)}deg)`, 'linear']); }
  geyser += vis(t0, Math.min(t0 + dd, 55.2), T(pts, envl(120, 80, ECOL[i % ECOL.length])));
}
const streetPile = T([[0, 'translate(0px,520px)'], [T5 + 1.2, 'translate(0px,520px)', 'ease-out'], [55, 'translate(0px,0px)']], `<g transform="translate(0 1560)">${mainPile}</g>`);
const card = `<g style="${an({ n: 'cardk', d: 0.6, t: T5, f: 'both', e: 'cubic-bezier(.2,1.6,.4,1)' })}"><g transform="translate(540 470)">
  <rect x="-444" y="-114" width="900" height="236" rx="34" fill="#000" opacity=".22" transform="rotate(-2)"/>
  <rect x="-450" y="-122" width="900" height="236" rx="34" fill="#fff" stroke="${INK}" stroke-width="8" transform="rotate(-2)"/>
  <g transform="rotate(-2)"><text y="-8" data-role="final" class="sfx" style="font-size:76px;fill:#e8434e;stroke:#fff;stroke-width:0">Au pied de la lettre</text>
  <text y="68" data-role="final" class="bt" style="font-size:46px;fill:#2b5ba8">Épisode 1 · La boîte mail</text></g></g></g>`;
const scene5 = vis(T5, 99, facade + box + geyser + streetPile +
  sfx('BOUM !', 540, 1010, T5 + 0.7, 1.6, -6, '#ffd23f', 170, 'boom') + card);

// ───────── assemblage du bureau ─────────
const hookTag = vis(0, 3.4, `<g transform="translate(540 270)"><rect x="-330" y="-46" width="660" height="70" rx="35" fill="#2b3f73" stroke="${INK}" stroke-width="5"/><text y="2" data-role="hook" class="bt" style="font-size:36px;fill:#fff;letter-spacing:3px">AU PIED DE LA LETTRE</text></g>`);
const room =
  T(roomBreath, wallBg, '540px 1100px') +
  boulonEl +
  vis(0, 39.42, T(HEAP.map(([t, y, e]) => [t, `translate(0px,${y}px)`, e]), deskHeap)) +
  desk + vis(0, 28.0, nadiaA) + rain + vis(28.0, 99, nadiaB) +
  T([[0, `translate(0px,${P_LOW}px)`], [R0, `translate(0px,${P_LOW}px)`, 'linear'], [R1, `translate(0px,${P_TOP}px)`], [DN0, `translate(0px,${P_TOP}px)`, 'linear'], [DN1, `translate(0px,${P_LOW}px)`]], mainPile + nadHand) +
  louEl + pipEl + swirl + sortFx + suck(43.0, 44.2) + suck(45.7, 46.6) + gust(44.4, 1) + gust(46.8, 0.8) +
  // onomatopées
  sfx('TOC !', 760, 900, 6.0, 0.9, 10, '#ffd23f', 84, 'toc') +
  sfx('FLOUMP !', 600, 1080, 13.95, 1.2, -6, '#fff6d6', 96, 'floump') +
  sfx('POP !', 700, 900, 28.0, 0.9, -8, '#ff8fb1', 90, 'pop') +
  sfx('CLAC !', 230, 330, WIN_OPEN, 0.9, -6, '#6ee7ff', 80, 'window') +
  sfx('FRRRRT !', 640, 1090, 31.0, 1.4, 6, '#fff', 84, 'swirl') +
  sfx('INSPIIIRE…', 540, 820, 43.05, 1.2, -4, '#9fe8ff', 72, 'inhale') +
  sfx('FOUUUH !', 540, 820, 44.4, 1.1, 5, '#fff', 96, 'exhale') +
  sfx('PLOP', 840, 1180, 49.15, 0.8, -8, '#ffd23f', 60, 'plop') +
  sfx('BRRRM…', 330, 1040, 50.85, 0.7, -8, '#ff9a3d', 72, 'rumble') +
  // bulles (une à la fois)
  bub('boul', 'Je croule sous les mails !', BOU_X, 925, 2.85, 2.35, { shout: true }) +
  bub('nad', 'Ça tombe du plafond !', NAD_X - 20, 1066, 7.45, 1.6, { shout: true, tail: 130 }) +
  bub('nad', 'Mmmf !', NAD_X, P_TOP - 110, 13.45, 1.0) +
  bub('lou', 'Tata Nadia ?!', LOU_X + 40, 470, 14.6, 1.35, { shout: true }) +
  bub('lou', 'Ça, c\'est de la pub !', LOU_X + 40, 470, 18.35, 1.8) +
  bub('lou', 'Ça, un rappel automatique…', LOU_X + 40, 470, 21.4, 2.1) +
  bub('lou', 'Presque rien d\'important !', LOU_X + 40, 470, 25.0, 2.0) +
  bub('nad', 'Alors on trie !', NAD_X - 20, 548, 28.5, 1.45, { shout: true }) +
  bub('lou', 'La pub ? Dehors !', LOU_X + 40, LF(31.6) - 470, 31.6, 1.5, { shout: true, follow: [[31.6, 0, 'linear'], [33.1, 180]] }) +
  bub('nad', 'Les rappels ? Dehors !', NAD_X - 20, NF(34.4) - 600, 34.4, 1.8, { shout: true, follow: [[34.4, 0, 'linear'], [35.3, 108], [36.2, 108]] }) +
  bub('boul', 'Enfin, je respire !', BOU_X, 925, 41.0, 1.95) +
  bub('boul', 'Pas encore du courrier…', BOU_X, 925, 49.95, 1.5);

const camera = [[0, 'translate(-702px,-190px) scale(1.75)'], [1.9, 'translate(-702px,-190px) scale(1.75)', 'cubic-bezier(.5,0,.3,1)'], [2.7, 'translate(0px,0px) scale(1)'], [14.0, 'translate(0px,0px) scale(1)'], [16.4, 'translate(-60px,-90px) scale(1.1)'], [27.6, 'translate(-60px,-90px) scale(1.1)'], [28.4, 'translate(0px,0px) scale(1)'], [49.0, 'translate(0px,0px) scale(1)'], [50.0, 'translate(-80px,-140px) scale(1.12)'], [55, 'translate(-80px,-140px) scale(1.12)']];
let roomCam = T(camera, room);
roomCam = shake(roomCam, 6.0, 0.25, 6);
roomCam = shake(roomCam, 13.95, 0.35, 10);
roomCam = shake(roomCam, 50.85, 0.65, 7);

const style = `
text{font-family:"Chalkboard SE","Comic Sans MS","Arial Rounded MT Bold",sans-serif;text-anchor:middle;font-weight:700}
.bt{fill:${INK};font-weight:700}
.sfx{stroke:${INK};stroke-width:10;paint-order:stroke;stroke-linejoin:round;font-weight:900}
.v{opacity:0}
@keyframes vis{0%,99.9%{opacity:1}100%{opacity:0}}
@keyframes tfk{from{transform:var(--f)}to{transform:var(--t)}}
@keyframes pop{0%{opacity:0;transform:scale(.2)}9%{opacity:1;transform:scale(1.12)}16%{transform:scale(1)}95%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.95)}}
@keyframes sfxk{0%{opacity:0;transform:scale(.2) rotate(-12deg)}10%{opacity:1;transform:scale(1.3) rotate(4deg)}20%{transform:scale(1) rotate(0)}85%{opacity:1}100%{opacity:0;transform:scale(1.05)}}
@keyframes hop{0%,100%{transform:translateY(0) scale(1.12,.88)}18%{transform:translateY(0) scale(.94,1.1)}50%{transform:translateY(calc(var(--h) * -1)) scale(.97,1.05)}82%{transform:translateY(0) scale(.94,1.1)}}
@keyframes blink{0%,96.8%,100%{transform:scaleY(1)}98.4%{transform:scaleY(.08)}}
@keyframes breathe{from{transform:scale(1,1)}to{transform:scale(1.015,.982)}}
@keyframes idlehead{from{transform:rotate(-2deg)}to{transform:rotate(2deg)}}
@keyframes ponyk{from{transform:rotate(-4deg)}to{transform:rotate(5deg)}}
@keyframes talk{from{transform:scaleY(.35)}to{transform:scaleY(1.05)}}
@keyframes shake{from{transform:translate(calc(var(--s) * -1),0)}to{transform:translate(var(--s),calc(var(--s) * .5))}}
@keyframes sweatk{from{transform:translate(0,0)}to{transform:translate(3px,7px)}}
@keyframes sway{from{transform:skewX(-2deg)}to{transform:skewX(2.5deg)}}
@keyframes cdrift{from{transform:translateX(-30px)}to{transform:translateX(40px)}}
@keyframes lampk{from{transform:rotate(-2deg)}to{transform:rotate(2deg)}}
@keyframes steam{from{transform:translateY(0);opacity:.4}to{transform:translateY(-8px);opacity:.9}}
@keyframes flash{from{opacity:1}to{opacity:.55}}
@keyframes pipbob{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-4px) rotate(3deg)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(-.6)}}
@keyframes zzz{0%{opacity:0;transform:translate(0,0)}30%{opacity:1}100%{opacity:0;transform:translate(20px,-50px)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@keyframes gustk{0%{opacity:0;transform:translateX(0)}20%{opacity:1}100%{opacity:0;transform:translateX(260px)}}
@keyframes suckk{0%{opacity:0;transform:translateX(0)}30%{opacity:1}100%{opacity:0;transform:translateX(-170px)}}
@keyframes flagk{from{transform:skewY(-4deg) scaleX(.94)}to{transform:skewY(4deg) scaleX(1)}}
@keyframes cardk{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}
${KF.join('\n')}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${D}" data-fps="30" data-music="audio.wav">
<defs>
  <clipPath id="bClip"><ellipse cx="0" cy="-185" rx="102" ry="100"/></clipPath>
  <clipPath id="pileClip"><path d="${contour}"/></clipPath>
  <clipPath id="heapClip"><path d="${heapPath}"/></clipPath>
</defs>
<style>${style}</style>
<rect width="${W}" height="${H}" fill="#f6e7c8"/>
${vis(0, T5, roomCam + hookTag)}
${scene5}
${tf(`<polygon points="0,0 1300,0 1400,1920 100,1920" fill="#fff6d6"/>`, { t0: T5 - 0.2, d: 0.42, from: 'translate(-1500px,0px)', to: 'translate(1200px,0px)', e: 'linear' })}
</svg>`;
writeFileSync(new URL('./au-pied-de-la-lettre-ep1.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques ·', KF.length, 'pistes');
