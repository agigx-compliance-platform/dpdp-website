import { describe, expect, it } from 'vitest'
import { BREACH_DUTIES, DPDP_PENALTIES } from '../dpdp-facts'
import { DPDP_TIMELINE, formatMilestoneDate, getMainDutiesMilestone } from '../dpdp-timeline'
import {
  CONTACT_FAQS,
  CONSENT_MANAGEMENT_FAQS,
  DPDP_COMPLIANCE_FAQS,
  DPDP_PLATFORM_FAQS,
  HOME_FAQS,
  SERVICE_FAQS,
  WHAT_IS_DPDP_FAQS,
} from '../dpdp-faqs'

const ALL_FAQS = [
  ...HOME_FAQS,
  ...SERVICE_FAQS,
  ...CONTACT_FAQS,
  ...WHAT_IS_DPDP_FAQS,
  ...DPDP_COMPLIANCE_FAQS,
  ...CONSENT_MANAGEMENT_FAQS,
  ...DPDP_PLATFORM_FAQS,
]

describe('DPDP timeline', () => {
  it('lists the stages in date order', () => {
    const dates = DPDP_TIMELINE.map((m) => Date.parse(m.date))
    expect(dates).toEqual([...dates].sort((a, b) => a - b))
  })

  it('shows the main duties starting on 13 May 2027 in IST', () => {
    expect(formatMilestoneDate(getMainDutiesMilestone())).toBe('13 May 2027')
  })

  it('includes the consent manager stage', () => {
    expect(DPDP_TIMELINE.map(formatMilestoneDate)).toContain('13 November 2026')
  })
})

describe('DPDP penalties', () => {
  const maximumFor = (provision: string) =>
    DPDP_PENALTIES.find((p) => p.provision === provision)?.maximum

  it.each([
    ['Section 8(5)', 'Up to ₹250 crore'],
    ['Section 8(6)', 'Up to ₹200 crore'],
    ['Section 9', 'Up to ₹200 crore'],
    ['Section 10', 'Up to ₹150 crore'],
    ['Schedule, item 7', 'Up to ₹50 crore'],
    ['Section 15', 'Up to ₹10,000'],
  ])('%s has the Schedule maximum', (provision, maximum) => {
    expect(maximumFor(provision)).toBe(maximum)
  })
})

describe('breach duties', () => {
  it('keeps the 72-hour limit on the detailed Board update only', () => {
    const with72Hours = BREACH_DUTIES.filter((d) => d.when.includes('72 hours'))
    expect(with72Hours).toHaveLength(1)
    expect(with72Hours[0].who).toBe('Data Protection Board')
  })
})

describe('FAQ wording', () => {
  it.each([
    ['per violation'],
    ['Indian citizens'],
    ['algorithmic accountability'],
    ['Section 10(2)(b)'],
    ['Consent Cockpit'],
  ])('never says "%s"', (phrase) => {
    const hits = ALL_FAQS.filter((f) => `${f.question} ${f.answer}`.includes(phrase))
    expect(hits.map((f) => f.question)).toEqual([])
  })
})
