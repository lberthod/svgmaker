// Roussin & Lino · Épisode 5 « En route pour la cantine » — 30 s, 1280x720. 11h50, le couloir.
//
// Découpage :
//  0.0– 3.5  plan large      le couloir ; Mme Chouette mène la file : « En rang, deux par deux ! »
//  3.5– 7.0  Lino           il compte ses pas (1, 2, 3, 4… en chiffres qui sautent)
//  7.0– 8.4  la porte        des volutes d'odeur sortent de la porte de la cantine
//  8.4–10.4  Roussin          il renifle, les yeux fermés : « Mmm... des croissants ! »
// 10.4–14.0  plan moyen      Roussin décolle et flotte, porté par l'odeur ; Lino : « Roussin ! Le rang ! »
// 14.0–17.0  plan moyen      il passe au-dessus de la maîtresse (ses lunettes glissent) et file vers la porte
// 17.0–20.0  la porte        il atterrit ; la porte s'ouvre : Mme Escargot, très lente : « Bon... »
// 20.0–23.0  plan large      tout le monde attend… GROOOU (le ventre de Roussin) ; Lino : « Quarante-deux pas ! »
// 23.0–25.2  la porte        « ...appétit ! »
// 25.2–30.0  plan large      « Merci ! » ; Roussin file à l'intérieur ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, pal, snail, croissant } from '../lib/props.mjs';
import { wallClock } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 560, 420, 1.12, 1.15],
  [3.5, 7.0, 500, 470, 1.75, 1.8],
  [7.0, 8.4, 880, 440, 1.6, 1.65],
  [8.4, 10.4, 370, 470, 1.8, 1.86],
  [10.4, 14.0, 560, 380, 1.15, 1.18],
  [14.0, 17.0, 760, 430, 1.6, 1.63],
  [17.0, 20.0, 1000, 480, 2.4, 2.45],
  [20.0, 23.0, 709, 360, 1.12, 1.14],
  [23.0, 25.2, 1000, 480, 2.4, 2.45],
  [25.2, 30, 709, 399, 1.12, 1.15],
];
const { scr: P, camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const seg = (t, keys) => { // keys = [[t, x], ...] interpolation douce par morceaux
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) { const [a, va] = keys[i], [b, vb] = keys[i + 1]; if (t <= b) return lerp(va, vb, ss((t - a) / (b - a))); }
  return keys[keys.length - 1][1];
};
addKF(`@keyframes flow{from{stroke-dashoffset:0}to{stroke-dashoffset:-120}}
@keyframes numpop{0%{opacity:0;transform:translateY(10px) scale(.3)}25%{opacity:1;transform:translateY(-10px) scale(1.2)}70%{opacity:1;transform:translateY(-24px) scale(1)}100%{opacity:0;transform:translateY(-40px) scale(.9)}}
@keyframes doorswing{from{transform:scaleX(1)}to{transform:scaleX(.12)}}
@keyframes tiltup{0%,100%{transform:rotate(0)}20%,80%{transform:rotate(-12deg) translateY(-6px)}}
@keyframes slide{0%{transform:translateY(0)}30%,80%{transform:translateY(18px)}100%{transform:translateY(0)}}
@keyframes tap{from{transform:rotate(0)}to{transform:rotate(-14deg)}}
@keyframes steam{0%{opacity:0;transform:translateY(0) scale(.6)}30%{opacity:.8}100%{opacity:0;transform:translateY(-60px) scale(1.3)}}`);

// ───────── décor : le couloir ─────────
const FLOOR = 560;
const DOOR = { x: 940, y: 300, w: 200, h: FLOOR + 10 - 300 };
const locker = (x, c) => `<g><rect x="${x}" y="380" width="70" height="${FLOOR - 380}" rx="6" fill="${c}" stroke="${INK}" stroke-width="4"/>
  ${[0, 1, 2].map((i) => `<rect x="${x + 16}" y="${396 + i * 9}" width="38" height="4" rx="2" fill="${INK}" opacity=".5"/>`).join('')}<circle cx="${x + 56}" cy="470" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="2"/></g>`;
