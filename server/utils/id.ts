import { randomBytes } from 'node:crypto'

export function createPasteId() {
  return randomBytes(8).toString('hex')
}
