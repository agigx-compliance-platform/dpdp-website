'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Fingerprint, ScanSearch, FileKey, ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { productPreviewThumbs } from '@/lib/agigx-ui-screenshots'

const products = [
  {
    icon: Fingerprint,
    name: 'Consent Platform',
    tagline: 'Lawful data collection, automated.',
    features: [
      'Geo-aware consent banners',
      'Pre-consent cookie blocking',
      'Preference center with audit trail',
    ],
  },
  {
    icon: ScanSearch,
    name: 'Compliance Scanner',
    tagline: 'Find violations before regulators do.',
    features: [
      'Automated website crawling',
      'Cookie & tracker detection',
      'Privacy policy analysis',
    ],
  },
  {
    icon: FileKey,
    name: 'DSAR Platform',
    tagline: 'Subject requests, handled end-to-end.',
    features: [
      'Intake portal for data subjects',
      'Identity verification workflows',
      'Automated data discovery & deletion',
    ],
  },
]

export function ProductsOverview() {
  return (
    <SectionWrapper id="products-preview">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          AI-Powered Compliance <span className="gradient-text">Products</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {products.map((prod, i) => (
          <motion.div
            key={prod.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="glass-card p-0 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full shrink-0 border-b border-border/40">
              <Image
                src={productPreviewThumbs[i]?.src ?? productPreviewThumbs[0].src}
                alt={productPreviewThumbs[i]?.alt ?? ''}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
            <prod.icon className="w-9 h-9 text-primary mb-4" />
            <h3 className="text-lg font-semibold">{prod.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{prod.tagline}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {prod.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/products">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    </SectionWrapper>
  )
}
