export function httpError(status, message) {
  return Object.assign(new Error(message), { status })
}
export function validateId(id) {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) throw httpError(400, 'Invalid lesson or order ID.')
  return id
}

export function validateLessonUpdate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || !Object.keys(body).length) throw httpError(400, 'Supply at least one lesson attribute.')
  const textFields = ['topic', 'location', 'category', 'teacherId', 'day', 'time', 'age']
  for (const [key, value] of Object.entries(body)) {
    if (key === 'space') {
      if (!Number.isSafeInteger(value) || value < 0 || value > 10000) throw httpError(400, 'Space must be a whole number from 0 to 10000.')
    } else if (key === 'price') {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100000) throw httpError(400, 'Price must be a non-negative number up to 100000.')
    } else if (textFields.includes(key)) {
      if (typeof value !== 'string' || !value.trim() || value.length > 120) throw httpError(400, `${key} must be nonempty text of at most 120 characters.`)
    } else if (key === 'image') {
      if (typeof value !== 'string' || !/^\/images\/[a-z0-9-]+\.(svg|png|jpg|webp)$/.test(value)) throw httpError(400, 'Image must be a local /images/ filename.')
    } else throw httpError(400, `Unsupported lesson attribute: ${key}`)
  }
  return body
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
