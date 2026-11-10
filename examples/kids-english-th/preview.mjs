// Aperçu rapide d'un ou plusieurs thèmes, SANS rendu vidéo (1 seul Chromium, ~2 s par thème) :
//   node preview.mjs themes/001-farm-animals.json […]
//   → out/<id>/<id>.svg + out/<id>/<id>-preview.jpg (intro, 5 cartes, récap côte à côte)
//   → out/<id>/<id>-art.jpg (les 5 dessins en grand, pour juger le dessin)
// Imprime aussi l'audit svgMaker (zones sûres, textes coupés, superpositions…).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { chromium } from '../../node_modules/playwright/index.mjs'
import { analyse } from '../../src/audit.mjs'
import { fitViewport, seek, setupPage, visibleTexts } from '../../src/page-fns.mjs'
import { build, validate } from './make.mjs'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const files = process.argv.slice(2)
if (!files.length) { console.error('usage : node preview.mjs themes/<id>.json…'); process.exit(1) }

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] })
let bad = 0
for (const file of files) {
  let t
  try { t = validate(JSON.parse(readFileSync(file, 'utf8')), path.basename(file)) } catch (e) { bad++; console.error(`✗ ${e.message}`); continue }
  const { svg, cues } = build(t)
  const dir = path.join(HERE, 'out', t.id)
  mkdirSync(dir, { recursive: true })
  const svgFile = path.join(dir, `${t.id}.svg`)
  writeFileSync(svgFile, svg)
  // n'écrase cues.json que s'il change (sinon build.sh croirait les voix périmées et les referait)
  const cf = path.join(dir, 'cues.json'), cj = JSON.stringify(cues, null, 2)
  if (!existsSync(cf) || readFileSync(cf, 'utf8') !== cj) writeFileSync(cf, cj)

  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('file://' + svgFile)
  await page.evaluate(setupPage)
  await page.evaluate(fitViewport, null)

  // images clés
  const times = [3.5, ...cues.sceneStarts.map((s) => s + 4.6), cues.duration - 0.3]
  const shots = []
  for (const [k, s] of times.entries()) {
    await page.evaluate(seek, s)
    const p = path.join(dir, `_p${k}.png`)
    await page.screenshot({ path: p })
    shots.push(p)
  }
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...shots.flatMap((s) => ['-i', s]), '-filter_complex',
    shots.map((_, i) => `[${i}]scale=360:-2[s${i}]`).join(';') + ';' + shots.map((_, i) => `[s${i}]`).join('') + `hstack=${shots.length}`,
    '-q:v', '3', path.join(dir, `${t.id}-preview.jpg`)])
  // dessins en grand (zone carte recadrée)
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...shots.slice(1, 6).flatMap((s) => ['-i', s]), '-filter_complex',
    shots.slice(1, 6).map((_, i) => `[${i}]crop=760:1120:160:300,scale=380:-2[s${i}]`).join(';') + ';' + [0, 1, 2, 3, 4].map((i) => `[s${i}]`).join('') + 'hstack=5',
    '-q:v', '3', path.join(dir, `${t.id}-art.jpg`)])
  shots.forEach((s) => rmSync(s))

  // audit (4 échantillons / s)
  const samples = []
  for (let s = 0; s < cues.duration; s += 0.25) {
    await page.evaluate(seek, s)
    samples.push({ t: s, texts: await page.evaluate(visibleTexts) })
  }
  const a = analyse(samples, { width: 1080, height: 1920, duration: cues.duration })
  await page.close()
  const issues = [...a.issues, ...errors.map((e) => `erreur console : ${e}`)]
  if (issues.length) bad++
  console.log(`${issues.length ? '⚠' : '✓'} ${t.id} · aperçu out/${t.id}/${t.id}-preview.jpg${issues.map((i) => `\n    ⚠ ${i}`).join('')}`)
}
await browser.close()
process.exit(bad ? 1 : 0)
