export function cors(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.get('Origin')
    res.vary('Origin')
    if (origin) {
      if (!allowedOrigins.includes(origin)) return res.status(403).json({ error: 'This browser origin is not allowed.' })
      res.set('Access-Control-Allow-Origin', origin)
      res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
      res.set('Access-Control-Allow-Headers', 'Content-Type')
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
  }
}
