'use client'

import { ConsentBannerMockup, PurposeConsentCapture, ThirdPartyPropagation } from '@/components/illustrations'
import { IllustrationTabs, type IllustrationView } from './IllustrationTabs'

const VIEWS: readonly IllustrationView[] = [
  {
    id: 'banner',
    label: 'Banner',
    summary: 'A bar on desktop, a purpose sheet on mobile. Reject sits next to accept.',
    Illustration: ConsentBannerMockup,
  },
  {
    id: 'purposes',
    label: 'Purposes',
    summary: 'Asked one by one at sign-up, changed any time in the Consent Cockpit.',
    Illustration: PurposeConsentCapture,
  },
  {
    id: 'third-parties',
    label: 'Third parties',
    summary: 'A withdrawal reaches every processor that uses the purpose, with delivery tracked.',
    Illustration: ThirdPartyPropagation,
  },
]

export function ConsentShowcase() {
  return <IllustrationTabs views={VIEWS} label="How consent works" />
}
