// Génère manga-combat-v2.svg (voix Ming, bulles calées sur DIALOGUE de audio.py) : « CROC NOIR », manga seinen (noir, blanc, rouge), 30 s, 1080x1920.
// Un sabreur affronte une bête colossale : révélation, face-à-face, charge, choc, riposte, coup final.
import { writeFileSync } from 'node:fs';

const W = 1080, H = 1920, T = 30;
const PAPER = '#f2eee4', INK = '#0c0c0c', RED = '#c3121f';

// Hasard déterministe : même SVG à chaque génération
let seed = 7;
const rnd = (a = 0, b = 1) => { seed = (seed * 16807) % 2147483647; return a + ((seed - 1) / 2147483646) * (b - a); };
const f = (n) => Math.round(n * 10) / 10;

// ---------- Plans : apparition sèche (coupe manga) ----------
const scenes = [];
const pc = (s) => +((s / T) * 100).toFixed(4);
const g = (n) => +n.toFixed(4);
const scene = (id, start, end, body) => {
  const a = pc(start), b = pc(end);
  const kf = start === 0
    ? `0%,${b}%{opacity:1} ${g(b + 0.01)}%,100%{opacity:0}`
    : end >= T
      ? `0%,${g(a - 0.01)}%{opacity:0} ${a}%,100%{opacity:1}`
      : `0%,${g(a - 0.01)}%{opacity:0} ${a}%,${b}%{opacity:1} ${g(b + 0.01)}%,100%{opacity:0}`;
  scenes.push({ css: `@keyframes v_${id}{${kf}} #${id}{animation:v_${id} ${T}s linear both}`, svg: `<g id="${id}">${body}</g>` });
};

// ---------- Éléments graphiques ----------
// Lignes de vitesse radiales (focus manga)
const radial = (cx, cy, n, color, rIn = [300, 560], rOut = 1700) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + rnd(-0.02, 0.02);
    const w = rnd(0.004, 0.018), r0 = rnd(...rIn);
    const p = (r, d) => `${f(cx + Math.cos(ang + d) * r)},${f(cy + Math.sin(ang + d) * r)}`;
    s += `<polygon points="${p(r0, 0)} ${p(rOut, -w)} ${p(rOut, w)}"/>`;
  }
  return `<g fill="${color}">${s}</g>`;
};
// Lignes de vitesse horizontales
const hlines = (n, color, y0 = 0, y1 = H) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const y = rnd(y0, y1), x = rnd(-200, W), l = rnd(250, 900), h = rnd(2, 9);
    s += `<polygon points="${f(x)},${f(y)} ${f(x + l)},${f(y - h / 2)} ${f(x + l)},${f(y + h / 2)}"/>`;
  }
  return `<g fill="${color}">${s}</g>`;
};
// Pluie (boucle verticale)
const rain = (color, op, n = 140) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rnd(-100, W + 200), y = rnd(-H, H), l = rnd(40, 120);
    s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - l * 0.25)}" y2="${f(y + l)}"/>`;
  }
  return `<g class="rain" stroke="${color}" stroke-width="2.5" opacity="${op}">${s}</g>`;
};
// Éclaboussures d'encre rouge
const splatter = (cx, cy, n, spread, cls = '', delay = 0) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = rnd(0, Math.PI * 2), d = rnd(0, spread) * rnd(0.3, 1), r = rnd(4, 26) * (1 - d / spread * 0.6);
    s += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d * 0.7)}" r="${f(r)}"/>`;
  }
  return `<g class="${cls}" style="animation-delay:${delay}s" fill="${RED}">${s}</g>`;
};
// Étincelles
const sparks = (cx, cy, n, color) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = rnd(0, Math.PI * 2), d0 = rnd(60, 160), d1 = d0 + rnd(80, 320);
    s += `<line x1="${f(cx + Math.cos(a) * d0)}" y1="${f(cy + Math.sin(a) * d0)}" x2="${f(cx + Math.cos(a) * d1)}" y2="${f(cy + Math.sin(a) * d1)}" stroke-width="${f(rnd(3, 8))}"/>`;
  }
  return `<g stroke="${color}" stroke-linecap="round">${s}</g>`;
};
// Étoile d'impact
const burst = (cx, cy, rIn, rOut, n, fill) => {
  let pts = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? rIn * rnd(0.8, 1.1) : rOut * rnd(0.7, 1.15);
    pts += `${f(cx + Math.cos(a) * r)},${f(cy + Math.sin(a) * r)} `;
  }
  return `<polygon points="${pts}" fill="${fill}"/>`;
};
// Fissures
const cracks = (cx, cy, n, len, color, w = 5) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    let x = cx, y = cy, a = rnd(0, Math.PI * 2), d = `M${f(x)} ${f(y)}`;
    for (let k = 0; k < 5; k++) { a += rnd(-0.6, 0.6); x += Math.cos(a) * len / 5; y += Math.sin(a) * len / 5; d += ` L${f(x)} ${f(y)}`; }
    s += `<path d="${d}"/>`;
  }
  return `<g fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round">${s}</g>`;
};
// Case de manga : fond + contenu découpé + bordure
let clipDefs = '';
const panel = (id, x, y, w, h, body, bg = PAPER) => {
  clipDefs += `<clipPath id="c_${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
  return `<g clip-path="url(#c_${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>${body}</g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="10"/>`;
};
// Onomatopée
const onom = (x, y, txt, size, rot, fill, stroke, delay, cls = 'slam') =>
  `<g class="${cls}" style="animation-delay:${delay}s"><text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" class="onom" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.round(size / 9)}">${txt}</text></g>`;