const drawing = (x, y, r, inner, c = '#fff') => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-44" y="-34" width="88" height="68" fill="${c}" stroke="${INK}" stroke-width="3.5"/><circle cx="0" cy="-36" r="5" fill="#e8434e" stroke="${INK}" stroke-width="2"/>${inner}</g>`;
const corridor = `<defs><clipPath id="winclip5">${[0, 1, 2, 3].map((i) => `<rect x="${130 + i * 250 - 64}" y="36" width="128" height="78"/>`).join('')}</clipPath><clipPath id="doorclip5"><rect x="-400" y="-400" width="${1150 + 400}" height="1600"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="#e6f2d9"/>
  <rect y="0" width="${W}" height="${FLOOR - 120}" fill="#dff0ff"/>
  ${Array.from({ length: 4 }, (_, i) => `<g transform="translate(${130 + i * 250} 70)"><rect x="-70" y="-40" width="140" height="90" rx="8" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/><path d="M0 -40 V50 M-70 5 H70" stroke="#fff" stroke-width="7"/><path d="M0 -40 V50 M-70 5 H70" stroke="${INK}" stroke-width="2.5"/><path d="M-56 -26 l24 -8" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/></g>`).join('')}
  <rect y="${FLOOR - 200}" width="${W}" height="200" fill="#a8d98a"/><rect y="${FLOOR - 206}" width="${W}" height="12" fill="#7fbf63" stroke="${INK}" stroke-width="3"/>
  ${[300, 380, 460, 540, 620, 700, 780, 860].map((x, i) => locker(x, ['#7cc8ff', '#ffb36b', '#ff8fb1', '#9be08a', '#c7a3ff', '#ffd23f', '#7cc8ff', '#ff8fb1'][i])).join('')}
  ${drawing(110, 250, -4, `<circle cx="-14" cy="-6" r="14" fill="#ffd23f"/><path d="M-40 26 L-10 0 L14 20 L28 6 L44 26Z" fill="#52c468"/>`)}
  ${drawing(420, 240, 3, `<circle r="20" fill="#f1eff7" stroke="${INK}" stroke-width="2"/><ellipse cx="-8" cy="-26" rx="6" ry="16" fill="#f1eff7" stroke="${INK}" stroke-width="2"/><ellipse cx="8" cy="-26" rx="6" ry="16" fill="#f1eff7" stroke="${INK}" stroke-width="2"/>`, '#fffbe6')}
  ${drawing(560, 250, -3, `<circle r="18" fill="#f28a1e" stroke="${INK}" stroke-width="2"/><path d="M-14 -10 L-10 -28 L0 -14 M14 -10 L10 -28 L0 -14" fill="#f28a1e" stroke="${INK}" stroke-width="2"/>`, '#fff')}
  ${drawing(860, 245, 4, `<path d="M-30 14 Q-26 -14 0 -16 Q26 -14 30 14 Q16 4 0 8 Q-16 4 -30 14Z" fill="#e9a84a" stroke="${INK}" stroke-width="2"/>`, '#fffbe6')}
  ${wallClock(11, 50, 700, 200)}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#e9d9b8"/>
  ${Array.from({ length: 17 }, (_, i) => `<line x1="${i * 80}" y1="${FLOOR}" x2="${i * 80 - 60}" y2="${H}" stroke="#d3bf98" stroke-width="3"/>`).join('')}
  <line x1="0" y1="${FLOOR + 70}" x2="${W}" y2="${FLOOR + 70}" stroke="#d3bf98" stroke-width="3"/>
  <rect y="${FLOOR - 6}" width="${W}" height="10" fill="#8a5224"/>`;
// porte de la cantine (s'ouvre à 17,6 s) ; derrière : la cantine, la table et les croissants
const doorInside = `<rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="#fff4d6"/>
  <rect x="${DOOR.x}" y="${DOOR.y + 150}" width="${DOOR.w}" height="${DOOR.h - 150}" fill="#f0dcb4"/>
  <rect x="${DOOR.x + 30}" y="${DOOR.y + 120}" width="150" height="16" rx="5" fill="#d49a5c" stroke="${INK}" stroke-width="3"/>
  ${[0, 1, 2].map((i) => `<g transform="translate(${DOOR.x + 70 + i * 36} ${DOOR.y + 110}) scale(.45)">${croissant}</g>`).join('')}
  ${[0, 1, 2].map((i) => `<g transform="translate(${DOOR.x + 70 + i * 40} ${DOOR.y + 90})"><g style="${an({ n: 'steam', d: 1.4, t: i * 0.45, c: 99 })}"><path d="M0 0 q8 -10 0 -20 q-8 -10 0 -20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`).join('')}`;
