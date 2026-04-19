import type { Paste, User, Visibility } from '@prisma/client'

type CurrentUser = Pick<User, 'id'> | null

type VisibilityFlags = {
  canRead: boolean
  canEdit: boolean
  isOwner: boolean
}

export function resolveVisibility(paste: Pick<Paste, 'visibility' | 'ownerId'>, currentUser: CurrentUser): VisibilityFlags {
  const isOwner = Boolean(currentUser && paste.ownerId && currentUser.id === paste.ownerId)

  if (isOwner) {
    return { canRead: true, canEdit: true, isOwner: true }
  }

  switch (paste.visibility as Visibility) {
    case 'private':
      return { canRead: false, canEdit: false, isOwner: false }
    case 'public_read':
      return { canRead: true, canEdit: false, isOwner: false }
    case 'public_auth_edit':
      return { canRead: true, canEdit: Boolean(currentUser), isOwner: false }
    case 'public_edit':
      return { canRead: true, canEdit: true, isOwner: false }
    default:
      return { canRead: false, canEdit: false, isOwner: false }
  }
}

export function canCreateWithVisibility(visibility: Visibility, currentUser: CurrentUser) {
  if (!currentUser) {
    return visibility === 'public_read'
  }
  return true
}
