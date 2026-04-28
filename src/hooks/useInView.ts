'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
}

function useInView(options: UseInViewOptions = {}): [RefObject<HTMLElement>, boolean] {
  const { threshold = 0.1, triggerOnce = true } = options
  const ref = useRef<HTMLElement>(null!)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)

        if (inView && triggerOnce) {
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, triggerOnce])

  return [ref, isInView]
}

export { useInView, type UseInViewOptions }
