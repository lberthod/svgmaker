// node make.mjs <thème>  → out/<thème>/mali-<thème>.svg + script.json
// Lit out/<thème>/voice.json s'il existe (sortie d'audio.py) pour la synchronisation labiale exacte.
// Pipeline complet : ./build.sh <thème>
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { build } from './engine.mjs'

const id = process.argv[2]
if (!id) {
  console.error('usage : node make.mjs <thème>   (fichiers dans themes/)')
  process.exit(1)
}
const theme = (await import(`./themes/${id}.mjs`)).default
if (theme.id !== id) throw new Error(`themes/${id}.mjs déclare id « ${theme.id} »`)
if (theme.words.length !== 5) throw new Error(`le thème doit avoir 5 mots (${theme.words.length})`)
for (const w of theme.words) if (!w.art) throw new Error(`mot « ${w.en} » sans dessin (art)`)

const dir = new URL(`./out/${id}/`, import.meta.url)
mkdirSync(dir, { recursive: true })
const vf = new URL('voice.json', dir)
const voice = existsSync(vf) ? JSON.parse(readFileSync(vf, 'utf8')) : {}
const { svg, script, info } = build(theme, voice)
writeFileSync(new URL(`mali-${id}.svg`, dir), svg)
writeFileSync(new URL('script.json', dir), JSON.stringify(script, null, 2))
console.log(`out/${id}/mali-${id}.svg · ${info.duration} s · ${info.lines} répliques · ${info.sfx} bruitages · ${info.camera} mouvements de caméra · ${info.lipsync ? 'synchro labiale réelle' : 'bouche estimée'}`)
