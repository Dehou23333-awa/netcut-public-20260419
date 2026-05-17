import { getSessionUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)

  if (!user) {
    return { loggedIn: false, user: null }
  }

  return {
    loggedIn: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    }
  }
})
