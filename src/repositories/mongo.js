import { ObjectId } from 'mongodb'
import { httpError } from '../validation.js'

export function createMongoRepository(db, client) {
  const lessons = db.collection('lessons')
  const orders = db.collection('orders')
  return {
    ping: () => db.command({ ping: 1 }),
    listLessons: () => lessons.find({}).toArray(),
    updateLesson: (id, changes) => lessons.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: changes }, { returnDocument: 'after' }),
    async completeOrder(orderId, lessonId, space) {
      const session = client.startSession()
      try {
        return await session.withTransaction(async () => {
          const order = await orders.findOne({ _id: new ObjectId(orderId) }, { session })
          if (!order) throw httpError(404, 'Order not found.')
          const selected = order.items.find(item => item.lessonId === lessonId)
          if (!selected || selected.spaceAfter !== space) throw httpError(400, 'Space value does not match this order.')
          if (order.status !== 'confirmed') {
            // The first PUT commits ALL order lines together. Either every
            // activity is booked, or the transaction changes nothing.
            for (const item of order.items) {
              const result = await lessons.updateOne(
                { _id: new ObjectId(item.lessonId), space: item.spaceBefore, price: item.price },
                { $set: { space: item.spaceAfter } }, { session },
              )
              if (!result.matchedCount) throw httpError(409, 'Availability or price changed. Refresh the catalogue and choose your spaces again.')
            }
            await orders.updateOne({ _id: order._id }, { $set: { status: 'confirmed', confirmedAt: new Date() } }, { session })
          }
          // Retrying a successful checkout never reduces availability twice.
          return lessons.findOne({ _id: new ObjectId(lessonId) }, { session })
        })
      } finally {
        await session.endSession()
      }
    },
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
