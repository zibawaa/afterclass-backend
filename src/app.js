import express from 'express'
import { orderRoutes } from './routes/orders.js'
import { logger } from './middleware/logger.js'
import { imageMiddleware } from './middleware/images.js'
import { lessonRoutes } from './routes/lessons.js'
import { cors } from './middleware/cors.js'

export function createApp({ repository, log = console.log, allowedOrigins = ['http://localhost:5173', 'https://zibawaa.github.io'] }) {
  const app = express()
  app.use(logger(log))
  app.use(cors(allowedOrigins))
  imageMiddleware(app)
  app.use(express.json({ limit: '16kb' }))
  app.get('/health', async (req, res) => {
    await repository.ping()
    res.json({ status: 'ok' })
  })
  app.use('/lessons', lessonRoutes(repository))
  app.use('/orders', orderRoutes(repository))
  app.use((req, res) => res.status(404).json({ error: 'Route not found.' }))
  app.use((error, req, res, next) => {
    if (!error.status || error.status >= 500) console.error('Request failed:', error.name)
    res.status(error.status || 500).json({ error: error.status ? error.message : 'The service could not complete this request.' })
  })
  return app
}
