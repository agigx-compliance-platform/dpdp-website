import type { ElementType } from 'react'
import { Fingerprint, ScanSearch, FileCheck, Server, Bot, RefreshCw, Network, Database, GitBranch, Cookie, FileText } from 'lucide-react'

export const PRODUCTS = [
  {
    id: "consent-platform",
    href: "/consent-management",
    name: "Consent Cockpit Platform",
    tagline:
      "Consent that satisfies Section 6, from capture to withdrawal to proof",
    description:
      "A full-lifecycle consent management platform that handles banner deployment, preference collection, version tracking, and immutable audit trails. Built specifically for DPDP Section 6 compliance with purpose-based granular consent and one-click withdrawal.",
    icon: "Fingerprint",
    features: [
      {
        title: "Consent Banner Management",
        description:
          "Customisable banners with region-aware consent modes and adaptive display logic",
      },
      {
        title: "Cookie Discovery",
        description:
          "See cookies and tags on the live property, then map them to purposes",
      },
      {
        title: "Immutable Audit Trail",
        description:
          "Append-only consent logs for legal proof with tamper-evident timestamps",
      },
      {
        title: "Cookie Policy Lifecycle",
        description:
          "Versioned policy publishing linked to consent with automatic invalidation",
      },
      {
        title: "Purpose-Based Engine",
        description:
          "Granular consent per data type and purpose with dependency mapping",
      },
      {
        title: "SDK Integration",
        description:
          "Single script tag embed with programmatic API for custom implementations",
      },
    ],
    dpdpSections: ["5", "6(1)", "6(2)", "6(4)", "8(5)", "8(7)"],
    complianceDomains: ["Consent & Notice"],
  },
  {
    id: "cookie-consent",
    href: "/cookie-consent",
    name: "Cookie Consent",
    tagline: "Two banner layouts now. More can be added.",
    description:
      "Bar and modal ship today. Scan what the page sets, block non-essential tags until a grant, and keep a receipt. Further layouts, languages, and location rules can be added.",
    icon: "Cookie",
    features: [
      {
        title: "Bar and modal",
        description: "Two layouts now. Brand colour and copy follow the notice.",
      },
      {
        title: "More layouts can be added",
        description: "Further layouts use the same consent record.",
      },
      {
        title: "Block until grant",
        description: "Non-essential tags wait. Decline is as easy as accept.",
      },
      {
        title: "Preference centre",
        description: "The visitor reopens the same purposes later.",
      },
    ],
    dpdpSections: ["5", "6"],
    complianceDomains: ["Consent & Notice"],
  },
  {
    id: "policy-notice",
    href: "/policy-notice",
    name: "Policy and Notice",
    tagline: "Two notice types now. More can be added.",
    description:
      "Privacy notice and cookie policy ship today, with versioning and purpose mapping. Children’s notices, processor lists, and AI disclosures can be added on the same history.",
    icon: "FileText",
    features: [
      {
        title: "Privacy notice",
        description: "Purposes, rights, and how to reach the grievance officer.",
      },
      {
        title: "Cookie policy",
        description: "What actually loads, named by category and vendor.",
      },
      {
        title: "More types can be added",
        description: "Children, processors, AI, and in-product notices.",
      },
      {
        title: "Version history",
        description: "The text the visitor saw, not a CMS guess.",
      },
    ],
    dpdpSections: ["5", "6"],
    complianceDomains: ["Consent & Notice"],
  },
  {
    id: "trustscope",
    name: "TrustScope Compliance Scanner",
    tagline: "See your privacy posture the way a regulator would",
    description:
      "An external compliance scanner that evaluates your public-facing digital properties across 7 categories. Generates a 0-100 health score with A-F grading, identifies undisclosed trackers, analyses privacy policies, and produces audit-ready PDF reports.",
    icon: "ScanSearch",
    features: [
      {
        title: "5-Phase Scan",
        description:
          "Cookie discovery, legal page discovery, policy analysis, DSAR check, subpage scan",
      },
      {
        title: "Health Score",
        description:
          "0-100 with A-F grading across 7 categories for instant compliance visibility",
      },
      {
        title: "Policy Analysis",
        description:
          "Detects DPDP compliance signals with gap identification",
      },
      {
        title: "DSAR Discovery",
        description:
          "Finds DSAR forms and privacy emails to validate rights accessibility",
      },
      {
        title: "Tracker Intelligence",
        description:
          "Identifies undisclosed third-party trackers and categorises by risk level",
      },
      {
        title: "External Risk Score",
        description:
          "Non-invasive public surface scan with comprehensive PDF report",
      },
    ],
    dpdpSections: ["5", "6", "8(5)", "11-13", "13(3)"],
    complianceDomains: [
      "Consent & Notice",
      "Data Principal Rights",
      "Governance",
    ],
  },
  {
    id: "data-discovery",
    href: "/data-discovery",
    name: "Data Discovery",
    tagline: "A live inventory of personal data, built from catalogs, not spreadsheets",
    description:
      "Locate stores, classify personal data, and mark what a rights request can look up. Records stay in your network. Further connectors can be added.",
    icon: "Database",
    features: [
      {
        title: "Locate, classify, confirm",
        description:
          "Find the stores, name the personal data, then mark exact lookups.",
      },
      {
        title: "Records stay with you",
        description:
          "The inventory is systems and fields. It is not a copy of the rows.",
      },
      {
        title: "Classification",
        description:
          "Contact, financial, child, and other labels a fiduciary can act on.",
      },
      {
        title: "Connectors",
        description:
          "Databases, warehouses, SaaS, streams, and cloud stores today. More can be added.",
      },
    ],
    dpdpSections: ["8(5)", "8(7)"],
    complianceDomains: ["Data Security & Breach", "Governance"],
  },
  {
    id: "data-lineage",
    href: "/data-lineage",
    name: "Data Lineage",
    tagline: "How data moved, and what is still unknown",
    description:
      "A coverage view of known stores. Pipeline definitions, infrastructure, query history, and job runs feed the map. Missing pieces are not invented.",
    icon: "GitBranch",
    features: [
      {
        title: "Pipeline definitions",
        description: "Transforms and sources become edges, not a completeness claim.",
      },
      {
        title: "Infrastructure definitions",
        description: "Stores and processors that exist in infrastructure show up here.",
      },
      {
        title: "Query history and job runs",
        description: "How data actually moved, not how someone remembered it.",
      },
      {
        title: "Coverage view",
        description: "Known versus unknown stores. Gaps stay listed.",
      },
    ],
    dpdpSections: ["8(5)", "12", "8(2)"],
    complianceDomains: ["Data Principal Rights", "Governance"],
  },
  {
    id: "dsar-platform",
    name: "DSAR Management Platform",
    tagline: "Rights workflows that meet Section 11-13 timelines",
    description:
      "Automate Data Subject Access Request workflows with configurable process builders, multi-channel intake, grievance officer management, and SLA tracking. Ensures compliance with Section 11-13 rights obligations within mandated timelines.",
    icon: "FileCheck",
    features: [
      {
        title: "Automated Workflows",
        description:
          "Configurable workflow builder for access, correction, erasure with approval chains",
      },
      {
        title: "Grievance Management",
        description:
          "Named grievance officer publication with SLA tracking and escalation rules",
      },
      {
        title: "Multi-Channel Intake",
        description:
          "Web forms, email, API with automated routing and deduplication",
      },
      {
        title: "Evidence and Reporting",
        description:
          "Complete audit trail with compliance reporting and response analytics",
      },
    ],
    dpdpSections: ["11", "12", "13", "13(3)"],
    complianceDomains: ["Data Principal Rights"],
  },
  {
    id: "processor-governance",
    name: "Vendor & Processor Governance",
    tagline: "Section 8(2) processor oversight from registry to downstream action",
    description:
      "Register third-party processors and vendors, map them to processing purposes, orchestrate consent and DSAR propagation via webhooks, and monitor delivery health, with vendor risk visibility on your organisation dashboard.",
    icon: "Network",
    features: [
      {
        title: "Processor Registry",
        description:
          "Central register of vendors and processors with category, lifecycle status, and webhook credentials",
      },
      {
        title: "Downstream Orchestration",
        description:
          "Automated propagation when consent changes or DSAR workflows require processor action",
      },
      {
        title: "Integration Monitoring",
        description:
          "Delivery status, failures, and retries for processor webhook integrations in one view",
      },
      {
        title: "Vendor Risk Matrix",
        description:
          "Risk classification and processor counts surfaced on the organisation compliance dashboard",
      },
      {
        title: "Purpose Mapping",
        description:
          "Link processors to lawful purposes so preference centres and audits show who receives data",
      },
      {
        title: "Lifecycle Governance",
        description:
          "Draft, review, active, and archived processor states with audit-ready change history",
      },
    ],
    dpdpSections: ["8(2)", "8(5)", "8(7)"],
    complianceDomains: ["Governance", "Data Security & Breach"],
  },
  {
    id: "infra-scanner",
    href: "/infra-posture",
    name: "Infrastructure Posture",
    tagline: "Cloud and code, seen as a privacy duty",
    description:
      "Open storage, over-broad identity, and identifiers left in repositories, on AWS, Azure, GCP, and Kubernetes. More estates can be added.",
    icon: "Server",
    features: [
      {
        title: "Cloud accounts",
        description:
          "AWS, Azure, and GCP findings that put personal data in reach",
      },
      {
        title: "Code repositories",
        description:
          "Identifiers left in the open, and flows that skip a consent check",
      },
      {
        title: "One posture list",
        description:
          "Open items and owners, next to the inventory those stores belong to",
      },
    ],
    dpdpSections: ["8(5)", "8(6)", "10"],
    complianceDomains: ["Data Security & Breach"],
  },
  {
    id: "ai-assistant",
    name: "AI Compliance Assistant",
    tagline: "Expert DPDP guidance in minutes, not days",
    description:
      "An AI-powered advisory tool trained on the DPDP 2023 Act, November 2025 Rules, and the IT Act. Provides instant guidance, runs 18-question compliance audits with penalty calculation, and delivers industry-specific recommendations.",
    icon: "Bot",
    features: [
      {
        title: "AI-Powered Query",
        description:
          "Trained on DPDP 2023, the 2025 Rules, and the IT Act for contextual expert guidance",
      },
      {
        title: "DPDPA Compliance Audit",
        description:
          "18-question audit across 6 domains with penalty calculation and scoring",
      },
      {
        title: "Contextual Recommendations",
        description:
          "Industry-specific guidance based on organization type and data processing patterns",
      },
    ],
    dpdpSections: ["All"],
    complianceDomains: ["All"],
  },
  {
    id: "adaptive-engine",
    name: "Adaptive Compliance Engine",
    tagline: "Compliance that evolves with the law",
    description:
      "A self-learning compliance engine that monitors DPDP and related Indian regulatory changes, adapts policies automatically, and maintains continuous compliance with real-time scoring and trend analysis.",
    icon: "RefreshCw",
    features: [
      {
        title: "Regulatory Change Detection",
        description:
          "Monitors amendments and new rules with impact assessment on existing controls",
      },
      {
        title: "Adaptive Policy Updates",
        description:
          "Self-learning system adapting to changes with version control and rollback",
      },
      {
        title: "Multi-Framework Support",
        description:
          "DPDP-led compliance with policy and control cross-mapping",
      },
      {
        title: "Continuous Monitoring",
        description:
          "Real-time scoring with trend analysis and early warning alerts",
      },
    ],
    dpdpSections: ["All"],
    complianceDomains: ["All"],
  },
];

export const productIconMap: Record<string, ElementType> = {
  Fingerprint,
  ScanSearch,
  FileCheck,
  Network,
  Server,
  Bot,
  RefreshCw,
  Database,
  GitBranch,
  Cookie,
  FileText,
}
