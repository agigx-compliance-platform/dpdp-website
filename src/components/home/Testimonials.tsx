'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    quote:
      'Consent Cockpit transformed our compliance posture from a spreadsheet nightmare into a live, auditable system. We went from zero visibility to full control in 8 weeks.',
    author: 'Priya Sharma',
    role: 'Chief Privacy Officer',
    company: 'FinServ Global',
  },
  {
    quote:
      'The platform caught 14 cookie-consent violations on our website that our previous tool completely missed. The scanner alone paid for the engagement.',
    author: 'Rahul Mehta',
    role: 'VP of Engineering',
    company: 'RetailNxt',
  },
  {
    quote:
      "What impressed us most was how the engine adapted to our healthcare-specific data requirements. This isn\u2019t a generic tool \u2014 it actually understands our domain.",
    author: 'Dr. Ananya Rao',
    role: 'Data Protection Officer',
    company: 'HealthBridge',
  },
]

export function Testimonials() {
  const [idx, setIdx] = useState(0)

  const prev = () => setIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () => setIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  return (
    <SectionWrapper id="testimonials">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold"
        >
          What Our Clients <span className="gradient-text">Say</span>
        </motion.h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className={cn('glass-card p-8 gradient-border')}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground leading-relaxed text-lg">
                &ldquo;{testimonials[idx].quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-primary">
                  {testimonials[idx].author[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonials[idx].author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonials[idx].role}, {testimonials[idx].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prev}
            className="p-2 rounded-full glass-card hover:border-primary/30 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i === idx ? 'bg-primary' : 'bg-border'
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2 rounded-full glass-card hover:border-primary/30 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </SectionWrapper>
  )
}
