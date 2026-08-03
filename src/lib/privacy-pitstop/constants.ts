import type { PillarDefinition, ScanCategoryDefinition, ScanCategoryId } from './types'

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
  // Spec-required additional paths
  { path: '/legal', pageClass: 'privacy' },
  { path: '/security', pageClass: 'security' },
  { path: '/trust', pageClass: 'security' },
  { path: '/trust-center', pageClass: 'security' },
  { path: '/ai-policy', pageClass: 'ai' },
  { path: '/responsible-ai', pageClass: 'ai' },
  { path: '/support', pageClass: 'support' },
  { path: '/rights', pageClass: 'rights' },
  { path: '/data-protection', pageClass: 'privacy' },
  { path: '/grievance', pageClass: 'rights' },
  { path: '/dpo', pageClass: 'rights' },
  { path: '/accessibility', pageClass: 'support' },
  { path: '/data-subject-request', pageClass: 'rights' },
  { path: '/opt-out', pageClass: 'rights' },
  { path: '/.well-known/security.txt', pageClass: 'security_txt' },
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

/* ─── 7-Category Scoring System (spec weights) ─────────────── */

const TOTAL_CATEGORY_WEIGHT = 54

export const SCAN_CATEGORIES: ScanCategoryDefinition[] = [
  { id: 'notice',            name: 'Privacy Notice',      weight: 10, normalizedWeight: 10 / TOTAL_CATEGORY_WEIGHT },
  { id: 'consent',           name: 'Consent',             weight: 10, normalizedWeight: 10 / TOTAL_CATEGORY_WEIGHT },
  { id: 'cookies',           name: 'Cookies',             weight: 10, normalizedWeight: 10 / TOTAL_CATEGORY_WEIGHT },
  { id: 'rights',            name: 'Rights',              weight: 10, normalizedWeight: 10 / TOTAL_CATEGORY_WEIGHT },
  { id: 'ai_transparency',   name: 'AI Transparency',     weight: 6,  normalizedWeight: 6 / TOTAL_CATEGORY_WEIGHT },
  { id: 'childrens_privacy', name: "Children's Privacy",  weight: 5,  normalizedWeight: 5 / TOTAL_CATEGORY_WEIGHT },
  { id: 'security',          name: 'Security',            weight: 3,  normalizedWeight: 3 / TOTAL_CATEGORY_WEIGHT },
]

/** Maps legacy pillar IDs to the new 7-category system */
export const PILLAR_TO_CATEGORY: Record<string, ScanCategoryId> = {
  P1: 'notice',
  P2: 'consent',
  P3: 'cookies',
  P4: 'consent',
  P5: 'cookies',
  P6: 'consent',
  P7: 'ai_transparency',
  P8: 'security',
  P9: 'security',
  P10: 'rights',
}

/* ─── Excluded path patterns (crawler safety) ──────────────── */

export const EXCLUDED_PATH_PATTERNS = [
  /\/admin/i, /\/login/i, /\/signin/i, /\/signup/i,
  /\/dashboard/i, /\/account/i, /\/settings/i,
  /\/wp-admin/i, /\/wp-login/i,
  /\/api\//i, /\/graphql/i,
  /\.(pdf|zip|doc|xls|ppt|exe|dmg|apk)/i,
]

export const EXCLUDED_DOMAINS = new Set([
  'localhost', '127.0.0.1', '0.0.0.0', '::1',
])

/* ─── AI Transparency detection patterns ───────────────────── */

export const AI_DISCLOSURE_PATTERNS = [
  /artificial\s+intelligence/i, /\bAI\b.*(?:use|usage|system|model|train)/i,
  /machine\s+learning/i, /deep\s+learning/i, /neural\s+network/i,
  /generative\s+AI/i, /GenAI/i, /large\s+language\s+model/i, /\bLLM\b/i,
  /automated\s+decision[\s-]?making/i, /algorithmic\s+decision/i,
  /profiling/i, /automated\s+profiling/i,
  /human\s+review/i, /human\s+oversight/i, /human-in-the-loop/i,
  /explainab/i, /interpretab/i, /transparency.*AI/i,
  /AI\s+opt[\s-]?out/i, /opt[\s-]?out.*AI/i,
  /AI\s+training/i, /train.*(?:model|data|algorithm)/i,
  /responsible\s+AI/i, /AI\s+ethics/i, /AI\s+governance/i,
  /AI\s+fairness/i, /bias\s+(?:detection|mitigation)/i,
]

