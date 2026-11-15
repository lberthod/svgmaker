// Animations SVG « plein cadre » du format atlas : des petites scènes dessinées (château, traité, statistiques, barres,
// chronologie, trois langues) qui remplacent la carte quelques secondes puis y retournent. Tout est en CSS (@keyframes),
// aucune image. Cadre de 940 × 700 px ; les délais sont absolus (secondes depuis le début de la vidéo).
// art(kind, p, a, d, u) → { svg, css } ; u = { anim, sg, f, tb, tw, NAVY, YELLOW, nextId }.
export const KINDS = ['castle', 'stats', 'bars', 'neutral', 'languages', 'timeline', 'compare', 'split', 'treaty', 'profile']
export const ART_W = 940, ART_H = 700

export const ART_CSS = [
  '@keyframes sway{from{transform:translateX(-26px)}to{transform:translateX(26px)}}',
  '@keyframes flag{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(9deg)}}',
  '@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-80px)}}',
  '@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}',
  '@keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}',
  '@keyframes stamp{0%{opacity:0;transform:scale(2.2) rotate(-25deg)}60%{opacity:1;transform:scale(.92) rotate(4deg)}100%{opacity:1;transform:scale(1) rotate(0)}}',
  '@keyframes rise{from{transform:translateY(70px);opacity:0}to{transform:none;opacity:1}}',
  '@keyframes twinkle{0%,100%{opacity:.35}50%{opacity:1}}',
  '@keyframes hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}',
]

const fmtNum = (v, dec = 0) => { const s = Math.abs(v).toFixed(dec).replace('.', ','), [i, r] = s.split(','); return (v < 0 ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (r ? ',' + r : '') }
const ease = (x) => 1 - (1 - x) ** 3

/** Texte centré (ou aligné) dans le cadre. */
const T = (u, text, { x, y, size, fill = '#fff', halo = u.NAVY, width = 860, maxLines = 1, hk = 0.1 }) =>
  u.tb(text, { x, top: y, max: Math.max(size, 32), min: 32, maxLines, width, fill, halo, halo_k: hk }) // jamais sous 32 px

const NAVY_BG = (u) => `<rect width="940" height="700" fill="#0F2547"/><rect width="940" height="700" fill="#0B1F3A" fill-opacity=".3"/>
  <g stroke="#fff" stroke-opacity=".05" stroke-width="2">${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 90 - 120} 700 L${i * 90 + 300} 0"/>`).join('')}</g>`

const header = (u, a, title, sub) => `<g style="${u.anim('rise', 0.6, a + 0.2, 'ease-out')}">${T(u, title, { x: 470, y: 36, size: 58, fill: u.YELLOW, width: 860, hk: 0.14 }).svg}${sub ? T(u, sub, { x: 470, y: 106, size: 42, fill: '#C9D6EE', width: 860 }).svg : ''}</g>`

// ---------------------------------------------------------------- château sur son rocher
function castle(p, a, d, u) {
  const tower = (x, y, w, h, roof) => `<g style="${u.anim('rise', 0.7, a + 1.0 + x / 900, 'ease-out')}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#D9CCB4" stroke="#6B5B45" stroke-width="5"/>
    <path d="M${x - 8} ${y} H${x + w + 8} V${y - 14} h-10 v8 h-14 v-8 h-14 v8 h-14 v-8 h-${Math.max(0, w - 56)} Z" fill="#CDBE9F" stroke="#6B5B45" stroke-width="4" transform="translate(0 0)"/>
    <path d="M${x - 14} ${y} L${x + w / 2} ${y - roof} L${x + w + 14} ${y} Z" fill="#B5483C" stroke="#6B2E27" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${x + w / 2 - 8}" y="${y + 24}" width="16" height="30" rx="8" fill="#3A2E24"/></g>`
  return { css: [], svg: `<defs><linearGradient id="a-csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FCBF0"/><stop offset="1" stop-color="#FCE8C4"/></linearGradient></defs>
  <rect width="940" height="700" fill="url(#a-csky)"/>
  <g style="${u.anim('glow', 2.4, a, 'ease-in-out', 'both')};animation-iteration-count:infinite"><circle cx="790" cy="130" r="58" fill="#FFE27A"/><circle cx="790" cy="130" r="82" fill="#FFE27A" fill-opacity=".28"/></g>
  <g style="animation:sway 7s ease-in-out ${u.f(a)}s infinite alternate"><ellipse cx="190" cy="120" rx="96" ry="34" fill="#fff" fill-opacity=".92"/><ellipse cx="250" cy="96" rx="60" ry="30" fill="#fff" fill-opacity=".92"/></g>
  <g style="animation:sway 9s ease-in-out ${u.f(a + 0.8)}s infinite alternate"><ellipse cx="560" cy="200" rx="80" ry="26" fill="#fff" fill-opacity=".85"/><ellipse cx="610" cy="182" rx="46" ry="24" fill="#fff" fill-opacity=".85"/></g>
  <path d="M0 470 Q160 380 320 450 T620 430 T940 460 V700 H0 Z" fill="#9DB98A"/>
  <path d="M0 540 Q240 480 470 530 T940 520 V700 H0 Z" fill="#6FA854"/>
  <g style="${u.anim('rise', 0.9, a + 0.4, 'ease-out')}">
    <path d="M250 640 L300 360 L380 330 L470 345 L560 320 L640 360 L700 640 Z" fill="#8B6B4A" stroke="#5A432C" stroke-width="6" stroke-linejoin="round"/>
    <path d="M300 440 H650 M285 520 H675 M270 590 H690" stroke="#5A432C" stroke-opacity=".5" stroke-width="5" fill="none"/></g>
  ${tower(330, 235, 78, 120, 78)}${tower(520, 205, 96, 150, 92)}${tower(440, 270, 66, 80, 56)}
  <g transform="translate(568 120)"><rect x="-3" y="0" width="6" height="52" fill="#5A432C"/><g style="transform-box:fill-box;transform-origin:0 50%;animation:flag 1.6s ease-in-out ${u.f(a + 1.6)}s infinite"><path d="M3 4 H58 L46 18 L58 32 H3 Z" fill="#E8503A" stroke="#7A2418" stroke-width="3"/></g></g>
  <g style="${u.anim('fadeIn', 0.6, a + 0.2, 'ease-out')}"><rect y="600" width="940" height="100" fill="#3C97B8"/>
    <g style="animation:wave 3.2s linear ${u.f(a)}s infinite"><path d="${Array.from({ length: 16 }, (_, i) => `M${i * 80 - 80} 632 q20 -14 40 0 t40 0`).join(' ')}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/><path d="${Array.from({ length: 16 }, (_, i) => `M${i * 80 - 40} 668 q20 -14 40 0 t40 0`).join(' ')}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/></g></g>
  <g class="pop" style="${u.anim('pop', 0.5, a + 2.4)}"><rect x="170" y="560" width="600" height="104" rx="30" fill="${u.NAVY}" fill-opacity=".9" stroke="#fff" stroke-width="3"/>${T(u, p.title ?? '', { x: 470, y: 574, size: 46, width: 560, fill: u.YELLOW }).svg}</g>` }
}

