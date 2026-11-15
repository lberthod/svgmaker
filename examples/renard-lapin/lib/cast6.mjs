// Saison 6 « La grande ville » : Rocco le raton laveur (raccoon), Basile le pigeon (pigeon), Zazie la zèbre (zebra).
// Pieds au sol en (0,0), regardent à droite. Nommés d'après l'id de voix : raccoon, pigeon, zebra.
// Mêmes conventions d'options que cast5.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]]
//   noShadow = true
// Options propres :
//   raccoon : wash = [[a,b]] rince ses pattes (gouttes) · tail = [t…] queue qui frétille · flour = false (sans farine)
//   pigeon  : puff = [[a,b]] gonfle le jabot · salute = [[a,b]] salue de l'aile à la casquette · bag = false (sans sacoche) · letter = false (sans lettre dans la sacoche)
//   zebra   : sign = false (sans panneau) · signUp = [[a,b]] lève bien haut le panneau · flick = [t…] frétillement de queue
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c6tail{from{transform:rotate(-5deg)}to{transform:rotate(8deg)}}
@keyframes c6flick{0%{transform:rotate(0)}30%{transform:rotate(-28deg)}60%{transform:rotate(16deg)}100%{transform:rotate(0)}}
@keyframes c6puff{0%{transform:scale(1)}20%,80%{transform:scale(1.28,1.2)}100%{transform:scale(1)}}
@keyframes c6rub{from{transform:rotate(-8deg)}to{transform:rotate(10deg)}}
@keyframes c6drip{0%{opacity:0;transform:translateY(-6px)}30%{opacity:1}100%{opacity:0;transform:translateY(26px)}}
@keyframes c6up{0%{transform:rotate(0)}18%,82%{transform:rotate(-38deg)}100%{transform:rotate(0)}}
@keyframes c6sway{from{transform:rotate(-1.4deg)}to{transform:rotate(1.8deg)}}`);

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
const tailAnim = (ts, name, d) => [].concat(ts ?? []).map((t) => ao({ n: name, d, t }));

// ───────────────────────── Rocco le raton laveur, boulanger (hauteur ≈ 235 avec toque) ─────────────────────────
export function raccoon(talk = [], o = {}) {
  const fur = '#aab4c2', furD = '#6c7587', mask = '#4f566a', cream = '#f1f4f8', blue = '#3f8fe0', blueD = '#2f73bd', hatW = '#ffffff';
  const n = uid++;
  const sh = shadowEl(88, [], []);
  const wag = tailAnim(o.tail, 'c6flick', 0.8);
  const ring = [[-78, -66], [-102, -62], [-126, -56], [-146, -42]].map(([x, y]) => `<ellipse cx="${x}" cy="${y + 28}" rx="9" ry="34" fill="${furD}" transform="rotate(-12 ${x} ${y + 28})"/>`).join('');
  const tail = `<g style="transform-origin:-48px -52px;${wag.length ? anims(wag) : ''}"><g style="transform-origin:-48px -52px;animation:c6tail 1.9s ease-in-out infinite alternate">
    <clipPath id="rcT${n}"><path d="M-44 -50 C-84 -92 -156 -84 -166 -36 C-170 -6 -112 8 -74 -8 Q-52 -20 -44 -50Z"/></clipPath>
    <path d="M-44 -50 C-84 -92 -156 -84 -166 -36 C-170 -6 -112 8 -74 -8 Q-52 -20 -44 -50Z" fill="${fur}"/>
    <g clip-path="url(#rcT${n})">${ring}<path d="M-168 -50 q8 -16 22 -22 l10 10 q-14 10 -18 36z" fill="${furD}"/></g>
    <path d="M-44 -50 C-84 -92 -156 -84 -166 -36 C-170 -6 -112 8 -74 -8 Q-52 -20 -44 -50Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="-96" cy="-70" rx="30" ry="6" fill="#fff" opacity=".35" transform="rotate(-8 -96 -70)"/></g></g>`;
  const legs = [-32, 12].map((x) => `<rect x="${x}" y="-44" width="26" height="40" rx="12" fill="${furD}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 18}" cy="-6" rx="22" ry="9" fill="${furD}" stroke="${INK}" stroke-width="4"/>`).join('');
  const drops = (o.wash || []).map(([a, b]) => vis(a, b, [0, 1, 2, 3].map((i) => `<g transform="translate(${50 + i * 9} ${-30 + (i % 2) * 8})"><g style="${an({ n: 'c6drip', d: 0.5, t: a + i * 0.12, c: Math.max(1, Math.ceil((b - a) / 0.5)) })}"><path d="M0 -8 q7 10 0 14 q-7 -4 0 -14Z" fill="#7fd0ff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/></g></g>`).join(''))).join('');
  const washArm = (o.wash || []).map(([a, b]) => vis(a, b, `<g style="transform-origin:22px -90px;animation:c6rub .22s ease-in-out infinite alternate"><g style="transform:rotate(-68deg);transform-origin:22px -90px"><rect x="13" y="-94" width="18" height="52" rx="9" fill="${fur}" stroke="${INK}" stroke-width="4"/><circle cx="22" cy="-42" r="11" fill="${furD}" stroke="${INK}" stroke-width="4"/></g></g>`)).join('');
  const head = `
    <circle cx="8" cy="-150" r="13" fill="${furD}" stroke="${INK}" stroke-width="4"/><circle cx="8" cy="-150" r="6" fill="#ffb3c0"/>
    <circle cx="86" cy="-156" r="13" fill="${furD}" stroke="${INK}" stroke-width="4"/><circle cx="86" cy="-156" r="6" fill="#ffb3c0"/>
    <circle cx="46" cy="-136" r="46" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <path d="M14 -142 Q40 -166 82 -156 Q98 -146 92 -134 Q70 -120 40 -126 Q16 -128 14 -142Z" fill="${mask}"/>
    <ellipse cx="86" cy="-118" rx="30" ry="22" fill="${cream}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="110" cy="-126" rx="11" ry="8" fill="${INK}"/><ellipse cx="107" cy="-129" rx="3.4" ry="2.2" fill="#fff" opacity=".8"/>
    ${eyeStates([[48, -142, 12, 2], [80, -144, 10, 2]], o.eyes || [])}
    <path d="M36 -166 Q50 -172 62 -167" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0"/>
    ${mouthStates(88, -106, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="62" cy="-114" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[62, -114, 15]], o.blush || [])}
    ${o.flour === false ? '' : `<circle cx="100" cy="-136" r="4.5" fill="#fff"/><circle cx="92" cy="-141" r="3.2" fill="#fff"/><circle cx="104" cy="-144" r="2.6" fill="#fff"/><circle cx="26" cy="-118" r="3.4" fill="#fff" opacity=".9"/>`}
    <path d="M14 -166 Q-2 -182 14 -202 Q30 -224 54 -214 Q82 -226 92 -200 Q108 -180 92 -166Z" fill="${hatW}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M36 -200 q-4 14 2 28 M64 -204 q4 14 -2 30" stroke="#d9e0ea" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <rect x="10" y="-176" width="86" height="18" rx="8" fill="#f1f4f8" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="30" cy="-206" rx="12" ry="6" fill="#fff" opacity=".7" transform="rotate(-30 30 -206)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -50px;animation:breathe 1.4s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-78" rx="56" ry="52" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="16" cy="-70" rx="34" ry="36" fill="${cream}"/>
      <ellipse cx="-22" cy="-106" rx="22" ry="8" fill="#fff" opacity=".3" transform="rotate(-24 -22 -106)"/>
      <path d="M-24 -112 L40 -112 L50 -44 Q10 -34 -34 -44Z" fill="${blue}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-24 -112 L-34 -134 M40 -112 L46 -130" stroke="${blueD}" stroke-width="6" stroke-linecap="round"/>
      <rect x="-14" y="-74" width="40" height="26" rx="7" fill="${blueD}" stroke="${INK}" stroke-width="3.5"/><path d="M-6 -56 h24" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>
      <path d="M-18 -100 q8 -6 14 -2" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45" fill="none"/>
      <circle cx="30" cy="-58" r="3.2" fill="#fff" opacity=".9"/><circle cx="-24" cy="-62" r="2.6" fill="#fff" opacity=".9"/>
      ${armG(24, -98, fur, furD, { rest: -22, len: 44, w: 20, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${washArm}${drops}
      ${idle(head, 46, -110, 2)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Basile le pigeon, facteur (hauteur ≈ 215 avec casquette) ─────────────────────────
export function pigeon(talk = [], o = {}) {
  const gry = '#9db0c9', grD = '#7b8fae', chest = '#d1deee', neckC = '#3fae9a', neckV = '#8a5cc9', beak = '#ffb347', leg = '#ff8a5b', navy = '#243a7a', navyD = '#1a2b5e', bag = '#ffd23f', bagD = '#f0b400';
  const sh = shadowEl(74, [], []);
  const flap = (o.salute || []);
  const feet = [-14, 16].map((x) => `<path d="M${x} -44 V-8" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} -44 V-8" stroke="${leg}" stroke-width="4.5" stroke-linecap="round"/><path d="M${x - 10} 2 L${x + 14} 2 M${x} -8 L${x - 12} 2 M${x} -8 L${x + 14} 2" stroke="${INK}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M${x - 10} 2 L${x + 14} 2 M${x} -8 L${x - 12} 2 M${x} -8 L${x + 14} 2" stroke="${leg}" stroke-width="4" stroke-linecap="round" fill="none"/>`).join('');
  const tailF = `<g style="transform-origin:-44px -70px;animation:c6tail 1.6s ease-in-out infinite alternate"><path d="M-44 -82 L-112 -112 Q-124 -98 -104 -88 Q-128 -80 -104 -66 Q-116 -52 -92 -52 L-44 -56Z" fill="${grD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-80 -92 L-104 -88 M-80 -72 L-106 -66" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".5"/></g>`;
  const puffA = (o.puff || []).map(([a, b]) => ao({ n: 'c6puff', d: b - a, t: a, e: 'ease-in-out' }));
  const letterEl = o.letter === false ? '' : `<g transform="translate(-4 -92) rotate(-14)"><rect x="-17" y="-22" width="34" height="24" rx="3" fill="#fff4dc" stroke="${INK}" stroke-width="3.2"/><path d="M-16 -21 L0 -8 L16 -21" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="9" cy="-14" r="3" fill="#ffd23f" stroke="${INK}" stroke-width="1.6"/></g>`;
  const satchel = o.bag === false ? '' : `<path d="M-28 -150 L40 -62" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-28 -150 L40 -62" stroke="${bagD}" stroke-width="6" stroke-linecap="round"/>
    ${letterEl}<path d="M-34 -84 L-34 -52 Q-34 -42 -24 -42 L18 -42 Q28 -42 28 -52 L28 -84Z" fill="${bag}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-36 -84 L30 -84 L30 -70 Q-3 -56 -36 -70Z" fill="${bagD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="-3" cy="-65" r="4" fill="#fff4dc" stroke="${INK}" stroke-width="2.6"/>
    <path d="M-27 -58 q4 -8 12 -6" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round" fill="none"/>`;
  const saluteWing = flap.map(([a, b]) => vis(a, b, `<g><path d="M20 -110 L66 -190" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M20 -110 L66 -190" stroke="${gry}" stroke-width="18" stroke-linecap="round"/><path d="M62 -184 L70 -196" stroke="${grD}" stroke-width="8" stroke-linecap="round"/></g>`)).join('');
  const openBeak = (o.moods || []).filter(([, , m]) => m === 'oh' || m === 'panic').map(([a, b]) => vis(a, b, `<path d="M80 -166 L102 -162 L80 -150Z" fill="${beak}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="80" cy="-156" rx="6" ry="5" fill="#c4545c"/>`)).join('');
  const smile = (o.moods || []).filter(([, , m]) => m === 'happy').map(([a, b]) => vis(a, b, `<path d="M60 -150 Q68 -141 76 -150" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`)).join('');
  const lower = talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:78px -162px;${an({ n: 'talk', d: 0.14, t: a, c: Math.max(1, Math.round((b - a) / 0.14)), dir: 'alternate' })}"><path d="M78 -160 L98 -160 L80 -148Z" fill="${beak}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="82" cy="-157" rx="6" ry="3.4" fill="#c4545c"/></g>`)).join('');
  const head = `
    <circle cx="44" cy="-170" r="34" fill="${gry}" stroke="${INK}" stroke-width="4"/>
    <path d="M78 -172 L108 -164 L80 -158Z" fill="${beak}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="92" cy="-166" r="1.8" fill="${INK}"/>
    ${openBeak}${lower}${smile}
    ${eyeStates([[52, -180, 10, 2], [30, -176, 7, 2]], o.eyes || [])}
    <ellipse cx="46" cy="-156" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>${blushWin([[46, -156, 14]], o.blush || [])}
    <path d="M14 -186 Q10 -218 50 -222 Q88 -218 84 -190Z" fill="${navy}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M70 -190 Q104 -192 108 -182 Q86 -178 70 -182Z" fill="${navyD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="10" y="-196" width="78" height="14" rx="7" fill="${navyD}" stroke="${INK}" stroke-width="4"/>
    <path d="M50 -214 l4.5 9.5 10.5 1.2 -7.8 7 2.2 10.3 -9.4 -5.2 -9.4 5.2 2.2 -10.3 -7.8 -7 10.5 -1.2Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" transform="translate(0 -2) scale(.9) translate(5 -4)"/>
    <ellipse cx="28" cy="-210" rx="11" ry="5" fill="#fff" opacity=".35" transform="rotate(-24 28 -210)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${tailF}${feet}
    <g style="transform-origin:0px -60px;animation:breathe 1.1s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-96" rx="62" ry="52" fill="${gry}" stroke="${INK}" stroke-width="4"/>
      <g style="transform-origin:26px -92px;${puffA.length ? anims(puffA) : ''}"><ellipse cx="26" cy="-94" rx="36" ry="38" fill="${chest}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="14" cy="-110" rx="12" ry="6" fill="#fff" opacity=".6" transform="rotate(-30 14 -110)"/></g>
      <path d="M20 -138 Q42 -148 62 -138 Q58 -126 40 -124 Q24 -124 20 -138Z" fill="${neckC}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M30 -134 Q44 -140 56 -134" stroke="${neckV}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <ellipse cx="-26" cy="-122" rx="26" ry="8" fill="#fff" opacity=".28" transform="rotate(-20 -26 -122)"/>
      <g style="transform-origin:-4px -112px;animation:c6sway 1.8s ease-in-out infinite alternate"><path d="M-44 -108 Q-70 -76 -30 -54 Q4 -56 8 -84 Q0 -112 -44 -108Z" fill="${grD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-40 -90 q18 6 30 -4 M-34 -72 q16 6 28 -4" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none" opacity=".4"/></g>
      ${satchel}
      ${armG(26, -98, grD, gry, { rest: -24, len: 40, w: 20, handR: 12, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${saluteWing}
      ${idle(head, 44, -140, 1.5)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Zazie la zèbre, agente du passage piéton (hauteur ≈ 335 avec casquette) ─────────────────────────
export function zebra(talk = [], o = {}) {
  const wh = '#ffffff', blk = '#2a2430', vest = '#ff8a2b', vestD = '#e8631a', red = '#e8434e';
  const n = uid++;
  const sh = shadowEl(96, [], []);
  const flick = tailAnim(o.flick, 'c6flick', 0.8);
  const stripesBody = [-60, -36, -12, 12, 36, 60].map((x, i) => `<path d="M${x} -210 Q${x + 8 - i} -150 ${x - 6} -88" stroke="${blk}" stroke-width="11" stroke-linecap="round" fill="none"/>`).join('');
  const leg = (x, far) => `<clipPath id="zbL${n}_${x}"><rect x="${x - 11}" y="-112" width="22" height="108" rx="10"/></clipPath><rect x="${x - 11}" y="-112" width="22" height="108" rx="10" fill="${far ? '#eceaf0' : wh}"/>
    <g clip-path="url(#zbL${n}_${x})">${[-98, -78, -58, -38, -22].map((y) => `<rect x="${x - 14}" y="${y}" width="28" height="9" fill="${blk}"/>`).join('')}</g>
    <rect x="${x - 11}" y="-112" width="22" height="108" rx="10" fill="none" stroke="${INK}" stroke-width="4"/><path d="M${x - 11} -14 h22 v10 q0 6 -6 6 h-10 q-6 0 -6 -6Z" fill="${blk}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  const legs = [[-52, 1], [-22, 0], [26, 1], [56, 0]].map(([x, f]) => leg(x, f)).join('');
  const tail = `<g style="transform-origin:-68px -164px;${flick.length ? anims(flick) : ''}"><g style="transform-origin:-68px -164px;animation:c6tail 1.5s ease-in-out infinite alternate"><path d="M-68 -164 Q-100 -150 -96 -110" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-68 -164 Q-100 -150 -96 -110" stroke="${wh}" stroke-width="4.5" fill="none" stroke-linecap="round"/><ellipse cx="-96" cy="-100" rx="10" ry="17" fill="${blk}" stroke="${INK}" stroke-width="3.5"/></g></g>`;
  const neckP = 'M10 -190 L70 -196 L108 -262 L64 -280Z';
  const neck = `<clipPath id="zbN${n}"><path d="${neckP}"/></clipPath><path d="${neckP}" fill="${wh}"/>
    <g clip-path="url(#zbN${n})">${[0, 1, 2, 3].map((i) => `<path d="M${16 + i * 4} ${-196 + i * -24} L${86 + i * 6} ${-206 + i * -22}" stroke="${blk}" stroke-width="11" stroke-linecap="round"/>`).join('')}<path d="M24 -196 L70 -270" stroke="#fff" stroke-width="7" opacity=".0"/></g>
    <path d="${neckP}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M62 -282 L96 -266 L80 -290 L100 -270 L84 -296 L68 -286Z" fill="${blk}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  const mane = `<path d="M54 -286 L52 -304 M64 -290 L68 -308 M74 -290 L84 -306 M46 -280 L36 -294" stroke="${blk}" stroke-width="8" stroke-linecap="round"/>`;
  const head = `
    <ellipse cx="58" cy="-302" rx="12" ry="24" fill="${wh}" stroke="${INK}" stroke-width="4" transform="rotate(-24 58 -302)"/><ellipse cx="58" cy="-300" rx="5" ry="14" fill="#ffb3c0" transform="rotate(-24 58 -300)"/><path d="M52 -318 l8 6" stroke="${blk}" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="84" cy="-264" rx="42" ry="36" fill="${wh}" stroke="${INK}" stroke-width="4"/>
    <path d="M60 -290 q6 14 -2 26 M78 -296 q8 14 0 28" stroke="${blk}" stroke-width="7" stroke-linecap="round" fill="none"/>
    <ellipse cx="124" cy="-250" rx="34" ry="24" fill="#f4eee8" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="148" cy="-254" rx="13" ry="14" fill="${blk}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="144" cy="-258" rx="4" ry="2.4" fill="#fff" opacity=".7"/>
    ${eyeStates([[84, -270, 12, 2], [112, -272, 10, 2]], o.eyes || [])}
    <path d="M72 -292 Q86 -298 98 -292" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(126, -234, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="98" cy="-246" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[98, -246, 15]], o.blush || [])}
    <path d="M52 -290 Q54 -330 92 -330 Q124 -328 118 -290Z" fill="${wh}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M104 -294 Q138 -296 144 -286 Q124 -280 104 -284Z" fill="#e6e2ee" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="46" y="-302" width="80" height="14" rx="7" fill="#e6e2ee" stroke="${INK}" stroke-width="4"/>
    <circle cx="88" cy="-316" r="8" fill="${red}" stroke="${INK}" stroke-width="3"/><path d="M83 -316 h10" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>
    <ellipse cx="70" cy="-322" rx="12" ry="5" fill="#fff" opacity=".8" transform="rotate(-24 70 -322)"/>
    ${hats(o)}`;
  const upA = (o.signUp || []).map(([a, b]) => ao({ n: 'c6up', d: b - a, t: a, e: 'ease-in-out' }));
  const signEl = o.sign === false ? '' : `<g transform="translate(26 4) rotate(26)"><g style="transform-origin:0px 0px;${upA.length ? anims(upA) : ''}"><path d="M0 8 V-82" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M0 8 V-82" stroke="#d8d4e0" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-108" r="34" fill="${red}" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-108" r="26" fill="none" stroke="#fff" stroke-width="4"/><rect x="-19" y="-115" width="38" height="14" rx="4" fill="#fff"/>
    <path d="M-22 -128 q6 -8 16 -10" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6" fill="none"/></g></g>`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -110px;animation:breathe 1.5s ease-in-out infinite alternate">
      <clipPath id="zbB${n}"><path d="M-84 -140 Q-86 -208 -4 -206 Q70 -206 82 -146 Q76 -92 0 -90 Q-78 -90 -84 -140Z"/></clipPath>
      <path d="M-84 -140 Q-86 -208 -4 -206 Q70 -206 82 -146 Q76 -92 0 -90 Q-78 -90 -84 -140Z" fill="${wh}"/>
      <g clip-path="url(#zbB${n})">${stripesBody}</g>
      <path d="M-84 -140 Q-86 -208 -4 -206 Q70 -206 82 -146 Q76 -92 0 -90 Q-78 -90 -84 -140Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-62 -200 Q-30 -216 -2 -204 Q-34 -192 -62 -200Z" fill="#fff" opacity=".6"/>
      <g style="transform-origin:36px -176px;animation:c6sway 3s ease-in-out infinite alternate">
        ${neck}
        <path d="M-40 -198 Q4 -214 56 -202 L64 -126 Q0 -112 -50 -124Z" fill="${vest}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-36 -168 Q8 -158 60 -170 L61 -152 Q8 -140 -38 -150Z" fill="#fff4b0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M-46 -140 Q6 -128 62 -138 L63 -122 Q8 -112 -46 -124Z" fill="#fff4b0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M8 -204 L8 -122" stroke="${vestD}" stroke-width="4" stroke-linecap="round"/><path d="M-30 -192 q12 -6 24 -4" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5" fill="none"/>
        ${armG(38, -176, wh, blk, { rest: -26, len: 56, w: 17, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: signEl + (o.item || '') })}
        ${idle(mane + head, 70, -280, 2.2)}
      </g>
    </g>`;
  return wrapFx(inner, o);
}
