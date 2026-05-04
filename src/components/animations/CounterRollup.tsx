'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CounterProps {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
  label: string
  labelClassName?: string
  valueClassName?: string
}

export function CounterRollup({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2.2,
  label,
  labelClassName,
  valueClassName,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    if (!ref.current || !numRef.current) return

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj.current, {
          val: value,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (!numRef.current) return
            numRef.current.textContent = obj.current.val
              .toFixed(decimals)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          },
        })
      },
    })
  }, [value, duration, decimals])

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div
        className={valueClassName}
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {prefix}
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div
        className={labelClassName}
        style={{
          fontSize: '0.875rem',
          color: 'hsl(var(--foreground) / 0.45)',
          marginTop: '0.5rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  )
}
