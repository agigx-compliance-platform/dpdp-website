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
            <span className="gradient-text">AI-Powered Compliance Products</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Purpose-built technology products that automate DPDP compliance,
            from consent management and scanning to AI-assisted advisory and
            adaptive governance.
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
          className="glass-card p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Find the Right Product for You</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our guided questionnaire and receive personalised product
            recommendations based on your compliance gaps and priorities.
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
