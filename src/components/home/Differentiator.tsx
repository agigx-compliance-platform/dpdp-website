"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";

const rows = [
  { traditional: "Static checklists", modern: "Adaptive rules engine" },
  { traditional: "Annual audits", modern: "Continuous monitoring" },
  { traditional: "Generic templates", modern: "Tailored to your stack" },
  { traditional: "Siloed tools", modern: "Unified compliance view" },
  { traditional: "Manual evidence", modern: "Automated proof generation" },
  { traditional: "One regulation", modern: "Multi-framework coverage" },
];

function StrikethroughRow({
  text,
  modernText,
  index,
  progress,
}: {
  text: string;
  modernText: string;
  index: number;
  progress: MotionValue<number>;
}) {
  // We use the global scroll progress (0 to 1) passed from the parent.
  // We add a tiny stagger based on the index so it flows like a wave,
  // but strictly adheres to your phases.

  // PHASE 1: All Traditional Tools appear (Progress 0.0 to 0.2)
  const tradStart = 0.0 + index * 0.02;
  const tradEnd = 0.1 + index * 0.02;
  const traditionalOpacity = useTransform(
    progress,
    [tradStart, tradEnd],
    [0, 0.6],
  );
  const traditionalX = useTransform(progress, [tradStart, tradEnd], [-24, 0]);

  // PHASE 2: Strike them out (Progress 0.3 to 0.55)
  const strikeStart = 0.3 + index * 0.04;
  const strikeEnd = 0.5 + index * 0.04;
  const strikeWidth = useTransform(
    progress,
    [strikeStart, strikeEnd],
    ["0%", "100%"],
  );

  // PHASE 3: Consent Cockpit replaces them (Progress 0.65 to 0.9)
  const modernStart = 0.65 + index * 0.04;
  const modernEnd = 0.85 + index * 0.04;
  const modernOpacity = useTransform(progress, [modernStart, modernEnd], [0, 1]);
  const modernX = useTransform(progress, [modernStart, modernEnd], [24, 0]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-3">
      {/* Traditional Side */}
      <motion.div
        style={{ opacity: traditionalOpacity, x: traditionalX }}
        className="glass-card p-4 flex items-center gap-3 relative overflow-hidden"
      >
        <span className="text-sm relative inline-block">
          {text}
          <motion.span
            style={{
              width: strikeWidth,
              position: "absolute",
              left: -4,
              top: "50%",
              height: "3px",
              background: "hsl(var(--destructive))",
              transformOrigin: "left center",
              rotate: "-2deg",
              borderRadius: "2px",
              marginTop: "-1.5px",
              display: "block",
              zIndex: 10,
            }}
          />
        </span>
      </motion.div>

      {/* Consent Cockpit */}
      <motion.div
        style={{ opacity: modernOpacity, x: modernX }}
        className="glass-card p-4 flex items-center gap-3 gradient-border"
      >
        <Check className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-medium">{modernText}</span>
      </motion.div>
    </div>
  );
}

export function Differentiator() {
  // Track the scroll of the entire tall section
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll so the animation doesn't jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    // The wrapper is artificially tall (300vh) so you have space to scroll
    // while the animation plays out.
    <section
      ref={containerRef}
      id="differentiator"
      className="h-[300vh] relative w-full bg-background"
    >
      {/* This container locks to the screen (sticky) and centers the content */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-4 md:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why Consent Cockpit Is <span className="gradient-text">Different</span>
            </h2>
            {/* Optional UX touch: Helps users know they need to keep scrolling */}
            <p className="text-sm text-muted-foreground mt-4 animate-pulse">
              Scroll down to compare
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="text-center text-muted-foreground font-medium text-sm uppercase tracking-wider">
              Traditional Tools
            </div>
            <div className="text-center gradient-text font-medium text-sm uppercase tracking-wider">
              Consent Cockpit
            </div>
          </div>

          <div className="space-y-3">
            {rows.map((row, i) => (
              <StrikethroughRow
                key={i}
                index={i}
                text={row.traditional}
                modernText={row.modern}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
