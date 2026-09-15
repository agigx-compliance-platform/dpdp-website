import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { SERVICE_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Consultancy Services — Advisory, Privacy Ops & AI Governance',
  description:
    'DPDP Consultancy services: privacy advisory, operations, AI governance, and managed DPDP compliance for Indian enterprises.',
  path: '/services',
  keywords: ['DPDP Consultancy services', 'dpdpconsultancy', 'DPDP compliance services', 'DPDP advisory', 'DPDP consulting services', 'privacy operations India', 'AI governance services'],
  ogTitle: 'DPDP Consultancy Services — Advisory, Privacy Ops & AI Governance',
  ogDescription: 'DPDP Consultancy: advisory, privacy operations, AI governance, and managed DPDP compliance for Indian enterprises.',
})

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Consultancy Services', href: '/services' }]} />
      <FaqJsonLd faqs={SERVICE_FAQS} />
      {children}
    </>
  )
}
