import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Consultancy Partnership — Advisory & Implementation',
  description:
    'Partner with DPDP Consultancy for advisory, implementation, and managed DPDP compliance delivery in India.',
  path: '/partnership',
  keywords: ['DPDP Consultancy partner', 'dpdpconsultancy', 'DPDP partnership', 'DPDP implementation partner', 'privacy consulting partner India'],
  ogTitle: 'DPDP Consultancy Partnership — Grow Your Privacy Practice',
  ogDescription: 'Partner with DPDP Consultancy for advisory, implementation, and managed DPDP compliance services.',
})

export default function PartnershipLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Consultancy Partnership', href: '/partnership' }]} />
      {children}
    </>
  )
}
