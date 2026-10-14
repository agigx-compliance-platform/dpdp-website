import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { DPDP_COMPLIANCE_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Compliance for Indian Organisations',
  description:
    'DPDP compliance for Indian Data Fiduciaries: obligation domains, penalties, and a practical path from assessment to consent, DSAR, and governance.',
  path: '/dpdp-compliance',
  keywords: [
    'DPDP compliance',
    'DPDP compliance India',
    'DPDP Consultancy',
    'dpdpconsultancy',
    'DPDP Act 2023 compliance',
    'Data Fiduciary compliance',
    'DPDP compliance requirements',
  ],
})

export default function DpdpComplianceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP compliance', href: '/dpdp-compliance' }]} />
      <FaqJsonLd faqs={DPDP_COMPLIANCE_FAQS} />
      {children}
    </>
  )
}
