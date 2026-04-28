'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { LogoMarquee } from '@/components/ui/LogoMarquee'

const logos = [
  { name: 'TechCorp', placeholder: true },
  { name: 'FinServ Global', placeholder: true },
  { name: 'HealthBridge', placeholder: true },
  { name: 'EduVista', placeholder: true },
  { name: 'RetailNxt', placeholder: true },
  { name: 'CloudPeak', placeholder: true },
  { name: 'DataSync', placeholder: true },
  { name: 'SecureNet', placeholder: true },
]

export function CustomerLogos() {
  return (
    <SectionWrapper id="logos" className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
          Trusted By Leading Enterprises
        </p>
      </motion.div>
      <LogoMarquee logos={logos} />
    </SectionWrapper>
  )
}
