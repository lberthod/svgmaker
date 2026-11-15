// Roussin & Lino · Saison 3 · Épisode 6 « Marinette » — 30 s, 1280x720. 11h30, la plage, le bord de l'eau.
//
// Découpage :
//  0.0– 3.8  plan large     Marinette, la sauveteuse, ouvre sa leçon de natation ; Coin en bouée dans l'eau ; 11 h 30
//  3.8– 7.0  Marinette       « On bat des pieds ! » (Roussin écoute)
//  7.0–10.4  de loin         Lino regarde l'heure, Piquette observe de loin : « Moi, je regarde d'ici. »
// 10.4–13.5  plan moyen      « Coin, nage vers moi ! » — Coin : « Je nage ! »
// 13.5–16.8  anticipation    Marinette lève le sifflet : « Prêt ? Un, deux, trois ! »
// 16.8–20.5  l'action        PIIIT ! Coin pagaie... à l'envers, il s'éloigne vers le large
// 20.5–23.5  la réaction     Roussin : « Il nage à l'envers ! » — Coin : « Je recule vite ! »
// 23.5–27.0  plan moyen      second coup de sifflet, Coin revient ; « Je te ramène ! » — Piquette : « C'est rigolo ! »
// 27.0–30.0  plan large     carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, pal } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { otter } from '../../lib/cast3.mjs';
import { seaBg, gull, lifebuoy } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.8, 640, 430, 1.05, 1.1],
  [3.8, 7.0, 380, 470, 1.7, 1.7],
  [7.0, 10.4, 943, 455, 1.9, 1.9],
  [10.4, 13.5, 640, 430, 1.1, 1.1],
  [13.5, 16.8, 380, 470, 1.7, 1.7],
  [16.8, 20.5, 640, 430, 1.1, 1.1],
  [20.5, 23.5, 640, 430, 1.1, 1.1],
  [23.5, 27.0, 640, 430, 1.1, 1.1],
  [27.0, 30, 640, 430, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const lerp = (a, b, u) => a + (b - a) * u;
// bulle ancrée sur un point du monde ; garde la pastille d'heure libre
const talk = (who, text, t0, d, [wx, wy], o = {}) => {
  const [tx, ty] = scr(wx, wy, t0 + 0.2);
  const fs = o.shout ? 50 : 41, w = text.length * fs * 0.56 + 56;
  let bx = tx + (o.dx || 0); const by = ty - (o.up ?? 100);
  if (by < 175) bx = Math.max(bx, 300 + w / 2);
  return say(who, text, t0, d, { bx, by, tips: [[tx, ty]], shout: o.shout });
};

// ───────── décor ─────────
const bg = `${seaBg('day')}${gull(300, 130, 0.9)}${gull(820, 90, 0.7, 1.2)}`;

// ───────── Coin dans sa bouée, en pleine eau : trajectoire (t -> x, y, échelle) ─────────
const keys = [[0, 880, 445, 1], [10.4, 880, 445, 1], [12.8, 865, 452, 1], [16.7, 865, 452, 1], [20.2, 905, 372, 0.8], [23.5, 905, 372, 0.8], [26.4, 790, 452, 1], [30, 790, 452, 1]];
const coinPos = (t) => {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const [a, xa, ya, sa] = keys[i], [b, xb, yb, sb] = keys[i + 1];
  const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a))));
  return { x: lerp(xa, xb, u), y: lerp(ya, yb, u) + 5 * Math.sin(t * 5), r: 0, s: lerp(sa, sb, u) };
};
const coinBody = pal('duck', { talk: [[12.0, 13.0], [22.2, 23.6]], giggle: [[24.5, 26.5]],
  eyes: [[0, 12, 'open'], [12, 13.5, 'arc'], [16.8, 20.5, 'wide'], [20.5, 24, 'wide'], [24.4, 30, 'arc']],
  moods: [[0, 16.8, 'happy'], [16.8, 24.4, 'oh'], [24.4, 30, 'happy']] });
const coinEl = vis(0, 30, track(`${coinBody}${lifebuoy(0, -22, 0.9, '#ffd23f')}<ellipse cy="14" rx="96" ry="18" fill="#4cbcf0" stroke="${INK}" stroke-width="4"/><path d="M-70 10 q20 -12 40 0 M10 12 q20 -12 40 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`, 0, 30, coinPos, 30));

