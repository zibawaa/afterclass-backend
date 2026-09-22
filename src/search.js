// Literal substring search, including numeric fields, as in the coursework
// example. Runs only on the server; no regex is built from user input.
export function matchesLesson(lesson, query) {
  const term = query.trim().toLowerCase()
  return ['topic', 'location', 'price', 'space'].some(field => String(lesson[field]).toLowerCase().includes(term))
}
