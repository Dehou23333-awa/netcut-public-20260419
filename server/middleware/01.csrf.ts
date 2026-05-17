export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'production') return
  if (['GET', 'HEAD', 'OPTIONS'].includes(event.method)) return
  if (!event.path.startsWith('/api/')) return

  const origin = getHeader(event, 'origin')
  if (!origin) return

  const proto = getHeader(event, 'x-forwarded-proto') || 'https'
  let host = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || ''
  const defaultPort = proto === 'https' ? '443' : '80'
  if (host.endsWith(`:${defaultPort}`)) host = host.slice(0, -(defaultPort.length + 1))
  const expectedOrigin = `${proto}://${host}`

  if (origin !== expectedOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
})
