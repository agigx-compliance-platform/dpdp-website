export type DpdpFaqItem = {
  question: string
  answer: string
}

export const HOME_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP?',
    answer:
      'DPDP is the Digital Personal Data Protection Act 2023, India\'s comprehensive data protection law. It governs how organisations collect, use, store, and share digital personal data of individuals in India. Every Data Fiduciary processing personal data of Indian Data Principals must comply, with penalties up to ₹250 Crore per violation.',
  },
  {
    question: 'What does DPDP stand for?',
    answer:
      'DPDP stands for Digital Personal Data Protection. The full name of the law is the Digital Personal Data Protection Act, 2023 (also called DPDPA). The implementing rules were notified in November 2025.',
  },
  {
    question: 'Who does the DPDP Act 2023 apply to?',
    answer:
      'The DPDP Act applies to any organisation that processes digital personal data of individuals in India — including Indian companies, foreign companies offering goods or services to people in India, employers, SaaS platforms, hospitals, banks, and marketplaces. Certain research, legal, and state functions have limited exemptions, but most businesses are in scope.',
  },
  {
    question: 'What are the penalties under the DPDP Act?',
    answer:
      'The DPDP Act 2023 prescribes penalties up to ₹250 Crore for failing to implement reasonable security safeguards, ₹200 Crore for consent and notice violations, ₹150 Crore for children\'s data violations, and ₹50 Crore for Data Principal obligation breaches. Significant Data Fiduciaries face additional obligations including a DPO, DPIAs, and annual audits.',
  },
  {
    question: 'When does DPDP enforcement begin?',
    answer:
      'The Digital Personal Data Protection Act received Presidential assent in August 2023. The DPDP Rules were notified in November 2025, with phased enforcement. Organisations should implement consent, notice, rights, and security controls now rather than waiting for full enforcement, because remediation typically takes 3–6 months.',
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
