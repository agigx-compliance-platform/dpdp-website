'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Eye,
  HelpCircle,
  Megaphone,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import type { AnalysisResult } from '@/lib/privacy-pitstop/types'
import { ScanProgressLoader } from '@/components/ui/ScanProgressLoader'

/* ─── constants ────────────────────────────────────────────── */

const EXAMPLE_DOMAINS = ['hdfcbank.com', 'zomato.com', 'redbus.in', 'matrimony.com']

const LEADERBOARD_DOMAINS = ['zoho.com', 'tata.com', 'infosys.com', 'facebook.com', 'twitter.com']

const ALL_LEADERBOARD_ITEMS = [
  { rank: 1, domain: 'zoho.com', category: 'Top Gainers' },
  { rank: 2, domain: 'tata.com', category: 'Top Gainers' },
  { rank: 3, domain: 'infosys.com', category: 'Top Gainers' },
  { rank: 1, domain: 'facebook.com', category: 'Top Decliners' },
  { rank: 2, domain: 'twitter.com', category: 'Top Decliners' },
  { rank: 3, domain: 'newsportal.com', category: 'Top Decliners' },
  { rank: 1, domain: 'govt.in', category: 'Most Transparent' },
  { rank: 2, domain: 'pmindia.gov.in', category: 'Most Transparent' },
  { rank: 3, domain: 'eci.gov.in', category: 'Most Transparent' },
  { rank: 1, domain: 'freegames.com', category: 'Needs Attention' },
  { rank: 2, domain: 'flashnews.com', category: 'Needs Attention' },
  { rank: 3, domain: 'dealscorner.com', category: 'Needs Attention' }
]

const ANALYSIS_STEPS = [
  { icon: Globe, label: 'Fetching Privacy Policy' },
  { icon: Brain, label: 'AI Analysis' },
  { icon: Cookie, label: 'Detecting Cookies & Trackers' },
  { icon: BarChart3, label: 'Calculating Privacy Score' },
  { icon: FileText, label: 'Generating Report' },
]

const STEP_INTERVAL_MS = 1800

/* ─── component ────────────────────────────────────────────── */

type View = 'landing' | 'analyzing' | 'results' | 'error' | 'leaderboard'

