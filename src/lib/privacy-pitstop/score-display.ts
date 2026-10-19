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

export { getRiskRating }
