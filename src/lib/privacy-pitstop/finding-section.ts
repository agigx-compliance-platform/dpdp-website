import type { ScanCategoryId } from './types'

/** DPDP sections that the public scan actually inspects. */
const CATEGORY_SECTION: Record<ScanCategoryId, string> = {
  notice: '5',
  consent: '6',
  cookies: '6',
  rights: '12',
  ai_transparency: '6',
  childrens_privacy: '9',
  security: '8(5)',
}

const PILLAR_SECTION: Record<string, string> = {
  P1: '5',
  P2: '6',
  P3: '6',
  P4: '6(4)',
  P5: '8(2)',
  P6: '6',
  P7: '6',
  P8: '8(5)',
  P9: '8(5)',
  P10: '13',
}

export function sectionForFinding(finding: {
  categoryId?: string
  pillarId?: string
}): string | undefined {
  const category = finding.categoryId
  if (category && category in CATEGORY_SECTION) {
    return CATEGORY_SECTION[category as ScanCategoryId]
  }
  const pillar = finding.pillarId
  if (pillar && pillar in PILLAR_SECTION) {
    return PILLAR_SECTION[pillar]
  }
  return undefined
}
