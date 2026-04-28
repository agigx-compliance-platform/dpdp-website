'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  Layers,
  Users,
  Globe,
  Database,
  TrendingUp,
} from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const dimensions = [
  {
    icon: Building2,
    title: 'Industry Vertical',
    description: 'Healthcare, fintech, e-commerce, edtech — compliance rules vary by sector.',
  },
  {
    icon: Layers,
    title: 'Tech Stack',
    description: 'Cloud-native, legacy, hybrid — we integrate with your actual infrastructure.',
  },
  {
    icon: Users,
    title: 'Organization Type',
    description: 'Startup to enterprise, single entity to multi-subsidiary group.',
  },
  {
    icon: Globe,
    title: 'Regulatory Scope',
    description: 'DPDP, GDPR, CCPA, AI Act — map overlapping obligations automatically.',
  },
  {
    icon: Database,
    title: 'Data Categories',
    description: "Customer PII, employee data, health records, children\u2019s data \u2014 each has unique rules.",
  },
  {
    icon: TrendingUp,
    title: 'Compliance Maturity',
    description: "Whether you\u2019re starting from scratch or optimizing an existing program.",
  },
]

export function CustomizationSection() {
  return (
    <SectionWrapper id="customization">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Not a Product.{' '}
          <span className="gradient-text">An Engine You Build.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Every compliance engine we deliver is bespoke — shaped by your industry,
          stack, and regulatory landscape.
        </motion.p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dimensions.map((dim, i) => (
          <motion.div
            key={dim.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <dim.icon className="w-9 h-9 text-primary mb-3" />
            <h3 className="text-lg font-semibold mb-1">{dim.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dim.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
