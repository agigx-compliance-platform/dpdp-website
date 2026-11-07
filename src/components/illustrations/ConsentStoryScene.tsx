import { BellOff, Check, MailCheck, Save, Send } from 'lucide-react'

const STEPS = [
  { icon: MailCheck, title: 'A customer agrees', body: 'They say yes to marketing emails.' },
  { icon: Save, title: 'The choice is saved', body: 'With what they were told, and when.' },
  { icon: BellOff, title: 'They change their mind', body: 'Saying no is as easy as saying yes.' },
  { icon: Send, title: 'Everyone is told', body: 'Your systems and vendors stop using it.' },
]

const RECORD = [
  { label: 'Purpose', value: 'Marketing emails' },
  { label: 'Agreed', value: '15 Oct 2026, 9:04 pm' },
  { label: 'Withdrawn', value: '21 Oct 2026, 10:12 am' },
  { label: 'Status', value: 'Stopped' },
]

/** The product's core job, told as one customer's choice rather than as system parts. */
export function ConsentStoryScene() {
  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-background-secondary shadow-[var(--shadow-lg)]">
      <figcaption className="border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground">
        Example: one customer&apos;s choice, from start to finish
      </figcaption>
      <ol className="grid gap-px bg-border sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="bg-background-secondary p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <step.icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {i + 1}. {step.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="border-t border-border bg-card p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          The proof you keep
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          {RECORD.map((row) => (
            <div key={row.label}>
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  )
}
