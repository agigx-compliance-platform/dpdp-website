import { CONNECTOR_MARK } from '@/lib/connectors'
import { cn } from '@/lib/utils'

export function ConnectorMark({ name, className = '' }: { name: string; className?: string }) {
  const stem = CONNECTOR_MARK[name]
  if (!stem) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary font-mono text-[10px] text-muted-foreground',
          className,
        )}
      >
        {name.slice(0, 1)}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/connectors/${stem}.svg`}
      alt=""
      className={cn('connector-mark h-5 w-5 shrink-0', className)}
    />
  )
}
