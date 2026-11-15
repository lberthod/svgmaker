#!/usr/bin/env node
// Appel simple à l'API DeepSeek (format OpenAI /chat/completions). La clé vient de DEEPSEEK_API_KEY (jamais écrite dans le dépôt).
//   node reels-nuit/outils/deepseek.mjs --model deepseek-v4-pro --system "..." --prompt-file tache.md [--image a.jpg --image b.jpg] [--out rep.md] [--effort low|high|max]
// Affiche : la réponse (ou l'écrit dans --out), puis une ligne « usage » avec les jetons et la durée.
import { readFileSync, writeFileSync } from 'node:fs'

const a = process.argv.slice(2), opt = { image: [] }
for (let i = 0; i < a.length; i += 2) { const k = a[i].replace(/^--/, ''); if (k === 'image') opt.image.push(a[i + 1]); else opt[k] = a[i + 1] }
const key = process.env.DEEPSEEK_API_KEY
if (!key) { console.error('DEEPSEEK_API_KEY absente'); process.exit(2) }
const prompt = opt['prompt-file'] ? readFileSync(opt['prompt-file'], 'utf8') : opt.prompt
if (!prompt) { console.error('--prompt-file ou --prompt requis'); process.exit(2) }
const content = opt.image.length
  ? [{ type: 'text', text: prompt }, ...opt.image.map((f) => ({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${readFileSync(f).toString('base64')}` } }))]
  : prompt
const messages = [...(opt.system ? [{ role: 'system', content: opt.system }] : []), { role: 'user', content }]
const body = { model: opt.model ?? 'deepseek-v4-pro', messages, max_tokens: Number(opt['max-tokens'] ?? 16000), stream: false }
if (opt.effort) body.reasoning_effort = opt.effort
const t0 = Date.now()
const r = await fetch('https://api.deepseek.com/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` }, body: JSON.stringify(body) })
const j = await r.json()
if (!r.ok) { console.error('ERREUR', r.status, JSON.stringify(j).slice(0, 500)); process.exit(1) }
const text = j.choices?.[0]?.message?.content ?? ''
if (opt.out) writeFileSync(opt.out, text); else console.log(text)
console.error(`usage ${JSON.stringify(j.usage)} · ${((Date.now() - t0) / 1000).toFixed(1)} s · modèle ${j.model}`)
