'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageSquare, Cog, HeadphonesIcon } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { TorchGrid, TorchCard } from '@/components/ui/TorchGrid'

const models = [
  {
    icon: MessageSquare,
    title: 'Advisory Engagement',
    description:
      'Expert-led assessments, gap analysis, and compliance strategy — ideal for organizations starting their journey.',
  },
  {
    icon: Cog,
    title: 'Implementation Partnership',
    description:
      'We build and deploy your compliance engine end-to-end, integrating with your existing systems and workflows.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Managed Services',
    description:
      'Ongoing compliance operations — monitoring, evidence collection, audit support, and continuous optimization.',
  },
]

export function PartnershipCTA() {
  return (
    <SectionWrapper id="partnership-preview">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          How We <span className="gradient-text">Partner</span>
        </motion.h2>
      </div>

      <TorchGrid cols="sm:grid-cols-3" gap="gap-6" className="mb-10">
        {models.map((model, i) => (
          <motion.div
            key={model.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <TorchCard className="p-6 text-center">
              <model.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{model.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {model.description}
              </p>
            </TorchCard>
          </motion.div>
        ))}
      </TorchGrid>

      <div className="text-center">
        <Link href="/partnership">
          <Button variant="primary">Explore Partnership Models</Button>
        </Link>
      </div>
    </SectionWrapper>
  )
}
