// Roussin & Lino · Saison 5 · Épisode 15 « Le dernier rideau » — 30 s, 1280x720. 20h30, la scène de la salle des fêtes. FINALE DE LA SÉRIE.
//
// Découpage :
//  0.0– 3.4  Piquette        la dernière note de la chanson, l'étoile en carton brille : « Brille pour toujours ! »
//  3.4– 6.4  plan large      la salle se lève, confettis : Lino « On a réussi ! »
//  6.4–10.6  Mme Escargot    elle entre enfin : Chouette « Mme Escargot ! Vous voilà ! » — « Me voici, pour la fin ! »
// 10.6–14.2  Lino            il range sa montre : « Je range ma montre. » — « Maintenant, je vous regarde. »
// 14.2–17.3  le croissant    Roussin tend son dernier croissant à Rouge-Gorge : « Pour toi, Rouge-Gorge. »
// 17.3–22.5  la révérence    le salut, COUPLE PAR COUPLE en plans serrés : Chouette+Escargot, Zélie+Bastien (« Solide, solide, solide ! »),
//                            Papi Bernard+Plouf+Mimi+Coin, Piquette+Taupin (« Merci, tout le monde ! »)
// 22.5–30.0  PLAN SERRÉ SUR LE DUO  Lino : « Merci d’avoir été là ! » — Roussin : « Au revoir, les amis ! » (dernier mot) ;
//                            la salle s'éteint doucement ; carton final « Merci d'avoir été là. Fin de la série. » à 27,2 s
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, owl, style, addKF } from '../../lib/kit.mjs';
import { makeCam, bird, croissant, pal, snail } from '../../lib/props.mjs';
import { hedgehog, badger, frog } from '../../lib/cast2.mjs';
import { beaver, giraffe, mole } from '../../lib/cast5.mjs';
import { stage, backdrop, curtains, lamp, beam, crowd, confetti, costumeBack, cardStar, prompterHole } from '../../lib/theatre.mjs';
import { mkSay, checkFraming, place, mover } from '../_h131415.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';

