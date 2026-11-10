#!/usr/bin/env node
// svgmaker : SVG animés (CSS + SMIL) → MP4 / GIF, rendu déterministe image par image.
import path from 'node:path'
import { parseArgs } from 'node:util'
import { DEFAULT_JOBS, VERSION, collectSvgs, renderAll } from '../src/render.mjs'

const HELP = `svgmaker ${VERSION} : rendu de SVG animés (CSS @keyframes + SMIL) en vidéo

Usage
  svgmaker render <fichiers.svg | dossiers>… [options]   MP4 (+ couverture) à côté de chaque SVG
  svgmaker probe  <fichiers | dossiers>…                  durée, taille, animations détectées
  svgmaker audit  <fichiers | dossiers>…                  contrôle Reels (zones sûres, corps, accroche, final)
  svgmaker studio [--port 4321]                           interface web locale (projets, vidéos, rendus)
  svgmaker art    list|check|add …                        bibliothèque de dessins (library/), voir « svgmaker art »
  svgmaker formats                                        formats disponibles (carton, quiz, minifilm)
  svgmaker new     <brief.json>… [-o dossier]             brief → out/<id>/<id>.svg (+ script.json)
  svgmaker preview <brief.json>…                          idem + planche <id>-preview.jpg + audit, sans vidéo

Options de rendu
  -o, --out <dossier>      dossier de sortie (défaut : à côté du SVG)
  -r, --recursive          parcourt les sous-dossiers
  -j, --jobs <n>           navigateurs en parallèle (défaut ${DEFAULT_JOBS})
      --fps <n>            images/s (défaut : data-fps du SVG, sinon 30)
      --size <LxH>         taille de sortie, ex. 1080x1920 (défaut : taille du SVG)
      --duration <s>       force la durée (défaut : data-duration, sinon détectée)
      --crf <n>            qualité x264, plus bas = meilleur (défaut 18)
      --preset <p>         preset x264 (défaut medium)
      --quality <n>        qualité JPEG de capture 1-100 (défaut 92)
      --bg <couleur>       fond derrière le SVG (défaut : celui du SVG / blanc)
      --music <fichier>    piste audio (coupée à la durée, fondus, loudnorm −14 LUFS)
      --music-volume <v>   volume au lieu de loudnorm, ex. 0.55 (désactive loudnorm)
      --gif                produit aussi un GIF (12 i/s, 360 px)
      --no-cover           pas de couverture JPG
      --cover-at <s>       instant de la couverture (défaut 0)
      --audit              audit Reels pendant le rendu
      --sheet              planche de 6 images (<nom>-planche.jpg)
      --no-dedup           capture toutes les images (même les images fixes identiques)
  -f, --force              ignore l'empreinte et refait tout
  -h, --help               cette aide

Dans le SVG (facultatif) : <svg data-duration="14.5" data-fps="30" data-music="audio.wav">, et data-role="hook" / "final"
sur les textes d'accroche et de carton final pour un audit plus précis.`

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: 'string', short: 'o' },
    recursive: { type: 'boolean', short: 'r' },
    jobs: { type: 'string', short: 'j' },
    fps: { type: 'string' },
    size: { type: 'string' },
    duration: { type: 'string' },
    crf: { type: 'string', default: '18' },
    preset: { type: 'string', default: 'medium' },
    quality: { type: 'string', default: '92' },
    bg: { type: 'string' },
    music: { type: 'string' },
    'music-volume': { type: 'string' },
    gif: { type: 'boolean' },
    'no-cover': { type: 'boolean' },
    'cover-at': { type: 'string' },
    audit: { type: 'boolean' },
    sheet: { type: 'boolean' },
    'no-dedup': { type: 'boolean' },
    force: { type: 'boolean', short: 'f' },
    help: { type: 'boolean', short: 'h' },
    port: { type: 'string' },
    cat: { type: 'string' },
    tags: { type: 'string' },
  },
})

