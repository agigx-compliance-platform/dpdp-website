import { describe, expect, it } from 'vitest'
import { privacyQualityScore, qualityRatingText } from '../score-display'
import { getRiskRating } from '../constants'

describe('privacyQualityScore', () => {
  it('inverts risk so 80 risk is 20 quality', () => {
    expect(privacyQualityScore(80)).toBe(20)
    expect(qualityRatingText(20)).toBe('Severe')
    expect(getRiskRating(80)).toBe('Severe')
  })

  it('treats 0 risk as strong quality', () => {
    expect(privacyQualityScore(0)).toBe(100)
    expect(qualityRatingText(100)).toBe('Strong')
  })

  it('refuses a missing score', () => {
    expect(() => privacyQualityScore(Number.NaN)).toThrow(/missing/)
  })
})
