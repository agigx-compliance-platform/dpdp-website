const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.google.com',
  'metadata.internal',
  'kubernetes.default',
  'kubernetes.default.svc',
])

function isPrivateIpv4(hostname: string): boolean {
  const m = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return false
  const oct = m.slice(1).map(Number)
  if (oct.some((n) => n > 255)) return true
  const [a, b] = oct
  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 192 && b === 168) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  return false
}

function isPrivateIpv6(hostname: string): boolean {
  const h = hostname.toLowerCase()
  if (h === '::1' || h === '[::1]') return true
  if (h.startsWith('fe80:') || h.startsWith('fc') || h.startsWith('fd')) return true
  return false
}

export function isBlockedScanHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '')
  if (!h) return true
  if (BLOCKED_HOSTNAMES.has(h)) return true
  if (h.endsWith('.internal') || h.endsWith('.local') || h.endsWith('.localhost')) return true
  if (isPrivateIpv4(h) || isPrivateIpv6(h)) return true
  return false
}

export function extractScanHostname(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withScheme)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.hostname || null
  } catch {
    return null
  }
}

const DOMAIN_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/

export function assertPublicScanTarget(input: string): { hostname: string } {
  const hostname = extractScanHostname(input)
  if (!hostname) {
    throw new Error('Invalid domain format')
  }
  if (!DOMAIN_RE.test(hostname)) {
    throw new Error('Invalid domain format')
  }
  if (isBlockedScanHost(hostname)) {
    throw new Error('That host cannot be scanned')
  }
  return { hostname }
}
