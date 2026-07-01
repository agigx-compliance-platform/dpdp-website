import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Consent Cockpit and dpdpconsultancy.in',
}

export default function PrivacyPolicyPage() {
  return (
    <SectionWrapper className="pt-32 md:pt-40 pb-20 max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
      <h1>Privacy Policy</h1>
      <p className="lead text-muted-foreground not-prose">
        Last updated: July 2026
      </p>
      <p>
        Consent Cockpit (operated by dpdpconsultancy, India) respects your
        privacy. This policy describes how we collect, use, and protect personal
        data when you visit our website, use our assessment tools, or contact
        us.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you submit via forms (name, email, company, message)</li>
        <li>Questionnaire and website scan inputs you provide voluntarily</li>
        <li>Standard technical logs (IP address, browser type, pages visited)</li>
      </ul>
      <h2>How we use information</h2>
      <p>
        We use your information to respond to enquiries, deliver compliance
        assessments and scan reports, improve our services, and meet legal
        obligations under applicable Indian data protection law.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy-related requests, email{' '}
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
