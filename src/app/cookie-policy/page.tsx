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
        This marketing website uses Consent Cockpit to manage cookie preferences.
        We only load non-essential cookies and analytics after you provide consent.
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
        <li>
          <strong>Consent preferences</strong> — stored by Consent Cockpit to
          remember your cookie choices
        </li>
      </ul>
      <h2>Analytics cookies</h2>
      <p>
        If you accept the <strong>Analytics</strong> category in our consent
        banner, we load Google Analytics (GA4) to understand how visitors use
        this site and measure our digital campaigns. Google Analytics is not
        loaded before you consent.
      </p>
      <h2>Managing cookies</h2>
      <p>
        Use the consent banner or preference centre on this site to change your
        choices at any time. You can also clear site data through your browser
        settings.
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
