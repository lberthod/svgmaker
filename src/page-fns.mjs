// Fonctions exécutées DANS la page Chromium (page.evaluate). Elles doivent rester autonomes :
// aucune variable extérieure, tout passe par les arguments.

/** Met tout en pause, fige le JS, mesure durée / taille / type d'animations. */
export async function setupPage() {
  const root = document.documentElement
  if (document.fonts) await document.fonts.ready
  // images <image> : attendre leur décodage
  await Promise.all(
    [...document.querySelectorAll('image')].map((im) => {
      const href = im.getAttribute('href') || im.getAttributeNS('http://www.w3.org/1999/xlink', 'href')
      if (!href) return null
      const i = new Image()
      i.src = new URL(href, document.baseURI).href
      return i.decode().catch(() => null)
    }),
  )
  // figer les boucles JS (setInterval/setTimeout/rAF) des SVG « interactifs »
  const hi = setTimeout(() => {}, 0)
  for (let i = 1; i <= hi; i++) { clearTimeout(i); clearInterval(i) }
  window.requestAnimationFrame = () => 0

  const smil = root.querySelectorAll('animate,animateTransform,animateMotion,set')
  if (root.pauseAnimations) root.pauseAnimations()
  const anims = document.getAnimations()
  anims.forEach((a) => a.pause())
  window.__svgm = { anims, smil: smil.length > 0 }

  // --- durée ---------------------------------------------------------------
  const num = (v) => (v == null || v === '' ? NaN : parseFloat(v))
  let finite = 0, loop = 0
  for (const a of anims) {
    const t = a.effect.getTiming()
    // Web Animations : millisecondes → secondes
    const d = (Number(t.duration) || 0) / 1000
    const delay = (t.delay || 0) / 1000
    if (t.iterations === Infinity) loop = Math.max(loop, Math.max(0, delay) + d)
    else finite = Math.max(finite, delay + d * t.iterations + (t.endDelay || 0) / 1000)
  }
  // SMIL : résolution des begin (nombres et syncbase id.begin/id.end ± décalage)
  const clock = (s) => {
    s = s.trim()
    if (!s || s === 'indefinite') return NaN
    let m = s.match(/^(\d+):(\d+):(\d+(?:\.\d+)?)$/)
    if (m) return +m[1] * 3600 + +m[2] * 60 + +m[3]
    m = s.match(/^(\d+):(\d+(?:\.\d+)?)$/)
    if (m) return +m[1] * 60 + +m[2]
    m = s.match(/^(-?\d*\.?\d+)(h|min|s|ms)?$/)
    if (!m) return NaN
    const k = { h: 3600, min: 60, s: 1, ms: 0.001 }[m[2] || 's']
    return +m[1] * k
  }
  const memo = new Map()
  const timing = (el, depth = 0) => {
    if (memo.has(el)) return memo.get(el)
    memo.set(el, null) // garde contre les cycles
    let begin = NaN
    for (const part of (el.getAttribute('begin') || '0s').split(';')) {
      const p = part.trim()
      let b = clock(p)
      const m = p.match(/^([\w-]+)\.(begin|end)\s*(?:([+-])\s*(.+))?$/)
      if (isNaN(b) && m && depth < 50) {
        const ref = document.getElementById(m[1])
        const rt = ref && timing(ref, depth + 1)
        if (rt) b = (m[2] === 'begin' ? rt.begin : rt.end) + (m[3] ? (m[3] === '-' ? -1 : 1) * clock(m[4]) : 0)
      }
      if (!isNaN(b) && (isNaN(begin) || b < begin)) begin = b
    }
    if (isNaN(begin)) return null
    const dur = clock(el.getAttribute('dur') || '')
    const rc = el.getAttribute('repeatCount')
    const rd = clock(el.getAttribute('repeatDur') || '')
    const endAttr = clock(el.getAttribute('end') || '')
    let active = isNaN(dur) ? 0 : dur
    let looping = false
    if (rc === 'indefinite' || el.getAttribute('repeatDur') === 'indefinite') looping = true
    else if (!isNaN(num(rc))) active = dur * num(rc)
    if (!isNaN(rd)) { active = rd; looping = false }
    let end = begin + active
    if (!isNaN(endAttr)) { end = Math.min(looping ? endAttr : end, endAttr); looping = false }
    const r = { begin, end, looping, dur: isNaN(dur) ? 0 : dur }
    memo.set(el, r)
    return r
  }
  for (const el of smil) {
    const r = timing(el)
    if (!r) continue
    if (r.looping) loop = Math.max(loop, r.begin + r.dur)
    else finite = Math.max(finite, r.end)
  }
  const attr = num(root.getAttribute('data-duration'))
  const duration = !isNaN(attr) ? attr : finite > 0 ? finite : loop
  const source = !isNaN(attr) ? 'data-duration' : finite > 0 ? 'animations' : loop > 0 ? 'boucle' : 'inconnue'

  // --- taille ---------------------------------------------------------------
  const vb = root.viewBox && root.viewBox.baseVal
  const wa = root.getAttribute('width'), ha = root.getAttribute('height')
  const abs = (v) => (v && /^\d+(\.\d+)?(px)?$/.test(v.trim()) ? parseFloat(v) : NaN)
  let width = abs(wa), height = abs(ha)
  if ((isNaN(width) || isNaN(height)) && vb && vb.width) {
    width = 1080
    height = Math.round((1080 * vb.height) / vb.width)
  }
  return {
    duration,
    durationSource: source,
    fps: num(root.getAttribute('data-fps')) || null,
    width: isNaN(width) ? 1080 : width,
    height: isNaN(height) ? 1920 : height,
    cssAnimations: anims.length,
    smilAnimations: smil.length,
    scripts: document.querySelectorAll('script').length,
  }
}

