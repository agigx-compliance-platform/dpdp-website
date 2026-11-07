import Link from 'next/link'
import { BellRing, Building2, FileSearch } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { LineageFlow } from '@/components/illustrations'

const FAQS = [
  {
    question: 'Will the map be complete?',
    answer:
      'Not always. We show which systems are connected and which are still unknown, so gaps stay visible.',
  },
  {
    question: 'Where does the map come from?',
    answer:
      'From technical records you already have: data pipelines, infrastructure settings, database query history, and scheduled job runs. We do not invent missing pieces.',
  },
  {
    question: 'How does this help with people’s requests?',
    answer:
      'Requests to see or delete data run across the systems on the map. Anything unknown is listed, and backups that cannot be deleted are shown as kept.',
  },
]

const INPUTS = [
  {
    title: 'Pipeline definitions',
    body: 'Show where data comes from and where it goes.',
    color: 'hsl(var(--primary))',
  },
  {
    title: 'Query history',
    body: 'Show which systems read and write data. A useful clue, but not the whole picture.',
    color: 'hsl(var(--info))',
  },
  {
    title: 'Job runs',
    body: 'Show how data actually moved when jobs ran.',
    color: 'hsl(var(--warning))',
  },
  {
    title: 'Infrastructure definitions',
    body: 'Show systems and vendors set up in your infrastructure, even if nobody has listed them.',
    color: 'hsl(var(--severity-critical))',
  },
]

const USES = [
  {
    icon: FileSearch,
    title: 'Answer people’s requests',
    body: 'See every known system that holds someone’s data. Unknown systems are listed, not skipped.',
  },
  {
    icon: BellRing,
    title: 'Act on a change of mind',
    body: 'See where a withdrawal needs to reach, beyond the system where it started.',
  },
  {
    icon: Building2,
    title: 'See what vendors receive',
    body: 'See which vendors receive which personal details, and how.',
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
            See how data moves, and what is still unknown
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A map of how personal details move between your systems. It shows gaps rather than hiding them.
          </p>
        </div>
        <div className="mt-12">
          <LineageFlow />
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">Where the map comes from</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Built from what your systems already record. Each link shows where it came from.
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
          This starts with knowing where your data is:{' '}
          <Link href="/data-discovery" className="text-foreground underline-offset-4 hover:underline">
            find personal data
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
