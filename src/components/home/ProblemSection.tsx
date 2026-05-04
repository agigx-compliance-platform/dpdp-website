'use client'

import { motion } from 'framer-motion'
import { FileWarning, AlertTriangle, PackageX } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { TorchGrid, TorchCard } from '@/components/ui/TorchGrid'

const painPoints = [
  {
    icon: FileWarning,
    title: 'Scattered Compliance',
    description:
      'Policies live in docs, controls in spreadsheets, evidence nowhere. Your compliance posture is invisible.',
  },
  {
    icon: AlertTriangle,
    title: 'Reactive Firefighting',
    description:
      'You learn about violations after regulators notice. By then, the damage (financial and reputational) is done.',
  },
  {
    icon: PackageX,
    title: 'One-Size-Fits-None',
    description:
      "Generic tools that don't fit your industry, tech stack, or organizational complexity. Cookie-cutter compliance fails.",
  },
]

export function ProblemSection() {
  return (
    <SectionWrapper id="problem">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          The Compliance <span className="gradient-text">Problem</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Fragmented. Reactive. Expensive.
        </motion.p>
      </div>

      <TorchGrid cols="md:grid-cols-3" gap="gap-6">
        {painPoints.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="h-full"
          >
            <TorchCard className="p-6 sm:p-8 flex flex-col">
              <point.icon className="w-10 h-10 text-primary mb-4 shrink-0" />
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </TorchCard>
          </motion.div>
        ))}
      </TorchGrid>
    </SectionWrapper>
  )
}
