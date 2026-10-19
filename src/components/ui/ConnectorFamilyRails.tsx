import { ConnectorMark } from '@/components/ui/ConnectorMark'
import type { ConnectorCategory } from '@/lib/connectors'

function Wordmark({ name }: { name: string }) {
  return (
    <li className="flex shrink-0 items-center gap-3">
      <ConnectorMark name={name} className="h-8 w-8" />
      <span className="whitespace-nowrap text-sm font-medium tracking-tight text-foreground">
        {name}
      </span>
    </li>
  )
}

function fillTrack(items: string[], minChips = 16): string[] {
  const track: string[] = []
  if (items.length === 0) return track
  while (track.length < minChips) {
    track.push(...items)
  }
  return track
}

export function ConnectorLogoRail({
  families,
  direction = 'ltr',
}: {
  families: ConnectorCategory[]
  direction?: 'ltr' | 'rtl'
}) {
  const items = families.flatMap((family) => family.items)
  const track = fillTrack(items)
  const loop = [...track, ...track]
  const durationSec = Math.max(40, track.length * 2.2)
  const motionClass = direction === 'rtl' ? 'animate-marquee' : 'animate-marquee-ltr'

  return (
    <div className="overflow-hidden py-2">
      <ul className="hidden flex-wrap items-center justify-center gap-x-10 gap-y-4 motion-reduce:flex">
        {items.map((name) => (
          <Wordmark key={`static-${name}`} name={name} />
        ))}
      </ul>
      <ul
        className={`flex w-max items-center gap-x-14 motion-reduce:hidden hover:[animation-play-state:paused] ${motionClass}`}
        style={{ animationDuration: `${durationSec}s` }}
        aria-hidden
      >
        {loop.map((name, i) => (
          <Wordmark key={`${name}-${i}`} name={name} />
        ))}
      </ul>
    </div>
  )
}

