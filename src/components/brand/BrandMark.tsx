'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const LOGO_SRC = '/images/brand/consent-cockpit-logo.png'

type BrandMarkProps = {
  className?: string
  linkClassName?: string
  size?: 'default' | 'compact'
  showTagline?: boolean
  priority?: boolean
}

export function BrandMark({
  className,
  linkClassName,
  size = 'default',
  showTagline = true,
  priority = false,
}: BrandMarkProps) {
  const dimension = size === 'compact' ? 32 : 44
  return (
    <Link
      href="/"
      className={cn('inline-flex flex-col items-center gap-0.5 shrink-0 text-center', linkClassName)}
      aria-label="Consent Cockpit home"
    >
      <Image
        src={LOGO_SRC}
        alt="Consent Cockpit"
        width={dimension}
        height={dimension}
        className={cn(
          'object-contain',
          size === 'compact' ? 'h-8 w-8' : 'h-10 w-10 sm:h-11 sm:w-11',
          className,
        )}
        priority={priority}
      />
      {showTagline && (
        <span className="block w-full text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          consent cockpit
        </span>
      )}
    </Link>
  )
}
