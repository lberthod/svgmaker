// Roussin & Lino · Saison 5 · Épisode 2 « Les rôles » — 30 s, 1280x720. 9h00, la classe : les rôles tirés du chapeau.
//
//  0.0– 3.5  plan large     Mme Chouette : « Tirez vos rôles ! » ; les papiers volent du chapeau vers chacun
//  3.5– 7.0  Chouette+Roussin  il ouvre son papier : « Le soleil ! »
//  7.0–10.0  Roussin+Lino   « La lune ! »
// 10.0–12.5  Piquette       « La petite étoile ? » (timide)
// 12.5–16.0  Mimi et Coin    « Nous, les nuages ! »
// 16.0–19.5  Chouette+Roussin  « Pose ton croissant, Roussin ! » — « Non ! Mon croissant ! » (ventre : tummy)
// 19.5–23.0  Roussin         costume de soleil, croissant levé en guise de rayon : « C'est mon rayon ! »
// 23.0–27.0  plan large     Lino : « Un soleil gourmand ! » — Chouette : « Tu brilles, Roussin ! »
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, tf, sfx, fox, rabbit, owl, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, croissant, pal } from '../../lib/props.mjs';
import { wall, banner, board } from '../../lib/classroom.mjs';
import { costume, costumeBack } from '../../lib/theatre.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { mover, mkActors, mkSay, checkFraming } from '../_h123.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.0],
  [3.5, 7.0, 298, 501, 2.15, 2.15],
  [7.0, 10.0, 501, 500, 2.14, 2.14],
  [10.0, 12.5, 1035, 531, 2.61, 2.61],
  [12.5, 16.0, 1035, 531, 2.61, 2.61],
  [16.0, 19.5, 298, 501, 2.15, 2.15],
  [19.5, 23.0, 298, 501, 2.15, 2.15],
  [23.0, 27.0, 640, 400, 1.0, 1.0],
  [27.0, 30, 640, 400, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const FY = 650, S = 0.95;
const X = { owl: 110, fox: 320, rab: 680, hedge: 910, mimi: 1075, coin: 1195 };
const ACT = mkActors([
  { id: 'owl', x: X.owl, y: FY, s: S, hl: 70, hr: 70 },
  { id: 'fox', x: X.fox, y: FY, s: S, hl: 95, hr: 160 },
  { id: 'rab', x: X.rab, y: FY, s: S, hl: 62, hr: 90 },
  { id: 'hedge', x: X.hedge, y: FY + 6, s: S, hl: 100, hr: 95 },
  { id: 'mimi', x: X.mimi, y: FY, s: S, hl: 45, hr: 45 },
  { id: 'coin', x: X.coin, y: FY, s: S, hl: 45, hr: 45 },
]);
const say = mkSay(scr, ACT);

const bg = `${wall.replace(/<g transform="translate\(900 470\)">[\s\S]*?<\/g>/, '')}${banner}${board(`<text x="586" y="190" style="font-size:60px;fill:#e8f2e0">Les rôles</text><text x="586" y="262" style="font-size:40px;fill:#ffe27a">« La petite étoile »</text>`)}`;

const giggle = (inner, a, b) => `<g style="animation:${ao({ n: 'giggle', d: 0.16, t: a, c: Math.round((b - a) / 0.16), dir: 'alternate' })}">${inner}</g>`;
const owlEl = put(X.owl, FY, S, owl([[0.6, 2.2], [16.2, 18.0], [25.1, 26.6]], { happyAt: 99, watchAt: null, look: [[0, 30, 0]] }));
const foxEl = put(X.fox, FY, S, fox({ run: null, upright: -6, noShadow: true, raise: [[20.0, 24.0]], talk: [[4.1, 5.4], [18.0, 19.6], [20.4, 21.9]],
  eyes: [[3.8, 5.6, 'wide'], [5.6, 16.0, 'arc'], [16.0, 18.0, 'side'], [18.0, 19.8, 'wide'], [20.2, 24.0, 'arc'], [24.0, 30, 'arc']],
  moods: [[3.8, 5.6, 'oh'], [5.6, 16.0, 'happy'], [18.0, 19.8, 'sad'], [20.2, 30, 'happy']] }));
const rabEl = put(X.rab, FY, S, rabbit({ run: null, noShadow: true, talk: [[7.3, 8.6], [23.1, 24.6]],
  eyes: [[7.1, 8.8, 'wide'], [8.8, 20, 'arc'], [20, 30, 'arc']], moods: [[7.1, 8.8, 'oh'], [8.8, 30, 'happy']] }));
const hedgeEl = put(X.hedge, FY + 6, S, hedgehog([[10.4, 12.2]], { noShadow: true, eyes: [[10.2, 12.4, 'down'], [12.4, 30, 'arc']], moods: [[10.2, 12.4, 'shy'], [12.4, 30, 'happy']], blush: [[10.2, 13.5]] }));
const mimiEl = put(X.mimi, FY, S, giggle(pal('mouse', { talk: [[12.7, 14.3]], eyes: [[12.5, 14.5, 'wide'], [14.5, 30, 'arc']], moods: [[12.5, 14.5, 'oh'], [14.5, 30, 'happy']] }), 14.6, 16.0));
const coinEl = put(X.coin, FY, S, giggle(pal('duck', { eyes: [[12.5, 14.5, 'wide'], [14.5, 30, 'arc']], moods: [[12.5, 14.5, 'oh'], [14.5, 30, 'happy']] }), 14.6, 16.0));

// chapeau tenu par Mme Chouette
const HAT = [200, 560];
const hat = `<g transform="translate(${HAT[0]} ${HAT[1]}) scale(.7)"><ellipse cy="6" rx="52" ry="12" fill="#2b2b3a" stroke="${INK}" stroke-width="5"/><path d="M-34 6 V-56 H34 V6Z" fill="#3a3a52" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-34" y="-26" width="68" height="12" fill="#e8434e" stroke="${INK}" stroke-width="3"/><ellipse cy="-56" rx="34" ry="9" fill="#14141f" stroke="${INK}" stroke-width="4"/></g>`;

// papiers : plié (crème) puis carte avec icône
const CARDBG = { sun: '#fff', moon: '#34408a', star: '#fff', cloud: '#a9d6ff' };
const cardArt = (kind) => `<rect x="-55" y="-55" width="110" height="110" rx="16" fill="${CARDBG[kind]}" stroke="${INK}" stroke-width="5"/>${costume(kind, 0, 4, kind === 'cloud' ? 0.7 : 0.72)}`;
const paper = (kind, tr, to, chest, extra = []) => {
  const art = `${cardArt(kind)}${vis(0, tr, `<rect x="-55" y="-55" width="110" height="110" rx="16" fill="#f3e4c0" stroke="${INK}" stroke-width="5"/><path d="M-55 -10 H55 M0 -55 V55" stroke="#d8c293" stroke-width="4"/>`)}`;
  return mover(art, [[2.4, HAT[0], HAT[1], 0, 0.25], [3.3, chest[0], chest[1], 10, 0.3], [tr, chest[0], chest[1], 10, 0.3], [tr + 0.4, chest[0], chest[1] + 8, -4, 0.6], ...extra, [to, chest[0], chest[1] + 8, -4, 0.6]]);
};
const chestOf = (x, k = 95) => [x + 40, FY - k * S];
const cards = paper('sun', 4.0, 19.5, chestOf(X.fox, 80)) + paper('moon', 7.2, 30, chestOf(X.rab, 90)) + paper('star', 10.4, 30, chestOf(X.hedge, 70)) +
  paper('cloud', 12.7, 30, chestOf(X.mimi, 45)) + paper('cloud', 12.7, 30, chestOf(X.coin, 45));

// croissant : dans le sac → serré contre lui → rayon levé
const cro = mover(`<g>${croissant}</g>`, [
  [0.0, X.fox - 38 * S, FY - 168 * S, 40, 0.85], [18.0, X.fox - 38 * S, FY - 168 * S, 40, 0.85], [18.5, X.fox + 40, FY - 85 * S, -10, 0.95], [19.8, X.fox + 40, FY - 85 * S, -10, 0.95],
  [20.4, X.fox + 6, FY - 236 * S, 8, 1.0], [30, X.fox + 6, FY - 236 * S, 8, 1.0]]);
// costume de soleil derrière Roussin
const sunBack = vis(20.3, 99, tf(`<g transform="translate(${X.fox + 10} ${FY - 100 * S}) scale(${S})">${costumeBack('sun', 0, 0, 1.35)}</g>`, { t0: 20.3, d: 0.5, from: 'scale(0.1)', to: 'scale(1)', e: 'cubic-bezier(.3,1.6,.5,1)', o: `${X.fox + 10}px ${FY - 100 * S}px` }));
const ventre = vis(19.6, 20.4, `<g transform="translate(${X.fox + 10} ${FY - 80 * S})"><g style="${an({ n: 'jolt', d: 0.5, t: 19.7 })}"><circle r="12" fill="none"/></g></g>`);

const world = `${bg}${sunBack}${owlEl}${foxEl}${hat}${rabEl}${hedgeEl}${mimiEl}${coinEl}${cro}${cards}`;

const fx = timeBadge(9, 0) +
  say('owl', 'Tirez vos rôles !', 0.6, 1.6) +
  say('fox', 'Le soleil !', 4.1, 1.3, { shout: true }) +
  say('rab', 'La lune !', 7.3, 1.3, { shout: true, bxo: -170, tall: 215 }) +
  say('hedge', 'La petite étoile ?', 10.4, 1.8) +
  say('mimi', 'Nous, les nuages !', 12.7, 1.6) +
  say('owl', 'Pose ton croissant, Roussin !', 16.2, 1.8) +
  say('fox', 'Non ! Mon croissant !', 18.0, 1.6) +
  sfx('GRRR...', 340, 520, 19.8, 0.9, -6, '#ffd23f', 60) +
  say('fox', 'C’est mon rayon !', 20.4, 1.6) +
  say('rab', 'Un soleil gourmand !', 23.1, 1.6) +
  say('owl', 'Tu brilles, Roussin !', 25.0, 1.7, { bxo: 40 });
const card = endCard5(27.5, 'Les rôles', 'Prochain épisode : la salle');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe9bd"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}${card}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'whoosh', t: 2.4 }, { name: 'chime', t: 4.0 }, { name: 'chime', t: 7.2 }, { name: 'chime', t: 10.4 }, { name: 'chime', t: 12.7 },
  { name: 'tummy', t: 19.8 }, { name: 'chime', t: 20.4 }, { name: 'laugh', t: 24.9 }, { name: 'chime', t: 27.5 });
checkFraming(SHOTS, ACT, 's5e02');
writeFileSync(new URL('./les-roles.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 108, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
