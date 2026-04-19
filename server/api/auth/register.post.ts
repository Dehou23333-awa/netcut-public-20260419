import { readBody } from 'h3'
import { z } from 'zod'
import { prisma } from '../../utils/db'
import { badRequest } from '../../utils/errors'
import { hashPassword } from '../../utils/password'
import { createSession, setSessionCookie } from '../../utils/session'

const schema = z.object({
  username: z.string().trim().min(3).max(24).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().trim().email().optional(),
  password: z.string().min(8).max(128)
})

export default defineEventHandler(async (event) => {
  const payload = schema.safeParse(await readBody(event))
  if (!payload.success) {
    badRequest('Invalid register payload')
  }

  const username = payload.data.username.toLowerCase()
  const email = payload.data.email?.toLowerCase()

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ username }, ...(email ? [{ email }] : [])]
    }
  })

  if (exists) {
    badRequest('Username or email already exists')
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: await hashPassword(payload.data.password)
    }
  })

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
