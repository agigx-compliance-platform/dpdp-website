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

  let riskColorClass = 'bg-green-500'
  let riskLabel = 'Low'
  let riskLabelClass = 'text-green-500'

  if (riskScore > 65) {
    riskColorClass = 'bg-red-500'
    riskLabel = 'High'
    riskLabelClass = 'text-red-500'
  } else if (riskScore > 35) {
    riskColorClass = 'bg-yellow-500'
    riskLabel = 'Moderate'
    riskLabelClass = 'text-yellow-500'
  }

  const estMin = Math.round(riskScore * 2.5)
  const estMax = Math.round(riskScore * 5)

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 px-4 sm:px-6"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Risk Exposure
        </span>
        <span className={cn('text-xs font-bold uppercase tracking-wider', riskLabelClass)}>
          {riskLabel}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn('h-full transition-all duration-600 ease-in-out', riskColorClass)}
          style={{ width: `${riskScore}%` }}
        />
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground text-right">
        Est. exposure: ₹{estMin}–{estMax} Crore
      </div>
    </motion.div>
  )
}
