import { formatMilestoneDate, getEnforcementMilestone, getNextMilestone } from './dpdp-timeline'

export type DpdpFaqItem = {
  question: string
  answer: string
}

const nextMilestone = getNextMilestone()
const enforcement = getEnforcementMilestone()

export const HOME_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP?',
    answer:
      'DPDP is the Digital Personal Data Protection Act 2023, India\'s comprehensive data protection law. DPDP Consultancy (dpdpconsultancy.in) helps Data Fiduciaries comply when processing personal data of Indian Data Principals, with penalties up to ₹250 Crore per violation.',
  },
  {
    question: 'What does DPDP stand for?',
    answer:
      'DPDP stands for Digital Personal Data Protection. The full name of the law is the Digital Personal Data Protection Act, 2023 (also called DPDPA). The implementing rules were notified in November 2025.',
  },
  {
    question: 'Who does the DPDP Act 2023 apply to?',
    answer:
      'The DPDP Act applies to any organisation that processes digital personal data of individuals in India, including Indian companies, foreign companies offering goods or services to people in India, employers, SaaS platforms, hospitals, banks, and marketplaces. Certain research, legal, and state functions have limited exemptions, but most businesses are in scope.',
  },
  {
    question: 'What are the penalties under the DPDP Act?',
    answer:
      'The DPDP Act 2023 prescribes penalties up to ₹250 Crore for failing to implement reasonable security safeguards, ₹200 Crore for consent and notice violations, ₹150 Crore for children\'s data violations, and ₹50 Crore for Data Principal obligation breaches. Significant Data Fiduciaries face additional obligations including a DPO, DPIAs, and annual audits.',
  },
  {
    question: 'When does DPDP enforcement begin?',
    answer:
      `The Digital Personal Data Protection Act received Presidential assent in August 2023. The DPDP Rules were notified in November 2025, with phased enforcement. The next milestone on this site's timeline is ${nextMilestone.label} (${formatMilestoneDate(nextMilestone)}; ${nextMilestone.citation}). Full enforcement in the timeline is ${enforcement.label} on ${formatMilestoneDate(enforcement)}. Organisations should implement consent, notice, rights, and security controls now. Remediation typically takes months.`,
  },
  {
    question: 'How is DPDP different from GDPR?',
    answer:
      'DPDP is India-specific: it uses Data Fiduciary and Data Principal terminology, emphasises consent and notice, and is enforced by the Data Protection Board of India. Unlike GDPR, DPDP does not use the same lawful bases (legitimate interest is not a general basis), has different children\'s data rules, and sets Indian-rupee penalty caps. GDPR-aligned programmes still need DPDP-specific consent, notice, and rights controls.',
  },
  {
    question: 'How can my organisation become DPDP compliant?',
    answer:
      'A typical DPDP compliance journey is: (1) assess applicability and gaps, (2) design consent, notice, and rights workflows, (3) implement technical controls such as a consent platform and DSAR automation, and (4) operate continuous monitoring. DPDP Consultancy provides a free website privacy scan, a 10-question readiness assessment, advisory services, and a compliance intelligence platform for Indian enterprises.',
  },
]

export const SERVICE_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP compliance and why does my company need it?',
    answer:
      'DPDP (Digital Personal Data Protection Act 2023) is India\'s comprehensive data protection law. Every organization processing personal data of Indian citizens must comply. Non-compliance can result in penalties up to ₹250 Crore per violation. DPDP Consultancy helps you achieve and maintain compliance through advisory services, technology platforms, and managed operations.',
  },
  {
    question: 'What are the penalties for non-compliance with DPDP Act 2023?',
    answer:
      'The DPDP Act 2023 prescribes penalties up to ₹250 Crore for failing to implement reasonable security safeguards, ₹200 Crore for consent and notice violations, ₹150 Crore for violations related to children\'s data, and ₹50 Crore for data principal obligation breaches. DPDP Consultancy provides penalty exposure assessments and compliance roadmaps to mitigate these risks.',
  },
  {
    question: 'How long does it take to become DPDP compliant?',
    answer:
      'A typical DPDP compliance journey takes 3-6 months depending on your organization\'s size and complexity. Our phased approach includes: assessment (weeks 1-2), design (weeks 3-6), implementation (months 2-3), and ongoing governance (months 3-6). DPDP Consultancy accelerates this with automated scanning, pre-built consent management, and expert advisory.',
  },
  {
    question: 'What is a Significant Data Fiduciary (SDF) under DPDP?',
    answer:
      'A Significant Data Fiduciary (SDF) is designated by the government based on data volume, sensitivity, and risk to data principals. SDFs have enhanced obligations including mandatory Data Protection Impact Assessments (DPIAs), annual audits, appointing a Data Protection Officer (DPO), and algorithmic accountability. DPDP Consultancy provides specialized SDF compliance programs.',
  },
  {
    question: 'Does DPDP Consultancy offer a free compliance assessment?',
    answer:
      'Yes. DPDP Consultancy offers a free website privacy scan through our Privacy Pitstop tool and a 10-question compliance assessment questionnaire. These provide an indicative compliance score and personalized recommendations. For comprehensive assessments, our advisory team conducts detailed gap analysis across all DPDP obligation domains.',
  },
]

