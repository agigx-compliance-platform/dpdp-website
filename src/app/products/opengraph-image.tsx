import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'DPDP Consultancy products'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'DPDP Consultancy products',
    'Consent, finding personal data, people’s requests, vendors, and proof.',
  )
}