/** svgmaker new|preview <brief.json>… : brief d'un format → SVG (+ planche et audit). Retourne le code de sortie. */
async function briefCommand(which, files) {
  if (!files.length) { console.error(`usage : svgmaker ${which} <brief.json>… [-o dossier]`); return 1 }
  const { writeBrief } = await import('../src/formats/index.mjs')
  const built = []
  let bad = 0
  for (const file of files) {
    try {
      const r = writeBrief(file, { outDir: files.length === 1 ? o.out : undefined })
      built.push(r)
      const voice = r.script.lines.length ? ` · ${r.script.lines.length} répliques (${r.voiced ? 'voix réelles' : 'voix estimées : lancer audio.py puis refaire new'})` : ''
      console.log(`✓ ${r.brief.format} · ${path.relative(process.cwd(), r.svgFile)} · ${r.duration} s${voice}`)
    } catch (e) { bad++; console.error(`✗ ${file} : ${e.message}`) }
  }
  if (which === 'preview' && built.length) {
    const { previewSvgs } = await import('../src/preview.mjs')
    const res = await previewSvgs(built.map((r) => ({ svgFile: r.svgFile, duration: r.duration, keyTimes: r.keyTimes, sheet: r.svgFile.replace(/\.svg$/, '-preview.jpg') })))
    for (const x of res) {
      if (x.issues.length) bad++
      console.log(`${x.issues.length ? '⚠' : '✓'} aperçu ${path.relative(process.cwd(), x.sheet)}${x.issues.map((i) => `\n    ⚠ ${i}`).join('')}`)
    }
  }
  return bad ? 1 : 0
}

/** svgmaker art list|check|add : bibliothèque de dessins (library/). Retourne le code de sortie. */
async function artCommand([sub, ...args]) {
  const L = await import('../src/kit/library.mjs')
  const { readFileSync } = await import('node:fs')
  if (sub === 'list') {
    const q = (args[0] ?? '').toLowerCase()
    const rows = Object.entries(L.index())
      .filter(([id, e]) => (!o.cat || e.cat === o.cat) && (!o.tags || o.tags.split(',').every((t) => e.tags.includes(t))) && (!q || id.includes(q)))
    for (const [id, e] of rows) console.log(`${id.padEnd(28)} ${e.cat.padEnd(18)} ${String(e.bytes).padStart(6)} o  ${e.source}`)
    console.log(`→ ${rows.length} dessin(s) sur ${Object.keys(L.index()).length}`)
    return 0
  }
  if (sub === 'refresh') {
    L.refresh()
    console.log(`✓ index.json recalculé (${Object.keys(L.index()).length} dessins)`)
    return 0
  }
  if (sub === 'check') {
    let issues = []
    if (!args.length) issues = L.check()
    for (const f of args) {
      try {
        const text = readFileSync(f, 'utf8')
        const { validateArt } = await import('../src/kit/core.mjs')
        validateArt(text.includes('<!-- art -->') ? L.parseArtFile(text, f) : text, f)
      } catch (e) { issues.push(e.message) }
    }
    for (const i of issues) console.log(`✗ ${i}`)
    console.log(issues.length ? `→ ${issues.length} problème(s)` : `✓ ${args.length ? `${args.length} fichier(s)` : `bibliothèque (${Object.keys(L.index()).length} dessins)`} sans problème`)
    return issues.length ? 1 : 0
  }
  if (sub === 'add') {
    const [id, file] = args
    if (!id || !file || !o.cat) { console.error('usage : svgmaker art add <id> <dessin.svg> --cat <catégorie> [--tags a,b]'); return 1 }
    try {
      const text = readFileSync(file, 'utf8')
      const svg = text.includes('<!-- art -->') ? L.parseArtFile(text, file) : text.trim()
      const e = L.addArt(id, svg, { cat: o.cat, tags: o.tags ? o.tags.split(',') : [], source: path.relative(process.cwd(), file) })
      L.saveIndex()
      console.log(`✓ ${id} → library/${e.file} (${e.bytes} o, ${e.colors.length} couleurs)`)
      return 0
    } catch (e) { console.error(`✗ ${e.message}`); return 1 }
  }
  console.log(`svgmaker art : bibliothèque de dessins (library/)
  svgmaker art list [texte] [--cat animals] [--tags kids,farm]   liste les dessins
  svgmaker art check [fichiers.svg…]                              contrôle la bibliothèque, ou des dessins précis
  svgmaker art add <id> <dessin.svg> --cat <catégorie> [--tags …] ajoute ou remplace un dessin
  svgmaker art refresh                                            recalcule l'index après une retouche à la main

Un dessin est du SVG statique centré en (0,0), tenant dans ±250 : ni script, animation, style, id, class, href ni image.
Dans un thème : "art": "<id>" (kids-english-th) ou art: lib({ clé: '<id>' }) (Mali).`)
  return sub ? 1 : 0
}

