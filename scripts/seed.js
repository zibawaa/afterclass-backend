import { ObjectId } from 'mongodb'
import { connectDatabase } from '../src/database.js'
import { lessons } from '../src/data/lessons.js'
import { teachers } from '../src/data/teachers.js'

const { client, db } = await connectDatabase()
try {
  await db.collection('teachers').bulkWrite(teachers.map(({ _id, ...teacher }) => ({
    updateOne: { filter: { _id }, update: { $setOnInsert: teacher }, upsert: true },
  })))
  // $setOnInsert preserves availability and edits when seeding again.
  const result = await db.collection('lessons').bulkWrite(lessons.map(({ _id, ...lesson }) => ({
    updateOne: { filter: { _id: new ObjectId(_id) }, update: { $setOnInsert: lesson }, upsert: true },
  })))
  console.log(`Added ${result.upsertedCount} lessons; existing lessons were preserved.`)
} finally {
  await client.close()
}
