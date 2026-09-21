import express from 'express'
import { orderRoutes } from './routes/orders.js'
import { logger } from './middleware/logger.js'
import { imageMiddleware } from './middleware/images.js'

export function createApp({ repository, log = console.log }) {
  const app = express()
  app.use(logger(log))
  imageMiddleware(app)
  app.use(express.json({ limit: '16kb' }))
  app.get('/lessons', async (req, res) => res.json(await repository.listLessons()))
  app.use('/orders', orderRoutes(repository))
  app.use((req, res) => res.status(404).json({ error: 'Route not found.' }))
  app.use((error, req, res, next) => {
    if (!error.status || error.status >= 500) console.error('Request failed:', error.name)
    res.status(error.status || 500).json({ error: error.status ? error.message : 'The service could not complete this request.' })
  })
  return app
}
