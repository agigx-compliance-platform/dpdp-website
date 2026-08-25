import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Industry Solutions — E-commerce, Healthcare, Finance & SaaS',
  description:
    'Industry-specific DPDP compliance solutions for e-commerce, healthcare, financial services, SaaS, regulated enterprises, GCC, and consulting firms. Tailored DPDP Act 2023 compliance for your sector.',
  path: '/solutions',
  keywords: ['DPDP industry solutions', 'DPDP e-commerce compliance', 'DPDP healthcare compliance', 'DPDP financial services', 'DPDP SaaS compliance', 'industry DPDP compliance India'],
  ogTitle: 'DPDP Industry Solutions — Sector-specific Compliance',
  ogDescription: 'Industry-specific DPDP compliance solutions for e-commerce, healthcare, finance, SaaS, and more.',
})

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Industry Solutions', href: '/solutions' }]} />
      {children}
    </>
  )
}
