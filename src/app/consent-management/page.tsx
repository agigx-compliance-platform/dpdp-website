import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { ProductLanding } from '@/components/products/ProductLanding'
import { ConnectorCanvas } from '@/components/workflow'
import { CONSENT_MANAGEMENT_FAQS } from '@/lib/dpdp-faqs'
import {
  consentCenter,
  consentEdges,
  consentLifecycleCenter,
  consentLifecycleEdges,
  consentLifecycleNodes,
  consentNodes,
  discoveryCenter,
  discoveryEdges,
  discoveryNodes,
  lineageCenter,
  lineageEdges,
  lineageNodes,
} from '@/lib/workflows'

export default function ConsentManagementPage() {
  return (
    <ProductLanding
      current="/consent-management"
      eyebrow="Platform"
      title="Consent lifecycle for the DPDP Act"
      lead="Notice, purpose grant, withdrawal, and a sealed receipt. The cookie banner is one place that duty shows up. The record is what the Board can ask for."
      nodes={consentNodes}
      edges={consentEdges}
      center={consentCenter}
      capabilities={[
        {
          title: 'Purpose grant',
          body: 'Each purpose is asked separately. Marketing is not bundled into onboarding. Withdrawal uses the same purpose IDs.',
        },
        {
          title: 'Notice bound to the grant',
          body: 'The version the person saw is stored with the choice. A later rewrite of the notice does not silently stretch old consent.',
        },
        {
          title: 'Sealed receipt',
          body: 'Who was asked, what they chose, which notice, and when they withdrew. Append-only. Withdrawal invalidates that version.',
        },
        {
          title: 'Downstream signal',
          body: 'Vendors mapped to a purpose stop using it when the grant is withdrawn. A banner-only change that never reaches processors is not a complete control.',
        },
        {
          title: 'Preference centre',
          body: 'The Data Principal reopens the same purposes later. No helpdesk required to withdraw.',
        },
        {
          title: 'SDK and tags',
          body: 'One script or API reads those purposes and gates tags. Marketing pixels should not have a parallel, ungoverned load path.',
        },
        {
          title: 'Languages from one table',
          body: 'Banner, purpose notice, DSAR, and grievance copy share the same locales. English and Hindi ship today. Further languages can be added without a new product per workflow.',
        },
        {
          title: 'Cockpit as the activity ledger',
          body: 'The Data Principal sees grants, withdrawals, access requests, and grievances in one place. Operators see the same events, not a scatter of inboxes.',
        },
      ]}
      notes={[
        {
          title: 'Notice and consent',
          body: 'Section 5 and Section 6 require a clear notice of purposes and consent that is free, specific, informed, and unambiguous. A European legitimate-interest default does not carry over.',
        },
        {
          title: 'Withdrawal',
          body: 'A grant that cannot be withdrawn as easily as it was given is not a complete control.',
        },
      ]}
      faqs={CONSENT_MANAGEMENT_FAQS}
      nextHref="/cookie-consent"
      nextLabel="cookie consent banners"
    >
      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-foreground">Two working solutions</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Consent is one closed loop. Discovery and lineage are the second: they show where the
          personal data actually sits so a withdrawal or a rights request is not a guess.
        </p>
      </SectionWrapper>

      <SectionWrapper>
        <h3 className="text-xl font-semibold text-foreground">1. Give, see, withdraw, notify</h3>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The person grants a purpose, opens the same record in the cockpit, withdraws it, and the
          fiduciary plus mapped processors are told to stop. A banner change that never reaches a
          vendor is not this loop.
        </p>
        <div className="mt-8">
          <ConnectorCanvas
            variant="canvas"
            nodes={consentLifecycleNodes}
            edges={consentLifecycleEdges}
            center={consentLifecycleCenter}
            minHeight={520}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h3 className="text-xl font-semibold text-foreground">2. Discover, then follow lineage</h3>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Finding the stores and naming the fields is what makes the consent signal useful. Lineage
          is how a withdrawal follows a table into a warehouse or a vendor export.{' '}
          <Link href="/data-discovery" className="text-foreground underline-offset-4 hover:underline">
            Data discovery
          </Link>{' '}
          and{' '}
          <Link href="/data-lineage" className="text-foreground underline-offset-4 hover:underline">
            data lineage
          </Link>{' '}
          are that path.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ConnectorCanvas
            variant="canvas"
            nodes={discoveryNodes}
            edges={discoveryEdges}
            center={discoveryCenter}
            minHeight={420}
          />
          <ConnectorCanvas
            variant="canvas"
            nodes={lineageNodes}
            edges={lineageEdges}
            center={lineageCenter}
            minHeight={420}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper>
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
            purposes, and keep the notice in lockstep, which is why DPDP
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
            have consent management. You have a UI.
          </p>
          <p>
            DPDP Consultancy’s Consent Cockpit is built for that lifecycle.
            It deploys region-aware banners, discovers cookies and trackers,
            binds consent to a versioned notice, and keeps an append-only log of
            who agreed to which purpose, on which policy version, and when they
            withdrew. That is the evidence DSAR and grievance workflows need.
          </p>
        </article>
      </SectionWrapper>
    </ProductLanding>
  )
}
