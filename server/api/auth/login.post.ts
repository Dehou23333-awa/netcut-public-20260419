import { readBody } from 'h3'
import { z } from 'zod'
import { prisma } from '../../utils/db'
import { badRequest, unauthorized } from '../../utils/errors'
import { verifyPassword } from '../../utils/password'
import { createSession, setSessionCookie } from '../../utils/session'

const schema = z.object({
  identifier: z.string().trim().min(3).max(128),
  password: z.string().min(8).max(128)
})

export default defineEventHandler(async (event) => {
  const payload = schema.safeParse(await readBody(event))
  if (!payload.success) {
    badRequest('Invalid login payload')
  }

  const identifier = payload.data.identifier.toLowerCase()
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }]
    }
  })

  if (!user?.passwordHash) {
    unauthorized('Invalid credentials')
  }

  const valid = await verifyPassword(payload.data.password, user.passwordHash)
  if (!valid) {
    unauthorized('Invalid credentials')
  }

  const session = await createSession(user.id)
  setSessionCookie(event, session.token, session.expiresAt)

  return {
    ok: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
})
