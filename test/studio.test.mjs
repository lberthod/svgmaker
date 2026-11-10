import assert from 'node:assert/strict'
import { test } from 'node:test'
import { startStudio } from '../src/studio.mjs'

async function withStudio(fn) {
  const server = await startStudio({ port: 0 })
  const base = `http://127.0.0.1:${server.address().port}`
  try { await fn(base) } finally { server.close() }
}

test('studio : liste des projets avec statistiques', async () => {
  await withStudio(async (base) => {
    const projects = await (await fetch(`${base}/api/projects`)).json()
    assert.ok(Array.isArray(projects) && projects.length > 0)
    for (const p of projects) {
      assert.equal(typeof p.count, 'number')
      assert.equal(typeof p.words, 'number')
      assert.ok(Array.isArray(p.covers) && Array.isArray(p.recent))
    }
  })
})

test('studio : fichiers — traversal, dossier et plage invalides refusés', async () => {
  await withStudio(async (base) => {
    const [p] = await (await fetch(`${base}/api/projects`)).json()
    assert.equal((await fetch(`${base}/files/${p.id}/..%2F..%2Fpackage.json`)).status, 404)
    assert.equal((await fetch(`${base}/files/${p.id}/`)).status, 404)
    assert.equal((await fetch(`${base}/files/${p.id}/themes`)).status, 404)
    assert.equal((await fetch(`${base}/files/inconnu/x`)).status, 404)
  })
})

test('studio : le rendu refuse une origine étrangère', async () => {
  await withStudio(async (base) => {
    const r = await fetch(`${base}/api/render?project=x&item=y`, { method: 'POST', headers: { Origin: 'http://evil.example' } })
    assert.equal(r.status, 403)
  })
})
