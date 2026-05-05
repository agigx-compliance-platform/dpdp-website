'use client'

import { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TorchGridProps {
  children: React.ReactNode
  /** Tailwind column classes e.g. "md:grid-cols-3" */
  cols?: string
  gap?: string
  className?: string
  /** Optional CSS color string to override the green glow */
  glowColor?: string
}

interface TorchCardProps {
  children: React.ReactNode
  className?: string
}

// ─── Global styles (injected once into <head>) ────────────────────────────────

const STYLES = `
  /* Outer shell: holds the sweeping border glow */
  .tg-shell {
    position: relative;
    border-radius: 12px;
    background: hsl(var(--foreground) / 0.06);
  }

  /* Wide radial sweep across ALL cards when the grid is hovered */
  .tg-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.5s;
    background: radial-gradient(
      600px circle at var(--mx, -9999px) var(--my, -9999px),
      var(--tg-glow, rgba(74, 222, 128, 0.28)),
      transparent 40%
    );
    pointer-events: none;
    z-index: 0;
  }

  .tg-wrapper:hover .tg-shell::before {
    opacity: 1;
  }

  /* Inner surface: 1px inside so shell border glow peeks through */
  .tg-inner {
    position: relative;
    margin: 1px;
    border-radius: 11px;
    background: hsl(var(--background));
    overflow: hidden;
    /* height: calc(100% - 2px) fills the shell minus the 1px top+bottom margin */
    height: calc(100% - 2px);
    z-index: 1;
  }

  /* Tight spotlight: only on the specific hovered card */
  .tg-inner::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.5s;
    background: radial-gradient(
      350px circle at var(--mx, -9999px) var(--my, -9999px),
      var(--tg-inner-glow, rgba(74, 222, 128, 0.09)),
      transparent 40%
    );
    pointer-events: none;
    z-index: 0;
  }

  .tg-shell:hover .tg-inner::before {
    opacity: 1;
  }

  /* Content sits above both glow layers */
  .tg-content {
    position: relative;
    z-index: 1;
    height: 100%;
  }
`

let injected = false
function injectStyles() {
  if (injected || typeof document === 'undefined') return
  const tag = document.createElement('style')
  tag.textContent = STYLES
  document.head.appendChild(tag)
  injected = true
}

// ─── TorchGrid ────────────────────────────────────────────────────────────────

/**
 * Wrap any CSS grid with this to get the torch/spotlight hover effect.
 * Every direct child should be a <TorchCard>.
 *
 * @example
 * <TorchGrid cols="md:grid-cols-3" gap="gap-6">
 *   <TorchCard className="p-6">…</TorchCard>
 * </TorchGrid>
 */
export function TorchGrid({
  children,
  cols = 'sm:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-2',
  className,
  glowColor,
}: TorchGridProps) {
  useEffect(() => { injectStyles() }, [])

  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const shells = ref.current?.querySelectorAll<HTMLElement>('.tg-shell')
    if (!shells) return
    for (const shell of shells) {
      const r = shell.getBoundingClientRect()
      shell.style.setProperty('--mx', `${e.clientX - r.left}px`)
      shell.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn('tg-wrapper grid', cols, gap, className)}
      style={
        glowColor
          ? ({
              '--tg-glow': glowColor,
              '--tg-inner-glow': glowColor,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  )
}

// ─── TorchCard ────────────────────────────────────────────────────────────────

/**
 * A single card inside a TorchGrid. Pass padding/layout classes via className.
 * Always stretches to fill its grid cell (h-full).
 *
 * If your content uses motion.div as the outer wrapper, put TorchCard *inside*
 * the motion.div so animations still work:
 *
 * @example
 * <motion.div …>
 *   <TorchCard className="p-6 flex flex-col">
 *     …content…
 *   </TorchCard>
 * </motion.div>
 */
export function TorchCard({ children, className }: TorchCardProps) {
  return (
    <div className="tg-shell h-full">
      <div className="tg-inner">
        <div className={cn('tg-content', className)}>
          {children}
        </div>
      </div>
    </div>
  )
}
