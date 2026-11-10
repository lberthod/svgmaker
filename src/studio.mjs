// svgMaker Studio : petit serveur local (aucune dépendance) qui affiche les projets de SVG animés,
// leurs vidéos, couvertures, aperçus et audits, et permet de lancer un rendu.
//   svgmaker studio [--port 4321]
// Projets : studio.json à la racine de svgMaker (créé au premier lancement).
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const CONFIG = path.join(ROOT, 'studio.json')
const DEFAULT = {
  projects: [
    {
      id: 'kids-english-th',
      name: 'Anglais pour enfants · Thaïlande',
      dir: 'examples/kids-english-th',
      kind: 'kids-series',
      description: '5 mots d’anglais par vidéo, voix anglaise + thaïe, pour enfants de 4 ans',
    },
  ],
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.wav': 'audio/wav', '.webm': 'video/webm',
}

function loadConfig() {
  if (!existsSync(CONFIG)) writeFileSync(CONFIG, JSON.stringify(DEFAULT, null, 2) + '\n')
  const c = JSON.parse(readFileSync(CONFIG, 'utf8'))
  for (const p of c.projects) p.abs = path.resolve(ROOT, p.dir)
  return c
}

const readJson = async (f) => JSON.parse(await readFile(f, 'utf8').catch(() => 'null'))
const exists = (f) => stat(f).then((s) => s, () => null)

// ---------------------------------------------------------------- inventaire d'un projet
async function listItems(p) {
  return p.kind === 'kids-series' ? listKids(p) : listGeneric(p)
}

/** Série « kids-english-th » : un thème JSON = une vidéo dans out/<id>/. */
async function listKids(p) {
  const themesDir = path.join(p.abs, 'themes')
  const files = (await readdir(themesDir).catch(() => [])).filter((f) => f.endsWith('.json')).sort()
  return Promise.all(files.map(async (f) => {
    const t = await readJson(path.join(themesDir, f))
    const id = f.replace(/\.json$/, '')
    const o = (x) => path.join('out', id, x)
    const [svg, mp4, cover, preview, art, audio] = await Promise.all(
      [`${id}.svg`, `${id}.mp4`, `${id}-cover.jpg`, `${id}-preview.jpg`, `${id}-art.jpg`, 'audio.wav'].map((x) => exists(path.join(p.abs, o(x)))),
    )
    const audit = (await readJson(path.join(p.abs, 'out', id, 'svgmaker-audit.json')))?.files?.[id] ?? null
    const manifest = (await readJson(path.join(p.abs, 'out', id, '.svgmaker.json')))?.files?.[id] ?? null
    const tStat = await exists(path.join(themesDir, f))
    return {
      id,
      title: t?.theme?.en ?? id,
      subtitle: t?.theme?.th ?? '',
      words: (t?.words ?? []).map((w) => ({ en: w.en, th: w.th, say: w.say, color: w.color })),
      files: {
        svg: svg && o(`${id}.svg`), mp4: mp4 && o(`${id}.mp4`), cover: cover && o(`${id}-cover.jpg`),
        preview: preview && o(`${id}-preview.jpg`), art: art && o(`${id}-art.jpg`), audio: audio && o('audio.wav'), theme: path.join('themes', f),
      },
      duration: manifest?.duration ?? null,
      size: mp4?.size ?? null,
      renderedAt: mp4 ? mp4.mtime : null,
      // vidéo périmée : le thème a été modifié après le rendu
      stale: !!(mp4 && tStat && tStat.mtimeMs > mp4.mtimeMs),
      issues: audit?.issues ?? null,
    }
  }))
}

