// Roussin & Lino · Saison 3 · Épisode 5 « Le château » — 30 s, 1280x720. 10h45, la plage.
//
// Découpage :
//  0.0– 3.6  plan large     Lino bâtit un grand château haut sur la plage, Roussin le sien près de l'eau ; 10 h 45
//  3.6– 7.0  Roussin         il plante son drapeau : « Tadaa ! Mon château ! »
//  7.0–10.5  Lino            son grand château et son drapeau ; « La marée monte, Roussin ! »
// 10.5–13.5  plan large     « Pas de problème ! » — Piquette : « Une vague arrive ! »
// 13.5–17.0  l'action       la grande vague roule : SPLASH, le château de Roussin s'écroule (pas celui de Lino)
// 17.0–20.5  la réaction    Roussin devant son tas de sable : « Mon château ! »
// 20.5–24.0  plan large     « Le mien est resté haut. » — « Je bâtis plus haut ! » — « Viens, on partage ! »
// 24.0–27.0  plan large     le château de Lino : « Un château pour deux ! » — Piquette : « Hihi ! »
// 27.0–30.0  plan large     carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { seaBg, gull, bucket, spade, sandcastle, bigWave } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 430, 1.1, 1.15],
  [3.6, 7.0, 380, 470, 1.9, 2.0],
  [7.0, 10.5, 943, 490, 1.9, 1.9],
  [10.5, 13.5, 640, 430, 1.1, 1.1],
  [13.5, 17.0, 355, 470, 1.8, 1.8],
  [17.0, 20.5, 400, 470, 1.7, 1.7],
  [20.5, 24.0, 640, 430, 1.1, 1.1],
  [24.0, 27.0, 790, 450, 1.4, 1.4],
  [27.0, 30, 640, 430, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes crumbk{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),50px)}}`);

const lerp = (a, b, u) => a + (b - a) * u;
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
// bulle ancrée sur un point du monde (la pointe suit la caméra du plan) ; garde la pastille d'heure libre
const talk = (who, text, t0, d, [wx, wy], o = {}) => {
  const [tx, ty] = scr(wx, wy, t0 + 0.2);
  const fs = o.shout ? 50 : 41, w = text.length * fs * 0.56 + 56;
  let bx = tx + (o.dx || 0); const by = ty - (o.up ?? 100);
  if (by < 175) bx = Math.max(bx, 300 + w / 2);
  return say(who, text, t0, d, { bx, by, tips: [[tx, ty]], shout: o.shout });
};

// ───────── décor ─────────
const bg = `${seaBg('day')}${gull(300, 130, 0.9)}${gull(780, 90, 0.7, 1.2)}`;
const castleR = sandcastle(200, 575, 1.1, { low: true, build: [0.4, 3.4], crumble: 14.8 });
const castleL = sandcastle(930, 668, 1.05, { build: [0.2, 3.0] });
const deco = `${bucket(745, 680, 0.8, { col: '#3b82f6' })}${spade(700, 680, 0.9, -12)}${bucket(350, 612, 0.55, { col: '#ffd23f' })}`;

// ───────── personnages ─────────
const foxOpts = {
  run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[3.7, 4.9], [6.0, 7.0], [10.6, 11.9], [17.3, 18.4], [22.0, 23.2], [24.5, 26.0]],
  eyes: [[0, 3.4, 'down'], [3.4, 7.0, 'arc'], [10.5, 13.4, 'side'], [13.4, 17.0, 'wide'], [17.0, 20.6, 'down'], [20.6, 22.0, 'sq'], [22.0, 24.3, 'wide'], [24.3, 30, 'arc']],
  moods: [[0, 3.4, 'calm'], [3.4, 7.0, 'happy'], [10.5, 13.4, 'happy'], [13.4, 20.6, 'oh'], [17.0, 20.6, 'sad'], [20.6, 22.0, 'sad'], [22.0, 24.3, 'happy'], [24.3, 30, 'happy']],
  blush: [[24.5, 26.5]],
};
// moods ne doit pas se chevaucher : on les redéfinit proprement
foxOpts.moods = [[0, 3.4, 'calm'], [3.4, 7.0, 'happy'], [7.0, 10.5, 'calm'], [10.5, 13.4, 'happy'], [13.4, 17.0, 'oh'], [17.0, 22.0, 'sad'], [22.0, 24.3, 'happy'], [24.3, 30, 'happy']];
const foxA = vis(0, 22.2, put(465, 620, 0.95, fox(foxOpts), true));
const foxB = mover(put(0, 0, 0.95, fox(foxOpts)), [[22.2, 520, 620], [23.4, 550, 620], [30, 550, 620]]);
const rabEl = put(1120, 655, 1.0, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[0.6, 2.4], [7.6, 9.3], [20.5, 21.9], [23.2, 24.3]],
  eyes: [[0, 3.4, 'down'], [3.4, 7.0, 'side'], [7.4, 9.6, 'wide'], [13.4, 17.0, 'wide'], [20.4, 22.0, 'arc'], [23.0, 24.6, 'arc'], [24.6, 30, 'arc']],
  moods: [[0, 7.4, 'happy'], [7.4, 9.6, 'oh'], [9.6, 13.4, 'calm'], [13.4, 17.0, 'oh'], [17.0, 20.4, 'sad'], [20.4, 30, 'happy']] }), true);

// petit drapeau que Roussin plante sur le grand château (fin)
const flagFox = vis(24.0, 30, `<g transform="translate(940 395)"><path d="M0 0 V-70" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M0 -70 L48 -52 L0 -34Z" fill="#3b82f6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`);
const mkHedge = () => put(670, 668, 0.9, hedgehog([[12.0, 13.4], [19.4, 20.8]], { noShadow: true,
  eyes: [[0, 12.0, 'side'], [12.0, 17.0, 'wide'], [17.0, 19.3, 'side'], [19.3, 30, 'arc']],
  moods: [[0, 12.0, 'happy'], [12.0, 17.0, 'oh'], [17.0, 19.3, 'shy'], [19.3, 30, 'happy']] }));
