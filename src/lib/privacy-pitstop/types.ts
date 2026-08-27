export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type ConfidenceLevel = 'high' | 'medium' | 'low'
export type RiskRating = 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe'
export type EvidenceStatus = 'detected' | 'inferred' | 'not-detected' | 'not-applicable'

/* ═══════════════════════════════════════════════════════════════
   Evidence Model
   ═══════════════════════════════════════════════════════════════ */

export type EvidenceType =
  | 'page_url'
  | 'http_header'
  | 'html_snippet'
  | 'script_url'
  | 'cookie'
  | 'policy_clause'
  | 'link_url'
  | 'network_request'
  | 'screenshot'     // Placeholder for future browser automation
  | 'har_entry'      // Placeholder for future browser automation

export interface Evidence {
  type: EvidenceType
  url?: string
  snippet?: string
  domLocation?: string
  cookieName?: string
  headerName?: string
  headerValue?: string
  timestamp: string
  scanId?: string
}

/* ═══════════════════════════════════════════════════════════════
   Finding (extended — backward compatible)
   ═══════════════════════════════════════════════════════════════ */

export interface Finding {
  id: string
  pillarId: string
  /** Which detector module produced this finding */
  module: string
  /** The scan category this finding maps to */
  categoryId?: ScanCategoryId
  title: string
  description: string
  severity: Severity
  confidence: ConfidenceLevel
  /** @deprecated Use evidenceItems instead */
  evidence: EvidenceStatus
  /** Structured evidence backing this finding */
  evidenceItems: Evidence[]
  recommendation?: string
  details?: string
}

/* ═══════════════════════════════════════════════════════════════
   Scan Categories (7-category spec model)
   ═══════════════════════════════════════════════════════════════ */

export type ScanCategoryId =
  | 'notice'
  | 'consent'
  | 'cookies'
  | 'rights'
  | 'ai_transparency'
  | 'childrens_privacy'
  | 'security'

export interface ScanCategoryDefinition {
  id: ScanCategoryId
  name: string
  /** Raw weight from spec (Notice=10, Consent=10, etc.) */
  weight: number
  /** Normalized weight (weight / totalWeights) for 0–100 scoring */
  normalizedWeight: number
}

export interface ScanCategoryResult {
  id: ScanCategoryId
  name: string
  weight: number
  normalizedWeight: number
  score: number
  confidence: number
  maxSeverity: Severity
  findingCount: number
  findings: Finding[]
}

/* ═══════════════════════════════════════════════════════════════
   Scan Context (threaded through pipeline)
   ═══════════════════════════════════════════════════════════════ */

export interface ScanContext {
  scanId: string
  domain: string
  siteDomain: string
  startedAt: string
  pages: FetchedPage[]
  successfulPages: FetchedPage[]
}

/* ═══════════════════════════════════════════════════════════════
   Scan Report (structured output)
   ═══════════════════════════════════════════════════════════════ */

export interface ReportSection {
  categoryId: ScanCategoryId
  categoryName: string
  score: number
  findings: ReportFinding[]
}

export interface ScoreBasisEntry {
  categoryId: ScanCategoryId
  categoryName: string
  score: number
  explanation: string
  evidenceSummary?: string[]
}

export interface FindingAnalysis {
  findingId: string
  title: string
  severity: Severity
  detailedExplanation?: string
  regulatoryImplication?: string
  evidenceReferences?: string[]
}

export interface ReportFinding {
  title: string
  description: string
  severity: Severity
  confidence: ConfidenceLevel
  evidenceItems: Evidence[]
  scoreImpact: string
  recommendation?: string
  publicWording: string
  detailedExplanation?: string
  regulatoryImplication?: string
}

export interface ScanReport {
  scanId: string
  domain: string
  analyzedAt: string
  executiveSummary: string
  overallScore: number
  riskRating: RiskRating
  confidenceScore: number
  coverageScore: number
  categories: ScanCategoryResult[]
  sections: ReportSection[]
  totalFindings: number
  pagesAnalyzed: number
  recommendations: string[]
  detailedReport?: string
  scoreBasis?: ScoreBasisEntry[]
}

/* ═══════════════════════════════════════════════════════════════
   Citizen Actions
   ═══════════════════════════════════════════════════════════════ */

export interface CitizenQuestion {
  id: string
  question: string
  context: string
  relatedFindingId: string
  evidenceReference?: string
}

export interface GrievanceDraft {
  subject: string
  body: string
  relatedFindings: string[]
}

export interface CitizenActions {
  questions: CitizenQuestion[]
  grievanceDraft: GrievanceDraft | null
  followUpTemplate: string
  complaintPackSummary: string
}

/* ═══════════════════════════════════════════════════════════════
   Legacy types (backward compatible — preserved from original)
   ═══════════════════════════════════════════════════════════════ */

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
  scanId?: string
  domain: string
  analyzedAt: string
  riskScore: number
  riskRating: RiskRating
  confidenceScore: number
  coverageScore: number
  /** @deprecated Use report.categories instead */
  pillars: PillarResult[]
  /** @deprecated Use report.categories instead */
  categories: DisplayCategory[]
  totalFindings: number
  pagesAnalyzed: number
  summary: string
  /** Structured report with 7-category scoring */
  report?: ScanReport
  /** Generated citizen actions */
  citizenActions?: CitizenActions
  /** Specific reasons describing missing/failed criteria that reduced score */
  gapReasons?: string[]
  scoreBasis?: ScoreBasisEntry[]
  findingAnalyses?: FindingAnalysis[]
  detailedReport?: string
  consentBannerPresent?: boolean
  consentRejectOption?: boolean
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
