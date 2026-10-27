import { ArrowRight, BadgeCheck, FileEdit, Radar, TrendingUp } from 'lucide-react'

const CONTROLS = [
  { name: 'Privacy notice', change: 'Add the new retention period' },
  { name: 'Retention schedule', change: 'Shorten inactive-account window' },
  { name: 'Erasure workflow', change: 'Add the intimation step before deletion' },
] as const

/** Monthly readiness score, oldest first. */
const TREND = [58, 61, 64, 63, 68, 71, 66, 72]

function Sparkline() {
  const w = 220
  const h = 56
  const min = Math.min(...TREND) - 4
  const max = Math.max(...TREND) + 4
  const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  // The line stretches to the row's width; the dots are HTML so they stay round.
  const dot = ([x, y]: readonly [number, number], color: string) => (
    <span
      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
      style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%`, background: color }}
      aria-hidden="true"
    />
  )
  return (
    <div className="relative h-14 w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill="hsl(var(--primary) / 0.12)" />
        <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {dot(pts[6], 'hsl(var(--warning))')}
      {dot(pts[pts.length - 1], 'hsl(var(--primary))')}
    </div>
  )
}

function Step({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: typeof Radar
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
      </div>
      <div className="mt-3 flex-1">{children}</div>
    </div>
  )
}

export function RegulatoryChangeFlow() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 sm:px-6"
      role="img"
      aria-label="Adaptive compliance: a rule change is detected, three affected controls are listed, an update is drafted for the DPO to approve, and the readiness score trend recovers after the change"
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr] lg:items-stretch">
        <Step icon={Radar} eyebrow="1 · Detect" title="Rules amendment">
          <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Example change
          </span>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            New retention limit for inactive accounts, with notice to the person before erasure.
          </p>
        </Step>

        <ArrowRight className="mx-auto hidden h-4 w-4 self-center text-primary lg:block" aria-hidden="true" />

        <Step icon={FileEdit} eyebrow="2 · Assess" title="3 controls affected">
          <ul className="space-y-1.5">
            {CONTROLS.map((c) => (
              <li key={c.name} className="rounded-lg bg-background-secondary px-2.5 py-1.5">
                <p className="text-[11px] font-medium text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.change}</p>
              </li>
            ))}
          </ul>
        </Step>

        <ArrowRight className="mx-auto hidden h-4 w-4 self-center text-primary lg:block" aria-hidden="true" />

        <Step icon={BadgeCheck} eyebrow="3 · Update" title="Drafts ready">
          <div className="rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-[10px] leading-relaxed">
            <p className="text-destructive line-through">kept for 3 years after last login</p>
            <p className="text-success">kept for 1 year, then you are told before erasure</p>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
            Waiting for DPO approval
          </p>
        </Step>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="sm:w-56">
          <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
            Readiness score
          </p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Dips when the law moves, recovers as the drafts are approved.
          </p>
        </div>
        <div className="flex-1">
          <Sparkline />
        </div>
        <p className="text-right">
          <span className="text-2xl font-bold text-foreground">72</span>
          <span className="block text-[10px] text-muted-foreground">this month</span>
        </p>
      </div>
    </figure>
  )
}
