import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'
test('health checks database reachability', async t => {
  const api = await startApi(t, { ping: async () => ({ ok: 1 }) })
  assert.deepEqual(await (await api('/health')).json(), { status: 'ok' })
})
