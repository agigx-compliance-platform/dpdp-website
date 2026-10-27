'use client'

import { DsarLifecycle, ThirdPartyPropagation } from '@/components/illustrations'
import { IllustrationTabs, type IllustrationView } from './IllustrationTabs'

const VIEWS: readonly IllustrationView[] = [
  {
    id: 'rights',
    label: 'Rights request',
    summary: 'Discovery finds the person in every known store before anything is erased.',
    Illustration: DsarLifecycle,
  },
  {
    id: 'third-parties',
    label: 'Third parties',
    summary: 'A consent change reaches only the processors mapped to that purpose.',
    Illustration: ThirdPartyPropagation,
  },
]

export function PlatformShowcase() {
  return <IllustrationTabs views={VIEWS} label="How the modules connect" />
}
