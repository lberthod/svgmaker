// Générateurs de SVG (svgkit + séries) : primitives, validation, échappement, et tests « golden ».
// Golden : l'empreinte du SVG généré (et du minutage) ne doit pas changer sans le vouloir.
// Après un changement VOULU du rendu :  UPDATE_GOLDEN=1 npm test  puis vérifier le diff de test/golden.json.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { esc, fixed, rainbow, starPath, validateArt } from '../src/kit/core.mjs'
import * as L from '../src/kit/library.mjs'
import { fitInBox, fitSize, fontFaceCSS, inkExtent, missingChars, textWidth } from '../src/kit/text.mjs'
import * as kids from '../examples/kids-english-th/make.mjs'
import * as mali from '../examples/mali-english-th/engine.mjs'

const here = path.dirname(new URL(import.meta.url).pathname)
const EX = path.join(here, '..', 'examples')
const GOLDEN = path.join(here, 'golden.json')
const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16)
const KIDS_SAMPLE = ['000-first-words', '001-farm-animals', '045-numbers-1-5', '100-manners']
const kidsTheme = (id) => kids.validate(JSON.parse(readFileSync(path.join(EX, 'kids-english-th', 'themes', `${id}.json`), 'utf8')), id)
const maliIds = readdirSync(path.join(EX, 'mali-english-th', 'themes')).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4)).sort()
const maliTheme = async (id) => mali.validateTheme((await import(path.join(EX, 'mali-english-th', 'themes', `${id}.mjs`))).default, id)

// ---------------------------------------------------------------- primitives
test('kit : esc, fixed, rainbow, starPath', () => {
  assert.equal(esc('Fish & <chips> "x"'), 'Fish &amp; &lt;chips&gt; &quot;x&quot;')
  assert.equal(fixed(2)(1.23456), 1.23)
  assert.equal(fixed(3)(2), 2)
  assert.equal(rainbow('a b', 0, { keepSpaces: true }), '<tspan fill="#F23B3B">a</tspan> <tspan fill="#F2B705">b</tspan>')
  assert.match(rainbow('&'), /&amp;/)
  assert.equal(starPath(10, fixed(0)).split(/[ML]/).length - 1, 10)
})

test('kit : validateArt accepte un dessin statique et refuse le reste', () => {
  assert.ok(validateArt('<g><circle r="10"/></g><path d="M0 0"/>'))
  for (const bad of ['<script>x</script>', '<circle r="1"><animate/></circle>', '<g id="a"></g>', '<g class="a"></g>',
    '<use href="#a"/>', '<image href="x.png"/>', '<g style="animation:x 1s"></g>', '<circle onclick="x()"/>', '<g><circle/>', ''])
    assert.throws(() => validateArt(bad), undefined, bad)
})

test('kit : texte mesuré avec les polices embarquées', () => {
  // les voyelles et tons thaïs suscrits n'ont pas de largeur
  assert.equal(textWidth('ก่', 'th', 100), textWidth('ก', 'th', 100))
  assert.ok(textWidth('Watermelon', 'en', 100) > textWidth('Cat', 'en', 100))
  // fitSize : le texte tient dans la largeur, sans dépasser le corps maximal
  const s = fitSize('Watermelon', { kind: 'en', max: 168, width: 400 })
  assert.ok(textWidth('Watermelon', 'en', s) <= 401)
  assert.equal(fitSize('Hi', { kind: 'en', max: 60, width: 900 }), 60)
  // hauteur d'encre : un ton empilé sur une voyelle haute (ตั๊) monte bien plus haut qu'une lettre seule
  assert.ok(inkExtent('ตั๊กแตน', 'th').top > 1.4)
  assert.ok(inkExtent('หนอน', 'th').top < 0.8)
  // fitInBox : l'encre tient dans la hauteur, centrée sur cy
  for (const w of ['ตั๊กแตน', 'หนอน', 'ไส้เดือน']) {
    const { size, y } = fitInBox(w, { kind: 'th', max: 80, width: 640, height: 100, cy: 1349 })
    const e = inkExtent(w, 'th')
    assert.ok((e.top - e.bottom) * size <= 100.5, w)
    assert.ok(Math.abs((y - e.top * size + y - e.bottom * size) / 2 - 1349) < 0.5, w)
  }
  // polices embarquées en base64
  const css = fontFaceCSS()
  assert.match(css, /font-family:'Fredoka'/)
  assert.match(css, /font-family:'Mali'/)
  assert.match(css, /data:font\/woff2;base64,/)
})

test('kit : tous les textes des séries sont couverts par les polices', () => {
  for (const f of readdirSync(path.join(EX, 'kids-english-th', 'themes')).filter((x) => x.endsWith('.json'))) {
    const t = JSON.parse(readFileSync(path.join(EX, 'kids-english-th', 'themes', f), 'utf8'))
    for (const s of [t.theme.en, ...t.words.map((w) => w.en)]) assert.deepEqual(missingChars(s, 'en'), [], `${f} : ${s}`)
    for (const s of [t.theme.th, ...t.words.flatMap((w) => [w.th, w.say])]) assert.deepEqual(missingChars(s, 'th'), [], `${f} : ${s}`)
  }
})

// ---------------------------------------------------------------- validation des thèmes
test('kids : tous les thèmes sont valides', () => {
  const files = readdirSync(path.join(EX, 'kids-english-th', 'themes')).filter((f) => f.endsWith('.json'))
  assert.ok(files.length >= 100)
  for (const f of files) kidsTheme(f.slice(0, -5))
})

