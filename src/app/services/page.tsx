import Link from 'next/link'
import { ArrowRight, Brain, ChevronDown, Compass, Headphones, Wrench } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { BreachDuties } from '@/components/legal/BreachDuties'
import { PenaltyTable } from '@/components/legal/PenaltyTable'
import { ServicesPlatformStrip } from '@/components/services/ServicesPlatformStrip'
import { FaqSection } from '@/components/seo/FaqSection'
import { SERVICE_FAQS } from '@/lib/dpdp-faqs'

type Offering = { title: string; body: string; forWho: string }
type OfferingGroup = { title: string; offerings: Offering[] }

const PACKAGES: {
  id: string
  icon: typeof Compass
  title: string
  summary: string
  groups: OfferingGroup[]
}[] = [
  {
    id: 'readiness',
    icon: Compass,
    title: 'Readiness',
    summary: 'Find out what applies to you, where the gaps are, and what to fix first.',
    groups: [
      {
        title: 'Advice',
        offerings: [
          {
            title: 'DPDP readiness advice',
            body: 'Work out which duties apply to you and get a prioritised plan to meet them.',
            forWho: 'Organisations at the start of their DPDP work',
          },
          {
            title: 'Privacy notices and consent design',
            body: 'Write clear notices and consent requests, with withdrawal as easy as agreement.',
            forWho: 'Organisations that need notices and consent designed',
          },
          {
            title: 'Rights, complaints, and DPO advice',
            body: 'Set up how people can see, correct, and delete their data and raise complaints, including parental consent for children’s data.',
            forWho: 'Organisations setting up request handling',
          },
          {
            title: 'Significant Data Fiduciary readiness',
            body: 'Prepare for the extra duties if you are, or could be, named a Significant Data Fiduciary.',
            forWho: 'Large organisations handling a lot of personal data',
          },
          {
            title: 'Executive advice on data transfers',
            body: 'Review where data goes outside India, including cloud services and group companies, and any restrictions that apply.',
            forWho: 'Organisations with international data flows',
          },
        ],
      },
      {
        title: 'Assessment and audit support',
        offerings: [
          {
            title: 'Readiness assessment',
            body: 'Check your position across 6 areas and 18 checkpoints.',
            forWho: 'Organisations checking how ready they are',
          },
          {
            title: 'Gap assessment',
            body: 'A detailed list of gaps, with a prioritised plan and effort and cost estimates.',
            forWho: 'Organisations that need a full gap analysis',
          },
          {
            title: 'Control reviews',
            body: 'Test whether your privacy and security measures are well designed and working in practice.',
            forWho: 'Organisations validating what they already have',
          },
          {
            title: 'Impact assessments and algorithm checks',
            body: 'Support with data protection impact assessments and due diligence on algorithmic software.',
            forWho: 'Significant Data Fiduciaries',
          },
          {
            title: 'Audit evidence and reporting',
            body: 'Review your evidence, support internal audits, and prepare reports for your board.',
            forWho: 'Organisations preparing for an audit',
          },
        ],
      },
    ],
  },
  {
    id: 'implementation',
    icon: Wrench,
    title: 'Implementation',
    summary: 'Put the right processes and tools in place across your website, systems, and vendors.',
    groups: [
      {
        title: 'Privacy operations',
        offerings: [
          {
            title: 'Find and map personal data',
            body: 'Build a current list of the personal data you hold, where it is, and where it goes.',
            forWho: 'Organisations without a clear view of their data',
          },
          {
            title: 'Consent, requests, and complaints',
            body: 'Run consent from collection to withdrawal, and track people’s requests and complaints to a deadline.',
            forWho: 'Organisations putting consent and rights into practice',
          },
          {
            title: 'Data retention and deletion',
            body: 'Set how long data is kept, and delete it when it is no longer needed, with evidence.',
            forWho: 'Organisations with gaps in data retention',
          },
          {
            title: 'Vendors and data sharing',
            body: 'Review vendor contracts, including audit rights, subcontractors, and breach reporting.',
            forWho: 'Organisations with many vendors',
          },
          {
            title: 'Privacy team setup',
            body: 'Decide who owns what, how teams work together, and what goes to the board.',
            forWho: 'Organisations building a lasting privacy programme',
          },
        ],
      },
      {
        title: 'Technical setup',
        offerings: [
          {
            title: 'Privacy workflows',
            body: 'Set up banners, a privacy centre, and request handling on our platform.',
            forWho: 'Engineering teams putting privacy controls in place',
          },
          {
            title: 'Automated retention',
            body: 'Automate deletion on a schedule and keep a record that it happened.',
            forWho: 'Organisations automating how long data is kept',
          },
          {
            title: 'Evidence and reporting',
            body: 'Consent records, dashboards, and scores, with reports your board can read.',
            forWho: 'Organisations that need evidence ready for audits',
          },
          {
            title: 'Connect your systems',
            body: 'Connect the platform with your applications, cloud services, and data systems.',
            forWho: 'Organisations fitting this into existing systems',
          },
          {
            title: 'Ongoing checks',
            body: 'Keep watching your public websites and build privacy checks into how you release software.',
            forWho: 'Organisations that want continuous checks',
          },
        ],
      },
      {
        title: 'Data transfers and hosting',
        offerings: [
          {
            title: 'Data location advice',
            body: 'Review which data leaves India and where your cloud providers keep it.',
            forWho: 'Organisations using international cloud services',
          },
          {
            title: 'Transfer controls',
            body: 'Set up contracts, impact assessments, and sharing rules, with documents you can show.',
            forWho: 'Multinationals with cross-border data flows',
          },
          {
            title: 'Country risk review',
            body: 'Review foreign access risk and where your vendors’ subcontractors are.',
            forWho: 'Organisations with global operations',
          },
          {
            title: 'Hosting design',
            body: 'Choose how to host systems when data needs to stay in India, including under any restrictions the government notifies.',
            forWho: 'Organisations designing their cloud setup',
          },
          {
            title: 'Transfer evidence',
            body: 'Keep documents and reports on cross-border data ready for review.',
            forWho: 'Organisations preparing for audits',
          },
        ],
      },
      {
        title: 'Security and breach readiness',
        offerings: [
          {
            title: 'Security review',
            body: 'Review encryption, access controls, and logs, including a gap assessment against ISO 27001 or NIST CSF.',
            forWho: 'Organisations reviewing their security',
          },
          {
            title: 'Exposure testing',
            body: 'Look for ways personal data could leak or be reached without permission.',
            forWho: 'Organisations managing privacy risk early',
          },
          {
            title: 'Breach response plan',
            body: 'Clear steps and templates for telling affected people and the regulator on time, aligned with CERT-In reporting.',
            forWho: 'Organisations building breach response',
          },
          {
            title: 'Breach communications',
            body: 'Coordinate with vendors and the regulator, and write clear notices to the people affected.',
            forWho: 'Organisations with breach reporting duties',
          },
          {
            title: 'Practice exercises',
            body: 'Practise a breach with your team, and get support and lessons learned after a real one.',
            forWho: 'Organisations testing how ready they are',
          },
        ],
      },
    ],
  },
  {
    id: 'managed',
    icon: Headphones,
    title: 'Managed privacy',
    summary: 'Let our team run the daily privacy work with you, if you would rather not build a team.',
    groups: [
      {
        title: 'Ongoing support',
        offerings: [
          {
            title: 'Privacy office and virtual DPO',
            body: 'A named privacy lead with board reporting who works with the regulator for you. Significant Data Fiduciaries must also meet the Act’s requirements for their Data Protection Officer.',
            forWho: 'Organisations that need privacy leadership',
          },
          {
            title: 'Managed privacy operations',
            body: 'We handle people’s requests, complaints, and consent operations, with agreed response times.',
            forWho: 'Organisations outsourcing privacy work',
          },
          {
            title: 'Reporting and incident support',
            body: 'Regular privacy reports, AI governance support, and 24/7 help coordinating a breach response.',
            forWho: 'Organisations that need ongoing governance support',
          },
          {
            title: 'Co-managed support',
            body: 'We work alongside your team, or set things up and hand them over.',
            forWho: 'Enterprises with existing privacy teams',
          },
          {
            title: 'Training',
            body: 'DPDP training for legal, IT, HR, and operations teams, with yearly refreshers.',
            forWho: 'Organisations building privacy awareness',
          },
        ],
      },
    ],
  },
  {
    id: 'ai-governance',
    icon: Brain,
    title: 'AI governance',
    summary: 'Set clear rules for using AI tools when personal data is involved.',
    groups: [
      {
        title: 'Using AI responsibly',
        offerings: [
          {
            title: 'AI governance strategy',
            body: 'Decide who is accountable for AI, and what gets reported to the board.',
            forWho: 'Organisations using AI at scale',
          },
          {
            title: 'AI policy and risk',
            body: 'List where you use AI, rank the risks, and set rules for use, buying, and vendors.',
            forWho: 'Organisations that need AI rules',
          },
          {
            title: 'Responsible AI controls',
            body: 'Human oversight, clear explanations, and bias monitoring.',
            forWho: 'Organisations putting responsible AI into practice',
          },
          {
            title: 'Generative AI rules',
            body: 'Review AI vendors, and set rules for personal data in prompts, training, and outputs.',
            forWho: 'Organisations using generative AI tools',
          },
          {
            title: 'AI oversight team',
            body: 'Set up a cross-team group with a clear role and reporting lines.',
            forWho: 'Large enterprises that need formal AI oversight',
          },
        ],
      },
    ],
  },
]

