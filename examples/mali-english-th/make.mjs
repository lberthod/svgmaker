// node make.mjs <thème>  → out/<thème>/mali-<thème>.svg + script.json
// Lit out/<thème>/voice.json s'il existe (sortie d'audio.py) pour la synchronisation labiale exacte.
// Pipeline complet : ./build.sh <thème>
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { build, validateTheme } from './engine.mjs'

const id = process.argv[2]
if (!id) {
  console.error('usage : node make.mjs <thème>   (fichiers dans themes/)')
  process.exit(1)
}
const theme = validateTheme((await import(`./themes/${id}.mjs`)).default, id)

const dir = new URL(`./out/${id}/`, import.meta.url)
mkdirSync(dir, { recursive: true })
const vf = new URL('voice.json', dir)
const voice = existsSync(vf) ? JSON.parse(readFileSync(vf, 'utf8')) : {}
const { svg, script, info } = build(theme, voice)
writeFileSync(new URL(`mali-${id}.svg`, dir), svg)
writeFileSync(new URL('script.json', dir), JSON.stringify(script, null, 2))
console.log(`out/${id}/mali-${id}.svg · ${info.duration} s · ${info.lines} répliques · ${info.sfx} bruitages · ${info.camera} mouvements de caméra · ${info.lipsync ? 'synchro labiale réelle' : 'bouche estimée'}`)