// Bulle ronde (avec queue) ou hérissée (voix de la bête)
const bubble = (x, y, lines, delay, tail = [0, 0], spiky = false) => {
  const w = Math.max(...lines.map((l) => l.length)) * 23 + 90, h = lines.length * 50 + 60;
  const shape = spiky
    ? (() => { let p = ''; const n = 22; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, r = i % 2 ? 1 : 1.22; p += `${f(x + Math.cos(a) * w / 2 * r)},${f(y + Math.sin(a) * h / 2 * r)} `; } return `<polygon points="${p}" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>`; })()
    : `<path d="M${x + tail[0] - 26} ${y + h / 2 - 12} L${x + tail[0] + tail[1]} ${y + h / 2 + 70} L${x + tail[0] + 22} ${y + h / 2 - 12}Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
       <ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" stroke="${INK}" stroke-width="6"/>
       <path d="M${x + tail[0] - 20} ${y + h / 2 - 9} L${x + tail[0] + 16} ${y + h / 2 - 9}" stroke="#fff" stroke-width="10"/>`;
  const txt = lines.map((l, i) => `<text x="${x}" y="${y - ((lines.length - 1) * 50) / 2 + i * 50 + 14}" class="bt" fill="${spiky ? PAPER : INK}">${l}</text>`).join('');
  return `<g class="pop" style="animation-delay:${delay}s">${shape}${txt}</g>`;
};
const caption = (x, y, txt, delay, w = null) => {
  const ww = w || txt.length * 19 + 50;
  return `<g class="pop" style="animation-delay:${delay}s"><rect x="${x}" y="${y}" width="${ww}" height="64" fill="${PAPER}" stroke="${INK}" stroke-width="5"/><text x="${x + 24}" y="${y + 43}" class="cap">${txt}</text></g>`;
};

// ---------- Personnages (définis une fois, réutilisés via <use>) ----------
const monster = `<g id="monster">
  <path d="M-90 -430 C-190 -500 -240 -610 -200 -740 C-160 -630 -110 -570 -45 -480Z M90 -430 C190 -500 240 -610 200 -740 C160 -630 110 -570 45 -480Z" fill="${INK}"/>
  <path d="M-420 -200 C-570 -60 -610 120 -570 300 L-530 420 L-470 300 C-480 160 -430 40 -360 -40Z M420 -200 C570 -60 610 120 570 300 L530 420 L470 300 C480 160 430 40 360 -40Z" fill="${INK}"/>
  <path d="M-110 -330 C-300 -340 -440 -280 -460 -120 C-480 40 -400 200 -300 300 L-220 520 L220 520 L300 300 C400 200 480 40 460 -120 C440 -280 300 -340 110 -330Z" fill="${INK}"/>
  <path d="M-135 -420 C-145 -505 -60 -545 0 -545 C60 -545 145 -505 135 -420 L112 -318 C80 -262 -80 -262 -112 -318Z" fill="${INK}"/>
  <path d="M-570 300 L-610 470 L-560 380 L-555 500 L-520 390 L-490 480 L-500 360Z M570 300 L610 470 L560 380 L555 500 L520 390 L490 480 L500 360Z" fill="${INK}" stroke="${PAPER}" stroke-width="3"/>
  <g fill="none" stroke="${PAPER}" stroke-width="5" opacity=".55" stroke-linecap="round">
    <path d="M-300 -230 C-230 -150 -140 -150 -40 -190"/><path d="M300 -230 C230 -150 140 -150 40 -190"/>
    <path d="M-200 -60 C-130 -20 -60 -30 -20 -60"/><path d="M200 -60 C130 -20 60 -30 20 -60"/>
    <path d="M-180 80 C-110 110 -50 100 -15 80"/><path d="M180 80 C110 110 50 100 15 80"/>
    <path d="M0 -280 L0 320"/><path d="M-470 -60 C-500 60 -490 160 -450 240"/><path d="M470 -60 C500 60 490 160 450 240"/>
  </g>
  <path d="M-90 -340 L-70 -305 L-50 -338 L-30 -300 L-10 -338 L10 -300 L30 -338 L50 -305 L70 -340 L90 -320 C40 -280 -40 -280 -90 -320Z" fill="${PAPER}"/>
  <g fill="${RED}" filter="url(#glow)"><path d="M-95 -440 L-22 -408 L-85 -396Z"/><path d="M95 -440 L22 -408 L85 -396Z"/></g>
</g>`;

