'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  id?: string
  disabled?: boolean
}

function Checkbox({ label, checked = false, onChange, className, id, disabled }: CheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'inline-flex cursor-pointer items-center gap-3',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
            checked
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/40 bg-transparent hover:border-primary/60'
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

export { Checkbox, type CheckboxProps }
