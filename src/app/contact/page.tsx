'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion'

const ROLES = [
  'DPO / Privacy Officer',
  'CTO / CIO',
  'Legal / Compliance',
  'CISO / Security',
  'CEO / Founder',
  'Consultant / Advisor',
  'Other',
]

const FAQ_ITEMS = [
  {
    question: 'When does DPDP 2023 come into effect?',
    answer:
      'The Digital Personal Data Protection Act 2023 received Presidential assent in August 2023. The implementation rules were notified in November 2025, with phased enforcement timelines for different provisions. Organizations should begin compliance preparation immediately to avoid penalties.',
  },
  {
    question: 'What are the maximum penalties under DPDP?',
    answer:
      'DPDP 2023 prescribes penalties up to ₹250 Crore for non-compliance with specific provisions. Different violations carry different penalty amounts — from ₹50 Crore for failure to implement security safeguards to ₹250 Crore for non-compliance with provisions relating to children\'s data or Data Protection Board orders.',
  },
  {
    question: 'How long does a typical DPDP compliance engagement take?',
    answer:
      'Timeline varies based on organizational complexity and current maturity. A readiness assessment typically takes 2-4 weeks. Full compliance implementation ranges from 3-9 months depending on scope, number of data systems, cross-border considerations, and whether SDF classification applies.',
  },
  {
    question: 'Do we need a Data Protection Officer?',
    answer:
      'Under DPDP 2023, DPO appointment is mandatory for Significant Data Fiduciaries (Section 10(2)(b)). Even if not classified as SDF, having a designated privacy lead is strongly recommended. AGIGx offers Virtual DPO services for organizations that need expert coverage without full-time hiring.',
  },
  {
    question: 'Can AGIGx help with both DPDP and GDPR compliance?',
    answer:
      'Yes. Our Adaptive Compliance Engine supports multi-framework compliance including DPDP, GDPR, CCPA, and LGPD. Many Indian enterprises have dual obligations under DPDP and GDPR. We provide cross-mapped controls and unified compliance dashboards.',
  },
]

interface FormState {
  name: string
  email: string
  company: string
  role: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  company?: string
  role?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    role: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!form.company.trim()) newErrors.company = 'Company is required'
    if (!form.role) newErrors.role = 'Please select a role'
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    console.log('Contact form submission:', form)
    setSubmitted(true)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper className="pt-32 md:pt-40 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Get in Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your DPDP compliance journey? Our team of experts
            is here to help you navigate the path to full compliance.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {submitted ? (
              <div className="glass-card p-8 md:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Message Sent Successfully
                </h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. Our team will review your enquiry
                  and respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    error={errors.company}
                    placeholder="Your organization"
                  />
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Role
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={cn(
                        'input-field w-full',
                        errors.role && 'border-destructive focus:ring-destructive/50'
                      )}
                    >
                      <option value="">Select your role</option>
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="mt-1.5 text-xs text-destructive">{errors.role}</p>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <Input
                    label="Subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    placeholder="How can we help?"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={cn(
                      'input-field w-full resize-none',
                      errors.message && 'border-destructive focus:ring-destructive/50'
                    )}
                    placeholder="Tell us about your compliance needs..."
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>
                  )}
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  Send Message
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <Card>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">contact@agigx.com</p>
                  <p className="text-sm text-muted-foreground">privacy@agigx.com</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">+91 80 4567 8900</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Office</h3>
                  <p className="text-sm text-muted-foreground">
                    AGIGx Technologies Pvt Ltd
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Bengaluru, Karnataka, India
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <AccordionRoot type="single" collapsible>
              {FAQ_ITEMS.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