const [cmd, ...inputs] = positionals
if (cmd === 'studio') {
  const { startStudio } = await import('../src/studio.mjs')
  const port = Number(o.port ?? 4321)
  await startStudio({ port })
  console.log(`svgMaker Studio → http://localhost:${port}  (projets : studio.json, Ctrl+C pour arrêter)`)
  await new Promise(() => {}) // le serveur tourne jusqu'à Ctrl+C
} else if (cmd === 'art') {
  process.exit(await artCommand(inputs))
} else if (cmd === 'new' || cmd === 'preview') {
  process.exit(await briefCommand(cmd, inputs))
} else if (cmd === 'formats') {
  const { FORMATS } = await import('../src/formats/index.mjs')
  for (const [k, fm] of Object.entries(FORMATS)) console.log(`${k.padEnd(10)} ${fm.description}  (src/formats/${k}/STYLE.md)`)
  process.exit(0)
} else if (o.help || !cmd || !['render', 'probe', 'audit'].includes(cmd) || !inputs.length) {
  console.log(HELP)
  process.exit(o.help ? 0 : 1)
}
if (o.size && !/^\d+x\d+$/.test(o.size)) { console.error('--size attend LxH, ex. 1080x1920'); process.exit(1) }

const num = (v) => (v == null ? undefined : Number(v))
const opts = {
  outDir: o.out,
  jobs: num(o.jobs),
  fps: num(o.fps),
  size: o.size,
  duration: num(o.duration),
  crf: num(o.crf),
  preset: o.preset,
  quality: num(o.quality),
  bg: o.bg,
  music: o.music && path.resolve(o.music),
  musicVolume: num(o['music-volume']),
  loudnorm: o['music-volume'] == null, // appliqué seulement s'il y a une musique (--music ou data-music)
  gif: !!o.gif,
  cover: !o['no-cover'],
  coverAt: num(o['cover-at']),
  audit: !!o.audit,
  sheet: !!o.sheet,
  dedup: !o['no-dedup'],
  force: !!o.force,
  probeOnly: cmd === 'probe',
  auditOnly: cmd === 'audit',
}

try {
  const files = await collectSvgs(inputs, !!o.recursive)
  if (!files.length) { console.error('aucun fichier .svg trouvé'); process.exit(1) }
  if (cmd === 'render') console.log(`svgmaker ${VERSION} · ${files.length} SVG · ${opts.jobs ?? DEFAULT_JOBS} navigateurs`)
  const { results, failed, secs } = await renderAll(files, opts)
  if (cmd === 'probe') {
    console.table(results.map((r) => ({
      fichier: path.basename(r.file), durée: +r.duration.toFixed(2), source: r.durationSource,
      taille: `${r.width}x${r.height}`, fps: r.fps, images: r.frames, css: r.cssAnimations, smil: r.smilAnimations, scripts: r.scripts,
    })))
  } else if (results.length) {
    const frames = results.reduce((a, r) => a + r.frames, 0)
    const issues = results.reduce((a, r) => a + (r.audit?.issues.length ?? 0), 0)
    const line = [`${results.length} fichier(s)`]
    if (cmd === 'render') line.push(`${frames} images en ${secs.toFixed(1)} s (${(frames / secs).toFixed(0)} img/s)`)
    if (opts.audit || opts.auditOnly) line.push(`${issues} alerte(s) d'audit`)
    console.log(`→ ${line.join(' · ')}`)
  }
  process.exit(failed ? 1 : 0)
} catch (e) {
  console.error('✗', e.message)
  process.exit(1)
}
