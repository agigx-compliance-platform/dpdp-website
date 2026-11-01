import { NextResponse } from 'next/server'
import { getPitstopLeaderboard, type PitstopLeaderboardResponse } from '@/lib/api'
import { unwrapConsentApiEnvelope } from '@/lib/website-scan'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawLimit = Number(searchParams.get('limit'))
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 5
    const res = await getPitstopLeaderboard(limit)
    const data = unwrapConsentApiEnvelope<PitstopLeaderboardResponse>(res)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (err) {
    console.warn('[PrivacyPitstop] Failed to fetch leaderboard from consent service:', err)
    return NextResponse.json(
      { error: 'Leaderboard unavailable' },
      { status: 502 }
    )
  }
}
