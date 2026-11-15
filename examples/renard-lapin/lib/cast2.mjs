// Saison 2 : nouveaux personnages (Piquette la hérissonne, Papi Bernard le blaireau, Plouf la grenouille).
// Pieds au sol en (0,0), regardent à droite (sauf Plouf, de face). Mêmes conventions d'options que fox()/owl() :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes throatk{from{transform:scale(.78,.8)}to{transform:scale(1.14,1.18)}}
@keyframes croakk{0%{transform:scale(.5)}35%{transform:scale(1.25,1.2)}60%{transform:scale(1.1)}100%{transform:scale(.5)}}`);

let uid = 0;
// affiche `inner` en dehors des fenêtres wins
const except = (wins, inner) => {
  const s = [...wins].sort((a, b) => a[0] - b[0]);
  let out = '', t = 0;
  for (const [a, b] of s) { if (a > t) out += vis(t, a, inner); t = Math.max(t, b); }
  return out + vis(t, 999, inner);
};
const blushWin = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
// bras simple : épaule (sx,sy), repos en degrés (négatif = vers l'avant/droite)
const armG = (sx, sy, fill, hand, { rest = -25, len = 46, w = 18, gest = [], point = [], wave = [], item = '' } = {}) => {
  const L = [...gest.map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...point.map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...wave.map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a }))];
  return `<g style="--r:${rest}deg;transform-origin:${sx}px ${sy}px;transform:rotate(${rest}deg);${anims(L)}"><rect x="${sx - w / 2}" y="${sy - 4}" width="${w}" height="${len + 4}" rx="${w / 2}" fill="${fill}" stroke="${INK}" stroke-width="4"/><circle cx="${sx}" cy="${sy + len}" r="${w / 2 + 2}" fill="${hand}" stroke="${INK}" stroke-width="4"/>${item ? `<g transform="translate(${sx} ${sy + len})">${item}</g>` : ''}</g>`;
};
// enveloppe commune : jolt, tremblement
const wrapFx = (inner, o) => {
  if (o.jolt !== undefined && o.jolt !== 0) inner = `<g style="animation:${[].concat(o.jolt).map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',')}">${inner}</g>`;
  if (o.shiver) inner = `<g style="--s:3px;${an({ n: 'shake', d: 0.045, t: o.shiver[0], c: Math.round((o.shiver[1] - o.shiver[0]) / 0.045), dir: 'alternate' })}">${inner}</g>`;
  return inner;
};
const idle = (inner, ox, oy, d = 1.7) => `<g style="transform-origin:${ox}px ${oy}px;animation:idlehead ${d}s ease-in-out infinite alternate">${inner}</g>`;

// couronne de piquants : angles en degrés écran (0 = droite, -90 = haut), valleys rv, pointes rt
const spikePath = (cx, cy, a0, a1, n, rv, rt, ri = 30) => {
  const P = (deg, r) => { const a = (deg * Math.PI) / 180; return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`; };
  const full = Math.abs(a1 - a0) >= 360, st = (a1 - a0) / n;
  let d = full ? `M${P(a0, rv)}` : `M${P(a0, ri)} L${P(a0, rv)}`;
  for (let i = 0; i < n; i++) d += ` L${P(a0 + st * (i + 0.5), rt)} L${P(a0 + st * (i + 1), rv)}`;
  return d + (full ? 'Z' : ` L${P(a1, ri)}Z`);
};

