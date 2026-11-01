'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Sparkles,
} from 'lucide-react'
import { PRODUCTS, productIconMap } from '@/lib/products-data'
import {
  productScreenshots,
  adminShot,
  type ProductScreenshotKey,
  type ThemedScreenshot,
} from '@/lib/agigx-ui-screenshots'
import { ThemeScreenshot } from '@/components/ui/ThemeScreenshot'
import { cn } from '@/lib/utils'

export interface ScannerProductAdItem {
  id: string
  name: string
  tagline: string
  description: string
  href: string
  iconName: string
  badge: string
  dpdpBadge?: string
  featureHighlight?: string
  screenshot: ThemedScreenshot
}

const FALLBACK_SCREENSHOTS: Record<string, ThemedScreenshot> = {
  'cookie-consent': {
    ...adminShot('cmp-manage-cookies.png'),
    caption: 'Bar and modal consent layouts with live cookie inventory and pre-consent blocking.',
  },
  'policy-notice': {
    ...adminShot('cmp-cookie-policy.png'),
    caption: 'Versioned privacy notices and cookie policies mapped to processing purposes.',
  },
  'data-discovery': {
    ...adminShot('cmp-dashboard.png'),
    caption: 'Locate data stores, classify personal data, and maintain a defensible inventory.',
  },
  'data-lineage': {
    ...adminShot('cmp-processor-monitoring.png'),
    caption: 'Map how personal data moves across pipelines, infrastructure, and processors.',
  },
}

const HOME_SECTION_HREFS: Record<string, string> = {
  'consent-platform': '/consent-management',
  'cookie-consent': '/cookie-consent',
  'policy-notice': '/policy-notice',
  trustscope: '/privacy-pitstop',
  'data-discovery': '/data-discovery',
  'data-lineage': '/data-lineage',
  'dsar-platform': '/products#dsar-platform',
  'processor-governance': '/products#processor-governance',
  'infra-scanner': '/infra-posture',
  'ai-assistant': '/products#ai-assistant',
  'adaptive-engine': '/dpdp-platform',
}

export const SCANNER_PRODUCT_ADS: ScannerProductAdItem[] = PRODUCTS.map((product) => {
  const screenshot: ThemedScreenshot =
    product.id in productScreenshots
      ? productScreenshots[product.id as ProductScreenshotKey]
      : FALLBACK_SCREENSHOTS[product.id] ?? productScreenshots['consent-platform']

  const primaryDomain =
    product.complianceDomains.find((d) => d !== 'All') ?? 'DPDP Platform'
  const primarySection =
    product.dpdpSections[0] === 'All'
      ? 'All Sections'
      : product.dpdpSections[0]
        ? `Sec ${product.dpdpSections[0]}`
        : undefined

  const href =
    ('href' in product && typeof product.href === 'string' && product.href) ||
    HOME_SECTION_HREFS[product.id] ||
    `/products#${product.id}`

  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    href,
    iconName: product.icon,
    badge: primaryDomain,
    dpdpBadge: primarySection,
    featureHighlight: product.features[0]?.title,
    screenshot,
  }
})

interface ScannerProductAdsProps {
  items?: ScannerProductAdItem[]
  rotationIntervalMs?: number
  className?: string
}

