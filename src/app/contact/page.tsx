"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { submitEnquiry } from "@/lib/api";

const ROLES = [
  "DPO / Privacy Officer",
  "CTO / CIO",
  "Legal / Compliance",
  "CISO / Security",
  "CEO / Founder",
  "Consultant / Advisor",
  "Other",
];

const FAQ_ITEMS = [
  {
    question: "When does DPDP 2023 come into effect?",
    answer:
      "The Digital Personal Data Protection Act 2023 received Presidential assent in August 2023. The implementation rules were notified in November 2025, with phased enforcement timelines for different provisions. Organizations should begin compliance preparation immediately to avoid penalties.",
  },
  {
    question: "What are the maximum penalties under DPDP?",
    answer:
      "DPDP 2023 prescribes penalties up to ₹250 Crore for non-compliance with specific provisions. Different violations carry different penalty amounts, from ₹50 Crore for failure to implement security safeguards to ₹250 Crore for non-compliance with provisions relating to children's data or Data Protection Board orders.",
  },
  {
    question: "How long does a typical DPDP compliance engagement take?",
    answer:
      "Timeline varies based on organizational complexity and current maturity. A readiness assessment typically takes 2-4 weeks. Full compliance implementation ranges from 3-9 months depending on scope, number of data systems, cross-border considerations, and whether SDF classification applies.",
  },
  {
    question: "Do we need a Data Protection Officer?",
    answer:
      "Under DPDP 2023, DPO appointment is mandatory for Significant Data Fiduciaries (Section 10(2)(b)). Even if not classified as SDF, having a designated privacy lead is strongly recommended. Consent Cockpit offers Virtual DPO services for organizations that need expert coverage without full-time hiring.",
  },
  {
    question: 'Is Consent Cockpit focused on DPDP?',
    answer:
      'Yes. Our platform and methodologies are built around the Digital Personal Data Protection Act 2023 and the 2025 Rules, from consent capture and privacy notices to Data Principal rights, grievance handling, and regulator-ready evidence for Indian enterprises.',
  },
];

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to track the currently open FAQ item
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.role) newErrors.role = "Please select a role";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        company: form.company,
        role: form.role,
        subject: form.subject,
        message: form.message,
      });
      setSubmitted(true);
    } catch {
      setErrors({ message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function toggleFaq(idx: number) {
    setOpenFaq(openFaq === idx ? null : idx);
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
            Ready to start your DPDP compliance journey? Our team of experts is
            here to help you navigate the path to full compliance.
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
                        "input-field w-full",
                        errors.role &&
                          "border-destructive focus:ring-destructive/50",
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
                      <p className="mt-1.5 text-xs text-destructive">
                        {errors.role}
                      </p>
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
                      "input-field w-full resize-none",
                      errors.message &&
                        "border-destructive focus:ring-destructive/50",
                    )}
                    placeholder="Tell us about your compliance needs..."
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
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
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:operations@dpdpconsultancy.in"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    operations@dpdpconsultancy.in
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">DPDP Consultancy</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chennai, Tamil Nadu, India
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

          <div className="max-w-2xl mx-auto">
            <ul className="m-0 list-none p-0">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <li
                    key={idx}
                    className="w-full border-b border-border dark:border-neutral-700 list-none last:border-none"
                    data-open={isOpen ? "" : undefined}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex select-none justify-between items-center font-semibold text-foreground cursor-pointer py-5 group"
                    >
                      <span className="flex items-center gap-4 flex-1 text-left">
                        <span className="flex items-center justify-center w-5 h-5 text-muted-foreground opacity-70">
                          <BookOpen className="w-5 h-5" />
                        </span>
                        <span className="text-lg">{faq.question}</span>
                      </span>
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={cn(
                          "w-5 h-5 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                          isOpen
                            ? "rotate-[225deg] opacity-100"
                            : "opacity-30 group-hover:opacity-100",
                        )}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>

                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden min-h-0">
                        <div
                          className={cn(
                            "pb-5 transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] flex gap-4",
                            isOpen
                              ? "translate-y-0 opacity-100"
                              : "translate-y-2 opacity-0",
                          )}
                        >
                          <span className="w-5 shrink-0" />
                          <p className="text-muted-foreground leading-relaxed m-0 flex-1">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}