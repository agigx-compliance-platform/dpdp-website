'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.2,
    })

    // CRITICAL: Tell ScrollTrigger to use Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000) // gsap ticker runs in seconds, lenis needs ms
    }

    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0) // prevent GSAP catching up after tab switch

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
    }
  }, [])

  return <>{children}</>
}
