'use client'

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  CheckCircle2,
  Loader2,
  Globe,
  Brain,
  Cookie,
  Shield,
  FileText,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Scale,
  ArrowLeft,
  Eye,
  HelpCircle,
  Megaphone,
  ArrowUpRight,
} from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import type { AnalysisResult } from '@/lib/privacy-pitstop/types'
import { privacyQualityScore, qualityRatingText } from '@/lib/privacy-pitstop/score-display'
import { ScanProgressLoader } from '@/components/ui/ScanProgressLoader'
import { DiscussWithLlmSection } from '@/components/ui/DiscussWithLlmSection'

/* ─── constants ────────────────────────────────────────────── */

const EXAMPLE_DOMAINS = ['hdfcbank.com', 'zomato.com', 'redbus.in', 'matrimony.com']

const ANALYZE_TIMEOUT_MS = 180_000

type StoredScanDetail = {
  riskScore?: number
  riskRating?: string
  confidenceScore?: number
  coverageScore?: number
  pagesAnalyzed?: number
  summary?: string
  gapReasons?: string[]
  categories?: { id?: string; name?: string; score?: number; evaluated?: boolean; findings?: unknown[] }[]
  complianceFlags?: unknown[]
}

type LeaderboardEntry = { rank: number; domain: string; score: number; detail?: StoredScanDetail | null }

const RISK_RATINGS = ['Low', 'Guarded', 'Elevated', 'High', 'Severe'] as const

function storedDetailToResult(domain: string, qualityScore: number, detail: StoredScanDetail): AnalysisResult {
  const riskScore = Number.isFinite(detail.riskScore) ? Number(detail.riskScore) : 100 - qualityScore
  const rating = RISK_RATINGS.find((item) => item === detail.riskRating) ?? 'Guarded'
  const categories = (detail.categories ?? []).map((category) => ({
    id: category.id,
    name: category.name ?? '',
    score: category.evaluated === false
      ? null
      : Number.isFinite(category.score) ? privacyQualityScore(Number(category.score)) : qualityScore,
    pillarIds: [] as string[],
    findings: category.findings ?? [],
  }))
  const findingCount = categories.reduce((sum, category) => sum + category.findings.length, 0)
  return {
    domain,
    analyzedAt: '',
    riskScore,
    riskRating: rating,
    confidenceScore: Number.isFinite(detail.confidenceScore) ? Number(detail.confidenceScore) : 0,
    coverageScore: Number.isFinite(detail.coverageScore) ? Number(detail.coverageScore) : 0,
    pillars: [],
    categories,
    totalFindings: findingCount,
    pagesAnalyzed: Number.isFinite(detail.pagesAnalyzed) ? Number(detail.pagesAnalyzed) : 0,
    summary: detail.summary ?? '',
    gapReasons: detail.gapReasons,
    complianceFlags: detail.complianceFlags,
  } as AnalysisResult
}

const ANALYSIS_STEPS = [
  { icon: Globe, label: 'Reading public pages' },
  { icon: FileText, label: 'Reading the notice' },
  { icon: Cookie, label: 'Checking cookies and trackers' },
  { icon: BarChart3, label: 'Scoring privacy quality' },
  { icon: Brain, label: 'Preparing the report' },
]

/** Queued scans sit near 12%. Report generation is only the last step, after the job is done. */
function stepForScanProgress(progress: number): number {
  if (!Number.isFinite(progress) || progress < 20) return 0
  if (progress < 45) return 1
  if (progress < 75) return 2
  if (progress < 100) return 3
  return ANALYSIS_STEPS.length - 1
}

/* ─── component ────────────────────────────────────────────── */

type View = 'landing' | 'analyzing' | 'results' | 'error' | 'leaderboard'

