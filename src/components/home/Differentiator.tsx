"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const rows = [
  { traditional: "Static checklists", modern: "Adaptive rules engine" },
  { traditional: "Annual audits", modern: "Continuous monitoring" },
  { traditional: "Generic templates", modern: "Tailored to your stack" },
  { traditional: "Siloed tools", modern: "Unified compliance view" },
  { traditional: "Manual evidence", modern: "Automated proof generation" },
  { traditional: "One regulation", modern: "Multi-framework coverage" },
];

export function Differentiator() {
  return (
    <SectionWrapper id="differentiator">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Why Consent Cockpit Is{" "}
          <span className="gradient-text">Different</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          Side-by-side comparison of legacy tooling vs. a living compliance
          engine.
        </motion.p>
      </div>

      <div className="hidden sm:grid grid-cols-2 gap-4 sm:gap-6 mb-4 max-w-4xl mx-auto">
        <p className="text-center text-muted-foreground font-medium text-xs uppercase tracking-wider">
          Traditional Tools
        </p>
        <p className="text-center gradient-text font-medium text-xs uppercase tracking-wider">
          Consent Cockpit
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.traditional}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="grid sm:grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="glass-card p-4 flex items-center gap-3 opacity-70">
              <X className="w-4 h-4 text-destructive/80 shrink-0" />
              <span className="text-sm line-through decoration-destructive/70">
                {row.traditional}
              </span>
            </div>
            <div className="glass-card p-4 flex items-center gap-3 gradient-border">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium">{row.modern}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
