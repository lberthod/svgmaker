// Saison 3 : nouveaux personnages (Bidule le crabe, Capitaine Gaston le pélican, Marinette la loutre).
// Pieds au sol en (0,0), regardent à droite (le crabe est de face, il marche de côté). Mêmes conventions d'options que fox()/hedgehog() :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]] · noShadow
// Options propres : crab {walk:[[a,b]] trottinement de côté, pinch:[[a,b]] pince qui claque, noCap}
//                   pelican {pouch:[[a,b,svg]] objets qui dépassent du bec, noPipe, noCap}
//                   otter {whistle:[[a,b]] coup de sifflet, noBuoy}
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes cstep{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
@keyframes cwalk{from{transform:translateY(0)}to{transform:translateY(-5px)}}
@keyframes cclaw{0%,100%{transform:rotate(0)}50%{transform:rotate(-26deg)}}
@keyframes cpinch{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-30deg)}}
@keyframes cidle{from{transform:rotate(-3deg)}to{transform:rotate(5deg)}}
@keyframes ctail{from{transform:rotate(-5deg)}to{transform:rotate(7deg)}}
@keyframes cwhist{0%{opacity:0;transform:scale(.4)}20%{opacity:1;transform:scale(1)}100%{opacity:0;transform:translateX(24px) scale(1.2)}}
@keyframes cpouch{0%,100%{transform:rotate(0)}50%{transform:rotate(9deg)}}`);

let uid = 0;
const blushWin = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
const cyc = (a, b, p) => Math.max(1, Math.round((b - a) / p));
// bras : épaule (sx,sy), repos en degrés (négatif = vers l'avant/droite), main au bout de `len`
const limb = (sx, sy, fill, hand, { rest = -25, len = 46, w = 18, gest = [], point = [], wave = [], item = '' } = {}) => {
  const L = [...gest.map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...point.map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...wave.map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a }))];
  return `<g style="--r:${rest}deg;transform-origin:${sx}px ${sy}px;transform:rotate(${rest}deg);${anims(L)}"><rect x="${sx - w / 2}" y="${sy - 4}" width="${w}" height="${len + 4}" rx="${w / 2}" fill="${fill}" stroke="${INK}" stroke-width="4"/><circle cx="${sx}" cy="${sy + len}" r="${w / 2 + 2}" fill="${hand}" stroke="${INK}" stroke-width="4"/>${item ? `<g transform="translate(${sx} ${sy + len})">${item}</g>` : ''}</g>`;
};
const wrapFx = (inner, o) => {
  if (o.jolt !== undefined && o.jolt !== 0) inner = `<g style="animation:${[].concat(o.jolt).map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',')}">${inner}</g>`;
  if (o.shiver) inner = `<g style="--s:3px;${an({ n: 'shake', d: 0.045, t: o.shiver[0], c: Math.round((o.shiver[1] - o.shiver[0]) / 0.045), dir: 'alternate' })}">${inner}</g>`;
  return inner;
};
const idle = (inner, ox, oy, d = 1.7) => `<g style="transform-origin:${ox}px ${oy}px;animation:idlehead ${d}s ease-in-out infinite alternate">${inner}</g>`;
const hats = (o) => (o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('');

// ───────────────────────── Bidule le crabe ─────────────────────────
export function crab(talk = [], o = {}) {
  const red = '#ff6a3d', redD = '#e04a26', cream = '#ffd9b8', shell = '#8e7cdb', shellL = '#c9bff5';
  const walk = o.walk || [], pinch = o.pinch || [];
  const sh = shadowEl(104, [], []);
  // jambes : 3 par côté, trottinent en alternance
  const legs = [-1, 1].map((k) => [0, 1, 2].map((i) => {
    const hx = k * 56, hy = -34 + i * 6, fx = k * (98 + i * 12), alt = (i + (k > 0 ? 1 : 0)) % 2;
    const d = `M${hx} ${hy} Q${k * 94} ${hy - 14} ${fx} -5`;
    const w = walk.map(([a, b]) => ao({ n: 'cstep', d: 0.14, t: a + (alt ? 0.07 : 0), c: cyc(a, b, 0.14), dir: 'alternate' }));
    return `<g style="transform-origin:${hx}px ${hy}px;${anims(w)}"><path d="${d}" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${red}" stroke-width="5.5" fill="none" stroke-linecap="round"/></g>`;
  }).join('')).join('');
  // pince : cx,cy = centre ; r = rayon ; k = 1 droite, -1 gauche ; wins = pince qui claque
  const claw = (r, k, snap, still = false) => {
    const jaw = [...snap.map(([a, b]) => ao({ n: 'cpinch', d: 0.26, t: a, c: cyc(a, b, 0.26) })), ...(still ? [] : [`cclaw 2.6s ease-in-out ${k > 0 ? 0 : 1}s infinite`])];
    return `<g style="transform-origin:0px 0px;${anims(jaw)}"><ellipse cx="${k * r * 0.5}" cy="${-r * 0.62}" rx="${r * 0.62}" ry="${r * 0.36}" transform="rotate(${k * -20} ${k * r * 0.5} ${-r * 0.62})" fill="${red}" stroke="${INK}" stroke-width="5"/></g>
    <ellipse cx="${k * r * 0.52}" cy="${r * 0.34}" rx="${r * 0.62}" ry="${r * 0.36}" transform="rotate(${k * 20} ${k * r * 0.52} ${r * 0.34})" fill="${red}" stroke="${INK}" stroke-width="5"/>
    <circle r="${r * 0.82}" fill="${red}" stroke="${INK}" stroke-width="6"/><ellipse cx="${-k * r * 0.25}" cy="${-r * 0.3}" rx="${r * 0.3}" ry="${r * 0.16}" fill="#fff" opacity=".4" transform="rotate(-30 ${-k * r * 0.25} ${-r * 0.3})"/>`;
  };
  // gros bras droit (gestes) / petit bras gauche
  const bigL = [...(o.gest ?? []).map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...(o.point || []).map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...(o.wave || []).map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a }))];
  const bigArm = `<g style="--r:-132deg;transform-origin:62px -62px;transform:rotate(-132deg);${anims(bigL)}">
    <path d="M62 -62 v50" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M62 -62 v50" stroke="${red}" stroke-width="9" stroke-linecap="round"/>
    <g transform="translate(62 -2) rotate(132)">${claw(38, 1, pinch)}${o.item ? `<g transform="translate(26 -6)">${o.item}</g>` : ''}</g></g>`;
  const smallArm = `<g style="transform-origin:-62px -62px;transform:rotate(128deg)"><path d="M-62 -62 v40" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-62 -62 v40" stroke="${red}" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-62 -22) rotate(-128)">${claw(26, -1, [])}</g></g>`;
  const stalk = (x) => `<path d="M${x} -92 v-30" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x} -92 v-30" stroke="${cream}" stroke-width="8" stroke-linecap="round"/>`;
  const cap = o.noCap ? '' : `<g transform="translate(-2 -108) rotate(-12)"><path d="M-24 0 Q-30 -34 0 -38 Q30 -34 26 0Z" fill="${shell}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-6 -6 Q-16 -8 -14 -18 Q-10 -28 2 -26 Q12 -22 8 -14 Q4 -10 -2 -14" fill="none" stroke="${shellL}" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="-14" cy="-26" rx="8" ry="4" fill="#fff" opacity=".4" transform="rotate(-30 -14 -26)"/></g>`;
  const eyeL = [[-38, -138, 15, 2], [38, -138, 15, 2]];
  const bob = walk.map(([a, b]) => ao({ n: 'cwalk', d: 0.07, t: a, c: cyc(a, b, 0.07), dir: 'alternate' }));
  const inner = `${legs}
    <g style="${anims(bob)}">
    <g style="transform-origin:0px -40px;animation:breathe 1s ease-in-out infinite alternate">
      ${bigArm}${smallArm}
      <ellipse cx="0" cy="-54" rx="82" ry="50" fill="${red}" stroke="${INK}" stroke-width="5"/>
      <ellipse cx="0" cy="-40" rx="56" ry="26" fill="${cream}" opacity=".55"/>
      <circle cx="-56" cy="-70" r="6" fill="${redD}"/><circle cx="54" cy="-76" r="5" fill="${redD}"/><circle cx="-34" cy="-32" r="4" fill="${redD}"/><circle cx="40" cy="-30" r="5" fill="${redD}"/>
      <ellipse cx="-34" cy="-80" rx="20" ry="8" fill="#fff" opacity=".35" transform="rotate(-14 -34 -80)"/>
      ${idle(`${stalk(-38)}${stalk(38)}${cap}
        ${eyeStates(eyeL, o.eyes || [])}
        ${mouthStates(0, -56, talk, o.moods || [], o.mood || 'happy')}
        <ellipse cx="-54" cy="-58" rx="13" ry="8" fill="#ff8fa3" opacity=".7"/><ellipse cx="54" cy="-58" rx="13" ry="8" fill="#ff8fa3" opacity=".7"/>${blushWin([[-54, -58, 17], [54, -58, 17]], o.blush || [])}
        ${hats(o)}`, 0, -60, 1.3)}
    </g></g>`;
  return (o.noShadow ? '' : sh) + wrapFx(inner, o);
}

