import { Cloud, Code2, Container, ShieldAlert, UserRound } from 'lucide-react'

const ESTATES = [
  { name: 'AWS', icon: Cloud, open: 3 },
  { name: 'Azure', icon: Cloud, open: 1 },
  { name: 'GCP', icon: Cloud, open: 0 },
  { name: 'Kubernetes', icon: Container, open: 1 },
  { name: 'Repositories', icon: Code2, open: 2 },
] as const

type Severity = 'critical' | 'high' | 'medium'

const FINDINGS: { title: string; where: string; store: string; owner: string; severity: Severity; section: string }[] = [
  {
    title: 'Storage bucket readable by anyone',
    where: 'AWS · s3://exports-2024',
    store: 'Holds customer exports with email and phone',
    owner: 'Data platform',
    severity: 'critical',
    section: '8(5)',
  },
  {
    title: 'Service account can read every table',
    where: 'GCP · analytics-runner',
    store: 'Reaches kyc_facts with PAN numbers',
    owner: 'Analytics',
    severity: 'high',
    section: '8(5)',
  },
  {
    title: 'PAN-shaped values in a config file',
    where: 'Repo · billing-service/test.env',
    store: 'Not in any known store yet',
    owner: 'Payments',
    severity: 'high',
    section: '8(5)',
  },
  {
    title: 'Pod logs keep email addresses for 400 days',
    where: 'Kubernetes · checkout namespace',
    store: 'Longer than the purpose needs',
    owner: 'Platform',
    severity: 'medium',
    section: '8(7)',
  },
]

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: 'bg-severity-critical/15 text-severity-critical border-severity-critical/30',
  high: 'bg-destructive/15 text-destructive border-destructive/30',
  medium: 'bg-warning/15 text-warning border-warning/30',
}

export function InfraPostureFindings() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 sm:px-6"
      role="img"
      aria-label="Infrastructure posture across AWS, Azure, GCP, Kubernetes and code repositories, with four findings that put personal data in reach, each with an owner and a DPDP section"
    >
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {ESTATES.map((e) => {
          const Icon = e.icon
          return (
            <li key={e.name} className="rounded-xl border border-border bg-card px-3 py-2.5">
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${e.open > 0 ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'}`}
                >
                  {e.open > 0 ? `${e.open} open` : 'Clear'}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-foreground">{e.name}</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
            Posture list
          </p>
          <span className="text-[10px] text-muted-foreground">Ranked by what personal data is in reach</span>
        </div>
        <ul className="divide-y divide-border">
          {FINDINGS.map((f) => (
            <li key={f.title} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{f.title}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{f.where}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{f.store}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                  <UserRound className="h-3 w-3" aria-hidden="true" />
                  {f.owner}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">§{f.section}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${SEVERITY_STYLES[f.severity]}`}>
                  {f.severity}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="border-t border-border bg-background-secondary/60 px-4 py-2.5 text-[11px] text-muted-foreground">
          Each finding links to the store in your data inventory, so the fix is ranked by the people it affects.
        </p>
      </div>
    </figure>
  )
}
