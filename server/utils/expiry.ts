import { gone } from './errors'

export function isExpired(expiresAt: Date | null) {
  return Boolean(expiresAt && expiresAt.getTime() <= Date.now())
}

export function assertNotExpired(expiresAt: Date | null) {
  if (isExpired(expiresAt)) {
    gone('This paste has expired')
  }
}
