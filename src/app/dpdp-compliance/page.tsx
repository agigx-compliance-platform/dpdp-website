import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { PenaltyTable } from '@/components/legal/PenaltyTable'
import { APPLICABILITY_EXCLUSIONS, APPLICABILITY_SUMMARY, SDF_SUMMARY } from '@/lib/dpdp-facts'
import { DPDP_COMPLIANCE_FAQS } from '@/lib/dpdp-faqs'
import { DPDP_TIMELINE, formatMilestoneDate } from '@/lib/dpdp-timeline'

export default function DpdpCompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DPDP Consultancy · dpdpconsultancy.in
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">DPDP compliance for Indian organisations</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            DPDP compliance is more than rewriting a privacy policy. It means
            handling people&apos;s personal details the way the Digital Personal Data
            Protection Act, 2023 requires, and being able to show that you do.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-8">
        <article className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">What DPDP compliance actually means</h2>
          <p>
            Under the{' '}
            <Link href="/what-is-dpdp" className="text-foreground underline-offset-4 hover:underline">
              DPDP Act
            </Link>
            , your organisation is accountable for how personal details are
            collected, used, stored, shared, and deleted. Compliance means you can
            show clear notices, consent for each specific purpose, people&apos;s requests
            handled properly, reasonable security, and control over vendors. A PDF
            checklist in a shared drive does not show that.
          </p>
          <p>
            We treat DPDP compliance as ongoing work: advice to work out what
            applies, software to run consent and requests, and scans to see what
            your public website actually does. That takes you from “we know about
            the Act” to “we can show we follow it”.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Who needs DPDP compliance</h2>
          <p>{APPLICABILITY_SUMMARY}</p>
          <p>{APPLICABILITY_EXCLUSIONS}</p>
          <p>{SDF_SUMMARY}</p>

          <h2 className="text-2xl font-semibold text-foreground">The six areas to cover</h2>
          <p>
            We organise the work around what the DPDP Act asks for, rather than a
            general privacy framework from another country.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Consent and notice</strong>:
              purpose-specific consent, withdrawal that is as easy as giving
              consent, and notices that state what you collect and why. See{' '}
              <Link href="/consent-management" className="text-foreground underline-offset-4 hover:underline">
                consent management
              </Link>
              .
            </li>
            <li>
              <strong className="text-foreground">People&apos;s rights</strong>: seeing,
              correcting, and deleting their data, and a clear way to raise a
              complaint, with contact details you publish.
            </li>
            <li>
              <strong className="text-foreground">Keeping data only as long as needed</strong>:
              collect only what the specified purpose needs, and delete it when
              that purpose ends.
            </li>
            <li>
              <strong className="text-foreground">Security and breach</strong>:
              reasonable safeguards, and being able to spot a breach and tell the
              people affected and the regulator.
            </li>
            <li>
              <strong className="text-foreground">Vendors</strong>: contracts, knowing who
              receives what, and telling them when consent changes or someone makes
              a request.
            </li>
            <li>
              <strong className="text-foreground">Governance</strong>: policies,
              training, extra duties where they apply, and evidence you can give the
              regulator.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground">Penalties</h2>
          <PenaltyTable />

          <h2 className="text-2xl font-semibold text-foreground">A practical DPDP compliance path</h2>
          <p>
            Most projects follow the same order. First, work out what applies and
            where the gaps are: what you collect, which vendors receive it, and what
            your website says compared with what it does. Our free{' '}
            <Link href="/privacy-pitstop" className="text-foreground underline-offset-4 hover:underline">
              Privacy Pitstop
            </Link>{' '}
            scan and{' '}
            <Link href="/questionnaire" className="text-foreground underline-offset-4 hover:underline">
              10-question assessment
            </Link>{' '}
            are built for that first pass.
          </p>
          <p>
            Second, design your notices, consent, and request handling for the Act
            and the 2025 Rules, rather than from a GDPR template. Third, put the tools
            in place for consent, people&apos;s requests, and website checks, using the{' '}
            <Link href="/dpdp-platform" className="text-foreground underline-offset-4 hover:underline">
              DPDP compliance platform
            </Link>
            . Fourth, keep it running: check your website, act on withdrawals, answer
            requests, and update vendor lists when things change.
          </p>
          <p>
            Advice without tools leaves you with a plan you cannot carry out. Tools
            without advice leave you with banners that do not match what you do. We
            provide both, including{' '}
            <Link href="/services" className="text-foreground underline-offset-4 hover:underline">
              DPDP services
            </Link>{' '}
            for organisations that want us to run the daily work.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">When it starts</h2>
          <ul className="list-disc space-y-2 pl-5">
            {DPDP_TIMELINE.map((m) => (
              <li key={m.date}>
                <strong className="text-foreground">{formatMilestoneDate(m)}</strong>: {m.summary}
              </li>
            ))}
          </ul>
          <p>
            Banners, data lists, request handling, and vendor contracts are slow to
            change, so it is worth starting well before the main date.
          </p>
          <p>
            If you already follow GDPR, your data maps, vendor lists, and security
            work are a useful start. They are not DPDP compliance on their own. The
            legal grounds for using data, children’s data, notices, and the
            regulator&apos;s process are all different.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">What “good” evidence looks like</h2>
          <p>
            When your lawyer or privacy lead asks whether you comply, a useful answer
            is a set of records: current notices, consent records, website scan
            results, people&apos;s requests with dates, a vendor list, and a summary of your
            security measures. Our platform keeps these so nobody has to rebuild them
            from email.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">How to start</h2>
          <p>
            Scan your website, answer the readiness questions, then talk to us about
            what applies to you.
          </p>
          <GuideCtas />
        </article>
      </SectionWrapper>

      <FaqSection title="DPDP compliance questions" faqs={DPDP_COMPLIANCE_FAQS} />
      <RelatedGuides current="/dpdp-compliance" />
    </div>
  )
}
