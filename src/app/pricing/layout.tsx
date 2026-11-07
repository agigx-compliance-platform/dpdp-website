import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'
import { PRICING_FAQS } from './pricing-faqs'

export const metadata: Metadata = pageSeo({
  title: 'Pricing: DPDP Compliance Software and Services',
  description:
    'How DPDP Consultancy pricing works: what you can buy, what affects the price, and how to get a quote. The website scan and readiness assessment are free.',
  path: '/pricing',
  keywords: ['DPDP compliance pricing', 'DPDP software cost', 'DPDP consultancy pricing', 'consent management pricing India'],
  ogTitle: 'Pricing: DPDP Compliance Software and Services',
  ogDescription: 'What you can buy, what affects the price, and how to get a quote from DPDP Consultancy.',
})

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Pricing', href: '/pricing' }]} />
      <FaqJsonLd faqs={PRICING_FAQS} />
      {children}
    </>
  )
}
