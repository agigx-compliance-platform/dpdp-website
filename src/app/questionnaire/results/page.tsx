'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ResultsView } from '@/components/questionnaire/ResultsView'
import type { QuestionnaireResponses, ScanResult } from '@/lib/types'

function ResultsContent() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get('data')
  const scanParam = searchParams.get('scan')

  if (!dataParam) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">No Results Yet</h2>
        <p className="text-muted-foreground">
          Complete the questionnaire first to get personalized recommendations.
        </p>
        <Link href="/questionnaire">
          <Button variant="primary">
            <ArrowLeft className="h-4 w-4" />
            Start Questionnaire
          </Button>
        </Link>
      </div>
    )
  }

  let responses: QuestionnaireResponses
  let scanResult: ScanResult | undefined

  try {
    responses = JSON.parse(decodeURIComponent(atob(dataParam)))
    if (scanParam) {
      scanResult = JSON.parse(decodeURIComponent(atob(scanParam)))
    }
  } catch {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Invalid Data</h2>
        <p className="text-muted-foreground">
          Something went wrong. Please try the questionnaire again.
        </p>
        <Link href="/questionnaire">
          <Button variant="primary">
            <ArrowLeft className="h-4 w-4" />
            Restart Questionnaire
          </Button>
        </Link>
      </div>
    )
  }

  return <ResultsView responses={responses} scanResult={scanResult} />
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </main>
  )
}
