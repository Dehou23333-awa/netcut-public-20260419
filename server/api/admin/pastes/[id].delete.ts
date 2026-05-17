import { getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/db'
import { notFound } from '../../../utils/errors'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    notFound('Paste not found')
  }

  const paste = await prisma.paste.findUnique({ where: { id } })
  if (!paste) {
    notFound('Paste not found')
  }

  await prisma.paste.delete({ where: { id } })

  return { ok: true }
})
