import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const discoveryNodes: CanvasNode[] = [
  {
    id: 'source',
    x: 16,
    y: 50,
    card: {
      eyebrow: 'Source',
      title: 'Customer database',
      status: 'live',
      rows: [
        { label: 'Starts from', value: 'System catalog' },
        { label: 'Row values leave?', value: 'No' },
      ],
    },
  },
  {
    id: 'locate',
    x: 50,
    y: 22,
    card: {
      eyebrow: 'Locate',
      title: 'Find stores and fields',
      status: 'cleared',
      rows: [{ label: 'Output', value: 'Where personal data sits' }],
    },
  },
  {
    id: 'classify',
    x: 84,
    y: 38,
    card: {
      eyebrow: 'Classify',
      title: 'Name the personal data',
      status: 'cleared',
      rows: [{ label: 'Output', value: 'Contact, financial, child' }],
    },
  },
  {
    id: 'confirm',
    x: 68,
    y: 78,
    card: {
      eyebrow: 'Confirm',
      title: 'Ready for rights lookups',
      status: 'in-review',
      rows: [{ label: 'Lookup', value: 'Exact match, not a guess' }],
    },
  },
  {
    id: 'inventory',
    x: 32,
    y: 82,
    card: {
      variant: 'receipt',
      eyebrow: 'Inventory',
      title: 'customers.email',
      status: 'sealed',
      rows: [
        { label: 'Class', value: 'Contact identifier' },
        { label: 'Rights lookup', value: 'Indexed' },
      ],
      tearLine: true,
    },
  },
]

export const discoveryEdges: CanvasEdge[] = [
  { from: 'source', to: 'locate' },
  { from: 'locate', to: 'classify' },
  { from: 'classify', to: 'confirm' },
  { from: 'confirm', to: 'inventory' },
]

export const discoveryCenter: CanvasCenterNode = {
  label: 'Discovery',
  sublabel: 'Inside your network',
}
