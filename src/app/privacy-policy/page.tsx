import type { Metadata } from 'next'
import { EmbeddedPolicyPage } from '@/components/consent/EmbeddedPolicyPage'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Privacy Policy — DPDP Consultancy',
  description:
    'Privacy policy for DPDP Consultancy and dpdpconsultancy.in. How we collect, use, and protect personal data under the Digital Personal Data Protection Act 2023.',
  path: '/privacy-policy',
  keywords: ['DPDP Consultancy privacy policy', 'DPDP privacy policy'],
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Privacy Policy', href: '/privacy-policy' }]} />
      <EmbeddedPolicyPage
        title="Privacy Policy"
        policyType="privacy_policy"
        containerId="agigx-privacy-policy"
        scriptId="agigx-privacy-policy-sdk-script"
      />
    </>
  )
}
