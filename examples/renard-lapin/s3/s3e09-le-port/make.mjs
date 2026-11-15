// Roussin & Lino · Saison 3 · Épisode 9 « Le port » — 30 s, 1280x720. 14h00, le petit port et ses bateaux colorés.
//
// Découpage :
//  0.0– 3.6  plan large   le quai ; Capitaine Gaston : « Bienvenue, mes petits matelots ! »
//  3.6– 7.0  Lino         il regarde son poignet nu : « J'ai perdu ma montre ! » (Roussin à côté)
//  7.0–10.0  Gaston       « Cherchons dans mon bec ! »
// 10.0–15.4  le bec       il en sort une casquette, une tasse, un hareng (POOF, CLINK) : chaque objet atterrit sur le quai
// 15.4–19.0  la montre    « Et ça ? » — la montre de Lino jaillit du bec et vole dans sa main : « Ma montre ! »
// 19.0–24.5  plan large   Roussin : « Quel grand bec ! » — Gaston : « Avec plaisir, mes petits ! »
// 24.5–27.2  plan large   Lino : « Merci, Capitaine ! »
// 27.2–30.0  carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { harborBg, fish } from '../../lib/sea.mjs';
import { pelican } from '../../lib/cast3.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const DUR = 30, NAME = 'le-port', TITLE = 'Le port', NEXT = 'Prochain épisode : l’histoire du poisson', CLOCK = [14, 0], BPM = 108;
const L = [
  { who: 'pelican', text: 'Bienvenue, mes petits matelots !', t: 0.6, d: 2.6 },
  { who: 'rab', text: 'J’ai perdu ma montre !', t: 3.9, d: 2.2 },
  { who: 'pelican', text: 'Cherchons dans mon bec !', t: 7.2, d: 2.3 },
  { who: 'pelican', text: 'Une casquette !', t: 10.5, d: 1.3 },
  { who: 'pelican', text: 'Une tasse !', t: 12.1, d: 1.2 },
  { who: 'pelican', text: 'Un hareng !', t: 13.7, d: 1.3 },
  { who: 'pelican', text: 'Et ça ?', t: 15.6, d: 1.1 },
  { who: 'rab', text: 'Ma montre !', t: 17.6, d: 1.4, shout: true },
  { who: 'fox', text: 'Quel grand bec !', t: 19.2, d: 1.6 },
  { who: 'pelican', text: 'Avec plaisir, mes petits !', t: 20.9, d: 2.0 },
  { who: 'hedge', text: 'Quel bec magique !', t: 23.0, d: 1.5 },
  { who: 'rab', text: 'Merci, Capitaine !', t: 24.8, d: 1.9 },
];
const SHOTS = [
  [0, 3.6, 640, 430, 1.12, 1.18],
  [3.6, 7.0, 400, 480, 1.6, 1.65],
  [7.0, 10.0, 853, 480, 1.5, 1.55],
  [10.0, 15.4, 853, 480, 1.5, 1.55],
  [15.4, 19.0, 853, 480, 1.5, 1.5],
  [19.0, 24.5, 640, 430, 1.15, 1.2],
  [24.5, 27.2, 640, 430, 1.1, 1.15],
  [27.2, 30, 640, 400, 1.0, 1.0],
];

