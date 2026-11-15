// Roussin & Lino · Saison 3 · Épisode 2 « Premier regard » — 30 s, 1280x720. 9h00, la dune puis la plage.
//
// Découpage :
//  0.0– 3.4  plan large     une dune cache la mer ; Lino : « Neuf heures pile ! » — Roussin renifle : « Ça sent le sel ! »
//  3.4– 7.2  Piquette        elle serre les yeux : « Je ferme les yeux ! » — Lino : « Je te tiens la main. »
//  7.2–10.4  le décompte      Roussin : « Un, deux, trois ! »
// 10.4–13.2  la révélation    la dune s'affaisse : la mer apparaît ; Roussin : « Quel grand ciel bleu ! »
// 13.2–15.2  le gag           Roussin penche la tête : « Il est couché par terre ! »
// 15.2–17.0  Lino             « C'est la mer, Roussin ! » (mouette)
// 17.0–19.6  Piquette         yeux fermés : « Elle est comment ? » — Lino : « Grande, bleue, et douce. »
// 19.6–22.8  Piquette         elle ouvre un oeil, puis les deux : « Elle est si belle ! »
// 22.8–27.2  plan large      une vague gonfle ; Roussin salue : « Bonjour, la belle mer ! »
// 27.2–30.0  carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { seaBg, gull } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.4, 620, 700, 1.25, 1.3],
  [3.4, 7.2, 620, 700, 1.4, 1.45],
  [7.2, 10.4, 620, 700, 1.3, 1.35],
  [10.4, 13.2, 640, 700, 1.1, 1.15],
  [13.2, 15.2, 620, 700, 1.45, 1.5],
  [15.2, 17.0, 620, 700, 1.35, 1.4],
  [17.0, 19.6, 620, 700, 1.4, 1.45],
  [19.6, 22.8, 620, 700, 1.4, 1.45],
  [22.8, 27.2, 620, 700, 1.2, 1.25],
  [27.2, 30, 640, 700, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const sayAt = (w, tx, a, d, M, o = {}) => {
  const fs = o.shout ? 50 : 41, h = fs + 34, bw = tx.length * fs * 0.56 + 56;
  const [px, py] = scr(M[0], M[1], a + 0.1);
  let bx = o.bx ?? px + (o.dx || 0), by = o.by ?? Math.max(py - 30 - h / 2, h / 2 + 16);
  const left = Math.min(Math.max(bx, bw / 2 + 16), W - 16 - bw / 2) - bw / 2;
  if (left < 270 && by - h / 2 < 134) bx = bw / 2 + 276;
  return say(w, tx, a, d, { bx, by, tips: [[px, py]], shout: o.shout });
};

const LN = {
  sel: ['fox', 'Ça sent le sel !', 2.2, 1.2],
  yeux: ['hedge', 'Je ferme les yeux !', 3.8, 1.6],
  trois: ['fox', 'Un, deux, trois !', 7.8, 1.9],
  ciel: ['fox', 'Quel grand ciel bleu !', 11.0, 1.9],
  couche: ['fox', 'Il est couché par terre !', 13.3, 1.8],
  mer: ['rab', 'C’est la mer, Roussin !', 15.4, 1.5],
  comment: ['hedge', 'Elle est comment ?', 17.2, 1.4],
  grande: ['rab', 'Grande, bleue, et douce.', 18.7, 1.6],
  belle: ['hedge', 'Elle est si belle !', 20.9, 1.7],
  bonjour: ['fox', 'Bonjour, la belle mer !', 23.2, 1.8],
};
const tw = (who) => Object.values(LN).filter((l) => l[0] === who).map((l) => [l[2] + 0.05, l[2] + l[3] - 0.1]);

// ───────── décor : la plage cachée derrière une dune qui s'affaisse ─────────
const tufts = Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 80, y = 318 + Math.sin(i * 1.7) * 16; return `<path d="M${x} ${y + 6} l-14 -30 M${x} ${y + 6} l2 -38 M${x} ${y + 6} l16 -28" stroke="#4f9a5a" stroke-width="7" fill="none" stroke-linecap="round"/>`; }).join('');
const dune = `<g><path d="M-40 310 Q200 262 420 300 Q640 250 860 296 Q1080 262 1320 305 V620 H-40Z" fill="#f6dfa0"/>
  <path d="M-40 310 Q200 262 420 300 Q640 250 860 296 Q1080 262 1320 305" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <path d="M-40 470 Q300 440 600 470 T1320 470" stroke="#ecd08a" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>${tufts}</g>`;
