'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Lock,
  KeyRound,
  ExternalLink,
  Calendar,
  Layers,
  Database,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { validateEmail, type EmailBreachResult } from '@/lib/privacy-pitstop/email-breach'

interface EmailBreachCheckSectionProps {
  className?: string
}

type CheckState = 'idle' | 'loading' | 'success' | 'error'

export function EmailBreachCheckSection({ className = '' }: EmailBreachCheckSectionProps) {
  const [emailInput, setEmailInput] = useState('')
  const [hasConsented, setHasConsented] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null)
  const [state, setState] = useState<CheckState>('idle')
  const [result, setResult] = useState<EmailBreachResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Real-time or blur validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmailInput(val)
    if (inputError) {
      // Clear error as user types once it has minimal structure
      if (val.trim().length === 0 || val.includes('@')) {
        setInputError(null)
      }
    }
  }

  const handleBlur = () => {
    const trimmed = emailInput.trim()
    if (trimmed.length > 0) {
      const validation = validateEmail(trimmed)
      if (!validation.valid) {
        setInputError(validation.error || 'Please enter a valid email address')
      } else {
        setInputError(null)
      }
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (state === 'loading') return

      const trimmed = emailInput.trim()
      const validation = validateEmail(trimmed)

      if (!validation.valid || !validation.email) {
        setInputError(validation.error || 'Please enter a valid email address')
        inputRef.current?.focus()
        return
      }

      if (!hasConsented) {
        setInputError('Please consent to the breach verification check before proceeding.')
        return
      }

      setInputError(null)
      setState('loading')
      setErrorMessage(null)

      try {
        const response = await fetch('/api/privacy-pitstop/breach-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: validation.email,
            consent: true,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || `Request failed with status ${response.status}`)
        }

        setResult(data as EmailBreachResult)
        setState('success')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to check data breaches. Please try again.'
        setErrorMessage(msg)
        setState('error')
      }
    },
    [emailInput, hasConsented, state]
  )

  const handleReset = () => {
    setEmailInput('')
    setInputError(null)
    setState('idle')
    setResult(null)
    setErrorMessage(null)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const isFormValid = emailInput.trim().length > 0 && hasConsented && !inputError

  return (
    <section
      aria-label="Email Data Breach Check"
      className={`ledger-panel p-5 md:p-6 space-y-5 rounded-2xl border border-primary/25 bg-card/75 shadow-sm transition-all text-left ${className}`}
    >
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-border/70 pb-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Email Data Breach Check
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Check whether your email address has appeared in known public data breaches.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === 'idle' || state === 'loading' ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    ref={inputRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={state === 'loading'}
                    aria-label="Email address"
                    aria-invalid={!!inputError}
                    aria-describedby={inputError ? 'email-input-error' : undefined}
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-background border ${
                      inputError ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'
                    } focus:outline-none focus:ring-1 placeholder-muted-foreground text-foreground transition-all disabled:opacity-60`}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isFormValid || state === 'loading'}
                  className="sm:w-auto shrink-0 h-[42px] px-5"
                >
                  {state === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Checking Breaches...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Check Email
                    </>
                  )}
                </Button>
              </div>

              {/* Validation error message */}
              {inputError && (
                <p id="email-input-error" className="text-xs text-destructive flex items-center gap-1.5 pt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{inputError}</span>
                </p>
              )}

              {/* Mandatory User Notice & Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground select-none">
                  <input
                    type="checkbox"
                    checked={hasConsented}
                    onChange={(e) => {
                      setHasConsented(e.target.checked)
                      if (e.target.checked && inputError?.includes('consent')) {
                        setInputError(null)
                      }
                    }}
                    disabled={state === 'loading'}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span className="leading-relaxed">
                    I consent to checking this email address against known public data breaches.
                    <span className="text-foreground font-medium"> We do not store, log, or share your email address.</span>
                  </span>
                </label>
              </div>
            </form>
          </motion.div>
        ) : state === 'error' ? (
          <motion.div
            key="error-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3"
          >
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Breach Verification Error</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              {errorMessage || 'Unable to retrieve breach records at this time.'}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Try Again
              </Button>
              <Button size="sm" variant="ghost" onClick={handleReset}>
                Check another email
              </Button>
            </div>
          </motion.div>
        ) : state === 'success' && result ? (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {result.breached ? (
              /* Breached State */
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/15 text-destructive shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-destructive uppercase tracking-wide">
                        Breach Exposure Detected
                      </span>
                      <span className="bg-destructive/20 text-destructive text-[11px] font-bold px-2 py-0.5 rounded-full border border-destructive/30">
                        {result.count} {result.count === 1 ? 'incident' : 'incidents'}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      This email address was found in <span className="font-semibold">{result.count}</span> known data breach {result.count === 1 ? 'record' : 'records'}.
                    </p>
                  </div>
                </div>

                {/* Breached Services & Datasets List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>Breached Services &amp; Datasets ({result.breaches.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {result.breaches.map((breach, idx) => (
                      <div
                        key={`${breach.name}-${idx}`}
                        className="p-3.5 rounded-xl border border-border/80 bg-background/60 space-y-2 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-sm font-bold text-foreground block">
                              {breach.name}
                            </span>
                            {breach.domain && (
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {breach.domain}
                              </span>
                            )}
                          </div>
                          {breach.breachedDate && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border shrink-0">
                              <Calendar className="w-2.5 h-2.5 text-primary" />
                              {breach.breachedDate}
                            </span>
                          )}
                        </div>

                        {breach.exposedData && breach.exposedData.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                              Exposed data categories:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {breach.exposedData.map((dataCategory, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="text-[10px] bg-destructive/10 text-destructive border border-destructive/20 px-1.5 py-0.5 rounded font-medium"
                                >
                                  {dataCategory}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Account Protection Recommendations */}
                <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 space-y-2.5">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Recommended Account Protection Actions</span>
                  </div>
                  <ul className="text-xs text-foreground/90 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Change passwords immediately:</strong> Update passwords on all breached services and anywhere you used the same or similar passwords.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Enable Two-Factor Authentication (2FA):</strong> Secure your primary email account, financial portals, and sensitive services with an authenticator app.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Watch for phishing scams:</strong> Attackers often use leaked breach details to craft convincing spear-phishing emails or SMS messages.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Database className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Exercise DPDP Act 2023 rights:</strong> Under Section 12 of the Indian DPDP Act, you have the right to request erasure or correction of your personal data from data fiduciaries.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Clean / No Breaches Found State */
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-emerald-500 uppercase tracking-wide block">
                      No Breaches Found
                    </span>
                    {/* Exact copy mandated by requirement */}
                    <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                      No matching breaches were found in the XposedOrNot database. This does not guarantee that your email address has never been exposed.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 text-xs text-muted-foreground space-y-1.5">
                  <span className="font-semibold text-foreground text-xs block">Best Practices to Keep Your Email Secure:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                    <li>Use a unique, long passphrase for your primary email account.</li>
                    <li>Always enable two-step verification (2SV / 2FA).</li>
                    <li>Never click suspicious links or download attachments from unknown senders.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-border/70">
              <span className="text-[11px] text-muted-foreground font-mono">
                Checked: {result.emailMasked}
              </span>
              <Button size="sm" variant="secondary" onClick={handleReset}>
                <RefreshCw className="w-3 h-3 mr-1.5" />
                Check Another Email
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

