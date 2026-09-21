import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'
const id = '000000000000000000000001'
test('PUT accepts absolute space values and other lesson attributes', async t => {
  const lesson = { _id: id, space: 5, topic: 'Art', price: 22 }
  const api = await startApi(t, { updateLesson: async (lessonId, changes) => Object.assign(lesson, changes) })
  const response = await api(`/lessons/${id}`, 'PUT', { space: 12, price: 37, topic: 'Drawing' })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { _id: id, space: 12, price: 37, topic: 'Drawing' })
})
test('PUT rejects negative/fractional spaces, unknown fields and unsafe image paths', async t => {
  const api = await startApi(t, { updateLesson: () => assert.fail('invalid update reached storage') })
  for (const update of [{ space: -1 }, { space: 1.5 }, { space: '5' }, { _id: id }, { '$set': {} }, { image: 'https://evil.example/img.svg' }, {}]) {
    assert.equal((await api(`/lessons/${id}`, 'PUT', update)).status, 400)
  }
  assert.equal((await api('/lessons/bad-id', 'PUT', { space: 2 })).status, 400)
})
test('PUT checkout forwards order identity and desired absolute space', async t => {
  let received
  const api = await startApi(t, { completeOrder: async (...args) => { received = args; return { _id: id, space: 3 } } })
  const response = await api(`/lessons/${id}`, 'PUT', { space: 3, orderId: id })
  assert.equal(response.status, 200)
  assert.deepEqual(received, [id, id, 3])
})
