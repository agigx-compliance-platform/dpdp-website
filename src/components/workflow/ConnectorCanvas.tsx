'use client'

/**
 * Two layouts for the same workflow data:
 * - canvas: floating cards with connector curves (desktop)
 * - steps: numbered grid (always used on small screens, and where chosen)
 *
 * Centering uses an inner wrapper so Framer Motion cannot overwrite it.
 *
 * The canvas falls back to steps at any width where the laid-out cards overlap
 * each other or spill past the frame, so a narrow column never shows clipped cards.
 */

import { useId, useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react'
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

/** Space kept between cards, and between a card and the frame, for the canvas to count as fitting. */
const CARD_CLEARANCE = 8

type Box = { left: number; top: number; right: number; bottom: number }

function cardsFit(canvas: HTMLElement, w: number, h: number): boolean {
  // offsetWidth/offsetHeight ignore the entrance transforms, so this measures the settled layout.
  const boxes: Box[] = []
  for (const el of canvas.querySelectorAll<HTMLElement>('[data-canvas-card]')) {
    const cx = (Number(el.dataset.x) / 100) * w
    const cy = (Number(el.dataset.y) / 100) * h
    const halfW = el.offsetWidth / 2
    const halfH = el.offsetHeight / 2
    boxes.push({ left: cx - halfW, top: cy - halfH, right: cx + halfW, bottom: cy + halfH })
  }
  for (const b of boxes) {
    if (b.left < CARD_CLEARANCE || b.top < CARD_CLEARANCE) return false
    if (b.right > w - CARD_CLEARANCE || b.bottom > h - CARD_CLEARANCE) return false
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]
      const b = boxes[j]
      const apart =
        a.right + CARD_CLEARANCE <= b.left ||
        b.right + CARD_CLEARANCE <= a.left ||
        a.bottom + CARD_CLEARANCE <= b.top ||
        b.bottom + CARD_CLEARANCE <= a.top
      if (!apart) return false
    }
  }
  return true
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
            className="flex min-w-0 flex-col"
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
            <WorkflowCard {...node.card} className="grow" />
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
  const [figureWidth, setFigureWidth] = useState(0)
  // Widest figure width at which these nodes were measured not to fit. Tied to the node set
  // so a tab switch to a different workflow measures afresh.
  const [misfit, setMisfit] = useState<{ nodes: CanvasNode[]; width: number } | null>(null)
  const canvasFits = figureWidth === 0 || misfit?.nodes !== nodes || figureWidth > misfit.width

  useEffect(() => {
    if (variant !== 'canvas') return
    const el = figureRef.current
    if (!el) return
    const update = () => setFigureWidth(el.offsetWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [variant])

  useEffect(() => {
    if (variant !== 'canvas' || !canvasFits) return
    const el = canvasRef.current
    if (!el) return
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [variant, canvasFits])

  useLayoutEffect(() => {
    const el = canvasRef.current
    if (variant !== 'canvas' || !canvasFits || !el || dims.w === 0) return
    if (!cardsFit(el, dims.w, dims.h)) {
      setMisfit((prev) => ({
        nodes,
        width: prev?.nodes === nodes ? Math.max(prev.width, figureWidth) : figureWidth,
      }))
    }
  }, [variant, canvasFits, dims, figureWidth, nodes])

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
      {variant === 'steps' || !canvasFits ? (
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
                <div
                  className="w-[210px] -translate-x-1/2 -translate-y-1/2"
                  data-canvas-card
                  data-x={node.x ?? 50}
                  data-y={node.y ?? 50}
                >
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
