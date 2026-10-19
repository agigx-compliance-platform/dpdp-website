export function DiscoveryScene() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-8 pb-28 sm:px-8 md:min-h-[360px]"
      role="img"
      aria-label="Discovery path: locate stores, classify personal data, confirm an exact lookup"
    >
      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Inside your network
      </p>

      <svg
        viewBox="0 0 720 280"
        className="hidden h-auto w-full md:block"
        aria-hidden="true"
      >
        <path
          d="M 70 140 C 180 140, 180 70, 280 70 S 380 70, 440 140 S 560 210, 650 210"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="70" cy="140" r="7" fill="hsl(var(--primary))" />
        <circle cx="280" cy="70" r="7" fill="hsl(var(--primary))" />
        <circle cx="440" cy="140" r="7" fill="hsl(var(--primary))" />
        <circle cx="650" cy="210" r="7" fill="hsl(var(--primary))" />

        <text x="70" y="178" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
          Catalog
        </text>
        <text x="280" y="48" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="13" fontWeight="600">
          Locate
        </text>
        <text x="280" y="108" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
          Stores and fields
        </text>
        <text x="440" y="118" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="13" fontWeight="600">
          Classify
        </text>
        <text x="440" y="178" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
          Contact, financial, child
        </text>
        <text x="650" y="188" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="13" fontWeight="600">
          Confirm
        </text>
        <text x="650" y="248" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
          Exact lookup
        </text>
      </svg>

      <ol className="grid gap-3 md:hidden">
        {['Catalog already there', 'Locate stores and fields', 'Classify personal data', 'Confirm an exact lookup'].map(
          (step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm text-foreground">{step}</span>
            </li>
          ),
        )}
      </ol>

      <div className="mt-6 max-w-sm rounded-2xl border border-dashed border-border bg-card p-4 shadow-[var(--shadow-sm)] md:absolute md:bottom-6 md:right-8">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Inventory</p>
        <p className="mt-1 font-mono text-sm text-foreground">customers.email</p>
        <p className="mt-2 text-xs text-muted-foreground">Contact identifier. Indexed for rights. Rows stay put.</p>
      </div>
    </div>
  )
}
