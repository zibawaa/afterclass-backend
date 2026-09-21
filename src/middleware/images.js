import express from 'express'
import { fileURLToPath } from 'node:url'

export function imageMiddleware(app) {
  const directory = fileURLToPath(new URL('../../public/images/', import.meta.url))
  app.use('/images', express.static(directory, { dotfiles: 'deny', maxAge: '1h' }))
  app.use('/images', (req, res) => res.status(404).json({ error: 'Lesson image not found.' }))
}
