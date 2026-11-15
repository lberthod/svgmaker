// Saison 9 « Le grand concours » : nouveaux personnages (Zéphyr le guépard, Pablo le manchot, Pépin la hamster).
// Pieds au sol en (0,0), regardent à droite. Nommés d'après l'id de voix : cheetah, penguin, hamster.
// Mêmes conventions d'options que cast5.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]]
//   noShadow = true
// Options propres :
//   cheetah (hauteur ≈ 320) : bib = n | true (dossard, 7 par défaut) · speed = [[a,b]] traits de vitesse derrière lui · laces = [[a,b]] il refait ses lacets (boucle sur la basket)
//                             tail = true (défaut) · wag = [t…] coup de queue
//   penguin (hauteur ≈ 235 avec casquette) : notebook = false pour retirer le carnet · whistle = false pour retirer le sifflet · blow = [[a,b]] il siffle (sifflet au bec + ondes)
//                             waddle = [[a,b]] se dandine · slide = [[a,b]] glisse sur le ventre (revient à sa place à la fin ; o.slideX = distance en px, 160 par défaut)
//   hamster (hauteur ≈ 240 avec toque) : puff = [[a,b]] gonfle les joues (puis les dégonfle à b) · nuts = true : noisettes visibles dans les joues gonflées
//                             toque = false · spoon = false pour retirer la cuillère en bois (item la remplace)
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c9tail{from{transform:rotate(-7deg)}to{transform:rotate(9deg)}}
@keyframes c9wag{0%{transform:rotate(0)}30%{transform:rotate(-26deg)}60%{transform:rotate(12deg)}100%{transform:rotate(0)}}
@keyframes c9streak{from{transform:translateX(0);opacity:.95}to{transform:translateX(-26px);opacity:.35}}
@keyframes c9bow{0%,100%{transform:rotate(-6deg) scale(1)}50%{transform:rotate(8deg) scale(1.12)}}
@keyframes c9waddle{0%,100%{transform:rotate(-4deg) translateX(-3px)}50%{transform:rotate(4deg) translateX(3px)}}
@keyframes c9slide{0%{transform:none}22%{transform:translate(36px,-50px) rotate(86deg)}80%{transform:translate(calc(36px + var(--sx)),-50px) rotate(86deg)}100%{transform:none}}
@keyframes c9puff{0%{transform:scale(1)}16%,84%{transform:scale(1.3)}100%{transform:scale(1)}}
@keyframes c9wave{from{transform:translateX(0) scale(.7);opacity:0}30%{opacity:1}to{transform:translateX(18px) scale(1.15);opacity:0}}`);

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
const FONT = 'Fredoka, Chalkboard SE, sans-serif';

// ───────────────────────── Zéphyr le guépard (hauteur ≈ 320) ─────────────────────────
export function cheetah(talk = [], o = {}) {
  const sand = '#f3c46b', sandD = '#dfa84a', cream = '#fff0cc', red = '#e8434e', yel = '#ffd23f', blk = '#2a1c14';
  const sh = shadowEl(92, [], []);
  const dots = (pts) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${blk}"/>`).join('');
  const shoe = (x, bow) => `<path d="M${x - 12} -38 L${x + 12} -38 L${x + 12} -22 Q${x + 38} -20 ${x + 40} -7 Q${x + 40} 0 ${x + 33} 0 L${x - 14} 0 Q${x - 19} 0 ${x - 19} -6Z" fill="${red}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${x - 17} -5 H${x + 37}" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M${x - 5} -26 l9 4 M${x - 3} -33 l9 4" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="${x + 24}" cy="-16" rx="9" ry="4" fill="#fff" opacity=".4"/>${bow ? bow : ''}`;
  const lacesBow = (o.laces || []).map(([a, b]) => vis(a, b, `<g transform="translate(${14 + 6} -34)"><g style="transform-origin:0px 0px;animation:c9bow .4s ease-in-out infinite">
    <ellipse cx="-9" cy="-8" rx="9" ry="6" fill="#fff" stroke="${INK}" stroke-width="3.5" transform="rotate(-20 -9 -8)"/><ellipse cx="9" cy="-8" rx="9" ry="6" fill="#fff" stroke="${INK}" stroke-width="3.5" transform="rotate(20 9 -8)"/><circle r="4.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/></g></g>`)).join('');
  const legs = `<rect x="-36" y="-148" width="20" height="112" rx="10" fill="${sandD}" stroke="${INK}" stroke-width="4"/>${shoe(-30)}
    <rect x="6" y="-148" width="22" height="112" rx="11" fill="${sand}" stroke="${INK}" stroke-width="4"/>${dots([[16, -112, 4], [14, -84, 3.5], [17, -60, 3]])}${shoe(10, lacesBow)}`;
  const tail = `<g style="transform-origin:-48px -150px;${o.wag ? anims([].concat(o.wag).map((t) => ao({ n: 'c9wag', d: 0.8, t }))) : ''}"><g style="transform-origin:-48px -150px;animation:c9tail 1.3s ease-in-out infinite alternate">
    <path d="M-46 -146 Q-118 -150 -126 -214 Q-128 -258 -98 -268" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M-46 -146 Q-118 -150 -126 -214 Q-128 -258 -98 -268" stroke="${sand}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M-60 -146 Q-118 -156 -126 -214 Q-128 -258 -98 -268" stroke="${blk}" stroke-width="13" fill="none" stroke-dasharray="5 26" stroke-dashoffset="-6"/>
    <path d="M-110 -248 Q-102 -266 -92 -268" stroke="${blk}" stroke-width="13" fill="none" stroke-linecap="round"/></g></g>`;
  const bib = o.bib ? `<g transform="translate(10 -182) rotate(-4)"><rect x="-27" y="-30" width="54" height="60" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-20" cy="-23" r="3" fill="#bbb"/><circle cx="20" cy="-23" r="3" fill="#bbb"/><circle cx="-20" cy="23" r="3" fill="#bbb"/><circle cx="20" cy="23" r="3" fill="#bbb"/>
    <text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="46" fill="${red}">${o.bib === true ? 7 : o.bib}</text></g>` : '';
  const speed = (o.speed || []).map(([a, b]) => vis(a, b, `<g style="animation:c9streak .22s linear infinite alternate">${[[-140, -90, 70], [-170, -150, 90], [-130, -210, 60], [-160, -30, 60]].map(([x, y, l]) => `<path d="M${x} ${y} h${l}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M${x} ${y} h${l}" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".35" transform="translate(0 7)"/>`).join('')}</g>`)).join('');
  const head = `
    <circle cx="0" cy="-302" r="14" fill="${sand}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-302" r="6.5" fill="${blk}"/>
    <circle cx="46" cy="-304" r="14" fill="${sand}" stroke="${INK}" stroke-width="4"/><circle cx="46" cy="-304" r="6.5" fill="${blk}"/>
    <ellipse cx="22" cy="-272" rx="43" ry="38" fill="${sand}" stroke="${INK}" stroke-width="4"/>
    ${dots([[-2, -254, 3], [2, -240, 2.6]])}
    <ellipse cx="54" cy="-254" rx="25" ry="19" fill="${cream}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="76" cy="-260" rx="8" ry="6" fill="${blk}"/><ellipse cx="74" cy="-262" rx="2.6" ry="1.8" fill="#fff" opacity=".8"/>
    ${eyeStates([[22, -266, 12, 2], [51, -268, 10, 2]], o.eyes || [])}
    <path d="M24 -253 Q26 -242 38 -236 M53 -257 Q57 -248 64 -246" stroke="${blk}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(56, -243, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="8" cy="-246" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>${blushWin([[8, -246, 14]], o.blush || [])}
    <path d="M-19 -283 Q22 -325 64 -283 L62 -269 Q22 -311 -17 -269Z" fill="${yel}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-15 -276 L-34 -266 L-30 -286Z M-15 -274 L-30 -254 L-36 -272Z" fill="${yel}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <ellipse cx="14" cy="-300" rx="12" ry="3.5" fill="#fff" opacity=".5" transform="rotate(-14 14 -300)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${o.tail === false ? '' : tail}${legs}${speed}
    <g style="transform-origin:0px -150px;animation:breathe 1.2s ease-in-out infinite alternate">
      <ellipse cx="-4" cy="-182" rx="50" ry="58" fill="${sand}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="12" cy="-170" rx="30" ry="42" fill="${cream}"/>
      ${dots([[-36, -204, 4.5], [-28, -176, 4], [-38, -150, 4.2], [-16, -222, 4], [-22, -140, 3.4], [30, -214, 3.6]])}
      <path d="M-54 -146 Q-4 -126 46 -146 L44 -122 Q-4 -104 -52 -122Z" fill="${red}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="-30" cy="-212" rx="22" ry="7" fill="#fff" opacity=".35" transform="rotate(-24 -30 -212)"/>
      ${bib}
      ${armG(18, -214, sand, cream, { rest: -22, len: 52, w: 17, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${idle(head, 22, -240, 1.9)}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Pablo le manchot arbitre (hauteur ≈ 235 avec casquette) ─────────────────────────
export function penguin(talk = [], o = {}) {
  const navy = '#2f3556', white = '#ffffff', org = '#ff9f2b', orgD = '#e5811a', blue = '#3b82f6', blueD = '#2563c9', gold = '#ffcf3f', red = '#e8434e';
  const sh = shadowEl(84, [], []);
  const feet = [-28, 20].map((x) => `<path d="M${x - 24} -4 Q${x - 26} -16 ${x - 12} -18 L${x + 20} -18 Q${x + 34} -14 ${x + 32} -4 Q${x + 30} 4 ${x + 20} 2 L${x - 14} 2 Q${x - 22} 2 ${x - 24} -4Z" fill="${org}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M${x + 12} -12 v10 M${x + 21} -12 v10" stroke="${orgD}" stroke-width="3" stroke-linecap="round"/>`).join('');
  const notebook = o.notebook === false ? '' : `<g transform="translate(10 -6) rotate(14)"><rect x="-15" y="-34" width="30" height="38" rx="4" fill="${red}" stroke="${INK}" stroke-width="3.5"/><rect x="-10" y="-28" width="20" height="26" rx="2" fill="#fff"/><path d="M-6 -22 h12 M-6 -14 h12 M-6 -6 h8" stroke="${blue}" stroke-width="2.4" stroke-linecap="round"/></g>`;
  const whistle = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-4" y="-7" width="26" height="12" rx="4" fill="${gold}" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="2" r="12" fill="${gold}" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="2" r="3.6" fill="${INK}"/><ellipse cx="-11" cy="-4" rx="4" ry="2.4" fill="#fff" opacity=".7"/></g>`;
  const chest = o.whistle === false ? '' : `<path d="M-14 -138 Q20 -102 40 -138" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M6 -112 L10 -104" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>${whistle(12, -98)}`;
  const blow = (o.blow || []).map(([a, b]) => vis(a, b, `${whistle(100, -150, 0)}${[0, 1, 2].map((i) => `<path d="M${136 + i * 14} -172 Q${148 + i * 14} -158 ${136 + i * 14} -144" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" style="animation:c9wave .5s ${i * 0.12}s infinite"/>`).join('')}`)).join('');
  const head = `
    <ellipse cx="14" cy="-164" rx="48" ry="44" fill="${navy}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="32" cy="-160" rx="32" ry="30" fill="${white}"/>
    <path d="M62 -168 Q98 -170 102 -158 Q98 -146 62 -148Z" fill="${org}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M64 -158 H96" stroke="${orgD}" stroke-width="3" stroke-linecap="round"/>
    ${eyeStates([[26, -172, 11, 2], [54, -172, 9, 2]], o.eyes || [])}
    ${mouthStates(48, -142, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="18" cy="-146" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>${blushWin([[18, -146, 14]], o.blush || [])}
    <path d="M-26 -190 Q-24 -244 18 -246 Q60 -244 62 -190Z" fill="${blue}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="-30" y="-198" width="96" height="14" rx="7" fill="${blueD}" stroke="${INK}" stroke-width="4"/>
    <path d="M44 -196 Q96 -198 110 -184 Q82 -178 44 -184Z" fill="${blueD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="18" cy="-222" r="14" fill="#fff" stroke="${INK}" stroke-width="3.5"/><path d="M18 -232 l3.4 7 7.6 1 -5.6 5.2 1.6 7.6 -7 -3.8 -7 3.8 1.6 -7.6 -5.6 -5.2 7.6 -1Z" fill="${gold}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <ellipse cx="-6" cy="-226" rx="12" ry="5" fill="#fff" opacity=".4" transform="rotate(-40 -6 -226)"/>
    ${blow}${hats(o)}`;
  const slides = (o.slide || []).map(([a, b]) => ao({ n: 'c9slide', d: b - a, t: a, e: 'ease-in-out' }));
  const wad = (o.waddle || []).map(([a, b]) => ao({ n: 'c9waddle', d: 0.5, t: a, c: Math.max(1, Math.round((b - a) / 0.5)), dir: 'alternate' }));
  const body = `${feet}
    <g style="transform-origin:0px -90px;animation:breathe 1.4s ease-in-out infinite alternate">
      <path d="M-56 -96 Q-92 -80 -88 -50 Q-72 -62 -52 -70Z" fill="${navy}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-86" rx="64" ry="78" fill="${navy}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="12" cy="-80" rx="44" ry="60" fill="${white}"/>
      <ellipse cx="-30" cy="-128" rx="18" ry="7" fill="#fff" opacity=".22" transform="rotate(-26 -30 -128)"/>
      ${chest}
      ${armG(40, -116, navy, navy, { rest: -22, len: 44, w: 20, handR: 11, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || notebook })}
      ${idle(head, 20, -130, 2)}
    </g>`;
  const wrapped = `<g style="--sx:${o.slideX ?? 160}px;transform-origin:0px 0px;${anims([...wad, ...slides])}">${body}</g>`;
  return wrapFx(`${o.noShadow ? '' : sh}${slides.length || wad.length ? wrapped : body}`, o);
}

// ───────────────────────── Pépin la hamster pâtissière (hauteur ≈ 240 avec toque) ─────────────────────────
export function hamster(talk = [], o = {}) {
  const roux = '#e9a05a', rouxL = '#f6c487', cream = '#ffe9c8', pink = '#ff9fbd', wood = '#c98a4e', white = '#ffffff', nut = '#b9763a';
  const n = uid++;
  const sh = shadowEl(66, [], []);
  const legs = [-22, 14].map((x) => `<rect x="${x}" y="-30" width="22" height="28" rx="10" fill="${roux}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 14}" cy="-4" rx="19" ry="8" fill="${cream}" stroke="${INK}" stroke-width="4"/>`).join('');
  const spoon = o.spoon === false ? '' : `<g transform="rotate(42)"><rect x="-4.5" y="-62" width="9" height="68" rx="4.5" fill="${wood}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="0" cy="-68" rx="12" ry="16" fill="${wood}" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-4" cy="-73" rx="4" ry="6" fill="#fff" opacity=".4"/></g>`;
  const apronPath = 'M-10 -92 Q18 -98 44 -90 L54 -24 Q18 -14 -16 -24Z';
  const apron = `<clipPath id="hpa${n}"><path d="${apronPath}"/></clipPath><path d="${apronPath}" fill="${pink}"/>
    <g clip-path="url(#hpa${n})">${Array.from({ length: 5 }, (_, i) => Array.from({ length: 6 }, (__, j) => ((i + j) % 2 ? '' : `<rect x="${-20 + i * 14}" y="${-96 + j * 14}" width="14" height="14" fill="#fff" opacity=".55"/>`)).join('')).join('')}</g>
    <path d="${apronPath}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M0 -92 Q18 -100 36 -92" stroke="${INK}" stroke-width="3.5" fill="none"/>`;
  const cheek = (cx, cy, r, i) => {
    const wins = o.puff || [];
    const bigNuts = o.nuts ? wins.map(([a, b]) => vis(a + 0.25, b - 0.2, `<ellipse cx="${cx - 4}" cy="${cy - 4}" rx="7" ry="9" fill="${nut}" stroke="${INK}" stroke-width="2.5" transform="rotate(${i ? 20 : -20} ${cx} ${cy})"/><ellipse cx="${cx - 7}" cy="${cy - 9}" rx="2" ry="3" fill="#fff" opacity=".6"/>`)).join('') : '';
    return `<g style="transform-origin:${cx}px ${cy}px;${anims(wins.map(([a, b]) => ao({ n: 'c9puff', d: b - a, t: a, e: 'ease-in-out' })))}"><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.92}" fill="${rouxL}" stroke="${INK}" stroke-width="4"/><ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.4}" rx="${r * 0.3}" ry="${r * 0.16}" fill="#fff" opacity=".4" transform="rotate(-30 ${cx - r * 0.3} ${cy - r * 0.4})"/>${bigNuts}</g>`;
  };
  const toque = o.toque === false ? '' : `<g transform="rotate(-8 20 -170)"><circle cx="-8" cy="-200" r="24" fill="${white}" stroke="${INK}" stroke-width="4"/><circle cx="48" cy="-200" r="24" fill="${white}" stroke="${INK}" stroke-width="4"/><circle cx="20" cy="-214" r="29" fill="${white}" stroke="${INK}" stroke-width="4"/>
    <rect x="-30" y="-196" width="100" height="36" rx="10" fill="${white}" stroke="${INK}" stroke-width="4"/><path d="M-6 -192 V-166 M20 -192 V-166 M46 -192 V-166" stroke="#d9dfef" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="6" cy="-228" rx="12" ry="5" fill="#dfe6f7" opacity=".9" transform="rotate(-30 6 -228)"/></g>`;
  const head = `
    <circle cx="-14" cy="-156" r="15" fill="${roux}" stroke="${INK}" stroke-width="4"/><circle cx="-14" cy="-156" r="7" fill="${pink}"/>
    <circle cx="44" cy="-160" r="15" fill="${roux}" stroke="${INK}" stroke-width="4"/><circle cx="44" cy="-160" r="7" fill="${pink}"/>
    <ellipse cx="14" cy="-122" rx="58" ry="44" fill="${roux}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="38" cy="-110" rx="30" ry="24" fill="${cream}"/>
    ${cheek(-26, -102, 26, 0)}${cheek(62, -100, 28, 1)}
    <ellipse cx="78" cy="-116" rx="9" ry="7" fill="#ff7f9f" stroke="${INK}" stroke-width="3"/><ellipse cx="76" cy="-119" rx="2.6" ry="1.8" fill="#fff" opacity=".8"/>
    ${eyeStates([[20, -130, 11, 2], [50, -130, 9, 2]], o.eyes || [])}
    <path d="M10 -150 Q22 -156 32 -150 M44 -148 Q52 -152 60 -146" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>
    ${mouthStates(58, -102, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="36" cy="-106" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>${blushWin([[36, -106, 14]], o.blush || [])}
    ${toque}${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${legs}
    <g style="transform-origin:0px -40px;animation:breathe 1.1s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-62" rx="52" ry="48" fill="${roux}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="14" cy="-56" rx="36" ry="38" fill="${cream}"/>
      ${apron}
      <ellipse cx="-26" cy="-86" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-24 -26 -86)"/>
      ${armG(34, -78, roux, cream, { rest: -50, len: 36, w: 18, handR: 11, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || spoon })}
      ${idle(head, 14, -100, 2.1)}
    </g>`;
  return wrapFx(inner, o);
}
