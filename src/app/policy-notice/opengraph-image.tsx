import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'Policy and notice management for DPDP'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'Policy and notice management.',
    'Two notice types now. More can be added. Version what the visitor saw.',
  )
}
