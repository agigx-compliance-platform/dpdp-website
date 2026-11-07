import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { FaqSection } from '@/components/seo/FaqSection'
import { PRICING_FAQS } from './pricing-faqs'

const FREE_TOOLS = [
  {
    title: 'Website scan',
    body: 'See what your public website collects and which privacy basics are missing.',
    href: '/privacy-pitstop',
    action: 'Scan your website',
  },
  {
    title: 'Readiness assessment',
    body: 'Answer 10 questions and get suggestions on where to start.',
    href: '/questionnaire',
    action: 'Check if you’re ready',
  },
]

const PACKAGES = [
  {
    title: 'Software',
    summary: 'The tools for your team to do the daily work.',
    includes: ['Cookie banner and privacy notices', 'Consent records', 'Handling people’s data requests', 'Finding personal data', 'Vendor tracking'],
  },
  {
    title: 'Readiness',
    summary: 'Find out what applies and what to fix first.',
    includes: ['What applies to your business', 'Gap assessment', 'A prioritised plan', 'Audit evidence support'],
  },
  {
    title: 'Implementation',
    summary: 'Help putting processes and tools in place.',
    includes: ['Consent and notice setup', 'Connecting your systems', 'Vendor contract reviews', 'Breach response plan'],
  },
  {
    title: 'Managed privacy',
    summary: 'Our team runs the daily work with you.',
    includes: ['A named privacy lead', 'People’s requests and complaints', 'Regular reports', 'Team training'],
  },
]

const PRICE_FACTORS = [
  { title: 'What you choose', body: 'Which software features and services you need.' },
  { title: 'Your size', body: 'How many websites, apps, and people’s records are involved.' },
  { title: 'Your systems', body: 'How many systems need to be connected.' },
  { title: 'How it is hosted', body: 'Our cloud service, or your own environment.' },
  { title: 'How much help you want', body: 'From occasional advice to a team running the daily work.' },
]

const NEXT_STEPS = [
  { title: 'Tell us what you need', body: 'Share a few details about your business using the form.' },
  { title: 'Have a short call', body: 'We ask a few questions and show you the parts that matter to you.' },
  { title: 'Get a written quote', body: 'We send you a quote for what we discussed.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-10 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Pricing based on what you need</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Every organisation holds different data in different systems, so we quote for each one individually. Tell us
            about yours and we will send you a price.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact?intent=pricing">
              <Button variant="primary" size="lg">
                Contact us for pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">What you can buy</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">Choose one or combine them.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <li key={pkg.title} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
              <h3 className="text-lg font-semibold">{pkg.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.summary}</p>
              <ul className="mb-6 mt-4 space-y-2">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact?intent=pricing" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Get pricing
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Start for free</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Both tools are free and give you an indication of where you stand. They are not legal advice.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {FREE_TOOLS.map((tool) => (
            <li key={tool.title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
              <h3 className="text-base font-semibold">{tool.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
              <Link
                href={tool.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {tool.action}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper className="py-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">What affects the price</h2>
            <dl className="mt-6 space-y-4">
              {PRICE_FACTORS.map((factor) => (
                <div key={factor.title}>
                  <dt className="text-sm font-semibold text-foreground">{factor.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{factor.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">How to get a quote</h2>
            <ol className="mt-6 space-y-4">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SectionWrapper>

      <FaqSection title="Questions about pricing" faqs={PRICING_FAQS} />
    </div>
  )
}
