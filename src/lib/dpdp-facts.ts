/**
 * Legal facts shown on the site, in one place, so pages cannot drift apart.
 *
 * Any change here is a legal change. Update docs/legal-signoff.md with it.
 */

export interface DpdpPenalty {
  /** What went wrong, in plain language. */
  failure: string
  /** The provision that was breached. */
  provision: string
  /** The legal maximum, as the Schedule states it. */
  maximum: string
}

/** The Schedule to the DPDP Act 2023. Each amount is a maximum, not a set fine. */
export const DPDP_PENALTIES: DpdpPenalty[] = [
  {
    failure: 'Not taking reasonable security safeguards to prevent a personal data breach',
    provision: 'Section 8(5)',
    maximum: 'Up to ₹250 crore',
  },
  {
    failure: 'Not telling the Data Protection Board or affected people about a breach',
    provision: 'Section 8(6)',
    maximum: 'Up to ₹200 crore',
  },
  {
    failure: 'Not meeting the extra duties for children’s data',
    provision: 'Section 9',
    maximum: 'Up to ₹200 crore',
  },
  {
    failure: 'Not meeting the extra duties of a Significant Data Fiduciary',
    provision: 'Section 10',
    maximum: 'Up to ₹150 crore',
  },
  {
    failure: 'Breaking any other part of the Act or Rules, including notice and consent',
    provision: 'Schedule, item 7',
    maximum: 'Up to ₹50 crore',
  },
  {
    failure: 'Breaking a voluntary undertaking given to the Board',
    provision: 'Section 32',
    maximum: 'Up to the maximum for the original breach',
  },
  {
    failure: 'An individual not meeting their own duties, such as filing a false complaint',
    provision: 'Section 15',
    maximum: 'Up to ₹10,000',
  },
]

export const PENALTY_CAVEAT =
  'These are legal maximums, not a prediction. The Data Protection Board decides any penalty after an inquiry, and looks at factors such as how serious the breach was and what was done to reduce the harm.'

/** The one sentence used wherever the top of the range is mentioned. */
export const HIGHEST_PENALTY_SENTENCE =
  'The highest maximum penalty is ₹250 crore, for not taking reasonable security safeguards. Other failures have lower maximums.'

export interface BreachDuty {
  when: string
  who: string
  what: string
}

/** Rule 7 of the DPDP Rules 2025. There are three separate steps, not one 72-hour deadline. */
export const BREACH_DUTIES: BreachDuty[] = [
  {
    when: 'Without delay',
    who: 'Each affected person',
    what: 'What happened, what it could mean for them, what you are doing, what they can do, and who to contact.',
  },
  {
    when: 'Without delay',
    who: 'Data Protection Board',
    what: 'A first description of the breach: what happened, how far it spread, when and where it happened, and the likely impact.',
  },
  {
    when: 'Within 72 hours, unless the Board allows longer',
    who: 'Data Protection Board',
    what: 'A detailed update: the facts, the cause, the steps taken, findings about who caused it, and the notices sent to affected people.',
  },
]

/** Plain answer to "does this apply to me?", following Section 3 of the Act. */
export const APPLICABILITY_SUMMARY =
  'The Act covers digital personal data handled in India, including paper records later turned into digital form. It also covers handling outside India when it is connected with offering goods or services to people in India. Citizenship is not the test.'

export const APPLICABILITY_EXCLUSIONS =
  'It does not cover data an individual uses for personal or household purposes, or data the person has chosen to make public or that was made public under a legal duty. Section 17 has further exemptions, so check your own position.'

/** Rule 13 of the DPDP Rules 2025, in plain language. Applies only once the government notifies a business as an SDF. */
export const SDF_SUMMARY =
  'The government can name a business as a Significant Data Fiduciary, based on factors such as how much data it handles and how sensitive that data is. It then has extra duties: a Data Protection Officer based in India, an independent data auditor, and a data protection impact assessment and audit every 12 months. It must also check that its technical tools, including algorithmic software, are not likely to put people’s rights at risk.'
