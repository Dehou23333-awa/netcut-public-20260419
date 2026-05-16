import { deleteCookie, getCookie, getQuery, sendRedirect } from 'h3'
import { prisma } from '../../../utils/db'
import { createSession, setSessionCookie } from '../../../utils/session'

type GithubTokenResponse = {
  access_token?: string
  error?: string
}

type GithubEmail = {
  email: string
  primary: boolean
  verified: boolean
}

type GithubProfile = {
  id: number
  login: string
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string | undefined
  const state = query.state as string | undefined
  const cookieState = getCookie(event, 'oauth_github_state')
  deleteCookie(event, 'oauth_github_state', { path: '/' })

  if (!code || !state || state !== cookieState) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid OAuth state' })
  }

  const config = useRuntimeConfig(event)
  const tokenResponse = await $fetch<GithubTokenResponse>('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: {
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
      redirect_uri: config.githubCallbackUrl
    }
  })

  if (!tokenResponse.access_token) {
    throw createError({ statusCode: 401, statusMessage: 'GitHub OAuth failed' })
  }

  const profile = await $fetch<GithubProfile>('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
      Accept: 'application/vnd.github+json'
    }
  })

  const emails = await $fetch<GithubEmail[]>('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
      Accept: 'application/vnd.github+json'
    }
  }).catch(() => [])

  const primaryEmail = emails.find((item) => item.primary && item.verified)?.email?.toLowerCase()
  const githubId = String(profile.id)
  const baseUsername = profile.login.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 18) || `gh${githubId}`

  const { user, session } = await prisma.$transaction(async (tx) => {
    let existingUser = await tx.user.findFirst({
      where: {
        OR: [{ githubId }, ...(primaryEmail ? [{ email: primaryEmail }] : [])]
      }
    })

    if (!existingUser) {
      let username = baseUsername
      let suffix = 1

      while (await tx.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${suffix}`.slice(0, 24)
        suffix += 1
      }

      existingUser = await tx.user.create({
        data: {
          username,
          email: primaryEmail,
          githubId
        }
      })
    } else if (!existingUser.githubId) {
      existingUser = await tx.user.update({
        where: { id: existingUser.id },
        data: { githubId }
      })
    }

    const newSession = await createSession(existingUser.id)

    return { user: existingUser, session: newSession }
  })

  setSessionCookie(event, session.token, session.expiresAt)

  return sendRedirect(event, '/')
})
