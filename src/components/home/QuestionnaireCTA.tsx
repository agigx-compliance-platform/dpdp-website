'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ClipboardList, Globe, FileBarChart } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { useQuestionnaireStore } from '@/store/questionnaireStore'

const features = [
  { icon: ClipboardList, label: '10 Tailored Questions' },
  { icon: Globe, label: 'Free Website Scan' },
  { icon: FileBarChart, label: 'Personalized Report' },
]

export function QuestionnaireCTA() {
  return (
    <SectionWrapper id="assessment">
      <div className="glass-card p-8 sm:p-12 text-center gradient-border">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Discover Your Compliance Posture{' '}
          <span className="gradient-text">in 5 Minutes</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-muted-foreground max-w-xl mx-auto"
        >
          Take our interactive assessment that scans your website, evaluates your
          current compliance posture, and recommends tailored solutions, all in
          under 5 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Button variant="primary" size="lg" onClick={() => useQuestionnaireStore.getState().openModal()}>
            Start Free Assessment
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-6"
        >
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <f.icon className="w-4 h-4 text-primary" />
              <span>{f.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
