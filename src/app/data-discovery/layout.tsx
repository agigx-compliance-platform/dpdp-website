import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'Do you copy our records out of our network?',
    answer:
      'No. Discovery builds an inventory of systems and fields. The records themselves stay where they already are.',
  },
  {
    question: 'What does a discovery run produce?',
    answer:
      'A live list of where personal data sits, how it is classified, and whether a rights request can look it up exactly.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Data Discovery for DPDP',
  description:
    'A live inventory of where personal data sits. Records stay in your network. Further connectors can be added.',
  path: '/data-discovery',
  keywords: ['DPDP data discovery', 'personal data inventory India'],
})

export default function DataDiscoveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Data discovery', href: '/data-discovery' }]} />
      <FaqJsonLd faqs={FAQS} />
      {children}
    </>
  )
}
