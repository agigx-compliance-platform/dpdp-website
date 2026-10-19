'use client'

import { Button } from '@/components/ui/Button'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import {
  formatMilestoneDate,
  getMsUntilNext,
  getNextMilestone,
  isFullyInForce,
} from '@/lib/dpdp-timeline'

function remainingFromMs(ms: number) {
  if (ms <= 0) return { days: 0, monthsApprox: 0 }
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const monthsApprox = Math.max(1, Math.round(days / 30.44))
  return { days, monthsApprox }
}

export function WhyNow() {
  const milestone = getNextMilestone()
  const inForce = isFullyInForce()
  const remaining = remainingFromMs(getMsUntilNext())

  const headline = inForce
    ? `In force since ${formatMilestoneDate(milestone)}. Penalties up to ₹250 Crore per violation.`
    : remaining.days >= 60
      ? `${remaining.monthsApprox} months (${remaining.days.toLocaleString()} days) to ${milestone.label}.`
      : `${remaining.days.toLocaleString()} days to ${milestone.label}.`

  return (
    <div className="mt-12 border-t border-border pt-10">
      <p className="text-center text-sm text-muted-foreground">{headline}</p>
      <p className="mt-1 text-center font-mono text-[11px] text-muted-foreground">
        {milestone.citation}
      </p>
      <div className="mt-6 text-center">
        <Button variant="primary" onClick={() => useQuestionnaireStore.getState().openModal()}>
          Start Assessment
        </Button>
      </div>
    </div>
  )
}
