import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { CONSENT_MANAGEMENT_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Consent Management for DPDP Act 2023',
  description:
    'Consent management for DPDP Act 2023: notices, granular purpose consent, withdrawal, and audit-ready proof for Indian organisations.',
  path: '/consent-management',
  keywords: [
    'consent management',
    'consent management India',
    'consent management platform',
    'DPDP consent',
    'DPDP Consultancy',
    'dpdpconsultancy',
    'DPDP Section 6',
  ],
})

export default function ConsentManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Consent management', href: '/consent-management' }]} />
      <FaqJsonLd faqs={CONSENT_MANAGEMENT_FAQS} />
      {children}
    </>
  )
}
