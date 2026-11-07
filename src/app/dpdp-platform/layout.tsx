import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { DPDP_PLATFORM_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Compliance Platform for Indian Enterprises',
  description:
    'DPDP Consultancy platform: one place for consent, website scans, people’s data requests, and more, so compliance is part of daily work, not a one-off project.',
  path: '/dpdp-platform',
  keywords: [
    'DPDP platform',
    'DPDP compliance platform',
    'DPDP compliance software',
    'DPDP compliance tool',
    'DPDP Consultancy',
    'dpdpconsultancy',
    'consent management platform India',
  ],
})

export default function DpdpPlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP platform', href: '/dpdp-platform' }]} />
      <FaqJsonLd faqs={DPDP_PLATFORM_FAQS} />
      {children}
    </>
  )
}
