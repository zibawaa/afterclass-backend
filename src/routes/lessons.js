import { Router } from 'express'
import { httpError, validateId, validateLessonUpdate } from '../validation.js'

export function lessonRoutes(repository) {
  const router = Router()
  router.get('/', async (req, res) => {
    const query = req.query.q ?? ''
    const teacherId = req.query.teacher ?? ''
    if (typeof query !== 'string' || query.length > 100) throw httpError(400, 'Search must be text of at most 100 characters.')
    if (typeof teacherId !== 'string' || !/^[a-z0-9-]{0,80}$/.test(teacherId)) throw httpError(400, 'Invalid teacher selection.')
    res.json(await repository.listLessons({ query, teacherId }))
  })
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
