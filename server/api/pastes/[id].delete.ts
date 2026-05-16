import { getRouterParam } from 'h3'
import { getSessionUser } from '../../utils/session'
import { prisma } from '../../utils/db'
import { unauthorized } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    unauthorized('Cannot delete this paste')
  }

  const user = await getSessionUser(event)
  if (!user) {
    unauthorized('Login required')
  }

  const result = await prisma.paste.deleteMany({
    where: {
      id,
      ownerId: user.id,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } }
      ]
    }
  })

  if (result.count === 0) {
    unauthorized('Cannot delete this paste')
  }

  return { ok: true }
})
