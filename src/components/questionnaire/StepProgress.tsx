'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const STEP_LABELS = [
  'Role',
  'Org Type',
  'Journey',
  'Data',
  'Priorities',
  'Support',
  'Scan',
  'Details',
  'Consent',
]

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6">
      <div className="relative mb-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep

          return (
            <div key={step} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all duration-300',
                  isCompleted && 'bg-primary text-white',
                  isCurrent && 'bg-primary/20 text-primary ring-2 ring-primary/50',
                  !isCompleted && !isCurrent && 'bg-secondary text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : step}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
    </div>
  )
}
