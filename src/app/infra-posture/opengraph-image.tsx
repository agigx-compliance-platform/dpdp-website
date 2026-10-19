import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'Infrastructure posture for DPDP'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'Infrastructure posture.',
    'Cloud and code, seen as a privacy duty. More estates can be added.',
  )
}
