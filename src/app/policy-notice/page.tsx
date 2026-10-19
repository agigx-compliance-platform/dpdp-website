import { ProductLanding } from '@/components/products/ProductLanding'
import { noticeCenter, noticeEdges, noticeNodes } from '@/lib/workflows'

const FAQS = [
  {
    question: 'Which notices do you support today?',
    answer:
      'Two: the privacy notice and the cookie policy. Children’s notices, processor notices, AI disclosures, and in-product notices can be added on the same version history.',
  },
  {
    question: 'Why is a notice not just a page on the website?',
    answer:
      'The Act requires the person to be told purposes, rights, and how to reach the grievance officer, in language they can use. The version they saw has to be the version you can produce later.',
  },
  {
    question: 'What happens when the notice text changes?',
    answer:
      'A new version is stored. Prior consent is not stretched to a new purpose. Where the purpose set changed, the visitor is asked again.',
  },
]

export default function PolicyNoticePage() {
  return (
    <ProductLanding
      current="/policy-notice"
      eyebrow="Platform"
      title="Policy and notice management"
      lead="Two notice types ship today: the privacy notice and the cookie policy. Version them, map them to purposes, and keep the text the visitor actually saw. More notice types can be added."
      nodes={noticeNodes}
      edges={noticeEdges}
      center={noticeCenter}
      capabilities={[
        {
          title: 'Two types now',
          body: 'Privacy notice and cookie policy. Draft, review, and publish from one place.',
        },
        {
          title: 'More types can be added',
          body: 'Children’s notice, processor list, AI disclosure, and in-product notices use the same versioning when you add them.',
        },
        {
          title: 'Purpose mapping',
          body: 'Each published notice points at the purposes the fiduciary actually runs, not a generic paragraph.',
        },
        {
          title: 'Version history',
          body: 'What changed, when it went live, and which consent records still attach to the old text.',
        },
        {
          title: 'Where it appears',
          body: 'Website, preference centre, and the same wording the banner points to. More surfaces can be added.',
        },
        {
          title: 'Proof of what was shown',
          body: 'If a grievance asks which notice the person saw, the answer is a version, not a CMS guess.',
        },
      ]}
      notes={[
        {
          title: 'Notice',
          body: 'The Act requires the Data Principal to be informed of personal data, purposes, rights, and how to complain, before or at the time of collection.',
        },
        {
          title: 'Consent depends on that notice',
          body: 'A grant against a notice that omitted a purpose is not informed. Cookie policy and privacy notice have to stay aligned with what the site loads.',
        },
      ]}
      faqs={FAQS}
      nextHref="/consent-management"
      nextLabel="consent lifecycle after the notice"
    />
  )
}
