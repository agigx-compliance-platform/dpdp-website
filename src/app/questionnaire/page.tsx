'use client'

import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard'

export default function QuestionnairePage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find Your DPDP Compliance Path
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Answer a few questions and get personalized product and service recommendations.
        </p>
      </div>
      <QuestionnaireWizard />
    </main>
  )
}
