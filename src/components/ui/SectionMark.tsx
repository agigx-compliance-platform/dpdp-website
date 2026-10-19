'use client'

/**
 * Quiet legal citation. Not a badge, not a headline ornament.
 * Renders as "DPDP Act, Section 6(4)".
 */

interface SectionMarkProps {
  /** e.g. "6(4)" or "8(5)" */
  section: string
  className?: string
}

export function SectionMark({ section, className = '' }: SectionMarkProps) {
  return (
    <span
      className={`text-[11px] font-normal text-muted-foreground ${className}`}
      title={`Digital Personal Data Protection Act, 2023, Section ${section}`}
    >
      DPDP Act, Section {section}
    </span>
  )
}
