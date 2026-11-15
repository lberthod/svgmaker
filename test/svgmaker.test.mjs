import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { analyse, coverIssues, pickCover } from '../src/audit.mjs'
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

test('couverture : instant choisi quand le titre ET le bandeau du thème sont lisibles', () => {
  // comme Mali : décor vide à 0 s, accroche à 0,5 s, bulle « Hi! » à 2 s, bandeau du thème à 6 s, puis la 1re scène
  const samples = []
  for (let t = 0; t < 30; t += 0.25) {
    const texts = []
    if (t >= 0.5 && t < 8) texts.push(box('Learn English', 200, 400, 880, 480), box('with Mali!', 200, 500, 880, 600))
    if (t >= 6 && t < 8) texts.push(box('Animals', 130, 660, 950, 770))
    if (t >= 9) texts.push(box('Cat', 300, 300, 780, 460))
    if (t >= 2 && t < 4) texts.push(box('Hi!', 700, 800, 780, 880)) // petite bulle : ne doit pas l'emporter sur le bandeau
    samples.push({ t, texts, actors: t >= 2 ? [{ name: 'mali', x0: 100, y0: 900, x1: 700, y1: 1500 }] : [] })
  }
  assert.equal(pickCover(samples, { width: 1080, height: 1920, duration: 30 }), 6)
  assert.equal(pickCover(samples.map((s) => ({ ...s, texts: [] })), { width: 1080, height: 1920, duration: 30 }), null)
})

test('couverture : alerte si vide, unie ou identique à celle d\'une autre vidéo', () => {
  const sig = Buffer.from(Array.from({ length: 300 }, (_, i) => (i * 37) % 256))
  const flat = Buffer.alloc(300, 200)
  assert.ok(coverIssues({ at: 0, texts: 0, sig }).some((i) => i.includes('trop vide')))
  assert.ok(coverIssues({ at: 1, texts: 2, sig: flat }).some((i) => i.includes('presque unie')))
  const twin = coverIssues({ at: 7, texts: 3, sig }, [{ name: 'mali-colors', sig: Buffer.from(sig) }, { name: 'autre', sig: flat }])
  assert.deepEqual(twin, ['couverture identique à celle de mali-colors : on ne distingue pas les vidéos dans la grille'])
  assert.deepEqual(coverIssues({ at: 7, texts: 3, sig }, [{ name: 'autre', sig: flat }]), [])
})

test('rendu : couverture automatique, data-cover-at et contrôle d\'audit', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'svgm-cover-'))
  // décor identique, titre qui apparaît à 0,6 s ; le titre change d'une vidéo à l'autre
  const svg = (title, attr = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" data-duration="2" data-fps="10"${attr}>
  <style>.t{opacity:0;animation:in .2s linear .6s forwards}@keyframes in{to{opacity:1}}</style>
  <rect width="1080" height="1920" fill="#FFE9EF"/><circle cx="540" cy="1300" r="300" fill="#3DBE5A"/>
  <text class="t" x="540" y="700" text-anchor="middle" font-size="150" font-family="sans-serif" fill="#222">${title}</text></svg>`
  const files = ['animals', 'colors', 'fruits'].map((id) => {
    const d = path.join(root, id)
    execFileSync('mkdir', ['-p', d])
    const f = path.join(d, `mali-${id}.svg`)
    writeFileSync(f, svg(id === 'fruits' ? 'colors' : id.toUpperCase(), id === 'colors' ? ' data-cover-at="0"' : ''))
    return f
  })
  const opts = { jobs: 2, crf: 28, preset: 'ultrafast', quality: 80, cover: true, dedup: true, audit: true, size: '270x480' }
  const r = await renderAll([files[0]], opts, quiet)
  assert.equal(r.failed, 0)
  const a = r.results[0].audit
  assert.ok(a.cover.at >= 0.6 && a.cover.at <= 1, `couverture auto à ${a.cover.at} s`)
  assert.equal(a.cover.texts, 1)
  assert.ok(!a.issues.some((i) => i.includes('couverture')), a.issues.join(' | '))
  const m = JSON.parse(readFileSync(path.join(root, 'animals', '.svgmaker.json'), 'utf8'))
  assert.equal(m.files['mali-animals'].coverAt, a.cover.at)
  // data-cover-at="0" : l'image vide est imposée, l'audit la signale
  const r2 = await renderAll([files[1]], opts, quiet)
  assert.equal(r2.results[0].audit.cover.at, 0)
  assert.ok(r2.results[0].audit.issues.some((i) => i.includes('couverture trop vide')))
  // même lot : deux vidéos au même titre → couverture identique (comparée aussi au dossier voisin)
  writeFileSync(files[0], svg('COLORS'))
  writeFileSync(files[2], svg('COLORS'))
  const r3 = await renderAll([files[0], files[2]], { ...opts, jobs: 1 }, quiet)
  const all = r3.results.flatMap((x) => x.audit.issues)
  assert.ok(all.some((i) => i.includes('couverture identique')), all.join(' | '))
  // svgmaker audit (sans rendu) relit la couverture existante à l'instant noté dans le manifeste
  const r4 = await renderAll([files[1]], { ...opts, auditOnly: true }, quiet)
  assert.ok(r4.results[0].audit.issues.some((i) => i.includes('couverture trop vide')))
})

test('collectSvgs : dossiers et récursivité', async () => {
  const files = await collectSvgs([path.join(here, '..', 'examples')], false)
  assert.ok(files.some((f) => f.endsWith('demo-9x16.svg')))
})
