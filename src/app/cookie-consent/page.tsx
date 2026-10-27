import { ProductLanding } from '@/components/products/ProductLanding'
import { IllustrationSection } from '@/components/products/IllustrationSection'
import { ConsentBannerMockup } from '@/components/illustrations'
import { cookieCenter, cookieEdges, cookieNodes } from '@/lib/workflows'

const FAQS = [
  {
    question: 'Is a cookie banner the same as consent?',
    answer:
      'No. The banner is how a visitor is asked. Consent is the purpose grant, the block on non-essential tags, and the record you can produce later. A banner that cannot reject as easily as it accepts is not a working control.',
  },
  {
    question: 'How many banner layouts do you ship today?',
    answer:
      'Two: a bar and a modal. More layouts, languages, and location rules can be added for the same consent record.',
  },
  {
    question: 'Does the tool work for DPDP, not only GDPR templates?',
    answer:
      'Yes. Purpose split, a real reject path, and a notice that names what actually loads are the tests. A European “legitimate interest” default does not carry over.',
  },
]

export default function CookieConsentPage() {
  return (
    <ProductLanding
      current="/cookie-consent"
      eyebrow="Platform"
      title="Cookie consent for Indian sites"
      lead="Two banner layouts ship today: bar and modal. Scan what the page actually sets, block non-essential tags until a grant, and keep a receipt. More layouts can be added without changing the consent record."
      nodes={cookieNodes}
      edges={cookieEdges}
      center={cookieCenter}
      capabilities={[
        {
          title: 'Two layouts now',
          body: 'Bar and modal. Brand colour, copy, and button labels follow your notice. Further layouts can be added.',
        },
        {
          title: 'Scan what loaded',
          body: 'See cookies and tags on the live page. Categories that fire before a choice stay visible as a finding, not a guess.',
        },
        {
          title: 'Block until grant',
          body: 'Non-essential scripts wait. A decline is as easy to reach as an accept. Withdrawal uses the same purpose IDs.',
        },
        {
          title: 'Languages and regions',
          body: 'English and Hindi on the two layouts today. More languages and location rules can be added.',
        },
        {
          title: 'Preference centre',
          body: 'The visitor can reopen the same purposes later. The record is the same one the banner wrote.',
        },
        {
          title: 'Proof',
          body: 'Who was asked, what they chose, which notice version, and when they withdrew.',
        },
      ]}
      notes={[
        {
          title: 'Notice and consent',
          body: 'The Act requires a clear notice of purposes and consent that is free, specific, informed, and unambiguous. The cookie banner is one place that duty shows up.',
        },
        {
          title: 'Withdrawal',
          body: 'A grant that cannot be withdrawn as easily as it was given is not a complete control. The preference centre uses the same purposes.',
        },
      ]}
      faqs={FAQS}
      nextHref="/policy-notice"
      nextLabel="policy and notice management"
    >
      <IllustrationSection
        eyebrow="What visitors see"
        title="The same banner on desktop and mobile web"
        lead="A bar on wide screens and a purpose sheet on phones. Both write the same consent record, and both put reject next to accept."
      >
        <ConsentBannerMockup />
      </IllustrationSection>
    </ProductLanding>
  )
}
