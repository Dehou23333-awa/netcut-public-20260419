import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/db'
import { isExpired } from '../../utils/expiry'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const pastes = await prisma.paste.findMany({
    include: {
      owner: {
        select: { id: true, username: true, email: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  return {
    ok: true,
    pastes: pastes.map((paste) => ({
      id: paste.id,
      visibility: paste.visibility,
      expiresAt: paste.expiresAt,
      expired: isExpired(paste.expiresAt),
      ownerId: paste.ownerId,
      ownerName: paste.owner?.username ?? null,
      createdAt: paste.createdAt,
      updatedAt: paste.updatedAt
    }))
  }
})
