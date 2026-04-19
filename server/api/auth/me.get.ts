import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    return { loggedIn: false, user: null }
  }

  return {
    loggedIn: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
})
