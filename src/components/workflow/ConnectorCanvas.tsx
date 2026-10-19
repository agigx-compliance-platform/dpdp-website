'use client'

/**
 * Two layouts for the same workflow data:
 * - canvas: floating cards with connector curves (desktop)
 * - steps: numbered grid (always used on small screens, and where chosen)
 *
 * Centering uses an inner wrapper so Framer Motion cannot overwrite it.
 */

import { useId, useRef, useEffect, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { WorkflowCard, type WorkflowCardProps } from './WorkflowCard'

export interface CanvasNode {
  id: string
  card: WorkflowCardProps
  x?: number
  y?: number
}

export interface CanvasEdge {
  from: string
  to: string
}

export interface CanvasCenterNode {
  label: string
  sublabel?: string
}

interface ConnectorCanvasProps {
  nodes: CanvasNode[]
  edges?: CanvasEdge[]
  center?: CanvasCenterNode
  className?: string
  minHeight?: number
  variant?: 'canvas' | 'steps'
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)
  const cx = dx > dy ? mx : x1
  const cy = dx > dy ? y1 : (y1 + y2) / 2
  const cx2 = dx > dy ? mx : x2
  const cy2 = dx > dy ? y2 : (y1 + y2) / 2
  return `M ${x1} ${y1} C ${cx} ${cy}, ${cx2} ${cy2}, ${x2} ${y2}`
}

function gridCols(count: number): string {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2 || count === 4) return 'grid-cols-1 sm:grid-cols-2'
  return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
}

function StepGrid({
  nodes,
  center,
  isInView,
}: {
  nodes: CanvasNode[]
  center?: CanvasCenterNode
  isInView: boolean
}) {
  return (
    <div>
      {center ? (
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {center.label}
          </p>
          {center.sublabel ? (
            <p className="mt-1 text-sm text-muted-foreground">{center.sublabel}</p>
          ) : null}
        </div>
      ) : null}
      <ol className={`grid gap-3 ${gridCols(nodes.length)}`}>
        {nodes.map((node, i) => (
          <motion.li
            key={node.id}
            className="min-w-0"
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.06 + i * 0.05 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="h-px min-w-0 flex-1 bg-border" />
            </div>
            <WorkflowCard {...node.card} className="h-full" />
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

export function ConnectorCanvas({
  nodes,
  edges = [],
  center,
  className = '',
  minHeight = 520,
  variant = 'steps',
}: ConnectorCanvasProps) {
  const gradientId = useId()
  const figureRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(figureRef, { once: true, margin: '-80px' })
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (variant !== 'canvas') return
    const el = canvasRef.current
    if (!el) return
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [variant])

  const nodePositions = useMemo(() => {
    const map = new Map<string, { cx: number; cy: number }>()
    for (const n of nodes) {
      map.set(n.id, {
        cx: ((n.x ?? 50) / 100) * dims.w,
        cy: ((n.y ?? 50) / 100) * dims.h,
      })
    }
    if (center) {
      map.set('__center__', { cx: dims.w / 2, cy: dims.h / 2 })
    }
    return map
  }, [nodes, center, dims])

  return (
    <figure ref={figureRef} className={`relative w-full min-w-0 ${className}`}>
      {variant === 'steps' ? (
        <StepGrid nodes={nodes} center={center} isInView={isInView} />
      ) : (
        <>
          <div className="lg:hidden">
            <StepGrid nodes={nodes} center={center} isInView={isInView} />
          </div>
          <div
            ref={canvasRef}
            className="relative hidden overflow-hidden rounded-2xl border border-border bg-background-secondary/40 lg:block"
            style={{ minHeight }}
          >
            {dims.w > 0 && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                {edges.map((edge, i) => {
                  const from = nodePositions.get(edge.from)
                  const to = nodePositions.get(edge.to)
                  if (!from || !to) return null
                  const d = bezierPath(from.cx, from.cy, to.cx, to.cy)
                  return (
                    <motion.path
                      key={`${edge.from}-${edge.to}`}
                      d={d}
                      fill="none"
                      stroke={`url(#${gradientId})`}
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )
                })}
              </svg>
            )}

            {center && (
              <motion.div
                className="absolute left-1/2 top-1/2 z-10"
                initial={{ opacity: 0, scale: 0.86 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <div className="flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/35 bg-background shadow-[var(--shadow-md)]">
                  <span className="px-2 text-center text-[10px] font-semibold leading-tight text-primary">
                    {center.label}
                  </span>
                </div>
              </motion.div>
            )}

            {nodes.map((node, i) => (
              <motion.div
                key={node.id}
                className="absolute z-20"
                style={{ left: `${node.x ?? 50}%`, top: `${node.y ?? 50}%` }}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.18 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="w-[210px] -translate-x-1/2 -translate-y-1/2">
                  <WorkflowCard {...node.card} />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </figure>
  )
}