// ---------------------------------------------------------------- statistiques qui montent (compteurs, anneaux)
function stats(p, a, d, u) {
  const items = p.items ?? [], css = [], out = [], n = items.length, cols = n > 2 ? 2 : 1, rows = Math.ceil(n / cols)
  const TW = cols === 2 ? 430 : 860, TH = Math.min(250, (590 - 20 * (rows - 1)) / rows)
  items.forEach((it, k) => {
    const cx = 30 + (k % cols) * (TW + 20), cy = 112 + Math.floor(k / cols) * (TH + 20), t = a + 0.5 + k * 0.45, dec = it.decimals ?? 0, steps = 10, dt = 0.8 / steps
    // le compteur ne passe jamais par une valeur fausse : il part de 90 % de la valeur finale (ou s'affiche directement pour les petits nombres)
    const nsteps = Math.abs(it.value) >= 20 && it.count !== false ? steps : 1
    const val = (i) => (it.prefix ?? '') + fmtNum(nsteps === 1 ? it.value : it.value * (0.9 + 0.1 * ease(i / (nsteps - 1))), dec) + (it.suffix ?? '')
    const ring = it.ring != null
    const tx = ring ? cx + TW / 2 + 52 : cx + TW / 2
    let ringSvg = ''
    if (ring) {
      const id = `rg${u.nextId()}`; css.push(`@keyframes ${id}{from{stroke-dashoffset:100}to{stroke-dashoffset:${100 - it.ring}}}`)
      ringSvg = `<g transform="translate(${cx + 92} ${cy + TH / 2})"><circle r="52" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="16"/><circle r="52" fill="none" stroke="${it.color ?? u.YELLOW}" stroke-width="16" stroke-linecap="round" pathLength="100" stroke-dasharray="100" transform="rotate(-90)" style="animation:${id} 1.6s ease-out ${u.f(t + 0.1)}s both"/></g>`
    }
    const numSize = it.size ?? (cols === 2 ? 70 : 96)
    const lab = T(u, it.label, { x: tx, y: 0, size: 34, width: TW - (ring ? 200 : 50), fill: '#C9D6EE', maxLines: 2 })
    const ly = cy + TH - 18 - lab.height, midY = cy + (ly - cy) / 2 // étiquette collée en bas de la tuile, chiffre centré au-dessus
    const labSvg = T(u, it.label, { x: tx, y: ly, size: 34, width: TW - (ring ? 200 : 50), fill: '#C9D6EE', maxLines: 2 }).svg
    const counter = Array.from({ length: nsteps }, (_, i) => u.sg(t + i * dt, i === nsteps - 1 ? Math.max(0.1, d - (t + i * dt - a)) : dt, T(u, val(i), { x: tx, y: midY - numSize * 0.78, size: numSize, width: TW - (ring ? 200 : 40), fill: it.color ?? u.YELLOW, hk: 0.12 }).svg)).join('')
    out.push(`<g class="pop" style="${u.anim('pop', 0.5, t - 0.1)}"><rect x="${cx}" y="${cy}" width="${TW}" height="${TH}" rx="30" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>${ringSvg}${counter}
      ${labSvg}</g>`)
  })
  return { css, svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}${out.join('')}` }
}

// ---------------------------------------------------------------- barres qui poussent (avant / après)
function bars(p, a, d, u) {
  const items = p.items ?? [], n = items.length, W = 940 / (n + 1), base = 560, maxH = 300, bw = Math.min(220, W - 24)
  const bars = items.map((it, k) => {
    const h = maxH * it.h, x = W * (k + 1) - bw / 2, t = a + 0.05 + k * 0.6
    return `<g style="${u.anim('fadeIn', 0.2, t, 'ease-out')}"><g style="transform-box:fill-box;transform-origin:50% 100%;animation:grow .7s cubic-bezier(.2,.9,.3,1) ${u.f(t)}s both"><rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="18" fill="${it.color ?? u.YELLOW}" stroke="#fff" stroke-width="5"/></g>
      <g class="pop" style="${u.anim('pop', 0.5, t + 0.8)}">${T(u, it.value ?? '', { x: x + bw / 2, y: base - h - 76, size: 64, width: W - 16, fill: '#fff' }).svg}</g>${T(u, it.label, { x: x + bw / 2, y: base + 18, size: 40, width: W - 16, fill: '#C9D6EE', maxLines: 2 }).svg}</g>`
  }).join('')
  return { css: [], svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}<path d="M60 ${base} H880" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>${bars}` }
}

