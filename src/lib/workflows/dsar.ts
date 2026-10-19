import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const dsarNodes: CanvasNode[] = [
  {
    id: 'intake',
    x: 18,
    y: 28,
    card: {
      eyebrow: 'Intake',
      title: 'Erasure request',
      status: 'live',
      rows: [
        { label: 'Channel', value: 'Web form' },
        { label: 'SLA', value: '30 days' },
      ],
    },
  },
  {
    id: 'locate',
    x: 82,
    y: 28,
    card: {
      eyebrow: 'Locate',
      title: 'Find the person in known stores',
      status: 'in-review',
      rows: [
        { label: 'Stores hit', value: '4 of 4 known' },
        { label: 'Method', value: 'Exact match' },
      ],
    },
  },
  {
    id: 'act',
    x: 18,
    y: 74,
    card: {
      eyebrow: 'Fulfil',
      title: 'Erasure dispatch',
      status: 'cleared',
      rows: [
        { label: 'Live store', value: 'Removed' },
        { label: 'Backup', value: 'Retained · disclosed' },
      ],
    },
  },
  {
    id: 'proof',
    x: 82,
    y: 74,
    card: {
      variant: 'receipt',
      eyebrow: 'Evidence',
      title: 'Rights ledger',
      status: 'sealed',
      recordId: 'dsar-b72c48e',
      timestamp: '15 Oct 2026, 18:41 IST',
      tearLine: true,
      footer: 'Grievance officer named. Response time recorded.',
    },
  },
]

export const dsarEdges: CanvasEdge[] = [
  { from: 'intake', to: '__center__' },
  { from: '__center__', to: 'locate' },
  { from: 'locate', to: 'act' },
  { from: 'act', to: 'proof' },
]

export const dsarCenter: CanvasCenterNode = {
  label: 'Rights',
  sublabel: 'Access, correction, erasure',
}
