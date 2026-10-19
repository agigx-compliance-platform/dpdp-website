/**
 * DPDP timeline — phased milestones with Gazette citations.
 *
 * All dates use IST (+05:30). The countdown targets the next upcoming
 * milestone. After the last one, the site reads "In force since …".
 *
 * Sources:
 *   - DPDP Act 2023: Gazette of India, Extraordinary, Part II Section 1,
 *     No. 47, 11 August 2023.
 *   - DPDP Rules 2025: MeitY notification dated 3 January 2025,
 *     Gazette of India, Extraordinary, Part II Section 3(i).
 *   - Removal of Difficulties Order 2026: MeitY notification dated
 *     14 March 2026, Gazette of India, Extraordinary, Part II Section 3(i).
 *
 * ⚠  Confirm these dates against the Gazette before publishing.
 */

export interface DpdpMilestone {
  /** ISO 8601 date-time with IST offset. */
  date: string
  /** Human-readable label for the countdown. */
  label: string
  /** Gazette / notification reference. */
  citation: string
  /** DPDP sections that come into force. */
  provisions: string[]
}

export const DPDP_TIMELINE: DpdpMilestone[] = [
  {
    date: '2023-08-11T00:00:00+05:30',
    label: 'DPDP Act 2023 receives Presidential assent',
    citation: 'Gazette of India, Extraordinary, Part II S.1, No. 47, 11 Aug 2023',
    provisions: ['Entire Act (except provisions deferred to Rules)'],
  },
  {
    date: '2025-01-03T00:00:00+05:30',
    label: 'DPDP Rules 2025 notified',
    citation: 'MeitY Notification, Gazette Part II S.3(i), 3 Jan 2025',
    provisions: ['Rules on consent management', 'Grievance officer appointment', 'DSAR timelines'],
  },
  {
    date: '2026-03-14T00:00:00+05:30',
    label: 'Removal of Difficulties Order',
    citation: 'MeitY Notification, Gazette Part II S.3(i), 14 Mar 2026',
    provisions: ['Clarification on SDF obligations', 'Extended timelines for certain sectors'],
  },
  {
    date: '2027-05-01T00:00:00+05:30',
    label: 'Full enforcement, penalties applicable',
    citation: 'DPDP Act 2023, Section 33, read with DPDP Rules 2025',
    provisions: [
      'Notice before consent',
      'Consent mechanics',
      'Data fiduciary obligations',
      'Data principal rights',
      'Penalties up to ₹250 Crore',
    ],
  },
]

/** Return the next upcoming milestone, or the last one if all are past. */
export function getNextMilestone(): DpdpMilestone {
  const now = Date.now()
  for (const m of DPDP_TIMELINE) {
    if (Date.parse(m.date) > now) return m
  }
  return DPDP_TIMELINE[DPDP_TIMELINE.length - 1]
}

/** Check whether all milestones have passed. */
export function isFullyInForce(): boolean {
  const last = DPDP_TIMELINE[DPDP_TIMELINE.length - 1]
  return Date.now() >= Date.parse(last.date)
}

/** Get the final enforcement milestone. */
export function getEnforcementMilestone(): DpdpMilestone {
  return DPDP_TIMELINE[DPDP_TIMELINE.length - 1]
}

/** Get milliseconds remaining until the next milestone. */
export function getMsUntilNext(): number {
  const m = getNextMilestone()
  return Math.max(0, Date.parse(m.date) - Date.now())
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
