import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'

test('permits Pages requests and answers PUT preflight', async t => {
  const api = await startApi(t, { listLessons: async () => [] }, { allowedOrigins: ['https://zibawaa.github.io'] })
  const result = await api('/lessons', 'GET', undefined, { Origin: 'https://zibawaa.github.io' })
  assert.equal(result.headers.get('access-control-allow-origin'), 'https://zibawaa.github.io')
  const preflight = await api('/lessons/000000000000000000000001', 'OPTIONS', undefined, {
    Origin: 'https://zibawaa.github.io', 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'content-type',
  })
  assert.equal(preflight.status, 204)
  assert.match(preflight.headers.get('access-control-allow-methods'), /PUT/)
})
test('rejects unlisted browser origins while allowing Postman without Origin', async t => {
  const api = await startApi(t, { listLessons: async () => [] }, { allowedOrigins: ['https://zibawaa.github.io'] })
  assert.equal((await api('/lessons', 'GET', undefined, { Origin: 'https://unlisted.example' })).status, 403)
  assert.equal((await api('/lessons')).status, 200)
})
