"use client";

import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, Calendar, Star, Package, Wrench, AlertTriangle, BarChart3, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EvidenceCard } from '@/components/ui/EvidenceCard'
import { SectionMark } from '@/components/ui/SectionMark'
import { generateRecommendations } from '@/lib/recommendation-logic'
import { getConsultationHref, getRecommendationHref } from '@/lib/recommendation-links'
import { downloadReportPdfUrl, deliverScanReport } from '@/lib/api'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import type { QuestionnaireResponses, ScanResult, Recommendation } from '@/lib/types'

interface ResultsViewProps {
  responses: QuestionnaireResponses;
  scanResult?: ScanResult;
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const gradeColor =
    {
      A: "text-success",
      B: "text-primary",
      C: "text-warning",
      D: "text-warning",
      F: "text-destructive",
    }[grade] || "text-muted-foreground";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="8"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className={cn("text-lg font-bold", gradeColor)}>{grade}</span>
      </div>
    </div>
  );
}



function RecommendationCard({
  rec,
  onLearnMore,
}: {
  rec: Recommendation
  onLearnMore: (rec: Recommendation) => void
}) {
  const typeIcon =
    rec.type === "product" ? Star : rec.type === "service" ? Wrench : Package;
  const TypeIcon = typeIcon;

  return (
    <Card variant="outline" className="h-full hover:translate-y-0">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <TypeIcon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">{rec.title}</CardTitle>
          </div>
          <Badge
            variant={
              rec.relevanceScore >= 8
                ? "success"
                : rec.relevanceScore >= 5
                  ? "warning"
                  : "default"
            }
          >
            Score: {rec.relevanceScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{rec.reason}</p>

        {rec.gapsAddressed.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
            <p className="text-xs text-muted-foreground">
              Addresses {rec.gapsAddressed.length} gap
              {rec.gapsAddressed.length > 1 ? "s" : ""}:{" "}
              {rec.gapsAddressed.join(", ")}
            </p>
          </div>
        )}

        {rec.dpdpSections.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {rec.dpdpSections.map((s) =>
              s === 'All' || s === 'All sections' ? (
                <Badge key={s} variant="outline" className="text-[10px]">
                  {s}
                </Badge>
              ) : (
                <SectionMark key={s} section={s} />
              ),
            )}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onLearnMore(rec)}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}

const SEVERITY_META = {
  critical: { label: 'Critical', color: 'bg-destructive', text: 'text-destructive' },
  high: { label: 'High', color: 'bg-warning', text: 'text-warning' },
  medium: { label: 'Medium', color: 'bg-primary', text: 'text-primary' },
  low: { label: 'Low', color: 'bg-muted-foreground', text: 'text-muted-foreground' },
} as const

function IssueMixStackedBar({ summary }: { summary: ScanResult['summary'] }) {
  const { criticalIssues, highIssues, warnings, passed } = summary
  const total = criticalIssues + highIssues + warnings + passed || 1

  const segments = [
    { key: 'crit', pct: (criticalIssues / total) * 100, color: 'bg-destructive', label: 'Critical' },
    { key: 'high', pct: (highIssues / total) * 100, color: 'bg-warning', label: 'High' },
    { key: 'warn', pct: (warnings / total) * 100, color: 'bg-primary', label: 'Warnings' },
    { key: 'pass', pct: (passed / total) * 100, color: 'bg-success', label: 'Passed' },
  ].filter((s) => s.pct > 0)

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Issue mix</p>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted/40">
        {segments.map((s, i) => (
          <motion.div
            key={s.key}
            className={`${s.color} min-w-[3px]`}
            initial={{ width: 0 }}
            animate={{ width: `${s.pct}%` }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
            title={`${s.label}: ${Math.round(s.pct)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-destructive" /> Critical {criticalIssues}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-warning" /> High {highIssues}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-primary" /> Warnings {warnings}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-success" /> Passed {passed}
        </span>
      </div>
    </div>
  )
}

function FailedChecksBySeverity({ scanResult }: { scanResult: ScanResult }) {
  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 }
    for (const f of scanResult.complianceFlags ?? []) {
      if (f.passed) continue
      if (f.severity in c) c[f.severity as keyof typeof c] += 1
    }
    return c
  }, [scanResult])

  const max = Math.max(1, ...Object.values(counts))

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Failed checks by severity</p>
      <div className="space-y-2">
        {(Object.keys(SEVERITY_META) as Array<keyof typeof SEVERITY_META>).map((sev) => {
          const n = counts[sev]
          const pct = (n / max) * 100
          const meta = SEVERITY_META[sev]
          return (
            <div key={sev} className="flex items-center gap-3">
              <span className={`w-16 shrink-0 text-[11px] ${meta.text}`}>{meta.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className={`h-full rounded-full ${meta.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{n}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function generateSummary(responses: QuestionnaireResponses, scanResult?: ScanResult): string {
  const parts: string[] = []

  if (scanResult) {
    if (scanResult.overallScore < 40) {
      parts.push(
        `Your website scored ${scanResult.overallScore}/100 (Grade ${scanResult.grade}), indicating critical privacy compliance gaps that require immediate attention.`,
      );
    } else if (scanResult.overallScore < 60) {
      parts.push(
        `Your website scored ${scanResult.overallScore}/100 (Grade ${scanResult.grade}), showing moderate compliance but with important gaps to address.`,
      );
    } else if (scanResult.overallScore < 80) {
      parts.push(
        `Your website scored ${scanResult.overallScore}/100 (Grade ${scanResult.grade}), demonstrating good compliance with specific areas for improvement.`,
      );
    } else {
      parts.push(
        `Your website scored ${scanResult.overallScore}/100 (Grade ${scanResult.grade}), showing strong compliance posture with minor refinements needed.`,
      );
    }
  }

  const stageLabels: Record<string, string> = {
    "just-starting": "beginning your compliance journey",
    "have-policies": "validating existing policies",
    "know-gaps": "addressing identified gaps",
    "need-validation": "seeking independent validation",
    "ongoing-support": "maintaining continuous compliance",
  };

  parts.push(
    `As a ${responses.orgType} organization ${stageLabels[responses.journeyStage] || "on your compliance journey"}, we've tailored these recommendations to your specific needs and priorities.`,
  );

  return parts.join(" ");
}

export function ResultsView({ responses, scanResult }: ResultsViewProps) {
  const router = useRouter()
  const { isModalOpen, closeModal } = useQuestionnaireStore()

  const navigateTo = useCallback(
    (href: string) => {
      if (isModalOpen) closeModal()
      router.push(href)
    },
    [closeModal, isModalOpen, router]
  )

  const handleLearnMore = useCallback(
    (rec: Recommendation) => {
      navigateTo(getRecommendationHref(rec))
    },
    [navigateTo]
  )

  const recommendations = useMemo(
    () => generateRecommendations(responses, scanResult),
    [responses, scanResult],
  );

  const deliverAttempted = useRef(false)
  const [deliveryState, setDeliveryState] = useState<'idle' | 'sent' | 'failed'>('idle')

  useEffect(() => {
    if (
      deliverAttempted.current ||
      !scanResult?.scanId ||
      !responses.consentGiven ||
      !responses.email
    ) {
      return
    }

    deliverAttempted.current = true
    setDeliveryState('idle')

    deliverScanReport(scanResult.scanId, {
      role: responses.role,
      orgType: responses.orgType,
      journeyStage: responses.journeyStage,
      dataTypes: responses.dataTypes,
      priorities: responses.priorities,
      supportType: responses.supportType,
      recommendations: recommendations.map((rec) => ({
        type: rec.type,
        id: rec.id,
        title: rec.title,
        reason: rec.reason,
        relevanceScore: rec.relevanceScore,
      })),
    })
      .then(() => setDeliveryState('sent'))
      .catch(() => {
        deliverAttempted.current = false
        setDeliveryState('failed')
      })
  }, [scanResult, responses, recommendations])

  const products = recommendations.filter((r) => r.type === "product");
  const services = recommendations.filter((r) => r.type === "service");
  const packages = recommendations.filter((r) => r.type === "package");
  const summary = useMemo(
    () => generateSummary(responses, scanResult),
    [responses, scanResult],
  );

  const hasScan = !!scanResult;

  const p2Delay = 0.05
  const p3Delay = 0.1
  const p4Delay = 0.15

  const failedFlags = useMemo(
    () => (scanResult?.complianceFlags ? scanResult.complianceFlags.filter((f) => !f.passed) : []),
    [scanResult]
  )

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      {hasScan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Scan ledger</h2>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <ScoreRing score={scanResult.overallScore} grade={scanResult.grade} />
            <div className="flex-1 space-y-4">
              <h3 className="font-semibold text-foreground">{scanResult.scannedUrl}</h3>
              <p className="text-sm text-muted-foreground">
                Penalty exposure: <span className="font-medium text-destructive">{scanResult.penaltyExposure}</span>
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <div className="text-xl font-semibold text-destructive">{scanResult.summary.criticalIssues}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Critical</div>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <div className="text-xl font-semibold text-warning">{scanResult.summary.highIssues}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">High</div>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <div className="text-xl font-semibold text-primary">{scanResult.summary.warnings}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Warnings</div>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <div className="text-xl font-semibold text-success">{scanResult.summary.passed}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Passed</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{scanResult.totalCookies} cookies</span>
                <span>·</span>
                <span>{scanResult.totalTrackers} trackers</span>
                <span>·</span>
                <span>Banner: {scanResult.consentBannerPresent ? '✓' : '✗'}</span>
                <span>·</span>
                <span>Reject: {scanResult.consentRejectOption ? '✓' : '✗'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Visual report</h3>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <IssueMixStackedBar summary={scanResult.summary} />
              <FailedChecksBySeverity scanResult={scanResult} />
            </div>
            {failedFlags.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Top findings ({failedFlags.length})
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {failedFlags.slice(0, 8).map((f) => (
                    <li key={f.id}>
                      <EvidenceCard
                        title={f.title}
                        severity={f.severity}
                        recordId={f.id}
                      >
                        {f.description ? <span className="line-clamp-2">{f.description}</span> : null}
                      </EvidenceCard>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Phase 2: Context Slide */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: p2Delay }}
        className="rounded-xl border border-border bg-muted/40 p-6 sm:p-8"
      >
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Assessment summary
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {summary}
        </p>


      </motion.div>

      {/* Phase 3: Recommendations */}
      <div className="space-y-12">
        {products.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: p3Delay }}
          >
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" /> Recommended products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} onLearnMore={handleLearnMore} />
              ))}
            </div>
          </motion.section>
        )}

        {services.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: p3Delay + 0.15 }}
          >
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" /> Recommended services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} onLearnMore={handleLearnMore} />
              ))}
            </div>
          </motion.section>
        )}

        {packages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: p3Delay + 0.3 }}
          >
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" /> Package offers
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} onLearnMore={handleLearnMore} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {hasScan && responses.email && responses.consentGiven && deliveryState !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: p4Delay - 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              {deliveryState === 'sent' ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground">Report sent to your mailbox</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The scan report was sent to{' '}
                    <strong className="text-foreground">{responses.email}</strong>.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-foreground">Report was not sent</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The mailbox delivery failed. Download the report on this page or email{' '}
                    <a href="mailto:operations@dpdpconsultancy.in" className="text-primary hover:underline">
                      operations@dpdpconsultancy.in
                    </a>
                    .
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Phase 4: Action Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: p4Delay }}
        className="flex flex-col gap-4 sm:flex-row pt-8 border-t border-border"
      >
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => {
            if (scanResult?.scanId) {
              void downloadReportPdfUrl(scanResult.scanId).then((url) => {
                window.open(url, '_blank')
              })
            }
          }}
          disabled={!scanResult?.scanId}
        >
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1 text-lg py-6"
          onClick={() => navigateTo(getConsultationHref())}
        >
          <Calendar className="h-6 w-6 mr-2" />
          Book a Consultation
        </Button>
      </motion.div>
    </div>
  );
}
