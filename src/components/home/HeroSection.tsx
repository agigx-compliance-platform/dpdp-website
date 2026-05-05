"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useQuestionnaireStore } from "@/store/questionnaireStore";
import { getHeroVideoDisclaimer } from "@/lib/hero-config";

// ─── animation variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.9,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
});

const fadeIn = (delay = 0, duration = 0.8) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, delay, ease: "easeOut" as const },
});

// ─── component ────────────────────────────────────────────────────────────────

export function HeroSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const prefersReduced = useReducedMotion();

  const [allowVideo, setAllowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const videoDisclaimer = getHeroVideoDisclaimer();

  // Only allow video on desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setAllowVideo(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Trigger entrance sequence after mount
  useEffect(() => {
    // Small tick so CSS initial states are painted before motion begins
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // When reduced motion is preferred, skip all delays
  const d = prefersReduced ? (n: number) => 0 : (n: number) => n;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* ── Background layer ─────────────────────────────────────── */}
      <div className="absolute inset-0">
        {/* Poster / fallback image: always mounted, always visible until video takes over */}
        {/* <Image
          src="/images/hero-poster.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        /> */}

        {/* Video: fades in only once it has started playing, hiding any stutter */}
        {allowVideo && (
          <motion.video
            key="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-poster.png"
            aria-hidden
            className={cn(
              "absolute inset-0 z-[1] h-full w-full object-cover",
              "brightness-[1.04] contrast-[1.07] saturate-[1.05]",
              isLight && "brightness-[1.08] contrast-[1.12] saturate-[1.08]",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" as const }}
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </motion.video>
        )}
      </div>

      {/* Dark overlay: fades in first to mask any load flash */}
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0 z-[2]",
          isLight
            ? "bg-gradient-to-b from-black/[0.62] via-black/[0.46] to-black/[0.26]"
            : "bg-gradient-to-b from-background/90 via-background/65 to-background/15",
        )}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // Overlay comes in fastest, before anything else
        transition={{ duration: 0.35, ease: "easeOut" as const }}
      />

      {/* Bottom fade vignette */}
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-gradient-to-t to-transparent",
          isLight ? "from-black/50" : "from-background/40",
        )}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: d(0.1), ease: "easeOut" as const }}
      />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative z-[3] mx-auto max-w-4xl px-4 text-center sm:px-6",
          isLight && "text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]",
        )}
      >
        {/* Eyebrow line */}
        <motion.p
          {...fadeIn(d(0.55), 0.7)}
          className={cn(
            "mb-5 text-xs font-semibold uppercase tracking-[0.2em]",
            isLight ? "text-white/50" : "text-muted-foreground/60",
          )}
        >
          DPDP · AI Governance
        </motion.p>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(d(0.75), 18)}
          className={cn(
            "mx-auto mb-6 max-w-2xl text-lg sm:text-xl",
            isLight ? "text-white/90" : "text-muted-foreground",
          )}
        >
          Transform DPDP and AI governance into a living, enforceable
          compliance engine, not a checklist.
        </motion.p>

        {/* Headline */}
        <motion.h1
          {...fadeUp(d(1.0), 28)}
          className={cn(
            "text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl",
            isLight ? "text-white" : "text-foreground",
          )}
        >
          DPDP Continuous{" "}
          <span
            className={cn(
              "gradient-text",
              isLight && "[filter:drop-shadow(0_2px_16px_rgba(0,0,0,0.85))]",
            )}
          >
            Compliance Intelligence
          </span>
        </motion.h1>

        {/* Optional disclaimer */}
        {videoDisclaimer && (
          <motion.p
            {...fadeIn(d(1.25), 0.6)}
            className={cn(
              "mx-auto mt-4 max-w-2xl text-xs sm:text-sm",
              isLight ? "text-white/70" : "text-muted-foreground/70",
            )}
          >
            {videoDisclaimer}
          </motion.p>
        )}

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(d(1.35), 16)}
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row",
            videoDisclaimer && "mt-8",
          )}
        >
          <Button variant="primary" size="lg" onClick={() => useQuestionnaireStore.getState().openModal()}>
            Scan Your Website
          </Button>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className={
                isLight
                  ? "border-white/40 bg-white/10 text-white hover:bg-white/20"
                  : undefined
              }
            >
              Talk to an Expert
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeIn(d(2.0), 0.8)}
        className="absolute bottom-8 left-1/2 z-[3] -translate-x-1/2"
      >
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
        >
          <ChevronDown
            className={cn(
              "h-6 w-6",
              isLight ? "text-white/50" : "text-muted-foreground/50",
            )}
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
