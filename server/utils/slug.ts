const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9_-]{1,46}[a-z0-9])?$/

const RESERVED_SLUGS = new Set([
  'api',
  'admin',
  'login',
  'register',
  'me',
  'auth',
  'static',
  'assets',
  'favicon',
  'robots',
  'sitemap'
])

export function normalizeSlug(input: string) {
  return input.trim().toLowerCase()
}

export function validateCustomSlug(slug: string) {
  if (!slug) {
    return { ok: true as const }
  }

  if (slug.length < 3 || slug.length > 48) {
    return { ok: false as const, message: 'Custom link must be 3-48 chars' }
  }

  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false as const, message: 'Custom link allows only a-z, 0-9, _ and -' }
  }

  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false as const, message: 'This custom link is reserved' }
  }

  return { ok: true as const }
}
