import { ProductLanding } from '@/components/products/ProductLanding'
import { infraCenter, infraEdges, infraNodes } from '@/lib/workflows'

const FAQS = [
  {
    question: 'What does infrastructure posture cover?',
    answer:
      'Cloud accounts and clusters where personal data may sit: AWS, Azure, GCP, and Kubernetes. Findings are the misconfigurations that make that data reachable, not a generic security score.',
  },
  {
    question: 'Is this a replacement for a security programme?',
    answer:
      'No. It is the privacy view of the same estate: open storage, over-broad identity, and logs that should not be public. Security teams still own the fix path.',
  },
  {
    question: 'Does it scan source code as well?',
    answer:
      'Yes. Repositories are checked for identifiers left in the open and for paths that skip a consent check. Findings join the same posture list as cloud items.',
  },
]

export default function InfraPosturePage() {
  return (
    <ProductLanding
      current="/infra-posture"
      eyebrow="Platform"
      title="Infrastructure posture"
      lead="See cloud and code the way a privacy duty sees them: storage left open, identities that can reach personal data, and repositories that leak identifiers. AWS, Azure, GCP, and Kubernetes today. More estates can be added."
      nodes={infraNodes}
      edges={infraEdges}
      center={infraCenter}
      capabilities={[
        {
          title: 'Cloud accounts',
          body: 'AWS, Azure, and GCP. Findings that put personal data in reach: public storage, open logs, over-broad roles.',
        },
        {
          title: 'Clusters',
          body: 'Kubernetes workloads and attached storage in the same list, not a separate report.',
        },
        {
          title: 'Code repositories',
          body: 'Identifiers committed in the open, and flows that skip a consent or notice check.',
        },
        {
          title: 'One posture list',
          body: 'Open items, owners, and whether the duty is a safeguard, a notice gap, or a rights gap.',
        },
        {
          title: 'More estates can be added',
          body: 'Further clouds and on-prem estates use the same finding list when you add them.',
        },
        {
          title: 'Feeds discovery',
          body: 'A store the posture scan finds can be added to the personal-data inventory. It does not stay a nameless alert.',
        },
      ]}
      notes={[
        {
          title: 'Reasonable security safeguards',
          body: 'The Act requires safeguards on personal data. An open bucket of identifiers is that duty failing, not a generic “cloud hygiene” item.',
        },
        {
          title: 'Breach readiness',
          body: 'Knowing which accounts hold personal data is how a fiduciary answers who was affected. Posture is an input to that list.',
        },
      ]}
      faqs={FAQS}
      nextHref="/data-discovery"
      nextLabel="data discovery on the stores you already run"
    />
  )
}
