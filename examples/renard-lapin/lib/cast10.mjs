// Saison 10 « Les grandes vacances » : nouveaux personnages (Pétronille la tortue, Marius le phoque).
// Pieds au sol en (0,0), regardent à droite. Nommés d'après l'id de voix : turtle, seal.
// Mêmes conventions d'options que cast2.mjs / cast5.mjs :
//   talk = [[t0,t1],…]  ·  eyes = [[a,b,'arc'|'wide'|'side'|'down'|'closed'|…]]  ·  moods = [[a,b,'happy'|'shy'|'sad'|'oh'|'panic'|'calm']]
//   blush = [[a,b]] · jolt = t | [t…] · shiver = [a,b] · point/wave/gest = [[a,b]] · item = svg tenu en main · hat = [[a,b,svg]]
//   noShadow = true
// turtle (hauteur ≈ 250 avec chapeau de paille) :
//   hide = [[a,b]]  la tête rentre dans la carapace (a→b), elle ressort à b (« je réfléchis »)
//   keys = [t…]     le trousseau de clés tinte et se balance
//   sign = false    retire le panneau « CAMPING » coincé sous le bras (défaut true)
//   strawHat = false retire le chapeau de paille (défaut true)
// seal (hauteur ≈ 280 avec calot) :
//   clap = [[a,b]]  il applaudit avec ses nageoires
//   nose = [[a,b,n]] n boules de glace (1 à 5) en équilibre sur le nez, elles vacillent ; n=0 → rien
//   cap = false     retire le calot rayé (ex. la pyramide atterrit sur sa tête : mettre la pyramide en hat)
import { INK, an, ao, anims, vis, eyeStates, mouthStates, addKF, shadowEl } from './kit.mjs';

