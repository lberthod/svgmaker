// « LES ANOMALIES » ép. 4 · La Directrice : manga d'action, 40 s, 1080x1920 (Reel).
// Après l'attaque du drone espion, tous les écrans de Néo-Lyre basculent sur le Dr Kessler : hologramme géant,
// avis de recherche, récompense d'un million. Volta grille un écran… Fin : « Livrez-les donc… à moi. » — des milliers
// de drones décollent de la Tour OMEGA.
// Usage : node make.mjs → les-anomalies-ep4.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom,
  bubbleFor, tag, figure, hand, put, aura, smoke, BG, GROUND, cam, particles, streaks, shakeAt, flashAt, sfx, mv, go, anim,
  fadeIn, ghost, bobbing, holo, tower, header, hook, finalCard, city, droneG, waterTower, searchlight } = L;
L.reseed(404);
L.svgCss('.kflick{animation:kflick 2.3s steps(1) infinite} @keyframes kflick{0%{opacity:1}88%{opacity:.5}91%{opacity:1}95%{opacity:.65}97%{opacity:1}}');

const LINES = [
  { who: 'givre', t0: 1.9, t1: 3.4, text: 'Ils nous ont trouvés.' },
  { who: 'echo', t0: 5.3, t1: 6.7, text: 'Les écrans de la ville !' },
  { who: 'kessler', t0: 8.9, t1: 10.7, text: 'Citoyens de la ville.' },
  { who: 'kessler', t0: 12.4, t1: 14.3, text: 'Ces mutants sont dangereux.' },
  { who: 'kessler', t0: 16.0, t1: 17.9, text: 'Un million pour chacun.' },
  { who: 'volta', t0: 19.9, t1: 21.4, text: "Un million ? C'est tout ?" },
  { who: 'mirage', t0: 23.0, t1: 24.8, text: 'Toute la ville va vous chasser.' },
  { who: 'givre', t0: 25.3, t1: 26.8, text: 'Alors on reste ensemble.' },
  { who: 'kessler', t0: 27.5, t1: 29.1, text: 'Vous ne pourrez pas fuir.' },
  { who: 'volta', t0: 29.4, t1: 30.6, text: 'Mais tais-toi !' },
  { who: 'kessler', t0: 31.8, t1: 33.7, text: 'Livrez-les donc… à moi.' },
  { who: 'echo', t0: 34.9, t1: 36.6, text: 'Il y en a partout !' },
];
L.setLines(LINES);

