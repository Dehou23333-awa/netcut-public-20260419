import { getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/db'
import { badRequest, notFound } from '../../../utils/errors'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    notFound('User not found')
  }

  if (id === admin.id) {
    badRequest('Cannot delete yourself')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    notFound('User not found')
  }

  await prisma.user.delete({ where: { id } })

  return { ok: true }
})
