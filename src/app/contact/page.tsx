"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { submitEnquiry } from "@/lib/api";
import { FaqSection } from "@/components/seo/FaqSection";
import { CONTACT_FAQS } from "@/lib/dpdp-faqs";

const ROLES = [
  "DPO / Privacy Officer",
  "CTO / CIO",
  "Legal / Compliance",
  "CISO / Security",
  "CEO / Founder",
  "Consultant / Advisor",
  "Other",
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
            <span className="gradient-text">Contact DPDP Consultancy</span>
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

      <FaqSection faqs={CONTACT_FAQS} />
    </div>
  );
}