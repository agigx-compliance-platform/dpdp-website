import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const defaultUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://consent-management-service-ywx2kc3tdq-ma.a.run.app'
      : 'http://localhost:8084'

  const consentApiUrl =
    process.env.CONSENT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    defaultUrl

  return NextResponse.json(
    { consentApiUrl },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
