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

export interface ScanResult {
  id: string
  domain: string
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  categories: ScanCategory[]
  checks: ScanCheck[]
  penaltyExposure: string
}

export interface ScanCategory {
  name: string
  score: number
  maxScore: number
  weight: number
}

export interface ScanCheck {
  id: string
  name: string
  category: string
  passed: boolean
  points: number
  maxPoints: number
  description: string
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
  message: string
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  phone?: string
  subject: string
  message: string
}
