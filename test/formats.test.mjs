// Formats (carton, quiz, minifilm) : briefs d'exemple, validation explicite, contrat SVG, texte multiligne.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { createScene } from '../src/kit/actors/scene.mjs'
import { textWidth, wrapLines, fitBlock } from '../src/kit/text.mjs'
import { FORMATS, buildBrief } from '../src/formats/index.mjs'

const here = path.dirname(new URL(import.meta.url).pathname)
const FDIR = path.join(here, '..', 'src', 'formats')
const examples = Object.keys(FORMATS).flatMap((fm) =>
  readdirSync(path.join(FDIR, fm, 'examples')).filter((f) => f.endsWith('.json')).map((f) => path.join(FDIR, fm, 'examples', f)))
const load = (f) => JSON.parse(readFileSync(f, 'utf8'))

test('formats : chaque format a au moins 3 briefs d\'exemple', () => {
  for (const fm of Object.keys(FORMATS)) assert.ok(examples.filter((f) => f.includes(`/${fm}/`)).length >= 3, fm)
})

test('formats : chaque brief d\'exemple donne un SVG conforme au contrat svgMaker', () => {
  for (const file of examples) {
    const b = load(file)
    const r = buildBrief(b)
    const name = path.basename(file)
    assert.match(r.svg, /^<svg [^>]*viewBox="0 0 1080 1920"/, name)
    assert.match(r.svg, new RegExp(`data-duration="${r.duration}"`), name)
    assert.match(r.svg, /data-role="hook"/, `${name} : accroche`)
    assert.match(r.svg, /data-role="final"/, `${name} : carton final`)
    assert.match(r.svg, /@font-face\{font-family:'Fredoka'/, `${name} : polices embarquées`)
    assert.ok(r.keyTimes.length >= 3 && r.keyTimes.every((t) => t >= 0 && t <= r.duration), `${name} : instants clés`)
    assert.equal(r.svg.match(/&(?!amp;|lt;|gt;|quot;|#)/g), null, `${name} : texte échappé`)
    // aucune animation au nom invalide (un point dans un nom de @keyframes la rendrait inopérante)
    for (const m of r.svg.matchAll(/@keyframes ([^{]+)\{/g)) assert.match(m[1], /^[\w-]+$/, `${name} : @keyframes ${m[1]}`)
  }
})

test('formats : déterministes', () => {
  for (const file of examples) assert.equal(buildBrief(load(file)).svg, buildBrief(load(file)).svg)
})

test('formats : erreurs de brief explicites', () => {
  const carton = load(examples.find((f) => f.includes('astuce-peinture')))
  assert.throws(() => buildBrief({ ...carton, format: 'inconnu' }), /format « inconnu » inconnu/)
  assert.throws(() => buildBrief({ ...carton, cards: carton.cards.slice(1) }), /premier carton est une accroche/)
  assert.throws(() => buildBrief({ ...carton, cards: [...carton.cards, { type: 'text', text: 'x' }] }), /dernier carton est un carton final/)
  assert.throws(() => buildBrief({ ...carton, cards: [carton.cards[0], { type: 'text', text: 'x', art: 'licorne' }, carton.cards.at(-1)] }), /dessin « licorne » absent/)
  assert.throws(() => buildBrief({ ...carton, id: 'Pas Bon' }), /id/)
  const quiz = load(examples.find((f) => f.includes('animal-sounds')))
  assert.throws(() => buildBrief({ ...quiz, questions: [{ ...quiz.questions[0], answer: 5 }] }), /answer/)
  const film = load(examples.find((f) => f.includes('mali-sunny-day')))
  assert.throws(() => buildBrief({ ...film, shots: [{ ...film.shots[0], mali: { x: 500, move: 'walk' } }, { ...film.shots[1], mali: { x: 200, move: 'walk' } }, film.shots.at(-1)] }), /vers la droite/)
  assert.throws(() => buildBrief({ ...film, shots: [{ ...film.shots[0], lines: [{ at: 1, role: 'chat', text: 'x' }] }, film.shots.at(-1)] }), /role/)
})

test('minifilm : les répliques ne se chevauchent pas (voix et sous-titres)', () => {
  const film = load(examples.find((f) => f.includes('mali-sunny-day')))
  const { script } = buildBrief(film)
  const s = createScene()
  for (let i = 1; i < script.lines.length; i++) {
    const p = script.lines[i - 1]
    assert.ok(script.lines[i].t >= p.t + s.durOf(p) + 0.149, `${p.text} / ${script.lines[i].text}`)
  }
})

test('texte : lignes équilibrées et mots insécables', () => {
  // pas de mot orphelin : les deux lignes ont des largeurs proches
  const l = wrapLines('Le cerveau croit qu’il fait encore jour.', { size: 54, width: 860 * 0.62 })
  assert.equal(l.length, 2)
  const [a, b] = l.map((x) => textWidth(x, 'en', 54))
  assert.ok(Math.abs(a - b) < Math.max(a, b) * 0.5, l.join(' / '))
  // « 18 °C », « 24 h », « nuit ! » restent ensemble
  for (const s of ['Chambre fraîche, vers 18 °C', 'Un devis en 24 h', 'Bonne nuit !'])
    for (const size of [40, 60, 90]) assert.ok(!wrapLines(s, { size, width: 300 }).some((x) => /^(°C|h|!)/.test(x)), s)
  const fb = fitBlock('Même mur. Deux résultats.', { max: 132, width: 860, maxLines: 3 })
  assert.ok(fb.lines.length <= 3 && fb.width <= 860)
})
