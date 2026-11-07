import { isAxiosError } from 'axios'
import { getScanReport, getScanStatus } from './api'
import type { ScanReportResponse, ScanResult, ScanStatusResponse } from './types'

/** Backend `ApiResponse<T>` envelopes payload under `{ data }`; axios exposes it as `response.data`. */
export function unwrapConsentApiEnvelope<T>(axiosResponse: { data: unknown }): T {
  const body = axiosResponse.data
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as Record<string, unknown>).data as T
  }
  return body as T
}

/** A rough level from what the scan saw on the public site. It is not a fine estimate. */
export function riskLevelForScore(score: number): string {
  if (score >= 90) return 'Low'
  if (score >= 75) return 'Moderate'
  if (score >= 40) return 'High'
  return 'Very high'
}

export function mapScanReportToResult(report: ScanReportResponse, scanId?: string): ScanResult {
  if (!Array.isArray(report.complianceFlags)) {
    throw new Error('Scan report is incomplete: complianceFlags missing')
  }
  return {
    ...(scanId != null ? { scanId } : {}),
    scannedUrl: report.scannedUrl,
    overallScore: report.score,
    grade: report.grade,
    summary: report.summary,
    complianceFlags: report.complianceFlags,
    totalCookies: report.totalCookies,
    totalTrackers: report.totalTrackers,
    consentBannerPresent: report.consentBannerPresent,
    consentRejectOption: report.consentRejectOption,
    riskLevel: riskLevelForScore(report.score),
  }
}

/** Poll scan status until the report is ready; retries when report lags behind status. */
export async function pollUntilScanReport(
  scanId: string,
  options?: {
    pollIntervalMs?: number
    maxAttempts?: number
    onProgress?: (progress: number) => void
  }
): Promise<ScanReportResponse> {
  const pollIntervalMs = options?.pollIntervalMs ?? 1600
  const maxAttempts = options?.maxAttempts ?? 120

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }

    const status = unwrapConsentApiEnvelope<ScanStatusResponse>(await getScanStatus(scanId))
    options?.onProgress?.(status.progress)

    if (status.status === 'failed') {
      throw new Error('Scan failed')
    }

    if (status.status === 'completed') {
      try {
        return unwrapConsentApiEnvelope<ScanReportResponse>(await getScanReport(scanId))
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 409) {
          continue
        }
        throw err
      }
    }
  }

  throw new Error('Scan timed out')
}

/** Poll Pitstop scan status until the report is ready. */
export async function pollUntilPitstopReport(
  scanId: string,
  options?: {
    pollIntervalMs?: number
    maxAttempts?: number
    onProgress?: (progress: number) => void
  }
): Promise<import('./privacy-pitstop/types').AnalysisResult> {
  const { getPitstopScanReport, getPitstopScanStatus } = await import('./api')
  const pollIntervalMs = options?.pollIntervalMs ?? 8000
  const maxAttempts = options?.maxAttempts ?? 75

  let consecutiveConflictRetries = 0

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }

    const status = unwrapConsentApiEnvelope<ScanStatusResponse>(await getPitstopScanStatus(scanId))
    options?.onProgress?.(status.progress)

    if (status.status === 'failed') {
      throw new Error('Scan failed')
    }

    if (status.status === 'completed') {
      try {
        return unwrapConsentApiEnvelope<import('./privacy-pitstop/types').AnalysisResult>(await getPitstopScanReport(scanId))
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 409) {
          consecutiveConflictRetries++
          if (consecutiveConflictRetries >= 3) {
            throw new Error('Scan completed but report body is empty or unavailable')
          }
          continue
        }
        throw err
      }
    }
  }

  throw new Error('Scan timed out')
}