// ───────── caméra, trajectoires, pastille d'heure ─────────
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes crumb{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),50px)}}`);
const lerp = (a, b, u) => a + (b - a) * u;
// pts = [[t, x, y, rot, scale]] (lissées) ; l'objet n'existe que de t0 à t1
const mover = (inner, pts) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const fn = (t) => {
    let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
    const [a, xa, ya, ra = 0, sa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
    const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a))));
    return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), s: lerp(sa, sb, u) };
  };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};
// fenêtres de bouche d'un personnage, déduites de la table des répliques L
const T = (who) => L.filter((l) => l.who === who).map((l) => [+(l.t + 0.05).toFixed(2), +(l.t + l.d - 0.1).toFixed(2)]);
const inWin = (who, pad = 0.2) => L.filter((l) => l.who === who).map((l) => [l.t - 0.15, l.t + l.d + pad]);
// pastille d'heure en haut à gauche (espace écran, toujours entière dans le cadre)

// ───────── décor : le petit port ─────────
const FY = 640, FOXX = 230, RX = 570, PX = 1040;
const MOUTH = [PX - 138, FY - 178]; // le bout du bec (Gaston regarde à gauche)
const bg = harborBg();
const ACT = { fox: () => [FOXX + 55, FY - 255], rab: () => [RX + 35, FY - 290], pelican: () => [PX - 34, FY - 302], hedge: () => [430 + 15, FY - 175] };

// ───────── les objets du bec ─────────
const capI = `<g><path d="M-30 6 Q-34 -30 0 -34 Q34 -30 30 6Z" fill="#e8434e" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M22 6 Q54 2 62 14 Q38 20 20 12Z" fill="#b8232d" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cy="-34" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>`;
const mugI = `<g><path d="M22 -26 q22 0 22 14 q0 14 -22 14" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M22 -26 q22 0 22 14 q0 14 -22 14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="-24" y="-38" width="46" height="44" rx="9" fill="#fff" stroke="${INK}" stroke-width="4.5"/><path d="M-24 -22 H22" stroke="#3b82f6" stroke-width="8"/></g>`;
const herrI = fish(0, 0, 0.8, 'herring');
const watchI = `<g><rect x="-9" y="-46" width="18" height="92" rx="7" fill="#e8434e" stroke="${INK}" stroke-width="4"/><circle r="26" fill="#fff" stroke="${INK}" stroke-width="5"/>${Array.from({ length: 4 }, (_, i) => `<line y1="-20" y2="-16" stroke="${INK}" stroke-width="3" transform="rotate(${i * 90})"/>`).join('')}<line y2="-19" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><line y2="-12" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(60)"/><circle r="3.5" fill="#e8434e"/></g>`;
// chaque objet : sort du bec, vole en arc, atterrit sur le quai
const ITEMS = [
  { t: 10.45, svg: capI, land: [770, FY + 6], rot: -340, s: 0.9 },
  { t: 12.05, svg: mugI, land: [830, FY + 10], rot: 340, s: 0.9 },
  { t: 13.65, svg: herrI, land: [700, FY + 14], rot: -380, s: 1.3 },
];
const flights = ITEMS.map(({ t, svg, land, rot, s }) => mover(svg, [[t, MOUTH[0], MOUTH[1], 0, 0.5 * s], [t + 0.35, (MOUTH[0] + land[0]) / 2, 330, rot / 2, s], [t + 0.8, land[0], land[1] - 20, rot, s]]) +
  vis(t + 0.8, 99, `<g transform="translate(${land[0]} ${land[1]}) rotate(${rot % 360}) scale(${s})">${svg}</g>`));
const pouchSvg = (svg, s) => `<g transform="scale(${s})">${svg}</g>`;
const pouch = [[10.0, 10.5, pouchSvg(capI, 0.5)], [11.6, 12.05, pouchSvg(mugI, 0.5)], [13.2, 13.65, pouchSvg(herrI, 0.7)], [15.55, 16.5, pouchSvg(watchI, 0.55)]];
const watchFly = mover(watchI, [[16.5, MOUTH[0], MOUTH[1], 0, 0.55], [16.85, 740, 340, 200, 0.9], [17.5, RX + 70, FY - 100, 360, 0.7]]);

// ───────── personnages ─────────
const gastonEl = put(PX, FY, 1.0, pelican(T('pelican'), { noShadow: true, pouch,
  eyes: [[0, 30, 'arc']], moods: [[0, 30, 'happy']], blush: [[19.0, 24.0]] }), true);
const foxEl = put(FOXX, FY, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, talk: T('fox'),
  eyes: [[0.4, 3.6, 'side'], [3.6, 7.0, 'side'], [10.0, 15.4, 'wide'], [15.4, 19.0, 'wide'], [19.0, 24.5, 'arc'], [24.5, 27.5, 'arc']],
  moods: [[10.0, 19.0, 'oh'], [19.0, 30, 'happy']], blush: [[19.4, 21.0]] }));
