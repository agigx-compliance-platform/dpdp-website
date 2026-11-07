import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Fingerprint } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { FaqSection } from '@/components/seo/FaqSection'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { DemoCta } from '@/components/products/DemoCta'
import { PlatformShowcase } from '@/components/products/PlatformShowcase'
import { DPDP_PLATFORM_FAQS } from '@/lib/dpdp-faqs'
import { PRODUCTS, productIconMap } from '@/lib/products-data'

/** Modules grouped by the DPDP duty they serve. Names, icons, and links come from products-data. */
const GROUPS: { title: string; note: string; modules: { id: string; blurb: string }[] }[] = [
  {
    title: 'Notice and consent',
    note: 'Sections 5 and 6',
    modules: [
      { id: 'consent-platform', blurb: 'Consent by purpose, withdrawal, and the record behind it.' },
      { id: 'cookie-consent', blurb: 'Banners that hold back non-essential cookies until a visitor agrees.' },
      { id: 'policy-notice', blurb: 'Notices saved with the consent they collected.' },
    ],
  },
  {
    title: 'Know your data',
    note: 'Sections 8(5) to 8(7)',
    modules: [
      { id: 'data-discovery', blurb: 'A list of the systems that hold personal data.' },
      { id: 'data-lineage', blurb: 'Where that data goes, and what is still unknown.' },
      { id: 'infra-scanner', blurb: 'Cloud and code settings that could expose personal data.' },
    ],
  },
  {
    title: 'People’s requests and vendors',
    note: 'Sections 8(2) and 11 to 13',
    modules: [
      { id: 'dsar-platform', blurb: 'Requests to see, correct, or delete data, tracked to the end.' },
      { id: 'processor-governance', blurb: 'Know which vendors hold data, and keep them informed.' },
    ],
  },
  {
    title: 'Checks and updates',
    note: 'Across the Act',
    modules: [
      { id: 'trustscope', blurb: 'See what your public websites collect and say.' },
      { id: 'ai-assistant', blurb: 'Answers about the Act, plus a readiness audit.' },
      { id: 'adaptive-engine', blurb: 'Know when rules change, and approve suggested updates.' },
    ],
  },
]

const ROLLOUT = [
  { title: 'Scan', body: 'See what your websites and apps collect today.' },
  { title: 'Agree the purposes', body: 'Agree why you use people’s details, and write the notice.' },
  { title: 'Start asking', body: 'Banner goes live, and non-essential cookies wait for consent.' },
  { title: 'Open requests', body: 'People can make requests, backed by your list of data.' },
  { title: 'Extend', body: 'Vendor updates and cloud and code checks follow.' },
] as const

const productById = new Map(PRODUCTS.map((p) => [p.id, p]))

function moduleCard(id: string, blurb: string) {
  const product = productById.get(id)
  if (!product) throw new Error(`dpdp-platform lists unknown product "${id}"`)
  const Icon = productIconMap[product.icon] ?? Fingerprint
  const href = 'href' in product && product.href ? product.href : `/products#${product.id}`
  return (
    <li key={id}>
      <Link
        href={href}
        className="group flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
            {product.name}
            <ArrowUpRight
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{blurb}</span>
        </span>
      </Link>
    </li>
  )
}

export default function DpdpPlatformPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-10 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">DPDP compliance platform</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">One place for your daily privacy work</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Consent, finding personal data, people&apos;s requests, vendors, and proof, in one platform built for the DPDP
            Act 2023 and the 2025 Rules.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact?intent=demo">
              <Button variant="primary" size="lg">
                Book a demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/questionnaire">
              <Button variant="outline" size="lg">
                Check your readiness
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">What the platform covers</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Eleven tools that work together, grouped by what they help you do.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <section key={group.title} className="rounded-2xl border border-border bg-background-secondary p-5">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold">{group.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{group.note}</span>
              </div>
              <ul className="grid gap-2">{group.modules.map((m) => moduleCard(m.id, m.blurb))}</ul>
            </section>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">One record, connected</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A consent change or a rights request reaches every system and vendor it should, because the modules share
          the same purposes and inventory.
        </p>
        <div className="mt-8">
          <PlatformShowcase />
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">How a rollout usually goes</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROLLOUT.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Step {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          Advisory stays alongside: notice text, children&apos;s data, and Significant Data Fiduciary duties are worked
          out with{' '}
          <Link href="/services" className="text-foreground underline-offset-4 hover:underline">
            DPDP Consultancy services
          </Link>
          .
        </p>
      </SectionWrapper>

      <DemoCta
        title="Separate tools leave gaps between them"
        body="A banner, a helpdesk, a spreadsheet, and a one-time scan can each look fine alone. The gaps sit between them. We keep them on one record."
      />

      <FaqSection title="DPDP platform questions" faqs={DPDP_PLATFORM_FAQS} />
      <RelatedGuides current="/dpdp-platform" />
    </div>
  )
}