// ---------- Décors et effets propres à l'épisode ----------
// hologramme rouge de Kessler : faisceau, silhouette translucide, bandes de balayage qui défilent
const holoK = (x, yb, s, pose = 'hips', anim_ = 'idle') => {
  const hgt = 720 * s, wd = 300 * s;
  const bands = Array.from({ length: Math.ceil(hgt / 34) + 2 }, (_, i) => `<rect x="${f(x - wd)}" y="${f(yb - hgt + i * 34 - 34)}" width="${f(wd * 2)}" height="10"/>`).join('');
  return `<g class="kflick">
    <polygon points="${f(x - 60)},${f(yb + 40)} ${f(x + 60)},${f(yb + 40)} ${f(x + wd)},${f(yb - hgt)} ${f(x - wd)},${f(yb - hgt)}" fill="${RED}" opacity=".1"/>
    <g opacity=".86">${put(figure('kessler', pose, { anim: anim_ }), x, yb, s)}</g>
    <g fill="${RED}" opacity=".22" class="scanlines" style="animation-iteration-count:infinite;animation-duration:.5s">${bands}</g>
    <ellipse cx="${x}" cy="${f(yb + 10)}" rx="${f(wd * 0.8)}" ry="${f(30 * s)}" fill="none" stroke="${RED}" stroke-width="6" filter="url(#glow)"/></g>`;
};
// immeuble avec écran géant (contenu = fonction des coordonnées de l'écran)
const building = (x, w, top, lit = RED) => {
  let win = '';
  for (let yy = top + 40; yy < H + 300; yy += 60) for (let xx = x + 24; xx < x + w - 30; xx += 46) if (rnd() > 0.7) win += `<rect x="${f(xx)}" y="${f(yy)}" width="16" height="24"/>`;
  return `<rect x="${x}" y="${top}" width="${w}" height="${H + 1000 - top}" fill="#0a0a10" stroke="#2a2a36" stroke-width="4"/><g fill="${lit}" opacity=".35">${win}</g>`;
};
const omega = (cx, cy, r, color = RED, sw = 14) => `<path d="M${f(cx - r * 0.9)} ${f(cy + r * 0.6)} L${f(cx - r * 0.35)} ${f(cy + r * 0.6)} L${f(cx - r * 0.35)} ${f(cy + r * 0.3)} A${r} ${r} 0 1 1 ${f(cx + r * 0.35)} ${f(cy + r * 0.3)} L${f(cx + r * 0.35)} ${f(cy + r * 0.6)} L${f(cx + r * 0.9)} ${f(cy + r * 0.6)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round" filter="url(#glow)"/>`;
// petit visage de Kessler pour les écrans lointains
const kFace = (x, y, w, h) => holo(x, y, w, h, put(figure('kessler', 'stand', { anim: 'idle' }), x + w / 2, y + h * 0.35 + 600 * (h / 520), h / 520));
// verrière brisée (fin de l'ép. 3) : armature tordue + éclats de verre au sol
const shards = (n, [x0, x1], y) => Array.from({ length: n }, () => {
  const cx = rnd(x0, x1), cy = y + rnd(-8, 30), s = rnd(14, 46), a = rnd(0, 6.28);
  return `<polygon points="${f(cx)},${f(cy - s)} ${f(cx + s * 0.6 * Math.cos(a))},${f(cy)} ${f(cx - s * 0.5)},${f(cy + s * 0.3)}" fill="#c8f1ff" opacity="${f(rnd(0.35, 0.8))}" stroke="${INK}" stroke-width="2"/>`;
}).join('');
// foule de silhouettes, téléphones levés (lueur)
const person = (x, yb, s, phone = true) => put(bobbing(`<g>
  <path d="M-60 0 L-52 -200 Q0 -240 52 -200 L60 0Z" fill="#0b0b11" stroke="#30303c" stroke-width="4"/>
  <circle cx="0" cy="-260" r="48" fill="#0b0b11" stroke="#30303c" stroke-width="4"/>
  ${phone ? `<path d="M40 -190 L74 -320" stroke="#30303c" stroke-width="30" stroke-linecap="round"/><path d="M40 -190 L74 -320" stroke="#0b0b11" stroke-width="22" stroke-linecap="round"/><rect x="62" y="-372" width="26" height="42" rx="5" fill="${GIVRE}" opacity=".9"/><rect x="58" y="-376" width="34" height="50" rx="6" fill="${GIVRE}" opacity=".25" filter="url(#glow)"/>` : ''}</g>`, 6, rnd(0.6, 1.2)), x, yb, s);
// drone qui décolle de (x0,y0) et file vers (x1,y1) en grossissant
const droneR = `<circle cx="0" cy="0" r="80" fill="url(#rglow)"/>${droneG()}<path d="M-46 -12 L46 -12 L36 22 L-36 22Z" fill="none" stroke="${RED}" stroke-width="5"/>`;
const launch = (t, d, [x0, y0], [x1, y1], s1) => anim(t, d, [`from{transform:translate(${f(x0)}px,${f(y0)}px) scale(.18)}`, `to{transform:translate(${f(x1)}px,${f(y1)}px) scale(${s1})}`], droneR, { ease: 'cubic-bezier(.3,0,.8,.8)' });
// appui en lettres rouges dans un écran
const rtx = (x, y, txt, size = 44) => `<text x="${x}" y="${y}" class="rt" style="font-size:${size}px">${txt}</text>`;

