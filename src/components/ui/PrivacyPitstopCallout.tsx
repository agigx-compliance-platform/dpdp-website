'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const emptySubscribe = () => () => {}

export function PrivacyPitstopCallout() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  if (!mounted || pathname === '/privacy-pitstop') return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => setCollapsed(false)}
            aria-label="Open Privacy Pitstop"
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-[var(--shadow-md)] transition-colors hover:border-primary/30"
          >
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Pitstop</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-md)]"
          >
            <div className="h-1 w-full bg-primary" />
            <div className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-base font-semibold text-foreground">Privacy Pitstop</p>
                <button
                  onClick={() => setCollapsed(true)}
                  aria-label="Minimize callout"
                  className="ml-2 mt-0.5 shrink-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  ─
                </button>
              </div>
              <p className="mb-1 text-sm text-muted-foreground">
                Public-page scan of notice, consent, cookies, and rights links.
              </p>
              <p className="mb-4 text-xs text-muted-foreground/70">
                No login. Findings become questions and a grievance draft.
              </p>
              <Link href="/privacy-pitstop">
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Open Pitstop
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
