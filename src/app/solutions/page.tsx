'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Landmark,
  Cloud,
  Building2,
  Globe2,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Link from 'next/link'
import { useQuestionnaireStore } from '@/store/questionnaireStore'

const INDUSTRIES = [
  'All',
  'E-Commerce',
  'Healthcare',
  'Financial Services',
  'SaaS/Platform',
  'Regulated Enterprise',
  'GCC/Captive',
  'Consulting/Advisory',
]

const SOLUTIONS = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Compliance Suite',
    industry: 'E-Commerce',
    icon: 'ShoppingCart',
    description:
      'End-to-end DPDP compliance for e-commerce platforms handling high-volume consumer data, payment information, and behavioural tracking across web and mobile properties.',
    keyOfferings: [
      'Consent Management Platform with cookie discovery',
      'TrustScope external compliance scanning',
      'DSAR automation for customer rights',
      'Retention policy for transaction data',
      'Third-party tracker governance',
    ],
    dpdpFocus: ['Consent & Notice (Section 6)', 'Data Retention (Section 8(7))', 'Cross-border transfers to payment processors'],
  },
  {
    id: 'healthcare',
    title: 'Healthcare Data Protection',
    industry: 'Healthcare',
    icon: 'Heart',
    description:
      'Specialised compliance for healthcare providers and health-tech companies processing sensitive health data, patient records, and clinical research information under enhanced DPDP obligations.',
    keyOfferings: [
      'Sensitive data classification and mapping',
      'Patient consent workflows (Section 9 children)',
      'Breach readiness with 72-hour response',
      'Vendor governance for health-tech partners',
      'Privacy Impact Assessments',
    ],
    dpdpFocus: ['Sensitive data safeguards (Section 8(5))', 'Breach notification (Section 8(6))', 'Children\'s data protection (Section 9)'],
  },
  {
    id: 'financial-services',
    title: 'Financial Services Compliance',
    industry: 'Financial Services',
    icon: 'Landmark',
    description:
      'DPDP compliance integrated with existing RBI, SEBI, and IRDAI regulatory frameworks for banks, NBFCs, insurance companies, and fintech platforms processing financial personal data.',
    keyOfferings: [
      'Cross-regulatory compliance mapping (DPDP + RBI)',
      'SDF readiness assessment and DPO advisory',
      'Data sovereignty for financial data',
      'AI governance for credit scoring models',
      'Managed compliance operations',
    ],
    dpdpFocus: ['SDF obligations (Section 10)', 'Cross-border restrictions (Section 16)', 'Algorithmic accountability'],
  },
  {
    id: 'saas-platform',
    title: 'SaaS & Platform Compliance',
    industry: 'SaaS/Platform',
    icon: 'Cloud',
    description:
      'Compliance architecture for SaaS companies acting as Data Processors, handling multi-tenant data, and managing complex data-sharing relationships with enterprise customers.',
    keyOfferings: [
      'Processor obligation assessment (Section 8(2))',
      'Multi-tenant data isolation review',
      'Infrastructure and code scanning',
      'Consent SDK integration',
      'Continuous compliance monitoring',
    ],
    dpdpFocus: ['Processor obligations (Section 8(2))', 'Security safeguards (Section 8(5))', 'Purpose limitation (Section 8(7))'],
  },
  {
    id: 'regulated-enterprise',
    title: 'Regulated Enterprise Program',
    industry: 'Regulated Enterprise',
    icon: 'Building2',
    description:
      'Comprehensive DPDP program for large enterprises likely classified as Significant Data Fiduciaries, requiring mandatory DPIAs, annual audits, DPO appointment, and algorithmic accountability.',
    keyOfferings: [
      'SDF classification and DPIA execution',
      'Annual audit preparation and evidence',
      'DPO appointment and governance design',
      'AI governance and algorithmic accountability',
      'Board-level privacy reporting',
    ],
    dpdpFocus: ['SDF mandatory obligations (Section 10)', 'DPIA requirements', 'DPO appointment (Section 10(2)(b))'],
  },
  {
    id: 'gcc-captive',
    title: 'GCC & Captive Centre Governance',
    industry: 'GCC/Captive',
    icon: 'Globe2',
    description:
      'Cross-border data governance for Global Capability Centres processing Indian personal data for overseas parent entities, with focus on Section 16 transfer compliance and sovereign architecture.',
    keyOfferings: [
      'Cross-border transfer impact assessment',
      'Data sovereignty architecture advisory',
      'Parent-entity data sharing governance',
      'Jurisdictional risk review',
      'Privacy operating model design',
    ],
    dpdpFocus: ['Cross-border transfers (Section 16)', 'Data sovereignty', 'Group entity data sharing'],
  },
  {
    id: 'consulting-advisory',
    title: 'Consulting & Advisory Enablement',
    industry: 'Consulting/Advisory',
    icon: 'Briefcase',
    description:
      'White-label DPDP compliance tools and methodology for consulting firms, law firms, and advisory practices building privacy practices or offering DPDP services to their clients.',
    keyOfferings: [
      'White-label TrustScope scanning',
      'AI Compliance Assistant for advisors',
      'DPDP training and certification programs',
      'Client assessment methodology',
      'Co-managed delivery support',
    ],
    dpdpFocus: ['Full DPDP coverage', 'Multi-client management', 'Training & capability (Section 8(1))'],
  },
]

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart,
  Heart,
  Landmark,
  Cloud,
  Building2,
  Globe2,
  Briefcase,
}

export default function SolutionsPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredSolutions =
    activeFilter === 'All'
      ? SOLUTIONS
      : SOLUTIONS.filter((s) => s.industry === activeFilter)

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
            <span className="gradient-text">Industry-Specific DPDP Compliance Solutions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Pre-packaged compliance solutions tailored to your industry&apos;s unique
            data processing patterns, regulatory overlaps, and risk profiles.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="py-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => setActiveFilter(industry)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeFilter === industry
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)] text-muted-foreground hover:text-foreground hover:border-primary/30'
              )}
            >
              {industry}
            </button>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSolutions.map((solution, idx) => {
              const Icon = iconMap[solution.icon]
              return (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="default">{solution.industry}</Badge>
                      </div>
                      <CardTitle className="text-xl">{solution.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {solution.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Key Offerings
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {solution.keyOfferings.map((offering) => (
                          <li
                            key={offering}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            {offering}
                          </li>
                        ))}
                      </ul>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        DPDP Focus Areas
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {solution.dpdpFocus.map((focus) => (
                          <Badge key={focus} variant="info" className="text-[10px]">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => useQuestionnaireStore.getState().openModal()}>
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
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
            <span className="gradient-text">Not Sure Which Solution Fits?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our guided questionnaire analyses your organization&apos;s profile and
            recommends the optimal solution package for your industry and compliance maturity.
          </p>
          <Button variant="primary" size="lg" onClick={() => useQuestionnaireStore.getState().openModal()}>
            Take the Assessment
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
