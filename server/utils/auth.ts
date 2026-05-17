import type { H3Event } from 'h3'
import { getSessionUser } from './session'
import { unauthorized, forbidden } from './errors'

export async function requireUser(event: H3Event) {
  const user = await getSessionUser(event)
  if (!user) {
    unauthorized('Please login first')
  }
  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireUser(event)
  if (!user.isAdmin) {
    forbidden('Admin access required')
  }
  return user
}
