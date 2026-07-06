import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const consentApiUrl =
    process.env.CONSENT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    ''

  return NextResponse.json(
    { consentApiUrl },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
