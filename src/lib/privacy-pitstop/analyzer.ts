import type {
  Finding, PillarResult, DisplayCategory, AnalysisResult,
  FetchedPage, Severity, ConfidenceLevel,
  RiskRating,
} from './types'
import { SEVERITY_WEIGHT, CONFIDENCE_WEIGHT } from './types'
import {
  PILLARS, getRiskRating, DISPLAY_CATEGORIES,
  NOVELTY_FIRST, NOVELTY_DUPLICATE,
  BREADTH_THRESHOLD, BREADTH_BOOST_FACTOR, PILLAR_SCALE_FACTOR,
  FETCH_TIMEOUT_MS, MAX_HTML_SIZE, PAGE_PATHS,
  TRACKER_DOMAINS, AD_PIXEL_PATTERNS, CMP_INDICATORS,
  SESSION_REPLAY_DOMAINS, FINGERPRINT_PATTERNS,
  POLICY_SECTIONS, PRIVACY_LINK_PATTERNS, RIGHTS_LINK_PATTERNS,
} from './constants'

/* ═══════════════════════════════════════════════════════════════
   1. PAGE FETCHING
   ═══════════════════════════════════════════════════════════════ */

function normalizeUrl(domain: string): string {
  let d = domain.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(d)) d = `https://${d}`
  return d
}

async function fetchPage(url: string, pageClass: string): Promise<FetchedPage> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PrivacyPitstopBot/1.0 (+https://dpdpconsultancy.in/privacy-pitstop)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-GPC': '1',
      },
      redirect: 'follow',
    })

    const headers: Record<string, string> = {}
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v })

    let html = ''
    if (res.ok) {
      const buffer = await res.arrayBuffer()
      html = new TextDecoder('utf-8').decode(buffer.slice(0, MAX_HTML_SIZE))
    }

    return { url, status: res.status, html, headers, pageClass }
  } catch (err) {
    return {
      url, status: 0, html: '', headers: {}, pageClass,
      error: err instanceof Error ? err.message : 'Fetch failed',
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchAllPages(domain: string): Promise<FetchedPage[]> {
  const baseUrl = normalizeUrl(domain)
  const seen = new Set<string>()
  const tasks: Promise<FetchedPage>[] = []

  for (const { path, pageClass } of PAGE_PATHS) {
    const url = `${baseUrl}${path === '/' ? '' : path}`
    if (seen.has(url)) continue
    seen.add(url)
    tasks.push(fetchPage(url, pageClass))
  }

  return Promise.all(tasks)
}

/* ═══════════════════════════════════════════════════════════════
   2. DETECTION HELPERS
   ═══════════════════════════════════════════════════════════════ */

function extractScriptSrcs(html: string): string[] {
  const srcs: string[] = []
  const re = /<script[^>]+src\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) srcs.push(m[1])
  return srcs
}

function extractLinkHrefs(html: string): string[] {
  const hrefs: string[] = []
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) hrefs.push(m[1])
  return hrefs
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
  try {
    return new URL(url, 'https://placeholder.com').hostname
  } catch {
    return ''
  }
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

function matchesSessionReplay(hostname: string): boolean {
  for (const domain of SESSION_REPLAY_DOMAINS) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) return true
  }
  return false
}

