import { createApp } from './app.js'
import { connectDatabase } from './database.js'
import { createMongoRepository } from './repositories/mongo.js'

const port = process.env.PORT || 3000
try {
  const { client, db } = await connectDatabase()
  const repository = createMongoRepository(db, client)
  const server = createApp({ repository }).listen(port, () => console.log(`AfterClass API listening on port ${port}`))
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => client.close().then(() => process.exit(0))))
  }
} catch (error) {
  console.error('API startup failed. Check Atlas credentials, network access and environment settings.', error.name)
  process.exitCode = 1
}
