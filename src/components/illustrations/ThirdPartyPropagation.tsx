import { ArrowRight, Building2, MousePointerClick, ScrollText, Send, Webhook } from 'lucide-react'

type Delivery = 'confirmed' | 'retrying' | 'unaffected'

const PROCESSORS: { name: string; role: string; delivery: Delivery; detail: string }[] = [
  { name: 'Email platform', role: 'Mapped to Offers', delivery: 'confirmed', detail: 'Stopped · callback 4s' },
  { name: 'Ad network', role: 'Mapped to Offers', delivery: 'confirmed', detail: 'Audience removed · 11s' },
  { name: 'CRM sync', role: 'Mapped to Offers', delivery: 'retrying', detail: 'Retry 2 of 5 · alert on fail' },
  { name: 'KYC vendor', role: 'Onboarding only', delivery: 'unaffected', detail: 'Not mapped · no signal sent' },
]

const DELIVERY_STYLES: Record<Delivery, { pill: string; dot: string; label: string }> = {
  confirmed: { pill: 'bg-success/15 text-success border-success/30', dot: 'bg-success', label: 'Confirmed' },
  retrying: { pill: 'bg-warning/15 text-warning border-warning/30', dot: 'bg-warning', label: 'Retrying' },
  unaffected: { pill: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground', label: 'Unaffected' },
}

const STEPS = [
  { icon: MousePointerClick, eyebrow: '1 · Withdraw', title: 'Offers switched off', body: 'Data Principal, in the Consent Cockpit' },
  { icon: ScrollText, eyebrow: '2 · Record', title: 'Ledger updated', body: 'Grant on notice v3 marked withdrawn' },
  { icon: Send, eyebrow: '3 · Fan out', title: 'Signed webhooks', body: 'Only to processors mapped to Offers' },
] as const

export function ThirdPartyPropagation() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-8 sm:px-8"
      role="img"
      aria-label="Third-party consent: a withdrawal in the Consent Cockpit updates the ledger, then signed webhooks go only to processors mapped to that purpose. Each processor confirms, retries, or is unaffected."
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 45% 60% at 62% 50%, hsl(var(--primary) / 0.08), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1.15fr)]">
        {/* Origin of the change */}
        <ol className="space-y-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.eyebrow} className="relative">
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-sm)]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{s.eyebrow}</p>
                    <p className="text-sm font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.body}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 ? <span className="ml-7 block h-3 w-px bg-primary/40" aria-hidden="true" /> : null}
              </li>
            )
          })}
        </ol>

        {/* Fan-out connector */}
        <div className="flex justify-center lg:h-full" aria-hidden="true">
          <svg viewBox="0 0 56 320" preserveAspectRatio="none" className="hidden h-full w-14 lg:block">
            {[40, 120, 200, 280].map((y, i) => (
              <path
                key={y}
                d={`M 0 262 C 30 262, 26 ${y}, 56 ${y}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity={i === 3 ? 0.15 : 0.5}
                strokeDasharray={i === 3 ? '3 4' : undefined}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <Webhook className="h-5 w-5 text-primary lg:hidden" />
        </div>

        {/* Third parties */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Third parties · processor registry
          </p>
          <ul className="space-y-2.5">
            {PROCESSORS.map((p) => {
              const style = DELIVERY_STYLES[p.delivery]
              return (
                <li
                  key={p.name}
                  className={`flex items-center justify-between gap-3 rounded-2xl border bg-card p-3.5 shadow-[var(--shadow-sm)] ${p.delivery === 'unaffected' ? 'border-dashed border-border opacity-70' : 'border-border'}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{p.role}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${style.pill}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {style.label}
                    </span>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{p.detail}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-card/70 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <span className="font-semibold text-foreground">Back to the ledger</span>
        <ArrowRight className="hidden h-3.5 w-3.5 text-primary sm:block" aria-hidden="true" />
        <span>
          Each callback is written to the same record, so the DPO can show which processor stopped, when, and which one
          still needs a follow-up.
        </span>
      </div>
    </figure>
  )
}