// ───────────────────────── Piquette la hérissonne ─────────────────────────
export function hedgehog(talk = [], o = {}) {
  const skin = '#f6d9b8', sp = '#8a5230', spD = '#a86a40', snout = '#ffb3b8', pink = '#ff9fbf', pinkD = '#ff7fa8', yel = '#ffd23f';
  const ball = o.ball || [], up = o.spikes || [];
  const CX = -6, CY = -102;
  const bow = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 L-24 -14 L-24 14Z M0 0 L24 -14 L24 14Z" fill="${yel}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle r="7" fill="#ffb300" stroke="${INK}" stroke-width="3.5"/></g>`;
  const sh = shadowEl(70, [], []);
  // boule : cercle de piquants qui tourne
  const ballEl = ball.map(([a, b]) => {
    const c = Math.max(1, Math.round((b - a) / 0.55));
    return vis(a, b, `<g style="transform-origin:0px -72px;${an({ n: 'spin', d: (b - a) / c, t: a, c })}">
      <path d="${spikePath(0, -72, 0, 360, 22, 52, 74)}" fill="${sp}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="0" cy="-72" r="54" fill="${sp}"/>
      <path d="${spikePath(0, -72, 0, 360, 22, 36, 50)}" fill="${spD}" opacity=".85"/>
      ${bow(-6, -138, -14)}<ellipse cx="-24" cy="-96" rx="20" ry="10" fill="#fff" opacity=".25" transform="rotate(-30 -24 -96)"/></g>`);
  }).join('');
  const spikesUp = up.map(([a, b]) => vis(a, b, `<g style="--s:3px;${an({ n: 'shake', d: 0.05, t: a, c: Math.max(1, Math.round((b - a) / 0.05)), dir: 'alternate' })}"><path d="${spikePath(CX, CY, 108, 352, 17, 66, 124)}" fill="${sp}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`)).join('');
  const eyesL = [[56, -130, 14, 2], [86, -128, 11, 2]];
  const normal = `
    ${spikesUp}
    <path d="${spikePath(CX, CY, 118, 345, 15, 66, 98)}" fill="${sp}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${spikePath(CX, CY, 124, 340, 13, 64, 82, 40)}" fill="${spD}" opacity=".55"/>
    ${bow(-40, -186, -22)}
    <rect x="-34" y="-50" width="20" height="46" rx="10" fill="${skin}" stroke="${INK}" stroke-width="4"/><ellipse cx="-20" cy="-6" rx="19" ry="9" fill="#7a4a2a" stroke="${INK}" stroke-width="4"/>
    <rect x="12" y="-50" width="20" height="46" rx="10" fill="${skin}" stroke="${INK}" stroke-width="4"/><ellipse cx="30" cy="-6" rx="19" ry="9" fill="#7a4a2a" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -50px;animation:breathe 1.2s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-96" rx="62" ry="58" fill="${skin}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="10" cy="-84" rx="40" ry="36" fill="#fff4e2"/>
      <rect x="-86" y="-138" width="46" height="58" rx="14" fill="${pink}" stroke="${INK}" stroke-width="4" transform="rotate(-8 -63 -109)"/>
      <rect x="-80" y="-108" width="34" height="16" rx="5" fill="${pinkD}" transform="rotate(-8 -63 -109)"/>
      <path d="M-44 -136 Q-6 -118 16 -90" stroke="${pinkD}" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${armG(26, -84, skin, skin, { rest: -22, len: 40, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(`
        <circle cx="34" cy="-156" r="12" fill="${skin}" stroke="${INK}" stroke-width="4"/><circle cx="34" cy="-156" r="6" fill="${snout}"/>
        <path d="${spikePath(52, -122, -158, -72, 5, 36, 58, 20)}" fill="${sp}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="54" cy="-122" r="42" fill="${skin}" stroke="${INK}" stroke-width="4"/>
        <path d="${spikePath(54, -122, -150, -86, 4, 38, 46, 28)}" fill="${sp}"/>
        <ellipse cx="92" cy="-106" rx="28" ry="20" fill="${snout}" stroke="${INK}" stroke-width="4"/>
        <ellipse cx="116" cy="-113" rx="8" ry="6.5" fill="${INK}"/><ellipse cx="114" cy="-115" rx="2.6" ry="1.8" fill="#fff" opacity=".8"/>
        ${eyeStates(eyesL, o.eyes || [])}
        <path d="${o.moods && o.moods.some((m) => m[2] === 'panic') ? 'M42 -150 Q54 -156 68 -160' : 'M44 -150 Q56 -156 68 -152'}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        ${mouthStates(92, -100, talk, o.moods || [], o.mood || 'calm')}
        <ellipse cx="64" cy="-108" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[64, -108, 15]], o.blush || [])}
        ${(o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('')}`, 50, -90, 1.9)}
    </g>`;
  const inner = `${o.noShadow ? '' : sh}${except(ball, normal)}${ballEl}`;
  return wrapFx(inner, o);
}