export const AI_PAGE_PATTERNS = [
  /\/ai[\s_-]?policy/i, /\/responsible[\s_-]?ai/i, /\/ai[\s_-]?ethics/i,
  /\/ai[\s_-]?transparency/i, /\/ai[\s_-]?governance/i,
  /\/machine[\s_-]?learning/i,
]

/* ─── Children's privacy detection patterns ────────────────── */

export const CHILDRENS_PRIVACY_PATTERNS = [
  /child(ren)?('s)?\s+privacy/i,
  /under\s+(the\s+age\s+of\s+)?(13|14|16|18)/i,
  /minors?('s)?\s+(data|privacy|information)/i,
  /parental\s+consent/i, /verifiable\s+parental/i,
  /child(ren)?('s)?\s+data/i, /child(ren)?('s)?\s+information/i,
  /COPPA/i, /\bSection\s+9\b/i,
  /guardian('s)?\s+consent/i,
  /age\s+verification/i, /age\s+gate/i, /age\s+check/i,
]

/* ─── Security headers to check ────────────────────────────── */

export const SECURITY_HEADERS: { header: string; severity: 'high' | 'medium' | 'low' }[] = [
  { header: 'strict-transport-security', severity: 'high' },
  { header: 'content-security-policy', severity: 'medium' },
  { header: 'x-frame-options', severity: 'medium' },
  { header: 'x-content-type-options', severity: 'low' },
  { header: 'referrer-policy', severity: 'low' },
  { header: 'permissions-policy', severity: 'low' },
  { header: 'x-xss-protection', severity: 'low' },
]

/* ─── Privacy-relevant link discovery patterns ─────────────── */

export const DISCOVERABLE_PRIVACY_LINKS = [
  /privacy/i, /cookie/i, /terms/i, /legal/i,
  /security/i, /trust/i, /compliance/i,
  /\bai[\s_-]?policy/i, /responsible[\s_-]?ai/i,
  /rights/i, /data[\s_-]?protection/i,
  /grievance/i, /\bdpo\b/i, /data[\s_-]?subject/i,
  /opt[\s_-]?out/i, /accessibility/i, /contact/i,
  /support/i, /\bdsar\b/i,
]

/* ─── Individual rights detection patterns ─────────────────── */

export const INDIVIDUAL_RIGHTS_PATTERNS: { right: string; patterns: RegExp[] }[] = [
  { right: 'access', patterns: [/right\s+(?:of|to)\s+access/i, /access\s+(?:your|my|personal)\s+(?:data|information)/i, /request.*copy.*data/i] },
  { right: 'correction', patterns: [/right\s+to\s+(?:correct|rectif)/i, /correct.*(?:your|personal).*(?:data|information)/i, /rectification/i] },
  { right: 'deletion', patterns: [/right\s+to\s+(?:delet|erasure)/i, /delete.*(?:your|my).*(?:data|account)/i, /right\s+to\s+be\s+forgotten/i, /erasure/i] },
  { right: 'withdrawal', patterns: [/withdraw.*consent/i, /revoke.*consent/i, /right\s+to\s+withdraw/i] },
  { right: 'grievance', patterns: [/grievance/i, /redressal/i, /complaint.*(?:mechanism|process|procedure)/i, /nodal\s+officer/i] },
  { right: 'contact', patterns: [/contact.*(?:dpo|data\s+protection\s+officer|privacy\s+officer)/i, /dpo.*contact/i, /privacy.*(?:email|contact)/i] },
  { right: 'opt_out', patterns: [/opt[\s-]?out/i, /do\s+not\s+sell/i, /do\s+not\s+share/i, /unsubscribe/i] },
]

/* ─── Last-updated date extraction patterns ────────────────── */

export const POLICY_DATE_PATTERNS = [
  /(?:last\s+)?(?:updated|modified|revised|effective)\s*(?:on|:)?\s*(\d{1,2}[\s/.-]\w+[\s/.-]\d{2,4})/i,
  /(?:effective|updated)\s+(?:date|as\s+of)\s*:?\s*(\w+\s+\d{1,2},?\s+\d{4})/i,
  /(?:date|version)\s*:?\s*(\d{1,2}[\s/.-]\d{1,2}[\s/.-]\d{2,4})/i,
]
