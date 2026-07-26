'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PrivacyPitstopCallout() {
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on the Privacy Pitstop page itself
  if (!mounted || pathname === '/privacy-pitstop') return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {collapsed ? (
          /* ── Collapsed: icon-only pill ────────────────── */
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => setCollapsed(false)}
            aria-label="Open Privacy Pitstop"
            className="flex items-center gap-2 px-4 py-3 rounded-full glass-card animate-cta-pulse cursor-pointer hover:border-primary/30 transition-colors"
          >
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              🚦 Pitstop
            </span>
          </motion.button>
        ) : (
          /* ── Expanded: full callout ───────────────────── */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="w-[300px] max-w-[calc(100vw-2rem)] glass-card overflow-hidden"
            style={{ animation: 'cta-pulse 2.5s ease-in-out infinite' }}
          >
            {/* Gradient accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))]" />

            <div className="p-5">
              {/* Header row with minimize */}
              <div className="flex items-start justify-between mb-2">
                <p className="text-base font-semibold text-foreground">
                  🚦 Privacy Pitstop
                </p>
                <button
                  onClick={() => setCollapsed(true)}
                  aria-label="Minimize callout"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 ml-2 shrink-0"
                >
                  ─
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-1">
                Know what websites collect about you.
              </p>
              <p className="text-xs text-muted-foreground/70 mb-4">
                Analyze any privacy policy in ~10 seconds — free.
              </p>

              <Link href="/privacy-pitstop">
                <span className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] text-white hover:shadow-[0_0_28px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5 transition-all duration-200">
                  Try it now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
