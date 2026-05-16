const DANGEROUS_TAGS = /<\/?(?:script|iframe|object|embed|form|input|textarea|select|button|style|link|meta|base)\b[^>]*>/gi
const EVENT_HANDLERS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const DANGEROUS_PROTOCOLS = /(?:javascript|data|vbscript)\s*:/gi

export function sanitizeContent(input: string): string {
  return input
    .replace(DANGEROUS_TAGS, '')
    .replace(EVENT_HANDLERS, '')
    .replace(DANGEROUS_PROTOCOLS, '')
}
