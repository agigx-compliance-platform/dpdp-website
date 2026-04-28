'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const metrics = [
  { end: 50, suffix: '+', label: 'Consulting engagements' },
  { end: 500, suffix: '+', label: 'Compliance checks automated' },
  { end: 6, suffix: '', label: 'Regulatory frameworks' },
  { end: 99.9, suffix: '%', label: 'Uptime SLA' },
]

export function MetricsSection() {
  return (
    <SectionWrapper id="metrics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <div className="text-3xl sm:text-4xl font-bold gradient-text">
              <AnimatedCounter end={m.end} suffix={m.suffix} duration={2} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
