import { HIGHEST_PENALTY_SENTENCE, PENALTY_CAVEAT, SDF_SUMMARY } from './dpdp-facts'
import { DPDP_TIMELINE, formatMilestoneDate, getMainDutiesMilestone } from './dpdp-timeline'

export type DpdpFaqItem = {
  question: string
  answer: string
}

const stagedDates = DPDP_TIMELINE.slice(1)
  .map((m) => `${formatMilestoneDate(m)}: ${m.summary}`)
  .join(' ')
const mainDutiesDate = formatMilestoneDate(getMainDutiesMilestone())

const PENALTIES_ANSWER = `The maximum depends on what went wrong. It is up to ₹250 crore for not taking reasonable security safeguards, ₹200 crore for not reporting a breach, ₹200 crore for not meeting the extra duties for children’s data, ₹150 crore for not meeting the extra duties of a Significant Data Fiduciary, and ₹50 crore for other breaches of the Act or Rules, including notice and consent. An individual who breaks their own duties can face up to ₹10,000. ${PENALTY_CAVEAT}`

const APPLIES_ANSWER =
  'It covers digital personal data handled in India, and handling outside India when it is connected with offering goods or services to people in India. That usually includes companies, employers, hospitals, banks, online stores, and software providers. Citizenship is not the test. Some situations are excluded or exempt, such as personal or household use, and data a person has chosen to make public.'

export const HOME_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP?',
    answer:
      'DPDP stands for Digital Personal Data Protection. The Digital Personal Data Protection Act, 2023 is India’s law on how organisations collect, use, share, and delete people’s digital personal details. The Rules that put it into practice were notified in November 2025.',
  },
  {
    question: 'Who does the DPDP Act apply to?',
    answer: APPLIES_ANSWER,
  },
  {
    question: 'When does it start?',
    answer: `In stages. ${stagedDates} A business that starts early has more time to make changes, which usually take months.`,
  },
  {
    question: 'What are the penalties?',
    answer: PENALTIES_ANSWER,
  },
  {
    question: 'We already follow GDPR. Is that enough?',
    answer:
      'It helps, but it is not enough. DPDP has its own rules on notices, consent, children’s data, and breach reporting, and its own regulator. Work you did for GDPR, such as data maps and vendor lists, is a useful starting point.',
  },
  {
    question: 'How do we get started?',
    answer:
      'Start with the free 10-question assessment or website scan to see where you stand. Then decide which gaps to fix first. You can use our software, our team, or both.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'It depends on what you need, how many systems are involved, and how you want it hosted. Tell us about your business and we will send you a quote. The website scan and assessment are free.',
  },
]

export const SERVICE_FAQS: DpdpFaqItem[] = [
  {
    question: 'Does my company need DPDP compliance?',
    answer: `${APPLIES_ANSWER} Our assessment can help you work out your position.`,
  },
  {
    question: 'What are the penalties under the DPDP Act?',
    answer: PENALTIES_ANSWER,
  },
  {
    question: 'How long does it take to get ready?',
    answer:
      'As a guide, many organisations need 3 to 6 months. It depends on your size, how many systems and vendors you have, and how much is already in place. A typical plan moves from assessment (weeks 1 to 2) to design (weeks 3 to 6), implementation (months 2 to 3), and then ongoing work.',
  },
  {
    question: 'What is a Significant Data Fiduciary?',
    answer: SDF_SUMMARY,
  },
  {
    question: 'Do you offer a free assessment?',
    answer:
      'Yes. We offer a free website scan and a free 10-question assessment. Both give you an indication of where you stand. They are not legal advice. For a detailed review, our team can carry out a full gap assessment.',
  },
]

export const CONTACT_FAQS: DpdpFaqItem[] = [
  {
    question: 'When does the DPDP Act start?',
    answer: `In stages. The main duties for businesses start on ${mainDutiesDate}. Earlier stages cover the Data Protection Board and consent managers. It is worth starting early, because the changes usually take months.`,
  },
  {
    question: 'What is the maximum penalty?',
    answer: `${HIGHEST_PENALTY_SENTENCE} ${PENALTY_CAVEAT}`,
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'As a guide, a readiness assessment takes 2 to 4 weeks. Full implementation usually takes 3 to 9 months, depending on your systems, vendors, and any transfers of data outside India.',
  },
  {
    question: 'Do we need a Data Protection Officer?',
    answer:
      'The Act requires one only if the government names your business as a Significant Data Fiduciary. Other businesses must still publish contact details for someone who can answer questions about personal data, and many choose a named privacy lead. We offer a virtual Data Protection Officer service if you need expert cover without a full-time hire.',
  },
  {
    question: 'Are you focused on DPDP?',
    answer:
      'Yes. Our software and services are built around the DPDP Act 2023 and the 2025 Rules, for organisations in India.',
  },
]

