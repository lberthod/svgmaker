// Règles de lisibilité Reels/Stories/Shorts (référence 1080×1920, mises à l'échelle).
// Repris et généralisés de barbatoPeintures/scripts/reels/render.mjs.
export const SAFE_REF = { top: 220, bottom: 1500, left: 60, right: 1020, iconsX: 960, iconsY: 1050 }

export function safeZone(width, height) {
  const kx = width / 1080, ky = height / 1920
  return {
    top: SAFE_REF.top * ky, bottom: SAFE_REF.bottom * ky,
    left: SAFE_REF.left * kx, right: SAFE_REF.right * kx,
    iconsX: SAFE_REF.iconsX * kx, iconsY: SAFE_REF.iconsY * ky,
  }
}

const near = (a, b) => Math.abs(a.x0 - b.x0) < 3 && Math.abs(a.y0 - b.y0) < 3 && Math.abs(a.x1 - b.x1) < 3

/**
 * Un texte n'est jugé que s'il est LISIBLE : à l'écran et immobile sur au moins deux
 * échantillons consécutifs (≥ 0,25 s). Les textes en plein mouvement (cartes qui glissent,
 * titres qui entrent) ne déclenchent donc pas de fausses alertes.
 *
 * samples : [{ t, texts: [...] }] (voir page-fns visibleTexts)
 * Retourne { hookAt, finalFrom, issues: [string] }.
 */
export function analyse(samples, { width, height, duration, minFont = 26, minSub = 44, minFinal = 2.8, hookBy = 1, step = 0.25 }) {
  const vertical = height / width > 1.6
  const z = safeZone(width, height)
  const fontMin = minFont * (width / 1080)
  const issues = new Map()
  const add = (k, m) => { if (!issues.has(k)) issues.set(k, m) }
  const onScreen = (x) => x.x1 > 0 && x.x0 < width && x.y1 > 0 && x.y0 < height
  const hasRoles = samples.some((s) => s.texts.some((x) => x.role))
  let hookAt = null, finalFrom = null, finalTo = null
  // Le carton final peut s'effacer dans les toutes dernières secondes (fondu, retour à la première image pour la
  // lecture en boucle) : on le mesure de sa première à sa dernière apparition, s'il reste au plus END_FADE s après.
  const END_FADE = 2

  samples.forEach(({ t, texts }, k) => {
    const neighbours = [samples[k - 1], samples[k + 1]].filter(Boolean)
    const stable = texts.filter((x) => onScreen(x) && neighbours.some((n) => n.texts.some((y) => y.s === x.s && near(x, y))))
    if (hookAt == null && stable.length && (!hasRoles || stable.some((x) => x.role === 'hook'))) hookAt = t
    if (stable.some((x) => x.role === 'final')) { finalFrom ??= t; finalTo = t }
    else if (duration - t > END_FADE) finalFrom = null

    for (const x of stable) {
      const q = `« ${x.s} »`
      if (x.role === 'sub' && x.fs < minSub * (width / 1080)) add('s' + x.s, `sous-titre trop petit (${x.fs.toFixed(0)} px < ${minSub}) : ${q}`)
      if (x.fs < fontMin) add('f' + x.s, `texte trop petit (${x.fs.toFixed(0)} px < ${fontMin.toFixed(0)}) : ${q}`)
      if (x.x0 < -1 || x.x1 > width + 1 || x.y0 < -1 || x.y1 > height + 1) add('o' + x.s, `texte coupé par le bord de l'image (${Math.round(x.x0)}–${Math.round(x.x1)} px) : ${q}`)
      else if (vertical) {
        if (x.x0 < z.left || x.x1 > z.right) add('h' + x.s, `hors marge latérale (${Math.round(x.x0)}–${Math.round(x.x1)} px) : ${q}`)
        if (x.y0 < z.top) add('t' + x.s, `dans la zone haute masquée par l'interface (${Math.round(x.y0)} px) : ${q}`)
        if (x.y1 > z.bottom) add('b' + x.s, `sous la zone sûre du bas, masqué par la légende (${Math.round(x.y1)} px) : ${q}`)
        else if (x.x1 > z.iconsX && x.y1 > z.iconsY) add('i' + x.s, `sous les icônes j'aime/commenter à droite : ${q}`)
      }
    }
    for (let i = 0; i < stable.length; i++)
      for (let j = i + 1; j < stable.length; j++) {
        const a = stable[i], b = stable[j]
        if (a.s === b.s) continue // doublon voulu (ombre, contour, effet néon)
        const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
        const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)
        // les lignes d'un même titre se touchent : on exige un vrai recouvrement (> 35 % de hauteur)
        if (w > 6 && h > 0.35 * Math.min(a.y1 - a.y0, b.y1 - b.y0)) {
          const pair = [a.s, b.s].sort().join(' / ')
          add('c' + pair, `textes superposés à ${t.toFixed(2)} s : « ${pair.replace(' / ', ' » / « ')} »`)
        }
      }
  })

  // acteurs (formats avec personnages) : un acteur immobile à moitié hors cadre est « coupé »
  const sameBox = (a, b) => Math.abs(a.x0 - b.x0) < 6 && Math.abs(a.y0 - b.y0) < 6 && Math.abs(a.x1 - b.x1) < 6 && Math.abs(a.y1 - b.y1) < 6
  samples.forEach(({ t, actors }, k) => {
    for (const a of actors ?? []) {
      if (a.bleed) continue
      const stable = [samples[k - 1], samples[k + 1]].some((n) => n?.actors?.some((y) => y.name === a.name && sameBox(a, y)))
      if (!stable) continue
      const inside = Math.max(0, Math.min(a.x1, width) - Math.max(a.x0, 0)) * Math.max(0, Math.min(a.y1, height) - Math.max(a.y0, 0))
      const area = (a.x1 - a.x0) * (a.y1 - a.y0)
      if (inside > 0 && inside < area - 24 * Math.max(a.x1 - a.x0, a.y1 - a.y0)) add('a' + a.name, `acteur coupé par le bord de l'image à ${t.toFixed(2)} s : ${a.name}`)
    }
  })

  if (vertical) {
    if (hookAt == null) add('hook', 'aucun texte lisible : pas d\'accroche écrite')
    else if (hookAt > hookBy) add('hook', `accroche lisible trop tard (${hookAt.toFixed(2)} s > ${hookBy} s) : ${'on perd le scroll'}`)
    if (hasRoles && samples.some((s) => s.texts.some((x) => x.role === 'final'))) {
      const len = finalFrom == null ? 0 : Math.min(duration, finalTo + step) - finalFrom
      if (len + step < minFinal) add('final', `carton final trop court (${len.toFixed(2)} s < ${minFinal} s)`)
    }
  }
  return { hookAt, finalFrom, issues: [...issues.values()] }
}

