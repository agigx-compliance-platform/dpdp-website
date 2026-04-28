'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, PieChart, Search, FileText } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const screenshots = [
  { title: 'Compliance Dashboard', icon: LayoutDashboard },
  { title: 'Consent Analytics', icon: PieChart },
  { title: 'Scan Results', icon: Search },
  { title: 'Policy Manager', icon: FileText },
]

function MockDashboard({ icon: Icon, title }: { icon: typeof LayoutDashboard; title: string }) {
  return (
    <div className="aspect-[4/3] rounded-lg gradient-bg border border-border/50 p-4 flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        </div>
        <div className="h-2 w-24 rounded bg-border/40" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-2 opacity-40">
        <Icon className="w-10 h-10" />
        <div className="space-y-1.5 w-full max-w-[80%]">
          <div className="h-2 rounded bg-border/60 w-full" />
          <div className="h-2 rounded bg-border/40 w-3/4" />
          <div className="h-2 rounded bg-border/30 w-1/2" />
        </div>
        <div className="flex gap-2 mt-2 w-full max-w-[80%]">
          <div className="h-8 rounded bg-primary/10 flex-1" />
          <div className="h-8 rounded bg-border/20 flex-1" />
          <div className="h-8 rounded bg-border/20 flex-1" />
        </div>
      </div>
    </div>
  )
}

export function PlatformSnapshot() {
  return (
    <SectionWrapper id="platform">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          See the Platform <span className="gradient-text">in Action</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {screenshots.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <MockDashboard icon={item.icon} title={item.title} />
            <p className="text-center text-sm font-medium mt-3 text-muted-foreground">
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
