import { describe, expect, it } from 'vitest'
import { assertPublicScanTarget, isBlockedScanHost } from '../private-host'

describe('assertPublicScanTarget', () => {
  it('accepts a public hostname', () => {
    expect(assertPublicScanTarget('https://example.com/path').hostname).toBe('example.com')
  })

  it('rejects metadata and private hosts', () => {
    expect(() => assertPublicScanTarget('metadata.google.internal')).toThrow()
    expect(() => assertPublicScanTarget('127.0.0.1')).toThrow()
    expect(() => assertPublicScanTarget('10.0.0.5')).toThrow()
    expect(isBlockedScanHost('169.254.169.254')).toBe(true)
  })
})
