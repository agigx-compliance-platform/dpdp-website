'use client'

/**
 * RoleChip — small chip indicating a role (DPO, Operator, Analyst, etc.)
 */

interface RoleChipProps {
  role: string
  className?: string
}

export function RoleChip({ role, className = '' }: RoleChipProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary text-secondary-foreground border border-border ${className}`}
    >
      {role}
    </span>
  )
}
