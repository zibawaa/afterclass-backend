import test from 'node:test'
import assert from 'node:assert/strict'
import { connectDatabase } from '../src/database.js'

test('refuses missing credentials and a local MongoDB connection', async () => {
  await assert.rejects(connectDatabase({}), /Atlas/)
  await assert.rejects(connectDatabase({ MONGODB_URI: 'mongodb://localhost:27017' }), /Atlas/)
})
