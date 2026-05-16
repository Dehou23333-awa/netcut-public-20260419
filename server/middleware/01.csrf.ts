export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'production') return
  if (['GET', 'HEAD', 'OPTIONS'].includes(event.method)) return
  if (!event.path.startsWith('/api/')) return

  const origin = getHeader(event, 'origin')
  if (!origin) return

  const url = getRequestURL(event)
  const expectedOrigin = `${url.protocol}//${url.host}`

  if (origin !== expectedOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
})
