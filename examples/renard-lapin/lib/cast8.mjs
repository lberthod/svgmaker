// Saison 8 « La forêt des contes » : nouveaux personnages (Capucine la biche, Noisette l'écureuil, Titus le sanglier).
// Pieds au sol en (0,0), regardent à droite. Nommés d'après l'id de voix : deer, squirrel, boar.
// Mêmes conventions d'options que cast5.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]]
//   noShadow = true
// Options propres :
//   deer     (hauteur ≈ 275) : ears = [[a,b]] oreilles qui frémissent · scarf = false retire l'écharpe verte
//   squirrel (hauteur ≈ 185, queue en « ? » ≈ 225) : tap = [[a,b]] tapote ses joues en comptant · full = [[a,b]] joues gonflées · nut = false retire la noisette de la poche
//   boar     (hauteur ≈ 190 avec le pompon) : sniff = [[a,b]] renifle (museau qui frotte, tête qui plonge) · cap = false retire le bonnet jaune
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c8tail{from{transform:rotate(-5deg)}to{transform:rotate(7deg)}}
@keyframes c8ear{0%,100%{transform:rotate(0)}25%{transform:rotate(-14deg)}50%{transform:rotate(6deg)}75%{transform:rotate(-10deg)}}
@keyframes c8tap{0%,100%{transform:rotate(-132deg)}50%{transform:rotate(-152deg)}}
@keyframes c8puff{0%{transform:scale(1)}18%,82%{transform:scale(1.32,1.22)}100%{transform:scale(1)}}
@keyframes c8snuf{0%,100%{transform:translateX(0) rotate(0)}30%{transform:translateX(3px) rotate(-5deg)}60%{transform:translateX(-2px) rotate(4deg)}}
@keyframes c8dip{0%,100%{transform:rotate(0)}15%,85%{transform:rotate(15deg)}}
@keyframes c8stub{from{transform:rotate(-3deg)}to{transform:rotate(5deg)}}`);

const blushWin = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
const armG = (sx, sy, fill, hand, { rest = -25, len = 40, w = 16, gest = [], point = [], wave = [], item = '', extra = [], handR } = {}) => {
  const L = [...gest.map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...point.map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...wave.map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a })), ...extra];
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
const win = (wins, inner) => (wins || []).map(([a, b]) => vis(a, b, inner)).join('');
const blushLoop = (a, b, inner, name) => `<g style="${an({ n: name, d: b - a, t: a })}">${inner}</g>`;

// ───────────────────────── Capucine la biche (hauteur ≈ 275) ─────────────────────────
export function deer(talk = [], o = {}) {
  const cam = '#d9964f', camD = '#b9773a', cream = '#fff0c8', spot = '#fff0c8', nose = '#2a1710', moss = '#6fbf73', mossD = '#4fa05a', hoof = '#6a4a2a';
  const sh = shadowEl(86, [], []);
  const legs = [[-44, 1], [-20, 0], [24, 1], [48, 0]].map(([x, far]) => `<path d="M${x - 10} -112 L${x - 9} -16 L${x + 9} -16 L${x + 10} -112Z" fill="${far ? camD : cam}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M${x - 9} -22 h18 v18 q0 6 -6 6 h-6 q-6 0 -6 -6Z" fill="${hoof}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  const tail = `<path d="M-52 -138 Q-72 -148 -68 -124 Q-62 -118 -50 -124Z" fill="${cream}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  const dots = [[-34, -148, 8], [-8, -158, 7], [20, -146, 8], [-22, -124, 6], [6, -122, 6], [34, -128, 5]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${spot}"/>`).join('');
  const neck = `<path d="M14 -140 L44 -196" stroke="${INK}" stroke-width="46" stroke-linecap="round"/><path d="M14 -140 L44 -196" stroke="${cam}" stroke-width="38" stroke-linecap="round"/>`;
  const scarf = o.scarf === false ? '' : `<g transform="rotate(-30 30 -170)"><rect x="6" y="-186" width="50" height="22" rx="11" fill="${moss}" stroke="${INK}" stroke-width="4"/><path d="M14 -178 v8 M26 -178 v8 M38 -178 v8" stroke="${mossD}" stroke-width="4" stroke-linecap="round"/></g>
    <path d="M10 -170 Q0 -150 4 -124 L22 -128 Q20 -150 26 -166Z" fill="${moss}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M6 -140 h14" stroke="${mossD}" stroke-width="4" stroke-linecap="round"/>`;
  const ear = (x, y, rot, dl) => `<g style="transform-origin:${x}px ${y + 16}px;${o.ears ? anims(o.ears.map(([a, b]) => ao({ n: 'c8ear', d: b - a, t: a }))) : `animation:c8stub ${2.2 + dl}s ease-in-out infinite alternate`}"><ellipse cx="${x}" cy="${y}" rx="17" ry="27" fill="${cam}" stroke="${INK}" stroke-width="4" transform="rotate(${rot} ${x} ${y})"/><ellipse cx="${x}" cy="${y + 2}" rx="8" ry="17" fill="#ffb3b8" transform="rotate(${rot} ${x} ${y})"/></g>`;
  const head = `
    ${ear(22, -246, -62, 0)}${ear(78, -254, 58, 0.5)}
    <circle cx="50" cy="-208" r="40" fill="${cam}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="88" cy="-192" rx="30" ry="22" fill="${cream}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="112" cy="-198" rx="11" ry="8.5" fill="${nose}"/><ellipse cx="108.5" cy="-201.5" rx="4" ry="2.6" fill="#fff" opacity=".85"/>
    <ellipse cx="36" cy="-236" rx="9" ry="5.5" fill="${spot}" transform="rotate(-20 36 -236)"/><circle cx="58" cy="-242" r="4.5" fill="${spot}"/>
    ${eyeStates([[44, -212, 11, 2], [76, -214, 9.5, 2]], o.eyes || [])}
    <path d="M34 -230 Q46 -238 58 -232 M68 -232 Q78 -236 86 -231" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(92, -176, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="58" cy="-188" rx="10" ry="6.2" fill="#ff8fa3" opacity=".7"/>${blushWin([[58, -188, 14]], o.blush || [])}
    <ellipse cx="30" cy="-226" rx="14" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 30 -226)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -110px;animation:breathe 1.5s ease-in-out infinite alternate">
      ${neck}
      <ellipse cx="0" cy="-132" rx="58" ry="38" fill="${cam}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="6" cy="-116" rx="40" ry="20" fill="${cream}" opacity=".7"/>${dots}
      <ellipse cx="-24" cy="-152" rx="22" ry="7" fill="#fff" opacity=".3" transform="rotate(-12 -24 -152)"/>
      ${scarf}
      ${armG(30, -128, cam, cream, { rest: -22, len: 36, w: 15, handR: 9, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(head, 44, -180, 2.2)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Noisette l'écureuil (hauteur ≈ 185) ─────────────────────────
export function squirrel(talk = [], o = {}) {
  const red = '#ee6a1f', redD = '#c9500f', cream = '#fff0d6', vest = '#3b82f6', vestD = '#2563eb', nutC = '#c98a4e';
  const sh = shadowEl(66, [], []);
  const tail = `<g style="transform-origin:-34px -50px;animation:c8tail 1.3s ease-in-out infinite alternate">
    <path d="M-34 -52 C-104 -64 -112 -140 -86 -178 C-66 -206 -28 -204 -18 -184" stroke="${INK}" stroke-width="46" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-34 -52 C-104 -64 -112 -140 -86 -178 C-66 -206 -28 -204 -18 -184" stroke="${red}" stroke-width="38" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-62 -94 C-84 -112 -84 -146 -72 -162" stroke="${redD}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M-92 -168 C-86 -186 -66 -196 -50 -194" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".35"/>
    <circle cx="-14" cy="-160" r="7" fill="${INK}" opacity="0"/></g>`;
  const legs = [-22, 12].map((x) => `<rect x="${x}" y="-34" width="22" height="30" rx="10" fill="${redD}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 15}" cy="-6" rx="18" ry="8" fill="${red}" stroke="${INK}" stroke-width="4"/>`).join('');
  const ear = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 14} ${y + 12} L${x - 6} ${y - 30} L${x + 2} ${y - 40} L${x + 12} ${y - 28} L${x + 16} ${y + 12}Z" fill="${red}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M${x - 2} ${y + 6} L${x + 2} ${y - 22} L${x + 8} ${y + 6}Z" fill="#ffb3b8"/></g>`;
  const cheeks = `<g style="transform-origin:70px -112px;${o.full ? anims(o.full.map(([a, b]) => ao({ n: 'c8puff', d: b - a, t: a }))) : ''}"><ellipse cx="68" cy="-110" rx="25" ry="20" fill="${cream}" stroke="${INK}" stroke-width="4"/><ellipse cx="60" cy="-118" rx="8" ry="4" fill="#fff" opacity=".6" transform="rotate(-20 60 -118)"/></g>`;
  const head = `
    ${ear(10, -172, -8)}${ear(48, -178, 10)}
    <circle cx="34" cy="-134" r="44" fill="${red}" stroke="${INK}" stroke-width="4"/>
    <path d="M18 -170 Q34 -178 52 -168" stroke="${redD}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
    ${cheeks}
    <ellipse cx="92" cy="-130" rx="9" ry="7" fill="${INK}"/><ellipse cx="89.5" cy="-133" rx="3" ry="2" fill="#fff" opacity=".85"/>
    ${eyeStates([[24, -142, 11, 2], [56, -144, 10, 2]], o.eyes || [])}
    <path d="M12 -158 Q24 -164 36 -159 M48 -160 Q58 -164 68 -158" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(80, -100, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="48" cy="-118" rx="10" ry="6.2" fill="#ff8fa3" opacity=".7"/>${blushWin([[48, -118, 14]], o.blush || [])}
    <ellipse cx="14" cy="-162" rx="14" ry="6" fill="#fff" opacity=".35" transform="rotate(-28 14 -162)"/>
    ${hats(o)}`;
  const tapArm = armG(30, -90, red, cream, { rest: -22, len: 32, w: 16, handR: 9, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '', extra: (o.tap || []).map(([a, b]) => ao({ n: 'c8tap', d: 0.4, t: a, c: Math.max(1, Math.round((b - a) / 0.4)), dir: 'alternate', e: 'ease-in-out' })) });
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -40px;animation:breathe 1.1s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-66" rx="44" ry="46" fill="${red}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="14" cy="-58" rx="26" ry="32" fill="${cream}"/>
      <path d="M-40 -80 Q-46 -30 -10 -24 L10 -26 Q-4 -52 4 -100 Q-24 -108 -40 -80Z" fill="${vest}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
            <rect x="-34" y="-62" width="30" height="24" rx="8" fill="${vestD}" stroke="${INK}" stroke-width="4"/>
      ${o.nut === false ? '' : `<g transform="translate(-13 -66) rotate(-14)"><ellipse cy="-8" rx="9" ry="12" fill="${nutC}" stroke="${INK}" stroke-width="3.5"/><path d="M-9 -14 Q0 -22 9 -14 Q0 -10 -9 -14Z" fill="#8f5226" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`}
      <circle cx="6" cy="-80" r="4" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="-24" cy="-96" rx="14" ry="5" fill="#fff" opacity=".3" transform="rotate(-24 -24 -96)"/>
      ${tapArm}
      ${idle(head, 34, -100, 1.6)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Titus le sanglier (hauteur ≈ 190 avec bonnet) ─────────────────────────
export function boar(talk = [], o = {}) {
  const fur = '#8c7b70', furD = '#6f6058', bristle = '#5e5048', stripe = '#e8d3b0', pinkS = '#ff9fb0', pinkD = '#ff7f96', yel = '#ffd23f', yelD = '#f0b400', hoof = '#4a3a34';
  const sh = shadowEl(104, [], []);
  const legs = [[-52, 1], [-24, 0], [28, 1], [56, 0]].map(([x, far]) => `<rect x="${x - 13}" y="-52" width="26" height="46" rx="12" fill="${far ? furD : fur}" stroke="${INK}" stroke-width="4"/><path d="M${x - 14} -16 h28 v10 q0 4 -4 4 h-20 q-4 0 -4 -4Z" fill="${hoof}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`).join('');
  const tail = `<path d="M-72 -84 Q-100 -100 -90 -120 Q-80 -132 -92 -142" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-72 -84 Q-100 -100 -90 -120 Q-80 -132 -92 -142" stroke="${fur}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const mane = `<path d="M-52 -122 L-46 -144 L-34 -124 L-24 -150 L-12 -128 L0 -152 L10 -128 L22 -146 L28 -122Z" fill="${bristle}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  const stripes = [-46, -22, 2, 26].map((x, i) => `<path d="M${x} ${-124 + (i % 2) * 4} Q${x - 8} -96 ${x - 2} -72" stroke="${stripe}" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('');
  const sniffs = o.sniff || [];
  const snout = `<g style="transform-origin:96px -80px;${sniffs.length ? anims(sniffs.map(([a, b]) => ao({ n: 'c8snuf', d: 0.32, t: a, c: Math.max(1, Math.round((b - a) / 0.32)), e: 'ease-in-out' }))) : ''}">
    <ellipse cx="108" cy="-82" rx="32" ry="25" fill="${pinkS}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="124" cy="-90" rx="6" ry="8" fill="${INK}" opacity=".8"/><ellipse cx="108" cy="-92" rx="5.5" ry="7.5" fill="${INK}" opacity=".8"/>
    <ellipse cx="98" cy="-98" rx="10" ry="4" fill="#fff" opacity=".5" transform="rotate(-14 98 -98)"/></g>`;
  const tusk = (x, rot) => `<path d="M${x - 7} -62 Q${x - 8} -82 ${x + 2} -90 Q${x + 8} -78 ${x + 7} -62Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" transform="rotate(${rot} ${x} -62)"/>`;
  const cap = o.cap === false ? '' : `<path d="M20 -128 Q22 -180 66 -182 Q108 -178 106 -126Z" fill="${yel}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="14" y="-136" width="98" height="18" rx="9" fill="${yelD}" stroke="${INK}" stroke-width="4"/><path d="M30 -134 v14 M46 -134 v14 M62 -134 v14 M78 -134 v14 M94 -134 v14" stroke="${INK}" stroke-width="2.5" opacity=".45" stroke-linecap="round"/>
    <path d="M44 -176 Q66 -190 88 -176" stroke="${yelD}" stroke-width="0"/><circle cx="66" cy="-190" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="38" cy="-164" rx="12" ry="5" fill="#fff" opacity=".5" transform="rotate(-30 38 -164)"/>`;
  const head = `
    <path d="M30 -124 L36 -156 L58 -128Z" fill="${furD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M78 -128 L96 -154 L104 -122Z" fill="${furD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="62" cy="-92" r="48" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <path d="M30 -110 Q36 -116 40 -110 M44 -122 l-2 -8" stroke="${bristle}" stroke-width="0"/>
    ${snout}${tusk(92, -8)}${tusk(124, 8)}
    ${eyeStates([[56, -104, 11, 2], [84, -106, 9, 2]], o.eyes || [])}
    <path d="M44 -120 Q56 -126 68 -121 M76 -121 Q86 -125 94 -120" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(104, -56, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="50" cy="-82" rx="11" ry="6.8" fill="#ff8fa3" opacity=".7"/>${blushWin([[50, -82, 15]], o.blush || [])}
    ${cap}${hats(o)}`;
  const headDip = `<g style="transform-origin:40px -70px;${sniffs.length ? anims(sniffs.map(([a, b]) => ao({ n: 'c8dip', d: b - a, t: a }))) : ''}">${idle(head, 50, -80, 2.4)}</g>`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -60px;animation:breathe 1.6s ease-in-out infinite alternate">
      <ellipse cx="-2" cy="-86" rx="78" ry="58" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="14" cy="-70" rx="54" ry="38" fill="#a69488"/>
      ${mane}${stripes}
      <ellipse cx="-36" cy="-122" rx="26" ry="8" fill="#fff" opacity=".28" transform="rotate(-14 -36 -122)"/>
      ${armG(34, -78, fur, furD, { rest: -20, len: 30, w: 22, handR: 13, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${headDip}
    </g>`;
  return wrapFx(inner, o);
}
