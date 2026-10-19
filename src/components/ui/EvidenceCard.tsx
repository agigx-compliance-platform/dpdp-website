'use client'

import type { ReactNode } from 'react'
import { SectionMark } from '@/components/ui/SectionMark'
import { cn } from '@/lib/utils'

const SEVERITY_CLASS: Record<string, string> = {
  critical: 'border-destructive/40 bg-destructive/10 text-destructive',
  high: 'border-warning/40 bg-warning/10 text-warning',
  medium: 'border-primary/30 bg-primary/10 text-primary',
  low: 'border-border bg-muted text-muted-foreground',
  info: 'border-border bg-muted text-muted-foreground',
}

export interface EvidenceCardProps {
  eyebrow?: string
  title: string
  section?: string
  severity?: string
  recordId?: string
  timestamp?: string
  children?: ReactNode
  footer?: string
  className?: string
}

/** Receipt-style evidence record used by Assessment results and Pitstop findings. */
export function EvidenceCard({
  eyebrow,
  title,
  section,
  severity,
  recordId,
  timestamp,
  children,
  footer,
  className,
}: EvidenceCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {eyebrow ? (
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {eyebrow}
            </span>
          ) : null}
          {section ? <SectionMark section={section} /> : null}
        </div>
        {severity ? (
          <span
            className={cn(
              'shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              SEVERITY_CLASS[severity] ?? SEVERITY_CLASS.info,
            )}
          >
            {severity}
          </span>
        ) : null}
      </div>
      <h4 className="text-sm font-semibold tracking-tight text-foreground">{title}</h4>
      {recordId ? (
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">ID: {recordId}</p>
      ) : null}
      {children ? <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{children}</div> : null}
      {timestamp ? (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">{timestamp}</p>
      ) : null}
      <div className="mt-3 border-t border-dashed border-border" />
      {footer ? <p className="mt-2 text-[11px] text-muted-foreground">{footer}</p> : null}
    </article>
  )
}
