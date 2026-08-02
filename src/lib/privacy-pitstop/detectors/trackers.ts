import type { Finding, ScanContext, Severity, ConfidenceLevel, Evidence } from '../types'
import { TRACKER_DOMAINS } from '../constants'
import { pageEvidence, scriptEvidence } from '../evidence'

function extractScriptSrcs(html: string): string[] {
  const srcs: string[] = []
  const re = /<script[^>]+src\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) srcs.push(m[1])
  return srcs
}

function extractImgSrcs(html: string): string[] {
  const srcs: string[] = []
  const re = /<img[^>]+src\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) srcs.push(m[1])
  return srcs
}

function extractIframeSrcs(html: string): string[] {
  const srcs: string[] = []
  const re = /<iframe[^>]+src\s*=\s*["']([^"']+)["']/gi
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

/** Categorize a tracker domain */
function categorizeTracker(hostname: string): string {
  if (/google-analytics|googletagmanager|gtag|analytics/i.test(hostname)) return 'analytics'
  if (/googleadservices|googlesyndication|doubleclick|criteo|adroll|taboola|outbrain|amazon-adsystem|media\.net|rubiconproject|openx|pubmatic|adsrvr/i.test(hostname)) return 'advertising'
  if (/facebook|twitter|linkedin|pinterest|tiktok|snap/i.test(hostname)) return 'social'
  if (/hotjar|fullstory|logrocket|smartlook|mouseflow|luckyorange|clarity|inspectlet|crazyegg/i.test(hostname)) return 'session_replay'
  if (/mixpanel|amplitude|segment|heap|chartbeat|parsely|piano/i.test(hostname)) return 'analytics'
  if (/hubspot|marketo|pardot|salesforce/i.test(hostname)) return 'marketing'
  return 'other'
}

function finding(
  module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidenceStatus: 'detected' | 'inferred',
  evidenceItems: Evidence[],
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `trackers-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId: 'P5',
    module,
    categoryId: 'cookies', // Trackers contribute to cookies category
    title, description, severity, confidence,
    evidence: evidenceStatus,
    evidenceItems,
    recommendation, details,
  }
}

/**
 * Third-Party Data Sharing & Tracker Ecosystem detector.
 * Migrated from detectP5() with tracker categorization.
 */
export function detectTrackers(ctx: ScanContext): Finding[] {
  const { pages, siteDomain, scanId } = ctx
  const findings: Finding[] = []
  const allThirdPartyDomains = new Set<string>()
  const adNetworks = new Set<string>()
  const trackerCategories: Record<string, Set<string>> = {}
  const pixelCount = { count: 0 }
  const trackerEvidenceItems: Evidence[] = []

  for (const page of pages) {
    if (page.status !== 200) continue

    const scriptSrcs = extractScriptSrcs(page.html)
    const imgSrcs = extractImgSrcs(page.html)
    const iframeSrcs = extractIframeSrcs(page.html)

    for (const src of [...scriptSrcs, ...imgSrcs, ...iframeSrcs]) {
      const host = getDomainFromUrl(src)
      if (isThirdParty(host, siteDomain)) {
        allThirdPartyDomains.add(host)
        if (matchesTrackerDomain(host)) {
          adNetworks.add(host)
          const cat = categorizeTracker(host)
          if (!trackerCategories[cat]) trackerCategories[cat] = new Set()
          trackerCategories[cat].add(host)
          if (trackerEvidenceItems.length < 10) {
            trackerEvidenceItems.push(scriptEvidence(src, page.url, scanId))
          }
        }
      }
    }

    // Detect tracking pixels (1x1 images)
    const pixelRe = /width\s*=\s*["']?1["']?\s+height\s*=\s*["']?1["']?|height\s*=\s*["']?1["']?\s+width\s*=\s*["']?1["']?/gi
    while (pixelRe.exec(page.html)) {
      pixelCount.count++
    }
  }

  if (allThirdPartyDomains.size > 10) {
    findings.push(finding('third_party_count',
      `${allThirdPartyDomains.size} third-party domains detected`,
      `The website loads resources from ${allThirdPartyDomains.size} third-party domains, indicating extensive data sharing.`,
      allThirdPartyDomains.size > 25 ? 'critical' : 'high', 'high', 'detected',
      [pageEvidence(ctx.domain, scanId), ...trackerEvidenceItems.slice(0, 5)],
      'Review and minimize third-party integrations. Ensure each is disclosed in the privacy policy.',
      `Sample domains: ${[...allThirdPartyDomains].slice(0, 10).join(', ')}`))
  } else if (allThirdPartyDomains.size > 5) {
    findings.push(finding('third_party_count',
      `${allThirdPartyDomains.size} third-party domains detected`,
      `The website loads resources from ${allThirdPartyDomains.size} third-party domains.`,
      'medium', 'high', 'detected',
      [pageEvidence(ctx.domain, scanId)]))
  }

  if (adNetworks.size > 0) {
    // Build category breakdown for details
    const catBreakdown = Object.entries(trackerCategories)
      .map(([cat, domains]) => `${cat}: ${[...domains].join(', ')}`)
      .join('; ')

    findings.push(finding('ad_networks',
      `${adNetworks.size} known advertising/tracking network(s) detected`,
      `Known tracker or ad network scripts detected: ${[...adNetworks].slice(0, 8).join(', ')}.`,
      adNetworks.size > 5 ? 'high' : 'medium', 'high', 'detected',
      [pageEvidence(ctx.domain, scanId), ...trackerEvidenceItems.slice(0, 5)],
      'Ensure all advertising and tracking networks are disclosed and gated behind consent.',
      `Breakdown: ${catBreakdown}`))
  }

  if (pixelCount.count > 0) {
    findings.push(finding('tracking_pixels',
      `${pixelCount.count} tracking pixel(s) detected`,
      `1×1 tracking pixel images were found, commonly used for cross-site tracking.`,
      'medium', 'medium', 'detected',
      [pageEvidence(ctx.domain, scanId)],
      'Ensure tracking pixels are loaded only after user consent.'))
  }

  return findings
}
