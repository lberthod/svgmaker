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

Dans le SVG (facultatif) : <svg data-duration="14.5" data-fps="30">, et data-role="hook" / "final"
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
  },
})

const [cmd, ...inputs] = positionals
if (o.help || !cmd || !['render', 'probe', 'audit'].includes(cmd) || !inputs.length) {
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
  loudnorm: !!o.music && o['music-volume'] == null,
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
