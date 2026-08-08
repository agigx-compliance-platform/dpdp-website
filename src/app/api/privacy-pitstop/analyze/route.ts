import { NextResponse } from 'next/server'
import { initiatePitstopScan } from '@/lib/api'
import { pollUntilPitstopReport, unwrapConsentApiEnvelope } from '@/lib/website-scan'
import { ensureConsentApiUrl } from '@/lib/consent-api-url'
import { isAxiosError } from 'axios'

export const dynamic = 'force-dynamic'
export const maxDuration = 360

export async function POST(request: Request) {
  const startTimeMs = Date.now()
  let targetUrl = ''

  try {
    const body = await request.json()
    const rawInput = typeof body?.domain === 'string' ? body.domain : (typeof body?.url === 'string' ? body.url : '')
    targetUrl = rawInput.trim()

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing required field: domain or url' },
        { status: 400 }
      )
    }

    // Basic domain validation
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/.test(targetUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, ''))) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    const scanStartTimestamp = new Date().toISOString()
    const configuredTimeoutSeconds = 360

    console.log('[PrivacyPitstop Debug] Initiating REST call to Consent Management Service:', {
      targetUrl,
      endpoint: '/api/v1/sdk/website/scan/pitstop/initiate',
      configuredTimeoutSeconds,
      scanStartTimestamp,
    })

    const initiateRes = await initiatePitstopScan(targetUrl)
    const { scanId } = unwrapConsentApiEnvelope<{ scanId: string }>(initiateRes)

    const result = await pollUntilPitstopReport(scanId)
    const totalElapsedTimeMs = Date.now() - startTimeMs

    console.log('[PrivacyPitstop Debug] Consent Management Service scan REST call completed successfully:', {
      targetUrl,
      scanId,
      totalElapsedTimeMs,
      status: 'completed',
    })

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    const totalElapsedTimeMs = Date.now() - startTimeMs
    const baseUrl = await ensureConsentApiUrl().catch(() => 'unknown')
    const httpStatus = isAxiosError(err) && err.response?.status ? err.response.status : undefined
    const isTimeout = (err instanceof Error && err.message.toLowerCase().includes('timed out')) || totalElapsedTimeMs >= 295_000

    console.error('[PrivacyPitstop Debug] Consent Management Service REST call error / timeout:', {
      targetUrl,
      baseUrl,
      endpoint: '/api/v1/sdk/website/scan/pitstop/initiate',
      configuredTimeoutSeconds: 360,
      totalElapsedTimeMs,
      httpStatus: httpStatus ?? 'N/A',
      isTimeout,
      message: err instanceof Error ? err.message : String(err),
      ...(isAxiosError(err) ? {
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
      } : {}),
    })

    const statusCode = httpStatus ?? 500
    const errorMessage = isAxiosError(err) && err.response?.data?.message
      ? err.response.data.message
      : (err instanceof Error ? err.message : 'Analysis failed')

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}
