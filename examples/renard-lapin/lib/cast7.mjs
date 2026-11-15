// Saison 7 « Cap sur la lune » : nouveaux personnages (Doc Koala, Suri la suricate, Lulu la lunaire).
// Pieds au sol en (0,0), regardent à droite. Nommés d'après l'id de voix : koala, meerkat, moonling.
// Mêmes conventions d'options que cast5.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm'|'yawn'|'yawnbig']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]]
//   noShadow = true
// Options propres :
//   koala    : sleep = [[a,b]] (yeux fermés, tête qui tombe, petits Z) · yawn = [[a,b]] (grand bâillement)
//              cling = [[a,b]] (s'accroche à un objet : les deux bras montent, comme à un tronc ; poser l'objet à ~ (95,-175)) · bino = [[a,b]] (jumelles aux yeux)
//   meerkat  : tiptoe = [[a,b]] (se dresse sur la pointe des pattes) · visor = [[a,b]] (main en visière) · goggles = [[a,b]] (lunettes baissées sur les yeux)
//   moonling : glow = [[a,b]] (halo qui s'allume, content) · flicker = [[a,b]] (halo qui vacille, hésite) · noFloat = true (immobile)
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c7cling{0%{transform:rotate(var(--r))}14%,86%{transform:rotate(-118deg)}100%{transform:rotate(var(--r))}}
@keyframes c7visor{0%{transform:rotate(var(--r))}16%,84%{transform:rotate(-150deg)}100%{transform:rotate(var(--r))}}
@keyframes c7toe{0%{transform:translateY(0)}14%,86%{transform:translateY(-20px)}100%{transform:translateY(0)}}
@keyframes c7nod{0%{transform:rotate(0)}18%{transform:rotate(14deg)}30%{transform:rotate(7deg)}85%{transform:rotate(12deg)}100%{transform:rotate(0)}}
@keyframes c7zz{0%{opacity:0;transform:translate(0,0) scale(.5)}25%{opacity:1}100%{opacity:0;transform:translate(34px,-60px) scale(1.15)}}
@keyframes c7float{from{transform:translateY(2px)}to{transform:translateY(-8px)}}
@keyframes c7halo{from{opacity:.55;transform:scale(.94)}to{opacity:1;transform:scale(1.06)}}
@keyframes c7flick{0%{opacity:0}10%{opacity:.9}22%{opacity:.15}36%{opacity:.8}50%{opacity:.1}66%{opacity:.7}80%{opacity:.2}100%{opacity:0}}
@keyframes c7tail{from{transform:rotate(-7deg)}to{transform:rotate(9deg)}}
@keyframes c7ant{from{transform:rotate(-5deg)}to{transform:rotate(6deg)}}`);

const blushWin = (pts, wins = []) => wins.map(([a, b]) => vis(a, b, `<g style="${an({ n: 'blushk', d: b - a, t: a, f: 'both' })}">${pts.map(([x, y, rx]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.62}" fill="#ff5c7a" opacity=".75"/>`).join('')}</g>`)).join('');
// bras : cling/visor = fenêtres d'animations propres à ce personnage
const armG = (sx, sy, fill, hand, { rest = -25, len = 46, w = 18, gest = [], point = [], wave = [], cling = [], visor = [], item = '', handR } = {}) => {
  const L = [...gest.map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...point.map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...wave.map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a })),
    ...cling.map(([a, b]) => ao({ n: 'c7cling', d: b - a, t: a, e: 'ease-in-out' })), ...visor.map(([a, b]) => ao({ n: 'c7visor', d: b - a, t: a, e: 'ease-in-out' }))];
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
const win = (list, name, d0 = 0) => (list || []).map(([a, b]) => ao({ n: name, d: b - a - d0, t: a, e: 'ease-in-out' }));
const zz = (x, y, wins) => wins.map(([a, b]) => { const n = Math.max(1, Math.floor((b - a) / 1.3)); return vis(a, b, [0, 1, 2].map((i) => `<g transform="translate(${x + i * 14} ${y - i * 22})"><g style="${an({ n: 'c7zz', d: 1.6, t: i * 0.5, c: 99 })}"><path d="M-9 -9 H9 L-9 9 H9" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-9 -9 H9 L-9 9 H9" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/></g></g>`).join('')); }).join('');

