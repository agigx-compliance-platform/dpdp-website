import { Check, Cookie, FileDown, FileSearch, FileText, Globe, Layers, UserCheck } from 'lucide-react'

const PHASES = [
  { icon: Cookie, title: 'Cookies', result: '23 found · 6 before consent' },
  { icon: FileText, title: 'Legal pages', result: 'Privacy and cookie policy' },
  { icon: FileSearch, title: 'Policy analysis', result: '3 DPDP gaps' },
  { icon: UserCheck, title: 'Rights check', result: 'Email only, no form' },
  { icon: Layers, title: 'Subpages', result: '14 pages scanned' },
] as const

type Severity = 'high' | 'medium' | 'low'

const FINDINGS: { title: string; detail: string; severity: Severity }[] = [
  { title: '6 cookies set before any choice', detail: 'Analytics and ads load on first paint', severity: 'high' },
  { title: '2 trackers not named in the policy', detail: 'A session-replay script and an ad pixel', severity: 'high' },
  { title: 'No way to file a rights request online', detail: 'Only a privacy email is published', severity: 'medium' },
  { title: 'Grievance officer not named', detail: 'Policy gives no contact or timeline', severity: 'medium' },
]

const SEVERITY_STYLES: Record<Severity, string> = {
  high: 'bg-destructive/15 text-destructive border-destructive/30',
  medium: 'bg-warning/15 text-warning border-warning/30',
  low: 'bg-info/15 text-info border-info/30',
}

const SCORE = 74
const GRADE = 'B'

function ScoreRing() {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" aria-hidden="true">
      <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(SCORE / 100) * c} ${c}`}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill="hsl(var(--foreground))">
        {SCORE}
      </text>
      <text x="60" y="80" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
        of 100
      </text>
    </svg>
  )
}

export function TrustScopeReport() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 sm:px-6"
      role="img"
      aria-label="TrustScope scan report for shop.example.in: score 74 of 100, grade B, five scan phases complete, and four findings ranked by severity"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            shop.example.in
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">Scanned 24 Oct 2026, 11:20 IST · public pages only</p>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start">
            <ScoreRing />
            <div>
              <p className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{GRADE}</span>
                <span className="text-xs text-muted-foreground">Health grade</span>
              </p>
              <p className="mt-1 max-w-[13rem] text-[11px] leading-snug text-muted-foreground">
                Fix the two high findings to reach A.
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
              {PHASES.map((p) => {
                const Icon = p.icon
                return (
                  <li key={p.title} className="rounded-xl border border-border bg-background-secondary p-3">
                    <div className="flex items-center justify-between">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15">
                        <Check className="h-2.5 w-2.5 text-success" strokeWidth={3} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-foreground">{p.title}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{p.result}</p>
                  </li>
                )
              })}
            </ol>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Findings</p>
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
              {FINDINGS.map((f) => (
                <li key={f.title} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{f.title}</p>
                    <p className="text-[11px] text-muted-foreground">{f.detail}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${SEVERITY_STYLES[f.severity]}`}>
                    {f.severity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background-secondary/60 px-5 py-3">
          <p className="text-[11px] text-muted-foreground">Nothing is installed on your site. The scan reads what any visitor&apos;s browser sees.</p>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground">
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            PDF report
          </span>
        </div>
      </div>
    </figure>
  )
}