export function ScannerProductAds({
  items = SCANNER_PRODUCT_ADS,
  rotationIntervalMs = 5000,
  className,
}: ScannerProductAdsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = trackRef.current
      if (!container || !items.length) return
      const normalized = ((index % items.length) + items.length) % items.length
      const cards = container.querySelectorAll<HTMLElement>('[data-product-ad-card]')
      const targetCard = cards[normalized]
      if (targetCard) {
        const left = targetCard.offsetLeft - container.offsetLeft
        container.scrollTo({ left, behavior: 'smooth' })
      }
      setActiveIndex(normalized)
    },
    [items.length]
  )

  useEffect(() => {
    if (isPaused || items.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length
        const container = trackRef.current
        if (container) {
          const cards = container.querySelectorAll<HTMLElement>('[data-product-ad-card]')
          const maxScrollLeft = container.scrollWidth - container.clientWidth
          const targetCard = cards[next]
          if (targetCard) {
            const targetLeft = targetCard.offsetLeft - container.offsetLeft
            if (prev > 0 && container.scrollLeft >= maxScrollLeft - 8) {
              container.scrollTo({ left: 0, behavior: 'smooth' })
              return 0
            }
            container.scrollTo({ left: Math.min(targetLeft, maxScrollLeft), behavior: 'smooth' })
          }
        }
        return next
      })
    }, rotationIntervalMs)
    return () => clearInterval(timer)
  }, [isPaused, items.length, rotationIntervalMs])

  const handleScroll = useCallback(() => {
    const container = trackRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>('[data-product-ad-card]')
    if (!cards.length) return
    const scrollPos = container.scrollLeft
    let closestIdx = 0
    let minDiff = Number.POSITIVE_INFINITY
    cards.forEach((card, idx) => {
      const diff = Math.abs(card.offsetLeft - container.offsetLeft - scrollPos)
      if (diff < minDiff) {
        minDiff = diff
        closestIdx = idx
      }
    })
    setActiveIndex(closestIdx)
  }, [])

  if (!items.length) return null

  const handlePrev = () => {
    scrollToIndex(activeIndex - 1)
  }

  const handleNext = () => {
    const container = trackRef.current
    if (container && container.scrollLeft >= container.scrollWidth - container.clientWidth - 8) {
      scrollToIndex(0)
      return
    }
    scrollToIndex(activeIndex + 1)
  }

  return (
    <section
      aria-label="DPDP Platform Products"
      className={cn('relative pt-3 border-t border-border/70 min-w-0', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Header Row: Branded Promotion Title + Navigation Controls */}
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/30 shrink-0">
            <Sparkles className="w-3 h-3 shrink-0" />
            Explore Our Products
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline truncate">
            Built for end-to-end DPDP Act 2023 compliance
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/products"
            className="text-xs font-medium text-primary hover:underline underline-offset-4 mr-1 hidden sm:inline-flex items-center gap-1"
          >
            <span>All Products</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg border border-border bg-card hover:border-primary/50 text-foreground hover:text-primary hover:bg-muted transition-colors"
              aria-label="Previous product"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg border border-border bg-card hover:border-primary/50 text-foreground hover:text-primary hover:bg-muted transition-colors"
              aria-label="Next product"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Card Responsive Horizontal Track (1 col mobile, 2 cols sm, 3 cols md+) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc((100%-0.75rem)/2)] md:auto-cols-[calc((100%-1.5rem)/3)] gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 scrollbar-thin"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, idx) => {
          const Icon = productIconMap[item.iconName] ?? Fingerprint

          return (
            <article
              key={item.id}
              data-product-ad-card
              className="group relative flex flex-col justify-between h-[224px] min-w-0 max-w-full overflow-hidden rounded-xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/40 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200 snap-start"
            >
              {/* Top Accent Line */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 inset-x-0 h-[2px] z-20 bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
              />

              {/* Product Image Banner (Fixed Height, object-fit: contain) */}
              <Link
                href={item.href}
                className="relative block h-[92px] w-full shrink-0 overflow-hidden bg-muted/50 border-b border-border/60 p-1.5"
                aria-label={`Explore ${item.name}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-md">
                  <ThemeScreenshot
                    dark={item.screenshot.dark}
                    light={item.screenshot.light}
                    alt={item.name}
                    priority={idx < 3}
                    className="object-contain object-top w-full h-full max-w-full max-h-full transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Floating Domain & DPDP Section Badges */}
                <span className="absolute top-2 left-2 z-20 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-background/90 text-primary border border-primary/25 backdrop-blur-md shadow-sm max-w-[65%] truncate">
                  {item.badge}
                </span>
                {item.dpdpBadge && (
                  <span className="absolute top-2 right-2 z-20 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-background/90 text-muted-foreground border border-border/80 backdrop-blur-md">
                    {item.dpdpBadge}
                  </span>
                )}
              </Link>

              {/* Card Content Body */}
              <div className="flex flex-col flex-1 justify-between p-3 min-h-0 min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/25 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h4
                      className="text-xs sm:text-sm font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                  </div>

                  <p
                    className="text-[11px] text-muted-foreground leading-snug"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                    title={item.tagline}
                  >
                    {item.tagline}. {item.description}
                  </p>
                </div>

                {/* Bottom CTA Row */}
                <div className="pt-2 mt-auto flex items-center justify-between gap-2 border-t border-border/50">
                  {item.featureHighlight ? (
                    <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[52%]">
                      • {item.featureHighlight}
                    </span>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 shrink-0 group/btn"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Pagination Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => scrollToIndex(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === activeIndex
                ? 'w-5 bg-primary'
                : 'w-1.5 bg-primary/20 hover:bg-primary/40'
            )}
            aria-label={`Show ${item.name}`}
            title={item.name}
            type="button"
          />
        ))}
      </div>
    </section>
  )
}
