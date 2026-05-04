"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Fingerprint,
  ScanSearch,
  FileCheck,
  Server,
  Bot,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { productScreenshots } from "@/lib/agigx-ui-screenshots";
import { useQuestionnaireStore } from "@/store/questionnaireStore";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true });
gsap.defaults({ ease: "power2.out", duration: 0.4 });
ScrollTrigger.config({
  ignoreMobileResize: true,
  limitCallbacks: true,
});

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "consent-platform",
    name: "Consent Cockpit Platform",
    tagline:
      "Consent that satisfies Section 6 — from capture to withdrawal to proof",
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
          "Playwright-powered scanning discovers all cookies and trackers across your digital properties",
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
          "Detects GDPR, DPDP, CCPA compliance signals with gap identification",
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
    id: "infra-scanner",
    name: "Infrastructure and Code Scanner",
    tagline: "Compliance visibility from cloud to codebase",
    description:
      "Scans your cloud infrastructure and code repositories for privacy-relevant misconfigurations, PII exposure, and consent bypass patterns. Provides unified compliance dashboards across AWS, Azure, and GCP environments.",
    icon: "Server",
    features: [
      {
        title: "Cloud Security Scanning",
        description:
          "AWS, Azure, GCP misconfiguration detection with privacy-focused rules",
      },
      {
        title: "Code Repository Scanning",
        description:
          "Static analysis for PII exposure and consent bypass in source code",
      },
      {
        title: "Compliance Dashboard",
        description:
          "Unified infrastructure and code compliance view with trend tracking",
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
      "An AI-powered advisory tool trained on the DPDP 2023 Act, November 2025 Rules, and global privacy frameworks. Provides instant guidance, runs 18-question compliance audits with penalty calculation, and delivers industry-specific recommendations.",
    icon: "Bot",
    features: [
      {
        title: "AI-Powered Query",
        description:
          "Trained on DPDP 2023 Act and global frameworks for instant expert guidance",
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
      "A self-learning compliance engine that monitors regulatory changes, adapts policies automatically, and maintains continuous compliance across DPDP, GDPR, CCPA, and LGPD frameworks with real-time scoring and trend analysis.",
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
          "DPDP, GDPR, CCPA, LGPD unified compliance with cross-mapping",
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

const iconMap: Record<string, React.ElementType> = {
  Fingerprint,
  ScanSearch,
  FileCheck,
  Server,
  Bot,
  RefreshCw,
};

// ─── Scroll Storytelling — SNAP TO STEP ──────────────────────────────────────

const N = PRODUCTS.length;

function ProductsScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>(Array(N).fill(null));
  const stepLabelRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const textPanelRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const imagePanelRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const rafRef = useRef<number | null>(null);
  const featureGroupRefs = useRef<(HTMLDivElement | null)[]>(
    Array(N).fill(null),
  );
  const currentStepRef = useRef(0);

  const goToStep = (next: number) => {
    const prev = currentStepRef.current;
    if (prev === next) return;
    currentStepRef.current = next;

    const dir = next > prev ? 1 : -1;

    const prevLabel = stepLabelRefs.current[prev];
    const prevText = textPanelRefs.current[prev];
    const prevFeature = featureGroupRefs.current[prev];
    const prevImage = imagePanelRefs.current[prev];
    const nextLabel = stepLabelRefs.current[next];
    const nextText = textPanelRefs.current[next];
    const nextFeature = featureGroupRefs.current[next];
    const nextImage = imagePanelRefs.current[next];

    const allEls = [
      prevLabel,
      prevText,
      prevFeature,
      prevImage,
      nextLabel,
      nextText,
      nextFeature,
      nextImage,
    ].filter(Boolean);
    if (allEls.length) gsap.killTweensOf(allEls);

    const outEls = [prevLabel, prevText, prevFeature].filter(Boolean);
    if (outEls.length) {
      gsap.to(outEls, {
        opacity: 0,
        y: dir * -24,
        duration: 0.28,
        ease: "power2.in",
        stagger: 0.02,
        force3D: true,
      });
    }
    if (prevImage) {
      gsap.to(prevImage, {
        opacity: 0,
        scale: dir > 0 ? 1.05 : 0.95,
        duration: 0.36,
        ease: "power2.in",
        force3D: true,
      });
    }

    const inEls = [nextLabel, nextText, nextFeature].filter(Boolean);
    if (inEls.length) {
      gsap.set(inEls, { opacity: 0, y: dir * 36, force3D: true });
      gsap.to(inEls, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power3.out",
        stagger: 0.04,
        delay: 0.12,
        force3D: true,
      });
    }
    if (nextImage) {
      gsap.set(nextImage, {
        opacity: 0,
        scale: dir > 0 ? 0.94 : 1.05,
        force3D: true,
      });
      gsap.to(nextImage, {
        opacity: 1,
        scale: 1,
        duration: 0.58,
        ease: "power3.out",
        delay: 0.12,
        force3D: true,
      });
    }

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        height: `${(next / (N - 1)) * 100}%`,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      dot.dataset.active = i <= next ? "true" : "false";
      dot.dataset.current = i === next ? "true" : "false";
      gsap.to(dot, {
        scale: i === next ? 1.5 : 1,
        duration: 0.35,
        ease: "power2.out",
      });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      for (let i = 1; i < N; i++) {
        const els = [
          stepLabelRefs.current[i],
          textPanelRefs.current[i],
          featureGroupRefs.current[i],
        ].filter(Boolean);
        if (els.length) gsap.set(els, { opacity: 0, y: 36, force3D: true });
        if (imagePanelRefs.current[i])
          gsap.set(imagePanelRefs.current[i], {
            opacity: 0,
            scale: 0.94,
            force3D: true,
          });
      }

      if (dotRefs.current[0]) {
        dotRefs.current[0].dataset.active = "true";
        dotRefs.current[0].dataset.current = "true";
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${N * 100}vh`,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (N - 1),
          duration: { min: 0.6, max: 0.9 },
          delay: 0.1,
          ease: "power2.inOut",
          inertia: false,
        },
        onUpdate: (self) => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const step = Math.round(self.progress * (N - 1));
            if (step !== currentStepRef.current) {
              goToStep(step);
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-background"
      style={{ willChange: "transform" }}
      aria-label="Product scroll story"
    >
      <div
        className="relative flex h-full w-full max-w-screen-xl mx-auto px-6 lg:px-12 gap-6 lg:gap-12 items-center"
        style={{ transform: "translateZ(0)" }}
      >
        {/* ── Left: Step indicator rail ────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col items-center flex-shrink-0 gap-0 py-8"
          aria-hidden="true"
        >
          <div className="relative w-px bg-border" style={{ height: 280 }}>
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full bg-primary rounded-full"
              style={{
                height: "0%",
                willChange: "height",
                transition: "height 0.05s linear",
              }}
            />
            {PRODUCTS.map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="absolute left-1/2 rounded-full bg-border"
                style={{
                  top: `${(i / (PRODUCTS.length - 1)) * 100}%`,
                  transform: "translate(-50%, -50%) scale(1)",
                  width: 10,
                  height: 10,
                  willChange: "transform, background, box-shadow",
                  transition:
                    "transform 0.3s cubic-bezier(.34,1.56,.64,1), background 0.3s ease, box-shadow 0.3s ease",
                  background: i === 0 ? "hsl(var(--primary))" : undefined,
                }}
              />
            ))}
          </div>
        </aside>

        {/* ── Centre: Text + features ──────────────────────────────────── */}
        <div className="flex-1 min-w-0 relative" style={{ minHeight: "60vh" }}>
          {PRODUCTS.map((product, i) => {
            const Icon = iconMap[product.icon];
            return (
              <div
                key={product.id}
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                <div
                  ref={(el) => {
                    stepLabelRefs.current[i] = el;
                  }}
                  className="flex items-center gap-3 mb-5"
                  style={{ willChange: "opacity, transform" }}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-mono tracking-widest text-primary uppercase">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(PRODUCTS.length).padStart(2, "0")}
                  </span>
                </div>

                <div
                  ref={(el) => {
                    textPanelRefs.current[i] = el;
                  }}
                  style={{ willChange: "opacity, transform" }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-primary font-medium mb-3 text-sm">
                    {product.tagline}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-5 max-w-xl text-sm md:text-base">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.dpdpSections.map((section) => (
                      <Badge key={section} variant="info">
                        {section === "All"
                          ? "All Sections"
                          : `Section ${section}`}
                      </Badge>
                    ))}
                    {product.complianceDomains.map((domain) => (
                      <Badge key={domain} variant="success">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div
                  ref={(el) => {
                    featureGroupRefs.current[i] = el;
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  style={{ willChange: "opacity, transform" }}
                >
                  {product.features.slice(0, 4).map((feature) => (
                    <Card
                      key={feature.title}
                      variant="outline"
                      className="hover:border-primary/30"
                    >
                      <CardContent className="p-3">
                        <h4 className="text-xs font-semibold text-foreground mb-0.5">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right: Image / visual panel ──────────────────────────────── */}
        <div
          className="hidden lg:block flex-shrink-0 relative"
          style={{ width: 420, height: "70vh" }}
        >
          {PRODUCTS.map((product, i) => {
            const Icon = iconMap[product.icon];
            const hasScreenshot = product.id in productScreenshots;

            return (
              <div
                key={product.id}
                ref={(el) => {
                  imagePanelRefs.current[i] = el;
                }}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-border/50 shadow-card bg-card"
                style={{
                  willChange: "opacity, transform",
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                {hasScreenshot ? (
                  <>
                    <Image
                      src={
                        productScreenshots[
                          product.id as keyof typeof productScreenshots
                        ].src
                      }
                      alt={`Screenshot: ${product.name}`}
                      fill
                      className="object-cover object-top"
                      sizes="420px"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-background via-background/90 to-transparent p-4 pt-12">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {
                          productScreenshots[
                            product.id as keyof typeof productScreenshots
                          ].caption
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
                      <div className="space-y-3 mt-6 flex-1">
                        <div className="h-4 rounded bg-secondary/40 w-3/4" />
                        <div className="h-4 rounded bg-secondary/30 w-1/2" />
                        <div className="h-8 rounded bg-primary/20 w-full mt-4" />
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="h-16 rounded bg-secondary/30" />
                          <div className="h-16 rounded bg-secondary/30" />
                          <div className="h-16 rounded bg-secondary/30" />
                        </div>
                        <div className="h-4 rounded bg-secondary/20 w-2/3 mt-2" />
                        <div className="h-4 rounded bg-secondary/20 w-1/2" />
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/20">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {product.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mobile: stacked image ────────────────────────────────────── */}
        <div className="lg:hidden absolute bottom-6 left-6 right-6 h-40 rounded-xl overflow-hidden border border-border/50 bg-card">
          {PRODUCTS.map((product, i) => {
            const Icon = iconMap[product.icon];
            const hasScreenshot = product.id in productScreenshots;
            return (
              <div
                key={product.id}
                ref={(el) => {
                  if (!imagePanelRefs.current[i])
                    imagePanelRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  willChange: "opacity, transform",
                }}
              >
                {hasScreenshot ? (
                  <Image
                    src={
                      productScreenshots[
                        product.id as keyof typeof productScreenshots
                      ].src
                    }
                    alt={product.name}
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile step dots ──────────────────────────────────────────── */}
      <div
        className="lg:hidden absolute bottom-52 left-1/2 -translate-x-1/2 flex gap-2"
        aria-hidden="true"
      >
        {PRODUCTS.map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              if (!dotRefs.current[i]) dotRefs.current[i] = el;
            }}
            className="rounded-full bg-border"
            style={{
              width: 8,
              height: 8,
              background: i === 0 ? "hsl(var(--primary))" : undefined,
              willChange: "transform, background",
              transition: "transform 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">
              AI-Powered Compliance Products
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Purpose-built technology products that automate DPDP compliance —
            from consent management and scanning to AI-assisted advisory and
            adaptive governance.
          </p>
        </motion.div>
      </SectionWrapper>

      {/* ── Scroll Storytelling ── */}
      <ProductsScrollStory />

      {/* ── CTA ── */}
      <SectionWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">
              Find the Right Product for You
            </span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our guided questionnaire and receive personalised product
            recommendations based on your compliance gaps and priorities.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => useQuestionnaireStore.getState().openModal()}
          >
            Get Recommendations
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}