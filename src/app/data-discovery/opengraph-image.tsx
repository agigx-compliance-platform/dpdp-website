import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'Data discovery for DPDP'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'See where personal data lives.',
    'An inventory of systems and fields. Records stay in your network.',
  )
}
