export function logger(write = console.log) {
  return (req, res, next) => {
    const started = performance.now()
    const path = req.path
    res.on('finish', () => {
      write(`${new Date().toISOString()} ${req.method} ${path} ${res.statusCode} ${Math.round(performance.now() - started)}ms`)
    })
    next()
  }
}
