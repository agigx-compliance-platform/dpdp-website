import { QuestionnaireResponses } from '@/lib/types'

export function calculateRiskScore(formData: Partial<QuestionnaireResponses>): number {
  // Returns 0–100
  let score = 0

  // Journey stage: earlier = more risk
  const journeyRisk: Record<string, number> = {
    'just-starting': 30,
    'have-policies': 18,
    'know-gaps': 12,
    'need-validation': 6,
    'ongoing-support': 3,
  }
  score += journeyRisk[formData.journeyStage ?? ''] ?? 0

  // Data types: higher risk types add more
  const dataRisk: Record<string, number> = {
    children: 15,
    health: 12,
    financial: 10,
    'ai-data': 8,
    behavioral: 7,
    employee: 5,
    customer: 4,
    'third-party': 4,
  }
  for (const dt of formData.dataTypes ?? []) {
    score += dataRisk[dt] ?? 0
  }

  // Cap at 100
  return Math.min(score, 100)
}
