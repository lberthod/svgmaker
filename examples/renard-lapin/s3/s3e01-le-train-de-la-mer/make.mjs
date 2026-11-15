// Roussin & Lino · Saison 3 · Épisode 1 « Le train de la mer » — 30 s, 1280x720. 7h30, la gare.
//
// Découpage :
//  0.0– 3.9  plan large     le train arrive ; Lino : « Sept heures trente ! » — Roussin : « J'ai mon croissant ! »
//  3.9– 7.3  Lino            il déroule sa liste : « Tout est sur ma liste ! »
//  7.3–10.5  la valise       Piquette : « Ma valise déborde ! » — ses piquants dépassent ; la valise saute ; Roussin : « Quelle drôle de valise ! »
// 10.5–14.6  la carte         Lino sort la carte postale de Papi Bernard : « Bonnes vacances, les amis ! »
// 14.6–17.5  Piquette         « Jamais vu la mer ! »
// 17.5–19.4  plan large      « En voiture ! » (cloche)
// 19.4–22.0  dans le train     les trois amis assis ; la valise est dans le filet à bagages ; elle commence à trembler
// 22.0–25.0  le filet         anticipation, puis la valise rebondit toute seule dans le filet ; Piquette : « Elle bouge toute seule ! »
// 25.0–27.2  plan moyen       Roussin : « C'est rigolo, elle a hâte ! »
// 27.2–30.0  carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, scene, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { station, train, suitcase } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.9, 600, 700, 1.2, 1.25],
  [3.9, 7.3, 640, 700, 1.3, 1.35],
  [7.3, 10.5, 600, 700, 1.3, 1.35],
  [10.5, 14.6, 680, 700, 1.3, 1.35],
  [14.6, 17.5, 600, 700, 1.3, 1.35],
  [17.5, 19.4, 600, 700, 1.2, 1.2],
  [19.4, 22.0, 640, 700, 1.05, 1.08],
  [22.0, 25.0, 640, 700, 1.25, 1.3],
  [25.0, 27.2, 640, 700, 1.2, 1.2],
  [27.2, 30, 640, 700, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes scrl2{from{transform:translateX(0)}to{transform:translateX(-400px)}}`);

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

// bulle placée automatiquement au-dessus de la tête M (monde) ; évite la pastille d'heure en haut à gauche
const sayAt = (w, tx, a, d, M, o = {}) => {
  const fs = o.shout ? 50 : 41, h = fs + 34, bw = tx.length * fs * 0.56 + 56;
  const [px, py] = scr(M[0], M[1], a + 0.1);
  let bx = o.bx ?? px + (o.dx || 0), by = o.by ?? Math.max(py - 30 - h / 2, h / 2 + 16);
  const left = Math.min(Math.max(bx, bw / 2 + 16), W - 16 - bw / 2) - bw / 2;
  if (left < 270 && by - h / 2 < 134) bx = bw / 2 + 276;
  return say(w, tx, a, d, { bx, by, tips: [[px, py]], shout: o.shout });
};
// ───────── répliques (une source de vérité : texte, heure, durée) ─────────
const LN = {
  sept: ['rab', 'Sept heures trente !', 0.7, 1.6],
  croi: ['fox', 'J’ai mon croissant !', 2.5, 1.4],
  liste: ['rab', 'Tout est sur ma liste !', 4.2, 1.9],
  valise: ['hedge', 'Ma valise déborde !', 7.5, 1.6],
  hihi: ['fox', 'Quelle drôle de valise !', 9.3, 1.4],
  carte: ['rab', 'Une carte de Bernard !', 10.9, 1.6],
  vac: ['rab', 'Bonnes vacances, les amis !', 12.7, 1.8],
  mer: ['hedge', 'Jamais vu la mer !', 14.9, 1.5],
  voit: ['rab', 'En voiture !', 17.7, 1.2],
  seule: ['hedge', 'Elle bouge toute seule !', 22.9, 1.8],
  hate: ['fox', 'La valise a hâte, vite !', 25.1, 1.5],
};
const tw = (who) => Object.values(LN).filter((l) => l[0] === who).map((l) => [l[2] + 0.05, l[2] + l[3] - 0.1]);

// ───────── objets propres à l'épisode ─────────
const listPaper = `<g transform="translate(0 34)"><rect x="-20" y="-6" width="40" height="150" rx="4" fill="#fff" stroke="${INK}" stroke-width="3.5"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M-12 ${22 + i * 26} l4 5 l8 -10" stroke="#22a06b" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M2 ${24 + i * 26} h14" stroke="#2b5ba8" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
const postcard = `<g transform="translate(14 62) rotate(-8) scale(1.2)"><rect x="-44" y="-30" width="88" height="60" rx="5" fill="#fff" stroke="${INK}" stroke-width="3.5"/><rect x="-38" y="-24" width="50" height="48" fill="#7cc8ff"/><circle cx="-14" cy="-8" r="9" fill="#ffd23f"/><path d="M-38 10 q12 -8 25 0 t25 0 V24 H-38Z" fill="#37a9e4"/><rect x="20" y="-24" width="16" height="12" fill="#e8434e"/><path d="M18 -4 h18 M18 4 h18 M18 12 h18" stroke="#2b5ba8" stroke-width="2.5"/></g>`;
const ritem = vis(3.9, 7.4, listPaper) + vis(10.7, 14.7, postcard);

// ───────── personnages ─────────
const mkFox = (noShadow) => fox({ run: null, upright: -6, noShadow, talk: tw('fox'), eyes: [[3.9, 7.0, 'side'], [9.2, 10.9, 'arc'], [25.0, 26.8, 'arc']], moods: [[0, 30, 'happy']] });
const mkRab = (noShadow) => rabbit({ run: null, noShadow, item: ritem, talk: tw('rab'), eyes: [[4.0, 6.2, 'down'], [10.8, 14.7, 'down']], moods: [[0, 30, 'happy']] });
const mkHedge = (noShadow) => hedgehog(tw('hedge'), { noShadow, eyes: [[7.3, 9.4, 'down'], [9.4, 10.6, 'side'], [14.8, 16.6, 'up'], [22.4, 24.9, 'wide'], [25.0, 27.0, 'arc']],
  moods: [[0, 17.5, 'shy'], [17.5, 22.4, 'happy'], [22.4, 24.9, 'oh'], [24.9, 30, 'happy']], blush: [[7.4, 9.4]] });

// ───────── scène 1 : la gare ─────────
const PF = 646;
const trainEl = mover(train(0, 0, 1, { drive: [[0.2, 2.4]] }), [[0, 1760, 560], [2.5, 940, 560], [19.4, 940, 560]]);
const valiseP = mover(suitcase(0, 0, 1.15, { spikes: true, col: '#ff8f6b' }), [[0, 480, PF], [9.0, 480, PF], [9.2, 480, PF - 30, -8], [9.45, 480, PF], [9.7, 480, PF - 26, 8], [9.95, 480, PF], [19.4, 480, PF]]);
const gare = scene(0, 19.4, `${station({ h: 7, m: 30 })}${trainEl}${put(320, PF, 1, mkHedge(false))}${valiseP}${put(720, PF, 1, mkFox(false))}${put(930, PF, 1, mkRab(false), true)}`);

// ───────── scène 2 : dans le train ─────────
const IF = 700, IS = 1.1;
const hills = Array.from({ length: 3 }, (_, k) => `<g transform="translate(${k * 400} 0)"><path d="M0 330 Q100 250 200 320 Q300 260 400 330 V400 H0Z" fill="#7ac35a" stroke="${INK}" stroke-width="4"/><g transform="translate(120 320)"><rect x="-6" y="-60" width="12" height="62" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle cy="-76" r="30" fill="#3fae55" stroke="${INK}" stroke-width="4"/></g><g transform="translate(320 330)"><rect x="-4" y="-90" width="8" height="92" fill="#6b4a2e"/><path d="M-30 -80 h60" stroke="${INK}" stroke-width="5"/></g></g>`).join('');
const winEl = `<clipPath id="iwin"><rect x="660" y="150" width="480" height="240"/></clipPath><rect x="648" y="138" width="504" height="264" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <g clip-path="url(#iwin)"><rect x="660" y="150" width="480" height="240" fill="#9ad6ff"/><circle cx="1070" cy="205" r="30" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><g transform="translate(660 70)"><g style="animation:scrl2 1.6s linear infinite">${hills}</g></g></g>
  <rect x="896" y="150" width="10" height="240" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
const RACK = { x0: 170, x1: 590, y: 380 };
const rackBack = `<rect x="${RACK.x0 - 10}" y="${RACK.y}" width="${RACK.x1 - RACK.x0 + 20}" height="16" rx="6" fill="#a8743f" stroke="${INK}" stroke-width="5"/>${[RACK.x0, RACK.x1].map((x) => `<path d="M${x} ${RACK.y + 16} v50 M${x} ${RACK.y + 40} l-30 30" stroke="${INK}" stroke-width="5" fill="none"/>`).join('')}`;
const mesh = (() => {
  const y0 = 276, y1 = RACK.y, x0 = RACK.x0, x1 = RACK.x1, n = 9, d = [];
  for (let i = -3; i <= n + 3; i++) { const xa = x0 + (i * (x1 - x0)) / n; d.push(`M${xa} ${y0} L${xa + (y1 - y0)} ${y1} M${xa} ${y1} L${xa + (y1 - y0)} ${y0}`); }
  return `<clipPath id="mclip"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath><g clip-path="url(#mclip)"><path d="${d.join(' ')}" stroke="#6b4a2e" stroke-width="4" fill="none" opacity=".85"/></g><rect x="${x0}" y="${y0 - 6}" width="${x1 - x0}" height="8" rx="4" fill="#a8743f" stroke="${INK}" stroke-width="4"/>`;
})();
const wag = (t, k = 1) => Math.sin(t * 52) * 3 * k;
const hop = (t) => { // saute 3 fois dans le filet
  if (t < 22.5) return { x: 380 + wag(t), y: RACK.y - 2 + (t > 21.0 ? Math.sin(t * 40) * 2 : 0), r: wag(t, 1.2), s: 1 };
  const u = (t - 22.5) / 0.62, k = Math.floor(u), f = u - k; // trois bonds
  const air = Math.sin(Math.PI * Math.min(1, f)) * (k === 0 ? 30 : 46);
  return { x: 380 + Math.sin(u * 4) * 8, y: RACK.y - 2 - air, r: Math.sin(u * 6) * 14, sx: 1 + 0.06 * (f < 0.15 ? 1 : 0), sy: f < 0.15 ? 0.9 : 1 };
};
const valiseI = vis(19.4, 30, track(suitcase(0, 0, 0.85, { spikes: true, col: '#ff8f6b' }), 19.4, 30, (t) => hop(Math.min(t, 24.4)), 30));
const interieur = scene(19.4, 30, `<rect width="${W}" height="${H}" fill="#ffeecb"/><rect y="470" width="${W}" height="250" fill="#c98a4e"/><path d="M0 490 H${W}" stroke="#8a5224" stroke-width="8"/>
  ${winEl}${rackBack}${valiseI}${mesh}
  ${put(380, IF, IS, mkHedge(true))}${put(690, IF, IS, mkFox(true))}${put(980, IF, IS, mkRab(true), true)}
  <rect x="30" y="640" width="1220" height="120" rx="30" fill="#3b82f6" stroke="${INK}" stroke-width="7"/><path d="M60 640 H1220" stroke="#fff" stroke-width="5" opacity=".35"/>
  <path d="M0 440 V720" stroke="none"/>`);

// ───────── effets (espace écran) ─────────
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Le train de la mer</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : premier regard</text></g></g>`;
const HM = (y) => [375, y - 205], FMp = (y) => [790, y - 245], RMp = (y) => [876, y - 318];
const S = (k, M, o) => sayAt(LN[k][0], LN[k][1], LN[k][2], LN[k][3], M, o);
const fx = timeBadge(7, 30) +
  S('sept', RMp(PF)) + S('croi', FMp(PF)) + S('liste', RMp(PF)) +
  S('valise', HM(PF)) + S('hihi', FMp(PF)) + S('carte', RMp(PF)) + S('vac', RMp(PF)) + S('mer', HM(PF)) + S('voit', RMp(PF), { shout: true }) +
  S('seule', [380 + 55 * IS, IF - 205 * IS]) + S('hate', [690 + 70 * IS, IF - 245 * IS], { dx: -150 }) +
  sfx('DING !', 560, 260, 17.8, 0.9, -6, '#ffd23f', 70) + sfx('BOING !', 560, 250, 23.0, 0.8, -6, '#ffffff', 70) +
  (22.9 > 0 ? '' : '') + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${gare}${interieur}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'bell', t: 0.3 }, { name: 'bell', t: 17.8 }, { name: 'whoosh', t: 0.4 }, { name: 'step', t: 3.9 }, { name: 'boing', t: 9.2 }, { name: 'chime', t: 10.9 }, { name: 'whoosh', t: 19.5 },
  { name: 'boing', t: 23.2 }, { name: 'boing', t: 23.8 }, { name: 'laugh', t: 25.2 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./train-de-la-mer.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 116, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
