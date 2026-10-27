import type { ReactNode } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

/** A titled band that frames one product illustration on a landing page. */
export function IllustrationSection({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <SectionWrapper>
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-3 text-muted-foreground">{lead}</p>
      </div>
      {children}
    </SectionWrapper>
  )
}
