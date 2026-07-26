export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type ConfidenceLevel = 'high' | 'medium' | 'low'
export type RiskRating = 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe'
export type EvidenceStatus = 'detected' | 'inferred' | 'not-detected' | 'not-applicable'

export interface Finding {
  id: string
  pillarId: string
  module: string
  title: string
  description: string
  severity: Severity
  confidence: ConfidenceLevel
  evidence: EvidenceStatus
  recommendation?: string
  details?: string
}

export interface PillarResult {
  id: string
  name: string
  weight: number
  score: number
  confidence: number
  findingCount: number
  findings: Finding[]
}

export interface DisplayCategory {
  name: string
  score: number
  pillarIds: string[]
}

export interface AnalysisResult {
  domain: string
  analyzedAt: string
  riskScore: number
  riskRating: RiskRating
  confidenceScore: number
  coverageScore: number
  pillars: PillarResult[]
  categories: DisplayCategory[]
  totalFindings: number
  pagesAnalyzed: number
  summary: string
}

export interface FetchedPage {
  url: string
  status: number
  html: string
  headers: Record<string, string>
  pageClass: string
  error?: string
}

export interface PillarDefinition {
  id: string
  name: string
  weight: number
}

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 10,
  high: 8,
  medium: 5,
  low: 2.5,
  info: 1,
}

export const CONFIDENCE_WEIGHT: Record<ConfidenceLevel, number> = {
  high: 1.0,
  medium: 0.7,
  low: 0.4,
}
