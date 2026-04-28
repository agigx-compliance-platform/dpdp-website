'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate: Date | string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const target = React.useMemo(
    () => (typeof targetDate === 'string' ? new Date(targetDate) : targetDate),
    [targetDate]
  )
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(calculateTimeLeft(target))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target))
    }, 1000)
    return () => clearInterval(interval)
  }, [target])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className={cn('flex gap-3', className)}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className="glass-card flex flex-col items-center justify-center px-4 py-3 min-w-[4.5rem]"
        >
          <span className="text-2xl font-bold tabular-nums text-foreground transition-all duration-300">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export { CountdownTimer, type CountdownTimerProps }
