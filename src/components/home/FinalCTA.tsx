'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { Button } from '@/components/ui/Button'
import { submitEnquiry } from '@/lib/api'


export function FinalCTA() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        company: form.company,
        role: '',
        subject: 'Get in Touch',
        message: form.message,
      })
      setSubmitted(true)
    } catch {
      setError('Message was not sent. Try again or email operations@dpdpconsultancy.in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="final-cta"
      className="relative py-14 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Not sure where to start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Start with a free website scan or a 10-question assessment. Making the
            changes usually takes months, so it helps to start early.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Button variant="primary" size="lg" onClick={() => useQuestionnaireStore.getState().openModal()}>
            Check if you&apos;re ready
          </Button>
          <Link href="/contact?intent=demo">
            <Button variant="outline" size="lg">
              Book a demo
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8"
        >
          {submitted ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Message Sent Successfully
              </h3>
              <p className="text-muted-foreground">
                Thank you. We aim to reply within one working day, usually to arrange a short call about what you need.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                className="input-field mb-4 w-full resize-none"
              />
              <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
                We use these details only to reply to your enquiry. See our{' '}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
                  Privacy Policy
                </Link>
                . We aim to reply within one working day.
              </p>
              <div className="text-center">
                {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
