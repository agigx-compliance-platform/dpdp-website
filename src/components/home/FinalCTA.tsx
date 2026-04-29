'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function FinalCTA() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <section
      id="final-cta"
      className="relative py-14 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-[hsl(var(--gradient-end)/0.05)]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Don&apos;t Wait for the First <span className="gradient-text">Penalty</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Get ahead of DPDP enforcement with a compliance engine built for your
            organization.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link href="/questionnaire">
            <Button variant="primary" size="lg">
              Start Assessment
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Schedule a Call
            </Button>
          </Link>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-6 sm:p-8 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-semibold mb-6 text-center">
            Get in Touch
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Work email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="input-field mb-4 w-full"
          />
          <textarea
            name="message"
            placeholder="Tell us about your compliance needs…"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="input-field mb-6 w-full resize-none"
          />
          <div className="text-center">
            <Button type="submit" variant="primary" size="lg">
              Send Message
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
