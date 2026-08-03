import type { Finding, CitizenQuestion, GrievanceDraft, CitizenActions } from './types'

/* ═══════════════════════════════════════════════════════════════
   Question Templates — keyed by finding module
   ═══════════════════════════════════════════════════════════════ */

const QUESTION_TEMPLATES: Record<string, (f: Finding, domain: string) => string> = {
  policy_link: (f, d) => `Does ${d} have a publicly accessible privacy policy? Where can I find it?`,
  policy_page: (f, d) => `Why does ${d} not publish a privacy policy at standard web paths?`,
  policy_sections: (f, d) => `Your privacy policy appears to be missing sections on: ${f.details?.replace('Missing: ', '')}. Can you clarify your practices in these areas?`,
  policy_date: (f, d) => `When was your privacy policy at ${d} last updated?`,
  purpose_spec: (f, d) => `What are the specific purposes for which ${d} collects and processes personal data?`,
  cmp_presence: (f, d) => `Does ${d} provide a cookie consent mechanism? How can I manage my cookie preferences?`,
  reject_option: (f, d) => `Does your consent interface at ${d} provide an equally prominent option to reject non-essential cookies?`,
  manage_prefs: (f, d) => `How can I manage my cookie preferences on ${d}? Is there a granular control panel?`,
  pref_center: (f, d) => `Is there a persistent link on ${d} to revisit and change my cookie preferences?`,
  revocation: (f, d) => `How can I withdraw my consent on ${d}? Where is the option to revoke previously given consent?`,
  pre_consent_trackers: (f, d) => `Why does ${d} load tracking scripts before obtaining user consent?`,
  server_cookies: (f, d) => `What cookies does ${d} set on the first visit before any consent is given, and why?`,
  rights_link: (f, d) => `How can I exercise my data subject rights (access, correction, deletion) on ${d}?`,
  dpo_contact: (f, d) => `Who is the Data Protection Officer or Grievance Officer for ${d}? How can I contact them?`,
  individual_rights: (f, d) => `Can you confirm that ${d} supports the following data subject rights: ${f.details}?`,
  no_ai_disclosure: (f, d) => `Does ${d} use AI, machine learning, or automated decision-making in its services? If so, how?`,
  partial_ai_disclosure: (f, d) => `Your AI disclosures mention some aspects but not others. ${f.details?.replace('Missing: ', 'Can you clarify: ')}?`,
  profiling_no_optout: (f, d) => `${d} mentions profiling but does not describe an opt-out mechanism. How can I opt out of profiling?`,
  automated_no_review: (f, d) => `${d} uses automated decision-making. Can I request human review of automated decisions?`,
  no_children_policy: (f, d) => `Does ${d} have a policy on children's data? How does it handle data from minors?`,
  no_parental_consent: (f, d) => `If ${d} collects data from children, what parental consent mechanism is used?`,
  no_https: (f, d) => `Why is ${d} not served over HTTPS? My data may be exposed during transmission.`,
  missing_security_headers_high: (f, d) => `${d} is missing critical security headers. What measures protect user data in transit?`,
  no_security_txt: (f, d) => `Does ${d} publish a security.txt file for responsible disclosure?`,
}

/* ═══════════════════════════════════════════════════════════════
   Question Generator
   ═══════════════════════════════════════════════════════════════ */

function generateQuestions(findings: Finding[], domain: string): CitizenQuestion[] {
  const questions: CitizenQuestion[] = []

  // Prioritize by severity
  const sorted = [...findings].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
    return order[a.severity] - order[b.severity]
  })

  for (const f of sorted) {
    const templateFn = QUESTION_TEMPLATES[f.module]
    if (templateFn) {
      const evidenceRef = f.evidenceItems.length > 0
        ? `Evidence: ${f.evidenceItems[0].type}${f.evidenceItems[0].url ? ` at ${f.evidenceItems[0].url}` : ''}`
        : undefined

      questions.push({
        id: `q-${f.id}`,
        question: templateFn(f, domain),
        context: f.description,
        relatedFindingId: f.id,
        evidenceReference: evidenceRef,
      })
    } else {
      // Generic question fallback
      questions.push({
        id: `q-${f.id}`,
        question: `Regarding "${f.title}" on ${domain}: ${f.description} Can you provide more information?`,
        context: f.description,
        relatedFindingId: f.id,
      })
    }
  }

  return questions.slice(0, 20) // Cap at 20 questions
}

