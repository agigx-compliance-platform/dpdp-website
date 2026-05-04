"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Scale, Database, Globe, Brain, Code, ShieldCheck, Shield, Headphones,
  ArrowRight, AlertTriangle, Clock, Layers, ChevronDown, ChevronRight,
  TrendingUp, Building2, Users, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const SERVICE_CATEGORIES = [
  {
    id: "advisory-legal",
    title: "Advisory, Legal and Regulatory",
    icon: "Scale",
    description:
      "Strategic advisory services to navigate DPDP 2023 obligations, establish legal frameworks, and prepare your organization for regulatory compliance from the ground up.",
    subOfferings: [
      {
        title: "DPDP Readiness and Regulatory Advisory",
        description:
          "Applicability assessment against DPDP 2023 Sections 5-16 and November 2025 Rules. Identifies obligations as Data Fiduciary or Significant Data Fiduciary (Section 10). Maps penalty exposure across 6 compliance domains with prioritised remediation roadmaps.",
        dpdpSections: ["5-16", "10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations beginning DPDP compliance journey",
      },
      {
        title: "Privacy Governance, Policy and Consent Design",
        description:
          "Design DPDP-compliant privacy policies (Section 5), consent notice frameworks requiring free, specific, informed consent (Section 6(1)), granular consent per data type (Section 6(2)). Ensures withdrawal is as easy as giving consent (Section 6(4)).",
        dpdpSections: ["5", "6(1)", "6(2)", "6(4)"],
        penalties: ["₹200 Crore"],
        whoIsThisFor:
          "Organizations needing policy and consent framework design",
      },
      {
        title: "Rights, Grievance and DPO Advisory",
        description:
          "Build workflows for Data Principal rights: access, correction, erasure (Sections 11-13). Establish grievance officer with published contact details and SLA (Section 13(3)). Verifiable parental consent processes for children's data (Section 9).",
        dpdpSections: ["9", "11", "12", "13", "13(3)"],
        penalties: ["₹200 Crore"],
        whoIsThisFor: "Organizations establishing rights management processes",
      },
      {
        title: "SDF and Enhanced Compliance Readiness",
        description:
          "Assessment against Significant Data Fiduciary criteria (Section 10): mandatory DPIAs, annual audits, algorithmic accountability, mandatory DPO appointment. Prepares organizations for enhanced regulatory scrutiny.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Large data processors likely classified as SDFs",
      },
      {
        title: "Data Sovereignty and Executive Advisory",
        description:
          "Cross-border transfer governance (Section 16): assess permissibility of data flows to cloud servers, group entities, international destinations. Transfer impact assessments and contractual safeguards.",
        dpdpSections: ["16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations with international data flows",
      },
    ],
  },
  {
    id: "privacy-operations",
    title: "Privacy Operations and Data Governance",
    icon: "Database",
    description:
      "Operationalise privacy compliance with robust data governance frameworks, consent lifecycle management, and automated rights fulfilment processes.",
    subOfferings: [
      {
        title: "Data Inventory, Visibility and Flow Mapping",
        description:
          "Build live inventory of personal data — where it lives, who accesses it (Section 8(5)). Data flow mapping and lineage traceability across systems, databases, and third-party integrations.",
        dpdpSections: ["8(5)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations lacking visibility into their data landscape",
      },
      {
        title: "Consent, Rights and Grievance Operations",
        description:
          "End-to-end consent lifecycle: collection, versioning, withdrawal, preference sync. Automated DSAR workflows with 30-day response timelines. Grievance management with SLA tracking.",
        dpdpSections: ["6", "11-13"],
        penalties: ["₹200 Crore"],
        whoIsThisFor: "Organizations operationalizing consent and rights",
      },
      {
        title: "Retention, Deletion and Records Governance",
        description:
          "Retention schedules mapped to Section 8(7): data erased once purpose fulfilled. Automated deletion pipelines with quarterly testing and evidence generation.",
        dpdpSections: ["8(7)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations with data retention compliance gaps",
      },
      {
        title: "Processor, Vendor and Data-Sharing Governance",
        description:
          "Vendor contract audits against Section 8(2): DPA clauses, audit rights, subprocessor restrictions, breach notification pass-through. Third-party risk management frameworks.",
        dpdpSections: ["8(2)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations with complex vendor ecosystems",
      },
      {
        title: "Privacy Operating Model",
        description:
          "Design privacy operating models with designated compliance leads (Section 10(2)(b) for SDFs), function-specific accountability, board reporting, and cross-functional governance structures.",
        dpdpSections: ["10(2)(b)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor:
          "Mature organizations building sustainable privacy programs",
      },
    ],
  },
  {
    id: "data-sovereignty",
    title: "Data Sovereignty and Cross-Border Governance",
    icon: "Globe",
    description:
      "Navigate cross-border data transfer complexities under Section 16 with sovereign architecture advisory, transfer impact assessments, and jurisdictional risk management.",
    subOfferings: [
      {
        title: "Data Residency Advisory",
        description:
          "Assessment of data flows crossing Indian borders (Section 16). Cloud provider residency review. Permissibility assessment per destination with regulatory mapping.",
        dpdpSections: ["16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations using international cloud services",
      },
      {
        title: "Cross-Border Transfer Governance",
        description:
          "Contractual safeguards for transfers. Transfer impact assessments. Data-sharing control design with documentation for regulatory review.",
        dpdpSections: ["16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Multinationals with cross-border data flows",
      },
      {
        title: "Jurisdictional Risk Review",
        description:
          "Foreign access-risk review. Sub-processor geography assessment. Jurisdictional exposure mapping across all data processing locations.",
        dpdpSections: ["16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations with global operations",
      },
      {
        title: "Sovereign Architecture Advisory",
        description:
          "Sovereign cloud advisory. Deployment pattern review for localisation. Architecture alignment with DPDP transfer provisions and government-approved destinations.",
        dpdpSections: ["16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations designing compliant cloud architectures",
      },
      {
        title: "Sovereignty Assurance",
        description:
          "Evidence and documentation for sovereignty compliance. Audit-ready reporting for cross-border governance. Continuous monitoring of transfer compliance.",
        dpdpSections: ["16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations preparing for regulatory audits",
      },
    ],
  },
  {
    id: "ai-governance",
    title: "AI Governance and Responsible AI",
    icon: "Brain",
    description:
      "Establish AI governance frameworks aligned with DPDP algorithmic accountability requirements, responsible AI controls, and GenAI-specific governance protocols.",
    subOfferings: [
      {
        title: "AI Governance Strategy",
        description:
          "AI governance framework aligned with DPDP algorithmic accountability (Section 10 for SDFs). AI Governance Office establishment with accountability models and board reporting.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations deploying AI at scale",
      },
      {
        title: "AI Policy and Risk Governance",
        description:
          "AI use-case inventory, risk-tiering, classification. Policy frameworks including acceptable-use policies, procurement guidelines, and vendor AI risk assessment.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations needing AI governance frameworks",
      },
      {
        title: "Responsible AI Controls",
        description:
          "Human oversight and accountability models. Responsible AI control frameworks. Transparency requirements including explainability and bias monitoring.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations implementing responsible AI practices",
      },
      {
        title: "GenAI Governance",
        description:
          "GenAI governance framework. Third-party AI vendor risk reviews. AI prompt/training/output data governance with privacy-preserving controls.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations using generative AI tools",
      },
      {
        title: "AI Governance Office Design",
        description:
          "Design and operationalise AI Governance Office. Accountability models aligned with regulatory expectations. Cross-functional AI oversight structures.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Large enterprises needing formal AI governance",
      },
    ],
  },
  {
    id: "technical-implementation",
    title: "Technical Implementation and Continuous Compliance",
    icon: "Code",
    description:
      "Privacy-by-design implementation, automated compliance pipelines, and continuous monitoring to maintain compliance posture across your technology stack.",
    subOfferings: [
      {
        title: "Privacy Workflow Implementation",
        description:
          "Privacy-by-design implementation. Consent workflow via AGIGx Consent Platform (banners, preference centers, SDK). Rights automation with configurable workflows.",
        dpdpSections: ["6", "8"],
        penalties: ["₹200 Crore"],
        whoIsThisFor: "Engineering teams implementing privacy controls",
      },
      {
        title: "Retention and Control Automation",
        description:
          "Automated retention/deletion pipelines mapped to Section 8(7). Evidence and audit-trail architecture. Scheduled compliance verification.",
        dpdpSections: ["8(7)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations automating data lifecycle management",
      },
      {
        title: "Evidence and Compliance Reporting",
        description:
          "Immutable consent audit trails. Privacy telemetry dashboards. Compliance health scoring (0-100, A-F) with trend analysis and board-ready reporting.",
        dpdpSections: ["8"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations needing audit-ready evidence",
      },
      {
        title: "Platform Integration",
        description:
          "Control orchestration across application, infrastructure, and data layers. AGIGx platform integration with existing enterprise systems and workflows.",
        dpdpSections: ["8"],
        penalties: ["₹250 Crore"],
        whoIsThisFor:
          "Organizations integrating compliance into existing systems",
      },
      {
        title: "Continuous Compliance and AI Enablement",
        description:
          "Continuous monitoring via Playwright-powered scanning. AI workflow governance. DevSecOps integration with automated compliance gates.",
        dpdpSections: ["8", "10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations seeking continuous compliance",
      },
    ],
  },
  {
    id: "assurance-audit",
    title: "Assurance, Audit and Risk Validation",
    icon: "ShieldCheck",
    description:
      "Independent assurance services including readiness assessments, gap analysis, control validation, and audit-ready evidence preparation.",
    subOfferings: [
      {
        title: "Readiness Assessment",
        description:
          "DPDP readiness across 6 domains and 18 checkpoints. Privacy and AI governance maturity assessment with benchmarking against industry peers.",
        dpdpSections: ["5-16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations assessing compliance readiness",
      },
      {
        title: "Gap Assessment",
        description:
          "Detailed gap analysis with penalty exposure calculation per domain (up to ₹250 Crore). Prioritised remediation roadmaps with effort and cost estimates.",
        dpdpSections: ["5-16"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations needing compliance gap analysis",
      },
      {
        title: "Control Design Reviews",
        description:
          "Design effectiveness and operating effectiveness reviews. Control testing against Section 8 obligations with evidence documentation.",
        dpdpSections: ["8"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations validating control effectiveness",
      },
      {
        title: "SDF and DPIA Due Diligence",
        description:
          "DPIA methodology and execution (mandatory for SDFs under Section 10). Algorithmic due diligence with risk quantification and mitigation planning.",
        dpdpSections: ["10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Significant Data Fiduciaries",
      },
      {
        title: "Audit Evidence and Reporting",
        description:
          "Evidence-pack validation. Internal audit support. Board/regulator assurance reporting with compliance attestation documentation.",
        dpdpSections: ["8", "10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations preparing for audits",
      },
    ],
  },
  {
    id: "cyber-privacy",
    title: "Cyber Privacy and Incident Resilience",
    icon: "Shield",
    description:
      "Privacy-focused security assessments, breach readiness programs, and incident response capabilities aligned with DPDP notification requirements.",
    subOfferings: [
      {
        title: "Privacy Safeguard Assessment",
        description:
          "Security safeguard review against Section 8(5): encryption, access controls, audit logs. ISO 27001/NIST CSF gap assessment with remediation guidance.",
        dpdpSections: ["8(5)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations reviewing security posture",
      },
      {
        title: "Proactive Risk Validation",
        description:
          "Offensive privacy assessment and attack-surface review. Privacy exposure assessment identifying data leakage vectors and unauthorised access paths.",
        dpdpSections: ["8(5)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations proactively managing privacy risks",
      },
      {
        title: "Breach Readiness",
        description:
          "Incident response runbooks for Section 8(6) breach notification. 72-hour response readiness. CERT-In alignment with regulatory communication templates.",
        dpdpSections: ["8(6)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations building breach response capabilities",
      },
      {
        title: "Regulatory Incident Alignment",
        description:
          "Third-party breach coordination. Regulatory communication. Breach notification to affected individuals with compliant disclosure processes.",
        dpdpSections: ["8(6)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations with breach notification obligations",
      },
      {
        title: "Resilience Exercises",
        description:
          "Tabletop breach simulation exercises. Post-incident support. Privacy-security convergence review with lessons-learned integration.",
        dpdpSections: ["8(5)", "8(6)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations testing incident readiness",
      },
    ],
  },
  {
    id: "managed-services",
    title: "Managed Services and Capability Enablement",
    icon: "Headphones",
    description:
      "Outsourced privacy operations, virtual DPO services, and capability-building programs to sustain compliance without scaling internal teams.",
    subOfferings: [
      {
        title: "Privacy Office and vDPO Services",
        description:
          "Privacy Office as a Service. Virtual DPO (mandatory for SDFs Section 10(2)(b)). Named compliance owner with board reporting and regulatory liaison.",
        dpdpSections: ["10(2)(b)"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations needing dedicated privacy leadership",
      },
      {
        title: "Managed Privacy Operations",
        description:
          "Managed rights and grievance operations. Managed consent and preference operations with SLA-backed response times and evidence generation.",
        dpdpSections: ["6", "11-13"],
        penalties: ["₹200 Crore"],
        whoIsThisFor: "Organizations outsourcing privacy operations",
      },
      {
        title: "Managed Governance and Incident Support",
        description:
          "Managed privacy reporting. Managed AI governance support. Managed incident support with 24/7 breach response coordination.",
        dpdpSections: ["8", "10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Organizations needing ongoing governance support",
      },
      {
        title: "Co-Managed Enterprise Support",
        description:
          "Co-managed support for mature teams. Build-operate-transfer model enabling internal capability development with expert guidance.",
        dpdpSections: ["8", "10"],
        penalties: ["₹250 Crore"],
        whoIsThisFor: "Enterprises with existing privacy teams",
      },
      {
        title: "Training and Capability Build",
        description:
          "Function-specific DPDP training for Legal, IT, HR, Operations (Section 8(1)). Role-based modules. Annual refresher schedules with assessment and certification.",
        dpdpSections: ["8(1)"],
        penalties: ["₹50 Crore"],
        whoIsThisFor: "Organizations building privacy awareness",
      },
    ],
  },
];

const RISK_STATS = [
  { value: "₹250Cr", label: "Maximum penalty per violation", icon: AlertTriangle },
  { value: "72hrs", label: "Breach notification window", icon: Clock },
  { value: "8+", label: "Domains of DPDP obligation", icon: Layers },
  { value: "2025", label: "Rules enforcement deadline", icon: TrendingUp },
];

const COMPANY_TYPES = [
  { id: "startup", label: "Startup / SMB", multiplier: 0.3, description: "Under 50 employees, limited data processing" },
  { id: "midmarket", label: "Mid-Market", multiplier: 0.6, description: "50–500 employees, moderate data flows" },
  { id: "enterprise", label: "Enterprise", multiplier: 0.85, description: "500+ employees, complex data ecosystem" },
  { id: "sdf", label: "Significant Data Fiduciary", multiplier: 1.0, description: "High-volume or sensitive data processor" },
];

const OBLIGATION_DOMAINS = [
  { id: "consent", label: "Consent Management", section: "6", weight: 0.2 },
  { id: "rights", label: "Data Principal Rights", section: "11-13", weight: 0.15 },
  { id: "security", label: "Security Safeguards", section: "8(5)", weight: 0.2 },
  { id: "crossborder", label: "Cross-Border Transfers", section: "16", weight: 0.15 },
  { id: "retention", label: "Retention & Deletion", section: "8(7)", weight: 0.15 },
  { id: "ai", label: "AI / Algorithmic Accountability", section: "10", weight: 0.15 },
];

const TIMELINE_PHASES = [
  { id: "understand", label: "Understand", duration: "Week 1–2", categoryIds: ["advisory-legal", "assurance-audit"] },
  { id: "design", label: "Design", duration: "Week 3–6", categoryIds: ["privacy-operations", "data-sovereignty"] },
  { id: "operate", label: "Operate", duration: "Month 2–3", categoryIds: ["technical-implementation", "cyber-privacy"] },
  { id: "govern", label: "Govern", duration: "Month 3–6", categoryIds: ["ai-governance", "managed-services"] },
  { id: "scale", label: "Scale", duration: "Ongoing", categoryIds: ["managed-services", "assurance-audit"] },
];

const iconMap: Record<string, React.ElementType> = {
  Scale, Database, Globe, Brain, Code, ShieldCheck, Shield, Headphones,
};

function HeroSection() {
  return (
    <SectionWrapper className="pt-32 md:pt-40 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="gradient-text">
            Expert-Led Compliance Services
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          DPDP 2023 enforcement brings penalties up to ₹250 Crore. Our 8
          service pillars cover every compliance obligation — from initial
          readiness assessment to continuous managed operations.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}

function RealityCheckSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 px-6"
      style={{ background: "hsl(var(--background))", borderTop: "1px solid hsl(var(--foreground) / 0.05)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-green-400 text-sm font-medium tracking-widest uppercase mb-4">
            Why this matters
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            You don&apos;t have a compliance problem.
            <br />
            <span style={{ color: "hsl(var(--muted-foreground))" }}>You have a visibility problem.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RISK_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{
                  background: "hsl(var(--foreground) / 0.03)",
                  border: "1px solid hsl(var(--foreground) / 0.07)",
                  borderTop: "2px solid hsl(var(--primary) / 0.5)",
                }}
              >
                <Icon className="w-5 h-5 text-green-500" />
                <p
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 leading-snug">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PenaltyMeterSection() {
  const [selectedType, setSelectedType] = useState("startup");
  const [selectedDomains, setSelectedDomains] = useState<string[]>(["consent", "security"]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const companyType = COMPANY_TYPES.find((c) => c.id === selectedType)!;
  const domainWeight = OBLIGATION_DOMAINS.filter((d) =>
    selectedDomains.includes(d.id)
  ).reduce((sum, d) => sum + d.weight, 0);
  const exposurePercent = Math.min(100, Math.round(companyType.multiplier * domainWeight * 100 * 10));
  const exposureCrore = Math.round((exposurePercent / 100) * 250);

  const toggleDomain = (id: string) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const meterColor =
    exposurePercent > 70
      ? "hsl(var(--destructive))"
      : exposurePercent > 40
      ? "hsl(var(--warning))"
      : "hsl(var(--primary))";

  return (
    <section
      ref={ref}
      className="py-24 px-6"
      style={{ background: "hsl(var(--background-secondary))" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-green-400 text-sm font-medium tracking-widest uppercase mb-4">
            Interactive Risk Assessment
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            What&apos;s your penalty exposure?
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Select your organisation type and the domains where you have gaps. The meter calculates live.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Company type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mb-4">
              Organisation Type
            </p>
            <div className="flex flex-col gap-3">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="rounded-xl p-4 text-left transition-all duration-200 w-full"
                  style={{
                    background:
                      selectedType === type.id
                        ? "hsl(var(--primary) / 0.1)"
                        : "hsl(var(--foreground) / 0.03)",
                    border:
                      selectedType === type.id
                        ? "1px solid hsl(var(--primary) / 0.4)"
                        : "1px solid hsl(var(--foreground) / 0.07)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: selectedType === type.id ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
                    >
                      {type.label}
                    </span>
                    {selectedType === type.id && (
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{type.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Domains + Meter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mb-4">
                Compliance Gaps (select all that apply)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {OBLIGATION_DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => toggleDomain(domain.id)}
                    className="rounded-lg px-3 py-2.5 text-left text-xs transition-all duration-150"
                    style={{
                      background: selectedDomains.includes(domain.id)
                        ? "hsl(var(--primary) / 0.1)"
                        : "hsl(var(--foreground) / 0.03)",
                      border: selectedDomains.includes(domain.id)
                        ? "1px solid hsl(var(--primary) / 0.35)"
                        : "1px solid hsl(var(--foreground) / 0.07)",
                      color: selectedDomains.includes(domain.id) ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <span className="block font-medium text-[11px] mb-0.5">§ {domain.section}</span>
                    {domain.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exposure meter */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "hsl(var(--foreground) / 0.03)",
                border: "1px solid hsl(var(--foreground) / 0.07)",
              }}
            >
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Estimated Exposure</p>
                  <motion.p
                    key={exposureCrore}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold"
                    style={{ color: meterColor }}
                  >
                    ₹{exposureCrore} Cr
                  </motion.p>
                </div>
                <p className="text-xs text-slate-600">of ₹250 Cr max</p>
              </div>

              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ background: "hsl(var(--foreground) / 0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${exposurePercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(90deg, #22c55e, ${meterColor})`,
                    boxShadow: `0 0 12px ${meterColor}60`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-600 mt-3">
                This is a directional estimate. A full readiness assessment maps exact obligations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TimelineNav({
  activePhase,
  setActivePhase,
}: {
  activePhase: string;
  setActivePhase: (id: string) => void;
}) {
  return (
    <div id="services-nav" className="py-16 px-6" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-green-400 text-sm font-medium tracking-widest uppercase mb-3">
            Your Compliance Journey
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            Where are you today?
          </h2>
        </div>

        {/* Timeline — desktop */}
        <div className="hidden md:flex items-start relative">
          {/* Connecting line */}
          <div
            className="absolute top-6 left-0 right-0 h-px"
            style={{ background: "hsl(var(--foreground) / 0.08)", zIndex: 0 }}
          />
          {TIMELINE_PHASES.map((phase, i) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className="flex-1 flex flex-col items-center gap-3 relative z-10 group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                style={{
                  background:
                    activePhase === phase.id
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "hsl(var(--foreground) / 0.05)",
                  border:
                    activePhase === phase.id
                      ? "none"
                      : "1px solid hsl(var(--foreground) / 0.1)",
                  color: activePhase === phase.id ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  boxShadow:
                    activePhase === phase.id ? "0 0 20px hsl(var(--primary) / 0.4)" : "none",
                }}
              >
                {i + 1}
              </div>
              <div className="text-center">
                <p
                  className="font-semibold text-sm transition-colors duration-200"
                  style={{
                    color: activePhase === phase.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {phase.label}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{phase.duration}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Timeline — mobile */}
        <div className="md:hidden flex flex-col gap-3">
          {TIMELINE_PHASES.map((phase, i) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className="flex items-center gap-4 rounded-xl p-4 w-full text-left transition-all duration-200"
              style={{
                background:
                  activePhase === phase.id
                    ? "hsl(var(--primary) / 0.1)"
                    : "hsl(var(--foreground) / 0.03)",
                border:
                  activePhase === phase.id
                    ? "1px solid hsl(var(--primary) / 0.3)"
                    : "1px solid hsl(var(--foreground) / 0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background:
                    activePhase === phase.id
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "hsl(var(--foreground) / 0.05)",
                  color: activePhase === phase.id ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: activePhase === phase.id ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
                >
                  {phase.label}
                </p>
                <p className="text-xs text-slate-500">{phase.duration}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceStoryBlock({ category }: { category: (typeof SERVICE_CATEGORIES)[0] }) {
  const [openOffering, setOpenOffering] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = iconMap[category.icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        background: "hsl(var(--foreground) / 0.025)",
        border: "1px solid hsl(var(--foreground) / 0.07)",
        borderLeft: "3px solid #22c55e",
      }}
    >
      {/* Header */}
      <div className="grid md:grid-cols-[1fr_2fr] gap-0">
        {/* Left: category overview */}
        <div
          className="p-8 flex flex-col justify-between gap-6"
          style={{ borderRight: "1px solid hsl(var(--foreground) / 0.06)" }}
        >
          <div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              <Icon className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
              {category.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{category.description}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-2">
              {category.subOfferings.length} service offerings
            </p>
            <Link href="/questionnaire">
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors duration-150"
              >
                Explore this pillar <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right: sub-offerings */}
        <div className="divide-y" style={{ borderColor: "hsl(var(--foreground) / 0.05)" }}>
          {category.subOfferings.map((offering, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenOffering(openOffering === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left group transition-all duration-150 hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-3 flex-1 pr-4">
                  <span
                    className="text-xs font-mono mt-0.5 shrink-0"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    {offering.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openOffering === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openOffering === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-5 pb-6 ml-8"
                      style={{ borderTop: "1px solid hsl(var(--foreground) / 0.05)" }}
                    >
                      <p className="text-sm text-slate-400 leading-relaxed mt-4 mb-5">
                        {offering.description}
                      </p>

                      {/* Three-column breakdown */}
                      <div className="grid md:grid-cols-3 gap-4 mb-5">
                        <div
                          className="rounded-lg p-4"
                          style={{
                            background: "hsl(var(--primary) / 0.06)",
                            border: "1px solid hsl(var(--primary) / 0.15)",
                          }}
                        >
                          <p className="text-xs font-medium text-green-400 mb-2">
                            DPDP Sections
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {offering.dpdpSections.map((s) => (
                              <span
                                key={s}
                                className="text-xs rounded-md px-2 py-0.5 font-mono"
                                style={{
                                  background: "hsl(var(--primary) / 0.1)",
                                  color: "hsl(var(--primary))",
                                }}
                              >
                                §{s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div
                          className="rounded-lg p-4"
                          style={{
                            background: "hsl(var(--destructive) / 0.06)",
                            border: "1px solid hsl(var(--destructive) / 0.15)",
                          }}
                        >
                          <p className="text-xs font-medium text-red-400 mb-2">
                            Risk Removed
                          </p>
                          {offering.penalties.map((p) => (
                            <p key={p} className="text-sm font-bold text-red-300">
                              Up to {p} exposure
                            </p>
                          ))}
                        </div>

                        <div
                          className="rounded-lg p-4"
                          style={{
                            background: "hsl(var(--info) / 0.06)",
                            border: "1px solid hsl(var(--info) / 0.15)",
                          }}
                        >
                          <p className="text-xs font-medium text-indigo-400 mb-2">
                            Who It&apos;s For
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {offering.whoIsThisFor}
                          </p>
                        </div>
                      </div>

                      <Link href="/questionnaire">
                        <button
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150"
                          style={{
                            background: "hsl(var(--primary) / 0.1)",
                            border: "1px solid hsl(var(--primary) / 0.25)",
                            color: "hsl(var(--primary))",
                          }}
                        >
                          Assess this gap <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ClosingCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-8 px-6" style={{ background: "hsl(var(--background))" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto rounded-3xl p-12 md:p-16 text-center overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary-hover) / 0.08) 50%, hsl(var(--primary) / 0.05) 100%)",
          border: "1px solid hsl(var(--primary) / 0.2)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>
            Start your compliance journey
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Take the guided assessment. Receive a personalised DPDP roadmap with
            penalty exposure mapped per domain.
          </p>
          <Link href="/questionnaire">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "hsl(var(--foreground))",
                fontSize: "1rem",
                boxShadow: "0 0 32px hsl(var(--primary) / 0.35)",
              }}
            >
              Begin Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function ServicesPage() {
  const [activePhase, setActivePhase] = useState(TIMELINE_PHASES[0].id);

  const visibleCategoryIds =
    TIMELINE_PHASES.find((p) => p.id === activePhase)?.categoryIds ?? [];

  const visibleCategories = SERVICE_CATEGORIES.filter((c) =>
    visibleCategoryIds.includes(c.id)
  );

  return (
    <div style={{ background: "hsl(var(--background))", minHeight: "100vh" }}>
      <HeroSection />
      <RealityCheckSection />
      <PenaltyMeterSection />
      <TimelineNav activePhase={activePhase} setActivePhase={setActivePhase} />

      <section className="px-6 pb-8" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {visibleCategories.length > 0 ? (
                visibleCategories.map((cat) => (
                  <ServiceStoryBlock key={cat.id} category={cat} />
                ))
              ) : (
                SERVICE_CATEGORIES.map((cat) => (
                  <ServiceStoryBlock key={cat.id} category={cat} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <ClosingCTASection />
    </div>
  );
}