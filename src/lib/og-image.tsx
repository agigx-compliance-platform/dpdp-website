import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#fafafa',
          color: '#111827',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#16a34a' }}>
          DPDP Consultancy
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 650, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 24, color: '#4b5563', maxWidth: 860 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 18, color: '#6b7280' }}>dpdpconsultancy.in</div>
      </div>
    ),
    OG_SIZE,
  )
}
