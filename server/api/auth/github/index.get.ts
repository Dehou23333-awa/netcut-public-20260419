import { randomBytes } from 'node:crypto'
import { sendRedirect, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const clientId = config.githubClientId as string
  const callbackUrl = config.githubCallbackUrl as string

  if (!clientId || !callbackUrl) {
    throw createError({ statusCode: 500, statusMessage: 'GitHub OAuth is not configured' })
  }

  const state = randomBytes(16).toString('hex')
  setCookie(event, 'oauth_github_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10
  })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'read:user user:email',
    state
  })

  return sendRedirect(event, `https://github.com/login/oauth/authorize?${params.toString()}`)
})