// ───────── personnages ─────────
const otterEl = put(235, 600, 1.0, otter([[0.8, 2.3], [4.0, 5.6], [10.4, 12.0], [14.0, 16.0], [17.6, 18.8], [24.0, 25.3]], {
  noShadow: false, whistle: [[0.3, 0.9], [10.0, 10.4], [16.8, 17.6], [23.5, 24.2]], point: [[17.8, 19.2]],
  eyes: [[0, 16.8, 'open'], [16.8, 20, 'wide'], [24.0, 27, 'arc']],
  moods: [[0, 16.8, 'happy'], [16.8, 20, 'oh'], [20, 30, 'happy']] }));
const foxEl = put(470, 625, 0.95, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[20.8, 22.2]],
  eyes: [[0, 4, 'side'], [16.8, 20.2, 'wide'], [20.2, 22.4, 'wide'], [22.4, 24.4, 'arc'], [24.4, 30, 'arc']],
  moods: [[0, 16.8, 'happy'], [16.8, 22.4, 'oh'], [22.4, 30, 'happy']] }));
const rabEl = put(960, 640, 1.0, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[7.4, 9.0]],
  eyes: [[0, 7.2, 'side'], [7.2, 9.2, 'up'], [16.8, 20.5, 'wide'], [24.4, 26.8, 'arc']],
  moods: [[0, 16.8, 'happy'], [16.8, 20.5, 'oh'], [20.5, 30, 'happy']] }));
const hedgeEl = put(1130, 600, 0.75, hedgehog([[9.1, 10.3], [26.0, 27.0]], { noShadow: true,
  eyes: [[0, 9.0, 'side'], [16.8, 20.5, 'wide'], [25.8, 27.4, 'arc']],
  moods: [[0, 9.0, 'shy'], [9.0, 16.8, 'shy'], [16.8, 20.5, 'oh'], [20.5, 25.8, 'shy'], [25.8, 30, 'happy']], blush: [[25.8, 27.4]] }));
const world = `${bg}${hedgeEl}${coinEl}${otterEl}${foxEl}${rabEl}`;

// ───────── espace écran : heure, bulles, carton ─────────
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" text-anchor="middle" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" text-anchor="middle" class="bt" style="font-size:34px;fill:#2b5ba8">Marinette</text>
  <text y="64" text-anchor="middle" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : les flaques</text></g></g>`;
const OH = [295, 392], FH = [505, 395], RH = [970, 320], HH = [1135, 470];
const fx =
  talk('otter', 'Leçon de natation !', 0.8, 1.6, OH, { dx: 110, up: 90 }) +
  talk('otter', 'On bat des pieds !', 4.0, 1.7, OH, { dx: 40, up: 90 }) +
  talk('rab', 'Viens, Piquette, viens !', 7.4, 1.8, RH, { dx: 300, up: 90 }) +
  talk('hedge', 'Je regarde d’ici.', 9.1, 1.3, HH, { dx: 0, up: 260 }) +
  talk('otter', 'Coin, nage vers moi !', 10.4, 1.6, OH, { dx: 120, up: 100 }) +
  talk('coin', 'Je nage !', 12.0, 1.0, [790, 287], { dx: 40, up: 90 }) +
  talk('otter', 'Prêt ? Un, deux, trois !', 14.0, 2.2, OH, { dx: 20, up: 90 }) +
  sfx('PIIIT !', 200, 270, 0.3, 0.7, -6, '#ffd23f', 70, 'click') +
  sfx('PIIIT !', 330, 175, 10.0, 0.6, -6, '#ffd23f', 70, 'click') +
  sfx('PIIIT !', 200, 270, 16.8, 1.0, -6, '#ffd23f', 86, 'click') +
  talk('otter', 'Pas par là !', 17.8, 1.3, OH, { dx: 160, up: 100, shout: true }) +
  talk('fox', 'Il nage à l’envers !', 20.8, 1.5, FH, { dx: 20, up: 95 }) +
  talk('coin', 'Je recule vite !', 22.2, 1.4, [905, 240], { dx: -20, up: 80 }) +
  talk('otter', 'Je te ramène !', 24.0, 1.3, OH, { dx: 60, up: 90 }) +
  talk('hedge', 'C’est rigolo !', 26.0, 1.0, HH, { dx: -100, up: 90 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(11, 30)}
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.3 }, { name: 'splash', t: 12.2 }, { name: 'click', t: 16.9 }, { name: 'splash', t: 18.0 }, { name: 'click', t: 23.6 }, { name: 'step', t: 25.5 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./marinette.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 120, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
