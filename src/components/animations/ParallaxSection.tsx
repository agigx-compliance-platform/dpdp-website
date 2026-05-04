'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxSectionProps {
  background?: React.ReactNode // slowest layer — 30% speed
  midground?: React.ReactNode // mid layer  — 60% speed
  foreground: React.ReactNode // front layer — 100% speed (normal)
  height?: string
  className?: string
}

export function ParallaxSection({
  background,
  midground,
  foreground,
  height = '100vh',
  className,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Background moves 40% less than scroll (feels further away)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  // Midground moves 20% less
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', height, overflow: 'hidden' }}
    >
      {background && (
        <motion.div
          style={{ y: bgY, position: 'absolute', inset: 0, willChange: 'transform' }}
        >
          {background}
        </motion.div>
      )}

      {midground && (
        <motion.div
          style={{ y: midY, position: 'absolute', inset: 0, willChange: 'transform' }}
        >
          {midground}
        </motion.div>
      )}

      {/* Foreground scrolls normally */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {foreground}
      </div>
    </div>
  )
}
