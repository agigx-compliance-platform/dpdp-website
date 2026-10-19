import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { LifecycleDiagram } from '@/components/illustrations'

export function LifecycleSection() {
  return (
    <SectionWrapper id="how-it-works">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Discover, map, consent, fulfil, then prove.
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Each stage writes to the same ledger. A rights ticket cannot close on
          stores the inventory never edged.
        </p>
      </div>
      <div className="mt-10">
        <LifecycleDiagram />
      </div>
    </SectionWrapper>
  )
}