// ---------------------------------------------------------------- traité : parchemin, lignes, sceau de cire
// ---------------------------------------------------------------- neutralité (1867) puis couronne qui change de tête (1890) : schéma cause → conséquence
function neutral(p, a, d, u) {
  const flag = (x, y, kind) => {
    const w = 150, h = 100, body = kind === 'fr' ? `<rect width="50" height="${h}" fill="#1F4FBF"/><rect x="50" width="50" height="${h}" fill="#fff"/><rect x="100" width="50" height="${h}" fill="#E03A3E"/>`
      : kind === 'pr' ? `<rect width="${w}" height="${h / 2}" fill="#111"/><rect y="${h / 2}" width="${w}" height="${h / 2}" fill="#fff"/>`
        : kind === 'lu' ? `<rect width="${w}" height="34" fill="#ED2939"/><rect y="34" width="${w}" height="33" fill="#fff"/><rect y="67" width="${w}" height="33" fill="#00A3E0"/>`
          : `<rect width="${w}" height="34" fill="#AE1C28"/><rect y="34" width="${w}" height="33" fill="#fff"/><rect y="67" width="${w}" height="33" fill="#21468B"/>`
    return `<g transform="translate(${x - w / 2} ${y - h / 2})"><g style="filter:drop-shadow(0 6px 8px rgba(0,0,0,.4))"><g clip-path="url(#a-fl)">${body}</g><rect width="${w}" height="${h}" rx="14" fill="none" stroke="#fff" stroke-width="5"/></g></g>`
  }
  const crown = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-46 24 L-52 -26 L-26 -2 L0 -40 L26 -2 L52 -26 L46 24 Z" fill="${c}" stroke="#7A5C14" stroke-width="6" stroke-linejoin="round"/><rect x="-46" y="24" width="92" height="16" rx="6" fill="${c}" stroke="#7A5C14" stroke-width="6"/><circle cx="0" cy="-44" r="8" fill="#E8503A"/></g>`
  const arrow = (x0, x1, y, t, col) => `<g style="${u.anim('fadeIn', 0.3, t, 'ease-out')}"><g style="animation:sway 0.8s ease-in-out ${u.f(t)}s infinite alternate"><path d="M${x0} ${y} H${x1} M${x1 + (x1 > x0 ? -26 : 26)} ${y - 22} L${x1} ${y} L${x1 + (x1 > x0 ? -26 : 26)} ${y + 22}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g></g>`
  const t1 = a + 0.2, tN = a + 2.6, t2 = a + Math.max(4.9, (p.phase2 ?? 4.9))
  const ph1 = `${header(u, a, 'Un petit pays très convoité', '1867')}
    <g class="pop" style="${u.anim('pop', 0.5, t1)}">${flag(150, 330, 'fr')}${T(u, 'FRANCE', { x: 150, y: 400, size: 46, width: 260 }).svg}</g>
    <g class="pop" style="${u.anim('pop', 0.5, t1 + 0.3)}">${flag(790, 330, 'pr')}${T(u, 'PRUSSE', { x: 790, y: 400, size: 46, width: 260 }).svg}</g>
    <g class="pop" style="${u.anim('pop', 0.5, t1 + 0.7)}">${flag(470, 330, 'lu')}${T(u, 'LUXEMBOURG', { x: 470, y: 400, size: 44, width: 300 }).svg}</g>
    ${u.sg(t1 + 1.2, tN - t1 - 1.2 + 0.4, arrow(250, 360, 330, t1 + 1.2, '#FFD83C') + arrow(690, 580, 330, t1 + 1.2, '#FFD83C'))}
    <g style="${u.anim('fadeIn', 0.5, tN, 'ease-out')}"><circle cx="470" cy="330" r="118" fill="#7BD88F" fill-opacity=".2" stroke="#7BD88F" stroke-width="8" stroke-dasharray="14 10"/></g>
    <g style="transform-box:fill-box;transform-origin:50% 50%;animation:stamp .6s cubic-bezier(.2,.9,.3,1) ${u.f(tN + 0.3)}s both"><rect x="170" y="470" width="600" height="120" rx="26" fill="#2EB872" stroke="#fff" stroke-width="6"/>${T(u, 'NEUTRE', { x: 470, y: 486, size: 74, width: 560, fill: '#fff', halo: '#1B7F4D' }).svg}</g>
    ${T(u, 'Traité de Londres, 1867', { x: 470, y: 618, size: 46, width: 860, fill: '#C9D6EE' }).svg}`
  const ph2 = `${header(u, a, 'Un grand-duc bien à lui', '1890')}
    <g class="pop" style="${u.anim('pop', 0.5, t2)}">${flag(200, 340, 'nl')}${T(u, 'PAYS-BAS', { x: 200, y: 410, size: 46, width: 280 }).svg}${crown(200, 235, 1.1, '#FFD83C')}</g>
    <g class="pop" style="${u.anim('pop', 0.5, t2 + 0.4)}">${flag(740, 340, 'lu')}${T(u, 'LUXEMBOURG', { x: 740, y: 410, size: 44, width: 300 }).svg}</g>
    <g style="${u.anim('fadeIn', 0.3, t2 + 1.0, 'ease-out')}"><path d="M330 340 H560" stroke="#fff" stroke-opacity=".5" stroke-width="8" stroke-dasharray="4 16" stroke-linecap="round"/><path d="M318 318 L350 362 M350 318 L318 362" stroke="#E8503A" stroke-width="12" stroke-linecap="round"/></g>
    <g style="animation:rise .9s cubic-bezier(.2,.9,.3,1) ${u.f(t2 + 1.6)}s both">${crown(740, 235, 1.2, '#FFD83C')}</g>
    ${T(u, 'Le roi meurt sans fils', { x: 470, y: 480, size: 54, width: 860, fill: '#fff' }).svg}
    <g class="pop" style="${u.anim('pop', 0.5, t2 + 2.2)}">${T(u, 'Le Luxembourg a son propre grand-duc', { x: 470, y: 552, size: 50, width: 860, fill: u.YELLOW, maxLines: 2 }).svg}</g>`
  return { css: [], svg: `<defs><clipPath id="a-fl"><rect width="150" height="100" rx="14"/></clipPath></defs>${NAVY_BG(u)}${u.sg(a, t2 - a - 0.1, ph1)}${u.sg(t2 - 0.1, Math.max(0.5, d - (t2 - 0.1 - a)), ph2)}` }
}

