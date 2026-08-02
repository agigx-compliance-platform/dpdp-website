import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { CHILDRENS_PRIVACY_PATTERNS } from '../constants'
import { pageEvidence, clauseEvidence } from '../evidence'

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `children-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P1', // Classified under notice for legacy, but new category
    module,
    categoryId: 'childrens_privacy',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Children's Privacy detector.
 * NEW module — extracted from POLICY_SECTIONS keyword check.
 * Detects: child privacy policy, parental consent, child data handling,
 * age verification, Section 9 compliance.
 */
export function detectChildrensPrivacy(ctx: ScanContext): Finding[] {
  const { pages, scanId } = ctx
  const findings: Finding[] = []

  const privacyPages = pages.filter(p => p.pageClass === 'privacy' && p.status === 200)

  if (privacyPages.length === 0) {
    findings.push(finding('no_pages', 'Cannot assess children\'s privacy protections',
      'No privacy policy pages were accessible to evaluate children\'s data protection disclosures.',
      'info', 'low', 'inferred',
      [pageEvidence(ctx.domain, scanId)],
      'Publish a privacy policy that addresses children\'s data protection requirements.'))
    return findings
  }

  const allPolicyText = privacyPages.map(p => p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).join(' ')

  // Check for any children's privacy mention
  const hasChildrenMention = CHILDRENS_PRIVACY_PATTERNS.some(p => p.test(allPolicyText))

  if (!hasChildrenMention) {
    findings.push(finding('no_children_policy', 'No children\'s privacy section found',
      'The privacy policy does not contain any mention of children\'s data protection, age restrictions, or parental consent.',
      'medium', 'medium', 'inferred',
      privacyPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Add a children\'s privacy section addressing data handling for minors, even if the service is not directed at children.'))
    return findings
  }

  // Detailed checks when children are mentioned
  const hasParentalConsent = /parental\s+consent|verifiable\s+parental|guardian('s)?\s+consent/i.test(allPolicyText)
  if (!hasParentalConsent) {
    findings.push(finding('no_parental_consent', 'No parental consent mechanism mentioned',
      'Children\'s data is referenced but no parental consent mechanism or verification process is described.',
      'high', 'medium', 'inferred',
      privacyPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Describe the parental consent mechanism used for children\'s data, as required by Section 9 of the DPDP Act.'))
  }

  const hasChildDataHandling = /child(ren)?('s)?\s+data\s+(?:is|will|shall|may)\s+(?:be\s+)?(?:collect|process|stor|use|delet)/i.test(allPolicyText)
  if (!hasChildDataHandling) {
    findings.push(finding('child_data_handling', 'Child data handling practices not described',
      'While children are mentioned, specific data handling practices for children\'s data are not clearly described.',
      'medium', 'medium', 'inferred',
      privacyPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Describe how children\'s data is collected, processed, stored, and deleted.'))
  }

  const hasAgeVerification = /age\s+(?:verification|gate|check)|verify.*age|minimum\s+age/i.test(allPolicyText)
  if (!hasAgeVerification) {
    findings.push(finding('no_age_verification', 'No age verification mechanism mentioned',
      'No age verification or age-gating mechanism is described for identifying child users.',
      'medium', 'low', 'inferred',
      privacyPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
      'Consider implementing and disclosing an age verification mechanism.'))
  }

  return findings
}
