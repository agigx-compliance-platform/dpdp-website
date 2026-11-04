export type LlmProviderId = 'chatgpt' | 'claude' | 'gemini' | 'perplexity'

export interface LlmProviderConfig {
  id: LlmProviderId
  name: string
  vendor: string
  url: string
  description: string
  accentColor: string
  badgeText?: string
}

export const LLM_PROVIDERS: readonly LlmProviderConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    url: 'https://chatgpt.com/',
    description: 'Discuss with OpenAI ChatGPT',
    accentColor: '#10A37F',
  },
  {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    url: 'https://claude.ai/',
    description: 'Discuss with Anthropic Claude',
    accentColor: '#D97757',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    url: 'https://gemini.google.com/',
    description: 'Discuss with Google Gemini',
    accentColor: '#4E82EE',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    vendor: 'Perplexity AI',
    url: 'https://www.perplexity.ai/',
    description: 'Discuss with Perplexity AI Search',
    accentColor: '#20808D',
  },
] as const