// =====================================================================
// 1 · La verrière brisée (0 – 4 s) : le trio dans les débris de la planque, fumée, nuit
scene(0, 4, cam(0, 4, [[0, 0, 60, 0, 1.18], [4, 0, -30, -1, 1.02]], `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".1"/>
  ${an('parx', 0, city(1250, '#07070b', RED))}
  ${an('pulse', 0, `<circle cx="760" cy="1000" r="520" fill="url(#rglow)"/>`, [760, 1000], ';animation-iteration-count:infinite')}
  ${waterTower(900, 1640, 0.85)}
  ${GROUND(1640, '#07070b')}
  <path d="M-200 1640 L120 1240 L420 1460 M600 1640 L760 1300 L1000 1420" fill="none" stroke="#3a3a46" stroke-width="16" stroke-linejoin="round"/>
  ${shards(40, [-100, 1180], 1650)}
  ${an('drift', 0, smoke(760, 1500, 10, 520, '#3a3a46', 0.75))}
  ${particles(30, '#c8f1ff', [-100, 1180], [200, 1500], [40, 600], [2, 5], [1.5, 3], 0.6)}
  ${put(figure('volta', 'hips', { anim: 'idle' }), 250, 1660, 0.64)}
  ${mv(0.2, 1.4, [-40, 0], put(figure('givre', 'point', { anim: 'idle' }), 540, 1680, 0.66))}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 820, 1650, 0.62, -1)}
`, [540, 1300]) + `
  ${header(4, 'La Directrice')}
  ${hook('Ce soir, toute la ville les cherche.', 0.3, 860)}
  ${bubbleFor(0, 560, 620, ['Ils nous ont trouvés.'], [-20, 90])}
`);
sfx('hit', 0.05); sfx('wind', 0.2); sfx('glass', 0.6); sfx('step', 1.5);

// 2 · Les écrans basculent (4 – 8 s) : pubs bleues → Ω rouge partout, travelling latéral
const scrA = [90, 470, 320, 400], scrB = [640, 380, 360, 460];
scene(4, 8, cam(4, 8, [[4, -70, 0, 0, 1.12], [5.1, -20, 0, 0, 1.12], [5.3, -20, 0, 0, 1.18, 'ease-out'], [8, 70, -30, 1, 1.12]], `
  ${BG(NIGHT)}
  ${city(1100, '#07070b', VOLTA)}
  ${building(40, 420, 380)}${building(600, 440, 300)}
  ${vis(4, 5.1, `${holo(...scrA, `${rtx(250, 650, 'NÉO-LYRE', 50)}${rtx(250, 720, 'TV · 24H', 36)}`, GIVRE)}${holo(...scrB, `${rtx(820, 590, 'SOLDES', 56)}${rtx(820, 670, '−50 %', 64)}`, GIVRE)}`)}
  ${vis(5.1, 8, `${an('pop', 5.1, holo(...scrA, omega(250, 670, 70)))}${an('pop', 5.25, holo(...scrB, omega(820, 610, 90)))}
    ${an('blink', 5.1, `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".08"/>`, null, ';animation-iteration-count:3')}`)}
  ${particles(30, RED, [0, W], [300, 1300], [0, -200], [2, 4], [1.5, 3], 0.6)}
  ${GROUND(1560, '#050508')}
  <path d="M-700 1560 L1780 1560" stroke="${RED}" stroke-width="4" opacity=".4"/>
  ${put(figure('givre', 'stand', { anim: 'idle' }), 330, 1720, 0.5)}
  ${put(figure('volta', 'guard', { anim: 'fight' }), 540, 1730, 0.52)}
  ${mv(5.3, 0.6, [0, 30], put(figure('echo', 'point', { anim: 'idle', float: true }), 750, 1710, 0.5, -1))}
`, [540, 1000]) + `
  ${onom(540, 330, 'BZZT · BZZT', 76, -3, RED, INK, 5.1)}
  ${bubbleFor(1, 540, 1180, ['Les écrans de la ville !'], [180, 90])}
`);
sfx('holo', 4.2); sfx('glitch', 5.0); sfx('alarm', 5.4); sfx('beep', 6.9);

