import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { SESSION_REPLAY_DOMAINS, FINGERPRINT_PATTERNS } from '../constants'
import { pageEvidence, scriptEvidence } from '../evidence'

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

function matchesSessionReplay(hostname: string): boolean {
  for (const domain of SESSION_REPLAY_DOMAINS) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) return true
  }
  return false
}

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `dataleakage-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P8',
    module,
    categoryId: 'security', // Data leakage maps to security category
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Data Leakage & Session Replay detector.
 * Migrated from detectP7() + detectP8() + detectP9().
 * Detects: session replay, fingerprinting, exposed emails/phones,
 * exposed API keys, API endpoints.
 */
export function detectDataLeakage(ctx: ScanContext): Finding[] {
  const { pages, siteDomain, scanId } = ctx
  const findings: Finding[] = []

  // ── Session Replay (from detectP7) ────────────────────────
  const replayDomains = new Set<string>()
  const replayEvidence: Evidence[] = []

  for (const page of pages) {
    if (page.status !== 200) continue

    const scriptSrcs = extractScriptSrcs(page.html)
    for (const src of scriptSrcs) {
      const host = getDomainFromUrl(src)
      if (matchesSessionReplay(host)) {
        replayDomains.add(host)
        replayEvidence.push(scriptEvidence(src, page.url, scanId))
      }
    }

    if (/hj\s*\(\s*['"]init['"]|_fs_host|LogRocket\.init|smartlook\s*\(/i.test(page.html)) {
      replayDomains.add('inline-init')
    }

    // Fingerprinting
    for (const pattern of FINGERPRINT_PATTERNS) {
      if (pattern.test(page.html)) {
        findings.push(finding('fingerprinting', 'Browser fingerprinting code detected',
          'Code patterns associated with browser fingerprinting were detected in the page source.',
          'high', 'medium', 'detected',
          [pageEvidence(page.url, scanId)],
          'Disclose fingerprinting practices and ensure they are gated behind consent.'))
        break
      }
    }
  }

  if (replayDomains.size > 0) {
    const clean = [...replayDomains].filter(d => d !== 'inline-init')
    findings.push(finding('session_replay', 'Session replay tool(s) detected',
      `Session replay or behaviour recording scripts detected${clean.length ? `: ${clean.join(', ')}` : ''}.`,
      'high', 'high', 'detected',
      [pageEvidence(ctx.domain, scanId), ...replayEvidence.slice(0, 5)],
      'Disclose session replay tools in the privacy policy and gate them behind consent.',
      `Domains: ${[...replayDomains].join(', ')}`))
  }

  // ── Exposed Personal Data (from detectP8) ─────────────────
  for (const page of pages) {
    if (page.status !== 200) continue

    const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = page.html.match(emailRe) || []
    const realEmails = emails.filter(e => !/example\.com|placeholder|test\.|schema\.org/i.test(e))

    if (realEmails.length > 3) {
      findings.push(finding('exposed_emails', `${realEmails.length} email addresses exposed in page HTML`,
        `Multiple email addresses are visible in the page source of ${page.url}, which may expose personal data.`,
        'medium', 'high', 'detected',
        [pageEvidence(page.url, scanId)],
        'Minimize exposure of email addresses in public HTML. Use contact forms instead.'))
    }

    const phoneRe = /(?:\+\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g
    const phones = page.html.replace(/<[^>]+>/g, '').match(phoneRe) || []
    if (phones.length > 5) {
      findings.push(finding('exposed_phones', 'Multiple phone numbers found in page source',
        `Several phone number patterns detected in ${page.url}.`,
        'low', 'low', 'inferred',
        [pageEvidence(page.url, scanId)]))
    }
  }

  // ── Exposed API Keys (from detectP9) ──────────────────────
  for (const page of pages) {
    if (page.status !== 200) continue

    const apiKeyPatterns = [
      /['"](?:api[_-]?key|apikey|api[_-]?secret|api[_-]?token)\s*['"]?\s*[:=]\s*['"]([a-zA-Z0-9_-]{20,})['"]/gi,
      /AIza[0-9A-Za-z_-]{35}/g,
      /sk_live_[0-9A-Za-z]{20,}/g,
      /pk_live_[0-9A-Za-z]{20,}/g,
    ]

    for (const pattern of apiKeyPatterns) {
      if (pattern.test(page.html)) {
        findings.push(finding('exposed_api_key', 'Possible API key exposed in page source',
          `A pattern resembling an API key was detected in the HTML source of ${page.url}.`,
          'critical', 'medium', 'detected',
          [pageEvidence(page.url, scanId)],
          'Remove API keys from client-side code. Use server-side proxies for API calls.'))
        break
      }
    }

    if (/graphql|\/api\/v\d/i.test(page.html)) {
      const apiEndpoints = page.html.match(/["']((?:https?:)?\/\/[^"']+\/(?:graphql|api\/v\d[^"']*))['"]/gi)
      if (apiEndpoints && apiEndpoints.length > 0) {
        findings.push(finding('api_endpoints', 'Public API endpoints exposed in source',
          `${apiEndpoints.length} API endpoint reference(s) found in client-side code.`,
          'medium', 'medium', 'detected',
          [pageEvidence(page.url, scanId)],
          'Review exposed API endpoints for proper authentication and rate limiting.'))
      }
    }
  }

  return findings
}
