import { ensureConsentApiUrl } from './consent-api-url'

const PREWARM_SESSION_KEY = 'agigx_consent_api_prewarm_at'
/** Avoid hammering Cloud Run while users navigate the wizard. */
const PREWARM_COOLDOWN_MS = 10 * 60 * 1000
const PREWARM_TIMEOUT_MS = 120_000

let inFlight: Promise<void> | null = null

function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(url)
}

/**
 * Fire-and-forget health ping to wake a scaled-to-zero Cloud Run instance.
 * Free-tier friendly: only runs when a real user opens the questionnaire, not on a schedule.
 * CORS errors in the browser are OK — the request still reaches the server and starts the JVM.
 */
export function prewarmConsentApi(_reason?: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  const last = sessionStorage.getItem(PREWARM_SESSION_KEY)
  if (last && Date.now() - Number(last) < PREWARM_COOLDOWN_MS) {
    return Promise.resolve()
  }

  if (inFlight) return inFlight

  inFlight = (async () => {
    sessionStorage.setItem(PREWARM_SESSION_KEY, String(Date.now()))
    const base = await ensureConsentApiUrl()
    if (process.env.NODE_ENV === 'development' && isLocalhostUrl(base)) {
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), PREWARM_TIMEOUT_MS)
    try {
      await fetch(`${base.replace(/\/$/, '')}/actuator/health`, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
        cache: 'no-store',
      })
    } catch {
      // Expected when cold-starting or when health lacks CORS — instance may still be waking.
    } finally {
      window.clearTimeout(timer)
      inFlight = null
    }
  })()

  return inFlight
}
