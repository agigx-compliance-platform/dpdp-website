'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Fingerprint,
  ScanSearch,
  FileCheck,
  Server,
  Bot,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'
import { productScreenshots } from '@/lib/agigx-ui-screenshots'

const PRODUCTS = [
  {
    id: 'consent-platform',
    name: 'AGIGx Consent Management Platform',
    tagline: 'Consent that satisfies Section 6 — from capture to withdrawal to proof',
    description:
      'A full-lifecycle consent management platform that handles banner deployment, preference collection, version tracking, and immutable audit trails. Built specifically for DPDP Section 6 compliance with purpose-based granular consent and one-click withdrawal.',
    icon: 'Fingerprint',
    features: [
      { title: 'Consent Banner Management', description: 'Customisable banners with region-aware consent modes and adaptive display logic' },
      { title: 'Cookie Discovery', description: 'Playwright-powered scanning discovers all cookies and trackers across your digital properties' },
      { title: 'Immutable Audit Trail', description: 'Append-only consent logs for legal proof with tamper-evident timestamps' },
      { title: 'Cookie Policy Lifecycle', description: 'Versioned policy publishing linked to consent with automatic invalidation' },
      { title: 'Purpose-Based Engine', description: 'Granular consent per data type and purpose with dependency mapping' },
      { title: 'SDK Integration', description: 'Single script tag embed with programmatic API for custom implementations' },
    ],
    dpdpSections: ['5', '6(1)', '6(2)', '6(4)', '8(5)', '8(7)'],
    complianceDomains: ['Consent & Notice'],
  },
  {
    id: 'trustscope',
    name: 'TrustScope Compliance Scanner',
    tagline: 'See your privacy posture the way a regulator would',
    description:
      'An external compliance scanner that evaluates your public-facing digital properties across 7 categories. Generates a 0-100 health score with A-F grading, identifies undisclosed trackers, analyses privacy policies, and produces audit-ready PDF reports.',
    icon: 'ScanSearch',
    features: [
      { title: '5-Phase Scan', description: 'Cookie discovery, legal page discovery, policy analysis, DSAR check, subpage scan' },
      { title: 'Health Score', description: '0-100 with A-F grading across 7 categories for instant compliance visibility' },
      { title: 'Policy Analysis', description: 'Detects GDPR, DPDP, CCPA compliance signals with gap identification' },
      { title: 'DSAR Discovery', description: 'Finds DSAR forms and privacy emails to validate rights accessibility' },
      { title: 'Tracker Intelligence', description: 'Identifies undisclosed third-party trackers and categorises by risk level' },
      { title: 'External Risk Score', description: 'Non-invasive public surface scan with comprehensive PDF report' },
    ],
    dpdpSections: ['5', '6', '8(5)', '11-13', '13(3)'],
    complianceDomains: ['Consent & Notice', 'Data Principal Rights', 'Governance'],
  },
  {
    id: 'dsar-platform',
    name: 'DSAR Management Platform',
    tagline: 'Rights workflows that meet Section 11-13 timelines',
    description:
      'Automate Data Subject Access Request workflows with configurable process builders, multi-channel intake, grievance officer management, and SLA tracking. Ensures compliance with Section 11-13 rights obligations within mandated timelines.',
    icon: 'FileCheck',
    features: [
      { title: 'Automated Workflows', description: 'Configurable workflow builder for access, correction, erasure with approval chains' },
      { title: 'Grievance Management', description: 'Named grievance officer publication with SLA tracking and escalation rules' },
      { title: 'Multi-Channel Intake', description: 'Web forms, email, API with automated routing and deduplication' },
      { title: 'Evidence and Reporting', description: 'Complete audit trail with compliance reporting and response analytics' },
    ],
    dpdpSections: ['11', '12', '13', '13(3)'],
    complianceDomains: ['Data Principal Rights'],
  },
  {
    id: 'infra-scanner',
    name: 'Infrastructure and Code Scanner',
    tagline: 'Compliance visibility from cloud to codebase',
    description:
      'Scans your cloud infrastructure and code repositories for privacy-relevant misconfigurations, PII exposure, and consent bypass patterns. Provides unified compliance dashboards across AWS, Azure, and GCP environments.',
    icon: 'Server',
    features: [
      { title: 'Cloud Security Scanning', description: 'AWS, Azure, GCP misconfiguration detection with privacy-focused rules' },
      { title: 'Code Repository Scanning', description: 'Static analysis for PII exposure and consent bypass in source code' },
      { title: 'Compliance Dashboard', description: 'Unified infrastructure and code compliance view with trend tracking' },
    ],
    dpdpSections: ['8(5)', '8(6)', '10'],
    complianceDomains: ['Data Security & Breach'],
  },
  {
    id: 'ai-assistant',
    name: 'AI Compliance Assistant',
    tagline: 'Expert DPDP guidance in minutes, not days',
    description:
      'An AI-powered advisory tool trained on the DPDP 2023 Act, November 2025 Rules, and global privacy frameworks. Provides instant guidance, runs 18-question compliance audits with penalty calculation, and delivers industry-specific recommendations.',
    icon: 'Bot',
    features: [
      { title: 'AI-Powered Query', description: 'Trained on DPDP 2023 Act and global frameworks for instant expert guidance' },
      { title: 'DPDPA Compliance Audit', description: '18-question audit across 6 domains with penalty calculation and scoring' },
      { title: 'Contextual Recommendations', description: 'Industry-specific guidance based on organization type and data processing patterns' },
    ],
    dpdpSections: ['All'],
    complianceDomains: ['All'],
  },
  {
    id: 'adaptive-engine',
    name: 'Adaptive Compliance Engine',
    tagline: 'Compliance that evolves with the law',
    description:
      'A self-learning compliance engine that monitors regulatory changes, adapts policies automatically, and maintains continuous compliance across DPDP, GDPR, CCPA, and LGPD frameworks with real-time scoring and trend analysis.',
    icon: 'RefreshCw',
    features: [
      { title: 'Regulatory Change Detection', description: 'Monitors amendments and new rules with impact assessment on existing controls' },
      { title: 'Adaptive Policy Updates', description: 'Self-learning system adapting to changes with version control and rollback' },
      { title: 'Multi-Framework Support', description: 'DPDP, GDPR, CCPA, LGPD unified compliance with cross-mapping' },
      { title: 'Continuous Monitoring', description: 'Real-time scoring with trend analysis and early warning alerts' },
    ],
    dpdpSections: ['All'],
    complianceDomains: ['All'],
  },
]