export const CONTACT_FAQS: DpdpFaqItem[] = [
  {
    question: 'When does DPDP 2023 come into effect?',
    answer:
      'The Digital Personal Data Protection Act 2023 received Presidential assent in August 2023. The implementation rules were notified in November 2025, with phased enforcement timelines for different provisions. Organizations should begin compliance preparation immediately to avoid penalties.',
  },
  {
    question: 'What are the maximum penalties under DPDP?',
    answer:
      'DPDP 2023 prescribes penalties up to ₹250 Crore for non-compliance with specific provisions. Different violations carry different penalty amounts, from ₹50 Crore for failure to implement security safeguards to ₹250 Crore for non-compliance with provisions relating to children\'s data or Data Protection Board orders.',
  },
  {
    question: 'How long does a typical DPDP compliance engagement take?',
    answer:
      'Timeline varies based on organizational complexity and current maturity. A readiness assessment typically takes 2-4 weeks. Full compliance implementation ranges from 3-9 months depending on scope, number of data systems, cross-border considerations, and whether SDF classification applies.',
  },
  {
    question: 'Do we need a Data Protection Officer?',
    answer:
      'Under DPDP 2023, DPO appointment is mandatory for Significant Data Fiduciaries (Section 10(2)(b)). Even if not classified as SDF, having a designated privacy lead is strongly recommended. Consent Cockpit offers Virtual DPO services for organizations that need expert coverage without full-time hiring.',
  },
  {
    question: 'Is Consent Cockpit focused on DPDP?',
    answer:
      'Yes. Our platform and methodologies are built around the Digital Personal Data Protection Act 2023 and the 2025 Rules, from consent capture and privacy notices to Data Principal rights, grievance handling, and regulator-ready evidence for Indian enterprises.',
  },
]

export const WHAT_IS_DPDP_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP?',
    answer:
      'DPDP is the Digital Personal Data Protection Act 2023. DPDP Consultancy (dpdpconsultancy.in) explains and operationalises this law for Indian enterprises: how personal data is collected, used, stored, shared, and deleted, with penalties up to ₹250 Crore per violation.',
  },
  {
    question: 'Who is DPDP Consultancy?',
    answer:
      'DPDP Consultancy (also searched as dpdpconsultancy) is an Indian DPDP Act 2023 compliance firm based in Chennai. We provide advisory services, a consent and DSAR platform, Privacy Pitstop website scans, and managed privacy operations at dpdpconsultancy.in.',
  },
  {
    question: 'What does DPDP stand for?',
    answer:
      'DPDP stands for Digital Personal Data Protection. The statute is the Digital Personal Data Protection Act, 2023 (DPDPA). The implementing rules were notified in November 2025.',
  },
  {
    question: 'Who does the DPDP Act apply to?',
    answer:
      'The DPDP Act applies to organisations that process digital personal data of people in India, including Indian companies and foreign companies offering goods or services in India. DPDP Consultancy helps Data Fiduciaries map which obligations apply.',
  },
  {
    question: 'How can DPDP Consultancy help with DPDP compliance?',
    answer:
      'DPDP Consultancy provides a free Privacy Pitstop scan, a 10-question readiness assessment, DPDP advisory, consent management, DSAR automation, AI governance, and managed services so compliance is continuous rather than a one-time project.',
  },
]

export const DPDP_COMPLIANCE_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP compliance?',
    answer:
      'DPDP compliance means a Data Fiduciary can demonstrate that digital personal data of people in India is processed lawfully under the Digital Personal Data Protection Act 2023: valid notices and consent, Data Principal rights, reasonable security, vendor oversight, and evidence the Data Protection Board can inspect.',
  },
  {
    question: 'Who needs DPDP compliance in India?',
    answer:
      'Any organisation that processes digital personal data of individuals in India, including Indian companies and foreign companies offering goods or services here. Employers, SaaS platforms, hospitals, banks, marketplaces, and public-facing websites are typically in scope. DPDP Consultancy maps which obligation domains apply to your processing.',
  },
  {
    question: 'What are the main DPDP compliance requirements?',
    answer:
      'The operational requirements cluster into six domains: consent and notice, Data Principal rights, data minimisation and retention, security and breach, vendors and processors, and governance (including SDF duties such as a DPO, DPIAs, and audits where designated).',
  },
  {
    question: 'How long does DPDP compliance take?',
    answer:
      'A typical DPDP Consultancy engagement is assessment in weeks 1–2, control design in weeks 3–6, implementation over months 2–3, and ongoing governance after that. Timeline depends on data systems, vendors, and whether Significant Data Fiduciary duties apply.',
  },
  {
    question: 'How do I start a DPDP compliance programme?',
    answer:
      'Start with a public-surface scan and a gap assessment, then implement consent, notice, and rights workflows before expanding to vendors, retention, and security evidence. DPDP Consultancy offers a free Privacy Pitstop scan and a 10-question readiness assessment as the first step.',
  },
]

