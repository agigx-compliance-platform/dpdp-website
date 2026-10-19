'use client'

/**
 * StatusPill — coloured status indicator.
 * Statuses: Live, Cleared, In review, Blocked, Sealed.
 */

const STATUS_STYLES = {
  live: 'bg-success/15 text-success border-success/30',
  cleared: 'bg-success/10 text-success border-success/25',
  'in-review': 'bg-warning/15 text-warning border-warning/30',
  blocked: 'bg-destructive/15 text-destructive border-destructive/30',
  sealed: 'bg-muted text-muted-foreground border-border',
} as const

type Status = keyof typeof STATUS_STYLES

interface StatusPillProps {
  status: Status
  label?: string
  className?: string
}

export function StatusPill({ status, label, className = '' }: StatusPillProps) {
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${STATUS_STYLES[status]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'live' ? 'bg-success animate-pulse' :
          status === 'cleared' ? 'bg-success' :
          status === 'in-review' ? 'bg-warning' :
          status === 'blocked' ? 'bg-destructive' :
          'bg-muted-foreground'
        }`}
      />
      {displayLabel}
    </span>
  )
}
