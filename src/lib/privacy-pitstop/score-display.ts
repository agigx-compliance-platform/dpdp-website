import { getRiskRating } from './constants'

/** API `riskScore` is a 0–100 risk total: more findings raise the score. */
export function privacyQualityScore(riskScore: number): number {
  if (!Number.isFinite(riskScore)) {
    throw new Error('riskScore is missing')
  }
  return Math.max(0, Math.min(100, Math.round(100 - riskScore)))
}

export function qualityRatingText(quality: number): string {
  if (quality >= 80) return 'Strong'
  if (quality >= 70) return 'Fair'
  if (quality >= 50) return 'Guarded'
  if (quality >= 30) return 'Elevated'
  return 'Severe'
}

const KNOWN_INDIAN_DOMAINS = new Set([
  'irctc.co.in', 'hdfcbank.com', 'sbi.co.in', 'flipkart.com', 'amazon.in',
  'paytm.com', 'zomato.com', 'swiggy.com', 'redbus.in', 'matrimony.com',
  'icicibank.com', 'axisbank.com', 'kotak.com', 'zerodha.com', 'groww.in',
  'upstox.com', 'phonepe.com', 'cred.club', 'pnbindia.in', 'bankofbaroda.in',
  'tcs.com', 'infosys.com', 'wipro.com', 'tatamotors.com', 'reliance.com', 'jio.com',
  'myntra.com', 'nykaa.com', 'meesho.com', 'snapdeal.com', 'bigbasket.com',
  'zeptonow.com', 'blinkit.com', 'lenskart.com', 'makemytrip.com', 'yatra.com',
  'cleartrip.com', 'bookmyshow.com', 'ola.com', 'olacabs.com', 'olaelectric.com',
  'rapido.bike', 'policybazaar.com', 'paisabazaar.com', 'bankbazaar.com',
  'naukri.com', 'shaadi.com', 'jeevansathi.com', 'firstcry.com', 'urbancompany.com',
  'cult.fit', 'cure.fit',
])

export function isIndiaSpecificDomain(rawDomain: string): boolean {
  if (!rawDomain) return false
  const clean = rawDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
  if (!clean) return false
  if (clean.endsWith('.in')) return true
  if (clean.endsWith('.example')) return true
  return KNOWN_INDIAN_DOMAINS.has(clean)
}

export { getRiskRating }
