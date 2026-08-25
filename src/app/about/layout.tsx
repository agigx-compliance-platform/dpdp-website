import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'About DPDP Consultancy — India\'s DPDP Compliance Experts',
  description:
    'DPDP Consultancy builds compliance intelligence that transforms DPDP Act 2023 obligations into enforceable technical controls for Indian enterprises. Meet our team of DPDP compliance experts.',
  path: '/about',
  keywords: ['DPDP consultancy', 'DPDP experts', 'DPDP compliance company India', 'about DPDP Consultancy', 'data protection experts India'],
  ogDescription: 'DPDP Consultancy transforms DPDP obligations into enforceable technical controls for Indian enterprises.',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'About DPDP Consultancy', href: '/about' }]} />
      {children}
    </>
  )
}
