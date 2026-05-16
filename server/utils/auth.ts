import type { H3Event } from 'h3'
import { getSessionUser } from './session'
import { unauthorized } from './errors'

export async function requireUser(event: H3Event) {
  const user = await getSessionUser(event)
  if (!user) {
    unauthorized('Please login first')
  }
  return user
}
