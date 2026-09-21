import { createApp } from '../src/app.js'
export async function startApi(t, repository, options = {}) {
  const server = createApp({ repository, ...options }).listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  return (path, method = 'GET', body, headers = {}) => fetch(`http://127.0.0.1:${server.address().port}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
}
