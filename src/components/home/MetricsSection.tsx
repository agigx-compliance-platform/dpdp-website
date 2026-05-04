"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CounterRollup } from "@/components/animations/CounterRollup";

const metrics = [
  { value: 50, suffix: "+", decimals: 0, label: "Consulting engagements" },
  {
    value: 500,
    suffix: "+",
    decimals: 0,
    label: "Compliance checks automated",
  },
  { value: 6, suffix: "", decimals: 0, label: "Regulatory frameworks" },
  { value: 99.9, suffix: "%", decimals: 1, label: "Uptime SLA" },
];

export function MetricsSection() {
  return (
    <SectionWrapper id="metrics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <CounterRollup
              value={m.value}
              suffix={m.suffix}
              decimals={m.decimals}
              label={m.label}
              duration={2.2}
              valueClassName="gradient-text"
              labelClassName="text-muted-foreground"
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
