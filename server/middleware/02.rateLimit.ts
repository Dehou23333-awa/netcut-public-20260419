const limits = new Map<string, { count: number; resetAt: number }>()

const RULES: Array<{ prefix: string; max: number; windowMs: number }> = [
  { prefix: '/api/auth/login', max: 10, windowMs: 60_000 },
  { prefix: '/api/auth/register', max: 5, windowMs: 60_000 },
  { prefix: '/api/pastes', max: 30, windowMs: 60_000 }
]

const DEFAULT_MAX = 60
const DEFAULT_WINDOW_MS = 60_000

function getClientIP(event: any): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return event.node?.req?.socket?.remoteAddress || 'unknown'
}

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of limits) {
    if (now >= entry.resetAt) limits.delete(key)
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 60_000)
}

export default defineEventHandler(async (event) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(event.method)) return

  const path = event.path
  let rule = RULES.find((r) => path.startsWith(r.prefix))
  if (!rule) {
    if (!path.startsWith('/api/')) return
    rule = { prefix: path, max: DEFAULT_MAX, windowMs: DEFAULT_WINDOW_MS }
  }

  const ip = getClientIP(event)
  const key = `${ip}:${rule.prefix}`
  const now = Date.now()

  const entry = limits.get(key)
  if (!entry || now >= entry.resetAt) {
    limits.set(key, { count: 1, resetAt: now + rule.windowMs })
    return
  }

  if (entry.count >= rule.max) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  entry.count++
})
