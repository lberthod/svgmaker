// Roussin & Lino · Saison 4 · Épisode 9 « Les raquettes » — 30 s, 1280x720. 14h15, la neige devant le chalet.
//
// Découpage :
//  0.0– 3.5  plan large     Bouquet distribue les raquettes : « Allez, allez ! Des raquettes ! »
//  3.5– 7.0  Bouquet, Lino   « On marche bien droit ! »
//  7.0–10.5  Roussin         ses raquettes sont à l'envers : « Elles sont bizarres, non ? » ; il part en tournant
// 10.5–15.2  plan large     Roussin tourne en rond ; « Je tourne en rond ! » ; Bouquet : « Roussin, regarde tes pieds ! »
// 15.2–21.5  tout le monde  ses traces dessinent un cœur (vue d'en haut de Rouge-Gorge) ; Flocon : « Joli... un grand cœur. »
// 21.5–27.0  tout le monde  Rouge-Gorge fier sur le bonnet ; « Je l'ai fait exprès ! » ; « Bravo, Roussin ! »
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0, bird, stars } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { ibex, lynx } from '../../lib/cast4.mjs';
import { snowBg, snowfall, pine, snowshoe, heartTracks, foxBeanie } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 620, 420, 1.0, 1.05],
  [3.5, 7.0, 400, 460, 1.5, 1.55],
  [7.0, 10.5, 620, 470, 1.35, 1.35],
  [10.5, 15.2, 640, 400, 1.0, 1.0],
  [15.2, 21.5, 640, 380, 1.05, 1.05],
  [21.5, 27.0, 640, 380, 1.05, 1.05],
  [27.0, 30, 640, 420, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);
const FY = 640;

// ───────── personnages ─────────
const shoe = (flip = false) => snowshoe(10, 6, 0.95, flip);
const ibexEl = `<g transform="translate(230 ${FY})">${shoe()}${ibex([[0.5, 2.8], [12.6, 14.4], [24.4, 26.4]], { noShadow: true,
  eyes: [[0, 30, 'open']], moods: [[0, 30, 'happy']] })}</g>`;
const rabEl = `<g transform="translate(470 ${FY})">${shoe()}${rabbit({ run: null, noShadow: true, noBag: true,
  talk: [[3.6, 5.2], [11.2, 12.2], [20.8, 22.2]],
  eyes: [[0, 7, 'arc'], [7, 30, 'open']], moods: [[0, 30, 'happy']] })}</g>`;
const spinPhase = (t) => Math.min(1, Math.max(0, (t - 8.6) / 0.8)) * (1 - Math.min(1, Math.max(0, (t - 14.4) / 0.8)));
const foxFn = (t) => {
  const k = spinPhase(t), A = 60 * k, a = ((t - 8.6) * 2 * Math.PI) / 2.2;
  return { x: 760 + A * Math.sin(a), y: FY + 0.2 * A * (Math.cos(a) - 1), sx: (1 - k) + k * Math.cos(((t - 8.6) * 2 * Math.PI) / 0.9) };
};
const foxEl = track(`${shoe(true)}${fox({ run: null, upright: -6, noShadow: true, noBag: true,
  hat: [[0, 99, foxBeanie(0)]],
  talk: [[7.2, 8.8], [10.8, 12.0], [22.4, 23.8]],
  eyes: [[0, 7, 'arc'], [7.2, 8.6, 'wide'], [8.6, 15.2, 'wide'], [15.2, 19.5, 'spiral'], [19.5, 22.2, 'wide'], [22.2, 30, 'arc']],
  moods: [[0, 7, 'happy'], [7.2, 8.6, 'oh'], [8.6, 15.2, 'oh'], [15.2, 19.5, 'shy'], [22.2, 30, 'happy']],
  overHead: vis(15.2, 19.5, `<g transform="translate(70 -250)">${stars(50)}</g>`) }
)}`, 0, DUR, foxFn, 15);
const lynxEl = `<g transform="translate(960 ${FY})">${shoe()}${lynx([[18.9, 20.5]], { noShadow: true, eyes: [[0, 30, 'open']], moods: [[0, 18.6, 'shy'], [18.8, 30, 'happy']] })}</g>`;
const birdPerch = vis(22.0, 99, `<g transform="translate(790 392) scale(1.3)"><g style="${an({ n: 'giggle', d: 0.2, t: 22.4, c: 8, dir: 'alternate' })}">${bird(false, false)}</g></g>`);
const world = `${snowBg({ kind: 'day', fall: false })}${pine(70, FY + 10, 0.95)}${pine(1170, FY + 4, 0.8)}${ibexEl}${rabEl}${lynxEl}${foxEl}${birdPerch}${snowfall({ n: 28 })}`;