/** Projet quelconque : tous les .svg, avec MP4/couverture voisins éventuels. */
async function listGeneric(p) {
  const out = []
  const walk = async (dir, depth) => {
    if (depth > 4) return
    for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
      if (e.name.startsWith('.') || ['node_modules', 'dist', 'build'].includes(e.name)) continue
      const abs = path.join(dir, e.name)
      if (e.isDirectory()) await walk(abs, depth + 1)
      else if (e.name.endsWith('.svg')) out.push(abs)
    }
  }
  await walk(p.abs, 0)
  return Promise.all(out.sort().map(async (abs) => {
    const base = abs.replace(/\.svg$/, ''), rel = (x) => path.relative(p.abs, x)
    const [mp4, cover, sheet] = await Promise.all([`${base}.mp4`, `${base}-cover.jpg`, `${base}-planche.jpg`].map(exists))
    const name = path.basename(base)
    const audit = (await readJson(path.join(path.dirname(abs), 'svgmaker-audit.json')))?.files?.[name] ?? null
    return {
      id: rel(base), title: name, subtitle: path.relative(p.abs, path.dirname(abs)) || '', words: [],
      files: { svg: rel(abs), mp4: mp4 && rel(`${base}.mp4`), cover: cover && rel(`${base}-cover.jpg`), preview: sheet && rel(`${base}-planche.jpg`) },
      duration: null, size: mp4?.size ?? null, renderedAt: mp4 ? mp4.mtime : null, stale: false, issues: audit?.issues ?? null,
    }
  }))
}

// ---------------------------------------------------------------- rendus lancés depuis l'interface
const jobs = new Map() // clé projet:item → { state, log, started, ended }

function startRender(p, item) {
  const key = `${p.id}:${item.id}`
  if (jobs.get(key)?.state === 'running') return jobs.get(key)
  const job = { state: 'running', log: '', started: Date.now(), ended: null }
  jobs.set(key, job)
  let cmd, args
  if (p.kind === 'kids-series') {
    cmd = 'bash'
    args = [path.join(p.abs, 'build.sh'), path.join(p.abs, item.files.theme)]
  } else {
    cmd = process.execPath
    args = [path.join(ROOT, 'bin', 'svgmaker.mjs'), 'render', path.join(p.abs, item.files.svg), '--audit']
  }
  const child = spawn(cmd, args, { cwd: p.abs })
  const add = (d) => { job.log = (job.log + d).slice(-6000) }
  child.stdout.on('data', add)
  child.stderr.on('data', add)
  child.on('close', (code) => { job.state = code ? 'error' : 'done'; job.ended = Date.now() })
  return job
}

// ---------------------------------------------------------------- HTTP
function sendFile(req, res, file) {
  const st = statSync(file)
  const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range)
  if (range) {
    const start = range[1] ? +range[1] : 0
    const end = range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
    return createReadStream(file, { start, end }).pipe(res)
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' })
  createReadStream(file).pipe(res)
}

const json = (res, data, code = 200) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)) }

export function startStudio({ port = 4321 } = {}) {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x')
      const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent)
      const cfg = loadConfig()
      const project = (id) => cfg.projects.find((p) => p.id === id)

      // toute adresse hors /api et /files affiche l'interface (évite un 404 sur /fr/, /index.html…)
      if (parts[0] !== 'api' && parts[0] !== 'files')
        return sendFile(req, res, path.join(ROOT, 'studio', 'index.html'))
      if (parts[0] === 'api' && parts[1] === 'projects' && parts.length === 2)
        return json(res, await Promise.all(cfg.projects.map(async (p) => {
          const items = await listItems(p)
          return { id: p.id, name: p.name, description: p.description ?? '', count: items.length, rendered: items.filter((i) => i.files.mp4).length }
        })))
      if (parts[0] === 'api' && parts[1] === 'projects' && parts[3] === 'items') {
        const p = project(parts[2])
        if (!p) return json(res, { error: 'projet inconnu' }, 404)
        const items = await listItems(p)
        for (const i of items) i.job = jobs.get(`${p.id}:${i.id}`) ?? null
        return json(res, items)
      }
      if (parts[0] === 'api' && parts[1] === 'render' && req.method === 'POST') {
        const p = project(url.searchParams.get('project'))
        const item = p && (await listItems(p)).find((i) => i.id === url.searchParams.get('item'))
        if (!item) return json(res, { error: 'introuvable' }, 404)
        return json(res, startRender(p, item))
      }
      if (parts[0] === 'files') {
        const p = project(parts[1])
        if (!p) return json(res, { error: 'projet inconnu' }, 404)
        const file = path.resolve(p.abs, parts.slice(2).join('/'))
        if (!file.startsWith(p.abs + path.sep) || !existsSync(file)) return json(res, { error: 'fichier introuvable' }, 404)
        return sendFile(req, res, file)
      }
      json(res, { error: 'introuvable' }, 404)
    } catch (e) {
      json(res, { error: e.message }, 500)
    }
  })
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)))
}
