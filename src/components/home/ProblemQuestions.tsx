import { SectionWrapper } from '@/components/ui/SectionWrapper'

const QUESTIONS = [
  {
    q: 'Consent lives in a banner. Processing lives in six other systems.',
    a: 'A grant is not proof unless the same purpose reaches CRM, warehouse, and vendors. Withdrawal has to follow it.',
  },
  {
    q: 'You cannot list every store that holds a Data Principal.',
    a: 'Erasure without an inventory is a guess. Discovery starts from the catalogs you already run, not a spreadsheet of system names.',
  },
  {
    q: 'A processor still has last week’s consent.',
    a: 'Vendor oversight is not a register on a slide. A change in consent or a rights ticket has to reach the parties who still hold the data.',
  },
  {
    q: 'The public site says one thing. The tags load another.',
    a: 'A scan that never opens the page will miss tags that fire before a choice. Pitstop and TrustScope run against the live property.',
  },
] as const

export function ProblemQuestions() {
  return (
    <SectionWrapper id="problems">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Where programmes stall
        </p>
        <h2 className="mt-3 whitespace-nowrap text-[clamp(1rem,2.5vw,2.25rem)] font-semibold tracking-tight">
          Four questions a policy pack cannot answer.
        </h2>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {QUESTIONS.map((item) => (
          <li key={item.q} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
            <h3 className="text-lg font-semibold text-foreground">{item.q}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  )
}
