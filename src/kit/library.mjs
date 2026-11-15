// svgkit · bibliothèque de dessins partagée par toutes les séries.
//
//   library/<catégorie>/<id>.svg   un dessin par fichier, centré en (0,0), visible tel quel dans un navigateur
//   library/index.json             { id: { file, cat, tags, source, colors, bytes } } — régénéré par reindex()
//
// Le dessin proprement dit est le contenu entre les marqueurs <!-- art --> et <!-- /art --> : c'est
// exactement la chaîne injectée dans <defs> par les gabarits (aucune transformation, rendu identique).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { esc, validateArt } from './core.mjs'
import { scalingStrokes, validatePose, validateScene } from './v2art.mjs'

export const LIBRARY = path.resolve(new URL('../../library', import.meta.url).pathname)
const INDEX = () => path.join(LIBRARY, 'index.json')
const OPEN = '<!-- art -->', CLOSE = '<!-- /art -->'
export const VIEWBOX = '-300 -300 600 600'

/** Identifiant de dessin : minuscules, chiffres et tirets (« ice-cream ») ; une pose V2 : « perso--pose » (« gutenberg--pull-bar »). */
export const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*(--[a-z0-9]+(-[a-z0-9]+)*)?$/
const CAT_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const slug = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Fichier .svg autonome pour un dessin (visible dans un navigateur, dans le studio, par un agent). */
export function artFile(id, art, { title = id, kind, viewBox = VIEWBOX, height } = {}) {
  const [, , w, h] = viewBox.split(/\s+/).map(Number)
  const size = kind === 'scene' ? `width="${w / 2}" height="${h / 2}"` : kind === 'pose' ? `width="${Math.round((w / h) * 600)}" height="600"` : 'width="600" height="600"'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${size} data-art="${id}"${kind ? ` data-kind="${kind}"` : ''}${height ? ` data-height="${height}"` : ''}>
<title>${esc(title)}</title>
${OPEN}${art}${CLOSE}
</svg>
`
}

/** Extrait le dessin d'un fichier de bibliothèque. */
export function parseArtFile(text, where = 'dessin') {
  const a = text.indexOf(OPEN), b = text.lastIndexOf(CLOSE)
  if (a < 0 || b < a) throw new Error(`${where} : marqueurs ${OPEN} … ${CLOSE} introuvables`)
  return text.slice(a + OPEN.length, b)
}

// ---------------------------------------------------------------- lecture
let cache = null
/** Index { id: entrée } (lu une fois par processus ; reload() pour relire). */
export function index() {
  if (!cache) cache = existsSync(INDEX()) ? JSON.parse(readFileSync(INDEX(), 'utf8')) : {}
  return cache
}
export const reload = () => { cache = null; arts.clear() }

const arts = new Map()
/** Dessin `id` (chaîne SVG). Lève une erreur claire si l'id est inconnu. */
export function art(id) {
  if (arts.has(id)) return arts.get(id)
  const e = index()[id]
  if (!e) throw new Error(`dessin « ${id} » absent de library/ (svgmaker art list pour voir les dessins)`)
  const s = parseArtFile(readFileSync(path.join(LIBRARY, e.file), 'utf8'), e.file)
  arts.set(id, s)
  return s
}
export const hasArt = (id) => Object.hasOwn(index(), id)

/**
 * Plusieurs dessins d'un coup, dans l'ordre donné : lib('cow', 'pig') ou lib({ cow: 'cow-mali' })
 * (clé locale → id de bibliothèque). Retourne { clé: svg }.
 */
export function lib(...ids) {
  const map = ids.length === 1 && typeof ids[0] === 'object' ? ids[0] : Object.fromEntries(ids.map((i) => [i, i]))
  return Object.fromEntries(Object.entries(map).map(([k, id]) => [k, art(id)]))
}

/** `value` est soit un dessin en ligne (« <… »), soit un id de bibliothèque. */
export const resolveArt = (value) => (typeof value === 'string' && value.trimStart().startsWith('<') ? value : art(value))

// ---------------------------------------------------------------- écriture
const colorsOf = (s) => [...new Set((s.match(/#[0-9A-Fa-f]{6}\b/g) || []).map((c) => c.toUpperCase()))]

/** Ajoute ou remplace un dessin. Valide le dessin et l'id ; met l'index à jour.
 *  kind = 'scene' (décor plein cadre, viewBox « 0 0 W 1920 ») ou 'pose' (personnage articulé, height = data-height). */
export function addArt(id, svg, { cat, tags = [], source = '', title, kind, viewBox, height } = {}) {
  if (!ID_RE.test(id)) throw new Error(`id « ${id} » invalide (minuscules, chiffres, tirets ; « perso--pose » pour une pose)`)
  if (!cat || !CAT_RE.test(cat)) throw new Error(`catégorie « ${cat} » invalide`)
  if (kind === 'scene') validateScene(artFile(id, svg, { kind, viewBox }), id)
  else if (kind === 'pose') validatePose(artFile(id, svg, { kind, viewBox, height }), id)
  else validateArt(svg, id)
  const idx = index()
  if (idx[id] && idx[id].cat !== cat) throw new Error(`id « ${id} » déjà utilisé dans la catégorie ${idx[id].cat}`)
  const file = `${cat}/${id}.svg`
  mkdirSync(path.join(LIBRARY, cat), { recursive: true })
  writeFileSync(path.join(LIBRARY, file), artFile(id, svg, { title, kind, viewBox, height }))
  idx[id] = { file, cat, tags, source, colors: colorsOf(svg), bytes: Buffer.byteLength(svg), ...(kind ? { kind, viewBox, ...(height ? { height } : {}) } : {}) }
  arts.set(id, svg)
  return idx[id]
}

/** Fichier complet d'un dessin (décors et poses V2 : viewBox, data-height…). */
export const artText = (id) => readFileSync(path.join(LIBRARY, index()[id].file), 'utf8')

/** Contrôle de style : nombre de traits qui grossissent avec le zoom (sans vector-effect="non-scaling-stroke"). */
export const strokeLint = (svg) => scalingStrokes(svg)

/** Recalcule couleurs et tailles de toutes les entrées depuis les fichiers (après une retouche à la main). */
export function refresh() {
  for (const e of Object.values(index())) {
    const s = parseArtFile(readFileSync(path.join(LIBRARY, e.file), 'utf8'), e.file)
    Object.assign(e, { colors: colorsOf(s), bytes: Buffer.byteLength(s) })
  }
  arts.clear()
  saveIndex()
}

/** Écrit index.json (trié par id). */
export function saveIndex() {
  const idx = index()
  const sorted = Object.fromEntries(Object.keys(idx).sort().map((k) => [k, idx[k]]))
  mkdirSync(LIBRARY, { recursive: true })
  writeFileSync(INDEX(), JSON.stringify(sorted, null, 1) + '\n')
  cache = sorted
}

/**
 * Contrôle toute la bibliothèque : chaque entrée a son fichier, chaque fichier son entrée, chaque dessin est valide.
 * Retourne la liste des problèmes (vide = tout va bien).
 */
export function check() {
  const issues = [], idx = index(), seen = new Set()
  for (const [id, e] of Object.entries(idx)) {
    if (!ID_RE.test(id)) issues.push(`${id} : id invalide`)
    const f = path.join(LIBRARY, e.file)
    if (!existsSync(f)) { issues.push(`${id} : fichier ${e.file} manquant`); continue }
    seen.add(e.file)
    try {
      const text = readFileSync(f, 'utf8')
      if (e.kind === 'scene') validateScene(text, id)
      else if (e.kind === 'pose') validatePose(text, id)
      else validateArt(parseArtFile(text, e.file), id)
    } catch (err) { issues.push(err.message) }
  }
  for (const cat of existsSync(LIBRARY) ? readdirSync(LIBRARY, { withFileTypes: true }).filter((d) => d.isDirectory()) : [])
    for (const f of readdirSync(path.join(LIBRARY, cat.name)).filter((x) => x.endsWith('.svg')))
      if (!seen.has(`${cat.name}/${f}`)) issues.push(`${cat.name}/${f} : absent de index.json`)
  return issues
}
