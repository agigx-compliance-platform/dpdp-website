import { useState, useEffect, useCallback } from 'react'
import type { QuestionnaireResponses, ScanResult } from '@/lib/types'

const STORAGE_KEY = 'agigx_questionnaire_v1'

export interface PersistedQuestionnaireState {
  formData: QuestionnaireResponses
  currentStep: number
  direction: number
  wantsScan: boolean
  scanId: string | null
  scanProgress: number
  issuesFound: number
  scanDone: boolean
  scanResult: ScanResult | null
}

const defaultState: PersistedQuestionnaireState = {
  formData: {
    role: '',
    orgType: '',
    journeyStage: '',
    dataTypes: [],
    priorities: [],
    supportType: [],
    wantsScan: true,
    websiteUrl: '',
    email: '',
    name: '',
    company: '',
    consentGiven: false,
  },
  currentStep: 0,
  direction: 1,
  wantsScan: true,
  scanId: null,
  scanProgress: 0,
  issuesFound: 0,
  scanDone: false,
  scanResult: null,
}

export function usePersistedQuestionnaireState() {
  const [state, setState] = useState<PersistedQuestionnaireState>(defaultState)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount and setup sync
  useEffect(() => {
    const loadState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setState(JSON.parse(stored))
        } else {
          setState(defaultState)
        }
      } catch (e) {
        console.error('Failed to parse questionnaire state', e)
      }
    }

    loadState()
    setIsInitialized(true)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadState()
    }
    const handleCustom = () => loadState()

    window.addEventListener('storage', handleStorage)
    window.addEventListener('agigx-questionnaire-sync', handleCustom)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('agigx-questionnaire-sync', handleCustom)
    }
  }, [])

  const notifySync = useCallback(() => {
    setTimeout(() => window.dispatchEvent(new Event('agigx-questionnaire-sync')), 0)
  }, [])

  const clearPersistedState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
    notifySync()
  }, [notifySync])

  const updateState = useCallback((updates: Partial<PersistedQuestionnaireState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    notifySync()
  }, [notifySync])

  const updateFormData = useCallback((field: keyof QuestionnaireResponses, value: any) => {
    setState((prev) => {
      const next = { ...prev, formData: { ...prev.formData, [field]: value } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    notifySync()
  }, [notifySync])

  return {
    ...state,
    isInitialized,
    updateState,
    updateFormData,
    clearPersistedState,
  }
}
