"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquare, LayoutDashboard } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ThemeScreenshot } from "@/components/ui/ThemeScreenshot";
import { privacyAssistantGallery } from "@/lib/agigx-ui-screenshots";
import { cn } from "@/lib/utils";

export function PrivacyAssistantShowcase() {
  const [active, setActive] = useState(0);
  const item = privacyAssistantGallery[active];
  const total = privacyAssistantGallery.length;

  const go = (delta: number) => {
    setActive((i) => (i + delta + total) % total);
  };

  return (
    <SectionWrapper id="privacy-assistant">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Consent Cockpit
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Privacy Assistant{" "}
            <span className="gradient-text">&amp; Chatbot</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
            Give data principals a multilingual, conversational way to exercise
            rights — consent preferences, DSAR intake, grievances, and request
            tracking in one guided chat experience.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Chat mode for data principals
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium">
              <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
              Dashboard mode for power users
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {privacyAssistantGallery.map((shot, i) => (
              <button
                key={`${shot.title}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left text-xs transition-all duration-200",
                  i === active
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30",
                )}
              >
                <span className="block font-semibold mb-0.5">{shot.title}</span>
                <span className="block leading-snug opacity-80">{shot.caption}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="glass-card overflow-hidden p-2 sm:p-3">
            <div className="privacy-assistant-preview relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${item.title}-${active}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <ThemeScreenshot
                    dark={item.dark}
                    light={item.light}
                    alt={item.title}
                    surface={item.chatSurface ? "chat" : "default"}
                    darkClassName={item.darkImageClassName}
                    lightClassName={item.lightImageClassName}
                    priority={active === 0}
                    sizes="(max-width: 1024px) 100vw, 1120px"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/95 to-transparent p-4 pt-10">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.caption}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 hover:border-primary/40 transition-colors"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {privacyAssistantGallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active ? "w-6 bg-primary" : "w-1.5 bg-border",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 hover:border-primary/40 transition-colors"
                aria-label="Next screenshot"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
