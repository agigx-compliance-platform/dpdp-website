import { CONNECTOR_TYPE_COUNT } from '@/lib/connectors'
import { formatMilestoneDate, getNextMilestone, isFullyInForce } from '@/lib/dpdp-timeline'
import { WhyNow } from '@/components/home/WhyNow'

export function TrustBand() {
  const next = getNextMilestone()
  const inForce = isFullyInForce()

  const items = [
    {
      label: 'Duties covered',
      value: 'Notice · Consent · Rights · Safeguards',
      extra: (
        <p className="mt-2 text-sm text-muted-foreground">
          Written against the DPDP Act, 2023.
        </p>
      ),
    },
    {
      label: 'Deployment',
      value: 'SaaS and self-hosted',
      extra: <p className="mt-2 text-sm text-muted-foreground">Records stay in your network.</p>,
    },
    {
      label: 'Connector types',
      value: String(CONNECTOR_TYPE_COUNT),
      extra: (
        <p className="mt-2 text-sm text-muted-foreground">
          From PostgreSQL, Snowflake, and S3 through Salesforce and Kafka.
        </p>
      ),
    },
    {
      label: inForce ? 'Enforcement' : 'Next milestone',
      value: inForce ? `In force since ${formatMilestoneDate(next)}` : next.label,
      extra: (
        <p className="mt-2 text-sm text-muted-foreground">{next.citation}</p>
      ),
    },
  ]

  return (
    <section className="border-y border-border bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
              {item.extra}
            </div>
          ))}
        </div>
        <WhyNow />
      </div>
    </section>
  )
}
