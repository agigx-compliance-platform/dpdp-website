const PASSES = [
  {
    id: 'locate',
    title: 'Locate',
    read: 'The catalogs and stores you already run',
    leaves: 'An inventory of systems and fields. Not a copy of the rows.',
  },
  {
    id: 'classify',
    title: 'Classify',
    read: 'Which fields hold personal data',
    leaves: 'Labels the fiduciary can act on: contact, financial, child.',
  },
  {
    id: 'confirm',
    title: 'Confirm',
    read: 'Whether a rights lookup can hit an exact key',
    leaves: 'A list ready for access and erasure. Guesses are not filed as found.',
  },
] as const

export function DiscoveryPassesDiagram() {
  return (
    <ol
      className="grid gap-4 md:grid-cols-3"
      role="img"
      aria-label="Data discovery: locate stores, classify personal data, confirm rights lookups"
    >
      {PASSES.map((pass, i) => (
        <li key={pass.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Step {i + 1}
          </p>
          <h3 className="mt-2 text-base font-semibold text-foreground">{pass.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="text-foreground">Looks at:</span> {pass.read}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-foreground">Produces:</span> {pass.leaves}
          </p>
        </li>
      ))}
    </ol>
  )
}
