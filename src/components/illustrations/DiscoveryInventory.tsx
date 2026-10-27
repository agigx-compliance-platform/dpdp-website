import { Check, Database, Lock, Search } from 'lucide-react'

type Label = 'Contact' | 'Financial' | 'Identity' | 'Child'
type Lookup = 'exact' | 'review'

const ROWS: { store: string; kind: string; field: string; label: Label; lookup: Lookup }[] = [
  { store: 'core.customers', kind: 'Postgres', field: 'email', label: 'Contact', lookup: 'exact' },
  { store: 'core.customers', kind: 'Postgres', field: 'pan_number', label: 'Identity', lookup: 'exact' },
  { store: 'payments.cards', kind: 'MySQL', field: 'card_last4', label: 'Financial', lookup: 'exact' },
  { store: 'events_raw', kind: 'Snowflake', field: 'user_id', label: 'Identity', lookup: 'exact' },
  { store: 'support_tickets', kind: 'Zendesk', field: 'body', label: 'Contact', lookup: 'review' },
  { store: 'learner_profiles', kind: 'MongoDB', field: 'date_of_birth', label: 'Child', lookup: 'exact' },
]

const LABEL_STYLES: Record<Label, string> = {
  Contact: 'bg-info/15 text-info border-info/30',
  Financial: 'bg-warning/15 text-warning border-warning/30',
  Identity: 'bg-primary/15 text-primary border-primary/30',
  Child: 'bg-severity-critical/15 text-severity-critical border-severity-critical/30',
}

const STEPS = [
  { title: 'Locate', note: '6 stores from existing catalogs' },
  { title: 'Classify', note: '41 personal fields labelled' },
  { title: 'Confirm', note: '38 ready for exact lookup' },
] as const

export function DiscoveryInventory() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 sm:px-6"
      role="img"
      aria-label="Data discovery inventory: personal data fields across six stores, each labelled contact, financial, identity or child, with whether a rights request can look it up by exact key"
    >
      <ol className="grid gap-2 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] text-primary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">{s.title}</p>
              <p className="text-[10px] text-muted-foreground">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Database className="h-4 w-4 text-primary" aria-hidden="true" />
            Personal data inventory
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground">
            <Search className="h-3 w-3" aria-hidden="true" />
            Filter by label or store
          </span>
        </div>
        <div className="hidden grid-cols-[1.4fr_1fr_0.9fr_1fr] gap-3 border-b border-border px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:grid">
          <span>Store</span>
          <span>Field</span>
          <span>Label</span>
          <span>Rights lookup</span>
        </div>
        <ul className="divide-y divide-border">
          {ROWS.map((r) => (
            <li
              key={`${r.store}.${r.field}`}
              className="grid grid-cols-2 gap-x-3 gap-y-1 px-4 py-2.5 sm:grid-cols-[1.4fr_1fr_0.9fr_1fr] sm:items-center"
            >
              <span className="min-w-0">
                <span className="block truncate font-mono text-[11px] text-foreground">{r.store}</span>
                <span className="text-[10px] text-muted-foreground">{r.kind}</span>
              </span>
              <span className="text-right font-mono text-[11px] text-foreground sm:text-left">{r.field}</span>
              <span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${LABEL_STYLES[r.label]}`}>{r.label}</span>
              </span>
              <span className="justify-self-end text-[11px] sm:justify-self-start">
                {r.lookup === 'exact' ? (
                  <span className="inline-flex items-center gap-1 text-success">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    Exact key
                  </span>
                ) : (
                  <span className="text-warning">Free text · needs review</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2 border-t border-border bg-background-secondary/60 px-4 py-2.5 text-[11px] text-muted-foreground">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          The inventory holds store and field names, not row values. Records stay in your network.
        </p>
      </div>
    </figure>
  )
}
