'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const LOGO_LIGHT = '/images/brand/logo-light.svg'
const LOGO_WHITE = '/images/brand/logo-white.svg'

type BrandMarkProps = {
  className?: string
  linkClassName?: string
  size?: 'default' | 'compact'
  priority?: boolean
}

export function BrandMark({
  className,
  linkClassName,
  size = 'default',
  priority = false,
}: BrandMarkProps) {
  const width = size === 'compact' ? 132 : 168
  const height = size === 'compact' ? 34 : 44

  return (
    <Link
      href="/"
      className={cn('brand-mark inline-flex shrink-0 items-center', linkClassName)}
      aria-label="DPDP Consultancy home"
    >
      <Image
        src={LOGO_LIGHT}
        alt="DPDP Consultancy"
        width={width}
        height={height}
        className={cn('brand-mark__logo brand-mark__logo--light h-auto w-auto object-contain object-left', className)}
        style={{ width, height }}
        priority={priority}
        unoptimized
      />
      <Image
        src={LOGO_WHITE}
        alt=""
        aria-hidden
        width={width}
        height={height}
        className={cn('brand-mark__logo brand-mark__logo--dark h-auto w-auto object-contain object-left', className)}
        style={{ width, height }}
        priority={priority}
        unoptimized
      />
    </Link>
  )
}
