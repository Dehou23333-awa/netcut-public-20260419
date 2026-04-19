type AuthUser = {
  id: string
  username: string
  email: string | null
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
    await $fetch('/api/auth/logout', { method: 'POST' })
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
