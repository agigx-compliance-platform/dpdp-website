import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Consultancy Products — Consent, Scanner & DSAR Tools',
  description:
    'DPDP Consultancy products: consent management, TrustScope scanner, DSAR automation, and AI compliance tools for India.',
  path: '/products',
  keywords: ['DPDP Consultancy products', 'dpdpconsultancy', 'DPDP compliance products', 'consent management platform India', 'DPDP scanner', 'DSAR management tool'],
  ogTitle: 'DPDP Consultancy Products — AI-powered Privacy Tools',
  ogDescription: 'DPDP Consultancy products: consent management, TrustScope scanner, DSAR automation, and more.',
})

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Consultancy Products', href: '/products' }]} />
      {children}
    </>
  )
}
