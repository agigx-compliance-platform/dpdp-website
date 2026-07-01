"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fingerprint, ScanSearch, FileKey, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { ThemeScreenshot } from "@/components/ui/ThemeScreenshot";
import { productPreviewThumbs } from "@/lib/agigx-ui-screenshots";

const products = [
  {
    icon: Fingerprint,
    name: "Consent Platform",
    tagline: "Lawful data collection, automated.",
    features: [
      "Geo-aware consent banners",
      "Pre-consent cookie blocking",
      "Preference center with audit trail",
    ],
  },
  {
    icon: ScanSearch,
    name: "Compliance Scanner",
    tagline: "Find violations before regulators do.",
    features: [
      "Automated website crawling",
      "Cookie & tracker detection",
      "Privacy policy analysis",
    ],
  },
  {
    icon: FileKey,
    name: "DSAR Platform",
    tagline: "Subject requests, handled end-to-end.",
    features: [
      "Intake portal for data subjects",
      "Identity verification workflows",
      "Automated data discovery & deletion",
    ],
  },
];

export function ProductsOverview() {
  return (
    <SectionWrapper id="products-preview">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          AI-Powered Compliance <span className="gradient-text">Products</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {products.map((prod, i) => {
          const Icon = prod.icon;
          return (
            <motion.div
              key={prod.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              // No overflow-hidden on the outer card (it clips the Explore link underline).
              // Shimmer is isolated inside its own clipped span instead.
              className="group relative glass-card p-0 flex flex-col
                         transition-all duration-500 ease-out
                         hover:-translate-y-2
                         hover:shadow-[0_0_40px_-4px_hsl(var(--primary) / 0.25)]
                         hover:border-primary/40"
            >
              {/* Shimmer: self-contained with overflow-hidden so it can't bleed out */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
              >
                <span
                  className="absolute inset-0
                                 translate-x-[-110%] group-hover:translate-x-[110%]
                                 transition-transform duration-700 ease-in-out
                                 bg-gradient-to-r from-transparent via-white/6 to-transparent
                                 skew-x-[-20deg]"
                />
              </span>

              {/* Top glow bar */}
              <span
                aria-hidden
                className="absolute top-0 inset-x-0 h-[2px] z-10 rounded-t-[inherit]
                           bg-gradient-to-r from-transparent via-primary to-transparent
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Thumbnail: clipped independently, not the whole card */}
              <div
                className="relative aspect-[16/10] w-full shrink-0 border-b border-border/40
                              overflow-hidden rounded-t-[inherit]"
              >
                <ThemeScreenshot
                  dark={
                    productPreviewThumbs[i]?.dark ?? productPreviewThumbs[0].dark
                  }
                  light={
                    productPreviewThumbs[i]?.light ??
                    productPreviewThumbs[0].light
                  }
                  alt={productPreviewThumbs[i]?.alt ?? ""}
                  className="object-contain object-top"
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
              </div>

              {/* Card body: deliberately NOT overflow-hidden, so Explore is never clipped */}
              <div className="p-6 flex flex-col flex-1">
                <div className="relative mb-4 w-fit">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary/20
                               scale-0 group-hover:scale-150 opacity-100 group-hover:opacity-0
                               transition-all duration-600 ease-out"
                  />
                  <Icon
                    className="relative w-9 h-9 text-primary
                                   transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <h3
                  className="text-lg font-semibold
                               transition-colors duration-300 group-hover:text-primary"
                >
                  {prod.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {prod.tagline}
                </p>

                <ul className="mt-4 space-y-2 flex-1">
                  {prod.features.map((f, fi) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-muted-foreground
                                 transition-colors duration-300 group-hover:text-foreground/80"
                      style={{ transitionDelay: `${fi * 40}ms` }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0
                                       transition-all duration-300
                                       group-hover:shadow-[0_0_6px_2px_hsl(var(--primary) / 0.5)]"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Explore: lives in the un-clipped body, fully visible */}
                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary font-medium w-fit relative"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                    Explore
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="absolute bottom-0 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/products">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
