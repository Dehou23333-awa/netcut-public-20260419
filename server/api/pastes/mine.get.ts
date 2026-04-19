import { requireUser } from '../../utils/auth'
import { prisma } from '../../utils/db'
import { isExpired } from '../../utils/expiry'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const pastes = await prisma.paste.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' }
  })

  return {
    ok: true,
    pastes: pastes.map((paste) => ({
      id: paste.id,
      visibility: paste.visibility,
      expiresAt: paste.expiresAt,
      expired: isExpired(paste.expiresAt),
      updatedAt: paste.updatedAt
    }))
  }
})
