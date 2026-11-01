import { NextResponse } from 'next/server'
import { getBuildTimeConsentApiUrl, getDefaultConsentApiUrl } from '@/lib/consent-api-url'

export const dynamic = 'force-dynamic'

export async function GET() {
  const consentApiUrl = getBuildTimeConsentApiUrl() || getDefaultConsentApiUrl()

  return NextResponse.json(
    { consentApiUrl },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
