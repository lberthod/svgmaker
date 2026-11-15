// Saison 5 « Le grand spectacle » : nouveaux personnages (Bastien le castor, Mlle Zélie la girafe, Taupin la taupe).
// Pieds au sol en (0,0), regardent à droite. Nommés d'après l'id de voix : beaver, giraffe, mole.
// Mêmes conventions d'options que cast2.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]]
//   noShadow = true · beaver : tail = [t…] coups de queue (« je vérifie que ça tient »)
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c5tail{0%{transform:rotate(0)}30%{transform:rotate(-34deg)}48%{transform:rotate(14deg) scale(1.08,.9)}62%{transform:rotate(-5deg)}100%{transform:rotate(0)}}
@keyframes c5tbob{from{transform:rotate(-2deg)}to{transform:rotate(3deg)}}
@keyframes c5neck{from{transform:rotate(-1.6deg)}to{transform:rotate(2.2deg)}}
@keyframes c5tail2{from{transform:rotate(-8deg)}to{transform:rotate(10deg)}}
@keyframes c5sniff{from{transform:translateX(0)}to{transform:translateX(2.5px)}}`);

let uid = 0;
const blushWin = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
const armG = (sx, sy, fill, hand, { rest = -25, len = 46, w = 18, gest = [], point = [], wave = [], item = '', handR } = {}) => {
  const L = [...gest.map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...point.map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...wave.map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a }))];
  const hr = handR ?? w / 2 + 2;
  return `<g style="--r:${rest}deg;transform-origin:${sx}px ${sy}px;transform:rotate(${rest}deg);${anims(L)}"><rect x="${sx - w / 2}" y="${sy - 4}" width="${w}" height="${len + 4}" rx="${w / 2}" fill="${fill}" stroke="${INK}" stroke-width="4"/><circle cx="${sx}" cy="${sy + len}" r="${hr}" fill="${hand}" stroke="${INK}" stroke-width="4"/>${item ? `<g transform="translate(${sx} ${sy + len})">${item}</g>` : ''}</g>`;
};
const wrapFx = (inner, o) => {
  if (o.jolt !== undefined && o.jolt !== 0) inner = `<g style="animation:${[].concat(o.jolt).map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',')}">${inner}</g>`;
  if (o.shiver) inner = `<g style="--s:3px;${an({ n: 'shake', d: 0.045, t: o.shiver[0], c: Math.round((o.shiver[1] - o.shiver[0]) / 0.045), dir: 'alternate' })}">${inner}</g>`;
  return inner;
};
const idle = (inner, ox, oy, d = 1.7) => `<g style="transform-origin:${ox}px ${oy}px;animation:idlehead ${d}s ease-in-out infinite alternate">${inner}</g>`;
const hats = (o) => (o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('');

// ───────────────────────── Bastien le castor (hauteur ≈ 230 avec casque) ─────────────────────────
export function beaver(talk = [], o = {}) {
  const br = '#b8713a', brD = '#8f5226', belly = '#e9c48e', muz = '#dca66a', choc = '#6b3a1e', teeth = '#ffffff', hat = '#ffd23f', hatD = '#f0b400', belt = '#ff8a2b';
  const sh = shadowEl(96, [], []);
  const slaps = [].concat(o.tail ?? []).map((t) => ao({ n: 'c5tail', d: 0.7, t, e: 'ease-in' }));
  const tail = `<g style="transform-origin:-46px -40px;${slaps.length ? anims(slaps) : ''}"><g style="transform-origin:-46px -40px;animation:c5tbob 1.6s ease-in-out infinite alternate">
    <path d="M-44 -48 C-80 -70 -150 -76 -168 -40 C-176 -16 -120 4 -74 -10 C-56 -16 -46 -28 -44 -48Z" fill="${choc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-92 -60 L-118 -8 M-122 -62 L-142 -20 M-70 -54 L-88 -12 M-156 -50 L-130 -22 M-100 -30 L-150 -34" stroke="#4a2410" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="-116" cy="-58" rx="30" ry="7" fill="#fff" opacity=".25" transform="rotate(-8 -116 -58)"/></g></g>`;
  const legs = [-34, 14].map((x) => `<rect x="${x}" y="-44" width="26" height="40" rx="12" fill="${br}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 18}" cy="-6" rx="22" ry="9" fill="${brD}" stroke="${INK}" stroke-width="4"/>`).join('');
  const head = `
    <circle cx="14" cy="-152" r="14" fill="${brD}" stroke="${INK}" stroke-width="4"/><circle cx="14" cy="-152" r="7" fill="#e8a070"/>
    <rect x="-2" y="-176" width="52" height="9" rx="4.5" fill="#ffd23f" stroke="${INK}" stroke-width="3" transform="rotate(-16 -2 -172)"/><path d="M-6 -172 l-6 4" stroke="#e8a0a0" stroke-width="5" stroke-linecap="round"/>
    <circle cx="50" cy="-134" r="46" fill="${br}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="80" cy="-118" rx="34" ry="26" fill="${muz}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="106" cy="-132" rx="11" ry="8" fill="${INK}"/><ellipse cx="103" cy="-135" rx="3.4" ry="2.2" fill="#fff" opacity=".8"/>
    ${eyeStates([[50, -144, 12, 2], [80, -146, 10, 2]], o.eyes || [])}
    <path d="M42 -166 Q54 -172 66 -168 M74 -166 Q86 -170 94 -164" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(86, -108, talk, o.moods || [], o.mood || 'calm')}
    <rect x="72" y="-112" width="30" height="26" rx="5" fill="${teeth}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M87 -112 V-86" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M76 -108 v10" stroke="#e6e6ee" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="58" cy="-116" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[58, -116, 15]], o.blush || [])}
    <path d="M0 -168 Q-4 -216 46 -222 Q96 -216 98 -168Z" fill="${hat}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="-12" y="-176" width="124" height="14" rx="7" fill="${hatD}" stroke="${INK}" stroke-width="4"/>
    <path d="M46 -222 V-170" stroke="${hatD}" stroke-width="9" stroke-linecap="round"/><path d="M46 -222 V-170" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>
    <ellipse cx="22" cy="-203" rx="14" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 22 -203)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -50px;animation:breathe 1.3s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-78" rx="58" ry="52" fill="${br}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="14" cy="-72" rx="38" ry="38" fill="${belly}"/>
      <ellipse cx="-20" cy="-106" rx="22" ry="8" fill="#fff" opacity=".28" transform="rotate(-24 -20 -106)"/>
      <rect x="-56" y="-62" width="112" height="16" rx="6" fill="${belt}" stroke="${INK}" stroke-width="4"/><rect x="20" y="-60" width="16" height="12" rx="3" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>
      <rect x="-40" y="-56" width="24" height="30" rx="6" fill="#e8631a" stroke="${INK}" stroke-width="3.5"/><path d="M-34 -56 V-76 M-24 -56 V-72" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><rect x="-37" y="-80" width="8" height="8" rx="2" fill="#aab" stroke="${INK}" stroke-width="2.5"/>
      ${armG(24, -100, br, br, { rest: -22, len: 44, w: 20, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(head, 46, -110, 2)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Mlle Zélie la girafe (hauteur ≈ 410) ─────────────────────────
export function giraffe(talk = [], o = {}) {
  const gold = '#ffcf3f', goldD = '#f0b42a', spot = '#f08a24', cream = '#fff0c2', pink = '#ff8fb8', violet = '#7a4ad8', dot = '#e8434e';
  const n = uid++;
  const sh = shadowEl(94, [], []);
  const spots = (pts) => pts.map(([x, y, r, rot]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.74}" fill="${spot}" transform="rotate(${rot} ${x} ${y})"/>`).join('');
  const legs = [[-52, 0], [-22, 1], [26, 0], [56, 1]].map(([x, far]) => `<rect x="${x - 11}" y="-112" width="22" height="104" rx="10" fill="${far ? goldD : gold}" stroke="${INK}" stroke-width="4"/><rect x="${x - 11}" y="-22" width="22" height="18" fill="${spot}" opacity=".0"/><path d="M${x - 11} -26 h22 v22 q0 6 -6 6 h-10 q-6 0 -6 -6Z" fill="#7a4a2a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  const neck = `<clipPath id="gfn${n}"><path d="M4 -170 L68 -170 L100 -356 L54 -356Z"/></clipPath>
    <path d="M4 -170 L68 -170 L100 -356 L54 -356Z" fill="${gold}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <g clip-path="url(#gfn${n})">${spots([[30, -196, 14, 20], [58, -222, 12, -10], [40, -256, 13, 30], [72, -290, 11, -20], [56, -330, 11, 10], [34, -296, 8, 0]])}<path d="M20 -170 L50 -360" stroke="#fff" stroke-width="9" opacity=".25" stroke-linecap="round"/></g>
    <path d="M4 -170 L68 -170 L100 -356 L54 -356Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  // mètre de couturière rose autour du cou (bande + extrémité qui pend)
  const tape = `<path d="M22 -226 Q40 -214 70 -228 L72 -212 Q42 -198 20 -210Z" fill="${pink}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M30 -216 v8 M38 -213 v6 M46 -213 v8 M54 -214 v6 M62 -219 v8" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M64 -224 Q84 -200 70 -168 L82 -164 Q98 -204 78 -230Z" fill="${pink}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M76 -204 h8 M73 -192 h8 M72 -180 h8" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
  // foulard à pois
  const scarf = `<g transform="translate(0 -42)"><path d="M28 -296 Q56 -282 82 -304 L88 -286 Q56 -266 24 -280Z" fill="#5fb7f2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="40" cy="-284" r="3.6" fill="#fff"/><circle cx="56" cy="-282" r="3.6" fill="#fff"/><circle cx="72" cy="-290" r="3.6" fill="#fff"/><circle cx="48" cy="-274" r="3" fill="#fff"/><circle cx="64" cy="-276" r="3" fill="#fff"/>
    <path d="M30 -280 Q12 -268 10 -244 L24 -242 Q30 -260 38 -272Z" fill="#5fb7f2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="20" cy="-258" r="3" fill="#fff"/></g>`;
  const pomp = (x, y, c, rot) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x} ${y} v-24" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${y} v-24" stroke="${goldD}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${y - 28}" r="11" fill="${c}" stroke="${INK}" stroke-width="4"/><circle cx="${x - 3}" cy="${y - 32}" r="3.4" fill="#fff" opacity=".7"/></g>`;
  const head = `
    ${pomp(80, -378, pink, -10)}${pomp(104, -382, violet, 10)}
    <ellipse cx="62" cy="-360" rx="13" ry="22" fill="${goldD}" stroke="${INK}" stroke-width="4" transform="rotate(-38 62 -360)"/><ellipse cx="62" cy="-360" rx="6" ry="12" fill="#ffb3b8" transform="rotate(-38 62 -360)"/>
    <ellipse cx="90" cy="-346" rx="46" ry="38" fill="${gold}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="126" cy="-332" rx="32" ry="24" fill="${cream}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="148" cy="-338" rx="4.5" ry="6.5" fill="${INK}"/><ellipse cx="136" cy="-344" rx="4" ry="5.5" fill="${INK}"/>
    <ellipse cx="74" cy="-368" rx="9" ry="6" fill="${spot}" transform="rotate(-20 74 -368)"/><circle cx="96" cy="-374" r="5" fill="${spot}"/>
    ${eyeStates([[84, -352, 12, 2], [112, -354, 10, 2]], o.eyes || [])}
    <path d="M72 -372 Q86 -380 98 -372 M106 -372 Q114 -376 122 -370" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(128, -318, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="98" cy="-330" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[98, -330, 15]], o.blush || [])}
    ${hats(o)}`;
  const pins = [[-6, -9], [2, -12], [7, -5]].map(([x, y]) => `<path d="M${x} ${y} l${x * 0.3} -9" stroke="#bbb" stroke-width="2" stroke-linecap="round"/><circle cx="${x + x * 0.3}" cy="${y - 10}" r="2.4" fill="${dot}"/>`).join('');
  const cushion = `<g transform="translate(-12 -14)"><ellipse rx="12" ry="9" fill="${violet}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-3" cy="-3" rx="4" ry="2.5" fill="#fff" opacity=".5"/>${pins}</g>`;
  const inner = `${o.noShadow ? '' : sh}
    <g style="transform-origin:-72px -150px;animation:c5tail2 1.4s ease-in-out infinite alternate"><path d="M-66 -150 Q-98 -140 -96 -104" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-66 -150 Q-98 -140 -96 -104" stroke="${gold}" stroke-width="4.5" fill="none" stroke-linecap="round"/><ellipse cx="-96" cy="-96" rx="9" ry="15" fill="#7a4a2a" stroke="${INK}" stroke-width="3.5"/></g>
    ${legs}
    <g style="transform-origin:0px -110px;animation:breathe 1.5s ease-in-out infinite alternate">
      <path d="M-82 -134 Q-84 -204 -8 -202 Q70 -202 80 -140 Q74 -90 0 -88 Q-76 -88 -82 -134Z" fill="${gold}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-82 -134 Q-84 -204 -8 -202 Q70 -202 80 -140 Q74 -90 0 -88 Q-76 -88 -82 -134Z" fill="${cream}" opacity=".0"/>
      ${spots([[-50, -160, 15, 10], [-10, -180, 14, -20], [30, -158, 16, 24], [-36, -118, 13, -10], [8, -114, 14, 14], [54, -124, 10, 0]])}
      <ellipse cx="-30" cy="-180" rx="26" ry="8" fill="#fff" opacity=".3" transform="rotate(-10 -30 -180)"/>
      <g style="transform-origin:36px -172px;animation:c5neck 2.8s ease-in-out infinite alternate">
        ${neck}${tape}${scarf}
        ${armG(34, -178, gold, cream, { rest: -26, len: 58, w: 17, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: cushion + (o.item || '') })}
        <g transform="translate(0 -42)">${idle(head, 60, -318, 2.4)}</g>
      </g>
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Taupin la taupe (hauteur ≈ 175 avec bonnet) ─────────────────────────
export function mole(talk = [], o = {}) {
  const fur = '#7f8dab', furD = '#66738f', paw = '#f6d8cc', snout = '#ff9fb0', red = '#e8434e', redD = '#c7313c';
  const sh = shadowEl(70, [], []);
  const legs = [-26, 8].map((x) => `<rect x="${x}" y="-40" width="24" height="36" rx="11" fill="${furD}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 16}" cy="-6" rx="20" ry="8" fill="${paw}" stroke="${INK}" stroke-width="4"/>`).join('');
  const book = `<g transform="translate(-6 -64) rotate(-6)"><rect x="-24" y="-30" width="48" height="60" rx="5" fill="#3b82f6" stroke="${INK}" stroke-width="4"/><rect x="-18" y="-22" width="30" height="8" rx="2" fill="#fff" opacity=".8"/><path d="M-18 -8 h28 M-18 2 h22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/><rect x="18" y="-34" width="8" height="26" rx="2" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>`;
  const lens = (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="#dff3ff" fill-opacity=".55" stroke="${INK}" stroke-width="5"/><path d="M${x - 14} ${y - 12} Q${x - 8} ${y - 18} ${x} ${y - 19}" stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity=".9"/>`;
  const head = `
    <circle cx="14" cy="-128" r="9" fill="${furD}" stroke="${INK}" stroke-width="3.5"/>
    <circle cx="30" cy="-102" r="42" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <path d="M62 -106 Q96 -112 112 -92 Q96 -70 60 -78Z" fill="${snout}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="112" cy="-93" rx="8" ry="7" fill="#ff6f8a" stroke="${INK}" stroke-width="3.5"/><ellipse cx="110" cy="-96" rx="2.6" ry="1.8" fill="#fff" opacity=".8"/>
    <g style="animation:c5sniff .35s ease-in-out infinite alternate">${eyeStates([[14, -108, 5, 1], [48, -106, 4.5, 1]], o.eyes || [])}</g>
    ${lens(14, -108)}${lens(48, -106)}<path d="M36 -108 Q31 -112 26 -108" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-0 -112 L-14 -116" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
    ${mouthStates(70, -66, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="40" cy="-76" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>${blushWin([[40, -76, 14]], o.blush || [])}
    <path d="M-8 -118 Q-10 -164 32 -168 Q76 -164 70 -118Q32 -128 -8 -118Z" fill="${red}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="-12" y="-130" width="86" height="18" rx="9" fill="${redD}" stroke="${INK}" stroke-width="4"/><path d="M6 -128 v14 M22 -128 v14 M38 -128 v14 M54 -128 v14" stroke="${INK}" stroke-width="2.5" opacity=".5" stroke-linecap="round"/>
    <circle cx="32" cy="-176" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="-12" cy="-150" rx="10" ry="5" fill="#fff" opacity=".4" transform="rotate(-40 -12 -150)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${legs}
    <g style="transform-origin:0px -40px;animation:breathe 1.1s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-66" rx="48" ry="44" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="12" cy="-58" rx="30" ry="30" fill="#a9b4cc"/>
      <ellipse cx="-18" cy="-86" rx="16" ry="6" fill="#fff" opacity=".28" transform="rotate(-24 -18 -86)"/>
      ${book}
      <ellipse cx="-34" cy="-64" rx="16" ry="12" fill="${paw}" stroke="${INK}" stroke-width="4"/>
      ${armG(24, -76, fur, paw, { rest: -24, len: 36, w: 22, handR: 17, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(head, 34, -80, 2.1)}
    </g>`;
  return wrapFx(inner, o);
}
