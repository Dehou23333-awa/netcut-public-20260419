import type { Visibility } from '@prisma/client'
import { getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import { getCurrentUser } from '../../utils/auth'
import { assertNotExpired } from '../../utils/expiry'
import { badRequest, notFound, unauthorized } from '../../utils/errors'
import { prisma } from '../../utils/db'
import { canCreateWithVisibility, resolveVisibility } from '../../utils/visibility'

const schema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  contentRawMarkdown: z.string().min(1).max(120000).optional(),
  visibility: z.enum(['public_edit', 'public_auth_edit', 'public_read', 'private']).optional(),
  expireInHours: z.number().int().min(1).max(24 * 365).nullable().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    notFound('Paste not found')
  }

  const payload = schema.safeParse(await readBody(event))
  if (!payload.success) {
    badRequest('Invalid update payload')
  }

  const paste = await prisma.paste.findUnique({ where: { id } })
  if (!paste) {
    notFound('Paste not found')
  }

  assertNotExpired(paste.expiresAt)

  const user = await getCurrentUser(event)
  const rule = resolveVisibility(paste, user)
  if (!rule.canEdit) {
    unauthorized('No edit permission')
  }

  const nextVisibility = (payload.data.visibility || paste.visibility) as Visibility
  if (!canCreateWithVisibility(nextVisibility, user)) {
    unauthorized('Login required for this visibility mode')
  }

  const expiresAt = payload.data.expireInHours
    ? new Date(Date.now() + payload.data.expireInHours * 60 * 60 * 1000)
    : payload.data.expireInHours === null
      ? null
      : paste.expiresAt

  const updated = await prisma.paste.update({
    where: { id },
    data: {
      title: payload.data.title ?? paste.title,
      contentRawMarkdown: payload.data.contentRawMarkdown ?? paste.contentRawMarkdown,
      visibility: nextVisibility,
      expiresAt
    }
  })

  return {
    ok: true,
    paste: {
      id: updated.id,
      title: updated.title,
      contentRawMarkdown: updated.contentRawMarkdown,
      visibility: updated.visibility,
      expiresAt: updated.expiresAt,
      ownerId: updated.ownerId,
      updatedAt: updated.updatedAt
    }
  }
})
