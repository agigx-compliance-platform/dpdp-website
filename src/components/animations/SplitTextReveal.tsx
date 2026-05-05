'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SplitTextRevealProps {
  children: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function SplitTextReveal({
  children,
  className,
  delay = 0.1,
  as: Tag = 'h1',
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Manual split (no GSAP Club required)
    const words = children.split(' ')
    ref.current.innerHTML = words
      .map(
        (word) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em;">` +
          word
            .split('')
            .map(
              (char) =>
                `<span class="split-char" style="display:inline-block;">${char}</span>`
            )
            .join('') +
          `</span>`
      )
      .join('')

    const chars = ref.current.querySelectorAll('.split-char')

    gsap.fromTo(
      chars,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.75,
        ease: 'power3.out',
        stagger: { amount: 0.5, from: 'start' },
        delay,
      }
    )

    return () => {
      if (ref.current) {
        ref.current.innerHTML = children
      }
    }
  }, [children, delay])

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className} style={{ overflow: 'hidden' }} />
}
