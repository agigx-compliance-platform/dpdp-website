'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Compass, ShieldCheck, Brain, Wrench, ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

const services = [
  {
    icon: Compass,
    title: 'Advisory',
    description: 'Strategic compliance roadmaps, gap assessments, and board-level advisory for data protection regulations.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Ops',
    description:
      'End-to-end privacy operations: consent management, DSAR workflows, breach response, and vendor risk.',
  },
  {
    icon: Brain,
    title: 'AI Governance',
    description: 'Responsible AI frameworks, algorithmic audits, and AI Act readiness assessments.',
  },
  {
    icon: Wrench,
    title: 'Technical Implementation',
    description: 'Privacy-by-design engineering, SDK integration, cookie management, and data classification tooling.',
  },
]

export function ServicesOverview() {
  return (
    <SectionWrapper id="services-preview">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Expert-Led Compliance <span className="gradient-text">Services</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col"
          >
            <svc.icon className="w-9 h-9 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{svc.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {svc.description}
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/services">
          <Button variant="outline">View All Services</Button>
        </Link>
      </div>
    </SectionWrapper>
  )
}
