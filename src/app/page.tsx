import { HeroSection } from '@/components/home/HeroSection'
import { ProblemSection } from '@/components/home/ProblemSection'
import { SolutionEngine } from '@/components/home/SolutionEngine'
import { CustomizationSection } from '@/components/home/CustomizationSection'
import { MythBreaker } from '@/components/home/MythBreaker'
import { Differentiator } from '@/components/home/Differentiator'
import { WhyNow } from '@/components/home/WhyNow'
import { PlatformSnapshot } from '@/components/home/PlatformSnapshot'
import { MetricsSection } from '@/components/home/MetricsSection'
import { CustomerLogos } from '@/components/home/CustomerLogos'
import { Testimonials } from '@/components/home/Testimonials'
import { QuestionnaireCTA } from '@/components/home/QuestionnaireCTA'
import { ServicesOverview } from '@/components/home/ServicesOverview'
import { ProductsOverview } from '@/components/home/ProductsOverview'
import { PartnershipCTA } from '@/components/home/PartnershipCTA'
import { FinalCTA } from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionEngine />
      <CustomizationSection />
      <MythBreaker />
      <Differentiator />
      <WhyNow />
      <PlatformSnapshot />
      <MetricsSection />
      <CustomerLogos />
      <Testimonials />
      <QuestionnaireCTA />
      <ServicesOverview />
      <ProductsOverview />
      <PartnershipCTA />
      <FinalCTA />
    </>
  )
}
