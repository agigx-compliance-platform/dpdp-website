import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const infraNodes: CanvasNode[] = [
  {
    id: 'cloud',
    x: 16,
    y: 32,
    card: {
      eyebrow: 'Estate',
      title: 'Cloud accounts',
      status: 'live',
      rows: [
        { label: 'Providers', value: 'AWS · Azure · GCP' },
        { label: 'Clusters', value: 'Kubernetes' },
      ],
    },
  },
  {
    id: 'finding',
    x: 82,
    y: 28,
    card: {
      eyebrow: 'Finding',
      title: 'Public bucket with identifiers',
      status: 'blocked',
      rows: [
        { label: 'Exposure', value: 'Personal data reachable' },
        { label: 'Owner', value: 'Storage account' },
      ],
    },
  },
  {
    id: 'control',
    x: 18,
    y: 74,
    card: {
      eyebrow: 'Control',
      title: 'Reasonable security',
      status: 'in-review',
      rows: [
        { label: 'Duty', value: 'Safeguards on personal data' },
        { label: 'Action', value: 'Restrict public access' },
      ],
    },
  },
  {
    id: 'ledger',
    x: 82,
    y: 74,
    card: {
      variant: 'receipt',
      eyebrow: 'Posture',
      title: 'Open items 4',
      status: 'sealed',
      recordId: 'ip-7c21',
      timestamp: '15 Oct 2026, 21:04 IST',
      tearLine: true,
      footer: 'Cloud posture summary.',
    },
  },
]

export const infraEdges: CanvasEdge[] = [
  { from: 'cloud', to: '__center__' },
  { from: '__center__', to: 'finding' },
  { from: 'finding', to: 'control' },
  { from: 'control', to: 'ledger' },
]

export const infraCenter: CanvasCenterNode = {
  label: 'Infra posture',
  sublabel: 'Cloud and code',
}
