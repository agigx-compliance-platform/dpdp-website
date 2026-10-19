import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const processorNodes: CanvasNode[] = [
  {
    id: 'registry',
    x: 18,
    y: 30,
    card: {
      eyebrow: 'Registry',
      title: 'KYC screening vendor',
      status: 'live',
      rows: [
        { label: 'State', value: 'Active' },
        { label: 'Purpose', value: 'Onboarding KYC' },
      ],
    },
  },
  {
    id: 'event',
    x: 82,
    y: 30,
    card: {
      eyebrow: 'Trigger',
      title: 'Consent withdrawn',
      status: 'in-review',
      rows: [{ label: 'Signal', value: 'Stop processing' }],
    },
  },
  {
    id: 'delivery',
    x: 18,
    y: 74,
    card: {
      eyebrow: 'Notify',
      title: 'Delivery monitor',
      status: 'cleared',
      rows: [
        { label: 'Last push', value: 'Delivered' },
        { label: 'Retries', value: 'None' },
      ],
    },
  },
  {
    id: 'risk',
    x: 82,
    y: 74,
    card: {
      eyebrow: 'Risk',
      title: 'Vendor matrix',
      status: 'sealed',
      rows: [
        { label: 'Class', value: 'High · personal data' },
        { label: 'DPA', value: 'On file' },
      ],
    },
  },
]

export const processorEdges: CanvasEdge[] = [
  { from: 'registry', to: '__center__' },
  { from: '__center__', to: 'event' },
  { from: 'event', to: 'delivery' },
  { from: 'delivery', to: 'risk' },
]

export const processorCenter: CanvasCenterNode = {
  label: 'Vendors',
  sublabel: 'Downstream action',
}
