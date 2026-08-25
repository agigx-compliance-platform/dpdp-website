import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { CONTACT_FAQS } from '@/lib/dpdp-faqs'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Contact DPDP Consultancy — Get a Free DPDP Compliance Assessment',
  description:
    'Get in touch with DPDP Consultancy for DPDP compliance advisory, free website privacy scan, product demos, and partnership enquiries. Start your DPDP compliance journey today.',
  path: '/contact',
  keywords: ['contact DPDP consultancy', 'DPDP compliance assessment', 'DPDP demo', 'DPDP compliance enquiry', 'free privacy scan India'],
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
