// Saison 4 : nouveaux personnages (Mamie Marmotte, Bouquet le bouquetin, Flocon le lynx).
// Pieds au sol en (0,0), regardent à droite. Mêmes conventions d'options que cast2.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|'shut'|'up'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm'|'yawn'|'yawnbig']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]] (coords de la tête)
//   noShadow = true
// Spécifiques : marmot  -> sleep=[[a,b]] (dort : yeux clos, tête qui penche, zzz), lids=false (yeux grands ouverts en permanence)
//               ibex    -> wobble=[[a,b]] (bras qui moulinent, corps qui tangue : glace)
//               lynx    -> draw=[[a,b]] (le bras dessine avec un crayon), noBook=true (sans carnet)
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c4tail{from{transform:rotate(-5deg)}to{transform:rotate(6deg)}}
@keyframes c4scarf{from{transform:rotate(-7deg) skewX(-3deg)}to{transform:rotate(9deg) skewX(3deg)}}
@keyframes c4wob{0%{transform:rotate(-9deg)}50%{transform:rotate(9deg)}100%{transform:rotate(-9deg)}}
@keyframes c4arms{from{transform:rotate(-125deg)}to{transform:rotate(-40deg)}}
@keyframes c4nod{0%{transform:rotate(0)}18%,86%{transform:rotate(16deg) translate(0,6px)}100%{transform:rotate(0)}}
@keyframes c4zzz{0%{opacity:0;transform:translate(0,0) scale(.6)}25%{opacity:1}100%{opacity:0;transform:translate(26px,-64px) scale(1.2)}}
@keyframes c4draw{0%{transform:rotate(-58deg)}50%{transform:rotate(-30deg)}100%{transform:rotate(-58deg)}}`);

const except = (wins, inner) => {
  const s = [...wins].sort((a, b) => a[0] - b[0]);
  let out = '', t = 0;
  for (const [a, b] of s) { if (a > t) out += vis(t, a, inner); t = Math.max(t, b); }
  return out + vis(t, 999, inner);
};
const blushWin = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
const armG = (sx, sy, fill, hand, { rest = -25, len = 46, w = 18, gest = [], point = [], wave = [], draw = [], extra = [], item = '' } = {}) => {
  const L = [...gest.map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...point.map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...wave.map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a })),
    ...draw.map(([a, b]) => ao({ n: 'c4draw', d: 0.35, t: a, c: Math.max(1, Math.round((b - a) / 0.35)), e: 'ease-in-out' })), ...extra];
  return `<g style="--r:${rest}deg;transform-origin:${sx}px ${sy}px;transform:rotate(${rest}deg);${anims(L)}"><rect x="${sx - w / 2}" y="${sy - 4}" width="${w}" height="${len + 4}" rx="${w / 2}" fill="${fill}" stroke="${INK}" stroke-width="4"/><circle cx="${sx}" cy="${sy + len}" r="${w / 2 + 2}" fill="${hand}" stroke="${INK}" stroke-width="4"/>${item ? `<g transform="translate(${sx} ${sy + len})">${item}</g>` : ''}</g>`;
};
const wrapFx = (inner, o) => {
  if (o.jolt !== undefined && o.jolt !== 0) inner = `<g style="animation:${[].concat(o.jolt).map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',')}">${inner}</g>`;
  if (o.shiver) inner = `<g style="--s:3px;${an({ n: 'shake', d: 0.045, t: o.shiver[0], c: Math.round((o.shiver[1] - o.shiver[0]) / 0.045), dir: 'alternate' })}">${inner}</g>`;
  return inner;
};
const idle = (inner, ox, oy, d = 1.7) => `<g style="transform-origin:${ox}px ${oy}px;animation:idlehead ${d}s ease-in-out infinite alternate">${inner}</g>`;
const hatOf = (o) => (o.hat || []).map(([a, b, h]) => vis(a, b, h)).join('');
const zzz = (x, y, wins) => wins.map(([a, b]) => vis(a, b, [0, 1, 2].map((i) => `<g transform="translate(${x + i * 6} ${y - i * 10})"><g style="${an({ n: 'c4zzz', d: 1.8, t: i * 0.6, c: 999 })}"><text style="font-size:${34 - i * 4}px;fill:#fff;stroke:${INK};stroke-width:5px;paint-order:stroke;font-weight:900">z</text></g></g>`).join(''))).join('');

// ───────────────────────── Mamie Marmotte ─────────────────────────
export function marmot(talk = [], o = {}) {
  const fur = '#c28a52', furD = '#a46f3e', cream = '#f8e6c3', red = '#e8434e', slip = '#ff9fbf';
  const sleep = o.sleep || [];
  const segs = [...(o.eyes || []), ...sleep.map(([a, b]) => [a, b, 'shut'])];
  const eyeL = [[26, -156, 11, 2], [62, -158, 10, 2]];
  // paupières lourdes : demi-disque de fourrure sur le haut de l'œil, sauf quand un état d'yeux explicite est actif
  const lid = ([x, y, r]) => `<path d="M${x - r - 2} ${y + 2} A${r + 2} ${r * 1.35} 0 0 1 ${x + r + 2} ${y + 2}Z" fill="${fur}"/><path d="M${x - r - 2} ${y + 2} H${x + r + 2}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  const lids = o.lids === false ? '' : except(segs.map(([a, b]) => [a, b]), eyeL.map(lid).join(''));
  const sh = shadowEl(78, [], []);
  const head = `
    <ellipse cx="-4" cy="-182" rx="15" ry="14" fill="${fur}" stroke="${INK}" stroke-width="4"/><circle cx="-4" cy="-182" r="7" fill="#e9a98c"/>
    <circle cx="40" cy="-150" r="54" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="22" cy="-176" rx="26" ry="9" fill="#fff" opacity=".25" transform="rotate(-14 22 -176)"/>
    <ellipse cx="84" cy="-136" rx="30" ry="24" fill="${cream}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="108" cy="-146" rx="9" ry="7" fill="${INK}"/><ellipse cx="106" cy="-148" rx="3" ry="2" fill="#fff" opacity=".8"/>
    <rect x="86" y="-120" width="7" height="9" rx="2" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
    ${eyeStates(eyeL, segs)}${lids}
    <path d="M12 -176 Q24 -182 38 -176 M52 -178 Q62 -182 74 -176" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${mouthStates(84, -126, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="58" cy="-134" rx="12" ry="7.5" fill="#ff8fa3" opacity=".7"/>${blushWin([[58, -134, 16]], o.blush || [])}
    <g style="transform-origin:-4px -196px;animation:c4tail 2.4s ease-in-out infinite alternate">
      <path d="M0 -204 Q-62 -222 -78 -170 Q-86 -142 -66 -122" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/>
      <path d="M0 -204 Q-62 -222 -78 -170 Q-86 -142 -66 -122" stroke="${red}" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M-30 -208 Q-70 -206 -80 -168 Q-84 -146 -70 -128" stroke="#fff" stroke-width="20" fill="none" stroke-dasharray="11 25" stroke-dashoffset="-6"/>
      <circle cx="-64" cy="-114" r="15" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="-69" cy="-119" rx="5" ry="3.5" fill="#fff" stroke="#ddd" stroke-width="1.5"/>
    </g>
    <path d="M-12 -170 Q-8 -230 44 -232 Q98 -228 96 -172 Q44 -192 -12 -170Z" fill="${red}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-10 -186 Q44 -210 94 -186 L95 -176 Q44 -198 -10 -176Z" fill="#fff"/>
    <path d="M-12 -170 Q44 -192 96 -172" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M14 -214 Q24 -224 38 -224" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5" fill="none"/>
    ${hatOf(o)}`;
  const sleepHead = (() => {
    // la tête penche pendant le sommeil : on dessine la tête normale hors fenêtres, et une version penchée dedans
    const wins = sleep.map(([a, b]) => [a, b]);
    if (!wins.length) return idle(head, 40, -120, 2.4);
    const nodded = wins.map(([a, b]) => vis(a, b, `<g style="transform-origin:30px -110px;${an({ n: 'c4nod', d: b - a, t: a, e: 'ease-in-out' })}">${head}</g>`)).join('');
    return except(wins, idle(head, 40, -120, 2.4)) + nodded;
  })();
  const inner = `${o.noShadow ? '' : sh}
    <ellipse cx="-24" cy="-8" rx="26" ry="14" fill="${slip}" stroke="${INK}" stroke-width="4"/><ellipse cx="34" cy="-8" rx="26" ry="14" fill="${slip}" stroke="${INK}" stroke-width="4"/>
    <circle cx="-34" cy="-14" r="6" fill="#fff" opacity=".7"/><circle cx="24" cy="-14" r="6" fill="#fff" opacity=".7"/>
    <ellipse cx="-58" cy="-52" rx="20" ry="18" fill="${furD}" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -50px;animation:breathe 2s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-76" rx="70" ry="66" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="14" cy="-66" rx="46" ry="46" fill="${cream}"/>
      <path d="M-30 -84 q12 -10 24 0 M-20 -58 q12 -10 24 0 M8 -92 q12 -10 24 0" stroke="#e6cf9f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="-34" cy="-104" rx="20" ry="9" fill="#fff" opacity=".28" transform="rotate(-30 -34 -104)"/>
      ${armG(34, -96, fur, cream, { rest: -26, len: 44, w: 20, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${sleepHead}
    </g>
    ${zzz(60, -230, sleep)}`;
  return wrapFx(inner, o);
}

