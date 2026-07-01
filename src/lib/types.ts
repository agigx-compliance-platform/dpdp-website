export type Theme = 'dark' | 'light'

export interface ServiceSubOffering {
  title: string
  description: string
  dpdpSections: string[]
  penalties: string[]
  whoIsThisFor: string
}

export interface ServiceCategory {
  id: string
  title: string
  icon: string
  description: string
  subOfferings: ServiceSubOffering[]
}

export interface ProductFeature {
  title: string
  description: string
}

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  features: ProductFeature[]
  dpdpSections: string[]
  complianceDomains: string[]
}

export interface Solution {
  id: string
  title: string
  industry: string
  description: string
  keyOfferings: string[]
  dpdpFocus: string[]
}

export interface QuestionnaireStep {
  id: string
  title: string
  description: string
  type: 'single' | 'multi' | 'multi-limited' | 'boolean' | 'form'
  maxSelections?: number
  options?: QuestionnaireOption[]
}

export interface QuestionnaireOption {
  id: string
  label: string
  description?: string
  icon?: string
}

export interface QuestionnaireResponses {
  role: string
  orgType: string
  journeyStage: string
  dataTypes: string[]
  priorities: string[]
  supportType: string[]
  wantsScan: boolean
  websiteUrl?: string
  email?: string
  name?: string
  company?: string
  consentGiven: boolean
}

// Backend scan status response
export interface ScanStatusResponse {
  scanId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: number
}

// Backend scan report response (summary for UI display)
export interface ScanReportResponse {
  scannedUrl: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  summary: {
    criticalIssues: number
    highIssues: number
    warnings: number
    passed: number
  }
  consentBannerPresent: boolean
  consentRejectOption: boolean
  complianceFlags: ComplianceFlag[]
  totalCookies: number
  totalTrackers: number
  cmpProvider: string | null
  pagesScanned: number
}

export interface ComplianceFlag {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  passed: boolean
  evidence?: unknown
}

// Mapped ScanResult for the recommendation engine and results page
export interface ScanResult {
  scanId?: string
  scannedUrl: string
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  summary: {
    criticalIssues: number
    highIssues: number
    warnings: number
    passed: number
  }
  complianceFlags: ComplianceFlag[]
  totalCookies: number
  totalTrackers: number
  consentBannerPresent: boolean
  consentRejectOption: boolean
  penaltyExposure: string
}

export interface Recommendation {
  type: 'product' | 'service' | 'package'
  id: string
  title: string
  reason: string
  relevanceScore: number
  gapsAddressed: string[]
  dpdpSections: string[]
}

export interface EnquiryFormData {
  name: string
  email: string
  company: string
  role: string
  subject?: string
  message: string
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
}
