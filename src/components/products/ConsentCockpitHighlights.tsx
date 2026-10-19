'use client'

import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { ConnectorCanvas } from '@/components/workflow'
import { consentCenter, consentEdges, consentNodes } from '@/lib/workflows'

export function ConsentCockpitHighlights() {
  return (
    <SectionWrapper className="border-y border-border bg-background-secondary/30 py-12 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Consent Cockpit
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Notice, grant, withdrawal, receipt.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          A Section 6 event as a ledger. Not a screenshot of a demo tenant.
        </p>
      </div>
      <ConnectorCanvas
        variant="canvas"
        nodes={consentNodes}
        edges={consentEdges}
        center={consentCenter}
        minHeight={480}
      />
    </SectionWrapper>
  )
}
