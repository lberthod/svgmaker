import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, readFile, rm, rmdir, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { chromium } from 'playwright'
import { analyse } from './audit.mjs'
import * as ff from './ffmpeg.mjs'
import { fitViewport, seek, setupPage, visibleTexts } from './page-fns.mjs'

export const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version
export const DEFAULT_JOBS = Math.max(1, Math.min(6, Math.floor(os.cpus().length / 3)))

const BROWSER_ARGS = ['--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none', '--disable-lcd-text']
const even = (n) => Math.max(2, Math.round(n / 2) * 2)

// ---------------------------------------------------------------- travailleurs
class Worker {
  constructor(id) { this.id = id; this.browser = null; this.cur = null }

  async start() {
    this.browser = await chromium.launch({ args: BROWSER_ARGS })
  }

  async close() {
    await this.cur?.page.close().catch(() => {})
    await this.browser?.close().catch(() => {})
  }

  /** Ouvre (ou réutilise) une page prête à être capturée pour ce fichier. */
  async open(file, { width, height, bg } = {}) {
    const key = `${file}|${width}x${height}|${bg}`
    if (this.cur?.key === key) return this.cur
    await this.cur?.page.close().catch(() => {})
    const page = await this.browser.newPage({ viewport: { width: width ?? 1080, height: height ?? 1920 }, deviceScaleFactor: 1 })
    await page.goto('file://' + file, { waitUntil: 'load' })
    const info = await page.evaluate(setupPage)
    if (width) await page.evaluate(fitViewport, bg ?? null)
    const cdp = await page.context().newCDPSession(page)
    this.cur = { key, page, cdp, info }
    return this.cur
  }

  async shot(quality) {
    const r = await this.cur.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality, optimizeForSpeed: true })
    return Buffer.from(r.data, 'base64')
  }
}

async function pool(workers, queue, handle) {
  await Promise.all(
    workers.map(async (w) => {
      for (let job = queue.shift(); job; job = queue.shift()) await handle(w, job)
    }),
  )
}

// ---------------------------------------------------------------- utilitaires
export async function collectSvgs(inputs, recursive) {
  const { readdir } = await import('node:fs/promises')
  const out = []
  const walk = async (dir, depth) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name)
      if (e.isDirectory() && (recursive && !e.name.startsWith('.') && e.name !== 'node_modules')) await walk(p, depth + 1)
      else if (e.isFile() && e.name.toLowerCase().endsWith('.svg')) out.push(p)
    }
  }
  for (const i of inputs) {
    const p = path.resolve(i)
    const s = await stat(p).catch(() => null)
    if (!s) throw new Error(`introuvable : ${i}`)
    if (s.isDirectory()) await walk(p, 0)
    else out.push(p)
  }
  return [...new Set(out)].sort()
}

function hashOf(svgBuf, opts) {
  const h = createHash('sha1').update(svgBuf).update(VERSION)
  const keys = ['fps', 'crf', 'preset', 'quality', 'size', 'duration', 'bg', 'musicVolume', 'loudnorm', 'gif', 'cover', 'coverAt']
  h.update(JSON.stringify(keys.map((k) => opts[k])))
  if (opts.music) {
    const s = existsSync(opts.music) ? readFileSync(opts.music) : ''
    h.update(createHash('sha1').update(s).digest('hex'))
  }
  return h.digest('hex')
}

class Manifest {
  constructor(dir, name = '.svgmaker.json') { this.file = path.join(dir, name); this.chain = Promise.resolve(); this.data = null }
  async load() {
    if (!this.data) this.data = JSON.parse(await readFile(this.file, 'utf8').catch(() => '{"files":{}}'))
    return this.data
  }
  set(name, entry) {
    this.chain = this.chain.then(async () => {
      await this.load()
      this.data.files[name] = entry
      await writeFile(this.file, JSON.stringify(this.data, null, 2) + '\n')
    })
    return this.chain
  }
}

// ---------------------------------------------------------------- rendu
/**
 * opts : { outDir, fps, jobs, crf, preset, quality, size, duration, bg, music, musicVolume, loudnorm,
 *          gif, cover, coverAt, audit, sheet, force, dedup, probeOnly }
 */