// 3 · L'hologramme géant (8 – 12 s) : Kessler se lève au-dessus de la ville, contre-plongée
scene(8, 12, cam(8, 12, [[8, 0, 260, 0, 1.3], [8.85, 0, 0, 0, 1.03, 'ease-out'], [12, 0, -30, 0, 1.1]], `
  ${BG('#0c0508')}
  ${an('pulse', 8, `<circle cx="540" cy="1100" r="800" fill="url(#rglow)"/>`, [540, 1100], ';animation-iteration-count:infinite')}
  ${radial(540, 900, 90, '#2a0a10', [500, 700])}
  ${searchlight(140, 'swayL', 8)}${searchlight(940, 'swayR', 8)}
  ${anim(8.2, 0.7, ['from{transform:scale(1,0);opacity:0}', '60%{opacity:1}', 'to{transform:scale(1,1);opacity:1}'], holoK(540, 1720, 1.5), { origin: [540, 1760], ease: 'cubic-bezier(.2,1.2,.4,1)' })}
  ${city(1700, '#050508', RED)}
  ${particles(50, RED, [100, 980], [600, 1700], [0, -400], [2, 6], [1, 2.2], 0.8)}
  ${vis(8.2, 9.2, streaks(20, RED, [400, 1700], 0, [3, 6], [0.2, 0.4], 90))}
`, [540, 1300]) + `
  ${tag(70, 270, 'DR KESSLER', 'PROJET OMEGA', RED, 9.0)}
  ${bubbleFor(2, 540, 420, ['Citoyens de la ville.'], [0, 80])}
`);
sfx('rumble', 8.0); sfx('beam', 8.2); sfx('eye', 8.6); sfx('crowd', 10.6);

// 4 · Avis de recherche (12 – 15,5 s) : quatre écrans claquent, tampon RECHERCHÉS
const poster = (px, py, who, label, delay, from) => an(from, delay, holo(px, py, 420, 420, `
  <rect x="${px}" y="${py}" width="420" height="420" fill="${INK}" opacity=".55"/>
  ${put(figure(who, 'stand', { anim: 'idle', glow: who === 'mirage' }), px + 210, py + 720, 1.0)}
  <rect x="${px}" y="${py + 340}" width="420" height="80" fill="${INK}"/>
  ${rtx(px + 210, py + 395, label, 38)}`));
scene(12, 15.5, shakeAt(13.3, cam(12, 15.5, [[12, 0, 0, -2, 1.1], [13.3, 0, 0, 0, 1.04, 'ease-out'], [15.5, 0, -20, 2, 1.08]], `
  ${BG(INK)}
  ${radial(540, 800, 120, '#3a0a12', [460, 640])}
  ${poster(90, 340, 'volta', 'RECHERCHÉE', 12.1, 'inL')}
  ${poster(570, 340, 'givre', 'RECHERCHÉ', 12.3, 'inR')}
  ${poster(90, 800, 'echo', 'RECHERCHÉE', 12.5, 'inL')}
  ${poster(570, 800, 'mirage', 'RECHERCHÉE', 12.7, 'inR')}
  ${particles(30, RED, [0, W], [300, 1400], [0, -160], [2, 4], [1.5, 3], 0.5)}
`, [540, 800]), 2) + `
  ${onom(540, 820, 'DANGER Ω', 130, -12, RED, INK, 13.3)}
  ${bubbleFor(3, 540, 1340, ['Ces mutants', 'sont dangereux.'], [0, -80])}
`);
sfx('panel', 12.1); sfx('panel', 12.3); sfx('panel', 12.5); sfx('panel', 12.7); sfx('punch', 13.3); sfx('alarm', 13.6);

