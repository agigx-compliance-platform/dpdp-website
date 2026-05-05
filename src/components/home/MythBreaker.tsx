"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { cn } from "@/lib/utils";

const myths = [
  {
    myth: "A privacy policy is enough",
    reality:
      "DPDP requires operational controls, not just documents. You need consent management, data mapping, breach response, and audit trails.",
  },
  {
    myth: "Consent banners solve everything",
    reality:
      "Banners without blocking still set cookies illegally. True compliance means no data processing until valid consent is obtained.",
  },
  {
    myth: "We don't handle much personal data",
    reality:
      "DPDP covers all digital personal data including employee data, vendor contacts, and visitor analytics. Nearly every business is in scope.",
  },
  {
    myth: "Compliance is a one-time project",
    reality:
      "DPDP requires continuous monitoring, regular audits, and ongoing evidence collection. Compliance is a living process.",
  },
];

export function MythBreaker() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggle = (idx: number) =>
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <SectionWrapper id="myths">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          Compliance Myths, <span className="text-emerald-500">Debunked</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {myths.map((item, i) => {
          const isRevealed = revealed[i];

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => toggle(i)}
              className={cn(
                "relative w-full text-left p-6 sm:p-8 rounded-2xl overflow-hidden transition-all duration-500 group",
                "border backdrop-blur-sm",
                isRevealed
                  ? "bg-primary/10 border-primary/30 shadow-glow-primary"
                  : "bg-card border-border hover:border-primary/50 hover:bg-muted",
              )}
            >
              {/* 
                CSS Grid Overlap Trick: 
                Both elements occupy the same cell. The container fits the tallest one automatically, preventing height shifts!
              */}
              <div className="grid">
                {/* --- MYTH LAYER --- */}
                <motion.div
                  className="col-start-1 row-start-1 flex items-start gap-4"
                  initial={false}
                  animate={{
                    opacity: isRevealed ? 0 : 1,
                    y: isRevealed ? -15 : 0,
                    scale: isRevealed ? 0.95 : 1,
                    pointerEvents: isRevealed ? "none" : "auto",
                  }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="bg-red-500/10 p-2 rounded-full shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 block">
                      The Myth
                    </span>
                    <p className="text-foreground font-medium text-lg leading-snug">
                      &ldquo;{item.myth}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                      Tap to reveal reality
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>

                {/* --- REALITY LAYER --- */}
                <motion.div
                  className="col-start-1 row-start-1 flex items-start gap-4"
                  initial={false}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    y: isRevealed ? 0 : 15,
                    scale: isRevealed ? 1 : 0.95,
                    pointerEvents: isRevealed ? "auto" : "none",
                  }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="bg-primary/10 p-2 rounded-full shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                      The Reality
                    </span>
                    <p className="text-foreground text-base leading-relaxed">
                      {item.reality}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
