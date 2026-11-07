import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'Will the map be complete?',
    answer:
      'Not always. We show which systems are connected and which are still unknown, so gaps stay visible.',
  },
  {
    question: 'Where does the map come from?',
    answer:
      'From technical records you already have: data pipelines, infrastructure settings, database query history, and scheduled job runs. We do not invent missing pieces.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Data Lineage for DPDP',
  description:
    'See how personal data moves between your systems, and what is still unknown. Helps you answer people’s requests.',
  path: '/data-lineage',
  keywords: ['DPDP data lineage', 'personal data mapping India', 'DSAR scope'],
})

export default function DataLineageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Data lineage', href: '/data-lineage' }]} />
      <FaqJsonLd faqs={FAQS} />
      {children}
    </>
  )
}