// 5 · La récompense (15,5 – 19,5 s) : la foule lève les téléphones, l'écran affiche le million
scene(15.5, 19.5, cam(15.5, 19.5, [[15.5, 0, -320, 0, 1.15], [17.0, 0, 0, 0, 1.04, 'ease-out'], [19.5, 30, 20, 1, 1.1]], `
  ${BG(NIGHT)}
  ${building(60, 960, 260)}
  ${an('pop', 15.6, holo(110, 330, 860, 560, `
    ${rtx(540, 430, 'RÉCOMPENSE', 64)}
    ${an('slam', 16.4, `<text x="540" y="590" class="rt" style="font-size:110px;fill:${VOLTA}">1 000 000</text>`)}
    ${rtx(540, 700, 'PAR MUTANT', 48)}
    ${omega(540, 800, 40, RED, 9)}`))}
  ${particles(40, VOLTA, [150, 930], [380, 880], [0, -120], [2, 5], [1, 2], 0.7)}
  ${GROUND(1700, '#050508')}
  ${[0, 1, 2].map((row) => Array.from({ length: 7 - row }, (_, i) => person(f(-40 + (i + rnd(0.1, 0.9)) * (1160 / (7 - row))), 1700 + row * 170, 0.9 + row * 0.35, rnd() > 0.25)).join('')).join('')}
`, [540, 1200]) + `
  ${bubbleFor(4, 540, 1060, ['Un million', 'pour chacun.'], [0, -90])}
`);
sfx('holo', 15.6); sfx('crowd', 15.8); sfx('klang', 16.4); sfx('crowd', 18.0);

// 6 · Volta s'énerve (19,5 – 22,5 s) : étincelles, Givre soupire, Kessler parle toujours au loin
scene(19.5, 22.5, cam(19.5, 22.5, [[19.5, 0, 0, 0, 1.05], [20.0, 0, 0, 0, 1.16, 'ease-out'], [22.5, -40, -20, -2, 1.2]], `
  ${BG(NIGHT)}
  ${city(1250, '#07070b', RED)}
  <g opacity=".7">${holoK(800, 1250, 0.6, 'point')}</g>
  ${GROUND(1680, '#07070b')}
  ${shards(18, [-100, 1180], 1690)}
  ${radial(300, 1150, 60, '#3a3410', [260, 420])}
  ${put(figure('givre', 'sad', { anim: 'idle' }), 780, 1690, 0.72, -1)}
  ${an('shakeS', 20.0, put(figure('volta', 'charge', { anim: 'charge', glow: true }), 300, 1700, 0.9), null, ';animation-iteration-count:4')}
  ${aura(300, 1250, VOLTA, 3, 120, 19.9)}
  ${bolt(170, 980, 120, 820, VOLTA, 8, 6, 30, 20.0)}${bolt(430, 980, 500, 830, VOLTA, 8, 6, 30, 20.1)}
  ${particles(40, VOLTA, [150, 450], [900, 1350], [0, -400], [3, 7], [0.4, 0.9])}
`, [300, 1200]) + `
  ${bubbleFor(5, 560, 560, ['Un million ?', "C'est tout ?"], [-160, 100])}
  ${onom(300, 760, 'BZZ', 90, -8, VOLTA, INK, 20.0)}
`);
sfx('electric', 19.9); sfx('zap', 20.1);