// ───────────────────────── Papi Bernard le blaireau ─────────────────────────
export function badger(talk = [], o = {}) {
  const fur = '#a6a3b5', blue = '#3b82f6', blueD = '#2563eb', cream = '#fff0d6', straw = '#f2cf6e', dark = '#2c2226';
  const n = uid++;
  const sh = shadowEl(86, [], []);
  const head = `
    <circle cx="-46" cy="-34" r="15" fill="${dark}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="10" cy="0" rx="58" ry="46" fill="#f6f3ec" stroke="${INK}" stroke-width="4"/>
    <clipPath id="bdg${n}"><ellipse cx="10" cy="0" rx="58" ry="46"/></clipPath>
    <g clip-path="url(#bdg${n})"><path d="M-60 -29 L90 -29 L90 -1 L-60 -1Z" fill="${dark}"/><path d="M-60 30 Q10 52 90 30 V60 H-60Z" fill="${fur}" opacity=".35"/></g>
    <ellipse cx="10" cy="0" rx="58" ry="46" fill="none" stroke="${INK}" stroke-width="4"/>
    ${eyeStates([[16, -15, 12, 2], [42, -15, 10, 2]], o.eyes || [])}
    <ellipse cx="64" cy="8" rx="9.5" ry="7.5" fill="${dark}" stroke="${INK}" stroke-width="3"/><ellipse cx="62" cy="5" rx="3" ry="2" fill="#fff" opacity=".8"/>
    ${mouthStates(42, 22, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="26" cy="14" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[26, 14, 15]], o.blush || [])}
    <path d="M52 29 L100 12" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M52 29 L100 12" stroke="#f2d36b" stroke-width="4.5" stroke-linecap="round"/>
    <ellipse cx="6" cy="-40" rx="70" ry="13" fill="${straw}" stroke="${INK}" stroke-width="4"/>
    <path d="M-34 -42 Q-34 -88 6 -90 Q46 -88 46 -42Z" fill="${straw}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-34 -50 Q6 -38 46 -50 L46 -42 Q6 -30 -34 -42Z" fill="#e8434e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M-16 -66 l10 -8 M10 -74 l10 4 M24 -62 l8 -6 M-50 -42 l8 4 M52 -40 l8 3" stroke="#d8b04a" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="-12" cy="-72" rx="14" ry="6" fill="#fff" opacity=".35" transform="rotate(-18 -12 -72)"/>
    ${(o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('')}`;
  const inner = `${o.noShadow ? '' : sh}
    ${armG(-34, -148, '#e6dcc4', fur, { rest: 10, len: 50, w: 20 })}
    <rect x="-36" y="-66" width="30" height="58" rx="13" fill="${blue}" stroke="${INK}" stroke-width="4"/><ellipse cx="-12" cy="-8" rx="26" ry="12" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>
    <rect x="8" y="-66" width="30" height="58" rx="13" fill="${blue}" stroke="${INK}" stroke-width="4"/><ellipse cx="32" cy="-8" rx="26" ry="12" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -70px;animation:breathe 1.4s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-118" rx="68" ry="74" fill="${blue}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="6" cy="-170" rx="44" ry="22" fill="${cream}" stroke="${INK}" stroke-width="4"/>
      <path d="M-26 -176 L-18 -112 M34 -176 L28 -112" stroke="${blueD}" stroke-width="12" stroke-linecap="round"/>
      <rect x="-20" y="-112" width="50" height="34" rx="8" fill="${blueD}" stroke="${INK}" stroke-width="3.5"/><path d="M-12 -104 h34" stroke="#fff" stroke-width="3" opacity=".4" stroke-linecap="round"/>
      <circle cx="-20" cy="-124" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle cx="32" cy="-124" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="-28" cy="-136" rx="14" ry="30" fill="#fff" opacity=".18" transform="rotate(12 -28 -136)"/>
      ${armG(46, -148, cream, fur, { rest: -28, len: 52, w: 20, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(`<g transform="translate(48 -206) scale(1.18)">${head}</g>`, 46, -170, 2.2)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Plouf la grenouille ─────────────────────────
export function frog(talk = [], o = {}) {
  const g = '#5fcf5f', gD = '#3fae55', belly = '#e9f9b4', sac = '#f7e08a';
  const jumps = o.jumps || [], croak = o.croak || [];
  const sh = shadowEl(86, [], jumps);
  const leg = (k) => `<ellipse cx="${k * 62}" cy="-38" rx="38" ry="30" fill="${g}" stroke="${INK}" stroke-width="4" transform="rotate(${k * -12} ${k * 62} -38)"/>
    <ellipse cx="${k * 98}" cy="-8" rx="36" ry="11" fill="${g}" stroke="${INK}" stroke-width="4"/>
    ${[-1, 0, 1].map((j) => `<circle cx="${k * (130 - Math.abs(j) * 3)}" cy="${-8 + j * 8}" r="7" fill="${g}" stroke="${INK}" stroke-width="3.5"/>`).join('')}
    <ellipse cx="${k * 98}" cy="-9" rx="30" ry="8" fill="${g}"/>`;
  const eyeL = [[-44, -178, 19, 3], [44, -178, 19, 3]];
  const sacTalk = talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:0px -112px;${an({ n: 'throatk', d: 0.2, t: a, c: Math.max(1, Math.round((b - a) / 0.2)), dir: 'alternate' })}"><ellipse cx="0" cy="-110" rx="26" ry="20" fill="${sac}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-8" cy="-116" rx="8" ry="5" fill="#fff" opacity=".45"/></g>`)).join('');
  const sacCroak = croak.map(([a, b]) => vis(a, b, `<g style="transform-origin:0px -108px;${an({ n: 'croakk', d: 0.5, t: a, c: Math.max(1, Math.round((b - a) / 0.5)) })}"><ellipse cx="0" cy="-100" rx="44" ry="36" fill="${sac}" stroke="${INK}" stroke-width="4"/><ellipse cx="-14" cy="-112" rx="12" ry="7" fill="#fff" opacity=".45"/></g>`)).join('');
  let inner = `
    ${leg(-1)}${leg(1)}
    <g style="transform-origin:0px -40px;animation:breathe 1s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-82" rx="72" ry="64" fill="${g}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="0" cy="-72" rx="48" ry="46" fill="${belly}"/>
      <circle cx="-54" cy="-88" r="9" fill="${gD}"/><circle cx="-44" cy="-60" r="6" fill="${gD}"/><circle cx="54" cy="-98" r="8" fill="${gD}"/><circle cx="50" cy="-66" r="5" fill="${gD}"/>
      ${armG(-60, -96, g, '#bff0a0', { rest: 24, len: 34, w: 17 })}
      ${armG(60, -96, g, '#bff0a0', { rest: -24, len: 34, w: 17, wave: o.wave || [], point: o.point || [], gest: o.gest ?? [], item: o.item || '' })}
      ${idle(`
        <circle cx="-44" cy="-178" r="30" fill="${g}" stroke="${INK}" stroke-width="4"/><circle cx="44" cy="-178" r="30" fill="${g}" stroke="${INK}" stroke-width="4"/>
        <ellipse cx="0" cy="-140" rx="78" ry="46" fill="${g}" stroke="${INK}" stroke-width="4"/>
        <circle cx="-44" cy="-178" r="28" fill="${g}"/><circle cx="44" cy="-178" r="28" fill="${g}"/>
        <ellipse cx="0" cy="-122" rx="52" ry="22" fill="${belly}" opacity=".55"/>
        ${eyeStates(eyeL, o.eyes || [])}
        <circle cx="-9" cy="-158" r="2.8" fill="${INK}"/><circle cx="9" cy="-158" r="2.8" fill="${INK}"/>
        ${sacCroak}${sacTalk}
        <g transform="translate(0 -132) scale(2.3 1.35) translate(0 132)">${mouthStates(0, -132, talk, o.moods || [], o.mood || 'calm')}</g>
        <ellipse cx="-56" cy="-136" rx="14" ry="9" fill="#ff8fa3" opacity=".7"/><ellipse cx="56" cy="-136" rx="14" ry="9" fill="#ff8fa3" opacity=".7"/>${blushWin([[-56, -136, 17], [56, -136, 17]], o.blush || [])}
        ${(o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('')}`, 0, -120, 1.5)}
    </g>`;
  for (const [a, b, h] of jumps) inner = `<g style="--h:${h}px;${an({ n: 'jmp', d: b - a, t: a })}">${inner}</g>`;
  return (o.noShadow ? '' : sh) + wrapFx(inner, o);
}
