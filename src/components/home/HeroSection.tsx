'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { getHeroVideoDisclaimer } from '@/lib/hero-config'

export function HeroSection() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [allowVideo, setAllowVideo] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const videoDisclaimer = getHeroVideoDisclaimer()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setAllowVideo(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-poster.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn(
            'object-cover transition-transform duration-700',
            !videoPlaying && 'motion-reduce:scale-105 motion-reduce:animate-none animate-ken-burns'
          )}
        />

        {allowVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-poster.png"
            aria-hidden
            className={cn(
              'absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700',
              'brightness-[1.04] contrast-[1.07] saturate-[1.05]',
              isLight && 'brightness-[1.08] contrast-[1.12] saturate-[1.08]',
              videoPlaying ? 'opacity-100' : 'opacity-0'
            )}
            onPlaying={() => setVideoPlaying(true)}
            onError={() => setVideoPlaying(false)}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-[2]',
          isLight
            ? 'bg-gradient-to-b from-black/[0.58] via-black/[0.42] to-black/[0.22]'
            : 'bg-gradient-to-b from-background/90 via-background/65 to-background/15'
        )}
        aria-hidden
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-gradient-to-t to-transparent',
          isLight ? 'from-black/50' : 'from-background/40'
        )}
        aria-hidden
      />

      <div
        className={cn(
          'relative z-[3] mx-auto max-w-4xl px-4 text-center sm:px-6',
          isLight && 'text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]'
        )}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl',
            isLight ? 'text-white' : 'text-foreground'
          )}
        >
          Compliance{' '}
          <span
            className={cn(
              'gradient-text',
              isLight && '[filter:drop-shadow(0_2px_16px_rgba(0,0,0,0.85))]'
            )}
          >
            Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className={cn(
            'mx-auto mt-6 max-w-2xl text-lg sm:text-xl',
            isLight ? 'text-white/95' : 'text-muted-foreground'
          )}
        >
          Transform DPDP, GDPR, and AI governance into a living, enforceable compliance engine, not
          a checklist.
        </motion.p>

        {videoDisclaimer ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className={cn(
              'mx-auto mt-4 max-w-2xl text-xs sm:text-sm',
              isLight ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            {videoDisclaimer}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className={cn('mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row', videoDisclaimer && 'mt-8')}
        >
          <Link href="/questionnaire">
            <Button variant="primary" size="lg">
              Scan Your Website
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className={isLight ? 'border-white/40 bg-white/10 text-white hover:bg-white/20' : undefined}>
              Talk to an Expert
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-[3] -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown
            className={cn('h-6 w-6', isLight ? 'text-white/70' : 'text-muted-foreground')}
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
