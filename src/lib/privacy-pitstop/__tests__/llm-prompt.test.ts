import { describe, it, expect } from 'vitest'
import {
  generateLlmPrompt,
  normalizeTargetUrlForPrompt,
  GENERIC_DPDP_LLM_PROMPT_TEMPLATE,
} from '../llm-prompt'

describe('llm-prompt', () => {
  it('normalizes URLs correctly', () => {
    expect(normalizeTargetUrlForPrompt('https://example.com/')).toBe('https://example.com/')
    expect(normalizeTargetUrlForPrompt('http://example.com')).toBe('http://example.com')
    expect(normalizeTargetUrlForPrompt('hdfcbank.com')).toBe('https://hdfcbank.com')
    expect(normalizeTargetUrlForPrompt('   ')).toBe('https://example.com')
  })

  it('substitutes only the user-entered URL into the prompt', () => {
    const url = 'https://flipkart.com'
    const prompt = generateLlmPrompt(url)

    expect(prompt).toContain('WEBSITE URL:\nhttps://flipkart.com')
    expect(prompt).not.toContain('{{CURRENT_USER_ENTERED_URL}}')
  })

  it('contains all 10 task items and DPDP guidelines', () => {
    const prompt = generateLlmPrompt('https://zomato.com')

    expect(prompt).toContain('@Web search')
    expect(prompt).toContain('1. Visit and analyse the supplied website.')
    expect(prompt).toContain('2. Explain what the Digital Personal Data Protection (DPDP) Act, 2023 is')
    expect(prompt).toContain('3. Explain what a DPDP readiness score represents')
    expect(prompt).toContain('4. Independently evaluate the website against relevant DPDP requirements')
    expect(prompt).toContain('5. Explain how DPDP readiness scores are generally evaluated')
    expect(prompt).toContain('6. Explain what factors could result in a higher or lower privacy readiness score')
    expect(prompt).toContain('7. Identify potential compliance gaps, strengths and areas requiring further investigation.')
    expect(prompt).toContain('8. Explain why businesses should improve their DPDP readiness')
    expect(prompt).toContain('9. Provide practical recommendations to improve privacy readiness')
    expect(prompt).toContain('10. Explain what additional information would be needed')
    expect(prompt).toContain('Book a DPDP clarity call with our experts at https://dpdpconsultancy.in/')
  })

  it('contains zero hardcoded website mentions (e.g., Hotstar)', () => {
    const template = GENERIC_DPDP_LLM_PROMPT_TEMPLATE.toLowerCase()
    expect(template).not.toContain('hotstar')
    expect(template).not.toContain('disney')
  })
})

