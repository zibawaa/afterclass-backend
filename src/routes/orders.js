import { Router } from 'express'
import { validateOrder } from '../validation.js'

export function orderRoutes(repository) {
  const router = Router()
  router.post('/', async (req, res) => {
    const order = await repository.createOrder(validateOrder(req.body))
    // Contact details are deliberately not echoed to the browser.
    res.status(201).json({ _id: order._id, status: order.status, items: order.items })
  })
  return router
}
