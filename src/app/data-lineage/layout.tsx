import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'Does lineage claim the map is complete?',
    answer:
      'No. A coverage view lists stores that are connected and stores that are still unknown. Gaps stay visible.',
  },
  {
    question: 'Where does the map come from?',
    answer:
      'Pipeline definitions, infrastructure definitions, query history, and job runs. Missing pieces are not invented.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Data Lineage for DPDP',
  description:
    'How personal data moved, and which stores are still unknown. Coverage, not a completeness claim. Feeds rights scope.',
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
