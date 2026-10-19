import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'Is a cookie banner the same as consent?',
    answer:
      'No. The banner is how a visitor is asked. Consent is the purpose grant, the block on non-essential tags, and the record you can produce later.',
  },
  {
    question: 'How many banner layouts do you ship today?',
    answer:
      'Two: a bar and a modal. More layouts, languages, and location rules can be added for the same consent record.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Cookie Consent for DPDP',
  description:
    'Cookie consent for Indian sites. Two banner layouts now (bar and modal), with scan, block-until-grant, and a receipt. More layouts can be added.',
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
