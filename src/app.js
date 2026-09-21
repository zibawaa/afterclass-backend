import express from 'express'
import { orderRoutes } from './routes/orders.js'

export function createApp({ repository }) {
  const app = express()
  app.use(express.json({ limit: '16kb' }))
  app.get('/lessons', async (req, res) => res.json(await repository.listLessons()))
  app.use('/orders', orderRoutes(repository))
  app.use((error, req, res, next) => {
    console.error('Request failed:', error.name)
    res.status(error.status || 500).json({ error: error.status ? error.message : 'The service could not complete this request.' })
  })
  return app
}
