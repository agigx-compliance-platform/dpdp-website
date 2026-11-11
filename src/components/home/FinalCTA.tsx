'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { Button } from '@/components/ui/Button'

export function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative py-14 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Don&apos;t wait for the first penalty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Start with a public-site scan or a 10-question assessment. Remediation
            for consent, inventory, and rights typically takes months, not a weekend.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg" onClick={() => useQuestionnaireStore.getState().openModal()}>
            Start Assessment
          </Button>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact us
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
