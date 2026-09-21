import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'

test('logger records method, path and status without customer data', async t => {
  const logs = []
  const api = await startApi(t, { listLessons: async () => [] }, { log: line => logs.push(line) })
  await api('/lessons?private=secret')
  assert.match(logs[0], /GET \/lessons 200/)
  assert.ok(!logs[0].includes('secret'))
})

test('serves lesson illustrations and returns a clear JSON error for missing images', async t => {
  const api = await startApi(t, {})
  const image = await api('/images/art.svg')
  assert.equal(image.status, 200)
  assert.match(image.headers.get('content-type'), /image\/svg\+xml/)
  const missing = await api('/images/missing.svg')
  assert.equal(missing.status, 404)
  assert.match((await missing.json()).error, /image/i)
})
