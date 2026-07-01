"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ThemeScreenshot } from "@/components/ui/ThemeScreenshot";
import { productScreenshots, type ProductScreenshotKey } from "@/lib/agigx-ui-screenshots";
import { PRODUCTS, productIconMap } from "@/lib/products-data";

export function ProductsExplorer() {
  const [active, setActive] = useState(0);
  const product = PRODUCTS[active];
  const Icon = productIconMap[product.icon] ?? Fingerprint;
  const shot =
    product.id in productScreenshots
      ? productScreenshots[product.id as ProductScreenshotKey]
      : null;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const idx = PRODUCTS.findIndex((p) => p.id === hash);
    if (idx >= 0) setActive(idx);
  }, []);

  const selectProduct = (index: number) => {
    setActive(index);
    const id = PRODUCTS[index]?.id;
    if (id) {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <SectionWrapper className="pb-20">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10 items-start">
        <nav
          className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:sticky lg:top-24"
          aria-label="Product list"
        >
          {PRODUCTS.map((item, i) => {
            const NavIcon = productIconMap[item.icon] ?? Fingerprint;
            return (
              <button
                key={item.id}
                id={item.id}
                type="button"
                onClick={() => selectProduct(i)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left min-w-[220px] lg:min-w-0 transition-all duration-200",
                  i === active
                    ? "border-primary/50 bg-primary/10 shadow-sm"
                    : "border-border/50 bg-card/40 hover:border-primary/30",
                )}
              >
                <NavIcon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    i === active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-sm font-medium leading-snug">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="min-w-0"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-mono tracking-widest text-primary uppercase">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(PRODUCTS.length).padStart(2, "0")}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-primary font-medium mb-3 text-sm">{product.tagline}</p>
            <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.dpdpSections.map((section) => (
                <Badge key={section} variant="info">
                  {section === "All" ? "All Sections" : `Section ${section}`}
                </Badge>
              ))}
              {product.complianceDomains.map((domain) => (
                <Badge key={domain} variant="success">
                  {domain}
                </Badge>
              ))}
            </div>

            {shot && (
              <div className="mb-6">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border/60 shadow-card bg-muted/15">
                  <ThemeScreenshot
                    dark={shot.dark}
                    light={shot.light}
                    alt={product.name}
                    className="object-contain object-top"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {shot.caption}
                </p>
              </div>
            )}

            {shot?.highlights && shot.highlights.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  In the platform
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {shot.highlights.map((h) => (
                    <div
                      key={h.label}
                      className="rounded-xl overflow-hidden border border-border/50 bg-card/50"
                    >
                      <div className="relative aspect-[4/3] bg-muted/20">
                        <ThemeScreenshot
                          dark={h.dark}
                          light={h.light}
                          alt={h.label}
                          className="object-cover object-top"
                          sizes="200px"
                        />
                      </div>
                      <p className="px-2 py-1.5 text-[11px] font-medium text-center truncate">
                        {h.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-2">
              {product.features.map((feature) => (
                <Card key={feature.title} variant="outline">
                  <CardContent className="p-3">
                    <h4 className="text-xs font-semibold mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
