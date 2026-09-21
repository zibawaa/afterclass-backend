import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'
const payload = { name: 'Ali', phone: '07700123456', requestId: 'a-request-12345678', items: [{ lessonId: '000000000000000000000001', quantity: 2 }] }
test('POST stores a validated order and preserves phone leading zeroes', async t => {
  let saved
  const api = await startApi(t, { createOrder: async body => { saved = body; return { _id: 'order', status: 'pending', items: body.items } } })
  const response = await api('/orders', 'POST', payload)
  assert.equal(response.status, 201)
  assert.equal(saved.phone, '07700123456')
  assert.equal(saved.items[0].quantity, 2)
})
test('rejects invalid customer details, IDs, quantities and repeated lesson rows', async t => {
  const api = await startApi(t, { createOrder: () => assert.fail('invalid request must not reach storage') })
  for (const change of [{ name: 'Ali7' }, { phone: '+44' }, { items: [] }, { items: [{ lessonId: 'invalid', quantity: 1 }] }, { items: [{ ...payload.items[0], quantity: -1 }] }, { items: [payload.items[0], payload.items[0]] }]) {
    assert.equal((await api('/orders', 'POST', { ...payload, ...change })).status, 400)
  }
})
