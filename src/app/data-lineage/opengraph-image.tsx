import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'Data lineage for DPDP'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'How personal data moved.',
    'Coverage of known stores. Unknown stores stay listed as unknown.',
  )
}