// ---------------------------------------------------------------- trois langues, trois usages (maison / école / administration)
function languages(p, a, d, u) {
  const rows = p.items ?? [], n = rows.length, RH = Math.min(175, 520 / Math.max(1, n))
  const icon = (kind, c) => kind === 'house' ? `<path d="M-70 10 L0 -54 L70 10 Z" fill="#B5483C" stroke="#6B2E27" stroke-width="5" stroke-linejoin="round"/><rect x="-54" y="10" width="108" height="76" fill="#F2E3C4" stroke="#6B5B45" stroke-width="5"/><rect x="-14" y="38" width="28" height="48" rx="6" fill="#7A5230"/><rect x="26" y="26" width="22" height="22" fill="#8FCBF0" stroke="#6B5B45" stroke-width="3"/>`
    : kind === 'school' ? `<rect x="-76" y="-8" width="152" height="94" fill="#E8C86A" stroke="#7A5C14" stroke-width="5"/><path d="M-90 -8 L0 -62 L90 -8 Z" fill="#C9A23A" stroke="#7A5C14" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="-16" r="14" fill="#fff" stroke="#7A5C14" stroke-width="4"/><path d="M0 -24 V-16 H8" stroke="#7A5C14" stroke-width="3" fill="none"/><rect x="-14" y="40" width="28" height="46" rx="4" fill="#7A5230"/><rect x="-60" y="14" width="26" height="26" fill="#8FCBF0"/><rect x="34" y="14" width="26" height="26" fill="#8FCBF0"/>`
      : `<path d="M-84 -6 L0 -60 L84 -6 Z" fill="#D9D9E3" stroke="#555A6E" stroke-width="5" stroke-linejoin="round"/>${[-60, -20, 20, 60].map((x) => `<rect x="${x - 9}" y="-2" width="18" height="76" fill="#EEF0F6" stroke="#555A6E" stroke-width="4"/>`).join('')}<rect x="-90" y="74" width="180" height="16" rx="4" fill="#C9CCD9" stroke="#555A6E" stroke-width="4"/><circle cx="0" cy="-26" r="10" fill="${c}" stroke="#555A6E" stroke-width="3"/>`
  const cards = rows.map((c, k) => {
    const y = 146 + k * RH, TH = RH - 12, t = a + 0.3 + k * Math.min(1.2, (d * 0.55) / Math.max(1, n)), chip = c.color ?? ['#4FA3E0', '#E8503A', '#3E9A63'][k % 3]
    const ch = TH >= 150 ? 70 : 54, cy0 = c.note ? y + 10 : y + (TH - ch) / 2, ccy = cy0 + ch / 2 // pastille de langue ; la note (≥ 32 px) passe dessous sur toute la largeur
    return `<g class="pop" style="${u.anim('pop', 0.5, t)}"><rect x="30" y="${y}" width="880" height="${TH}" rx="30" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>
      <g transform="translate(120 ${y + TH / 2 - 2}) scale(${TH >= 150 ? 0.85 : 0.7})"><g style="animation:hop 1.6s ease-in-out ${u.f(t + 0.8 + k * 0.3)}s infinite">${icon(c.icon, chip)}</g></g>
      ${T(u, c.where, { x: 330, y: ccy - 24, size: 42, width: 240, fill: '#fff', maxLines: 1 }).svg}
      <g class="pop" style="${u.anim('pop', 0.5, t + 0.5)}"><rect x="480" y="${cy0}" width="410" height="${ch}" rx="${ch / 2}" fill="${chip}" stroke="#fff" stroke-width="5"/>${T(u, c.lang, { x: 685, y: ccy - 24, size: 44, width: 370, fill: '#fff', halo: chip, hk: 0 }).svg}
      ${c.note ? T(u, c.note, { x: 560, y: cy0 + ch + 8, size: 34, width: 680, fill: '#C9D6EE', maxLines: 1 }).svg : ''}</g></g>`
  }).join('')
  return { css: [], svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}${cards}` }
}

// ---------------------------------------------------------------- chronologie qui se déroule
function timeline(p, a, d, u) {
  const it = p.items ?? [], n = it.length, rowH = p.spread ? Math.min(130, 520 / Math.max(1, n)) : Math.min(92, 520 / Math.max(1, n)), y0 = p.spread ? 170 + (520 - n * rowH) / 2 : 170, step = Math.min(1.0, (d * 0.62) / Math.max(1, n))
  const rows = it.map((e, k) => {
    const y = y0 + k * rowH, t = a + 0.3 + k * step
    // colonne des années x 40–330 (« 218 av. J.-C. » tient), point à x 372, texte x 410–910 ; `backwards` : invisible tant que l'élément n'est pas arrivé
    return `<g class="pop" style="${p.spread ? u.anim('rise', 0.45, t, 'ease-out') : u.anim('pop', 0.45, t)}"><circle cx="372" cy="${y + 34}" r="20" fill="${e.color ?? u.YELLOW}" stroke="#fff" stroke-width="5"/>
      ${T(u, e.year, { x: 185, y: y + 4, size: 60, width: 290, fill: u.YELLOW }).svg}${T(u, e.text, { x: 660, y: y + 12, size: 46, width: 500, fill: '#fff' }).svg}</g>`
  }).join('')
  return { css: [], svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}
    <g style="transform-box:fill-box;transform-origin:50% 0;animation:grow ${u.f(n * step + 0.4)}s linear ${u.f(a + 0.3)}s both"><path d="M372 ${y0 + 34} V${y0 + 34 + (n - 1) * rowH}" stroke="#fff" stroke-opacity=".7" stroke-width="8" stroke-linecap="round"/></g>${rows}` }
}