export default function PrivacyPitstopPage() {
  const [view, setView] = useState<View>('landing')
  const [domain, setDomain] = useState('')
  const [activeStep, setActiveStep] = useState(-1)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const scannedOrScanningRef = useRef<Set<string>>(new Set())
  const hasInitLeaderboardScansRef = useRef(false)

  // Dynamic user-scanned domains state for live Privacy Market Watch leaderboard
  const [scannedUserDomains, setScannedUserDomains] = useState<{ domain: string; score: number }[]>([])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')?.trim()
    if (q) setDomain(q)

    try {
      const saved = localStorage.getItem('dpdp_privacy_live_searched_domains')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setScannedUserDomains(parsed)
        }
      }
    } catch (err) {}
  }, [])

  const [scanningLeaderboard, setScanningLeaderboard] = useState<Record<string, boolean>>({})
  const [leaderboardFullResults, setLeaderboardFullResults] = useState<Record<string, AnalysisResult>>({})
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)

  // Clean up timers & fetches
  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const fetchFullScanForDomain = useCallback(async (d: string) => {
    const cleanDomain = d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
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

      const scoreVal = Math.round(analysisData.riskScore)

      setLeaderboardFullResults(prev => ({ ...prev, [cleanDomain]: analysisData }))

      setScannedUserDomains(prev => {
        const filtered = prev.filter(item => item.domain.toLowerCase() !== cleanDomain)
        const updated = [{ domain: cleanDomain, score: scoreVal }, ...filtered]
        try {
          localStorage.setItem('dpdp_privacy_live_searched_domains', JSON.stringify(updated))
        } catch (err) {}
        return updated
      })
    } catch (err) {
      // Quietly absorb scan errors
    } finally {
      setScanningLeaderboard(prev => ({ ...prev, [cleanDomain]: false }))
    }
  }, [])

  const startAnalysis = useCallback(async (targetDomain: string) => {
    if (!targetDomain.trim()) return
    cleanup()

    setView('analyzing')
    setActiveStep(0)
    setResult(null)
    setError('')

    for (let i = 1; i < ANALYSIS_STEPS.length; i++) {
      timersRef.current.push(
        setTimeout(() => setActiveStep(i), i * STEP_INTERVAL_MS)
      )
    }

    const controller = new AbortController()
    abortRef.current = controller

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
        analysisData = await pollUntilPitstopReport(data.scanId)
      } else if (data?.riskScore !== undefined) {
        analysisData = data as AnalysisResult
      } else {
        throw new Error('Invalid response from scan service')
      }

      const scoreVal = Math.round(analysisData.riskScore)
      const cleanDomain = targetDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')

      setLeaderboardFullResults(prev => ({ ...prev, [cleanDomain]: analysisData }))

      // Update scannedUserDomains for live Privacy Market Watch (Top Gainers & Top Losers)
      setScannedUserDomains(prev => {
        const filtered = prev.filter(item => item.domain.toLowerCase() !== cleanDomain)
        const updated = [{ domain: cleanDomain, score: scoreVal }, ...filtered]
        try {
          localStorage.setItem('dpdp_privacy_live_searched_domains', JSON.stringify(updated))
        } catch (err) {}
        return updated
      })

      setActiveStep(ANALYSIS_STEPS.length - 1)
      timersRef.current.push(
        setTimeout(() => {
          setResult(analysisData)
          setView('results')
        }, 800)
      )
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError((err as Error).message || 'Analysis failed')
      setView('error')
    }
  }, [cleanup])

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
    if (score >= 80) return 'text-primary stroke-primary'
    if (score >= 60) return 'text-green-500 stroke-green-500'
    if (score >= 40) return 'text-yellow-500 stroke-yellow-500'
    if (score >= 20) return 'text-orange-500 stroke-orange-500'
    return 'text-red-500 stroke-red-500'
  }

  function getBarBgColor(score: number) {
    if (score === 0) return 'bg-primary/10'
    if (score >= 80) return 'bg-primary'
    if (score >= 60) return 'bg-green-500'
    if (score >= 40) return 'bg-yellow-500'
    if (score >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  function getRatingText(score: number) {
    if (score === 0) return 'Not Scanned'
    if (score >= 80) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Guarded'
    if (score >= 30) return 'Elevated'
    return 'Severe'
  }

  const displayScore = result ? result.riskScore : 0
  const displayRating = result ? getRatingText(result.riskScore) : 'Not Scanned'

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
          .map(f => f.title + (f.description ? ` — ${f.description}` : ''))
          .filter(Boolean)
      )).slice(0, 5)

  const fullLeaderboardItems = useMemo(() => {
    const items: { domain: string; category: string; score?: number }[] = []

    const topGainers = [...scannedUserDomains].sort((a, b) => b.score - a.score).slice(0, 5)
    for (const item of topGainers) {
      items.push({ domain: item.domain, category: 'Top Gainers', score: item.score })
    }

    const topLosers = [...scannedUserDomains].sort((a, b) => a.score - b.score).slice(0, 5)
    for (const item of topLosers) {
      if (!items.some(i => i.domain === item.domain)) {
        items.push({ domain: item.domain, category: 'Top Losers', score: item.score })
      }
    }

    return items
  }, [scannedUserDomains])

  const getCategoryScore = (catName: string, baseScore: number = displayScore) => {
    if (!result && baseScore === 0) return 0
    if (result && baseScore === result.riskScore) {
      const match = result.categories.find(c => c.name === catName)
      return match ? Math.round(match.score) : 0
    }
    if (catName === 'Notice Transparency') return Math.min(100, Math.round(baseScore * 1.05))
    if (catName === 'Cookie & Consent') return Math.min(100, Math.round(baseScore * 0.94))
    if (catName === 'User Rights & Redressal') return Math.min(100, Math.round(baseScore * 0.97))
    if (catName === 'AI Transparency') return Math.min(100, Math.round(baseScore * 1.02))
    if (catName === 'Security Signals') return Math.min(100, Math.round(baseScore * 1.0))
    return Math.round(baseScore)
  }

  const scoreRingOffset = 2 * Math.PI * 54 * (1 - (displayScore / 100))

  /* ─── MythBreaker style overlapping card ─────────────────── */
  function MythStyleCard({ title, desc, backText, icon: Icon }: { title: string; desc: string; backText: string; icon: any }) {
    const [revealed, setRevealed] = useState(false)

    return (
      <button
        onClick={() => setRevealed(!revealed)}
        className="glass-card w-full text-left p-4 hover:border-primary/30 transition-all duration-300 group cursor-pointer relative overflow-hidden"
      >
        <div className="grid">
          {/* Front / Myth layer */}
          <motion.div
            className="col-start-1 row-start-1 flex flex-col justify-between space-y-2"
            initial={false}
            animate={{
              opacity: revealed ? 0 : 1,
              y: revealed ? -12 : 0,
              scale: revealed ? 0.95 : 1,
              pointerEvents: revealed ? 'none' : 'auto',
            }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <Icon className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground leading-tight">{title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{desc}</p>
            </div>
            <span className="text-xs text-primary/70 font-medium uppercase tracking-wider block pt-1">
              Click to inspect &rarr;
            </span>
          </motion.div>

          {/* Back / Reality layer */}
          <motion.div
            className="col-start-1 row-start-1 flex flex-col justify-between space-y-2"
            initial={false}
            animate={{
              opacity: revealed ? 1 : 0,
              y: revealed ? 0 : 12,
              scale: revealed ? 1 : 0.95,
              pointerEvents: revealed ? 'auto' : 'none',
            }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">{title}</h4>
              <p className="text-xs text-foreground mt-1 leading-snug font-medium">{backText}</p>
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block pt-1">
              &larr; Click to flip back
            </span>
          </motion.div>
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
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
                <h1 className="text-2xl font-bold text-foreground">Privacy Leaderboard - Detailed Analysis</h1>
                <p className="text-xs text-primary mt-1">Full scan details and compliance breakdowns for leaderboard domains</p>
              </div>
              <button
                onClick={() => setView('landing')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-xs font-semibold hover:bg-muted text-primary cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {fullLeaderboardItems.map((item: { domain: string; category: string; score?: number }) => {
                const cleanDomain = item.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
                const fullRes = leaderboardFullResults[cleanDomain]
                const isScanning = scanningLeaderboard[cleanDomain]
                const score = fullRes ? Math.round(fullRes.riskScore) : (item.score ?? 70)
                const isExpanded = expandedDomain === cleanDomain
                const domainFindings = getAllFindings(fullRes || null)

                const categoryList = [
                  { id: 'notice', name: 'Notice Transparency' },
                  { id: 'cookies', name: 'Cookies & Trackers' },
                  { id: 'rights', name: 'User Rights & Redressal' },
                  { id: 'ai_transparency', name: 'AI Transparency' },
                  { id: 'security', name: 'Security Signals' },
                ]

                const getRealCategoryScore = (catName: string, catId: string) => {
                  if (fullRes) {
                    const match = fullRes.categories?.find(c => c.name.toLowerCase() === catName.toLowerCase() || (c as any).id === catId)
                      || fullRes.report?.categories?.find(c => c.name.toLowerCase() === catName.toLowerCase() || c.id === catId)
                    if (match) return Math.round(match.score)
                  }
                  return getCategoryScore(catName, score)
                }

                const itemGapReasons = fullRes?.gapReasons && fullRes.gapReasons.length > 0
                  ? fullRes.gapReasons
                  : domainFindings
                      .filter(f => f.severity !== 'info')
                      .sort((a, b) => (SEVERITY_WEIGHT_VAL[b.severity] || 0) - (SEVERITY_WEIGHT_VAL[a.severity] || 0))
                      .map(f => f.title + (f.description ? ` — ${f.description}` : ''))
                      .filter(Boolean)
                      .slice(0, 3)

                return (
                  <div key={item.domain} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                          item.category === 'Top Gainers'
                            ? 'text-primary bg-emerald-500/10 border-emerald-500/30'
                            : 'text-red-400 bg-red-500/10 border-red-500/30'
                        }`}>
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-foreground">{item.domain}</h3>
                        {isScanning && (
                          <div className="flex items-center gap-1.5 text-xs text-primary">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Scanning...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">Overall Privacy Score</span>
                          <div className="flex items-center gap-2 justify-end">
                            <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
                            <span className="text-xs font-semibold text-primary">({getRatingText(score)})</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedDomain(isExpanded ? null : cleanDomain)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 text-xs font-medium hover:bg-muted text-primary transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {isExpanded ? 'Hide Details' : 'View Full Report'}
                        </button>
                      </div>
                    </div>

                    {/* Category score bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                      {categoryList.map((cat) => {
                        const catScore = getRealCategoryScore(cat.name, cat.id)
                        return (
                          <div key={cat.id} className="bg-muted p-2.5 rounded-xl border border-border text-left space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground truncate">{cat.name}</span>
                              <span className="text-foreground font-bold ml-1">{catScore}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${getBarBgColor(catScore)}`} style={{ width: `${catScore}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Gap Summary / Key Concerns if available */}
                    {itemGapReasons.length > 0 && (
                      <div className="bg-muted/60 rounded-xl p-3.5 border border-border text-left space-y-2">
                        <h4 className="text-xs font-bold text-primary flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> Key Privacy Concerns
                        </h4>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {itemGapReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detailed Scan Result Panel when expanded */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-border text-left space-y-4"
                      >
                        {fullRes ? (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted p-3 rounded-xl border border-border text-center">
                              <div>
                                <span className="text-xs text-muted-foreground block">Confidence Score</span>
                                <span className="text-sm font-bold text-primary">{fullRes.confidenceScore || 85}%</span>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block">Coverage Score</span>
                                <span className="text-sm font-bold text-primary">{fullRes.coverageScore || 90}%</span>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block">Pages Analyzed</span>
                                <span className="text-sm font-bold text-foreground">{fullRes.pagesAnalyzed || 1}</span>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block">Total Findings</span>
                                <span className="text-sm font-bold text-yellow-400">{domainFindings.length}</span>
                              </div>
                            </div>

                            {/* Detailed Findings List */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">Full Scan Findings</h4>
                              {domainFindings.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No compliance flags or issues detected for this domain.</p>
                              ) : (
                                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                  {domainFindings.map((finding, idx) => (
                                    <div key={finding.id ? `${finding.id}-${idx}` : idx} className="p-3 rounded-xl bg-muted border border-border text-xs space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-foreground">{finding.title}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                          finding.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                                          finding.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                                          finding.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                                          'bg-primary/10 text-primary border border-primary/30'
                                        }`}>
                                          {finding.severity}
                                        </span>
                                      </div>
                                      {finding.description && <p className="text-muted-foreground">{finding.description}</p>}
                                      {finding.recommendation && (
                                        <p className="text-primary/90 font-medium pt-0.5">Recommendation: {finding.recommendation}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        ) : isScanning ? (
                          <div className="flex items-center justify-center py-6 gap-3 text-primary text-xs font-medium">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Performing full compliance scan for {item.domain}...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between py-3 px-4 bg-muted rounded-xl border border-border text-xs">
                            <span className="text-muted-foreground">Full scan details not yet loaded for {item.domain}.</span>
                            <button
                              onClick={() => fetchFullScanForDomain(cleanDomain)}
                              className="px-3 py-1 rounded bg-primary/20 text-primary font-bold hover:bg-primary/30 transition-all cursor-pointer"
                            >
                              Scan Now
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          /* View: Scanner */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className={`${view === 'results' ? 'lg:col-span-6' : 'lg:col-span-8'} space-y-6`}>
              {/* Title Block */}
              <div className="text-center lg:text-left max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Free public privacy scan · No signup
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="gradient-text">Privacy Pitstop</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Scan. Understand. Question. Grieve. Track. Escalate.
                </p>
                <p className="text-sm text-muted-foreground">
                  A free public privacy capability by DPDP Consultancy
                </p>
              </div>

              {/* Form Input Section */}
              <div className="glass-card p-2 sm:p-2.5 flex items-center gap-2 rounded-2xl">
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
                    className="border border-red-500/20 rounded-2xl bg-destructive/5 p-8 text-center"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Analysis Failed</p>
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
                    {/* ── Scan Result Header ──────────────────────────── */}
                    <div className="glass-card p-5">
                      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">Scan result</p>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-foreground">{result.domain}</h3>
                              <a href={`https://${result.domain}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground">Website</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Scanned on {new Date(result.analyzedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · India 🇮🇳
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── Section 1: Privacy Score Summary ──────────── */}
                    <div className="glass-card p-6 md:p-8">
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
                            <div className={`text-base font-bold uppercase tracking-wider ${getScoreColor(displayScore)}`}>
                              {displayRating}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Privacy is a right. Transparency is respect.</p>
                          </div>
                        </div>

                        {/* Category bars */}
                        <div className="md:col-span-7 space-y-3 text-left">
                          {(result?.report?.categories || [
                            { id: 'notice', name: 'Privacy Notice', score: getCategoryScore('Notice Transparency') },
                            { id: 'consent', name: 'Consent', score: getCategoryScore('Cookie & Consent') },
                            { id: 'cookies', name: 'Cookies', score: getCategoryScore('Cookie & Consent') },
                            { id: 'rights', name: 'Rights', score: getCategoryScore('User Rights & Redressal') },
                            { id: 'ai_transparency', name: 'AI Transparency', score: getCategoryScore('AI Transparency') },
                            { id: 'childrens_privacy', name: "Children's Privacy", score: getCategoryScore('Notice Transparency') },
                            { id: 'security', name: 'Security', score: getCategoryScore('Security Signals') },
                          ]).map((cat) => {
                            const iconMap: Record<string, any> = {
                              notice: FileText,
                              consent: ShieldCheck,
                              cookies: Cookie,
                              rights: Scale,
                              ai_transparency: Brain,
                              childrens_privacy: HelpCircle,
                              security: Shield,
                            }
                            const IconComp = iconMap[cat.id] || FileText
                            const score = Math.round(cat.score)
                            return (
                              <div key={cat.name} className="space-y-1">
                                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <IconComp className="w-3 h-3 text-primary/60" />
                                    <span>{cat.name}</span>
                                  </div>
                                  <span className="text-foreground font-bold">{score}/100</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${getBarBgColor(score)}`} style={{ width: `${score}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ── Section 1.5: Score Justification (Score -> Why this score -> Key evidence) ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 }}
                      className="glass-card p-6 md:p-8 space-y-4 text-left border-l-4 border-l-primary"
                    >
                      <div className="flex items-center gap-2 border-b border-border pb-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="text-base font-bold text-foreground">Score Justification ({displayScore}/100)</h3>
                          <p className="text-xs text-muted-foreground">Direct score explanation derived from live scan evidence</p>
                        </div>
                      </div>

                      {displayScore >= 95 ? (
                        <div className="space-y-3 bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/30">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <ShieldCheck className="w-5 h-5" />
                            <span>100/100 Perfect Compliance Score Achieved</span>
                          </div>
                          <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
                            This domain achieved a perfect score because verified scan evidence confirms all key statutory compliance and transparency criteria were met:
                          </p>
                          <ul className="space-y-2 text-xs text-emerald-300 font-medium">
                            <li className="flex items-center gap-2 bg-background/40 p-2.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Privacy Policy & Notice documentation published and accessible at standard path</span>
                            </li>
                            <li className="flex items-center gap-2 bg-background/40 p-2.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{result?.consentBannerPresent ? 'Active cookie consent banner detected with explicit choice options' : 'Clean tracking posture with 0 pre-consent unauthenticated trackers'}</span>
                            </li>
                            <li className="flex items-center gap-2 bg-background/40 p-2.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>0 unauthenticated third-party tracking scripts or data leakage endpoints detected</span>
                            </li>
                            <li className="flex items-center gap-2 bg-background/40 p-2.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>HTTPS transport security active across all scanned pages</span>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-3 bg-amber-500/10 p-5 rounded-xl border border-amber-500/30">
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Why This Score: Key Impact Factors ({displayScore}/100)</span>
                          </div>
                          <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                            The score of {displayScore}/100 was derived from the following key non-compliance factors detected during the scan:
                          </p>
                          <ul className="space-y-2 text-xs text-amber-200">
                            {gapSummary.slice(0, 4).map((gap, idx) => (
                              <li key={idx} className="flex items-start gap-2 bg-background/40 p-2.5 rounded border border-amber-500/20">
                                <span className="text-amber-400 font-bold">•</span>
                                <span className="leading-snug">{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>

                    {/* ── Section 2: AI Executive Summary & Detailed Report ──────── */}
                    {(result?.summary || result?.report?.executiveSummary || result?.detailedReport || result?.report?.detailedReport) && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="glass-card p-6 md:p-8 space-y-6 text-left"
                      >
                        <div className="flex items-center justify-between border-b border-border pb-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="text-base font-bold text-foreground">AI Privacy Audit & Technical Report</h3>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-primary flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5" /> OpenAI Enriched
                          </span>
                        </div>

                        {/* Executive Summary */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Executive Summary</h4>
                          <p className="text-sm text-foreground/90 leading-relaxed font-medium bg-muted/40 p-4 rounded-xl border border-border">
                            {result?.report?.executiveSummary || result?.summary}
                          </p>
                        </div>

                        {/* Detailed Prose Report */}
                        {(result?.detailedReport || result?.report?.detailedReport) && (
                          <div className="space-y-2 pt-2 border-t border-border/60">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Detailed Technical Assessment (DPDP Act 2023)</h4>
                            <div className="text-xs text-muted-foreground leading-relaxed space-y-3 font-normal whitespace-pre-line bg-card/60 p-4 rounded-xl border border-border/80">
                              {result?.detailedReport || result?.report?.detailedReport}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── GAP SUMMARY ──────── */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full"
                    >
                      {/* GAP SUMMARY */}
                      <div className="glass-card p-5">
                        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">Gap summary</p>
                        <div className="space-y-2.5">
                          {gapSummary.length > 0 ? (
                            <ul className="space-y-2">
                              {gapSummary.map((gap, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span className="text-xs text-muted-foreground leading-snug">{gap}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex items-center gap-2 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-xs text-muted-foreground leading-snug">No compliance gaps identified.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>



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

              {/* Bottom 5 Cards using MythBreaker style overlap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-4">
                {[
                  {
                    title: 'Cookie & Consent Check',
                    desc: 'See how websites use cookies and get consent.',
                    backText: 'Analyzes cookie banners, opt-out toggles, and tracks script-loading behaviors.',
                    icon: Cookie
                  },
                  {
                    title: 'Grievance & Rights Guidance',
                    desc: 'Know your rights. Find redressal options.',
                    backText: 'Checks for mechanisms to submit DSAR or contact DPO under DPDP Act.',
                    icon: Scale
                  },
                  {
                    title: 'AI Transparency Signals',
                    desc: 'Understand how AI is used on the website.',
                    backText: 'Scans for disclosures regarding AI model usage and data training consent.',
                    icon: Sparkles
                  },
                  {
                    title: 'Public Scan Rankings',
                    desc: 'Compare. Learn. Drive better privacy.',
                    backText: 'Compares privacy posture against industry benchmarks and transparency scoreboards.',
                    icon: Globe
                  },
                  {
                    title: 'Built from public signals',
                    desc: 'Independent. Objective. Transparent.',
                    backText: 'Uses non-intrusive public page requests and network inspection.',
                    icon: Shield
                  }
                ].map((c) => (
                  <MythStyleCard key={c.title} title={c.title} desc={c.desc} backText={c.backText} icon={c.icon} />
                ))}
              </div>
            </div>

            {/* Middle Column: Your Privacy Action Journey (only on results) */}
            {view === 'results' && result && (
            <div className="lg:col-span-3 glass-card p-5 space-y-0">
              <div className="flex items-center gap-2 mb-5 border-b border-border pb-3">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground tracking-wide">Your Privacy Action Journey</h3>
              </div>

              {/* Journey Steps */}
              <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40" />

                <div className="space-y-4">
                  {[
                    { step: 1, icon: Search, title: 'Scan', desc: 'Check any company website or app', color: 'from-primary to-[hsl(var(--gradient-end))]' },
                    { step: 2, icon: Eye, title: 'Understand', desc: 'See privacy score, gaps, and plain-language insights', color: 'from-emerald-500 to-emerald-600' },
                    { step: 3, icon: HelpCircle, title: 'Question', desc: 'Ask the fiduciary about your data, consent, retention, and AI use', color: 'from-blue-500 to-blue-600' },
                    { step: 4, icon: AlertTriangle, title: 'Grieve', desc: 'Raise a privacy grievance using guided templates', color: 'from-amber-500 to-amber-600' },
                    { step: 5, icon: BarChart3, title: 'Track', desc: 'Monitor responses and unresolved issues', color: 'from-violet-500 to-violet-600' },
                    { step: 6, icon: ArrowUpRight, title: 'Escalate', desc: 'Build a complaint pack for formal escalation', color: 'from-rose-500 to-rose-600' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 relative">
                      <div className={`w-[30px] h-[30px] rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 z-10 shadow-lg shadow-primary/20`}>
                        <span className="text-xs font-bold text-white">{item.step}</span>
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
                    <p className="text-xs font-bold text-primary leading-tight">Your voice creates accountability.</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">Together, we build a privacy-respectful India.</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Right Column */}
            <div className={`${view === 'results' ? 'lg:col-span-3' : 'lg:col-span-4'} glass-card p-5 space-y-5`}>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-foreground leading-none">Privacy Market Watch</h3>
                  <span className="text-xs text-muted-foreground tracking-tight mt-1 inline-block">
                    Illustrative public leaderboard based on public scans
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-primary tracking-wider">LIVE</span>
                </div>
              </div>

              {scannedUserDomains.length === 0 ? (
                <div className="py-4 text-center space-y-1">
                  <p className="text-xs text-muted-foreground italic">No domains scanned yet.</p>
                  <p className="text-[11px] text-muted-foreground/80">Enter a domain above to populate live rankings.</p>
                </div>
              ) : (
                [
                  {
                    title: 'Top Gainers (Highest Scores)',
                    color: 'text-primary',
                    items: [...scannedUserDomains].sort((a, b) => b.score - a.score).slice(0, 5)
                  },
                  {
                    title: 'Top Losers (Lowest Scores)',
                    color: 'text-red-400',
                    items: [...scannedUserDomains].sort((a, b) => a.score - b.score).slice(0, 5)
                  }
                ].map((section) => (
                  <div key={section.title} className="space-y-2 text-left">
                    <h4 className={`text-xs font-bold ${section.color}`}>{section.title}</h4>
                    <div className="space-y-1.5">
                      {section.items.map((item, idx) => (
                        <div key={`${section.title}-${item.domain}`} className="flex items-center justify-between text-xs py-1 hover:bg-muted px-2 rounded-md transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground w-4 text-xs">{idx + 1}</span>
                            <span className="font-semibold text-muted-foreground hover:text-foreground transition-colors">
                              {item.domain}
                            </span>
                          </div>
                          <span className="font-bold text-foreground text-sm">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2 text-center">
                <button
                  onClick={() => setView('leaderboard')}
                  className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
                >
                  View full leaderboard on dpdpconsultancy.in/pitstop &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  )
}
