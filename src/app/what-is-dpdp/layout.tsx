import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { WHAT_IS_DPDP_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'What is DPDP? Explained by DPDP Consultancy',
  description:
    'What is DPDP? DPDP Consultancy (dpdpconsultancy.in) explains the Digital Personal Data Protection Act 2023, penalties, and how Indian organisations comply.',
  path: '/what-is-dpdp',
  keywords: [
    'what is DPDP',
    'DPDP Consultancy',
    'dpdpconsultancy',
    'DPDP Act 2023',
    'DPDP full form',
    'Digital Personal Data Protection Act',
    'DPDP compliance India',
  ],
})

export default function WhatIsDpdpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'What is DPDP?', href: '/what-is-dpdp' }]} />
      <FaqJsonLd faqs={WHAT_IS_DPDP_FAQS} />
      {children}
    </>
  )
}
