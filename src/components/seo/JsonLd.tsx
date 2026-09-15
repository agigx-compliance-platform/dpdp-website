import { SITE_URL } from '@/lib/site-url'

const BASE_URL = SITE_URL
const ORG_ID = `${BASE_URL}/#organization`

/**
 * Organization + WebSite + ProfessionalService structured data.
 * Renders as a JSON-LD <script> in the <head> of every page.
 */
export function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'DPDP Consultancy',
    alternateName: [
      'dpdpconsultancy',
      'dpdpconsultancy.in',
      'DPDP Consultancy Pvt Ltd',
    ],
    legalName: 'DPDP Consultancy Pvt Ltd',
    url: BASE_URL,
    logo: `${BASE_URL}/images/brand/social-icon-1024.png`,
    description:
      'DPDP Consultancy (dpdpconsultancy.in) is India\'s DPDP compliance intelligence platform — automated assessments, consent management, DSAR automation, and AI-powered governance for Indian enterprises.',
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
      'https://www.instagram.com/dpdpoperations',
      'https://x.com/DPDPConsultancy',
      'https://www.linkedin.com/company/dpdp-consultancy-pvt-ltd',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'DPDP Consultancy',
    alternateName: ['dpdpconsultancy', 'dpdpconsultancy.in'],
    url: BASE_URL,
    publisher: { '@id': ORG_ID },
    description:
      'Official website of DPDP Consultancy (dpdpconsultancy.in) — DPDP Act 2023 compliance platform for Indian enterprises.',
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
    '@id': `${BASE_URL}/#service`,
    name: 'DPDP Consultancy',
    alternateName: 'dpdpconsultancy',
    url: BASE_URL,
    image: `${BASE_URL}/images/brand/social-icon-1024.png`,
    parentOrganization: { '@id': ORG_ID },
    description:
      'DPDP Consultancy provides expert DPDP compliance services: privacy advisory, consent management, DSAR automation, infrastructure scanning, AI governance, and managed compliance for Indian enterprises.',
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
      'DPDP Consultancy',
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
