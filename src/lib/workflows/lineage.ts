import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const lineageNodes: CanvasNode[] = [
  {
    id: 'table',
    x: 16,
    y: 32,
    card: {
      eyebrow: 'Source table',
      title: 'core.customers',
      status: 'live',
      rows: [{ label: 'Evidence', value: 'Query history' }],
    },
  },
  {
    id: 'transform',
    x: 50,
    y: 18,
    card: {
      eyebrow: 'Transform',
      title: 'stg_customers',
      status: 'cleared',
      rows: [{ label: 'Evidence', value: 'Pipeline definition' }],
    },
  },
  {
    id: 'warehouse',
    x: 84,
    y: 36,
    card: {
      eyebrow: 'Warehouse',
      title: 'analytics.kyc_facts',
      status: 'cleared',
      rows: [{ label: 'Evidence', value: 'Job run' }],
    },
  },
  {
    id: 'processor',
    x: 72,
    y: 78,
    card: {
      eyebrow: 'Processor',
      title: 'KYC vendor store',
      status: 'in-review',
      rows: [{ label: 'Evidence', value: 'Infrastructure definition' }],
    },
  },
  {
    id: 'coverage',
    x: 28,
    y: 78,
    card: {
      variant: 'receipt',
      eyebrow: 'Coverage',
      title: 'Edged assets 18 / 22',
      status: 'sealed',
      rows: [
        { label: 'Hint, not claim', value: 'Gaps listed' },
        { label: 'Rights scope', value: 'Only known stores' },
      ],
      tearLine: true,
    },
  },
]

export const lineageEdges: CanvasEdge[] = [
  { from: 'table', to: 'transform' },
  { from: 'transform', to: 'warehouse' },
  { from: 'warehouse', to: 'processor' },
  { from: 'table', to: 'coverage' },
  { from: 'processor', to: 'coverage' },
]

export const lineageCenter: CanvasCenterNode = {
  label: 'Lineage',
  sublabel: 'What moved, what is still unknown',
}
