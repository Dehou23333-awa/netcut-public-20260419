import type { Visibility } from '@prisma/client'
import { readBody } from 'h3'
import { z } from 'zod'
import { getCurrentUser } from '../../utils/auth'
import { prisma } from '../../utils/db'
import { badRequest, unauthorized } from '../../utils/errors'
import { createPasteId } from '../../utils/id'
import { canCreateWithVisibility } from '../../utils/visibility'

const schema = z.object({
  title: z.string().trim().min(1).max(120),
  contentRawMarkdown: z.string().min(1).max(120000),
  visibility: z.enum(['public_edit', 'public_auth_edit', 'public_read', 'private']).default('public_read'),
  expireInHours: z.number().int().min(1).max(24 * 365).nullable().optional()
})

export default defineEventHandler(async (event) => {
  const payload = schema.safeParse(await readBody(event))
  if (!payload.success) {
    badRequest('Invalid paste payload')
  }

  const user = await getCurrentUser(event)
  const visibility = payload.data.visibility as Visibility

  if (!canCreateWithVisibility(visibility, user)) {
    unauthorized('Login required for this visibility mode')
  }

  const expiresAt = payload.data.expireInHours
    ? new Date(Date.now() + payload.data.expireInHours * 60 * 60 * 1000)
    : null

  const paste = await prisma.paste.create({
    data: {
      id: createPasteId(),
      title: payload.data.title,
      contentRawMarkdown: payload.data.contentRawMarkdown,
      visibility,
      expiresAt,
      ownerId: user?.id
    }
  })

  return {
    ok: true,
    paste: {
      id: paste.id,
      title: paste.title,
      visibility: paste.visibility,
      expiresAt: paste.expiresAt,
      ownerId: paste.ownerId,
      createdAt: paste.createdAt
    }
  }
})
