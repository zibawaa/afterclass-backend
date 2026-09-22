import test from 'node:test'
import assert from 'node:assert/strict'
import { matchesLesson } from '../src/search.js'
import { startApi } from './helpers.js'

test('server search matches substrings across topic location price and availability', () => {
  const lesson = { topic: 'Science lab', location: 'Hendon', price: 32, space: 5 }
  for (const query of ['SCI', 'hend', '32', '5', '']) assert.equal(matchesLesson(lesson, query), true)
  for (const query of ['.*', 'missing', '$where']) assert.equal(matchesLesson(lesson, query), false)
})
test('GET passes validated search to the server repository', async t => {
  const api = await startApi(t, { listLessons: async filters => [{ query: filters.query }] })
  assert.deepEqual(await (await api('/lessons?q=hend')).json(), [{ query: 'hend' }])
  assert.equal((await api(`/lessons?q=${'a'.repeat(101)}`)).status, 400)
  assert.equal((await api('/lessons?q=one&q=two')).status, 400)
})