const human = `<g id="human">
  <path d="M-30 -560 C-150 -590 -270 -540 -400 -610 C-300 -515 -180 -515 -40 -528Z M-34 -548 C-120 -500 -200 -470 -300 -470 C-200 -440 -110 -470 -38 -520Z" fill="${RED}"/>
  <path d="M-62 -560 L62 -560 L110 -300 L190 -30 L70 -62 L48 0 L12 0 L4 -150 L-6 -150 L-14 0 L-50 0 L-66 -64 L-180 -26 L-112 -300Z" fill="${INK}"/>
  <circle cx="0" cy="-612" r="50" fill="${INK}"/>
  <path d="M-52 -630 L-96 -690 L-40 -660 L-30 -730 L0 -668 L30 -735 L42 -662 L100 -700 L52 -626Z" fill="${INK}"/>
  <path d="M88 -330 L440 -680" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
  <path d="M120 -362 L436 -676" stroke="${PAPER}" stroke-width="7" stroke-linecap="round"/>
  <rect x="78" y="-352" width="40" height="14" transform="rotate(-45 98 -345)" fill="${RED}"/>
</g>`;

const kneel = `<g id="kneel">
  <path d="M-40 -400 C-160 -420 -260 -380 -360 -430 C-270 -350 -150 -360 -48 -372Z" fill="${RED}"/>
  <path d="M-60 -400 L70 -390 L120 -200 L230 -150 L240 0 L190 0 L180 -110 L60 -120 L40 -40 L-160 -10 L-180 -40 L-60 -100 L-110 -250Z" fill="${INK}"/>
  <circle cx="40" cy="-430" r="48" fill="${INK}"/>
  <path d="M0 -450 L-50 -500 L10 -480 L20 -545 L50 -485 L95 -520 L80 -455Z" fill="${INK}"/>
  <path d="M150 -300 L150 30" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
  <path d="M150 -260 L150 26" stroke="${PAPER}" stroke-width="7"/>
  <rect x="120" y="-312" width="60" height="16" fill="${RED}"/>
  <path d="M70 -410 C74 -380 72 -350 78 -320" stroke="${RED}" stroke-width="8" stroke-linecap="round" fill="none"/>
</g>`;

// ---------- Décors ----------
const city = (() => {
  let s = '', x = -20;
  while (x < W + 40) {
    const w = rnd(70, 160), h = rnd(220, 560) + (Math.abs(x - 540) < 200 ? 0 : 0);
    const top = 1400 - h, broken = rnd() > 0.5;
    s += broken
      ? `<polygon points="${f(x)},1500 ${f(x)},${f(top + rnd(0, 60))} ${f(x + w * 0.4)},${f(top + rnd(40, 120))} ${f(x + w * 0.6)},${f(top)} ${f(x + w)},${f(top + rnd(60, 160))} ${f(x + w)},1500"/>`
      : `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(1500 - top)}"/>`;
    x += w + rnd(-10, 20);
  }
  return `<g fill="${INK}">${s}<rect x="0" y="1400" width="${W}" height="520"/></g>`;
})();
const moon = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAPER}"/>
  <g clip-path="url(#moonclip)" fill="url(#tone)"><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.2}" r="${r * 0.28}"/><circle cx="${cx + r * 0.35}" cy="${cy + r * 0.25}" r="${r * 0.2}"/><circle cx="${cx + r * 0.1}" cy="${cy - r * 0.55}" r="${r * 0.12}"/></g>`;

