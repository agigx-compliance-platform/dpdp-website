import { Check } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { APPLICABILITY_EXCLUSIONS } from '@/lib/dpdp-facts'

const SIGNS = [
  'You keep customer names, phone numbers, or email addresses in a digital system',
  'You keep employee or job applicant records',
  'Your website or app uses forms, analytics, or advertising cookies',
  'You share people’s details with vendors, such as payment, delivery, or cloud providers',
  'You are based abroad and sell goods or services to people in India',
]

export function AppliesToYou() {
  return (
    <SectionWrapper id="does-it-apply">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Does this apply to me?
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            If you hold people&apos;s details, it probably does.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The Digital Personal Data Protection (DPDP) Act sets rules for how organisations collect, use, and
            delete personal details. Being a small organisation does not by itself take you out of scope.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{APPLICABILITY_EXCLUSIONS}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
          <h3 className="text-base font-semibold text-foreground">It probably applies if any of these is true:</h3>
          <ul className="mt-4 space-y-3">
            {SIGNS.map((sign) => (
              <li key={sign} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {sign}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  )
}