/* ═══════════════════════════════════════════════════════════════
   Grievance Draft Generator
   ═══════════════════════════════════════════════════════════════ */

function generateGrievanceDraftText(findings: Finding[], domain: string): GrievanceDraft | null {
  const criticalOrHigh = findings.filter(f => f.severity === 'critical' || f.severity === 'high')
  if (criticalOrHigh.length === 0) return null

  const issueList = criticalOrHigh
    .slice(0, 5)
    .map((f, i) => `${i + 1}. ${f.title}: ${f.description}`)
    .join('\n')

  const body = `To the Data Protection Officer / Grievance Officer,

I am writing to formally raise a privacy grievance regarding ${domain}.

After reviewing the publicly available information on your website, I have identified the following concerns:

${issueList}

Under the Digital Personal Data Protection Act, 2023 (DPDP Act), I request that you:

1. Acknowledge this grievance within the prescribed timeframe.
2. Investigate the identified concerns and provide a detailed response.
3. Take corrective action where necessary.

I look forward to your response within the statutory period.

Regards,
[Your Name]
[Your Contact Information]

---
This grievance was generated based on a public scan of ${domain}. The findings are based on publicly accessible information only.`

  return {
    subject: `Privacy Grievance — ${domain} — ${criticalOrHigh.length} Concern(s) Identified`,
    body,
    relatedFindings: criticalOrHigh.map(f => f.id),
  }
}

/* ═══════════════════════════════════════════════════════════════
   Follow-Up Template
   ═══════════════════════════════════════════════════════════════ */

function generateFollowUp(domain: string): string {
  return `Subject: Follow-Up — Privacy Grievance Regarding ${domain}

Dear Data Protection Officer / Grievance Officer,

I am following up on my privacy grievance submitted on [DATE] regarding ${domain}.

As of today, I have not received a response addressing the concerns raised. Under the Digital Personal Data Protection Act, 2023, a response is expected within the prescribed timeframe.

I request:
1. An update on the status of my grievance.
2. A timeline for resolution.
3. If resolved, details of the corrective actions taken.

If I do not receive a response within [REASONABLE TIMEFRAME], I may escalate this matter to the Data Protection Board of India.

Regards,
[Your Name]
[Your Contact Information]`
}

/* ═══════════════════════════════════════════════════════════════
   Complaint Pack Summary
   ═══════════════════════════════════════════════════════════════ */

function generateComplaintPackSummary(findings: Finding[], domain: string): string {
  const total = findings.length
  const critical = findings.filter(f => f.severity === 'critical').length
  const high = findings.filter(f => f.severity === 'high').length
  const evidenceCount = findings.reduce((sum, f) => sum + f.evidenceItems.length, 0)

  return `Complaint Evidence Pack for ${domain}:
- Total findings: ${total}
- Critical: ${critical}, High: ${high}
- Evidence items collected: ${evidenceCount}
- Scan type: Public website scan (no authentication)
- This pack can be submitted to the Data Protection Board of India if the grievance remains unresolved.`
}

/* ═══════════════════════════════════════════════════════════════
   Main Citizen Actions Generator
   ═══════════════════════════════════════════════════════════════ */

/**
 * Generates citizen action items from scan findings:
 * - Targeted questions referencing evidence
 * - Grievance draft (if critical/high issues found)
 * - Follow-up template
 * - Complaint pack summary
 */
export function generateCitizenActions(findings: Finding[], domain: string): CitizenActions {
  return {
    questions: generateQuestions(findings, domain),
    grievanceDraft: generateGrievanceDraftText(findings, domain),
    followUpTemplate: generateFollowUp(domain),
    complaintPackSummary: generateComplaintPackSummary(findings, domain),
  }
}
