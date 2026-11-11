// Aperçu rapide d'un SVG animé, SANS rendu vidéo : planche des instants clés + audit Reels (≈ 2 s par fichier).
import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
import { analyse } from './audit.mjs'
import { fitViewport, seek, setupPage, visibleActors, visibleTexts } from './page-fns.mjs'

/**
 * items : [{ svgFile, duration, keyTimes, sheet }] ; sheet = chemin du JPG de planche.
 * Retourne [{ svgFile, sheet, issues }].
 */
export async function previewSvgs(items) {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] })
  const out = []
  try {
    for (const it of items) {
      const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
      const errors = []
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      await page.goto('file://' + path.resolve(it.svgFile))
      await page.evaluate(setupPage)
      await page.evaluate(fitViewport, null)
      const shots = []
      for (const [k, t] of it.keyTimes.entries()) {
        await page.evaluate(seek, t)
        const p = `${it.sheet}._${k}.png`
        await page.screenshot({ path: p })
        shots.push(p)
      }
      if (shots.length) {
        execFileSync('ffmpeg', ['-v', 'error', '-y', ...shots.flatMap((s) => ['-i', s]), '-filter_complex',
          shots.map((_, i) => `[${i}]scale=360:-2[s${i}]`).join(';') + ';' + shots.map((_, i) => `[s${i}]`).join('') + (shots.length > 1 ? `hstack=${shots.length}` : 'null'),
          '-q:v', '3', it.sheet])
        shots.forEach((s) => rmSync(s))
      }
      const samples = []
      for (let t = 0; t < it.duration; t += 0.25) {
        await page.evaluate(seek, t)
        samples.push({ t, texts: await page.evaluate(visibleTexts), actors: await page.evaluate(visibleActors) })
      }
      const a = analyse(samples, { width: 1080, height: 1920, duration: it.duration })
      await page.close()
      out.push({ svgFile: it.svgFile, sheet: it.sheet, issues: [...a.issues, ...errors.map((e) => `erreur console : ${e}`)] })
    }
  } finally {
    await browser.close()
  }
  return out
}
