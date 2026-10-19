import { NextResponse } from 'next/server'
import { getPitstopLeaderboard } from '@/lib/api'
import { unwrapConsentApiEnvelope } from '@/lib/website-scan'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await getPitstopLeaderboard()
    const data = unwrapConsentApiEnvelope<{
      entries: { rank: number; domain: string; score: number; scannedAt: string }[]
    }>(res)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
    })
  } catch (err) {
    console.warn('[PrivacyPitstop] Failed to fetch leaderboard from consent service:', err)
    return NextResponse.json(
      { error: 'Leaderboard unavailable' },
      { status: 502 }
    )
  }
}
