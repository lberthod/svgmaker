// Roussin & Lino · Saison 4 · Épisode 15 « La veillée » — 30 s, 1280x720. 20h30, devant la cheminée. FIN DE LA SAISON 4.
// Gag : Mamie Marmotte raconte une histoire pour endormir les enfants, mais c'est elle qui s'endort la première (anticipation) ;
// les enfants s'endorment un à un, Rouge-Gorge dans le bonnet de Roussin (action) ; elle se réveille en sursaut, voit tout le monde
// endormi, souffle sur le feu et dit bonne nuit (réaction).
//
//  0.0– 4.0  plan large   20 h 30, la cheminée, les étoiles à la fenêtre ; Mamie : « Il était une fois... »
//  4.0– 8.0  Mamie        « Elle dormait tout l'hiver... »
//  8.0–12.0  les enfants  Lino : « Moins dix dehors ! » puis « Un pull, c'est plus cinq ! » (thermomètre)
// 12.0–16.0  Mamie        « Et alors la marmotte... » elle s'endort au milieu de la phrase
// 16.0–21.0  plan large   les enfants s'endorment un à un : « Bonne nuit... »
// 21.0–25.5  plan large   Mamie se réveille : « Oh ! Tout le monde dort... » ; « Bonne nuit, les amis. » ; elle souffle sur le feu
// 25.5–30.0  plan large   noir doux, étoiles ; carton « Fin de la saison 4 »
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0, bird } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { marmot, lynx } from '../../lib/cast4.mjs';
import { chaletInside, fireplace, thermometer, foxBeanie, FLOOR } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 4.0, 640, 400, 1.1, 1.14],
  [4.0, 8.0, 868, 440, 1.9, 1.95],
  [8.0, 12.0, 413, 430, 1.55, 1.55],
  [12.0, 16.0, 868, 440, 1.9, 1.95],
  [16.0, 21.0, 640, 400, 1.1, 1.1],
  [21.0, 25.5, 640, 400, 1.1, 1.1],
  [25.5, 30, 640, 400, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes e15dim{from{opacity:0}to{opacity:.7}}
@keyframes e15blow{0%{opacity:0;transform:translate(0,0) scale(.4)}30%{opacity:.9}100%{opacity:0;transform:translate(-90px,20px) scale(1.4)}}`);

const FY = 600;
const zzz = (x, y, t0, fs = 40) => [0, 1.5, 3].map((d) => vis(t0 + d, t0 + d + 1.6, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'c4zzz', d: 1.6, t: t0 + d, f: 'both' })}"><text style="font-size:${fs}px;fill:#fff;stroke:${INK};stroke-width:5px;paint-order:stroke;font-weight:900">z</text></g></g>`)).join('');

// ───────── personnages ─────────
const lynxEl = put(250, FY, 1.15, lynx([[19.5, 21.0]], { noBook: true, noShadow: true,
  eyes: [[0, 19.2, 'arc'], [19.9, 30, 'closed']], moods: [[0, 19.2, 'happy'], [19.9, 30, 'calm']] }));
const rabEl = put(425, FY, 0.9, rabbit({ run: null, noShadow: true,
  talk: [[8.1, 9.7], [10.0, 12.0], [18.0, 19.5], [26.0, 27.1]],
  eyes: [[0, 8.0, 'arc'], [8.0, 12.0, 'wide'], [12.2, 17.6, 'arc'], [18.0, 19.6, 'sq'], [19.8, 25.9, 'closed'], [25.9, 27.2, 'sq'], [27.2, 30, 'closed']],
  moods: [[0, 30, 'happy']] }));
const foxEl = put(650, FY, 0.9, fox({ run: null, upright: -6, noBag: true, noShadow: true,
  hat: [[0, 99, foxBeanie(0)]],
  talk: [[16.4, 18.0], [25.0, 26.0]],
  eyes: [[0, 16.2, 'arc'], [16.4, 18.0, 'sq'], [18.2, 24.9, 'closed'], [24.9, 26.2, 'sq'], [26.2, 30, 'closed']],
  moods: [[0, 30, 'happy']] }));
