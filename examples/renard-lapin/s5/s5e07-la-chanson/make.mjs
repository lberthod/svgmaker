// Roussin & Lino · Saison 5 · Épisode 7 « La chanson » — 30 s, 1280x720. 14h30, la scène de la salle des fêtes.
//
// Découpage :
//  0.0– 3.5  plan large     Piquette chante l'étoile, trop bas ; pastille 14 h 30
//  3.5– 7.0  Chouette+Piq   « Plus fort, Piquette ! » — « Pardon... je chante bas. »
//  7.0–11.6  Plouf+Piquette Plouf rime en écho : « Étoile... voile... toile... » (un voile se fabrique)
// 11.6–15.5  plan large     « Je fais un rideau ! » : le rideau de toile est fini, chime
// 15.5–20.5  Piquette       « Je chante fort ! » puis elle chante juste, notes, étoiles
// 20.5–24.5  plan large     « Quelle jolie voix ! »
// 24.5–27.0  plan large     « Merci, Plouf ! » — rire
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, owl, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { hedgehog, frog } from '../../lib/cast2.mjs';
import { stage, backdrop, curtains, STAGE } from '../../lib/theatre.mjs';

const DUR = 30;
const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const SHOTS = [
  [0, 3.5, 640, 440, 1.05, 1.1],
  [3.5, 7.0, 430, 460, 1.5, 1.5],
  [7.0, 11.6, 790, 460, 1.5, 1.55],
  [11.6, 15.5, 640, 420, 1.05, 1.1],
  [15.5, 20.5, 620, 470, 2.5, 2.55],
  [20.5, 24.5, 640, 440, 1.08, 1.08],
  [24.5, 27.0, 640, 440, 1.08, 1.05],
  [27.0, 30, 640, 400, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes s7note{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-120px) scale(1.2)}}
@keyframes s7glint{0%,100%{opacity:.35}50%{opacity:.8}}`);

// ───────── décor ─────────
const Y = 600;                       // pieds sur la scène
const bg = stage({ backdrop: backdrop('night') });
const OWL = [205, Y], HED = [620, Y], FRG = [1010, Y];

// le voile tissé par Plouf : pend du haut de la scène, pousse de 8.0 à 13.4
const VX = 450, VW = 340, VY = 70, VH = 470;
const weave = Array.from({ length: 14 }, (_, i) => `<path d="M${(i + 1) * (VW / 15)} 0 V${VH}" stroke="#fff" stroke-width="3" opacity=".7"/>`).join('')
  + Array.from({ length: 16 }, (_, i) => `<path d="M0 ${(i + 1) * (VH / 17)} H${VW}" stroke="#ffd7ef" stroke-width="3" opacity=".8"/>`).join('');
const veilBody = `<rect width="${VW}" height="${VH}" fill="#ffffff" fill-opacity=".42" stroke="${INK}" stroke-width="5"/>${weave}
  <path d="M0 ${VH} q${VW / 8} 22 ${VW / 4} 0 q${VW / 8} 22 ${VW / 4} 0 q${VW / 8} 22 ${VW / 4} 0 q${VW / 8} 22 ${VW / 4} 0" stroke="${INK}" stroke-width="5" fill="#ffd7ef"/>
  <ellipse cx="${VW * 0.28}" cy="${VH * 0.3}" rx="12" ry="70" fill="#fff" opacity=".35" style="animation:s7glint 1.6s infinite"/>`;
const veil = `<g transform="translate(${VX} ${VY})">${tf(veilBody, { t0: 8.0, d: 5.4, from: 'scaleY(0)', to: 'scaleY(1)', e: 'ease-out', o: '0px 0px' })}</g>
  <g transform="translate(${VX} ${VY})"><rect x="-14" y="-12" width="${VW + 28}" height="18" rx="9" fill="#c98a4e" stroke="${INK}" stroke-width="5"/></g>`;
// fil de Plouf vers le voile (pendant le tissage)
const thread = vis(8.0, 13.4, `<path d="M${FRG[0] - 70} ${Y - 130} Q${(FRG[0] + VX + VW) / 2} ${Y - 250} ${VX + VW} ${VY + 360}" stroke="#ff6f95" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="14 10" style="animation:s7glint .5s infinite"/>`);
const spark = (x, y, t0, s = 1) => vis(t0, t0 + 1.2, `<g transform="translate(${x} ${y}) scale(${s})"><g style="${an({ n: 'sparkle', d: 1.0, t: t0, f: 'both' })}"><path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4Z" fill="#fff36b" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g></g>`);
const note = (x, y, t0, dx, col = '#fff') => vis(t0, t0 + 1.6, `<g transform="translate(${x} ${y})"><g style="--dx:${dx}px;${an({ n: 's7note', d: 1.5, t: t0, f: 'both', e: 'ease-out' })}"><ellipse cx="0" cy="0" rx="13" ry="10" fill="${col}" stroke="${INK}" stroke-width="4" transform="rotate(-20)"/><path d="M11 -4 V-44 q16 8 18 22" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>`);

