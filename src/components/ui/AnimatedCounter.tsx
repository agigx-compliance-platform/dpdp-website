'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/useInView'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0)
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)

      setCount(Math.round(easedProgress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export { AnimatedCounter, type AnimatedCounterProps }
