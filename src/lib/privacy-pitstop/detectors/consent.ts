import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { CMP_INDICATORS } from '../constants'
import { pageEvidence, snippetEvidence, scriptEvidence } from '../evidence'

function extractScriptSrcs(html: string): string[] {
  const srcs: string[] = []
  const re = /<script[^>]+src\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) srcs.push(m[1])
  return srcs
}

function getDomainFromUrl(url: string): string {
  try { return new URL(url, 'https://placeholder.com').hostname } catch { return '' }
}

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `consent-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P2',
    module,
    categoryId: 'consent',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

function extractLinkHrefs(html: string): string[] {
  const hrefs: string[] = []
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) hrefs.push(m[1])
  return hrefs
}

/**
 * Consent Banner & Choice Architecture detector.
 * Migrated from detectP2() + detectP4() + detectP6().
 * Detects: banner presence, accept/reject options, manage preferences,
 * withdraw consent, dark patterns (pre-checked boxes, consent walls).
 */
export function detectConsent(ctx: ScanContext): Finding[] {
  const { pages, scanId } = ctx
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  if (!homepage) return findings

  const htmlLower = homepage.html.toLowerCase()

  // ── CMP Presence ──────────────────────────────────────────
  const cmpFound = CMP_INDICATORS.some(ind => htmlLower.includes(ind.toLowerCase()))
  const scriptSrcs = extractScriptSrcs(homepage.html)
  const cmpScript = scriptSrcs.some(src => {
    const host = getDomainFromUrl(src)
    return CMP_INDICATORS.some(ind => host.includes(ind) || src.toLowerCase().includes(ind))
  })

  if (!cmpFound && !cmpScript) {
    findings.push(finding('cmp_presence', 'No consent management platform detected',
      'No cookie consent banner, CMP, or consent management script was detected on the homepage.',
      'critical', 'high', 'detected',
      [pageEvidence(homepage.url, scanId)],
      'Implement a consent management platform (e.g., OneTrust, CookieBot, or an equivalent) to manage cookie consent.'))
  }

  // ── Accept / Reject options ───────────────────────────────
  if (cmpFound || cmpScript) {
    const hasReject = /reject\s*all|deny\s*all|decline\s*all|refuse|opt[\s-]?out/i.test(htmlLower)
    const hasAccept = /accept\s*all|allow\s*all|agree|i\s*accept/i.test(htmlLower)

    if (hasAccept && !hasReject) {
      findings.push(finding('reject_option', 'Consent banner may lack a reject option',
        'An accept-all option was detected but no corresponding reject-all or decline option was found in the initial page HTML.',
        'high', 'medium', 'inferred',
        [pageEvidence(homepage.url, scanId)],
        'Provide an equally prominent reject-all option alongside accept-all.',
        'Note: Dynamically rendered reject buttons cannot be detected without browser automation.'))
    }

    // ── Manage preferences ────────────────────────────────────
    const hasManage = /manage\s*(preferences|cookies|settings)|customize|cookie\s*settings/i.test(htmlLower)
    if (!hasManage) {
      findings.push(finding('manage_prefs', 'No manage preferences option detected',
        'No option to manage or customize cookie preferences was detected in the consent interface.',
        'medium', 'medium', 'inferred',
        [pageEvidence(homepage.url, scanId)],
        'Provide a granular preferences panel that allows users to select specific cookie categories.',
        'Note: Dynamically rendered preference panels cannot be detected without browser automation.'))
    }
  }

  // ── Preference center / cookie settings link (from detectP4) ─
  const links = extractLinkHrefs(homepage.html)
  const hasPrefCenter = links.some(h =>
    /cookie[\s_-]?settings|cookie[\s_-]?preferences|manage[\s_-]?consent|manage[\s_-]?cookies|preference[\s_-]?center/i.test(h)
  ) || /cookie[\s_-]?settings|manage[\s_-]?consent|preference[\s_-]?center/i.test(htmlLower)

  if (!hasPrefCenter) {
    findings.push(finding('pref_center', 'No consent preference center link detected',
      'No link to a cookie settings, preference center, or manage-consent page was found.',
      'high', 'medium', 'inferred',
      [pageEvidence(homepage.url, scanId)],
      'Provide a persistent, accessible link to a consent preference center where users can modify or revoke consent.',
      'Note: Dynamically injected preference center links (e.g., via CMP widget) cannot be detected without browser automation.'))
  }

  // ── Withdraw consent mechanism ──────────────────────────────
  const hasWithdraw = /withdraw|revoke|change.*consent|update.*preferences/i.test(htmlLower)
  if (!hasWithdraw && !hasPrefCenter) {
    findings.push(finding('revocation', 'No consent revocation mechanism detected',
      'No visible mechanism for users to withdraw or change their consent was detected in the page HTML.',
      'high', 'medium', 'inferred',
      [pageEvidence(homepage.url, scanId)],
      'Implement a clearly accessible consent revocation mechanism.'))
  }

  // ── Dark Patterns (from detectP6) ──────────────────────────
  const preChecked = /checked\s*(?:=\s*["']?(?:checked|true)["']?)?[^>]*(?:consent|marketing|newsletter|subscribe)/i.test(homepage.html)
  if (preChecked) {
    findings.push(finding('pre_checked', 'Pre-checked consent checkbox detected',
      'A consent-related checkbox appears to be pre-checked in the HTML source, which may constitute a dark pattern.',
      'high', 'medium', 'inferred',
      [pageEvidence(homepage.url, scanId)],
      'Ensure all consent checkboxes are unchecked by default.'))
  }

  const consentWall = /consent-wall|access-wall|you\s+must\s+accept|continue.*accept/i.test(homepage.html)
  if (consentWall) {
    findings.push(finding('consent_wall', 'Potential consent wall detected',
      'Language suggesting forced consent before accessing content was found.',
      'high', 'medium', 'inferred',
      [pageEvidence(homepage.url, scanId)],
      'Avoid making content access contingent on accepting non-essential cookies or tracking.'))
  }

  return findings
}
