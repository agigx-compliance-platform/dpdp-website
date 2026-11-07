import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { ConnectorLogoRail } from '@/components/ui/ConnectorFamilyRails'
import { SUPPORTED_SYSTEM_CATEGORIES } from '@/lib/connectors'

export function IntegrationsWall() {
  return (
    <SectionWrapper id="connectors">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Supported systems
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Works with the systems you already use.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Databases, cloud storage, and business apps. Don&apos;t see yours? Tell us what you run and we can add it.
        </p>
      </div>
      <div className="mt-10">
        <ConnectorLogoRail families={SUPPORTED_SYSTEM_CATEGORIES} />
      </div>
    </SectionWrapper>
  )
}