function OfferingItem({ offering }: { offering: Offering }) {
  return (
    <details className="group border-b border-border last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {offering.title}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-4 text-sm leading-relaxed text-muted-foreground">
        <p>{offering.body}</p>
        <p className="mt-2">
          <span className="font-medium text-foreground">Best for: </span>
          {offering.forWho}
        </p>
      </div>
    </details>
  )
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pb-10 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Choose how much help you want</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Get advice, get help putting things in place, or have us run the daily work. Start with one package and add
            more when you need it.
          </p>
          <nav aria-label="Service packages" className="mt-8 flex flex-wrap justify-center gap-2">
            {PACKAGES.map((pkg) => (
              <a
                key={pkg.id}
                href={`#${pkg.id}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {pkg.title}
              </a>
            ))}
          </nav>
        </div>
      </SectionWrapper>

      {PACKAGES.map((pkg) => (
        <SectionWrapper key={pkg.id} id={pkg.id} className="scroll-mt-20 py-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <pkg.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">{pkg.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{pkg.summary}</p>
              <Link href="/contact?intent=services" className="mt-5 inline-flex">
                <Button variant="outline">
                  Talk to us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-6">
              {pkg.groups.map((group) => (
                <div key={group.title} className="rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-sm)]">
                  <h3 className="pb-2 text-sm font-semibold text-primary">{group.title}</h3>
                  {group.offerings.map((offering) => (
                    <OfferingItem key={offering.title} offering={offering} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      ))}

      <ServicesPlatformStrip />

      <SectionWrapper id="penalties" className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">What the law says about penalties</h2>
        <p className="mb-6 mt-3 max-w-2xl text-muted-foreground">
          The Act sets a maximum for each type of failure. We do not estimate what a business might be fined, because
          nobody can know that in advance.
        </p>
        <PenaltyTable />
      </SectionWrapper>

      <SectionWrapper id="breach-reporting" className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">What to do after a data breach</h2>
        <p className="mb-6 mt-3 max-w-2xl text-muted-foreground">
          There are three separate steps under the DPDP Rules. It is more than a single 72-hour deadline.
        </p>
        <BreachDuties />
      </SectionWrapper>

      <FaqSection title="Questions about our services" faqs={SERVICE_FAQS} />

      <SectionWrapper className="py-10 md:py-14">
        <div className="rounded-3xl border border-border bg-background-secondary p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Not sure which you need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Answer a few questions and we will suggest where to start. It is free.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/questionnaire">
              <Button variant="primary" size="lg">
                Check if you&apos;re ready
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                How pricing works
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
