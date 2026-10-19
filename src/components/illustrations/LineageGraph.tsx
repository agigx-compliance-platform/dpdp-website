export function LineageGraph() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-8 sm:px-8"
      role="img"
      aria-label="Lineage: source table to transform to warehouse to processor, with coverage gaps listed"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          How it moved
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">Edged 18 / 22 · gaps listed</p>
      </div>

      <svg viewBox="0 0 720 220" className="hidden h-auto w-full md:block" aria-hidden="true">
        <path
          d="M 90 90 H 230 M 270 90 H 410 M 450 90 H 590"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
        <path
          d="M 90 90 V 170 H 590"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />

        {[
          { x: 90, title: 'core.customers', sub: 'Query history' },
          { x: 250, title: 'stg_customers', sub: 'Pipeline' },
          { x: 410, title: 'kyc_facts', sub: 'Job run' },
          { x: 570, title: 'KYC vendor', sub: 'Infrastructure' },
        ].map((n) => (
          <g key={n.title}>
            <circle cx={n.x} cy="90" r="10" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x={n.x} y="128" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="600">
              {n.title}
            </text>
            <text x={n.x} y="146" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
              {n.sub}
            </text>
          </g>
        ))}

        <circle cx="330" cy="170" r="6" fill="hsl(var(--warning))" />
        <text x="350" y="174" fill="hsl(var(--muted-foreground))" fontSize="11">
          Four stores still unknown
        </text>
      </svg>

      <ol className="grid gap-2 md:hidden">
        <li className="text-sm text-foreground">core.customers from query history</li>
        <li className="text-sm text-foreground">stg_customers from a pipeline</li>
        <li className="text-sm text-foreground">kyc_facts from a job run</li>
        <li className="text-sm text-foreground">KYC vendor from infrastructure</li>
        <li className="text-sm text-muted-foreground">Four stores still unknown</li>
      </ol>
    </div>
  )
}
