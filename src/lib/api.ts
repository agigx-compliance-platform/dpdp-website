import axios, { type AxiosInstance } from 'axios'
import type { EnquiryFormData, QuestionnaireResponses, ScanStatusResponse, ScanReportResponse, Recommendation } from './types'
import { ensureConsentApiUrl } from './consent-api-url'

let apiClientPromise: Promise<AxiosInstance> | null = null

async function getApiClient(): Promise<AxiosInstance> {
  if (!apiClientPromise) {
    apiClientPromise = ensureConsentApiUrl().then((baseURL) =>
      axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' },
        // Cloud Run scale-to-zero cold starts can take 60–90s on free tier.
        timeout: 90_000,
      })
    )
  }
  return apiClientPromise
}

export async function submitEnquiry(data: EnquiryFormData) {
  return (await getApiClient()).post('/api/v1/sdk/website/enquiry', {
    name: data.name,
    email: data.email,
    company: data.company,
    role: data.role,
    subject: data.subject,
    message: data.message,
    sourcePage: 'contact',
  })
}

export async function submitQuestionnaire(data: QuestionnaireResponses) {
  return (await getApiClient()).post<{ data: { sessionId: string; message: string } }>('/api/v1/sdk/website/questionnaire', {
    role: data.role,
    orgType: data.orgType,
    journeyStage: data.journeyStage,
    dataTypes: data.dataTypes,
    priorities: data.priorities,
    supportType: data.supportType,
    wantsScan: data.wantsScan,
    websiteUrl: data.websiteUrl,
    email: data.email,
    name: data.name,
    company: data.company,
    consentGiven: data.consentGiven,
  })
}

export async function initiateScan(data: {
  url: string
  email: string
  name: string
  company: string
  consent: boolean
  sessionId?: string
}) {
  return (await getApiClient()).post<{ data: { scanId: string; sessionId: string } }>(
    '/api/v1/sdk/website/scan/initiate',
    data,
    { timeout: 300_000 }
  )
}

export async function getScanStatus(scanId: string) {
  return (await getApiClient()).get<{ data: ScanStatusResponse }>(
    `/api/v1/sdk/website/scan/status/${scanId}`,
    { timeout: 30_000 }
  )
}

export async function getScanReport(scanId: string) {
  return (await getApiClient()).get<{ data: ScanReportResponse }>(
    `/api/v1/sdk/website/scan/report/${scanId}`,
    { timeout: 300_000 }
  )
}

export async function initiatePitstopScan(url: string) {
  return (await getApiClient()).post<{ data: { scanId: string } }>(
    '/api/v1/sdk/website/scan/pitstop/initiate',
    { url },
    { timeout: 300_000 }
  )
}

export async function getPitstopScanStatus(scanId: string) {
  return (await getApiClient()).get<{ data: ScanStatusResponse }>(
    `/api/v1/sdk/website/scan/pitstop/status/${scanId}`,
    { timeout: 30_000 }
  )
}

export async function getPitstopScanReport(scanId: string) {
  return (await getApiClient()).get<{ data: import('./privacy-pitstop/types').AnalysisResult }>(
    `/api/v1/sdk/website/scan/pitstop/report/${scanId}`,
    { timeout: 300_000 }
  )
}


export async function downloadReportPdfUrl(scanId: string): Promise<string> {
  const baseURL = await ensureConsentApiUrl()
  return `${baseURL}/api/v1/sdk/website/scan/report/${scanId}/pdf`
}

export async function deliverScanReport(
  scanId: string,
  data: {
    role: string
    orgType: string
    journeyStage: string
    dataTypes: string[]
    priorities: string[]
    supportType: string[]
    recommendations: Pick<Recommendation, 'type' | 'id' | 'title' | 'reason' | 'relevanceScore'>[]
  }
) {
  return (await getApiClient()).post<{ data: { delivered: boolean; email?: string; alreadySent?: boolean } }>(
    `/api/v1/sdk/website/scan/report/${scanId}/deliver`,
    data,
    { timeout: 60_000 }
  )
}

export async function submitContactForm(data: EnquiryFormData) {
  return (await getApiClient()).post('/api/v1/sdk/website/enquiry', {
    ...data,
    sourcePage: 'contact',
  })
}
