import Link from 'next/link'
import { BellRing, Building2, FileSearch } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { LineageFlow } from '@/components/illustrations'

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
    color: 'hsl(var(--primary))',
  },
  {
    title: 'Query history',
    body: 'Reads and writes that catalogs do not describe. Hints, never treated as complete.',
    color: 'hsl(var(--info))',
  },
  {
    title: 'Job runs',
    body: 'Runtime evidence of how data actually moved. Missing jobs stay missing.',
    color: 'hsl(var(--warning))',
  },
  {
    title: 'Infrastructure definitions',
    body: 'Stores and processors declared in infrastructure show up before someone remembers to inventory them.',
    color: 'hsl(var(--severity-critical))',
  },
]

const USES = [
  {
    icon: FileSearch,
    title: 'Scope a rights request',
    body: 'Access and erasure run on every store the person reached. Unknown stores are listed, not skipped silently.',
  },
  {
    icon: BellRing,
    title: 'Carry a withdrawal',
    body: 'A consent change follows the edges into warehouses and exports, not just the table it started in.',
  },
  {
    icon: Building2,
    title: 'Show vendor exposure',
    body: 'See which processors receive which personal fields, and through which pipeline.',
  },
]

export default function DataLineagePage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-8 pt-32 md:pt-40">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Platform
          </p>
          <h1 className="whitespace-nowrap text-[clamp(1.05rem,2.8vw,3rem)] font-semibold tracking-tight">
            How personal data moved, and what is still unknown
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A coverage view is the artefact. Completeness is not assumed.
          </p>
        </div>
        <div className="mt-12">
          <LineageFlow />
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">Where the map comes from</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Harvested from what your systems already record. Each link in the diagram keeps the evidence it came from.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INPUTS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
              <span className="block h-1 w-8 rounded-full" style={{ background: item.color }} aria-hidden="true" />
              <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">What the map is for</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {USES.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            )
          })}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Lineage starts from an inventory:{' '}
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