// =====================================================================
// 1 · Titre (0 – 3,5 s)
scene('s1', 0, 3.5, `
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <g class="zoomslow" style="animation-duration:3.5s">${moon(540, 700, 330)}</g>
  ${city}
  <g transform="translate(250 1180) scale(.32)"><use href="#human"/></g>
  ${rain(PAPER, 0.35)}
  <text x="540" y="380" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:36px;letter-spacing:12px">CHAPITRE 1</text>
  <g class="slam" style="animation-delay:.15s"><text x="540" y="1300" class="title" style="font-size:165px">CROC NOIR</text></g>
  <g class="pop" style="animation-delay:.3s"><text data-role="hook" x="540" y="1420" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:44px">La nuit où la bête est revenue.</text></g>
`);

// 2 · La bête se lève (3,5 – 8 s)
scene('s2', 3.5, 8, `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <g class="shake" style="animation-delay:4.1s;animation-iteration-count:3">
  ${panel('p2a', 40, 40, 1000, 1180, `
    ${radial(540, 640, 150, INK)}
    <rect x="40" y="1060" width="1000" height="160" fill="${INK}"/>
    ${cracks(540, 1070, 9, 380, PAPER, 6)}
    <g class="rise" style="animation-delay:3.5s"><g transform="translate(540 1060) scale(.95)"><use href="#monster"/></g></g>
    <g class="debris" style="animation-delay:3.9s" fill="${INK}">
      <polygon points="150,980 190,940 220,990"/><polygon points="880,960 930,930 940,990 900,1000"/><polygon points="260,900 280,880 300,910"/><polygon points="790,880 820,860 830,900"/>
    </g>
  `)}
  </g>
  ${onom(540, 420, 'GRRRAAAH!!', 130, -7, INK, PAPER, 4.1)}
  <g class="pop" style="animation-delay:6s">
  ${panel('p2b', 40, 1260, 1000, 620, `
    <rect x="40" y="1260" width="1000" height="620" fill="${INK}"/>
    ${cracks(540, 1570, 14, 420, '#3a3a3a', 4)}
    <g class="zoomslow" style="animation-delay:6s;animation-duration:2s">
      <path d="M160 1570 C320 1420 760 1420 920 1570 C760 1700 320 1700 160 1570Z" fill="${RED}" filter="url(#glow)"/>
      <path d="M520 1450 C490 1520 490 1620 520 1690 C550 1620 550 1520 520 1450Z M560 1450 C590 1520 590 1620 560 1690 C530 1620 530 1520 560 1450Z" fill="${INK}"/>
      <ellipse cx="640" cy="1520" rx="26" ry="14" fill="${PAPER}" opacity=".85"/>
    </g>
  `, INK)}
  </g>
  ${bubble(770, 1360, ['Encore', 'un humain…'], 6.1, [0, 0], true)}
`);

// 3 · Le sabreur (8 – 12 s)
scene('s3', 8, 12, `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${panel('p3a', 40, 40, 1000, 520, `
    <rect x="40" y="40" width="1000" height="520" fill="url(#tone)" opacity=".35"/>
    <g class="zoomslow" style="animation-delay:8s;animation-duration:4s">
      <path d="M180 250 C330 190 560 170 780 230 L800 210 C580 140 330 160 170 230Z" fill="${INK}"/>
      <path d="M210 330 C350 230 620 220 830 320 C640 420 380 420 210 330Z" fill="#fff" stroke="${INK}" stroke-width="10"/>
      <circle cx="540" cy="325" r="88" fill="${INK}"/>
      <circle cx="540" cy="325" r="60" fill="${RED}" opacity=".55"/>
      <circle cx="540" cy="325" r="34" fill="${INK}"/>
      <circle cx="575" cy="295" r="16" fill="#fff"/>
      <path d="M680 140 L520 520" stroke="${INK}" stroke-width="9"/><path d="M688 150 L530 515" stroke="${RED}" stroke-width="3"/>
    </g>
  `)}
  ${panel('p3b', 40, 600, 1000, 1280, `
    <rect x="40" y="600" width="1000" height="700" fill="url(#tone)" opacity=".55"/>
    <rect x="40" y="1640" width="1000" height="240" fill="${INK}"/>
    <g class="zoomslow" style="animation-delay:8s;animation-duration:4s"><g transform="translate(520 1700) scale(1.45)"><use href="#human"/></g></g>
    ${rain(INK, 0.5, 90)}
  `)}
  ${bubble(720, 760, ['Tu te souviens', 'de moi ?'], 8.35, [-40, -90])}
  ${bubble(310, 1080, ['Ce soir,', 'tu paies.'], 10.15, [60, 90])}
`);

