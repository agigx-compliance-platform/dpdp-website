import { DPDP_TIMELINE, formatMilestoneDate } from '@/lib/dpdp-timeline'

export function DpdpTimeline() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DPDP_TIMELINE.map((milestone) => (
        <li key={milestone.date} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold text-primary">{formatMilestoneDate(milestone)}</p>
          <h3 className="mt-2 text-base font-semibold text-foreground">{milestone.label}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{milestone.summary}</p>
          <p className="mt-3 text-xs text-muted-foreground">{milestone.citation}</p>
        </li>
      ))}
    </ol>
  )
}