// ---------------------------------------------------------------- couverture
// La couverture (<nom>-cover.jpg) est l'image que l'on voit avant de lancer la vidéo (grille du profil,
// miniature). La toute première image est souvent un décor vide, identique d'une vidéo à l'autre.

/** Textes lisibles (à l'écran et immobiles) : nombre et surface visible ; acteurs entièrement dans le cadre (échantillon k). */
function richness(samples, k, width, height) {
  const s = samples[k], nb = [samples[k - 1], samples[k + 1]].filter(Boolean)
  const onScreen = (x) => x.x1 > 0 && x.x0 < width && x.y1 > 0 && x.y0 < height
  const seen = new Map()
  for (const x of s.texts) if (onScreen(x) && !seen.has(x.s) && nb.some((n) => n.texts.some((y) => y.s === x.s && near(x, y)))) seen.set(x.s, x)
  const area = [...seen.values()].reduce((a, x) => a + (Math.min(x.x1, width) - Math.max(x.x0, 0)) * (Math.min(x.y1, height) - Math.max(x.y0, 0)), 0)
  const inside = (a) => a.x0 >= -2 && a.y0 >= -2 && a.x1 <= width + 2 && a.y1 <= height + 2
  const actors = (s.actors ?? []).filter(inside).length
  return { texts: seen.size, area, actors }
}

/**
 * Choisit l'instant de la couverture : dans le début de la vidéo (40 % de la durée, 10 s au plus), le premier
 * échantillon où les textes lisibles couvrent la plus grande surface (à égalité : le plus d'acteurs entiers).
 * La surface plutôt que le nombre : le bandeau du thème, qui arrive souvent après l'accroche, pèse plus
 * qu'une petite bulle « Hi! ». Ainsi le titre ET le thème sont sur la couverture.
 * Retourne null s'il n'y a aucun texte lisible dans cette fenêtre.
 */
export function pickCover(samples, { width, height, duration }) {
  const until = Math.min(10, Math.max(1, duration * 0.4))
  let best = null, bestScore = 0
  samples.forEach((s, k) => {
    if (s.t > until) return
    const r = richness(samples, k, width, height)
    const score = r.area * 100 + r.actors
    if (r.texts && score > bestScore) { best = s.t; bestScore = score }
  })
  return best
}

/** Textes lisibles à l'instant t (échantillon le plus proche). */
export function textsAt(samples, t, { width, height }) {
  if (!samples.length) return 0
  let k = 0
  samples.forEach((s, i) => { if (Math.abs(s.t - t) < Math.abs(samples[k].t - t)) k = i })
  return richness(samples, k, width, height).texts
}

/** Écart moyen (0–255) entre deux empreintes de couverture (petites images brutes, même taille). */
export function coverDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity
  let d = 0
  for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i])
  return d / a.length
}

/** Écart type des pixels d'une empreinte : bas = image presque unie. */
export function coverContrast(sig) {
  if (!sig?.length) return 0
  const m = sig.reduce((a, v) => a + v, 0) / sig.length
  return Math.sqrt(sig.reduce((a, v) => a + (v - m) ** 2, 0) / sig.length)
}

/**
 * Contrôle de la couverture. cover = { at, texts (nombre de textes lisibles, ou null si inconnu), sig (Buffer) },
 * others = [{ name, sig }] couvertures des AUTRES vidéos (même dossier, dossiers voisins, même lot).
 * « identique » : écart moyen < 0,5 sur 255 (les anciennes couvertures vides de Mali : 0 ; deux thèmes qui ne
 * diffèrent que par la couleur du bandeau : 1,5). Retourne une liste d'alertes.
 */
export function coverIssues(cover, others = [], { minContrast = 12, same = 0.5 } = {}) {
  const out = []
  const at = `${cover.at.toFixed(2)} s`
  if (cover.texts === 0) out.push(`couverture trop vide (${at}) : aucun texte lisible, choisis un instant avec le titre (data-cover-at="…" sur <svg> ou --cover-at)`)
  else if (cover.sig && coverContrast(cover.sig) < minContrast) out.push(`couverture presque unie (${at}) : rien ne s'y distingue`)
  const twins = others.filter((o) => coverDistance(cover.sig, o.sig) < same).map((o) => o.name)
  if (twins.length) out.push(`couverture identique à celle de ${twins.slice(0, 3).join(', ')}${twins.length > 3 ? ` (+${twins.length - 3})` : ''} : on ne distingue pas les vidéos dans la grille`)
  return out
}
