'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Logo {
  name: string
  placeholder: boolean
}

interface LogoMarqueeProps {
  logos: Logo[]
  className?: string
}

function LogoMarquee({ logos, className }: LogoMarqueeProps) {
  const duplicated = [...logos, ...logos]

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
      <div className="flex animate-marquee">
        {duplicated.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="mx-8 flex shrink-0 items-center justify-center grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
          >
            <div className="flex h-12 items-center justify-center rounded-lg px-6">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { LogoMarquee, type LogoMarqueeProps, type Logo }
