import { Router } from 'express'
import { httpError, validateId, validateLessonUpdate } from '../validation.js'

export function lessonRoutes(repository) {
  const router = Router()
  router.get('/', async (req, res) => res.json(await repository.listLessons()))
  router.put('/:id', async (req, res) => {
    const id = validateId(req.params.id).toLowerCase()
    if (req.body?.orderId !== undefined) {
      const { orderId, ...changes } = req.body
      validateId(orderId)
      validateLessonUpdate(changes)
      if (Object.keys(changes).length !== 1 || changes.space === undefined) throw httpError(400, 'Order checkout only updates space.')
      return res.json(await repository.completeOrder(orderId, id, changes.space))
    }
    const lesson = await repository.updateLesson(id, validateLessonUpdate(req.body))
    if (!lesson) throw httpError(404, 'Lesson not found.')
    res.json(lesson)
  })
  return router
}
