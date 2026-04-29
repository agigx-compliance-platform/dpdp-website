'use client'

import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const rows = [
  { traditional: 'Static checklists', agigx: 'Adaptive rules engine' },
  { traditional: 'Annual audits', agigx: 'Continuous monitoring' },
  { traditional: 'Generic templates', agigx: 'Tailored to your stack' },
  { traditional: 'Siloed tools', agigx: 'Unified compliance view' },
  { traditional: 'Manual evidence', agigx: 'Automated proof generation' },
  { traditional: 'One regulation', agigx: 'Multi-framework coverage' },
]

export function Differentiator() {
  return (
    <SectionWrapper id="differentiator">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Why AGIGx Is <span className="gradient-text">Different</span>
        </motion.h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="text-center text-muted-foreground font-medium text-sm uppercase tracking-wider">
            Traditional Tools
          </div>
          <div className="text-center gradient-text font-medium text-sm uppercase tracking-wider">
            AGIGx Engine
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="grid grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="glass-card p-4 flex items-center gap-3 opacity-60">
                <X className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-sm">{row.traditional}</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3 gradient-border">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{row.agigx}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
