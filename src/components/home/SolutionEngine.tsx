'use client'

import { motion } from 'framer-motion'
import { Scale, ShieldCheck, Server, ScrollText, BadgeCheck, ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const steps = [
  { icon: Scale, label: 'Laws' },
  { icon: ShieldCheck, label: 'Controls' },
  { icon: Server, label: 'Systems' },
  { icon: ScrollText, label: 'Logs' },
  { icon: BadgeCheck, label: 'Proof' },
]

export function SolutionEngine() {
  return (
    <SectionWrapper id="solution">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          The <span className="gradient-text">AGIGx Engine</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Laws → Controls → Systems → Logs → Proof
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 mb-12">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 md:gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="glass-card flex flex-col items-center p-5 sm:p-6 min-w-[100px]"
            >
              <step.icon className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.12 + 0.2 }}
              >
                <ArrowRight className="w-5 h-5 text-primary hidden md:block" />
                <ArrowRight className="w-5 h-5 text-primary rotate-90 md:hidden" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-3xl mx-auto text-center text-muted-foreground leading-relaxed"
      >
        We map legal obligations directly to technical controls, embed them in your
        systems, capture every action as an immutable log, and package it as
        regulator-ready proof.
      </motion.p>
    </SectionWrapper>
  )
}
