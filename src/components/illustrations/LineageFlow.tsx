import { CircleDashed, Database, GitBranch, Server, Share2, Workflow } from 'lucide-react'

type Evidence = 'query' | 'pipeline' | 'job' | 'infra'

const EVIDENCE: Record<Evidence, { label: string; color: string }> = {
  query: { label: 'Query history', color: 'hsl(var(--info))' },
  pipeline: { label: 'Pipeline definition', color: 'hsl(var(--primary))' },
  job: { label: 'Job run', color: 'hsl(var(--warning))' },
  infra: { label: 'Infrastructure', color: 'hsl(var(--severity-critical))' },
}

type Stage = 'source' | 'transform' | 'warehouse' | 'consumer'

const STAGES: { id: Stage; label: string; icon: typeof Database }[] = [
  { id: 'source', label: 'Sources', icon: Database },
  { id: 'transform', label: 'Pipelines', icon: Workflow },
  { id: 'warehouse', label: 'Warehouse', icon: Server },
  { id: 'consumer', label: 'Used by', icon: Share2 },
]

type FlowNode = {
  id: string
  stage: Stage
  row: number
  name: string
  kind: string
  fields: string[]
  /** On the traced path of customers.email. */
  traced?: boolean
  external?: boolean
}

const NODES: FlowNode[] = [
  { id: 'app', stage: 'source', row: 0, name: 'core.customers', kind: 'Postgres', fields: ['email', 'phone', 'pan'], traced: true },
  { id: 'forms', stage: 'source', row: 1, name: 'web_leads', kind: 'Form store', fields: ['email', 'name'] },
  { id: 'stg', stage: 'transform', row: 0, name: 'stg_customers', kind: 'dbt model', fields: ['email', 'pan'], traced: true },
  { id: 'leads', stage: 'transform', row: 1, name: 'leads_daily', kind: 'Airflow DAG', fields: ['email'] },
  { id: 'kyc', stage: 'warehouse', row: 0, name: 'kyc_facts', kind: 'Snowflake', fields: ['email', 'pan'], traced: true },
  { id: 'mkt', stage: 'warehouse', row: 1, name: 'marketing_audience', kind: 'BigQuery', fields: ['email'] },
  { id: 'vendor', stage: 'consumer', row: 0, name: 'KYC vendor', kind: 'Processor', fields: ['pan'], traced: true, external: true },
  { id: 'bi', stage: 'consumer', row: 1, name: 'Risk dashboard', kind: 'BI', fields: ['email'] },
  { id: 'esp', stage: 'consumer', row: 2, name: 'Email platform', kind: 'Processor', fields: ['email'], external: true },
]

const EDGES: { from: string; to: string; evidence: Evidence }[] = [
  { from: 'app', to: 'stg', evidence: 'pipeline' },
  { from: 'forms', to: 'leads', evidence: 'job' },
  { from: 'stg', to: 'kyc', evidence: 'query' },
  { from: 'leads', to: 'mkt', evidence: 'job' },
  { from: 'kyc', to: 'vendor', evidence: 'infra' },
  { from: 'kyc', to: 'bi', evidence: 'query' },
  { from: 'mkt', to: 'esp', evidence: 'infra' },
]

const UNKNOWN = ['legacy_crm (no catalog access)', 's3://exports/2024', 'support_attachments', 'partner_sftp']

/* Diagram geometry, in viewBox units. */
const W = 1000
const COL_X = [20, 276, 532, 788]
const CARD_W = 192
const CARD_H = 92
const ROW_Y0 = 64
const ROW_GAP = 120
const H = ROW_Y0 + ROW_GAP * 2 + CARD_H + 24

const stageIndex = (s: Stage) => STAGES.findIndex((st) => st.id === s)
const nodeBox = (n: FlowNode) => ({ x: COL_X[stageIndex(n.stage)], y: ROW_Y0 + n.row * ROW_GAP })
const byId = new Map(NODES.map((n) => [n.id, n]))