// 4 · La charge (12 – 15,5 s)
scene('s4', 12, 15.5, `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${radial(560, 960, 170, INK, [380, 620])}
  ${hlines(60, INK, 600, 1500)}
  <g class="dash" style="animation-delay:12s"><g transform="translate(420 1350) rotate(18) scale(1.25)"><use href="#human"/></g></g>
  <g class="lunge" style="animation-delay:13.6s"><g transform="translate(1180 860) rotate(-25) scale(-1 1) scale(.95)"><use href="#monster"/></g></g>
  ${onom(540, 420, 'FWOOSH!!', 140, -10, INK, PAPER, 12.3)}
  ${onom(620, 1440, 'RAAAH!', 120, 6, RED, PAPER, 14)}
`);

// 5 · Le choc (15,5 – 19,5 s)
scene('s5', 15.5, 19.5, `
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <g class="shake" style="animation-delay:15.5s;animation-iteration-count:2">
    ${radial(540, 920, 190, PAPER, [200, 420])}
    <g class="impact" style="animation-delay:15.5s">${burst(540, 920, 170, 470, 18, PAPER)}${burst(540, 920, 90, 230, 14, RED)}</g>
    <path d="M-60 1700 L700 760" stroke="${INK}" stroke-width="44" stroke-linecap="round"/>
    <path d="M-50 1688 L690 772" stroke="${PAPER}" stroke-width="18" stroke-linecap="round"/>
    <path d="M-60 1700 L120 1480" stroke="${RED}" stroke-width="40" stroke-linecap="round"/>
    <g transform="translate(1160 460) rotate(-145)" fill="${INK}" stroke="${PAPER}" stroke-width="6">
      <path d="M-120 -700 C-140 -400 -110 -200 -60 0 L60 0 C110 -200 140 -400 120 -700Z"/>
      <path d="M-60 0 L-90 210 L-40 60Z M-10 0 L-10 250 L25 60Z M50 0 L90 210 L60 40Z"/>
    </g>
    ${sparks(540, 920, 40, PAPER)}
    ${cracks(540, 920, 8, 700, PAPER, 4)}
  </g>
  <rect class="flash" style="animation-delay:15.5s" width="${W}" height="${H}" fill="#fff"/>
  ${onom(540, 470, 'KRAKKK!!', 170, -6, RED, PAPER, 15.6)}
  <rect class="flash" style="animation-delay:17.6s" width="${W}" height="${H}" fill="#fff"/>
  ${onom(300, 1420, 'CLANG', 110, 10, PAPER, INK, 17.7)}
  ${bubble(700, 1250, ['Quoi ?!', 'Impossible !'], 18.15, [0, 0], true)}
`);

// 6 · La riposte (19,5 – 23,5 s)
scene('s6', 19.5, 23.5, `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${panel('p6a', 40, 40, 1000, 880, `
    ${hlines(70, INK, 40, 920)}
    <g transform="translate(980 620) scale(.62)"><use href="#monster"/></g>
    <path d="M760 200 C620 400 560 560 520 760" stroke="${INK}" stroke-width="14" fill="none" opacity=".8"/>
    <path d="M820 220 C690 420 640 580 610 790" stroke="${INK}" stroke-width="8" fill="none" opacity=".6"/>
    <g class="thrown" style="animation-delay:19.5s"><g transform="translate(420 760) rotate(-35) scale(.7)"><use href="#human"/></g></g>
    ${splatter(430, 470, 46, 260, 'pop', 19.7)}
  `)}
  ${onom(330, 420, 'DOOM!', 140, -12, INK, PAPER, 19.6)}
  ${panel('p6b', 40, 960, 1000, 920, `
    <rect x="40" y="960" width="1000" height="920" fill="url(#tone)" opacity=".5"/>
    <rect x="40" y="1700" width="1000" height="180" fill="${INK}"/>
    <g transform="translate(460 1720) scale(1.1)"><use href="#kneel"/></g>
    ${splatter(600, 1720, 22, 120)}
    ${rain(INK, 0.45, 70)}
  `)}
  ${bubble(760, 1100, ['Tu es', 'trop faible.'], 20.8, [0, 0], true)}
  ${bubble(300, 1210, ['Pas', 'encore.'], 22.55, [70, 60])}
`);

