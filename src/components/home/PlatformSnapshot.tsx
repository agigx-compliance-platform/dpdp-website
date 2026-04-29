'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { platformSnapshots } from '@/lib/agigx-ui-screenshots'

export function PlatformSnapshot() {
  return (
    <SectionWrapper id="platform">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          See the Platform <span className="gradient-text">in Action</span>
        </motion.h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
          Real screens from the AGIGx consent-management experience (CMP home, analytics, health, and
          policy tools).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {platformSnapshots.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card overflow-hidden p-0"
          >
            <div className="relative aspect-[16/10] w-full border-b border-border/40">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
