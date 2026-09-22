import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'
const id = '000000000000000000000001'
test('enrolment route returns purchased spaces and handles unknown lessons', async t => {
  const api = await startApi(t, { enrolment: async value => value === id ? 3 : null })
  const response = await api(`/enrolment/${id}`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { lessonId: id, enrolment: 3 })
  assert.equal((await api('/enrolment/000000000000000000000099')).status, 404)
  assert.equal((await api('/enrolment/invalid')).status, 400)
})
