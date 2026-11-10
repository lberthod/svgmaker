// Registre des formats de svgkit : un brief JSON (champ « format ») → SVG animé + script audio.
//
//   svgmaker new <brief.json>      → <dossier du brief>/out/<id>/<id>.svg (+ script.json)
//   svgmaker preview <brief.json>  → même chose + planche <id>-preview.jpg + audit, sans rendu vidéo
//
// Chaque format exporte { name, description, validate(brief), build(brief, voice) → { svg, script, duration, keyTimes } }
// et documente son brief dans src/formats/<nom>/STYLE.md, avec des exemples dans src/formats/<nom>/examples/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import * as carton from './carton/format.mjs'
import * as minifilm from './minifilm/format.mjs'
import * as quiz from './quiz/format.mjs'

export const FORMATS = { carton, quiz, minifilm }

export function formatOf(brief) {
  const fm = FORMATS[brief?.format]
  if (!fm) throw new Error(`${brief?.id ?? 'brief'} : format « ${brief?.format} » inconnu (${Object.keys(FORMATS).join(', ')})`)
  return fm
}

export const readBrief = (file) => {
  try { return JSON.parse(readFileSync(file, 'utf8')) } catch (e) { throw new Error(`${file} : JSON illisible (${e.message})`) }
}

/** Valide puis construit un brief. voice = contenu de voice.json (durées et enveloppes réelles des voix). */
export function buildBrief(brief, voice = {}) {
  const fm = formatOf(brief)
  fm.validate(brief)
  return fm.build(brief, voice)
}

/**
 * Écrit le SVG et script.json d'un brief. Relit voice.json s'il existe dans le dossier de sortie
 * (second passage après audio.py : minutage et bouche calés sur les vraies voix).
 * Retourne { dir, svgFile, ...résultat de build }.
 */
export function writeBrief(file, { outDir } = {}) {
  const brief = readBrief(file)
  const dir = path.resolve(outDir ?? path.join(path.dirname(file), 'out', brief.id ?? 'sans-id'))
  const vf = path.join(dir, 'voice.json')
  const voice = existsSync(vf) ? JSON.parse(readFileSync(vf, 'utf8')) : {}
  const r = buildBrief(brief, voice)
  mkdirSync(dir, { recursive: true })
  const svgFile = path.join(dir, `${brief.id}.svg`)
  writeFileSync(svgFile, r.svg)
  // n'écrase script.json que s'il change (audio.py ne refait alors les voix que si nécessaire)
  const sf = path.join(dir, 'script.json'), sj = JSON.stringify(r.script, null, 2)
  if (!existsSync(sf) || readFileSync(sf, 'utf8') !== sj) writeFileSync(sf, sj)
  return { dir, svgFile, brief, voiced: Object.keys(voice).length > 0, ...r }
}
