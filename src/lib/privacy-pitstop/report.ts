import type {
  Finding, ScanCategoryResult, ScanReport, ReportSection,
  ReportFinding, RiskRating,
} from './types'
import { getRiskRating } from './constants'
import type { ScoringResult } from './scoring'

/* ═══════════════════════════════════════════════════════════════
   Report Finding Builder
   ═══════════════════════════════════════════════════════════════ */

function toReportFinding(f: Finding): ReportFinding {
  return {
    title: f.title,
    description: f.description,
    severity: f.severity,
    confidence: f.confidence,
    evidenceItems: f.evidenceItems,
    scoreImpact: `${f.severity} severity × ${f.confidence} confidence`,
    recommendation: f.recommendation,
    publicWording: generatePublicWording(f),
  }
}

/** Generate citizen-safe wording for a finding. */
function generatePublicWording(f: Finding): string {
  switch (f.severity) {
    case 'critical':
      return `Critical concern: ${f.title}. ${f.description} This may significantly impact your privacy rights.`
    case 'high':
      return `Important finding: ${f.title}. ${f.description} Consider asking the website operator about this.`
    case 'medium':
      return `Observation: ${f.title}. ${f.description}`
    case 'low':
    case 'info':
    default:
      return `Note: ${f.title}. ${f.description}`
  }
}

/* ═══════════════════════════════════════════════════════════════
   Executive Summary Generator
   ═══════════════════════════════════════════════════════════════ */

function generateExecutiveSummary(
  domain: string,
  overallScore: number,
  riskRating: RiskRating,
  categories: ScanCategoryResult[],
  allFindings: Finding[],
): string {
  const criticalCount = allFindings.filter(f => f.severity === 'critical').length
  const highCount = allFindings.filter(f => f.severity === 'high').length
  const totalFindings = allFindings.length

  let summary = `Privacy scan of ${domain} produced an overall risk score of ${overallScore}/100 (${riskRating}). `
  summary += `${totalFindings} finding(s) were identified`

  if (criticalCount > 0 || highCount > 0) {
    const parts: string[] = []
    if (criticalCount > 0) parts.push(`${criticalCount} critical`)
    if (highCount > 0) parts.push(`${highCount} high-severity`)
    summary += `, including ${parts.join(' and ')} issue(s). `
  } else {
    summary += '. '
  }

  // Identify highest-risk category
  const worstCategory = categories.reduce((a, b) => a.score > b.score ? a : b)
  if (worstCategory.score > 30) {
    summary += `The "${worstCategory.name}" category shows the highest risk (${worstCategory.score}/100). `
  }

  // Top issues
  const topIssues = allFindings
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 3)
    .map(f => f.title)

  if (topIssues.length > 0) {
    summary += `Key concerns: ${topIssues.join('; ')}. `
  }

  summary += 'This report is based on publicly accessible information and does not involve any login or authenticated access.'

  return summary
}

/* ═══════════════════════════════════════════════════════════════
   Recommendations Generator
   ═══════════════════════════════════════════════════════════════ */

function generateRecommendations(allFindings: Finding[]): string[] {
  const recommendations: string[] = []
  const seen = new Set<string>()

  // Prioritize by severity
  const sorted = [...allFindings]
    .filter(f => f.recommendation)
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
      return order[a.severity] - order[b.severity]
    })

  for (const f of sorted) {
    if (f.recommendation && !seen.has(f.recommendation)) {
      seen.add(f.recommendation)
      recommendations.push(f.recommendation)
    }
  }

  return recommendations.slice(0, 15) // Cap at 15 recommendations
}

/* ═══════════════════════════════════════════════════════════════
   Main Report Generator
   ═══════════════════════════════════════════════════════════════ */

/**
 * Generates a structured, evidence-backed scan report.
 * Consumes ONLY structured findings — no AI generation.
 */
export function generateReport(
  scanId: string,
  domain: string,
  analyzedAt: string,
  scoring: ScoringResult,
  allFindings: Finding[],
  pagesAnalyzed: number,
): ScanReport {
  const riskRating = getRiskRating(scoring.overallScore)

  // Build sections per category
  const sections: ReportSection[] = scoring.categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    score: cat.score,
    findings: cat.findings.map(toReportFinding),
  }))

  const executiveSummary = generateExecutiveSummary(
    domain, scoring.overallScore, riskRating,
    scoring.categories, allFindings,
  )

  const recommendations = generateRecommendations(allFindings)

  return {
    scanId,
    domain,
    analyzedAt,
    executiveSummary,
    overallScore: scoring.overallScore,
    riskRating,
    confidenceScore: scoring.confidenceScore,
    coverageScore: scoring.coverageScore,
    categories: scoring.categories,
    sections,
    totalFindings: allFindings.length,
    pagesAnalyzed,
    recommendations,
  }
}
