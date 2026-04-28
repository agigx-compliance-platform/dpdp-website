'use client'

import { motion } from 'framer-motion'
import {
  Lightbulb,
  Wrench,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

const PARTNERSHIP_MODELS = [
  {
    id: 'advisory',
    title: 'Advisory Partnership',
    icon: Lightbulb,
    description:
      'For consulting firms, law firms, and advisory practices looking to offer DPDP compliance services powered by AGIGx technology and methodology.',
    included: [
      'White-label TrustScope compliance scanning',
      'AI Compliance Assistant access for your consultants',
      'DPDP readiness assessment methodology',
      'Co-branded compliance reports',
      'Partner training and certification program',
      'Joint go-to-market support',
    ],
    idealFor: 'Consulting firms, law firms, and boutique advisory practices building privacy service lines',
  },
  {
    id: 'implementation',
    title: 'Implementation Partnership',
    icon: Wrench,
    description:
      'For system integrators and technology consultancies that implement privacy solutions for enterprise clients and need a robust DPDP compliance technology stack.',
    included: [
      'Full AGIGx platform integration access',
      'Consent Management Platform for client deployments',
      'DSAR and rights automation tooling',
      'Implementation playbooks and documentation',
      'Technical training and solution architecture support',
      'Revenue-share model on platform deployments',
    ],
    idealFor: 'System integrators, technology consultancies, and managed service providers',
  },
  {
    id: 'managed',
    title: 'Managed Services Partnership',
    icon: Headphones,
    description:
      'For organisations wanting to offer ongoing managed privacy operations — DPO services, compliance monitoring, and incident response — backed by AGIGx infrastructure.',
    included: [
      'Managed operations playbook and SLA templates',
      'Continuous compliance monitoring dashboard',
      'Incident response coordination tools',
      'Virtual DPO service framework',
      'Quarterly compliance reporting automation',
      'Escalation and expert support access',
    ],
    idealFor: 'BPO providers, managed service companies, and GRC platforms adding privacy operations',
  },
]

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Revenue Growth',
    description: 'Expand your service portfolio with high-demand DPDP compliance offerings backed by proven technology.',
  },
  {
    icon: Award,
    title: 'Market Differentiation',
    description: 'Stand out with AI-powered compliance tools and methodology that competitors cannot easily replicate.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Access AGIGx privacy engineers and compliance experts for complex client engagements.',
  },
  {
    icon: Zap,
    title: 'Speed to Market',
    description: 'Launch DPDP services in weeks, not months, with ready-made frameworks, tools, and training.',
  },
]

export default function PartnershipPage() {
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
            <span className="gradient-text">Partner With AGIGx</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our partner ecosystem to deliver DPDP compliance services at
            scale. Whether you advise, implement, or operate — we have a model
            that amplifies your capabilities.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PARTNERSHIP_MODELS.map((model, idx) => {
            const Icon = model.icon
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{model.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {model.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2.5 mb-6">
                      {model.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="glass-card p-3 rounded-lg">
                      <p className="text-xs font-medium text-foreground mb-1">Ideal For</p>
                      <p className="text-xs text-muted-foreground">{model.idealFor}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
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
            <span className="gradient-text">Partnership Benefits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every partnership tier includes these foundational advantages
            to accelerate your DPDP compliance practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
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
            <span className="gradient-text">Become a Partner</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to explore how AGIGx can power your DPDP compliance
            practice? Let&apos;s discuss the right partnership model for your
            organization.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Contact Our Partnership Team
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