const hedgeEl = vis(0, 3.5, mkHedge()) + vis(10.5, 13.5, mkHedge()) + vis(17.0, 30, mkHedge());
const world = `${bg}${castleR}${castleL}${deco}${hedgeEl}${foxA}${foxB}${rabEl}${flagFox}${bigWave(13.6, 16.2, 570, { x0: -420, x1: 210, x2: -420 })}`;

// ───────── espace écran : heure, bulles, carton ─────────
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" text-anchor="middle" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" text-anchor="middle" class="bt" style="font-size:34px;fill:#2b5ba8">Le château</text>
  <text y="64" text-anchor="middle" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : Marinette</text></g></g>`;
const FH = [400, 395], RH = [1130, 655 - 330];
const fx =
  talk('rab', 'Mon château est haut !', 0.6, 1.9, RH, { dx: -60 }) +
  talk('fox', 'Voilà mon château !', 6.0, 1.7, FH, { dx: 200, up: 90 }) +
  talk('rab', 'La marée monte, Roussin !', 7.6, 2.0, RH, { dx: -90, up: 100 }) +
  talk('fox', 'Pas de problème !', 10.6, 1.4, FH, { up: 90 }) +
  talk('hedge', 'Une vague arrive !', 12.0, 1.4, [725, 668 - 195], { dx: 60, up: 80 }) +
  sfx('SPLASH !', 800, 330, 14.7, 1.0, -6, '#4fb3ff', 92, 'splash') +
  talk('fox', 'Mon château !', 17.3, 1.8, FH, { shout: true, dx: 170, up: 110 }) +
  talk('hedge', 'Je t’aide, Roussin !', 19.4, 1.5, [725, 668 - 195], { dx: 0, up: 80 }) +
  talk('rab', 'Le mien est resté haut.', 20.9, 1.6, RH, { dx: -90 }) +
  talk('fox', 'Je bâtis plus haut !', 22.0, 1.3, FH, { dx: 140, up: 90 }) +
  talk('rab', 'Viens, on partage !', 23.2, 1.2, RH, { dx: -90 }) +
  talk('fox', 'Un château pour deux !', 24.5, 1.6, [600, 395], { dx: -20, up: 90 }) +
  talk('rab', 'C\u2019est rigolo !', 26.0, 1.0, RH, { up: 90 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(10, 45)}
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.3 }, { name: 'poof', t: 6.0 }, { name: 'wave', t: 13.6 }, { name: 'laugh', t: 26.0 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./chateau.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
