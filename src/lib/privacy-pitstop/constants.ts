import type { PillarDefinition } from './types'

/* ─── Pillar definitions with exact weights ────────────────── */

export const PILLARS: PillarDefinition[] = [
  { id: 'P1', name: 'Privacy Notice & Disclosure Integrity', weight: 0.05 },
  { id: 'P2', name: 'Consent Banner & Choice Architecture', weight: 0.10 },
  { id: 'P3', name: 'Pre-Consent Storage & Access Activity', weight: 0.14 },
  { id: 'P4', name: 'Post-Choice Enforcement & Revocation', weight: 0.14 },
  { id: 'P5', name: 'Third-Party Data Sharing & Tag Ecosystem', weight: 0.14 },
  { id: 'P6', name: 'Dark Patterns', weight: 0.07 },
  { id: 'P7', name: 'Session Replay & Behaviour Capture', weight: 0.08 },
  { id: 'P8', name: 'Client-Side Personal Data Leakage', weight: 0.10 },
  { id: 'P9', name: 'Public API Privacy Exposure', weight: 0.10 },
  { id: 'P10', name: 'Public Rights Path & GPC Recognition', weight: 0.08 },
]

/* ─── Risk rating thresholds ───────────────────────────────── */

export function getRiskRating(score: number) {
  if (score <= 19) return 'Low' as const
  if (score <= 39) return 'Guarded' as const
  if (score <= 59) return 'Elevated' as const
  if (score <= 79) return 'High' as const
  return 'Severe' as const
}

/* ─── Display categories mapping pillars → 5 UI groups ─────── */

export const DISPLAY_CATEGORIES = [
  { name: 'Data Collection', pillarIds: ['P3', 'P5', 'P8'] },
  { name: 'Cookie & Consent', pillarIds: ['P2', 'P4', 'P6'] },
  { name: 'User Rights & Redressal', pillarIds: ['P10'] },
  { name: 'AI Transparency', pillarIds: ['P7', 'P9'] },
  { name: 'Security Signals', pillarIds: ['P1'] },
]

/* ─── Duplicate suppression ────────────────────────────────── */

export const NOVELTY_FIRST = 1.0
export const NOVELTY_DUPLICATE = 0.3

/* ─── Breadth factor ───────────────────────────────────────── */

export const BREADTH_THRESHOLD = 0.5
export const BREADTH_BOOST_FACTOR = 0.2

/* ─── Normalization: expected max raw score per finding ─────── */

export const PILLAR_SCALE_FACTOR = 12

/* ─── Page fetch config ────────────────────────────────────── */

export const FETCH_TIMEOUT_MS = 8000
export const MAX_HTML_SIZE = 2_000_000 // 2MB cap per page

export const PAGE_PATHS: { path: string; pageClass: string }[] = [
  { path: '/', pageClass: 'landing' },
  { path: '/privacy-policy', pageClass: 'privacy' },
  { path: '/privacy', pageClass: 'privacy' },
  { path: '/cookie-policy', pageClass: 'privacy' },
  { path: '/terms', pageClass: 'privacy' },
  { path: '/contact', pageClass: 'support' },
  { path: '/about', pageClass: 'support' },
]

/* ─── Known third-party tracker domains ────────────────────── */

export const TRACKER_DOMAINS = new Set([
  'google-analytics.com', 'googletagmanager.com', 'googleadservices.com',
  'googlesyndication.com', 'doubleclick.net', 'google.com/ads',
  'facebook.net', 'facebook.com/tr', 'connect.facebook.net',
  'analytics.twitter.com', 'ads-twitter.com', 'platform.twitter.com',
  'snap.licdn.com', 'linkedin.com/px', 'ads.linkedin.com',
  'bat.bing.com', 'clarity.ms', 'sc-static.net',
  'hotjar.com', 'mouseflow.com', 'luckyorange.com',
  'fullstory.com', 'logrocket.com', 'smartlook.com',
  'mixpanel.com', 'amplitude.com', 'segment.com', 'segment.io',
  'heapanalytics.com', 'heap.io',
  'optimizely.com', 'abtasty.com', 'vwo.com',
  'criteo.com', 'criteo.net', 'outbrain.com', 'taboola.com',
  'adroll.com', 'quantserve.com', 'scorecardresearch.com',
  'newrelic.com', 'nr-data.net',
  'sentry.io', 'bugsnag.com',
  'intercom.io', 'intercomcdn.com',
  'drift.com', 'zendesk.com',
  'hubspot.com', 'hs-analytics.net', 'hs-scripts.com',
  'marketo.net', 'marketo.com', 'mktoresp.com',
  'pardot.com', 'salesforce.com',
  'tiktokapis.com', 'analytics.tiktok.com',
  'pinterest.com/ct', 'ct.pinterest.com',
  'amazon-adsystem.com', 'media.net',
  'chartbeat.com', 'parsely.com', 'piano.io',
  'cdn.cookielaw.org', 'cookiebot.com',
  'trustpilot.com', 'trustarccdn.com',
  'crazyegg.com', 'inspectlet.com',
  'appsflyer.com', 'branch.io', 'adjust.com',
  'rubiconproject.com', 'openx.net', 'pubmatic.com',
  'casalemedia.com', 'indexww.com', 'adsrvr.org',
])

/* ─── Known ad/pixel patterns in script src ────────────────── */

