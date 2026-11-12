import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { EmbeddedPolicyView } from '@/components/consent/EmbeddedPolicyView'
import { fetchSdkPolicyHtml } from '@/lib/sdk-policy'

interface EmbeddedPolicyPageProps {
  title: string
  policyType: 'privacy_policy' | 'cookie_policy'
  containerId: string
  scriptId: string
}

export async function EmbeddedPolicyPage({
  title,
  policyType,
  containerId,
  scriptId,
}: EmbeddedPolicyPageProps) {
  const initialHtml = await fetchSdkPolicyHtml(policyType)
  return (
    <SectionWrapper className="pt-32 md:pt-40 pb-20 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">{title}</h1>
      <EmbeddedPolicyView
        policyType={policyType}
        containerId={containerId}
        scriptId={scriptId}
        initialHtml={initialHtml}
      />
      <p className="mt-8">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
    </SectionWrapper>
  )
}
