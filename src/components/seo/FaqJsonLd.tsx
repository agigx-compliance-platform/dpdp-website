/**
 * FAQ JSON-LD structured data.
 * Enables Google FAQ rich results with expandable Q&A directly in SERPs.
 */

type FaqItem = {
  question: string
  answer: string
}

type FaqJsonLdProps = {
  faqs: FaqItem[]
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  )
}