export async function renderAll(files, opts, log = console.log) {
  const t0 = performance.now()
  const manifests = new Map()
  const manifestFor = (dir) => { if (!manifests.has(dir)) manifests.set(dir, new Manifest(dir)); return manifests.get(dir) }
  const audits = new Map()
  const auditFor = (dir) => { if (!audits.has(dir)) audits.set(dir, new Manifest(dir, 'svgmaker-audit.json')); return audits.get(dir) }

  // 1) tri incrémental -------------------------------------------------------
  const tasks = []
  let skipped = 0
  for (const file of files) {
    const outDir = opts.outDir ? path.resolve(opts.outDir) : path.dirname(file)
    const base = path.basename(file, path.extname(file))
    const out = path.join(outDir, base + '.mp4')
    const buf = await readFile(file)
    // musique propre au fichier : <svg data-music="audio.wav"> (chemin relatif au SVG), prioritaire sur --music
    const dm = /<svg\b[^>]*\sdata-music="([^"]+)"/.exec(buf.toString('utf8', 0, 4096))
    const music = dm ? path.resolve(path.dirname(file), dm[1]) : opts.music
    if (dm && !existsSync(music)) { log(`✗ ${base} : data-music introuvable (${dm[1]})`); continue }
    const hash = hashOf(buf, { ...opts, music })
    const m = manifestFor(outDir)
    const prev = (await m.load()).files[base]
    if (!opts.force && !opts.probeOnly && !opts.auditOnly && prev?.hash === hash && existsSync(out)) { skipped++; continue }
    tasks.push({ file, base, outDir, out, hash, music, manifest: m, audit_store: auditFor(outDir) })
  }
  if (skipped) log(`= ${skipped} fichier(s) déjà à jour (empreinte identique), ignoré(s). --force pour tout refaire.`)
  if (!tasks.length) return { results: [], skipped, failed: 0 }

  const jobs = Math.max(1, Math.min(opts.jobs || DEFAULT_JOBS, 32))
  const workers = Array.from({ length: Math.min(jobs, Math.max(tasks.length, jobs)) }, (_, i) => new Worker(i))
  await Promise.all(workers.map((w) => w.start()))
  const results = []
  let failed = 0
  try {
    // 2) sondage --------------------------------------------------------------
    await pool(workers.slice(0, Math.min(workers.length, tasks.length)), [...tasks], async (w, t) => {
      try {
        const { info } = await w.open(t.file)
        t.info = info
        const [sw, sh] = opts.size ? opts.size.split('x').map(Number) : [info.width, info.height]
        t.width = even(sw); t.height = even(sh)
        t.fps = opts.fps || info.fps || 30
        t.duration = opts.duration || info.duration
        if (!(t.duration > 0)) throw new Error('durée introuvable : ajoute data-duration="…" sur <svg> ou --duration')
        t.frames = Math.max(1, Math.round(t.duration * t.fps))
      } catch (e) { t.error = e }
    })
    for (const t of tasks.filter((t) => t.error)) { failed++; log(`✗ ${t.base} : ${t.error.message}`) }
    const ok = tasks.filter((t) => !t.error)

    if (opts.probeOnly) {
      for (const t of ok) results.push({ file: t.file, ...t.info, width: t.width, height: t.height, fps: t.fps, frames: t.frames, duration: t.duration })
      return { results, skipped, failed }
    }

    // 3) découpage en segments (équilibrage : longs fichiers d'abord) ---------------
    const perFile = Math.max(1, Math.ceil(workers.length / Math.max(1, ok.length)))
    const queue = []
    for (const t of [...ok].sort((a, b) => b.frames - a.frames)) {
      t.tmp = path.join(t.outDir, '.svgmaker-tmp', `${t.base}-${t.hash.slice(0, 8)}`)
      await mkdir(t.tmp, { recursive: true })
      t.segs = []
      t.reused = 0
      t.started = performance.now()
      const n = opts.auditOnly ? 0 : Math.min(perFile, Math.ceil(t.frames / 30))
      const len = Math.ceil(t.frames / Math.max(1, n))
      for (let k = 0; k < n; k++) {
        const seg = { task: t, from: k * len, to: Math.min(t.frames, (k + 1) * len), file: path.join(t.tmp, `seg${String(k).padStart(3, '0')}.ts`) }
        if (seg.from < seg.to) { t.segs.push(seg); queue.push(seg) }
      }
      t.pending = t.segs.length
      if (opts.audit || opts.sheet || opts.auditOnly) { t.pending++; queue.push({ task: t, extras: true }) }
    }

    const finals = []
    const done = (t) => {
      if (--t.pending > 0 || t.error) return
      finals.push(finish(t, opts, log).then((r) => results.push(r), (e) => { failed++; t.error = e; log(`✗ ${t.base} : ${e.message}`) }))
    }

    await pool(workers, queue, async (w, job) => {
      const t = job.task
      if (t.error) return
      t.firstStart ??= performance.now()
      try {
        const page = await w.open(t.file, { width: t.width, height: t.height, bg: opts.bg })
        if (job.extras) await extras(w, page, t, opts)
        else {
          const enc = ff.segmentEncoder(job.file, { fps: t.fps, width: t.width, height: t.height, crf: opts.crf, preset: opts.preset })
          // chauffe : la 1re capture après un seek lointain peut être périmée
          await page.page.evaluate(seek, job.from / t.fps)
          await w.shot(opts.quality)
          let lastSig = null, lastBuf = null
          for (let i = job.from; i < job.to; i++) {
            const sig = await page.page.evaluate(seek, i / t.fps)
            let buf
            if (opts.dedup && sig !== null && sig === lastSig && lastBuf) { buf = lastBuf; t.reused++ } else buf = await w.shot(opts.quality)
            lastSig = sig; lastBuf = buf
            await enc.write(buf)
          }
          await enc.end()
        }
        done(t)
      } catch (e) {
        if (!t.error) { t.error = e; failed++; log(`✗ ${t.base} : ${e.message}`) }
      }
    })
    await Promise.all(finals)
  } finally {
    await Promise.all(workers.map((w) => w.close()))
  }
  const secs = (performance.now() - t0) / 1000
  return { results, skipped, failed, secs }
}

