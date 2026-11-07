import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

export const consentNodes: CanvasNode[] = [
  {
    id: 'notice',
    x: 18,
    y: 28,
    card: {
      eyebrow: 'Notice',
      title: 'Purpose notice shown',
      status: 'cleared',
      rows: [
        { label: 'Purpose', value: 'Onboarding KYC' },
        { label: 'Language', value: 'English · Hindi' },
      ],
    },
  },
  {
    id: 'choice',
    x: 82,
    y: 28,
    card: {
      eyebrow: 'Consent',
      title: 'Choice by purpose',
      status: 'live',
      rows: [
        { label: 'KYC', value: 'Granted' },
        { label: 'Marketing', value: 'Withdrawn' },
      ],
    },
  },
  {
    id: 'receipt',
    x: 18,
    y: 74,
    card: {
      variant: 'receipt',
      eyebrow: 'Proof',
      title: 'Consent record',
      status: 'cleared',
      timestamp: '15 Oct 2026, 21:04 IST',
      tearLine: true,
      footer: 'Append-only log. Withdrawal invalidates this version.',
    },
  },
  {
    id: 'processor',
    x: 82,
    y: 74,
    card: {
      eyebrow: 'Vendor',
      title: 'Vendor told',
      status: 'cleared',
      rows: [
        { label: 'Vendor', value: 'KYC screening' },
        { label: 'Action', value: 'Stop marketing use' },
      ],
    },
  },
]

export const consentEdges: CanvasEdge[] = [
  { from: 'notice', to: '__center__' },
  { from: '__center__', to: 'choice' },
  { from: 'choice', to: 'receipt' },
  { from: 'receipt', to: 'processor' },
]

export const consentCenter: CanvasCenterNode = {
  label: 'Consent',
  sublabel: 'Ask, then prove',
}