// 7a · L'envol (23,5 – 25,5 s)
scene('s7a', 23.5, 25.5, `
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <g class="zoomslow" style="animation-delay:23.5s;animation-duration:2s">${moon(540, 820, 470)}</g>
  ${radial(540, 820, 120, '#2a2a2a', [520, 700])}
  <g class="leap" style="animation-delay:23.5s"><g transform="translate(540 1250) rotate(-20) scale(1.05)"><use href="#human"/></g></g>
  ${bubble(540, 360, ["C'est pour", 'mon village !'], 23.6, [0, 60])}
  ${onom(540, 1440, 'HAAAAA!!', 150, -4, PAPER, RED, 24.3)}
`);

// 7b · ZAN (25,5 – 27 s)
const cutA = '0,0 1080,0 1080,560 0,1500', cutB = '0,1500 1080,560 1080,1920 0,1920';
clipDefs += `<clipPath id="cutA"><polygon points="${cutA}"/></clipPath><clipPath id="cutB"><polygon points="${cutB}"/></clipPath>`;
scene('s7b', 25.5, 26.6, `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${radial(540, 1030, 160, INK, [520, 760])}
  <g class="splitA" style="animation-delay:25.7s"><g clip-path="url(#cutA)"><g transform="translate(540 1500) scale(1.1)"><use href="#monster"/></g></g></g>
  <g class="splitB" style="animation-delay:25.7s"><g clip-path="url(#cutB)"><g transform="translate(540 1500) scale(1.1)"><use href="#monster"/></g></g></g>
  <path class="slash" style="animation-delay:25.5s" d="M-80 1570 L1160 490" stroke="#fff" stroke-width="30" stroke-linecap="round" pathLength="1"/>
  <path class="slash" style="animation-delay:25.5s" d="M-80 1570 L1160 490" stroke="${RED}" stroke-width="8" stroke-linecap="round" pathLength="1"/>
  ${splatter(540, 1030, 70, 420, 'pop', 25.8)}
  ${onom(600, 520, 'ZAN!!', 230, -14, RED, INK, 25.65)}
  <rect class="flash" style="animation-delay:25.5s" width="${W}" height="${H}" fill="#fff"/>
`);

// 8 · Fin (27 – 30 s)
scene('s8', 26.6, 30, `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect width="${W}" height="1200" fill="url(#tone)" opacity=".6"/>
  <rect y="1180" width="${W}" height="740" fill="${INK}"/>
  <g transform="translate(260 1260) rotate(-80) scale(.42)"><use href="#monster"/></g>
  <g transform="translate(860 1230) rotate(95) scale(.38)"><use href="#monster"/></g>
  <g class="zoomslow" style="animation-delay:26.6s;animation-duration:3.4s"><g transform="translate(560 1200) scale(.9)"><use href="#human"/></g></g>
  ${splatter(560, 1210, 26, 260)}
  ${rain(INK, 0.5, 120)}
  ${bubble(540, 420, ['Repose', 'en paix.'], 27.45, [0, 60])}
  <g class="pop" style="animation-delay:26.65s"><text data-role="final" x="540" y="1360" class="title" style="font-size:170px">FIN… ?</text></g>
  <g class="pop" style="animation-delay:27s"><text x="540" y="1460" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:42px;letter-spacing:8px">À SUIVRE</text></g>
`);

