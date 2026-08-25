import { SITE_URL } from '@/lib/site-url'

const BASE_URL = SITE_URL

/**
 * Organization + WebSite + ProfessionalService structured data.
 * Renders as a JSON-LD <script> in the <head> of every page.
 */
export function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DPDP Consultancy',
    url: BASE_URL,
    logo: `${BASE_URL}/images/brand/social-icon-1024.png`,
    description:
      'Transform DPDP and AI governance into a living, enforceable compliance engine. Automated assessments, consent management, and AI-powered governance for Indian enterprises.',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'operations@dpdpconsultancy.in',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61576',
      'https://www.instagram.com/dpdpoperations',
      'https://x.com/DPDPConsultancy',
      'https://www.linkedin.com/company/dpdp-consultancy-pvt-ltd',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DPDP Consultancy',
    url: BASE_URL,
    description:
      'India\'s DPDP compliance intelligence platform — automated privacy assessments, consent management, DSAR automation, and AI governance.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/privacy-pitstop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'DPDP Consultancy',
    url: BASE_URL,
    image: `${BASE_URL}/images/brand/social-icon-1024.png`,
    description:
      'Expert DPDP compliance services: privacy advisory, consent management platform, DSAR automation, infrastructure scanning, AI governance, and managed compliance services for Indian enterprises.',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: [
      'DPDP Compliance Advisory',
      'Consent Management',
      'DSAR Management',
      'Privacy Impact Assessment',
      'AI Governance',
      'Data Protection',
      'Compliance Scanning',
      'Privacy Operations',
    ],
    knowsAbout: [
      'Digital Personal Data Protection Act 2023',
      'DPDP Act',
      'DPDP Compliance',
      'Data Privacy India',
      'Consent Management',
      'DSAR',
      'AI Governance',
      'Data Protection Officer',
    ],
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
    </>
  )
}
