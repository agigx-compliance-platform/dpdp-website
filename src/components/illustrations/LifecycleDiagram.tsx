const STAGES = [
  { id: 'discover', label: 'Discover', note: 'Inventory' },
  { id: 'map', label: 'Map', note: 'Lineage' },
  { id: 'consent', label: 'Consent', note: 'Notice and grant' },
  { id: 'rights', label: 'Rights', note: 'Access and erasure' },
  { id: 'evidence', label: 'Evidence', note: 'Ledger' },
] as const

export function LifecycleDiagram() {
  return (
    <div role="img" aria-label="Compliance lifecycle: Discover, Map, Consent, Rights, Evidence">
      <svg viewBox="0 0 720 28" className="mb-4 hidden h-auto w-full sm:block" aria-hidden="true">
        <path
          d="M 40 14 H 680"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
        {STAGES.map((_, i) => (
          <circle key={i} cx={40 + i * 160} cy="14" r="6" fill="hsl(var(--primary))" />
        ))}
      </svg>
      <ol className="grid gap-3 sm:grid-cols-5">
        {STAGES.map((stage, i) => (
          <li key={stage.id} className="p-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground">{stage.label}</p>
            <p className="mt-1 font-mono text-[11px] text-primary">{stage.note}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
