import { ObjectId } from 'mongodb'
import { connectDatabase } from '../src/database.js'
import { lessons } from '../src/data/lessons.js'

const { client, db } = await connectDatabase()
try {
  // $setOnInsert preserves availability and edits when seeding again.
  const result = await db.collection('lessons').bulkWrite(lessons.map(({ _id, ...lesson }) => ({
    updateOne: { filter: { _id: new ObjectId(_id) }, update: { $setOnInsert: lesson }, upsert: true },
  })))
  console.log(`Added ${result.upsertedCount} lessons; existing lessons were preserved.`)
} finally {
  await client.close()
}
