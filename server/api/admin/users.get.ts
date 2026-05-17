import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      _count: {
        select: { pastes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    ok: true,
    users: users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      pasteCount: user._count.pastes,
      createdAt: user.createdAt
    }))
  }
})
