import type { CanvasCenterNode, CanvasEdge, CanvasNode } from '@/components/workflow'

/** Give, inspect, withdraw, then notify the fiduciary and processors. */
export const consentLifecycleNodes: CanvasNode[] = [
  {
    id: 'give',
    x: 18,
    y: 28,
    card: {
      eyebrow: 'Give',
      title: 'Purpose grant on the site',
      status: 'cleared',
      rows: [
        { label: 'Onboarding', value: 'Granted' },
        { label: 'Marketing', value: 'Granted' },
      ],
    },
  },
  {
    id: 'see',
    x: 82,
    y: 28,
    card: {
      eyebrow: 'See',
      title: 'Same record in the cockpit',
      status: 'live',
      rows: [
        { label: 'Notice', value: 'v12, Hindi' },
        { label: 'Opened by', value: 'Data Principal' },
      ],
    },
  },
  {
    id: 'withdraw',
    x: 18,
    y: 74,
    card: {
      variant: 'receipt',
      eyebrow: 'Withdraw',
      title: 'Marketing purpose closed',
      status: 'sealed',
      recordId: 'wd-3c91aa',
      hash: 'b04c…91e2',
      timestamp: '19 Oct 2026, 21:12 IST',
      tearLine: true,
      footer: 'Withdrawal is as reachable as the original grant.',
    },
  },
  {
    id: 'notify',
    x: 82,
    y: 74,
    card: {
      eyebrow: 'Notify',
      title: 'Fiduciary and processors',
      status: 'cleared',
      rows: [
        { label: 'CRM', value: 'Stop marketing use' },
        { label: 'Ad vendor', value: 'Signal delivered' },
      ],
    },
  },
]

export const consentLifecycleEdges: CanvasEdge[] = [
  { from: 'give', to: '__center__' },
  { from: '__center__', to: 'see' },
  { from: 'see', to: 'withdraw' },
  { from: 'withdraw', to: 'notify' },
]

export const consentLifecycleCenter: CanvasCenterNode = {
  label: 'Cockpit',
  sublabel: 'One activity ledger',
}
