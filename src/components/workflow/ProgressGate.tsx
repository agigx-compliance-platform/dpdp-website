'use client'

/**
 * ProgressGate — shows approval gate progress, e.g. "2/3 approved".
 */

interface ProgressGateProps {
  current: number
  total: number
  label?: string
  className?: string
}

export function ProgressGate({ current, total, label, className = '' }: ProgressGateProps) {
  const pct = Math.min(100, Math.round((current / total) * 100))

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-muted-foreground">
            {label ?? 'Approval'}
          </span>
          <span className="text-[11px] font-mono font-medium text-foreground">
            {current}/{total}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
