// svgkit · acteurs : scène, caméra, synchro labiale, Mali, gags (fonctions pures, sans navigateur).
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cameraMoves, cameraStyle, punch, quake } from '../src/kit/actors/camera.mjs'
import { GAG_TYPES, runGag } from '../src/kit/actors/gags.mjs'
import { lipAnimations, speakingDuring } from '../src/kit/actors/lipsync.mjs'
import { createMali } from '../src/kit/actors/mali.mjs'
import { createScene } from '../src/kit/actors/scene.mjs'
import { anim } from '../src/kit/core.mjs'

test('scène : répliques, bruitages, calques, trajectoires, script trié', () => {
  const s = createScene()
  s.say(2, 'mali_en', 'Hi!'); s.say(1, 'narrator', 'Cat'); s.fx(1.23456, 'pop')
  s.win('hop', 'hop', 0.5, 0.5)
  assert.deepEqual(s.layer('hop'), ['hop 0.5s ease-in-out 0.5s'])
  assert.equal(s.animList([]), 'animation:none')
  assert.equal(s.animList(['a 1s'], 'base 2s'), 'animation:base 2s,a 1s')
  assert.equal(s.path('p', [[0, 1, 2]]), 'p')
  assert.match(s.keyframes[0], /@keyframes p\{0%\{transform:translate\(1px,2px\) rotate\(0deg\) scale\(1\);opacity:1\}\}/)
  assert.deepEqual([s.nextId('cam'), s.nextId('cam'), s.nextId('x')], ['cam0', 'cam1', 'x0'])
  const sc = s.script('demo', 10)
  assert.deepEqual(sc.lines.map((l) => l.t), [1, 2])
  assert.equal(sc.sfx[0].t, 1.235)
})

test('scène : durée de réplique réelle (voice.json) ou estimée', () => {
  const s = createScene({ voice: { 'mali_en|Hi!': { dur: 0.8, env: [0, 1] } } })
  assert.equal(s.durOf({ role: 'mali_en', text: 'Hi!' }), 0.8)
  assert.equal(s.durOf({ role: 'mali_th', text: 'abc' }), 0.09 * 3 + 0.3)
})

test('caméra : zoom et tremblement numérotés sur le calque cam', () => {
  const s = createScene()
  assert.equal(cameraStyle(s), 'animation:none')
  punch(s, 1, 1.5, 600, 1000); quake(s, 3, 0.4, 10)
  assert.equal(cameraMoves(s), 2)
  assert.equal(cameraStyle(s), 'animation:cam0 1.5s ease-in-out 1s,cam1 0.4s linear 3s')
  assert.match(s.keyframes[1], /100%\{transform:translate\(0px,0px\)\}/) // le tremblement revient au repos
})

test('synchro labiale : enveloppe réelle → keyframes, sinon battement « talk »', () => {
  const s = createScene({ voice: { 'mali_en|Hi!': { dur: 0.5, env: [0, 1, 0] } } })
  const lines = [{ t: 1, role: 'mali_en', text: 'Hi!' }, { t: 3, role: 'mali_th', text: 'abcdefgh' }]
  const a = lipAnimations(s, lines)
  assert.equal(a[0], 'ls0 0.5s linear 1s')
  assert.match(a[1], /^talk 0\.16s ease-in-out 3s \d+ alternate$/)
  assert.equal(s.keyframes.length, 1)
  assert.ok(speakingDuring(s, lines, 1.2, 0.1))
  assert.ok(!speakingDuring(s, lines, 2, 0.5))
})

test('Mali : marche, saut, expressions et dessin', () => {
  const s = createScene()
  const m = createMali(s, { x: 290, ground: 1365, k: 1.3, duration: 20 })
  m.walk(0, 1.0); m.hop(2, true); m.expr(2, 1, 'happy', 'laugh')
  s.say(2.1, 'mali_en', 'Hi!')
  assert.deepEqual(s.layer('legsA'), ['walkA 0.5s linear 0s 2'])
  assert.deepEqual(s.layer('hop'), ['bigjump 0.7s ease-out 2s'])
  assert.deepEqual(s.sfx.map((x) => x.kind), ['step', 'step', 'boing'])
  const svg = m.draw()
  assert.match(svg, /animation:maliPath 20s linear 0s both/)
  assert.match(svg, /class="mouth"[^>]*animation:talk/) // bouche estimée sans voice.json
  assert.match(svg, /show 1s linear 2s/) // yeux « happy »
  assert.ok(m.parts.nose.x > m.x)
})

test('gags : chaque type produit un objet, des bruitages et une réaction', () => {
  for (const type of GAG_TYPES) {
    const s = createScene()
    const actor = createMali(s, { duration: 20 })
    const art = (k, sc) => `<use data-k="${k}" data-s="${sc}"/>`
    const svg = runGag({ s, actor, art, anim: (...a) => anim(...a), obj: { x: 825, y: 1110 }, scene: 9 },
      { art: 'cat', color: '#F23B3B', gag: type === 'self' ? { type, part: 'nose' } : type }, 4)
    assert.match(svg, /data-k="cat"/, type)
    assert.ok(s.sfx.length > 0, `${type} : bruitage`)
  }
  const s = createScene(), actor = createMali(s, { duration: 20 })
  assert.throws(() => runGag({ s, actor, art: () => '', anim, obj: { x: 0, y: 0 }, scene: 9 }, { gag: { type: 'self', part: 'wing' } }, 0), /partie inconnue/)
})
