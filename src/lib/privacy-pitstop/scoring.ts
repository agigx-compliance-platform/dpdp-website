import type {
  Finding, ScanCategoryResult, ScanCategoryId, Severity,
} from './types'
import { SEVERITY_WEIGHT, CONFIDENCE_WEIGHT } from './types'
import {
  SCAN_CATEGORIES,
  NOVELTY_FIRST, NOVELTY_DUPLICATE,
  BREADTH_THRESHOLD, BREADTH_BOOST_FACTOR, PILLAR_SCALE_FACTOR,
} from './constants'

/* ═══════════════════════════════════════════════════════════════
   Expected module count per category (for breadth calculation)
   ═══════════════════════════════════════════════════════════════ */

const CATEGORY_MODULE_COUNTS: Record<ScanCategoryId, number> = {
  notice: 4,      // policy_link, policy_page, policy_sections, policy_date, purpose_spec
  consent: 5,     // cmp_presence, reject_option, manage_prefs, pref_center, revocation, pre_checked, consent_wall
  cookies: 4,     // pre_consent_trackers, inline_tracking, server_cookies, third_party_count, ad_networks, tracking_pixels
  rights: 4,      // rights_link, gpc, dpo_contact, individual_rights
  ai_transparency: 3, // no_ai_disclosure, partial_ai_disclosure, profiling_no_optout, automated_no_review
  childrens_privacy: 3, // no_children_policy, no_parental_consent, child_data_handling, no_age_verification
  security: 4,    // no_https, missing_security_headers, no_security_txt, session_replay, fingerprinting, exposed_*
}

/* ═══════════════════════════════════════════════════════════════
   Per-Category Score Computation
   ═══════════════════════════════════════════════════════════════ */

/**
 * Computes the score for a single category from its findings.
 * Reuses the existing scoring formula: SEVERITY_WEIGHT × CONFIDENCE_WEIGHT × novelty,
 * normalized by PILLAR_SCALE_FACTOR, with breadth boost.
 */
function computeCategoryScore(
  categoryFindings: Finding[],
  moduleCount: number,
): { score: number; confidence: number; maxSeverity: Severity } {
  if (categoryFindings.length === 0) {
    return { score: 0, confidence: 0, maxSeverity: 'info' }
  }

  // Duplicate suppression: group by module
  const byModule = new Map<string, Finding[]>()
  for (const f of categoryFindings) {
    const existing = byModule.get(f.module) || []
    existing.push(f)
    byModule.set(f.module, existing)
  }

  let rawSum = 0
  let totalConfidence = 0
  let findingCount = 0
  let maxSeverity: Severity = 'info'
  const severityOrder: Severity[] = ['info', 'low', 'medium', 'high', 'critical']

  for (const [, moduleFindings] of byModule) {
    for (let i = 0; i < moduleFindings.length; i++) {
      const f = moduleFindings[i]
      const novelty = i === 0 ? NOVELTY_FIRST : NOVELTY_DUPLICATE
      const impact = SEVERITY_WEIGHT[f.severity] * CONFIDENCE_WEIGHT[f.confidence] * novelty
      rawSum += impact
      totalConfidence += CONFIDENCE_WEIGHT[f.confidence]
      findingCount++

      if (severityOrder.indexOf(f.severity) > severityOrder.indexOf(maxSeverity)) {
        maxSeverity = f.severity
      }
    }
  }

  // Normalize score
  let score = Math.min(100, (rawSum / PILLAR_SCALE_FACTOR) * 100)

  // Breadth factor
  const uniqueModules = byModule.size
  const breadth = uniqueModules / Math.max(1, moduleCount)
  if (breadth > BREADTH_THRESHOLD) {
    score = Math.min(100, score * (1 + (breadth - BREADTH_THRESHOLD) * BREADTH_BOOST_FACTOR))
  }

  const avgConfidence = totalConfidence / findingCount

  return {
    score: Math.round(score * 10) / 10,
    confidence: Math.round(avgConfidence * 100),
    maxSeverity,
  }
}

/* ═══════════════════════════════════════════════════════════════
   Overall Scoring
   ═══════════════════════════════════════════════════════════════ */

export interface ScoringResult {
  categories: ScanCategoryResult[]
  overallScore: number
  confidenceScore: number
  coverageScore: number
  maxSeverity: Severity
}

/**
 * Computes 7-category deterministic scores from findings.
 * Each finding's categoryId determines which category it contributes to.
 * Overall score = weighted average of category scores.
 */
export function computeScores(
  allFindings: Finding[],
  pagesAnalyzed: number,
  expectedPages: number,
): ScoringResult {
  // Group findings by category
  const findingsByCategory = new Map<ScanCategoryId, Finding[]>()
  for (const cat of SCAN_CATEGORIES) {
    findingsByCategory.set(cat.id, [])
  }

  for (const f of allFindings) {
    const catId = f.categoryId
    if (catId && findingsByCategory.has(catId)) {
      findingsByCategory.get(catId)!.push(f)
    }
  }

  // Compute per-category scores
  const categories: ScanCategoryResult[] = SCAN_CATEGORIES.map(catDef => {
    const catFindings = findingsByCategory.get(catDef.id) || []
    const moduleCount = CATEGORY_MODULE_COUNTS[catDef.id] || 3
    const { score, confidence, maxSeverity } = computeCategoryScore(catFindings, moduleCount)

    return {
      id: catDef.id,
      name: catDef.name,
      weight: catDef.weight,
      normalizedWeight: catDef.normalizedWeight,
      score,
      confidence,
      maxSeverity,
      findingCount: catFindings.length,
      findings: catFindings,
    }
  })

  // Compute overall score (weighted average)
  let overallScore = 0
  let totalWeightedConfidence = 0
  let globalMaxSeverity: Severity = 'info'
  const severityOrder: Severity[] = ['info', 'low', 'medium', 'high', 'critical']

  for (const cat of categories) {
    overallScore += cat.score * cat.normalizedWeight
    totalWeightedConfidence += cat.confidence * cat.normalizedWeight

    if (severityOrder.indexOf(cat.maxSeverity) > severityOrder.indexOf(globalMaxSeverity)) {
      globalMaxSeverity = cat.maxSeverity
    }
  }

  overallScore = Math.round(overallScore * 10) / 10
  const confidenceScore = Math.round(totalWeightedConfidence)

  // Coverage score
  const pageCoverage = pagesAnalyzed / Math.max(1, expectedPages)
  const stateCoverage = 1 / 9 // We cover 1 state (first visit with GPC). Full spec has 9 states.
  const coverageScore = Math.round(((pageCoverage * 0.6) + (stateCoverage * 0.4)) * 100)

  return {
    categories,
    overallScore,
    confidenceScore,
    coverageScore,
    maxSeverity: globalMaxSeverity,
  }
}
