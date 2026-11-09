import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  maskEmail,
  extractBreachNames,
  isNotFoundResponse,
} from '../email-breach'

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com').valid).toBe(true)
    expect(validateEmail('john.doe@company.co.in').valid).toBe(true)
    expect(validateEmail('test+alias@domain.org').valid).toBe(true)
    expect(validateEmail('  alice@sub.domain.com  ').valid).toBe(true)
    expect(validateEmail('  alice@sub.domain.com  ').email).toBe('alice@sub.domain.com')
  })

  it('rejects empty or whitespace-only inputs', () => {
    expect(validateEmail('').valid).toBe(false)
    expect(validateEmail('   ').valid).toBe(false)
    expect(validateEmail(null).valid).toBe(false)
  })

  it('rejects URLs', () => {
    expect(validateEmail('https://example.com').valid).toBe(false)
    expect(validateEmail('http://example.com/test').valid).toBe(false)
    expect(validateEmail('www.google.com').valid).toBe(false)
  })

  it('rejects phone numbers', () => {
    expect(validateEmail('+919876543210').valid).toBe(false)
    expect(validateEmail('9876543210').valid).toBe(false)
    expect(validateEmail('123-456-7890').valid).toBe(false)
  })

  it('rejects arbitrary text, names, and missing components', () => {
    expect(validateEmail('john doe').valid).toBe(false)
    expect(validateEmail('plainaddress').valid).toBe(false)
    expect(validateEmail('@missingusername.com').valid).toBe(false)
    expect(validateEmail('username@.com').valid).toBe(false)
    expect(validateEmail('username@domain').valid).toBe(false)
    expect(validateEmail('username@domain.c').valid).toBe(false)
    expect(validateEmail('user@domain..com').valid).toBe(false)
  })
})

describe('maskEmail', () => {
  it('masks local part while preserving domain', () => {
    expect(maskEmail('karthik@example.com')).toBe('k*****k@example.com')
    expect(maskEmail('ab@domain.com')).toBe('a***@domain.com')
  })
})

describe('extractBreachNames', () => {
  it('handles XposedOrNot 2D array format', () => {
    const raw = {
      breaches: [['Adobe', 'Canva', 'LinkedIn']],
    }
    expect(extractBreachNames(raw)).toEqual(['Adobe', 'Canva', 'LinkedIn'])
  })

  it('handles flat array format', () => {
    const raw = {
      breaches: ['Adobe', 'Dropbox'],
    }
    expect(extractBreachNames(raw)).toEqual(['Adobe', 'Dropbox'])
  })

  it('returns empty array when no breaches', () => {
    expect(extractBreachNames(null)).toEqual([])
    expect(extractBreachNames({})).toEqual([])
    expect(extractBreachNames({ breaches: [] })).toEqual([])
  })
})

describe('isNotFoundResponse', () => {
  it('identifies not found response payloads correctly', () => {
    expect(isNotFoundResponse({ Error: 'Not found' })).toBe(true)
    expect(isNotFoundResponse({ status: 'Not found' })).toBe(true)
    expect(isNotFoundResponse({ status: 'unknown' })).toBe(true)
    expect(isNotFoundResponse({ breaches: [['Adobe']] })).toBe(false)
  })
})

