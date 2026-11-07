import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'Cloud and code checks for DPDP'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'Cloud and code checks.',
    'Spot risky settings that could expose personal data.',
  )
}
