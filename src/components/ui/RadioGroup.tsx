'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

function RadioGroup({ name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} role="radiogroup">
      {options.map((option) => (
        <RadioOptionItem
          key={option.value}
          name={name}
          option={option}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
        />
      ))}
    </div>
  )
}

interface RadioOptionItemProps {
  name: string
  option: RadioOption
  checked: boolean
  onChange: () => void
}

function RadioOptionItem({ name, option, checked, onChange }: RadioOptionItemProps) {
  const id = `${name}-${option.value}`

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200',
        checked
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-border/150 hover:bg-secondary/50'
      )}
    >
      <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="radio"
          id={id}
          name={name}
          value={option.value}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div
          className={cn(
            'h-5 w-5 rounded-full border-2 transition-all duration-200',
            checked ? 'border-primary' : 'border-muted-foreground/40'
          )}
        />
        {checked && (
          <div className="absolute h-2.5 w-2.5 rounded-full bg-primary" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{option.label}</span>
        {option.description && (
          <span className="mt-0.5 text-xs text-muted-foreground">{option.description}</span>
        )}
      </div>
    </label>
  )
}

export { RadioGroup, type RadioOption, type RadioGroupProps }
