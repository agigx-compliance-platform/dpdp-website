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
      { id: 'consent-platform', blurb: 'Purpose consent, withdrawal, and the record behind it.' },
      { id: 'cookie-consent', blurb: 'Web and mobile banners that block tags until a grant.' },
      { id: 'policy-notice', blurb: 'Versioned notices tied to the consent they collected.' },
    ],
  },
  {
    title: 'Know your data',
    note: 'Sections 8(5) to 8(7)',
    modules: [
      { id: 'data-discovery', blurb: 'An inventory of personal data, built from your catalogs.' },
      { id: 'data-lineage', blurb: 'Where that data flows, and which stores are still unknown.' },
      { id: 'infra-scanner', blurb: 'Cloud and code settings that put personal data in reach.' },
    ],
  },
  {
    title: 'Rights and vendors',
    note: 'Sections 8(2) and 11 to 13',
    modules: [
      { id: 'dsar-platform', blurb: 'Access, correction, and erasure inside the deadline.' },
      { id: 'processor-governance', blurb: 'Processors registered, mapped, and kept in step.' },
    ],
  },
  {
    title: 'Assurance',
    note: 'Across the Act',
    modules: [
      { id: 'trustscope', blurb: 'Your public sites, scored the way a regulator would look.' },
      { id: 'ai-assistant', blurb: 'Answers grounded in the Act, plus a readiness audit.' },
      { id: 'adaptive-engine', blurb: 'Rule changes turned into control updates to approve.' },
    ],
  },
]

const ROLLOUT = [
  { title: 'Scan', body: 'Connect public properties and see what they load today.' },
  { title: 'Lock purposes', body: 'Agree the purpose list and the notice that explains it.' },
  { title: 'Ship consent', body: 'Banner and SDK live, tags gated on the grant.' },
  { title: 'Open rights', body: 'DSAR intake on, backed by the data inventory.' },
  { title: 'Extend', body: 'Vendor webhooks and infrastructure scanning follow.' },
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
            <span className="gradient-text">Every DPDP duty, run every day</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Consent, data inventory, rights requests, vendors, and evidence on one platform built for the DPDP Act 2023
            and the 2025 Rules. Not a GDPR suite with an India flag turned on.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
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
          Eleven modules on shared purposes and identifiers, grouped by the duty they serve.
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
        title="Four tools that disagree are not a platform"
        body="A CMP, a helpdesk, a GRC sheet, and a one-time scan each look green on their own. The gaps sit between them. We run them on one record."
      />

      <FaqSection title="DPDP platform questions" faqs={DPDP_PLATFORM_FAQS} />
      <RelatedGuides current="/dpdp-platform" />
    </div>
  )
}
