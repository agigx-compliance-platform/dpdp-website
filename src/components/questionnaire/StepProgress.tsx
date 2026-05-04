'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const STEP_LABELS = [
  'Launch',
  'Role',
  'Org Type',
  'Journey',
  'Data',
  'Priorities',
  'Support',
  'Consent',
]

interface StepProgressProps {
  currentStep: number // 0 to 7
  totalSteps: number // 8
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  // currentStep is 0-indexed (0 to 7). totalSteps is 8.
  const progress = (currentStep / (totalSteps - 1)) * 100

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 bg-secondary/20">
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
          const stepIndex = i
          const isCompleted = stepIndex < currentStep
          const isCurrent = stepIndex === currentStep

          return (
            <div key={stepIndex} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all duration-300',
                  isCompleted && 'bg-primary text-white',
                  isCurrent && 'bg-primary/20 text-primary ring-2 ring-primary/50',
                  !isCompleted && !isCurrent && 'bg-secondary text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepIndex + 1}
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
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {STEP_LABELS[currentStep]}
        </span>
      </div>
    </div>
  )
}