// ───────────────────────── Capitaine Gaston le pélican ─────────────────────────
export function pelican(talk = [], o = {}) {
  const feather = '#e9eef4', featherD = '#c3ccd8', yel = '#ffd23f', yelD = '#f0b429', pouchC = '#ffb3a7', navy = '#27437f', orange = '#ff9f43', wood = '#8a5a33';
  const n = uid++;
  const pouch = o.pouch || [];
  const sh = shadowEl(74, [], []);
  const jaw = talk.map(([a, b]) => ao({ n: 'cpouch', d: 0.28, t: a, c: cyc(a, b, 0.28) }));
  const foot = (x) => `<rect x="${x - 7}" y="-56" width="14" height="50" rx="7" fill="${orange}" stroke="${INK}" stroke-width="4"/>
    <path d="M${x - 30} -2 Q${x - 26} -16 ${x - 6} -12 Q${x + 4} -18 ${x + 14} -12 Q${x + 38} -16 ${x + 36} -2 Q${x + 4} 6 ${x - 30} -2Z" fill="${orange}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  const stripes = Array.from({ length: 8 }, (_, i) => `<rect x="-90" y="${-124 + i * 13}" width="180" height="7" fill="#fff" opacity=".9"/>`).join('');
  const cap = o.noCap ? '' : `<g transform="translate(34 -246) rotate(-6)">
    <path d="M-38 6 Q-44 -38 0 -44 Q46 -38 40 6Z" fill="${navy}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-42 8 Q0 20 44 8 L46 -6 Q0 6 -44 -6Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M30 6 Q70 4 78 14 Q50 20 30 14Z" fill="#1d2f5c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <g transform="translate(0 -22)" stroke="#ffc933" stroke-width="3.5" fill="none" stroke-linecap="round"><circle cy="-8" r="3.5" fill="#ffc933"/><path d="M0 -4 V12 M-6 0 H6 M-10 6 Q-9 14 0 14 Q9 14 10 6" /></g>
    <ellipse cx="-20" cy="-26" rx="12" ry="5" fill="#fff" opacity=".3" transform="rotate(-20 -20 -26)"/></g>`;
  const pipe = o.noPipe ? '' : `<g transform="translate(86 -190)"><path d="M0 0 Q18 10 30 8" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 0 Q18 10 30 8" stroke="${wood}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M24 2 h22 v-16 h-8 v8 h-14Z" fill="${wood}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="35" cy="-14" rx="11" ry="4" fill="#5a3a1c" stroke="${INK}" stroke-width="3"/></g>`;
  const items = pouch.map(([a, b, s]) => vis(a, b, `<g transform="translate(138 -178)">${s}</g>`)).join('');
  const inner = `${foot(-20)}${foot(24)}
    <g transform="translate(-60 -92) rotate(8)"><path d="M0 0 Q-40 10 -50 50 Q-20 36 6 22Z" fill="${feather}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>
    <g style="transform-origin:0px -60px;animation:breathe 1.5s ease-in-out infinite alternate">
      <ellipse cx="-4" cy="-110" rx="62" ry="64" fill="${feather}" stroke="${INK}" stroke-width="4"/>
      <clipPath id="pel${n}"><ellipse cx="-4" cy="-110" rx="62" ry="64"/></clipPath>
      <g clip-path="url(#pel${n})"><rect x="-90" y="-132" width="180" height="120" fill="${navy}"/>${stripes}<path d="M-30 -140 Q-4 -112 24 -140Z" fill="${feather}"/></g>
      <ellipse cx="-4" cy="-110" rx="62" ry="64" fill="none" stroke="${INK}" stroke-width="4"/>
      <path d="M-30 -138 Q-4 -110 24 -138" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-30" cy="-100" rx="14" ry="28" fill="#fff" opacity=".18" transform="rotate(14 -30 -100)"/>
      <rect x="-14" y="-190" width="34" height="62" rx="16" fill="${feather}" stroke="${INK}" stroke-width="4"/>
      ${limb(30, -120, feather, featherD, { rest: -20, len: 50, w: 22, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(`
        <circle cx="34" cy="-222" r="40" fill="${feather}" stroke="${INK}" stroke-width="4"/>
        <path d="M0 -246 q-14 -6 -24 6 q10 2 18 12" fill="${feather}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <g style="transform-origin:76px -208px;${anims(jaw)}"><path d="M68 -206 Q104 -104 202 -190 L194 -198 Q130 -178 68 -210Z" fill="${pouchC}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="120" cy="-150" rx="24" ry="8" fill="#fff" opacity=".4" transform="rotate(12 120 -150)"/><path d="M96 -170 Q124 -140 168 -176" fill="none" stroke="#ff8f80" stroke-width="3.5" stroke-linecap="round"/></g>
        ${items}
        <path d="M62 -232 Q132 -262 208 -204 Q214 -190 196 -190 Q130 -178 64 -202Z" fill="${yel}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M190 -216 Q210 -208 208 -196" fill="none" stroke="${yelD}" stroke-width="5" stroke-linecap="round"/><path d="M88 -236 Q132 -248 176 -220" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>
        <circle cx="96" cy="-214" r="3.5" fill="${yelD}"/>
        ${eyeStates([[24, -228, 13, 2], [56, -230, 10, 2]], o.eyes || [])}
        <path d="M14 -248 Q28 -254 40 -250 M48 -250 Q56 -254 64 -250" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
        ${mouthStates(74, -194, [], o.moods || [], o.mood || 'happy')}
        <ellipse cx="44" cy="-206" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[44, -206, 15]], o.blush || [])}
        ${pipe}${cap}${hats(o)}`, 30, -190, 2.0)}
    </g>`;
  return (o.noShadow ? '' : sh) + wrapFx(inner, o);
}

// ───────────────────────── Marinette la loutre ─────────────────────────
export function otter(talk = [], o = {}) {
  const fur = '#a8693a', furD = '#8a5230', cream = '#f7e3c4', yel = '#ffd23f', red = '#e8434e';
  const n = uid++;
  const sh = shadowEl(72, [], []);
  const whistle = (o.whistle || []).map(([a, b]) => vis(a, b, `<g transform="translate(112 -118)"><rect x="-6" y="-6" width="22" height="12" rx="6" fill="#d6dbe6" stroke="${INK}" stroke-width="3.5"/><circle cx="-2" cy="0" r="9" fill="#d6dbe6" stroke="${INK}" stroke-width="3.5"/></g>
    ${[0, 1, 2].map((i) => `<g transform="translate(${140 + i * 8} ${-124 + (i - 1) * 14}) rotate(${(i - 1) * 24})"><g style="${an({ n: 'cwhist', d: 0.45, t: a + i * 0.12, c: cyc(a, b, 0.45) })}"><path d="M0 -8 q8 8 0 16" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`).join('')}`)).join('');
  const buoy = o.noBuoy ? '' : `<g transform="translate(-10 -98) rotate(-24)"><circle r="34" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><circle r="34" fill="none" stroke="${red}" stroke-width="20"/>
    ${[0, 90, 180, 270].map((a) => `<path d="M0 -44 v20" stroke="#fff" stroke-width="12" stroke-linecap="butt" transform="rotate(${a + 45})"/>`).join('')}<path d="M-26 -30 A40 40 0 0 1 4 -42" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/></g>`;
  const whisk = (cx, cy, k) => [-8, 6].map((dy) => `<path d="M${cx} ${cy + dy / 2} Q${cx + k * 20} ${cy + dy} ${cx + k * 36} ${cy + dy * 2.2}" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".9"/>`).join('');
  const inner = `
    <g style="transform-origin:-44px -50px;animation:ctail 1.4s ease-in-out infinite alternate"><path d="M-40 -50 Q-100 -40 -130 -66 Q-140 -78 -122 -80 Q-90 -78 -48 -86Z" fill="${fur}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-110 -76 Q-90 -62 -66 -66" fill="none" stroke="${furD}" stroke-width="4" stroke-linecap="round"/></g>
    <rect x="-34" y="-46" width="26" height="42" rx="13" fill="${fur}" stroke="${INK}" stroke-width="4"/><ellipse cx="-14" cy="-6" rx="22" ry="9" fill="${furD}" stroke="${INK}" stroke-width="4"/>
    <rect x="8" y="-46" width="26" height="42" rx="13" fill="${fur}" stroke="${INK}" stroke-width="4"/><ellipse cx="30" cy="-6" rx="22" ry="9" fill="${furD}" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -50px;animation:breathe 1.2s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-92" rx="54" ry="60" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <clipPath id="ott${n}"><ellipse cx="0" cy="-92" rx="54" ry="60"/></clipPath>
      <ellipse cx="10" cy="-84" rx="36" ry="42" fill="${cream}"/>
      <g clip-path="url(#ott${n})">${Array.from({ length: 4 }, (_, i) => `<rect x="-60" y="${-84 + i * 28}" width="120" height="14" fill="${yel}"/>`).join('')}<rect x="-60" y="-118" width="120" height="34" fill="${fur}"/><ellipse cx="10" cy="-96" rx="36" ry="26" fill="${cream}"/></g>
      <ellipse cx="0" cy="-92" rx="54" ry="60" fill="none" stroke="${INK}" stroke-width="4"/>
      <path d="M-28 -66 Q-20 -64 -12 -66 M-30 -30 Q-20 -28 -10 -30" stroke="${INK}" stroke-width="0" fill="none"/>
      ${buoy}
      <path d="M26 -122 Q36 -100 40 -92" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g transform="translate(38 -92) rotate(-8)"><rect x="-6" y="-4" width="20" height="11" rx="5.5" fill="${yel}" stroke="${INK}" stroke-width="3.5"/><circle cx="-4" cy="-1" r="8" fill="${yel}" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="-1" r="2.4" fill="${INK}"/></g>
      ${limb(24, -86, fur, cream, { rest: -24, len: 40, w: 18, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(`
        <circle cx="30" cy="-176" r="14" fill="${fur}" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="-176" r="6.5" fill="${cream}"/>
        <circle cx="86" cy="-178" r="13" fill="${fur}" stroke="${INK}" stroke-width="4"/><circle cx="86" cy="-178" r="6" fill="${cream}"/>
        <circle cx="58" cy="-148" r="46" fill="${fur}" stroke="${INK}" stroke-width="4"/>
        <path d="M30 -184 Q58 -196 88 -184" fill="none" stroke="${furD}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
        <ellipse cx="86" cy="-130" rx="34" ry="24" fill="${cream}" stroke="${INK}" stroke-width="4"/>
        <path d="M82 -148 h22 q2 10 -11 12 q-13 -2 -11 -12Z" fill="#4b2a1a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="91" cy="-146" rx="4" ry="2" fill="#fff" opacity=".7"/>
        ${eyeStates([[44, -160, 14, 2], [78, -160, 11, 2]], o.eyes || [])}
        <path d="M32 -182 Q44 -188 58 -184 M74 -182 Q84 -186 94 -180" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        ${mouthStates(90, -124, talk, o.moods || [], o.mood || 'happy')}
        ${whisk(106, -132, 1)}${whisk(70, -132, -1)}
        <ellipse cx="38" cy="-136" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[38, -136, 15]], o.blush || [])}
        ${whistle}${hats(o)}`, 50, -110, 1.8)}
    </g>`;
  return (o.noShadow ? '' : sh) + wrapFx(inner, o);
}
