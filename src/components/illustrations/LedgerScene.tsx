'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ProgressGate } from '@/components/workflow/ProgressGate'
import { RoleChip } from '@/components/workflow/RoleChip'
import { StatusPill } from '@/components/workflow/StatusPill'

const STREAMS = ['Site notice', 'Purpose grant', 'Field inventory', 'Rights ticket', 'Vendor signal']

const ORBITS = [
  { label: 'Notice', x: '8%', y: '18%' },
  { label: 'Inventory', x: '78%', y: '14%' },
  { label: 'Grant', x: '6%', y: '62%' },
  { label: 'Rights', x: '80%', y: '58%' },
]

export function LedgerScene() {
  const prefersReduced = useReducedMotion()
  const delay = (n: number) => (prefersReduced ? 0 : n)

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border bg-background-secondary shadow-[var(--shadow-lg)]"
      role="img"
      aria-label="Ledger: notice, grant, inventory, and rights write to one sealed receipt"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Control plane
        </p>
        <StatusPill status="live" label="Live" />
      </div>

      {/* Incoming events sit in their own row so they never collide with the floating writes. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
        <p className="mr-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Incoming</p>
        {STREAMS.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay(0.12 + i * 0.06) }}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] text-muted-foreground"
          >
            {item}
          </motion.span>
        ))}
      </div>

      <div className="relative min-h-[380px] px-5 py-6 sm:min-h-[400px]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 560 320" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <radialGradient id="ledger-glow" cx="50%" cy="48%" r="42%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="560" height="320" fill="url(#ledger-glow)" />
          <path
            d="M 70 70 C 180 70, 220 140, 280 160"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <path
            d="M 490 60 C 400 100, 340 130, 300 160"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          />
          <path
            d="M 60 250 C 150 230, 220 180, 280 165"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          />
          <path
            d="M 500 250 C 420 220, 340 180, 300 165"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        </svg>

        {ORBITS.map((orb, i) => (
          <motion.div
            key={orb.label}
            className="absolute hidden sm:block"
            style={{ left: orb.x, top: orb.y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: delay(0.2 + i * 0.08) }}
          >
            <div className="rounded-2xl border border-border bg-card px-3 py-2 shadow-[var(--shadow-sm)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Write</p>
              <p className="text-sm font-semibold text-foreground">{orb.label}</p>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="relative z-10 mx-auto flex max-w-[220px] flex-col items-center pt-16 sm:pt-20"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay(0.15) }}
        >
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-primary/40 bg-card shadow-[var(--shadow-md)]">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Receipt
              </p>
              <p className="mt-1 font-mono text-xs text-foreground">cr-8f2c48a</p>
              <p className="mt-2 text-[11px] text-primary">Sealed</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3 border-t border-border bg-card/60 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <RoleChip role="DPO" />
          <span className="text-xs text-muted-foreground">Named approver. Withdrawal invalidates this version.</span>
        </div>
        <ProgressGate current={2} total={3} label="Purpose grants on this notice" />
        <p className="font-mono text-[10px] text-muted-foreground">15 Oct 2026, 21:04 IST</p>
      </div>
    </div>
  )
}
