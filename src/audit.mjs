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
export function analyse(samples, { width, height, duration, minFont = 26, minFinal = 2.8, hookBy = 1, step = 0.25 }) {
  const vertical = height / width > 1.6
  const z = safeZone(width, height)
  const fontMin = minFont * (width / 1080)
  const issues = new Map()
  const add = (k, m) => { if (!issues.has(k)) issues.set(k, m) }
  const onScreen = (x) => x.x1 > 0 && x.x0 < width && x.y1 > 0 && x.y0 < height
  const hasRoles = samples.some((s) => s.texts.some((x) => x.role))
  let hookAt = null, finalFrom = null

  samples.forEach(({ t, texts }, k) => {
    const neighbours = [samples[k - 1], samples[k + 1]].filter(Boolean)
    const stable = texts.filter((x) => onScreen(x) && neighbours.some((n) => n.texts.some((y) => y.s === x.s && near(x, y))))
    if (hookAt == null && stable.length && (!hasRoles || stable.some((x) => x.role === 'hook'))) hookAt = t
    if (stable.some((x) => x.role === 'final')) finalFrom ??= t
    else if (t < duration - step - 0.05) finalFrom = null

    for (const x of stable) {
      const q = `« ${x.s} »`
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

  if (vertical) {
    if (hookAt == null) add('hook', 'aucun texte lisible : pas d\'accroche écrite')
    else if (hookAt > hookBy) add('hook', `accroche lisible trop tard (${hookAt.toFixed(2)} s > ${hookBy} s) : ${'on perd le scroll'}`)
    if (hasRoles && samples.some((s) => s.texts.some((x) => x.role === 'final'))) {
      const len = finalFrom == null ? 0 : duration - finalFrom
      if (len + step < minFinal) add('final', `carton final trop court (${len.toFixed(2)} s < ${minFinal} s)`)
    }
  }
  return { hookAt, finalFrom, issues: [...issues.values()] }
}
