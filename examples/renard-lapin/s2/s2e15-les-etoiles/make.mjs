// Roussin & Lino · Saison 2, épisode 15 « Les étoiles » — 30 s, 1280x720. 20h00, le couchage dans la paille. FIN DE LA SAISON 2.
// Gag : tout le monde guette l'étoile filante en silence (anticipation), elle file (action) ; Roussin fait le vœu d'un croissant
// et Rouge-Gorge, l'ami de la journée, lui en dépose un sur le ventre (réaction).
//
// Découpage :
//  0.0– 4.5  plan large     la paille, les duvets, la lune, l'horloge 20 h 00 ; Papi Bernard : « Il était une fois... »
//  4.5– 7.5  Lino/Roussin   « Il est 20 h pile ! » (l'horaire de Lino)
//  7.5–10.5  Piquette/Papi  « Comme moi ? » — « Comme toi : elle brille ! »
// 10.5–13.5  le ciel        silence, les étoiles scintillent, tout le monde attend (anticipation)
// 13.5–16.0  l'étoile       elle file ! Plouf : « Une étoile filante ! »
// 16.0–19.0  Roussin        il ferme les yeux : « Je souhaite... un croissant ! »
// 19.0–22.5  Rouge-Gorge    il apporte un croissant, qui atterrit sur le duvet ; « Un croissant ! Merci ! »
// 22.5–26.6  plan large     « Bonne nuit, les amis ! » ; la lanterne baisse, Zzz
// 26.6–30    plan large     la caméra recule ; carton « Fin de la saison 2 »
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, track, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say1, bird, croissant } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { hedgehog, badger, frog } from '../../lib/cast2.mjs';
import { nightSky, shootingStar, barn, hay } from '../../lib/farm.mjs';

