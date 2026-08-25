import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { SERVICE_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Compliance Services — Advisory, Privacy Operations & AI Governance',
  description:
    'Expert-led DPDP compliance services: privacy advisory, data protection operations, AI governance, technical implementation, compliance assurance, and managed services for Indian enterprises. Avoid penalties up to ₹250 Crore.',
  path: '/services',
  keywords: ['DPDP compliance services', 'DPDP advisory', 'DPDP consulting services', 'privacy operations India', 'AI governance services', 'DPDP implementation', 'data protection services India'],
  ogTitle: 'DPDP Compliance Services — Advisory, Privacy Ops & AI Governance',
  ogDescription: 'Expert DPDP compliance services: advisory, privacy operations, AI governance, and managed compliance for Indian enterprises.',
})

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Compliance Services', href: '/services' }]} />
      <FaqJsonLd faqs={SERVICE_FAQS} />
      {children}
    </>
  )
}
