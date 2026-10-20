import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { DiscoveryPassesDiagram, DiscoveryScene, HubCollectorBoundary } from '@/components/illustrations'
import { CONNECTOR_CATEGORIES, FUTURE_CONNECTOR_CATEGORIES } from '@/lib/connectors'
import { ConnectorLogoRail } from '@/components/ui/ConnectorFamilyRails'

const FAQS = [
  {
    question: 'Do you copy our records out of our network?',
    answer:
      'No. Discovery builds an inventory of systems and fields. The records themselves stay where they already are.',
  },
  {
    question: 'What does a discovery run produce?',
    answer:
      'A live list of where personal data sits, how it is classified, and whether a rights request can look it up exactly. It is not a spreadsheet of system names someone typed last year.',
  },
  {
    question: 'Which systems are covered today?',
    answer:
      'Relational databases, warehouses, catalogs, NoSQL, object storage, streams, major SaaS, cloud inventory, logs, and backup vaults. Further systems can be added without changing how the inventory is read.',
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
            See where personal data lives
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            An inventory of systems and fields, built from the catalogs you already
            run. Records stay in your network. Further connectors can be added.
          </p>
        </div>
        <div className="mt-12">
          <DiscoveryScene />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Locate, classify, confirm</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          First find the stores. Then name the personal data. Then mark what a
          rights request can look up exactly. A guess is not filed as found.
        </p>
        <div className="mt-8">
          <DiscoveryPassesDiagram />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Your network keeps the records</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The control plane holds names of systems and fields. It does not take a
          copy of the rows.
        </p>
        <div className="mt-8">
          <HubCollectorBoundary />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Connectors today</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Live types on the moving rail. Records stay in your network.
        </p>
        <div className="mt-8">
          <ConnectorLogoRail families={CONNECTOR_CATEGORIES} />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Further systems</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Further stores use the same inventory. They are not claimed as live
          until they are connected on an estate.
        </p>
        <div className="mt-8">
          <ConnectorLogoRail families={FUTURE_CONNECTOR_CATEGORIES} direction="rtl" />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Under the DPDP Act</h2>
        <ul className="mt-4 max-w-2xl space-y-3 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Reasonable security.</span>{' '}
            Safeguards start with knowing which fields hold personal data and who
            can reach them.
          </li>
          <li>
            <span className="font-medium text-foreground">Rights.</span> Access and
            erasure use exact lookups. A sampled search that misses a row is not
            a completed request.
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
