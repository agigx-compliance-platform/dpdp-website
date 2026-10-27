import { Check, LayoutDashboard, ScrollText, UserPlus } from 'lucide-react'

const REGISTRATION_PURPOSES = [
  { name: 'Create and run my account', note: 'Required to sign up', checked: true, required: true },
  { name: 'Order updates on WhatsApp', note: 'Optional', checked: true },
  { name: 'Offers and newsletters', note: 'Optional', checked: false },
] as const

const COCKPIT_PURPOSES = [
  { name: 'Order updates', since: 'Granted 02 Oct', on: true },
  { name: 'Personalised offers', since: 'Withdrawn today', on: false, changed: true },
  { name: 'Product analytics', since: 'Granted 02 Oct', on: true },
] as const

const LEDGER_ROWS = [
  { label: 'Purpose', value: 'pur_offers' },
  { label: 'Notice', value: 'v3 · EN' },
  { label: 'Channel', value: 'Cockpit' },
  { label: 'Action', value: 'Withdrawn' },
] as const

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${checked ? 'border-primary bg-primary' : 'border-border bg-background'}`}
      aria-hidden="true"
    >
      {checked ? <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} /> : null}
    </span>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full ${on ? 'bg-primary' : 'bg-muted'}`} aria-hidden="true">
      <span className={`absolute h-3 w-3 rounded-full bg-white shadow ${on ? 'left-3.5' : 'left-0.5'}`} />
    </span>
  )
}

function SourceLabel({ icon: Icon, step, title }: { icon: typeof UserPlus; step: string; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{step}</p>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
    </div>
  )
}

function RegistrationForm() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-md)]">
      <p className="text-xs font-semibold text-foreground">Create your account</p>
      <div className="mt-3 space-y-2" aria-hidden="true">
        {['Full name', 'Mobile number'].map((field) => (
          <div key={field} className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[10px] text-muted-foreground">
            {field}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        How we may use your data
      </p>
      <ul className="mt-2 space-y-2">
        {REGISTRATION_PURPOSES.map((p) => (
          <li key={p.name} className="flex gap-2">
            <Checkbox checked={p.checked} />
            <div>
              <p className="text-[11px] font-medium text-foreground">{p.name}</p>
              <p className="text-[9px] text-muted-foreground">{p.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-md bg-primary py-1.5 text-center text-[11px] font-medium text-primary-foreground">
        Sign up
      </div>
    </div>
  )
}

function CockpitPanel() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">My consents</p>
        <span className="rounded-full border border-border px-2 py-0.5 text-[9px] text-muted-foreground">Data Principal view</span>
      </div>
      <ul className="mt-3 divide-y divide-border">
        {COCKPIT_PURPOSES.map((p) => (
          <li
            key={p.name}
            className={`flex items-center justify-between gap-3 py-2.5 ${'changed' in p && p.changed ? '-mx-2 rounded-lg bg-primary/5 px-2' : ''}`}
          >
            <div>
              <p className="text-[11px] font-medium text-foreground">{p.name}</p>
              <p className={`text-[9px] ${'changed' in p && p.changed ? 'text-primary' : 'text-muted-foreground'}`}>{p.since}</p>
            </div>
            <Toggle on={p.on} />
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[10px]">
        <span className="rounded-md border border-border py-1.5 text-foreground">Download receipt</span>
        <span className="rounded-md border border-border py-1.5 text-foreground">Raise a request</span>
      </div>
    </div>
  )
}

function LedgerReceipt() {
  return (
    <div className="relative rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-[var(--shadow-glow-primary)]">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-primary" aria-hidden="true" />
        <p className="text-xs font-semibold text-foreground">Consent ledger</p>
        <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-medium text-success">Sealed</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        {LEDGER_ROWS.map((r) => (
          <div key={r.label}>
            <dt className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{r.label}</dt>
            <dd className="font-mono text-[11px] text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 border-t border-dashed border-border pt-2 font-mono text-[9px] text-muted-foreground">
        cr-41d9e07 · 21 Oct 2026, 10:12 IST
      </div>
    </div>
  )
}

/** Arrow from a capture point into the ledger. Points down on small screens, sideways on large. */
function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 lg:flex-col lg:py-0" aria-hidden="true">
      <span className="h-6 w-px bg-primary/40 lg:h-px lg:w-10" />
      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">{label}</span>
      <span className="h-6 w-px bg-primary/40 lg:h-px lg:w-10" />
    </div>
  )
}

export function PurposeConsentCapture() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-8 sm:px-8"
      role="img"
      aria-label="Purpose consent is captured at registration with separate checkboxes, and changed later in the Consent Cockpit. Both write to the same consent ledger record."
    >
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_minmax(0,0.9fr)]">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <SourceLabel icon={UserPlus} step="At sign-up" title="Registration form" />
            <RegistrationForm />
          </div>
          <div>
            <SourceLabel icon={LayoutDashboard} step="Any time later" title="Consent Cockpit" />
            <CockpitPanel />
          </div>
        </div>

        <FlowArrow label="same purpose IDs" />

        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">One record</p>
          <LedgerReceipt />
          <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <li>Each purpose is a separate choice. Nothing is bundled into sign-up.</li>
            <li>The notice version the person saw is stored with the choice.</li>
            <li>Withdrawing in the cockpit uses the same purpose as the original grant.</li>
          </ul>
        </div>
      </div>
    </figure>
  )
}
