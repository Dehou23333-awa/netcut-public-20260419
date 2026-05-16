import type { Visibility } from '@prisma/client'
import { readBody } from 'h3'
import { z } from 'zod'
import { getSessionUser } from '../../utils/session'
import { prisma } from '../../utils/db'
import { badRequest, unauthorized } from '../../utils/errors'
import { createPasteId } from '../../utils/id'
import { normalizeSlug, validateCustomSlug } from '../../utils/slug'
import { canCreateWithVisibility } from '../../utils/visibility'
import { sanitizeContent } from '../../utils/sanitize'

const schema = z.object({
  customSlug: z.string().trim().min(3).max(48).optional().or(z.literal('')),
  contentRawMarkdown: z.string().min(1).max(120000),
  visibility: z.enum(['public_edit', 'public_auth_edit', 'public_read', 'private']).default('public_read'),
  expireInHours: z.number().int().min(1).max(24 * 365).nullable().optional()
})

export default defineEventHandler(async (event) => {
  const payload = schema.safeParse(await readBody(event))
  if (!payload.success) {
    badRequest('Invalid paste payload')
  }

  const user = await getSessionUser(event)
  const visibility = payload.data.visibility as Visibility

  if (!canCreateWithVisibility(visibility, user)) {
    unauthorized('Login required for this visibility mode')
  }

  const expiresAt = payload.data.expireInHours
    ? new Date(Date.now() + payload.data.expireInHours * 60 * 60 * 1000)
    : null

  const normalizedSlug = normalizeSlug(payload.data.customSlug || '')
  const slugValidation = validateCustomSlug(normalizedSlug)
  if (!slugValidation.ok) {
    badRequest(slugValidation.message)
  }

  const nextId = normalizedSlug || createPasteId()

  const existed = await prisma.paste.findUnique({ where: { id: nextId } })
  if (existed) {
    badRequest('Custom link already exists')
  }

  const paste = await prisma.paste.create({
    data: {
      id: nextId,
      title: '',
      contentRawMarkdown: sanitizeContent(payload.data.contentRawMarkdown),
      visibility,
      expiresAt,
      ownerId: user?.id
    }
  })

  return {
    ok: true,
    paste: {
      id: paste.id,
      visibility: paste.visibility,
      expiresAt: paste.expiresAt,
      ownerId: paste.ownerId,
      createdAt: paste.createdAt
    }
  }
})