function finding(
  pillarId: string, module: string, title: string, description: string,
  severity: Severity, confidence: ConfidenceLevel,
  evidence: 'detected' | 'inferred' = 'detected',
  recommendation?: string, details?: string,
): Finding {
  return {
    id: `${pillarId}-${module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pillarId, module, title, description, severity, confidence, evidence,
    recommendation, details,
  }
}

/* ═══════════════════════════════════════════════════════════════
   3. PILLAR DETECTORS
   ═══════════════════════════════════════════════════════════════ */

function detectP1(pages: FetchedPage[], siteDomain: string): Finding[] {
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  const privacyPages = pages.filter(p => p.pageClass === 'privacy' && p.status === 200)

  // Check for privacy policy link on homepage
  if (homepage) {
    const links = extractLinkHrefs(homepage.html)
    const hasPrivacyLink = links.some(h => PRIVACY_LINK_PATTERNS.some(p => p.test(h)))
    if (!hasPrivacyLink) {
      findings.push(finding('P1', 'policy_link', 'No privacy policy link found on homepage',
        'The homepage does not contain a visible link to a privacy policy or privacy notice.',
        'high', 'high', 'detected',
        'Add a clearly visible privacy policy link in the footer or navigation.'))
    }
  }

  // Check if privacy policy page exists
  if (privacyPages.length === 0) {
    findings.push(finding('P1', 'policy_page', 'No accessible privacy policy page',
      'No privacy policy, cookie policy, or terms page could be accessed at standard paths.',
      'critical', 'high', 'detected',
      'Publish a comprehensive privacy policy at /privacy-policy.'))
  } else {
    // Analyze privacy policy content
    const policy = privacyPages[0]
    const policyText = policy.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    const wordCount = policyText.split(/\s+/).length

    if (wordCount < 200) {
      findings.push(finding('P1', 'policy_length', 'Privacy policy appears very short',
        `The privacy policy contains approximately ${wordCount} words, which may indicate incomplete disclosures.`,
        'medium', 'medium', 'detected',
        'Ensure the privacy policy covers all required disclosures under applicable laws.'))
    }

    // Check for key sections
    const missingKeys: string[] = []
    for (const section of POLICY_SECTIONS) {
      const found = section.patterns.some(p => p.test(policyText))
      if (!found) missingKeys.push(section.key)
    }

    if (missingKeys.length > 5) {
      findings.push(finding('P1', 'policy_sections', 'Privacy policy missing multiple key sections',
        `The privacy policy appears to be missing ${missingKeys.length} of ${POLICY_SECTIONS.length} standard sections: ${missingKeys.join(', ')}.`,
        'high', 'medium', 'inferred',
        'Review and update the privacy policy to include all required disclosure categories.',
        `Missing: ${missingKeys.join(', ')}`))
    } else if (missingKeys.length > 2) {
      findings.push(finding('P1', 'policy_sections', 'Privacy policy missing some key sections',
        `The privacy policy appears to be missing ${missingKeys.length} standard sections: ${missingKeys.join(', ')}.`,
        'medium', 'medium', 'inferred',
        'Consider adding the missing sections to improve transparency.'))
    }
  }

  return findings
}

function detectP2(pages: FetchedPage[]): Finding[] {
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  if (!homepage) return findings

  const htmlLower = homepage.html.toLowerCase()

  // Check for CMP presence
  const cmpFound = CMP_INDICATORS.some(ind => htmlLower.includes(ind.toLowerCase()))
  const scriptSrcs = extractScriptSrcs(homepage.html)
  const cmpScript = scriptSrcs.some(src => {
    const host = getDomainFromUrl(src)
    return CMP_INDICATORS.some(ind => host.includes(ind) || src.toLowerCase().includes(ind))
  })

  if (!cmpFound && !cmpScript) {
    findings.push(finding('P2', 'cmp_presence', 'No consent management platform detected',
      'No cookie consent banner, CMP, or consent management script was detected on the homepage.',
      'critical', 'high', 'detected',
      'Implement a consent management platform (e.g., OneTrust, CookieBot, or an equivalent) to manage cookie consent.'))
  }

  // Check for reject option
  if (cmpFound || cmpScript) {
    const hasReject = /reject\s*all|deny\s*all|decline\s*all|refuse|opt[\s-]?out/i.test(htmlLower)
    const hasAccept = /accept\s*all|allow\s*all|agree|i\s*accept/i.test(htmlLower)

    if (hasAccept && !hasReject) {
      findings.push(finding('P2', 'reject_option', 'Consent banner may lack a reject option',
        'An accept-all option was detected but no corresponding reject-all or decline option was found in the initial page HTML.',
        'high', 'medium', 'inferred',
        'Provide an equally prominent reject-all option alongside accept-all.',
        'Note: Dynamically rendered reject buttons cannot be detected without browser automation.'))
    }
  }

  return findings
}

function detectP3(pages: FetchedPage[], siteDomain: string): Finding[] {
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  if (!homepage) return findings

  const scriptSrcs = extractScriptSrcs(homepage.html)
  const preConsentTrackers: string[] = []

  for (const src of scriptSrcs) {
    const host = getDomainFromUrl(src)
    if (isThirdParty(host, siteDomain) && matchesTrackerDomain(host)) {
      preConsentTrackers.push(host)
    }
  }

  // Check for inline tracking code
  const inlineTracking = AD_PIXEL_PATTERNS.some(p => p.test(homepage.html))

  if (preConsentTrackers.length > 0) {
    findings.push(finding('P3', 'pre_consent_trackers',
      `${preConsentTrackers.length} tracking script(s) loaded before consent`,
      `The following tracking scripts are loaded in the initial HTML before any consent interaction: ${[...new Set(preConsentTrackers)].join(', ')}.`,
      preConsentTrackers.length > 3 ? 'critical' : 'high', 'high', 'detected',
      'Defer all tracking scripts until the user has provided explicit consent.',
      `Domains: ${[...new Set(preConsentTrackers)].join(', ')}`))
  }

  if (inlineTracking) {
    findings.push(finding('P3', 'inline_tracking', 'Inline tracking code detected in page source',
      'Inline analytics or pixel tracking code was found in the HTML source, which executes before consent can be collected.',
      'high', 'medium', 'detected',
      'Move inline tracking code behind a consent gate.'))
  }

  // Check Set-Cookie headers on initial response
  const setCookies = homepage.headers['set-cookie']
  if (setCookies) {
    const cookieCount = setCookies.split(/,(?=[^ ])/).length
    if (cookieCount > 0) {
      findings.push(finding('P3', 'server_cookies', `Server sets ${cookieCount} cookie(s) on first visit`,
        `The server's initial HTTP response includes Set-Cookie headers, setting cookies before any consent interaction.`,
        cookieCount > 3 ? 'high' : 'medium', 'high', 'detected',
        'Review server-side cookie setting to ensure only strictly necessary cookies are set before consent.'))
    }
  }

  return findings
}

