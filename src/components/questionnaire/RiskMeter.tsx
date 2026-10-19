'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { calculateRiskScore } from '@/lib/risk-score'
import type { QuestionnaireResponses } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RiskMeterProps {
  formData: Partial<QuestionnaireResponses>
  isVisible: boolean
}

export function RiskMeter({ formData, isVisible }: RiskMeterProps) {
  const riskScore = useMemo(() => calculateRiskScore(formData), [formData])

  if (!isVisible) return null

  // Don't show if they skipped scan AND haven't selected any data types or journey stage that adds risk
  if (formData.wantsScan === false && riskScore === 0) return null

  let riskColorClass = 'bg-success'
  let riskLabel = 'Low'
  let riskLabelClass = 'text-success'

  if (riskScore > 65) {
    riskColorClass = 'bg-destructive'
    riskLabel = 'High'
    riskLabelClass = 'text-destructive'
  } else if (riskScore > 35) {
    riskColorClass = 'bg-warning'
    riskLabel = 'Moderate'
    riskLabelClass = 'text-warning'
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 rounded-xl border border-dashed border-border bg-card px-4 py-3 sm:px-6"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Self-reported exposure
        </span>
        <span className={cn('text-xs font-bold uppercase tracking-wider', riskLabelClass)}>
          {riskLabel}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full transition-all duration-600 ease-in-out', riskColorClass)}
          style={{ width: `${riskScore}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Derived from answers on this form, not a statutory penalty.
      </p>
    </motion.div>
  )
}
