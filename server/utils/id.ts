import { randomUUID } from 'node:crypto'

export function createPasteId() {
  return randomUUID().replaceAll('-', '').slice(0, 16)
}
