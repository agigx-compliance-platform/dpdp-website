/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

/** Origins of the consent API and SDK, so the banner keeps working even when they are plain http (local). */
function originOf(value) {
  try {
    return value ? new URL(value.trim()).origin : null
  } catch {
    return null
  }
}

const sdkOrigins = [
  process.env.NEXT_PUBLIC_CONSENT_API_URL,
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_SDK_BASE_URL,
  process.env.NEXT_PUBLIC_DSAR_API_URL,
]
  .map(originOf)
  .filter(Boolean)
const extra = [...new Set(sdkOrigins)].join(' ')

/**
 * Content Security Policy. Next.js renders inline scripts without a nonce, so
 * 'unsafe-inline' stays for scripts; https: keeps the consent SDK and Google
 * Analytics (loaded only after consent) working. It still blocks plain-http and
 * data: scripts, plugins, <base> hijacking, and framing by other sites.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https: ${extra}${isDev ? " 'unsafe-eval'" : ''}`,
  `style-src 'self' 'unsafe-inline' https: ${extra}`,
  `img-src 'self' data: blob: https: ${extra}`,
  "font-src 'self' data: https:",
  `connect-src 'self' https: wss: ${extra}${isDev ? ' ws: http://localhost:*' : ''}`,
  `frame-src 'self' https: ${extra}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' https: ${extra}`,
  ...(isDev ? [] : ['upgrade-insecure-requests']),
]
  .map((d) => d.replace(/\s+/g, ' ').trim())
  .join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  ...(isDev
    ? []
    : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
]

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_CONSENT_API_URL: process.env.NEXT_PUBLIC_CONSENT_API_URL ?? '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

module.exports = nextConfig
