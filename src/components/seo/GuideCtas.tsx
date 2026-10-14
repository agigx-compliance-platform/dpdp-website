import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function GuideCtas() {
  return (
    <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
      <Link href="/privacy-pitstop">
        <Button variant="primary">Scan a website free</Button>
      </Link>
      <Link href="/questionnaire">
        <Button variant="outline">Take the DPDP assessment</Button>
      </Link>
      <Link href="/contact">
        <Button variant="ghost">Talk to DPDP Consultancy</Button>
      </Link>
    </div>
  )
}
