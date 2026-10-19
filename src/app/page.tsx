import { HeroSection } from '@/components/home/HeroSection'
import { TrustBand } from '@/components/home/TrustBand'
import { ProblemQuestions } from '@/components/home/ProblemQuestions'
import { SolutionTabs } from '@/components/home/SolutionTabs'
import { LifecycleSection } from '@/components/home/LifecycleSection'
import { IntegrationsWall } from '@/components/home/IntegrationsWall'
import { ServicesOverview } from '@/components/home/ServicesOverview'
import { FinalCTA } from '@/components/home/FinalCTA'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { FaqSection } from '@/components/seo/FaqSection'
import { HOME_FAQS } from '@/lib/dpdp-faqs'

export default function HomePage() {
  return (
    <>
      <FaqJsonLd faqs={HOME_FAQS} />
      <HeroSection />
      <TrustBand />
      <ProblemQuestions />
      <SolutionTabs />
      <LifecycleSection />
      <IntegrationsWall />
      <ServicesOverview />
      <FaqSection title="What is DPDP? Common questions" faqs={HOME_FAQS} />
      <FinalCTA />
    </>
  )
}
