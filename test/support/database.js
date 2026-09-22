// Test-only driver substitute. Production always connects to MongoDB Atlas.
import { ObjectId } from 'mongodb'
import { lessons } from '../../src/data/lessons.js'
import { teachers } from '../../src/data/teachers.js'

export function testDatabase() {
  let state = {
    lessons: lessons.map(lesson => ({ ...lesson, _id: new ObjectId(lesson._id) })),
    teachers: teachers.map(teacher => ({ ...teacher })), orders: [],
  }
  const equal = (a, b) => a instanceof ObjectId || b instanceof ObjectId ? String(a) === String(b) : a === b
  const match = (row, query) => Object.entries(query).every(([key, value]) => equal(row[key], value))
  const clone = value => JSON.parse(JSON.stringify(value), (key, item) => key === '_id' && /^[0-9a-f]{24}$/.test(item) ? new ObjectId(item) : item)
  const db = {
    command: async () => ({ ok: 1 }),
    collection(name) {
      return {
        find(query = {}) {
          let rows = state[name].filter(row => match(row, query))
          return { sort(order) { const key = Object.keys(order)[0]; rows.sort((a, b) => String(a[key]).localeCompare(String(b[key]))); return this }, toArray: async () => clone(rows) }
        },
        findOne: async query => clone(state[name].find(row => match(row, query)) || null),
        async insertOne(document) {
          if (state[name].some(row => row.requestId === document.requestId)) throw Object.assign(new Error('Duplicate'), { code: 11000 })
          const _id = document._id || new ObjectId()
          state[name].push(clone({ ...document, _id }))
          return { insertedId: _id }
        },
        async updateOne(query, update) {
          const row = state[name].find(row => match(row, query))
          if (!row) return { matchedCount: 0 }
          Object.assign(row, update.$set)
          return { matchedCount: 1 }
        },
        async findOneAndUpdate(query, update) {
          await this.updateOne(query, update)
          return this.findOne(query)
        },
      }
    },
  }
  const client = {
    startSession: () => ({
      async withTransaction(work) {
        const before = clone(state)
        try { return await work() } catch (error) { state = before; throw error }
      },
      endSession: async () => {},
    }),
  }
  return { db, client }
}
