'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollPathProps {
  className?: string
}

export function ScrollPath({ className }: ScrollPathProps) {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current) return

    // FREE version: strokeDashoffset technique (no DrawSVGPlugin needed)
    const length = pathRef.current.getTotalLength()
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: pathRef.current,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 1.5,
      },
    })
  }, [])

  return (
    <svg
      viewBox="0 0 100 400"
      preserveAspectRatio="none"
      className={className}
      style={{
        width: '2px',
        height: '100%',
        position: 'absolute',
        left: '50%',
        top: 0,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity="0" />
          <stop offset="40%" stopColor="hsl(var(--info))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M 50 0 C 50 100, 20 150, 50 200 C 80 250, 50 300, 50 400"
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
