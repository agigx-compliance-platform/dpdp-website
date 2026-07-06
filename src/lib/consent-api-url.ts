declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      consentApiUrl?: string
    }
  }
}

const LOCAL_FALLBACK = 'http://localhost:8084'

function trim(value: string | undefined): string | undefined {
  const v = value?.trim()
  return v || undefined
}

function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(url)
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

/** Best-effort URL without network I/O (may be localhost until ensureConsentApiUrl runs). */
export function resolveConsentApiUrlSync(): string {
  if (cachedUrl) return cachedUrl

  const configured = getInjectedConsentApiUrl() || getBuildTimeConsentApiUrl()
  if (configured) {
    cachedUrl = configured
    return configured
  }

  return LOCAL_FALLBACK
}

/** Resolves the consent API base URL, fetching Netlify runtime config when needed. */
export async function ensureConsentApiUrl(): Promise<string> {
  const injected = getInjectedConsentApiUrl()
  const built = getBuildTimeConsentApiUrl()
  const configured = injected || built

  if (configured && (process.env.NODE_ENV !== 'production' || !isLocalhostUrl(configured))) {
    cachedUrl = configured
    return configured
  }

  if (cachedUrl && cachedUrl !== LOCAL_FALLBACK) {
    return cachedUrl
  }

  if (typeof window === 'undefined') {
    return trim(process.env.CONSENT_API_URL) || configured || LOCAL_FALLBACK
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
      .catch(() => configured || LOCAL_FALLBACK)
  }

  const url = await loading
  if (!isLocalhostUrl(url) || process.env.NODE_ENV === 'development') {
    cachedUrl = url
  }
  return url
}
