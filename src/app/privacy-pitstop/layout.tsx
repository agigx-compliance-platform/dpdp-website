import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Privacy Pitstop by DPDP Consultancy — Free Website Privacy Scan',
  description:
    'Privacy Pitstop by DPDP Consultancy: free website privacy scan for DPDP compliance, cookies, and data collection risks.',
  path: '/privacy-pitstop',
  keywords: ['Privacy Pitstop', 'DPDP Consultancy', 'dpdpconsultancy', 'free privacy scan', 'DPDP compliance check', 'privacy policy checker India'],
  ogDescription: 'Analyze any website\'s privacy policy in 10 seconds — free, no signup. Check DPDP compliance instantly.',
})

export default function PrivacyPitstopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Privacy Pitstop by DPDP Consultancy', href: '/privacy-pitstop' }]} />
      {children}
    </>
  )
}
