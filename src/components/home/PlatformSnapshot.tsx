"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { platformSnapshots } from "@/lib/agigx-ui-screenshots";

/**
 * Hover concept: "Live terminal scan"
 *
 * On hover the card does four things simultaneously:
 *  1. The screenshot zooms in slightly (depth illusion).
 *  2. A bright horizontal scan-line sweeps top → bottom over the image,
 *     like a radar/sonar or document scanner — very techy, fits compliance theme.
 *  3. Corner bracket accents animate in (top-left & bottom-right), framing the card.
 *  4. A frosted stat bar rises from the bottom revealing the caption in a
 *     pill/HUD style — NOT just a div sliding up, it's a glass morphism strip
 *     with a pulsing green status dot.
 *
 * The card border glows green and the shadow blooms outward.
 * All done with Tailwind + a tiny bit of inline keyframe CSS injected once.
 */

const SCAN_KEYFRAMES = `
@keyframes scanline {
  0%   { top: -4px; opacity: 1; }
  90%  { top: 100%; opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.group:hover .scanline {
  animation: scanline 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
`;

export function PlatformSnapshot() {
  return (
    <SectionWrapper id="platform">
      {/* inject keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: SCAN_KEYFRAMES }} />

      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          See the Platform <span className="gradient-text">in Action</span>
        </motion.h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
          Real screens from the AGIGx consent-management experience (CMP home,
          analytics, health, and policy tools).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {platformSnapshots.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative glass-card overflow-hidden p-0
                       transition-all duration-500 ease-out
                       hover:-translate-y-1.5
                       hover:border-primary/50
                       hover:shadow-[0_8px_60px_-8px_hsl(var(--primary) / 0.35),0_0_0_1px_hsl(var(--primary) / 0.12)]"
          >
            {/* ── Top glow bar ── */}
            <span
              aria-hidden
              className="absolute top-0 inset-x-0 h-[2px] z-30
                         bg-gradient-to-r from-transparent via-primary to-transparent
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* ══ IMAGE AREA ══ */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {/* screenshot */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover object-top
                           transition-transform duration-700 ease-out
                           group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />

              {/* base dark veil — lifts on hover to "illuminate" the screen */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-colors duration-600 z-10" />

              {/* ── Scan-line sweep ── */}
              <span
                aria-hidden
                className="scanline pointer-events-none absolute inset-x-0 h-[3px] z-20
                           opacity-0
                           bg-gradient-to-r from-transparent via-primary to-transparent
                           shadow-[0_0_16px_4px_hsl(var(--primary) / 0.6)]"
                style={{ top: "-4px" }}
              />

              {/* ── Corner brackets ── */}
              {/* top-left */}
              <span
                aria-hidden
                className="absolute top-3 left-3 z-20 pointer-events-none"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M0 12 L0 0 L12 0"
                    stroke="rgb(34,197,94)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
                  />
                </svg>
              </span>
              {/* bottom-right */}
              <span
                aria-hidden
                className="absolute bottom-3 right-3 z-20 pointer-events-none"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M20 8 L20 20 L8 20"
                    stroke="rgb(34,197,94)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
                  />
                </svg>
              </span>

              {/* ── HUD caption bar — rises from bottom ── */}
              <div
                className="absolute inset-x-0 bottom-0 z-20
                           translate-y-full group-hover:translate-y-0
                           transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {/* glass morphism strip */}
                <div
                  className="mx-3 mb-3 flex items-center gap-3
                             rounded-lg border border-white/10
                             bg-black/60 backdrop-blur-md px-4 py-3"
                >
                  {/* pulsing green status dot */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>

                  <div className="flex flex-col min-w-0">
                    <p className="text-white text-xs font-semibold tracking-wide truncate">
                      {item.title}
                    </p>
                    <p className="text-white/55 text-[11px] leading-tight truncate mt-0.5">
                      {item.caption}
                    </p>
                  </div>

                  {/* right-side live badge */}
                  <span
                    className="ml-auto shrink-0 text-[10px] font-mono font-medium
                                   text-primary border border-primary/40 rounded px-1.5 py-0.5
                                   tracking-widest"
                  >
                    LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* ══ STATIC CAPTION below image ══ */}
            <div
              className="p-4 text-center border-t border-border/40
                            transition-all duration-300
                            group-hover:border-primary/20"
            >
              <p
                className="text-sm font-medium text-foreground
                            transition-colors duration-300 group-hover:text-primary/90"
              >
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
