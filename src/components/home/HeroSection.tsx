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
import { getHeroSubline, HERO_IMAGES } from "@/lib/hero-config";

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

export function HeroSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const heroSubline = getHeroSubline();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const d = prefersReduced ? (n: number) => 0 : (n: number) => n;
  const showLightHero = mounted && isLight;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGES.dark}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-700",
            showLightHero ? "opacity-0" : "opacity-100",
          )}
          aria-hidden
        />
        <Image
          src={HERO_IMAGES.light}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-700",
            showLightHero ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        />
      </div>

      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0 z-[2]",
          isLight
            ? "bg-gradient-to-b from-white/55 via-white/35 to-white/15"
            : "bg-gradient-to-b from-background/88 via-background/62 to-background/20",
        )}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" as const }}
      />

      <motion.div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-gradient-to-t to-transparent",
          isLight ? "from-white/70" : "from-background/50",
        )}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: d(0.1), ease: "easeOut" as const }}
      />

      <div
        className={cn(
          "relative z-[3] mx-auto max-w-4xl px-4 text-center sm:px-6",
          isLight && "drop-shadow-[0_1px_12px_rgba(255,255,255,0.85)]",
        )}
      >
        <motion.p
          {...fadeIn(d(0.55), 0.7)}
          className={cn(
            "mb-5 text-xs font-semibold uppercase tracking-[0.2em]",
            isLight ? "text-foreground/55" : "text-muted-foreground/60",
          )}
        >
          DPDP · AI Governance
        </motion.p>

        <motion.p
          {...fadeUp(d(0.75), 18)}
          className={cn(
            "mx-auto mb-6 max-w-2xl text-lg sm:text-xl",
            isLight ? "text-foreground/85" : "text-muted-foreground",
          )}
        >
          Transform DPDP and AI governance into a living, enforceable
          compliance engine, not a checklist.
        </motion.p>

        <motion.h1
          {...fadeUp(d(1.0), 28)}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl text-foreground"
        >
          DPDP Continuous{" "}
          <span
            className={cn(
              "gradient-text",
              isLight && "[filter:drop-shadow(0_1px_8px_rgba(255,255,255,0.9))]",
            )}
          >
            Compliance Intelligence
          </span>
        </motion.h1>

        {heroSubline && (
          <motion.p
            {...fadeIn(d(1.25), 0.6)}
            className={cn(
              "mx-auto mt-4 max-w-2xl text-xs sm:text-sm",
              isLight ? "text-foreground/65" : "text-muted-foreground/70",
            )}
          >
            {heroSubline}
          </motion.p>
        )}

        <motion.div
          {...fadeUp(d(1.35), 16)}
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row",
            heroSubline && "mt-8",
          )}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => useQuestionnaireStore.getState().openModal()}
          >
            Scan Your Website
          </Button>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Talk to an Expert
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        {...fadeIn(d(2.0), 0.8)}
        className="absolute bottom-8 left-1/2 z-[3] -translate-x-1/2"
      >
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
        >
          <ChevronDown
            className="h-6 w-6 text-muted-foreground/50"
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
