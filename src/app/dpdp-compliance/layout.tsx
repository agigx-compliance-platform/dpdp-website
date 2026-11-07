import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { DPDP_COMPLIANCE_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Compliance for Indian Organisations',
  description:
    'What DPDP compliance means for Indian organisations: who it covers, when it starts, the penalties, and a practical way to get ready.',
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
