import { ObjectId } from 'mongodb'
import { httpError } from '../validation.js'

export function createMongoRepository(db, client) {
  const lessons = db.collection('lessons')
  const orders = db.collection('orders')
  return {
    listLessons: () => lessons.find({}).toArray(),
    async createOrder(input) {
      const fingerprint = JSON.stringify({ name: input.name, phone: input.phone, items: input.items })
      const existing = await orders.findOne({ requestId: input.requestId })
      if (existing) {
        if (existing.fingerprint !== fingerprint) throw httpError(409, 'This request ID already belongs to another checkout.')
        return existing
      }
      const items = []
      for (const item of input.items) {
        const lesson = await lessons.findOne({ _id: new ObjectId(item.lessonId) })
        if (!lesson) throw httpError(404, 'An activity no longer exists. Refresh the catalogue.')
        if (lesson.space < item.quantity) throw httpError(409, 'Availability has changed. Refresh the catalogue and choose your spaces again.')
        items.push({ ...item, price: lesson.price, spaceBefore: lesson.space, spaceAfter: lesson.space - item.quantity })
      }
      const order = { ...input, items, fingerprint, lessonIDs: items.map(item => new ObjectId(item.lessonId)), numberOfSpaces: items.reduce((sum, item) => sum + item.quantity, 0), status: 'pending', createdAt: new Date() }
      try {
        const result = await orders.insertOne(order)
        return { ...order, _id: result.insertedId }
      } catch (error) {
        // A concurrent retry may have inserted the same unique requestId.
        if (error.code === 11000) {
          const duplicate = await orders.findOne({ requestId: input.requestId })
          if (duplicate?.fingerprint === fingerprint) return duplicate
          throw httpError(409, 'This request ID already belongs to another checkout.')
        }
        throw error
      }
    },
  }
}