// 7 · Mirage surgit (22,5 – 27 s) : contour vert, puis la fille apparaît ; Givre fait face
scene(22.5, 27, cam(22.5, 27, [[22.5, 80, 0, 0, 1.12], [24.9, 60, 0, 0, 1.12], [25.3, -60, 0, 0, 1.12, 'ease-out'], [27, -80, -20, 1, 1.16]], `
  ${BG('#08100c')}
  ${city(1250, '#060a08', RED)}
  ${[[60, 1000], [380, 960], [700, 1020], [960, 980]].map(([x, y]) => `<g class="flick1" style="animation-duration:${f(rnd(0.4, 1))}s"><rect x="${x}" y="${y}" width="70" height="50" fill="${RED}" opacity=".7"/></g>`).join('')}
  ${an('pulse', 22.5, `<circle cx="820" cy="1350" r="420" fill="url(#gglow)"/>`, [820, 1350], ';animation-iteration-count:infinite')}
  ${GROUND(1660, '#050806')}
  ${put(figure('volta', 'hips', { anim: 'idle' }), 150, 1670, 0.6)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 520, 1650, 0.6)}
  ${mv(25.2, 0.6, [-80, 0], put(figure('givre', 'point', { anim: 'idle' }), 340, 1680, 0.64))}
  ${vis(22.5, 23.1, ghost(put(figure('mirage', 'hips', { anim: 'idle' }), 830, 1660, 0.72, -1), 0.1, 0.4))}
  ${vis(23.0, 27, fadeIn(23.0, 0.4, put(figure('mirage', 'hips', { anim: 'idle', glow: true }), 830, 1660, 0.72, -1)))}
  ${particles(40, MIRAGE, [650, 1000], [1100, 1660], [0, -300], [2, 6], [0.8, 1.8])}
`, [540, 1300]) + `
  ${onom(820, 980, 'SHIIN', 90, 6, MIRAGE, INK, 22.9)}
  ${bubbleFor(6, 600, 620, ['Toute la ville', 'va vous chasser.'], [180, 100])}
  ${bubbleFor(7, 420, 640, ['Alors on reste', 'ensemble.'], [-60, 100])}
`);
sfx('shimmer', 22.6); sfx('invis', 23.0); sfx('step', 25.3);

// 8 · L'écran grillé (27 – 31 s) : gros plan de Kessler, Volta lui lance la foudre, l'écran explose
const vH = hand('throw', 'ra', 170, 1640, 0.72);
scene(27, 31, shakeAt(30.0, cam(27, 31, [[27, 0, 80, 0, 1.2], [28.8, 0, 0, 0, 1.06, 'ease-out'], [29.9, 0, 0, 0, 1.1, 'ease-in'], [30.1, 0, 0, 0, 1.0], [31, 30, -20, -2, 1.08]], `
  ${BG(NIGHT)}
  ${building(30, 1020, 240)}
  ${vis(27, 30.0, holo(80, 300, 920, 900, `${put(figure('kessler', 'stand', { anim: 'idle' }), 540, 2280, 2.6)}`))}
  ${vis(30.0, 31, `<rect x="80" y="300" width="920" height="900" fill="#050508" stroke="#3a3a46" stroke-width="8"/>
    ${an('impact', 30.0, burst(560, 700, 80, 330, 14, '#fff', VOLTA), [560, 700])}
    ${cracks(560, 700, 9, 420, PAPER, 6)}
    ${particles(50, '#c8f1ff', [400, 720], [560, 840], [0, 700], [3, 9], [0.6, 1.2])}
    ${an('drift', 30.1, smoke(560, 800, 8, 400, '#5d5d68', 0.85))}`)}
  ${vis(29.8, 30.4, bolt(f(vH[0]), f(vH[1]), 560, 700, VOLTA, 22, 10, 50, 29.8))}
  ${GROUND(1640, '#050508')}
  ${vis(27, 29.6, put(figure('volta', 'guard', { anim: 'fight' }), 170, 1640, 0.72))}
  ${vis(29.6, 31, put(figure('volta', 'throw', { anim: 'fight', glow: true }), 170, 1640, 0.72))}
  ${vis(29.6, 31, aura(f(vH[0]), f(vH[1]), VOLTA, 2, 60, 29.6))}
`, [540, 900]), 3) + `
  ${bubbleFor(8, 620, 1320, ['Vous ne pourrez', 'pas fuir.'], [0, -90])}
  ${bubbleFor(9, 600, 1320, ['Mais tais-toi !'], [-260, 80])}
  ${vis(30.0, 31, onom(580, 520, 'BZZAK !!', 140, -6, VOLTA, INK, 30.0))}
  ${flashAt(30.0)}
`);
sfx('charge', 29.0); sfx('zap', 29.8); sfx('glass', 30.0); sfx('bigboom', 30.05); sfx('powerdown', 30.3);

