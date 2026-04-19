import { createError } from 'h3'

export function badRequest(message: string) {
  throw createError({ statusCode: 400, statusMessage: message })
}

export function unauthorized(message = 'Unauthorized') {
  throw createError({ statusCode: 401, statusMessage: message })
}

export function forbidden(message = 'Forbidden') {
  throw createError({ statusCode: 403, statusMessage: message })
}

export function notFound(message = 'Not Found') {
  throw createError({ statusCode: 404, statusMessage: message })
}

export function gone(message = 'Expired') {
  throw createError({ statusCode: 410, statusMessage: message })
}