// ---------- Assemblage ----------
const css = `
  .onom{font-family:Impact,'Arial Black',sans-serif;font-style:italic;text-anchor:middle;paint-order:stroke;stroke-linejoin:round;letter-spacing:4px}
  .title{font-family:Impact,'Arial Black',sans-serif;font-size:200px;text-anchor:middle;fill:${PAPER};stroke:${RED};stroke-width:10px;paint-order:stroke;letter-spacing:10px}
  .bt{font-family:'Avenir Next Condensed','Arial Narrow',sans-serif;font-weight:800;font-size:42px;text-anchor:middle}
  .cap{font-family:'Avenir Next Condensed','Arial Narrow',sans-serif;font-weight:700;font-size:36px;fill:${INK}}
  .pop,.slam,.zoomslow,.impact,.rise,.dash,.lunge,.thrown,.leap,.splitA,.splitB,.shake,.debris{transform-box:fill-box;transform-origin:center}
  .shake,.rise,.dash,.lunge,.thrown,.leap,.splitA,.splitB,.debris{transform-box:view-box;transform-origin:0 0}
  .pop{animation:pop .22s cubic-bezier(.2,1.6,.4,1) both}
  .slam{animation:slam .3s cubic-bezier(.2,1.8,.4,1) both}
  .zoomslow{animation:zoomslow 3.5s ease-out both}
  .rain{animation:rain .45s linear infinite}
  .shake{animation:shake .5s linear both}
  .rise{animation:rise 1.2s cubic-bezier(.2,.9,.3,1) both}
  .debris{animation:debris 1.4s ease-out both}
  .dash{animation:dash 1.6s cubic-bezier(.3,.8,.3,1) both}
  .lunge{animation:lunge .9s cubic-bezier(.3,.8,.3,1) both}
  .impact{animation:impact .45s cubic-bezier(.2,1.5,.4,1) both}
  .flash{animation:flash .35s ease-out both}
  .thrown{animation:thrown .8s cubic-bezier(.2,.9,.3,1) both}
  .leap{animation:leap 2s cubic-bezier(.2,.8,.3,1) both}
  .slash{stroke-dasharray:1;animation:slash .18s ease-out both}
  .splitA{animation:splitA 1.1s cubic-bezier(.5,0,.7,1) both}
  .splitB{animation:splitB 1.1s cubic-bezier(.5,0,.7,1) both}
  @keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
  @keyframes slam{from{opacity:0;transform:scale(2.4)}to{opacity:1;transform:scale(1)}}
  @keyframes zoomslow{from{transform:scale(1)}to{transform:scale(1.08)}}
  @keyframes rain{from{transform:translate(0,0)}to{transform:translate(-40px,160px)}}
  @keyframes shake{0%,100%{transform:translate(0,0)}10%{transform:translate(-22px,10px)}20%{transform:translate(18px,-14px)}30%{transform:translate(-14px,16px)}40%{transform:translate(20px,6px)}50%{transform:translate(-16px,-12px)}60%{transform:translate(12px,14px)}70%{transform:translate(-9px,-7px)}80%{transform:translate(7px,8px)}90%{transform:translate(-4px,-3px)}}
  @keyframes rise{from{transform:translate(0,620px)}to{transform:translate(0,0)}}
  @keyframes debris{from{transform:translate(0,120px);opacity:0}20%{opacity:1}to{transform:translate(0,-260px);opacity:1}}
  @keyframes dash{from{transform:translate(-700px,120px)}to{transform:translate(0,0)}}
  @keyframes lunge{from{transform:translate(500px,-80px)}to{transform:translate(0,0)}}
  @keyframes impact{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes flash{from{opacity:1}to{opacity:0}}
  @keyframes thrown{from{transform:translate(380px,-140px) rotate(0deg)}to{transform:translate(0,0)}}
  @keyframes leap{from{transform:translate(0,700px)}to{transform:translate(0,-380px)}}
  @keyframes slash{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
  @keyframes splitA{from{transform:translate(0,0)}to{transform:translate(-90px,-80px)}}
  @keyframes splitB{from{transform:translate(0,0)}to{transform:translate(70px,90px)}}
  ${scenes.map((s) => s.css).join('\n  ')}
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-duration="${T}" data-fps="30">
<defs>
  <pattern id="tone" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="6" cy="6" r="2.6" fill="${INK}"/></pattern>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="moonclip"><circle cx="540" cy="700" r="330"/><circle cx="540" cy="820" r="470"/></clipPath>
  ${clipDefs}
  ${monster}
  ${human}
  ${kneel}
</defs>
<style>${css}</style>
<rect width="${W}" height="${H}" fill="${PAPER}"/>
${scenes.map((s) => s.svg).join('\n')}
</svg>`;

writeFileSync(new URL('./manga-combat-v2.svg', import.meta.url), svg);
console.log('manga-combat-v2.svg écrit,', scenes.length, 'plans,', Math.round(svg.length / 1024), 'Ko');
