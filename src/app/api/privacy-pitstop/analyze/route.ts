import { NextResponse } from 'next/server'
import { initiatePitstopScan } from '@/lib/api'
import { pollUntilPitstopReport, unwrapConsentApiEnvelope } from '@/lib/website-scan'
import { ensureConsentApiUrl } from '@/lib/consent-api-url'
import { isAxiosError } from 'axios'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawInput = typeof body?.domain === 'string' ? body.domain : (typeof body?.url === 'string' ? body.url : '')
    const domain = rawInput.trim()

    if (!domain) {
      return NextResponse.json(
        { error: 'Missing required field: domain or url' },
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

    const initiateRes = await initiatePitstopScan(domain)
    const { scanId } = unwrapConsentApiEnvelope<{ scanId: string }>(initiateRes)

    const result = await pollUntilPitstopReport(scanId)

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    const baseUrl = await ensureConsentApiUrl().catch(() => 'unknown')
    console.error('[PrivacyPitstop] Backend scan error:', {
      baseUrl,
      endpoint: '/api/v1/sdk/website/scan/pitstop/initiate',
      message: err instanceof Error ? err.message : String(err),
      ...(isAxiosError(err) ? {
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
      } : {}),
    })

    const statusCode = isAxiosError(err) && err.response?.status ? err.response.status : 500
    const errorMessage = isAxiosError(err) && err.response?.data?.message
      ? err.response.data.message
      : (err instanceof Error ? err.message : 'Analysis failed')

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}
