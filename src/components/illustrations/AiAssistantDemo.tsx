import { Bot, ClipboardCheck, Send, Sparkles, AlertTriangle } from 'lucide-react'

const GAPS = [
  { title: 'No withdrawal option in the mobile app', section: '6(4)', severity: 'high' },
  { title: 'Processor contracts not on file', section: '8(2)', severity: 'high' },
  { title: 'Grievance contact not published', section: '8(10)', severity: 'medium' },
] as const

const SEVERITY_STYLES = {
  high: 'bg-destructive/15 text-destructive border-destructive/30',
  medium: 'bg-warning/15 text-warning border-warning/30',
} as const

const SCORE = 62

function ScoreRing({ value }: { value: number }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="hsl(var(--warning))"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="700" fill="hsl(var(--foreground))">
        {value}
      </text>
    </svg>
  )
}

function Chat() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">DPDP Assistant</p>
          <p className="text-[10px] text-muted-foreground">Act 2023 · Rules 2025 · IT Act</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 p-4">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-xs leading-relaxed text-primary-foreground">
          Do we need fresh consent to send order updates on WhatsApp?
        </div>
        <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-background-secondary px-3.5 py-3 text-xs leading-relaxed text-foreground">
          <p>
            <span className="font-semibold">Usually not.</span> If the customer gave their number for the order and has
            not objected, this is a legitimate use for that purpose.
          </p>
          <p className="mt-2">Promotional messages on the same number are a new purpose and need separate consent.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['Section 7(a)', 'Section 6(1)'].map((s) => (
              <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Draft the notice text', 'What about existing users?'].map((q) => (
            <span key={q} className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
              {q}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border p-3">
        <span className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[11px] text-muted-foreground">
          Ask about consent, rights, children&apos;s data…
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Send className="h-3.5 w-3.5 text-primary-foreground" aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}

function Audit() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          Readiness audit
        </p>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">18 of 18 answered</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <ScoreRing value={SCORE} />
        <div>
          <p className="text-sm font-semibold text-foreground">Partly ready</p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">Across 6 domains of the Act. 3 gaps to close first.</p>
        </div>
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Top gaps</p>
      <ul className="mt-2 space-y-2">
        {GAPS.map((g) => (
          <li key={g.title} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background-secondary px-3 py-2">
            <span className="text-[11px] leading-snug text-foreground">{g.title}</span>
            <span className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[9px] ${SEVERITY_STYLES[g.severity]}`}>
              §{g.section}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-start gap-2 pt-4 text-[11px] text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
        Highest exposure: security safeguards, up to ₹250 crore under the Schedule.
      </div>
    </div>
  )
}

export function AiAssistantDemo() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 sm:px-6"
      role="img"
      aria-label="AI compliance assistant answering a DPDP question with section citations, next to a readiness audit with a score of 62, three top gaps, and the highest penalty exposure"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 30% 40%, hsl(var(--primary) / 0.08), transparent 70%)' }}
        aria-hidden="true"
      />
      <p className="relative mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Ask, then audit
      </p>
      <div className="relative grid gap-4 md:grid-cols-[1.25fr_1fr]">
        <Chat />
        <Audit />
      </div>
      <p className="relative mt-4 text-[11px] text-muted-foreground">
        Answers cite the section they rely on. Guidance, not a substitute for legal advice.
      </p>
    </figure>
  )
}
