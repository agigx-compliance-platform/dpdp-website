import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'Cookie consent for DPDP: bar and modal layouts'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'Cookie consent for Indian sites.',
    'Two banner layouts now. More can be added. Block until grant.',
  )
}
