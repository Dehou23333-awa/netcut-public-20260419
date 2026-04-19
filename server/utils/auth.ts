import type { H3Event } from 'h3'
import { getSessionUser } from './session'
import { unauthorized } from './errors'

export async function getCurrentUser(event: H3Event) {
  return getSessionUser(event)
}

export async function requireUser(event: H3Event) {
  const user = await getCurrentUser(event)
  if (!user) {
    unauthorized('Please login first')
  }
  return user
}
