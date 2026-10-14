import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { CONSENT_MANAGEMENT_FAQS } from '@/lib/dpdp-faqs'

export default function ConsentManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DPDP Consultancy · dpdpconsultancy.in
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">Consent management for the DPDP Act</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Consent management is how Indian Data Fiduciaries collect, record,
            update, and prove purpose-specific consent under Section 6 of the
            Digital Personal Data Protection Act, 2023 — not a cookie banner
            copied from a European template.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-8">
        <article className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">What DPDP requires of consent</h2>
          <p>
            Section 6 requires consent that is free, specific, informed, and
            unambiguous, given for a stated purpose. The Data Principal must be
            able to withdraw it as easily as they gave it. Notices under Section
            5 have to describe personal data and purposes in a way a person can
            actually understand. Bundling unrelated purposes into a single
            “Accept all”, or hiding withdrawal three menus deep, is the pattern
            that fails these tests.
          </p>
          <p>
            DPDP does not give organisations a general “legitimate interest”
            path the way GDPR does for much of analytics and marketing. For most
            commercial processing,{' '}
            <Link href="/dpdp-compliance" className="text-foreground underline-offset-4 hover:underline">
              DPDP compliance
            </Link>{' '}
            therefore starts with notice and consent, then with proof that both
            still match what the site, app, and vendors actually do.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Consent, cookies, and notices are not the same control</h2>
          <p>
            Cookies are one collection method. Consent is the permission for a
            purpose. The notice is how you explain both. A cookie policy that
            lists “analytics” while the tag manager also fires advertising and
            session-replay scripts is a notice failure even if a banner exists.
            Consent management has to inventory storage and pixels, map them to
            purposes, and keep the notice in lockstep — which is why DPDP
            Consultancy pairs the consent platform with Privacy Pitstop rather
            than treating the CMP as self-sufficient.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Why a banner is not consent management</h2>
          <p>
            A banner can display a choice. Consent management is the lifecycle
            behind that choice: purpose registry, capture on web and app, sync
            to tags and SDKs, preference updates, withdrawal, and an audit trail
            that survives a grievance or a Board inquiry. If marketing pixels
            still fire after a Data Principal declined a purpose, you do not
            have consent management — you have a UI.
          </p>
          <p>
            DPDP Consultancy’s Consent Cockpit is built for that lifecycle.
            It deploys region-aware banners, discovers cookies and trackers,
            binds consent to a versioned notice, and keeps an append-only log of
            who agreed to which purpose, on which policy version, and when they
            withdrew. That is the evidence DSAR and grievance workflows need.
            See the{' '}
            <Link href="/products" className="text-foreground underline-offset-4 hover:underline">
              products overview
            </Link>{' '}
            for how it sits next to scanning and rights automation.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Purpose, children, and vendors</h2>
          <p>
            Granular purpose is not a preference — it is how Section 6(2) is
            written. Analytics, advertising, essential operations, and
            personalisation are different purposes. Consent management has to
            model those purposes, block downstream tags when consent is absent,
            and re-prompt when the notice or purpose set changes.
          </p>
          <p>
            Children’s data adds verifiable parental consent and tighter use
            limits. Processor and vendor chains add another failure mode:
            consent withdrawn on your site must propagate to parties who still
            hold the data. DPDP Consultancy maps processors to purposes so a
            withdrawal or rights request is not trapped in the first system that
            recorded it.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Proof you can produce</h2>
          <p>
            When a Data Principal or the Board asks “on what basis did you send
            this data to that vendor?”, the answer is a record, not a
            recollection. Effective consent management stores identity or a
            durable token, purposes, notice version, timestamp, channel (web,
            app, call centre), and later withdrawal. Without that trail,{' '}
            <Link href="/dpdp-platform" className="text-foreground underline-offset-4 hover:underline">
              platform
            </Link>{' '}
            scanning and DSAR modules cannot reconstruct a lawful story.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Failure modes we see on Indian sites</h2>
          <p>
            Privacy Pitstop scans repeatedly surface the same consent failures:
            non-essential cookies set before any choice, no genuine reject
            path, analytics and ads still firing after withdrawal, notices that
            do not list the vendors that actually load, and no record of which
            policy version the user saw. Each of those is a Section 5 or Section
            6 problem, not a design preference.
          </p>
          <p>
            Another pattern is a CMP configured for “EU / rest of world” that
            treats India as unregulated. Tags run freely, the banner is hidden,
            and the only India-facing artefact is an English privacy policy.
            DPDP does not work that way. If you offer goods or services to
            people in India, the India traffic needs the same purpose split,
            blocking, and proof as any other in-scope region — usually more
            strictly on consent, because other lawful bases are narrower.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Preference centres and the SDK</h2>
          <p>
            Giving consent once on a first visit is not enough. Data Principals
            must be able to reopen purposes, change a choice, and withdraw
            without calling a helpdesk. That is a preference centre wired to the
            same purpose IDs the banner uses. DPDP Consultancy’s SDK is a single
            script (or API) that reads those purposes and gates tags; marketing
            pixels should not have a parallel, ungoverned load path.
          </p>
          <p>
            When the notice text or purpose set changes, prior consent should
            not be silently stretched to the new processing. Version the notice,
            invalidate or re-prompt where the purpose actually changed, and keep
            both versions in the audit log. That is how you answer “what did this
            person agree to in March?” without reconstructing a CMS history.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">How DPDP Consultancy implements it</h2>
          <p>
            Implementation starts with what your properties already load. The
            free{' '}
            <Link href="/privacy-pitstop" className="text-foreground underline-offset-4 hover:underline">
              Privacy Pitstop
            </Link>{' '}
            scan shows cookies, trackers, and notice gaps on a public website.
            From there we define purposes against real processing, wire the
            consent SDK, version the notice, and connect withdrawal to tag
            blocking and vendor webhooks. Advisory covers notice wording and
            children’s data; the platform runs the capture and proof.
          </p>
          <p>
            Global CMPs that were configured for GDPR often leave DPDP notice
            content, purpose split, and Indian rights hooks unfinished. DPDP
            Consultancy implements consent management against the DPDP Act 2023
            and the November 2025 Rules, then keeps it aligned as tags and
            vendors change — which they will.
          </p>
          <GuideCtas />
        </article>
      </SectionWrapper>

      <FaqSection title="Consent management questions" faqs={CONSENT_MANAGEMENT_FAQS} />
      <RelatedGuides current="/consent-management" />
    </div>
  )
}
