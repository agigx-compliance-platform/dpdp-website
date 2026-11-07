import { ProductLanding } from '@/components/products/ProductLanding'
import { IllustrationSection } from '@/components/products/IllustrationSection'
import { ConsentBannerMockup } from '@/components/illustrations'
import { cookieCenter, cookieEdges, cookieNodes } from '@/lib/workflows'

const FAQS = [
  {
    question: 'Is a cookie banner the same as consent?',
    answer:
      'No. The banner is how you ask. Consent also means holding back non-essential cookies until the visitor agrees, and keeping a record you can show later.',
  },
  {
    question: 'How many banner layouts do you offer?',
    answer:
      'Two: a bar and a pop-up. More layouts, languages, and location rules can be added.',
  },
  {
    question: 'Does the tool work for DPDP, not only GDPR templates?',
    answer:
      'Yes. It offers choice by purpose, a real way to say no, and a notice that says what actually loads.',
  },
]

export default function CookieConsentPage() {
  return (
    <ProductLanding
      current="/cookie-consent"
      eyebrow="Product"
      title="Cookie banner for websites in India"
      lead="Ask visitors before non-essential cookies run, give them a real choice, and keep a record. Two banner layouts today, a bar and a pop-up. More can be added."
      nodes={cookieNodes}
      edges={cookieEdges}
      center={cookieCenter}
      capabilities={[
        {
          title: 'Two layouts',
          body: 'A bar and a pop-up, with your colours and wording. More layouts can be added.',
        },
        {
          title: 'See what your page sets',
          body: 'See the cookies and trackers on your live page, including any that run before a visitor chooses.',
        },
        {
          title: 'Wait for a choice',
          body: 'Non-essential cookies wait. Saying no is as easy as saying yes, and visitors can change their mind later.',
        },
        {
          title: 'Languages and regions',
          body: 'English and Hindi on the two layouts today. More languages and location rules can be added.',
        },
        {
          title: 'Change of mind',
          body: 'Visitors can come back and change their choices at any time.',
        },
        {
          title: 'Proof',
          body: 'Who was asked, what they chose, which notice version, and when they withdrew.',
        },
      ]}
      notes={[
        {
          title: 'Notice and consent',
          body: 'The Act requires a clear notice and consent that is free, specific, informed, unconditional, and unambiguous. The cookie banner is one place that applies.',
        },
        {
          title: 'Withdrawal',
          body: 'Withdrawing consent must be as easy as giving it, so visitors can change their choices at any time.',
        },
      ]}
      faqs={FAQS}
      nextHref="/policy-notice"
      nextLabel="policy and notice management"
    >
      <IllustrationSection
        eyebrow="What visitors see"
        title="The same banner on desktop and mobile web"
        lead="A bar on wide screens and a sheet on phones. Both save the same record, and both put No next to Yes."
      >
        <ConsentBannerMockup />
      </IllustrationSection>
    </ProductLanding>
  )
}
