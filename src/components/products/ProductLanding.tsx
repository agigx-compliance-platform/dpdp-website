import type { ReactNode } from 'react'
import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FaqSection } from '@/components/seo/FaqSection'
import { GuideCtas } from '@/components/seo/GuideCtas'
import { RelatedGuides } from '@/components/seo/RelatedGuides'
import { ConnectorCanvas, type CanvasCenterNode, type CanvasEdge, type CanvasNode } from '@/components/workflow'
import type { DpdpFaqItem } from '@/lib/dpdp-faqs'

type Capability = { title: string; body: string }

export function ProductLanding({
  eyebrow,
  title,
  lead,
  nodes,
  edges,
  center,
  capabilities,
  notes,
  faqs,
  current,
  nextHref,
  nextLabel,
  children,
}: {
  eyebrow: string
  title: string
  lead: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  center: CanvasCenterNode
  capabilities: Capability[]
  notes?: Capability[]
  faqs: DpdpFaqItem[]
  current: string
  nextHref?: string
  nextLabel?: string
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-8 pt-32 md:pt-40">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</p>
        </div>
        <div className="mt-12">
          <ConnectorCanvas variant="canvas" nodes={nodes} edges={edges} center={center} minHeight={520} />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold">What it does</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {capabilities.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {children}

      {notes && notes.length > 0 ? (
        <SectionWrapper>
          <h2 className="text-2xl font-semibold">Under the DPDP Act</h2>
          <ul className="mt-4 max-w-2xl space-y-3 text-sm text-muted-foreground">
            {notes.map((item) => (
              <li key={item.title}>
                <span className="font-medium text-foreground">{item.title}.</span> {item.body}
              </li>
            ))}
          </ul>
        </SectionWrapper>
      ) : null}

      <FaqSection title="Questions" faqs={faqs} />
      <GuideCtas />
      <RelatedGuides current={current} />
      {nextHref && nextLabel ? (
        <SectionWrapper className="pt-0">
          <p className="text-sm text-muted-foreground">
            Next:{' '}
            <Link href={nextHref} className="text-foreground underline-offset-4 hover:underline">
              {nextLabel}
            </Link>
            .
          </p>
        </SectionWrapper>
      ) : null}
    </div>
  )
}