// ───────────────────────── Doc Koala, président du club (hauteur ≈ 240) ─────────────────────────
export function koala(talk = [], o = {}) {
  const fur = '#8ea5c6', furD = '#6f87aa', ear = '#f1f5fb', nose = '#2a2433', coat = '#ffffff', coatD = '#d9e2f0', strap = '#c0392b';
  const sleeps = o.sleep || [], yawns = o.yawn || [];
  const eyesL = [...(o.eyes || []), ...sleeps.map(([a, b]) => [a, b, 'shut'])];
  const moodsL = [...(o.moods || []), ...yawns.map(([a, b]) => [a, b, 'yawnbig'])];
  const sh = shadowEl(88, [], []);
  const nod = win(sleeps, 'c7nod');
  const cling = o.cling || [];
  const legs = [-34, 12].map((x) => `<rect x="${x}" y="-46" width="28" height="42" rx="13" fill="${furD}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 18}" cy="-6" rx="24" ry="9" fill="${fur}" stroke="${INK}" stroke-width="4"/><path d="M${x + 12} -9 v6 M${x + 22} -9 v6" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`).join('');
  const earG = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fur}" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="${ear}"/><path d="M${x - r * 0.4} ${y - r * 0.2} q${r * 0.2} -${r * 0.3} ${r * 0.4} -${r * 0.05} M${x - r * 0.3} ${y + r * 0.25} q${r * 0.25} -${r * 0.25} ${r * 0.5} 0" stroke="#c4cfe0" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const binoHead = (o.bino || []).map(([a, b]) => vis(a, b, `<g><path d="M58 -190 h56 M58 -166 h56" stroke="${INK}" stroke-width="2" opacity="0"/><rect x="28" y="-204" width="84" height="34" rx="12" fill="#4a5a78" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-187" r="19" fill="#3a4863" stroke="${INK}" stroke-width="5"/><circle cx="66" cy="-187" r="17" fill="#3a4863" stroke="${INK}" stroke-width="5"/><rect x="104" y="-208" width="16" height="42" rx="7" fill="#2f3b52" stroke="${INK}" stroke-width="4"/><circle cx="35" cy="-192" r="6" fill="#bfe6ff"/><path d="M26 -200 q10 -8 20 -4" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/></g>`)).join('');
  const head = `
    ${earG(-6, -198, 34)}${earG(84, -214, 28)}
    <circle cx="40" cy="-176" r="58" fill="${fur}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="14" cy="-206" rx="22" ry="8" fill="#fff" opacity=".28" transform="rotate(-24 14 -206)"/>
    <ellipse cx="96" cy="-170" rx="17" ry="24" fill="${nose}" stroke="${INK}" stroke-width="4"/><ellipse cx="91" cy="-181" rx="5" ry="7" fill="#fff" opacity=".75" transform="rotate(14 91 -181)"/>
    ${eyeStates([[38, -188, 10, 2], [64, -190, 9, 2]], eyesL)}
    <path d="M26 -208 Q38 -214 50 -209 M56 -210 Q66 -213 74 -208" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(80, -140, talk, moodsL, o.mood || 'calm')}
    <ellipse cx="50" cy="-148" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[50, -148, 15]], o.blush || [])}
    ${binoHead}${hats(o)}`;
  const coatEl = `<path d="M-58 -84 Q-62 -28 -30 -24 H36 Q66 -28 62 -84 Q54 -134 2 -136 Q-52 -134 -58 -84Z" fill="${coat}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M6 -128 V-26" stroke="${coatD}" stroke-width="4"/><path d="M-14 -134 L6 -108 L26 -134" fill="${coatD}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="20" cy="-86" r="4" fill="#9db4d8" stroke="${INK}" stroke-width="2.5"/><circle cx="20" cy="-60" r="4" fill="#9db4d8" stroke="${INK}" stroke-width="2.5"/>
    <rect x="-44" y="-70" width="30" height="26" rx="5" fill="#f2f6fc" stroke="${INK}" stroke-width="3.5"/><path d="M-36 -70 V-86 M-27 -70 V-82" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><circle cx="-36" cy="-88" r="3" fill="#e8434e"/><circle cx="-27" cy="-84" r="3" fill="#2f80ed"/>
    <ellipse cx="-30" cy="-112" rx="18" ry="7" fill="#fff" stroke="none" opacity=".8" transform="rotate(-24 -30 -112)"/>`;
  // jumelles autour du cou : lanière + deux tubes sur la poitrine
  const bino = `<path d="M-8 -132 Q-14 -96 -6 -80 M22 -134 Q30 -100 18 -80" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-8 -132 Q-14 -96 -6 -80 M22 -134 Q30 -100 18 -80" stroke="${strap}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <g transform="translate(6 -72) rotate(-8)"><rect x="-26" y="-14" width="52" height="30" rx="9" fill="#4a5a78" stroke="${INK}" stroke-width="4"/><circle cx="-12" cy="3" r="13" fill="#3a4863" stroke="${INK}" stroke-width="4"/><circle cx="14" cy="3" r="13" fill="#3a4863" stroke="${INK}" stroke-width="4"/><circle cx="-15" cy="-1" r="4" fill="#bfe6ff"/><circle cx="11" cy="-1" r="4" fill="#bfe6ff"/></g>`;
  const farArm = armG(18, -108, furD, furD, { rest: -8, len: 46, w: 20, cling });
  const inner = `${o.noShadow ? '' : sh}${legs}
    <g style="transform-origin:0px -60px;animation:breathe 1.9s ease-in-out infinite alternate">
      ${farArm}
      <ellipse cx="0" cy="-84" rx="60" ry="56" fill="${fur}" stroke="${INK}" stroke-width="4"/>
      ${coatEl}${bino}
      ${armG(26, -112, '#ffffff', fur, { rest: -22, len: 46, w: 22, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], cling, item: o.item || '' })}
      <g style="transform-origin:30px -130px;${nod.length ? anims(nod) : ''}">${idle(head, 40, -130, 2.6)}</g>
    </g>${zz(104, -236, sleeps)}`;
  return wrapFx(inner, o);
}