// ---------------------------------------------------------------- comparaison d'échelle : deux pays au même échelle (vrais contours)
function compare(p, a, d, u) {
  const items = p.items ?? [], bbs = items.map((it) => u.bbox(u.paths[it.country])), base = 500
  const k = Math.min(520 / (bbs[0].x1 - bbs[0].x0), 330 / (bbs[0].y1 - bbs[0].y0)), cx = [270, 740]
  const shapes = items.map((it, i) => {
    const bb = bbs[i], t = a + 0.15 + i * 0.8, x = cx[i] - ((bb.x0 + bb.x1) / 2) * k, y = base - bb.y1 * k
    return `<g class="pop" style="${u.anim('pop', 0.5, t)}"><g transform="translate(${u.f(x)} ${u.f(y)}) scale(${u.f(k)})"><path d="${u.paths[it.country]}" fill="${it.color ?? u.YELLOW}" fill-opacity=".92" stroke="#fff" stroke-width="3.5" vector-effect="non-scaling-stroke"/></g>
      ${T(u, it.label, { x: cx[i], y: base + 26, size: 46, width: 420, fill: '#fff' }).svg}${T(u, it.value, { x: cx[i], y: base + 86, size: 54, width: 420, fill: it.color ?? u.YELLOW }).svg}</g>`
  }).join('')
  return { css: [], svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}${shapes}
    <g class="pop" style="${u.anim('pop', 0.6, a + 1.9)}">${T(u, p.ratio ?? '', { x: 470, y: 250, size: 96, width: 300, fill: '#fff', halo: u.NAVY, hk: 0.16 }).svg}</g>` }
}

// ---------------------------------------------------------------- carte avant / après : deux cartes côte à côte, même échelle, vrais contours
function split(p, a, d, u) {
  const parts = p.parts ?? [], ds = parts.map((q) => (q.area ? u.areaPath(q.area) : q.country ? u.paths[q.country] : u.region(q.region.c, q.region.n))), thin = parts.length > 8
  const bbs = ds.map((x) => u.bbox(x)), x0 = Math.min(...bbs.map((b) => b.x0)), x1 = Math.max(...bbs.map((b) => b.x1)), y0 = Math.min(...bbs.map((b) => b.y0)), y1 = Math.max(...bbs.map((b) => b.y1))
  const k = Math.min(380 / (x1 - x0), 300 / (y1 - y0)), cx = [235, 705], cy = 340, mx = (x0 + x1) / 2, my = (y0 + y1) / 2
  const panel = (i, t, after) => `<g class="pop" style="${u.anim('pop', 0.5, t)}"><rect x="${cx[i] - 215}" y="150" width="430" height="400" rx="30" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    <g transform="translate(${u.f(cx[i] - mx * k)} ${u.f(cy - my * k + 6)}) scale(${u.f(k)})">${parts.map((q, n) => {
      const gone = after && q.lost, col = gone ? '#8A93A8' : (after && q.to) ? q.to : (q.color ?? u.YELLOW)
      return `<path d="${ds[n]}" fill="${col}" fill-opacity="${gone ? 0.35 : 0.92}" stroke="#fff" stroke-width="${u.f((gone ? 3 : thin ? 1.6 : 5) / k)}" stroke-linejoin="round"${gone ? ` stroke-dasharray="${u.f(14 / k)} ${u.f(10 / k)}"` : ''}/>`
    }).join('')}</g></g>`
  const lab = (i, t, text, color) => `<g class="pop" style="${u.anim('pop', 0.5, t)}">${T(u, text, { x: cx[i], y: 566, size: 50, width: 430, fill: color }).svg}</g>`
  const tl = a + 0.2, tr = a + 1.0
  return { css: [], svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}${panel(0, tl, false)}${lab(0, tl + 0.3, p.before ?? 'Avant', p.legend ? '#FFFFFF' : '#E8A33C')}
    <g style="${u.anim('fadeIn', 0.4, tr - 0.3, 'ease-out')}"><path d="M440 345 H500 M478 320 L504 345 L478 370" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${panel(1, tr, true)}${lab(1, tr + 0.3, p.after ?? 'Après', (() => { const c = p.legend && parts.find((q) => q.to)?.to; if (!c) return '#FF5A36'; const n = parseInt(c.slice(1), 16), L = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255); return L < 110 ? '#FFFFFF' : c })())}
    ${(p.legend ?? []).length ? (() => { const L = p.legend.slice(0, 4), fs = L.length > 3 ? 32 : 34, ws = L.map((q) => u.tw(q.text, 'en', fs) * 1.08 + 60), tot = ws.reduce((x, y) => x + y, 0) + (L.length > 3 ? 14 : 24) * (L.length - 1); let x = 470 - tot / 2
      const sc = Math.min(1, 860 / tot); return `<g style="${u.anim('fadeIn', 0.4, tr + 0.6, 'ease-out')}"><g transform="translate(${u.f(470 * (1 - sc))} ${u.f(654 * (1 - sc))}) scale(${u.f(sc)})">${L.map((q, k) => { const g = `<rect x="${u.f(x)}" y="636" width="36" height="36" rx="8" fill="${q.color}" stroke="#fff" stroke-width="3"/>${T(u, q.text, { x: x + 50 + (ws[k] - 56) / 2, y: 634, size: fs, width: ws[k], fill: '#fff' }).svg}`; x += ws[k] + (L.length > 3 ? 14 : 24); return g }).join('')}</g></g>` })() : ''}
    ${p.badge ? `<g style="transform-box:fill-box;transform-origin:50% 50%;animation:stamp .6s cubic-bezier(.2,.9,.3,1) ${u.f(tr + 0.8)}s both"><rect x="${705 - 175}" y="300" width="350" height="74" rx="22" fill="#B53A22" stroke="#fff" stroke-width="5"/>${T(u, p.badge, { x: 705, y: 314, size: 44, width: 320, fill: '#fff', halo: '#B53A22', hk: 0 }).svg}</g>` : ''}` }
}

