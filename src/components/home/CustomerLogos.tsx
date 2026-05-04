"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Marquee } from "@/components/animations/Marquee";

const logos = [
  "TechCorp",
  "FinServ Global",
  "HealthBridge",
  "EduVista",
  "RetailNxt",
  "CloudPeak",
  "DataSync",
  "SecureNet",
];

const logoItems = logos.map((name) => (
  <div
    key={name}
    style={{
      padding: "0.625rem 1.5rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--foreground) / 0.08)",
      background: "hsl(var(--foreground) / 0.03)",
      backdropFilter: "blur(8px)",
      color: "hsl(var(--foreground) / 0.4)",
      fontSize: "0.875rem",
      fontWeight: 600,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
      userSelect: "none",
    }}
  >
    {name}
  </div>
));

export function CustomerLogos() {
  return (
    <SectionWrapper id="logos" className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
          Trusted By Leading Enterprises
        </p>
      </motion.div>

      <Marquee items={logoItems} speed={55} />
    </SectionWrapper>
  );
}
