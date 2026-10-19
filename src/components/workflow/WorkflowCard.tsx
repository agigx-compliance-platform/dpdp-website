'use client'

/**
 * WorkflowCard — eyebrow label, title, key/value rows, and a footer.
 * Used inside ConnectorCanvas to represent product states.
 *
 * The receipt/ledger motif: monospaced record ID, hash fragment,
 * timestamp in IST, and a dotted tear line.
 */

import { SectionMark } from '@/components/ui/SectionMark'
import { StatusPill } from './StatusPill'

export interface KeyValueRowData {
  label: string
  value: string
  mono?: boolean
}

export interface WorkflowCardProps {
  /** Small eyebrow label above the title. */
  eyebrow?: string
  /** Card title. */
  title: string
  /** Status indicator. */
  status?: 'live' | 'cleared' | 'in-review' | 'blocked' | 'sealed'
  /** DPDP section citation. */
  section?: string
  /** Key-value detail rows. */
  rows?: KeyValueRowData[]
  /** Record ID shown in mono font (receipt motif). */
  recordId?: string
  /** Hash fragment for the receipt motif. */
  hash?: string
  /** Timestamp string. */
  timestamp?: string
  /** Footer text. */
  footer?: string
  /** Show the dotted tear line at bottom. */
  tearLine?: boolean
  /** Optional additional className. */
  className?: string
  /** Card variant. */
  variant?: 'default' | 'receipt'
}

export function WorkflowCard({
  eyebrow,
  title,
  status,
  section,
  rows,
  recordId,
  hash,
  timestamp,
  footer,
  tearLine = false,
  className = '',
  variant = 'default',
}: WorkflowCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-border bg-card p-4
        shadow-[var(--shadow-sm)] transition-all duration-200
        hover:shadow-[var(--shadow-md)] hover:border-primary/20
        ${variant === 'receipt' ? 'font-mono' : ''}
        ${className}
      `}
    >
      {/* Eyebrow + Status row */}
      {(eyebrow || status || section) && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {eyebrow && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {section && <SectionMark section={section} />}
          </div>
          {status && <StatusPill status={status} />}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm font-semibold text-foreground mb-2 tracking-tight">{title}</h4>

      {/* Record ID (receipt motif) */}
      {recordId && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono text-muted-foreground">
            ID: {recordId}
          </span>
          {hash && (
            <span className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-[100px]">
              #{hash}
            </span>
          )}
        </div>
      )}

      {/* Key-Value rows */}
      {rows && rows.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-xs">
              <span className="text-muted-foreground shrink-0">{row.label}</span>
              <span className={`min-w-0 text-right text-card-foreground ${row.mono ? 'font-mono text-[11px]' : ''}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Timestamp */}
      {timestamp && (
        <div className="text-[10px] font-mono text-muted-foreground/60 mt-1">
          {timestamp}
        </div>
      )}

      {/* Tear line */}
      {tearLine && (
        <div className="mt-3 border-t border-dashed border-border" />
      )}

      {footer && (
        <div className={`text-[11px] text-muted-foreground ${tearLine ? 'mt-2' : 'mt-3'}`}>
          {footer}
        </div>
      )}
    </div>
  )
}

/** Compact key-value row used inside cards. */
export function KeyValueRow({ label, value, mono }: KeyValueRowData) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-card-foreground truncate ${mono ? 'font-mono text-[11px]' : ''}`}>
        {value}
      </span>
    </div>
  )
}