test('kids : un dessin en ligne avec <script> ou un id inconnu est refusé', () => {
  const t = structuredClone(kidsTheme('001-farm-animals'))
  t.words[0].art = '<circle r="5"/><script>alert(1)</script>'
  assert.throws(() => kids.validate(t), /mot 1.*script/)
  t.words[0].art = 'licorne-inexistante'
  assert.throws(() => kids.validate(t), /mot 1.*absent de library/)
})

// ---------------------------------------------------------------- bibliothèque
test('library : index et fichiers cohérents, tous les dessins valides', () => {
  assert.deepEqual(L.check(), [])
  assert.ok(Object.keys(L.index()).length >= 540)
})

test('library : chaque mot des séries pointe vers un dessin de la bibliothèque', async () => {
  for (const f of readdirSync(path.join(EX, 'kids-english-th', 'themes')).filter((x) => x.endsWith('.json'))) {
    const t = JSON.parse(readFileSync(path.join(EX, 'kids-english-th', 'themes', f), 'utf8'))
    for (const w of t.words) {
      assert.ok(L.hasArt(w.art), `${f} : ${w.art}`)
      if (w.spin) assert.ok(L.hasArt(w.spin), `${f} : ${w.spin}`)
    }
  }
})

test('library : lib() garde l\'ordre et les clés, resolveArt accepte id ou SVG en ligne', () => {
  const m = L.lib({ b: 'banana-mali', a: 'apple-mali' })
  assert.deepEqual(Object.keys(m), ['b', 'a'])
  assert.equal(m.a, L.art('apple-mali'))
  assert.deepEqual(Object.keys(L.lib('cow', 'pig')), ['cow', 'pig'])
  assert.equal(L.resolveArt('<circle r="1"/>'), '<circle r="1"/>')
  assert.equal(L.resolveArt('cow'), L.art('cow'))
  assert.throws(() => L.art('nope'), /absent de library/)
  const file = L.artFile('x', '<circle r="1"/>')
  assert.equal(L.parseArtFile(file), '<circle r="1"/>')
  assert.equal(L.slug('Ice cream!'), 'ice-cream')
})

test('library : addArt refuse un id ou une catégorie invalide (sans rien écrire)', () => {
  assert.throws(() => L.addArt('Bad Id', '<circle r="1"/>', { cat: 'animals' }), /id/)
  assert.throws(() => L.addArt('ok-id', '<circle r="1"/>', { cat: 'Bad Cat' }), /catégorie/)
  assert.throws(() => L.addArt('cow', '<circle r="1"/>', { cat: 'fruits' }), /déjà utilisé/)
})

test('mali : tous les thèmes sont valides ; erreurs explicites sinon', async () => {
  for (const id of maliIds) await maliTheme(id)
  const t = structuredClone(await maliTheme('fruits'))
  assert.throws(() => mali.validateTheme({ ...t, art: { ...t.art, banana: '<g id="x"/>' } }, 'fruits'), /art\.banana/)
  assert.throws(() => mali.validateTheme({ ...t, words: t.words.slice(0, 4) }, 'fruits'), /5 mots/)
  assert.throws(() => mali.validateTheme({ ...t, words: [{ ...t.words[0], art: 'nope' }, ...t.words.slice(1)] }, 'fruits'), /introuvable/)
  assert.throws(() => mali.validateTheme({ ...t, quiz: { ...t.quiz, answer: 9 } }, 'fruits'), /hors de 0\.\.4/)
})

test('mali : le texte est échappé (« Fish & chips » donne un SVG valide)', async () => {
  const t = structuredClone(await maliTheme('fruits'))
  t.words[0] = { ...t.words[0], en: 'Fish & <chips>', sound: 'A&B' }
  t.title = { ...t.title, en: 'Food & drinks' }
  const { svg } = mali.build(t, {})
  // aucune esperluette nue : toute « & » doit ouvrir une entité
  assert.equal(svg.match(/&(?!amp;|lt;|gt;|quot;|#)/g), null)
  assert.ok(!svg.includes('<chips>'))
})

// ---------------------------------------------------------------- golden
async function current() {
  const out = {}
  for (const id of KIDS_SAMPLE) {
    const { svg, cues } = kids.build(kidsTheme(id))
    out[`kids/${id}`] = sha(svg + JSON.stringify(cues))
  }
  // sans voice.json (sortie d'audio.py, non versionnée) : bouche estimée, résultat portable
  for (const id of maliIds) {
    const { svg, script } = mali.build(await maliTheme(id), {})
    out[`mali/${id}`] = sha(svg + JSON.stringify(script))
  }
  return out
}

test('golden : les SVG générés n\'ont pas changé', async () => {
  const now = await current()
  if (process.env.UPDATE_GOLDEN || !existsSync(GOLDEN)) {
    writeFileSync(GOLDEN, JSON.stringify(now, null, 2) + '\n')
    return
  }
  const ref = JSON.parse(readFileSync(GOLDEN, 'utf8'))
  // seuls les thèmes enregistrés sont comparés (un nouveau thème n'y entre qu'avec UPDATE_GOLDEN=1) ;
  // un thème enregistré mais disparu est une erreur
  const changed = Object.keys(ref).filter((k) => ref[k] !== now[k])
  assert.deepEqual(changed, [], `SVG modifiés ou disparus : ${changed.join(', ')} — si c'est voulu : UPDATE_GOLDEN=1 npm test`)
})

test('golden : la génération est déterministe', async () => {
  assert.deepEqual(await current(), await current())
})
