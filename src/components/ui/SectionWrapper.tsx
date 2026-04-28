import * as React from 'react'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  id?: string
  className?: string
  children: React.ReactNode
}

function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-20 md:py-28', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

export { SectionWrapper, type SectionWrapperProps }
