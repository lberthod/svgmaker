import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { analyse } from '../src/audit.mjs'
import { collectSvgs, renderAll } from '../src/render.mjs'

const here = path.dirname(new URL(import.meta.url).pathname)
const demo = path.join(here, '..', 'examples', 'demo-9x16.svg')
const box = (s, x0, y0, x1, y1, extra = {}) => ({ s, x0, y0, x1, y1, fs: 60, role: '', ...extra })
const quiet = () => {}

test('audit : un texte immobile hors zone sûre est signalé, un texte en mouvement non', () => {
  const still = box('LOGO', 400, 1600, 680, 1660)
  const samples = [0, 0.25, 0.5].map((t) => ({ t, texts: [still, box('VOL', 100 + t * 2000, 800, 300 + t * 2000, 860)] }))
  const r = analyse(samples, { width: 1080, height: 1920, duration: 1 })
  assert.ok(r.issues.some((i) => i.includes('LOGO') && i.includes('zone sûre du bas')))
  assert.ok(!r.issues.some((i) => i.includes('VOL')))
})

test('audit : accroche tardive et carton final trop court', () => {
  const samples = []
  for (let t = 0; t < 6; t += 0.25) {
    const texts = []
    if (t >= 2) texts.push(box('ACCROCHE', 200, 500, 880, 580, { role: 'hook' }))
    if (t >= 5) texts.push(box('FIN', 300, 1000, 780, 1080, { role: 'final' }))
    samples.push({ t, texts })
  }
  const r = analyse(samples, { width: 1080, height: 1920, duration: 6 })
  assert.ok(r.issues.some((i) => i.includes('accroche lisible trop tard')))
  assert.ok(r.issues.some((i) => i.includes('carton final trop court')))
})

test('audit : un carton final qui s\'efface juste avant la fin (boucle) compte quand même', () => {
  const tirage = (de, a, duree) => {
    const samples = []
    for (let t = 0; t < duree; t += 0.25) samples.push({ t, texts: [box('ACCROCHE', 200, 500, 880, 580, { role: 'hook' }), ...(t >= de && t <= a ? [box('FIN', 300, 1000, 780, 1080, { role: 'final' })] : [])] })
    return analyse(samples, { width: 1080, height: 1920, duration: duree }).issues.filter((i) => i.includes('carton final'))
  }
  assert.equal(tirage(1, 4, 5).length, 0, 'visible 3,25 s puis 0,75 s de retour en boucle : bon')
  assert.equal(tirage(1, 2, 5).length, 1, 'effacé 2,75 s avant la fin : ce n\'est plus un carton final')
})

test('audit : deux lignes d\'un même titre qui se touchent ne sont pas une superposition', () => {
  const a = box('Le piano par', 30, 160, 500, 240), b = box('numéros', 30, 228, 400, 300)
  const samples = [0, 0.25].map((t) => ({ t, texts: [a, b] }))
  assert.equal(analyse(samples, { width: 1080, height: 1920, duration: 0.5 }).issues.filter((i) => i.includes('superposés')).length, 0)
})

test('probe : durée data-duration, taille et animations CSS + SMIL', async () => {
  const { results } = await renderAll([demo], { probeOnly: true, jobs: 1 }, quiet)
  const r = results[0]
  assert.equal(r.duration, 6)
  assert.equal(r.durationSource, 'data-duration')
  assert.equal(`${r.width}x${r.height}`, '1080x1920')
  assert.equal(r.fps, 30)
  assert.ok(r.cssAnimations >= 3 && r.smilAnimations === 1)
})

test('probe : durée détectée sans data-duration (CSS en ms + SMIL)', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'svgm-'))
  const f = path.join(dir, 'x.svg')
  writeFileSync(f, readFileSync(demo, 'utf8').replace(' data-duration="6"', ''))
  const { results } = await renderAll([f], { probeOnly: true, jobs: 1 }, quiet)
  assert.equal(results[0].durationSource, 'animations')
  assert.ok(Math.abs(results[0].duration - 3.5) < 0.01, `durée ${results[0].duration}`) // .final : 3 s + 0,5 s
})

test('rendu : MP4 conforme, couverture, manifeste, puis saut incrémental', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'svgm-'))
  const f = path.join(dir, 'demo.svg')
  // variante CSS seule : la réutilisation des images fixes n'est active que sans SMIL
  writeFileSync(f, readFileSync(demo, 'utf8').replace(/<animate [^>]*\/>/, ''))
  const opts = { jobs: 2, crf: 23, preset: 'veryfast', quality: 85, cover: true, dedup: true, audit: true }
  const r1 = await renderAll([f], opts, quiet)
  assert.equal(r1.failed, 0)
  const mp4 = path.join(dir, 'demo.mp4')
  assert.ok(existsSync(mp4) && existsSync(path.join(dir, 'demo-cover.jpg')))
  assert.deepEqual(r1.results[0].audit.issues, [])
  const info = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height,r_frame_rate,pix_fmt,color_primaries:format=duration', '-of', 'json', mp4])
  const j = JSON.parse(info)
  assert.equal(j.streams[0].width, 1080)
  assert.equal(j.streams[0].pix_fmt, 'yuv420p')
  assert.equal(j.streams[0].color_primaries, 'bt709')
  assert.equal(j.streams[0].r_frame_rate, '30/1')
  assert.ok(Math.abs(Number(j.format.duration) - 6) < 0.05)
  assert.ok(r1.results[0].reused > 0, 'les images fixes de fin doivent être réutilisées')
  const r2 = await renderAll([f], opts, quiet)
  assert.equal(r2.skipped, 1)
})

test('collectSvgs : dossiers et récursivité', async () => {
  const files = await collectSvgs([path.join(here, '..', 'examples')], false)
  assert.ok(files.some((f) => f.endsWith('demo-9x16.svg')))
})
