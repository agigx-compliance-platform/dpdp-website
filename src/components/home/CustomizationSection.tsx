"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Layers,
  Users,
  Globe,
  Database,
  TrendingUp,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const dimensions = [
  {
    icon: Building2,
    title: "Industry Vertical",
    description:
      "Healthcare, fintech, e-commerce, edtech. Compliance rules vary by sector.",
  },
  {
    icon: Layers,
    title: "Tech Stack",
    description:
      "Cloud-native, legacy, hybrid: we integrate with your actual infrastructure.",
  },
  {
    icon: Users,
    title: "Organization Type",
    description:
      "Startup to enterprise, single entity to multi-subsidiary group.",
  },
  {
    icon: Globe,
    title: "Regulatory Scope",
    description:
      "DPDP 2023, the 2025 Rules, and the IT Act. Map obligations across your programme automatically.",
  },
  {
    icon: Database,
    title: "Data Categories",
    description:
      "Customer PII, employee data, health records, children's data: each has unique rules.",
  },
  {
    icon: TrendingUp,
    title: "Compliance Maturity",
    description:
      "Whether you're starting from scratch or optimizing an existing program.",
  },
];

export function CustomizationSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".torch-card");
    if (!cards) return;

    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <SectionWrapper id="customization">
      {/* Inject scoped styles */}
      <style>{`
        .torch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        @media (max-width: 768px) {
          .torch-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .torch-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Outer card wrapper: holds the radial glow border */
        .torch-card {
          position: relative;
          border-radius: 12px;
          background: hsl(var(--foreground) / 0.06);
          cursor: pointer;
        }

        /* Outer glow: sweeps across ALL cards on grid hover */
        .torch-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            600px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
            rgba(74, 222, 128, 0.25),
            transparent 40%
          );
          z-index: 1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .torch-grid:hover .torch-card::before {
          opacity: 1;
        }

        /* Inner content surface */
        .torch-card-inner {
          position: absolute;
          inset: 1px;
          border-radius: 11px;
          background: hsl(var(--background));
          z-index: 2;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: hidden;
        }

        /* Inner spotlight glow: only on hovered card */
        .torch-card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            320px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
            rgba(74, 222, 128, 0.08),
            transparent 40%
          );
          z-index: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .torch-card:hover .torch-card-inner::before {
          opacity: 1;
        }

        /* All inner content above the glow layer */
        .torch-card-body {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Not a Product.{" "}
          <span className="gradient-text">An Engine You Build.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Every compliance engine we deliver is bespoke, shaped by your
          industry, stack, and regulatory landscape.
        </motion.p>
      </div>

      <div ref={gridRef} className="torch-grid" onMouseMove={handleMouseMove}>
        {dimensions.map((dim, i) => (
          <motion.div
            key={dim.title}
            className="torch-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            style={{ minHeight: "200px" }}
          >
            <div className="torch-card-inner">
              <div className="torch-card-body">
                <dim.icon
                  className="mb-4"
                  style={{ width: 36, height: 36, color: "hsl(var(--primary))" }}
                  strokeWidth={1.5}
                />
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {dim.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(148, 163, 184, 0.85)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {dim.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
