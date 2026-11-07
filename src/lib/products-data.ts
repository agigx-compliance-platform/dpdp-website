import type { ElementType } from 'react'
import { Fingerprint, ScanSearch, FileCheck, Server, Bot, RefreshCw, Network, Database, GitBranch, Cookie, FileText } from 'lucide-react'

export const PRODUCTS = [
  {
    id: "consent-platform",
    href: "/consent-management",
    name: "Consent Records",
    tagline:
      "Record every yes, no, and change of mind",
    description:
      "Collect consent for each purpose, let people withdraw it easily, and keep a record of what they agreed to and when. Built for Section 6 of the DPDP Act.",
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
        title: "Proof of consent",
        description:
          "Records of each choice, with the date and time, that cannot be quietly changed",
      },
      {
        title: "Cookie Policy Lifecycle",
        description:
          "Versioned policy publishing linked to consent with automatic invalidation",
      },
      {
        title: "Consent by purpose",
        description:
          "Separate consent for each purpose, with links between purposes that depend on each other",
      },
      {
        title: "SDK Integration",
        description:
          "Add it to your site with one script tag, or build on the API",
      },
    ],
    dpdpSections: ["5", "6(1)", "6(4)", "6(10)"],
    complianceDomains: ["Consent & Notice"],
  },
  {
    id: "cookie-consent",
    href: "/cookie-consent",
    name: "Cookie Consent",
    tagline: "Two banner layouts now. More can be added.",
    description:
      "Two banner layouts today, a bar and a pop-up. See what your page sets, hold back non-essential cookies until a visitor agrees, and keep a record. More layouts, languages, and location rules can be added.",
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
        title: "Wait for a choice",
        description: "Non-essential cookies wait. Saying no is as easy as saying yes.",
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
    name: "Privacy Notices",
    tagline: "Two notice types now. More can be added.",
    description:
      "Privacy notice and cookie policy today, with a saved copy of every version. Children’s notices, vendor lists, and AI disclosures can be added.",
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
        description: "Keep the exact wording each visitor saw.",
      },
    ],
    dpdpSections: ["5", "6"],
    complianceDomains: ["Consent & Notice"],
  },
  {
    id: "trustscope",
    name: "Website Scan",
    tagline: "See what your public website collects and says",
    description:
      "Checks your public websites across 7 categories. Gives a score from 0 to 100 with an A to F grade, finds trackers you may not have disclosed, reviews your privacy policy, and produces a PDF report.",
    icon: "ScanSearch",
    features: [
      {
        title: "Five-part scan",
        description:
          "Cookies, legal pages, privacy policy review, data request options, and other pages on the site",
      },
      {
        title: "Health Score",
        description:
          "0 to 100 with an A to F grade across 7 categories",
      },
      {
        title: "Policy Analysis",
        description:
          "Looks for what the DPDP Act expects and highlights what seems to be missing",
      },
      {
        title: "Data request check",
        description:
          "Finds request forms and privacy contacts, so you can see if people can reach you",
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
    name: "Find Personal Data",
    tagline: "See which systems hold personal data",
    description:
      "Find the systems holding personal data, label what is there, and mark what can be looked up when someone makes a request. Your records stay in your network. More systems can be added.",
    icon: "Database",
    features: [
      {
        title: "Find, label, confirm",
        description:
          "Find the systems, label the personal data, then mark what can be looked up exactly.",
      },
      {
        title: "Records stay with you",
        description:
          "We list systems and fields. We do not take a copy of your records.",
      },
      {
        title: "Classification",
        description:
          "Labels such as contact, financial, and children’s data.",
      },
      {
        title: "Supported systems",
        description:
          "Databases, data warehouses, business apps, and cloud storage. More can be added.",
      },
    ],
    dpdpSections: ["8(5)", "8(7)"],
    complianceDomains: ["Data Security & Breach", "Governance"],
  },
  {
    id: "data-lineage",
    href: "/data-lineage",
    name: "Track Where Data Goes",
    tagline: "See how data moves, and what is still unknown",
    description:
      "A map of how personal data moves between systems, built from your existing technical records. It also shows what is still unknown, rather than guessing.",
    icon: "GitBranch",
    features: [
      {
        title: "Data pipelines",
        description: "Uses your data pipelines to show where data flows.",
      },
      {
        title: "Infrastructure settings",
        description: "Shows systems and vendors listed in your infrastructure.",
      },
      {
        title: "Query history and job runs",
        description: "Show how data actually moved.",
      },
      {
        title: "What is known and unknown",
        description: "Shows which systems are known and which are not.",
      },
    ],
    dpdpSections: ["8(5)", "12", "8(2)"],
    complianceDomains: ["Data Principal Rights", "Governance"],
  },
  {
    id: "dsar-platform",
    name: "Personal Data Requests",
    tagline: "Handle requests to see, correct, or delete data",
    description:
      "When someone asks to see, correct, or delete their data, or makes a complaint, track it through to the end. Requests can come in by web form, email, or API.",
    icon: "FileCheck",
    features: [
      {
        title: "Request steps",
        description:
          "Set up the steps and approvals for each type of request",
      },
      {
        title: "Complaints",
        description:
          "Publish who handles complaints, and track deadlines and escalations",
      },
      {
        title: "Requests from any channel",
        description:
          "Web forms, email, and API, sent to the right team, without duplicates",
      },
      {
        title: "Evidence and Reporting",
        description:
          "A full record of each request, with reports",
      },
    ],
    dpdpSections: ["11", "12", "13", "13(3)"],
    complianceDomains: ["Data Principal Rights"],
  },
  {
    id: "processor-governance",
    name: "Vendor Tracking",
    tagline: "Know which vendors hold data, and keep them informed",
    description:
      "List your vendors and what they use data for. When consent changes or someone makes a request, they are told automatically, and you can see whether the message arrived.",
    icon: "Network",
    features: [
      {
        title: "Vendor list",
        description:
          "One list of your vendors, what they do, and their current status",
      },
      {
        title: "Automatic updates",
        description:
          "Vendors are told when consent changes or a request needs action",
      },
      {
        title: "Delivery tracking",
        description:
          "See which updates arrived, which failed, and which are being retried",
      },
      {
        title: "Vendor risk",
        description:
          "See vendor risk levels and numbers on your dashboard",
      },
      {
        title: "Purpose Mapping",
        description:
          "Link each vendor to its purposes, so you can show who receives what",
      },
      {
        title: "Vendor status history",
        description:
          "Draft, review, active, and archived statuses, with a history of changes",
      },
    ],
    dpdpSections: ["8(2)", "8(5)", "8(7)"],
    complianceDomains: ["Governance", "Data Security & Breach"],
  },
  {
    id: "infra-scanner",
    href: "/infra-posture",
    name: "Cloud and Code Checks",
    tagline: "Spot risky settings that could expose personal data",
    description:
      "Find open storage, accounts with too much access, and personal details left in code, on AWS, Azure, GCP, and Kubernetes. More environments can be added.",
    icon: "Server",
    features: [
      {
        title: "Cloud accounts",
        description:
          "AWS, Azure, and GCP settings that could expose personal data",
      },
      {
        title: "Code repositories",
        description:
          "Personal details left in code, and paths that skip a consent check",
      },
      {
        title: "One list of issues",
        description:
          "Open issues and who owns them, next to your list of data systems",
      },
    ],
    dpdpSections: ["8(5)", "8(6)"],
    complianceDomains: ["Data Security & Breach"],
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    tagline: "Get answers about the DPDP Act quickly",
    description:
      "An AI tool trained on the DPDP Act, the 2025 Rules, and the IT Act. Ask questions, run an 18-question audit with a risk score, and get suggestions for your industry. It is not a replacement for legal advice.",
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
          "18-question audit across 6 areas, with a risk score",
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
    name: "Rule Change Alerts",
    tagline: "Know when the rules change, and what it means for you",
    description:
      "Watches for changes to DPDP and related Indian rules, shows what they could affect, and suggests updates for you to approve.",
    icon: "RefreshCw",
    features: [
      {
        title: "Regulatory Change Detection",
        description:
          "Monitors amendments and new rules with impact assessment on existing controls",
      },
      {
        title: "Suggested policy updates",
        description:
          "Suggested policy updates for you to approve, with version history",
      },
      {
        title: "Multi-Framework Support",
        description:
          "DPDP-led compliance with policy and control cross-mapping",
      },
      {
        title: "Continuous Monitoring",
        description:
          "Scores over time, with early warnings",
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
