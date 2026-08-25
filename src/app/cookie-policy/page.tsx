import type { Metadata } from 'next'
import { EmbeddedPolicyPage } from '@/components/consent/EmbeddedPolicyPage'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Cookie Policy — DPDP Consultancy',
  description:
    'Cookie policy for DPDP Consultancy and dpdpconsultancy.in. How we use cookies and similar technologies under DPDP Act 2023.',
  path: '/cookie-policy',
  keywords: ['DPDP Consultancy cookie policy', 'DPDP cookie policy'],
})

export default function CookiePolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Cookie Policy', href: '/cookie-policy' }]} />
      <EmbeddedPolicyPage
        title="Cookie Policy"
        policyType="cookie_policy"
        containerId="agigx-cookie-policy"
        scriptId="agigx-cookie-policy-sdk-script"
      />
    </>
  )
}
