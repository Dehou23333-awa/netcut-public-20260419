import { createHash, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'
import { deleteCookie, getCookie, setCookie } from 'h3'
import { prisma } from './db'

const DEFAULT_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS || 24 * 7)
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'netcut_session'

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + DEFAULT_TTL_HOURS * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt
    }
  })

  return { token, expiresAt }
}

export async function getSessionUser(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true }
  })

  if (!session) {
    return null
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined)
    return null
  }

  return session.user
}

export function setSessionCookie(event: H3Event, token: string, expiresAt: Date) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  })
}

export async function clearAuthSession(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => undefined)
  }

  deleteCookie(event, COOKIE_NAME, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
}