function edgePath(from: FlowNode, to: FlowNode) {
  const a = nodeBox(from)
  const b = nodeBox(to)
  const x1 = a.x + CARD_W
  const y1 = a.y + CARD_H / 2
  const x2 = b.x
  const y2 = b.y + CARD_H / 2
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

function NodeCard({ node }: { node: FlowNode }) {
  const { x, y } = nodeBox(node)
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={CARD_W}
        height={CARD_H}
        rx={14}
        fill="hsl(var(--card))"
        stroke={node.traced ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
        strokeWidth={node.traced ? 1.75 : 1}
        strokeDasharray={node.external ? '5 4' : undefined}
      />
      <text x={x + 16} y={y + 26} fontSize={13} fontWeight={600} fill="hsl(var(--foreground))" fontFamily="var(--font-mono, monospace)">
        {node.name}
      </text>
      <text x={x + 16} y={y + 44} fontSize={11} fill="hsl(var(--muted-foreground))">
        {node.kind}
      </text>
      {node.fields.map((f, i) => {
        const fx = x + 16 + i * 58
        const highlight = node.traced && (f === 'email' || f === 'pan')
        return (
          <g key={f}>
            <rect
              x={fx}
              y={y + 58}
              width={52}
              height={20}
              rx={10}
              fill={highlight ? 'hsl(var(--primary) / 0.14)' : 'hsl(var(--muted))'}
            />
            <text
              x={fx + 26}
              y={y + 72}
              fontSize={10}
              textAnchor="middle"
              fill={highlight ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
              fontFamily="var(--font-mono, monospace)"
            >
              {f}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function LineageFlow() {
  return (
    <figure
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary px-4 py-6 shadow-[var(--shadow-md)] sm:px-6"
      role="img"
      aria-label="Data lineage: core.customers flows through the stg_customers pipeline into kyc_facts and on to a KYC vendor and a risk dashboard. Web leads flow through a daily job into a marketing audience used by an email platform. Four stores are still unknown."
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
          Where personal data goes
        </p>
        <p className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] text-primary">
          Tracing customers.email and pan
        </p>
      </div>

      {/* Desktop: one scalable diagram */}
      <svg viewBox={`0 0 ${W} ${H}`} className="hidden h-auto w-full md:block" aria-hidden="true">
        <defs>
          <style>{`
            @keyframes lineage-flow { to { stroke-dashoffset: -24; } }
            .lineage-traced { animation: lineage-flow 1.2s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .lineage-traced { animation: none; } }
          `}</style>
        </defs>

        {STAGES.map((s, i) => (
          <g key={s.id}>
            <rect x={COL_X[i] - 8} y={8} width={CARD_W + 16} height={H - 16} rx={18} fill="hsl(var(--background) / 0.55)" />
            <text
              x={COL_X[i] + 8}
              y={38}
              fontSize={10}
              fontWeight={600}
              letterSpacing={2}
              fill="hsl(var(--muted-foreground))"
            >
              {String(i + 1).padStart(2, '0')} · {s.label.toUpperCase()}
            </text>
          </g>
        ))}

        {EDGES.map((e) => {
          const from = byId.get(e.from)!
          const to = byId.get(e.to)!
          const traced = from.traced && to.traced
          const d = edgePath(from, to)
          return (
            <g key={`${e.from}-${e.to}`}>
              <path d={d} fill="none" stroke={EVIDENCE[e.evidence].color} strokeOpacity={traced ? 0.9 : 0.45} strokeWidth={traced ? 2.25 : 1.5} />
              {traced ? (
                <path
                  d={d}
                  fill="none"
                  stroke="hsl(var(--background))"
                  strokeWidth={2.25}
                  strokeDasharray="4 8"
                  className="lineage-traced"
                />
              ) : null}
            </g>
          )
        })}

        {NODES.map((n) => (
          <NodeCard key={n.id} node={n} />
        ))}
      </svg>

      {/* Mobile: the same flow as stacked stages */}
      <ol className="space-y-4 md:hidden">
        {STAGES.map((s, i) => {
          const Icon = s.icon
          return (
            <li key={s.id}>
              <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {String(i + 1).padStart(2, '0')} · {s.label}
              </p>
              <div className="grid gap-2">
                {NODES.filter((n) => n.stage === s.id).map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl border bg-card p-3 ${n.traced ? 'border-primary' : 'border-border'} ${n.external ? 'border-dashed' : ''}`}
                  >
                    <p className="font-mono text-xs font-semibold text-foreground">{n.name}</p>
                    <p className="text-[11px] text-muted-foreground">{n.kind}</p>
                    <p className="mt-2 flex flex-wrap gap-1">
                      {n.fields.map((f) => (
                        <span key={f} className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {f}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">How each link was found</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(EVIDENCE) as Evidence[]).map((k) => (
              <li key={k} className="flex items-center gap-2 text-xs text-foreground">
                <span className="h-0.5 w-5 rounded-full" style={{ background: EVIDENCE[k].color }} aria-hidden="true" />
                {EVIDENCE[k].label}
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs text-foreground">
              <span className="h-3 w-5 rounded border border-dashed border-muted-foreground" aria-hidden="true" />
              Leaves your network
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <CircleDashed className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              Coverage: 18 of 22 stores mapped
            </p>
            <span className="font-mono text-[10px] text-muted-foreground">4 unknown</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(18 / 22) * 100}%` }} />
          </div>
          <p className="mt-3 flex flex-wrap gap-1.5">
            {UNKNOWN.map((u) => (
              <span key={u} className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {u}
              </span>
            ))}
          </p>
        </div>
      </div>
    </figure>
  )
}
