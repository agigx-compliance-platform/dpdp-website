import Link from 'next/link'
import { ArrowRight, BellOff, Cookie, FileText, ListChecks, Network, ScrollText } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { FaqSection } from '@/components/seo/FaqSection'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { ConsentShowcase } from '@/components/products/ConsentShowcase'
import { DemoCta } from '@/components/products/DemoCta'
import { CONSENT_MANAGEMENT_FAQS } from '@/lib/dpdp-faqs'

const COVERAGE = [
  {
    icon: FileText,
    title: 'Notice',
    body: 'Plain-language notice of purposes, versioned and stored with every choice.',
    section: 'Section 5',
  },
  {
    icon: ListChecks,
    title: 'Purpose consent',
    body: 'Each purpose asked separately. Nothing bundled into sign-up.',
    section: 'Section 6(1)',
  },
  {
    icon: Cookie,
    title: 'Banner and cookies',
    body: 'Web and mobile banners that block non-essential tags until a grant.',
    section: 'Section 6',
  },
  {
    icon: BellOff,
    title: 'Withdrawal',
    body: 'As easy as giving consent, from a preference centre the person controls.',
    section: 'Section 6(4)',
  },
  {
    icon: Network,
    title: 'Third parties',
    body: 'Changes reach every processor that uses the purpose, with delivery tracked.',
    section: 'Section 8(2)',
  },
  {
    icon: ScrollText,
    title: 'Proof',
    body: 'Append-only record of who agreed to what, on which notice, and when.',
    section: 'Section 6(10)',
  },
] as const

export default function ConsentManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-10 pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Consent management</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Consent the DPDP Act will accept</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            From the first notice to a withdrawal that reaches your vendors, one platform covers every consent duty
            under the Act, with the proof the Board can ask for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
        <h2 className="text-2xl font-semibold sm:text-3xl">What we cover</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">Six consent duties, one record behind all of them.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COVERAGE.map((item) => {
            const Icon = item.icon
            return (
              <li
                key={item.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.section}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            )
          })}
        </ul>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Three moments that matter. The demo walks through the rest.
        </p>
        <div className="mt-8">
          <ConsentShowcase />
        </div>
      </SectionWrapper>

      <DemoCta
        title="A banner is not consent management"
        body="A banner shows a choice. DPDP asks you to honour it everywhere: in your tags, your systems, and your vendors, and to prove it later. That is the part we automate."
      />

      <FaqSection title="Questions" faqs={CONSENT_MANAGEMENT_FAQS} />
      <RelatedGuides current="/consent-management" />
    </div>
  )
}
