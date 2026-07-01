import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for Consent Cockpit marketing website',
}

export default function CookiePolicyPage() {
  return (
    <SectionWrapper className="pt-32 md:pt-40 pb-20 max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
      <h1>Cookie Policy</h1>
      <p className="lead text-muted-foreground not-prose">
        Last updated: July 2026
      </p>
      <p>
        This marketing website may use essential cookies and local storage to
        remember your theme preference and questionnaire progress. We do not
        use third-party advertising cookies on this site.
      </p>
      <h2>Essential storage</h2>
      <ul>
        <li>
          <strong>Theme preference</strong> — stored in localStorage to apply
          light or dark mode
        </li>
        <li>
          <strong>Questionnaire state</strong> — stored locally while you
          complete an assessment
        </li>
      </ul>
      <h2>Managing cookies</h2>
      <p>
        You can clear site data through your browser settings. Our Consent
        Cockpit product provides full cookie consent management for your own
        properties.
      </p>
      <h2>Contact</h2>
      <p>
        <a href="mailto:operations@dpdpconsultancy.in">operations@dpdpconsultancy.in</a>
      </p>
      <p className="not-prose mt-8">
        <Link href="/" className="text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
    </SectionWrapper>
  )
}
