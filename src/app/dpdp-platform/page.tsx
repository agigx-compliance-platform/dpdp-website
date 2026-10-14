import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { DPDP_PLATFORM_FAQS } from '@/lib/dpdp-faqs'

export default function DpdpPlatformPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DPDP Consultancy · dpdpconsultancy.in
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">DPDP compliance platform</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            The DPDP Consultancy platform is software for running Digital
            Personal Data Protection Act duties every day — consent, scanning,
            Data Principal rights, vendors, and evidence — not a slide deck
            delivered at the end of a workshop.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-8">
        <article className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">What a DPDP platform is for</h2>
          <p>
            Indian Data Fiduciaries do not fail{' '}
            <Link href="/what-is-dpdp" className="text-foreground underline-offset-4 hover:underline">
              the DPDP Act
            </Link>{' '}
            because they lack a policy. They fail because consent, trackers,
            rights tickets, and processors live in different tools that do not
            agree. A DPDP compliance platform is the system of record for those
            controls: it captures purpose-level consent, shows what a public
            site actually loads, runs access and erasure workflows, and keeps
            the audit trail a DPO or the Data Protection Board can inspect.
          </p>
          <p>
            DPDP Consultancy built this platform for the DPDP Act 2023 and the
            November 2025 Rules. It is not a GDPR suite with an India flag
            turned on. Terminology, notice, children’s data, grievance SLAs, and
            penalty-oriented scoring follow Indian law.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Platform modules</h2>
          <p>
            <strong className="text-foreground">Consent Cockpit</strong> runs
            Section 6 end to end: banners, purpose engine, withdrawal, cookie
            discovery, and an immutable consent log. That is the{' '}
            <Link href="/consent-management" className="text-foreground underline-offset-4 hover:underline">
              consent management
            </Link>{' '}
            layer other modules depend on.
          </p>
          <p>
            <strong className="text-foreground">TrustScope and Privacy Pitstop</strong>{' '}
            scan public digital properties for cookies, undisclosed trackers,
            notice gaps, and DSAR discoverability. Privacy Pitstop is the free
            public scan; TrustScope is the deeper scored scan used in
            assessments. Both answer a question policy reviews cannot: what does
            this website do in a real browser?
          </p>
          <p>
            <strong className="text-foreground">DSAR management</strong> automates
            access, correction, and erasure under Sections 11–13, with
            multi-channel intake, grievance-officer publication, and SLA
            tracking. <strong className="text-foreground">Processor governance</strong>{' '}
            registers vendors, maps them to purposes, and pushes consent and
            rights actions downstream. Infrastructure and code scanning looks
            for PII exposure and privacy misconfigurations in cloud and
            repositories.
          </p>
          <p>
            <strong className="text-foreground">AI compliance assistant</strong>{' '}
            and the adaptive engine sit on top: guidance grounded in the Act and
            Rules, scored audits across obligation domains, and change detection
            when the legal baseline moves. Full module detail is on the{' '}
            <Link href="/products" className="text-foreground underline-offset-4 hover:underline">
              products
            </Link>{' '}
            page.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">How the modules connect</h2>
          <p>
            Isolated tools create gaps. A consent event that never reaches the
            tag manager, a DSAR that never reaches a processor, or a scan that
            never updates the purpose list will all look “green” in their own
            dashboard. On the DPDP Consultancy platform, purposes are shared:
            consent changes gate tags, fan out to registered processors, and
            sit on the same record a rights workflow reads when someone asks
            what you hold and why.
          </p>
          <p>
            Scans feed the same picture. If Privacy Pitstop or TrustScope finds
            a tracker with no matching purpose or notice, that is a control
            defect, not a one-off website bug. Infrastructure findings (open
            buckets, PII in logs) belong in the same governance view as cookie
            issues so the DPO is not running three programmes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Platform plus advisory</h2>
          <p>
            Software does not replace a gap assessment. DPDP Consultancy still
            maps which{' '}
            <Link href="/dpdp-compliance" className="text-foreground underline-offset-4 hover:underline">
              DPDP compliance
            </Link>{' '}
            domains apply, writes notices that match processing, and designs SDF
            duties where they apply. The platform is where those designs run
            after the workshop: consent events, scan history, rights tickets,
            vendor delivery status. Organisations that only buy advisory stall
            at the roadmap. Organisations that only buy a banner stall at the
            first vendor they cannot prove.
          </p>
          <p>
            Managed{' '}
            <Link href="/services" className="text-foreground underline-offset-4 hover:underline">
              services
            </Link>{' '}
            are available when you want DPDP Consultancy to operate scans,
            consent changes, and rights SLAs rather than staffing a full privacy
            ops team on day one.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Buying one platform versus four tools</h2>
          <p>
            Teams often already have a CMP, a GRC sheet, a helpdesk, and a
            one-time pentest. None of those is a DPDP platform unless they share
            purposes, identifiers, and evidence. Integrating them is possible;
            it is also how programmes stall. DPDP Consultancy’s stack is opinionated
            so a mid-size fiduciary can go live on consent, scanning, and DSAR
            without a six-month integration project. You can still keep SIEM,
            IAM, and existing security tools — the platform does not replace
            those.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">A typical implementation sequence</h2>
          <p>
            Connect the public properties, run a scan, lock the purpose list,
            ship the consent SDK, then turn on DSAR intake. Vendor webhooks and
            infrastructure scanning follow once the first-party controls are
            stable. That order avoids automating rights requests against a
            consent graph that does not exist yet. DPDP Consultancy advisory
            stays in the loop for notice text, children’s data, and SDF extras;
            the platform tickets are the delivery mechanism.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Who it is for</h2>
          <p>
            DPOs, privacy leads, CISOs, and counsel at companies that collect
            data through websites, apps, or processors. Mid-size Indian firms
            typically start with consent, Pitstop/TrustScope, and DSAR.
            Significant Data Fiduciaries add DPO workflows, DPIA support, and
            audit evidence. Foreign companies offering services into India use
            the same stack so India-facing properties are not an afterthought on
            a global CMP.
          </p>
          <p>
            Start with a free{' '}
            <Link href="/privacy-pitstop" className="text-foreground underline-offset-4 hover:underline">
              Privacy Pitstop
            </Link>{' '}
            scan or the{' '}
            <Link href="/questionnaire" className="text-foreground underline-offset-4 hover:underline">
              readiness assessment
            </Link>
            . That gives a factual picture of the public surface and a short
            list of modules to implement, instead of a generic platform tour.
          </p>
          <GuideCtas />
        </article>
      </SectionWrapper>

      <FaqSection title="DPDP platform questions" faqs={DPDP_PLATFORM_FAQS} />
      <RelatedGuides current="/dpdp-platform" />
    </div>
  )
}