export const AD_PIXEL_PATTERNS = [
  /fbq\s*\(/i, /fbevents\.js/i,
  /gtag\s*\(/i, /ga\s*\(\s*['"]send/i, /analytics\.js/i,
  /pixel/i, /track/i,
  /_linkedin_data_partner_ids/i,
  /twq\s*\(/i,
  /ttq\s*\./i,
  /pintrk\s*\(/i,
  /uetq/i,
  /snaptr\s*\(/i,
]

/* ─── Known CMP selectors / identifiers ────────────────────── */

export const CMP_INDICATORS = [
  'onetrust', 'cookiebot', 'quantcast', 'trustarc', 'cookieconsent',
  'cookie-consent', 'cookie-banner', 'cookie-notice', 'cookie-law',
  'gdpr-consent', 'gdpr-banner', 'consent-banner', 'consent-manager',
  'cc-banner', 'cc-window', 'cmp-container', 'cmp-banner',
  'osano', 'termly', 'iubenda', 'didomi', 'usercentrics',
  'consentmanager', 'klaro', 'tarteaucitron', 'complianz',
  'cookie_notice', 'cookie_consent', 'CookieConsent',
  'agigx-consent', 'agigx-sdk',
]

/* ─── Known session replay scripts ─────────────────────────── */

export const SESSION_REPLAY_DOMAINS = new Set([
  'hotjar.com', 'static.hotjar.com', 'script.hotjar.com',
  'fullstory.com', 'rs.fullstory.com',
  'logrocket.com', 'cdn.lr-in.com', 'cdn.lr-ingest.com',
  'smartlook.com', 'rec.smartlook.com',
  'mouseflow.com', 'd1m6l5fhixvfg8.cloudfront.net',
  'luckyorange.com', 'd10lpsik1i8c69.cloudfront.net',
  'inspectlet.com',
  'crazyegg.com',
  'clarity.ms',
  'rrweb', 'openreplay',
])

/* ─── Known fingerprinting indicators ──────────────────────── */

export const FINGERPRINT_PATTERNS = [
  /fingerprintjs/i, /fpjs/i, /fp\.js/i,
  /canvas\.toDataURL/i, /webgl.*renderer/i,
  /AudioContext.*createOscillator/i,
  /navigator\.plugins/i, /navigator\.mimeTypes/i,
  /screen\.colorDepth/i,
  /clientrects/i,
]

/* ─── Privacy policy section keywords ──────────────────────── */

export const POLICY_SECTIONS: { key: string; patterns: RegExp[] }[] = [
  { key: 'data_collection', patterns: [/data\s+(we\s+)?collect/i, /information\s+(we\s+)?collect/i, /personal\s+data/i, /personal\s+information/i] },
  { key: 'data_sharing', patterns: [/shar(e|ing)\s+(your\s+)?(data|information)/i, /third\s*part(y|ies)/i, /disclose/i, /transfer\s+.*data/i] },
  { key: 'data_retention', patterns: [/retention/i, /how\s+long\s+we\s+(keep|retain|store)/i, /data\s+retention/i, /delete\s+your/i] },
  { key: 'user_rights', patterns: [/your\s+rights/i, /right\s+to\s+access/i, /right\s+to\s+(delete|erasure)/i, /data\s+subject/i, /DSAR/i, /opt[\s-]out/i] },
  { key: 'children', patterns: [/child(ren)?('s)?\s+privacy/i, /under\s+(the\s+age\s+of\s+)?(13|16|18)/i, /minors/i, /COPPA/i] },
  { key: 'international_transfers', patterns: [/international\s+transfer/i, /cross[\s-]border/i, /transfer.*outside/i, /adequacy/i, /standard\s+contractual/i] },
  { key: 'contact_dpo', patterns: [/data\s+protection\s+officer/i, /DPO/i, /contact\s+us/i, /privacy\s+team/i, /grievance/i, /nodal\s+officer/i] },
  { key: 'legal_basis', patterns: [/legal\s+basis/i, /legitimate\s+interest/i, /consent/i, /contractual\s+necessity/i, /lawful\s+basis/i] },
  { key: 'security', patterns: [/security\s+measures/i, /encrypt/i, /safeguard/i, /protect.*data/i, /SSL/i, /TLS/i] },
  { key: 'cookies', patterns: [/cookie/i, /tracking\s+technolog/i, /pixel/i, /beacon/i, /local\s+storage/i] },
]

/* ─── Privacy page link patterns ───────────────────────────── */

export const PRIVACY_LINK_PATTERNS = [
  /privacy[\s_-]?policy/i, /privacy[\s_-]?notice/i, /privacy[\s_-]?statement/i,
  /data[\s_-]?protection/i, /cookie[\s_-]?policy/i, /cookie[\s_-]?notice/i,
  /\/privacy/i, /\/cookies/i, /\/gdpr/i, /\/dpdp/i,
]

export const RIGHTS_LINK_PATTERNS = [
  /your[\s_-]?rights/i, /data[\s_-]?subject/i, /DSAR/i,
  /opt[\s_-]?out/i, /do[\s_-]?not[\s_-]?sell/i, /unsubscribe/i,
  /grievance/i, /redressal/i, /complaint/i,
  /right[\s_-]?to[\s_-]?access/i, /right[\s_-]?to[\s_-]?delete/i,
]
