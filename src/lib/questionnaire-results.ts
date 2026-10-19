import type { QuestionnaireResponses, ScanResult } from './types'

export const QUESTIONNAIRE_RESULTS_KEY = 'agigx_questionnaire_results_v1'

export type StoredQuestionnaireResults = {
  responses: QuestionnaireResponses
  scanResult?: ScanResult
}

export function storeQuestionnaireResults(payload: StoredQuestionnaireResults) {
  sessionStorage.setItem(QUESTIONNAIRE_RESULTS_KEY, JSON.stringify(payload))
}

export function readQuestionnaireResults(): StoredQuestionnaireResults | null {
  try {
    const raw = sessionStorage.getItem(QUESTIONNAIRE_RESULTS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredQuestionnaireResults
    if (!parsed?.responses || typeof parsed.responses !== 'object') return null
    return parsed
  } catch {
    return null
  }
}
