"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Download,
  Calendar,
  Star,
  Package,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { generateRecommendations } from "@/lib/recommendation-logic";
import type {
  QuestionnaireResponses,
  ScanResult,
  Recommendation,
} from "@/lib/types";

interface ResultsViewProps {
  responses: QuestionnaireResponses;
  scanResult?: ScanResult;
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const gradeColor =
    {
      A: "text-green-500",
      B: "text-emerald-500",
      C: "text-yellow-500",
      D: "text-orange-500",
      F: "text-red-500",
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

function CategoryBar({
  name,
  score,
  maxScore,
}: {
  name: string;
  score: number;
  maxScore: number;
}) {
  const pct = (score / maxScore) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{name}</span>
        <span className="text-muted-foreground">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={cn(
            "h-full rounded-full",
            pct >= 75
              ? "bg-green-500"
              : pct >= 50
                ? "bg-yellow-500"
                : "bg-red-500",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const typeIcon =
    rec.type === "product" ? Star : rec.type === "service" ? Wrench : Package;
  const TypeIcon = typeIcon;

  return (
    <Card className="h-full">
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
            {rec.dpdpSections.map((s) => (
              <Badge key={s} variant="outline" className="text-[10px]">
                {s}
              </Badge>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full">
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}

function Counter({ valueString }: { valueString: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Extract number from string like "₹82 Crore" -> 82
    const num = parseInt(valueString.replace(/\D/g, ""), 10) || 0;
    if (num === 0) {
      setDisplay(0);
      return;
    }

    let start = 0;
    const end = num;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);

      setDisplay(Math.round(start + (end - start) * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(end);
      }
    };
    requestAnimationFrame(animate);
  }, [valueString]);

  const prefix = valueString.replace(/[0-9].*/, "") || "";
  const suffix = valueString.replace(/.*?[0-9]+/, "") || "";

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function generateSummary(
  responses: QuestionnaireResponses,
  scanResult?: ScanResult,
): string {
  const parts: string[] = [];

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
  const recommendations = useMemo(
    () => generateRecommendations(responses, scanResult),
    [responses, scanResult],
  );

  const products = recommendations.filter((r) => r.type === "product");
  const services = recommendations.filter((r) => r.type === "service");
  const packages = recommendations.filter((r) => r.type === "package");
  const summary = useMemo(
    () => generateSummary(responses, scanResult),
    [responses, scanResult],
  );

  const hasScan = !!scanResult;

  // Base delays adjusted based on presence of scanResult
  const p2Delay = hasScan ? 1.5 : 0;
  const p3Delay = hasScan ? 2.5 : 0.5;
  const p4Delay = hasScan ? 3.5 : 1.0;

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      {hasScan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-background p-8 rounded-2xl min-h-[40vh]"
        >
          {/* Phase 1: LEFT HALF */}
          <div className="flex flex-col items-center justify-center h-full border-b md:border-b-0 md:border-r border-border pb-8 md:pb-0">
            <ScoreRing
              score={scanResult!.overallScore}
              grade={scanResult!.grade}
            />
            <div className="mt-6 text-center space-y-1">
              <h3 className="text-xl font-bold text-foreground">
                {scanResult!.domain}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                Grade {scanResult!.grade}
              </p>
            </div>
          </div>

          {/* Phase 1: RIGHT HALF */}
          <div className="flex flex-col items-center justify-center h-full pt-8 md:pt-0">
            <div className="text-5xl sm:text-6xl font-extrabold text-destructive tracking-tight">
              <Counter valueString={scanResult!.penaltyExposure} />
            </div>
            <div className="mt-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Estimated penalty exposure
            </div>
          </div>
        </motion.div>
      )}

      {/* Phase 2: Context Slide */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: p2Delay,
          type: "spring",
          damping: 20,
        }}
        className="glass-card rounded-xl p-6 sm:p-8 border-l-4 border-l-primary"
      >
        <h3 className="text-xl font-bold text-foreground">
          Personalized Risk Summary
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {summary}
        </p>

        {hasScan && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Category Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scanResult!.categories.map((cat) => (
                <CategoryBar
                  key={cat.name}
                  name={cat.name}
                  score={cat.score}
                  maxScore={cat.maxScore}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Phase 3: Recommendations */}
      <div className="space-y-12">
        {products.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: p3Delay }}
          >
            <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" /> Recommended Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
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
            <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" /> Recommended Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
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
            <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" /> Package Offers
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Phase 4: Action Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: p4Delay }}
        className="flex flex-col gap-4 sm:flex-row pt-8 border-t border-border"
      >
        <Button variant="primary" size="lg" className="flex-1 text-lg py-6">
          <Download className="h-6 w-6 mr-2" />
          Download Full Report
        </Button>
        <Button variant="outline" size="lg" className="flex-1 text-lg py-6">
          <Calendar className="h-6 w-6 mr-2" />
          Book a Consultation
        </Button>
      </motion.div>
    </div>
  );
}
