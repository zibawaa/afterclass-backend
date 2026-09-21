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
