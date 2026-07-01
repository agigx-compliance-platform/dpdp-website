import axios from 'axios'
import type { EnquiryFormData, QuestionnaireResponses, ScanStatusResponse, ScanReportResponse, Recommendation } from './types'

const API_BASE =
  process.env.NEXT_PUBLIC_CONSENT_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8084'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export async function submitEnquiry(data: EnquiryFormData) {
  return apiClient.post('/api/v1/sdk/website/enquiry', {
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
  return apiClient.post<{ data: { sessionId: string; message: string } }>('/api/v1/sdk/website/questionnaire', {
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
  return apiClient.post<{ data: { scanId: string; sessionId: string } }>(
    '/api/v1/sdk/website/scan/initiate',
    data,
    { timeout: 60000 }
  )
}

export async function getScanStatus(scanId: string) {
  return apiClient.get<{ data: ScanStatusResponse }>(
    `/api/v1/sdk/website/scan/status/${scanId}`,
    { timeout: 15000 }
  )
}

export async function getScanReport(scanId: string) {
  return apiClient.get<{ data: ScanReportResponse }>(
    `/api/v1/sdk/website/scan/report/${scanId}`,
    { timeout: 60000 }
  )
}

export function downloadReportPdfUrl(scanId: string): string {
  return `${API_BASE}/api/v1/sdk/website/scan/report/${scanId}/pdf`
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
  return apiClient.post<{ data: { delivered: boolean; email?: string; alreadySent?: boolean } }>(
    `/api/v1/sdk/website/scan/report/${scanId}/deliver`,
    data,
    { timeout: 30000 }
  )
}

export async function submitContactForm(data: EnquiryFormData) {
  return apiClient.post('/api/v1/sdk/website/enquiry', {
    ...data,
    sourcePage: 'contact',
  })
}
