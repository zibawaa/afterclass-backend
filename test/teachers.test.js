import test from 'node:test'
import assert from 'node:assert/strict'
import { startApi } from './helpers.js'
test('lists teachers and forwards teacher choice together with search', async t => {
  const teachers = [{ _id: 'maya-patel', firstName: 'Maya', lastName: 'Patel' }]
  const api = await startApi(t, { listTeachers: async () => teachers, listLessons: async filters => [filters] })
  assert.deepEqual(await (await api('/teachers')).json(), teachers)
  assert.deepEqual(await (await api('/lessons?q=art&teacher=maya-patel')).json(), [{ query: 'art', teacherId: 'maya-patel' }])
  assert.equal((await api('/lessons?teacher=%24where')).status, 400)
})
