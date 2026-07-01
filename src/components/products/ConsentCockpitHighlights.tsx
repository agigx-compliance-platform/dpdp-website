"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ThemeScreenshot } from "@/components/ui/ThemeScreenshot";
import { consentCockpitBestFeatures } from "@/lib/agigx-ui-screenshots";
import { cn } from "@/lib/utils";

export function ConsentCockpitHighlights() {
  return (
    <SectionWrapper className="py-12 md:py-16 border-y border-border/40 bg-background-secondary/30">
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          Consent Cockpit
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Best features,{" "}
          <span className="gradient-text">one platform</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Real admin console screens and Privacy Assistant chat flows — each
          screenshot matched to what it describes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {consentCockpitBestFeatures.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="glass-card overflow-hidden p-0 group hover:border-primary/40 transition-colors"
          >
            <div
              className={cn(
                "relative aspect-[16/10] w-full overflow-hidden border-b border-border/40",
                "chatSurface" in item && item.chatSurface ? "bg-white" : "bg-muted/20",
              )}
            >
              <ThemeScreenshot
                dark={item.dark}
                light={item.light}
                alt={item.title}
                surface={"chatSurface" in item && item.chatSurface ? "white" : "default"}
                darkClassName={"darkImageClassName" in item ? item.darkImageClassName : undefined}
                lightClassName={"lightImageClassName" in item ? item.lightImageClassName : undefined}
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
