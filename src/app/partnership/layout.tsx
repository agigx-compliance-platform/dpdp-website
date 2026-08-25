import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Compliance Partnership — Advisory & Implementation Partners',
  description:
    'Partner with DPDP Consultancy: advisory engagements, implementation partnerships, and managed services for DPDP compliance delivery. Grow your privacy practice with India\'s leading DPDP platform.',
  path: '/partnership',
  keywords: ['DPDP compliance partner', 'DPDP partnership', 'DPDP implementation partner', 'privacy consulting partner India', 'DPDP managed services partner'],
  ogTitle: 'DPDP Compliance Partnership — Grow Your Privacy Practice',
  ogDescription: 'Partner with DPDP Consultancy for advisory, implementation, and managed DPDP compliance services.',
})

export default function PartnershipLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Compliance Partnership', href: '/partnership' }]} />
      {children}
    </>
  )
}
