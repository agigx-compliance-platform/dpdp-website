import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Compliance Products — Consent Management, Scanner & DSAR Tools',
  description:
    'AI-powered DPDP compliance products: Consent Management Platform, TrustScope Privacy Scanner, DSAR Management, Infrastructure Scanner, AI Compliance Assistant, and Adaptive Compliance Engine for Indian enterprises.',
  path: '/products',
  keywords: ['DPDP compliance products', 'consent management platform India', 'DPDP scanner', 'DSAR management tool', 'privacy scanner', 'AI compliance assistant', 'DPDP compliance software India'],
  ogTitle: 'DPDP Compliance Products — AI-powered Privacy Tools',
  ogDescription: 'AI-powered DPDP compliance products: Consent Management, TrustScope Scanner, DSAR Management, and more.',
})

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Compliance Products', href: '/products' }]} />
      {children}
    </>
  )
}
