import type { Metadata } from 'next'
import { EmbeddedPolicyPage } from '@/components/consent/EmbeddedPolicyPage'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for dpdpconsultancy.in',
}

export default function CookiePolicyPage() {
  return (
    <EmbeddedPolicyPage
      title="Cookie Policy"
      policyType="cookie_policy"
      containerId="agigx-cookie-policy"
      scriptId="agigx-cookie-policy-sdk-script"
    />
  )
}
