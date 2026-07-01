import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg text-center">
        <p className="text-sm font-mono tracking-widest text-primary uppercase mb-3">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for does not exist or may have moved. Use
          the links below to continue exploring Consent Cockpit.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/services" className="hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/solutions" className="hover:text-primary transition-colors">
            Solutions
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
        </div>
      </div>
    </div>
  )
}