// 9 · Tous les écrans (31 – 34,5 s) : un écran grillé, cent autres la montrent ; la Tour s'éveille
scene(31, 34.5, cam(31, 34.5, [[31, 0, 0, 0, 1.0], [34.5, 0, 140, 0, 1.28]], `
  ${BG('#0c0508')}
  ${an('pulse', 31, `<circle cx="540" cy="520" r="620" fill="url(#rglow)"/>`, [540, 520], ';animation-iteration-count:infinite')}
  ${vis(33.5, 34.5, radial(600, 470, 70, RED, [160, 260]))}
  ${tower(600, 1500, 0.55)}
  ${building(840, 330, 680)}
  ${kFace(860, 740, 200, 180)}${kFace(880, 1000, 180, 160)}
  ${anim(30.9, 0.5, ['from{opacity:0}', 'to{opacity:.9}'], holoK(260, 1560, 1.4, 'point', 'cast'))}
  ${building(-60, 200, 1420)}${building(900, 260, 1220)}
  ${kFace(-20, 1460, 170, 150)}${kFace(930, 1270, 140, 130)}
  ${city(1600, '#050508', RED)}
  ${vis(33.4, 34.5, an('epulse', 33.4, `<circle cx="600" cy="470" r="46" fill="${RED}" filter="url(#glow)"/>`, [600, 470], ';animation-iteration-count:infinite'))}
  ${particles(40, RED, [200, 880], [300, 1500], [0, -300], [2, 5], [1, 2], 0.7)}
`, [540, 520]) + `
  ${bubbleFor(10, 560, 400, ['Livrez-les donc…', 'à moi.'], [-200, 100])}
`);
sfx('siren', 31.2); sfx('eye', 31.8); sfx('rumble', 33.4); sfx('charge', 33.0);

// 10 · L'essaim décolle + carton final (34,5 – 40 s) : des milliers de drones jaillissent de la Tour
const top = [760, 430];
const flights = Array.from({ length: 84 }, (_, i) => {
  const t = 34.6 + i * 0.058 + rnd(0, 0.05), ang = rnd(-3.4, 0.25), dist = rnd(1300, 1800);
  return launch(t, rnd(1.6, 2.6), [top[0] + rnd(-30, 30), top[1] + rnd(-20, 20)], [top[0] + Math.cos(ang) * dist, top[1] + Math.sin(ang) * dist * 0.8], f(rnd(0.9, 2.0)));
}).join('');
scene(34.5, 40, shakeAt(34.6, cam(34.5, 40, [[34.5, 0, 0, 0, 1.15], [36.6, 0, 40, 0, 1.03, 'ease-out'], [40, 0, 0, 0, 1.08]], `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>
  ${an('pulse', 34.5, `<circle cx="760" cy="500" r="700" fill="url(#rglow)"/>`, [760, 500], ';animation-iteration-count:infinite')}
  ${an('parx', 34.5, city(1350, '#07070b', RED))}
  ${tower(760, 1450, 0.52)}
  ${[[-700, -500], [-300, -700], [250, -700], [600, -400], [-900, -150]].map((d) => particles(45, RED, [730, 790], [400, 460], d, [3, 7], [1.2, 2.4], 0.9)).join('')}
  ${flights}
  ${GROUND(1700, '#050508')}
  <path d="M-700 1700 L1780 1700" stroke="${RED}" stroke-width="4" opacity=".5"/>
  ${put(figure('givre', 'guard', { anim: 'fight' }), 160, 1720, 0.56)}
  ${put(figure('volta', 'charge', { anim: 'charge', glow: true }), 370, 1730, 0.58)}
  ${put(figure('echo', 'castUp', { anim: 'cast', float: true, glow: true }), 600, 1710, 0.56)}
  ${put(figure('mirage', 'guard', { anim: 'fight' }), 850, 1720, 0.56, -1)}
`, [540, 1200]), 2) + `
  ${bubbleFor(11, 380, 700, ['Il y en a', 'partout !'], [80, 100])}
  ${finalCard(36.9, 'ÉPISODE 5 BIENTÔT')}
`);
sfx('bigboom', 34.6); sfx('swarm', 34.8); sfx('swarm', 35.8); sfx('drone', 36.6); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep4');
