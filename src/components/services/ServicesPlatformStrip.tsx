"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ThemeScreenshot } from "@/components/ui/ThemeScreenshot";
import { servicesPlatformStrip } from "@/lib/agigx-ui-screenshots";

export function ServicesPlatformStrip() {
  return (
    <SectionWrapper className="py-16 md:py-20">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3"
        >
          Platform in practice
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Services backed by{" "}
          <span className="gradient-text">Consent Cockpit</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Our advisory and operations services are delivered on the same platform
          you see here — theme-matched admin console screenshots throughout.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {servicesPlatformStrip.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card overflow-hidden p-0 group hover:border-primary/40 transition-colors duration-300"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/40">
              <ThemeScreenshot
                dark={item.dark}
                light={item.light}
                alt={item.title}
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
