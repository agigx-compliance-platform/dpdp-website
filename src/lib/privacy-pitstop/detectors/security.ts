import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { SECURITY_HEADERS } from '../constants'
import { pageEvidence, headerEvidence } from '../evidence'

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `security-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P9',
    module,
    categoryId: 'security',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Security Signals detector.
 * NEW module — checks HTTPS, security headers, security.txt presence.
 */
export function detectSecurity(ctx: ScanContext): Finding[] {
  const { pages, domain, scanId } = ctx
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  const securityTxtPage = pages.find(p => p.pageClass === 'security_txt')

  // ── HTTPS Check ─────────────────────────────────────────────
  if (homepage) {
    const isHttps = homepage.url.startsWith('https://')
    if (!isHttps) {
      findings.push(finding('no_https', 'Website not served over HTTPS',
        'The website does not use HTTPS, exposing user data to interception in transit.',
        'critical', 'high', 'detected',
        [pageEvidence(homepage.url, scanId)],
        'Enable HTTPS with a valid TLS certificate for all pages.'))
    }
  }

  // ── Security Headers Check ──────────────────────────────────
  if (homepage) {
    const missingHeaders: { header: string; severity: 'high' | 'medium' | 'low' }[] = []
    const presentHeaders: string[] = []

    for (const { header, severity } of SECURITY_HEADERS) {
      if (homepage.headers[header]) {
        presentHeaders.push(header)
      } else {
        missingHeaders.push({ header, severity })
      }
    }

    const highMissing = missingHeaders.filter(h => h.severity === 'high')
    const medMissing = missingHeaders.filter(h => h.severity === 'medium')

    if (highMissing.length > 0) {
      findings.push(finding('missing_security_headers_high',
        `Missing critical security header(s): ${highMissing.map(h => h.header).join(', ')}`,
        `The following critical security headers are not present: ${highMissing.map(h => h.header).join(', ')}.`,
        'high', 'high', 'detected',
        [
          pageEvidence(homepage.url, scanId),
          ...highMissing.map(h => headerEvidence(homepage.url, h.header, 'MISSING', scanId)),
        ],
        `Configure the following headers: ${highMissing.map(h => h.header).join(', ')}.`,
        `Present: ${presentHeaders.join(', ')}`))
    }

    if (medMissing.length > 0) {
      findings.push(finding('missing_security_headers_med',
        `Missing recommended security header(s): ${medMissing.map(h => h.header).join(', ')}`,
        `The following recommended security headers are not present: ${medMissing.map(h => h.header).join(', ')}.`,
        'medium', 'high', 'detected',
        [
          pageEvidence(homepage.url, scanId),
          ...medMissing.map(h => headerEvidence(homepage.url, h.header, 'MISSING', scanId)),
        ],
        `Consider adding: ${medMissing.map(h => h.header).join(', ')}.`))
    }
  }

  // ── security.txt Check ──────────────────────────────────────
  if (securityTxtPage) {
    if (securityTxtPage.status !== 200 || !securityTxtPage.html.trim()) {
      findings.push(finding('no_security_txt', 'No security.txt file found',
        'No security.txt file was found at /.well-known/security.txt, which is a standard way to publish security contact information.',
        'low', 'high', 'detected',
        [pageEvidence(securityTxtPage.url, scanId)],
        'Create a security.txt file per RFC 9116 at /.well-known/security.txt.'))
    } else {
      // Validate basic content
      const hasContact = /contact:/i.test(securityTxtPage.html)
      if (!hasContact) {
        findings.push(finding('security_txt_incomplete', 'security.txt missing Contact field',
          'A security.txt file was found but it does not contain the required Contact field.',
          'low', 'medium', 'detected',
          [pageEvidence(securityTxtPage.url, scanId), { type: 'html_snippet', snippet: securityTxtPage.html.slice(0, 200), timestamp: new Date().toISOString(), scanId }],
          'Add a Contact field to security.txt as required by RFC 9116.'))
      }
    }
  }

  return findings
}
