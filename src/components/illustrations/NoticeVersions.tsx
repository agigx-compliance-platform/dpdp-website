import { FileText, Globe, History, Plus } from 'lucide-react'

const PURPOSES = [
  { id: 'pur_account', name: 'Run your account' },
  { id: 'pur_orders', name: 'Order updates' },
  { id: 'pur_offers', name: 'Offers and newsletters' },
] as const

const VERSIONS = [
  { v: 'v3', state: 'Live', date: '21 Oct 2026', note: 'Adds WhatsApp as a channel for order updates', grants: '1,240 grants on this version', live: true },
  { v: 'v2', state: 'Superseded', date: '04 Jun 2026', note: 'Grants stay tied to v2. 312 people are asked again.', grants: '' },
  { v: 'v1', state: 'Archived', date: '12 Jan 2026', note: 'Kept as the text people actually saw', grants: '' },
] as const

const TYPES = [
  { name: 'Privacy notice', ready: true },
  { name: 'Cookie policy', ready: true },
  { name: "Children's notice", ready: false },
  { name: 'Processor list', ready: false },
  { name: 'AI disclosure', ready: false },
] as const

function NoticeDocument() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
          Privacy notice
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-medium text-success">v3 · Live</span>
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-border p-0.5 text-[10px]">
          <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground">EN</span>
          <span className="px-2 py-0.5 text-muted-foreground">हिन्दी</span>
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">What we use your data for</p>
          <ul className="mt-2 space-y-1.5">
            {PURPOSES.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-background-secondary px-2.5 py-1.5">
                <span className="text-[11px] text-foreground">{p.name}</span>
                <span className="font-mono text-[9px] text-primary">{p.id}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your rights</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Access, correction, erasure, and nominating someone to act for you. Withdraw consent from your account at any
            time.
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-border px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Grievance officer</p>
          <p className="mt-1 text-[11px] text-foreground">Named contact · reply within the published timeline</p>
        </div>
      </div>
    </div>
  )
}

function VersionHistory() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-md)]">
      <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <History className="h-4 w-4 text-primary" aria-hidden="true" />
        Version history
      </p>
      <ol className="relative mt-4 space-y-4 pl-5">
        <span className="absolute bottom-2 left-[5px] top-2 w-px bg-border" aria-hidden="true" />
        {VERSIONS.map((ver) => (
          <li key={ver.v} className="relative">
            <span
              className={`absolute -left-5 top-1 h-[11px] w-[11px] rounded-full border-2 ${'live' in ver && ver.live ? 'border-primary bg-primary' : 'border-border bg-card'}`}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-xs font-semibold text-foreground">{ver.v}</span>
              <span className={`text-[10px] ${'live' in ver && ver.live ? 'text-success' : 'text-muted-foreground'}`}>{ver.state}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{ver.date}</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{ver.note}</p>
            {ver.grants ? <p className="mt-1 text-[10px] text-primary">{ver.grants}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function NoticeVersions() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 sm:px-6"
      role="img"
      aria-label="A versioned privacy notice in English and Hindi listing purposes with IDs, next to its version history where each consent stays tied to the version the person saw"
    >
      <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        One notice, every version kept
      </p>
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <NoticeDocument />
        <VersionHistory />
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <li
            key={t.name}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${t.ready ? 'border-primary/30 bg-primary/10 text-foreground' : 'border-dashed border-border text-muted-foreground'}`}
          >
            {t.ready ? <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" /> : <Plus className="h-3 w-3" aria-hidden="true" />}
            {t.name}
            {t.ready ? null : <span className="text-[10px]">· can be added</span>}
          </li>
        ))}
      </ul>
    </figure>
  )
}
