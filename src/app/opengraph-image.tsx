import { ogImage, OG_SIZE } from '@/lib/og-image'

export const alt = 'DPDP Consultancy: consent, inventory, and rights for India'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage(
    'Consent, inventory, and rights. A ledger the Board can read.',
    'Personal data stays in your network. Receipts the Board can ask for.',
  )
}