const doorLeaf = `<g style="transform-origin:${DOOR.x + DOOR.w}px 0px;${an({ n: 'doorswing', d: 0.4, t: 17.6, f: 'forwards', e: 'ease-out' })}">
  <rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="#e8a25a" stroke="${INK}" stroke-width="5"/>
  <rect x="${DOOR.x + 40}" y="${DOOR.y + 30}" width="${DOOR.w - 80}" height="90" rx="8" fill="#fff4d6" stroke="${INK}" stroke-width="4"/>
  <circle cx="${DOOR.x + 24}" cy="${DOOR.y + 150}" r="8" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>`;
const doorFrame = `<path d="M${DOOR.x - 12} ${DOOR.y + DOOR.h} V${DOOR.y - 12} H${DOOR.x + DOOR.w + 12} V${DOOR.y + DOOR.h}" fill="none" stroke="#8a5224" stroke-width="14"/><path d="M${DOOR.x - 12} ${DOOR.y + DOOR.h} V${DOOR.y - 12} H${DOOR.x + DOOR.w + 12} V${DOOR.y + DOOR.h}" fill="none" stroke="${INK}" stroke-width="3"/>
  <g transform="translate(${DOOR.x + DOOR.w / 2} ${DOOR.y - 56})"><rect x="-90" y="-26" width="180" height="48" rx="10" fill="#fff" stroke="${INK}" stroke-width="4"/><text y="12" style="font-size:30px;fill:#e8434e">CANTINE</text>
  <path d="M-110 -14 v26 M-116 -14 v10 q6 6 12 0 v-10 M110 -14 v26 M106 -14 q10 4 4 14" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;

// volutes d'odeur : de la porte jusqu'au nez de Roussin
const scent = (t0, t1, from, to, k) => {
  const [x0, y0] = from, [x1, y1] = to;
  const d = `M${x0} ${y0} C${lerp(x0, x1, 0.3)} ${y0 - 80 + k * 40} ${lerp(x0, x1, 0.6)} ${y1 + 60 - k * 30} ${x1} ${y1}`;
  return vis(t0, t1, `<g style="${an({ n: 'fadein', d: 0.6, t: t0, f: 'both' })}"><path d="${d}" stroke="#ffd98a" stroke-width="20" fill="none" stroke-linecap="round" opacity=".85"/><path d="${d}" stroke="#ffb84d" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="26 34" style="${an({ n: 'flow', d: 0.8, t: 0, c: 99 })}"/></g>`);
};
addKF('@keyframes fadein{from{opacity:0}to{opacity:1}}');

// ───────── personnages ─────────
// la file : Mme Chouette devant, puis Lino (rang du fond) et Roussin (rang de devant), puis Mimi et Coin
const OWLX = (t) => seg(t, [[0, 640], [10, 700], [17, 700], [20, 570], [26.8, 570], [28.4, 1230]]);
const LAPX = (t) => seg(t, [[0, 470], [10, 520], [17, 520], [20, 400], [27.2, 400], [28.8, 1230]]);
const FOXX = (t) => seg(t, [[0, 290], [10, 330]]);
const MIMX = (t) => seg(t, [[0, 150], [10, 180], [17, 180], [20, 270], [27.6, 270], [29.2, 1230]]);
const COINX = (t) => seg(t, [[0, 40], [10, 60], [17, 60], [20, 160], [28.0, 160], [29.6, 1230]]);
const walkW = [[0.1, 10], [17, 20], [27.0, 30]];
// entrée par la porte : on monte sur le seuil (y≈575) en rapetissant dès x≈960
const inK = (x) => clamp((x - 960) / 150, 0, 1);
const inY = (x, y0) => y0 - (y0 - 575) * inK(x), inS = (x) => 1 - 0.15 * inK(x);
const owlEl = track(put(0, 0, 1.12, `<g style="animation:owlsway 0.5s ease-in-out infinite alternate"><g style="transform-origin:0 -120px;${an({ n: 'tiltup', d: 2.2, t: 14.3 })}">${owl([[0.5, 2.3]], { happyAt: 25.4, watchAt: null, wave: [[0.4, 2.3]], look: [[14.0, 16.5, -8]] })}</g></g>`), 0, 30, (t) => ({ x: OWLX(t), y: inY(OWLX(t), 690) - (t < 10 || (t > 17 && t < 20) ? 5 * Math.abs(Math.sin(t * 6)) : 0), s: inS(OWLX(t)) }), 15);
const rabEl = track(`<g transform="scale(.95)">${rabbit({
  runExtra: walkW, talk: [[11.3, 12.5], [20.6, 21.7], [25.4, 26.3]],
  eyes: [[3.5, 7.0, 'down'], [10.6, 12.6, 'up'], [21.2, 22.7, 'arc'], [23.1, 25.2, 'wide']], moods: [[3.5, 7.0, 'calm'], [10.6, 12.6, 'oh'], [21.2, 22.7, 'happy'], [25.2, 30, 'happy']],
  jolt: [10.7], gest: [[11.3, 12.5], [21.2, 22.6]],
})}</g>`, 0, 30, (t) => ({ x: LAPX(t), y: inY(LAPX(t), 690), s: inS(LAPX(t)) }), 15);
const pals = track(put(0, 0, 0.85, pal('mouse', { walk: walkW, eyes: [[10.6, 13.0, 'up'], [25.3, 26.5, 'arc']], moods: [[25.3, 26.5, 'happy']], talk: [[25.4, 26.3]] })), 0, 30, (t) => ({ x: MIMX(t), y: inY(MIMX(t), 668), s: inS(MIMX(t)) }), 15) +
  track(put(0, 0, 0.85, pal('duck', { walk: walkW, eyes: [[10.6, 13.0, 'up'], [25.3, 26.5, 'arc']], moods: [[25.3, 26.5, 'happy']], talk: [[25.4, 26.3]] })), 0, 30, (t) => ({ x: COINX(t), y: inY(COINX(t), 668), s: inS(COINX(t)) }), 15);

// Roussin : marche, renifle, flotte, atterrit, file dans la cantine
const NOSE = (t) => [FOXX(t) + 140, 700 - 165];
const LANDX = 790;
const foxPos = (t) => {
  if (t < 10.6) return { x: FOXX(t), y: 700, r: 0 };
  if (t < 17.0) {
    const u = (t - 10.6) / 6.4, k = ss(u);
    return { x: lerp(330, LANDX, k), y: 700 - 215 * (u < 0.5 ? 1 - ((u - 0.5) * 2) ** 6 : 1) - 12 * Math.sin(t * 5), r: -15 + 5 * Math.sin(t * 3) };
  }
  if (t < 17.15) return { x: LANDX, y: lerp(400, 700, ss((t - 17.0) / 0.15)), r: 0 };
  if (t < 26.0) return { x: LANDX, y: 700, r: 0 };
  const u = clamp((t - 26.0) / 0.6, 0, 1); const x = lerp(LANDX, 1230, u * u); return { x, y: inY(x, 700), r: 0, k: inS(x) };
};
const foxEl0 = track(fox({
  run: [0.1, 10.4], runExtra: [[25.98, 26.6]], talk: [[8.7, 10.1]], jolt: [10.35, 17.05, 25.8], noShadow: true, sweatWin: null, upright: -12,
  eyes: [[7.6, 17.0, 'arc'], [17.0, 18.0, 'wide'], [20.1, 21.9, 'down'], [21.9, 22.9, 'up'], [23.0, 25.2, 'wide'], [25.2, 26.0, 'arc']],
  moods: [[8.4, 17.0, 'happy'], [17.0, 18.0, 'oh'], [20.1, 21.4, 'shy'], [21.4, 23.0, 'sad'], [23.0, 30, 'happy']],
  blush: [[20.3, 21.3]], raise: [[25.3, 26.0]],
}), 0, 30, (t) => { const p = foxPos(t); return { x: p.x, y: p.y, r: p.r, s: 1.1 * (p.k || 1) }; }, 20);
const foxEl = vis(0, 26.7, `<g clip-path="url(#doorclip5)">${foxEl0}</g>`);
// pieds qui pendouillent pendant le vol (petit balancement), traits de joie
const floatFx = vis(10.6, 17.0, track(`<g>${[0, 1, 2].map((i) => `<path d="M${-40 + i * 40} 30 q-6 16 0 30" stroke="#ffb84d" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}</g>`, 10.6, 17.0, (t) => { const p = foxPos(t); return { x: p.x, y: p.y, s: 1 }; }));

