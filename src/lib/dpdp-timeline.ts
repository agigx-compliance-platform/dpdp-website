/**
 * DPDP timeline: the staged start dates, in one place.
 *
 * The list is shown as a whole rather than as a "next milestone" countdown.
 * Most pages are built statically, so a date picked at build time would go
 * stale until the next deploy.
 *
 * Any change here is a legal change. Update docs/legal-signoff.md with it.
 *
 * Sources:
 *   - DPDP Act 2023: Act 22 of 2023, Gazette of India, 11 August 2023.
 *   - Commencement of the Act: G.S.R. 843(E), 13 November 2025.
 *   - DPDP Rules 2025: G.S.R. 846(E), 13 November 2025, rule 1 sets the stages.
 */

export interface DpdpMilestone {
  /** ISO 8601 date-time with IST offset. */
  date: string
  /** Short plain-language title. */
  label: string
  /** What starts on this date, in plain language. */
  summary: string
  /** The legal source for the date. */
  citation: string
}

export const DPDP_TIMELINE: DpdpMilestone[] = [
  {
    date: '2023-08-11T00:00:00+05:30',
    label: 'The Act becomes law',
    summary: 'Parliament passes the DPDP Act and the President gives assent. Its duties do not start yet.',
    citation: 'DPDP Act 2023 (Act 22 of 2023)',
  },
  {
    date: '2025-11-13T00:00:00+05:30',
    label: 'The Rules are published',
    summary: 'The Rules are notified. Definitions and the provisions that set up the Data Protection Board start.',
    citation: 'G.S.R. 843(E) and G.S.R. 846(E), rule 1(2)',
  },
  {
    date: '2026-11-13T00:00:00+05:30',
    label: 'Consent managers can register',
    summary: 'Rules for consent managers, who help people manage their consents, start.',
    citation: 'DPDP Rules 2025, rule 1(3)',
  },
  {
    date: '2027-05-13T00:00:00+05:30',
    label: 'Main duties and penalties start',
    summary:
      'Most duties for businesses start: notice, consent, security, breach reporting, and people’s rights. Penalties can apply from this stage.',
    citation: 'DPDP Rules 2025, rule 1(4)',
  },
]

/** The stage when the main duties for businesses start. */
export function getMainDutiesMilestone(): DpdpMilestone {
  return DPDP_TIMELINE[DPDP_TIMELINE.length - 1]
}

/** Format a milestone date in IST for display. */
export function formatMilestoneDate(m: DpdpMilestone): string {
  return new Date(m.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}
