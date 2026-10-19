'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ResultsView } from '@/components/questionnaire/ResultsView'
import { readQuestionnaireResults } from '@/lib/questionnaire-results'
import type { StoredQuestionnaireResults } from '@/lib/questionnaire-results'

export default function ResultsPage() {
  const [stored, setStored] = useState<StoredQuestionnaireResults | null | undefined>(undefined)

  useEffect(() => {
    queueMicrotask(() => setStored(readQuestionnaireResults()))
  }, [])

  if (stored === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading results…</p>
      </main>
    )
  }

  if (!stored) {
    return (
      <main className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">No results yet</h2>
        <p className="text-muted-foreground">
          Complete the questionnaire first to get personalised recommendations.
        </p>
        <Link href="/questionnaire">
          <Button variant="primary">
            <ArrowLeft className="h-4 w-4" />
            Start Questionnaire
          </Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <ResultsView responses={stored.responses} scanResult={stored.scanResult} />
    </main>
  )
}
