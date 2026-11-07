import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { DiscoveryPassesDiagram, DiscoveryScene, HubCollectorBoundary } from '@/components/illustrations'
import { SUPPORTED_SYSTEM_CATEGORIES } from '@/lib/connectors'
import { ConnectorLogoRail } from '@/components/ui/ConnectorFamilyRails'

const FAQS = [
  {
    question: 'Do you copy our records out of our network?',
    answer:
      'No. We build a list of systems and fields. The records themselves stay where they already are.',
  },
  {
    question: 'What does a discovery run produce?',
    answer:
      'A current list of where personal data sits, how it is labelled, and whether it can be looked up exactly when someone makes a request.',
  },
  {
    question: 'Which systems do you support?',
    answer:
      'Databases, data warehouses, cloud storage, business apps, cloud accounts, logs, and backups. Tell us if you run something else and we can add it.',
  },
]

export default function DataDiscoveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-8 pt-32 md:pt-40">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            See which systems hold personal data
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Get a list of the systems and fields that hold personal details, using
            information your systems already have. Your records stay in your network.
            More systems can be added.
          </p>
        </div>
        <div className="mt-12">
          <DiscoveryScene />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Find, label, confirm</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          First find the systems. Then label the personal data. Then mark what can be
          looked up exactly when someone makes a request. A guess is not counted as a find.
        </p>
        <div className="mt-8">
          <DiscoveryPassesDiagram />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Your records stay in your network</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          We keep the names of systems and fields. We do not take a copy of your
          records.
        </p>
        <div className="mt-8">
          <HubCollectorBoundary />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Supported systems</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Don&apos;t see yours? Tell us what you run and we can add it.
        </p>
        <div className="mt-8">
          <ConnectorLogoRail families={SUPPORTED_SYSTEM_CATEGORIES} />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Under the DPDP Act</h2>
        <ul className="mt-4 max-w-2xl space-y-3 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Reasonable security.</span>{' '}
            To protect personal data, you first need to know where it is and who can
            reach it.
          </li>
          <li>
            <span className="font-medium text-foreground">People&apos;s requests.</span>{' '}
            To show or delete someone&apos;s data, you need to find all of it. A search
            that misses some of it does not complete the request.
          </li>
        </ul>
      </SectionWrapper>

      <FaqSection title="Data discovery questions" faqs={FAQS} />
      <GuideCtas />
      <RelatedGuides current="/data-discovery" />
      <SectionWrapper className="pt-0">
        <p className="text-sm text-muted-foreground">
          Next:{' '}
          <Link href="/data-lineage" className="text-foreground underline-offset-4 hover:underline">
            how data moved between those stores
          </Link>
          .
        </p>
      </SectionWrapper>
    </div>
  )
}
