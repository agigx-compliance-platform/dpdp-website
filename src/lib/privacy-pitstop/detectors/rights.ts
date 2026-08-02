import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { RIGHTS_LINK_PATTERNS, INDIVIDUAL_RIGHTS_PATTERNS } from '../constants'
import { pageEvidence, snippetEvidence, linkEvidence, clauseEvidence } from '../evidence'

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
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `rights-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P10',
    module,
    categoryId: 'rights',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Rights & Grievance detector.
 * Migrated from detectP10() with individual right detection.
 * Detects: access, correction, deletion, withdrawal, grievance,
 * contact, opt-out, GPC recognition, DPO contact.
 */
export function detectRights(ctx: ScanContext): Finding[] {
  const { pages, scanId } = ctx
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  const privacyPages = pages.filter(p => p.pageClass === 'privacy' && p.status === 200)
  const rightsPages = pages.filter(p => p.pageClass === 'rights' && p.status === 200)
  const allRelevantPages = [...privacyPages, ...rightsPages]

  // Check for rights/opt-out links on homepage
  if (homepage) {
    const links = extractLinkHrefs(homepage.html)
    const hasRightsLink = links.some(h => RIGHTS_LINK_PATTERNS.some(p => p.test(h)))

    if (!hasRightsLink) {
      findings.push(finding('rights_link', 'No data subject rights link found',
        'No link to a data subject rights page, opt-out mechanism, or grievance redressal was found on the homepage.',
        'high', 'medium', 'inferred',
        [pageEvidence(homepage.url, scanId)],
        'Provide a clear, accessible link for users to exercise their data subject rights.'))
    }
  }

  // Check GPC header recognition
  if (homepage && homepage.headers['sec-gpc'] === undefined) {
    findings.push(finding('gpc', 'GPC signal recognition not confirmed',
      'The website did not return a Sec-GPC response header, suggesting it may not recognize Global Privacy Control signals.',
      'low', 'low', 'inferred',
      [pageEvidence(homepage.url, scanId)],
      'Consider implementing GPC signal recognition as recommended by privacy regulations.'))
  }

  // Check for DPO/grievance officer contact
  if (allRelevantPages.length > 0) {
    const allText = allRelevantPages.map(p => p.html).join(' ')
    const hasDpo = /data\s+protection\s+officer|DPO|grievance\s+officer|nodal\s+officer/i.test(allText)
    if (!hasDpo) {
      findings.push(finding('dpo_contact', 'No DPO or Grievance Officer contact found',
        'No reference to a Data Protection Officer, Grievance Officer, or Nodal Officer was found in privacy-related pages.',
        'medium', 'medium', 'inferred',
        allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
        'Designate and publish contact details for a DPO or Grievance Officer as required by applicable regulations.'))
    }
  }

  // ── Individual Rights Detection ──────────────────────────────
  if (allRelevantPages.length > 0) {
    const allPolicyText = allRelevantPages.map(p => p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).join(' ')
    const missingRights: string[] = []
    const foundRights: string[] = []

    for (const { right, patterns } of INDIVIDUAL_RIGHTS_PATTERNS) {
      const found = patterns.some(p => p.test(allPolicyText))
      if (found) {
        foundRights.push(right)
      } else {
        missingRights.push(right)
      }
    }

    if (missingRights.length > 3) {
      findings.push(finding('individual_rights', 'Multiple data subject rights not disclosed',
        `${missingRights.length} of ${INDIVIDUAL_RIGHTS_PATTERNS.length} individual rights are not explicitly mentioned: ${missingRights.join(', ')}.`,
        'high', 'medium', 'inferred',
        allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
        'Clearly describe all available data subject rights in the privacy policy.',
        `Found: ${foundRights.join(', ')} | Missing: ${missingRights.join(', ')}`))
    } else if (missingRights.length > 0) {
      findings.push(finding('individual_rights', 'Some data subject rights not explicitly mentioned',
        `${missingRights.length} rights are not explicitly mentioned: ${missingRights.join(', ')}.`,
        'medium', 'medium', 'inferred',
        allRelevantPages.slice(0, 2).map(p => pageEvidence(p.url, scanId)),
        'Consider adding explicit disclosure of all individual rights.',
        `Found: ${foundRights.join(', ')} | Missing: ${missingRights.join(', ')}`))
    }
  } else {
    findings.push(finding('no_rights_pages', 'No privacy or rights pages accessible',
      'No privacy policy or rights-related pages were accessible, making it impossible to verify rights disclosures.',
      'high', 'high', 'detected',
      [pageEvidence(ctx.domain, scanId)],
      'Publish accessible privacy and rights pages.'))
  }

  return findings
}
