import { useState, useEffect, useCallback, useRef } from 'react'
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
  /** Monotonic write counter — prevents stale cross-instance sync from rolling back state. */
  _seq?: number
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

function readPersistedState(): PersistedQuestionnaireState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as PersistedQuestionnaireState
  } catch {
    return null
  }
}

function latestPersistedState(
  local: PersistedQuestionnaireState
): PersistedQuestionnaireState {
  const stored = readPersistedState()
  if (!stored) return local
  return (stored._seq ?? 0) >= (local._seq ?? 0) ? stored : local
}

export function usePersistedQuestionnaireState() {
  const [state, setState] = useState<PersistedQuestionnaireState>(defaultState)
  const stateRef = useRef(defaultState)
  const [isInitialized, setIsInitialized] = useState(false)
  const lastAppliedSeqRef = useRef(0)

  const applyStoredState = useCallback((stored: PersistedQuestionnaireState) => {
    const seq = stored._seq ?? 0
    if (seq < lastAppliedSeqRef.current) return
    lastAppliedSeqRef.current = seq
    stateRef.current = stored
    setState(stored)
  }, [])

  const persistNextState = useCallback(
    (prev: PersistedQuestionnaireState, updates: Partial<PersistedQuestionnaireState>) => {
      const seq = (prev._seq ?? 0) + 1
      const next = { ...prev, ...updates, _seq: seq }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      lastAppliedSeqRef.current = seq
      return next
    },
    []
  )

  // Load from localStorage on mount and setup sync
  useEffect(() => {
    const loadState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          applyStoredState(JSON.parse(stored))
        } else {
          lastAppliedSeqRef.current = 0
          stateRef.current = defaultState
          setState(defaultState)
        }
      } catch (e) {
        console.error('Failed to parse questionnaire state', e)
      }
    }

    loadState()
    queueMicrotask(() => setIsInitialized(true))

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadState()
    }
    const handleCustom = (e: Event) => {
      const seq = (e as CustomEvent<{ seq?: number }>).detail?.seq
      if (seq != null && seq < lastAppliedSeqRef.current) return
      loadState()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('agigx-questionnaire-sync', handleCustom)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('agigx-questionnaire-sync', handleCustom)
    }
  }, [applyStoredState])

  const notifySync = useCallback((seq: number) => {
    setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent('agigx-questionnaire-sync', { detail: { seq } })
        ),
      0
    )
  }, [])

  const clearPersistedState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    lastAppliedSeqRef.current = 0
    stateRef.current = defaultState
    setState(defaultState)
    notifySync(0)
  }, [notifySync])

  const updateState = useCallback(
    (updates: Partial<PersistedQuestionnaireState>) => {
      const base = latestPersistedState(stateRef.current)
      const next = persistNextState(base, updates)
      stateRef.current = next
      setState(next)
      notifySync(next._seq ?? 0)
    },
    [notifySync, persistNextState]
  )

  const updateFormData = useCallback(
    (field: keyof QuestionnaireResponses, value: any) => {
      const base = latestPersistedState(stateRef.current)
      const next = persistNextState(base, {
        formData: { ...base.formData, [field]: value },
      })
      stateRef.current = next
      setState(next)
      notifySync(next._seq ?? 0)
    },
    [notifySync, persistNextState]
  )

  return {
    ...state,
    isInitialized,
    updateState,
    updateFormData,
    clearPersistedState,
  }
}
