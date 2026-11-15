import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Privacy Exposed by DPDP Consultancy: Free Website Privacy Scan',
  description:
    'Privacy Exposed by DPDP Consultancy: free website privacy scan for DPDP compliance, cookies, and data collection risks.',
  path: '/privacy-exposed',
  keywords: ['Privacy Exposed', 'DPDP Consultancy', 'dpdpconsultancy', 'free privacy scan', 'DPDP compliance check', 'privacy policy checker India'],
  ogDescription: 'Analyze any website\'s privacy policy in 10 seconds: free, no signup. Check DPDP compliance instantly.',
})

export default function PrivacyPitstopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Privacy Exposed by DPDP Consultancy', href: '/privacy-exposed' }]} />
      {children}
    </>
  )
}
