import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'

test('GET /lessons returns ten activities with five spaces', async (t) => {
  const server = createApp().listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const response = await fetch(`http://127.0.0.1:${server.address().port}/lessons`)
  assert.equal(response.status, 200)
  const lessons = await response.json()
  assert.equal(lessons.length, 10)
  assert.ok(lessons.every(lesson => lesson.space === 5))
})
