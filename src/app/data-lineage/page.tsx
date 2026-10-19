import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { LineageGraph } from '@/components/illustrations'

const FAQS = [
  {
    question: 'Does lineage claim the map is complete?',
    answer:
      'No. A coverage view lists stores that are connected and stores that are still unknown. Gaps stay visible.',
  },
  {
    question: 'Where does the map come from?',
    answer:
      'Pipeline definitions, infrastructure definitions, query history, and job runs. The map is harvested from what already exists. Missing pieces are not invented.',
  },
  {
    question: 'How does lineage change a rights request?',
    answer:
      'Access and erasure run against stores on the map. A vendor that never appeared is not silently included. Backups that cannot erase are disclosed as retained.',
  },
]

const INPUTS = [
  {
    title: 'Pipeline definitions',
    body: 'Transforms and sources become edges. Not a claim that every table is modelled.',
  },
  {
    title: 'Infrastructure definitions',
    body: 'Stores and processors declared in infrastructure show up before someone remembers to inventory them.',
  },
  {
    title: 'Query history',
    body: 'Reads and writes that catalogs do not describe. Hints, never treated as complete.',
  },
  {
    title: 'Job runs',
    body: 'Runtime evidence of how data actually moved. Missing jobs stay missing.',
  },
]

export default function DataLineagePage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-8 pt-32 md:pt-40">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How personal data moved, and what is still unknown
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A coverage view is the artefact. Completeness is not assumed.
          </p>
        </div>
        <div className="mt-12">
          <LineageGraph />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">Inputs</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {INPUTS.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">What the map is for</h2>
        <ul className="mt-4 max-w-2xl space-y-3 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Rights scope.</span> Erasure
            and access run on stores that are on the map. Unknown stores stay listed
            as unknown.
          </li>
          <li>
            <span className="font-medium text-foreground">Vendors.</span> A change
            in consent or a rights ticket follows the edges that exist. A store the
            map never saw is not messaged.
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Inventory first:{' '}
          <Link href="/data-discovery" className="text-foreground underline-offset-4 hover:underline">
            data discovery
          </Link>
          .
        </p>
      </SectionWrapper>

      <FaqSection title="Data lineage questions" faqs={FAQS} />
      <GuideCtas />
      <RelatedGuides current="/data-lineage" />
    </div>
  )
}