const rabEl = put(RX, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, talk: T('rab'),
  item: vis(17.8, 99, `<g transform="translate(14 -4) scale(.55) rotate(-20)">${watchI}</g>`),
  eyes: [[0.4, 3.6, 'arc'], [3.6, 7.0, 'wide'], [7.0, 17.5, 'side'], [17.5, 19.0, 'wide'], [19.0, 30, 'arc']],
  moods: [[0.5, 3.6, 'happy'], [3.6, 7.0, 'panic'], [7.0, 17.5, 'calm'], [17.5, 30, 'happy']], jolt: [17.7], gest: [[3.9, 6.1], [17.6, 19.0]] }));
const sparkle = vis(17.5, 18.8, `<g transform="translate(${RX + 100} ${FY - 140})">${[0, 72, 144, 216, 288].map((a) => `<path d="M0 -26 L5 -6 L26 0 L5 6 L0 26 L-5 6 L-26 0 L-5 -6Z" fill="#ffd23f" stroke="${INK}" stroke-width="3" transform="rotate(${a}) translate(46 0) scale(.5)"/>`).join('')}</g>`);
const mkHedge = () => put(430, FY, 0.85, hedgehog(T('hedge'), { noShadow: true, eyes: [[0, 30, 'arc']], moods: [[0, 30, 'happy']] }));
const hedgeEl = vis(0, 7.0, mkHedge()) + vis(19.0, 30, mkHedge());
const world = `${bg}${hedgeEl}${rabEl}${foxEl}${gastonEl}${flights.join('')}${watchFly}${sparkle}`;
const FXS = sfx('POOF !', 500, 215, 10.5, 0.8, -8, '#ffffff', 64) + sfx('CLINK !', 480, 230, 12.4, 0.8, 8, '#8fd3ff', 60) + sfx('POOF !', 500, 215, 13.7, 0.8, -6, '#ffffff', 60) + sfx('DING !', 1000, 330, 17.4, 0.9, -6, '#ffd23f', 64);
const SFX = [['poof', 10.5], ['poof', 12.05], ['clink', 12.8], ['poof', 13.65], ['poof', 15.6], ['bell', 17.5], ['laugh', 19.4], ['chirp', 3.2]];

// ───────── bulles : police ×1,25, locuteur visible, pointe vers sa tête ─────────
const say = (l) => {
  const fs = l.shout ? 50 : 41, w = l.text.length * fs * 0.56 + 56, h = fs + 34;
  const [hx, hy] = ACT[l.who](l.t + 0.1);
  const [sx, sy] = scr(hx, hy, l.t + 0.1);
  const bx = sx + (l.dx || 0);
  let by = sy - 44 - h / 2 + (l.dy || 0);
  const x = Math.min(Math.max(bx, w / 2 + 16), W - 16 - w / 2);
  if (x - w / 2 < 270 && by < 176) by = 176;
  if (by < h / 2 + 14) console.warn('bulle coupée en haut :', l.text, by);
  if (sy < 130) console.warn('tête trop haute (bulle sur la tête) :', l.who, l.text, sy);
  if (sx < 60 || sx > W - 60) console.warn('locuteur au bord :', l.who, l.text, sx);
  return say0(l.who, l.text, l.t, l.d, { bx, by, tips: [[sx, Math.min(sy + 6, H - 20)]], shout: !!l.shout, fs });
};
L.forEach((l, i) => {
  if (l.text.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length > 5) console.warn('plus de 5 mots :', l.text);
  const s = SHOTS.find(([a, b]) => l.t >= a && l.t < b);
  if (!s || l.t + l.d > s[1] + 0.01) console.warn('réplique à cheval sur un plan :', l.text);
  if (i && L[i - 1].t + L[i - 1].d > l.t + 0.001) console.warn('bulles superposées :', l.text);
});
if (L.length > 12) console.warn('trop de répliques', L.length);
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-350" y="-86" width="700" height="190" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-350" y="-86" width="700" height="190" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="24" class="bt" style="font-size:36px;fill:#2b5ba8">${TITLE}</text>
  <text y="70" class="bt" style="font-size:27px;fill:#7a6a5a">${NEXT}</text></g></g>`;
const fx = timeBadge(CLOCK[0], CLOCK[1]) + L.map(say).join('') + (typeof FXS === 'string' ? FXS : '') + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push(...SFX.map(([name, t]) => ({ name, t })), { name: 'chime', t: 26.9 });
writeFileSync(new URL(`./${NAME}.svg`, import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: BPM, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
