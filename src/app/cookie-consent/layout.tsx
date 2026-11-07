import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'Is a cookie banner the same as consent?',
    answer:
      'No. The banner is how you ask. Consent also means holding back non-essential cookies until the visitor agrees, and keeping a record you can show later.',
  },
  {
    question: 'How many banner layouts do you offer?',
    answer:
      'Two: a bar and a pop-up. More layouts, languages, and location rules can be added.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Cookie Consent for DPDP',
  description:
    'A cookie banner for websites in India. Ask visitors before non-essential cookies run, give them a real choice, and keep a record.',
  path: '/cookie-consent',
  keywords: ['DPDP cookie consent', 'cookie banner India', 'consent management DPDP'],
})

export default function CookieConsentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Cookie consent', href: '/cookie-consent' }]} />
      <FaqJsonLd faqs={FAQS} />
      {children}
    </>
  )
}
