import { ProductLanding } from '@/components/products/ProductLanding'
import { noticeCenter, noticeEdges, noticeNodes } from '@/lib/workflows'

const FAQS = [
  {
    question: 'Which notices do you support today?',
    answer:
      'Two: the privacy notice and the cookie policy. Children’s notices, vendor notices, AI disclosures, and in-product notices can be added on the same version history.',
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
      eyebrow="Product"
      title="Keep your privacy notices clear and up to date"
      lead="Manage your privacy notice and cookie policy in one place, and keep a copy of the exact wording each visitor saw. More notice types can be added."
      nodes={noticeNodes}
      edges={noticeEdges}
      center={noticeCenter}
      capabilities={[
        {
          title: 'Two notice types',
          body: 'Privacy notice and cookie policy. Draft, review, and publish from one place.',
        },
        {
          title: 'More types can be added',
          body: 'Children’s notices, vendor lists, AI disclosures, and in-product notices can use the same version history.',
        },
        {
          title: 'Linked to your purposes',
          body: 'Each notice links to the actual reasons you use people’s details, not a generic paragraph.',
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
          body: 'If someone complains, you can show which notice they saw.',
        },
      ]}
      notes={[
        {
          title: 'Notice',
          body: 'When you ask for consent, the Act requires you to tell people what data you collect, why, how to use their rights, and how to complain.',
        },
        {
          title: 'Consent depends on that notice',
          body: 'If your notice leaves out a purpose, consent for it is not informed. Your notices also need to match what your site actually does.',
        },
      ]}
      faqs={FAQS}
      nextHref="/consent-management"
      nextLabel="consent records after the notice"
    />
  )
}
