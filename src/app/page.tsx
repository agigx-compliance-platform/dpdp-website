import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionEngine } from "@/components/home/SolutionEngine";
import { CustomizationSection } from "@/components/home/CustomizationSection";
import { MythBreaker } from "@/components/home/MythBreaker";
import { Differentiator } from "@/components/home/Differentiator";
import { WhyNow } from "@/components/home/WhyNow";
import { PlatformSnapshot } from "@/components/home/PlatformSnapshot";
import { PrivacyAssistantShowcase } from "@/components/home/PrivacyAssistantShowcase";
import { MetricsSection } from "@/components/home/MetricsSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ProductsOverview } from "@/components/home/ProductsOverview";
import { PartnershipCTA } from "@/components/home/PartnershipCTA";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ScrollPath } from "@/components/animations/ScrollPath";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionEngine />
      {/* Connecting line draws as user scrolls into Customization */}
      <div style={{ position: "relative", height: "6rem", overflow: "hidden" }}>
        <ScrollPath />
      </div>
      <CustomizationSection />
      <MythBreaker />
      <Differentiator />
      {/* Connecting line draws before metrics reveal */}
      <div style={{ position: "relative", height: "6rem", overflow: "hidden" }}>
        <ScrollPath />
      </div>
      <WhyNow />

      <PlatformSnapshot />
      <PrivacyAssistantShowcase />
      <MetricsSection />
      <ServicesOverview />
      <ProductsOverview />
      <PartnershipCTA />
      <FinalCTA />
    </>
  );
}
