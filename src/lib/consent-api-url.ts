declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      consentApiUrl?: string
    }
  }
}

const LOCAL_FALLBACK = 'http://localhost:8084'
const PROD_FALLBACK = 'https://consent-management-service-ywx2kc3tdq-ma.a.run.app'

function trim(value: string | undefined): string | undefined {
  const v = value?.trim()
  return v || undefined
}

export function getDefaultConsentApiUrl(): string {
  return process.env.NODE_ENV === 'production' ? PROD_FALLBACK : LOCAL_FALLBACK
}

export function getBuildTimeConsentApiUrl(): string | undefined {
  return (
    trim(process.env.NEXT_PUBLIC_CONSENT_API_URL) ||
    trim(process.env.NEXT_PUBLIC_API_URL) ||
    trim(process.env.CONSENT_API_URL)
  )
}

function getInjectedConsentApiUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return trim(window.__RUNTIME_CONFIG__?.consentApiUrl)
}

let cachedUrl: string | null = null
let loading: Promise<string> | null = null

/** Best-effort URL without network I/O. */
export function resolveConsentApiUrlSync(): string {
  if (cachedUrl) return cachedUrl

  const configured = getInjectedConsentApiUrl() || getBuildTimeConsentApiUrl()
  if (configured) {
    cachedUrl = configured
    return configured
  }

  return getDefaultConsentApiUrl()
}

/** Resolves the consent API base URL, fetching runtime config when needed. */
export async function ensureConsentApiUrl(): Promise<string> {
  const defaultUrl = getDefaultConsentApiUrl()
  const injected = getInjectedConsentApiUrl()
  const built = getBuildTimeConsentApiUrl()
  const configured = injected || built

  if (configured) {
    cachedUrl = configured
    return configured
  }

  if (cachedUrl) {
    return cachedUrl
  }

  if (typeof window === 'undefined') {
    const serverUrl = trim(process.env.CONSENT_API_URL) || defaultUrl
    cachedUrl = serverUrl
    return serverUrl
  }

  if (!loading) {
    loading = fetch('/api/config', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load runtime config')
        const data = (await res.json()) as { consentApiUrl?: string }
        const url = trim(data.consentApiUrl)
        if (!url) throw new Error('consentApiUrl missing in runtime config')
        return url
      })
      .catch(() => defaultUrl)
  }

  const url = await loading
  cachedUrl = url
  return url
}