function PrivacyPitstopPageInner() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<View>('landing')
  const [domain, setDomain] = useState(() => searchParams.get('q')?.trim() ?? '')
  const [activeStep, setActiveStep] = useState(-1)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [leaderboardError, setLeaderboardError] = useState('')
  const [top5Leaderboard, setTop5Leaderboard] = useState<LeaderboardEntry[]>([])
  const [top5LoserBoard, setTop5LoserBoard] = useState<LeaderboardEntry[]>([])
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const timersRef = useRef<number[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const scannedOrScanningRef = useRef<Set<string>>(new Set())

  const loadLeaderboard = useCallback((retryAttempt = 0) => {
    const fetchLeaderboardData = async () => {
      try {
        const res = await fetch('/api/privacy-pitstop/leaderboard', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error(`Leaderboard failed (${res.status})`)
        }
        return await res.json()
      } catch {
        const { getPitstopLeaderboard } = await import('@/lib/api')
        const { unwrapConsentApiEnvelope } = await import('@/lib/website-scan')
        const directRes = await getPitstopLeaderboard()
        return unwrapConsentApiEnvelope<import('@/lib/api').PitstopLeaderboardResponse>(directRes)
      }
    }

    const mapBoardEntries = (items: unknown, excludedDomains?: Set<string>): LeaderboardEntry[] => {
      if (!Array.isArray(items)) return []
      const mapped: LeaderboardEntry[] = []
      const seen = new Set<string>()
      for (const item of items) {
        if (item?.domain && Number.isFinite(Number(item.score))) {
          const clean = String(item.domain).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
          if (!clean || seen.has(clean) || excludedDomains?.has(clean)) continue
          seen.add(clean)
          const detail = item.detail && typeof item.detail === 'object' ? (item.detail as StoredScanDetail) : null
          mapped.push({
            rank: Number.isFinite(Number(item.rank)) && Number(item.rank) > 0 ? Number(item.rank) : mapped.length + 1,
            domain: clean,
            score: Math.round(Number(item.score)),
            detail,
          })
        }
      }
      return mapped
    }

    fetchLeaderboardData()
      .then((data) => {
        setLeaderboardError('')

        const rawTopSource = Array.isArray(data?.topLeaderboard)
          ? data.topLeaderboard
          : Array.isArray(data?.topGainers)
            ? data.topGainers
            : Array.isArray(data?.entries)
              ? data.entries
              : []

        const rawLoserSource = Array.isArray(data?.loserBoard)
          ? data.loserBoard
          : Array.isArray(data?.topLosers)
            ? data.topLosers
            : []

        const topEntries = mapBoardEntries(rawTopSource)
        const topDomainSet = new Set(topEntries.map((entry) => entry.domain))
        const loserEntries = mapBoardEntries(rawLoserSource, topDomainSet)

        setTop5Leaderboard(topEntries)
        setTop5LoserBoard(loserEntries)
        setBoard(topEntries)
      })
      .catch(() => {
        if (retryAttempt < 2) {
          const retryTimer = window.setTimeout(() => loadLeaderboard(retryAttempt + 1), 3000 * (retryAttempt + 1))
          timersRef.current.push(retryTimer)
          return
        }
        setLeaderboardError('The leaderboard is unavailable right now.')
        setTop5Leaderboard([])
        setTop5LoserBoard([])
        setBoard([])
      })
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')?.trim()
    if (q) queueMicrotask(() => setDomain(q))
  }, [searchParams])

  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  const [scanningLeaderboard, setScanningLeaderboard] = useState<Record<string, boolean>>({})
  const [leaderboardFullResults, setLeaderboardFullResults] = useState<Record<string, AnalysisResult>>({})

  // Clean up timers & fetches
  const cleanup = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const fetchFullScanForDomain = useCallback(async (d: string) => {
    const cleanDomain = d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
    if (!cleanDomain || scannedOrScanningRef.current.has(cleanDomain)) return

    scannedOrScanningRef.current.add(cleanDomain)
    setScanningLeaderboard(prev => ({ ...prev, [cleanDomain]: true }))
    try {
      const res = await fetch('/api/privacy-pitstop/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: cleanDomain }),
      })

      if (!res.ok) return

      const data = await res.json()
      let analysisData: AnalysisResult
      if (data?.scanId) {
        const { pollUntilPitstopReport } = await import('@/lib/website-scan')
        analysisData = await pollUntilPitstopReport(data.scanId)
      } else if (data?.riskScore !== undefined) {
        analysisData = data as AnalysisResult
      } else {
        return
      }

      setLeaderboardFullResults(prev => ({ ...prev, [cleanDomain]: analysisData }))
      loadLeaderboard()
    } catch {
      scannedOrScanningRef.current.delete(cleanDomain)
    } finally {
      setScanningLeaderboard(prev => ({ ...prev, [cleanDomain]: false }))
    }
  }, [loadLeaderboard])

  const startAnalysis = useCallback(async (targetDomain: string) => {
    if (!targetDomain.trim()) return
    cleanup()

    setView('analyzing')
    setActiveStep(0)
    setResult(null)
    setError('')

    const controller = new AbortController()
    abortRef.current = controller
    const timeoutId = window.setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS)
    timersRef.current.push(timeoutId)

    try {
      const res = await fetch('/api/privacy-pitstop/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain.trim() }),
        signal: controller.signal,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Analysis failed (${res.status})`)
      }

      let analysisData: AnalysisResult
      if (data?.scanId) {
        const { pollUntilPitstopReport } = await import('@/lib/website-scan')
        analysisData = await pollUntilPitstopReport(data.scanId, {
          onProgress: (progress) => setActiveStep(stepForScanProgress(progress)),
        })
      } else if (data?.riskScore !== undefined) {
        analysisData = data as AnalysisResult
      } else {
        throw new Error('Invalid response from scan service')
      }

      const cleanDomain = targetDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')

      setLeaderboardFullResults(prev => ({ ...prev, [cleanDomain]: analysisData }))
      loadLeaderboard()

      setActiveStep(ANALYSIS_STEPS.length - 1)
      timersRef.current.push(
        window.setTimeout(() => {
          setResult(analysisData)
          setView('results')
        }, 800)
      )
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setError('The scan timed out. Try again.')
        setView('error')
        return
      }
      setError((err as Error).message || 'Analysis failed')
      setView('error')
    }
  }, [cleanup, loadLeaderboard])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startAnalysis(domain)
  }

  function resetToLanding() {
    cleanup()
    setView('landing')
    setDomain('')
    setActiveStep(-1)
    setResult(null)
    setError('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  /* ─── score color mapping ────────────────────────────────── */
  function getScoreColor(score: number) {
    if (score === 0) return 'text-muted-foreground stroke-muted-foreground'
    if (score >= 80) return 'text-success stroke-success'
    if (score >= 60) return 'text-primary stroke-primary'
    if (score >= 40) return 'text-warning stroke-warning'
    return 'text-destructive stroke-destructive'
  }

  function getBarBgColor(score: number) {
    if (score === 0) return 'bg-muted'
    if (score >= 80) return 'bg-success'
    if (score >= 60) return 'bg-primary'
    if (score >= 40) return 'bg-warning'
    return 'bg-destructive'
  }

  function getRatingText(score: number) {
    if (score === 0) return 'Not scanned'
    return qualityRatingText(score)
  }

  const displayScore = result ? privacyQualityScore(result.riskScore) : 0
  const displayRating = result ? getRatingText(displayScore) : 'Not scanned'

  const getAllFindings = (res: AnalysisResult | null) => {
    if (!res) return []
    const list: any[] = []

    const fromSections = res.report?.sections?.flatMap(s => s.findings) ?? []
    list.push(...fromSections)

    const fromReportCategories = res.report?.categories?.flatMap(c => c.findings) ?? []
    list.push(...fromReportCategories)

    const fromCategories = (res.categories as any[])?.flatMap(c => c.findings ?? []) ?? []
    list.push(...fromCategories)

    const fromPillars = res.pillars?.flatMap(p => p.findings) ?? []
    list.push(...fromPillars)

    const rawFlags = (res as any).complianceFlags || (res.report as any)?.complianceFlags || []
    if (Array.isArray(rawFlags)) {
      for (const flag of rawFlags) {
        if (flag && flag.passed === false) {
          list.push({
            id: flag.id || `flag-${flag.title || 'finding'}-${list.length}`,
            pillarId: flag.pillar || flag.categoryId || 'notice',
            categoryId: flag.categoryId || flag.pillar || 'notice',
            title: flag.title,
            description: flag.description,
            severity: flag.severity || 'high',
            confidence: 'high',
            evidenceItems: [],
            evidence: flag.evidence ? String(flag.evidence) : 'detected',
            details: typeof flag.evidence === 'string' ? flag.evidence : (flag.description || ''),
            recommendation: flag.remediation || flag.description || '',
          })
        }
      }
    }

    const seenKeys = new Set<string>()
    const uniqueFindings: any[] = []
    for (const item of list) {
      if (!item) continue
      const itemKey = item.id ? String(item.id) : (item.title ? String(item.title) : null)
      if (itemKey) {
        if (seenKeys.has(itemKey)) continue
        seenKeys.add(itemKey)
      }
      uniqueFindings.push(item)
    }

    return uniqueFindings
  }

  const SEVERITY_WEIGHT_VAL: Record<string, number> = {
    critical: 10,
    high: 8,
    medium: 5,
    low: 2.5,
    info: 1,
  }

  const CATEGORY_LABEL_MAP: Record<string, string> = {
    notice: 'Privacy Notice',
    consent: 'Consent',
    cookies: 'Cookies',
    rights: 'Rights',
    ai_transparency: 'AI Transparency',
    childrens_privacy: "Children's Privacy",
    security: 'Security',
    P1: 'Privacy Notice',
    P2: 'Consent',
    P3: 'Cookies',
    P4: 'Rights',
    P5: 'AI Transparency',
    P6: "Children's Privacy",
    P7: 'Security',
  }

  const allFindings = getAllFindings(result)

  const gapSummary = (result?.gapReasons && result.gapReasons.length > 0)
    ? result.gapReasons
    : Array.from(new Set(
        allFindings
          .filter(f => f.severity !== 'info')
          .sort((a, b) => (SEVERITY_WEIGHT_VAL[b.severity] || 0) - (SEVERITY_WEIGHT_VAL[a.severity] || 0))
          .map(f => f.title + (f.description ? `: ${f.description}` : ''))
          .filter(Boolean)
      )).slice(0, 5)

  const visitorPlacement = useMemo(() => {
    if (!result?.domain) return null
    const domain = result.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
    if (!domain) return null
    const score = privacyQualityScore(result.riskScore)
    const listedTop = top5Leaderboard.find((item) => item.domain === domain)
    if (listedTop) return { domain, score: listedTop.score, rank: listedTop.rank, listed: true }
    const listedLoser = top5LoserBoard.find((item) => item.domain === domain)
    if (listedLoser) return { domain, score: listedLoser.score, rank: listedLoser.rank, listed: true }
    return { domain, score, rank: null, listed: false }
  }, [top5Leaderboard, top5LoserBoard, result])

  const getCategoryScore = (catName: string) => {
    if (!result) return null
    const match = result.categories.find((c) => c.name === catName)
    return match ? Math.round(match.score) : null
  }

  const scoreRingOffset = 2 * Math.PI * 54 * (1 - (displayScore / 100))
  const hasScanReport = Boolean(result?.summary || result?.report?.executiveSummary || result?.detailedReport || result?.report?.detailedReport)

  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className={`${view === 'results' ? 'pt-24 md:pt-28' : 'pt-32 md:pt-40'} pb-12`}>
        {/* View: Leaderboard */}
        {view === 'leaderboard' ? (
          <motion.div
            key="leaderboardView"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="text-left">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">India Privacy Rankings</h1>
                <p className="text-sm text-muted-foreground mt-1">Top and bottom ranked websites by privacy quality score.</p>
              </div>
              <button
                onClick={() => setView('landing')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-xs font-semibold hover:bg-muted text-primary cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top 5 Leaderboard – India */}
              <div className="ledger-panel p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Top 5 Leaderboard – India</h2>
                </div>
                {top5Leaderboard.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <ShieldCheck className="w-6 h-6 text-primary mx-auto opacity-60" />
                    <p className="text-xs text-muted-foreground">No leaderboard data available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {top5Leaderboard.map((item) => (
                      <div key={item.domain} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary w-6 text-center">{item.rank}</span>
                          <span className="text-sm font-semibold text-foreground">{item.domain}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                          <span className="text-[10px] font-medium text-muted-foreground">({getRatingText(item.score)})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top 5 Loser Board – India */}
              <div className="ledger-panel p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <h2 className="text-base font-semibold text-foreground">Top 5 Loser Board – India</h2>
                </div>
                {top5LoserBoard.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <ShieldCheck className="w-6 h-6 text-warning mx-auto opacity-60" />
                    <p className="text-xs text-muted-foreground">No loser board data available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {top5LoserBoard.map((item) => (
                      <div key={item.domain} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-warning w-6 text-center">{item.rank}</span>
                          <span className="text-sm font-semibold text-foreground">{item.domain}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                          <span className="text-[10px] font-medium text-muted-foreground">({getRatingText(item.score)})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visitor placement */}
            {visitorPlacement && !visitorPlacement.listed && (
              <div className="ledger-panel p-4 flex items-center justify-between border border-warning/30 bg-warning/5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-warning">{visitorPlacement.rank ?? '-'}</span>
                  <span className="text-sm font-semibold text-foreground">{visitorPlacement.domain}</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(visitorPlacement.score)}`}>{visitorPlacement.score}/100</span>
              </div>
            )}
          </motion.div>
        ) : (
          /* View: Scanner */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className={`${view === 'results' ? 'lg:col-span-6' : 'lg:col-span-8'} space-y-6`}>
              {/* Landing Header & Input Form */}
              {view !== 'results' && (
                <>
                  {/* Title Block */}
                  <div className="text-left max-w-2xl space-y-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Public scan
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                      Privacy Pitstop
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      A public-page scan of notice, consent, cookies, rights, children&apos;s
                      data, and transport security. Values from behind a login are not requested.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Findings become questions, a grievance draft, and a complaint pack.
                    </p>
                  </div>

                  {/* Form Input Section */}
                  <div className="ledger-panel p-2 sm:p-2.5 flex items-center gap-2 rounded-2xl">
                    <div className="pl-3 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter a website URL"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-0 text-sm py-2.5 px-1 focus:outline-none placeholder-muted-foreground text-foreground"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={!domain.trim() || view === 'analyzing'}
                        className="shrink-0"
                      >
                        {view === 'analyzing' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          'Start Free Scan'
                        )}
                      </Button>
                    </form>
                  </div>

                  {/* Try Examples */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>Try examples:</span>
                    <div className="flex flex-wrap gap-2">
                      {EXAMPLE_DOMAINS.map((d) => (
                        <button
                          key={d}
                          onClick={() => { setDomain(d); startAnalysis(d) }}
                          className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer text-xs"
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Main Content Area */}
              <AnimatePresence mode="wait">
                {view === 'analyzing' ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ScanProgressLoader
                      domain={domain}
                      activeStep={activeStep}
                      steps={ANALYSIS_STEPS}
                    />
                  </motion.div>
                ) : view === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ledger-panel p-8 text-center"
                  >
                    <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
                    <p className="text-sm font-semibold text-foreground">Scan failed</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">{error}</p>
                    <Button variant="secondary" size="sm" onClick={resetToLanding}>
                      Reset
                    </Button>
                  </motion.div>
                ) : view === 'results' && result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Top Action Bar in Results */}
                    <div className="flex items-center justify-between border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          Public scan
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-sm font-bold text-foreground">{result.domain}</span>
                      </div>
                      <Button
                        onClick={resetToLanding}
                        variant="secondary"
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Scan Another
                      </Button>
                    </div>

                    {/* ── Section 1: Privacy Score Summary ──────────── */}
                    <div className="ledger-panel p-6 md:p-8">
                      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-5">Overall privacy score</p>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        {/* Score Ring */}
                        <div className="md:col-span-5 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 pr-0 md:pr-8">
                          <div className="relative w-36 h-36">
                            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                              <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                              <circle
                                cx="60" cy="60" r="54" fill="none" strokeWidth="6" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 54}
                                strokeDashoffset={scoreRingOffset}
                                className={`transition-all duration-1000 ${getScoreColor(displayScore)}`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ShieldCheck className={`w-5 h-5 mb-1 ${getScoreColor(displayScore)}`} />
                              <div className="text-3xl font-bold text-foreground leading-none">{displayScore}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">/100</div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className={`text-sm font-semibold uppercase tracking-wider ${getScoreColor(displayScore)}`}>
                              {displayRating}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Public pages only. Not a Board finding.</p>
                          </div>
                        </div>

                        {/* Category bars */}
                        <div className="md:col-span-7 space-y-3 text-left">
                          {/* report.categories carry category RISK (0 = clean); the fallback
                              categories from stored leaderboard detail are already quality. Bars show
                              quality, like the overall score. */}
                          {(result?.report?.categories
                            ? result.report.categories.map((c) => ({
                                ...c,
                                score: c.evaluated === false || !Number.isFinite(c.score) ? null : privacyQualityScore(c.score),
                              }))
                            : result?.categories ?? []
                          ).map((cat) => {
                            const iconMap: Record<string, any> = {
                              notice: FileText,
                              consent: ShieldCheck,
                              cookies: Cookie,
                              rights: Scale,
                              ai_transparency: Brain,
                              childrens_privacy: HelpCircle,
                              security: Shield,
                            }
                            const catId = 'id' in cat ? String(cat.id) : cat.name
                            const IconComp = iconMap[catId] || FileText
                            const score = typeof cat.score === 'number' && Number.isFinite(cat.score) ? Math.round(cat.score) : null
                            return (
                              <div key={cat.name} className="space-y-1">
                                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <IconComp className="w-3 h-3 text-primary/60" />
                                    <span>{cat.name}</span>
                                  </div>
                                  <span className="text-foreground font-bold">{score == null ? 'Not scanned' : `${score}/100`}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${getBarBgColor(score ?? 0)}`} style={{ width: `${score ?? 0}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ── Discuss this page with an LLM ──────────── */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <DiscussWithLlmSection targetUrl={result.domain || domain} />
                    </motion.div>

                    {/* ── Score Justification & Scan Report (Side-by-Side) ──────── */}
                    <div className={`grid grid-cols-1 ${hasScanReport ? 'md:grid-cols-2' : ''} gap-4 items-stretch`}>
                      {/* Score Justification */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="ledger-panel p-5 md:p-6 space-y-4 text-left border-l-4 border-l-primary flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-border/70 pb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              <h3 className="text-sm font-bold text-foreground">Score Justification ({displayScore}/100)</h3>
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                              Evidence
                            </span>
                          </div>

                          {displayScore === 100 ? (
                            <div className="space-y-3 bg-success/10 p-4 rounded-xl border border-success/30">
                              <div className="flex items-center gap-2 text-success font-semibold text-xs sm:text-sm">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>Privacy quality 100/100 on this scan</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                The detectors that ran recorded no deductions. That is not a Board finding or legal advice.
                              </p>
                              <ul className="space-y-1.5 text-xs text-foreground">
                                <li className="flex items-center gap-2 bg-card/80 p-2 rounded-lg border border-border/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                                  <span>Privacy notice published and reachable</span>
                                </li>
                                <li className="flex items-center gap-2 bg-card/80 p-2 rounded-lg border border-border/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                                  <span>{result?.consentBannerPresent ? 'Cookie consent banner present' : 'No pre-consent trackers detected'}</span>
                                </li>
                                <li className="flex items-center gap-2 bg-card/80 p-2 rounded-lg border border-border/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                                  <span>No third-party tracking scripts found</span>
                                </li>
                                <li className="flex items-center gap-2 bg-card/80 p-2 rounded-lg border border-border/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                                  <span>HTTPS in use on scanned pages</span>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <div className="space-y-2.5 bg-warning/10 p-4 rounded-xl border border-warning/30">
                              <div className="flex items-center gap-2 text-warning font-semibold text-xs sm:text-sm">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>Why this score ({displayScore}/100)</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Deductions on this public scan came from the factors below.
                              </p>
                              <ul className="space-y-1.5 text-xs text-foreground">
                                {gapSummary.slice(0, 4).map((gap, idx) => (
                                  <li key={idx} className="flex items-start gap-2 bg-card/80 p-2 rounded-lg border border-border/60">
                                    <span className="text-warning font-semibold">•</span>
                                    <span className="leading-snug text-xs">{gap}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Scan Report */}
                      {hasScanReport && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.14 }}
                          className="ledger-panel p-5 md:p-6 space-y-4 text-left border-l-4 border-l-primary/60 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-border/70 pb-3">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary shrink-0" />
                                <h3 className="text-sm font-bold text-foreground">Scan Report</h3>
                              </div>
                              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                                Public pages
                              </span>
                            </div>

                            {/* Executive Summary */}
                            <div className="space-y-1.5">
                              <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Executive Summary</h4>
                              <p className="text-xs text-foreground/90 leading-relaxed font-medium bg-muted/30 p-3.5 rounded-xl border border-border/70">
                                {result?.report?.executiveSummary || result?.summary}
                              </p>
                            </div>

                            {/* Detailed Prose Report */}
                            {(result?.detailedReport || result?.report?.detailedReport) && (
                              <div className="space-y-1.5 pt-2 border-t border-border/60">
                                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Technical Assessment (DPDP Act 2023)</h4>
                                <div className="text-[11px] text-muted-foreground leading-relaxed space-y-2 font-normal whitespace-pre-line bg-card/60 p-3.5 rounded-xl border border-border/80 max-h-48 overflow-y-auto">
                                  {result?.detailedReport || result?.report?.detailedReport}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* ── Scan Another CTA ──────────────────────────── */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                      className="pt-2"
                    >
                      <Button
                        onClick={resetToLanding}
                        variant="primary"
                        className="w-full"
                      >
                        <Search className="w-4 h-4" />
                        Scan Another Website
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {view !== 'results' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {[
                    {
                      title: 'Cookie and consent',
                      desc: 'Public banners, reject paths, and what loads before a choice.',
                      icon: Cookie
                    },
                    {
                      title: 'Rights and grievance',
                      desc: 'Notice of how to ask, complain, and reach the grievance officer.',
                      icon: Scale
                    },
                    {
                      title: 'Public ranking',
                      desc: 'Scores from the same public scan, listed for comparison.',
                      icon: Globe
                    },
                  ].map((c) => (
                    <div key={c.title} className="ledger-panel p-4 space-y-2">
                      <c.icon className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">{c.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Middle Column: Your Privacy Action Journey (only on results) */}
            {view === 'results' && result && (
            <div className="lg:col-span-3 ledger-panel p-5 space-y-0">
              <div className="flex items-center gap-2 mb-5 border-b border-border pb-3">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground tracking-wide">Your Privacy Action Journey</h3>
              </div>

              <div className="relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

                <div className="space-y-4">
                  {[
                    { step: 1, icon: Search, title: 'Scan', desc: 'Public pages only. No login, no private APIs.' },
                    { step: 2, icon: Eye, title: 'Understand', desc: 'Privacy quality score, category bars, and gap reasons from the scan.' },
                    { step: 3, icon: HelpCircle, title: 'Question', desc: 'Ask the fiduciary about notice, consent, retention, and AI use.' },
                    { step: 4, icon: AlertTriangle, title: 'Grieve', desc: 'Raise a privacy grievance using the generated draft.' },
                    { step: 5, icon: BarChart3, title: 'Track', desc: 'Keep the follow-up template until a response arrives.' },
                    { step: 6, icon: ArrowUpRight, title: 'Escalate', desc: 'Use the complaint pack if the grievance stays unresolved.' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 relative">
                      <div className="z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-[11px] font-semibold text-foreground">
                        {item.step}
                      </div>
                      <div className="pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <item.icon className="w-3.5 h-3.5 text-primary" />
                          <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 pt-3 border-t border-border">
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-primary/5 border border-border">
                  <Megaphone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-primary leading-tight">Section 13 grievance, then Board complaint if unanswered.</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">The drafts below cite only what this public scan recorded.</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Right Column */}
            <div className={`${view === 'results' ? 'lg:col-span-3' : 'lg:col-span-4'} ledger-panel p-5 space-y-5`}>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-foreground leading-none">India Privacy Rankings</h3>
                  {leaderboardError ? (
                    <p className="mt-2 text-xs text-destructive">{leaderboardError}</p>
                  ) : null}
                  <span className="text-xs text-muted-foreground tracking-tight mt-1 inline-block">
                    Top 5 &amp; Bottom 5 by privacy quality
                  </span>
                </div>
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Top 5
                </span>
              </div>

              {top5Leaderboard.length === 0 && top5LoserBoard.length === 0 ? (
                <div className="py-4 text-center space-y-1">
                  <p className="text-xs text-muted-foreground italic">Rankings are not available yet.</p>
                </div>
              ) : (
                <div className="space-y-1.5 text-left">
                  {top5Leaderboard.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Top 5 Leaderboard
                      </p>
                      {top5Leaderboard.map((item) => (
                        <div key={item.domain} className="flex items-center justify-between text-xs py-1 hover:bg-muted px-2 rounded-md transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground w-4 text-xs">{item.rank}</span>
                            <span className="font-semibold text-muted-foreground hover:text-foreground transition-colors">
                              {item.domain}
                            </span>
                          </div>
                          <span className="font-bold text-foreground text-sm">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {top5LoserBoard.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-warning">
                        Top 5 Loser Board
                      </p>
                      {top5LoserBoard.map((item) => (
                        <div key={item.domain} className="flex items-center justify-between text-xs py-1 hover:bg-muted px-2 rounded-md transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground w-4 text-xs">{item.rank}</span>
                            <span className="font-semibold text-muted-foreground hover:text-foreground transition-colors">
                              {item.domain}
                            </span>
                          </div>
                          <span className="font-bold text-foreground text-sm">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {visitorPlacement && !visitorPlacement.listed ? (
                    <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md border border-warning/30 bg-warning/5">
                      <div className="flex items-center gap-3">
                        <span className="text-warning w-4 text-xs">{visitorPlacement.rank ?? '-'}</span>
                        <span className="font-semibold text-foreground">{visitorPlacement.domain}</span>
                      </div>
                      <span className="font-bold text-foreground text-sm">{visitorPlacement.score}</span>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  onClick={() => setView('leaderboard')}
                  className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
                >
                  View full leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  )
}

export default function PrivacyPitstopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PrivacyPitstopPageInner />
    </Suspense>
  )
}
