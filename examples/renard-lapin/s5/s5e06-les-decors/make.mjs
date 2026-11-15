// Roussin & Lino · Saison 5 · Épisode 6 « Les décors » — 30 s, 1280x720. 13h30, la scène de la salle des fêtes.
//
// Découpage :
//  0.0– 3.2  plan large     Bastien : « Trois planches et demie ! » (pastille 13 h 30)
//  3.2– 6.4  Papi Bernard   « Je suis Papi Bernard ! »
//  6.4–11.2  l'arbre        l'arbre en carton se dresse ; Plouf : « Moi, je peins l'arbre ! »
// 11.2–14.4  plan large     Plouf saute : SPLASH, une éclaboussure géante rose sur l'arbre
// 14.4–17.0  Bastien         « C'est rose ! Très rose ! » — « Je vérifie que ça tient. »
// 17.0–20.8  le gag         un coup de queue... l'arbre se plie comme un ressort (BOING)
// 20.8–26.4  plan large     réactions de tous
// 26.4–30.0  plan large     carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { badger, frog } from '../../lib/cast2.mjs';
import { beaver } from '../../lib/cast5.mjs';
import { stage, backdrop, cardTree, paintSplat, paintCan, brush, blueprint, planks, ladder } from '../../lib/theatre.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.2, 640, 400, 1.0, 1.05],
  [3.2, 6.4, 400, 450, 1.6, 1.6],
  [6.4, 11.2, 720, 420, 1.6, 1.6],
  [11.2, 14.4, 640, 400, 1.1, 1.1],
  [14.4, 17.0, 780, 420, 1.3, 1.3],
  [17.0, 20.8, 720, 420, 1.6, 1.6],
  [20.8, 26.4, 640, 400, 1.1, 1.1],
  [26.4, 30, 640, 400, 1.08, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const L = [
  { w: 'beaver', t: 'Trois planches et demie !', a: 0.5, d: 2.3, m: 'happy' },
  { w: 'badger', t: 'Je suis Papi Bernard !', a: 3.4, d: 1.6, m: 'happy' },
  { w: 'badger', t: "Je tiens l'échelle !", a: 5.1, d: 1.5, m: 'happy' },
  { w: 'frog', t: 'Moi, je peins l\'arbre !', a: 7.2, d: 1.8, m: 'happy' },
  { w: 'beaver', t: 'Pas trop de peinture !', a: 9.2, d: 1.8, m: 'oh' },
  { w: 'frog', t: 'Attention, ça éclabousse !', a: 11.4, d: 1.5, m: 'happy', sh: true, o: [40, -170] },
  { w: 'beaver', t: "C'est rose ! Très rose !", a: 14.6, d: 1.9, m: 'oh' },
  { w: 'beaver', t: 'Je vérifie que ça tient.', a: 17.0, d: 1.4, m: 'happy' },
  { w: 'badger', t: 'L’arbre est tout plié !', a: 20.9, d: 1.9, m: 'oh', sh: true },
  { w: 'frog', t: 'Ça saute, c’est rigolo !', a: 22.9, d: 1.6, m: 'happy' },
  { w: 'beaver', t: 'Trois planches... et un ressort !', a: 24.6, d: 1.8, m: 'happy' },
];
const talk = (w) => L.filter((l) => l.w === w).map((l) => [l.a + 0.1, l.a + l.d - 0.15]);
const moods = (w) => L.filter((l) => l.w === w).map((l) => [l.a, l.a + l.d, l.m]);

const FY = 600, X = { badger: 140, frog: 470, tree: 690, beaver: 890 };
const HEAD = { beaver: [X.beaver + 60, FY - 240], badger: [X.badger + 55, FY - 315], frog: [X.frog + 20, FY - 215] };

// ───────── décor ─────────
const TREE_FOLD = 18.2;
const treeEl = vis(6.6, 99, tf(`${cardTree(X.tree, FY + 10, 1.0, { fold: TREE_FOLD })}
  <g transform="translate(${X.tree} ${FY + 10})"><g style="transform-origin:0px 0px;${an({ n: 't5accord', d: 0.9, t: TREE_FOLD, f: 'both', e: 'ease-in' })}">${paintSplat(0, -230, 12.7, 1.0)}</g></g>`,
  { t0: 6.6, d: 0.5, from: 'scale(.3)', to: 'scale(1)', e: 'cubic-bezier(.3,1.4,.5,1)', o: `${X.tree}px ${FY + 10}px` }));
const props = vis(0, 6.6, planks(330, FY + 8, 0.8, 4)) + ladder(235, FY + 6, 1.0, 250) + paintCan(560, FY + 8, 1.0);
const bg = stage({ backdrop: backdrop('plain') });
const badge = timeBadge(13, 30);

// ───────── personnages ─────────
const badgerEl = put(X.badger, FY, 1.0, badger(talk('badger'), { moods: moods('badger'), noShadow: false, eyes: [[3.4, 6.1, 'arc'], [20.9, 22.8, 'wide'], [22.9, 26, 'arc']] }));
const frogEl = put(X.frog, FY, 1.0, frog(talk('frog'), { moods: moods('frog'), item: brush('#ff6f95'), jumps: [[12.1, 12.9, 70]], eyes: [[7.2, 9, 'arc'], [11.4, 13, 'wide'], [22.9, 25, 'arc']] }));
const beaverEl = put(X.beaver, FY, 1.0, beaver(talk('beaver'), { moods: moods('beaver'), tail: [17.95], item: blueprint, eyes: [[9.2, 11, 'wide'], [14.6, 16.5, 'wide'], [20.9, 22.5, 'wide'], [24.6, 26.5, 'arc']] }));
const world = `${bg}${props}${badgerEl}${frogEl}${treeEl}${beaverEl}`;

// ───────── espace écran ─────────
const sayL = (l) => {
  const tm = l.a + l.d / 2, hp = HEAD[l.w], [sx, sy] = scr(hp[0], hp[1], tm), off = l.o || [0, -125];
  const fs = l.sh ? 50 : 41, w = l.t.length * fs * 0.56 + 56;
  let bx = sx + off[0], by = Math.max(sy + off[1], 56);
  if (by - 42 < 90 && bx - w / 2 < 240) bx = 240 + w / 2; // évite le badge d'heure
  return say0(l.w, l.t, l.a, l.d, { bx, by, tips: [[sx, sy - 6]], shout: !!l.sh, fs });
};
const endCard = endCard5(27.0, 'Les décors', 'Prochain épisode : la chanson');
const fx = badge + solid(L.map(sayL).join('')) +
  sfx('SPLASH !', 900, 150, 12.7, 0.9, -6, '#ff8fb1', 84) +
  sfx('TOC !', 760, 610, 17.95, 0.7, 6, '#ffd23f', 80) +
  sfx('BOING !', 560, 250, 18.4, 1.1, -6, '#9be08a', 96) + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'knock', t: 6.8 }, { name: 'splash', t: 12.7 }, { name: 'knock', t: 17.95 }, { name: 'boing', t: 18.3 }, { name: 'laugh', t: 23.0 }, { name: 'chime', t: 27.0 });
writeFileSync(new URL('./les-decors.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 108, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
