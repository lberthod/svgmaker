// svgkit · dessins « V2 » : décors plein cadre en 3 couches (parallaxe) et poses de personnages articulés.
//
//   Décor  : library/scenes/<id>.svg      <svg viewBox="0 0 W 1920" data-kind="scene">  (1080 ≤ W ≤ 4320)
//            3 groupes de premier niveau, dans cet ordre : <g data-layer="back">, <g data-layer="mid">, <g data-layer="fore">
//   Pose   : library/<cat>/<perso>--<pose>.svg   <svg viewBox="…" data-kind="pose" data-height="1150">
//            ancre (0,0) = sol entre les pieds, y vers le bas (la tête est en y < 0) ; dessinée tournée vers la DROITE ;
//            parties obligatoires : mouth-closed, mouth-open, eyes-open, eyes-closed ; facultatives : grip-r, grip-l.
//
// Comme les dessins V1 : SVG statique (ni script, ni animation, ni style, ni class, ni image, ni lien). En plus,
// les dégradés et masques sont permis : id sur <linearGradient|radialGradient|clipPath|mask|pattern> seulement,
// référencés par url(#id). Le moteur préfixe ces id à chaque usage (aucune collision entre décors et poses).

const FORBIDDEN = /<script|<animate|<set\b|animation|@keyframes|\bclass=|<style|href=|<image|<foreignObject|\bon[a-z]+=/i
const PAINT = /^(linearGradient|radialGradient|clipPath|mask|pattern)$/
export const SCENE_H = 1920
export const LAYERS = ['back', 'mid', 'fore']
export const POSE_PARTS = ['mouth-closed', 'mouth-open', 'eyes-open', 'eyes-closed']

/** Attributs de la racine <svg …> d'un fichier (viewBox, data-kind, data-height…). */
export function rootAttrs(text) {
  const m = /<svg\b([^>]*)>/.exec(text)
  if (!m) return {}
  return Object.fromEntries([...m[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]))
}
/** Contenu entre <svg …> et </svg> (sans <title>). */
export function innerOf(text) {
  const a = text.indexOf('>', text.search(/<svg\b/)) + 1, b = text.lastIndexOf('</svg>')
  return text.slice(a, b < 0 ? undefined : b).replace(/<title>[\s\S]*?<\/title>/, '').trim()
}

