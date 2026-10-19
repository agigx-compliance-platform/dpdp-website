'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { BrandMark } from '@/components/brand/BrandMark'
import { useQuestionnaireStore } from '@/store/questionnaireStore'

const platformLinks = [
  { href: '/cookie-consent', label: 'Cookie consent', blurb: 'Two banner layouts now. More can be added.' },
  { href: '/policy-notice', label: 'Policy and notice', blurb: 'Privacy notice and cookie policy. More types can be added.' },
  { href: '/consent-management', label: 'Consent lifecycle', blurb: 'Purpose grant, withdrawal, receipt' },
  { href: '/products#dsar-platform', label: 'DSAR and rights', blurb: 'Access, correction, erasure' },
  { href: '/data-discovery', label: 'Data discovery', blurb: 'Inventory of systems and fields' },
  { href: '/data-lineage', label: 'Data lineage', blurb: 'How data moved, and what is still unknown' },
  { href: '/infra-posture', label: 'Infra posture', blurb: 'Cloud and code, seen as a privacy duty' },
  { href: '/products#processor-governance', label: 'Vendor governance', blurb: 'Registry and downstream action' },
  { href: '/products#trustscope', label: 'Scanner', blurb: 'Public-site posture' },
  { href: '/products#ai-assistant', label: 'AI assistant', blurb: 'Guidance grounded in the Act and Rules' },
]

const resourceLinks = [
  { href: '/what-is-dpdp', label: 'What is DPDP' },
  { href: '/dpdp-compliance', label: 'DPDP compliance guide' },
  { href: '/privacy-pitstop', label: 'Privacy Pitstop' },
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/partnership', label: 'Partnership' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const openModal = useQuestionnaireStore((state) => state.openModal)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'border-b bg-background/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent',
        )}
        style={scrolled ? { borderColor: 'hsl(var(--border))' } : undefined}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <BrandMark priority size="default" />

            <div className="hidden items-center gap-1 lg:flex">
              <Mega
                id="platform"
                label="Platform"
                open={openMenu === 'platform'}
                onOpen={() => setOpenMenu('platform')}
                onClose={() => setOpenMenu(null)}
              >
                <div className="grid w-[36rem] grid-cols-2 gap-1 p-3">
                  {platformLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2 hover:bg-secondary/60"
                      onClick={() => setOpenMenu(null)}
                    >
                      <p className="text-sm font-medium text-foreground">{link.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{link.blurb}</p>
                    </Link>
                  ))}
                </div>
              </Mega>
              <Link href="/solutions" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Industries
              </Link>
              <Link href="/services" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Services
              </Link>
              <Mega
                id="resources"
                label="Resources"
                open={openMenu === 'resources'}
                onOpen={() => setOpenMenu('resources')}
                onClose={() => setOpenMenu(null)}
              >
                <div className="w-56 p-2">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      onClick={() => setOpenMenu(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </Mega>
              <Mega
                id="company"
                label="Company"
                open={openMenu === 'company'}
                onOpen={() => setOpenMenu('company')}
                onClose={() => setOpenMenu(null)}
              >
                <div className="w-44 p-2">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      onClick={() => setOpenMenu(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </Mega>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={openModal} className="btn-primary text-sm">
                Start Assessment
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 flex h-full w-80 flex-col overflow-y-auto border-l border-border bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <BrandMark size="compact" />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-muted-foreground"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Platform</p>
            {platformLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm text-muted-foreground">
                {link.label}
              </Link>
            ))}
            <Link href="/solutions" onClick={() => setMobileOpen(false)} className="mt-4 px-2 py-2 text-sm">Industries</Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm">Services</Link>
            <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resources</p>
            {resourceLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm text-muted-foreground">
                {link.label}
              </Link>
            ))}
            <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Company</p>
            {companyLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm text-muted-foreground">
                {link.label}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false)
                  openModal()
                }}
                className="btn-primary text-sm"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Mega({
  id,
  label,
  open,
  onOpen,
  onClose,
  children,
}: {
  id: string
  label: string
  open: boolean
  onOpen: () => void
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`menu-${id}`}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div
          id={`menu-${id}`}
          className="absolute top-full left-0 z-50 rounded-xl border border-border bg-card shadow-[var(--shadow-md)]"
        >
          {children}
        </div>
      )}
    </div>
  )
}
