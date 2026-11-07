import { HeroSection } from '@/components/home/HeroSection'
import { TrustBand } from '@/components/home/TrustBand'
import { AppliesToYou } from '@/components/home/AppliesToYou'
import { WhatChanges } from '@/components/home/WhatChanges'
import { WhatYouGet } from '@/components/home/WhatYouGet'
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
      <AppliesToYou />
      <WhatChanges />
      <WhatYouGet />
      <LifecycleSection />
      <IntegrationsWall />
      <ServicesOverview />
      <FaqSection title="Common questions about DPDP" faqs={HOME_FAQS} />
      <FinalCTA />
    </>
  )
}
