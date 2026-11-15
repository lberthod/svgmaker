// Roussin & Lino · Saison 3 · Épisode 8 « Le pique-nique de sable » — 30 s, 1280x720. 13h00, la plage, sur la serviette.
//
// Découpage :
//  0.0– 3.6  plan large   la serviette, midi passé ; Lino : « Treize heures ! À table ! »
//  3.6– 7.6  Roussin      croque son sandwich : « Mon sandwich ! » — CRAC — « Il y a du sable ! »
//  7.6–10.6  Piquette     croque sa pomme : « Ma pomme aussi ! »
// 10.6–14.8  Roussin      cherche son croissant imaginaire : « Mon croissant imaginaire... » « Délicieux ! Sans sable ! »
// 14.8–18.6  Lino         son bonbon croque sous la dent : « Même mon bonbon ! »
// 18.6–22.8  la mouette   (bruitage seulement) pique une chaussette de Roussin : « Ma chaussette ! »
// 22.8–26.0  Lino         « Elle adore les chaussettes ! » — Roussin rit
// 26.0–27.2  plan large ; 27.2–30.0  carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, croissant } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { seaBg, towel } from '../../lib/sea.mjs';
import { apple } from '../../lib/farm.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const DUR = 30, NAME = 'le-pique-nique-sable', TITLE = 'Le pique-nique de sable', NEXT = 'Prochain épisode : le port', CLOCK = [13, 0], BPM = 116;
const L = [
  { who: 'rab', text: 'À table, les amis !', t: 0.6, d: 2.2 },
  { who: 'fox', text: 'Mon sandwich !', t: 3.8, d: 1.3 },
  { who: 'fox', text: 'Il y a du sable !', t: 5.7, d: 1.7, shout: true },
  { who: 'hedge', text: 'Ma pomme aussi !', t: 8.2, d: 1.8 },
  { who: 'fox', text: 'Où est mon croissant ?', t: 10.9, d: 2.2 },
  { who: 'fox', text: 'Le voilà, sans sable !', t: 13.2, d: 1.5 },
  { who: 'rab', text: 'Même mon bonbon !', t: 16.3, d: 1.9, shout: true },
  { who: 'fox', text: 'Ma chaussette !', t: 20.6, d: 1.7, shout: true },
  { who: 'rab', text: 'La mouette aime les chaussettes !', t: 23.2, d: 2.1 },
  { who: 'fox', text: 'Bon appétit, tout le monde !', t: 25.4, d: 1.6 },
];
const SHOTS = [
  [0, 3.6, 650, 440, 1.1, 1.15],
  [3.6, 7.6, 590, 480, 1.85, 1.9],
  [7.6, 10.6, 950, 480, 1.9, 1.95],
  [10.6, 14.8, 590, 480, 1.85, 1.85],
  [14.8, 18.6, 650, 440, 1.15, 1.2],
  [18.6, 23.0, 660, 430, 1.25, 1.3],
  [23.0, 25.35, 580, 470, 1.65, 1.7],
  [25.35, 27.2, 650, 430, 1.1, 1.15],
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

// ───────── décor : la plage à midi, la serviette, les provisions ─────────
const FY = 628, FOXX = 450, RX = 780, HX = 1090;
const sandwich = (s = 1, bitten = false) => `<g transform="scale(${s})"><path d="M-30 2 Q-34 -24 -6 -26 H10 Q34 -24 30 2Z" fill="#f0c36a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-30 2 H30" stroke="#6fbf5a" stroke-width="8" stroke-linecap="round"/><path d="M-28 8 H28" stroke="#ffb3a7" stroke-width="7" stroke-linecap="round"/>
  <path d="M-30 14 Q-32 22 -6 22 H10 Q34 22 30 14Z" fill="#f0c36a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  ${bitten ? `<circle cx="26" cy="-6" r="10" fill="#f6dfa0"/><circle cx="26" cy="12" r="9" fill="#f6dfa0"/>` : ''}</g>`;
const sock = (x, y, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-14 -50 H14 V-4 Q40 0 38 18 Q34 30 8 28 Q-14 28 -14 6Z" fill="#fff" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
  <path d="M-14 -36 H14 M-14 -22 H14" stroke="#e8434e" stroke-width="7"/><rect x="-14" y="-50" width="28" height="8" fill="#e8434e" stroke="${INK}" stroke-width="4"/></g>`;
const candy = (s = 1) => `<g transform="scale(${s})"><circle r="15" fill="#ff8fb1" stroke="${INK}" stroke-width="3.5"/><path d="M-15 0 L-30 -12 V12Z M15 0 L30 -12 V12Z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-6 -8 Q0 -12 7 -6" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></g>`;
const bg = `${seaBg('noon', { shells: false })}${towel(640, 700, 2.3, '#ff8fa3')}
  <g transform="translate(900 664)">${sandwich(0.9)}</g><g transform="translate(560 676)">${apple(0, 0, 0.45)}</g>${sock(700, 668, 0.8, -75)}${vis(0, 20.05, sock(730, 676, 0.8, -100))}`;
const ACT = { fox: () => [FOXX + 55, FY - 255], rab: () => [RX - 45, FY - 290], hedge: () => [HX - 20, FY - 185] };

// ───────── personnages ─────────
const mood = (who, m) => inWin(who).map(([a, b]) => [a, b, m]);
const grains = (x, y, t0, n = 7) => Array.from({ length: n }, (_, i) => vis(t0 + i * 0.05, t0 + 1.2, `<g transform="translate(${x + (i - 3) * 5} ${y})"><g style="--dx:${(i - 3) * 14}px;${an({ n: 'crumb', d: 0.8, t: t0 + i * 0.05, f: 'both' })}"><circle r="${3 + (i % 3)}" fill="#e6c27a" stroke="${INK}" stroke-width="1.5"/></g></g>`)).join('');
const foxEl = put(FOXX, FY, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, talk: T('fox'),
  item: `${vis(3.2, 7.5, sandwich(0.8, false))}`,
  eyes: [[0.4, 3.6, 'side'], [3.6, 5.2, 'arc'], [5.2, 7.6, 'sq'], [10.6, 13.0, 'down'], [13.0, 14.8, 'closed'], [18.6, 20.4, 'side'], [20.4, 22.8, 'wide'], [22.8, 27, 'arc']],
  moods: [[3.6, 5.2, 'happy'], [5.2, 7.6, 'sad'], [10.6, 13.0, 'sad'], [13.0, 14.8, 'happy'], [20.4, 22.8, 'oh'], [22.8, 30, 'happy']], blush: [[25.4, 27]] }));
const rabEl = put(RX, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, talk: T('rab'),
  item: vis(14.9, 17.9, candy(0.9)),
  eyes: [[0.4, 3.6, 'arc'], [14.8, 16.2, 'arc'], [16.2, 18.6, 'sq'], [23.0, 25.2, 'arc']], moods: [[14.8, 16.2, 'happy'], [16.2, 18.6, 'sad'], [23.0, 30, 'happy']] }), true);
const hedgeEl = put(HX, FY + 4, 1.0, hedgehog(T('hedge'), { noShadow: true, item: vis(7.4, 10.4, apple(0, 0, 0.5)),
  eyes: [[0, 7.6, 'side'], [7.6, 8.8, 'arc'], [8.8, 10.6, 'sq'], [22.8, 27, 'arc']], moods: [[0, 7.6, 'shy'], [7.6, 8.8, 'happy'], [8.8, 10.6, 'sad'], [22.8, 30, 'happy']], blush: [[0.4, 3.0]] }), true);
// grains de sable qui tombent des bouches
const sandFx = grains(FOXX + 90, FY - 120, 5.3) + grains(HX - 90, FY - 100, 8.9, 6) + grains(RX - 60, FY - 120, 16.3, 6);
// le croissant imaginaire (un fantôme de croissant, en pointillé de lumière)
const ghost = mover(`<g>${croissant}</g><path d="M-48 -34 q-10 -12 0 -22 M48 -34 q10 -12 0 -22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`, [[10.8, FOXX + 150, FY - 150, -12, 0.2], [11.2, FOXX + 165, FY - 175, -12, 1.2], [13.4, FOXX + 165, FY - 175, -12, 1.2], [14.0, FOXX + 140, FY - 130, 0, 1.0], [14.6, FOXX + 100, FY - 100, 0, 0.01]]);

// ───────── la mouette (un goéland-copain) ─────────
const gullSvg = (withSock) => `<g><g style="transform-origin:0px 0px;animation:sgull .22s ease-in-out infinite alternate"><path d="M-8 -6 Q-70 -60 -110 -12 Q-60 -26 -8 8Z" fill="#c9ced9" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>
  <ellipse rx="52" ry="30" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-50 -4 L-84 6 L-48 12Z" fill="#c9ced9" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="46" cy="-18" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M62 -20 L92 -12 L62 -6Z" fill="#ffb300" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="48" cy="-24" r="5" fill="${INK}"/><circle cx="50" cy="-26" r="1.6" fill="#fff"/>
  <g style="transform-origin:0px 0px;animation:sgull .22s ease-in-out infinite alternate"><path d="M-8 -6 Q-50 -80 -100 -48 Q-56 -50 -8 8Z" fill="#dfe3ec" stroke="${INK}" stroke-width="4" stroke-linejoin="round" opacity=".95"/></g>
  ${withSock ? `<g transform="translate(88 0) rotate(100)">${sock(0, 0, 0.55)}</g>` : ''}</g>`;
const GX = 700, GY = FY + 28; // la chaussette
const gullIn = mover(`<g transform="scale(-1 1)">${gullSvg(false)}</g>`, [[18.7, 1500, 110, -8, 1], [19.4, 1000, 300, -6, 1], [20.0, GX + 90, GY - 36, 4, 1], [20.1, GX + 90, GY - 36, 4, 1]]);
const gullOut = mover(`<g>${gullSvg(true)}</g>`, [[20.1, GX + 80, GY - 36, -8, 1], [20.8, 1000, 260, -14, 1], [21.8, 900, 330, -6, 1], [23.0, 780, 320, -4, 1], [27.2, 780, 300, -4, 1]]);
const gullPuff = vis(19.8, 20.8, `<g transform="translate(${GX} ${GY + 10})"><g style="${an({ n: 'puff', d: 0.7, t: 19.9, f: 'both' })}"><circle r="22" fill="#f3e1b0" stroke="${INK}" stroke-width="3"/></g></g>`);
const world = `${bg}${hedgeEl}${foxEl}${rabEl}${sandFx}${ghost}${gullPuff}${gullIn}${gullOut}`;
const FXS = sfx('CRAC !', 250, 300, 5.3, 0.9, -8, '#ffd23f', 70) + sfx('CRAC !', 900, 520, 16.3, 0.9, 6, '#ffd23f', 66) + sfx('FRRR !', 960, 200, 18.9, 0.8, 8, '#ffffff', 70);
const SFX = [['chime', 0.3], ['crack', 5.3], ['crack', 8.9], ['sniff', 11.2], ['crack', 16.3], ['whoosh', 18.8], ['chirp', 19.6], ['chirp', 21.2], ['laugh', 25.4]];

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