const SNAIL = [1040, 650];
const snailEl = vis(17.85, 99, track(put(0, 0, 0.95, snail([[19.2, 20.6], [23.4, 24.9]])), 17.85, 26.0, (t) => { const x = SNAIL[0] + (t < 19.0 ? 220 * (1 - ss((t - 17.85) / 1.15)) : t > 24.95 ? 280 * ss((t - 24.95) / 1.05) : 0), k = clamp((x - 1050) / 150, 0, 1); return { x, y: SNAIL[1] - 75 * k, s: 1 - 0.12 * k }; }, 15));

// Rouge-Gorge passe dans la fenêtre haute (clin d'œil : il a toujours le croissant)
const birdCameo = vis(21.4, 23.6, track(`${bird(true, true)}`, 21.4, 23.6, (t, u) => ({ x: lerp(-60, 1340, u), y: 78 + 10 * Math.sin(u * 12), sx: -1.6, sy: 1.6 })));

// chiffres qui sautent au-dessus de Lino
const nums = [1, 2, 3, 4, 5, 6].map((n, i) => { const t = 3.7 + i * 0.52; return vis(t, t + 0.55, `<g transform="translate(${LAPX(t) + 50} 385)"><g style="${an({ n: 'numpop', d: 0.55, t, f: 'both' })}"><text class="sfx" style="font-size:54px;fill:#7cc8ff">${n}</text></g></g>`); }).join('');

