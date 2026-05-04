import type { ScanReportResponse, ScanResult } from './types'

/** Backend `ApiResponse<T>` envelopes payload under `{ data }`; axios exposes it as `response.data`. */
export function unwrapConsentApiEnvelope<T>(axiosResponse: { data: unknown }): T {
  const body = axiosResponse.data
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as Record<string, unknown>).data as T
  }
  return body as T
}

export function penaltyExposureForScore(score: number): string {
  if (score >= 90) return '₹0, low risk'
  if (score >= 75) return 'Up to ₹50 Crore'
  if (score >= 60) return 'Up to ₹150 Crore'
  if (score >= 40) return 'Up to ₹250 Crore'
  return 'Up to ₹750 Crore (cumulative)'
}

export function mapScanReportToResult(report: ScanReportResponse, scanId?: string): ScanResult {
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
    penaltyExposure: penaltyExposureForScore(report.score),
  }
}