// ───────── espace écran ─────────
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const IM = [270, FY - 270], RM = [530, FY - 300], LM = [990, FY - 150];
const FMt = (t) => { const f = foxFn(t); return [f.x + 40, f.y - 255]; };
const pill = timeBadge(14, 15);
// vue d'en haut : plan plein écran (tout le détail du gag), silence de 14,6 à 18,6 s
const inset = vis(14.6, 18.6, `<g><rect width="${W}" height="${H}" fill="#9ad6ff"/>${heartTracks(640, 372, 1.55, { t0: 14.9, dur: 2.4 })}
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="30" fill="none" stroke="${INK}" stroke-width="12"/>
  <g transform="translate(250 150) scale(1.5) scale(-1 1)">${bird(true, false)}</g>
  <text x="640" y="684" text-anchor="middle" class="bt" style="font-size:44px;fill:#fff;stroke:${INK};stroke-width:7;paint-order:stroke">Vu d'en haut</text></g>`);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 200)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Les raquettes</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la patinoire</text></g></g>`;
const fx = inset + pill +
  say('ibex', 'Voici vos raquettes !', 0.5, 2.8, { bx: 700, by: 190, tips: [tip(IM, 0.5, 10, -10)] }) +
  say('rab', 'On marche bien droit !', 3.6, 1.8, { bx: 700, by: 200, tips: [tip(RM, 3.6, 0, -10)] }) +
  say('fox', 'Elles sont bizarres, non ?', 7.2, 2.0, { bx: 640, by: 190, tips: [tip(FMt(7.2), 7.2, 0, -10)] }) +
  sfx('POUF', 880, 470, 8.7, 0.7, 6, '#ffffff', 58, 'poof') +
  say('fox', 'Je tourne en rond !', 10.8, 1.5, { bx: 640, by: 190, tips: [tip(FMt(10.8), 10.8, 0, -10)], shout: true }) +
  say('ibex', 'Roussin, regarde tes pieds !', 12.6, 2.0, { bx: 620, by: 200, tips: [tip(IM, 12.6, 10, -10)] }) +
  say('lynx', 'Joli... un grand cœur.', 18.8, 1.8, { bx: 660, by: 200, tips: [tip(LM, 15.6, 0, -10)] }) +
  say('rab', 'Roussin a fait un cœur !', 20.7, 1.6, { bx: 560, by: 200, tips: [tip(RM, 18.0, 0, -10)] }) +
  sfx('PIIII !', 840, 300, 22.0, 0.9, -6, '#ffd23f', 56, 'chirp') +
  say('fox', 'Je l’ai fait exprès !', 22.4, 1.8, { bx: 540, by: 200, tips: [tip(FMt(22.4), 22.4, -10, -10)] }) +
  say('ibex', 'Quel grand artiste, Roussin !', 24.4, 2.2, { bx: 560, by: 200, tips: [tip(IM, 24.4, 10, -10)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#9ad6ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'chirp', t: 15.2 }, { name: 'chime', t: 17.6 }, { name: 'step', t: 3.8 }, { name: 'step', t: 4.4 }, { name: 'step', t: 9.0 }, { name: 'step', t: 9.8 }, { name: 'step', t: 10.6 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./les-raquettes.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