const marEl = put(960, FY, 0.95, marmot([[0.6, 2.3], [4.2, 6.6], [12.4, 14.6], [21.4, 23.6], [23.7, 25.2]], { noShadow: true,
  sleep: [[14.9, 21.2]], eyes: [[21.2, 24.0, 'wide']], moods: [[21.2, 21.6, 'yawn'], [21.6, 23.6, 'calm'], [24.0, 30, 'calm']] }), true);
// Rouge-Gorge dort sur le bonnet de Roussin
const birdEl = `<g transform="translate(712 350) scale(1.2)">${bird(false, false)}</g>`;
const zz = zzz(1000, 380, 15.0, 44) + zzz(765, 330, 18.6, 34) + zzz(475, 330, 19.6, 34) + zzz(312, 380, 20.4, 34);

// feu : allumé jusqu'à 24.6 ; Mamie souffle
const fire = vis(0, 24.6, fireplace(1050, FLOOR + 10, 1, { fire: true }));
const blow = [0, 1, 2].map((i) => vis(24.0 + i * 0.1, 25.2, `<g transform="translate(${880 - i * 6} ${470 + i * 12})"><g style="${an({ n: 'e15blow', d: 1.0, t: 24.0 + i * 0.1, f: 'both' })}"><circle r="${12 + i * 5}" fill="#fff" stroke="#a9c8e8" stroke-width="2.5"/></g></g>`)).join('');
const dim = `<rect x="-300" y="-300" width="1900" height="1300" fill="#0a0f2e" style="opacity:0;${an({ n: 'e15dim', d: 1.4, t: 24.6, f: 'both' })}"/>`;

const world = `${chaletInside({ clock: false, view: 'night', fire: false })}${fire}${thermometer(120, 490, 0.8, { temp: -10 })}
  ${lynxEl}${rabEl}${foxEl}${birdEl}${marEl}${zz}${blow}${dim}`;

// ───────── espace écran ─────────
const MH = [922, 382], LH = [290, 372], RH = [447, 335], FH = [715, 352];
const hud = timeBadge(20, 30);
const sayH = (who, tx, a, d, m, o = {}) => { const p = scr(m[0], m[1], a + 0.3); return say(who, tx, a, d, { bx: Math.max(p[0] + (o.ox || 0), 420), by: Math.max(p[1] - 100, 58), tips: [[p[0], p[1] - 4]], ...o }); };
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-340" y="-86" width="680" height="210" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-340" y="-86" width="680" height="210" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="26" class="bt" style="font-size:36px;fill:#2b5ba8">La veillée</text>
  <text y="76" class="bt" style="font-size:32px;fill:#e8434e">Fin de la saison 4</text></g></g>`;
const fx = hud +
  sayH('marmot', 'Il était une fois...', 0.6, 1.9, MH) +
  sayH('marmot', 'Elle dormait tout l’hiver...', 4.2, 2.6, MH) +
  sayH('rab', 'Moins dix dehors !', 8.1, 1.7, RH, { ox: 60 }) +
  sayH('rab', 'Un pull, c’est plus cinq !', 10.0, 1.9, RH, { ox: 60 }) +
  sayH('marmot', 'Et alors la marmotte...', 12.3, 2.4, MH) +
  sayH('fox', 'Bonne nuit, Lino...', 16.4, 1.7, FH) +
  sayH('rab', 'Bonne nuit, Roussin...', 18.0, 1.8, RH, { ox: 60 }) +
  sayH('lynx', 'Bonne nuit, tout le monde...', 19.6, 2.0, LH, { ox: 120 }) +
  sayH('marmot', 'Au printemps, elle se réveilla !', 21.4, 2.2, MH) +
  sayH('marmot', 'Bonne nuit, les amis.', 23.7, 1.2, MH) +
  sayH('fox', 'Merci, Mamie...', 25.0, 1.0, FH) +
  sayH('rab', 'À demain, Roussin...', 26.0, 1.1, RH, { ox: 60 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#2a1a10"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'yawn', t: 14.8 }, { name: 'yawn', t: 17.0 }, { name: 'yawn', t: 19.0 }, { name: 'chime', t: 21.2 },
  { name: 'yawn', t: 21.5 }, { name: 'whoosh', t: 24.1 }, { name: 'bell', t: 27.2 });
writeFileSync(new URL('./veillee.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 84, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
