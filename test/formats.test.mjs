// Formats (carton, quiz, minifilm) : briefs d'exemple, validation explicite, contrat SVG, texte multiligne.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { createScene } from '../src/kit/actors/scene.mjs'
import { textWidth, wrapLines, fitBlock } from '../src/kit/text.mjs'
import { FORMATS, buildBrief } from '../src/formats/index.mjs'
import { nombreEnLettres, phon } from '../src/formats/atlas/format.mjs'

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

test('carte : erreurs de brief explicites et carte cohérente', () => {
  const carte = load(examples.find((f) => f.includes('suisse-4-langues')))
  const sc = carte.scenes
  assert.throws(() => buildBrief({ ...carte, scenes: sc.slice(1) }), /première scène est une accroche/)
  assert.throws(() => buildBrief({ ...carte, scenes: [sc[0], { type: 'map', text: 'x', highlight: { cantons: ['XX'] } }, sc.at(-1)] }), /code de canton inconnu/)
  assert.throws(() => buildBrief({ ...carte, scenes: [sc[0], { type: 'map', text: 'x', highlight: { langs: ['en'] } }, sc.at(-1)] }), /langs/)
  assert.throws(() => buildBrief({ ...carte, scenes: [sc[0], { type: 'map', text: 'x', pins: ['Atlantide'] }, sc.at(-1)] }), /ville connue/)
  const r = buildBrief(carte)
  assert.match(r.svg, /@keyframes mapcam\{/)
  assert.equal((r.svg.match(/id="m-c\d+"/g) ?? []).length, 26, '26 cantons')
  assert.equal((r.svg.match(/id="m-d\d+"/g) ?? []).length, 143, '143 districts')
})

test('carte : narration, question à décompte et minutage suivent la voix', () => {
  const carte = load(examples.find((f) => f.includes('suisse-4-langues')))
  const quiz = carte.scenes[0]
  const voice = { 'guide|Quatre ! En route !': { dur: 5, env: [0.5, 1, 0.4] } }
  const slow = buildBrief(carte, voice), fast = buildBrief(carte)
  assert.notEqual(slow.duration, fast.duration, 'la durée suit voice.json')
  assert.ok(slow.script.lines.every((l) => l.role === 'guide' && l.text))
  assert.ok(slow.script.lines.every((l, i, a) => !i || a[i - 1].t < l.t), 'répliques dans l’ordre')
  assert.equal(slow.script.sfx.filter((e) => e.kind === 'tick').length, 3 * carte.scenes.filter((s) => s.choices).length, '3 ticks par question')
  assert.equal(slow.script.sfx.filter((e) => e.kind === 'ding').length, carte.scenes.filter((s) => s.choices).length)
  assert.throws(() => buildBrief({ ...carte, scenes: [{ ...quiz, answer: 7 }, ...carte.scenes.slice(1)] }), /index du bon choix/)
  assert.throws(() => buildBrief({ ...carte, scenes: [{ ...quiz, choices: ['a'] }, ...carte.scenes.slice(1)] }), /2 ou 3 choix/)
  assert.throws(() => buildBrief({ ...carte, scenes: [{ ...quiz, word: { text: 'x' }, stat: { value: '1' } }, ...carte.scenes.slice(1)] }), /un mot ou un chiffre/)
})

test('atlas : sous-titres, questions, pictogramme et erreurs de brief explicites', () => {
  const atlas = load(examples.find((f) => f.includes('/atlas/') && f.includes('suisse-4-langues')))
  const sc = atlas.scenes
  const r = buildBrief(atlas)
  assert.match(r.svg, /@keyframes mapcam\{/)
  assert.equal((r.svg.match(/id="m-d\d+"/g) ?? []).length, 143, '143 districts')
  assert.ok(r.script.lines.length >= 10 && r.script.lines.every((l) => l.role === (atlas.voice ?? 'guide')), 'une seule voix, sans prénom')
  assert.doesNotMatch(JSON.stringify(r.script.lines), /Heidi/, 'pas de personnage récurrent dans la narration')
  assert.ok(!r.svg.includes('ABONNER') && !r.svg.includes('ABONN'), 'aucun appel à l’action par défaut')
  const rc = buildBrief({ ...atlas, scenes: [...sc.slice(0, -1), { ...sc.at(-1), cta: true }] })
  assert.ok(rc.svg.includes('S&#39;ABONNER') || rc.svg.includes("S'ABONNER"), 'bouton abonné seulement si cta: true')
  // le sous-titre affiche le vrai mot (« Grüezi »), pas la phonétique lue (« Grüétsi »)
  assert.match(r.svg, /Grüezi/); assert.doesNotMatch(r.svg, />[^<]*Grüétsi[^<]*</)
  assert.equal(r.script.sfx.filter((e) => e.kind === 'ding').length, sc.filter((s) => s.choices).length, 'un ding par question (le clic « abonné » n’existe que si cta: true)')
  assert.throws(() => buildBrief({ ...atlas, scenes: [sc[0], { type: 'map', text: 'x', crowd: { groups: [{ lang: 'de', n: 80 }, { lang: 'fr', n: 40 }] } }, sc.at(-1)] }), /100 personnes au plus/)
  assert.throws(() => buildBrief({ ...atlas, scenes: [sc[0], { type: 'map', text: 'x', people: [{ who: 'licorne', at: 'Berne' }] }, sc.at(-1)] }), /who/)
  assert.throws(() => buildBrief({ ...atlas, scenes: [sc[0], { type: 'map', text: 'x', people: [{ at: 'Atlantide' }] }, sc.at(-1)] }), /ville connue/)
  assert.throws(() => buildBrief({ ...atlas, scenes: sc.slice(1) }), /première scène est une accroche/)
})

test('atlas : aucune fenêtre d’animation ne démarre après la fin de la vidéo, le calage suit les mots, les erreurs de calage sont signalées', () => {
  const atlas = load(examples.find((f) => f.includes('/atlas/') && f.includes('suisse-4-langues')))
  const r = buildBrief(atlas)
  const D = r.duration
  // régression : le délai d'une étiquette « until » était compté deux fois (étiquettes invisibles dans le MP4)
  for (const m of r.svg.matchAll(/animation:win [\d.]+s linear ([\d.]+)s/g)) assert.ok(+m[1] < D, `fenêtre à ${m[1]} s, vidéo de ${D} s`)
  // calage sur un mot : un mot mesuré à +2 s décale l'élément de 2 s par rapport au début de la réplique
  const sc = atlas.scenes.findIndex((s) => s.year === '1481 – 1815')
  const line = phon(typeof [].concat(atlas.scenes[sc].say)[0] === 'string' ? [].concat(atlas.scenes[sc].say)[0] : [].concat(atlas.scenes[sc].say)[0].say), key = `${atlas.voice ?? 'guide'}|${line}`
  const base = buildBrief(atlas, { [key]: { dur: 9, env: [1, 1], words: [{ w: 'Fribourg', t: 0.5 }] } })
  const moved = buildBrief(atlas, { [key]: { dur: 9, env: [1, 1], words: [{ w: 'Fribourg', t: 3.5 }] } })
  assert.notEqual(base.svg, moved.svg, 'le mot « Fribourg » déplace la pastille')
  const scenes = (n) => atlas.scenes.map((s, i) => (i === 2 ? { ...s, ...n } : s))
  assert.throws(() => buildBrief({ ...atlas, scenes: scenes({ pills: [{ at: 'Rome', title: 'x', when: { line: 9 } }] }) }), /réplique n° 9 inexistante/)
  assert.throws(() => buildBrief({ ...atlas, scenes: scenes({ people: [{ at: 'Berne', outfit: '"><x' }] }) }), /#RRGGBB/)
  assert.throws(() => buildBrief({ ...atlas, scenes: scenes({ moves: [{ from: 'Rome', to: 'Rome' }] }) }), /identiques/)
  assert.throws(() => buildBrief({ ...atlas, scenes: scenes({ focus: { box: [1, 2, 3, 'a'] } }) }), /lon0/)
})

test('atlas : les nombres sont dits en toutes lettres (la voix lit « 660 000 » chiffre par chiffre) et le sous-titre garde les chiffres', () => {
  assert.equal(nombreEnLettres(1815), 'mille huit cent quinze')
  assert.equal(nombreEnLettres(660000), 'six cent soixante mille')
  assert.equal(nombreEnLettres(80), 'quatre-vingts')
  assert.equal(nombreEnLettres(71), 'soixante et onze')
  assert.equal(phon('Environ 660 000 habitants, 47 % d’étrangers, 2 586 km².'), 'Environ six cent soixante mille habitants, quarante-sept pour cent d’étrangers, deux mille cinq cent quatre-vingt-six kilomètres carrés.')
  assert.equal(phon('0,5 % parlent romanche'), 'zéro virgule cinq pour cent parlent romanche')
  assert.equal(phon('En 1291, Ier siècle'), 'En mille deux cent quatre-vingt-onze, premier siècle')
})