const duneEl = tf(dune, { t0: 10.1, d: 1.1, from: 'translateY(0px)', to: 'translateY(520px)', e: 'cubic-bezier(.5,0,.9,.6)' });
const bg = `${seaBg('day', { shells: false })}${gull(330, 190, 0.8, 0)}${gull(820, 140, 0.6, 1.2)}${duneEl}`;

// ───────── personnages ─────────
const FY = 640;
const tilt = (t) => ({ x: 0, y: 0, r: t < 13.0 ? 0 : t < 13.5 ? -26 * ss((t - 13.0) / 0.5) : t < 15.0 ? -26 : t < 15.6 ? -26 * (1 - ss((t - 15.0) / 0.6)) : 0 });
const foxEl = put(870, FY, 1.0, track(fox({ run: null, upright: -6, talk: tw('fox'), raise: [[23.5, 25.2]],
  eyes: [[0, 2.2, 'side'], [2.3, 3.4, 'arc'], [7.8, 9.8, 'arc'], [10.5, 12.9, 'wide'], [13.0, 15.0, 'up'], [23.3, 25.4, 'arc']],
  moods: [[0, 7.7, 'happy'], [10.4, 13.0, 'oh'], [13.0, 15.2, 'happy'], [15.2, 22.8, 'happy'], [23.0, 30, 'happy']] }), 12.9, 15.6, tilt, 30));
const rabEl = put(340, FY, 1.0, rabbit({ run: null, talk: tw('rab'),
  eyes: [[0, 30, 'side']], moods: [[0, 30, 'happy']] }));
const hedgeEl = put(560, FY, 1.0, hedgehog(tw('hedge'), {
  eyes: [[0, 20.9, 'closed'], [20.9, 21.5, 'side'], [21.5, 23.0, 'wide'], [23.0, 30, 'arc']],
  moods: [[0, 20.9, 'shy'], [20.9, 30, 'happy']], blush: [[3.8, 7.2], [17.2, 20.9]] }));

const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Premier regard</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la plage</text></g></g>`;
const HM = [615, FY - 205], FMp = [940, FY - 245], RMp = [394, FY - 318];
const S = (k, M, o) => sayAt(LN[k][0], LN[k][1], LN[k][2], LN[k][3], M, o);
const MM = { rab: RMp, fox: FMp, hedge: HM };
const fx = timeBadge(9, 0) +
  S('sel', FMp) + S('yeux', HM) + S('trois', FMp) + S('ciel', FMp) + S('couche', FMp) +
  S('mer', RMp) + S('comment', HM) + S('grande', RMp) + S('belle', HM) + S('bonjour', FMp) +
  sfx('SNIF !', 1000, 330, 2.2, 0.8, 6, '#ffd23f', 64) + sfx('SCHHH...', 640, 230, 10.4, 1.2, -4, '#ffffff', 74) + sfx('PIOU !', 900, 280, 15.4, 0.8, 6, '#ffffff', 56) + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${bg}${rabEl}${hedgeEl}${foxEl}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 0.3 }, { name: 'sniff', t: 2.2 }, { name: 'step', t: 6.0 }, { name: 'wave', t: 10.4 }, { name: 'chirp', t: 15.4 }, { name: 'wave', t: 23.4 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./premier-regard.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 110, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
