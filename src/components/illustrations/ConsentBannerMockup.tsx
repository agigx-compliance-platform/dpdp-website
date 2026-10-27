import { Globe, Lock, Monitor, Smartphone } from 'lucide-react'

const PURPOSES = [
  { name: 'Essential', note: 'Login, cart, security', on: true, locked: true },
  { name: 'Analytics', note: 'Page and feature usage', on: false },
  { name: 'Marketing', note: 'Ads and retargeting', on: false },
] as const

const CALLOUTS = [
  { n: 1, title: 'Reject is as easy as accept', body: 'Equal-weight buttons on the first screen. No dark pattern.' },
  { n: 2, title: 'One switch per purpose', body: 'Essential is fixed. Every other purpose starts off.' },
  { n: 3, title: 'Tags wait for a grant', body: 'Analytics and marketing scripts stay blocked until the visitor says yes.' },
  { n: 4, title: 'English and Hindi', body: 'The visitor switches language without losing their choices.' },
] as const

function Marker({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground shadow-[var(--shadow-glow-primary)] ${className}`}
      aria-hidden="true"
    >
      {n}
    </span>
  )
}

function Toggle({ on, locked }: { on: boolean; locked?: boolean }) {
  return (
    <span
      className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full ${on ? 'bg-primary' : 'bg-muted'} ${locked ? 'opacity-60' : ''}`}
      aria-hidden="true"
    >
      <span className={`absolute h-3 w-3 rounded-full bg-white shadow ${on ? 'left-3.5' : 'left-0.5'}`} />
    </span>
  )
}

/** Placeholder lines that stand in for the host page behind the banner. */
function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="h-3 w-2/5 rounded bg-muted" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-2 rounded bg-muted/70" style={{ width: `${92 - i * 14}%` }} />
      ))}
    </div>
  )
}

function DesktopBrowser() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-2 border-b border-border bg-background-tertiary px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </span>
        <span className="ml-2 flex flex-1 items-center gap-1.5 truncate rounded-md bg-background px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
          <Lock className="h-2.5 w-2.5" aria-hidden="true" />
          shop.example.in
        </span>
      </div>

      <div className="relative h-[300px] bg-background-secondary p-5 sm:h-[340px] lg:h-[400px]">
        <div className="grid grid-cols-[1fr_120px] gap-4">
          <PageSkeleton rows={4} />
          <div className="h-24 rounded-lg bg-gradient-to-br from-primary/20 to-muted/60 lg:h-32" aria-hidden="true" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/50" />
          ))}
        </div>

        {/* Bar layout pinned to the bottom of the viewport */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-md)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                We ask before we use your data
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                  <Globe className="h-2.5 w-2.5" aria-hidden="true" />
                  EN · हिन्दी
                </span>
                <Marker n={4} className="hidden sm:inline-flex" />
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                Essential cookies keep the site working. Analytics and marketing run only if you
                allow them. <span className="text-foreground underline underline-offset-2">Read the notice</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Marker n={1} className="hidden sm:inline-flex" />
              <span className="whitespace-nowrap rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground">
                Reject all
              </span>
              <span className="whitespace-nowrap rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground">
                Choose purposes
              </span>
              <span className="whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground">
                Accept all
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobilePhone() {
  return (
    <div className="mx-auto w-[236px] rounded-[2.2rem] border border-border bg-background-tertiary p-2 shadow-[var(--shadow-lg)]">
      <div className="relative h-[460px] overflow-hidden rounded-[1.7rem] bg-background-secondary">
        <div className="flex items-center justify-between px-5 pt-2 text-[9px] font-medium text-muted-foreground" aria-hidden="true">
          <span>9:41</span>
          <span className="h-4 w-16 rounded-full bg-background" />
          <span>5G</span>
        </div>
        <div className="mx-3 mt-2 flex items-center gap-1 truncate rounded-full bg-background px-2.5 py-1 font-mono text-[9px] text-muted-foreground">
          <Lock className="h-2 w-2" aria-hidden="true" />
          shop.example.in
        </div>
        <div className="space-y-3 p-4">
          <PageSkeleton rows={2} />
          <div className="h-20 rounded-lg bg-muted/50" aria-hidden="true" />
        </div>

        {/* Purpose sheet: the modal layout as a bottom sheet on small screens */}
        <div className="absolute inset-0 bg-background/60" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border bg-card p-4 shadow-[var(--shadow-lg)]">
          <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-muted" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Choose purposes</p>
            <Marker n={2} />
          </div>
          <ul className="mt-3 space-y-2.5">
            {PURPOSES.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                    {p.name}
                    {'locked' in p && p.locked ? <Lock className="h-2.5 w-2.5 text-muted-foreground" aria-hidden="true" /> : null}
                  </p>
                  <p className="truncate text-[9px] text-muted-foreground">{p.note}</p>
                </div>
                <Toggle on={p.on} locked={'locked' in p && p.locked} />
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="rounded-md border border-border bg-background py-1.5 text-center text-[10px] font-medium text-foreground">
              Reject all
            </span>
            <span className="rounded-md bg-primary py-1.5 text-center text-[10px] font-medium text-primary-foreground">
              Save choices
            </span>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground">
            <Marker n={3} className="h-4 w-4 text-[8px]" />
            2 tags blocked until you allow them
          </p>
        </div>
      </div>
    </div>
  )
}

export function ConsentBannerMockup() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-8 sm:px-8"
      role="img"
      aria-label="Consent banner on desktop web as a bottom bar with equal Reject, Choose and Accept buttons, and on mobile web as a bottom sheet with one switch per purpose"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 40%, hsl(var(--primary) / 0.10), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
        <div>
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            Desktop web · bar layout
          </p>
          <DesktopBrowser />
        </div>
        <div>
          <p className="mb-3 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:justify-start">
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            Mobile web · purpose sheet
          </p>
          <MobilePhone />
        </div>
      </div>

      <ol className="relative mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {CALLOUTS.map((c) => (
          <li key={c.n} className="flex gap-3">
            <Marker n={c.n} />
            <div>
              <p className="text-sm font-semibold text-foreground">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}
