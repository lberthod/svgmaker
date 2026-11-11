// Format « dialogue » : accès tolérant aux dessins. Un id absent de library/ donne un cadre de remplacement
// et un avertissement (info.warnings), jamais une erreur : on peut tester avant que les dessins existent.
import { esc, validateArt } from '../../kit/core.mjs'
import { art as libArt, hasArt } from '../../kit/library.mjs'

const toPart = (s) => s.replace(/(\s)id="([^"]+)"/g, '$1data-part="$2"')

export function createArts(warnings) {
  const warned = new Set()
  const warn = (k, m) => { if (!warned.has(k)) { warned.add(k); warnings.push(m) } }
  const api = {
    has: (id) => typeof id === 'string' && hasArt(id),
    /** SVG du dessin (parties animables en data-part), ou cadre de remplacement. */
    svg(id, { color = '#FFC93C', where = '' } = {}) {
      if (api.has(id)) {
        try { return validateArt(toPart(libArt(id)), id) && toPart(libArt(id)) } catch (e) { warn(`bad:${id}`, `dessin « ${id} » invalide (${e.message}) : remplacé`) }
      } else warn(`miss:${id}`, `dessin « ${id} »${where ? ` (${where})` : ''} absent de library/ : cadre de remplacement (svgmaker art list)`)
      return `<rect x="-200" y="-200" width="400" height="400" rx="50" fill="${color}" fill-opacity=".18" stroke="${color}" stroke-width="10" stroke-dasharray="30 20"/><path d="M -200 -200 L 200 200 M 200 -200 L -200 200" stroke="${color}" stroke-width="6" opacity=".45"/><text class="en" x="0" y="16" text-anchor="middle" font-size="56" fill="#fff" stroke="#141B2D" stroke-width="9">${esc(id ?? '?')}</text>`
    },
    /** Noms des parties animables (data-part ou id) d'un dessin. */
    parts(id) {
      if (!api.has(id)) return []
      return [...new Set([...toPart(libArt(id)).matchAll(/data-part="([^"]+)"/g)].map((m) => m[1]))]
    },
  }
  return api
}
