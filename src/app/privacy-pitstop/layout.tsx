import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Privacy Pitstop — Free Website Privacy Policy Analyzer',
  description:
    'Analyze any website\'s privacy policy in 10 seconds — free, no signup required. Powered by DPDP Consultancy. Check DPDP compliance, data collection practices, and privacy risks instantly.',
  path: '/privacy-pitstop',
  keywords: ['privacy policy analyzer', 'website privacy scan', 'free privacy scan', 'DPDP compliance check', 'privacy policy checker India', 'website data collection analyzer'],
  ogDescription: 'Analyze any website\'s privacy policy in 10 seconds — free, no signup. Check DPDP compliance instantly.',
})

export default function PrivacyPitstopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Privacy Pitstop', href: '/privacy-pitstop' }]} />
      {children}
    </>
  )
}
