// Contrôle automatique de la synchro labiale d'un SVG « dialogue » : on se place, image par image, aux instants
// de forte et de faible énergie de chaque réplique (enveloppe de voice.json) et on lit la pose réellement affichée.
//   forte énergie (≥ 0,5)  → la pose « talk » du locuteur doit être affichée
//   faible énergie (≤ 0,1) → elle doit être fermée (pose neutre)
//   silence (aucune voix)  → aucun personnage ne parle ; un personnage qui ne parle pas n'ouvre jamais la bouche
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
import { fitViewport, poseStates, seek, setupPage, visibleSubs } from './page-fns.mjs'

const HI = 0.5, LO = 0.1

/** Instants à contrôler pour une réplique : [{ t, want: 'open' | 'closed', e }] (milieu de chaque pas d'enveloppe). */
export function sampleLine(line, v, { perKind = 6 } = {}) {
  const n = v.env.length
  const pts = v.env.map((e, i) => ({ t: line.t + ((i + 0.5) / (n - 1)) * v.dur, e, i })).filter((p) => p.i < n - 1)
  const pick = (arr) => (arr.length <= perKind ? arr : Array.from({ length: perKind }, (_, k) => arr[Math.round((k * (arr.length - 1)) / (perKind - 1))]))
  return [...pick(pts.filter((p) => p.e >= HI)).map((p) => ({ ...p, want: 'open' })), ...pick(pts.filter((p) => p.e <= LO)).map((p) => ({ ...p, want: 'closed' }))]
}

/**
 * svgFile : SVG du format dialogue ; lines : [{ t, who|role, text }] ; voice : { 'who|texte': { dur, env } }.
 * Retourne { ok, lines: [{ who, text, checked, matched, pct, status, misses }], silence: { checked, bad }, others: { checked, bad } }.
 */
export async function checkLipsync(svgFile, { lines, voice, min = 85, framesDir } = {}) {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] })
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
    await page.goto('file://' + path.resolve(svgFile))
    await page.evaluate(setupPage)
    await page.evaluate(fitViewport, null)
    if (framesDir) mkdirSync(framesDir, { recursive: true })
    const at = async (t) => { await page.evaluate(seek, t); return page.evaluate(poseStates) }
    const rep = { lines: [], silence: { checked: 0, bad: [] }, others: { checked: 0, bad: [] }, min }
    const spans = lines.map((l) => { const v = voice[`${l.who ?? l.role}|${l.text}`]; return { l, v, t0: l.t, t1: l.t + (v?.dur ?? 0.09 * l.text.length + 0.3) } })
    const speakingAt = (t) => spans.some((s) => t >= s.t0 - 0.05 && t <= s.t1 + 0.1)
    for (const [k, { l, v }] of spans.entries()) {
      const who = l.who ?? l.role, row = { who, text: l.text, t: l.t, checked: 0, matched: 0, pct: null, status: '', misses: [] }
      rep.lines.push(row)
      if (who === 'narrator') { row.status = 'voix off (pas de corps)'; continue }
      if (!v || v.env.length < 2) { row.status = 'sans enveloppe : non vérifiable'; continue }
      const saved = new Set()
      for (const p of sampleLine(l, v)) {
        const st = await at(p.t)
        const me = st[who]
        if (!me) { row.status = 'hors écran'; row.checked = 0; break }
        if (!me.hasTalk) { row.status = 'pas de pose talk'; row.checked = 0; break }
        const open = me.talk > 0.5
        row.checked++
        if (open === (p.want === 'open')) row.matched++
        else row.misses.push(`${p.t.toFixed(2)} s (énergie ${p.e.toFixed(2)}) : ${p.want === 'open' ? 'bouche fermée' : 'bouche ouverte'}`)
        // aucun autre personnage ne parle pendant cette réplique
        for (const [name, o] of Object.entries(st)) if (name !== who && o.hasTalk) {
          rep.others.checked++
          if (o.talk > 0.5) rep.others.bad.push(`${p.t.toFixed(2)} s : « ${name} » parle pendant la réplique de « ${who} »`)
        }
        if (framesDir && !saved.has(p.want)) { saved.add(p.want); await page.screenshot({ path: path.join(framesDir, `l${String(k + 1).padStart(2, '0')}-${who}-${p.want}-${p.t.toFixed(2)}.png`) }) }
      }
      if (row.checked) { row.pct = Math.round((100 * row.matched) / row.checked); row.status = row.pct >= min ? 'OK' : 'ÉCHEC' }
    }
    // silences : personne ne parle
    const D = await page.evaluate(() => parseFloat(document.documentElement.getAttribute('data-duration')))
    const sil = []
    for (let t = 0.2; t < D; t += 0.5) if (!speakingAt(t)) sil.push(t)
    for (const t of sil) {
      const st = await at(t)
      rep.silence.checked++
      for (const [name, o] of Object.entries(st)) if (o.talk > 0.5) rep.silence.bad.push(`${t.toFixed(2)} s : « ${name} » parle dans le silence`)
    }
    // sous-titres : chaque réplique a son sous-titre visible pendant toute sa durée
    rep.subs = { checked: 0, missing: [] }
    for (const [k, { l, v, t0, t1 }] of spans.entries()) {
      const end = v ? t1 : t0 + 0.3
      for (let t = t0 + 0.08; t <= end - 0.05; t += 0.2) {
        await page.evaluate(seek, t)
        const vis = await page.evaluate(visibleSubs)
        rep.subs.checked++
        if (!vis.includes(k)) rep.subs.missing.push(`${t.toFixed(2)} s : sous-titre absent de « ${l.text} »`)
      }
    }
    const failedLine = rep.lines.some((r) => r.status === 'ÉCHEC')
    const checked = rep.lines.filter((r) => r.checked).length
    rep.ok = !failedLine && !rep.silence.bad.length && !rep.others.bad.length && !rep.subs.missing.length && checked > 0
    return rep
  } finally {
    await browser.close()
  }
}

export function formatReport(rep) {
  const out = [`Synchro labiale (seuil ${rep.min} %) : pose talk ↔ enveloppe de la voix`]
  for (const r of rep.lines) {
    const head = `${r.pct == null ? ' — ' : `${String(r.pct).padStart(3)} %`}  ${r.who.padEnd(9)} ${r.t.toFixed(1).padStart(5)} s  « ${r.text} »`
    out.push(`${r.status === 'ÉCHEC' ? '✗' : r.pct == null ? '·' : '✓'} ${head}${r.pct == null ? `  [${r.status}]` : `  (${r.matched}/${r.checked})`}`)
    for (const m of r.misses.slice(0, 3)) out.push(`      ↳ ${m}`)
  }
  out.push(`${rep.silence.bad.length ? '✗' : '✓'} silences : ${rep.silence.checked - rep.silence.bad.length}/${rep.silence.checked} images sans bouche ouverte`)
  out.push(`${rep.others.bad.length ? '✗' : '✓'} autres personnages : ${rep.others.checked - rep.others.bad.length}/${rep.others.checked} images où seul le locuteur parle`)
  for (const m of [...rep.silence.bad, ...rep.others.bad].slice(0, 5)) out.push(`      ↳ ${m}`)
  out.push(`${rep.subs.missing.length ? '✗' : '✓'} sous-titres : ${rep.subs.checked - rep.subs.missing.length}/${rep.subs.checked} instants où la réplique dite a son sous-titre`)
  for (const m of rep.subs.missing.slice(0, 5)) out.push(`      ↳ ${m}`)
  out.push(rep.ok ? '→ synchro conforme' : '→ synchro NON conforme')
  return out.join('\n')
}
