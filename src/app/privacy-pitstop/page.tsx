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

  // Leaderboard state
  const INITIAL_TOP_LEADERBOARD = [
    { domain: 'zoho.com', score: 86 },
    { domain: 'tata.com', score: 83 },
    { domain: 'infosys.com', score: 78 },
  ]

  const [topLeaderboard, setTopLeaderboard] = useState<{ domain: string; score: number }[]>(INITIAL_TOP_LEADERBOARD)

  // Rehydrate persisted leaderboard state after client hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dpdp_privacy_top3_leaderboard')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          queueMicrotask(() => setTopLeaderboard(parsed.slice(0, 3)))
        }
      }
    } catch (err) {}
  }, [])

  const [leaderboardScores, setLeaderboardScores] = useState<Record<string, number>>({
    'zoho.com': 86,
    'tata.com': 83,
    'infosys.com': 78,
    'facebook.com': 42,
    'twitter.com': 38,
    'newsportal.com': 35,
    'govt.in': 88,
    'pmindia.gov.in': 85,
    'eci.gov.in': 84,
    'freegames.com': 28,
    'flashnews.com': 26,
    'dealscorner.com': 24,
  })
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
      setLeaderboardScores(prev => ({ ...prev, [cleanDomain]: scoreVal }))

      setTopLeaderboard(prev => {
        const existingIndex = prev.findIndex(item => item.domain.toLowerCase() === cleanDomain)
        let updated = [...prev]

        if (existingIndex !== -1) {
          updated[existingIndex] = { ...updated[existingIndex], score: scoreVal }
        } else {
          updated.push({ domain: cleanDomain, score: scoreVal })
        }

        updated.sort((a, b) => b.score - a.score)
        const top3 = updated.slice(0, 3)

        try {
          localStorage.setItem('dpdp_privacy_top3_leaderboard', JSON.stringify(top3))
        } catch (err) {}

        return top3
      })
    } catch (err) {
      // Quietly absorb background scan errors
    } finally {
      setScanningLeaderboard(prev => ({ ...prev, [cleanDomain]: false }))
    }
  }, [])

  // Trigger background scans for leaderboard companies on mount if score is missing
  useEffect(() => {
    if (hasInitLeaderboardScansRef.current) return
    hasInitLeaderboardScansRef.current = true

    let isMounted = true

    const runAll = async () => {
      for (const d of LEADERBOARD_DOMAINS) {
        if (!isMounted) break
        try {
          if (leaderboardScores[d] === undefined || leaderboardScores[d] === 0) {
            await fetchFullScanForDomain(d)
          }
        } catch (err) {
          // Continue remaining scans
        }
      }
    }

    runAll()

    return () => {
      isMounted = false
    }
  }, [fetchFullScanForDomain])

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
      setLeaderboardScores(prev => ({ ...prev, [cleanDomain]: scoreVal }))

      setTopLeaderboard(prev => {
        const existingIndex = prev.findIndex(item => item.domain.toLowerCase() === cleanDomain)
        let updated = [...prev]

        if (existingIndex !== -1) {
          updated[existingIndex] = { ...updated[existingIndex], score: scoreVal }
        } else {
          updated.push({ domain: cleanDomain, score: scoreVal })
        }

        updated.sort((a, b) => b.score - a.score)
        const top3 = updated.slice(0, 3)

        try {
          localStorage.setItem('dpdp_privacy_top3_leaderboard', JSON.stringify(top3))
        } catch (err) {}

        return top3
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
    if (score >= 80) return 'text-emerald-400 stroke-emerald-400'
    if (score >= 60) return 'text-green-400 stroke-green-400'
    if (score >= 40) return 'text-yellow-400 stroke-yellow-400'
    if (score >= 20) return 'text-orange-400 stroke-orange-400'
    return 'text-red-500 stroke-red-500'
  }

  function getBarBgColor(score: number) {
    if (score === 0) return 'bg-cyan-500/10'
    if (score >= 80) return 'bg-emerald-400'
    if (score >= 60) return 'bg-green-400'
    if (score >= 40) return 'bg-yellow-400'
    if (score >= 20) return 'bg-orange-400'
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

    return list
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
    const seen = new Set<string>()

    for (const item of topLeaderboard) {
      const clean = item.domain.toLowerCase().trim()
      if (!seen.has(clean)) {
        seen.add(clean)
        items.push({ domain: item.domain, category: 'Top Gainers', score: item.score })
      }
    }

    const decliners = ['facebook.com', 'twitter.com', 'newsportal.com']
    for (const d of decliners) {
      const clean = d.toLowerCase().trim()
      if (!seen.has(clean)) {
        seen.add(clean)
        items.push({ domain: d, category: 'Top Decliners' })
      }
    }

    return items
  }, [topLeaderboard])

  useEffect(() => {
    if (view !== 'leaderboard') return

    for (const item of fullLeaderboardItems) {
      const clean = item.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
      if (!leaderboardFullResults[clean] && !scanningLeaderboard[clean] && !scannedOrScanningRef.current.has(clean)) {
        const domainToScan = clean
        queueMicrotask(() => {
          fetchFullScanForDomain(domainToScan)
        })
      }
    }
  }, [view, fullLeaderboardItems, leaderboardFullResults, scanningLeaderboard, fetchFullScanForDomain])

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
        className="w-full text-left p-4 rounded-xl border border-cyan-500/15 bg-cyan-950/5 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden"
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
            <Icon className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="text-[10px] font-bold text-foreground leading-tight">{title}</h4>
              <p className="text-[9px] text-muted-foreground mt-1 leading-snug">{desc}</p>
            </div>
            <span className="text-[8px] text-cyan-400/70 font-semibold uppercase tracking-wider block pt-1">
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
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">{title}</h4>
              <p className="text-[9px] text-foreground mt-1 leading-snug font-medium">{backText}</p>
            </div>
            <span className="text-[8px] text-muted-foreground uppercase tracking-wider block pt-1">
              &larr; Click to flip back
            </span>
          </motion.div>
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[#060814] text-foreground font-sans">
      <SectionWrapper className="pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-cyan-500/10 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold tracking-wider leading-none">DPDP</h2>
              <span className="text-[10px] text-cyan-500/80 tracking-widest uppercase">Consultancy</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-cyan-500/20 mx-2" />
            <div className="hidden md:block text-[11px] text-muted-foreground leading-tight">
              <div>Privacy by Design.</div>
              <div>Trust by Default.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center">
            {[
              { title: '100% PUBLIC SCAN', sub: 'Transparent. Independent.', icon: Search },
              { title: 'NO SIGN-UP', sub: 'Free for everyone', icon: ShieldCheck },
              { title: 'YOUR DATA', sub: 'Your rights. Your voice.', icon: Globe },
            ].map(({ title, sub, icon: Icon }) => (
              <div key={title} className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                <Icon className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="text-[9px] font-bold tracking-wider text-foreground leading-none">{title}</div>
                  <div className="text-[8px] text-muted-foreground mt-0.5 leading-none">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View: Leaderboard */}
        {view === 'leaderboard' ? (
          <motion.div
            key="leaderboardView"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
              <div className="text-left">
                <h1 className="text-2xl font-extrabold text-white">Privacy Leaderboard - Detailed Analysis</h1>
                <p className="text-xs text-cyan-400 mt-1">Full scan details and compliance breakdowns for leaderboard domains</p>
              </div>
              <button
                onClick={() => setView('landing')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-950/20 text-cyan-400 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {fullLeaderboardItems.map((item: { domain: string; category: string; score?: number }) => {
                const cleanDomain = item.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
                const fullRes = leaderboardFullResults[cleanDomain]
                const isScanning = scanningLeaderboard[cleanDomain]
                const score = fullRes ? Math.round(fullRes.riskScore) : (leaderboardScores[cleanDomain] !== undefined ? leaderboardScores[cleanDomain] : (item.score ?? 70))
                const isExpanded = expandedDomain === cleanDomain
                const domainFindings = getAllFindings(fullRes || null)

                const categoryList = [
                  { id: 'notice', name: 'Notice Transparency' },
                  { id: 'consent', name: 'Cookie & Consent' },
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
                  <div key={item.domain} className="border border-cyan-500/15 rounded-2xl bg-cyan-950/5 p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                          item.category === 'Top Gainers'
                            ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30'
                            : 'text-red-400 bg-red-950/30 border-red-500/30'
                        }`}>
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-white">{item.domain}</h3>
                        {isScanning && (
                          <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Scanning...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">Overall Privacy Score</span>
                          <div className="flex items-center gap-2 justify-end">
                            <span className={`text-xl font-extrabold ${getScoreColor(score)}`}>{score}/100</span>
                            <span className="text-xs font-semibold text-cyan-400">({getRatingText(score)})</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedDomain(isExpanded ? null : cleanDomain)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-medium hover:bg-cyan-950/20 text-cyan-400 transition-all"
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
                          <div key={cat.id} className="bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/10 text-left space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground truncate">{cat.name}</span>
                              <span className="text-foreground font-bold ml-1">{catScore}</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0e1329] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${getBarBgColor(catScore)}`} style={{ width: `${catScore}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Gap Summary / Key Concerns if available */}
                    {itemGapReasons.length > 0 && (
                      <div className="bg-cyan-950/10 rounded-xl p-3.5 border border-cyan-500/10 text-left space-y-2">
                        <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> Key Privacy Concerns
                        </h4>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {itemGapReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-500 font-bold">•</span>
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
                        className="pt-4 border-t border-cyan-500/15 text-left space-y-4"
                      >
                        {fullRes ? (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/10 text-center">
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Confidence Score</span>
                                <span className="text-sm font-bold text-cyan-400">{fullRes.confidenceScore || 85}%</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Coverage Score</span>
                                <span className="text-sm font-bold text-cyan-400">{fullRes.coverageScore || 90}%</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Pages Analyzed</span>
                                <span className="text-sm font-bold text-white">{fullRes.pagesAnalyzed || 1}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Total Findings</span>
                                <span className="text-sm font-bold text-yellow-400">{domainFindings.length}</span>
                              </div>
                            </div>

                            {/* Detailed Findings List */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-white tracking-wider uppercase">Full Scan Findings</h4>
                              {domainFindings.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No compliance flags or issues detected for this domain.</p>
                              ) : (
                                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                  {domainFindings.map((finding, idx) => (
                                    <div key={finding.id || idx} className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/10 text-xs space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-white">{finding.title}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                          finding.severity === 'critical' ? 'bg-red-950/50 text-red-400 border border-red-500/30' :
                                          finding.severity === 'high' ? 'bg-orange-950/50 text-orange-400 border border-orange-500/30' :
                                          finding.severity === 'medium' ? 'bg-yellow-950/50 text-yellow-400 border border-yellow-500/30' :
                                          'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
                                        }`}>
                                          {finding.severity}
                                        </span>
                                      </div>
                                      {finding.description && <p className="text-muted-foreground">{finding.description}</p>}
                                      {finding.recommendation && (
                                        <p className="text-cyan-400/90 font-medium pt-0.5">Recommendation: {finding.recommendation}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        ) : isScanning ? (
                          <div className="flex items-center justify-center py-6 gap-3 text-cyan-400 text-xs font-medium">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Performing full compliance scan for {item.domain}...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between py-3 px-4 bg-cyan-950/20 rounded-xl border border-cyan-500/10 text-xs">
                            <span className="text-muted-foreground">Full scan details not yet loaded for {item.domain}.</span>
                            <button
                              onClick={() => fetchFullScanForDomain(cleanDomain)}
                              className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/10">
                  <Loader2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-extrabold text-white leading-tight">Privacy Pitstop</h1>
                  <p className="text-sm font-semibold text-cyan-400 leading-none">Scan. Understand. Question. Grieve. Track. Escalate.</p>
                  <p className="text-xs text-muted-foreground mt-1">A free public privacy capability by DPDP Consultancy</p>
                </div>
              </div>

              {/* Form Input Section */}
              <div className="p-1 rounded-full border border-cyan-500/30 bg-black/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-2">
                <div className="pl-4 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter a website URL"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm py-2 px-1 focus:outline-none placeholder-muted-foreground"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!domain.trim() || view === 'analyzing'}
                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-black font-bold text-xs py-2 px-6 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    {view === 'analyzing' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      'Start Free Scan >'
                    )}
                  </button>
                </form>
              </div>

              {/* Try Examples */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Try examples:</span>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_DOMAINS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDomain(d); startAnalysis(d) }}
                      className="px-3 py-1 rounded-md border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-950/10 text-muted-foreground hover:text-cyan-400 transition-all cursor-pointer text-xs"
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
                    className="border border-cyan-500/20 rounded-2xl bg-cyan-950/5 p-6 sm:p-8 space-y-6 text-left"
                  >
                    {/* Header + Live Scanning Indicator */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                          </span>
                          <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">Live Compliance Scan</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">Analyzing <span className="text-cyan-300 font-mono">{domain}</span></h3>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-xs text-cyan-400 font-medium self-start sm:self-auto">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>In Progress...</span>
                      </div>
                    </div>

                    {/* Step Breakdown */}
                    <div className="space-y-3">
                      {ANALYSIS_STEPS.map((step, i) => {
                        const Icon = step.icon
                        const isActive = i <= activeStep
                        const isComplete = i < activeStep
                        return (
                          <div key={step.label} className="flex items-center gap-3">
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isActive ? (
                              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                            ) : (
                              <Icon className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                            )}
                            <span className={`text-xs font-medium transition-colors ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground/40'}`}>
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>Scan Progress</span>
                        <span>{Math.min(100, Math.round(((Math.max(0, activeStep) + 1) / ANALYSIS_STEPS.length) * 100))}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-cyan-950/40 rounded-full overflow-hidden border border-cyan-500/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.min(100, Math.round(((Math.max(0, activeStep) + 1) / ANALYSIS_STEPS.length) * 100))}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* ₹250 Crore Fine Stat Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-950/20 via-amber-950/10 to-red-950/20 p-4 sm:p-5"
                    >
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-start gap-3.5 relative z-10">
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shrink-0 text-amber-400">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                              DPDP ACT 2023 STATUTORY RISK
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-snug">
                            DPDP fines in India can be up to{' '}
                            <span className="font-extrabold text-amber-400 underline decoration-amber-500/40 underline-offset-2">
                              ₹250 Crore
                            </span>{' '}
                            per violation instance.
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
                            Our scanner evaluates notice disclosures, tracker consent, user grievance redressal, and security posture against statutory DPDP requirements.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : view === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-red-500/20 rounded-2xl bg-red-950/5 p-8 text-center"
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
                    <div className="border border-cyan-500/20 rounded-2xl bg-cyan-950/5 p-5">
                      <p className="text-[9px] font-bold tracking-widest text-cyan-400/60 uppercase mb-3">SCAN RESULT</p>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 border border-cyan-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-white">{result.domain}</h3>
                              <a href={`https://${result.domain}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] px-2 py-0.5 rounded border border-cyan-500/20 text-muted-foreground">Website</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">
                            Scanned on {new Date(result.analyzedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · India 🇮🇳
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── Section 1: Privacy Score Summary ──────────── */}
                    <div className="border border-cyan-500/20 rounded-2xl bg-cyan-950/5 p-6 md:p-8">
                      <p className="text-[9px] font-bold tracking-widest text-cyan-400/60 uppercase mb-5">OVERALL PRIVACY SCORE</p>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        {/* Score Ring */}
                        <div className="md:col-span-5 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-cyan-500/10 pb-6 md:pb-0 pr-0 md:pr-8">
                          <div className="relative w-36 h-36">
                            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                              <circle cx="60" cy="60" r="54" fill="none" stroke="#0e1329" strokeWidth="6" />
                              <circle
                                cx="60" cy="60" r="54" fill="none" strokeWidth="6" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 54}
                                strokeDashoffset={scoreRingOffset}
                                className={`transition-all duration-1000 ${getScoreColor(displayScore)}`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ShieldCheck className={`w-5 h-5 mb-1 ${getScoreColor(displayScore)}`} />
                              <div className="text-3xl font-extrabold text-foreground leading-none">{displayScore}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">/100</div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className={`text-base font-bold uppercase tracking-wider ${getScoreColor(displayScore)}`}>
                              {displayRating}
                            </div>
                            <p className="text-[9px] text-muted-foreground mt-1">Privacy is a right. Transparency is respect.</p>
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
                                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <IconComp className="w-3 h-3 text-cyan-400/60" />
                                    <span>{cat.name}</span>
                                  </div>
                                  <span className="text-foreground font-bold">{score}/100</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#0e1329] rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${getBarBgColor(score)}`} style={{ width: `${score}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ── GAP SUMMARY ──────── */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full"
                    >
                      {/* GAP SUMMARY */}
                      <div className="border border-cyan-500/20 rounded-2xl bg-cyan-950/5 p-5">
                        <p className="text-[9px] font-bold tracking-widest text-cyan-400/60 uppercase mb-3">GAP SUMMARY</p>
                        <div className="space-y-2.5">
                          {gapSummary.length > 0 ? (
                            <ul className="space-y-2">
                              {gapSummary.map((gap, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span className="text-[10px] text-muted-foreground leading-snug">{gap}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex items-center gap-2 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-[10px] text-muted-foreground leading-snug">No compliance gaps identified.</span>
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
                      <button
                        onClick={resetToLanding}
                        className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-black font-bold text-xs py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Search className="w-4 h-4" />
                        Scan Another Website
                      </button>
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
            <div className="lg:col-span-3 border border-cyan-500/20 rounded-2xl bg-cyan-950/5 p-5 space-y-0">
              <div className="flex items-center gap-2 mb-5 border-b border-cyan-500/10 pb-3">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Privacy Action Journey</h3>
              </div>

              {/* Journey Steps */}
              <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-cyan-400/40 via-cyan-400/20 to-cyan-400/40" />

                <div className="space-y-4">
                  {[
                    { step: 1, icon: Search, title: 'Scan', desc: 'Check any company website or app', color: 'from-cyan-500 to-cyan-600' },
                    { step: 2, icon: Eye, title: 'Understand', desc: 'See privacy score, gaps, and plain-language insights', color: 'from-emerald-500 to-emerald-600' },
                    { step: 3, icon: HelpCircle, title: 'Question', desc: 'Ask the fiduciary about your data, consent, retention, and AI use', color: 'from-blue-500 to-blue-600' },
                    { step: 4, icon: AlertTriangle, title: 'Grieve', desc: 'Raise a privacy grievance using guided templates', color: 'from-amber-500 to-amber-600' },
                    { step: 5, icon: BarChart3, title: 'Track', desc: 'Monitor responses and unresolved issues', color: 'from-violet-500 to-violet-600' },
                    { step: 6, icon: ArrowUpRight, title: 'Escalate', desc: 'Build a complaint pack for formal escalation', color: 'from-rose-500 to-rose-600' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 relative">
                      <div className={`w-[30px] h-[30px] rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 z-10 shadow-lg shadow-cyan-900/20`}>
                        <span className="text-[10px] font-extrabold text-white">{item.step}</span>
                      </div>
                      <div className="pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <item.icon className="w-3.5 h-3.5 text-cyan-400" />
                          <h4 className="text-[11px] font-bold text-white">{item.title}</h4>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 pt-3 border-t border-cyan-500/10">
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/15">
                  <Megaphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-cyan-400 leading-tight">Your voice creates accountability.</p>
                    <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">Together, we build a privacy-respectful India.</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Right Column */}
            <div className={`${view === 'results' ? 'lg:col-span-3' : 'lg:col-span-4'} border border-cyan-500/20 rounded-2xl bg-cyan-950/5 p-5 space-y-5`}>
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
                <div className="text-left">
                  <h3 className="text-base font-bold text-white leading-none">Privacy Market Watch</h3>
                  <span className="text-[9px] text-muted-foreground tracking-tight mt-1 inline-block">
                    Illustrative public leaderboard based on public scans
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-400 tracking-wider">LIVE</span>
                </div>
              </div>

              {[
                {
                  title: 'Top Gainers (Top 3)',
                  color: 'text-emerald-400',
                  items: topLeaderboard.map(item => ({ name: item.domain, domain: item.domain, score: item.score }))
                },
                {
                  title: 'Top Decliners',
                  color: 'text-red-400',
                  items: [
                    { name: 'facebook.com', domain: 'facebook.com' },
                    { name: 'twitter.com', domain: 'twitter.com' },
                    { name: 'newsportal.com', domain: 'newsportal.com' }
                  ]
                }
              ].map((section) => (
                <div key={section.title} className="space-y-2 text-left">
                  <h4 className={`text-xs font-bold ${section.color}`}>{section.title}</h4>
                  <div className="space-y-1.5">
                    {section.items.map((item, idx) => {
                      const score = leaderboardScores[item.domain]
                      const isScanning = scanningLeaderboard[item.domain]
                      const defaultScores: Record<string, number> = {
                        'newsportal.com': 35,
                        'govt.in': 88,
                        'pmindia.gov.in': 85,
                        'eci.gov.in': 84,
                        'freegames.com': 28,
                        'flashnews.com': 26,
                        'dealscorner.com': 24
                      }
                      const displayVal = (item as any).score !== undefined ? (item as any).score : (score !== undefined ? score : (defaultScores[item.domain] ?? 70))

                      return (
                        <div key={item.domain} className="flex items-center justify-between text-xs py-1 hover:bg-cyan-950/20 px-2 rounded-md transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground w-4 text-[10px]">{idx + 1}</span>
                            <span className="font-semibold text-muted-foreground hover:text-foreground transition-colors">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isScanning && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                            <span className="font-bold text-foreground text-[11px]">{displayVal}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  onClick={() => setView('leaderboard')}
                  className="text-[10px] text-cyan-400 hover:underline cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
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
