'use client'

import { useEffect, useCallback } from 'react'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { QuestionnaireWizard } from './QuestionnaireWizard'
import { prewarmConsentApi } from '@/lib/consent-api-prewarm'
import { cn } from '@/lib/utils'
import { DialogRoot, DialogContent, DialogTitle } from '@/components/ui/Dialog'

export function QuestionnaireModal() {
  const { isModalOpen, closeModal } = useQuestionnaireStore()

  useEffect(() => {
    if (isModalOpen) {
      void prewarmConsentApi('questionnaire-modal')
    }
  }, [isModalOpen])

  const handleClose = useCallback(() => {
    closeModal()
  }, [closeModal])

  return (
    <DialogRoot open={isModalOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent
        className={cn(
          'max-h-[90vh] w-full overflow-hidden p-0',
          'max-w-2xl',
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">DPDP assessment</DialogTitle>
        <QuestionnaireWizard />
      </DialogContent>
    </DialogRoot>
  )
}
