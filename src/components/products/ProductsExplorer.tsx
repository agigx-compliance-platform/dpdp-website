"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { PRODUCTS, productIconMap } from "@/lib/products-data";
import {
  AiAssistantDemo,
  ConsentBannerMockup,
  DiscoveryInventory,
  DsarLifecycle,
  InfraPostureFindings,
  LineageFlow,
  NoticeVersions,
  PurposeConsentCapture,
  RegulatoryChangeFlow,
  ThirdPartyPropagation,
  TrustScopeReport,
} from "@/components/illustrations";

const ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  "consent-platform": PurposeConsentCapture,
  "cookie-consent": ConsentBannerMockup,
  "dsar-platform": DsarLifecycle,
  "processor-governance": ThirdPartyPropagation,
  trustscope: TrustScopeReport,
  "data-lineage": LineageFlow,
  "ai-assistant": AiAssistantDemo,
  "policy-notice": NoticeVersions,
  "data-discovery": DiscoveryInventory,
  "infra-scanner": InfraPostureFindings,
  "adaptive-engine": RegulatoryChangeFlow,
};

export function ProductsExplorer() {
  const [active, setActive] = useState(0);
  const product = PRODUCTS[active];
  const Icon = productIconMap[product.icon] ?? Fingerprint;
  const Illustration = ILLUSTRATIONS[product.id];

  const explorerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Next.js links change the hash with pushState, which fires no hashchange event, so a
  // link to /products#id from this same page would otherwise leave the old product open.
  // Re-read the hash on load, on back/forward, and shortly after any click.
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = PRODUCTS.findIndex((p) => p.id === hash);
      if (idx < 0 || idx === activeRef.current) return;
      setActive(idx);
      explorerRef.current?.scrollIntoView({ block: "start" });
    };
    // The router applies a link's URL asynchronously, so look again over the next few frames.
    const afterClick = () => {
      for (const ms of [0, 50, 150, 400]) window.setTimeout(syncFromHash, ms);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    document.addEventListener("click", afterClick);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
      document.removeEventListener("click", afterClick);
    };
  }, []);

  const selectProduct = (index: number) => {
    activeRef.current = index;
    setActive(index);
    const id = PRODUCTS[index]?.id;
    if (id) {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <SectionWrapper className="pb-20">
      <div ref={explorerRef} className="grid scroll-mt-24 lg:grid-cols-[280px_1fr] gap-8 lg:gap-10 items-start">
        <nav
          className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:sticky lg:top-24"
          aria-label="Product list"
        >
          {PRODUCTS.map((item, i) => {
            const NavIcon = productIconMap[item.icon] ?? Fingerprint;
            return (
              <button
                key={item.id}
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
                  {section === "All" ? "Every DPDP section" : `Section ${section}`}
                </Badge>
              ))}
              {product.complianceDomains
                .filter((domain) => domain !== "All")
                .map((domain) => (
                  <Badge key={domain} variant="success">
                    {domain}
                  </Badge>
                ))}
            </div>

            {Illustration && (
              <div className="mb-6">
                <Illustration />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-2">
              {product.features.map((feature, i) => (
                <Card
                  key={feature.title}
                  variant="outline"
                  className={cn(
                    product.features.length % 2 === 1 && i === product.features.length - 1 && "sm:col-span-2",
                  )}
                >
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