const iconMap: Record<string, React.ElementType> = {
  Fingerprint,
  ScanSearch,
  FileCheck,
  Server,
  Bot,
  RefreshCw,
}

export default function ProductsPage() {
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
            <span className="gradient-text">AI-Powered Compliance Products</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Purpose-built technology products that automate DPDP compliance —
            from consent management and scanning to AI-assisted advisory and
            adaptive governance.
          </p>
        </motion.div>
      </SectionWrapper>

      {PRODUCTS.map((product, idx) => {
        const Icon = iconMap[product.icon]
        const isEven = idx % 2 === 1

        return (
          <SectionWrapper key={product.id} className="py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className={cn(
                'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
                isEven && 'lg:[direction:rtl] lg:[&>*]:[direction:ltr]'
              )}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 shadow-card bg-card">
                {product.id in productScreenshots ? (
                  <>
                    <Image
                      src={
                        productScreenshots[product.id as keyof typeof productScreenshots].src
                      }
                      alt={`Screenshot: ${product.name}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-background via-background/90 to-transparent p-4 pt-12 md:pt-16">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {
                          productScreenshots[product.id as keyof typeof productScreenshots]
                            .caption
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background-secondary to-primary/5">
                    <div className="absolute inset-4 rounded-xl border border-border/30 bg-[var(--glass-bg)] backdrop-blur-sm p-6 flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full bg-warning/60" />
                        <div className="w-3 h-3 rounded-full bg-success/60" />
                        <div className="flex-1 h-6 rounded bg-secondary/50 ml-4" />
                      </div>
                      <div className="space-y-3 mt-6">
                        <div className="h-4 rounded bg-secondary/40 w-3/4" />
                        <div className="h-4 rounded bg-secondary/30 w-1/2" />
                        <div className="h-8 rounded bg-primary/20 w-full mt-4" />
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="h-16 rounded bg-secondary/30" />
                          <div className="h-16 rounded bg-secondary/30" />
                          <div className="h-16 rounded bg-secondary/30" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {product.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {product.name}
                  </h2>
                </div>

                <p className="text-primary font-medium mb-3">{product.tagline}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {product.features.map((feature) => (
                    <Card key={feature.title} variant="outline" className="hover:border-primary/30">
                      <CardContent className="p-4">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.dpdpSections.map((section) => (
                    <Badge key={section} variant="info">
                      {section === 'All' ? 'All Sections' : `Section ${section}`}
                    </Badge>
                  ))}
                  {product.complianceDomains.map((domain) => (
                    <Badge key={domain} variant="success">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </SectionWrapper>
        )
      })}

      <SectionWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Find the Right Product for You</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our guided questionnaire and receive personalised product
            recommendations based on your compliance gaps and priorities.
          </p>
          <Link href="/questionnaire">
            <Button variant="primary" size="lg">
              Get Recommendations
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