addKF(`@keyframes c10hide{0%{transform:none;opacity:1}16%{transform:translate(-10px,40px) scale(.28);opacity:0}84%{transform:translate(-10px,40px) scale(.28);opacity:0}100%{transform:none;opacity:1}}
@keyframes c10keys{0%,100%{transform:rotate(0)}20%{transform:rotate(-16deg)}45%{transform:rotate(12deg)}70%{transform:rotate(-7deg)}}
@keyframes c10keysidle{from{transform:rotate(-2deg)}to{transform:rotate(3deg)}}
@keyframes c10clapN{from{transform:rotate(-16deg)}to{transform:rotate(50deg)}}
@keyframes c10clapF{from{transform:rotate(16deg)}to{transform:rotate(-52deg)}}
@keyframes c10wob{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes c10whisk{from{transform:rotate(-2deg)}to{transform:rotate(3deg)}}
@keyframes c10tail{from{transform:rotate(-5deg)}to{transform:rotate(7deg)}}`);

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
const O = (c, w = 4) => `fill="${c}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;

// ───────────────────────── Pétronille la tortue (hauteur ≈ 250 avec chapeau) ─────────────────────────
export function turtle(talk = [], o = {}) {
  const skin = '#a8dc86', skinD = '#8cc46a', moss = '#6ea64a', mossD = '#5a9040', diam = '#d9b97a', belly = '#eef6c4', straw = '#f3e2b3', strawD = '#d9bd78', ribbon = '#ffd23f';
  const sh = shadowEl(96, [], []);
  const legs = [-34, 14].map((x) => `<rect x="${x}" y="-46" width="28" height="42" rx="13" ${O(skin, 4)}/><ellipse cx="${x + 18}" cy="-6" rx="24" ry="10" ${O(skinD, 4)}/><path d="M${x + 24} -8 v6 M${x + 33} -8 v6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join('');
  const tail = `<g style="transform-origin:-60px -26px;animation:c10tail 1.5s ease-in-out infinite alternate"><path d="M-70 -58 Q-112 -56 -114 -32 Q-90 -32 -64 -42Z" ${O(skin, 4)}/></g>`;
  const dia = (x, y, k = 1) => `<path d="M${x} ${y - 20 * k} L${x + 15 * k} ${y} L${x} ${y + 20 * k} L${x - 15 * k} ${y}Z" ${O(diam, 3.5)}/>`;
  const shell = `<ellipse cx="-22" cy="-66" rx="84" ry="20" ${O('#e8d79a', 4)}/>
    <path d="M-100 -68 Q-104 -178 -22 -178 Q60 -178 56 -68Z" ${O(moss, 5)}/>
    <path d="M-100 -68 Q-104 -178 -22 -178" stroke="${mossD}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".35"/>
    ${dia(-34, -146)}${dia(-70, -118, 0.9)}${dia(-32, -100)}${dia(-84, -84, 0.7)}${dia(2, -128, 0.8)}
    <ellipse cx="-58" cy="-154" rx="22" ry="7" fill="#fff" opacity=".35" transform="rotate(-32 -58 -154)"/>`;
  const keyRing = `<g transform="translate(-20 -80)"><g style="transform-origin:0px 0px;${o.keys ? anims([...[].concat(o.keys).map((t) => ao({ n: 'c10keys', d: 0.9, t })), 'c10keysidle 2s ease-in-out infinite alternate']) : 'animation:c10keysidle 2.2s ease-in-out infinite alternate'}">
    <circle cx="0" cy="6" r="9" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="6" r="9" fill="none" stroke="#cfd2dc" stroke-width="3.2"/>
    ${[[-12, 22, '#ffd23f'], [0, 28, '#cfd2dc'], [12, 22, '#ff9f43']].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><path d="M0 0 V22" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0 0 V22" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/><circle cy="0" r="6" ${O(c, 3)}/><path d="M0 20 h7 M0 14 h6" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></g>`).join('')}</g></g>`;
  const sign = o.sign === false ? '' : `<g transform="translate(46 -46) rotate(-6)"><rect x="-54" y="-17" width="108" height="34" rx="6" ${O('#3fae55', 4.5)}/><rect x="-48" y="-12" width="96" height="24" rx="4" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/><text x="0" y="8" style="font-size:19px;fill:#fffbe6;letter-spacing:1px">CAMPING</text></g>`;
  const brow = `<path d="M36 -202 Q46 -208 56 -203 M66 -204 Q76 -208 84 -202" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  const hatEl = o.strawHat === false ? '' : `<path d="M20 -218 Q16 -258 50 -260 Q84 -258 82 -218Z" ${O(straw, 4.5)}/>
    <path d="M30 -250 Q50 -258 70 -250 M26 -238 Q50 -246 76 -238" stroke="${strawD}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M19 -226 Q50 -214 83 -226 L82 -214 Q50 -202 20 -214Z" ${O(ribbon, 4)}/>
    <g transform="translate(76 -214)"><path d="M0 0 L16 -10 L16 10Z M0 0 L-12 12 L-4 -4Z" ${O(ribbon, 3.5)}/></g>
    <ellipse cx="50" cy="-218" rx="66" ry="15" ${O(straw, 4.5)} transform="rotate(-3 50 -218)"/>
    <ellipse cx="50" cy="-222" rx="38" ry="7" fill="${strawD}" opacity=".5"/>
    <ellipse cx="22" cy="-222" rx="14" ry="4.5" fill="#fff" opacity=".6" transform="rotate(-12 22 -222)"/>`;
  const head = `
    <rect x="30" y="-170" width="42" height="44" rx="18" ${O(skin, 4)}/>
    <circle cx="50" cy="-180" r="42" ${O(skin, 4.5)}/>
    <ellipse cx="86" cy="-168" rx="22" ry="18" ${O(skin, 4.5)}/>
    <ellipse cx="102" cy="-174" rx="3.2" ry="4.4" fill="${INK}"/>
    <ellipse cx="30" cy="-198" rx="16" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 30 -198)"/>
    ${eyeStates([[44, -184, 9, 2], [72, -186, 8, 2]], o.eyes || [])}
    ${brow}
    ${mouthStates(84, -160, talk, o.moods || [], o.mood || 'calm')}
    <ellipse cx="62" cy="-164" rx="11" ry="7" fill="#ff8fa3" opacity=".7"/>${blushWin([[62, -164, 15]], o.blush || [])}
    ${hatEl}${hats(o)}`;
  const hideAnims = (o.hide || []).map(([a, b]) => ao({ n: 'c10hide', d: b - a, t: a, e: 'ease-in-out' }));
  const headWrap = `<ellipse cx="42" cy="-138" rx="34" ry="12" fill="#4d7a3a" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:50px -178px;${hideAnims.length ? anims(hideAnims) : ''}">${idle(head, 50, -140, 2.2)}</g>
    <path d="M10 -138 Q42 -122 76 -138" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
  const inner = `${o.noShadow ? '' : sh}${tail}${legs}
    <g style="transform-origin:0px -50px;animation:breathe 1.6s ease-in-out infinite alternate">
      ${shell}
      <ellipse cx="18" cy="-88" rx="48" ry="58" ${O(skin, 4.5)}/>
      <ellipse cx="32" cy="-80" rx="30" ry="42" fill="${belly}"/>
      <ellipse cx="2" cy="-118" rx="16" ry="6" fill="#fff" opacity=".4" transform="rotate(-24 2 -118)"/>
      ${sign}
      <rect x="-26" y="-92" width="92" height="13" rx="6" ${O('#8a5a33', 4)}/><rect x="40" y="-92" width="16" height="13" rx="3" ${O('#ffd23f', 3)}/>
      ${keyRing}
      ${armG(30, -112, skin, skin, { rest: -22, len: 44, w: 20, gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' })}
      ${headWrap}
    </g>`;
  return wrapFx(inner, o);
}

// ───────────────────────── Marius le phoque (hauteur ≈ 280 avec calot) ─────────────────────────
export function seal(talk = [], o = {}) {
  const gr = '#b4bdc9', grD = '#8d98aa', spot = '#7f8a9a', cream = '#f8edd5', blue = '#4a90e2', blueD = '#3571c0', red = '#e8434e';
  const sh = shadowEl(92, [], []);
  const flip = (x, rot) => `<ellipse cx="${x}" cy="-14" rx="34" ry="15" ${O(grD, 4)} transform="rotate(${rot} ${x} -14)"/><path d="M${x - 14} -20 l-6 12 M${x - 2} -22 l-4 14" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".5" transform="rotate(${rot} ${x} -14)"/>`;
  const body = `<path d="M-56 -38 Q-78 -108 -52 -176 Q-14 -216 40 -192 Q72 -150 64 -90 Q58 -44 30 -32 Q-10 -24 -56 -38Z" ${O(gr, 5)}/>
    <path d="M-30 -170 Q-8 -190 30 -184 Q56 -150 52 -96 Q44 -52 22 -44 Q-6 -40 -34 -52 Q-46 -110 -30 -170Z" fill="${cream}"/>
    ${[[-46, -138, 11], [-56, -96, 9], [-40, -64, 8], [-30, -176, 7]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${spot}" opacity=".85"/>`).join('')}
    <ellipse cx="-34" cy="-176" rx="22" ry="7" fill="#fff" opacity=".35" transform="rotate(-50 -34 -176)"/>`;
  const apron = `<path d="M-22 -168 L-6 -184 H38 L48 -168 L52 -92 Q56 -52 30 -44 Q8 -38 -16 -46 Q-34 -62 -30 -100Z" ${O(blue, 4.5)}/>
    <path d="M-6 -184 L-4 -204 M38 -184 L36 -204" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-6 -184 L-4 -204 M38 -184 L36 -204" stroke="${blue}" stroke-width="4" stroke-linecap="round"/>
    <path d="M-30 -62 Q8 -34 50 -62 L50 -52 Q10 -26 -28 -52Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="-8" y="-146" width="44" height="34" rx="8" fill="${blueD}" stroke="${INK}" stroke-width="3.5"/><path d="M-4 -142 h36" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 4" opacity=".8"/>
    <circle cx="14" cy="-124" r="8" fill="#ff8fb8" stroke="${INK}" stroke-width="3"/><path d="M8 -121 l6 12 l6 -12Z" fill="#e8c27a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-20 -164 q4 -8 10 -12" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4" fill="none"/>`;
  const flipper = (sx, sy, rest, clapName, clapWins, extra) => {
    const L = [...(extra.gest || []).map(([a, b]) => ao({ n: 'gestk', d: b - a, t: a })), ...(extra.point || []).map(([a, b]) => ao({ n: 'pointk', d: b - a, t: a, e: 'ease-in-out' })), ...(extra.wave || []).map(([a, b]) => ao({ n: 'wavek', d: b - a, t: a })),
      ...clapWins.map(([a, b]) => ao({ n: clapName, d: 0.28, t: a, c: Math.max(1, Math.round((b - a) / 0.28)), dir: 'alternate', e: 'ease-in-out' }))];
    return `<g style="--r:${rest}deg;transform-origin:${sx}px ${sy}px;transform:rotate(${rest}deg);${anims(L)}"><path d="M${sx - 12} ${sy - 4} Q${sx - 18} ${sy + 34} ${sx - 9} ${sy + 58} Q${sx + 1} ${sy + 68} ${sx + 12} ${sy + 56} Q${sx + 19} ${sy + 30} ${sx + 12} ${sy - 4}Z" ${O(gr, 4)}/><path d="M${sx - 5} ${sy + 38} l-2 12 M${sx + 3} ${sy + 40} l0 12" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".5"/>${extra.item ? `<g transform="translate(${sx} ${sy + 58})">${extra.item}</g>` : ''}</g>`;
  };
  const clap = o.clap || [];
  const farArm = flipper(-52, -148, 16, 'c10clapF', clap, {});
  const nearArm = flipper(46, -148, -18, 'c10clapN', clap, { gest: o.gest ?? talk, point: o.point || [], wave: o.wave || [], item: o.item || '' });
  const whisk = (y, r) => `<path d="M64 -188 Q92 ${-188 + y} 108 ${-190 + y + r}" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M64 -188 Q92 ${-188 + y} 108 ${-190 + y + r}" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
  const scoopCol = ['#ff8fb8', '#9be8c8', '#fff1b0', '#ffb36b', '#c7a3ff'];
  const scoop = (i, n) => `<g transform="translate(0 ${-i * 38})"><path d="M-26 -10 Q-30 2 -22 0 Q-16 8 -8 0 Q0 8 8 0 Q16 8 22 0 Q30 2 26 -10Z" fill="${scoopCol[i % 5]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cy="-16" r="24" ${O(scoopCol[i % 5], 4.5)}/><ellipse cx="-9" cy="-26" rx="7" ry="4.5" fill="#fff" opacity=".65" transform="rotate(-30 -9 -26)"/></g>`;
  const stack = (o.nose || []).filter(([, , n]) => n > 0).map(([a, b, n]) => vis(a, b, `<g transform="translate(80 -208)"><g style="transform-origin:0px 0px;animation:c10wob ${0.5 + n * 0.08}s ease-in-out infinite alternate">${Array.from({ length: n }, (_, i) => scoop(i, n)).join('')}</g></g>`)).join('');
  const calot = o.cap === false ? '' : `<g transform="rotate(-8 28 -250)"><path d="M-6 -238 Q-4 -278 28 -280 Q62 -278 64 -240 Q28 -226 -6 -238Z" ${O('#fff', 4.5)}/>
    ${[[8, -262, -236], [24, -273, -233], [40, -273, -233], [54, -262, -236]].map(([x, y0, y1]) => `<path d="M${x} ${y0} L${x} ${y1}" stroke="${red}" stroke-width="9" stroke-linecap="butt"/>`).join('')}
    <path d="M-6 -238 Q-4 -278 28 -280 Q62 -278 64 -240 Q28 -226 -6 -238Z" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M-4 -246 Q28 -236 62 -248" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
    <ellipse cx="14" cy="-268" rx="10" ry="4" fill="#fff" opacity=".6" transform="rotate(-20 14 -268)"/></g>`;
  const head = `
    <circle cx="22" cy="-204" r="52" ${O(gr, 5)}/>
    <ellipse cx="56" cy="-188" rx="34" ry="25" ${O(cream, 4.5)}/>
    <ellipse cx="80" cy="-200" rx="14" ry="10" fill="${INK}"/><ellipse cx="76" cy="-203" rx="4.5" ry="2.8" fill="#fff" opacity=".85"/>
    <path d="M80 -190 V-182" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    ${[[62, -186], [70, -190], [66, -178]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${spot}"/>`).join('')}
    <g style="transform-origin:62px -186px;animation:c10whisk 1.8s ease-in-out infinite alternate">${whisk(-12, -4)}${whisk(4, 2)}${whisk(20, 10)}</g>
    <ellipse cx="-4" cy="-226" rx="20" ry="7" fill="#fff" opacity=".35" transform="rotate(-40 -4 -226)"/>
    ${eyeStates([[26, -214, 11, 2], [54, -216, 10, 2]], o.eyes || [])}
    <path d="M14 -234 Q26 -242 38 -236 M46 -236 Q56 -240 66 -234" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${mouthStates(62, -176, talk, o.moods || [], o.mood || 'happy')}
    <ellipse cx="22" cy="-190" rx="12" ry="7.5" fill="#ff8fa3" opacity=".7"/>${blushWin([[22, -190, 16]], o.blush || [])}
    ${calot}${stack}${hats(o)}`;
  const inner = `${o.noShadow ? '' : sh}
    <g style="transform-origin:0px -20px;animation:c10tail 1.4s ease-in-out infinite alternate">${flip(-30, -8)}${flip(34, 8)}</g>
    <g style="transform-origin:0px -50px;animation:breathe 1.3s ease-in-out infinite alternate">
      ${body}${apron}${farArm}${nearArm}
      ${idle(head, 22, -170, 2)}
    </g>`;
  return wrapFx(inner, o);
}
