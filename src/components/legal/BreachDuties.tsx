import { BREACH_DUTIES } from '@/lib/dpdp-facts'

export function BreachDuties() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {BREACH_DUTIES.map((duty) => (
        <li key={`${duty.when}-${duty.who}`} className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-primary">{duty.when}</p>
          <h3 className="mt-2 text-base font-semibold text-foreground">Tell: {duty.who}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{duty.what}</p>
        </li>
      ))}
    </ol>
  )
}
