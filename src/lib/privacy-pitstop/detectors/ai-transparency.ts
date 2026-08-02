import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { AI_DISCLOSURE_PATTERNS } from '../constants'
import { pageEvidence, clauseEvidence } from '../evidence'

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `ai-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P7',
    module,
    categoryId: 'ai_transparency',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

interface AISignal {
  category: string
  label: string
  patterns: RegExp[]
}

const AI_SIGNALS: AISignal[] = [
  { category: 'usage', label: 'AI Usage Disclosure', patterns: [/artificial\s+intelligence/i, /\bAI\b.*(?:use|usage|system)/i, /machine\s+learning/i] },
  { category: 'training', label: 'AI Training Disclosure', patterns: [/AI\s+training/i, /train.*(?:model|data|algorithm)/i, /training\s+data/i] },
  { category: 'profiling', label: 'Profiling Disclosure', patterns: [/profiling/i, /automated\s+profiling/i, /behavioral\s+(?:analysis|profiling)/i] },
  { category: 'automated_decisions', label: 'Automated Decision-Making', patterns: [/automated\s+decision[\s-]?making/i, /algorithmic\s+decision/i, /automated.*(?:decision|assessment)/i] },
  { category: 'human_review', label: 'Human Review', patterns: [/human\s+review/i, /human\s+oversight/i, /human-in-the-loop/i, /manual\s+review/i] },
  { category: 'explainability', label: 'Explainability', patterns: [/explainab/i, /interpretab/i, /transparency.*AI/i, /how.*(?:AI|algorithm).*work/i] },
  { category: 'ai_opt_out', label: 'AI Opt-Out', patterns: [/AI\s+opt[\s-]?out/i, /opt[\s-]?out.*AI/i, /refuse.*(?:AI|automated|profiling)/i] },
]

/**
 * AI Transparency detector.
 * NEW module — scans privacy pages and dedicated AI policy pages for
 * disclosures about AI usage, training, profiling, automated decisions,
 * human review, explainability, and opt-out.
 */
export function detectAITransparency(ctx: ScanContext): Finding[] {
  const { pages, scanId } = ctx
  const findings: Finding[] = []

  const privacyPages = pages.filter(p => p.pageClass === 'privacy' && p.status === 200)
  const aiPages = pages.filter(p => p.pageClass === 'ai' && p.status === 200)
  const allRelevantPages = [...privacyPages, ...aiPages]

  // Check for dedicated AI policy page
  const hasAIPage = aiPages.length > 0
  // Not a finding per se — just context for other checks

  if (allRelevantPages.length === 0) {
    // Can't check AI transparency without any policy/AI pages
    findings.push(finding('no_pages', 'Cannot assess AI transparency',
      'No privacy policy or AI policy pages were accessible to evaluate AI transparency disclosures.',
      'info', 'low', 'inferred',
      [pageEvidence(ctx.domain, scanId)],
      'Publish privacy and/or AI policy pages to enable AI transparency assessment.'))
    return findings
  }

  const allText = allRelevantPages.map(p => p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).join(' ')

  // Check for any AI-related mention at all
  const hasAnyAIMention = AI_DISCLOSURE_PATTERNS.some(p => p.test(allText))

  if (!hasAnyAIMention) {
    findings.push(finding('no_ai_disclosure', 'No AI or automated processing disclosure found',
      'No mention of artificial intelligence, machine learning, automated decision-making, or profiling was found in privacy-related pages.',
      'medium', 'medium', 'inferred',
      allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'If AI or automated processing is used, disclose its purpose, scope, and impact in the privacy policy.'))
    return findings
  }

  // Check individual AI signals
  const foundSignals: string[] = []
  const missingSignals: string[] = []

  for (const signal of AI_SIGNALS) {
    const found = signal.patterns.some(p => p.test(allText))
    if (found) {
      foundSignals.push(signal.label)
    } else {
      missingSignals.push(signal.label)
    }
  }

  // Report found AI signals
  if (foundSignals.length > 0 && missingSignals.length > 0) {
    findings.push(finding('partial_ai_disclosure', 'Partial AI transparency disclosure',
      `AI-related disclosures were found (${foundSignals.join(', ')}), but some transparency areas are not addressed: ${missingSignals.join(', ')}.`,
      'medium', 'medium', 'inferred',
      allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Consider expanding AI transparency disclosures to cover all aspects of automated processing.',
      `Found: ${foundSignals.join(', ')} | Missing: ${missingSignals.join(', ')}`))
  }

  // Specific check: profiling without opt-out
  const hasProfiling = AI_SIGNALS.find(s => s.category === 'profiling')?.patterns.some(p => p.test(allText))
  const hasOptOut = AI_SIGNALS.find(s => s.category === 'ai_opt_out')?.patterns.some(p => p.test(allText))
  if (hasProfiling && !hasOptOut) {
    findings.push(finding('profiling_no_optout', 'Profiling mentioned without opt-out mechanism',
      'Profiling or behavioral analysis is disclosed but no opt-out mechanism for profiling was found.',
      'high', 'medium', 'inferred',
      allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Provide a clear opt-out mechanism for users who do not wish to be profiled.'))
  }

  // Specific check: automated decisions without human review
  const hasAutomated = AI_SIGNALS.find(s => s.category === 'automated_decisions')?.patterns.some(p => p.test(allText))
  const hasHumanReview = AI_SIGNALS.find(s => s.category === 'human_review')?.patterns.some(p => p.test(allText))
  if (hasAutomated && !hasHumanReview) {
    findings.push(finding('automated_no_review', 'Automated decisions without human review disclosure',
      'Automated decision-making is mentioned but no human review or oversight mechanism is disclosed.',
      'high', 'medium', 'inferred',
      allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Disclose how users can request human review of automated decisions.'))
  }

  return findings
}