export const CONSENT_MANAGEMENT_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is consent management under the DPDP Act?',
    answer:
      'Consent management is the system that collects, records, updates, and proves consent for each purpose of processing. Under DPDP Section 6, consent must be free, specific, informed, unambiguous, and as easy to withdraw as it is to give. A banner alone is not consent management.',
  },
  {
    question: 'Does DPDP require a consent management platform?',
    answer:
      'The Act does not name a product category, but it does require purpose-level consent, notice, withdrawal, and the ability to demonstrate compliance. For any organisation with cookies, SDKs, or multiple processing purposes, a consent management platform is the practical way to meet those duties at scale.',
  },
  {
    question: 'How is DPDP consent different from GDPR consent?',
    answer:
      'DPDP does not treat legitimate interest as a general lawful basis the way GDPR does. Notices and consent are the default path for most processing. Withdrawal must be as easy as giving consent, and purpose must be specific. Bundled “accept all” without purpose choice is a compliance risk.',
  },
  {
    question: 'What proof of consent does DPDP expect?',
    answer:
      'You should be able to show who consented, to which purposes, on which notice version, at what time, and whether they later withdrew. DPDP Consultancy’s consent platform keeps an immutable audit trail so that proof is available for grievance handling and Board inquiries.',
  },
  {
    question: 'Do banners, notices, and rights forms need Indian languages?',
    answer:
      'The person has to understand the notice and the choice. English and Hindi ship on the banner and notices today. DSAR and grievance intake use the same language table. Further languages can be added without a separate product per workflow.',
  },
  {
    question: 'Where does the Data Principal see and change what they granted?',
    answer:
      'The privacy cockpit is the one ledger. Consent grants and withdrawals, DSAR, and grievance sit there. When a purpose is withdrawn, the fiduciary and mapped processors are notified from that same record, not from a second helpdesk tool.',
  },
  {
    question: 'Can I use a global CMP for DPDP consent management?',
    answer:
      'A GDPR-oriented CMP can cover cookies, but it often misses DPDP notice content, purpose granularity, children’s data, and Indian-language or Data Principal rights hooks. DPDP Consultancy implements consent management against the DPDP Act 2023 and the 2025 Rules, not a European template.',
  },
]

export const DPDP_PLATFORM_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is a DPDP compliance platform?',
    answer:
      'A DPDP compliance platform is software that runs the controls the Act requires day to day: consent and notices, website and tracker scanning, Data Principal rights (DSAR), vendor/processor propagation, and evidence for audits. DPDP Consultancy’s platform is built for Indian Data Fiduciaries, not as a GDPR add-on.',
  },
  {
    question: 'How is a DPDP platform different from a consultancy engagement?',
    answer:
      'Advisory designs the programme. The platform is where consent, scans, rights requests, and vendor actions actually run after the workshop ends. DPDP Consultancy provides both so compliance does not stall as a slide deck.',
  },
  {
    question: 'What modules are in the DPDP Consultancy platform?',
    answer:
      'Consent Cockpit for Section 6 consent, TrustScope and Privacy Pitstop for public-surface scanning, DSAR workflows for Sections 11–13, processor governance, infrastructure scanning, and an AI compliance assistant trained on the DPDP Act and 2025 Rules.',
  },
  {
    question: 'Who should use a DPDP compliance platform?',
    answer:
      'DPOs, privacy leads, CISOs, and legal teams at organisations that collect data through websites, apps, or vendors, especially if they cannot prove consent, meet rights timelines, or see what trackers fire on their properties. Start with a free Privacy Pitstop scan, then scope the platform.',
  },
  {
    question: 'Is the DPDP Consultancy platform only for large enterprises?',
    answer:
      'No. Mid-size Indian companies, SaaS products, and regulated firms use the same modules with a narrower footprint. Significant Data Fiduciaries add DPO, DPIA, and audit workflows; smaller fiduciaries typically start with consent, scanning, and DSAR.',
  },
]