// ───────────────────────── Bouquet le bouquetin ─────────────────────────
export function ibex(talk = [], o = {}) {
  const fur = '#c9b08c', furD = '#a58f6d', cream = '#f3e8d2', hoof = '#7a4a2a', green = '#3fae55', greenD = '#2e8c43', orange = '#ff9f43', horn = '#e6cf94';
  const wob = o.wobble || [];
  const eyeL = [[42, -204, 11, 2], [70, -206, 9, 2]];
  const sh = shadowEl(76, [], []);
  const rings = (pts) => pts.map(([x, y, a]) => `<path d="M${x - 9} ${y} h18" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`).join('');
  const hornP = (d, w) => `<path d="${d}" stroke="${INK}" stroke-width="${w + 8}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${horn}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const head = `
    ${hornP('M42 -236 Q30 -296 -2 -292 Q-18 -288 -24 -274', 12)}
    ${hornP('M16 -232 Q-26 -296 -62 -262 Q-76 -242 -64 -224', 17)}${rings([[-2, -256, 60], [-22, -272, 28], [-44, -274, -12], [-62, -262, -48], [-70, -244, -80]])}
    <ellipse cx="2" cy="-206" rx="22" ry="10" fill="${furD}" stroke="${INK}" stroke-width="4" transform="rotate(-24 2 -206)"/><ellipse cx="2" cy="-206" rx="12" ry="5" fill="#f2b6a0" transform="rotate(-24 2 -206)"/>
    <circle cx="48" cy="-196" r="42" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="88" cy="-184" rx="28" ry="20" fill="${cream}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="110" cy="-192" rx="8" ry="6.5" fill="${INK}"/><ellipse cx="108" cy="-194" rx="2.6" ry="1.8" fill="#fff" opacity=".8"/>
    <path d="M74 -164 Q82 -140 100 -146 Q94 -160 100 -170Z" fill="${furD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    ${eyeStates(eyeL, o.eyes || [])}
    <path d="M34 -218 Q46 -224 58 -218 M64 -220 Q74 -223 82 -218" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${mouthStates(86, -178, talk, o.moods || [], o.mood || 'happy')}
    <ellipse cx="64" cy="-184" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[64, -184, 15]], o.blush || [])}
    <path d="M8 -226 Q14 -278 52 -280 Q92 -278 90 -226Z" fill="${orange}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M10 -232 Q50 -250 90 -232 L92 -218 Q50 -236 8 -218Z" fill="#ffd9a8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M26 -250 Q36 -272 52 -272" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>
    <circle cx="50" cy="-286" r="11" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
    <path d="M10 -238 Q50 -256 90 -238" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="26" y="-246" width="48" height="20" rx="10" fill="#7cc8ff" stroke="${INK}" stroke-width="4"/><rect x="31" y="-242" width="38" height="12" rx="6" fill="#bfe6ff"/><path d="M36 -240 h14" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
    ${hatOf(o)}`;
  const arms = (inner) => (wob.length ? wob.map(([a, b]) => vis(a, b, inner('wob', [ao({ n: 'c4arms', d: 0.3, t: a, c: Math.max(1, Math.round((b - a) / 0.3)), dir: 'alternate', e: 'ease-in-out' })]))).join('') + except(wob, inner('', [])) : inner('', []));
  const armFront = arms((k, ex) => armG(32, -134, fur, cream, { rest: -26, len: 54, w: 20, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], extra: ex, item: o.item || '' }));
  const body = `
    <g style="transform-origin:-30px -150px;animation:c4scarf 1.1s ease-in-out infinite alternate">
      <path d="M-10 -164 Q-56 -150 -70 -112 L-48 -102 Q-40 -132 -4 -146Z" fill="${green}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-62 -128 l22 -10 M-56 -112 l18 -8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    </g>
    <rect x="-36" y="-70" width="26" height="62" rx="12" fill="${furD}" stroke="${INK}" stroke-width="4"/><ellipse cx="-20" cy="-8" rx="22" ry="10" fill="${hoof}" stroke="${INK}" stroke-width="4"/>
    <rect x="10" y="-70" width="26" height="62" rx="12" fill="${fur}" stroke="${INK}" stroke-width="4"/><ellipse cx="28" cy="-8" rx="22" ry="10" fill="${hoof}" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0px -70px;animation:breathe 1.2s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-112" rx="58" ry="62" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="14" cy="-104" rx="38" ry="44" fill="${cream}"/>
      <ellipse cx="-26" cy="-134" rx="16" ry="26" fill="#fff" opacity=".22" transform="rotate(14 -26 -134)"/>
      <path d="M-42 -160 Q16 -138 62 -164 L66 -150 Q16 -122 -44 -146Z" fill="${green}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-22 -150 l4 -18 M2 -144 l4 -20 M28 -146 l2 -20" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      ${armFront}
      ${idle(head, 46, -170, 1.5)}
    </g>`;
  const inner = `${o.noShadow ? '' : sh}${wob.length ? wob.map(([a, b]) => vis(a, b, `<g style="transform-origin:0px 0px;${an({ n: 'c4wob', d: 0.5, t: a, c: Math.max(1, Math.round((b - a) / 0.5)), e: 'ease-in-out' })}">${body}</g>`)).join('') + except(wob, body) : body}`;
  return wrapFx(inner, o);
}

// ───────────────────────── Flocon le lynx des neiges ─────────────────────────
export function lynx(talk = [], o = {}) {
  const fur = '#eef0f6', shade = '#d4d8e6', spot = '#8f94ad', violet = '#a07be0', violetD = '#8561c9', yel = '#ffd23f', pink = '#ffb3c6';
  const draw = o.draw || [];
  const eyeL = [[22, -112, 13, 2], [58, -114, 11, 2]];
  const sh = shadowEl(58, [], []);
  const pencil = `<g transform="rotate(30)"><rect x="-4" y="-6" width="40" height="11" rx="3" fill="#ff6f61" stroke="${INK}" stroke-width="3"/><path d="M-4 -6 L-18 0 L-4 5Z" fill="#f3d2a2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`;
  const item = draw.length ? draw.map(([a, b]) => vis(a, b, pencil)).join('') + (o.item || '') : (o.item || '');
  const head = `
    <polygon points="-2,-146 -20,-196 28,-160" fill="${fur}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="-6,-158 -18,-196 6,-170" fill="${spot}" opacity=".9"/>
    <polygon points="34,-160 70,-200 76,-148" fill="${fur}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><polygon points="46,-160 70,-194 68,-156" fill="${pink}"/>
    <path d="M-22 -204 L-14 -184 M-26 -196 L-12 -190 M72 -208 L72 -190 M80 -202 L68 -192" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M-14 -124 L-34 -112 L-20 -104 L-34 -92 L-12 -90 L0 -78 L78 -78 L96 -92 L82 -100 L100 -110 L82 -120 Z" fill="${shade}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="40" cy="-114" r="46" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <path d="M30 -158 v12 M42 -160 v14 M54 -158 v12" stroke="${spot}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="-2" cy="-122" r="3.5" fill="${spot}"/><circle cx="84" cy="-122" r="3.5" fill="${spot}"/><circle cx="2" cy="-106" r="3" fill="${spot}"/>
    <ellipse cx="70" cy="-98" rx="22" ry="16" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
    <path d="M62 -108 h16 l-8 9z" fill="#ff8fa3" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    ${eyeStates(eyeL, o.eyes || [])}
    <path d="M10 -134 Q22 -140 34 -134 M50 -138 Q60 -141 70 -136" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${mouthStates(70, -90, talk, o.moods || [], o.mood || 'shy')}
    <ellipse cx="40" cy="-96" rx="10" ry="6.5" fill="#ff8fa3" opacity=".7"/>${blushWin([[40, -96, 14]], o.blush || [])}
    ${hatOf(o)}`;
  const inner = `${o.noShadow ? '' : sh}
    <ellipse cx="-50" cy="-34" rx="14" ry="12" fill="${fur}" stroke="${INK}" stroke-width="4"/><ellipse cx="-58" cy="-34" rx="6" ry="9" fill="#555a74"/>
    <ellipse cx="-14" cy="-10" rx="28" ry="15" fill="${fur}" stroke="${INK}" stroke-width="4"/><ellipse cx="38" cy="-10" rx="30" ry="16" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <path d="M-24 -10 v8 M-12 -10 v8 M32 -10 v8 M44 -10 v8" stroke="${shade}" stroke-width="3.5" stroke-linecap="round"/>
    <g style="transform-origin:0px -40px;animation:breathe 1.1s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-52" rx="48" ry="46" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="10" cy="-44" rx="30" ry="30" fill="#fff"/>
      <ellipse cx="-28" cy="-62" rx="7" ry="5" fill="${spot}"/><ellipse cx="-16" cy="-34" rx="5" ry="4" fill="${spot}"/><ellipse cx="-34" cy="-44" rx="4" ry="3" fill="${spot}"/>
      <ellipse cx="-24" cy="-76" rx="16" ry="7" fill="#fff" opacity=".5" transform="rotate(-24 -24 -76)"/>
      ${o.noBook ? '' : `<g transform="translate(14 -50) rotate(-8)"><rect x="-17" y="-22" width="34" height="44" rx="5" fill="${yel}" stroke="${INK}" stroke-width="4"/><path d="M-17 -12 h-7 M-17 0 h-7 M-17 12 h-7" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M-6 -12 q6 -6 10 0 M-6 4 h14" stroke="#e8a838" stroke-width="3" fill="none" stroke-linecap="round"/></g>`}
      ${armG(30, -64, fur, violet, { rest: -22, len: 34, w: 18, gest: o.gest ?? [], point: o.point || [], wave: o.wave || [], draw, item })}
      ${idle(head, 40, -90, 2)}
    </g>`;
  return wrapFx(inner, o);
}
