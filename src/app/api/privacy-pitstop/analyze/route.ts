import { NextResponse } from 'next/server'
import { analyzePrivacyPitstop } from '@/lib/privacy-pitstop/analyzer'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const domain = typeof body?.domain === 'string' ? body.domain.trim() : ''

    if (!domain) {
      return NextResponse.json(
        { error: 'Missing required field: domain' },
        { status: 400 }
      )
    }

    // Basic domain validation
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/.test(domain.replace(/^https?:\/\//, '').replace(/\/.*$/, ''))) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    const result = await analyzePrivacyPitstop(domain)

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[PrivacyPitstop] Analysis error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
