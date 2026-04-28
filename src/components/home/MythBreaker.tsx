'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { cn } from '@/lib/utils'

const myths = [
  {
    myth: 'A privacy policy is enough',
    reality:
      'DPDP requires operational controls — not just documents. You need consent management, data mapping, breach response, and audit trails.',
  },
  {
    myth: 'Consent banners solve everything',
    reality:
      'Banners without blocking still set cookies illegally. True compliance means no data processing until valid consent is obtained.',
  },
  {
    myth: "We don't handle much personal data",
    reality:
      'DPDP covers all digital personal data including employee data, vendor contacts, and visitor analytics. Nearly every business is in scope.',
  },
  {
    myth: 'Compliance is a one-time project',
    reality:
      'DPDP requires continuous monitoring, regular audits, and ongoing evidence collection. Compliance is a living process.',
  },
]

export function MythBreaker() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const toggle = (idx: number) =>
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }))

  return (
    <SectionWrapper id="myths">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Compliance Myths, <span className="gradient-text">Debunked</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {myths.map((item, i) => {
          const isRevealed = revealed[i]
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => toggle(i)}
              className={cn(
                'glass-card p-6 text-left cursor-pointer transition-all w-full',
                isRevealed && 'border-primary/30'
              )}
            >
              <AnimatePresence mode="wait">
                {!isRevealed ? (
                  <motion.div
                    key="myth"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-destructive uppercase tracking-wider">
                          Myth
                        </span>
                        <p className="text-foreground font-medium mt-1">
                          &ldquo;{item.myth}&rdquo;
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Tap to reveal reality →
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reality"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          Reality
                        </span>
                        <p className="text-foreground leading-relaxed mt-1">
                          {item.reality}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