/** Règles communes : contenu statique, id seulement sur les dégradés/masques, url(#…) résolus. */
function validateCommon(part, where) {
  if (typeof part !== 'string' || !part.trim()) throw new Error(`${where} : dessin vide`)
  const m = FORBIDDEN.exec(part)
  if (m) throw new Error(`${where} : « ${m[0]} » interdit (script, animation, style, class, href, image, on…)`)
  const ids = new Set()
  for (const x of part.matchAll(/<([a-zA-Z]+)\b[^>]*\sid="([^"]+)"/g)) {
    if (!PAINT.test(x[1])) throw new Error(`${where} : id="${x[2]}" sur <${x[1]}> interdit (id seulement sur un dégradé ou un masque ; pour une partie animable : data-part="${x[2]}")`)
    ids.add(x[2])
  }
  for (const x of part.matchAll(/url\(#([^)]+)\)/g)) if (!ids.has(x[1])) throw new Error(`${where} : url(#${x[1]}) ne renvoie à aucun dégradé du fichier`)
  const open = (part.match(/<[a-zA-Z][^>]*[^/]>|<[a-zA-Z]+>/g) || []).length
  const close = (part.match(/<\/[a-zA-Z]+>/g) || []).length
  if (open !== close) throw new Error(`${where} : balises non équilibrées (${open} ouvertes, ${close} fermées)`)
  return part
}

/** Groupes de premier niveau <g data-layer="…">…</g> d'un décor : { back, mid, fore, rest } (rest = <defs>…). */
export function splitLayers(content) {
  const out = { rest: '' }
  let i = 0, rest = ''
  while (i < content.length) {
    const m = /<g\b[^>]*\sdata-layer="([a-z]+)"[^>]*>/g
    m.lastIndex = i
    const hit = m.exec(content)
    if (!hit) { rest += content.slice(i); break }
    rest += content.slice(i, hit.index)
    // fin du groupe : on compte les <g> ouverts et fermés
    let depth = 1, j = hit.index + hit[0].length
    const re = /<g\b[^>]*?(\/?)>|<\/g>/g
    re.lastIndex = j
    let t
    while (depth && (t = re.exec(content))) {
      if (t[0].startsWith('</')) depth--
      else if (!t[1]) depth++
      j = re.lastIndex
    }
    if (depth) throw new Error(`groupe data-layer="${hit[1]}" non fermé`)
    if (out[hit[1]] != null) throw new Error(`deux groupes data-layer="${hit[1]}"`)
    out[hit[1]] = content.slice(hit.index + hit[0].length, j - 4)
    out.order = [...(out.order ?? []), hit[1]]
    i = j
  }
  out.rest = rest.trim()
  return out
}

/** Décor : viewBox 0 0 W 1920, 3 couches back → mid → fore. Retourne { w, h, layers }. */
export function validateScene(text, where = 'décor') {
  const a = rootAttrs(text)
  const vb = (a.viewBox ?? '').trim().split(/[\s,]+/).map(Number)
  if (vb.length !== 4 || vb[0] !== 0 || vb[1] !== 0) throw new Error(`${where} : viewBox="0 0 W 1920" attendu (reçu « ${a.viewBox ?? ''} »)`)
  const [, , w, h] = vb
  if (h !== SCENE_H) throw new Error(`${where} : hauteur ${h} ≠ ${SCENE_H} (viewBox="0 0 W 1920")`)
  if (!(w >= 1080 && w <= 4320)) throw new Error(`${where} : largeur ${w} hors de 1080…4320`)
  const content = text.includes('<svg') ? innerOf(text) : text
  validateCommon(content, where)
  const layers = splitLayers(content)
  for (const l of LAYERS) if (layers[l] == null) throw new Error(`${where} : groupe <g data-layer="${l}"> manquant (back, mid, fore ; un groupe vide est permis)`)
  if (layers.order.join() !== LAYERS.join()) throw new Error(`${where} : ordre des couches ${layers.order.join(' → ')} ; attendu back → mid → fore`)
  if (layers.rest.replace(/<defs>[\s\S]*?<\/defs>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim()) throw new Error(`${where} : tout le dessin va dans les 3 couches (seul <defs> peut être à côté)`)
  return { w, h, layers }
}

/** Pose : data-height, ancre aux pieds, parties de bouche et d'yeux. Retourne { height, parts, grips }. */
export function validatePose(text, where = 'pose') {
  const a = rootAttrs(text)
  const height = Number(a['data-height'])
  if (!(height >= 200 && height <= 1800)) throw new Error(`${where} : data-height (hauteur de référence en px, 200…1800) manquant sur <svg>`)
  const content = text.includes('<svg') ? innerOf(text) : text
  validateCommon(content, where)
  const parts = partsOf(content)
  const miss = POSE_PARTS.filter((p) => !parts.includes(p))
  if (miss.length) throw new Error(`${where} : partie(s) ${miss.map((p) => `data-part="${p}"`).join(', ')} manquante(s)`)
  return { height, parts, grips: gripsOf(content) }
}

export const partsOf = (s) => [...new Set([...s.matchAll(/data-part="([^"]+)"/g)].map((m) => m[1]))]

/** Points de prise d'accessoire : <circle data-part="grip-r" cx=".." cy=".." r="0"/>. */
export function gripsOf(s) {
  const out = {}
  for (const m of s.matchAll(/<circle\b[^>]*data-part="(grip-[lr])"[^>]*>/g)) {
    const cx = /\scx="(-?[\d.]+)"/.exec(m[0]), cy = /\scy="(-?[\d.]+)"/.exec(m[0])
    out[m[1]] = [Number(cx?.[1] ?? 0), Number(cy?.[1] ?? 0)]
  }
  return out
}

/** Préfixe les id (dégradés, masques) et leurs url(#…) : plusieurs copies d'un même dessin cohabitent. */
export const scopeIds = (s, prefix) =>
  s.replace(/(\sid=")([^"]+)"/g, `$1${prefix}-$2"`).replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)

/** Éléments tracés sans vector-effect="non-scaling-stroke" (contrôle de style, pas une erreur). */
export const scalingStrokes = (s) => (s.match(/<[a-z]+\b[^>]*\sstroke-width="[^"]+"[^>]*>/g) || []).filter((e) => !/non-scaling-stroke/.test(e) && !/stroke="none"/.test(e)).length
