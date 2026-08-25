'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import type { DpdpFaqItem } from '@/lib/dpdp-faqs'

type FaqSectionProps = {
  title?: string
  faqs: DpdpFaqItem[]
  id?: string
}

export function FaqSection({
  title = 'Frequently Asked Questions',
  faqs,
  id = 'faq',
}: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <SectionWrapper id={id} className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">
          <span className="gradient-text">{title}</span>
        </h2>

        <div className="mx-auto max-w-2xl">
          <ul className="m-0 list-none p-0">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <li
                  key={faq.question}
                  className="w-full list-none border-b border-border last:border-none dark:border-neutral-700"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="group flex w-full cursor-pointer select-none items-center justify-between py-5 font-semibold text-foreground"
                  >
                    <span className="flex flex-1 items-center gap-4 text-left">
                      <span className="flex h-5 w-5 items-center justify-center text-muted-foreground opacity-70">
                        <BookOpen className="h-5 w-5" />
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
                        'h-5 w-5 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]',
                        isOpen
                          ? 'rotate-[225deg] opacity-100'
                          : 'opacity-30 group-hover:opacity-100',
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
                      'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        className={cn(
                          'flex gap-4 pb-5 transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]',
                          isOpen
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-2 opacity-0',
                        )}
                      >
                        <span className="w-5 shrink-0" />
                        <p className="m-0 flex-1 leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
