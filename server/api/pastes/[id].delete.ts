import { getRouterParam } from 'h3'
import { getCurrentUser } from '../../utils/auth'
import { assertNotExpired } from '../../utils/expiry'
import { notFound, unauthorized } from '../../utils/errors'
import { prisma } from '../../utils/db'
import { resolveVisibility } from '../../utils/visibility'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    notFound('Paste not found')
  }

  const paste = await prisma.paste.findUnique({ where: { id } })
  if (!paste) {
    notFound('Paste not found')
  }

  assertNotExpired(paste.expiresAt)

  const user = await getCurrentUser(event)
  const rule = resolveVisibility(paste, user)
  if (!rule.isOwner) {
    unauthorized('Only owner can delete')
  }

  await prisma.paste.delete({ where: { id } })

  return { ok: true }
})