async function extras(w, page, t, opts) {
  if (opts.audit || opts.auditOnly) {
    const samples = []
    for (let s = 0; s < t.duration; s += 0.25) {
      await page.page.evaluate(seek, s)
      samples.push({ t: s, texts: await page.page.evaluate(visibleTexts) })
    }
    t.audit = analyse(samples, { width: t.width, height: t.height, duration: t.duration, minFinal: opts.minFinal ?? 2.8 })
  }
  if (opts.sheet) {
    const shots = []
    for (const [k, f] of [0.04, 0.2, 0.4, 0.6, 0.8, 0.97].entries()) {
      await page.page.evaluate(seek, f * t.duration)
      await w.shot(90)
      const p = path.join(t.tmp, `sheet${k}.jpg`)
      await writeFile(p, await w.shot(90))
      shots.push(p)
    }
    t.sheetFile = path.join(t.outDir, `${t.base}-planche.jpg`)
    await ff.sheet(shots, t.sheetFile)
  }
}

async function finish(t, opts, log) {
  const files = []
  if (!opts.auditOnly) {
    await ff.finalize({
      segments: t.segs.map((s) => s.file), listFile: path.join(t.tmp, 'list.txt'), out: t.out,
      duration: t.duration, music: t.music, musicVolume: opts.musicVolume ?? 0.55, loudnorm: opts.loudnorm ?? (t.music && opts.musicVolume == null),
    })
    files.push(t.out)
    if (opts.cover) { const c = path.join(t.outDir, `${t.base}-cover.jpg`); await ff.cover(t.out, c, opts.coverAt ?? 0); files.push(c) }
    if (opts.gif) { const g = path.join(t.outDir, `${t.base}.gif`); await ff.gif(t.out, g); files.push(g) }
  }
  if (t.sheetFile) files.push(t.sheetFile)
  await rm(t.tmp, { recursive: true, force: true })
  await rmdir(path.dirname(t.tmp)).catch(() => {}) // supprime .svgmaker-tmp s'il est vide
  const secs = (performance.now() - (t.firstStart ?? t.started)) / 1000
  const size = opts.auditOnly ? 0 : (await stat(t.out)).size
  const r = {
    file: t.file, out: opts.auditOnly ? null : t.out, files, duration: t.duration, fps: t.fps, frames: t.frames,
    width: t.width, height: t.height, secs, size, reused: t.reused, audit: t.audit ?? null,
  }
  if (!opts.auditOnly) {
    await t.manifest.set(t.base, {
      hash: t.hash, svg: path.relative(t.outDir, t.file), duration: t.duration, fps: t.fps, frames: t.frames,
      size: `${t.width}x${t.height}`, audio: t.music ? path.relative(t.outDir, t.music) : false, renderedAt: new Date().toISOString(), tool: `svgmaker ${VERSION}`,
    })
  }
  const parts = [`${t.duration.toFixed(1)} s`, `${t.width}×${t.height} ${t.fps} i/s`]
  if (!opts.auditOnly) parts.push(`${t.frames} img en ${secs.toFixed(1)} s (${(t.frames / secs).toFixed(0)} img/s)`, `${(size / 1e6).toFixed(2)} Mo`)
  if (t.reused) parts.push(`${Math.round((t.reused / t.frames) * 100)} % d'images réutilisées`)
  log(`✓ ${t.base}  ${parts.join(' · ')}`)
  if (t.audit) {
    if (!t.audit.issues.length) log('    audit : OK')
    for (const i of t.audit.issues.slice(0, 8)) log(`    ⚠ ${i}`)
    if (t.audit.issues.length > 8) log(`    … +${t.audit.issues.length - 8} autre(s), voir svgmaker-audit.json`)
    await t.audit_store.set(t.base, { svg: path.relative(t.outDir, t.file), checkedAt: new Date().toISOString(), ...t.audit })
  }
  return r
}
