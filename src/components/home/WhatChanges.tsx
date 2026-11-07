import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { DpdpTimeline } from '@/components/legal/DpdpTimeline'
import { HIGHEST_PENALTY_SENTENCE, PENALTY_CAVEAT } from '@/lib/dpdp-facts'

const CHANGES = [
  {
    title: 'You must tell people why',
    body: 'Before asking for consent, you must say clearly what details you collect and what you will do with them.',
  },
  {
    title: 'People can say no, or change their mind',
    body: 'Withdrawing consent must be as easy as giving it. After that, you and your vendors generally must stop using the details for that purpose.',
  },
  {
    title: 'People can ask about their data',
    body: 'They can ask to see, correct, or delete it. You need to know where it is stored so you can answer properly.',
  },
  {
    title: 'You must protect it, and report breaches',
    body: 'You need reasonable security. If a breach happens, you must tell the people affected and the regulator.',
  },
]

export function WhatChanges() {
  return (
    <SectionWrapper id="what-changes" className="bg-background-secondary/40">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          What changes for your business
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Four things you will need to be able to do.
        </h2>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {CHANGES.map((item) => (
          <li key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 max-w-2xl">
        <h3 className="text-2xl font-semibold tracking-tight">When does it start?</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          In stages, not on one day. Changing how a business handles data usually takes months, so it is worth starting
          before the main date.
        </p>
      </div>
      <div className="mt-8">
        <DpdpTimeline />
      </div>

      <div className="mt-14 max-w-3xl">
        <h3 className="text-2xl font-semibold tracking-tight">What if we ignore it?</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          The regulator, the Data Protection Board of India, can look into complaints and breaches and can impose
          penalties. {HIGHEST_PENALTY_SENTENCE}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{PENALTY_CAVEAT}</p>
      </div>
    </SectionWrapper>
  )
}
