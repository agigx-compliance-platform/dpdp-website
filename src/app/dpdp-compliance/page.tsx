import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { DPDP_COMPLIANCE_FAQS } from '@/lib/dpdp-faqs'

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
            DPDP compliance is not a privacy policy rewrite. It is the set of
            controls a Data Fiduciary must run so digital personal data of people
            in India is processed lawfully under the Digital Personal Data
            Protection Act, 2023.
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
            , a Data Fiduciary is accountable for how personal data is collected,
            used, stored, shared, and erased. Compliance means you can show
            notices that match processing, consent that is specific to purpose,
            Data Principal rights that complete on time, reasonable security
            safeguards, and oversight of processors. The Data Protection Board
            of India can call for that evidence. A PDF checklist stored in a
            shared drive is not the same thing.
          </p>
          <p>
            DPDP Consultancy (dpdpconsultancy.in) treats DPDP compliance as an
            operating model: advisory to map obligations, software to run
            consent and rights, and scans to see what your public website
            actually does. That is how Indian enterprises move from “we are
            aware of the Act” to “we can demonstrate it”.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">Who needs DPDP compliance</h2>
          <p>
            If you process digital personal data of individuals in India, you
            are in scope, whether you are incorporated here or you offer goods
            or services into India from abroad. Employers, hospitals, banks,
            marketplaces, SaaS products, and any site that drops analytics or
            advertising cookies typically have DPDP duties. Limited exemptions
            exist for specified research, legal, and state functions; most
            commercial processing does not qualify.
          </p>
          <p>
            Significant Data Fiduciaries, once designated, add a Data Protection
            Officer, Data Protection Impact Assessments, annual audits, and
            algorithmic accountability. Even organisations that are not SDFs
            still need consent, notice, rights, security, and vendor controls.
            The difference is intensity, not whether the Act applies.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">The six obligation domains</h2>
          <p>
            DPDP Consultancy organises DPDP compliance around the duties that
            create penalty exposure, not around a generic privacy framework
            imported from the EU.
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
              <strong className="text-foreground">Data Principal rights</strong>:
              access, correction, erasure, and grievance handling within the
              Act’s timelines, with a published grievance officer.
            </li>
            <li>
              <strong className="text-foreground">Minimisation and retention</strong>:
              collect only what the specified purpose needs, and delete it when
              that purpose ends.
            </li>
            <li>
              <strong className="text-foreground">Security and breach</strong>:
              reasonable safeguards, and the ability to detect and report a
              personal data breach as required.
            </li>
            <li>
              <strong className="text-foreground">Vendors and processors</strong>:
              contracts, purpose mapping, and downstream action when consent
              changes or a rights request arrives.
            </li>
            <li>
              <strong className="text-foreground">Governance</strong>: policies,
              training, SDF duties where they apply, and evidence you can hand
              to the Board.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground">Penalties and why “later” is expensive</h2>
          <p>
            The Act sets penalty ceilings up to ₹250 Crore for failing reasonable
            security safeguards, with separate caps for consent and notice
            failures, children’s data, and Data Principal obligation breaches.
            Those figures are ceilings, not a tariff, but they are why boards
            now ask for an operational DPDP programme rather than a policy
            refresh. Remediation of consent, trackers, and rights workflows
            typically takes months, which is why waiting for a notice from the
            Board is the slowest path.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">A practical DPDP compliance path</h2>
          <p>
            Programmes that finish share a sequence. First, establish
            applicability and a gap picture: what you collect, which vendors
            touch it, and what your website discloses versus what it loads.
            DPDP Consultancy’s free{' '}
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
            Second, design notices, consent purposes, and rights SLAs against
            the Act and the 2025 Rules, not against a GDPR template. Third,
            implement technical controls: a consent platform, DSAR automation,
            and scanner coverage, which live on the{' '}
            <Link href="/dpdp-platform" className="text-foreground underline-offset-4 hover:underline">
              DPDP compliance platform
            </Link>
            . Fourth, operate: monitor trackers, honour withdrawals, close
            rights tickets, and refresh vendor maps when processing changes.
          </p>
          <p>
            Advisory without software leaves you with a roadmap you cannot
            execute. Software without advisory leaves you with banners that do
            not match your processing. DPDP Consultancy runs both, including{' '}
            <Link href="/services" className="text-foreground underline-offset-4 hover:underline">
              DPDP services
            </Link>{' '}
            for organisations that want managed operations after go-live.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">DPDP Rules 2025 and phased enforcement</h2>
          <p>
            The Act received assent in 2023. The implementing Rules were
            notified in November 2025, with duties switching on in phases rather
            than on a single day. That is not a reason to wait. Consent banners,
            tracker inventories, rights inboxes, and processor contracts are
            slow to change, and “we will start when the last phase lands” is how
            organisations miss the board’s first question: can you show the
            control today?
          </p>
          <p>
            A GDPR programme is useful raw material: data maps, processors,
            security. It is not DPDP compliance. Lawful bases, children’s
            data, notice content, and the Data Protection Board’s process are
            different. Treat the Rules as the operating calendar and the Act as
            the obligation set, then implement against both.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">What “good” evidence looks like</h2>
          <p>
            When counsel or a DPO asks whether you are DPDP compliant, the
            useful answer is a packet: current notices and purpose list, consent
            logs, scan results for public properties, open and closed rights
            requests with timestamps, processor register, and security control
            summaries. DPDP Consultancy’s platform stores those artefacts so
            they are not rebuilt from email every quarter.
          </p>

          <h2 className="text-2xl font-semibold text-foreground">How to start</h2>
          <p>
            Scan a public website, complete the readiness questions, then talk
            to DPDP Consultancy about the domains that actually apply. That is
            faster than commissioning a 200-page gap report before anyone has
            seen what your site loads in a browser.
          </p>
          <GuideCtas />
        </article>
      </SectionWrapper>

      <FaqSection title="DPDP compliance questions" faqs={DPDP_COMPLIANCE_FAQS} />
      <RelatedGuides current="/dpdp-compliance" />
    </div>
  )
}