const DUR = 30;
const PAIR = (cx) => [cx, 510, 1.9, 1.9];
const SHOTS = [
  [0, 3.4, 640, 450, 1.5, 1.5],
  [3.4, 6.4, 640, 400, 1.15, 1.15],
  [6.4, 10.6, 823, 470, 1.4, 1.4],
  [10.6, 14.2, 690, 470, 1.9, 1.9],
  [14.2, 17.3, 830, 500, 1.9, 1.9],
  [17.3, 18.7, 640, ...PAIR(0).slice(1)],   // Chouette + Escargot
  [18.7, 20.0, 640, ...PAIR(0).slice(1)],   // Zélie + Bastien
  [20.0, 21.3, 640, ...PAIR(0).slice(1)],   // Papi Bernard + Plouf + Mimi + Coin
  [21.3, 22.5, 900, ...PAIR(0).slice(1)],   // Piquette + Taupin
  [22.5, 30, 640, 420, 1.7, 1.7],           // PLAN SERRÉ : Roussin et Lino
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes e15fade{from{opacity:0}to{opacity:1}}`);
const ACT = [];
const say = mkSay(scr, ACT);
const FY = 600, HX = 1000, HY = 668, PY = 640;

// ───────── décor ─────────
const stageBg = `${stage({ backdrop: backdrop('night') })}${lamp(640, 66, 1, 0)}${beam(640, 178, 640, 600, 170, { on: [[0, 28]] })}`;
const watch = `<g transform="translate(8 -8)"><path d="M0 -30 V-14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle r="22" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><circle r="16" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M0 0 V-11 M0 0 L8 4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;

// ───────── personnages (chaque fonction renvoie l'élément, position donnée par place()) ─────────
const pop = (inner, t) => tf(inner, { t0: t, d: 0.35, from: 'scale(.01)', to: 'scale(1)', e: 'cubic-bezier(.2,1.6,.4,1)', o: '0px 0px' });
const bow = (inner, t, a = 11) => tf(tf(inner, { t0: t, d: 0.4, from: 'rotate(0deg)', to: `rotate(${a}deg)`, o: '0px 0px' }), { t0: t + 0.5, d: 0.4, from: 'rotate(0deg)', to: `rotate(${-a}deg)`, o: '0px 0px' });
const HAPPY = [[0, 99, 'arc']], HMOOD = [[0, 99, 'happy']];
const mk = {
  hedge: (talk, eyes, last) => `${costumeBack('star', -6, -102, 0.75)}${hedgehog(talk, { noShadow: true, item: cardStar(0, -36, 0.5, { handle: true, glow: true }), gest: talk,
    eyes, moods: HMOOD, blush: [[0, 99]] })}`,
  fox: (item, o = {}) => `${costumeBack('sun', 0, -100, 0.9)}${fox({ run: null, upright: -6, noShadow: true, item, gest: o.talk || [], talk: o.talk || [],
    eyes: o.eyes || [[0, 3.4, 'arc']], moods: [[0, 99, 'happy']], blush: [[14.5, 99]] })}`,
  rab: (item, o = {}) => `${costumeBack('moon', 0, -100, 0.8)}${rabbit({ run: null, noShadow: true, item, talk: o.talk || [], gest: o.gest || [],
    eyes: o.eyes || [[0, 99, 'arc']], moods: o.moods || [[0, 99, 'happy']] })}`,
  owl: (talk) => owl(talk, { happyAt: 99, watchAt: null, look: [[0, 30, 0]] }),
  snail: (talk) => snail(talk),
  badger: () => badger([], { noShadow: true, eyes: HAPPY, moods: HMOOD }),
  frog: () => frog([], { noShadow: true, eyes: HAPPY, moods: HMOOD }),
  beaver: (talk, tail) => beaver(talk, { noShadow: true, tail, eyes: HAPPY, moods: HMOOD }),
  giraffe: () => giraffe([], { noShadow: true, eyes: HAPPY, moods: HMOOD }),
  mimi: () => pal('mouse', { eyes: HAPPY, moods: HMOOD, giggle: [[20.3, 21.3]] }),
  coin: () => pal('duck', { eyes: HAPPY, moods: HMOOD, giggle: [[20.4, 21.3]] }),
  mole: (talk, wave) => `<g transform="scale(-1 1)">${mole(talk, { wave, moods: HMOOD })}</g>`,
};

// ── avant la révérence : plans 1 à 5 ──
const hedgeS1 = place(ACT, 'hedge', mk.hedge([[0.5, 2.8]], [[0.3, 99, 'arc']]), [{ t0: 0, t1: 6.4, x: 640, y: FY, hl: 100, hr: 70 }]);
const foxS1 = place(ACT, 'fox', mk.fox('', { eyes: [[3.4, 6.4, 'arc']] }), [{ t0: 0, t1: 6.4, x: 920, y: FY, hl: 112, hr: 112 }]);
const rabS1 = place(ACT, 'rab', mk.rab('', { talk: [[4.1, 5.4]], eyes: [[3.4, 6.4, 'arc']] }), [{ t0: 0, t1: 6.4, x: 360, y: FY, hl: 100, hr: 100 }]);
const owlS3 = place(ACT, 'owl', mk.owl([[6.9, 8.5]]), [{ t0: 6.4, t1: 10.6, x: 560, y: FY, hl: 70, hr: 100 }]);
const snailS3 = place(ACT, 'snail', mk.snail([[8.9, 10.5]]), [{ path: [[6.4, 1080, FY], [8.6, 960, FY], [10.6, 960, FY]], s: 0.9, hl: 90, hr: 90, tall: 120 }]);
const foxS4 = place(ACT, 'fox', mk.fox(vis(0, 16.4, `<g transform="scale(.85) rotate(-10)">${croissant}</g>`), { talk: [[14.5, 16.1]], eyes: [[10.6, 20, 'arc']] }), [{ t0: 10.6, t1: 17.3, x: 860, y: FY, hl: 112, hr: 112 }]);
const rabS4 = place(ACT, 'rab', mk.rab(vis(10.6, 12.1, watch), { talk: [[10.9, 12.2], [12.6, 14.0]], gest: [[10.8, 12.0]],
  eyes: [[10.6, 12.1, 'down'], [12.2, 17.3, 'arc']], moods: [[10.6, 12.1, 'calm'], [12.2, 99, 'happy']] }), [{ t0: 10.6, t1: 14.2, x: 520, y: FY, hl: 100, hr: 100 }]);

// Rouge-Gorge : il arrive, prend le croissant, s'envole
const bIn = mover(`<g transform="scale(1.4)">${bird(true, false)}</g>`, [[14.2, 1380, 230, 0, 1], [15.1, 1070, 548, 0, 1]]);
const bPerch = mover(`<g transform="scale(1.4)">${bird(false, false)}</g>`, [[15.1, 1070, 548, 0, 1], [16.8, 1070, 548, 0, 1]]);
const cro = mover(croissant, [[16.4, 916, 496, -10, 0.85], [16.8, 1030, 548, 10, 0.5]]);
const bOut = mover(`<g transform="scale(-1.4 1.4)">${bird(true, true)}</g>`, [[16.8, 1070, 548, 0, 1], [17.3, 1300, 230, 0, 1]]);

// ── la révérence, couple par couple (plans serrés au centre de la scène) ──
const PX = 0.95;
const pair = (id, inner, t, x, s = PX, hl = 80, hr = 80, extra = {}) => place(ACT, id, bow(pop(inner, t), t + 0.35), [{ t0: t, t1: t + 1.2, x, y: PY, s, hl, hr, ...extra }]);
const t1p = 17.3, t2p = 18.7, t3p = 20.0, t4p = 21.3;
const rev = [
  pair('owl', mk.owl([[17.4, 18.6]]), t1p, 540, PX, 70, 100), pair('snail', mk.snail([]), t1p, 760, 0.85, 120, 120, { tall: 120 }),
  pair('giraffe', mk.giraffe(), t2p, 500, 0.6, 90, 150), pair('beaver', mk.beaver([[18.8, 19.9]], [19.0]), t2p, 760, PX, 150, 100, { flip: true }),
  pair('badger', mk.badger(), t3p, 450, PX, 100, 100), pair('frog', mk.frog(), t3p, 620, 0.85, 120, 120), pair('mimi', mk.mimi(), t3p, 770, PX, 50, 50), pair('coin', mk.coin(), t3p, 860, PX, 50, 50),
  pair('hedge', mk.hedge([], HAPPY), t4p, 790, PX, 100, 70),
];
const moleIn = vis(t4p, t4p + 1.2, tf(mk.mole([[21.4, 22.4]], [[21.6, 22.4]]), { t0: t4p + 0.1, d: 0.6, from: 'translateY(300px)', to: 'translateY(0px)', e: 'cubic-bezier(.3,1.4,.5,1)' }));
const hole = prompterHole(HX, HY, 1, moleIn, { down: 0 });
ACT.push({ id: 'mole', x: HX, y: HY, s: 1, hl: 70, hr: 70, t0: t4p, t1: t4p + 1.2, tall: 175, pos() { return [HX, HY]; } });

// ── plan serré sur le duo (22,5 s →) : Lino, Roussin, face à la salle ──
const duoFox = place(ACT, 'fox', pop(mk.fox('', { talk: [[25.1, 26.6]], eyes: [[22.5, 27, 'wide'], [27, 30, 'arc']] }), 22.5), [{ t0: 22.5, t1: 30, x: 770, y: 620, s: 1.0, hl: 100, hr: 110 }]);
const duoRab = place(ACT, 'rab', pop(mk.rab('', { talk: [[22.9, 24.5]], gest: [[22.9, 24.5]], eyes: [[22.5, 27, 'wide'], [27, 30, 'arc']] }), 22.5), [{ t0: 22.5, t1: 30, x: 510, y: 620, s: 1.0, hl: 90, hr: 90 }]);

const audience = crowd({ y: 790, x0: 60, x1: 1220, n: 9, s: 1.5, row: 0, seed: 7, stand: 3.6, clap: [[4.2, 30]] });
const world = `${stageBg}${hedgeS1}${foxS1}${rabS1}${owlS3}${snailS3}${rabS4}${foxS4}${bIn}${bPerch}${cro}${bOut}${hole}${rev.join('')}${duoRab}${duoFox}${curtains({ start: 'open' })}${audience}`;
const dim = `<g style="opacity:0;${an({ n: 'e15fade', d: 3.0, t: 26.8, f: 'both' })}"><rect width="${W}" height="${H}" fill="#070a24" opacity=".5"/></g>`;

// ───────── bulles, bruitages, carton ─────────
const fx = vis(3.8, 99, confetti(3.8, 30, 3)) + timeBadge(20, 30) +
  say('hedge', 'Brille pour toujours !', 0.5, 2.7) +
  say('rab', 'On a réussi !', 4.1, 1.4) +
  say('owl', 'Mme Escargot ! Vous voilà !', 6.9, 1.8) +
  say('snail', 'Me voici, pour la fin !', 8.9, 1.7) +
  say('rab', 'Je range ma montre.', 10.9, 1.4) +
  say('rab', 'Maintenant, je vous regarde.', 12.5, 1.7) +
  say('fox', 'Pour toi, Rouge-Gorge.', 14.5, 1.7) +
  say('owl', 'La révérence, tout le monde !', 17.35, 1.25) +
  say('beaver', 'Solide, solide, solide !', 18.75, 1.2) +
  say('mole', 'Merci, tout le monde !', 21.4, 1.05) +
  say('rab', 'Merci d’avoir été là !', 22.9, 1.7) +
  say('fox', 'Au revoir, les amis !', 25.1, 1.6);
const card = endCard5(27.4, 'Merci d’avoir été là.', 'Fin de la série', 112);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${dim}${solid(fx)}${card}
</svg>`;
sfxEv.push({ name: 'handbell', t: 3.8 }, { name: 'laugh', t: 4.3 }, { name: 'chirp', t: 14.6 }, { name: 'chime', t: 16.4 }, { name: 'handbell', t: 17.3 }, { name: 'wave', t: 18.0 }, { name: 'laugh', t: 20.4 }, { name: 'chime', t: 27.4 });
checkFraming(SHOTS, ACT, 's5e15');
writeFileSync(new URL('./dernier-rideau.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
