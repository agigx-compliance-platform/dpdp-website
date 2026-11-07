import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { PenaltyTable } from '@/components/legal/PenaltyTable'
import { APPLICABILITY_EXCLUSIONS, APPLICABILITY_SUMMARY, BREACH_DUTIES, SDF_SUMMARY } from '@/lib/dpdp-facts'
import { WHAT_IS_DPDP_FAQS } from '@/lib/dpdp-faqs'
import { DPDP_TIMELINE, formatMilestoneDate, getMainDutiesMilestone } from '@/lib/dpdp-timeline'

const mainDutiesDate = formatMilestoneDate(getMainDutiesMilestone())

export default function WhatIsDpdpPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DPDP Consultancy · dpdpconsultancy.in
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">What is DPDP?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            DPDP is India&apos;s Digital Personal Data Protection Act, 2023. It sets
            rules for how organisations collect, use, and delete people&apos;s digital
            personal details.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-8">
        <article className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">DPDP full form and meaning</h2>
          <p>
            DPDP stands for Digital Personal Data Protection. The law is the
            Digital Personal Data Protection Act, 2023, also called DPDPA. The law
            calls an organisation that decides how personal data is used a Data
            Fiduciary. It calls the person the data is about a Data Principal.
          </p>
          <p>
            A privacy policy alone is not enough. You need clear notices, valid
            consent, a way to handle people&apos;s requests, reasonable security, and
            control over vendors.
          </p>
          <p>{SDF_SUMMARY}</p>

          <h2 className="text-2xl font-semibold text-foreground">Who it applies to</h2>
          <p>{APPLICABILITY_SUMMARY}</p>
          <p>{APPLICABILITY_EXCLUSIONS}</p>

          <h2 className="text-2xl font-semibold text-foreground">When it starts</h2>
          <p>
            In stages. The main duties for businesses start on {mainDutiesDate}.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {DPDP_TIMELINE.map((m) => (
              <li key={m.date}>
                <strong className="text-foreground">{formatMilestoneDate(m)}</strong>: {m.summary}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold text-foreground">Penalties under the DPDP Act</h2>
          <PenaltyTable />

          <h2 className="text-2xl font-semibold text-foreground">What to do after a data breach</h2>
          <ul className="list-disc space-y-2 pl-5">
            {BREACH_DUTIES.map((duty) => (
              <li key={`${duty.when}-${duty.who}`}>
                <strong className="text-foreground">{duty.when}, tell: {duty.who}.</strong> {duty.what}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold text-foreground">How DPDP Consultancy helps</h2>
          <p>
            We combine advice and software: a free website scan, a 10-question
            readiness assessment, consent management, tools for handling people&apos;s
            data requests, AI governance, and managed privacy services. See the
            guides on{' '}
            <Link href="/dpdp-compliance" className="text-foreground underline-offset-4 hover:underline">
              DPDP compliance
            </Link>
            ,{' '}
            <Link href="/consent-management" className="text-foreground underline-offset-4 hover:underline">
              consent management
            </Link>
            , and the{' '}
            <Link href="/dpdp-platform" className="text-foreground underline-offset-4 hover:underline">
              DPDP platform
            </Link>{' '}
            for how those pieces fit together.
          </p>
          <GuideCtas />
        </article>
      </SectionWrapper>

      <FaqSection title="DPDP questions answered by DPDP Consultancy" faqs={WHAT_IS_DPDP_FAQS} />
      <RelatedGuides current="/what-is-dpdp" />
    </div>
  )
}