function detectP4(pages: FetchedPage[]): Finding[] {
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  if (!homepage) return findings

  const htmlLower = homepage.html.toLowerCase()
  const links = extractLinkHrefs(homepage.html)

  // Check for preference center / cookie settings link
  const hasPrefCenter = links.some(h =>
    /cookie[\s_-]?settings|cookie[\s_-]?preferences|manage[\s_-]?consent|manage[\s_-]?cookies|preference[\s_-]?center/i.test(h)
  ) || /cookie[\s_-]?settings|manage[\s_-]?consent|preference[\s_-]?center/i.test(htmlLower)

  if (!hasPrefCenter) {
    findings.push(finding('P4', 'pref_center', 'No consent preference center link detected',
      'No link to a cookie settings, preference center, or manage-consent page was found.',
      'high', 'medium', 'inferred',
      'Provide a persistent, accessible link to a consent preference center where users can modify or revoke consent.',
      'Note: Dynamically injected preference center links (e.g., via CMP widget) cannot be detected without browser automation.'))
  }

  // Check for withdraw consent language
  const hasWithdraw = /withdraw|revoke|change.*consent|update.*preferences/i.test(htmlLower)
  if (!hasWithdraw && !hasPrefCenter) {
    findings.push(finding('P4', 'revocation', 'No consent revocation mechanism detected',
      'No visible mechanism for users to withdraw or change their consent was detected in the page HTML.',
      'high', 'medium', 'inferred',
      'Implement a clearly accessible consent revocation mechanism.'))
  }

  return findings
}

