import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { ConnectorLogoRail } from '@/components/ui/ConnectorFamilyRails'
import {
  CONNECTOR_CATEGORIES,
  CONNECTOR_TYPE_COUNT,
  FUTURE_CONNECTOR_CATEGORIES,
} from '@/lib/connectors'

export function IntegrationsWall() {
  return (
    <SectionWrapper id="connectors">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Connectors
        </p>
        <h2 className="mt-3 whitespace-nowrap text-lg font-semibold tracking-tight sm:text-2xl md:text-3xl">
          {CONNECTOR_TYPE_COUNT} connector types today. More can be added.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Live types on the moving rail. Further stores use the same inventory when you add them.
        </p>
      </div>
      <div className="mt-10">
        <ConnectorLogoRail families={CONNECTOR_CATEGORIES} />
      </div>
      <h3 className="mt-12 text-lg font-semibold text-foreground">Further systems</h3>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Not claimed as live until they are connected on an estate.
      </p>
      <div className="mt-6">
        <ConnectorLogoRail families={FUTURE_CONNECTOR_CATEGORIES} direction="rtl" />
      </div>
    </SectionWrapper>
  )
}
