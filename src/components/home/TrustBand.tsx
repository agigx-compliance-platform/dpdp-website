const ITEMS = [
  {
    title: 'Made for India’s law',
    body: 'Written against the DPDP Act 2023 and the 2025 Rules, not adapted from a European template.',
  },
  {
    title: 'Your data stays with you',
    body: 'Use our cloud service or host it yourself. Your customer records stay in your own network.',
  },
  {
    title: 'Software and experts',
    body: 'Tools that do the daily work, with advisers who help you decide what your business needs.',
  },
]

export function TrustBand() {
  return (
    <section className="border-y border-border bg-background-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {ITEMS.map((item) => (
          <div key={item.title}>
            <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
