import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Consent Cockpit and dpdpconsultancy.in',
}

export default function TermsPage() {
  return (
    <SectionWrapper className="pt-32 md:pt-40 pb-20 max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
      <h1>Terms of Service</h1>
      <p className="lead text-muted-foreground not-prose">
        Last updated: July 2026
      </p>
      <p>
        By accessing this website or using Consent Cockpit assessment and
        scanning tools, you agree to these terms. If you do not agree, please
        do not use our services.
      </p>
      <h2>Use of the website</h2>
      <p>
        Content is provided for general information about DPDP compliance
        services and products. It does not constitute legal advice. Engagements
        are governed by separate commercial agreements.
      </p>
      <h2>Assessments and scans</h2>
      <p>
        Free website scans and questionnaires produce indicative results. You
        must have authority to submit domains and business information on
        behalf of your organisation.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms:{' '}
        <a href="mailto:operations@dpdpconsultancy.in">operations@dpdpconsultancy.in</a>.
      </p>
      <p className="not-prose mt-8">
        <Link href="/" className="text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
    </SectionWrapper>
  )
}
