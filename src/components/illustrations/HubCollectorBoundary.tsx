export function HubCollectorBoundary() {
  return (
    <div
      className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"
      role="img"
      aria-label="Personal data stays in your network. The control plane holds an inventory, not rows."
    >
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Your network
        </p>
        <h3 className="mt-2 text-base font-semibold text-foreground">Where the data lives</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Databases, warehouses, and files stay on your side. Row values are not
          shipped out to build the inventory.
        </p>
      </div>
      <div className="hidden text-center text-xs text-primary md:block" aria-hidden>
        inventory
        <br />
        only →
      </div>
      <div className="rounded-xl border border-dashed border-border bg-background-secondary p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Control plane
        </p>
        <h3 className="mt-2 text-base font-semibold text-foreground">What we keep</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Names of systems and fields, classification, and the work to run next.
          Not a copy of the records.
        </p>
      </div>
    </div>
  )
}
