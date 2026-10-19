import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const cookieNodes: CanvasNode[] = [
  {
    id: 'scan',
    x: 16,
    y: 30,
    card: {
      eyebrow: 'Inventory',
      title: 'Cookies on this visit',
      status: 'live',
      rows: [
        { label: 'Essential', value: 'Allowed' },
        { label: 'Analytics', value: 'Blocked until grant' },
      ],
    },
  },
  {
    id: 'banner',
    x: 82,
    y: 28,
    card: {
      eyebrow: 'Banner',
      title: 'Bar layout',
      status: 'cleared',
      rows: [
        { label: 'Layouts now', value: 'Bar · Modal' },
        { label: 'More layouts', value: 'Can be added' },
      ],
    },
  },
  {
    id: 'choice',
    x: 18,
    y: 74,
    card: {
      eyebrow: 'Choice',
      title: 'Reject as easy as accept',
      status: 'cleared',
      rows: [
        { label: 'Analytics', value: 'Declined' },
        { label: 'Ads', value: 'Declined' },
      ],
    },
  },
  {
    id: 'receipt',
    x: 82,
    y: 74,
    card: {
      variant: 'receipt',
      eyebrow: 'Proof',
      title: 'Cookie consent receipt',
      status: 'sealed',
      recordId: 'ck-4b19e2',
      timestamp: '15 Oct 2026, 21:04 IST',
      tearLine: true,
      footer: 'More banner layouts can be added.',
    },
  },
]

export const cookieEdges: CanvasEdge[] = [
  { from: 'scan', to: '__center__' },
  { from: '__center__', to: 'banner' },
  { from: 'banner', to: 'choice' },
  { from: 'choice', to: 'receipt' },
]

export const cookieCenter: CanvasCenterNode = {
  label: 'Cookie consent',
  sublabel: 'Before non-essential tags',
}
