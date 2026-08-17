'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { Button } from '@/components/ui/Button'
import { useQuestionnaireStore } from '@/store/questionnaireStore'

/** DPDP phased enforcement target (shared with CountdownTimer). */
export const DPDP_ENFORCEMENT_DATE = '2027-05-01T00:00:00'

function getRemainingParts(targetDate: string) {
  const total = Date.parse(targetDate) - Date.now()
  if (total <= 0) {
    return { days: 0, monthsApprox: 0 }
  }
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const monthsApprox = Math.max(1, Math.round(days / 30.44))
  return { days, monthsApprox }
}

function formatRemainingHeadline(days: number) {
  if (days <= 0) return 'DPDP enforcement has begun. Penalties up to ₹250 Crore per violation.'
  if (days >= 60) {
    const months = Math.max(1, Math.round(days / 30.44))
    return `DPDP enforcement begins in ${months} months (${days.toLocaleString()} days). Penalties up to ₹250 Crore per violation.`
  }
  return `DPDP enforcement begins in ${days.toLocaleString()} days. Penalties up to ₹250 Crore per violation.`
}

function formatRemainingStat(days: number, monthsApprox: number) {
  if (days <= 0) return { value: 'Now', label: 'Enforcement has begun' }
  if (days >= 60) {
    return {
      value: `${monthsApprox} Months`,
      label: 'Until enforcement begins',
    }
  }
  return {
    value: `${days} Days`,
    label: 'Until enforcement begins',
  }
}

export function WhyNow() {
  const [remaining, setRemaining] = useState(() =>
    getRemainingParts(DPDP_ENFORCEMENT_DATE),
  )

  useEffect(() => {
    const tick = () => setRemaining(getRemainingParts(DPDP_ENFORCEMENT_DATE))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  const headline = formatRemainingHeadline(remaining.days)
  const remainingStat = formatRemainingStat(
    remaining.days,
    remaining.monthsApprox,
  )

  const stats = [
    { value: '₹250 Crore', label: 'Maximum penalty per violation' },
    { value: '72 Hours', label: 'Breach notification window' },
    remainingStat,
  ]

  return (
    <SectionWrapper id="urgency">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          The Clock Is <span className="gradient-text">Ticking</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {headline}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <CountdownTimer targetDate={DPDP_ENFORCEMENT_DATE} />
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <div className="text-2xl sm:text-3xl font-bold gradient-text">
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <Button variant="primary" size="lg" onClick={() => useQuestionnaireStore.getState().openModal()}>
          Start Your Compliance Journey
        </Button>
      </motion.div>
    </SectionWrapper>
  )
}
