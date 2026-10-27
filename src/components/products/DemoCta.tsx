import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

/** Closing band on overview pages: the detail lives in the demo, not on the page. */
export function DemoCta({ title, body }: { title: string; body: string }) {
  return (
    <SectionWrapper className="py-10 md:py-14">
      <div className="grid gap-8 rounded-3xl border border-border bg-background-secondary p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <div className="flex flex-col justify-center gap-3 md:items-end">
          <Link href="/contact">
            <Button variant="primary" size="lg">
              See it in a demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/privacy-pitstop" className="text-sm text-muted-foreground hover:text-foreground">
            Or scan your site free first
          </Link>
        </div>
      </div>
    </SectionWrapper>
  )
}
