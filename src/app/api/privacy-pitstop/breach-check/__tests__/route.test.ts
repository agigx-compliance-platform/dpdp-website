import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'

describe('POST /api/privacy-pitstop/breach-check', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when user consent is missing', async () => {
    const req = new Request('http://localhost/api/privacy-pitstop/breach-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', consent: false }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('User consent is required')
  })

  it('returns 400 when email format is invalid', async () => {
    const invalidInputs = ['not-an-email', 'https://domain.com', '+919876543210', 'user@']

    for (const email of invalidInputs) {
      const req = new Request('http://localhost/api/privacy-pitstop/breach-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true }),
      })

      const res = await POST(req)
      expect(res.status).toBe(400)
    }
  })

  it('handles clean / not found response gracefully', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('check-email')) {
        return {
          status: 200,
          ok: true,
          json: async () => ({ Error: 'Not found' }),
        } as unknown as Response
      }
      return {
        status: 200,
        ok: true,
        json: async () => [],
      } as unknown as Response
    })

    const req = new Request('http://localhost/api/privacy-pitstop/breach-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'clean.user@example.com', consent: true }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.breached).toBe(false)
    expect(data.count).toBe(0)
    expect(data.breaches).toEqual([])
  })

  it('handles 404 HTTP status from XposedOrNot as clean result', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('check-email')) {
        return {
          status: 404,
          ok: false,
        } as unknown as Response
      }
      return {
        status: 200,
        ok: true,
        json: async () => [],
      } as unknown as Response
    })

    const req = new Request('http://localhost/api/privacy-pitstop/breach-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'clean.user@example.com', consent: true }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.breached).toBe(false)
    expect(data.count).toBe(0)
  })

  it('handles breached email response and maps breach names', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('check-email')) {
        return {
          status: 200,
          ok: true,
          json: async () => ({
            breaches: [['Adobe', 'Canva']],
          }),
        } as unknown as Response
      }
      if (url.includes('breaches')) {
        return {
          status: 200,
          ok: true,
          json: async () => [
            {
              breach: 'Adobe',
              domain: 'adobe.com',
              breached_date: '2013-10-04',
              xposed_data: 'Email addresses, Passwords',
            },
          ],
        } as unknown as Response
      }
      return { status: 404, ok: false } as unknown as Response
    })

    const req = new Request('http://localhost/api/privacy-pitstop/breach-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'breached.user@example.com', consent: true }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.breached).toBe(true)
    expect(data.count).toBe(2)
    expect(data.breaches[0].name).toBe('Adobe')
    expect(data.breaches[0].breachedDate).toBe('2013-10-04')
    expect(data.breaches[0].exposedData).toEqual(['Email addresses', 'Passwords'])
    expect(data.breaches[1].name).toBe('Canva')
  })

  it('handles 429 rate limit correctly', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('check-email')) {
        return {
          status: 429,
          ok: false,
        } as unknown as Response
      }
      return { status: 200, ok: true, json: async () => [] } as unknown as Response
    })

    const req = new Request('http://localhost/api/privacy-pitstop/breach-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'any@example.com', consent: true }),
    })

    const res = await POST(req)
    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toContain('rate limit')
  })
})

