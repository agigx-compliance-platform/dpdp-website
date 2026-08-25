'use client'

import { motion } from 'framer-motion'
import {
  Target,
  Zap,
  Eye,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

const VALUES = [
  {
    icon: Target,
    title: 'Precision',
    description:
      'Every control, every assessment, every recommendation is grounded in the specific text of DPDP 2023. We map to sections, not abstractions.',
  },
  {
    icon: Zap,
    title: 'Adaptability',
    description:
      'Regulatory landscapes evolve. Our platforms self-adapt to amendments, new rules, and enforcement guidance, keeping you compliant without manual rework.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Full audit trails, immutable evidence, and clear scoring. You see exactly where you stand, what gaps exist, and what actions close them.',
  },
  {
    icon: Heart,
    title: 'Client-First',
    description:
      'We design for your context: your industry, your data patterns, your maturity level. No one-size-fits-all frameworks. Compliance that fits how you actually operate.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">About DPDP Consultancy</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re building the compliance infrastructure India needs where
            regulatory obligations become executable systems, not static
            documents gathering dust.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium italic">
            &ldquo;We believe compliance should be an executable engine, not a
            checkbox exercise.&rdquo;
          </p>
          <p className="text-muted-foreground mt-6 leading-relaxed max-w-3xl mx-auto">
            DPDP 2023 represents a fundamental shift in how Indian organisations
            must treat personal data. dpdpconsultancy exists to make that transition
            achievable through technology that automates controls, services
            that build capability, and products that provide continuous assurance.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Our Values</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide every product decision, client engagement,
            and governance recommendation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value, idx) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 md:p-8 max-w-3xl mx-auto text-center"
        >
          <h3 className="text-xl font-bold text-foreground mb-3">Advisory Board</h3>
          <p className="text-muted-foreground leading-relaxed">
            dpdpconsultancy is guided by an advisory board comprising former regulators,
            senior privacy practitioners, and technology leaders with decades
            of combined experience across Indian and international data protection
            frameworks.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Let&apos;s Build Compliance Together</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re starting your DPDP journey or scaling an existing
            program, we&apos;d love to hear from you.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
