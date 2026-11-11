// Format « dialogue » : validation, tolérance aux dessins absents, synchro labiale, minutage externe, audit des acteurs.
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { analyse } from '../src/audit.mjs'
import { buildBrief, writeBrief } from '../src/formats/index.mjs'

const here = path.dirname(new URL(import.meta.url).pathname)
const demo = () => JSON.parse(readFileSync(path.join(here, '..', 'src/formats/dialogue/examples/demo.json'), 'utf8'))

test('dialogue : le SVG est conforme (pas de script, durée, accroche, carton final, 1080×1920)', () => {
  const r = buildBrief(demo())
  assert.doesNotMatch(r.svg, /<script|<foreignObject|<image/)
  assert.match(r.svg, /viewBox="0 0 1080 1920"/)
  assert.match(r.svg, /data-fps="30"/)
  assert.match(r.svg, /data-role="hook"/)
  assert.match(r.svg, /data-role="final"/)
  assert.match(r.svg, /data-actor="atlas"/)
  assert.equal(r.duration, 22)
})

test('dialogue : erreurs de brief explicites', () => {
  const b = demo()
  assert.throws(() => buildBrief({ ...b, cast: {} }), /cast/)
  assert.throws(() => buildBrief({ ...b, shots: [{ ...b.shots[0], texts: [] }, ...b.shots.slice(1)] }), /accroche/)
  assert.throws(() => buildBrief({ ...b, shots: [{ ...b.shots[0], lines: [{ at: 0.4, who: 'zoe', text: 'x' }] }, ...b.shots.slice(1)] }), /absent de cast/)
  assert.throws(() => buildBrief({ ...b, end: { text: 'Fin', dur: 9 } }), /end\.dur/)
  assert.throws(() => buildBrief({ ...b, shots: [{ ...b.shots[0], quiz: { cards: [{ art: 'a' }], correct: 0 } }] }), /3 cartes/)
})

test('dialogue : un dessin absent donne un cadre de remplacement et un avertissement, pas une erreur', () => {
  const b = demo()
  b.cast.atlas.art = 'atlas-inexistant'
  b.shots[0].props = [{ art: 'accessoire-inexistant', x: 500, y: 500, size: 300 }]
  const r = buildBrief(b)
  assert.ok(r.info.warnings.some((w) => /atlas-inexistant/.test(w)))
  assert.ok(r.info.warnings.some((w) => /accessoire-inexistant/.test(w)))
  assert.match(r.svg, /accessoire-inexistant/)
})

test('dialogue : la pose talk suit l\'enveloppe réelle de la voix', () => {
  const b = demo()
  const key = 'atlas|Un livre coûtait une fortune.'
  const env = [0, 0.1, 0.8, 0.9, 0.2, 0.05, 0.7, 0.9, 0.1, 0]
  const r = buildBrief(b, { [key]: { dur: 1.5, env } })
  const m = r.svg.match(/@keyframes lo\d+_0\{([^}]*(?:\}[^}]*?)*?)\}\n/)
  assert.ok(m, 'keyframes d\'ouverture de la bouche')
  assert.match(r.svg, /@keyframes lo\d+_0\{0%\{opacity:0;animation-timing-function:step-end\}22\.222%\{opacity:1/)
  assert.match(r.svg, /@keyframes lb\d+_0\{/) // le corps suit aussi
  // sans voix : bouche qui bat comme le gabarit
  assert.match(buildBrief(b).svg, /dgBat 0\.32s step-end/)
})

test('dialogue : voices, timeline et audio du brief (chemins relatifs au brief)', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'dlg-'))
  const b = { ...demo(), voices: 'voice.json', timeline: 'timeline.json', audio: 'audio.wav' }
  writeFileSync(path.join(dir, 'brief.json'), JSON.stringify(b))
  writeFileSync(path.join(dir, 'audio.wav'), '')
  writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify({ lines: [
    { who: 'atlas', t0: 1.1, t1: 2.4, text: 'Un livre coûtait une fortune.' },
    { who: 'marmot', t0: 3.0, t1: 3.9, text: 'Pourquoi si cher ?' },
  ] }))
  writeFileSync(path.join(dir, 'voice.json'), JSON.stringify({ 'atlas|Un livre coûtait une fortune.': { dur: 1.3, env: [0.1, 0.9, 0.9, 0.2] } }))
  const r = writeBrief(path.join(dir, 'brief.json'))
  const l = r.script.lines.find((x) => x.who === 'atlas' && x.text.startsWith('Un livre'))
  assert.equal(l.t, 1.1)
  assert.equal(r.script.lines.find((x) => x.who === 'marmot').t, 3)
  assert.match(r.svg, /data-music="\.\.\/\.\.\/audio\.wav"/)
  assert.ok(r.info.warnings.some((w) => /Mayence/.test(w) && /timeline/.test(w)), 'réplique sans minutage signalée')
})

test('dialogue : sans chevauchement de répliques, une réplique attend la précédente', () => {
  const b = demo()
  b.shots[0].lines = [{ at: 0.4, who: 'atlas', text: 'Un livre coûtait une fortune.' }, { at: 0.5, who: 'marmot', text: 'Pourquoi si cher ?' }]
  const { script } = buildBrief(b)
  assert.ok(script.lines[1].t >= script.lines[0].t + 1.0)
})

test('audit : un acteur immobile à moitié hors cadre est signalé, un acteur "bleed" ou en mouvement non', () => {
  const box = (x0) => ({ name: 'atlas', x0, x1: x0 + 400, y0: 600, y1: 1000, bleed: false })
  const samples = (a, b, c) => [a, b, c].map((x, i) => ({ t: i * 0.25, texts: [], actors: [x] }))
  const opt = { width: 1080, height: 1920, duration: 0.75 }
  assert.ok(analyse(samples(box(800), box(800), box(800)), opt).issues.some((i) => /acteur coupé/.test(i)))
  assert.ok(!analyse(samples(box(200), box(200), box(200)), opt).issues.some((i) => /acteur coupé/.test(i)))
  assert.ok(!analyse(samples(box(700), box(800), box(900)), opt).issues.some((i) => /acteur coupé/.test(i)))
  const bleed = { ...box(800), bleed: true }
  assert.ok(!analyse(samples(bleed, bleed, bleed), opt).issues.some((i) => /acteur coupé/.test(i)))
})
