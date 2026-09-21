import { MongoClient } from 'mongodb'

export async function connectDatabase(env = process.env) {
  if (!env.MONGODB_URI || !/^mongodb\+srv:\/\/[^/]+\.mongodb\.net(?:\/|\?|$)/.test(env.MONGODB_URI)) {
    throw new Error('Set MONGODB_URI to your MongoDB Atlas SRV connection string in .env.')
  }
  const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  await client.connect()
  const db = client.db(env.MONGODB_DB || 'afterclass')
  await db.collection('orders').createIndex({ requestId: 1 }, { unique: true })
  return { client, db }
}