export const WHAT_IS_DPDP_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP?',
    answer:
      'DPDP is the Digital Personal Data Protection Act 2023, India’s law on how organisations handle people’s digital personal details.',
  },
  {
    question: 'Who is DPDP Consultancy?',
    answer:
      'DPDP Consultancy (dpdpconsultancy.in) is a DPDP compliance company based in Chennai. We provide advice, consent and data request software, free website scans, and managed privacy services.',
  },
  {
    question: 'What does DPDP stand for?',
    answer:
      'DPDP stands for Digital Personal Data Protection. The law is the Digital Personal Data Protection Act, 2023, also called DPDPA. The Rules were notified in November 2025.',
  },
  {
    question: 'Who does the DPDP Act apply to?',
    answer: APPLIES_ANSWER,
  },
  {
    question: 'How can DPDP Consultancy help?',
    answer:
      'We offer a free website scan, a 10-question readiness assessment, advice, consent management, tools for handling people’s data requests, AI governance, and managed privacy services.',
  },
]

export const DPDP_COMPLIANCE_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is DPDP compliance?',
    answer:
      'It means your organisation follows the DPDP Act 2023 and can show it does: clear notices, valid consent, a way to handle people’s requests, reasonable security, oversight of vendors, and records you can produce if the Data Protection Board asks.',
  },
  {
    question: 'Who needs DPDP compliance in India?',
    answer: APPLIES_ANSWER,
  },
  {
    question: 'What are the main requirements?',
    answer:
      'They fall into six areas: notice and consent, people’s rights, keeping data only as long as needed, security and breach reporting, vendors, and governance. Businesses named as Significant Data Fiduciaries have extra duties, such as a Data Protection Officer, an independent auditor, and yearly assessments and audits.',
  },
  {
    question: 'How long does DPDP compliance take?',
    answer:
      'A typical project moves from assessment in weeks 1 to 2 to design in weeks 3 to 6, implementation over months 2 to 3, and ongoing work after that. It depends on your systems and vendors, and on whether you have extra duties as a Significant Data Fiduciary.',
  },
  {
    question: 'How do I start?',
    answer:
      'Start with a website scan and an assessment, then put notices, consent, and request handling in place before moving on to vendors, data retention, and security evidence. Our scan and 10-question assessment are free.',
  },
]

export const CONSENT_MANAGEMENT_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is consent management under the DPDP Act?',
    answer:
      'It is how you collect, record, update, and prove consent for each purpose you use personal details for. Under Section 6, consent must be free, specific, informed, unconditional, and unambiguous, and as easy to withdraw as it is to give. A banner on its own is not enough.',
  },
  {
    question: 'Does DPDP require consent management software?',
    answer:
      'The Act does not require any particular product. It does require notice, consent for specific purposes, an easy way to withdraw, and the ability to prove consent was given. For organisations with several purposes, cookies, or vendors, software is usually the practical way to do this.',
  },
  {
    question: 'How is DPDP consent different from GDPR consent?',
    answer:
      'GDPR has a broad "legitimate interest" basis for using data. DPDP does not. Outside the specific "legitimate uses" in Section 7, you generally need notice and consent. A single "accept all" with no choice by purpose is a compliance risk.',
  },
  {
    question: 'What proof of consent should we keep?',
    answer:
      'You should be able to show who agreed, to which purposes, what notice they saw, when they agreed, and whether they later withdrew. Our software keeps a record of each of these that cannot be quietly changed.',
  },
  {
    question: 'Do banners and notices need Indian languages?',
    answer:
      'People must be able to read the notice and make a real choice. Under the Act, they should have the option of English or a language listed in the Eighth Schedule. Our banner and notices support English and Hindi, and further languages can be added.',
  },
  {
    question: 'Where do people see and change what they agreed to?',
    answer:
      'In a single privacy centre. It shows their consents, data requests, and complaints. When they withdraw consent for a purpose, your business and the relevant vendors are told from that same record.',
  },
  {
    question: 'Can we use a global consent tool for DPDP?',
    answer:
      'A tool made for GDPR can handle cookies, but check whether it covers DPDP notice content, choice by purpose, children’s data, Indian languages, and people’s rights. We build ours around the DPDP Act and the 2025 Rules.',
  },
]

export const DPDP_PLATFORM_FAQS: DpdpFaqItem[] = [
  {
    question: 'What is a DPDP compliance platform?',
    answer:
      'It is software for the daily work the Act requires: consent and notices, website checks, people’s data requests, keeping vendors informed, and records for audits.',
  },
  {
    question: 'How is the platform different from consulting?',
    answer:
      'Advisers help you decide what to do. The platform is where consent, scans, requests, and vendor updates actually happen afterwards. We provide both.',
  },
  {
    question: 'What is included?',
    answer:
      'Consent records, a cookie banner, privacy notices, website scanning, handling of people’s data requests, vendor tracking, finding personal data, tracking where it goes, cloud and code checks, and an AI assistant trained on the DPDP Act and 2025 Rules.',
  },
  {
    question: 'Who is it for?',
    answer:
      'Privacy, legal, security, and IT teams at mid-size and large organisations, especially those that collect data through websites, apps, or vendors. Start with a free website scan, then we can scope what you need.',
  },
  {
    question: 'Is it only for large enterprises?',
    answer:
      'No. Smaller organisations usually start with consent, website scanning, and data requests. Businesses named as Significant Data Fiduciaries add support for their extra duties, such as yearly assessments and audits.',
  },
]
