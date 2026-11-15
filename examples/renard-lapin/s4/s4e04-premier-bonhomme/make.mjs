// Roussin & Lino · Saison 4 · Épisode 4 « Premier bonhomme » — 30 s, 1280x720. 9h30, la neige devant le chalet.
//
// Découpage :
//  0.0– 3.5  plan large   pastille 9h30 ; Lino : « Faisons un bonhomme ! »
//  3.5– 7.0  Lino         les boules s'empilent (grosse en haut !), Lino compte : « Une, deux, trois... voilà ! »
//  7.0–10.0  Flocon       il dessine une carotte dans la neige : « Il n'a pas de nez... »
// 10.0–14.0  la carotte   Roussin court chercher la carotte et la plante : POUF, le nez
// 14.0–18.0  le défaut    Lino : « Oups ! Il est à l'envers ! » — Roussin : « Pas grave ! Il est drôle ! »
// 18.0–22.5  Rouge-Gorge  se pose sur la grosse boule ; Flocon : « Je le trouve beau. »
// 22.5–27.0  plan large   rires
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0, bird } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { carrot } from '../../lib/farm.mjs';
import { lynx } from '../../lib/cast4.mjs';
import { snowBg, snowman, snowPoof, foxBeanie, snowfall } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 660, 420, 1.1, 1.14],
  [3.5, 7.0, 520, 440, 1.6, 1.65],
  [7.0, 10.0, 560, 460, 1.7, 1.75],
  [10.0, 14.0, 660, 430, 1.12, 1.12],
  [14.0, 18.0, 660, 430, 1.3, 1.35],
  [18.0, 22.5, 660, 400, 1.2, 1.25],
  [22.5, 27.0, 660, 400, 1.12, 1.08],
  [27.0, 30, 660, 400, 1.08, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

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

const FY = 616;
const bg = `${snowBg({ kind: 'day' })}${snowfall({ n: 22, speed: 0.7 })}`;

// ───────── personnages ─────────
const FX = 1070, FX2 = 990; // Roussin : départ, après la course
const hat = [[0, 30, foxBeanie(0.15)]];
const foxOpts = (run) => ({ run, upright: -6, noShadow: true, noBag: true, hat,
  talk: [[9.9, 11.3], [15.6, 17.6], [24.8, 26.2]],
  eyes: [[9.8, 11.4, 'wide'], [14.0, 15.4, 'wide'], [15.6, 17.6, 'arc'], [22.6, 27.4, 'arc']],
  moods: [[9.8, 11.4, 'happy'], [14.0, 15.4, 'oh'], [15.6, 17.6, 'happy'], [22.6, 30, 'happy']] });
const foxA = vis(0, 10.4, put(FX, FY, 1.0, fox(foxOpts(null)), true));
const foxRun = mover(`<g transform="scale(-1 1)">${fox(foxOpts([10.4, 12.2]))}</g>`, [[10.4, FX, FY, 0, 1], [12.2, FX2, FY, 0, 1]]);
const foxB = vis(12.2, 30, put(FX2, FY, 1.0, fox(foxOpts(null)), true));
const RX = 280;
const rabEl = put(RX, FY, 1.0, rabbit({ run: null, noShadow: true,
  talk: [[0.5, 2.3], [4.0, 6.4], [14.1, 15.5], [22.8, 24.4]],
  eyes: [[0.4, 2.4, 'arc'], [14.0, 15.6, 'wide'], [22.7, 24.0, 'arc']],
  moods: [[0.4, 2.4, 'happy'], [14.0, 15.6, 'oh'], [22.7, 30, 'happy']] }));
const LX = 470;
const lynxEl = put(LX, FY, 1.3, lynx([[2.5, 3.8], [7.4, 8.8], [19.5, 20.9]], { draw: [[7.0, 9.6]], noShadow: true,
  eyes: [[2.4, 3.9, 'down'], [7.0, 9.8, 'down'], [19.4, 21.0, 'arc'], [22.6, 27.5, 'arc']],
  moods: [[2.4, 3.9, 'shy'], [7.0, 9.8, 'shy'], [19.4, 30, 'happy']], blush: [[2.5, 3.9], [7.2, 9.0], [19.5, 21.0]] }));

// ───────── bonhomme, croquis, carotte, oiseau ─────────
const SX = 700, SY = 620, SS = 1.15;
const man = `<g transform="translate(${SX} ${SY}) scale(${SS})">${snowman(0, 0, 1, { upsideDown: true, build: 3.9, noseAt: 12.6 }).replace(/^<g transform="translate\(0 0\) scale\(1\)">/, '<g>')}</g>`;
const sketch = vis(8.4, 30, `<g opacity=".8" transform="translate(590 634) rotate(78) scale(.55)"><path d="M-18 -4 Q0 -14 18 -4 L2 70 Q0 74 -2 70Z" fill="none" stroke="#ff9f43" stroke-width="7" stroke-dasharray="14 9" stroke-linecap="round"/></g>`);
const carrotFly = mover(carrot(0, 0, 1.0, 0), [
  [10.4, FX - 110, FY - 150, 30, 1], [12.2, FX2 - 110, FY - 160, 60, 1], [12.35, FX2 - 120, FY - 150, 70, 1], [12.62, SX + 40, 584, -92, 0.8], [12.64, SX + 40, 584, -92, 0.001]]);
const flyIn = mover(`<g transform="scale(1.3)">${bird(true, false)}</g>`, [[18.0, 1400, 90, 0, 1], [18.9, SX + 6, 282, 0, 1]]);
const perched = vis(18.9, 30, `<g transform="translate(${SX + 6} 284) scale(1.3)">${bird(false, false)}</g>`);
const poofs = snowPoof(SX + 40, 590, 12.5, 0.8) + snowPoof(SX, 380, 4.9, 0.9);

const world = `${bg}${sketch}${man}${lynxEl}${foxA}${foxRun}${foxB}${rabEl}${carrotFly}${poofs}${flyIn}${perched}`;

// ───────── espace écran ─────────
const pastille = timeBadge(9, 30);
const sp = (who, tx, t0, d, m, o = {}) => {
  const [x, y] = scr(m[0], m[1], t0 + 0.1);
  const bw = tx.length * 41 * 0.56 + 56;
  return say(who, tx, t0, d, { bx: Math.max(x + (o.ox || 0), 280 + bw / 2), by: y - (o.up || 90), tips: [[x, y - (o.gap || 14)]], shout: o.shout });
};
const fm = (x, dx = -70) => [x + dx, FY - 290];
const rm = [RX + 25, FY - 325];
const lm = [LX + 50, FY - 275];
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Le premier bonhomme</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la luge</text></g></g>`;
const fx = pastille +
  sp('rab', 'Faisons un bonhomme !', 0.5, 1.9, rm, { ox: 40 }) +
  sp('rab', 'Une, deux, trois... voilà !', 4.0, 2.4, rm, { ox: 60 }) +
  sfx('POUF', 700, 250, 4.0, 0.8, -6, '#ffffff', 56) +
  sp('lynx', 'Je peux... regarder ?', 2.5, 1.4, lm, { ox: 30 }) +
  sp('lynx', 'Il lui faut un nez...', 7.4, 1.8, lm, { ox: 30 }) +
  sp('fox', 'Une carotte !', 9.9, 1.5, fm(FX), { shout: true }) +
  sfx('POUF !', 740, 300, 12.5, 0.8, 6, '#ffd23f', 70) +
  sp('rab', 'Mais non ! À l’envers !', 14.1, 1.9, rm, { ox: 30 }) +
  sp('fox', 'Pas grave ! Il est drôle !', 15.7, 2.2, fm(FX2), { ox: -20 }) +
  sp('lynx', 'Je le trouve beau.', 19.5, 1.6, lm, { ox: 20 }) +
  sp('rab', 'Il a la tête en bas !', 22.8, 1.6, rm, { ox: 30 }) +
  sp('fox', 'Merci, Flocon !', 24.8, 1.4, fm(FX2)) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'poof', t: 3.9 }, { name: 'poof', t: 4.4 }, { name: 'poof', t: 4.9 }, { name: 'chime', t: 7.2 }, { name: 'crack', t: 12.4 }, { name: 'poof', t: 12.6 },
  { name: 'chirp', t: 18.8 }, { name: 'laugh', t: 22.8 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./bonhomme.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
