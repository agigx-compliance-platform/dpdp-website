import { describe, expect, it } from 'vitest'
import { privacyQualityScore, qualityRatingText, isIndiaSpecificDomain } from '../score-display'
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

  it('identifies India-specific domains accurately', () => {
    expect(isIndiaSpecificDomain('irctc.co.in')).toBe(true)
    expect(isIndiaSpecificDomain('redbus.in')).toBe(true)
    expect(isIndiaSpecificDomain('zomato.com')).toBe(true)
    expect(isIndiaSpecificDomain('https://www.flipkart.com/path')).toBe(true)
    expect(isIndiaSpecificDomain('bbc.co.uk')).toBe(false)
    expect(isIndiaSpecificDomain('google.com')).toBe(false)
  })
})
