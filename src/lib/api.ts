import axios from 'axios'
import type { EnquiryFormData, QuestionnaireResponses, ScanResult } from './types'

const API_BASE = process.env.NEXT_PUBLIC_CONSENT_API_URL || 'https://api.agigx.com'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export async function submitEnquiry(data: EnquiryFormData) {
  return apiClient.post('/api/enquiry', data)
}

export async function submitQuestionnaire(data: QuestionnaireResponses) {
  return apiClient.post('/api/questionnaire', data)
}

export async function initiateScan(data: { url: string; email: string; name: string; company: string; consent: boolean }) {
  return apiClient.post<{ scanId: string }>('/api/scan/initiate', data)
}

export async function getScanStatus(scanId: string) {
  return apiClient.get<{ status: 'pending' | 'in_progress' | 'completed' | 'failed'; progress: number }>(`/api/scan/status/${scanId}`)
}

export async function getScanReport(scanId: string) {
  return apiClient.get<ScanResult>(`/api/scan/report/${scanId}`)
}

export async function submitContactForm(data: EnquiryFormData) {
  return apiClient.post('/api/contact', data)
}
