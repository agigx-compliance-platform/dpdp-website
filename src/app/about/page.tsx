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
      'Our advice and tools are based on the text of the DPDP Act and Rules, not on general privacy assumptions.',
  },
  {
    icon: Zap,
    title: 'Adaptability',
    description:
      'The rules will change over time. We watch for changes and help you update your work when they do.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Clear records and plain reports, so you can see where you stand, what the gaps are, and what to do next.',
  },
  {
    icon: Heart,
    title: 'Client-First',
    description:
      'We start from your industry, your data, and how far along you are, so the work fits how you actually operate.',
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
            We help organisations in India get ready for the DPDP Act, with
            software that does the daily work and people who can advise you.
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
            &ldquo;Following the law on personal data should be part of daily
            work, not a once-a-year checklist.&rdquo;
          </p>
          <p className="text-muted-foreground mt-6 leading-relaxed max-w-3xl mx-auto">
            The DPDP Act changes how organisations in India must treat personal
            data. DPDP Consultancy exists to make that change manageable, with
            clear advice, practical services, and software your team can use.
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
            DPDP Consultancy (dpdpconsultancy) is guided by an advisory board comprising former regulators,
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
