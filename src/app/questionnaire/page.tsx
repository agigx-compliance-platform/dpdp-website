'use client'

import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

export default function QuestionnairePage() {
  return (
    <SectionWrapper className="pt-32 md:pt-40 pb-16">
      <div className="mx-auto mb-10 max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Assessment
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Map your DPDP path
        </h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          Eight questions, optional public-site scan, then a ledger of products and services that match the answers.
        </p>
      </div>
      <div className="mx-auto max-w-5xl ledger-panel overflow-hidden">
        <QuestionnaireWizard />
      </div>
    </SectionWrapper>
  )
}
