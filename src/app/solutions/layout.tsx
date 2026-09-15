import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'DPDP Consultancy Industry Solutions — E-commerce, Healthcare & Finance',
  description:
    'DPDP Consultancy industry solutions for e-commerce, healthcare, finance, SaaS, and regulated Indian enterprises.',
  path: '/solutions',
  keywords: ['DPDP Consultancy solutions', 'dpdpconsultancy', 'DPDP e-commerce compliance', 'DPDP healthcare compliance', 'DPDP financial services', 'DPDP SaaS compliance'],
  ogTitle: 'DPDP Consultancy Industry Solutions',
  ogDescription: 'DPDP Consultancy sector solutions for e-commerce, healthcare, finance, SaaS, and more.',
})

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'DPDP Consultancy Industry Solutions', href: '/solutions' }]} />
      {children}
    </>
  )
}
