/**
 * Email Data Breach Check Utilities
 * Strictly validates email format and parses XposedOrNot API responses.
 * Never stores or logs user email addresses.
 */

export interface BreachDetail {
  name: string
  breachedDate?: string
  exposedData?: string[]
  description?: string
  domain?: string
  recordsCount?: number
}

export interface EmailBreachResult {
  emailMasked: string
  breached: boolean
  count: number
  breaches: BreachDetail[]
  message?: string
}

/**
 * Strict RFC 5322 compliant regex for practical email validation.
 * Rejects whitespace, URLs, phone numbers, arbitrary text, and invalid domains.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

/**
 * Validates whether an input is a strictly valid email address.
 * Trims whitespace, rejects empty input, phone numbers, URLs, and malformed strings.
 */
export function validateEmail(input: unknown): { valid: boolean; email?: string; error?: string } {
  if (typeof input !== 'string') {
    return { valid: false, error: 'Email must be a text value' }
  }

  const trimmed = input.trim()

  if (!trimmed) {
    return { valid: false, error: 'Email address is required' }
  }

  // Reject URLs
  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address, not a website URL' }
  }

  // Reject phone numbers (e.g. +91..., 10 digits)
  if (/^(\+?\d[\d\s\-()]{6,}\d)$/.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address, not a phone number' }
  }

  // Length limits per RFC 5321
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email address exceeds maximum length of 254 characters' }
  }

  const parts = trimmed.split('@')
  if (parts.length !== 2) {
    return { valid: false, error: 'Email must contain exactly one "@" symbol' }
  }

  const [localPart, domainPart] = parts

  if (localPart.length === 0 || localPart.length > 64) {
    return { valid: false, error: 'Email username must be between 1 and 64 characters' }
  }

  if (domainPart.length === 0 || domainPart.length > 253) {
    return { valid: false, error: 'Email domain part is invalid' }
  }

  // Must have a valid top-level domain of at least 2 alpha characters
  const domainLabels = domainPart.split('.')
  if (domainLabels.length < 2) {
    return { valid: false, error: 'Email must include a valid top-level domain (e.g. .com, .in)' }
  }

  const tld = domainLabels[domainLabels.length - 1]
  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return { valid: false, error: 'Top-level domain must contain only letters and be at least 2 characters' }
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email format (e.g. user@example.com)' }
  }

  return { valid: true, email: trimmed.toLowerCase() }
}

/**
 * Masks an email for safe client-side display without exposing full personal identifier.
 * Example: 'karthik@example.com' -> 'k***k@example.com'
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  if (local.length <= 2) {
    return `${local[0] || '*'}***@${domain}`
  }
  return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}@${domain}`
}

/**
 * Normalizes raw breaches from XposedOrNot response into clean array of breach names.
 * Handles both `[["Adobe", "Canva"]]` and `["Adobe", "Canva"]` formats.
 */
export function extractBreachNames(rawData: unknown): string[] {
  if (!rawData || typeof rawData !== 'object') return []

  const data = rawData as { breaches?: unknown }
  if (!data.breaches || !Array.isArray(data.breaches)) return []

  const names: string[] = []

  // XposedOrNot returns [["Adobe", "Canva", ...]]
  if (data.breaches.length > 0 && Array.isArray(data.breaches[0])) {
    for (const item of data.breaches[0]) {
      if (typeof item === 'string' && item.trim()) {
        names.push(item.trim())
      }
    }
    return names
  }

  // Fallback for flat array ["Adobe", "Canva"]
  for (const item of data.breaches) {
    if (typeof item === 'string' && item.trim()) {
      names.push(item.trim())
    } else if (typeof item === 'object' && item !== null && 'breach' in item) {
      const breachObj = item as { breach?: unknown }
      if (typeof breachObj.breach === 'string' && breachObj.breach.trim()) {
        names.push(breachObj.breach.trim())
      }
    }
  }

  return names
}

/**
 * Checks whether an API response body represents a "Not found" / clean result.
 */
export function isNotFoundResponse(rawData: unknown): boolean {
  if (!rawData || typeof rawData !== 'object') return false
  const data = rawData as { Error?: unknown; status?: unknown; message?: unknown }

  const errorVal = typeof data.Error === 'string' ? data.Error.toLowerCase() : ''
  const statusVal = typeof data.status === 'string' ? data.status.toLowerCase() : ''
  const messageVal = typeof data.message === 'string' ? data.message.toLowerCase() : ''

  return (
    errorVal.includes('not found') ||
    statusVal.includes('not found') ||
    statusVal === 'unknown' ||
    messageVal.includes('not found')
  )
}

