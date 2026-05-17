type AuthUser = {
  id: string
  username: string
  email: string | null
  isAdmin: boolean
}

type AuthResponse = {
  loggedIn: boolean
  user: AuthUser | null
}

export function useAuthState() {
  const auth = useState<AuthResponse>('auth-state', () => ({
    loggedIn: false,
    user: null
  }))

  const pending = useState<boolean>('auth-pending', () => false)

  const refresh = async () => {
    pending.value = true
    try {
      auth.value = await $fetch<AuthResponse>('/api/auth/me')
    } finally {
      pending.value = false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Server error — still clear local state
    }
    auth.value = { loggedIn: false, user: null }
    await navigateTo('/')
  }

  return {
    auth,
    pending,
    refresh,
    logout
  }
}
