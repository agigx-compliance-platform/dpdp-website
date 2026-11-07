import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { CONTACT_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Contact DPDP Consultancy: Book a Demo or Ask About Pricing',
  description:
    'Contact DPDP Consultancy (dpdpconsultancy.in) to book a demo, ask about pricing, get DPDP advice, or discuss a partnership.',
  path: '/contact',
  keywords: ['contact DPDP Consultancy', 'dpdpconsultancy', 'DPDP compliance assessment', 'DPDP demo', 'free privacy scan India'],
  ogDescription: 'Get in touch for DPDP compliance advisory, free privacy scans, product demos, and partnership enquiries.',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Contact DPDP Consultancy', href: '/contact' }]} />
      <FaqJsonLd faqs={CONTACT_FAQS} />
      {children}
    </>
  )
}
