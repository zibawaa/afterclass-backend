export function httpError(status, message) {
  return Object.assign(new Error(message), { status })
}
export function validateId(id) {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) throw httpError(400, 'Invalid lesson or order ID.')
  return id
}
export function validateOrder(body) {
  if (!body || typeof body !== 'object' || !/^[A-Za-z]{1,80}$/.test(body.name ?? '') || typeof body.name !== 'string') throw httpError(400, 'Name must contain letters only.')
  if (typeof body.phone !== 'string' || !/^[0-9]{1,20}$/.test(body.phone)) throw httpError(400, 'Phone must contain numbers only.')
  if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(body.requestId)) throw httpError(400, 'A valid checkout request ID is required.')
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 100) throw httpError(400, 'Choose between 1 and 100 activities.')
  const ids = new Set()
  const items = body.items.map(item => {
    validateId(item?.lessonId)
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw httpError(400, 'Quantity must be a whole number from 1 to 100.')
    const lessonId = item.lessonId.toLowerCase()
    if (ids.has(lessonId)) throw httpError(400, 'Combine repeated lessons into one quantity.')
    ids.add(lessonId)
    return { lessonId, quantity: item.quantity }
  })
  return { name: body.name, phone: body.phone, requestId: body.requestId, items }
}
