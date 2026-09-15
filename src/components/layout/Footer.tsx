import Link from 'next/link'

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About DPDP Consultancy', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partnership', href: '/partnership' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Privacy Pitstop', href: '/privacy-pitstop' },
      { label: 'Consent Platform', href: '/products#consent-platform' },
      { label: 'Compliance Scanner', href: '/products#trustscope' },
      { label: 'DSAR Platform', href: '/products#dsar-platform' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'All Services', href: '/services' },
      { label: 'Solutions by Industry', href: '/solutions' },
      { label: 'What is DPDP?', href: '/what-is-dpdp' },
      { label: 'Start Assessment', href: '/questionnaire' },
    ],
  },
  {
    title: 'Legal',
    links: [{ label: 'Terms', href: '/terms' }],
    sdkPolicyLinks: true,
  },
]

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 max-w-2xl">
          <Link href="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            DPDP Consultancy
          </Link>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            DPDP Consultancy (dpdpconsultancy.in) helps Indian enterprises turn
            DPDP Act 2023 obligations into enforceable privacy, consent, and AI
            governance controls.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {'sdkPolicyLinks' in section && section.sdkPolicyLinks ? (
                  <li>
                    <div
                      id="agigx-policy-links"
                      className="flex flex-col gap-2.5 text-sm text-muted-foreground [&_a]:hover:text-foreground [&_a]:transition-colors"
                    />
                  </li>
                ) : null}
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Copyright © 2026 DPDP Consultancy (dpdpconsultancy.in), India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