const world = `${corridor}
  ${vis(17.55, 99, doorInside)}${doorLeaf}<g clip-path="url(#doorclip5)">${snailEl}</g>${doorFrame}
  ${scent(7.0, 17.0, [DOOR.x + 30, 600], [NOSE(9)[0] - 30, NOSE(9)[1] + 20], 0)}${scent(7.2, 17.0, [DOOR.x + 30, 630], [NOSE(9)[0] - 10, NOSE(9)[1] + 40], 1)}
  <g clip-path="url(#winclip5)">${birdCameo}</g>
  <g clip-path="url(#doorclip5)">${owlEl}${rabEl}${pals}</g>${floatFx}${foxEl}
  ${nums}`;

const fx =
  say('owl', 'En rang, deux par deux !', 0.5, 1.8, { bx: 740, by: 220, tips: [[685, 380]] }) +
  sfx('SNIF SNIF', 600, 300, 8.6, 1.2, -6, '#ffb84d', 58, 'sniff') +
  say('fox', 'Mmm... des croissants !', 8.7, 1.5, { bx: 380, by: 110, tips: [[600, 290]] }) +
  sfx('FIOUUU', 330, 670, 10.55, 0.7, -6, '#7cc8ff', 50, 'whoosh') +
  say('rab', 'Roussin ! Le rang !', 11.3, 1.3, { bx: 900, by: 110, tips: [[650, 470]], shout: true }) +
  sfx('POP', 210, 650, 17.12, 0.6, -6, '#ffd23f', 56, 'boing') +
  say('snail', 'Bon...', 19.2, 0.75, { bx: 700, by: 50, tips: [[640, 160]], fs: 42 }) +
  sfx('GROOOUUU...', 820, 690, 20.3, 1.0, -6, '#b57bff', 40, 'tummy') +
  say('rab', 'Quarante-deux pas !', 20.6, 1.2, { bx: 360, by: 240, tips: [[360, 370]] }) +
  say('snail', '...appétit !', 23.4, 1.7, { bx: 700, by: 50, tips: [[640, 160]], fs: 42 }) +
  say('class', 'Merci !', 25.4, 1.0, { bx: 640, by: 265, tips: [[330, 390], [850, 400]], shout: true }) +
  sfx('ZOUM !', 980, 360, 26.0, 0.8, -6, '#ffd23f', 64, 'whoosh') +
  card(28.4, 'En route pour la cantine !', 'le repas', 640, 340);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#e6f2d9"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'step', t: 3.7 }, { name: 'step', t: 5.3 }, { name: 'chime', t: 7.1 }, { name: 'door', t: 17.6 }, { name: 'chirp', t: 21.0 });
writeFileSync(new URL('./vers-la-cantine.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 120, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
