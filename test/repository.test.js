import test from 'node:test'
import assert from 'node:assert/strict'
import { createMongoRepository } from '../src/repositories/mongo.js'
import { testDatabase } from './support/database.js'

const one = '000000000000000000000001'
const two = '000000000000000000000002'
const customer = { name: 'Ali', phone: '07700123456', requestId: 'checkout-123456789', items: [{ lessonId: one, quantity: 2 }] }
const setup = () => { const { db, client } = testDatabase(); return createMongoRepository(db, client) }

test('retrying POST and PUT keeps one order and decrements stock once', async () => {
  const repository = setup()
  const order = await repository.createOrder(customer)
  const retry = await repository.createOrder(customer)
  assert.equal(String(order._id), String(retry._id))
  assert.equal(order.numberOfSpaces, 2)
  await repository.completeOrder(String(order._id), one, 3)
  await repository.completeOrder(String(order._id), one, 3)
  assert.equal((await repository.listLessons()).find(lesson => String(lesson._id) === one).space, 3)
  assert.equal((await repository.createOrder(customer)).status, 'confirmed')
})
test('a conflict on the second lesson rolls back the first lesson too', async () => {
  const repository = setup()
  const order = await repository.createOrder({ ...customer, items: [{ lessonId: one, quantity: 2 }, { lessonId: two, quantity: 1 }] })
  await repository.updateLesson(two, { space: 0 })
  await assert.rejects(repository.completeOrder(String(order._id), one, 3), error => error.status === 409)
  const rows = await repository.listLessons()
  assert.equal(rows.find(lesson => String(lesson._id) === one).space, 5)
  assert.equal(rows.find(lesson => String(lesson._id) === two).space, 0)
  assert.equal((await repository.createOrder({ ...customer, items: [{ lessonId: one, quantity: 2 }, { lessonId: two, quantity: 1 }] })).status, 'pending')
})
test('same request ID cannot be reused for another customer or quantity', async () => {
  const repository = setup()
  await repository.createOrder(customer)
  await assert.rejects(repository.createOrder({ ...customer, name: 'Other' }), error => error.status === 409)
})
test('teacher and search filters combine on the server', async () => {
  const repository = setup()
  const rows = await repository.listLessons({ query: '40', teacherId: 'maya-patel' })
  assert.equal(rows.length, 1)
  assert.equal(rows[0].topic, 'Piano explorers')
})
