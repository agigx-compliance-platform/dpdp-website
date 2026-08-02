import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { TRACKER_DOMAINS, AD_PIXEL_PATTERNS } from '../constants'
import { pageEvidence, scriptEvidence, cookieEvidence, headerEvidence } from '../evidence'

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

function isThirdParty(srcDomain: string, siteDomain: string): boolean {
  if (!srcDomain || !siteDomain) return false
  const clean = (d: string) => d.replace(/^www\./, '')
  return clean(srcDomain) !== clean(siteDomain) && !srcDomain.endsWith(`.${clean(siteDomain)}`)
}

function matchesTrackerDomain(hostname: string): boolean {
  for (const tracker of TRACKER_DOMAINS) {
    if (hostname === tracker || hostname.endsWith(`.${tracker}`)) return true
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
    id: `cookies-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P3',
    module,
    categoryId: 'cookies',
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Cookie & Pre-Consent Tracking detector.
 * Migrated from detectP3() with enhanced cookie classification and evidence.
 * Detects: pre-consent tracking scripts, inline tracking, server cookies,
 * cookie classification (essential vs tracking).
 */
export function detectCookies(ctx: ScanContext): Finding[] {
  const { pages, siteDomain, scanId } = ctx
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  if (!homepage) return findings

  const scriptSrcs = extractScriptSrcs(homepage.html)
  const preConsentTrackers: string[] = []
  const trackerEvidence: Evidence[] = []

  for (const src of scriptSrcs) {
    const host = getDomainFromUrl(src)
    if (isThirdParty(host, siteDomain) && matchesTrackerDomain(host)) {
      preConsentTrackers.push(host)
      trackerEvidence.push(scriptEvidence(src, homepage.url, scanId))
    }
  }

  // Check for inline tracking code
  const inlineTracking = AD_PIXEL_PATTERNS.some(p => p.test(homepage.html))

  if (preConsentTrackers.length > 0) {
    const uniqueTrackers = [...new Set(preConsentTrackers)]
    findings.push(finding('pre_consent_trackers',
      `${uniqueTrackers.length} tracking script(s) loaded before consent`,
      `The following tracking scripts are loaded in the initial HTML before any consent interaction: ${uniqueTrackers.join(', ')}.`,
      uniqueTrackers.length > 3 ? 'critical' : 'high', 'high', 'detected',
      [pageEvidence(homepage.url, scanId), ...trackerEvidence.slice(0, 5)],
      'Defer all tracking scripts until the user has provided explicit consent.',
      `Domains: ${uniqueTrackers.join(', ')}`))
  }

  if (inlineTracking) {
    findings.push(finding('inline_tracking', 'Inline tracking code detected in page source',
      'Inline analytics or pixel tracking code was found in the HTML source, which executes before consent can be collected.',
      'high', 'medium', 'detected',
      [pageEvidence(homepage.url, scanId)],
      'Move inline tracking code behind a consent gate.'))
  }

  // Check Set-Cookie headers on initial response
  const setCookies = homepage.headers['set-cookie']
  if (setCookies) {
    const cookieParts = setCookies.split(/,(?=[^ ])/)
    const cookieCount = cookieParts.length
    const cookieNames = cookieParts.map(c => c.split('=')[0]?.trim()).filter(Boolean)

    // Classify cookies
    const essentialPatterns = /session|csrf|xsrf|__host|__secure|necessary/i
    const trackingPatterns = /track|analytics|_ga|_gid|_fbp|_fbc|hubspot|utm|pixel|campaign/i

    const trackingCookies = cookieNames.filter(n => trackingPatterns.test(n))
    const essentialCookies = cookieNames.filter(n => essentialPatterns.test(n))
    const unclassified = cookieNames.filter(n => !trackingPatterns.test(n) && !essentialPatterns.test(n))

    const cookieEvidenceItems = cookieNames.slice(0, 5).map(n =>
      cookieEvidence(n, homepage.url, undefined, scanId)
    )

    if (cookieCount > 0) {
      findings.push(finding('server_cookies', `Server sets ${cookieCount} cookie(s) on first visit`,
        `The server's initial HTTP response includes Set-Cookie headers, setting cookies before any consent interaction.${
          trackingCookies.length > 0 ? ` Likely tracking cookies: ${trackingCookies.join(', ')}.` : ''
        }`,
        cookieCount > 3 ? 'high' : 'medium', 'high', 'detected',
        [headerEvidence(homepage.url, 'set-cookie', `${cookieCount} cookies set`, scanId), ...cookieEvidenceItems],
        'Review server-side cookie setting to ensure only strictly necessary cookies are set before consent.',
        `Total: ${cookieCount}, Essential: ${essentialCookies.length}, Tracking: ${trackingCookies.length}, Other: ${unclassified.length}`))
    }
  }

  return findings
}
