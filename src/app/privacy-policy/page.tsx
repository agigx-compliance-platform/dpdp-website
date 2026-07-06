import type { Metadata } from 'next'
import { EmbeddedPolicyPage } from '@/components/consent/EmbeddedPolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for dpdpconsultancy.in',
}

export default function PrivacyPolicyPage() {
  return (
    <EmbeddedPolicyPage
      title="Privacy Policy"
      policyType="privacy_policy"
      containerId="agigx-privacy-policy"
      scriptId="agigx-privacy-policy-sdk-script"
    />
  )
}
