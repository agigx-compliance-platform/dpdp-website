import { BadgeCheck, FileCheck2, Inbox, Search, ShieldCheck, Trash2 } from 'lucide-react'

const STAGES = [
  { id: 'intake', icon: Inbox, title: 'Intake', body: 'Web form, email, or API. One ticket, deduplicated.', meta: 'Day 0' },
  { id: 'verify', icon: ShieldCheck, title: 'Verify', body: 'OTP to the contact on file before anything is searched.', meta: 'Identity' },
  { id: 'discover', icon: Search, title: 'Discover', body: 'Exact-key lookup across every store in the inventory.', meta: 'Locate' },
  { id: 'review', icon: BadgeCheck, title: 'Review', body: 'A named approver checks scope and any legal hold.', meta: 'Approval' },
  { id: 'erase', icon: Trash2, title: 'Erase and notify', body: 'Delete in each store. Processors told to do the same.', meta: 'Fulfil' },
  { id: 'evidence', icon: FileCheck2, title: 'Evidence', body: 'Response sent. Every step sealed in the rights ledger.', meta: 'Closed' },
] as const

type Outcome = 'removed' | 'retained' | 'notified'

const STORES: { store: string; kind: string; found: string; outcome: Outcome; result: string }[] = [
  { store: 'core.customers', kind: 'Postgres', found: 'email, phone', outcome: 'removed', result: 'Row deleted' },
  { store: 'support_tickets', kind: 'Helpdesk', found: '3 tickets', outcome: 'removed', result: 'Redacted' },
  { store: 'events_raw', kind: 'Warehouse', found: 'user_id', outcome: 'removed', result: 'Partition purged' },
  { store: 'invoices', kind: 'Billing', found: '2 invoices', outcome: 'retained', result: 'Kept for tax law · disclosed' },
  { store: 'Email vendor', kind: 'Processor', found: 'mailing list', outcome: 'notified', result: 'Deletion confirmed' },
]

const OUTCOME_STYLES: Record<Outcome, string> = {
  removed: 'bg-success/15 text-success border-success/30',
  retained: 'bg-warning/15 text-warning border-warning/30',
  notified: 'bg-info/15 text-info border-info/30',
}

export function DsarLifecycle() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-8 sm:px-8"
      role="img"
      aria-label="DSAR lifecycle: intake, identity verification, data discovery across stores, review, erasure with processor notification, and sealed evidence"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Erasure request · end to end
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">dsar-b72c48e · closed in 6 of 30 days</p>
      </div>

      {/* Stage track */}
      <ol className="relative grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <span
          className="pointer-events-none absolute left-[8%] right-[8%] top-5 hidden h-px bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 lg:block"
          aria-hidden="true"
        />
        {STAGES.map((s, i) => {
          const Icon = s.icon
          const highlighted = s.id === 'discover' || s.id === 'erase'
          return (
            <li key={s.id} className="relative flex gap-3 lg:flex-col lg:items-center lg:text-center">
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-card ${highlighted ? 'border-primary shadow-[var(--shadow-glow-primary)]' : 'border-primary/40'}`}
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <div className="lg:mt-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')} · {s.meta}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Discovery to deletion detail */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-xs font-semibold text-foreground">What discovery found, and what happened to it</p>
          <span className="rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
            Locate complete · 5 of 5 sources
          </span>
        </div>
        <div className="hidden grid-cols-[1.3fr_0.8fr_1fr_1.4fr] gap-3 border-b border-border px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:grid">
          <span>Store</span>
          <span>Type</span>
          <span>Found</span>
          <span>Result</span>
        </div>
        <ul className="divide-y divide-border">
          {STORES.map((row) => (
            <li key={row.store} className="grid grid-cols-2 gap-x-3 gap-y-1 px-4 py-2.5 sm:grid-cols-[1.3fr_0.8fr_1fr_1.4fr] sm:items-center">
              <span className="font-mono text-[11px] text-foreground">{row.store}</span>
              <span className="text-right text-[11px] text-muted-foreground sm:text-left">{row.kind}</span>
              <span className="text-[11px] text-muted-foreground">{row.found}</span>
              <span className="justify-self-end sm:justify-self-start">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${OUTCOME_STYLES[row.outcome]}`}>
                  {row.result}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-border bg-background-secondary/60 px-4 py-2.5 text-[11px] text-muted-foreground">
          If a source cannot be read, the request shows as a partial locate, not as complete. Anything kept under another
          law is named in the response to the Data Principal.
        </p>
      </div>
    </figure>
  )
}