// ───────────────────────── Suri la suricate, vigie et pilote (hauteur ≈ 265 avec casque) ─────────────────────────
export function meerkat(talk = [], o = {}) {
  const sand = '#e3c08c', sandD = '#c79c63', pale = '#f8e6c4', mask = '#6b4326', orange = '#ff8a2b', orangeD = '#e06a10', glass = '#bfe6ff';
  const sh = shadowEl(70, [], []);
  const toe = win(o.tiptoe, 'c7toe');
  const gog = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${glass}" fill-opacity=".8" stroke="${INK}" stroke-width="5"/><path d="M${x - r * 0.6} ${y - r * 0.2} Q${x - r * 0.4} ${y - r * 0.6} ${x} ${y - r * 0.65}" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const tail = `<g style="transform-origin:-30px -50px;animation:c7tail 1.2s ease-in-out infinite alternate"><path d="M-30 -48 Q-90 -40 -112 -86 Q-122 -112 -104 -130" stroke="${INK}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M-30 -48 Q-90 -40 -112 -86 Q-122 -112 -104 -130" stroke="${sand}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M-62 -52 l-4 16 M-86 -62 l-12 12 M-104 -84 l-16 6 M-108 -108 l-14 -2" stroke="${mask}" stroke-width="5" stroke-linecap="round"/><circle cx="-104" cy="-132" r="6" fill="${mask}" stroke="${INK}" stroke-width="3"/></g>`;
  const legs = [-22, 12].map((x) => `<rect x="${x}" y="-60" width="22" height="54" rx="10" fill="${sandD}" stroke="${INK}" stroke-width="4"/><ellipse cx="${x + 16}" cy="-6" rx="25" ry="8" fill="${sand}" stroke="${INK}" stroke-width="4"/><path d="M${x + 22} -10 v7 M${x + 31} -9 v6" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`).join('');
  const goggDown = (o.goggles || []).map(([a, b]) => vis(a, b, `<path d="M22 -208 H80" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>${gog(36, -206, 17)}${gog(66, -206, 15)}`)).join('');
  const head = `
    <circle cx="8" cy="-212" r="16" fill="${mask}" stroke="${INK}" stroke-width="4"/>
    <path d="M10 -176 Q-6 -214 36 -222 Q78 -222 88 -194 L110 -184 Q116 -176 104 -172 L86 -162 Q56 -148 28 -158 Q14 -164 10 -176Z" fill="${sand}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="34" cy="-208" rx="18" ry="22" fill="${mask}" transform="rotate(10 34 -208)"/><ellipse cx="68" cy="-206" rx="16" ry="20" fill="${mask}" transform="rotate(-8 68 -206)"/>
    <ellipse cx="106" cy="-180" rx="8" ry="6.5" fill="${INK}"/><ellipse cx="104" cy="-182.5" rx="2.8" ry="1.9" fill="#fff" opacity=".8"/>
    ${eyeStates([[34, -208, 10, 2], [68, -206, 9, 2]], o.eyes || [])}
    ${mouthStates(84, -163, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="48" cy="-174" rx="9" ry="5.5" fill="#ff8fa3" opacity=".7"/>${blushWin([[48, -174, 13]], o.blush || [])}
    ${goggDown}
    <path d="M0 -214 Q-6 -262 40 -266 Q86 -262 84 -214 Q40 -228 0 -214Z" fill="${orange}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M0 -214 L-14 -184 Q-4 -176 8 -186 L12 -212Z" fill="${orangeD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="-6" y="-226" width="96" height="14" rx="7" fill="${orangeD}" stroke="${INK}" stroke-width="4"/>
    <path d="M38 -266 V-226" stroke="${orangeD}" stroke-width="8" stroke-linecap="round"/>
    <path d="M10 -234 H70" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>${gog(24, -246, 14)}${gog(54, -246, 14)}
    <ellipse cx="14" cy="-252" rx="12" ry="5" fill="#fff" opacity=".5" transform="rotate(-30 14 -252)"/>
    ${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="${toe.length ? anims(toe) : ''}"><g style="transform-origin:0px -60px;animation:breathe 1.2s ease-in-out infinite alternate">
      <ellipse cx="0" cy="-104" rx="40" ry="62" fill="${sand}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="12" cy="-96" rx="26" ry="46" fill="${pale}"/>
      <path d="M-34 -116 l14 6 M-36 -92 l14 6 M-30 -70 l12 4" stroke="${mask}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-18" cy="-140" rx="14" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 -18 -140)"/>
      ${armG(22, -132, sand, pale, { rest: -22, len: 54, w: 14, handR: 9, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], visor: o.visor || [], item: o.item || '' })}
      ${idle(head, 40, -170, 1.5)}
    </g></g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Lulu, habitante de la lune (hauteur ≈ 250 avec antennes ; flotte à ~14 px du sol) ─────────────────────────
export function moonling(talk = [], o = {}) {
  const body = '#bde3f7', bodyD = '#8cc6e6', belly = '#e8f6fd', bulb = '#ffe14a', bulbD = '#ffc61f', cheek = '#ffb6c9', haloC = '#fff1a0';
  const sh = `<ellipse cx="0" cy="3" rx="44" ry="9" fill="#000" opacity=".12"/>`;
  const gl = (o.glow || []).map(([a, b]) => vis(a, b, `<g style="transform-origin:0px -100px;${an({ n: 'c7halo', d: 0.8, c: 99, dir: 'alternate', e: 'ease-in-out' })}"><circle cy="-100" r="150" fill="${haloC}" opacity=".3"/><circle cy="-100" r="112" fill="${haloC}" opacity=".5"/></g>`)).join('');
  const fl = (o.flicker || []).map(([a, b]) => vis(a, b, `<g style="${an({ n: 'c7flick', d: b - a, t: 0, f: 'none' })}"><circle cy="-100" r="130" fill="${haloC}" opacity=".5"/><circle cy="-100" r="104" fill="${haloC}" opacity=".6"/></g>`)).join('');
  const bulbOn = (o.glow || []).map(([a, b]) => vis(a, b, `<circle cx="-34" cy="-232" r="26" fill="#fff6bf" opacity=".7"/><circle cx="44" cy="-238" r="26" fill="#fff6bf" opacity=".7"/>`)).join('');
  const feet = [-24, 20].map((x) => `<g><path d="M${x - 16} -14 q-6 14 6 16 h24 q14 -2 8 -16 q-8 -12 -18 -2 q-8 -12 -20 2Z" fill="${bodyD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M${x - 4} -8 v8 M${x + 8} -8 v8" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/></g>`).join('');
  const ant = (x0, y0, x1, y1, cx, cy, d) => `<g style="transform-origin:${x0}px ${y0}px;animation:c7ant ${d}s ease-in-out infinite alternate"><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="${bodyD}" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="15" fill="${bulb}" stroke="${INK}" stroke-width="4"/><circle cx="${x1 - 5}" cy="${y1 - 5}" r="4.5" fill="#fff" opacity=".85"/></g>`;
  const head = `${ant(-16, -160, -34, -232, -30, -190, 1.7)}${ant(26, -162, 44, -238, 44, -194, 2.1)}`;
  const flt = o.noFloat ? '' : `animation:c7float 1.9s ease-in-out infinite alternate`;
  const inner = `${o.noShadow ? '' : sh}
    <g style="${flt}">
      <g style="transform-origin:0px -100px;animation:c7halo 2.4s ease-in-out infinite alternate"><circle cy="-100" r="118" fill="${haloC}" opacity=".16"/></g>
      ${gl}${fl}
      ${feet}
      ${head}${bulbOn}
      <g style="transform-origin:0px -70px;animation:breathe 1.6s ease-in-out infinite alternate">
        <circle cx="0" cy="-100" r="70" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <ellipse cx="6" cy="-84" rx="46" ry="42" fill="${belly}"/>
        <ellipse cx="-30" cy="-140" rx="22" ry="9" fill="#fff" opacity=".5" transform="rotate(-30 -30 -140)"/>
        <circle cx="-36" cy="-120" r="6" fill="${bodyD}" opacity=".6"/><circle cx="-24" cy="-62" r="8" fill="${bodyD}" opacity=".5"/><circle cx="-48" cy="-84" r="4.5" fill="${bodyD}" opacity=".5"/>
        ${eyeStates([[14, -112, 11, 2], [48, -112, 10, 2]], o.eyes || [])}
        ${mouthStates(32, -88, talk, o.moods || [], o.mood || 'shy')}
        <ellipse cx="2" cy="-96" rx="11" ry="7" fill="${cheek}" opacity=".9"/><ellipse cx="62" cy="-96" rx="9" ry="6" fill="${cheek}" opacity=".7"/>${blushWin([[2, -94, 15], [62, -94, 12]], o.blush || [])}
        ${armG(48, -70, body, belly, { rest: -28, len: 24, w: 15, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
        ${hats(o)}
      </g>
    </g>`;
  return wrapFx(inner, o);
}
