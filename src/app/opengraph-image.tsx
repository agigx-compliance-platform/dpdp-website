import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'DPDP Consultancy: consent, inventory, and rights for India'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'Get your business ready for India’s data privacy law.',
    'We show you what to do, help you do it, and keep the proof ready.',
  )
}
