import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { FaqSection } from '@/components/seo/FaqSection'
import { WHAT_IS_DPDP_FAQS } from '@/lib/dpdp-faqs'

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
            DPDP is India&apos;s Digital Personal Data Protection Act, 2023.
            DPDP Consultancy (dpdpconsultancy) helps organisations turn that law
            into working consent, rights, and security controls.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-8">
        <article className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">DPDP full form and meaning</h2>
          <p>
            DPDP stands for Digital Personal Data Protection. The statute is the
            Digital Personal Data Protection Act, 2023 (also called DPDPA). It
            governs how Data Fiduciaries collect, use, store, share, and erase
            digital personal data of Data Principals in India. The DPDP Rules
            were notified in November 2025, with phased enforcement.
          </p>
          <p>
            Unlike a privacy policy alone, DPDP requires operational controls:
            notices, valid consent, Data Principal rights, reasonable security
            safeguards, vendor oversight, and — for Significant Data Fiduciaries —
            a Data Protection Officer, DPIAs, and annual audits.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Penalties under the DPDP Act</h2>
          <p>
            Non-compliance can attract penalties up to ₹250 Crore per violation
            for failing reasonable security safeguards, with separate caps for
            consent, children&apos;s data, and Data Principal obligation breaches.
            DPDP Consultancy maps exposure against the actual obligation domains
            rather than a generic checklist.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">How DPDP Consultancy helps</h2>
          <p>
            DPDP Consultancy, at dpdpconsultancy.in, combines advisory and
            software: a free Privacy Pitstop website scan, a 10-question readiness
            assessment, consent management, DSAR automation, AI governance, and
            managed privacy operations for Indian enterprises.
          </p>
          <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
            <Link href="/privacy-pitstop">
              <Button variant="primary">Scan a website free</Button>
            </Link>
            <Link href="/questionnaire">
              <Button variant="outline">Take the DPDP assessment</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Talk to DPDP Consultancy</Button>
            </Link>
          </div>
        </article>
      </SectionWrapper>

      <FaqSection title="DPDP questions answered by DPDP Consultancy" faqs={WHAT_IS_DPDP_FAQS} />
    </div>
  )
}
