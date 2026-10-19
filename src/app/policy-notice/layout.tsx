import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'Which notices do you support today?',
    answer:
      'Two: the privacy notice and the cookie policy. More notice types can be added on the same version history.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Policy and Notice Management for DPDP',
  description:
    'Privacy notice and cookie policy today, with versioning and purpose mapping. Children’s, processor, and AI notices can be added.',
  path: '/policy-notice',
  keywords: ['DPDP notice', 'privacy notice India', 'cookie policy DPDP'],
})

export default function PolicyNoticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Policy and notice', href: '/policy-notice' }]} />
      <FaqJsonLd faqs={FAQS} />
      {children}
    </>
  )
}
