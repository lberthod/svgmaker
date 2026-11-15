// V2 : décors plein cadre en 3 couches et personnages articulés (contrat des illustrateurs).
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { buildBrief, writeBrief } from '../src/formats/index.mjs'
import { artText } from '../src/kit/library.mjs'
import { gripsOf, scopeIds, splitLayers, validatePose, validateScene } from '../src/kit/v2art.mjs'

const here = path.dirname(new URL(import.meta.url).pathname)
const demo = () => JSON.parse(readFileSync(path.join(here, '..', 'src/formats/dialogue/examples/v2-demo.json'), 'utf8'))
const scene = (w, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 1920" data-kind="scene">${body}</svg>`
const L3 = '<g data-layer="back"><rect width="10" height="10"/></g><g data-layer="mid"><g><circle r="3"/></g></g><g data-layer="fore"></g>'
const pose = (body, h = 1000) => `<svg viewBox="-500 -1050 1000 1100" data-kind="pose" data-height="${h}">${body}</svg>`
const FACE = '<g data-part="mouth-closed"><path d="M0 0"/></g><g data-part="mouth-open"><path d="M0 0"/></g><g data-part="eyes-open"><path d="M0 0"/></g><g data-part="eyes-closed"><path d="M0 0"/></g>'

test('v2 : décor — viewBox 0 0 W 1920, trois couches back → mid → fore, dégradés permis', () => {
  const r = validateScene(scene(2160, `<defs><radialGradient id="h"><stop offset="0"/></radialGradient></defs>${L3.replace('<rect', '<rect fill="url(#h)"')}`))
  assert.equal(r.w, 2160)
  assert.match(r.layers.mid, /<g><circle r="3"\/><\/g>/)
  assert.throws(() => validateScene(scene(2160, L3).replace('1920"', '1080"')), /1920/)
  assert.throws(() => validateScene(scene(900, L3)), /largeur/)
  assert.throws(() => validateScene(scene(1080, L3.replace('data-layer="fore"', 'data-layer="x"'))), /fore/)
  assert.throws(() => validateScene(scene(1080, '<g data-layer="mid"></g><g data-layer="back"></g><g data-layer="fore"></g>')), /ordre/)
  assert.throws(() => validateScene(scene(1080, `<circle r="1"/>${L3}`)), /3 couches/)
  assert.throws(() => validateScene(scene(1080, L3.replace('<rect', '<rect id="mur"'))), /data-part/)
  assert.throws(() => validateScene(scene(1080, L3.replace('<rect', '<rect fill="url(#zz)"'))), /url\(#zz\)/)
  assert.throws(() => validateScene(scene(1080, L3.replace('<rect', '<rect class="a"'))), /class/)
})

test('v2 : pose — data-height, bouche et yeux en deux parties, point de prise', () => {
  const p = validatePose(pose(`${FACE}<circle data-part="grip-r" cx="120" cy="-540" r="0"/>`))
  assert.equal(p.height, 1000)
  assert.deepEqual(p.grips['grip-r'], [120, -540])
  assert.throws(() => validatePose(pose(FACE.replace('mouth-open', 'mouth'))), /mouth-open/)
  assert.throws(() => validatePose(pose(FACE).replace(' data-height="1000"', '')), /data-height/)
  assert.deepEqual(gripsOf('<circle cx="1" data-part="grip-l" cy="2" r="0"/>'), { 'grip-l': [1, 2] })
  assert.equal(scopeIds('<linearGradient id="a"/><rect fill="url(#a)"/>', 'p'), '<linearGradient id="p-a"/><rect fill="url(#p-a)"/>')
  assert.equal(splitLayers('<defs/>' + L3).rest, '<defs/>')
})

test('v2 : les dessins de test de la bibliothèque respectent le contrat', () => {
  assert.equal(validateScene(artText('test-atelier')).w, 2160)
  for (const id of ['test-figure--idle', 'test-figure--arms-up']) assert.ok(validatePose(artText(id)).grips['grip-r'])
})

test('v2 : le moteur place le décor en 3 couches (parallaxe), les poses, la bouche et les yeux', () => {
  const r = buildBrief(demo())
  assert.deepEqual(r.info.warnings, [])
  for (const l of ['back', 'mid', 'fore']) assert.match(r.svg, new RegExp(`data-layer="${l}" class="sc0" style="animation:pan0_${l} `))
  // parallaxe : fore va plus vite que mid, back plus lentement (décalage final 700 px)
  const kf = (n) => [...r.svg.matchAll(/@keyframes (\S+?)\{(.*?)\}\}/g)].find((m) => m[1] === n)?.[2]
  assert.match(kf('pan0_back'), /translateX\(-490px\)/)
  assert.match(kf('pan0_mid'), /translateX\(-700px\)/)
  assert.match(kf('pan0_fore'), /translateX\(-910px\)/)
  assert.match(r.svg, /data-pose="walk-1"[\s\S]*data-pose="walk-2"/)
  assert.match(r.svg, /\[data-part="mouth-open"\]\{opacity:0;animation:dgBat/)
  assert.match(r.svg, /\[data-part="eyes-closed"\]\{opacity:0;animation:dgEyesC/)
  assert.match(r.svg, /vector-effect="non-scaling-stroke"/)
  // ids des dégradés préfixés : pas de collision entre deux plans qui utilisent le même décor
  const ids = [...r.svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  assert.equal(new Set(ids).size, ids.length)
  // personnage V2 : la pose et ses évènements sont validés
  const b = demo()
  b.shots[0].actors[0].play = [{ at: 1, pose: 'danse' }]
  assert.throws(() => buildBrief(b), /pose « danse »/)
})

test('v2 : la bouche du personnage articulé suit la voix (svgmaker lipsync)', async () => {
  const { checkLipsync, formatReport } = await import('../src/lipcheck.mjs')
  const dir = mkdtempSync(path.join(os.tmpdir(), 'v2-'))
  const b = { ...demo(), voices: 'voice.json' }
  writeFileSync(path.join(dir, 'brief.json'), JSON.stringify(b))
  const env = Array.from({ length: 31 }, (_, i) => (Math.floor(i / 3) % 2 ? 0 : 1))
  writeFileSync(path.join(dir, 'voice.json'), JSON.stringify({ "figure|Bienvenue dans l'atelier !": { dur: 1.5, env } }))
  const r = writeBrief(path.join(dir, 'brief.json'))
  const rep = await checkLipsync(r.svgFile, { lines: r.script.lines, voice: r.info.voice })
  const row = rep.lines.find((x) => x.who === 'figure' && x.text.startsWith('Bienvenue'))
  assert.equal(row.pct, 100, formatReport(rep))
  assert.equal(rep.silence.bad.length, 0, formatReport(rep))
})

test('dialogue : aucune animation « fill none » ne démarre à 0 s (invisible à l\'image 0 du rendu)', () => {
  const r = buildBrief(demo())
  assert.doesNotMatch(r.svg, /\s0s 1 none/)
  assert.match(r.svg, /data-pose="idle" style="opacity:1;animation:dgOff /)
})

test('dialogue : aucune image vide à la coupe entre deux plans (le plan suivant est visible dès son premier instant)', () => {
  const r = buildBrief(demo())
  assert.match(r.svg, /animation:dshot 5s linear 0s 1 backwards/)
  assert.match(r.svg, /animation:dshot 4\.5s linear 5s 1 forwards/)
  assert.match(r.svg, /@keyframes dshot\{from,to\{opacity:1\}\}/)
})
