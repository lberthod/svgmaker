// Roussin & Lino · Saison 3 · Épisode 7 « Les flaques » — 30 s, 1280x720. 12h15, la plage à marée basse.
//
// Découpage :
//  0.0– 3.6  plan large   marée basse, les trois amis ; Lino : « Marée basse ! Des flaques ! »
//  3.6– 7.2  Piquette     devant la flaque à l'anémone et à l'étoile de mer
//  7.2–10.0  Roussin      ramasse un coquillage
// 10.0–14.6  la flaque    il l'écoute : « J'entends la mer... » ; Plouf jaillit de l'eau : « Ouaf ! » ; Roussin saute
// 14.6–18.0  réaction     Roussin retombe, Lino : « C'est Plouf ! »
// 18.0–22.0  Plouf        « Hihi ! Surprise ! » — « Tu m'as bien eu ! »
// 22.0–25.0  Piquette     l'anémone la chatouille
// 25.0–27.2  plan large   Lino : « Déjà midi et quart ! »
// 27.2–30.0  carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog, frog } from '../../lib/cast2.mjs';
import { seaBg, tidepool, starfish, shell } from '../../lib/sea.mjs';
import { splash } from '../../lib/farm.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const DUR = 30, NAME = 'les-flaques', TITLE = 'Les flaques', NEXT = 'Prochain épisode : le pique-nique', CLOCK = [12, 15], BPM = 112;
const L = [
  { who: 'rab', text: 'Marée basse ! Des flaques !', t: 0.6, d: 2.2 },
  { who: 'hedge', text: 'Une étoile de mer !', t: 3.9, d: 1.8 },
  { who: 'fox', text: 'Un coquillage !', t: 7.5, d: 1.6 },
  { who: 'fox', text: 'J’entends la mer...', t: 10.3, d: 1.9, dx: -60 },
  { who: 'frog', text: 'Je suis un chien !', t: 12.4, d: 1.1, shout: true },
  { who: 'fox', text: 'Un chien ?!', t: 14.3, d: 0.85, shout: true, dx: -40 },
  { who: 'rab', text: 'C’est Plouf !', t: 15.5, d: 1.5 },
  { who: 'frog', text: 'Surprise ! C’est moi !', t: 18.2, d: 1.7 },
  { who: 'fox', text: 'Tu m’as bien eu !', t: 20.1, d: 1.7 },
  { who: 'hedge', text: 'Elle me chatouille !', t: 22.3, d: 1.8 },
  { who: 'rab', text: 'Déjà midi et quart !', t: 25.2, d: 1.8 },
];
const SHOTS = [
  [0, 3.6, 540, 440, 1.25, 1.3],
  [3.6, 7.2, 355, 480, 1.8, 1.85],
  [7.2, 10.0, 680, 470, 1.7, 1.75],
  [10.0, 15.2, 800, 450, 1.35, 1.35],
  [15.2, 18.0, 800, 460, 1.3, 1.35],
  [18.0, 22.0, 750, 480, 1.5, 1.55],
  [22.0, 25.0, 355, 480, 1.8, 1.85],
  [25.0, 27.2, 640, 400, 1.1, 1.15],
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

// ───────── décor : plage à marée basse, deux flaques ─────────
const FY = 612, HX = 170, FOXX = 520, RX = 860, PX = 1060;
const bg = `${seaBg('day', { shells: false })}${tidepool(HX + 40, 650, 0.8)}${tidepool(PX, 650, 0.85)}${starfish(640, 690, 0.45, '#ff8f6b')}${shell(420, 700, 0.55, 'spiral')}`;
const ACT = { fox: () => [FOXX + 55, FY - 255], rab: () => [RX - 45, FY - 290], hedge: () => [HX + 15, FY + 6 - 185], frog: (t) => [PX, 626 - (t < 13.5 ? 285 : 175)] };

// ───────── personnages ─────────
const mood = (who, m) => inWin(who).map(([a, b]) => [a, b, m]);
const shellEar = `<g transform="translate(26 -150) rotate(-30)">${shell(0, 0, 0.5, 'spiral')}</g>`;
const foxEl = put(FOXX, FY, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, talk: T('fox'),
  raise: [[10.0, 13.6]], hat: [[7.6, 13.65, shellEar]], jumps: [[13.6, 14.4, 70]],
  eyes: [[0.4, 3.6, 'side'], [7.2, 10.0, 'wide'], [10.0, 12.4, 'closed'], [12.4, 13.6, 'wide'], [13.6, 14.6, 'wide'], [14.6, 18.0, 'sq'], [18.0, 22.0, 'arc'], [22.0, 27, 'arc']],
  moods: [[7.2, 10.0, 'happy'], [10.0, 12.4, 'calm'], [12.4, 14.6, 'oh'], [14.6, 18.0, 'happy'], [18.0, 30, 'happy']] }));
const rabEl = put(RX, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, talk: T('rab'),
  eyes: [[0.4, 3.6, 'arc'], [14.6, 16.8, 'arc'], [25.0, 27.5, 'arc']], moods: [...mood('rab', 'happy'), [27, 30, 'happy']] }), true);
const hedgeEl = put(HX, FY + 6, 1.0, hedgehog(T('hedge'), { noShadow: true,
  eyes: [[0, 3.6, 'side'], [3.6, 7.2, 'wide'], [22.0, 25.0, 'arc']], moods: [[0, 3.6, 'shy'], [3.6, 7.2, 'happy'], [22.0, 25.0, 'happy']], blush: [[22.3, 24.8]], jolt: [22.5] }));
// Plouf jaillit de la flaque à 12.5 s
const frogEl = vis(12.45, 99, put(PX, 626, 0.9, frog(T('frog').map(([a, b]) => [a, b]), { noShadow: true, jumps: [[12.5, 13.3, 100]],
  eyes: [[12.4, 14.6, 'wide'], [14.6, 30, 'arc']], moods: [[12.4, 14.6, 'happy'], [14.6, 30, 'happy']] })));
const world = `${bg}${hedgeEl}${foxEl}${rabEl}${frogEl}${splash(PX, 626, 12.45, 1.1, 9)}${splash(PX, 626, 13.25, 0.8, 7)}`;
const FXS = '';
const SFX = [['splash', 12.5], ['boing', 13.6], ['chirp', 3.9], ['chirp', 18.3], ['splash', 21.0]];

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
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
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
sfxEv.push(...SFX.map(([name, t]) => ({ name, t })), { name: 'chime', t: 27.2 });
writeFileSync(new URL(`./${NAME}.svg`, import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: BPM, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