// ───────── personnages ─────────
const hedgeEl = put(HED[0], HED[1], 1.0, hedgehog([[0.7, 2.6], [5.0, 6.5], [9.9, 11.3], [15.7, 16.7], [17.1, 20.0], [24.6, 25.8]], { noShadow: true,
  eyes: [[0, 3.3, 'down'], [4.2, 7, 'down'], [7.2, 9.6, 'wide'], [9.8, 11.6, 'wide'], [12.6, 15.4, 'wide'], [15.6, 20.6, 'arc'], [20.6, 30, 'arc']],
  moods: [[0, 3.3, 'shy'], [4.2, 7, 'shy'], [7.2, 9.6, 'oh'], [9.8, 11.6, 'oh'], [12.6, 15.4, 'oh'], [15.6, 30, 'happy']], blush: [[4.4, 7.0], [15.6, 17]] }));
const owlEl = put(OWL[0], OWL[1], 1.0, owl([[3.1, 4.5], [20.9, 22.4]], { happyAt: 20.8, watchAt: 99 }));
const frogEl = put(FRG[0], FRG[1], 1.0, frog([[7.4, 9.4], [11.9, 13.4], [22.9, 23.9], [24.6, 25.3]], { noShadow: true, croak: [],
  gest: [[8.0, 11.5], [12.0, 13.4]],
  eyes: [[7.2, 13.6, 'arc'], [21.9, 30, 'arc']], moods: [[7.2, 13.6, 'happy'], [21.9, 30, 'happy']],
  item: `<g transform="translate(8 6)"><circle r="17" fill="#ff6f95" stroke="${INK}" stroke-width="4"/><path d="M-12 -6 q12 8 24 0 M-14 4 q14 8 28 0" stroke="#fff" stroke-width="3" fill="none"/></g>` }));

const world = `${bg}${veil}${thread}${owlEl}${hedgeEl}${frogEl}${curtains({ start: 'open' })}`;

// ───────── espace écran ─────────
const HT = { hedge: 215, owl: 225, frog: 230 };
const spk = (who, tx, t0, d, pos, o = {}) => {
  const t = scr(pos[0], pos[1] - HT[who] - 8, t0 + 0.2);
  return say(who, tx, t0, d, { bx: t[0] + (o.bxo || 0), by: Math.max(t[1] - 80, 125), tips: [t], shout: o.shout });
};
const hud = timeBadge(14, 30);
const endCard = endCard5(27.2, 'La chanson', 'Prochain épisode : le trac');

const fx = hud +
  '' +
  spk('hedge', 'Petite étoile, bonsoir...', 0.7, 1.9, HED) +
  spk('owl', 'Plus fort, Piquette !', 3.1, 1.6, OWL, { bxo: 60 }) +
  spk('hedge', 'Pardon... je chante bas.', 5.0, 1.8, HED, { bxo: 30 }) +
  spk('frog', 'Étoile... voile... toile...', 7.4, 2.0, FRG, { bxo: -40 }) +
  spk('hedge', 'Plouf, que fais-tu ?', 9.9, 1.5, HED) +
  spk('frog', 'Je fais un rideau !', 11.9, 1.6, FRG, { bxo: -60 }) +
  spk('hedge', 'Je chante fort, regardez !', 15.6, 1.4, HED) +
  spk('hedge', 'Petite étoile, bonsoir !', 17.1, 2.9, HED, { shout: true }) +
  spk('owl', 'Quelle jolie voix !', 20.9, 1.5, OWL, { bxo: 60 }) +
  spk('frog', 'Quel beau rideau !', 22.9, 1.5, FRG, { bxo: -40 }) +
  spk('hedge', 'Merci, Plouf !', 24.6, 1.3, HED) +
  sfx('CHING !', 930, 215, 13.4, 0.9, -6, '#ffffff', 80, undefined) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}
${note(650, Y - 250, 17.3, -60)}${note(580, Y - 230, 17.9, 50, '#ffe14a')}${note(690, Y - 240, 18.6, 70, '#ff8fb1')}${note(560, Y - 260, 19.2, -50)}
${spark(520, 200, 13.4)}${spark(740, 260, 13.7, 1.3)}${spark(600, 150, 14.0)}${spark(680, 360, 14.3, 1.2)}
</g>
${solid(fx)}
</svg>`;
sfxEv.push({ name: 'chirp', t: 0.7 }, { name: 'whoosh', t: 8.0 }, { name: 'chime', t: 13.4 }, { name: 'chime', t: 17.1 }, { name: 'laugh', t: 15.7 }, { name: 'laugh', t: 25.0 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./chanson.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 96, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
