'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale,
  Database,
  Globe,
  Brain,
  Code,
  ShieldCheck,
  Shield,
  Headphones,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion'
import Link from 'next/link'
import { servicesPlatformStrip } from '@/lib/agigx-ui-screenshots'

const SERVICE_CATEGORIES = [
  {
    id: 'advisory-legal',
    title: 'Advisory, Legal and Regulatory',
    icon: 'Scale',
    description:
      'Strategic advisory services to navigate DPDP 2023 obligations, establish legal frameworks, and prepare your organization for regulatory compliance from the ground up.',
    subOfferings: [
      {
        title: 'DPDP Readiness and Regulatory Advisory',
        description:
          'Applicability assessment against DPDP 2023 Sections 5-16 and November 2025 Rules. Identifies obligations as Data Fiduciary or Significant Data Fiduciary (Section 10). Maps penalty exposure across 6 compliance domains with prioritised remediation roadmaps.',
        dpdpSections: ['5-16', '10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations beginning DPDP compliance journey',
      },
      {
        title: 'Privacy Governance, Policy and Consent Design',
        description:
          'Design DPDP-compliant privacy policies (Section 5), consent notice frameworks requiring free, specific, informed consent (Section 6(1)), granular consent per data type (Section 6(2)). Ensures withdrawal is as easy as giving consent (Section 6(4)).',
        dpdpSections: ['5', '6(1)', '6(2)', '6(4)'],
        penalties: ['₹200 Crore'],
        whoIsThisFor: 'Organizations needing policy and consent framework design',
      },
      {
        title: 'Rights, Grievance and DPO Advisory',
        description:
          'Build workflows for Data Principal rights: access, correction, erasure (Sections 11-13). Establish grievance officer with published contact details and SLA (Section 13(3)). Verifiable parental consent processes for children\'s data (Section 9).',
        dpdpSections: ['9', '11', '12', '13', '13(3)'],
        penalties: ['₹200 Crore'],
        whoIsThisFor: 'Organizations establishing rights management processes',
      },
      {
        title: 'SDF and Enhanced Compliance Readiness',
        description:
          'Assessment against Significant Data Fiduciary criteria (Section 10): mandatory DPIAs, annual audits, algorithmic accountability, mandatory DPO appointment. Prepares organizations for enhanced regulatory scrutiny.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Large data processors likely classified as SDFs',
      },
      {
        title: 'Data Sovereignty and Executive Advisory',
        description:
          'Cross-border transfer governance (Section 16): assess permissibility of data flows to cloud servers, group entities, international destinations. Transfer impact assessments and contractual safeguards.',
        dpdpSections: ['16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations with international data flows',
      },
    ],
  },
  {
    id: 'privacy-operations',
    title: 'Privacy Operations and Data Governance',
    icon: 'Database',
    description:
      'Operationalise privacy compliance with robust data governance frameworks, consent lifecycle management, and automated rights fulfilment processes.',
    subOfferings: [
      {
        title: 'Data Inventory, Visibility and Flow Mapping',
        description:
          'Build live inventory of personal data where it lives, who accesses it (Section 8(5)). Data flow mapping and lineage traceability across systems, databases, and third-party integrations.',
        dpdpSections: ['8(5)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations lacking visibility into their data landscape',
      },
      {
        title: 'Consent, Rights and Grievance Operations',
        description:
          'End-to-end consent lifecycle: collection, versioning, withdrawal, preference sync. Automated DSAR workflows with 30-day response timelines. Grievance management with SLA tracking.',
        dpdpSections: ['6', '11-13'],
        penalties: ['₹200 Crore'],
        whoIsThisFor: 'Organizations operationalizing consent and rights',
      },
      {
        title: 'Retention, Deletion and Records Governance',
        description:
          'Retention schedules mapped to Section 8(7): data erased once purpose fulfilled. Automated deletion pipelines with quarterly testing and evidence generation.',
        dpdpSections: ['8(7)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations with data retention compliance gaps',
      },
      {
        title: 'Processor, Vendor and Data-Sharing Governance',
        description:
          'Vendor contract audits against Section 8(2): DPA clauses, audit rights, subprocessor restrictions, breach notification pass-through. Third-party risk management frameworks.',
        dpdpSections: ['8(2)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations with complex vendor ecosystems',
      },
      {
        title: 'Privacy Operating Model',
        description:
          'Design privacy operating models with designated compliance leads (Section 10(2)(b) for SDFs), function-specific accountability, board reporting, and cross-functional governance structures.',
        dpdpSections: ['10(2)(b)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Mature organizations building sustainable privacy programs',
      },
    ],
  },
  {
    id: 'data-sovereignty',
    title: 'Data Sovereignty and Cross-Border Governance',
    icon: 'Globe',
    description:
      'Navigate cross-border data transfer complexities under Section 16 with sovereign architecture advisory, transfer impact assessments, and jurisdictional risk management.',
    subOfferings: [
      {
        title: 'Data Residency Advisory',
        description:
          'Assessment of data flows crossing Indian borders (Section 16). Cloud provider residency review. Permissibility assessment per destination with regulatory mapping.',
        dpdpSections: ['16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations using international cloud services',
      },
      {
        title: 'Cross-Border Transfer Governance',
        description:
          'Contractual safeguards for transfers. Transfer impact assessments. Data-sharing control design with documentation for regulatory review.',
        dpdpSections: ['16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Multinationals with cross-border data flows',
      },
      {
        title: 'Jurisdictional Risk Review',
        description:
          'Foreign access-risk review. Sub-processor geography assessment. Jurisdictional exposure mapping across all data processing locations.',
        dpdpSections: ['16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations with global operations',
      },
      {
        title: 'Sovereign Architecture Advisory',
        description:
          'Sovereign cloud advisory. Deployment pattern review for localisation. Architecture alignment with DPDP transfer provisions and government-approved destinations.',
        dpdpSections: ['16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations designing compliant cloud architectures',
      },
      {
        title: 'Sovereignty Assurance',
        description:
          'Evidence and documentation for sovereignty compliance. Audit-ready reporting for cross-border governance. Continuous monitoring of transfer compliance.',
        dpdpSections: ['16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations preparing for regulatory audits',
      },
    ],
  },
  {
    id: 'ai-governance',
    title: 'AI Governance and Responsible AI',
    icon: 'Brain',
    description:
      'Establish AI governance frameworks aligned with DPDP algorithmic accountability requirements, responsible AI controls, and GenAI-specific governance protocols.',
    subOfferings: [
      {
        title: 'AI Governance Strategy',
        description:
          'AI governance framework aligned with DPDP algorithmic accountability (Section 10 for SDFs). AI Governance Office establishment with accountability models and board reporting.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations deploying AI at scale',
      },
      {
        title: 'AI Policy and Risk Governance',
        description:
          'AI use-case inventory, risk-tiering, classification. Policy frameworks including acceptable-use policies, procurement guidelines, and vendor AI risk assessment.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations needing AI governance frameworks',
      },
      {
        title: 'Responsible AI Controls',
        description:
          'Human oversight and accountability models. Responsible AI control frameworks. Transparency requirements including explainability and bias monitoring.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations implementing responsible AI practices',
      },
      {
        title: 'GenAI Governance',
        description:
          'GenAI governance framework. Third-party AI vendor risk reviews. AI prompt/training/output data governance with privacy-preserving controls.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations using generative AI tools',
      },
      {
        title: 'AI Governance Office Design',
        description:
          'Design and operationalise AI Governance Office. Accountability models aligned with regulatory expectations. Cross-functional AI oversight structures.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Large enterprises needing formal AI governance',
      },
    ],
  },
  {
    id: 'technical-implementation',
    title: 'Technical Implementation and Continuous Compliance',
    icon: 'Code',
    description:
      'Privacy-by-design implementation, automated compliance pipelines, and continuous monitoring to maintain compliance posture across your technology stack.',
    subOfferings: [
      {
        title: 'Privacy Workflow Implementation',
        description:
          'Privacy-by-design implementation. Consent workflow via AGIGx Consent Platform (banners, preference centers, SDK). Rights automation with configurable workflows.',
        dpdpSections: ['6', '8'],
        penalties: ['₹200 Crore'],
        whoIsThisFor: 'Engineering teams implementing privacy controls',
      },
      {
        title: 'Retention and Control Automation',
        description:
          'Automated retention/deletion pipelines mapped to Section 8(7). Evidence and audit-trail architecture. Scheduled compliance verification.',
        dpdpSections: ['8(7)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations automating data lifecycle management',
      },
      {
        title: 'Evidence and Compliance Reporting',
        description:
          'Immutable consent audit trails. Privacy telemetry dashboards. Compliance health scoring (0-100, A-F) with trend analysis and board-ready reporting.',
        dpdpSections: ['8'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations needing audit-ready evidence',
      },
      {
        title: 'Platform Integration',
        description:
          'Control orchestration across application, infrastructure, and data layers. AGIGx platform integration with existing enterprise systems and workflows.',
        dpdpSections: ['8'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations integrating compliance into existing systems',
      },
      {
        title: 'Continuous Compliance and AI Enablement',
        description:
          'Continuous monitoring via Playwright-powered scanning. AI workflow governance. DevSecOps integration with automated compliance gates.',
        dpdpSections: ['8', '10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations seeking continuous compliance',
      },
    ],
  },
  {
    id: 'assurance-audit',
    title: 'Assurance, Audit and Risk Validation',
    icon: 'ShieldCheck',
    description:
      'Independent assurance services including readiness assessments, gap analysis, control validation, and audit-ready evidence preparation.',
    subOfferings: [
      {
        title: 'Readiness Assessment',
        description:
          'DPDP readiness across 6 domains and 18 checkpoints. Privacy and AI governance maturity assessment with benchmarking against industry peers.',
        dpdpSections: ['5-16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations assessing compliance readiness',
      },
      {
        title: 'Gap Assessment',
        description:
          'Detailed gap analysis with penalty exposure calculation per domain (up to ₹250 Crore). Prioritised remediation roadmaps with effort and cost estimates.',
        dpdpSections: ['5-16'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations needing compliance gap analysis',
      },
      {
        title: 'Control Design Reviews',
        description:
          'Design effectiveness and operating effectiveness reviews. Control testing against Section 8 obligations with evidence documentation.',
        dpdpSections: ['8'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations validating control effectiveness',
      },
      {
        title: 'SDF and DPIA Due Diligence',
        description:
          'DPIA methodology and execution (mandatory for SDFs under Section 10). Algorithmic due diligence with risk quantification and mitigation planning.',
        dpdpSections: ['10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Significant Data Fiduciaries',
      },
      {
        title: 'Audit Evidence and Reporting',
        description:
          'Evidence-pack validation. Internal audit support. Board/regulator assurance reporting with compliance attestation documentation.',
        dpdpSections: ['8', '10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations preparing for audits',
      },
    ],
  },
  {
    id: 'cyber-privacy',
    title: 'Cyber Privacy and Incident Resilience',
    icon: 'Shield',
    description:
      'Privacy-focused security assessments, breach readiness programs, and incident response capabilities aligned with DPDP notification requirements.',
    subOfferings: [
      {
        title: 'Privacy Safeguard Assessment',
        description:
          'Security safeguard review against Section 8(5): encryption, access controls, audit logs. ISO 27001/NIST CSF gap assessment with remediation guidance.',
        dpdpSections: ['8(5)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations reviewing security posture',
      },
      {
        title: 'Proactive Risk Validation',
        description:
          'Offensive privacy assessment and attack-surface review. Privacy exposure assessment identifying data leakage vectors and unauthorised access paths.',
        dpdpSections: ['8(5)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations proactively managing privacy risks',
      },
      {
        title: 'Breach Readiness',
        description:
          'Incident response runbooks for Section 8(6) breach notification. 72-hour response readiness. CERT-In alignment with regulatory communication templates.',
        dpdpSections: ['8(6)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations building breach response capabilities',
      },
      {
        title: 'Regulatory Incident Alignment',
        description:
          'Third-party breach coordination. Regulatory communication. Breach notification to affected individuals with compliant disclosure processes.',
        dpdpSections: ['8(6)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations with breach notification obligations',
      },
      {
        title: 'Resilience Exercises',
        description:
          'Tabletop breach simulation exercises. Post-incident support. Privacy-security convergence review with lessons-learned integration.',
        dpdpSections: ['8(5)', '8(6)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations testing incident readiness',
      },
    ],
  },
  {
    id: 'managed-services',
    title: 'Managed Services and Capability Enablement',
    icon: 'Headphones',
    description:
      'Outsourced privacy operations, virtual DPO services, and capability-building programs to sustain compliance without scaling internal teams.',
    subOfferings: [
      {
        title: 'Privacy Office and vDPO Services',
        description:
          'Privacy Office as a Service. Virtual DPO (mandatory for SDFs Section 10(2)(b)). Named compliance owner with board reporting and regulatory liaison.',
        dpdpSections: ['10(2)(b)'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations needing dedicated privacy leadership',
      },
      {
        title: 'Managed Privacy Operations',
        description:
          'Managed rights and grievance operations. Managed consent and preference operations with SLA-backed response times and evidence generation.',
        dpdpSections: ['6', '11-13'],
        penalties: ['₹200 Crore'],
        whoIsThisFor: 'Organizations outsourcing privacy operations',
      },
      {
        title: 'Managed Governance and Incident Support',
        description:
          'Managed privacy reporting. Managed AI governance support. Managed incident support with 24/7 breach response coordination.',
        dpdpSections: ['8', '10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Organizations needing ongoing governance support',
      },
      {
        title: 'Co-Managed Enterprise Support',
        description:
          'Co-managed support for mature teams. Build-operate-transfer model enabling internal capability development with expert guidance.',
        dpdpSections: ['8', '10'],
        penalties: ['₹250 Crore'],
        whoIsThisFor: 'Enterprises with existing privacy teams',
      },
      {
        title: 'Training and Capability Build',
        description:
          'Function-specific DPDP training for Legal, IT, HR, Operations (Section 8(1)). Role-based modules. Annual refresher schedules with assessment and certification.',
        dpdpSections: ['8(1)'],
        penalties: ['₹50 Crore'],
        whoIsThisFor: 'Organizations building privacy awareness',
      },
    ],
  },
]

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Database,
  Globe,
  Brain,
  Code,
  ShieldCheck,
  Shield,
  Headphones,
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(SERVICE_CATEGORIES[0].id)

  const activeCategory = SERVICE_CATEGORIES.find((c) => c.id === activeTab)!
  const Icon = iconMap[activeCategory.icon]

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
            <span className="gradient-text">Expert-Led Compliance Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            DPDP 2023 enforcement brings penalties up to ₹250 Crore. Our 8 service
            pillars cover every compliance obligation, from initial readiness
            assessment to continuous managed operations.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-10"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Platform views behind our <span className="gradient-text">services delivery</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Screens from AGIGx consent-management: domains & scans, analytics, and DSAR operations,
            where advisory and implementation engagements meet the product.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {servicesPlatformStrip.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass-card overflow-hidden p-0 flex flex-col"
            >
              <div className="relative aspect-[16/10] border-b border-border/40">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-8">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="inline-flex items-center gap-2 rounded-xl p-1.5 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] min-w-max">
            {SERVICE_CATEGORIES.map((category) => {
              const TabIcon = iconMap[category.icon]
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    activeTab === category.id
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">{category.title}</span>
                  <span className="lg:hidden">{category.title.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="pt-4 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card p-6 md:p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {activeCategory.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {activeCategory.description}
                  </p>
                </div>
              </div>
            </div>

            <AccordionRoot type="single" collapsible className="space-y-0">
              {activeCategory.subOfferings.map((offering, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    <span className="text-base font-semibold">{offering.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="glass-card p-5 rounded-lg border border-border/50">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {offering.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {offering.dpdpSections.map((section) => (
                          <Badge key={section} variant="info">
                            Section {section}
                          </Badge>
                        ))}
                        {offering.penalties.map((penalty) => (
                          <Badge key={penalty} variant="warning">
                            Up to {penalty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Who this is for:</span>
                        <span className="text-muted-foreground">{offering.whoIsThisFor}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
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
            <span className="gradient-text">Start Your Compliance Journey</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our guided assessment to receive a personalised compliance roadmap
            tailored to your organization&apos;s specific DPDP obligations.
          </p>
          <Link href="/questionnaire">
            <Button variant="primary" size="lg">
              Begin Assessment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
