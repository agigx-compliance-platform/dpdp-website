'use client'

import React, { useState, useCallback } from 'react'
import { Copy, Check, ExternalLink, Sparkles, MessageSquare } from 'lucide-react'
import { LLM_PROVIDERS, type LlmProviderConfig } from '@/lib/privacy-pitstop/llm-providers'
import { generateLlmPrompt } from '@/lib/privacy-pitstop/llm-prompt'

interface DiscussWithLlmSectionProps {
  targetUrl: string
  className?: string
}

function ProviderLogo({ id, className = 'w-5 h-5' }: { id: string; className?: string }) {
  switch (id) {
    case 'chatgpt':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.6818zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.407 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.6648zm-12.641 4.135l-2.02-1.1639a.0804.0804 0 0 1-.038-.052V6.0669a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L6.205 5.4519a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3655l2.6024-1.5003 2.607 1.5003v2.9961l-2.607 1.505-2.6024-1.505z" />
        </svg>
      )
    case 'claude':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )
    case 'gemini':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.373 5.627-12 12-12-6.373 0-12-5.373-12-12z" />
        </svg>
      )
    case 'perplexity':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    default:
      return <MessageSquare className={className} />
  }
}

export function DiscussWithLlmSection({ targetUrl, className = '' }: DiscussWithLlmSectionProps) {
  const [copied, setCopied] = useState(false)
  const [activeProviderName, setActiveProviderName] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleCopyPrompt = useCallback(async () => {
    try {
      const prompt = generateLlmPrompt(targetUrl)
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setToastMessage('DPDP prompt copied to clipboard! Paste it into your preferred LLM.')
      setTimeout(() => setCopied(false), 2500)
      setTimeout(() => setToastMessage(null), 4000)
    } catch {
      setToastMessage('Could not copy automatically. Please select and copy manually.')
      setTimeout(() => setToastMessage(null), 3500)
    }
  }, [targetUrl])

  const handleProviderClick = useCallback(async (provider: LlmProviderConfig) => {
    try {
      const prompt = generateLlmPrompt(targetUrl)
      await navigator.clipboard.writeText(prompt)
      setActiveProviderName(provider.name)
      setCopied(true)
      setToastMessage(`Prompt copied! Opening ${provider.name}. Paste the prompt (⌘V / Ctrl+V) to start the discussion.`)
      setTimeout(() => setCopied(false), 2500)
      setTimeout(() => setActiveProviderName(null), 3000)
      setTimeout(() => setToastMessage(null), 5000)

      window.open(provider.url, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(provider.url, '_blank', 'noopener,noreferrer')
    }
  }, [targetUrl])

  return (
    <section
      aria-label="Discuss this page with an LLM"
      className={`ledger-panel p-5 md:p-6 space-y-4 rounded-2xl border border-primary/25 bg-card/70 shadow-sm transition-all ${className}`}
    >
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3.5 border-b border-border/70 pb-4">
        <div className="space-y-1 text-left max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Discuss this page with an LLM
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Understand your DPDP readiness score, discover potential compliance gaps and explore what you can do to improve your privacy posture.
          </p>
        </div>

        {/* Prominent Copy Prompt Button */}
        <button
          onClick={handleCopyPrompt}
          type="button"
          aria-label="Copy DPDP analysis prompt to clipboard"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-[0.98] shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-success" />
              <span>Prompt Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Provider Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-0.5">
        {LLM_PROVIDERS.map((provider) => {
          const isActive = activeProviderName === provider.name
          return (
            <button
              key={provider.id}
              onClick={() => handleProviderClick(provider)}
              type="button"
              className={`group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border bg-card/90 hover:bg-muted/70 transition-all cursor-pointer text-center space-y-2 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                isActive
                  ? 'border-primary shadow-sm bg-primary/5 ring-1 ring-primary/40'
                  : 'border-border/80 hover:border-primary/40'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${provider.accentColor}15`,
                  color: provider.accentColor,
                }}
              >
                <ProviderLogo id={provider.id} className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {provider.name}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-muted-foreground opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {provider.vendor}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Dynamic Toast / Paste Instruction Notification */}
      {toastMessage && (
        <div className="p-2.5 sm:p-3 rounded-xl border border-primary/30 bg-primary/5 text-xs text-foreground flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Check className="w-4 h-4 text-success shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}
    </section>
  )
}
