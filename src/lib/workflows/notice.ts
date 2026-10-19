import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const noticeNodes: CanvasNode[] = [
  {
    id: 'privacy',
    x: 18,
    y: 28,
    card: {
      eyebrow: 'Notice 1',
      title: 'Privacy notice',
      status: 'live',
      rows: [
        { label: 'Purpose', value: 'Onboarding KYC' },
        { label: 'Rights', value: 'Access · Erasure' },
      ],
    },
  },
  {
    id: 'cookie',
    x: 82,
    y: 28,
    card: {
      eyebrow: 'Notice 2',
      title: 'Cookie policy',
      status: 'cleared',
      rows: [
        { label: 'Categories', value: 'Essential · Analytics' },
        { label: 'Vendors', value: 'Named' },
      ],
    },
  },
  {
    id: 'version',
    x: 18,
    y: 74,
    card: {
      variant: 'receipt',
      eyebrow: 'Version',
      title: 'Notice v3 shown',
      status: 'sealed',
      recordId: 'nt-v3-91c',
      timestamp: '15 Oct 2026, 21:04 IST',
      tearLine: true,
      footer: 'Two notice types now. More can be added.',
    },
  },
  {
    id: 'more',
    x: 82,
    y: 74,
    card: {
      eyebrow: 'Can be added',
      title: 'Further notices',
      status: 'in-review',
      rows: [
        { label: 'Children', value: 'Addable' },
        { label: 'Processors · AI', value: 'Addable' },
      ],
    },
  },
]

export const noticeEdges: CanvasEdge[] = [
  { from: 'privacy', to: '__center__' },
  { from: 'cookie', to: '__center__' },
  { from: '__center__', to: 'version' },
  { from: 'version', to: 'more' },
]

export const noticeCenter: CanvasCenterNode = {
  label: 'Notices',
  sublabel: 'Two types now',
}
