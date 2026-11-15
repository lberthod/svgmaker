// Roussin & Lino · Saison 4 · Épisode 14 « La surprise » — 30 s, 1280x720. 19h30, le chalet, la fresque de Flocon sur la vitre givrée.
//
// Découpage :
//  0.0– 3.8  plan large   19 h 30, un rideau cache la fenêtre ; Mme Chouette : « Chut ! Une surprise ! »
//  3.8– 7.6  Flocon       il chuchote : « J'ai dessiné pour vous... »
//  7.6–11.0  les amis     Roussin impatient : « Quoi ? Quoi ? Quoi ? » (anticipation)
// 11.0–15.5  le rideau    Flocon tire le rideau : « Tadaa... » ; les portraits se dessinent un à un (givre) ; Lino : « Oh ! C'est nous ! »
// 15.5–19.5  la fresque   Roussin : « Regardez ! C'est moi ! » ; Mme Chouette : « Oh... quelle belle fresque ! » (elle essuie une larme)
// 19.5–23.5  Plouf        invité surprise, il bondit : « Ouaf ! Surprise ! » puis « Bravo, Flocon ! » (applaudissements)
// 23.5–27.0  plan large   Flocon rougit : « Merci... mes amis. » ; Lino : « Hihi ! Bravo ! »
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { frog } from '../../lib/cast2.mjs';
import { lynx } from '../../lib/cast4.mjs';
import { chaletInside, chaletWindow, fresco } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.8, 640, 400, 1.1, 1.14],
  [3.8, 7.6, 676, 450, 1.8, 1.85],
  [7.6, 11.0, 413, 430, 1.55, 1.55],
  [11.0, 16.4, 640, 300, 1.6, 1.6],
  [16.4, 20.4, 640, 400, 1.25, 1.28],
  [20.4, 24.4, 788, 420, 1.3, 1.3],
  [24.4, 27.0, 640, 400, 1.1, 1.1],
  [27.0, 30, 640, 400, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes e14curtL{from{transform:scaleX(1)}to{transform:scaleX(.2)}}
@keyframes e14tear{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(46px)}}
@keyframes e14clap{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}`);

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

// ───────── décor : chalet de nuit, grande fenêtre givrée, rideau ─────────
const WX = 640, WY = 270, WS = 1.6;           // fenêtre : x 464..816, y 94..446
const L = WX - 118 * WS * 0.0 - 176, R = WX + 176; // bords extérieurs du cadre
const T_OPEN = 11.0;
const curtain = (side) => {
  const x0 = side < 0 ? L : WX, x1 = side < 0 ? WX : R, ox = side < 0 ? L : R;
  return `<g style="transform-origin:${ox}px 270px;${an({ n: 'e14curtL', d: 0.9, t: T_OPEN, f: 'both', e: 'ease-in-out' })}">
  <path d="M${x0} 92 H${x1} V452 Q${(x0 + x1) / 2} 470 ${x0} 452Z" fill="#e8434e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  ${[0.2, 0.4, 0.6, 0.8].map((k) => `<path d="M${x0 + (x1 - x0) * k} 96 Q${x0 + (x1 - x0) * (k + 0.05)} 270 ${x0 + (x1 - x0) * k} 450" stroke="#b02a38" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
  <path d="M${x0 + 14} 110 V300" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".3"/></g>`;
};
const rod = `<rect x="${L - 30}" y="76" width="${R - L + 60}" height="16" rx="8" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><circle cx="${L - 30}" cy="84" r="12" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><circle cx="${R + 30}" cy="84" r="12" fill="#ffd23f" stroke="${INK}" stroke-width="5"/>`;
const win = `${chaletWindow(WX, WY, WS, { view: 'night', frost: true, art: fresco({ t0: 11.8, step: 0.55, count: 8 }) })}${vis(0, T_OPEN + 1, '')}${curtain(-1)}${curtain(1)}${rod}`;

// ───────── personnages ─────────
const FY = 600;
const rabEl = put(190, FY, 0.9, rabbit({ run: null, noShadow: true,
  talk: [[16.6, 18.0]],
  eyes: [[0.4, 3.6, 'side'], [3.8, 11.0, 'side'], [11.0, 16.5, 'wide'], [16.6, 19.6, 'arc'], [21.4, 24.8, 'wide'], [25.0, 27, 'arc']],
  moods: [[0.4, 11.0, 'happy'], [11.0, 16.5, 'oh'], [16.6, 19.6, 'happy'], [21.4, 24.8, 'oh'], [25.0, 30, 'happy']], blush: [[16.6, 18.0]] }));
const foxEl = put(445, FY, 0.9, fox({ run: null, upright: -6, noBag: true, noShadow: true,
  talk: [[8.0, 9.6], [18.0, 19.6]],
  eyes: [[0.4, 7.9, 'side'], [8.0, 9.7, 'wide'], [9.8, 11.0, 'sq'], [11.0, 17.8, 'wide'], [18.0, 19.8, 'arc'], [21.4, 24.0, 'wide'], [24.2, 27, 'arc']],
  moods: [[0.4, 7.9, 'happy'], [8.0, 11.0, 'oh'], [11.0, 17.8, 'oh'], [18.0, 19.8, 'happy'], [21.4, 24.0, 'oh'], [24.2, 30, 'happy']],
  jolt: [11.0] }));
const owlEl = put(930, FY, 0.95, owl([[0.7, 2.3], [19.8, 21.5]], { watchAt: null, point: [[3.8, 7.5], [11.0, 13.0]] }), true);
const lynxEl = put(620, FY, 1.15, lynx([[4.0, 6.5], [11.0, 12.2], [24.8, 26.4]], { noBook: true, noShadow: true, point: [[10.6, 11.6]],
  eyes: [[0.4, 3.8, 'side'], [3.8, 7.5, 'down'], [11.0, 12.4, 'arc'], [13.0, 22.0, 'arc'], [22.0, 24.4, 'wide'], [24.6, 27.5, 'down']],
  moods: [[3.8, 7.5, 'shy'], [11.0, 12.4, 'happy'], [13.0, 22.0, 'happy'], [24.4, 27.5, 'shy']], blush: [[3.8, 7.6], [24.6, 27.5]] }));
const FR = [1130, 640];
const frogEl = mover(`<g transform="scale(.75)">${frog([[22.1, 23.2], [23.6, 24.6]], { noShadow: true, croak: [[22.0, 22.6]],
  eyes: [[21.4, 25.0, 'wide'], [25.0, 30, 'arc']], moods: [[21.4, 30, 'happy']], gest: [[23.5, 25.0]] })}</g>`,
  [[20.8, 1350, 640, 0, 1], [21.1, 1280, 540, 0, 1], [21.4, 1220, 640, 0, 1], [21.7, 1170, 560, 0, 1], [22.0, FR[0], FR[1], 0, 1], [30, FR[0], FR[1], 0, 1]]);
const tear = vis(20.2, 22.2, `<g transform="translate(905 492)"><g style="${an({ n: 'e14tear', d: 1.4, t: 20.2, f: 'both' })}"><path d="M0 -12 Q-9 2 0 10 Q9 2 0 -12Z" fill="#7cc8ff" stroke="${INK}" stroke-width="3"/></g></g>`);
const claps = [0, 1, 2, 3].map((i) => vis(23.5 + i * 0.3, 24.0 + i * 0.3, `<g transform="translate(${1050 + (i % 2) * 130} ${470 - (i % 2) * 30})"><g style="${an({ n: 'e14clap', d: 0.3, t: 23.5 + i * 0.3 })}"><path d="M-14 -4 L0 -22 L14 -4 M-24 8 L-36 4 M24 8 L36 4" stroke="#ffd23f" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>`)).join('');

const world = `${chaletInside({ clock: false, view: 'night', window: false })}${win}${lynxEl}${rabEl}${foxEl}${owlEl}${tear}${frogEl}${claps}`;

// ───────── espace écran ─────────
const LH = [655, 372], FH = [510, 395], RH = [212, 335], OH = [930, 405], FRH = [1130, 482];
const hud = timeBadge(19, 30);
const sayH = (who, tx, a, d, m, o = {}) => { const p = scr(m[0], m[1], a + 0.3); return say(who, tx, a, d, { bx: Math.max(p[0] + (o.ox || 0), 420), by: Math.max(p[1] - 100, 58), tips: [[p[0], p[1] - 4]], ...o }); };
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La surprise</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la veillée</text></g></g>`;
const fx = hud +
  sayH('owl', 'Doucement ! Une surprise !', 0.6, 1.9, OH) +
  sayH('lynx', 'J’ai dessiné pour vous...', 4.0, 2.6, LH) +
  sayH('fox', 'Quoi ? Quoi ? Quoi ?', 8.0, 1.9, FH) +
  sayH('lynx', 'Voilà ma surprise !', 11.0, 1.3, LH, { ox: 150 }) +
  sayH('rab', 'C’est nous, sur la vitre !', 16.6, 1.5, RH, { ox: 80 }) +
  sayH('fox', 'Regardez ! C’est moi !', 18.1, 1.6, FH) +
  sayH('owl', 'Quelle belle fresque, Flocon !', 19.8, 1.9, OH) +
  sayH('frog', 'Bonsoir ! Surprise !', 22.1, 1.3, FRH, { shout: true }) +
  sayH('frog', 'Bravo, Flocon !', 23.5, 1.2, FRH) +
  sayH('lynx', 'Merci... mes amis.', 24.8, 1.6, LH, { ox: 100 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#2a1a10"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'step', t: 10.6 }, { name: 'whoosh', t: 11.0 }, { name: 'chime', t: 11.8 }, { name: 'chime', t: 13.4 }, { name: 'chime', t: 14.6 },
  { name: 'chime', t: 15.8 }, { name: 'boing', t: 21.9 }, { name: 'handbell', t: 23.5 }, { name: 'laugh', t: 26.0 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./surprise.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 88, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
