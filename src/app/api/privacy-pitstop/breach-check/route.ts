import { NextResponse } from 'next/server'
import {
  validateEmail,
  maskEmail,
  extractBreachNames,
  isNotFoundResponse,
  type BreachDetail,
  type EmailBreachResult,
} from '@/lib/privacy-pitstop/email-breach'

export const dynamic = 'force-dynamic'

interface CatalogBreachItem {
  breach?: string
  domain?: string
  breached_date?: string
  xposed_data?: string
  xposed_records?: number
  description?: string
}

// In-memory cache for public breaches catalog to avoid repeated calls and rate limiting
let cachedCatalog: Map<string, CatalogBreachItem> | null = null
let catalogLastFetched = 0
const CATALOG_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

async function getBreachCatalog(): Promise<Map<string, CatalogBreachItem>> {
  const now = Date.now()
  if (cachedCatalog && now - catalogLastFetched < CATALOG_CACHE_TTL_MS) {
    return cachedCatalog
  }

  try {
    const res = await fetch('https://api.xposedornot.com/v1/breaches', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'DPDP-Privacy-Pitstop/1.0',
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return cachedCatalog ?? new Map()
    }

    const data = await res.json()
    const map = new Map<string, CatalogBreachItem>()

    if (Array.isArray(data)) {
      for (const item of data) {
        if (item?.breach && typeof item.breach === 'string') {
          map.set(item.breach.trim().toLowerCase(), item)
        }
      }
    }

    cachedCatalog = map
    catalogLastFetched = now
    return map
  } catch {
    // If catalog fetch fails or times out, proceed gracefully with existing cache or empty map
    return cachedCatalog ?? new Map()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email: rawEmail, consent } = body

    if (!consent) {
      return NextResponse.json(
        { error: 'User consent is required before performing a breach check.' },
        { status: 400 }
      )
    }

    const validation = validateEmail(rawEmail)
    if (!validation.valid || !validation.email) {
      return NextResponse.json(
        { error: validation.error || 'Invalid email address provided.' },
        { status: 400 }
      )
    }

    const cleanEmail = validation.email
    const masked = maskEmail(cleanEmail)

    // Call XposedOrNot check-email endpoint
    // NOTE: For privacy protection, we DO NOT log the raw email address anywhere.
    const apiUrl = `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(cleanEmail)}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'DPDP-Privacy-Pitstop/1.0',
      },
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    })

    // Handle 404: email not found in any known breaches (clean result)
    if (response.status === 404) {
      const cleanResult: EmailBreachResult = {
        emailMasked: masked,
        breached: false,
        count: 0,
        breaches: [],
      }
      return NextResponse.json(cleanResult, {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // Handle 429: Rate limited
    if (response.status === 429) {
      return NextResponse.json(
        { error: 'XposedOrNot rate limit exceeded. Please wait a few moments before trying again.' },
        { status: 429 }
      )
    }

    // Handle server errors from XposedOrNot
    if (!response.ok) {
      return NextResponse.json(
        { error: `Breach verification service returned status ${response.status}. Please try again later.` },
        { status: 502 }
      )
    }

    const responseData = await response.json().catch(() => null)

    // Check if the response payload signifies "Not found"
    if (isNotFoundResponse(responseData)) {
      const cleanResult: EmailBreachResult = {
        emailMasked: masked,
        breached: false,
        count: 0,
        breaches: [],
      }
      return NextResponse.json(cleanResult, {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // Extract breach names
    const breachNames = extractBreachNames(responseData)

    if (breachNames.length === 0) {
      const cleanResult: EmailBreachResult = {
        emailMasked: masked,
        breached: false,
        count: 0,
        breaches: [],
      }
      return NextResponse.json(cleanResult, {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // Enrich breach details from catalog if available
    const catalog = await getBreachCatalog()
    const enrichedBreaches: BreachDetail[] = breachNames.map((name) => {
      const match = catalog.get(name.toLowerCase())
      let exposedDataList: string[] | undefined

      if (match?.xposed_data) {
        exposedDataList = match.xposed_data
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean)
      }

      return {
        name: match?.breach || name,
        domain: match?.domain,
        breachedDate: match?.breached_date,
        exposedData: exposedDataList,
        description: match?.description,
        recordsCount: match?.xposed_records,
      }
    })

    const breachResult: EmailBreachResult = {
      emailMasked: masked,
      breached: true,
      count: enrichedBreaches.length,
      breaches: enrichedBreaches,
    }

    return NextResponse.json(breachResult, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
    if (isTimeout) {
      return NextResponse.json(
        { error: 'Breach check request timed out. Please try again.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while checking data breaches.' },
      { status: 500 }
    )
  }
}

