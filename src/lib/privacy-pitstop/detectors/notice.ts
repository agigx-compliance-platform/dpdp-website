import type { Finding, FetchedPage, ScanContext, Severity, ConfidenceLevel } from '../types'
import { POLICY_SECTIONS, PRIVACY_LINK_PATTERNS, POLICY_DATE_PATTERNS } from '../constants'
import { pageEvidence, snippetEvidence, clauseEvidence } from '../evidence'

/** Helper to extract link hrefs from HTML */
function extractLinkHrefs(html: string): string[] {
  const hrefs: string[] = []
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) hrefs.push(m[1])
  return hrefs
}

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: import('../types').Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `notice-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P1',
    module,
    categoryId: 'notice',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Privacy Notice & Disclosure Integrity detector.
 * Detects: privacy policy presence, last updated date, data categories,
 * purpose, retention, sharing, rights, grievance, contact sections.
 *
 * Migrated from detectP1() with enhanced evidence collection.
 */
export function detectNotice(ctx: ScanContext): Finding[] {
  const { pages, scanId } = ctx
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  const privacyPages = pages.filter(p => p.pageClass === 'privacy' && p.status === 200)

  // Check for privacy policy link on homepage
  if (homepage) {
    const links = extractLinkHrefs(homepage.html)
    const hasPrivacyLink = links.some(h => PRIVACY_LINK_PATTERNS.some(p => p.test(h)))
    if (!hasPrivacyLink) {
      findings.push(finding('policy_link', 'No privacy policy link found on homepage',
        'The homepage does not contain a visible link to a privacy policy or privacy notice.',
        'high', 'high', 'detected',
        [pageEvidence(homepage.url, scanId)],
        'Add a clearly visible privacy policy link in the footer or navigation.'))
    }
  }

  // Check if privacy policy page exists
  if (privacyPages.length === 0) {
    findings.push(finding('policy_page', 'No accessible privacy policy page',
      'No privacy policy, cookie policy, or terms page could be accessed at standard paths.',
      'critical', 'high', 'detected',
      [pageEvidence(ctx.domain, scanId)],
      'Publish a comprehensive privacy policy at /privacy-policy.'))
  } else {
    const policy = privacyPages[0]
    const policyText = policy.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    const wordCount = policyText.split(/\s+/).length

    if (wordCount < 200) {
      findings.push(finding('policy_length', 'Privacy policy appears very short',
        `The privacy policy contains approximately ${wordCount} words, which may indicate incomplete disclosures.`,
        'medium', 'medium', 'detected',
        [pageEvidence(policy.url, scanId), snippetEvidence(policy.url, `Word count: ~${wordCount}`, scanId)],
        'Ensure the privacy policy covers all required disclosures under applicable laws.'))
    }

    // Check for last updated date
    let lastUpdatedFound = false
    for (const pattern of POLICY_DATE_PATTERNS) {
      const match = pattern.exec(policyText)
      if (match) {
        lastUpdatedFound = true
        break
      }
    }
    if (!lastUpdatedFound) {
      findings.push(finding('policy_date', 'No last-updated date found in privacy policy',
        'The privacy policy does not appear to include a last-updated or effective date.',
        'medium', 'medium', 'inferred',
        [pageEvidence(policy.url, scanId)],
        'Include a visible last-updated date to demonstrate policy currency.'))
    }

    // Check for key sections
    const missingKeys: string[] = []
    const foundKeys: string[] = []
    for (const section of POLICY_SECTIONS) {
      const found = section.patterns.some(p => p.test(policyText))
      if (!found) {
        missingKeys.push(section.key)
      } else {
        foundKeys.push(section.key)
      }
    }

    if (missingKeys.length > 5) {
      findings.push(finding('policy_sections', 'Privacy policy missing multiple key sections',
        `The privacy policy appears to be missing ${missingKeys.length} of ${POLICY_SECTIONS.length} standard sections: ${missingKeys.join(', ')}.`,
        'high', 'medium', 'inferred',
        [pageEvidence(policy.url, scanId), clauseEvidence(policy.url, `Found sections: ${foundKeys.join(', ')}`, scanId)],
        'Review and update the privacy policy to include all required disclosure categories.',
        `Missing: ${missingKeys.join(', ')}`))
    } else if (missingKeys.length > 2) {
      findings.push(finding('policy_sections', 'Privacy policy missing some key sections',
        `The privacy policy appears to be missing ${missingKeys.length} standard sections: ${missingKeys.join(', ')}.`,
        'medium', 'medium', 'inferred',
        [pageEvidence(policy.url, scanId), clauseEvidence(policy.url, `Found sections: ${foundKeys.join(', ')}`, scanId)],
        'Consider adding the missing sections to improve transparency.'))
    }

    // Extract purpose specification
    const purposePatterns = [/purpose\s+of\s+(collect|process|use)/i, /we\s+(use|collect|process).*\s+for\s+/i, /purpose.*(?:include|following)/i]
    const hasPurpose = purposePatterns.some(p => p.test(policyText))
    if (!hasPurpose) {
      findings.push(finding('purpose_spec', 'Purpose specification not clearly stated',
        'The privacy policy does not clearly articulate the specific purposes for data collection and processing.',
        'medium', 'medium', 'inferred',
        [pageEvidence(policy.url, scanId)],
        'Clearly list all purposes for which personal data is collected and processed.'))
    }
  }

  return findings
}
