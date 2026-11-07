"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { ConsentCockpitHighlights } from "@/components/products/ConsentCockpitHighlights";
import { useQuestionnaireStore } from "@/store/questionnaireStore";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tools for the daily privacy work
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Start with what you need most: consent records, website scans, requests
            from people about their data, vendor tracking, and more.
          </p>
        </motion.div>
      </SectionWrapper>

      <ConsentCockpitHighlights />
      <ProductsExplorer />

      <SectionWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-8 text-center shadow-[var(--shadow-sm)] md:p-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Find the right product
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Answer a few questions and we will suggest which tools fit your
            business.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => useQuestionnaireStore.getState().openModal()}
          >
            Get Recommendations
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}