// les bulles ne recouvrent jamais le badge d'heure (zone 24..230 x 24..80)
const say = (who, text, t0, dur, o) => { const fs = o.fs || (o.shout ? 50 : 41), w = text.length * fs * 0.56 + 56, left = Math.max(o.bx, w / 2 + 16) - w / 2; return say1(who, text, t0, dur, left < 250 && o.by < 130 ? { ...o, by: 130 } : o); };
const DUR = 30;
const SHOTS = [
  [0, 4.5, 640, 360, 1.0, 1.04],
  [4.5, 7.5, 376, 500, 1.7, 1.75],
  [7.5, 10.5, 700, 500, 1.5, 1.55],
  [10.5, 13.5, 640, 277, 1.3, 1.34],
  [13.5, 16.0, 640, 277, 1.3, 1.3],
  [16.0, 19.0, 320, 500, 2.0, 2.05],
  [19.0, 22.5, 400, 470, 1.6, 1.62],
  [22.5, 26.6, 640, 432, 1.25, 1.28],
  [26.6, 30, 640, 360, 1.18, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes dimk{from{opacity:0}to{opacity:.38}}
@keyframes lampfl{from{opacity:.16;transform:scale(.96)}to{opacity:.3;transform:scale(1.04)}}
@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const FY = 640, FS = 0.9;
const nightcap = (c, fxv = false) => `<g transform="${fxv ? 'translate(92 -212) rotate(14)' : 'translate(52 -224) rotate(-8)'}"><path d="M-46 30 Q-10 -60 60 -30 Q20 -10 46 30Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-50" y="22" width="100" height="18" rx="9" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="62" cy="-30" r="12" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`;

// ───────── décor : la nuit à la ferme ─────────
const poleClock = `<g transform="translate(1110 0)"><rect x="112" y="215" width="16" height="400" rx="6" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(120 180) scale(1.25)">${wallClock(8, 0, 0, 0)}</g></g>`;
const mat = (x, w) => `<g><ellipse cx="${x}" cy="652" rx="${w}" ry="28" fill="#e8c14d" stroke="${INK}" stroke-width="5"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${x - w + 30 + i * (w * 2 - 60) / 8} ${648 + (i % 3) * 8} l${i % 2 ? 16 : -16} -12" stroke="#c99a2e" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
const bag = (x, c) => `<g><path d="M${x - 78} ${FY - 66} Q${x} ${FY - 92} ${x + 78} ${FY - 66} V${FY + 24} Q${x} ${FY + 38} ${x - 78} ${FY + 24}Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${[-40, 0, 40].map((k) => `<circle cx="${x + k}" cy="${FY - 20}" r="11" fill="#fff" opacity=".55"/>`).join('')}<path d="M${x - 70} ${FY - 52} Q${x} ${FY - 74} ${x + 70} ${FY - 52}" stroke="#fff" stroke-width="6" fill="none" opacity=".5" stroke-linecap="round"/></g>`;
const lantern = (x, y) => `<g>${vis(0, 25.6, `<g style="transform-origin:${x}px ${y - 20}px;${an({ n: 'lampfl', d: 1.3, c: 999, dir: 'alternate', e: 'ease-in-out' })}"><circle cx="${x}" cy="${y - 20}" r="190" fill="#ffe27a"/></g>`)}
  <rect x="${x - 18}" y="${y - 44}" width="36" height="44" rx="8" fill="#ffe27a" stroke="${INK}" stroke-width="4"/>${vis(0, 25.6, `<rect x="${x - 12}" y="${y - 38}" width="24" height="32" rx="6" fill="#fff6c8"/><ellipse cx="${x}" cy="${y - 22}" rx="7" ry="11" fill="#ffb300"/>`)}
  <path d="M${x - 12} ${y - 48} h24 l-5 -12 h-14z" fill="#6b4a2e" stroke="${INK}" stroke-width="3.5"/></g>`;

// ───────── personnages ─────────
const R = (x, y, s, inner, flip) => put(x, y, s, inner, flip);
const foxEl = R(220, FY, FS, fox({
  run: null, upright: -6, noBag: true, noShadow: true, hat: [[0, 99, nightcap('#3b82f6', true)]], holdArm: false,
  talk: [[16.2, 18.4], [21.0, 22.4]],
  eyes: [[0, 13.7, 'up'], [13.7, 15.8, 'wide'], [16.0, 18.5, 'shut'], [19.2, 20.8, 'wide'], [20.8, 25.6, 'arc'], [25.8, 30, 'closed']],
  moods: [[16.0, 18.5, 'calm'], [19.2, 20.8, 'oh'], [20.8, 25.6, 'happy'], [25.8, 30, 'calm']],
  jolt: [20.7], blush: [[21, 24]],
}));
const linoEl = R(380, FY, FS, rabbit({
  run: null, noBag: true, noShadow: true, hat: [[0, 99, nightcap('#ff8fb1')]], gest: [],
  talk: [[4.8, 6.2], [24.5, 25.5]],
  eyes: [[0, 4.7, 'up'], [4.7, 6.4, 'side'], [6.4, 20.0, 'up'], [20.0, 22.5, 'wide'], [22.5, 25.6, 'arc'], [25.8, 30, 'closed']],
  moods: [[4.7, 6.4, 'happy'], [20.0, 25.5, 'happy'], [25.8, 30, 'calm']],
}));
const piqEl = R(560, FY, FS, hedgehog([[7.7, 8.8]], {
  noShadow: true,
  eyes: [[0, 7.6, 'up'], [7.6, 9.0, 'down'], [9.0, 25.6, 'up'], [25.8, 30, 'closed']],
  moods: [[0, 7.5, 'shy'], [7.6, 9.0, 'shy'], [9.0, 25.6, 'happy'], [25.8, 30, 'calm']],
  blush: [[7.6, 10.4]],
}));
const papiEl = R(840, FY, FS, badger([[0.5, 2.2], [2.4, 4.3], [9.0, 10.4], [22.8, 24.4]], {
  noShadow: true, point: [[9.0, 10.4]], wave: [[24.4, 25.6]],
  eyes: [[0.5, 4.3, 'arc'], [9.0, 10.4, 'arc'], [22.8, 26, 'arc'], [26, 30, 'closed']], moods: [[0.4, 30, 'happy']],
}), true);
const ploufEl = R(990, 664, 0.62, frog([[14.4, 15.9]], {
  croak: [[14.4, 15.4]], noShadow: true,
  eyes: [[0, 13.7, 'up'], [14.2, 15.9, 'wide'], [22.5, 25.6, 'arc'], [25.8, 30, 'closed']],
  moods: [[14.2, 16, 'oh'], [22.5, 30, 'happy']],
}));
const zzz = (x, y, t0, fs = 40, ds = [0, 1.6, 3.2]) => ds.map((d) => vis(t0 + d, t0 + d + 1.5, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'zzz', d: 1.5, t: t0 + d, f: 'both' })}"><text class="sfx" style="font-size:${fs}px;fill:#cfd8ff;stroke:#1d2550;stroke-width:6;paint-order:stroke">Z z z</text></g></g>`)).join('');

// Rouge-Gorge apporte le croissant
const BIRD0 = [900, 280], BIRD1 = [250, 380];
const birdFly = vis(19.2, 20.4, track(`<g transform="scale(2.1)">${bird(true, true)}</g>`, 19.2, 20.3, (t, u) => ({ x: BIRD0[0] + (BIRD1[0] - BIRD0[0]) * u, y: BIRD0[1] + (BIRD1[1] - BIRD0[1]) * u - Math.sin(u * Math.PI) * 40 })));
const birdHover = vis(20.3, 21.2, `<g transform="translate(${BIRD1[0]} ${BIRD1[1]}) scale(2.1)">${bird(true, false)}</g>`);
const birdAway = vis(21.2, 22.6, track(`<g transform="scale(2.1)">${bird(true, false)}</g>`, 21.2, 22.5, (t, u) => ({ x: BIRD1[0] + 750 * u, y: BIRD1[1] - 160 * u })));
const croiFall = vis(20.3, 21.0, track(`<g transform="scale(1.3)">${croissant}</g>`, 20.3, 20.85, (t, u) => ({ x: BIRD1[0] - 30 + 6 * u, y: BIRD1[1] + 20 + (FY - 105 - BIRD1[1]) * u * u, r: u * 30 })));
const croiRest = vis(20.85, 99, `<g transform="translate(224 ${FY - 98}) rotate(8) scale(1.3)">${croissant}</g>${vis(20.85, 22.0, `<g transform="translate(224 ${FY - 120})"><g style="${an({ n: 'sparkle', d: 0.9, t: 20.85, f: 'both' })}"><path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/></g></g>`)}`);

const world = `${nightSky()}${barn(1110, 566, 0.62, {})}${poleClock}
  ${mat(220, 130)}${mat(380, 130)}${mat(560, 130)}
  ${lantern(700, 640)}
  ${ploufEl}${papiEl}${hay(840, 662, 1.1, 'bale')}
  ${foxEl}${bag(220, '#7cc8ff')}${linoEl}${bag(380, '#ff8fb1')}${piqEl}${bag(560, '#ffd23f')}
  ${shootingStar(13.8, 260, 30, 1020, 330, 1.1)}
  ${croiFall}${croiRest}${birdFly}${birdHover}${birdAway}
  ${zzz(260, 520, 25.8, 30)}${zzz(430, 520, 26.4, 30)}${zzz(610, 520, 27.0, 30)}
  <rect x="-200" y="-200" width="1700" height="1200" fill="#0a0f2e" style="opacity:0;${an({ n: 'dimk', d: 1.2, t: 25.6, f: 'both' })}"/>`;

// ───────── espace écran ─────────
const T = ([x, y], t) => scr(x, y, t);
const FOXH = [250, 450], LINOH = [395, 392], PIQH = [600, 484], PAPIH = [797, 362], PLOUFH = [990, 536];
const endCard = (t) => `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.5, t, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-344" y="-86" width="700" height="206" rx="30" fill="#000" opacity=".22" transform="rotate(-1.2)"/><rect x="-350" y="-94" width="700" height="206" rx="30" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(-1.2)"/>
  <text y="-16" class="sfx" style="font-size:50px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 2</text>
  <text y="40" class="bt" style="font-size:42px;fill:#2b5ba8">Fin de la saison 2</text>
  <text y="84" class="bt" style="font-size:25px;fill:#7a6a5a">Merci, et à très bientôt !</text></g></g>`;

const fx =
  say('badger', 'Il était une fois...', 0.5, 1.7, { bx: 640, by: 200, tips: [T(PAPIH, 0.5)] }) +
  say('badger', '...une étoile très timide.', 2.4, 1.9, { bx: 640, by: 200, tips: [T(PAPIH, 2.4)] }) +
  say('rab', 'Il est 20 h pile !', 4.8, 1.4, { bx: 520, by: 190, tips: [T(LINOH, 4.8)] }) +
  say('hedge', 'Comme moi ?', 7.7, 1.1, { bx: 480, by: 280, tips: [T(PIQH, 7.7)] }) +
  say('badger', 'Comme toi : elle brille !', 9.0, 1.4, { bx: 900, by: 160, tips: [T(PAPIH, 9.0)] }) +
  sfx('...', 640, 150, 11.2, 2.0, 0, '#cfd8ff', 70) +
  say('frog', 'Une étoile filante !', 14.4, 1.5, { bx: 880, by: 440, tips: [T(PLOUFH, 14.4)] }) +
  sfx('FIOUUU !', 640, 150, 13.9, 1.0, -8, '#ffffff', 64, 'whoosh') +
  say('fox', 'Je souhaite... un croissant !', 16.2, 2.2, { bx: 360, by: 190, tips: [T(FOXH, 16.2)], fs: 30 }) +
  sfx('CHI-CHI !', 800, 300, 19.2, 0.9, 6, '#ffd23f', 56, 'chirp') +
  say('fox', 'Un croissant ! Merci !', 21.0, 1.4, { bx: 330, by: 250, tips: [T(FOXH, 21.0)], shout: true }) +
  say('badger', 'Bonne nuit, les amis !', 22.8, 1.6, { bx: 860, by: 190, tips: [T(PAPIH, 22.8)] }) +
  say('rab', 'Bonne nuit !', 24.5, 1.0, { bx: 480, by: 240, tips: [T(LINOH, 24.5)] }) +
  endCard(27.0);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#10163f"/>
<g style="${camStyle}">${world}</g>
${timeBadge(20, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 14.9 }, { name: 'chirp', t: 19.7 }, { name: 'chirp', t: 20.0 }, { name: 'chime', t: 20.85 }, { name: 'laugh', t: 21.6 }, { name: 'yawn', t: 25.2 }, { name: 'chime', t: 27.0 });
writeFileSync(new URL('./les-etoiles.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 80, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