// ---------------------------------------------------------------- le traité : parchemin, signatures qui s'écrivent, sceau de cire qui tamponne l'année
// p = { title: « Traité d'Utrecht », sub: « 11 avril 1713 », signers: [2 à 4 noms], year: « 1713 », seal?: couleur de la cire }
function treaty(p, a, d, u) {
  const INK = '#3A2E24', PAPER = '#F2E3C4', signers = (p.signers ?? []).slice(0, 4), n = signers.length
  const lines = [0, 1, 2, 3].map((k) => `<g style="transform-box:fill-box;transform-origin:0 50%;animation:growx .5s ease-out ${u.f(a + 0.5 + k * 0.12)}s both"><path d="M190 ${232 + k * 34} H${k === 3 ? 560 : 750}" stroke="${INK}" stroke-opacity=".28" stroke-width="9" stroke-linecap="round"/></g>`).join('')
  const sy0 = 400, step = n > 3 ? 58 : 66
  const sig = signers.map((s, k) => { const t = a + 0.7 + k * 0.28, y = sy0 + k * step
    return `<g style="${u.anim('fadeIn', 0.3, t, 'ease-out')}">${T(u, s, { x: 340, y, size: 38, width: 380, fill: '#1F3A6B', halo: PAPER, hk: 0 }).svg}</g>
      <g style="transform-box:fill-box;transform-origin:0 50%;animation:growx .35s ease-out ${u.f(t + 0.15)}s both"><path d="M160 ${y + 46} H520" stroke="#1F3A6B" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></g>` }).join('')
  const ts = a + 0.8 + n * 0.28 + 0.1, wax = p.seal ?? '#A3262F'
  return { css: [], svg: `${NAVY_BG(u)}
  <g class="pop" style="${u.anim('pop', 0.5, a)}">
    <rect x="96" y="34" width="748" height="632" rx="20" fill="${PAPER}" stroke="#6B5B45" stroke-width="5"/>
    <rect x="80" y="22" width="780" height="36" rx="18" fill="#D9C49A" stroke="#6B5B45" stroke-width="4"/>
    <rect x="80" y="642" width="780" height="36" rx="18" fill="#D9C49A" stroke="#6B5B45" stroke-width="4"/>
    ${T(u, p.title ?? '', { x: 470, y: 78, size: 54, width: 680, fill: INK, halo: PAPER, hk: 0 }).svg}
    ${p.sub ? T(u, p.sub, { x: 470, y: 150, size: 40, width: 680, fill: '#6B5B45', halo: PAPER, hk: 0 }).svg : ''}</g>
  ${lines}${sig}
  <g style="transform-box:fill-box;transform-origin:50% 50%;animation:stamp .6s cubic-bezier(.2,.9,.3,1) ${u.f(ts)}s both">
    <circle cx="690" cy="520" r="96" fill="${wax}" stroke="#6E1820" stroke-width="6"/>
    <circle cx="690" cy="520" r="74" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="4" stroke-dasharray="10 8"/>
    ${T(u, String(p.year ?? ''), { x: 690, y: 492, size: 50, width: 150, fill: '#fff', halo: wax, hk: 0 }).svg}</g>` }
}
// ---------------------------------------------------------------- coupe (profil d'altitude ou de profondeur) : sol qui se dessine, mer, sommets
// p = { title, sub?, h: [altitudes en m, de gauche à droite], peaks?: [{ i: index dans h, label, value? }], from?, to?, color?, unit? }
function profile(p, a, d, u) {
  const h = p.h ?? [], n = h.length, X0 = 70, X1 = 870, BOT = 610, TOP = 300
  const lo = Math.min(0, ...h), hi = Math.max(1, ...h), y = (v) => BOT - 20 - ((v - lo) / (hi - lo)) * (BOT - 20 - TOP), x = (i) => X0 + (i / Math.max(1, n - 1)) * (X1 - X0)
  const col = p.color ?? '#4DFFC3', dd = Math.min(1.8, d * 0.4), crest = h.map((v, i) => `${u.f(x(i))} ${u.f(y(v))}`).join('L')
  const sea = lo < 0 ? `<rect x="${X0}" y="${u.f(y(0))}" width="${X1 - X0}" height="${u.f(BOT - y(0))}" fill="#2A7C8C" fill-opacity=".85"/>
    <path d="M${X0} ${u.f(y(0))} H${X1}" stroke="#BFE8F0" stroke-width="3" stroke-dasharray="14 10"/>` : ''
  // révélation du sol par un masque qui s'ouvre de gauche à droite, au rythme du trait de crête (le sol ne se déforme pas)
  const cid = `a-pc${Math.round(a * 100)}`
  const ground = `<clipPath id="${cid}"><rect x="${X0 - 20}" y="${TOP - 60}" width="${X1 - X0 + 40}" height="${BOT - TOP + 80}" style="transform-box:fill-box;transform-origin:0 50%;animation:growx ${u.f(dd)}s ease-out ${u.f(a + 0.3)}s both"/></clipPath>
    <g clip-path="url(#${cid})">${sea}
    <path d="M${X0} ${BOT} L${crest} L${X1} ${BOT} Z" fill="#8A6B4A" stroke="none"/></g>
    <path d="M${crest}" pathLength="1" fill="none" stroke="${u.NAVY}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="1" style="animation:drawline ${u.f(dd)}s ease-out ${u.f(a + 0.3)}s both"/>
    <path d="M${crest}" pathLength="1" fill="none" stroke="${col}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="1" style="animation:drawline ${u.f(dd)}s ease-out ${u.f(a + 0.3)}s both"/>`
  const peaks = (p.peaks ?? []).map((q, k) => {
    const px = x(q.i), py = y(h[q.i]), t = a + 0.3 + dd * (q.i / Math.max(1, n - 1)) + 0.2 + k * 0.1, up = py - 24, w = 300, cx = Math.min(940 - w / 2 - 10, Math.max(w / 2 + 10, px))
    return `<g class="pop" style="${u.anim('pop', 0.45, t)}"><circle cx="${u.f(px)}" cy="${u.f(py)}" r="13" fill="${col}" stroke="#fff" stroke-width="4"/>
      ${T(u, q.label, { x: cx, y: up - (q.value ? 100 : 52), size: 40, width: w, fill: '#fff' }).svg}${q.value ? T(u, q.value, { x: cx, y: up - 54, size: 40, width: w, fill: u.YELLOW }).svg : ''}</g>`
  }).join('')
  const ends = [p.from && T(u, p.from, { x: 200, y: BOT + 18, size: 36, width: 340, fill: '#C9D6EE' }).svg, p.to && T(u, p.to, { x: 740, y: BOT + 18, size: 36, width: 340, fill: '#C9D6EE' }).svg].filter(Boolean).join('')
  return { css: [], svg: `${NAVY_BG(u)}${header(u, a, p.title ?? '', p.sub)}${ground}${peaks}<g style="${u.anim('fadeIn', 0.4, a + 0.3, 'ease-out')}">${ends}</g>` }
}
const IMPL = { split, compare, castle, stats, bars, neutral, languages, timeline, treaty, profile }
export const art = (kind, p, a, d, u) => IMPL[kind](p, a, d, u)
