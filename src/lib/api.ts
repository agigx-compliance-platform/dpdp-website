import type { EnquiryFormData, QuestionnaireResponses, ScanResult } from './types'

// Mock state to track scans
const mockScans: Record<string, { progress: number; status: 'pending' | 'in_progress' | 'completed' | 'failed'; domain: string }> = {}

export async function submitEnquiry(data: EnquiryFormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { data: { success: true } }
}

export async function submitQuestionnaire(data: QuestionnaireResponses) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { data: { success: true } }
}

export async function initiateScan(data: { url: string; email: string; name: string; company: string; consent: boolean }) {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const scanId = 'scan_' + Date.now()
  let domain = 'yoursite.com'
  try {
    domain = new URL(data.url).hostname
  } catch (e) {
    // ignore
  }
  
  mockScans[scanId] = { progress: 0, status: 'in_progress', domain }
  return { data: { scanId } }
}

export async function getScanStatus(scanId: string) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  let scan = mockScans[scanId]
  if (!scan) {
    scan = { progress: 100, status: 'completed', domain: 'example.com' }
    mockScans[scanId] = scan
  }
  
  if (scan.progress < 100) {
    // Increase progress by 10-18% each time (takes ~12-16 seconds total with 2s polling)
    scan.progress += Math.floor(Math.random() * 9) + 10
    if (scan.progress >= 100) {
      scan.progress = 100
      scan.status = 'completed'
    }
  }
  
  return { data: { status: scan.status, progress: scan.progress } }
}

export async function getScanReport(scanId: string) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const scan = mockScans[scanId]
  const domain = scan ? scan.domain : 'example.com'
  
  const mockScanResult: ScanResult = {
    id: scanId,
    domain: domain,
    overallScore: 58,
    grade: 'D',
    penaltyExposure: '₹42 Crore',
    categories: [
      { name: 'Consent Mechanisms', score: 10, maxScore: 25, weight: 1 },
      { name: 'Cookie Compliance', score: 15, maxScore: 25, weight: 1 },
      { name: 'DSAR Readiness', score: 12, maxScore: 25, weight: 1 },
      { name: 'Privacy Policy', score: 21, maxScore: 25, weight: 1 }
    ],
    checks: [
      { id: 'c1', name: 'Valid Consent Banner', category: 'Consent', passed: false, points: 0, maxPoints: 10, description: 'Consent banner not found or non-compliant.' },
      { id: 'c2', name: 'Opt-in for Analytics', category: 'Cookies', passed: false, points: 0, maxPoints: 10, description: 'Analytics cookies loaded before user consent.' },
      { id: 'c3', name: 'Accessible Privacy Policy', category: 'Policy', passed: true, points: 10, maxPoints: 10, description: 'Privacy policy link found in footer.' },
      { id: 'c4', name: 'DSAR Request Form', category: 'DSAR', passed: false, points: 0, maxPoints: 10, description: 'No mechanism found for users to request data deletion.' },
      { id: 'c5', name: 'Local Data Storage', category: 'Cookies', passed: false, points: 0, maxPoints: 10, description: 'Uncategorized local storage usage detected.' }
    ]
  }
  
  return { data: mockScanResult }
}

export async function submitContactForm(data: EnquiryFormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { data: { success: true } }
}
