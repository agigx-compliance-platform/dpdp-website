import Link from 'next/link'

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/contact' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Consent Platform', href: '/products#consent-platform' },
      { label: 'Compliance Scanner', href: '/products#trustscope' },
      { label: 'DSAR Platform', href: '/products#dsar-platform' },
      { label: 'AI Assistant', href: '/products#ai-assistant' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'All Services', href: '/services' },
      { label: 'Solutions by Industry', href: '/solutions' },
      { label: 'Partnership', href: '/partnership' },
      { label: 'Start Assessment', href: '/questionnaire' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
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
            Copyright © 2026 dpdpconsultancy, india. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
