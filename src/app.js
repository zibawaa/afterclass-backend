import express from 'express'
import { lessons } from './data/lessons.js'

export function createApp() {
  const app = express()
  app.use(express.json({ limit: '16kb' }))
  app.get('/lessons', (req, res) => res.json(lessons))
  return app
}
