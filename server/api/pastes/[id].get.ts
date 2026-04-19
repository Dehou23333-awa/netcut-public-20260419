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

  const paste = await prisma.paste.findUnique({
    where: { id }
  })

  if (!paste) {
    notFound('Paste not found')
  }

  assertNotExpired(paste.expiresAt)

  const user = await getCurrentUser(event)
  const rule = resolveVisibility(paste, user)

  if (!rule.canRead) {
    unauthorized('No access to this paste')
  }

  return {
    ok: true,
    paste: {
      id: paste.id,
      title: paste.title,
      contentRawMarkdown: paste.contentRawMarkdown,
      visibility: paste.visibility,
      expiresAt: paste.expiresAt,
      ownerId: paste.ownerId,
      updatedAt: paste.updatedAt
    },
    permissions: {
      canEdit: rule.canEdit,
      isOwner: rule.isOwner
    }
  }
})