/** Remplit le viewport quelle que soit la taille déclarée du SVG. */
export function fitViewport(bg) {
  const root = document.documentElement
  root.setAttribute('width', '100%')
  root.setAttribute('height', '100%')
  root.style.width = '100%'
  root.style.height = '100%'
  if (bg) root.style.background = bg
}

/**
 * Positionne TOUTES les animations (CSS + SMIL) à t secondes.
 * Retourne une signature de l'état (null si non calculable) : deux signatures identiques
 * garantissent deux images identiques, ce qui permet de sauter la capture.
 */
export function seek(t) {
  const s = window.__svgm
  const root = document.documentElement
  if (s.smil && root.setCurrentTime) root.setCurrentTime(t)
  let sig = ''
  for (const a of s.anims) {
    a.currentTime = t * 1000
    if (!s.smil) {
      const c = a.effect.getComputedTiming()
      sig += (c.progress == null ? 'x' : c.progress.toFixed(5)) + ':' + (c.currentIteration ?? 'x') + ';'
    }
  }
  return s.smil ? null : sig
}

/** Textes visibles (opacité effective ≥ 0,6) avec boîte, corps réel et rôle. */
export function visibleTexts() {
  const root = document.documentElement
  const out = []
  for (const t of document.querySelectorAll('text')) {
    let op = 1, hidden = false
    for (let e = t; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e)
      op *= parseFloat(cs.opacity)
      if (cs.display === 'none' || cs.visibility === 'hidden') hidden = true
    }
    if (hidden || op < 0.6) continue
    const r = t.getBoundingClientRect()
    if (!r.width || !r.height) continue
    // masqué par un élément peint par-dessus (ordre de peinture SVG = ordre du document) ?
    let covered = 0, probes = 0
    for (const fx of [0.25, 0.5, 0.75]) {
      const x = r.left + r.width * fx, y = r.top + r.height * 0.55
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue
      probes++
      // du plus haut au plus bas : le premier élément « opaque » décide
      for (const hit of document.elementsFromPoint(x, y)) {
        if (hit === t || t.contains(hit)) break // le texte lui-même est au-dessus : visible
        if (hit.contains(t) || hit === root) break
        // calques plein écran (vignette, grain, dégradé) et éléments quasi transparents : on regarde dessous
        const hb = hit.getBoundingClientRect()
        if (hb.width * hb.height > 0.5 * innerWidth * innerHeight) continue
        let hop = 1
        for (let e = hit; e && e.nodeType === 1; e = e.parentElement) hop *= parseFloat(getComputedStyle(e).opacity)
        const hcs = getComputedStyle(hit)
        if (hop * parseFloat(hcs.fillOpacity || '1') < 0.85 || hcs.fill === 'none') continue
        if (t.compareDocumentPosition(hit) & Node.DOCUMENT_POSITION_FOLLOWING) covered++
        break
      }
    }
    if (probes && covered === probes) continue
    const ctm = t.getScreenCTM()
    const scale = ctm ? Math.hypot(ctm.a, ctm.b) : 1
    const roleEl = t.closest('[data-role]')
    out.push({
      s: (t.textContent || '').trim().slice(0, 60),
      x0: r.left, x1: r.right, y0: r.top, y1: r.bottom,
      fs: parseFloat(getComputedStyle(t).fontSize) * scale,
      role: roleEl ? roleEl.dataset.role : '',
    })
  }
  return out
}

/** Acteurs visibles (éléments [data-actor], opacité effective ≥ 0,6) avec leur boîte à l'écran. */
export function visibleActors() {
  const out = []
  for (const a of document.querySelectorAll('[data-actor]')) {
    let op = 1, hidden = false
    for (let e = a; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e)
      op *= parseFloat(cs.opacity)
      if (cs.display === 'none' || cs.visibility === 'hidden') hidden = true
    }
    if (hidden || op < 0.6) continue
    const r = a.getBoundingClientRect()
    if (!r.width || !r.height) continue
    out.push({ name: a.getAttribute('data-actor'), x0: r.left, x1: r.right, y0: r.top, y1: r.bottom, bleed: a.hasAttribute('data-bleed') })
  }
  return out
}

/** État des poses de chaque acteur visible : { nom: { hasTalk, talk } } (talk = opacité de la pose « talk »). */
export function poseStates() {
  const out = {}
  for (const a of document.querySelectorAll('[data-actor]')) {
    let op = 1
    for (let e = a; e && e.nodeType === 1; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity)
    if (op < 0.6) continue
    // V2 (personnage articulé) : ouverture = opacité effective la plus forte d'une bouche ouverte (pose visible comprise)
    const mouths = a.querySelectorAll('[data-part="mouth-open"]')
    if (mouths.length) {
      let best = 0
      for (const m of mouths) {
        let o = 1
        for (let e = m; e && e !== a; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity)
        best = Math.max(best, o)
      }
      out[a.getAttribute('data-actor')] = { hasTalk: true, talk: best }
      continue
    }
    const talk = a.querySelector('[data-pose="talk"]')
    out[a.getAttribute('data-actor')] = { hasTalk: !!talk, talk: talk ? parseFloat(getComputedStyle(talk).opacity) : 0 }
  }
  return out
}

/** Indices des sous-titres visibles ([data-sub], opacité effective ≥ 0,9). */
export function visibleSubs() {
  const out = []
  for (const g of document.querySelectorAll('[data-sub]')) {
    let op = 1
    for (let e = g; e && e.nodeType === 1; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity)
    if (op >= 0.9) out.push(+g.getAttribute('data-sub'))
  }
  return out
}