function detectP5(pages: FetchedPage[], siteDomain: string): Finding[] {
  const findings: Finding[] = []
  const allThirdPartyDomains = new Set<string>()
  const adNetworks = new Set<string>()
  const pixelCount = { count: 0 }

  for (const page of pages) {
    if (page.status !== 200) continue

    const scriptSrcs = extractScriptSrcs(page.html)
    const imgSrcs = extractImgSrcs(page.html)
    const iframeSrcs = extractIframeSrcs(page.html)

    for (const src of [...scriptSrcs, ...imgSrcs, ...iframeSrcs]) {
      const host = getDomainFromUrl(src)
      if (isThirdParty(host, siteDomain)) {
        allThirdPartyDomains.add(host)
        if (matchesTrackerDomain(host)) adNetworks.add(host)
      }
    }

    // Detect tracking pixels (1x1 images)
    const pixelRe = /width\s*=\s*["']?1["']?\s+height\s*=\s*["']?1["']?|height\s*=\s*["']?1["']?\s+width\s*=\s*["']?1["']?/gi
    let pxMatch
    while ((pxMatch = pixelRe.exec(page.html))) {
      pixelCount.count++
    }
  }

  if (allThirdPartyDomains.size > 10) {
    findings.push(finding('P5', 'third_party_count',
      `${allThirdPartyDomains.size} third-party domains detected`,
      `The website loads resources from ${allThirdPartyDomains.size} third-party domains, indicating extensive data sharing.`,
      allThirdPartyDomains.size > 25 ? 'critical' : 'high', 'high', 'detected',
      'Review and minimize third-party integrations. Ensure each is disclosed in the privacy policy.',
      `Sample domains: ${[...allThirdPartyDomains].slice(0, 10).join(', ')}`))
  } else if (allThirdPartyDomains.size > 5) {
    findings.push(finding('P5', 'third_party_count',
      `${allThirdPartyDomains.size} third-party domains detected`,
      `The website loads resources from ${allThirdPartyDomains.size} third-party domains.`,
      'medium', 'high', 'detected'))
  }

  if (adNetworks.size > 0) {
    findings.push(finding('P5', 'ad_networks',
      `${adNetworks.size} known advertising/tracking network(s) detected`,
      `Known tracker or ad network scripts detected: ${[...adNetworks].slice(0, 8).join(', ')}.`,
      adNetworks.size > 5 ? 'high' : 'medium', 'high', 'detected',
      'Ensure all advertising and tracking networks are disclosed and gated behind consent.',
      `Networks: ${[...adNetworks].join(', ')}`))
  }

  if (pixelCount.count > 0) {
    findings.push(finding('P5', 'tracking_pixels',
      `${pixelCount.count} tracking pixel(s) detected`,
      `1×1 tracking pixel images were found, commonly used for cross-site tracking.`,
      'medium', 'medium', 'detected',
      'Ensure tracking pixels are loaded only after user consent.'))
  }

  return findings
}

function detectP6(pages: FetchedPage[]): Finding[] {
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)
  if (!homepage) return findings

  // Check for pre-checked consent checkboxes
  const preChecked = /checked\s*(?:=\s*["']?(?:checked|true)["']?)?[^>]*(?:consent|marketing|newsletter|subscribe)/i.test(homepage.html)
  if (preChecked) {
    findings.push(finding('P6', 'pre_checked', 'Pre-checked consent checkbox detected',
      'A consent-related checkbox appears to be pre-checked in the HTML source, which may constitute a dark pattern.',
      'high', 'medium', 'inferred',
      'Ensure all consent checkboxes are unchecked by default.'))
  }

  // Check for consent wall patterns (forced consent before access)
  const consentWall = /consent-wall|access-wall|you\s+must\s+accept|continue.*accept/i.test(homepage.html)
  if (consentWall) {
    findings.push(finding('P6', 'consent_wall', 'Potential consent wall detected',
      'Language suggesting forced consent before accessing content was found.',
      'high', 'medium', 'inferred',
      'Avoid making content access contingent on accepting non-essential cookies or tracking.'))
  }

  return findings
}

function detectP7(pages: FetchedPage[], siteDomain: string): Finding[] {
  const findings: Finding[] = []
  const replayDomains = new Set<string>()

  for (const page of pages) {
    if (page.status !== 200) continue

    const scriptSrcs = extractScriptSrcs(page.html)
    for (const src of scriptSrcs) {
      const host = getDomainFromUrl(src)
      if (matchesSessionReplay(host)) replayDomains.add(host)
    }

    // Check for inline session replay initialization
    if (/hj\s*\(\s*['"]init['"]|_fs_host|LogRocket\.init|smartlook\s*\(/i.test(page.html)) {
      replayDomains.add('inline-init')
    }

    // Check for fingerprinting
    for (const pattern of FINGERPRINT_PATTERNS) {
      if (pattern.test(page.html)) {
        findings.push(finding('P7', 'fingerprinting', 'Browser fingerprinting code detected',
          'Code patterns associated with browser fingerprinting were detected in the page source.',
          'high', 'medium', 'detected',
          'Disclose fingerprinting practices and ensure they are gated behind consent.'))
        break
      }
    }
  }

  if (replayDomains.size > 0) {
    const clean = [...replayDomains].filter(d => d !== 'inline-init')
    findings.push(finding('P7', 'session_replay',
      `Session replay tool(s) detected`,
      `Session replay or behaviour recording scripts detected${clean.length ? `: ${clean.join(', ')}` : ''}.`,
      'high', 'high', 'detected',
      'Disclose session replay tools in the privacy policy and gate them behind consent.',
      `Domains: ${[...replayDomains].join(', ')}`))
  }

  return findings
}

function detectP8(pages: FetchedPage[]): Finding[] {
  const findings: Finding[] = []

  for (const page of pages) {
    if (page.status !== 200) continue

    // Check for emails exposed in HTML
    const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = page.html.match(emailRe) || []
    const realEmails = emails.filter(e => !/example\.com|placeholder|test\.|schema\.org/i.test(e))

    if (realEmails.length > 3) {
      findings.push(finding('P8', 'exposed_emails', `${realEmails.length} email addresses exposed in page HTML`,
        `Multiple email addresses are visible in the page source of ${page.url}, which may expose personal data.`,
        'medium', 'high', 'detected',
        'Minimize exposure of email addresses in public HTML. Use contact forms instead.'))
    }

    // Check for phone numbers in HTML
    const phoneRe = /(?:\+\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g
    const phones = page.html.replace(/<[^>]+>/g, '').match(phoneRe) || []
    if (phones.length > 5) {
      findings.push(finding('P8', 'exposed_phones', 'Multiple phone numbers found in page source',
        `Several phone number patterns detected in ${page.url}.`,
        'low', 'low', 'inferred'))
    }
  }

  // Note: Runtime JS data leakage requires browser automation
  return findings
}

function detectP9(pages: FetchedPage[]): Finding[] {
  const findings: Finding[] = []

  for (const page of pages) {
    if (page.status !== 200) continue

    // Check for exposed API keys in HTML/scripts
    const apiKeyPatterns = [
      /['"](?:api[_-]?key|apikey|api[_-]?secret|api[_-]?token)\s*['"]?\s*[:=]\s*['"]([a-zA-Z0-9_-]{20,})['"]/gi,
      /AIza[0-9A-Za-z_-]{35}/g, // Google API key
      /sk_live_[0-9A-Za-z]{20,}/g, // Stripe key
      /pk_live_[0-9A-Za-z]{20,}/g, // Stripe publishable
    ]

    for (const pattern of apiKeyPatterns) {
      if (pattern.test(page.html)) {
        findings.push(finding('P9', 'exposed_api_key', 'Possible API key exposed in page source',
          `A pattern resembling an API key was detected in the HTML source of ${page.url}.`,
          'critical', 'medium', 'detected',
          'Remove API keys from client-side code. Use server-side proxies for API calls.'))
        break
      }
    }

    // Check for GraphQL endpoint exposure
    if (/graphql|\/api\/v\d/i.test(page.html)) {
      const apiEndpoints = page.html.match(/["']((?:https?:)?\/\/[^"']+\/(?:graphql|api\/v\d[^"']*))['"]/gi)
      if (apiEndpoints && apiEndpoints.length > 0) {
        findings.push(finding('P9', 'api_endpoints', 'Public API endpoints exposed in source',
          `${apiEndpoints.length} API endpoint reference(s) found in client-side code.`,
          'medium', 'medium', 'detected',
          'Review exposed API endpoints for proper authentication and rate limiting.'))
      }
    }
  }

  return findings
}

function detectP10(pages: FetchedPage[]): Finding[] {
  const findings: Finding[] = []
  const homepage = pages.find(p => p.pageClass === 'landing' && p.status === 200)

  // Check for rights/opt-out links
  if (homepage) {
    const links = extractLinkHrefs(homepage.html)
    const hasRightsLink = links.some(h => RIGHTS_LINK_PATTERNS.some(p => p.test(h)))

    if (!hasRightsLink) {
      findings.push(finding('P10', 'rights_link', 'No data subject rights link found',
        'No link to a data subject rights page, opt-out mechanism, or grievance redressal was found on the homepage.',
        'high', 'medium', 'inferred',
        'Provide a clear, accessible link for users to exercise their data subject rights.'))
    }
  }

  // Check GPC header recognition
  if (homepage && homepage.headers['sec-gpc'] === undefined) {
    // We sent Sec-GPC: 1 — check if site acknowledges it (very few do, so low confidence)
    findings.push(finding('P10', 'gpc', 'GPC signal recognition not confirmed',
      'The website did not return a Sec-GPC response header, suggesting it may not recognize Global Privacy Control signals.',
      'low', 'low', 'inferred',
      'Consider implementing GPC signal recognition as recommended by privacy regulations.'))
  }

  // Check for DPO/grievance officer contact
  const privacyPages = pages.filter(p => p.pageClass === 'privacy' && p.status === 200)
  if (privacyPages.length > 0) {
    const allPrivacyText = privacyPages.map(p => p.html).join(' ')
    const hasDpo = /data\s+protection\s+officer|DPO|grievance\s+officer|nodal\s+officer/i.test(allPrivacyText)
    if (!hasDpo) {
      findings.push(finding('P10', 'dpo_contact', 'No DPO or Grievance Officer contact found',
        'No reference to a Data Protection Officer, Grievance Officer, or Nodal Officer was found in privacy-related pages.',
        'medium', 'medium', 'inferred',
        'Designate and publish contact details for a DPO or Grievance Officer as required by applicable regulations.'))
    }
  }

  return findings
}

/* ═══════════════════════════════════════════════════════════════
   4. SCORING ENGINE
   ═══════════════════════════════════════════════════════════════ */

function computePillarScore(pillarFindings: Finding[], pillarModuleCount: number): { score: number; confidence: number } {
  if (pillarFindings.length === 0) return { score: 0, confidence: 0 }

  // Duplicate suppression: group by module, apply novelty factor
  const byModule = new Map<string, Finding[]>()
  for (const f of pillarFindings) {
    const existing = byModule.get(f.module) || []
    existing.push(f)
    byModule.set(f.module, existing)
  }

  let rawSum = 0
  let totalConfidence = 0
  let findingCount = 0

  for (const [, moduleFindings] of byModule) {
    for (let i = 0; i < moduleFindings.length; i++) {
      const f = moduleFindings[i]
      const novelty = i === 0 ? NOVELTY_FIRST : NOVELTY_DUPLICATE
      const impact = SEVERITY_WEIGHT[f.severity] * CONFIDENCE_WEIGHT[f.confidence] * novelty
      rawSum += impact
      totalConfidence += CONFIDENCE_WEIGHT[f.confidence]
      findingCount++
    }
  }

  // Normalize score
  let score = Math.min(100, (rawSum / PILLAR_SCALE_FACTOR) * 100)

  // Breadth factor
  const uniqueModulesWithFindings = byModule.size
  const breadth = uniqueModulesWithFindings / Math.max(1, pillarModuleCount)
  if (breadth > BREADTH_THRESHOLD) {
    score = Math.min(100, score * (1 + (breadth - BREADTH_THRESHOLD) * BREADTH_BOOST_FACTOR))
  }

  const avgConfidence = totalConfidence / findingCount

  return { score: Math.round(score * 10) / 10, confidence: Math.round(avgConfidence * 100) }
}

// Expected module count per pillar for breadth calculation
const PILLAR_MODULE_COUNTS: Record<string, number> = {
  P1: 3, P2: 2, P3: 3, P4: 2, P5: 3,
  P6: 2, P7: 2, P8: 2, P9: 2, P10: 3,
}

function computeOverallScores(pillarResults: PillarResult[], pagesAnalyzed: number) {
  let riskScore = 0
  let totalWeightedConfidence = 0

  for (const p of pillarResults) {
    const pillarDef = PILLARS.find(pd => pd.id === p.id)!
    riskScore += p.score * pillarDef.weight
    totalWeightedConfidence += p.confidence * pillarDef.weight
  }

  riskScore = Math.round(riskScore * 10) / 10
  const confidenceScore = Math.round(totalWeightedConfidence)

  // Coverage: based on pages analyzed vs expected, states covered
  const expectedPages = PAGE_PATHS.length
  const pageCoverage = pagesAnalyzed / expectedPages
  // We cover 1 state (first visit with GPC). Full spec has 9 states.
  const stateCoverage = 1 / 9
  const coverageScore = Math.round(((pageCoverage * 0.6) + (stateCoverage * 0.4)) * 100)

  return { riskScore, confidenceScore, coverageScore }
}

function buildCategories(pillarResults: PillarResult[]): DisplayCategory[] {
  return DISPLAY_CATEGORIES.map(cat => {
    const relevant = pillarResults.filter(p => cat.pillarIds.includes(p.id))
    const totalWeight = relevant.reduce((sum, p) => sum + PILLARS.find(pd => pd.id === p.id)!.weight, 0)
    const weightedScore = relevant.reduce((sum, p) => {
      return sum + p.score * (PILLARS.find(pd => pd.id === p.id)!.weight / totalWeight)
    }, 0)
    return {
      name: cat.name,
      score: Math.round(weightedScore * 10) / 10,
      pillarIds: cat.pillarIds,
    }
  })
}

function generateSummary(riskScore: number, rating: RiskRating, categories: DisplayCategory[], findings: Finding[]): string {
  const topIssues = findings
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 3)
    .map(f => f.title)

  let summary = `This website received an External Privacy Risk Score of ${riskScore}/100 (${rating}). `

  if (topIssues.length > 0) {
    summary += `Key concerns include: ${topIssues.join('; ')}. `
  }

  const worstCat = categories.reduce((a, b) => a.score > b.score ? a : b)
  if (worstCat.score > 40) {
    summary += `The "${worstCat.name}" category shows the highest risk. `
  }

  summary += 'Discover whether this privacy policy may raise concerns and understand your privacy rights.'

  return summary
}

/* ═══════════════════════════════════════════════════════════════
   5. MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════════════ */

export async function analyzePrivacyPitstop(domain: string): Promise<AnalysisResult> {
  // 1. Fetch pages
  const pages = await fetchAllPages(domain)
  const successfulPages = pages.filter(p => p.status === 200)
  const siteDomain = getDomainFromUrl(normalizeUrl(domain))

  // 2. Run all pillar detectors
  const allFindings: Finding[] = [
    ...detectP1(pages, siteDomain),
    ...detectP2(pages),
    ...detectP3(pages, siteDomain),
    ...detectP4(pages),
    ...detectP5(pages, siteDomain),
    ...detectP6(pages),
    ...detectP7(pages, siteDomain),
    ...detectP8(pages),
    ...detectP9(pages),
    ...detectP10(pages),
  ]

  // 3. Build pillar results
  const pillarResults: PillarResult[] = PILLARS.map(pd => {
    const pillarFindings = allFindings.filter(f => f.pillarId === pd.id)
    const { score, confidence } = computePillarScore(pillarFindings, PILLAR_MODULE_COUNTS[pd.id] || 2)
    return {
      id: pd.id,
      name: pd.name,
      weight: pd.weight,
      score,
      confidence,
      findingCount: pillarFindings.length,
      findings: pillarFindings,
    }
  })

  // 4. Compute overall scores
  const { riskScore, confidenceScore, coverageScore } = computeOverallScores(pillarResults, successfulPages.length)
  const riskRating = getRiskRating(riskScore)

  // 5. Build display categories
  const categories = buildCategories(pillarResults)

  // 6. Generate summary
  const summary = generateSummary(riskScore, riskRating, categories, allFindings)

  return {
    domain,
    analyzedAt: new Date().toISOString(),
    riskScore,
    riskRating,
    confidenceScore,
    coverageScore,
    pillars: pillarResults,
    categories,
    totalFindings: allFindings.length,
    pagesAnalyzed: successfulPages.length,
    summary,
  }
}
