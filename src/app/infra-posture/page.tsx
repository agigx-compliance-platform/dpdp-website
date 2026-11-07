import { ProductLanding } from '@/components/products/ProductLanding'
import { infraCenter, infraEdges, infraNodes } from '@/lib/workflows'

const FAQS = [
  {
    question: 'What do these checks cover?',
    answer:
      'Cloud accounts and clusters where personal data may be kept, on AWS, Azure, GCP, and Kubernetes. We look for settings that could expose that data.',
  },
  {
    question: 'Is this a replacement for a security programme?',
    answer:
      'No. It looks at the same systems from a privacy angle: open storage, accounts with too much access, and logs that should not be public. Your security team still makes the fixes.',
  },
  {
    question: 'Does it scan source code as well?',
    answer:
      'Yes. We check code for personal details left in the open and for paths that skip a consent check. They appear in the same list as cloud issues.',
  },
]

export default function InfraPosturePage() {
  return (
    <ProductLanding
      current="/infra-posture"
      eyebrow="Product"
      title="Spot risky settings that could expose personal data"
      lead="Find storage left open, accounts with too much access, and personal details left in code, across AWS, Azure, GCP, and Kubernetes. More environments can be added."
      nodes={infraNodes}
      edges={infraEdges}
      center={infraCenter}
      capabilities={[
        {
          title: 'Cloud accounts',
          body: 'AWS, Azure, and GCP settings that could expose personal data, such as public storage, open logs, and too much access.',
        },
        {
          title: 'Kubernetes',
          body: 'Kubernetes workloads and attached storage in the same list, not a separate report.',
        },
        {
          title: 'Code repositories',
          body: 'Personal details left in code, and paths that skip a consent or notice check.',
        },
        {
          title: 'One list of issues',
          body: 'Open issues, who owns them, and which duty each one relates to.',
        },
        {
          title: 'More environments can be added',
          body: 'Other clouds and your own data centres can use the same list.',
        },
        {
          title: 'Adds to your data list',
          body: 'A system found by these checks can be added to your list of personal data systems.',
        },
      ]}
      notes={[
        {
          title: 'Reasonable security safeguards',
          body: 'The Act requires reasonable security for personal data. Storage left open to the public is a clear risk.',
        },
        {
          title: 'Breach readiness',
          body: 'Knowing which accounts hold personal data helps you work out who was affected by a breach.',
        },
      ]}
      faqs={FAQS}
      nextHref="/data-discovery"
      nextLabel="data discovery on the stores you already run"
    />
  )
}
